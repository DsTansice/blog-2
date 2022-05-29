// noinspection JSIgnoredPromiseFromCall

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
        /** 构建一个元素 */
        const createElement = (tag, className) => {
            const result = document.createElement(tag)
            result.className = className
            return result
        }
        /**
         * 关闭指定悬浮窗
         * @param id 悬浮窗ID
         * @param move 是否移动其余悬浮窗
         */
        const closeWin = (id, move = true) => new Promise(resolve => {
            const body = document.getElementsByTagName('body')[0]
            const div = document.getElementById(id)
            if (!div || div.classList.contains('delete')) return
            setTimeout(() => {
                const div = document.getElementById(id)
                sessionStorage.removeItem(div.id)
                body.removeChild(div)
            }, 2000)
            div.classList.add('delete')
            if (move) kmarUtils._moveWin(id, true)
            resolve()
        })
        /** 关闭多余的悬浮窗 */
        const closeRedundantWin = (maxCount) => new Promise(resolve => {
            const list = document.getElementsByClassName('float-win')
            if (list && list.length > maxCount) {
                const count = list.length - maxCount
                for (let i = 0; i !== count; ++i) {
                    closeWin(list[i].id, false)
                }
            }
            resolve()
        })
        // noinspection JSIgnoredPromiseFromCall
        new Promise(resolve => {
            const body = document.getElementsByTagName('body')[0]
            const div = createElement('div', 'float-win')
            div.id = `float-win-${kmarUtils._winCode++}`
            div.setAttribute('move', '0')
            //关闭按钮
            const exitButton = createElement('button', 'exit')
            const exitIcon = createElement('i', 'fa fa-times')
            exitButton.appendChild(exitIcon)
            exitButton.addEventListener('click', () => closeWin(div.id))
            //文本
            const textDiv = createElement('p', 'text')
            setText(textDiv, text)

            div.appendChild(exitButton)
            div.appendChild(textDiv)
            if (buttonText && action) {
                div.classList.add('click')
                const actionDiv = createElement('div', 'select')
                const actionButton = document.createElement('button')
                actionButton.className = 'action'
                actionButton.addEventListener('click', () => {
                    action()
                    closeWin(div.id)
                })
                if (icon) {
                    const actionIcon = createElement('i', icon)
                    actionButton.appendChild(actionIcon)
                }
                const actionText = createElement('p', 'text')
                setText(actionText, buttonText)
                const descrDiv = createElement('div', 'descr')
                const descrText = createElement('p')
                setText(descrText, describe)
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
                closeWin(div.id)
            }, 100)
            kmarUtils._moveWin(div.id, false)
            closeRedundantWin(3)
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
    })

}