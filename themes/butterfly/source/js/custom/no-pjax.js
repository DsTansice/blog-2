// 常规先初始化，确保切换页面后不会有固定卡片留存
RemoveFixedCardWidget()
//修复bangumis
repairBangumis()
//fancybox
addScrollOperatorMonitor()
//替换原生悬浮窗
btf.snackbarShow = (text, time = 3500) => kmarUtils.popClockWin(text, time)