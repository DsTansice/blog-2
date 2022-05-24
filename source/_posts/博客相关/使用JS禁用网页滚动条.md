---
title: 使用JS禁用网页滚动条
top_img: false
cover: 'https://image.kmar.top/bg/b19.jpg!/fw/700'
categories:
  - 博客
tags:
  - 教程
  - Butterfly
  - Hexo
  - 魔改
description: 修改了页面滚动条后，主题以及外部JS自带的隐藏滚动条来防止页面滚动的代码失效了，最终通过JS修复了这一问题。
abbrlink: 6a968095
date: 2022-05-19 00:01:35
---

## 问题描述

&emsp;&emsp;今日，突然有群友向我反映：我的博客PC端打开搜索框或灯箱时依然可以滚动后方页面。

{% p center, 注：灯箱就是点击图片出现的查看大图的工具 %}

&emsp;&emsp;简单排查后，应该是我之前修改网页滚动条的时候的CSS导致了主题和灯箱自带的隐藏网页滚动条的代码失效，从而引发了后续的一系列问题。

## 修复

&emsp;&emsp;首先谈谈基本思路，我们要解决有子窗体弹出后背景页面依然可以被滚动的问题，那么我们要做的就是想办法禁止滚动。

&emsp;&emsp;通过百度，我们找到了不少的方案，比如和主题一样的：

```javascript
element.style.overflow = 'hidden'
```

&emsp;&emsp;不过这个方案对于我们显然是不可行的，我们继续寻找其它的方案。网上还有禁用滚轮事件的方案：

```javascript
x.addEventListener('wheel', (event) => event.preventDefault())
```

&emsp;&emsp;但是经过测试，该方案也不可行。

&emsp;&emsp;这时候我想到，能不能通过js直接修改`html`上的样式呢？答案肯定是可行的，于是有了下面这段代码：

```javascript
for (let element of document.getElementsByTagName("html")) {
    element.style.overflow = 'hidden'
}
```

&emsp;&emsp;现在，让我们把这项操作封装为函数：

```javascript
/** 移除页面滚动条 */
function removeHtmlScrollBar() {
    for (let element of document.getElementsByTagName("html")) {
        element.style.overflow = 'hidden'
    }
}

/** 还原页面滚动条 */
function recoverHtmlScrollBar() {
    for (let element of document.getElementsByTagName("html")) {
        element.style.overflow = ''
    }
}
```

### 修复搜索框

&emsp;&emsp;搜索框的问题非常好修复，因为其JS代码就在本地保存着，我们直接修改`\source\js\local-search.js`即可：

```diff
   const openSearch = () => {
-    const bodyStyle = document.body.style
-    bodyStyle.width = '100%'
-    bodyStyle.overflow = 'hidden'
+    removeHtmlScrollBar()
     btf.animateIn(document.getElementById('search-mask'), 'to_show 0.5s')
```

```diff
   const closeSearch = () => {
-    const bodyStyle = document.body.style
-    bodyStyle.width = ''
-    bodyStyle.overflow = ''
+    recoverHtmlScrollBar()
     btf.animateOut(document.querySelector('#local-search .search-dialog'), 'search_close .5s')
     btf.animateOut(document.getElementById('search-mask'), 'to_hide 0.5s')
   }
```

### 修复灯箱

&emsp;&emsp;但是对于灯箱就不太好办了，因为其JS是从CDN中获取的。现在就有两种方案，要么把JS下载下来保存在本地，要么附加JS进行修改。

&emsp;&emsp;显然，前者的方案非常麻烦，因为我们还要研究灯箱（fancybox）的代码，并且还不方便后续升级版本，所以我们采用第二个方案。

&emsp;&emsp;现在，我们要考虑的就是如何监听灯箱的开启和关闭？开启非常好监听，我们可以直接监听触发灯箱的图片的鼠标点击，那么如何监听关闭呢？

&emsp;&emsp;关闭灯箱有很多种方法，比如鼠标点击关闭按钮、鼠标点击非图片区域、键盘按下`ESC`，很显然，如果我们监听这些事件的话会很麻烦。所以我最终想到了一个“歪门邪道”，那就是监听HTML结构变化，在HTML结构变化时检测灯箱的HTML代码是否存在即可。

&emsp;&emsp;直接放出代码：

```javascript
function addFancyboxOpenMonitor() {
    //外层套一个load事件是为了让代码在页面加载完毕后再执行，优化一下性能
    addEventListener('load', () => {
        document.addEventListener('DOMSubtreeModified', () => {
            const fancybox = document.getElementsByClassName('fancybox__container is-animated')
            if (fancybox.length === 0) recoverHtmlScrollBar()
            else removeHtmlScrollBar()
        })
    })
}
```

&emsp;&emsp;下面，只需要在每次加载页面的时候调用这个函数即可。

&emsp;&emsp;不过修复后灯箱仍然存在BUG，无法通过滚轮放大缩小图片，这个问题我还没有找到原因，知道的小伙伴可以在评论区分享一下。

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}