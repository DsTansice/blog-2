function refreshCache() {
    if ('serviceWorker' in window.navigator && navigator.serviceWorker.controller) {
        if (confirm('是否确定刷新博文缓存')) navigator.serviceWorker.controller.postMessage("refresh")
    } else if (GLOBAL_CONFIG.Snackbar) {
        btf.snackbarShow('ServiceWorker未激活')
    } else {
        alert('ServiceWorker未激活')
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
    }
})