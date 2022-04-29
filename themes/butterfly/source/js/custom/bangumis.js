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
window.addEventListener('DOMContentLoaded', () => {
    const page = document.getElementById('page')
    if (!page) return
    const index = getElementTop(page)
    const list = document.getElementsByClassName('bangumi-button')
    for (let element of list) {
        element.addEventListener('click', () => btf.scrollToDest(index))
    }
})