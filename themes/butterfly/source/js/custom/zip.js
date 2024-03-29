kmarTask()

function kmarTask() {
    /** 隐藏右下角菜单 */
    function closeRightSide() {
        const div = document.getElementById('rightside')
        div.style.cssText = ''
    }
    /** 显示右下角菜单 */
    function openRightSide() {
        const div = document.getElementById('rightside')
        div.style.cssText = 'opacity: 1; transform: translateX(-58px)'
    }
    /** 移除页面滚动条 */
    function removeHtmlScrollBar() {
        document.getElementsByTagName('html')[0].style.overflow = 'hidden'
    }
    /** 还原页面滚动条 */
    function recoverHtmlScrollBar() {
        document.getElementsByTagName('html')[0].style.overflow = ''
    }
    /**
     * 获取元素纵坐标
     * @param element 元素对象
     * @returns {number}
     */
    function getElementTop(element) {
        let actualTop = element.offsetTop;
        let current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    }
    /** 检查SW是否可用 */
    function checkServiceWorker() {
        return 'serviceWorker' in window.navigator && navigator.serviceWorker.controller
    }
    /** 发送信息到sw */
    function postMessage2SW(type, value) {
        navigator.serviceWorker.controller.postMessage({type: type, value: value})
    }
    /** 跳转到评论区 */
    function jump2Comment() {
        history.pushState('his', null, location.href + '#post-comment')
        const comment = document.getElementById('post-comment')
        btf.scrollToDest(getElementTop(comment), 800)
    }

    /** 右下角菜单 */
    function hideRightSide() {
        let _hideTask = null
        const _isMobile = 'ontouchstart' in document.documentElement
        document.addEventListener('scroll', event => {
            if (_isMobile && event.timeStamp > 2600) {
                closeRightSide()
                if (_hideTask) clearTimeout(_hideTask)
                _hideTask = setTimeout(openRightSide, 1250)
            } else {
                const currentTop = window.scrollY || document.documentElement.scrollTop
                if (currentTop > 56) openRightSide()
                else closeRightSide()
            }
        })
    }

    /** 工具栏 */
    function kmarSettings() {
        /** 打开工具栏 */
        const openToolsWin = () => {
            const div = document.getElementById('settings')
            if (div.style.display === 'block') return
            div.style.display = 'block'
            div.classList.remove('close')
            btf.animateIn(document.getElementById('quit-mask'), 'to_show 0.5s')
            const update = document.getElementById('setting-info-update')
            setText(update, localStorage.getItem('update'))
            const version = document.getElementById('setting-info-version')
            setText(version, localStorage.getItem('version'))
            removeHtmlScrollBar()
            closeRightSide()
        }
        /** 关闭工具栏 */
        const closeToolsWin = () => {
            const div = document.getElementById('settings')
            if (div.style.display !== 'block') return
            setTimeout(() => {
                div.style.display = ''
                openRightSide()
            }, 600)
            div.classList.add('close')
            btf.animateOut(document.getElementById('quit-mask'), 'to_hide 0.5s')
            recoverHtmlScrollBar()
        }
        //按下ESC时关闭工具栏
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeToolsWin()
        })
        document.getElementById('quit-mask').onclick = closeToolsWin
        document.getElementById('settings-button-close').onclick = closeToolsWin
        document.getElementById('setting-button').addEventListener('click', () => closeToolsWin())
        document.getElementById('rightside').addEventListener('click', event => {
            const element = event.target.id ? event.target : event.target.parentNode
            switch (element.id) {
                case 'rightside_config':
                    openToolsWin()
                    break
                case 'to_comment':
                    jump2Comment()
                    break
            }
        })
        const preloadButton = document.getElementById('preload-switch')
        preloadButton.onclick = () => {
            const now = localStorage.getItem('preload')
            if (now === 'false') {
                localStorage.setItem('preload', 'true')
                preloadButton.classList.remove('close')
                kmarUtils.popClockWin('博文预加载功能已经开启')
            } else {
                localStorage.setItem('preload', 'false')
                preloadButton.classList.add('close')
                kmarUtils.popClockWin('博文预加载功能已经关闭')
            }
        }
    }

    /** SW互操作 */
    function swOperator() {
        if (checkServiceWorker()) {
            postMessage2SW('update', location.href)
            navigator.serviceWorker.addEventListener('message', event => {
                const data = event.data
                switch (data.type) {
                    case 'update':
                        if (data.old !== data.version.local) {
                            localStorage.setItem('update', new Date().toLocaleString())
                            localStorage.setItem('version', `${data.version.global}.${data.version.local}`)
                        }
                        if (data.update) {
                            kmarUtils.popClickClockWin('当前页面已更新，刷新页面以显示', 'fa fa-refresh fa-spin',
                                '刷新', '点击刷新页面', () => location.reload(), 6000)
                        }
                        break
                    case 'refresh':
                        localStorage.setItem('update', new Date().toLocaleString())
                        location.reload(true)
                        break
                }
            })
        }
        // 刷新缓存的按钮
        document.getElementById('refresh-cache').onclick = () => {
            if (checkServiceWorker()) {
                kmarUtils.popClickClockWin('是否刷新本地缓存', 'fa fa-refresh fa-spin',
                    '刷新', '点击刷新页面',
                    () => postMessage2SW('refresh', null), 5000)
            } else {
                kmarUtils.popClockWin('ServiceWorker未激活')
            }
        }
    }

    /** 滚动条监视 */
    function addScrollOperatorMonitor() {
        document.addEventListener('DOMNodeInserted', event => {
            const list = event.target.classList
            if (list && list.contains('fancybox__content')) removeHtmlScrollBar()
        })
        document.addEventListener('DOMNodeRemoved', event => {
            const list = event.target.classList
            if (list && list.contains('fancybox__container')) recoverHtmlScrollBar()
        })
    }

    //追番页面点击按钮时回到顶部
    function repairBangumis() {
        if (location.href.match('/bangumis')) {
            const page = document.getElementById('page')
            const index = getElementTop(page)
            const list = document.getElementsByClassName('bangumi-button')
            for (let element of list) {
                element.addEventListener('click', () => btf.scrollToDest(index))
            }
        }
    }

    /** 分享按钮 */
    function shareButton() {
        /* 获取本页链接地址（不包含参数） */
        function getNowURL() {
            return location.protocol + '//' + location.host + location.pathname
        }

        // noinspection JSUnresolvedFunction
        const clipboard = new ClipboardJS('button#share-link', {
            text: function () {
                return document.title + '：\r\n' + getNowURL()
            },
        });

        clipboard.on('success', function () {
            // noinspection JSUnresolvedVariable
            if (GLOBAL_CONFIG.Snackbar) {
                // noinspection JSUnresolvedVariable
                btf.snackbarShow(GLOBAL_CONFIG.copy.success)
            } else {
                console.log("复制成功")
            }
        });
        clipboard.on('error', function () {
            // noinspection JSUnresolvedVariable
            if (GLOBAL_CONFIG.Snackbar) {
                // noinspection JSUnresolvedVariable
                btf.snackbarShow(GLOBAL_CONFIG.copy.error)
            } else {
                console.error("复制失败")
            }
        });
    }

    /** 预加载当前页链接 */
    function preload() {
        const button = document.getElementById('preload-switch')
        const isPreload = localStorage.getItem('preload')
        if (isPreload === 'false') {
            button.classList.add('close')
            return
        }
        const list = document.getElementsByTagName('a')
        if (!(list && checkServiceWorker())) return
        const preId = sessionStorage.getItem('preload')
        if (preId) clearTimeout(preId)
        const id = setTimeout(() => {
            const record = new Set()
            for (let element of list) {
                const url = element.href
                if (!url.match('/kmar.top/posts')) continue
                const key = url.endsWith('/') ? url : url.substring(0, url.indexOf('#'))
                //console.log(key)
                if (record.has(key)) {
                    element.classList.add('loaded')
                    continue
                }
                record.add(key)
                fetch(new Request(key)).then(() => element.classList.add('loaded')).catch(err => console.error(err))
            }
        }, 3600)
        sessionStorage.setItem('preload', id)
    }

    /** 同步最新文章及相关文章列表 */
    function syncJsonInfo() {
        /** 读取某一个文章的信息 */
        function readAbbrlink(json, abbrlink) {
            return json['info'][abbrlink]
        }
        /** 构建最新文章 */
        function syncRecentPosts(json) {
            function create(abbrlink, title, img, date) {
                // noinspection HtmlUnknownAttribute,HtmlDeprecatedAttribute
                return `<div class="aside-list-item">\<a class="thumbnail" href="/posts/${abbrlink}/" title="${title}" data-pjax-state="" one-link-mark="yes"><img src="${img}" onerror="this.onerror=null;this.src='/img/404.jpg'" alt="${title}" data-ll-status="loaded" class="entered loaded"></a><div class="content"><a class="title" href="/posts/${abbrlink}/" title="${title}" data-pjax-state="" one-link-mark="yes">${title}</a><time title="更新于 ${date.toLocaleString()}">${date.toLocaleDateString()}</time></div></div>`
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
                return `<div class="aside-list-item"><a class="thumbnail" href="/posts/${abbrlink}/" title="${title}" data-pjax-state=""><img alt="${title}" class="entered loading" src="${img}" data-ll-status="loading"></a><div class="content"><a class="title" href="/posts/${abbrlink}/" title="${title}" data-pjax-state="">${title}</a><time title="发表于 ${date.toLocaleDateString()}">${date.toLocaleDateString()}</time></div></div>`
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

    /** 评论按钮的平滑滚动 */
    function smoothCommentJump() {
        const element = document.getElementById('comment-count')
        if (element) element.addEventListener('click', () => jump2Comment())
    }

    function runTaskList(list) {
        // noinspection JSIgnoredPromiseFromCall
        Promise.all(list.map(it => new Promise(resolve => {
            it()
            resolve()
        })))
    }

    //仅执行一次的任务
    document.addEventListener('DOMContentLoaded', () => {
        btf.snackbarShow = (text, time = 3500) => kmarUtils.popClockWin(text, time)
        const taskList = [hideRightSide, kmarSettings, swOperator, shareButton]
        runTaskList(taskList)
    })

    //每次加载页面都执行的操作
    const taskList = [addScrollOperatorMonitor, removeFixedCardWidget,
                        repairBangumis, preload, syncJsonInfo, smoothCommentJump]
    runTaskList(taskList)
}

// 固定卡片点击动作
// noinspection JSUnusedGlobalSymbols
function fixedCardWidget(type, name, index) {
    // 根据id或class选择元素
    // 若元素存在
    let tmpCard = type === 'id' ? document.getElementById(name) : document.getElementsByClassName(name)[index]
    if (tmpCard) {
        removeFixedCardWidget(false);
        // 首先判断是否存在fixed-card-widget类
        if (tmpCard.className.indexOf('fixed-card-widget') < 0) {
            //新建退出蒙版
            document.getElementById('fixed-card-mask').classList.add('open')
            // 再添加固定卡片样式
            tmpCard.classList.add('fixed-card-widget');
            document.getElementsByTagName('html')[0].style.overflow = 'hidden'
        }
    }
}

// 移除卡片方法
function removeFixedCardWidget(closeMask = true) {
    const activeItems = document.querySelectorAll('.fixed-card-widget');
    if (activeItems) {
        for (let it of activeItems) {
            it.classList.remove('fixed-card-widget')
        }
    }
    //移除退出蒙版
    const mask = document.getElementById('fixed-card-mask')
    if (!(closeMask && mask.classList.contains('open'))) return
    document.getElementsByTagName('html')[0].style.overflow = ''
    mask.addEventListener('animationend', function f () {
        mask.removeEventListener('animationend', f)
        mask.style.cssText = ''
        mask.classList.remove('open')
    })
    mask.style.cssText='animation: 0.5s ease 0s 1 normal none running to_hide;'
}