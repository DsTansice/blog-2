//缓存库名称
const CACHE_NAME = 'kmarCache'
const VERSION_CACHE_NAME = 'kmarCacheTime'
//缓存离线超时时间
const MAX_ACCESS_CACHE_TIME = 60 * 60 * 24 * 10

function time() {
    return new Date().getTime()
}

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

//存储缓存入库时间
const dbTime = {
    read: (key) => dbHelper.read(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)),
    write: (key, value) => dbHelper.write(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), value),
    delete: (key) => dbHelper.delete(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`))
}

//存储缓存最后一次访问的时间
const dbAccess = {
    update: (key) => dbHelper.write(new Request(`https://ACCESS-CACHE/${encodeURIComponent(key)}`), time()),
    check: async (key) => {
        const realKey = new Request(`https://ACCESS-CACHE/${encodeURIComponent(key)}`)
        const value = await dbHelper.read(realKey)
        if (value) {
            dbHelper.delete(realKey)
            return time() - value < MAX_ACCESS_CACHE_TIME
        } else return false
    }
}

self.addEventListener('install', () => self.skipWaiting())

/**
 * 缓存列表
 * @param url 匹配规则
 * @param time 缓存有效时间
 * @param clean 清理缓存时是否无视最终访问时间世界删除
 */
const cacheList = {
    static: {
        url: /(^(https:\/\/npm\.elemecdn\.com).*@[0-9].*)|((jinrishici\.js|\.cur)$)/g,
        time: Number.MAX_VALUE,
        clean: true
    },
    update: {
        url: /(^(https:\/\/kmar\.top).*(\/)$)/g,
        time: 60 * 60 * 8,
        clean: true
    },
    resources: {
        url: /(^(https:\/\/image\.kmar\.top|kmar\.top)).*\.(css|js|woff2|woff|ttf|json)$/g,
        time: 60 * 60 * 24 * 3,
        clean: true
    },
    stand: {
        url: /^https:\/\/image\.kmar\.top\/indexBg\//g,
        time: 60 * 60 * 24 * 7,
        clean: true
    }
}

/**
 * 链接替换列表
 * @param source 源链接
 * @param dist 目标链接
 */
const replaceList = {
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

//判断指定url击中了哪一种缓存，都没有击中则返回null
function findCache(url) {
    for (let key in cacheList) {
        const value = cacheList[key]
        if (url.match(value.url)) return value
    }
    return null
}

//检查连接是否需要重定向至另外的链接，如果需要则返回新的Request，否则返回null
function replaceRequest(request) {
    for (let key in replaceList) {
        const value = replaceList[key]
        for (let source of value.source) {
            if (request.url.match(source))
                return new Request(request.url.replace(source, value.dist))
        }
    }
    return null
}

async function fetchEvent(request, response, cacheDist) {
    const NOW_TIME = time()
    // noinspection ES6MissingAwait
    dbAccess.update(request.url)
    const maxTime = cacheDist.time
    let remove = false
    if (response) {
        const time = await dbTime.read(request.url)
        if (time) {
            const difTime = NOW_TIME - time
            if (difTime < maxTime) return response
        }
        remove = true
    }
    const fetchFunction = () => fetch(request).then(response => {
        dbTime.write(request.url, NOW_TIME)
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        return response
    }).catch((err) => {
        console.error('不可达的链接：' + request.url + '\n错误信息：' + err)
        return response
    })
    if (!remove) return fetchFunction()
    const timeOut = () => new Promise((resolve => setTimeout(() => {
        if (request.url.match(/\/$/g)) {
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage('location')
                })
            })
        }
        resolve(response)
    }, 300)))
    return Promise.race([timeOut(), fetchFunction()])
}

self.addEventListener('fetch', async event => {
    const replace = replaceRequest(event.request)
    const request = replace === null ? event.request : replace
    const cacheDist = findCache(request.url)
    if (cacheDist == null && replace == null) return
    event.respondWith(caches.match(request).then(
        async (response) => fetchEvent(request, response, request))
    )
})

self.addEventListener('message', function (event) {
    //刷新缓存
    if (event.data === 'refresh') {
        caches.open(CACHE_NAME).then(function (cache) {
            cache.keys().then(function (keys) {
                for (let key of keys) {
                    const value = findCache(key.url)
                    if (value == null || value.clean || !dbAccess.check(key.url)) {
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