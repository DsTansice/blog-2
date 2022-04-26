---
title: SDOI-排列计数题解
top_img: false
cover: 'https://image.kmar.top/bg/b34.jpg!/fw/550'
categories:
  - C/C++
tags:
  - 题解
  - 排列组合
description: SDIO-2016的排列计数的题解，这道题懂的难度不高，不懂的是相当地费脑子，可以说是相当符合“会者不难，难者不会”这句话了。
abbrlink: 7a08ed15
date: 2022-01-17 22:34:06
---

## 注意

&emsp;&emsp;该博客是为了帮助同学学习，并非为了协助同学刷题，请读者保持自觉，**请勿做CV工具人**。另外为了节省篇幅，代码中不再写明`#include`，如果遇到我没有声明的函数，那么就是某一个头文件中的函数，读者搜索“`c` + 函数名字”就能查到相关信息。

## 题目

&emsp;&emsp;求有多少种长度为`n`的序列 ，满足以下条件：

+ `1 ∼ n`这`n`个数在序列中各出现了一次；
+ 若第`i`个数<code>A<sub>i</sub></code>的值为`i`，则称`i`是稳定的。序列恰好有`m`个数是稳定的

&emsp;&emsp;满足条件的序列可能很多，序列数对 10<sup>9</sup> + 7 取模。

### 输入格式

&emsp;&emsp;第一行一个数`T`，表示有`T`组数据。

&emsp;&emsp;接下来`T`行，每行两个整数`n`、`m`。

### 输出格式

&emsp;&emsp;输出`T`行，每行一个数，表示求出的序列数。

### 样例输入

> 5
> 1 0
> 1 1
> 5 2
> 100 50
> 10000 5000

### 样例输出

> 0
> 1
> 20
> 578028887
> 60695423

### 数据范围与提示

+ 测试点 1 ~ 3：T = 1000，`n` ≤ 8，`m` ≤ 8
+ 测试点 4 ~ 6：T = 1000，`n` ≤ 12，`m` ≤ 12
+ 测试点 7 ~ 9：T = 1000，`n` ≤ 100，`m` ≤ 100
+ 测试点 10 ~ 12：T = 1000，`n` ≤ 1000，`m` ≤ 1000
+ 测试点 13 ~ 14：T = 500000，`n` ≤ 1000，`m` ≤ 1000
+ 测试点 15 ~ 20：T = 500000，`n` ≤ 1000000，`m` ≤ 1000000

## 思路

&emsp;&emsp;首先根据题意，我们先整出来这么个东西：

```c++
typedef unsigned long long LL;

const int mod = 1e9 + 7;
```

&emsp;&emsp;这道题一看就是个数学题，不难看出来每个数据的计算方式：

{% p center, [从n个里面选出m个的数量] * [剩余n - m个数的排列数量] %}

&emsp;&emsp;计算方法知道了，剩下的就是如何计算的问题了。计算组合数无非就是三种方法：

1. 杨辉三角形
2. C(n, m) = C(n - 1, m) + C(n - 1, m - 1)
3. C(n, m) = (n!) / (m!) / ((n - m)!)

&emsp;&emsp;由于数据范围很大，所以杨辉三角的空间消耗和递推公式的时间消耗都是我们无法承受的，所以我们只能从第三个公式上入手。

&emsp;&emsp;首先不难想到把阶乘的结果提前算出来：

```c++
LL factorial[1000001];

void init() {
    factorial[0] = 1;
	for (int i = 1; i != 1000001; ++i) {
		factorial[i] = (factorial[i - 1] * i) % mod;
	}
}
```

&emsp;&emsp;但是接下来我们发现了一个问题，计算公式中包含除法，在有除法的情况下，中间取余就会使得结果不正确。（比如：(100 / 50) % 10 != ((100 % 10) / (100 % 10))）

&emsp;&emsp;那么我们如何得出正确答案呢？这里直接引用[@ZYZ 大佬](https://www.chivas-regal.top/)的结论：<small>（别问，问就是我也不会）</small>

{% p center, C(n&#44; m) = ((n! * (m!)<sup>mod - 2</sup>) % mod * ((n - m)!)<sup>mod - 2</sup>) % mod %}

{% p blue center, (据说是用基于欧拉定理的费马小引理推出来的) %}

&emsp;&emsp;那么，我们就能得到这个公式：

{% p center, result = C(n&#44; m) * (n - m)! %}

&emsp;&emsp;但是等等！我们发现这个公式算出来的结果比答案要大，所以我们一定哪里搞错了。计算剩余的数字的排列数量真的可以直接套用`(n - m)!`吗？显然是不可以的，因为所有的排列可能中我们应当去除包含稳定数的情况。

&emsp;&emsp;这样看来我们计算后半部分有两种方法，正着算和倒着算。

&emsp;&emsp;倒着算是否可行我没有仔细研究，知道的小伙伴可以在评论区发一下。我们这里就只说正着算怎么算了，直接给出代码：

```c++
LL space[1000001];

void init() {
    space[0] = 1;
	for (int i = 1; i != 1000001; ++i) {
		space[i] = (i * space[i - 1] + ((i - 1) * space[i - 2])) % mod;
	}
}
```

&emsp;&emsp;其中，`space[i]`表示`i + 1`个数字（其中有一个数字放在任何位置都可以，其它数字不能放在其对应的位置上）有多少种排列方式。那么`i`个数字的排列数量就是`(i - 1) * space[i - 2]`。

&emsp;&emsp;知道`space[i]`的含义后再来看这个递推公式就不难理解了。

&emsp;&emsp;到这里，整道题就基本解出来了，剩下补出需要的代码即可。

## 题解

```c++
typedef unsigned long long LL;

const int mod = 1e9 + 7;

LL factorial[1000001];
LL space[1000001];

LL ksm(LL a, LL b) {
	LL result = 1;
	while (b) {
		if (b & 1) result = (result * a) % mod;
		a = (a * a) % mod;
		b >>= 1;
	}
	return result;
}

void init() {
    factorial[0] = 1;
	space[0] = 1;
	for (int i = 1; i != 1000001; ++i) {
		factorial[i] = (factorial[i - 1] * i) % mod;
		space[i] = (i * space[i - 1] + ((i - 1) * space[i - 2])) % mod;
	}
}

int main() {
	init();
	int t, n, m;
	cin >> t;
	while (t--) {
		scanf("%d %d", &n, &m);
		if (n == m) {
			printf("1\n");
		} else if (m == 0) {
			printf("%llu\n", (n - 1) * space[n - 2] % mod);
		} else {
			LL cnm = factorial[n] * ksm(factorial[m], mod - 2) % mod
			         * ksm(factorial[n - m], mod - 2) % mod;
			LL result = cnm * (n - m - 1) % mod * space[n - m - 2] % mod;
			printf("%llu\n", result);
		}
	}
	return 0;
}
```