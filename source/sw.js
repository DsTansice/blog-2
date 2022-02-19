//缓存库名称
const CACHE_NAME = 'kmarCache'
const VERSION_CACHE_NAME = 'kmarCacheTime'
//缓存时间
const MAX_BLOG_CACHE_TIME = 60 * 60 * 8
const MAX_RESOURCE_CACHE_TIME = 60 * 60 * 24 * 3
const MAX_CDN_CACHE_TIME = 60 * 60 * 24 * 7
//当前时间
const NOW_TIME = new Date().getTime() / 1000;

//预缓存
const cache403 = 'https://errorpage.b0.upaiyun.com/km-blog-image-403'

//CDN列表
const cdnList = [
    'https://npm.elemecdn.com',
    'https://cdn1.tianli0.top/npm',
    'https://code.bdstatic.com/npm',
    'https://fastly.jsdelivr.net/npm',
    'https://cdn.jsdelivr.net/npm',
    'https://unpkg.zhimg.com'
]

let distCdn = 'https://npm.elemecdn.com'

const db = {
    read: (key) => {
        return new Promise((resolve) => {
            caches.match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`))
                .then(function (res) {
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
                cache.put(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), new Response(value));
                resolve()
            }).catch(() => {
                reject()
            })
        })
    }
}

self.addEventListener('install', (event) => {
    self.skipWaiting()
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.add(cache403)))
})

//永久缓存
const foreverCache = /(^(https:\/\/(cdn1\.tianli0\.top)|(unpkg\.zhimg\.com)|((fastly|cdn)\.jsdelivr\.net)).*@[0-9].*)|((jinrishici\.js|\.cur)$)/g
//博文缓存
const updateCache = /(^(https:\/\/(kmar\.top|emptydreams\.netlify\.app)).*(\/)$)/g
//博客资源缓存
const blogResourceCache = /(^(https:\/\/(kmar\.top|emptydreams\.netlify\.app))).*\.(css|js|woff2|woff|ttf|json)$/g
//CDN缓存
const cdnCache = /(^(https:\/\/(cdn|fastly)\.jsdelivr\.net))|(^(https:\/\/unpkg\.zhimg\.com))/g

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

function getDistCDN(url) {
    for (let value of cdnList) {
        if (value !== distCdn && url.match(value)) return url.replace(value, distCdn)
    }
    return url
}

function fetchError(url) {
    return caches.match(url).then(response => {
        if (response) return response
        return fetch(url).then(response => {
            caches.open(CACHE_NAME).then(cache => cache.put(url, response))
            return response
        })
    })
}

self.addEventListener('fetch', async event => {
    const request = event.request
    const url = getDistCDN(request.url)
    event.respondWith(caches.match(url).then(async function (response) {
            let remove = false
            const maxTime = getMaxCacheTime(url)
            if (response) {
                if (maxTime === -1) return response
                const time = await db.read(url)
                if (time) {
                    const difTime = NOW_TIME - time
                    if (difTime < maxTime) return response
                    //console.log('一个缓存超时：url=' + request.url + ', time=' + difTime)
                }
                remove = true
            }
            return fetch(url).then(response => {
                if (maxTime !== 0) {
                    if (maxTime !== -1) db.write(url, NOW_TIME)
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then(function (cache) {
                        if (remove) cache.delete(url)
                        cache.put(url, clone)
                    })
                }
                return response
            }).catch((err) => {
                if (url.match('image.kmar.top')) {
                    return fetchError(cache403)
                } else {
                    if (url.match(/.*hm.baidu.com/g)) console.log("百度统计被屏蔽")
                    else console.error('不可达的链接：' + url + ' 原因：' + err)
                }
            })
        })
    )
})

self.addEventListener('message', function (event) {
    if (event.data === 'refresh') {
        caches.open(CACHE_NAME).then(function (cache) {
            cache.keys().then(function (keys) {
                for (let key of keys) {
                    if (key.url.match(updateCache)) {
                        // noinspection JSIgnoredPromiseFromCall
                        cache.delete(key)
                    }
                }
            })
        }).then(function () {
            event.source.postMessage('success')
        })
    }
})