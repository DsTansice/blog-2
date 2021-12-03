---
title: 2021年天梯赛（热身赛）详细题解
top_img: false
toc_number: false
cover: 'https://image.emptydreams.xyz/bg/b23.jpg!/fxfn2/550x500'
date: 2021-12-02 22:07:01
categories:
  - C/C++
tags:
  - 题解
  - PTA
  - 教程
description: PTA-2021年郑轻新生团体程序设计天梯赛（热身赛）详细题解
---

# 注意

&emsp;&emsp;该博客是为了帮助同学学习，并非为了协助同学刷题，请读者保持自觉，**请勿做CV工具人**。另外为了节省篇幅，代码中不再写明`#include`，如果遇到我没有声明的函数，那么就是某一个头文件中的函数，读者搜索“`c` + 函数名字”就能查到相关信息。

&emsp;&emsp;后面几道难题采用了`C++`进行编写，题解中会给出网上的`C`语言解法（如果找得到的话），特别简单的题只给出代码。本次题解的题干由探姬姐姐负责抄写，本人负责格式化和编写题解。

---

# 简单题

&emsp;&emsp;这次真的没骗你 —— 这道超级简单的题目没有任何输入。<br />你只需要在一行中输出事实：`This is a simple problem.` 就可以了。

## 输入样例：

> 无

## 输出样例：
> This is a simple problem.

## 题解

```c
int main() {
    printf("This is a simple problem.");
    return 0;
}
```

# A乘以B

&emsp;&emsp;看我没骗你吧 —— 这是一道你可以在10秒内完成的题：给定两个绝对值不超过100的整数`A`和`B`，输出`A`乘以`B`的值。

## 输入格式：

&emsp;&emsp;输入在第一行给出两个整数`A`和`B`(−100≤`A`, `B`≤100)，数字间以空格分隔。

## 输出格式：

&emsp;&emsp;在一行中输出`A`乘以`B`的值。

## 输入样例：

> -8 13

## 输出样例：

> -104

## 题解

```c
int main() {
    long long a, b;
    scanf("%lld %lld", &a, &b);
    printf("%lld", a * b);
    return 0;
}
```

# 打折

&emsp;&emsp;去商场淘打折商品时，计算打折以后的价钱是件颇费脑子的事情。例如原价 ￥988，标明打 7 折，则折扣价应该是 `￥988 x 70% = ￥691.60`。本题就请你写个程序替客户计算折扣价。

## 输入格式：

&emsp;&emsp;输入在一行中给出商品的原价（不超过1万元的正整数）和折扣（为[1, 9]区间内的整数），其间以空格分隔。

## 输出格式：

&emsp;&emsp;在一行中输出商品的折扣价，保留小数点后 2 位。

## 输入样例：

> 988 7结尾无空行

## 输出样例：

> 691.60

## 题解

```c
int main() {
    double money;
    int k;
    scanf("%lf %d", &money, &k);
    money = money * k / 10;
    printf("%.2f", money);
    return 0;
}
```

# 后天

&emsp;&emsp;如果今天是星期三，后天就是星期五；如果今天是星期六，后天就是星期一。我们用数字1到7对应星期一到星期日。给定某一天，请你输出那天的“后天”是星期几。

## 输入格式：

&emsp;&emsp;输入第一行给出一个正整数`D`（1 ≤ `D` ≤ 7），代表星期里的某一天。

## 输出格式：

&emsp;&emsp;在一行中输出`D`天的后天是星期几。

## 输入样例：

> 3

## 输出样例：

> 5

## 题解

```c
int main() {
    int day;
    scanf("%d", &day);
    day += 2;
    if (day > 7) day -= 7;
    printf("%d", day);
    return 0;
}
```

# 到底是不是太胖了

&emsp;&emsp;据说一个人的标准体重应该是其身高（单位：厘米）减去`100`、再乘以`0.9`所得到的公斤数。真实体重与标准体重误差在`10%`以内都是完美身材（即 | 真实体重 − 标准体重 | < 标准体重×`10%`）。已知市斤是公斤的两倍。现给定一群人的身高和实际体重，请你告诉他们是否太胖或太瘦了。

## 输入格式：

&emsp;&emsp;输入第一行给出一个正整数`N`（≤ 20）。随后`N`行，每行给出两个整数，分别是一个人的身高`H`（120 < `H` < 200；单位：厘米）和真实体重`W`（50 < `W` ≤ 300；单位：市斤），其间以空格分隔。

## 输出格式：

&emsp;&emsp;为每个人输出一行结论：如果是完美身材，输出`You are wan mei!`；如果太胖了，输出`You are tai pang le!`；否则输出`You are tai shou le!`。

## 输入样例：

> 3
> 169 136
> 150 81
> 178 155

## 输出样例：

> You are wan mei!
> You are tai shou le!
> You are tai pang le!

## 题解

```c
int main() {
    int n, height;
    double weight;
    scanf("%d", &n);
    bool start = false;
    while (n--) {
        if (start) printf("\n");
        else start = true;
        scanf("%d %lf", &height, &weight);
        weight /= 2;
        double temp = (height - 100) * 0.9;
        if (fabs(temp - weight) < (temp * 0.1)) printf("You are wan mei!");
        else if (weight > temp) printf("You are tai pang le!");
        else printf("You are tai shou le!");
    }
    return 0;
}
```

# 奇偶分家

&emsp;&emsp;给定`N`个正整数，请统计奇数和偶数各有多少个？

## 输入格式：

&emsp;&emsp;输入第一行给出一个正整`N`（≤1000）；第2行给出`N`个非负整数，以空格分隔。

## 输出格式：

&emsp;&emsp;在一行中先后输出奇数的个数、偶数的个数。中间以1个空格分隔。

## 输入样例：

> 9
> 88 74 101 26 15 0 34 22 77

## 输出样例：

> 3 6

## 题解

&emsp;&emsp;这道题我们就点一个点，就是奇偶的判断优化。首先我们明确一个点，就是计算机进行位运算的速度是快于四则及取模运算的。

&emsp;&emsp;类比十进制时我们可以通过数字的尾数来快速的判断是否能被2整除，我们可以得出当二进制位最低位为`0`时表明这是一个偶数，为`1`时为奇数。

&emsp;&emsp;我们可以通过位运算得到一个整数的最低为为什么值：`n & 1`，如果最低位为`0`则表达式的结果为`0`，否则为`1`。

&emsp;&emsp;所以我们可以通过`(n & 1) == 0`（或`n & 1`）来代替`n % 2 == 0`，这样子可以获得更好的性能。

```c
int main() {
    int n, temp;
    scanf("%d", &n);
    int even = 0, odd = 0;
    while (n--) {
        scanf("%d", &temp);
        if ((temp & 1) == 0) ++odd;
        else ++even;
    }
    printf("%d %d", odd, even);
    return 0;
}
```

# 幸运彩票

&emsp;&emsp;彩票的号码有 6 位数字，若一张彩票的前 3 位上的数之和等于后 3 位上的数之和，则称这张彩票是幸运的。本题就请你判断给定的彩票是不是幸运的。

## 输入格式：

&emsp;&emsp;输入在第一行中给出一个正整数`N`（≤ 100）。随后`N`行，每行给出一张彩票的 6 位数字。

## 输出格式：

&emsp;&emsp;对每张彩票，如果它是幸运的，就在一行中输出 `You are lucky!`；否则输出 `Wish you good luck.`。

## 输入样例：

> 2
> 233008
> 123456

## 输出样例：

> You are lucky!
> Wish you good luck.

## 题解

&emsp;&emsp;这道题我们取了一个巧，通过`%1d`来控制每次只读入一位数字，读取三次获取三个位上的数字，这样就不用像`%d`一样先读进来再分割数字，也不用像`%c`一样需要考虑换行符以及要减去`'0'`。

```c
int sum() {
    int temp;
    int result = 0;
    for (int i = 0; i != 3; ++i) {
        scanf("%1d", &temp);
        result += temp;
    }
    return result;
}

int main() {
    int n;
    scanf("%d", &n);
    bool start = false;
    while (n--) {
        if (start) printf("\n");
        else start = true;
        int arg0 = sum();
        int arg1 = sum();
        printf((arg0 == arg1 ? "You are lucky!" : "Wish you good luck."));
    }
    return 0;
}
```

# 大笨钟的心情

![](https://images.ptausercontent.com/8c3b8713-1703-4e56-addb-492f738c3a7c.jpg)

&emsp;&emsp;有网友问：未来还会有更多大笨钟题吗？笨钟回复说：看心情……<br />本题就请你替大笨钟写一个程序，根据心情自动输出回答。

## 输入格式：

&emsp;&emsp;输入在一行中给出 24 个 [0, 100] 区间内的整数，依次代表大笨钟在一天 24 小时中，每个小时的心情指数。<br />随后若干行，每行给出一个 [0, 23] 之间的整数，代表网友询问笨钟这个问题的时间点。当出现非法的时间点时，表示输入结束，这个非法输入不要处理。题目保证至少有 1 次询问。

## 输出格式：

&emsp;&emsp;对每一次提问，如果当时笨钟的心情指数大于 50，就在一行中输出 `心情指数 Yes`，否则输出 `心情指数 No`。

## 输入样例：

> 80 75 60 50 20 20 20 20 55 62 66 51 42 33 47 58 67 52 41 20 35 49 50 63
> 17
> 7
> 3
> 15
> -1

## 输出样例：

> 52 Yes
> 20 No
> 50 No
> 58 Yes

## 题解

```c
int main() {
    int flag[24];
    for (int i = 0; i != 24; ++i)
        scanf("%d", &flag[i]);
    int index;
    bool start = false;
    while (true) {
        scanf("%d", &index);
        if (index < 0 || index > 23) break;
        if (start) printf("\n");
        else start = true;
        printf("%d %s", flag[index], (flag[index] > 50 ? "Yes" : "No"));
    }
    return 0;
}
```

# 数组元素循环右移问题

&emsp;&emsp;一个数组`A`中存有`N`（>0）个整数，在不允许使用另外数组的前提下，将每个整数循环向右移`M`（≥0）个位置，即将`A`中的数据由（A~0~，A~1~⋯A~N−1~）变换为（A~N−M~⋯A~N−1~，A~0~，A~1~⋯A~N−M−1~）（最后`M`个数循环移至最前面的`M`个位置）。如果需要考虑程序移动数据的次数尽量少，要如何设计移动的方法？

## 输入格式:

&emsp;&emsp;每个输入包含一个测试用例，第1行输入`N`（1≤`N`≤100）和`M`（≥0）；第2行输入`N`个整数，之间用空格分隔。

## 输出格式:

&emsp;&emsp;在一行中输出循环右移`M`位以后的整数序列，之间用空格分隔，序列结尾不能有多余空格。

## 输入样例:

> 6 2
> 1 2 3 4 5 6

## 输出样例:

> 5 6 1 2 3 4

## 题解

### 偷懒解法

&emsp;&emsp;这道题虽然题干要求平移数组，但是实际上完全没这个必要，我们只需要修改遍历数组时的起始位点就可以了。

```c
int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    m %= n;     //处理m大于等于n的情况
    int num[n];
    for (int i = 0; i != n; ++i)
        scanf("%d", &num[i]);
    int start = n - m;
    for (int i = start, len = 0; len != n; ++i, ++len) {
        if (i != start) printf(" ");
        if (i == n) i = 0;
        printf("%d", num[i]);
    }
    return 0;
}
```

### 标准解法

&emsp;&emsp;按照移动数组的解法来写的话没想到什么可以避免开新空间用来存数据的方法。开新空间存数据有两种，一种是新建一个独立的数组，另一种是在开需要操作的数组的时候空间多开出移动的位数所需的空间。

```c
int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    m %= n;     //处理m大于等于n的情况
    int num[n + m]; //开大一点的数组用来存数据
    for (int i = 0; i != n; ++i)
        scanf("%d", &num[i]);
    //将数组中的所有数据向后移动m位
    memmove(num + m, num, n * sizeof(int));
    //将超出n范围的数据复制回前面
    memcpy(num, num + n, m * sizeof(int));
    //打印
    for (int i = 0; i != n; ++i) {
        if (i != 0) printf(" ");
        printf("%d", num[i]);
    }
    return 0;
}
```

# 猜数字

&emsp;&emsp;一群人坐在一起，每人猜一个 100 以内的数，谁的数字最接近大家平均数的一半就赢。本题就要求你找出其中的赢家。

## 输入格式：

&emsp;&emsp;输入在第一行给出一个正整数`N`（≤104）。随后`N`行，每行给出一个玩家的名字（由不超过8个英文字母组成的字符串）和其猜的正整数（≤ 100）。

## 输出格式：

&emsp;&emsp;在一行中顺序输出：大家平均数的一半（只输出整数部分）、赢家的名字，其间以空格分隔。题目保证赢家是唯一的。

## 输入样例：

> 7
> Bob 35
> Amy 28
> James 98
> Alice 11
> Jack 45
> Smith 33
> Chris 62

## 输出样例：

> 22 Amy

## 题解

```c
//二维数组存名字
char names[10000][9];
//一维数组存指定人的数字
int value[10000];

int main() {
    double ave = 0;
    int n;
    scanf("%d", &n);
    for (int i = 0; i != n; ++i) {
        scanf("%s %d", names[i], &value[i]);
        ave += value[i];
    }
    ave /= 2 * n;   //计算平均数除以2的值
    double min = 5000;
    int index = -1;
    //寻找最接近的值并存储下标
    for (int i = 0; i != n; ++i) {
        double now = fabs(ave - value[i]);
        if (now < min) {
            min = now;
            index = i;
        }
    }
    printf("%.0f %s", ave, names[index]);
    return 0;
}
```

# 天梯赛的善良

&emsp;&emsp;天梯赛是个善良的比赛。善良的命题组希望将题目难度控制在一个范围内，使得每个参赛的学生都有能做出来的题目，并且最厉害的学生也要非常努力才有可能得到高分。

&emsp;&emsp;于是命题组首先将编程能力划分成了 106 个等级（太疯狂了，这是假的），然后调查了每个参赛学生的编程能力。现在请你写个程序找出所有参赛学生的最小和最大能力值，给命题组作为出题的参考。

## 输入格式：

&emsp;&emsp;输入在第一行中给出一个正整数 `N`（≤2×104），即参赛学生的总数。随后一行给出 `N` 个不超过 106 的正整数，是参赛学生的能力值。

## 输出格式：

&emsp;&emsp;第一行输出所有参赛学生的最小能力值，以及具有这个能力值的学生人数。第二行输出所有参赛学生的最大能力值，以及具有这个能力值的学生人数。同行数字间以 1 个空格分隔，行首尾不得有多余空格。

## 输入样例：

> 10
> 86 75 233 888 666 75 886 888 75 666

## 输出样例：

> 75 3 888 2

## 题解

```c
int main() {
    int min = INT_MAX, minAmount = 0;
    int max = INT_MIN, maxAmount = 0;
    int n, temp;
    scanf("%d", &n);
    while (n--) {
        scanf("%d", &temp);
        if (temp < min) {
            min = temp;
            minAmount = 1;
        } else if (temp == min) ++minAmount;
        if (temp > max) {
            max = temp;
            maxAmount = 1;
        } else if (temp == max) ++maxAmount;
    }
    printf("%d %d\n%d %d", min, minAmount, max, maxAmount);
    return 0;
}
```

# 凯撒密码

&emsp;&emsp;为了防止信息被别人轻易窃取，需要把电码明文通过加密方式变换成为密文。输入一个以回车符为结束标志的字符串（少于80个字符），再输入一个整数`offset`，用凯撒密码将其加密后输出。恺撒密码是一种简单的替换加密技术，将明文中的所有字母都在字母表上偏移`offset`位后被替换成密文，当`offset`大于零时，表示向后偏移；当`offset`小于零时，表示向前偏移。

## 输入格式:

&emsp;&emsp;输入第一行给出一个以回车结束的非空字符串（少于80个字符）；第二行输入一个整数`offset`。

## 输出格式:

&emsp;&emsp;输出加密后的结果字符串。

## 输入样例1:

> Hello Hangzhou 2

## 输出样例1:

> Jgnnq Jcpibjqw

## 输入样例2:

> a=x+y -1

## 输出样例2:

> z=w+x

## 题解

&emsp;&emsp;这段代码中我们说一下`isalpha(out) && (islower(out) == true) == low`。

&emsp;&emsp;首先，`isalpha`是用来判断字符偏移完后还是不是字母，如果偏移后不是字母说明其一定超出了范围，需要减`26`。但是如果在字母范围内并不一定代表其没有超出范围，观察ASCII编码的排列可以知道，大写字母是排在小写字母前面的，且`Z`和`a`的间距小于`26`，我们完全有可能会把一个小写字母偏移成一个大写的，也有可能把一个大写字母偏移为小写的。

&emsp;&emsp;所以必须处理这种情况，这就是后面的代码处理的内容。至于为什么多出来一个`==`，是因为`islower`这一类函数返回值不是严格的`0`为假、`1`为真，以至于`islower`返回的两个真直接`==`判断可能会不相等，通过`==`就可以把值转化为标准的`0 1`表达。

```c
int main() {
    char str[80];
    int offset;
    gets(str);
    cin >> offset;
    offset %= 26;
    int len = strlen(str);
    for (int i = 0; i != len; ++i) {
        if (!isalpha(str[i])) {
            printf("%c", str[i]);
            continue;
        }
        bool low = islower(str[i]) == true;
        char out = (char) (str[i] + offset);
        if (isalpha(out) && (islower(out) == true) == low)
            printf("%c", out);
        else
            printf("%c", offset > 0 ? out - 26 : out + 26);
    }
    cout << endl;
    return 0;
}
```

# 简单计算器

![](https://images.ptausercontent.com/7a19b25d-2a56-49dc-bbc4-698c8b1db505.jpg)

&emsp;&emsp;本题要求你为初学数据结构的小伙伴设计一款简单的利用堆栈执行的计算器。如上图所示，计算器由两个堆栈组成，一个堆栈 S~1~ 存放数字，另一个堆栈 S~2~ 存放运算符。计算器的最下方有一个等号键，每次按下这个键，计算器就执行以下操作：

1. 从 S~1~ 中弹出两个数字，顺序为 n~1~ 和 n~2~；
1. 从 S~2~ 中弹出一个运算符 op；
1. 执行计算 n~2~ op n~1~；
1. 将得到的结果压回 S~1~。

&emsp;&emsp;直到两个堆栈都为空时，计算结束，最后的结果将显示在屏幕上。

## 输入格式：

&emsp;&emsp;输入首先在第一行给出正整数`N`（1<`N`≤103），为 S~1~中数字的个数。

&emsp;&emsp;第二行给出`N`个绝对值不超过 100 的整数；第三行给出`N − 1` 个运算符 —— 这里仅考虑`+`、`-`、`*`、`/`这四种运算。一行中的数字和符号都以空格分隔。

## 输出格式：

&emsp;&emsp;将输入的数字和运算符按给定顺序分别压入堆栈S~1~和S~2~，将执行计算的最后结果输出。注意所有的计算都只取结果的整数部分。题目保证计算的中间和最后结果的绝对值都不超过 109。

&emsp;&emsp;如果执行除法时出现分母为零的非法操作，则在一行中输出：`ERROR: X/0`，其中 `X` 是当时的分子。然后结束程序。

## 输入样例 1：

> 5 40 5 8 3 2
> / * - +

## 输出样例 1：

> 2

## 输入样例 2：

> 5 2 5 8 4 4 * / - +

## 输出样例 2：

> ERROR: 5/0

## 题解

&emsp;&emsp;我们放一个图表来演示计算过程：

![计算过程](https://image.emptydreams.xyz/pta_dry/dot.jpg)

```c
//计算一次值，并把计算后的数据存放在n1的位置
//返回值：
//  bool - 是否发生除零异常
bool task(int* n1, int n2, char op) {
    switch (op) {
        case '+': *n1 += n2; return false;
        case '-': *n1 = *n1 - n2; return false;
        case '*': *n1 *= n2; return false;
        default: {
            if (n2 == 0) return true;
            else *n1 = *n1 / n2;
            return false;
        }
    }
}

int main() {
    int n;
    scanf("%d", &n);
    int s1[n];
    char s2[n - 1];
    for (int i = 0; i != n; ++i) scanf("%d", &s1[i]);
    for (int i = 0; i != n - 1; ++i) {
        getchar();
        scanf("%c", &s2[i]);
    }
    for (int i = n - 1, k = n - 2; i != 0; --i, --k) {
        if (task(&s1[i - 1], s1[i], s2[k])) {
            printf("ERROR: %d/0", s1[i-1]);
            return 0;
        }
    }
    printf("%d", s1[0]);
    return 0;
}
```

# 分而治之

&emsp;&emsp;分而治之，各个击破是兵家常用的策略之一。在战争中，我们希望首先攻下敌方的部分城市，使其剩余的城市变成孤立无援，然后再分头各个击破。为此参谋部提供了若干打击方案。本题就请你编写程序，判断每个方案的可行性。

## 输入格式：

&emsp;&emsp;输入在第一行给出两个正整数`N`和`M`（均不超过 10_000），分别为敌方城市个数（于是默认城市从 1 到`N`编号）和连接两城市的通路条数。随后`M`行，每行给出一条通路所连接的两个城市的编号，其间以一个空格分隔。在城市信息之后给出参谋部的系列方案，即一个正整数`K`（≤ 100）和随后的`K`行方案，每行按以下格式给出：

{% p center, <code>Np v[1] v[2] ... v[Np]</code> %}

&emsp;&emsp;其中 `Np` 是该方案中计划攻下的城市数量，后面的系列`​v[i]` 是计划攻下的城市编号。

## 输出格式：

&emsp;&emsp;对每一套方案，如果可行就输出`YES`，否则输出`NO`。

## 输入样例：

> 10 11
> 8 7
> 6 8
> 4 5
> 8 4
> 8 1
> 1 2
> 1 4
> 9 8
> 9 1
> 1 10
> 2 4
> 5
> 4 10 3 8 4
> 6 6 1 7 5 4 9
> 3 1 8 4
> 2 2 8
> 7 9 8 7 6 5 4 2

## 输出样例：

> NO
> YES
> YES
> NO
> NO

## 题解

&emsp;&emsp;这道题我们求解时使[邻接表](https://www.cnblogs.com/ECJTUACM-873284962/p/6905416.html)存储图的信息，邻接表这里就不讲了，可以自行查看网络上的资源。

&emsp;&emsp;首先我们要清除一个点，即孤立无援是什么？其实孤立无援就是要保证所有点都没有与之相连的点。接下来自然是根据题目要求输入并存储图的数据，这是非常简单的一步。接着就是这道题的重点，输入并处理`方案`数据。

&emsp;&emsp;这里我们有两个选择，第一种是每次处理数据前先把图复制一遍，然后直接在复制后的数据上进行计算，最终得出答案，这样就不会影响下一次计算，但是这个方法有一个明显的缺陷，就是在数据规模比较大的时候很容易内存超限或者时间超限。

&emsp;&emsp;所以我们选择第二种选择，即使用一个数组（或者`vector`）存储方案，数组中实际存储的是指定节点被移除的连接的数目。这样子的话在处理完数据后遍历数组，判断其值是否大于等于图中的连接数量，就可以判断是否所有节点的连接数量都为`0`。

```c++
#include <bits/stdc++.h>

using namespace std;

int removes[10001];

int main() {
    int n, m, a, b, k, np;
    cin >> n >> m;
    vector<vector<int>> map(n + 1);
    while (m--) {
        scanf("%d %d", &a, &b);
        map[a].push_back(b);
        map[b].push_back(a);
    }
    cin >> k;
    for (int o = 0; o != k; ++o) {
        if (o != 0) printf("\n");
        scanf("%d", &np);
        memset(removes + 1, 0, np * sizeof(int));
        for (int i = 1; i <= np; ++i) {
            scanf("%d", &a);
            removes[a] = map[a].size();
            for (const auto &item : map[a]) ++removes[item];
        }

        for (int i = 1; i <= n; ++i) {
            if (removes[i] < map[i].size()) {
                printf("NO");
                goto hear;
            }
        }
        printf("YES");
        hear:;
    }
    return 0;
}
```
# 符号配对

&emsp;&emsp;请编写程序检查C语言源程序中下列符号是否配对：`/*`与`*/`、`(`与`)`、`[`与`]`、`{`与`}`。

## 输入格式:

&emsp;&emsp;输入为一个C语言源程序。当读到某一行中只有一个句点`.`和一个回车的时候，标志着输入结束。程序中需要检查配对的符号不超过100个。

## 输出格式:

&emsp;&emsp;首先，如果所有符号配对正确，则在第一行中输出`YES`，否则输出`NO`。然后在第二行中指出第一个不配对的符号：如果缺少左符号，则输出`?-右符号`；如果缺少右符号，则输出`左符号-?`。

## 输入样例1：

> void test()
> {
>     int i, A[10];
>     for (i=0; i<10; i++) { /*/
>         A[i] = i;
> }
> .

## 输出样例1：

> NO
> /*-?

## 输入样例2：

> void test()
> {
>     int i, A[10];
>     for (i=0; i<10; i++) /**/
>         A[i] = i;
> }]
> .

## 输出样例2：

> NO
> ?-]

## 输入样例3：

> void test()
> {
>     int i
>     double A[10];
>     for (i=0; i<10; i++) /**/
>         A[i] = 0.1*i;
> }
> .

## 输出样例3：

> YES

## 题解

```c
//根据当前符号获取对应的符号
//参数：
//  input - 当前符号，使用*表示/*，使用/表示*/
//返回值：
//  int - 对应的反符号，使用*表示/*，使用/表示*/
int opposite(int input) {
    switch (input) {
        case '{': return '}';
        case '[': return ']';
        case '(': return ')';
        case '}': return '{';
        case ']': return '[';
        case ')': return '(';
        case '*': return '/';
        case '/': return '*';
        default: return input;
    }
}

int main() {
    int index = 0;  //当前写入位点
    int before[100] = {-1}; //符号栈
    int input;
    bool onlyPoint = false; //表示该行开头是否为点
    int lineIndex = 0;  //字符在当前行中的下标
    while (true) {
        input = getchar();
        if (lineIndex == 0 && input == '.') onlyPoint = true;
        else if (input == '\n' && onlyPoint) break;
        hear:
        ++lineIndex;
        switch (input) {
            case '/':
                input = getchar();
                if (input != '*') goto hear;
            case '{': case '[': case '(':
                before[index++] = input;
                break;
            case '*':
                input = getchar();
                if (input != '/') goto hear;
            case '}': case ']': case ')': {
                if (index == 0) {
                    if (input == '/') printf("NO\n?-*/");
                    else printf("NO\n?-%c", input);
                    return 0;
                }
                int expected = before[--index];
                if (expected != opposite(input)) {
                    if (expected == '*') printf("NO\n/*-?");
                    else printf("NO\n%c-?", expected);
                    return 0;
                }
                break;
            }
            case '\n':
                lineIndex = 0;
                onlyPoint = false;
                break;
            default: break;
        }
    }
    if (index == 0) printf("YES");
    else {
        if (before[--index] == '*') printf("NO\n/*-?");
        else printf("NO\n%c-?", before[index]);
    }
    return 0;
}
```

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}
