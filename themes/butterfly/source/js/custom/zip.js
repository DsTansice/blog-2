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
            const mask = document.getElementById('quit-mask')
            mask.style.display = 'block'
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
            setTimeout(() => div.style.display = '', 600)
            div.classList.add('close')
            const mask = document.getElementById('quit-mask')
            mask.style.display = ''
            recoverHtmlScrollBar()
            openRightSide()
        }
        /** 按下ESC时关闭工具栏 */
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeToolsWin()
        })
        document.getElementById('rightside_config').addEventListener('click', openToolsWin)
        document.getElementById('quit-mask').addEventListener('click', closeToolsWin)
        document.getElementById('settings-button-close').addEventListener('click', closeToolsWin)
    }

    /** SW互操作 */
    function swOperator() {
        /** 刷新缓存 */
        function refreshCache() {
            if ('serviceWorker' in window.navigator && navigator.serviceWorker.controller) {
                if (confirm('是否确定刷新博文缓存')) navigator.serviceWorker.controller.postMessage("refresh")
            } else {
                btf.snackbarShow('ServiceWorker未激活')
            }
        }

        if ('serviceWorker' in window.navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(`update:${location.href}`)
        }
        navigator.serviceWorker.addEventListener('message', event => {
            const data = event.data
            switch (data) {
                case 'refresh':
                    localStorage.setItem('update', new Date().toLocaleString())
                    location.reload(true)
                    break
                default:
                    if (data.old !== data.version) {
                        localStorage.setItem('update', new Date().toLocaleString())
                        localStorage.setItem('version', data.version)
                    }
                    if (data.update) {
                        kmarUtils.popClickClockWin('当前页面已更新，刷新页面以显示', 'fa fa-refresh fa-spin',
                            '刷新', '点击刷新页面', () => location.reload())
                    }
                    break
            }
        })
        document.getElementById('refresh-cache').addEventListener('click', refreshCache)
    }

    /** 滚动条监视 */
    function addScrollOperatorMonitor() {
        document.addEventListener('DOMNodeInserted', event => {
            const list = event.target.classList
            if (list && list.contains('fancybox__content')) removeHtmlScrollBar()
        })
        document.addEventListener('DOMNodeRemoved', event => {
            const list = event.target.classList
            if (list && list.contains('fancybox__image')) recoverHtmlScrollBar()
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

    function shareButton() {
        /* 获取本页链接地址（不包含参数） */
        function getNowURL() {
            return location.protocol + '//' + location.host + location.pathname
        }

        const clipboard = new ClipboardJS('button#share-link', {
            text: function () {
                return document.title + '：\r\n' + getNowURL()
            },
        });

        clipboard.on('success', function () {
            if (GLOBAL_CONFIG.Snackbar) {
                btf.snackbarShow(GLOBAL_CONFIG.copy.success)
            } else {
                console.log("复制成功")
            }
        });
        clipboard.on('error', function () {
            if (GLOBAL_CONFIG.Snackbar) {
                btf.snackbarShow(GLOBAL_CONFIG.copy.error)
            } else {
                console.error("复制失败")
            }
        });
    }

    //仅执行一次的任务
    document.addEventListener('DOMContentLoaded', () => {
        btf.snackbarShow = (text, time = 3500) => kmarUtils.popClockWin(text, time)
        hideRightSide()
        kmarSettings()
        swOperator()
        shareButton()
    })

    //每次加载页面都执行的操作
    addScrollOperatorMonitor()
    removeFixedCardWidget()
    repairBangumis()
}

// 固定卡片点击动作
// noinspection JSUnusedGlobalSymbols
function fixedCardWidget(type, name, index) {
    //创建一个蒙版，作为退出键使用
    const CreateQuitBox = () => {
        const quitBox = `<div id="quit-box" onclick="removeFixedCardWidget()"></div>`
        const asideContent = document.getElementById('aside-content')
        // noinspection SpellCheckingInspection
        asideContent.insertAdjacentHTML("beforebegin", quitBox)
    }
    // 根据id或class选择元素
    // 若元素存在
    let tmpCard = type === 'id' ? document.getElementById(name) : document.getElementsByClassName(name)[index]
    if (tmpCard) {
        // 首先判断是否存在fixed-card-widget类
        if (tmpCard.className.indexOf('fixed-card-widget') > -1) {
            // 存在则移除
            removeFixedCardWidget();
        } else {
            // 不存在则先初始化防止卡片叠加
            removeFixedCardWidget();
            //新建退出蒙版
            CreateQuitBox();
            // 再添加固定卡片样式
            tmpCard.classList.add('fixed-card-widget');
        }
    }
}

// 移除卡片方法
function removeFixedCardWidget() {
    const activeItems = document.querySelectorAll('.fixed-card-widget');
    if (activeItems) {
        for (let it of activeItems) {
            it.classList.remove('fixed-card-widget')
        }
    }
    //移除退出蒙版
    const quitBox = document.getElementById('quit-box');
    if (quitBox) quitBox.remove();
}