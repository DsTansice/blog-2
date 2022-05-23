/** 缓存库名称 */
const CACHE_NAME = 'kmarCache'
/** 版本名称存储地址 */
const VERSION_PATH = 'https://version.id/'

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
        clean: false
    }, update: {
        url: /.*((\/posts.*\/)|search\.xml)$/g,
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

self.addEventListener('fetch', async event => {
    const replace = replaceRequest(event.request)
    const request = replace === null ? event.request : replace
    if (findCache(request.url) !== null) {
        event.respondWith(caches.match(request).then(response => {
            //如果缓存存在则直接返回缓存内容
            if (response) return response
            return fetchNoCache(request).then(response => {
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
    if (event.data.startsWith('update')) {
        updateJson(event.data.substring(7)).then(result => {
            if (result) event.source.postMessage('update')
        })
    } else if (event.data === 'refresh') {
        const list = new VersionList()
        list.push(VersionElement.buildAll())
        deleteCache(list).then(event.source.postMessage('refresh'))
    }
})

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
 * 根据JSON删除缓存
 * @param page 当前页面地址
 * @returns {Promise<boolean>} 返回值用于标记当前页是否被刷新
 */
function updateJson(page) {
    /**
     * 解析elements，并把结果输出到list中
     * @return boolean 是否刷新全站缓存
     */
    const parseChange = (list, elements, version) => {
        for (let element of elements) {
            const value = VersionElement.valueOf(elements)
            if (value.version === version) return false
            list.push(value)
            if (value.stop) return false
        }
        //读取了已存在的所有版本信息依然没有找到客户端当前的版本号
        //说明跨版本幅度过大，直接清理全站
        return true
    }
    /** 解析字符串 */
    const parseJson = json => new Promise((resolve, reject) => {
        const list = new VersionList()
        dbVersion.read().then(version => {
            const elementList = json['info']
            if (elementList.length > 0) {
                // noinspection JSIgnoredPromiseFromCall
                dbVersion.write(elementList[0].version)
            }
            //判断是否存在版本
            if (!version) return reject()
            const refresh = parseChange(list, elementList, version)
            //如果需要清理全站
            if (refresh) list.clean(VersionElement.buildAll())
            resolve(list)
        })
    })
    const url = `/update.json` //需要修改JSON地址的在这里改
    return new Promise(resolve => fetchNoCache(url).then(response => response.text().then(text => {
        const json = JSON.parse(text)
        parseJson(json).then(list => deleteCache(list, page).then(result => resolve(result))).catch(() => {})
    })))
}

/** 删除指定缓存 */
function deleteCache(list, page = null) {
    return new Promise(resolve => {
        caches.open(CACHE_NAME).then(cache =>
            cache.keys().then(keys =>
                Promise.any(keys.map(it => new Promise((resolve1, reject1) => {
                    list.match(it.url).then(result => {
                        if (result) {
                            // noinspection JSIgnoredPromiseFromCall
                            cache.delete(it)
                            //该SW还处于试验阶段，该信息用来获取删除了哪些缓存
                            console.log(`debug-delete:${it.url}`)
                            if (it.url === page) resolve1()
                            else reject1()
                        } else reject1()
                    }).catch(() => reject1())
                }))).then(() => resolve(true)).catch(() => resolve(false))
            ))
    })
}

/** 版本列表 */
class VersionList {

    list = []

    push(element) {
        this.list.push(element)
    }

    clean(element = null) {
        this.list.length = 0
        if (!element) this.push(element)
    }

    match(url) {
        return new Promise((resolve) => {
            Promise.any(this.list.map(it => it.matchUrl(url)))
                .then(() => resolve(true))
                .catch(() => resolve(false))
        })
    }

}

/**
 * 通过JSON构建一个版本信息
 * @constructor
 */
class VersionElement {

    static buildAll() {
        const result = new VersionElement()
        result._list.push(CacheChangeExpression.buildAllExpression())
        return result
    }

    /** 通过完整信息构建一个完整的元素 */
    static valueOf(json) {
        const result = new VersionElement()
        result.version = json['version']
        const jsonList = json['change']
        if (jsonList) {
            for (let it of jsonList) {
                const value = new CacheChangeExpression(it)
                if (value.all) result.stop = true
                result._list.push(value)
            }
        }
        return result
    }

    /** 匹配规则列表 */
    _list = []
    /** 是否停止解析 */
    stop = false
    /** 版本信息 */
    version = null

    /**
     * 判断与输入的url是否匹配
     * @param url 字符串（String）
     * @return {Promise} resolve表明匹配成功，reject表明匹配失败
     */
    matchUrl(url) {
        return new Promise((resolve, reject) => {
            for (let it of this._list) {
                if (it.matchUrl(url)) {
                    resolve()
                    return
                }
            }
            reject()
        })
    }

}

/**
 * 缓存更新匹配规则表达式
 * @param json 格式{"flag": ..., "value": ...}
 * @see https://kmar.top/posts/bcfe8408/#JSON格式
 */
class CacheChangeExpression {

    static buildAllExpression() {
        return new CacheChangeExpression({'flag': 'all'})
    }

    all = false
    matchUrl = null

    constructor(json) {
        const value = json['value']
        switch (json['flag']) {
            case 'all':
                this.all = true
                this.matchUrl = url => {
                    const cache = findCache(url)
                    return cache ? cache.clean : url !== VERSION_PATH
                }
                break
            case 'str':
                this.matchUrl = url => url.match(value) !== null
                break
            case 'reg':
                this.matchUrl = url => url.match(RegExp(value)) !== null
                break
            case 'post':
                this.matchUrl = url => url.match(`posts/${value}`) !== null
                break
            case 'type':
                this.matchUrl = url => url.endsWith(`.${value}`)
                break
            case 'html':
                this.matchUrl = url => url.endsWith('/') && url !== VERSION_PATH
                break
            default: console.error(`不支持的表达式：${json}`)
        }
    }

}

const fetchNoCache = request => fetch(request, {cache: "no-store"})

const dbVersion = {
    write: (id) => new Promise((resolve, reject) => {
        caches.open(CACHE_NAME).then(function (cache) {
            cache.put(
                new Request(VERSION_PATH),
                new Response(id)
            ).then(() => resolve())
        }).catch(() => reject())
    }), read: (src = null) => new Promise((resolve) => {
        caches.match(new Request(VERSION_PATH))
            .then(function (response) {
                if (!response) resolve(src)
                response.text().then(text => resolve(text))
            }).catch(() => resolve(src))
    })
}