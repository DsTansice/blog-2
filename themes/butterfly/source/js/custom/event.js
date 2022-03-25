function refreshCache() {
    if ('serviceWorker' in window.navigator && navigator.serviceWorker.controller) {
        if (confirm('是否确定刷新博文缓存')) navigator.serviceWorker.controller.postMessage("refresh")
    } else {
        if (confirm('ServiceWorker未激活，受否刷新以激活SW')) location.reload()
    }
}

function closeSideBar() {
    var $body = document.body
    $body.style.overflow = ''
    $body.style.paddingRight = ''
    btf.animateOut(document.getElementById('menu-mask'), 'to_hide 0.5s')
    document.getElementById('sidebar-menus').classList.remove('open')
}

//与sw通信
navigator.serviceWorker.addEventListener('message', event => {
    switch (event.data) {
        case 'success':
            location.reload()
            break
        case 'location':
            if (GLOBAL_CONFIG.Snackbar) {
                btf.snackbarShow('检测到您的弱网络环境……<br/><br/>在后台加载完毕后，刷新页面即可查看新的内容', false, 3000)
            }
            break
    }
})