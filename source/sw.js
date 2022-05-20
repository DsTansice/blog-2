//缓存库名称
const CACHE_NAME = 'kmarCache'

function time() {
    return new Date().getTime()
}

const dbID = {
    write: (id) => dbHelper.write(new Request('http://id.record'), id),
    read: () => dbHelper.read(new Request('https://id.record'))
}

self.addEventListener('install', () => self.skipWaiting())

/**
 * 缓存列表
 * @param url 匹配规则
 * @param clean 清理全站时是否删除其缓存
 */
const cacheList = {
    font: {
        url: /(jet|HarmonyOS)\.(woff2|woff|ttf)$/g, clean: false
    }, static: {
        url: /(^(https:\/\/npm\.elemecdn\.com).*@\d.*)|((jinrishici\.js|\.cur)$)/g, clean: true
    }, update: {
        url: /(^(https:\/\/kmar\.top).*(\/)$)/g, clean: true
    }, resources: {
        url: /(^(https:\/\/(image\.kmar\.top|kmar\.top))).*\.(css|js|woff2|woff|ttf|json|svg)$/g, clean: true
    }, stand: {
        url: /^https:\/\/image\.kmar\.top\/indexBg/g, clean: true
    }
}

/**
 * 链接替换列表
 * @param source 源链接
 * @param dist 目标链接
 */
const replaceList = {
    gh: {
        source: ['//cdn.jsdelivr.net/gh'], dist: '//cdn1.tianli0.top/gh'
    }, npm: {
        source: ['//cdn.jsdelivr.net/npm', '//unpkg.zhimg.com'], dist: '//npm.elemecdn.com'
    }, emoji: {
        source: ['/gh/EmptyDreams/resources/icon'], dist: '/gh/EmptyDreams/twikoo-emoji'
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
    let url = request.url;
    let flag = false
    for (let key in replaceList) {
        const value = replaceList[key]
        for (let source of value.source) {
            if (url.match(source)) {
                url = url.replace(source, value.dist)
                flag = true
            }
        }
    }
    return flag ? new Request(url) : null
}

async function fetchEvent(request, response) {
    if (response) return response
    return fetch(request).then(response => {
        if (response.ok || response.status === 0) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return response
    })
}

self.addEventListener('fetch', async event => {
    const replace = replaceRequest(event.request)
    const request = replace === null ? event.request : replace
    const cacheDist = findCache(request.url)
    if (cacheDist !== null) {
        event.respondWith(caches.match(request).then(response => fetchEvent(request, response)))
    } else if (replace !== null) {
        event.respondWith(fetch(request))
    }
})

self.addEventListener('message', function (event) {
    switch (event.data) {
        case 'refresh':
            deleteAllCache().then(event.source.postMessage('refresh'))
            break
        case 'update':
            updateJson('update').then(event.source.postMessage('update'))
            break
    }
})

/**
 * 缓存更新匹配
 * @param value 格式[flag:value]，其中flag可为"all"(全部)、"reg"(正则)、"str"(字符串)中任意一种，如果flag为all可以不写冒号
 * @constructor
 */
function VersionListElement(value) {
    this.all = false
    this.reg = null
    this.str = null
    this.matchUrl = url => {
        if (this.all) return findCache(url).clean
        if (this.reg) return url.match(this.reg)
        return url.match(this.str)
    }
    const flag = value.substring(0, 3)
    switch (flag) {
        case 'all':
            this.all = true
            break
        case 'str':
            this.str = value.substring(4)
            break
        case 'reg':
            this.reg = new RegExp(value.substring(4))
            break
    }
}

/**
 * 根据JSON删除缓存
 * @param path 缓存地址
 * @param top 是否是顶层调用，用于标记递归，保持默认即可
 * @returns {Promise<Boolean>} 返回值中的类型对外界无意义，内部用于标识是否继续递归
 */
function updateJson(path, top = true) {
    //匹配规则列表（VersionListElement）
    const list = []
    //根据list删除缓存
    const deleteCache = () => {
        caches.open(CACHE_NAME).then(cache => {
            cache.keys().then(keys => {
                for (let key of keys) {
                    let result = false
                    for (let it of list) {
                        if (it.matchUrl(key.url)) {
                            result = true
                            break
                        }
                    }
                    if (result) {
                        // noinspection JSIgnoredPromiseFromCall
                        cache.delete(key)
                    }
                }
            })
        })
    }
    //解析JSON数据，返回值对外无意义，对内用于标识是否继续执行
    const parseJsonV1 = async json => {
        const oldId = await dbID.read()
        //如果oldId存在且与preId不相等说明出现跨版本的情况
        if (oldId && json['preId'] !== oldId) {
            //如果pre为stop说明引用链过长，直接刷新全站缓存
            if (json['pre'] === 'stop') {
                // noinspection ES6MissingAwait
                deleteAllCache()
                return false
            } else {
                //否则继续查找上一个版本的更新内容
                const result = await updateJson(json['pre'], false)
                if (!result) return false
            }
        }
        //如果oldId不存在或oldId与id相等，说明不需要更新缓存，直接退出
        if (!oldId || oldId === json['id']) return false
        const jsonList = json['list']
        for (let i = 0; i < jsonList.length; i++) {
            list.push(new VersionListElement(jsonList[i]))
            //如果出现all就没有必要继续计算了
            if (list[i].all) return false
        }
        return true
    }
    //解析JSON内容
    const parseJson = async (resolve, reject, json) => {
        switch (json['version']) {
            case 1:
                const result = await parseJsonV1(json)
                if (top) {  //如果是顶层调用就更新oldId
                    // noinspection ES6MissingAwait
                    dbID.write(json['id'])
                }
                resolve(result)
                break
            default:
                console.error(`不支持的更新JSON版本：${json['version']}`)
                reject(false)
                break
        }
    }
    const url = `/update/${path}.json`
    return new Promise((resolve, reject) => {
        fetch(new Request(url)).then(response => {
            response.text().then(async text => {
                const json = JSON.parse(text)
                await parseJson(resolve, reject, json)
                deleteCache()
            })
        })
    })
}

/** 删除所有缓存 */
function deleteAllCache() {
    return caches.open(CACHE_NAME).then(function (cache) {
        cache.keys().then(function (keys) {
            for (let key of keys) {
                const value = findCache(key.url)
                if (value == null || value.clean) {
                    // noinspection JSIgnoredPromiseFromCall
                    cache.delete(key)
                }
            }
        })
    })
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
    }, write: (key, value) => {
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(key, new Response(value)).then(() => resolve())
            }).catch(() => {
                reject()
            })
        })
    }, delete: (key) => {
        caches.match(key).then(response => {
            if (response) caches.open(CACHE_NAME).then(cache => cache.delete(key))
        })
    }
}