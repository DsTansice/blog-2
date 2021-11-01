---
title: 指针&数组
date: 2021-11-01 10:27:06
categories:
  - C/C++
tags:
  - 教程
  - 数组
  - 指针
cover: https://cdn.jsdelivr.net/gh/EmptyDreams/resources/bg/b16.jpeg
description: 什么是指针？指针和数组的关系是什么？
---


{% tip warning faa-horizontal animated %}本篇博客内容有待论证，如果不是前来查误的请勿阅读！{% endtip %}

<div class="text" style=" text-align:center;"><font size="4px" font color="#66ccff">本篇博客所指的所有内存均不区分高级缓存、内存、虚拟内存</font></div>

<div class="text" style=" text-align:center;"><font size="2px" font color="#66ccff">本篇博客也不会单独讲解数组，阅读之前请确保自己已经掌握了数组的基本内容</font></div>

# 内存

<div class="text" style=" text-align:center;"><font size="2px" font color="#66ccff">这里只是对内存简单并片面的进行了简单的介绍，更多内容还请自行搜索</font></div>

&emsp;&emsp;说到指针，肯定无法和内存扯上关系。从硬件层面来说，内存是用来临时（断电丢失数据）存储数据的高速存储设备。从软件层面来说，内存相当于一个容量巨大的一维数组，下标从`0`开始，依次向后排列，这个下标也就是我们经常说的“内存地址”。

&emsp;&emsp;需要注意的是，实际开发中（仅限于win10平台，win从什么版本开始这个设计和其它平台的我不清楚）所有程序的内存地址都是从`0`开始的，这是因为操作系统为了安全性考虑没有将真实的内存地址暴露给程序，程序访问到的是其实是一个虚拟的内存地址，程序的内存地址表示的是该内存在操作系统给程序分配的内存空间中的位置。

# 指针

## 本质

&emsp;&emsp;指针的声明方法如下（格式：[类型] *[变量名]）：

```c
int *i;
double *d;
void *v;
```

&emsp;&emsp;读者可能会好奇，为什么可以声明一个类型为`void`的变量？这就涉及到指针的本质了。指针（不论什么类型的指针）实际上是一个整形数据，其中存储的是它指向的量的内存地址。`void *v`表示指向一个数据类型未知的量的内存地址。

## 空指针

&emsp;&emsp;C/C++中提供了一个值：`NULL`，该值用于表示当前指针为空值，即没有指向任意有效的内存。一般情况下，当当前指针不可用时，推荐手动将其赋值为`NULL`，以防后面不小心再次使用。

## 指针是数据类型吗

&emsp;&emsp;很多人可能会疑惑下面两种写法哪一种正确：

```C
int *arg0;
int* arg0;
```

&emsp;&emsp;这两种声明方式放在程序中都可以正常编译并运行，但是假如我们要声明三个指针，下面两种方法哪种正确呢？

```C
int *a0, *a1, *a2;
int* b0, b1, b2;
```

&emsp;&emsp;现在情况发生了变化，其中一种写法会导致编译错误（指使用时报错，而非声明时报错）或运行错误（如果编译通过了的话），读者可以先自行尝试一下。

&emsp;&emsp;这两种方法中第二种方法实际上声明了一个指针变量`b0`和两个`int`变量`b1`、`b2`。写出这样的代码明显是将指针当作了一种数据类型来处理，但是实际上指针并不是一种数据类型，`*`只是告诉编译器，这个变量存储的是一个地址，而不是告诉编译器这是一个指针类型。

&emsp;&emsp;由此可见，我们应该使用`*`与变量名贴在一起的写法，同时还可以得知**指针不是数据类型**。

## 指针加法

&emsp;&emsp;指针的加法和数字的加法不同，我们知道，不同类型的数据的长度是不一样的，以`64位`电脑为例，`int`为`32位/4字节`，`char`为`8位/1字节`。指针的加法会根据类型的不同而变化，比如对于`int *a0`，`a0 + 1`返回的实际上是`a0`所指向的地址再加`4`的结果。简单说就是指针`+1`的结果是当前地址+数据类型长度的结果。

&emsp;&emsp;由此我们可以得到如下公式：`point + k -> point + (k * sizeof(type))`，其中`point`是指针对象，`k`是要加的数字，`type`是数据类型。需要注意的是，这个转换编译器已经帮我们完成，我们使用的时候只需要用左边的写法就可以了。

# 指针和数组

## 一维（一级）

### 数组

&emsp;&emsp;我们写出如下代码：

```C
int array[10];
int *arrayPoint = array;
```

&emsp;&emsp;可以知道，我们通过`arrayPoint`来访问数组是完全没有问题的，因为标准规定，数组名存储的是数组中第一个元素的内存地址。所以我们可以把数组看作一种**另类的指针**（注意是另类的指针而并不是指针）。调用函数并传递数组进去也不会把数组复制一遍，而是传递数组中第一个元素的地址。

### 指针

&emsp;&emsp;那么我们如何用指针来表示数组呢？如下面的代码：

```C
int *array = malloc(10 * sizeof(int));
```

&emsp;&emsp;`malloc`在堆分配了一个长度为`10 * sizeof(int)`的内存空间，并且返回这段内存的启示位置的地址。由此可知，我们将数组的地址存储到了`array`中，实际的内容分配到了堆中。结构如下：

![指针](https://cdn.jsdelivr.net/gh/EmptyDreams/resources/point/op.png)



## 二维（二级）

&emsp;&emsp;有了上面的结论，我们可以写下这样子的代码：

```
int array[10][10];
int **arrayPoint = array;
```

&emsp;&emsp;经过测试可以发现，这段代码无法通过编译，为什么呢？因为数组名只是一种另类的指针，而非指针，它和指针其实完全不是一种东西。

### 指针

&emsp;&emsp;声明指针形式的二维数组的方法如下：

```C
int **arrayPoint = malloc(3 * sizeof(int*));
for (int i = 0; i < 3; ++i) {
    arrayPoint[i] = malloc(3 * sizeof(int));
}
```

&emsp;&emsp;其内存结构如下：

![内存结构](https://cdn.jsdelivr.net/gh/EmptyDreams/resources/point/tp.png)

&emsp;&emsp;这里解释一下为什么会这样。首先，我们在栈中存储了数组的地址。然后为数组分配了一个内存空间，这里要注意，我们分配空间的时候先使用`malloc`分配了一个长度为`3 * sizeof(int*)`的空间，随后再遍历这个一维数组，继续分配二维空间。可以理解为我们创建了四个数组，其中一个用于存储剩余数组的起始内存地址。

### 数组

```C
int arr1[9];
int arr2[3][3];
```

&emsp;&emsp;我们来看一下数组的内存结构（数组声明在函数中且不是`static`就存在栈中，否则在堆中）：

![二维数组内存结构](https://www.linuxidc.com/upload/2015_03/15031621526830.png)

<div class="text" style=" text-align:center;"><font size="2px" font color="#66ccff">该图片引用自：https://www.linuxidc.com/Linux/2015-03/115055.htm，侵删</font></div>

### 小结

&emsp;&emsp;对比内存结构我们发现，一维数组可以通过指针进行操作完全是因为两者的内存结构“凑巧”一样而已，而到了二维（或更高）层次后，两者内存结构的区别便凸显了出来，所以显然是不能够共用的。

&emsp;&emsp;那么如果我非要用指针的形式表示二维数组应该怎么声明呢？

```C
int array[10][10];

int *p1[10] = array;		//1
int (*p2)[10] = array;		//2
```

---

&emsp;&emsp;我们先来分析一下这两种写法的区别：

#### *[] - 指针数组

&emsp;&emsp;指针数组实际上是一个数组，其中存储了一些指针的值，内存结构如下：

<div class="text" style=" text-align:center;"><font size="2px" font color="#66ccff">该图来自网络，侵删</font></div>

![指针数组](https://dwz.date/fhdr)

#### (*)[] - 数组指针

&emsp;&emsp;数组指针实际上是一个指针，指针指向数组所在的内存地址，内存结构如下：

<div class="text" style=" text-align:center;"><font size="2px" font color="#66ccff">该图来自网络，侵删</font></div>

![指针数组](https://dwz.date/fhdq)

---

&emsp;&emsp;现在，已知上面两种写法其中一种是正确的，读者可以尝试根据这两种内存结构推理一下哪一种是可以通过编译的。

&emsp;&emsp;答案是第二种，为什么呢？我们将二维数组带入进去可以发现，第二种写法只是存储了数组中第一个元素的地址，这和二维数组的内存结构是一致的，所以可以正确运行。而第一种写法其实其内存结构和二级指针构成的数组大差不差。

# 参考资料

>[C语言中的二级指针和二维数组问题](https://www.linuxidc.com/Linux/2015-03/115055.htm)
>
>[C语言中指针和数组](https://www.cnblogs.com/downey-blog/p/10469906.html)
>
>[数组指针和指针数组的区别](https://dwz.date/fhdp)













