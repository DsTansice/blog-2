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

let cout = localStorage.getItem('amount');
if (!cout) cout = 0
if (cout < 1111) {
    localStorage.setItem('amount', cout + 1)
    btf.snackbarShow('<p>如果您访问本站时出现大批量图片无法加载的情况<p>还请您即时反馈给我，谢谢合作~')
}