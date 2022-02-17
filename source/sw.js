//缓存库名称
const CACHE_NAME = 'kmarCache'
const VERSION_CACHE_NAME = 'kmarCacheTime'
//缓存时间
const MAX_BLOG_CACHE_TIME = 60 * 60 * 8
const MAX_RESOURCE_CACHE_TIME = 60 * 60 * 24 * 3
const MAX_CDN_CACHE_TIME = 60 * 60 * 24 * 7
//当前时间
const NOW_TIME = new Date().getTime() / 1000;

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

self.addEventListener('install', function () {
    // noinspection JSIgnoredPromiseFromCall
    self.skipWaiting()
});

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
const getMaxCacheTime = function (url) {
    if (url.match(updateCache)) return MAX_BLOG_CACHE_TIME
    if (url.match(cdnCache)) return MAX_CDN_CACHE_TIME
    if (url.match(foreverCache)) return -1
    if (url.match(blogResourceCache)) return MAX_RESOURCE_CACHE_TIME
    return 0
}

self.addEventListener('fetch', async event => {
    const request = event.request
    event.respondWith(caches.match(request).then(async function (response) {
            let remove = false
            const maxTime = getMaxCacheTime(request.url)
            if (response) {
                if (maxTime === -1) return response
                const time = await db.read(request.url)
                if (time) {
                    const difTime = NOW_TIME - time
                    if (difTime < maxTime) return response
                    //console.log('一个缓存超时：url=' + request.url + ', time=' + difTime)
                }
                remove = true
            }
            return fetch(request).then(function (response) {
                if (maxTime !== 0) {
                    if (maxTime !== -1) db.write(request.url, NOW_TIME)
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then(function (cache) {
                        if (remove) cache.delete(request)
                        cache.put(request, clone).catch(function (err) {
                            console.error(err)
                            console.error(request)
                        })
                    })
                }
                return response
            }).catch(function () {
                console.error('不可达的链接：' + request.url)
            })
        })
    )
})