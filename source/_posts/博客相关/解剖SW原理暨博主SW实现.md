---
title: 解剖SW原理暨博主SW实现
top_img: false
cover: 'https://image.kmar.top/bg/b20.jpg!/fw/550'
categories:
  - 随心记
tags:
  - Hexo
  - ServiceWorker
  - 教程
description: 之前我们写了一个PWA的实现，其中用到了SW，今天我们来解读一下其中SW的奥妙。
abbrlink: bcfe8408
date: 2022-05-20 21:31:25
update: 2022-05-21 17:31:25
---

&emsp;&emsp;本文不会讲述PWA的内容，PWA内容请参考：[《基于Butterfly的PWA适配》](https://kmar.top/posts/94a0f26f/)。

## 前置知识

&emsp;&emsp;解读我的SW的实现之前肯定要先知道一些基本的知识。

### SW代理

&emsp;&emsp;首先我们要知道SW代理网络请求是怎么回事，SW代理网络请求的实质就是在浏览器真的发起网络请求之前对这次请求做一些处理，我们能做的处理包含但不限于：

1. 重定向请求（比如原本请求的是`https://.../a.jpg`，我们可以把它改成`https://.../b.png`）
2. 修改请求头
3. ……

&emsp;&emsp;实际上，SW代理的本质就是让我们自己返回一个资源回去。所以不论我们通过什么手段，只需要能够返回资源就可以了（实际上啥都不返回也没问题，不过控制台会有警告）。

&emsp;&emsp;了解了这个原理，我们就能很轻易地想到一个SW经常用的功能：客户端缓存控制。在发起网络请求的时候，如果本地已经存在其对应的结果，那么我们直接把本地的缓存内容返回给浏览器就可以了，这是减轻服务器压力、提高客户端体验的一种最直接的方案。

### 异步程序

&emsp;&emsp;整个SW并不和浏览器页面（DOM）工作在同一个线程中，所以SW中不能使用和DOM同步的接口（包括但不限于：`localStorage`、`sessionStorage`）。同时为了避免阻塞线程，我们也应该尽量采用异步的方式编写SW。

&emsp;&emsp;我们这里使用的异步实现为`Promise`，我们简单说明一下这个API的用法，想要了解更多的小伙伴可以 [自行百度](https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&ch=&tn=baidu&bar=&wd=js+promise&oq=promise&rsv_pq=cbf30923000177d0&rsv_t=f74dQlPNCe8djU5H6w3tsIdtmlCPlxqtcFQdQk7O2uoKgi8cVu%2FrRHLVtEs&rqlang=cn&rsv_enter=1&rsv_btype=t&rsv_dl=tb&inputT=494)。

```javascript
function simple() {
    return new Promise((resolve, reject) => {
        //do something...
    })
}

simple().then((args) => {
    // do something... [1]
}).catch((args) => {
    // do something...
})
// do something... [2]
```

&emsp;&emsp;上面的代码就是`Promise`的一个简单样例，我们声明了一个函数，其返回一个`Promise`，`Promise`的构造函数接收两个参数：`resolve`和`reject`（可以省略）。

&emsp;&emsp;其中`resolve`是用来标记代码执行成功的，用法为`resolve(args)`，传进去的参数我们后面再说。相反，`reject`就是用来标记代码执行错误，用法为`reject(args)`。

&emsp;&emsp;当我们创建`Promise`后，他就会执行构造函数中传入的函数，当`resolve`执行时就会触发`Promise`尾巴上带的`then`，当`reject`执行时就会触发`catch`。（一个`Promise`可以带多个`then`和`catch`。）

&emsp;&emsp;我们发现，不论是`resolve`和`then`，`reject`和`catch`，他们都有一个参数表，实际上，传进`resolve`的参数就是传给`then`的参数，`reject`同理。（参数也可以为空，即`resolve()`。）

{% p center, 注意：因为是异步执行，所以我们无法保证<code>[1]</code>和<code>[2]</code>的执行顺序。 %}

{% link Service Worker API, https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API, https://developer.mozilla.org/favicon.ico %}

### fetchAPI

&emsp;&emsp;`fetchAPI`和`XMLHttpRequest`类似，都是用于发起网络请求，获取网络资源的接口，不过`fetchAPI`提供了更强大、更灵活的功能，也更容易上手。

&emsp;&emsp`fetchAPI`是一个异步接口，其也是使用了`Promise`，具体内容我不再赘述，只说明基本用法：

```javascript
fetch(new Request(url)).then(response => {
    // response 就是请求下来的资源信息
    // do something...
}).catch(err => {
    // do something...
})
```

#### 参考内容

+ [Fetch API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
+ [Request - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)
+ [Response - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)

## 功能实现

### 资源重定向

&emsp;&emsp;有些时候，我们不方便或者没办法在本地直接修改链接，我们就可以使用SW动态的把链接替换掉：

```javascript
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

/**
 * 检查连接是否需要重定向至另外的链接，如果需要则返回新的Request，否则返回null<br/>
 * 该函数会顺序匹配{@link replaceList}中的所有项目，即使已经有可用的替换项<br/>
 * 故该函数允许重复替换，例如：<br/>
 * 如果第一个匹配项把链接由"https://ab.net/"改为了"https://abc.com/"<br/>
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

self.addEventListener('fetch', event => {
    const replace = replaceRequest(event.request)
    if (!replace) return
    event.respondWith(fetch(replace))
}
```

### 请求拦截

&emsp;&emsp;在有些时候，我们不希望一些网络请求被发出，我们就可以使用SW拦截这些请求。

```javascript
/**
 * 判断是否拦截指定链接
 * @return {boolean}
 */
function isInterrupt(url) {
    //修改这个函数返回值来判断是否拦截指定链接
    return false
}

self.addEventListener('fetch', event => {
    if (isInterrupt(event.request.url))
        event.respondWith(new Response(null, 204))
})
```

### 缓存控制

#### 老版实现

&emsp;&emsp;接下来就是我们今天的重点，缓存控制。看过我前面的文章的读者可能已经对我的缓存规则有了了解：

1. 每个缓存有固定的存活时间
2. 缓存过期后再次发送请求时会尝试通过网络请求获取新内容，如果超过指定时间没有下载完毕就先返回缓存内容，后台继续下载，下载完毕后替换缓存
3. 每个缓存存储一个额外的时间戳，用于标记最后一次访问时间
4. 手动刷新缓存时会删掉超过一定时间没访问过的缓存

&emsp;&emsp;不过这个实现已经被我替换掉了，旧版的实现我们不再多说，直接给出代码：

```javascript
/** 缓存库（数据）名称 */
const CACHE_NAME = 'kmarCache'
/** 缓存库（时间戳）名称 */
const VERSION_CACHE_NAME = 'kmarCacheTime'
/** 缓存离线超时时间 */
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

/** 存储缓存入库时间 */
const dbTime = {
    read: (key) => dbHelper.read(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)),
    write: (key, value) => dbHelper.write(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), value),
    delete: (key) => dbHelper.delete(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`))
}

/** 存储缓存最后一次访问的时间 */
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
 * @param clean 清理缓存时是否无视最终访问时间直接删除
 */
const cacheList = {
    sample: {
        url: /[填写正则表达式]/g,
        time: Number.MAX_VALUE,
        clean: true
    }
}

/**
 * 链接替换列表
 * @param source 源链接
 * @param dist 目标链接
 */
const replaceList = {
    sample: {
        source: ['//www.kmar.top'],
        dist: '//kmar.top'
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

/** 判断是否拦截指定的request */
function blockRequest(request) {
    return false
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
        //如果加载正常再缓存
        //至于为什么多了个检测与0相等是因为我实操的时候遇到了status为0的情况
        //为什么会有0我没搞清楚，知道的小伙伴可以分享一下
        if (response.ok || response.status === 0) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return response
    })
    if (!remove) return fetchFunction()
    const timeOut = () => new Promise((resolve => setTimeout(() => resolve(response), 400)))
    return Promise.race([
        timeOut(),
        fetchFunction()]
    ).catch(err => console.error('不可达的链接：' + request.url + '\n错误信息：' + err))
}

self.addEventListener('fetch', async event => {
    const replace = replaceRequest(event.request)
    const request = replace === null ? event.request : replace
    const cacheDist = findCache(request.url)
    if (blockRequest(request)) {
        event.respondWith(new Response(null, {status: 204}))
    } else if (cacheDist !== null) {
        event.respondWith(caches.match(request)
            .then(async (response) => fetchEvent(request, response, cacheList))
        )
    } else if (replace !== null) {
        event.respondWith(fetch(request))
    }
})
```

#### 新版实现

&emsp;&emsp;那么我们新版的方案换成了什么呢？

1. 所有缓存都没有过期时间（永久存活）
2. 每次更新文章时通过一系列JSON告诉客户端更新了哪些文件
3. 客户端根据JSON删除更新掉的缓存

&emsp;&emsp;这个方案我们可以称之为增量更新，该方案成功地实现了本地的永久缓存，仅在有需要的时候更新掉缓存。

&emsp;&emsp;不过这个方案也有其缺陷，因为需要通过JSON判断缓存是否需要删除，所以我们需要提前下载指定的JSON。但是我们又不能在更新JSON的时候卡住页面加载，所以在缓存更新后，只有在刷新后才能生效，同时下载的JSON也需要占用一定的流量成本。

&emsp;&emsp;因为是增量更新，在设计时也遇到了很多问题，其中最重要的一个就是如何解决跨版本问题。JSON是根据上一版的内容编写需要更新哪些内容的，如果用户错过了某些版本，就可能出现部分需要更新的资源永远无法更新。这是一个非常严重的问题，我想到的解决方案只有一条：把所有版本的JSON都存下来，这样的话即使用户跨了版本，也能先通过前面的JSON更新，最终完成增量更新。

&emsp;&emsp;这个方案还有一个问题：无休止的更新会使JSON的体积无限膨胀，我们这个缓存方案的前提就是JSON足够轻量，这样很明显就冲突了。

&emsp;&emsp;于是我想到了一种比较暴力的解决方案，我仅存储一定数量的版本信息。比如我只存储近10个版本的JSON信息，如果用户跨越的版本数量超过了10，就无法通过JSON更新内容了，这时候就强制用户刷新全站缓存。

&emsp;&emsp;不过看起来傻，其实成本并没有那么高，因为本身更新新的博文的时候就需要刷新全站缓存来保证相关页面的更新（手动排查哪些页面受到影响实在是太累了），相比于更新博文，全站刷新无非是多了CSS和JS加载。

&emsp;&emsp;存储多个版本的JSON信息有两种实现方案：

1. 所有信息存储在同一个JSON文件中
2. 将信息拆分为多个JSON文件

&emsp;&emsp;原本我是想实现第二个方案的，但是写出来代码实在有些复杂，不好排查错误，就采用了第一种方案：

{% tip warning %}<p style='text-align:center;'>当前方案还处于测试阶段，抄写SW前请三思</p>{% endtip %}

```javascript
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
        deleteAllCache().then(event.source.postMessage('refresh'))
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
    return new Promise(resolve => fetchNoCache(url).then(response => response.text().then(text => {
        const json = JSON.parse(text)
        parseJson(json).then(list => deleteCache(list).then(result => resolve(result))).catch(() => {})
    })))
}

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
```

&emsp;&emsp;代码中有多个`Promise`的`reject`用来传递结果以搭配`Promise.any`使用，我不清楚使用`reject`传递结果而非异常是否有性能损失，有知道的小伙伴可以在评论区说明一下。

##### JSON格式

&emsp;&emsp;示例：

```json
{
  "info": [
    {
      "version": "任意不重复的字符串0",
      "change": [
        {"flag": "[flag0]", "value": "[value0]"},
        {"flag": "[flag1]", "value": "[value1]"}
      ]
    },
    {
      "version": "任意不重复的字符串1",
      "change": [
        {"flag": "[flag0]", "value": "[value0]"},
        {"flag": "[flag1]", "value": "[value1]"}
      ]
    }
  ]
}
```

&emsp;&emsp;`change`列表内容：

|  flag  | value | 功能                          |
|:------:|:-----:|:----------------------------|
| `all`  |   无   | 刷新所有标记为`clean=true`的缓存      |
| `html` |   无   | 刷新所有HTML文件                  |
| `type` |   有   | 刷新所有拓展名为`value`的文件（不需要带`.`） |
| `post` |   有   | 刷新abbrlink为`value`的博文       |
| `reg`  |   有   | 根据正则表达式匹配（不需要带两边的`/`）       |
| `str`  |   有   | 根据字符串匹配                     |

{% p red center, 注意：<code>post</code>和<code>html</code>均是给我的目录结构订制的，如果需要使用或想要订制自己的匹配规则，请修改SW中的<code>CacheChangeExpression</code> %}

##### 注意事项：

+ 同时存在于JSON的版本数量可以有无限个，但是请注意，过大的JSON会损耗性能，所以不要让同时存在的版本数量过多
+ SW在匹配JSON信息时采用顺序匹配，所以写在`info`里面的版本信息越靠上表明越新，第一个即最新的版本，最后一个为保存的最旧的版本
+ `change`列表中匹配规则的数量也没有上限，同样因为性能问题尽量合并一下同类项
+ 如果某一次更新的`change`出现了`all`，那么后面的内容都将是不必要的，因为SW在解析到`all`后就会停止解析
+ 如果相邻两个版本更新的内容是一样的，请勿删除其中某一个版本，可以把老版本的`change`列表置空
+ 尽量不要重复利用`version`的字符串，避免出现意料之外的问题

##### CDN缓存问题

&emsp;&emsp;如果你的网站接入了CDN并启用了缓存，请务必注意缓存问题，因为该方案要求当JSON在CDN缓存中更新时`change`中包含的文件同样更新，否则就会导致客户端拉取到旧的内容。

&emsp;&emsp;目前我还没有实现CDN缓存的自动刷新（不会写`hexo/gulp`插件），所以我选择了另外一种暴力但是简单的方法：CDN缓存时间拉到最长，每次更新时手动刷新CDN缓存。

&emsp;&emsp;各家CDN的情况可能不太一样，各位读者根据自己的情况选择处理方法即可。

##### DOM端

&emsp;&emsp;可能已经有小伙伴迫不及待地把我的SW复制过去实操了，结果发现缓存更新并没有生效，这是因为没有在DOM中编写对应代码。

&emsp;&emsp;我们需要DOM在加载页面地时候发送信息到SW，告知SW开始根据JSON更新缓存，所以我们需要在DOM中添加如下JS：

```javascript
if ('serviceWorker' in window.navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage("update")
}
navigator.serviceWorker.addEventListener('message', event => {
    switch (event.data) {
        case 'refresh': //这个是右下角刷新缓存按钮对应地功能，在SW刷新完毕后就会执行这里
            location.reload()
            break
        case 'update':  //如果SW检测到缓存更新就会触发这里
            btf.snackbarShow('已经检测的新的更新，刷新页面以显示')
            break
    }
})
```

---

{% tip success %}
<div class="text" style=" text-align:center;">
    <p>这次SW真的废了我很大功夫才写出来
    <p>创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o
</div>
{% endtip %}