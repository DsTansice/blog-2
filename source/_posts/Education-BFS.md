---
title: Education BFS
top_img: false
cover: 'https://image.kmar.top/bg/b33.jpg!/fw/550'
categories:
  - C/C++
tags:
  - 题解
  - BFS
abbrlink: 14c61bca
date: 2022-01-16 11:09:01
description: 这道题不是特别难，但是网上我没有找到讲的清晰易懂的题解，所以我就再写一篇吧。
---

## 注意

&emsp;&emsp;该博客是为了帮助同学学习，并非为了协助同学刷题，请读者保持自觉，**请勿做CV工具人**。另外为了节省篇幅，代码中不再写明`#include`，如果遇到我没有声明的函数，那么就是某一个头文件中的函数，读者搜索“`c` + 函数名字”就能查到相关信息。

## 题目

&emsp;&emsp;[点击查看原题](https://codeforces.com/problemset/problem/1512/F)

{% p blue center, 题目翻译由<a href="https://www.chivas-regal.top/" target="_blank">@ZYZ</a>倾情提供 %}

&emsp;&emsp;OHgg 想要买一个价值`c`元的电脑，于是他决定去公司打工赚钱。

&emsp;&emsp;在这个公司中一共有`n`种职位，并且这些职位的等级被命名为从 1 开始的整数。一位职位等级`i`的员工一天可以赚`a[i]`元。职位等级所代表的数值越高，取得的报酬就会越高。最初， OHgg 的职业等级为 1，并且他有 0 元。

&emsp;&emsp;每天 OHgg 都可做以下两件事中的任何一个：

+ 如果 OHgg 此时的职业等级为`x`，那么他就可以赚取 a[x] 元。
+ 如果 OHgg 此时的职业等级为`x`(`x < n`) ，并且他手头至少有 b[x] 元，那么他就可以花费 b[x] 元，通过学习网上课程然后职业等级升值到`x + 1`。

&emsp;&emsp;例如，如果n = 4, c= 15, a = [1 ,3 ,10 ,11],b=[1 ,2 ,7]n=4,c=15,a=[1,3,10,11],b=[1,2,7] , OHgg 可以这样做：

1. 第一天， OHgg 待在 1 号位置，然后选择赚取 1 元，现在他有 1 元。
2. 第二天， OHgg 待在 1 号位置，然后选择升值到 2 号位置，现在他有 0 元。
3. 第三天， OHgg 在 2 号位置，他选择赚取 3 元，此时他有 3 元。
4. 第四天， OHgg 在 2 号位置，他选择升值到 3 号位置，现在他有 1 元。
5. 第五天， OHgg 在 3 号位置，他选择赚取 10 元，此时他有 11 元。
6. 第六天， OHgg 在 3 号位置，他选择赚取 10 元，此时他有 21 元。

&emsp;&emsp;她一共花费了 6 天，然后可以买一台自己想要的电脑。

&emsp;&emsp;所以你的任务是帮助 OHgg 知道最少需要几天才能买到电脑。

### 输入格式

&emsp;&emsp;第一行有一个整数`t`，然后有`t`个样例。

&emsp;&emsp;每个样例第一行有两个整数`n`、`c`(2 ≤ 10<sup>5</sup>, 1 ≤  10<sup>9</sup>)，`n`和`c`分别为职位的个数，以及电脑费用。

&emsp;&emsp;第二行是`n`个整数，a[1] ≤ a[2] ≤ ... ≤ a[n] ( 1 ≤ a[i] ≤ 10<sup>9</sup>)

&emsp;&emsp;第三行是`n - 1`个整数，b[1]、b[2]、b[3]……b[n-1](1 ≤ b[i] ≤  10<sup>9</sup>)

&emsp;&emsp;(保证所有样例的`n`的总和不会超过 2×10<sup>5</sup>)

### 输出格式

&emsp;&emsp;对于每个样例，输出 OHgg 要想买到心仪的电脑至少需要几天。

### 样例输入

> 3
> 4 15
> 1 3 10 11
> 1 2 7
> 4 100
> 1 5 10 50
> 3 14 12
> 2 1000000000
> 1 1
> 1

### 样例输出

> 6
> 13
> 1000000000

## 题解

&emsp;&emsp;这种题贪心肯定是不可以的，因为很明显如果使用贪心那么我们永远不会选择升级。那么剩下的选择就是DP或者搜索了，DP没有搜索好写，所以我们先来考虑使用搜索。

&emsp;&emsp;使用搜索那么无非就是DFS、BFS，emm，好像两种都可以，我们两种代码都给出来，读者自行查阅吧。

{% tabs tj %}

<!-- tab BFS -->
```c++
struct info {
	int step;
	int money;
	int level;
	info(int a, int b, int c) : step(a), money(b), level(c) {}
};

int profit[200000];
int upgrade[200000];
int n;

int task(int dist) {
	queue<info> record;
	record.emplace(0, 0, 0);
	int ans = INT_MAX;
	do {
		info now = record.front();
		record.pop();
		if (now.step >= ans) continue;
		if (now.money >= dist) {
			ans = min(ans, now.step);
			continue;
		}
		if (now.money >= upgrade[now.level]) {
			record.emplace(now.step + 1, now.money - upgrade[now.level], now.level + 1);
			int dif = dist - now.money;
			int step = dif / profit[now.level];
			if (dif % profit[now.level] != 0) ++step;
			ans = min(ans, now.step + step);
		} else {
			int target = min(dist, upgrade[now.level]);
			int dif = target - now.money;
			int step = dif / profit[now.level];
			if (dif % profit[now.level] != 0) ++step;
			record.emplace(step + now.step, now.money + step * profit[now.level], now.level);
		}
	} while (!record.empty());
	return ans;
}

int main() {
	int t, dist;
	cin >> t;
	while (t--) {
		scanf("%d %d", &n, &dist);
		for (int i = 0; i != n; ++i) scanf("%d", &profit[i]);
		for (int i = 0; i != n - 1; ++i) scanf("%d", &upgrade[i]);
		upgrade[n - 1] = INT_MAX;
		printf("%d\n", task(dist));
	}
	return 0;
}
```
<!-- endtab -->

<!-- tab DFS -->
```c++
struct info {
	int step;
	int money;
	int level;
	info(int a, int b, int c) : step(a), money(b), level(c) {}
};

int profit[200000];
int upgrade[200000];
int n;

int task(int dist) {
	stack<info> record;
	record.emplace(0, 0, 0);
	int ans = INT_MAX;
	do {
		info now = record.top();
		record.pop();
		if (now.step >= ans) continue;
		if (now.money >= dist) {
			ans = min(ans, now.step);
			continue;
		}
		if (now.money >= upgrade[now.level]) {
			record.emplace(now.step + 1, now.money - upgrade[now.level], now.level + 1);
			int dif = dist - now.money;
			int step = dif / profit[now.level];
			if (dif % profit[now.level] != 0) ++step;
			ans = min(ans, now.step + step);
		} else {
			int target = min(dist, upgrade[now.level]);
			int dif = target - now.money;
			int step = dif / profit[now.level];
			if (dif % profit[now.level] != 0) ++step;
			record.emplace(step + now.step, now.money + step * profit[now.level], now.level);
		}
	} while (!record.empty());
	return ans;
}

int main() {
	int t, dist;
	cin >> t;
	while (t--) {
		scanf("%d %d", &n, &dist);
		for (int i = 0; i != n; ++i) scanf("%d", &profit[i]);
		for (int i = 0; i != n - 1; ++i) scanf("%d", &upgrade[i]);
		upgrade[n - 1] = INT_MAX;
		printf("%d\n", task(dist));
	}
	return 0;
}
```
<!-- endtab -->

{% endtabs %}

&emsp;&emsp;`main`里面写了一句`upgrade[n - 1] = INT_MAX`是将最后一级的升级花费设为最大，这样子搜索的时候就不用处理无法升级的情况了，因为最后一级升级的花费太大了。

&emsp;&emsp;代码没有采用一步一步模拟的情况，因为在次数多的时候一步一步模拟必然会超时，所以我们一次性计算出当前步骤的结果即可。

&emsp;&emsp;对于每一步我们都有两种选择：

+ 不升级，获取当前奖励
+ 升级，花费指定数量的钱

&emsp;&emsp;如果我们的钱不够升级那么我们就只剩一种选择，现在我们来说一说怎么省掉中间的模拟步骤的。

&emsp;&emsp;首先，如果我们的钱够升级，那么我们就要从两种选择里面选出一个，如果我们选择升级，那么升级后继续模拟即可；如果我们选择不升级，不难看出我们要一直保持不升级这个策略，如果后面再选择升级和在这里选择升级是一样的。

&emsp;&emsp;其次，对于我们的钱不够升级的情况，我们不能向前面那样直接计算到结束。因为我们后面可能会采取升级的选择，所以我们应当设置一个短期目标，这个短期目标是总体目标和下一次升级所需要的钱中的最小值。

&emsp;&emsp;这样，问题就迎刃而解了（仔细想一下这么写出来的BFS好像也不是完全的BFS了{% inlineimage https://image.kmar.top/icon/bili/guilian.png %}）。

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}
