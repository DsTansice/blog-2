//缓存库名称
const CACHE_NAME = 'kmarCache'
const preCacheList = []
const VERSION_CACHE_NAME = 'kmarCacheTime'
//缓存时间
const MAX_BLOG_CACHE_TIME = 60 * 60 * 8
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

self.addEventListener('install', async function (installEvent) {
    await self.skipWaiting()
    await installEvent.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(CACHE_NAME);
        })
    )
});

const foreverCache = /(^(https:\/\/(cdn1\.tianli0\.top)|(unpkg\.zhimg\.com)|((fastly|cdn)\.jsdelivr\.net)).*@[0-9].*)|((jinrishici\.js|\.cur)$)/g
const updateCache = /(^(http:\/\/|https:\/\/kmar\.top).*\.(css|js|woff2|woff|ttf|json)$)|(.*\/posts\/.*(\/$))|(.*(kmar\.top\/)$)/g
//const cdnCache = /(^(https:\/\/(cdn|fastly)\.jsdelivr\.net))|(^(https:\/\/cdn1\.tianli0\.top).*\.(css|js|json)$)|(^(https:\/\/unpkg\.zhimg\.com))/g
const cdnCache = /(^(https:\/\/(cdn|fastly)\.jsdelivr\.net))|(^(https:\/\/unpkg\.zhimg\.com))/g

const getMaxCacheTime = function (url) {
    if (url.match(updateCache)) return MAX_BLOG_CACHE_TIME
    if (url.match(cdnCache)) return MAX_CDN_CACHE_TIME
    if (url.match(foreverCache)) return -1
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
                        cache.put(request, clone)
                    })
                }
                return response
            }).catch(function () {
                console.error('不可达的链接：' + request.url)
            })
        })
    )
})