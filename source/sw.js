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
        clean: true
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
    if (event.data.startsWith('update')) {
        updateJson(event.data.substring(7)).then(result => {
            if (result) event.source.postMessage('update')
        })
    } else if (event.data === 'refresh') {
        deleteAllCache().then(event.source.postMessage('refresh'))
    }
})

/**
 * 缓存更新匹配
 * @param json 格式{"flag": ..., "value": ...}
 * @constructor
 * @see https://kmar.top/posts/bcfe8408/#JSON格式
 */
function CacheChangeExpression(json) {
    this.all = false
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
            this.matchUrl = url => url.endsWith('/')
            break
        default: console.error(`不支持的表达式：${json}`)
    }
}

/**
 * 通过JSON构建一个版本信息
 *
 * 调用格式：
 *
 * 1. (json, null): 前者为有效数据，后者为无效数据，
 *          其中JSON格式见[我的博客](https://kmar.top/posts/bcfe8408/#缓存控制)
 * 2. (*, {flag, value}): 前者为任意值，后者为匹配规则，格式见{@link CacheChangeExpression}
 *
 * 第一种格式用来通过JSON构建对象，第二种格式用来通过代码直接构建一个仅包含一个匹配规则的对象
 *
 * **注意：通过第二种方法构建的对象不含有`stop`、`version`这两个属性**
 *
 * @constructor
 */
function VersionElement(json, value = null) {
    if (value) {
        this.list = [new CacheChangeExpression(value)]
    } else {
        this.stop = false
        this.version = json['version']
        this.list = []
        const jsonList = json['change']
        if (jsonList) {
            for (let it of jsonList) {
                const value = new CacheChangeExpression(it)
                if (value.all) this.stop = true
                this.list.push(value)
            }
        }
    }
    /**
     * 判断与输入的url是否匹配
     * @param url 字符串（String）
     * @return {Promise} resolve表明匹配成功，reject表明匹配失败
     */
    this.matchUrl = url => new Promise((resolve, reject) => {
        for (let it of this.list) {
            if (it.matchUrl(url)) {
                resolve()
                return
            }
        }
        reject()
    })
}

/**
 * 根据JSON删除缓存
 * @param page 当前页面地址
 * @returns {Promise<boolean>} 返回值用于标记当前页是否被刷新
 */
function updateJson(page) {
    //根据list删除缓存
    const deleteCache = (list) => new Promise(resolve => {
        caches.open(CACHE_NAME).then(cache =>
            cache.keys().then(keys =>
                Promise.any(keys.map(it => new Promise((resolve1, reject1) => {
                    list.matchUrl(it.url).then(result => {
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
    /**
     * 解析elements，并把结果输出到list中
     * @return boolean 是否刷新全站缓存
     */
    const parseChange = (list, elements, version) => {
        for (let element of elements) {
            const value = new VersionElement(element)
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
        const list = []
        list.matchUrl = (url) => new Promise((resolve1) => {
            Promise.any(list.map(it => it.matchUrl(url)))
                .then(() => resolve1(true))
                .catch(() => resolve1(false))
        })
        dbVersion.read().then(version => {
            const elementList = json['info']
            if (elementList.length > 0) {
                // noinspection JSIgnoredPromiseFromCall
                dbVersion.write(elementList[0].version)
            }
            //判断是否存在版本
            if (!version) return reject()
            const refresh = parseChange(list, elementList, version)
            if (refresh) {  //如果需要清理全站
                list.length = 0 //清空列表
                list.push(new VersionElement(null, {'flag': 'all'}))
            }
            resolve(list)
        })
    })
    const url = `/update.json` //需要修改JSON地址的在这里改
    return new Promise(resolve => fetch(url).then(response => response.text().then(text => {
        const json = JSON.parse(text)
        parseJson(json).then(list => deleteCache(list).then(result => resolve(result))).catch(() => {})
    })))
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