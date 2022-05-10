---
title: 基于Butterfly的PWA适配
top_img: false
cover: 'https://image.kmar.top/bg/b40.jpg!/fw/550'
categories:
  - 随心记
tags:
  - Hexo
  - PWA
  - ServiceWorker
  - 教程
  - Butterfly
description: 最近几天又琢磨了琢磨博客的缓存，因为Workbox缓存实在是太大了，但是又不想完全舍弃缓存，所以就在群友的帮助下手写了sw.js。
abbrlink: 94a0f26f
date: 2022-02-17 15:07:55
updated: 2022-05-10 21:27:40
---
  
## 更新内容

{% checkbox green checked, 删除长时间未访问的缓存 %}

{% checkbox green checked, 运行时替换CDN链接 %}

{% checkbox green checked, 过期缓存采用超时策略 %}

{% checkbox green checked, 增强拓展性 %}

{% checkbox green checked, 支持204拦截网络请求 %}

## 参考内容

{%p blue center, 本文参考了以下教程/文档，这些都是很不错的资源，读者可以自行参阅 %}

1. 店长写的 [Butterfly 主题的 PWA 实现方案](https://akilar.top/posts/8f31c3d0/)
2. [service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API) 文档
3. Cyfan写的 [欲善其事，必利其器 - 论如何善用ServiceWorker](https://blog.cyfan.top/p/c0af86bb.html)
4. [PWA 文档](https://www.bookstack.cn/read/pwa-doc/README.md)

## 教程

{% p blue center, 本文仅贴出本人使用的方案，其余方案请见店长写的教程 %}

### 配置Json

&emsp;&emsp;说到生成图标第一步肯定是想办法弄到图标，有条件的小伙伴可以找别人帮自己设计一个，没有的话就跟我一样用工具生成吧：

{% link Bandmark, https://app.brandmark.io/v3/, https://app.brandmark.io/favicon32.gif %}

&emsp;&emsp;这个网站生成的图标虽然下载要收费，但是并不妨碍我们截图{% inlineimage https://image.kmar.top/icon/bili/doge.png %}

&emsp;&emsp;接下来就是根据图标生成我们要的图标包了，我们可以使用这个网站：

{% link Favicon Generator. For real., https://realfavicongenerator.net/, https://realfavicongenerator.net/the_favicon/favicon.ico %}

&emsp;&emsp;进入网站后点击那大大的`Select your Favicon image`按钮，然后选择你处理好的图标文件。

&emsp;&emsp;如果你的图标不是正方形，网站会提醒你，如果满意网站的修复效果点击`Continue with this picture`即可，不满意的话自己修改完再上传就可以了。

&emsp;&emsp;可能是我网络的问题，进入下一步的时候可能会出现白屏，刷新页面重新来一遍就行了。

&emsp;&emsp;然后向下滚动，找到`Favicon for Android Chrome`栏目，点击里面的`Assets`选项卡，勾选`Create all documented icons`：

![Favicon for Android Chrome](https://image.kmar.top/posts/jybfdpwasp-0.jpg)

&emsp;&emsp;然后点击最下面的`Generate your Favicons and HTML code`，等待`Download your package`后面的按钮转好点击就嫩下载下来ZIP压缩包了。

&emsp;&emsp;将压缩包内的要用到的图标统统放到博客网站中，具体放到哪看个人喜好，然后把`site.webmanifest`改名为`manifest.json`并放到`source`文件夹下。接下来修改`manifest.json`的内容，这里给出我的Json，其中`name`、`start_url`是必须项目，同时图标目录一定要改成自己的（我没有512x512大小的图标所以我把那一项删了，有的话留着就行）：

&emsp;&emsp;解释：

1. name - 应用名称，用于安装横幅、启动画面显示
2. short_name - 应用短名称，用于主屏幕显示
3. description - 网站描述（目前我没发现在哪里派上用场了）
4. theme_color - 主题颜色
5. background_color - 背景色
6. display - 显示方式：（`fullscreen`能占多少屏幕就占多少、`standalone`独立应用、`minimal-ui`带地址栏、`browser`和浏览器一样）
7. scope - 作用域，保持默认即可，具体内容见 [参考资料](https://www.bookstack.cn/read/pwa-doc/engage-retain-users-add-to-home-screen-basic-conditions.md#%E8%AE%BE%E7%BD%AE%E4%BD%9C%E7%94%A8%E5%9F%9F)
8. start_url - 应用启动地址，保持默认即可，具体内容见 [参考资料](https://www.bookstack.cn/read/pwa-doc/engage-retain-users-add-to-home-screen-basic-conditions.md#%E8%AE%BE%E7%BD%AE%E4%BD%9C%E7%94%A8%E5%9F%9F)
9. icons - 图标

```json
{
    "lang": "en",
    "name": "\u5c71\u5cb3\u5e93\u535a",
    "short_name": "\u5c71\u5cb3\u5e93\u535a",
    "description": "kmar.top",
    "theme_color": "#242424",
    "background_color": "#242424",
    "display": "standalone",
    "scope": "/",
    "start_url": "/",
    "icons": [
        {
            "src": "logo/android-chrome-36x36.png",
            "sizes": "36x36",
            "type": "image/png"
        },
        {
            "src": "logo/android-chrome-48x48.png",
            "sizes": "48x48",
            "type": "image/png"
        },
        {
            "src": "logo/android-chrome-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
        },
        {
            "src": "logo/android-chrome-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
        },
        {
            "src": "logo/android-chrome-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
        },
        {
            "src": "logo/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "logo/android-chrome-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
        },
        {
            "src": "logo/android-chrome-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
        }
    ]
}
```

### 修改配置文件

&emsp;&emsp;修改主题配置文件，注意里面的文件路径要改成自己的：

```diff
-  # pwa:
-  #   enable: false
-  #   manifest: /pwa/manifest.json
-  #   apple_touch_icon: /pwa/apple-touch-icon.png
-  #   favicon_32_32: /pwa/32.png
-  #   favicon_16_16: /pwa/16.png
-  #   mask_icon: /pwa/safari-pinned-tab.svg
+ pwa:
+   enable: true
+   manifest: /manifest.json
+   apple_touch_icon: /logo/apple-touch-icon.png
+   favicon_32_32: /logo/favicon-32x32.png
+   favicon_16_16: /logo/favicon-16x16.png
+   mask_icon: /logo/safari-pinned-tab.svg
```

### 编写SW文件

&emsp;&emsp;接下来就是重中之重了：编写`sw.js`，这里直接把我的放出来了：

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
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
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

&emsp;&emsp;这里我把开了两个缓存空间，一个是`kmarCache`，一个是`kmarCacheTime`。前者是用来存储缓存内容的，后者是用来存储时间戳的。

### 注册SW

&emsp;&emsp;请注意，因为安全问题，`sw`不允许以任何形式跨域加载，比如你的域名是`kmar.top`，那么你只能从`kmar.top`中加载`sw.js`，其余任何形式都是不允许的，包括使用IP地址代替域名。

&emsp;&emsp;核心的注册代码很简单：

```js
    navigator.serviceWorker.register('/sw.js')
```

&emsp;&emsp;其中，`register`的参数就是`sw.js`的地址，对于我而言，合法的地址有：

1. `/sw.js`
2. `https://kmar.top/sw.js`

&emsp;&emsp;其余任何形式的加载都是非法的，包括但不限于：

1. `http://kmar.top/sw.js` #非法，因为sw仅允许通过https注册（本地`127.0.0.1`允许http）
2. `https://wulawula.com/sw.js` #非法，跨域
3. `https://11.53.15.145/sw.js` #即使`11.53.15.145`是我的博客的IP地址依然非法，被视为跨域

&emsp;&emsp;现在我们找个地方把注册代码放进去就可以了，我是放在了`[butterfly]/layout/includes/layout.pug`的开头：

```diff
+  script.
+    if ('serviceWorker' in navigator) {
+      window.addEventListener('load', function () {
+        navigator.serviceWorker.register('/sw.js')
+      })
+    }
```

## 检测PWA

&emsp;&emsp;浏览器打开网页，按`F12`，找到`Lighthouse`项目，勾选`渐进式 Web 应用`，点击`生成报告`就能判断PWA是否生效。

## 调试SW

&emsp;&emsp;浏览器打开网页，按`F12`，找到`应用程序`项目，在里面就可以调试`ServiceWorker`。

## 补充

&emsp;&emsp;现在，`ServiceWorker`的缓存完全由代码控制，用户想要刷新缓存只能使用开发者工具删除缓存，这无疑是非常不友好的。

&emsp;&emsp;这在另一篇教程中通过添加刷新缓存的按钮得到了解决：[《给博客添加刷新缓存按钮》](https://kmar.top/posts/af52c173/)

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}