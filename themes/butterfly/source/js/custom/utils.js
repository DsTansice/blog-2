// -------------------- 滚动条操作 -------------------- //
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

// -------------------- fancybox监听 -------------------- //
function addFancyboxOpenMonitor() {
    document.addEventListener('load', () => {
        document.addEventListener('DOMSubtreeModified', () => {
            const fancybox = document.getElementsByClassName('fancybox__container is-animated')
            if (fancybox.length === 0) recoverHtmlScrollBar()
            else removeHtmlScrollBar()
        })
    })
}

// -------------------- sw通信 -------------------- //
if ('serviceWorker' in window.navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(`update:${location.href}`)
}
navigator.serviceWorker.addEventListener('message', event => {
    switch (event.data) {
        case 'refresh':
            location.reload(true)
            break
        case 'update':
            kmarUtils.popClickClockWin('当前页面已更新，刷新页面以显示',
                'fa fa-refresh fa-spin', '刷新', '点击刷新页面', () => location.reload())
            break
    }
})

// -------------------- fixed-card-widget -------------------- //
// 固定卡片点击动作
function FixedCardWidget(type, name, index) {
    let tmpCard;
    // 根据id或class选择元素
    if (type === "id") {
        tmpCard = document.getElementById(name);
    } else {
        tmpCard = document.getElementsByClassName(name)[index];
    }
    // 若元素存在
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

//创建一个蒙版，作为退出键使用
function CreateQuitBox() {
    const quitBox = `<div id="quit-box" onclick="RemoveFixedCardWidget()"></div>`;
    const asideContent = document.getElementById('aside-content');
    asideContent.insertAdjacentHTML("beforebegin", quitBox)
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