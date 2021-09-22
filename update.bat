@echo off
echo 清除缓存
call bat/clean.bat
echo 生成网站
call bat/g.bat
echo 添加文件
call bat/add.bat
echo 同步文件
call bat/commit.bat
echo 推送更新
call bat/push.bat
pause