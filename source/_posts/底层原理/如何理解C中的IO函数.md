---
title: 如何理解c/c++中的输入/输出函数？
top_img: false
categories:
  - C/C++
tags:
  - 函数
  - IO
cover: 'https://image.kmar.top/bg/b9.jpg!/fw/550'
description: 简要讲解控制台输入/输出的相关内容
abbrlink: 51c9b0a0
date: 2021-09-27 21:16:36
---

## scanf的使用

&emsp;&emsp;`scanf`声明在`stdio.h`头文件中，其声明为` int scanf(const char \*format, ...)`。从声明可以看出，`scanf`接收如下参数：

<ol>
    <li>字符串：用于确定输入数据的类型</li>
    <li>变长参数：用于输入需要进行写入的变量的地址</li>
</ol>

&emsp;&emsp;其返回值为int类型，值为成功匹配和赋值的个数，如果到达文件末尾或发生读错误，则返回`EOF`。

&emsp;&emsp;对于`scanf`的变长参数，等后面指针专题再讨论这个问题，现在只需要知道传参时非数组、指针类型需要在变量名前面加上`&`。

### EOF

&emsp;&emsp;`EOF`是`End Of File`的缩写，通常在文本最后由该字符表示结束。该值一般为`-1`，但是在不同编译器中该值的定义可能不同，不过不用担心，C在`stdio.h`中已经通过宏的方式定义了该常量。


### 示例

```C
#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    return 0;
}
```


## printf的使用


&emsp;&emsp;`printf`也声明在`stdio.h`头文件中，其声明为`int printf(const char *format, ...)`。从声明可以看出，`printf`接收如下参数：

<ol>
    <li>字符串：用于确定输出数据的类型</li>
    <li>变长参数：用于输入需要打印的数据</li>
</ol>

&emsp;&emsp;其返回值为int类型，值为写入的字符总数，如果写入失败则返回一个负数。

### 示例

```C
#include <stdio.h>

int main() {
    double PI = 3.1415;
    printf("%f", PI);
    return 0;
}
```

## 变长参数

{% p blue center, <small>注：该章节不考虑编译器优化对参数传递方式的影响</small> %}

&emsp;&emsp;变长参数的本质就是一段连续的内存，我们用一个图解释一下：

![变长参数](https://image.kmar.top/posts/rhljczdiohs-0.jpg)

&emsp;&emsp;我们先来了解调用函数时是如何传参的，图中第一个对应的是函数`void example(int arg0, double arg1, short arg2)`的模型，在调用该函数时需要传入三个值，在传递时编译器会将要传入的值复制并排列到一起，然后传递给被调用的函数。函数使用时取用相应位置的内存即可。图中第二个对应的是函数`void example(char arg0[])`，传递方式和上面相同。

&emsp;&emsp;第三个便是我们要说的变长参数，变长参数与普通传参不同的地方就在于传递的参数的数量是任意的，所以大多接受变长参数的函数都需要手动输入一个值表示变长参数的数量。

## 缓冲区

&emsp;&emsp;缓冲区是程序建立的一个内存空间，用于临时存储数据。其工作原理如图所示：（无缓冲输出就是把输入反过来）

![示意图](https://image.kmar.top/posts/rhljczdiohs-1.jpg!/scale/80)

### 缓冲区的意义

&emsp;&emsp;为什么要有缓冲区？根据上图第一个无缓冲输入所示，程序从用户输入中逐个读取数据，在输入较多数据时这无疑是一种费时费力的方法，同时此时用户也无法修改自己输入的内容，因为当键盘敲下的时候数据就被读取了。有了缓冲区之后，不仅使用户可以修改自己输入的数据（按下回车之前的），同时也让程序可以成段的读取数据，减少了时间成本，输出同理。

&emsp;&emsp;那么无缓冲区的输入/输出就没有用武之地了吗？并不是，例如在写控制台游戏时你是希望用户按下键盘时立即执行操作还是等待缓冲区刷新？为了加快游戏对用户输入的处理速度，我们当然会选择无缓冲的输入方式。`stdio.h`中的`stderr`同样使用的无缓冲输出，这样使得错误信息可以更快地打印到控制台，而不用等待缓冲刷新。

&emsp;&emsp;缓冲区的大小取决于操作系统，常见的大小为512字节和4096字节。

&emsp;&emsp;PS：我曾经用C++写过一个贪吃蛇，想试试的可以[点击链接查看](https://dwz.cn/yqe55Kal)，当时还不会用git所以就不要吐槽里面为什么都是压缩包了。还有一个[旧版的演示视频](https://www.bilibili.com/video/BV1Hb411g7i8/)。

### 缓冲区分类

&emsp;&emsp;缓冲区分为两类：完全缓冲I/O和行缓冲I/O。

#### 完全缓冲

&emsp;&emsp;完全缓冲是指只有当缓冲区被填满或手动触发缓冲区刷新时才会刷新缓冲区（即将数据内容发送至目的地），这种缓冲方式通常出现在文件I/O操作中。

#### 行缓冲

&emsp;&emsp;行缓冲与完全缓冲不同的是其遇到换行符时便会刷新缓冲，键盘输入通常是行缓冲的方式，所以在摁下Enter键时程序才会开始处理数据。

### 缓冲区刷新方式

&emsp;&emsp;除了上面提到的自动刷新缓冲区的方式，我们还可以使用代码强制刷新缓冲区，即`stdio.h`中的`int fflush(FILE *stream)`函数。该函数的参数是需要刷新缓冲区的流（标准输入流是：stdin，标准输出流是：stdout，标准错误输出流是：stderr）。C++中还能使用`endl`换行并刷新缓冲区。

## 有缓冲输入/输出

&emsp;&emsp;平时我们使用的`scanf`和`printf`默认情况下都是有缓冲的。`scanf`和`printf`中都有一个字符串和变长参数作为参数，那么这个字符串的作用是什么呢？这个字符串是对要输入/输出的内容的描述，其中`%*`被称为“转换说明”，`%`与`*`之间的是转换说明修饰符。

### 参数说明

#### 转换说明

![转换说明](https://image.kmar.top/posts/rhljczdiohs-2.jpg!/scale/67)

#### printf修饰符

![修饰符](https://image.kmar.top/posts/rhljczdiohs-3.jpg!/scale/67)

#### printf标记

![标记](https://image.kmar.top/posts/rhljczdiohs-4.jpg!/scale/67)

#### scanf修饰符

![修饰符](https://image.kmar.top/posts/rhljczdiohs-5.jpg!/scale/67)

#### printf与scanf中的`*`修饰符

&emsp;&emsp;`printf`和`scanf`的修饰符中都可以使用`*`，但是他们的语义并不相同，我们写一段代码试一下：

```c
#include <stdio.h>

int main() {
    int temp, width;
    scanf("%*d %d %*d %d", &temp, &width);
    printf("result:%0*d", width, temp);
    return 0;
}
```

&emsp;&emsp;我们现在来模拟一下程序运行（`| `不是实际内容，只是为了分割文字介绍与程序内容）：

```
控制台输入：		| 654 12 5689 20
scanf读取：		| 654 12 5689 20
赋值：			| temp = 12, width = 20
printf解析字符串：	| result:%020d
printf打印：		| 00000000000000000012
```

&emsp;&emsp;这里就能看出来规律了，`scanf`中使用`*`会让scanf跳过对该项的赋值，但是输入时仍需要输入该项。`printf`中使用`*`可以在运行时决定填入的数字为多少（示例中只替换了一个数，实际操作中任意数字型的修饰符都可以用`*`替换）。

### 注意事项

&emsp;&emsp;使用`scanf`与`printf`时一定要注意字符串内容要与参数列表相对应，否则轻则程序崩溃，重则带着错误信息继续运行（为什么说继续运行更严重呢，因为直接崩溃更容易定位错误位置）。为什么会这样呢？我们再回顾一下函数处理变长参数的方式：按照数据类型分割内存。

&emsp;&emsp;但是这两个函数的变长参数列表传递进去的类型是任意的，所以无法直接判断应该从哪个地方分割内存。这时候字符串里面的信息就派上用场了，它可以告诉函数这个地方传递进去的值是什么类型。如果我们本应该输入`%d %d %d`但是却输入了`%d %lf %d`，那么从第二项开始，后面的所有项都会被错误的读取。

## 无缓冲输入

&emsp;&emsp;许多编译器都为无缓冲输入提供了特殊的函数，其原型都在`conio.h`中。在继续向下说之前我们再来说一下“回显”是什么。回显是当用户敲击键盘时在控制台显示用户输入的内容，无回显输入在使用时不会在控制台显示用户输入，这通常用来实现密码输入的功能。

&emsp;&emsp;在`conio.h`提供的函数中，包括有回显无缓冲的`getchar()`、无回显无缓冲的`getch()`。在UNIX系统中使用另一种控制方式，UNXI系统使用`ioctil()`函数（该函数在UNIX库中但并不属于ANSI C）控制输入类型，然后使用`getchar()`进行操作。在ANSI C中则使用`setbuf()`和`setvbuf()`函数控制缓冲，但是受限于系统的内部设置，这些函数可能不起作用。总而言之就是ANSI C没有提供无缓冲输入的标准方式，能否进行无缓冲输入取决于操作系统。

## putchar

&emsp;&emsp;`putchar`在标准中没有定义有无缓冲，所以在不同编译器（甚至是同一个编译器的不同版本）中都可能会有不同的结果。注意下面这段代码：

```C
#include <stdio.h>
#include <stdlib.h>

int main() {
    putchar('a');
    system("pause");
    return 0;
}
```

&emsp;&emsp;在`GCC 4.9.2`中该代码得到下面的结果：

```
a请按任意键继续。。。
```

&emsp;&emsp;而在`GCC 8.1.0`中则得到下面的结果：

```
请按任意键继续。。。

a
```

---

## 参考资料

>1. 《C Primer Plus》相关章节
>2. 菜鸟教程相关章节：[1](https://www.runoob.com/cprogramming/c-function-printf.html)、[2](https://www.runoob.com/cprogramming/c-function-scanf.html)
>3. [c语言里缓冲区的理解-CSDN博客](https://blog.csdn.net/qq_36532097/article/details/70197061)