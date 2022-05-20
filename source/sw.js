/** 缓存库名称 */
const CACHE_NAME = 'kmarCache'

self.addEventListener('install', () => self.skipWaiting())

/**
 * 缓存列表
 * @param url 匹配规则
 * @param clean 清理全站时是否删除其缓存
 */
const cacheList = {
    font: {
        url: /(jet|HarmonyOS)\.(woff2|woff|ttf)$/g,
        clean: false
    }, static: {
        url: /(^(https:\/\/npm\.elemecdn\.com).*@\d.*)|((jinrishici\.js|\.cur)$)/g,
        clean: true
    }, update: {
        url: /(^(https:\/\/kmar\.top).*((\/)|search\.xml)$)/g,
        clean: true
    }, resources: {
        url: /(^(https:\/\/(image\.kmar\.top|kmar\.top))).*\.(css|js|woff2|woff|ttf|json|svg)$/g,
        clean: true
    }, stand: {
        url: /^https:\/\/image\.kmar\.top\/indexBg/g,
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
        source: ['//cdn.jsdelivr.net/gh'],
        dist: '//cdn1.tianli0.top/gh'
    }, npm: {
        source: [
            '//cdn.jsdelivr.net/npm',
            '//unpkg.zhimg.com'
        ], dist: '//npm.elemecdn.com'
    }, emoji: {
        source: ['/gh/EmptyDreams/resources/icon'],
        dist: '/gh/EmptyDreams/twikoo-emoji'
    }
}

/** 判断指定url击中了哪一种缓存，都没有击中则返回null */
function findCache(url) {
    for (let key in cacheList) {
        const value = cacheList[key]
        if (url.match(value.url)) return value
    }
    return null
}

/**
 * 检查连接是否需要重定向至另外的链接，如果需要则返回新的Request，否则返回null<br/>
 * 该函数会顺序匹配{@link replaceList}中的所有项目，即使已经有可用的替换项<br/>
 * 故该函数允许重复替换，例如：<br/>
 * 如果第一个匹配项把链接由"http://abc.com/"改为了"https://abc.com/"<br/>
 * 此时第二个匹配项可以以此为基础继续进行修改，替换为"https://abc.net/"<br/>
 * @return {Request|null}
 */
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

/**
 * 是否跳过缓存
 * @return boolean
 */
function skipCache(request) {
    return request.url.match(/update\/.*\.json$/g)
}

self.addEventListener('fetch', async event => {
    const replace = replaceRequest(event.request)
    const request = replace === null ? event.request : replace
    if (!skipCache(request) && findCache(request.url) !== null) {
        event.respondWith(caches.match(request).then(response => {
            //如果缓存存在则直接返回缓存内容
            if (response) return response
            return fetch(request).then(response => {
                //检查获取到的状态码
                if ((response.status >= 200 && response.status < 400) || response.status === 0) {
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
                }
                return response
            })
        }))
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
            updateJson('update').then(result => {
                if (result['update']) event.source.postMessage('update')
            })
            break
    }
})

/**
 * 缓存更新匹配
 * @param value 格式[flag:value]
 * @constructor
 */
function VersionListElement(value) {
    this.all = false
    switch (value.substring(0, 3)) {
        case 'all':
            this.all = true
            this.matchUrl = url => findCache(url).clean
            break
        case 'str':
            this.matchUrl = url => url.match(value.substring(4))
            break
        case 'reg':
            this.matchUrl = url => url.match(RegExp(value.substring(4)))
            break
        case 'pot':
            this.matchUrl = url => url.match(`posts/${value.substring(4)}/`)
            break
        case 'htm':
            this.matchUrl = url => url.match(cacheList.update.url)
            break
        default: console.error(`不支持的表达式：${value}`)
    }
}

/**
 * 根据JSON删除缓存
 * @param path 缓存地址
 * @param top 是否是顶层调用，用于标记递归，保持默认即可
 * @returns {Promise} 返回值中result['update']用于标记是否删除了缓存
 */
function updateJson(path, top = true) {
    //匹配规则列表（VersionListElement）
    const list = []
    //根据list删除缓存
    const deleteCache = () => new Promise(resolve => {
        let update = false
        caches.open(CACHE_NAME).then(cache => {
            cache.keys().then(keys => {
                for (let key of keys) {
                    for (let it of list) {
                        if (it.matchUrl(key.url)) {
                            // noinspection JSIgnoredPromiseFromCall
                            cache.delete(key)
                            console.log(key.url)
                            update = true
                            break
                        }
                    }
                }
            })
        })
        resolve(update)
    })
    //解析JSON数据，返回值对外无意义，对内用于标识是否继续执行
    const parseJsonV1 = async json => {
        const oldId = await dbID.read()
        const id = json['id']
        if (oldId && oldId === id) return false
        const preId = json['preId']
        //如果oldId存在且与preId不相等说明出现跨版本的情况
        if (oldId && preId !== oldId) {
            const prePath = json['pre']
            //如果pre为null说明引用链过长，直接刷新全站缓存
            if (!prePath || preId === id) {
                // noinspection ES6MissingAwait
                deleteAllCache()
                return false
            } else {
                //否则继续查找上一个版本的更新内容
                const result = await updateJson(prePath, false)
                if (!result['run']) return false
            }
        }
        //如果oldId不存在或oldId与id相等，说明不需要更新缓存，直接退出
        if (!oldId || oldId === id) return false
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
                const result = await parseJson(resolve, reject, json)
                const update = await deleteCache()
                resolve({'update': update, 'run': result})
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
                if (value && value.clean) {
                    // noinspection JSIgnoredPromiseFromCall
                    cache.delete(key)
                }
            }
        })
    })
}

const dbID = {
    write: (id) => new Promise((resolve, reject) => {
        caches.open(CACHE_NAME).then(function (cache) {
            cache.put(
                new Request('https://id.record'),
                new Response(id)
            ).then(() => resolve())
        }).catch(() => reject())
    }), read: (src = null) => new Promise((resolve) => {
        caches.match(new Request('https://id.record'))
            .then(function (response) {
                if (!response) resolve(src)
                response.text().then(text => resolve(text))
            }).catch(() => resolve(src))
    })
}