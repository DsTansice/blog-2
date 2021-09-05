---
title: Anaconda3&PyCharm安装配置教程
date: 2021-09-05 13:58:13
categories:

tags:

cover: https://cdn.jsdelivr.net/gh/EmptyDreams/resources/b5.png
description: 新手不知道如何安装Anaconda3和PyCharm？来这里寻找答案吧。
---

# 下载

&emsp;&emsp;首先，我们需要下载Anaconda3和PyCharm的安装包，班群的小伙伴可以直接在群文件里面下载，其他人可以去官网下载，这里列出下载链接：[Anaconda3](https://www.anaconda.com/products/individual)、[PyCharm](https://www.jetbrains.com/zh-cn/pycharm/download/#section=windows)

&emsp;&emsp;温馨提示：PyCharm下载社区版（Community）就够用了。

# 安装

**声明：本章所有图片均来源于网络，若有侵权可以联系我删除。因为来源与网络，可能图片中的信息会与文字描述有部分不相符的内容，如果两者不一样则优先听从文字内容。**

## Anaconda3

&emsp;&emsp;打开安装包，可以看到下图所示的界面

<img src="https://pic1.zhimg.com/v2-1a95c6756d90ce6dd74a9f08f6dd50a8_r.jpg" style="zoom:67%;" />

&emsp;&emsp;然后可以看到下面的界面，这里两个选项区别不大，如果你想让电脑上所有用户都能使用Anaconda3就选2，否则默认即可。

<img src="https://pic2.zhimg.com/v2-29778a46617e491adb554ac5fa5823b1_r.jpg" style="zoom:67%;" />

&emsp;&emsp;接下来是安装路径的选择，这里以`E:\Anaconda\`为例。

&emsp;&emsp;**注意：安装目录必须是空的，即Anaconda文件夹内不能有任何文件！如果Anaconda文件夹不存在安装程序会自动创建，不需要手动新建文件夹！**

<img src="https://pic2.zhimg.com/v2-64590b21362f65132f54d1a597f0c809_r.jpg" style="zoom:67%;" />

&emsp;&emsp;点击next即可进入下面的界面，新版本的安装界面第二个选项写的是3.8，这个不用管，保持默认即可。

<img src="https://pic1.zhimg.com/v2-118a4d294002f24f36b86cb6250b2594_r.jpg" style="zoom:67%;" />

&emsp;&emsp;点击`Install`后一路`Next`就能进入最终的这个界面，两个选项都取消，点击`Finish`就完成安装了。

<img src="https://pic2.zhimg.com/v2-6ed983e8cedf48dc0c0870d3de2c620d_r.jpg" style="zoom:67%;" />

## Pycharm

&emsp;&emsp;打开安装包，进入修改安装路径的界面，这里随意选择自己想要的安装路径即可。

&emsp;&emsp;**注意：这里目标文件夹同样要是空的！**

<img src="https://upload-images.jianshu.io/upload_images/25389123-25939036504215a8.png?imageMogr2/auto-orient/strip|imageView2/2/w/494/format/webp" style="zoom:99%;" />

&emsp;&emsp;接下来这个界面是让很多人迷惑的界面，简单说一下各个选项的作用：

<ul>
    <li>Create Desktop Shortcut: 创建桌面快捷方式（最好选上）</li>
    <li>Add "Open Folder as Project": 添加打开文件夹作为项目（一般不用选）</li>
    <li>Create Associations: 关联指定文件（可以选）</li>
    <li>Update PATH variable: 更新系统环境（一般不用选）</li>
</ul>



<img src="https://upload-images.jianshu.io/upload_images/25389123-56ffa51ff1a4e7eb.png?imageMogr2/auto-orient/strip|imageView2/2/w/728/format/webp" style="zoom: 67%;" />

&emsp;&emsp;进入最后一个界面的时候可以先把`Run PyCharm`取消掉，点击`Finish`就完成安装了

<img src="https://upload-images.jianshu.io/upload_images/25389123-e7d38392706758b1.png?imageMogr2/auto-orient/strip|imageView2/2/w/727/format/webp" style="zoom:67%;" />

# 配置Anaconda环境变量

&emsp;&emsp;此电脑——属性——高级系统设置——环境变量——系统变量——[双击Path]

&emsp;&emsp;然后在里面添加一下内容：（**注意：`E:\Tools\Anaconda`需要替换成你的Anaconda3的安装目录！**）

> E:\Tools\Anaconda3（Python需要）
> E:\Tools\Anaconda3\Scripts（conda自带脚本）
> E:\Tools\Anaconda3\Library\mingw-w64\bin（使用C with python的时候） E:\Anaconda\Library\usr\bin
> E:\Tools\Anaconda3\Library\bin（jupyter notebook动态库）

&emsp;&emsp;修改完之后就是下图中的效果：

<img src="https://cdn.jsdelivr.net/gh/EmptyDreams/resources/py/path.png" style="zoom:73%;" />

&emsp;&emsp;保存并退出打开的这些界面，然后`Win + R`打开运行，输入`cmd`回车打开命令提示符，输入`python`回车，若出现类似于下图中的效果则说明你py的环境配置成功：

<img src="https://cdn.jsdelivr.net/gh/EmptyDreams/resources/py/check.png" style="zoom:67%;" />

# 添加Anaconda中国镜像

<ol>
    <li>打开命令提示符，执行“conda config --set show_channel_urls yes”指令</li>
    <li>打开C:\用户\[你的用户名]文件夹，找到.condarc文件，用记事本打开</li>
    <li>修改文件内容</li>
    <li>命令提示符中执行“conda clean -i ”指令</li>
</ol>

&emsp;&emsp;修改后的`.condarc`应该长下面这个样子：

```
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

# PyCharm的汉化

**注意：本章中所有图片均来源于网络，侵删！若图片信息与文本描述不相符，则优先听从文本指令。**

&emsp;&emsp;打开PyCharm可以看到下面的界面：

<img src="https://upload-images.jianshu.io/upload_images/25389123-349af93c05042b76.png?imageMogr2/auto-orient/strip|imageView2/2/w/821/format/webp" style="zoom:80%;" />

&emsp;&emsp;点击左侧的`Plugins`按钮，接着点击`Marketplace`，在搜索栏内填入`chinese`可以看到下面的样子：

<img src="https://img-blog.csdnimg.cn/20210304214811945.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0MTExODA1,size_16,color_FFFFFF,t_70#pic_center" style="zoom:59%;" />

&emsp;&emsp;然后按照图中所示，点击`Install`，等待安装完毕后重启PyCharm，你就会发现界面变成中文了。

# PyCharm插件推荐

<ul>
    <li>Key Promoter X: 快捷键提示插件，如果你的鼠标操作可以用快捷键替代则会在右下角提醒你</li>
    <li>Material Theme UI: 界面美化插件（名字后面带个Lite的是免费版，不带的是付费版）</li>
    <li>Translation: 翻译插件</li>
</ul>

# PyCharm优化

**注意：本章仅针对16G内存的电脑，若你的电脑内存比较小，请自己抉择最大内存设置。**

&emsp;&emsp;点击界面左下角的设置按钮，然后点击`编辑自定义VM选项`，进入图示界面：

<img src="https://cdn.jsdelivr.net/gh/EmptyDreams/resources/py/edit.png" style="zoom:67%;" />

&emsp;&emsp;在列表最后面添加如下语句，这里就不解释具体原因了：

>-Dfile.encoding=UTF-8
>-XX:-UseCounterDecay
>-XX:+DoEscapeAnalysis

&emsp;&emsp;列表头有两行语句，分别是：`-Xms***`、`-Xmx***`。这两个语句分别用于设置最小内存和最大内存限制，这里修改为：`-Xms512m`、`-Xmx2048m`。
