// noinspection JSIgnoredPromiseFromCall

/** 缓存库名称 */
const CACHE_NAME = 'kmarBlogCache'
/** 版本名称存储地址（必须以`/`结尾） */
const VERSION_PATH = 'https://id.v2/'

self.addEventListener('install', () => self.skipWaiting())

/**
 * 缓存列表
 * @param clean 清理全站时是否删除其缓存
 * @param match 匹配规则
 */
const cacheList = {
    static: {
        clean: false,
        match: url => url.endsWith('jinrishici.js') || url.endsWith('.cur') ||
                    (url.match(/^(https:\/\/npm\.elemecdn\.com).*@\d.*/g) && !url.match(/\.(png|jpg)$/g))
    }, html: {
        clean: true,
        match: url => {
            if (!url.match('/kmar.top')) return false
            return url.match(/(\/|\.top|search\.xml|postsInfo\.json)$/) || url.match('/page/')
        }
    }, resource: {
        clean: true,
        match: url => {
            if (!url.match('kmar.top/')) return false
            return url.match('/indexBg/') || url.match(/\.(css|js|json)$/g)
        }
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
        source: ['//cdn.jsdelivr.net/npm'],
        dist: '//npm.elemecdn.com'
    }, emoji: {
        source: ['/gh/EmptyDreams/resources/icon'],
        dist: '/gh/EmptyDreams/twikoo-emoji'
    }
}

self.addEventListener('fetch', async event => {
    const replace = replaceRequest(event.request)
    const request = replace === null ? event.request : replace
    if (findCache(request.url)) {
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
            }).catch(err => console.error(`访问 ${request.url} 时出现错误：\n${err}`))
        }))
    } else if (replace !== null) {
        event.respondWith(fetch(request))
    }
})

self.addEventListener('message', event => {
    const data = event.data
    switch (data.type) {
        case 'update':
            updateJson(data.value).then(info => {
                // noinspection JSUnresolvedVariable
                event.source.postMessage({
                    type: 'update',
                    update: info.update,
                    version: info.version,
                    old: info.old
                })
            })
            break
        case 'refresh':
            const list = new VersionList()
            list.push(new CacheChangeExpression({'flag': 'all'}))
            deleteCache(list).then(() => event.source.postMessage({type: 'refresh'}))
            break
    }
})

/** 忽略浏览器HTTP缓存的请求指定request */
const fetchNoCache = request => fetch(request, {cache: "no-store"})

/** 判断指定url击中了哪一种缓存，都没有击中则返回null */
function findCache(url) {
    for (let key in cacheList) {
        const value = cacheList[key]
        if (value.match(url)) return value
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
            const ver = element['version']
            if (ver === version) return false
            const jsonList = element['change']
            if (jsonList) {
                for (let it of jsonList)
                    list.push(new CacheChangeExpression(it))
            }
        }
        //读取了已存在的所有版本信息依然没有找到客户端当前的版本号
        //说明跨版本幅度过大，直接清理全站
        return true
    }
    /** 解析字符串 */
    const parseJson = json => new Promise((resolve, reject) => {
        /** 版本号读写操作 */
        const dbVersion = {
            write: (id) => new Promise((resolve, reject) => {
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(
                        new Request(VERSION_PATH),
                        new Response(id)
                    ).then(() => resolve())
                }).catch(() => reject())
            }), read: () => new Promise((resolve) => {
                caches.match(new Request(VERSION_PATH))
                    .then(function (response) {
                        if (!response) resolve(null)
                        response.text().then(text => resolve(text))
                    }).catch(() => resolve(null))
            })
        }
        let list = new VersionList()
        dbVersion.read().then(version => {
            const elementList = json['info']
            const global = json['global']
            const newVersion = {global: global, local: elementList[0].version}
            //新用户不进行更新操作
            if (!version) {
                dbVersion.write(`${global}-${newVersion.local}`)
                return reject()
            }
            const oldVersion = version.split('-')
            const refresh = parseChange(list, elementList, oldVersion[1])
            dbVersion.write(`${global}-${newVersion.local}`)
            //如果需要清理全站
            if (refresh) {
                if (global === oldVersion[0]) {
                    list._list.length = 0
                    list.push(new CacheChangeExpression({'flag': 'all'}))
                } else list.refresh = true
            }
            resolve({list: list, version: newVersion, old: oldVersion[1]})
        })
    })
    const url = `/update.json` //需要修改JSON地址的在这里改
    return new Promise(resolve => fetchNoCache(url)
        .then(response => response.text().then(text => {
            const json = JSON.parse(text)
            parseJson(json).then(result => {
                deleteCache(result.list, page).then(update => resolve({
                        update: update,
                        version: result.version,
                        old: result.old
                    })
                )
            }).catch(() => {})
        }))
    )
}

/** 删除指定缓存 */
function deleteCache(list, page = null) {
    return new Promise(resolve => {
        caches.open(CACHE_NAME).then(cache =>
            cache.keys().then(keys => Promise.any(keys.map(it => new Promise((resolve1, reject1) => {
                    if (it.url === VERSION_PATH) return reject1()
                    list.match(it.url).then(result => {
                        if (result) {
                            cache.delete(it)
                            if (it.url === page) return resolve1()
                        }
                        reject1()
                    }).catch(() => reject1())
                }))).then(() => resolve(true)).catch(() => resolve(false))
            ))
    })
}

/** 版本列表 */
class VersionList {

    _list = []
    refresh = false

    push(element) {
        this._list.push(element)
    }

    clean(element = null) {
        this._list.length = 0
        if (!element) this.push(element)
    }

    match(url) {
        const check = it => new Promise((resolve, reject) => {
            if (it.match(url)) resolve()
            else reject()
        })
        return new Promise(async resolve => {
            if (this.refresh) resolve(true)
            else Promise.any(this._list.map(it => check(it)))
                .then(() => resolve(true))
                .catch(() => resolve(false))
        })
    }

}

/**
 * 缓存更新匹配规则表达式
 * @param json 格式{"flag": ..., "value": ...}
 * @see https://kmar.top/posts/bcfe8408/#JSON格式
 */
class CacheChangeExpression {

    match = null

    constructor(json) {
        const value = json['value']
        const checkCache = url => {
            const cache = findCache(url)
            return !cache || cache.clean
        }
        switch (json['flag']) {
            case 'all':
                this.match = checkCache
                break
            case 'post':
                this.match = url => url.match(`posts/${value}`) || url.match(/\/(search\.xml|postsInfo\.json)$/)
                break
            case 'type':
                this.match = url => url.endsWith(`.${value}`) && checkCache(url)
                break
            case 'html':
                this.match = cacheList.html.match
                break
            case 'file':
                this.match = url => url.endsWith(value)
                break
            case 'reg':
                this.match = url => url.match(new RegExp(value))
                break
            case 'new':
                this.match = url => url.match(/(search\.xml|postsInfo\.json|\.top)$/) || url.match('/page/')
                break
            default: throw `不支持的表达式：{flag=${json['flag']}, value=${value}}`
        }
    }

}