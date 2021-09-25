---
title: 简单概述自加操作
date: 2021-09-24 15:43:59
toc_number: false
categories:
  - 通用
tags:
  - 教程
cover: https://cdn.jsdelivr.net/gh/EmptyDreams/resources/b8.jpeg
---





&emsp;&emsp;自加操作有两种，`++i`和`i++`，很多新手都分不清这两个的区别，这里简单说一下这两个写法有什么不同。

# 普通解法

&emsp;&emsp;`++i`和`i++`都是自加操作，两者的区别就在于前者是先自加再使用，后者是先使用再自加，下面用一段简短的代码来解释这个问题：

```c
int maint() {
    int n = 0;
    printf("%d %d %d", ++n, n++, n);
    return 0;
}
```

&emsp;&emsp;这段代码的输出结果是什么呢？显而易见，是`1 1 2`，接下来咱们来讲解为什么会是这个结果。

<ul>
    <li><code>++n</code> 先将n的值加一并赋值给n，然后再传递给printf | 此时n=1，传值1</li>
    <li><code>n++</code> 先保存n的副本，然后将n加一并赋值给n，然后再将副本传递给printf | 此时n=2，传值1</li>
    <li>传值2</li>
</ul>

&emsp;&emsp;由此可见，上面的代码还能写成下面的样子，效果是一样的：

```c
int main() {
    int n = 0;
    n += 1;
    printf("%d ", n);
    int temp = n;
    n += 1;
    printf("%d %d", temp, n);
    return 0;
}
```

# 函数&指针解法

&emsp;&emsp;**没学过相关内容的小伙伴可以跳过这个部分**

&emsp;&emsp;接下来我们用函数的形式再次把上面的代码写一遍，为了节省篇幅就把函数写在上面了：

```c
/* ++i */
int increaseAndReturn(int *value) {
    *value += 1;
    return *value;
}

/* i++ */
int returnAndIncrease(int *value) {
    int temp = *value;
    *value += 1;
    return temp;
}

int main() {
    int n = 0;
    printf("%d %d %d", increaseAndReturn(&n), returnAndIncrease(&n), n);
    return 0;
}
```





