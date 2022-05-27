// noinspection JSIgnoredPromiseFromCall

const _isFirefox = navigator.userAgent.indexOf('Firefox') >= 0

const kmarUtils = {

    /** 记录悬浮窗编号，外界切勿修改 */
    _winCode: 0,
    /**
     * 在右上角弹出带按钮的悬浮窗
     * @param text 要显示的文本
     * @param icon 按钮图标`fontawesome`
     * @param buttonText 按钮文本
     * @param describe 按钮文字描述
     * @param action 按钮动作
     * @param time 持续时间
     */
    popClickClockWin: (text, icon, buttonText, describe, action, time = 3500) => {
        // noinspection JSIgnoredPromiseFromCall
        new Promise(resolve => {
            const body = document.getElementsByTagName('body')[0]
            const div = kmarUtils._createElement('div', 'float-win')
            div.id = `float-win-${kmarUtils._winCode++}`
            div.setAttribute('move', '0')
            //关闭按钮
            const exitButton = kmarUtils._createElement('button', 'exit')
            const exitIcon = kmarUtils._createElement('i', 'fa fa-times')
            exitButton.appendChild(exitIcon)
            exitButton.addEventListener('click', () => kmarUtils._closeWin(div.id))
            //文本
            const textDiv = kmarUtils._createElement('p', 'text')
            kmarUtils._setText(textDiv, text)

            div.appendChild(exitButton)
            div.appendChild(textDiv)
            if (buttonText && action) {
                div.classList.add('click')
                const actionDiv = kmarUtils._createElement('div', 'select')
                const actionButton = document.createElement('button')
                actionButton.className = 'action'
                actionButton.addEventListener('click', () => {
                    action()
                    kmarUtils._closeWin(div.id)
                })
                if (icon) {
                    const actionIcon = kmarUtils._createElement('i', icon)
                    actionButton.appendChild(actionIcon)
                }
                const actionText = kmarUtils._createElement('p', 'text')
                kmarUtils._setText(actionText, buttonText)
                const descrDiv = kmarUtils._createElement('div', 'descr')
                const descrText = kmarUtils._createElement('p')
                kmarUtils._setText(descrText, describe)
                descrDiv.appendChild(descrText)
                actionButton.appendChild(actionText)
                actionDiv.appendChild(actionButton)
                actionDiv.appendChild(descrDiv)
                div.appendChild(actionDiv)
            }
            body.appendChild(div)
            resolve()
            div.onmouseover = () => div.setAttribute('over', true)
            div.onmouseleave = () => div.removeAttribute('over')
            sessionStorage.setItem(div.id, 0)
            const task = setInterval(() => {
                const win = document.getElementById(div.id)
                if (win) {
                    if (win.hasAttribute('over')) {
                        sessionStorage.setItem(win.id, 0)
                        return
                    }
                    const age = parseInt(sessionStorage.getItem(win.id)) + 100
                    sessionStorage.setItem(win.id, age)
                    if (age < time) return
                }
                clearInterval(task)
                kmarUtils._closeWin(div.id)
            }, 100)
            kmarUtils._moveDown(div.id)
            kmarUtils._closeRedundantWin(3)
        })
    },
    /**
     * 在右上角弹出悬浮窗
     * @param text 显示的文本
     * @param time 默认持续时间
     */
    popClockWin: (text, time = 3500) =>
        kmarUtils.popClickClockWin(text, null, null, null, null, time),
    /**
     * 移动指定悬浮窗
     * @param id 悬浮窗ID
     * @param direct 移动方向，true为上，false为下
     */
    _moveWin: (id, direct) => new Promise(resolve => {
        const list = document.getElementsByClassName('float-win')
        const moveHeight = document.getElementById(id).offsetHeight + 10
        for (let i = 0; i !== list.length; ++i) {
            const div = list[i]
            if (div.id === id) break
            const value = parseInt(div.getAttribute('move')) + (direct ? -moveHeight : moveHeight)
            div.setAttribute('move', value)
            div.style.transform = `translateY(${value}px)`
        }
        resolve()
    }),
    /** 将指定ID前的悬浮窗向下移动 */
    _moveDown: (id) => kmarUtils._moveWin(id, false),
    /** 将指定index后的悬浮窗向上移动 */
    _moveUp: (id) => kmarUtils._moveWin(id, true),
    /**
     * 关闭指定悬浮窗
     * @param id 悬浮窗ID
     * @param move 是否移动其余悬浮窗
     */
    _closeWin: (id, move = true) => new Promise(resolve => {
        const body = document.getElementsByTagName('body')[0]
        const div = document.getElementById(id)
        if (!div || div.classList.contains('delete')) return
        setTimeout(() => {
            const div = document.getElementById(id)
            sessionStorage.removeItem(div.id)
            body.removeChild(div)
        }, 2000)
        div.classList.add('delete')
        if (move) kmarUtils._moveUp(id)
        resolve()
    }),
    /** 关闭多余的悬浮窗 */
    _closeRedundantWin: (maxCount) => new Promise(resolve => {
        const list = document.getElementsByClassName('float-win')
        if (list && list.length > maxCount) {
            const count = list.length - maxCount
            for (let i = 0; i !== count; ++i) {
                kmarUtils._closeWin(list[i].id, false)
            }
        }
        resolve()
    }),
    /** 创建一个元素 */
    _createElement: (tag, className) => {
        const result = document.createElement(tag)
        result.className = className
        return result
    },
    /** 给一个元素设置文本 */
    _setText: (element, text) => {
        if (_isFirefox) element.textContent = text
        else element.innerText = text
    }
}