// -------------------- 右下角菜单 -------------------- //
let _hideTask = null
const _isMobile = 'ontouchstart' in document.documentElement
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('scroll', (event) => {
        if (_isMobile && event.timeStamp > 2600) {
            closeRightSide()
            if (_hideTask) clearTimeout(_hideTask)
            _hideTask = setTimeout(openRightSide, 1500)
        } else {
            const currentTop = window.scrollY || document.documentElement.scrollTop
            if (currentTop > 56) openRightSide()
            else closeRightSide()
        }
    })
})

// -------------------- 工具栏 -------------------- //

/** 按下ESC时关闭工具栏 */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeToolsWin()
})
// noinspection JSUnusedGlobalSymbols
/** 打开工具栏 */
function openToolsWin() {
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
function closeToolsWin() {
    const div = document.getElementById('settings')
    if (div.style.display !== 'block') return
    setTimeout(() => div.style.display = '', 600)
    div.classList.add('close')
    const mask = document.getElementById('quit-mask')
    mask.style.display = ''
    recoverHtmlScrollBar()
    openRightSide()
}
function closeRightSide() {
    const div = document.getElementById('rightside')
    div.style.cssText = ''
}
function openRightSide() {
    const div = document.getElementById('rightside')
    div.style.cssText = 'opacity: 1; transform: translateX(-58px)'
}
// noinspection JSUnusedGlobalSymbols
/** 刷新缓存 */
function refreshCache() {
    if ('serviceWorker' in window.navigator && navigator.serviceWorker.controller) {
        if (confirm('是否确定刷新博文缓存')) navigator.serviceWorker.controller.postMessage("refresh")
    } else {
        btf.snackbarShow('ServiceWorker未激活')
    }
}
/** 是否是火狐浏览器 */
const _isFirefox = navigator.userAgent.indexOf('Firefox') >= 0
/** 给一个元素设置文本 */
function setText(element, text) {
    if (_isFirefox) element.textContent = text
    else element.innerText = text
}

// -------------------- 滚动条操作 -------------------- //
/** 移除页面滚动条 */
function removeHtmlScrollBar() {
    document.getElementsByTagName('html')[0].style.overflow = 'hidden'
}
/** 还原页面滚动条 */
function recoverHtmlScrollBar() {
    document.getElementsByTagName('html')[0].style.overflow = ''
}
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

// -------------------- sw通信 -------------------- //
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

// -------------------- fixed-card-widget -------------------- //
// 固定卡片点击动作
// noinspection JSUnusedGlobalSymbols
function FixedCardWidget(type, name, index) {
    //创建一个蒙版，作为退出键使用
    const CreateQuitBox = () => {
        const quitBox = `<div id="quit-box" onclick="RemoveFixedCardWidget()"></div>`;
        const asideContent = document.getElementById('aside-content');
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
            RemoveFixedCardWidget();
        } else {
            // 不存在则先初始化防止卡片叠加
            RemoveFixedCardWidget();
            //新建退出蒙版
            CreateQuitBox();
            // 再添加固定卡片样式
            tmpCard.classList.add('fixed-card-widget');
        }
    }
}

// 移除卡片方法
function RemoveFixedCardWidget() {
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

// -------------------- bangumis -------------------- //

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