// noinspection JSIgnoredPromiseFromCall

btf.snackbarShow = (text, time = 3500) => {
    kmarUtils.popClockWin(text, time)
}

const kmarUtils = {

    winCode: 0,

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
            const div = document.createElement('div')
            div.id = `float-win-${kmarUtils.winCode++}`
            div.className = 'float-win'
            div.setAttribute('move', '0')
            //关闭按钮
            const exitButton = document.createElement('button')
            exitButton.className = 'exit'
            const exitIcon = document.createElement('i')
            exitIcon.className = 'fa fa-times'
            exitButton.appendChild(exitIcon)
            exitButton.addEventListener('click', () => kmarUtils.closeWin(div.id))
            //文本
            const textDiv = document.createElement('p')
            textDiv.className = 'text'
            textDiv.innerText = text

            div.appendChild(exitButton)
            div.appendChild(textDiv)
            if (buttonText && action) {
                div.classList.add('click')
                const actionDiv = document.createElement('div')
                actionDiv.className = 'select'
                const actionButton = document.createElement('button')
                actionButton.className = 'action'
                if (icon) {
                    const actionIcon = document.createElement('i')
                    actionIcon.className = icon
                    actionButton.appendChild(actionIcon)
                }
                const actionText = document.createElement('p')
                actionText.className = `text`
                actionText.innerText = '刷新'
                const descrDiv = document.createElement('div')
                descrDiv.className = 'descr'
                const descrText = document.createElement('p')
                descrText.innerText = describe
                descrDiv.appendChild(descrText)
                actionButton.appendChild(actionText)
                actionDiv.appendChild(actionButton)
                actionDiv.appendChild(descrDiv)
                div.appendChild(actionDiv)
            }

            body.appendChild(div)
            resolve()
            setTimeout(() => kmarUtils.closeWin(div.id), time)
            kmarUtils.moveDown(div.id)
            kmarUtils.closeRedundantWin(3)
        })
    },
    /**
     * 在右上角弹出悬浮窗
     * @param text 显示的文本
     * @param time 默认持续时间
     */
    popClockWin: (text, time = 3500) =>
        kmarUtils.popClickClockWin(text, null, null, null, time),
    /**
     * 移动指定悬浮窗
     * @param id 悬浮窗ID
     * @param direct 移动方向，true为上，false为下
     */
    moveWin: (id, direct) => new Promise(resolve => {
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
    moveDown: (id) => kmarUtils.moveWin(id, false),
    /** 将指定index后的悬浮窗向上移动 */
    moveUp: (id) => kmarUtils.moveWin(id, true),
    /**
     * 关闭指定悬浮窗
     * @param id 悬浮窗ID
     * @param move 是否移动其余悬浮窗
     */
    closeWin: (id, move = true) => new Promise(resolve => {
        const body = document.getElementsByTagName('body')[0]
        const div = document.getElementById(id)
        if (!div) return
        setTimeout(() => {
            const div = document.getElementById(id)
            if (div) body.removeChild(div)
        }, 2000)
        div.classList.add('delete')
        if (move) kmarUtils.moveUp(id)
        resolve()
    }),
    /** 关闭多余的悬浮窗 */
    closeRedundantWin: (maxCount) => new Promise(resolve => {
        const list = document.getElementsByClassName('float-win')
        if (list && list.length > maxCount) {
            const count = list.length - maxCount
            for (let i = 0; i !== count; ++i) {
                kmarUtils.closeWin(list[i].id, false)
            }
        }
        resolve()
    })
}