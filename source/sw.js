//缓存库名称
const CACHE_NAME = 'kmarCache'
const VERSION_CACHE_NAME = 'kmarCacheTime'
//缓存时间
const MAX_BLOG_CACHE_TIME = 60 * 60 * 8
const MAX_RESOURCE_CACHE_TIME = 60 * 60 * 24 * 3
const MAX_CDN_CACHE_TIME = 60 * 60 * 24 * 7
//缓存离线超时时间
const MAX_ACCESS_CACHE_TIME = 60 * 60 * 24 * 10
//当前时间
const NOW_TIME = new Date().getTime();

const dbHelper = {
    read: (key) => {
        return new Promise((resolve) => {
            caches.match(key).then(function (res) {
                if (!res) resolve(null)
                res.text().then(text => resolve(text))
            }).catch(() => {
                resolve(null)
            })
        })
    },
    write: (key, value) => {
        return new Promise((resolve, reject) => {
            caches.open(VERSION_CACHE_NAME).then(function (cache) {
                // noinspection JSIgnoredPromiseFromCall
                cache.put(key, new Response(value));
                resolve()
            }).catch(() => {
                reject()
            })
        })
    },
    delete: (key) => {
        caches.match(key).then(response => {
            if (response) caches.open(VERSION_CACHE_NAME).then(cache => cache.delete(key))
        })
    }
}

const dbTime = {
    read: (key) => dbHelper.read(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)),
    write: (key, value) => dbHelper.write(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), value),
    delete: (key) => dbHelper.delete(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`))
}

const dbAccess = {
    update: (key) => dbHelper.write(new Request(`https://ACCESS-CACHE/${encodeURIComponent(key)}`), NOW_TIME),
    check: async (key) => {
        const realKey = new Request(`https://ACCESS-CACHE/${encodeURIComponent(key)}`)
        const value = await dbHelper.read(realKey)
        if (value) {
            dbHelper.delete(realKey)
            return NOW_TIME - value < MAX_ACCESS_CACHE_TIME
        } else return false
    }
}

self.addEventListener('install', () => self.skipWaiting())

//永久缓存
const foreverCache = /(^(https:\/\/npm\.elemecdn\.com).*@[0-9].*)|((jinrishici\.js|\.cur)$)/g
//博文缓存
const updateCache = /(^(https:\/\/(kmar\.top|kmar-source\.netlify\.app)).*(\/)$)/g
//博客资源缓存
const blogResourceCache = /(^(https:\/\/(image\.kmar\.top|kmar\.top|kmar-source\.netlify\.app))).*\.(css|js|woff2|woff|ttf|json)$/g
//CDN缓存
const cdnCache = /^none:/g

/**
 * 根据url判断缓存最多存储多长时间
 * @return
 *     -1  - 永久缓存<br/>
 *     0   - 不缓存<br/>
 *     n   - 缓存n毫秒<br/>
 */
function getMaxCacheTime(url) {
    if (url.match(foreverCache)) return -1
    if (url.match(cdnCache)) return MAX_CDN_CACHE_TIME
    if (url.match(blogResourceCache)) return MAX_RESOURCE_CACHE_TIME
    if (url.match(updateCache)) return MAX_BLOG_CACHE_TIME
    return 0
}

const cdnList = {
    gh: {
        source: ['https://cdn.jsdelivr.net/gh'],
        dist: 'https://cdn1.tianli0.top/gh'
    },
    npm: {
        source: [
            'https://cdn.jsdelivr.net/npm',
            'https://unpkg.zhimg.com'
        ],
        dist: 'https://npm.elemecdn.com'
    }
}

function replaceRequest(request) {
    for (let cdn of cdnList.npm.source) {
        if (request.url.match(cdn)) {
            return new Request(request.url.replace(cdn, cdnList.npm.dist));
        }
    }
    for (let cdn of cdnList.gh.source) {
        if (request.url.match(cdn)) return new Request(request.url.replace(cdn, cdnList.gh.dist));
    }
    return request;
}

self.addEventListener('fetch', async event => {
    const request = replaceRequest(event.request)
    event.respondWith(caches.match(request).then(async function (response) {
            let remove = false
            const maxTime = getMaxCacheTime(request.url)
            if (maxTime !== 0) {
                // noinspection ES6MissingAwait
                dbAccess.update(request.url)
            }
            if (response) {
                if (maxTime === -1) return response
                const time = await dbTime.read(request.url)
                if (time) {
                    const difTime = NOW_TIME - time
                    if (difTime < maxTime) return response
                    //console.log('一个缓存超时：url=' + request.url + ', time=' + difTime)
                }
                remove = true
            }
            return fetch(request).then(response => {
                if (maxTime !== 0) {
                    if (maxTime !== -1) dbTime.write(request.url, NOW_TIME)
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then(function (cache) {
                        if (remove) cache.delete(request)
                        cache.put(request, clone)
                    })
                }
                return response
            }).catch(() => {
                if (request.url.match(/.*hm.baidu.com/g)) console.log("百度统计被屏蔽")
                else console.error('不可达的链接：' + request.url)
                return response
            })
        })
    )
})

self.addEventListener('message', function (event) {
    if (event.data === 'refresh') {
        caches.open(CACHE_NAME).then(function (cache) {
            cache.keys().then(function (keys) {
                for (let key of keys) {
                    if (key.url.match(updateCache) || !(key.url.match(foreverCache) ||
                            key.url.match(blogResourceCache) || key.url.match(cdnCache)) ||
                        !dbAccess.check(key.url)) {
                        // noinspection JSIgnoredPromiseFromCall
                        cache.delete(key)
                        dbTime.delete(key)
                    }
                }
                event.source.postMessage('success')
            })
        })
    }
})