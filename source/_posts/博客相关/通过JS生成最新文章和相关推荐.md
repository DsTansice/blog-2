---
title: 通过JS生成最新文章和相关推荐
top_img: false
cover: 'https://image.kmar.top/bg/b23.jpg!/fw/700'
categories:
  - 博客
tags:
  - Hexo
  - 教程
  - Butterfly
  - 魔改
description: 通过修改最新文章和相关推荐的生成方式解决每次更新博文都需要刷新HTML缓存的问题。
abbrlink: 4cde9f86
date: 2022-06-09 15:33:21
---

## 魔改思路

&emsp;&emsp;默认的最新文章和相关推荐的生成方式是在构建博客时直接写入到`html`文件中，而我的 [SW缓存策略](https://kmar.top/posts/bcfe8408/#新版实现) 就导致更新博文时也要刷新全部或部分`html`缓存，以此更新最新文章和相关推荐列表（下文简称“列表”）。

&emsp;&emsp;于是我想到了一个解决方案，我将列表有关的信息直接保存在一个`json`文件中，然后用户访问页面的时候读取这个`json`文件，再根据`json`文件编写列表。这样子的话每次更新博文的时候不就只需要更新修改的博文和这个`json`文件就可以了。

&emsp;&emsp;接下来就是制定`json`格式，当前我是用的方案是：

```json
{
  "info": {
    "[abbrlink]": {
      "title": "标题",
      "img": "封面",
      "time": "日期",
      "sort": "最新文章列表用到的日期",
      "date": "相关推荐列表用到的日期"
    }
  },
  "recent": ["[abbrlink]", "[abbrlink]"],
  "related": {
    "[abbrlink]": ["[abbrlink]", "[abbrlink]"]
  }
}
```

&emsp;&emsp;其中，当`sort`和`date`值相同时会用`time`替代，这样设计的目的是为了压缩`json`体积。

&emsp;&emsp;接下来就是考虑如何生成`json`文件了，我们选择通过`hexo`生成，就是在`scripts`目录下面写一个`js`用来生成`json`。

## 教程

&emsp;&emsp;修改：`[butterfly]\layout\includes\widget\card_recent_post.pug`：

```diff
  if theme.aside.card_recent_post.enable
    .card-widget.card-recent-post
      .item-headline
        i.fas.fa-history
        span= _p('aside.card_recent_post')
+     .aside-list(id='recent-list')
-     .aside-list
-       - let postLimit = theme.aside.card_recent_post.limit === 0 ? site.posts.length : theme.aside.card_recent_post.limit || 5
-       - let sort = theme.aside.card_recent_post.sort === 'updated' ? 'updated' : 'date'
-       - site.posts.sort(sort, -1).limit(postLimit).each(function(article){
-         - let link = article.link || article.path
-         - let title = article.title || _p('no_title')
-         - let no_cover = article.cover === false || !theme.cover.aside_enable ? 'no-cover' : ''
-         - let post_cover = article.cover
-         .aside-list-item(class=no_cover)
-           if post_cover && theme.cover.aside_enable
-             a.thumbnail(href=url_for(link) title=title)
-               img(src=url_for(post_cover) onerror=`this.onerror=null;this.src='${url_for(theme.error_img.post_page)}'` alt=title)
-           .content
-             a.title(href=url_for(link) title=title)= title
-             if theme.aside.card_recent_post.sort === 'updated'
-               time(datetime=date_xml(article.updated) title=_p('post.updated') + ' ' + full_date(article.updated)) #[=date(article.updated, config.date_format)]
-             else
-               time(datetime=date_xml(article.date) title=_p('post.created') + ' ' + full_date(article.date)) #[=date(article.date, config.date_format)]
-       - })
```

&emsp;&emsp;新建：`[butterfly]\layout\includes\widget\card-related-post.pug`：

```jade
.card-widget.card-recommend-post
    .item-headline
        //这个地方的i标签改成你想要的图标
        i.iconfont.icon-tuijian
        span= _p('post.recommend')
    .aside-list(id='related-list')
```

&emsp;&emsp;修改：`[butterfly]\layout\includes\widget\index.pug`：

```diff
  if is_post()
    - const tocStyle = page.toc_style_simple
    - const tocStyleVal = tocStyle === true || tocStyle === false ? tocStyle : theme.toc.style_simple
    if showToc && tocStyleVal
      .sticky_layout
        include ./card_post_toc.pug
    else
      !=partial('includes/widget/card_author', {}, {cache: true})
      !=partial('includes/widget/card_announcement', {}, {cache: true})
      !=partial('includes/widget/card_top_self', {}, {cache: true})
      .sticky_layout
        if showToc
          include ./card_post_toc.pug
          if theme.related_post && theme.related_post.enable
+           !=partial('includes/widget/card-related-post', {}, {cache: true})
-           != related_posts(page,site.posts)
        !=partial('includes/widget/card_recent_post', {}, {cache: true})
        !=partial('includes/widget/card_ad', {}, {cache: true})
```

&emsp;&emsp;删除：`[butterfly]\scripts\helpers\related_post.js`

&emsp;&emsp;新建：`[butterfly]\scripts\customs\jsonBuilder.js`：

```javascript
const logger = require('hexo-log')()

hexo.extend.generator.register('buildPostJson', async () => {
    const resultJson = {}
    const config = hexo.theme.config
    const list = hexo.locals.get('posts').data
    const sort = config.aside.card_recent_post.sort
    const date_type = config.related_post.date_type

    const buildAbbrlinkInfo = () => {
        const writeTime = sort === date_type ?
            (json, post) => json.time = (sort === 'updated' && post.updated ? post.updated : post.date) :
            (json, post) => {
                if (sort === 'updated') {
                    json.sort = post.updated ? post.updated : post.date
                    json.date = post.date
                } else {
                    json.sort = post.date
                    json.date = post.updated ? post.updated : post.date
                }
            }
        const json = {}
        for (let post of list) {
            const info = {}
            info.title = post.title
            writeTime(info, post)
            info.img = post.cover
            json[post.abbrlink] = info
        }
        resultJson.info = json
    }

    /** 构建最新文章信息 */
    const buildRecentJsonInfo = () => {
        if (!(config.aside.enable && config.aside.card_recent_post.enable)) return
        const getTime = sort === 'updated' ? post => post.updated ? post.updated : post.date : post => post.date
        const sorted = []
        for (let post of list) sorted.push(post)
        sorted.sort((a, b) => getTime(b) - getTime(a))
        sorted.length = Math.min(sorted.length, config.aside.card_recent_post.limit)
        resultJson.recent = []
        for (let post of sorted) {
            resultJson.recent.push(post.abbrlink.toString())
        }
    }

    /** 构建相关推荐信息 */
    const buildRelatedJsonInfo = () => {
        if (!config.related_post.enable) return
        resultJson.related = {}
        const maxCount = config.related_post.limit
        resultJson.related.list = {}
        const categories = hexo.locals.get('categories').data
        const tags = hexo.locals.get('tags').data
        // 查找对象
        const findObj = (src, dist) => {
            for (let value of src) {
                if (value.name === dist) return value.posts.data
            }
            return []
        }
        // 获取指定标签的文章列表
        const getPostsByTags = tag => {
            const result = new Set()
            for (let value of findObj(tags, tag.name)) result.add(value)
            return result
        }
        // 获取指定分类的文章列表
        const getPostsByCategories = cat => {
            const result = new Set()
            for (let value of findObj(categories, cat.name)) result.add(value)
            return result
        }
        // 处理文章
        const handle = post => {
            const map = new Map()
            const plusValue = (value, plus = 1) => {
                if (map.has(value)) map.set(value, map.get(value) + plus)
                else map.set(value, plus)
            }
            for (let tag of post.tags.data) {
                const list = getPostsByTags(tag)
                for (let value of list) plusValue(value)
            }
            for (let cat of post.categories.data) {
                const list = getPostsByCategories(cat)
                for (let value of list) plusValue(value, 2)
            }
            const result = []
            map.forEach((value, key) => result.push({post: key, count: value}))
            result.sort((a, b) => b.count - a.count)
            return result
        }

        for (let post of list) {
            const info = handle(post)
            const json = []
            for (let value of info) {
                if (json.length === maxCount) break
                json.push(value.post.abbrlink.toString())
            }
            resultJson.related.list[post.abbrlink] = json
        }
    }

    const tasks = [buildAbbrlinkInfo, buildRecentJsonInfo, buildRelatedJsonInfo]
    await Promise.all(tasks.map(it => new Promise(resolve => {
        it()
        resolve()
    })))
    logger.info(`文章JSON构建成功(${list.length})`)
    return {
        path: 'postsInfo.json',
        data: JSON.stringify(resultJson)
    }
})
```

&emsp;&emsp;引入JS：

{% p center, 注意：如果你开启了pjax，请通过<code>no-pjax</code>的方式引入该JS %}

{% p blue center, 如果你使用异步方式引入该JS，请使用<code>defer</code>，以此保证JS运行时DOM已经解析完毕 %}

```javascript
syncJsonInfo()

function syncJsonInfo() {
    /** 读取某一个文章的信息 */
    function readAbbrlink(json, abbrlink) {
        return json['info'][abbrlink]
    }

    /** 构建最新文章 */
    function syncRecentPosts(json) {
        function create(abbrlink, title, img, date) {
            return `<div class="aside-list-item">
                        <a class="thumbnail" href="/posts/${abbrlink}/" 
                                title="${title}" data-pjax-state="" one-link-mark="yes">
                            <img src="${img}" onerror="this.onerror=null;this.src='/img/404.jpg'" 
                                alt="${title}" data-ll-status="loaded" class="entered loaded">
                        </a>
                        <div class="content">
                            <a class="title" href="/posts/${abbrlink}/" title="${title}" 
                                    data-pjax-state="" one-link-mark="yes">
                                ${title}
                            </a>
                            <time title="更新于 ${date.toLocaleString()}">
                                ${date.toLocaleDateString()}
                            </time>
                        </div>
                    </div>`
        }

        const list = json['recent']
        const div = document.getElementById('recent-list')
        if (!div) return
        for (let abbrlink of list) {
            const info = readAbbrlink(json, abbrlink)
            const html = create(abbrlink, info['title'], info['img'],
                new Date(info['sort'] ? info['sort'] : info['time']))
            div.insertAdjacentHTML('beforeend', html)
        }
    }

    /** 构建相关文章 */
    function syncRelatedPosts(json) {
        function create(abbrlink, title, img, date) {
            return `<div class="aside-list-item">
                        <a class="thumbnail" href="/posts/${abbrlink}/" 
                                title="${title}" data-pjax-state="">
                            <img alt="${title}" class="entered loading" 
                                src="${img}" data-ll-status="loading">
                        </a>
                        <div class="content">
                            <a class="title" href="/posts/${abbrlink}/" 
                                    title="${title}" data-pjax-state="">
                                ${title}
                            </a>
                            <time title="发表于 ${date.toLocaleDateString()}">
                                ${date.toLocaleDateString()}
                            </time>
                        </div>
                    </div>`
        }

        const related = json['related']
        const div = document.getElementById('related-list')
        if (!div) return
        const href = location.href.substring(0, location.href.length - 1)
        const abbrlink = href.substring(href.lastIndexOf('/') + 1)
        const list = related['list'][abbrlink]
        for (let i = 0; i !== list.length; ++i) {
            const info = readAbbrlink(json, list[i])
            const html = create(list[i], info['title'], info['img'],
                new Date(info['date'] ? info['date'] : info['time']))
            div.insertAdjacentHTML("beforeend", html)
        }
    }
    
    const jsonCache = sessionStorage.getItem('postsInfo')
    if (jsonCache) {
        const json = JSON.parse(jsonCache)
        syncRecentPosts(json)
        syncRelatedPosts(json)
    } else {
        fetch(`/postsInfo.json`).then(response => {
            response.json().then(json => {
                sessionStorage.setItem('postsInfo', JSON.stringify(json))
                syncRecentPosts(json)
                syncRelatedPosts(json)
            })
        })
    }
}
```

&emsp;&emsp;然后通过`hexo s`就能看到效果了。

---

{% tip success %}
<div class="text" style=" text-align:center;">
    创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o
</div>
{% endtip %}