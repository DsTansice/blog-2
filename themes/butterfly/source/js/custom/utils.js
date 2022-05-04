// -------------------- fixed-card-widget -------------------- //
// 固定卡片点击动作
function FixedCardWidget(type, name, index) {
    let tempcard;
    // 根据id或class选择元素
    if (type === "id") {
        tempcard = document.getElementById(name);
    } else {
        tempcard = document.getElementsByClassName(name)[index];
    }
    // 若元素存在
    if (tempcard) {
        // 首先判断是否存在fixed-card-widget类
        if (tempcard.className.indexOf('fixed-card-widget') > -1) {
            // 存在则移除
            RemoveFixedCardWidget();
        } else {
            // 不存在则先初始化防止卡片叠加
            RemoveFixedCardWidget();
            //新建退出蒙版
            CreateQuitBox();
            // 再添加固定卡片样式
            tempcard.classList.add('fixed-card-widget');
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
    const activedItems = document.querySelectorAll('.fixed-card-widget');
    if (activedItems) {
        for (i = 0; i < activedItems.length; i++) {
            activedItems[i].classList.remove('fixed-card-widget');
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