---
title: 网安、人工智能21级班级团体训练欢乐赛(二)
date: 2021-11-20 15:18:44
top_img: false
toc_number: false
categories:
  - C/C++
tags:
  - 教程
  - 题解
  - PTA
cover: https://image.emptydreams.xyz/bg/b19.jpg!/fxfn2/550x500
description: PTA-网安、人工智能21级班级团体训练欢乐赛（一）详细题解
---

# 注意

&emsp;&emsp;该博客是为了帮助同学学习，并非为了协助同学刷题，请读者保持自觉，**请勿做CV工具人**。另外为了节省篇幅，代码中不再写明`#include`，如果遇到我没有声明的函数，那么就是某一个头文件中的函数，读者搜索“`c` + 函数名字”就能查到相关信息。

# #1 输出10个不重复的英文字母

## 题干

### 描述

&emsp;&emsp;随机输入一个字符串，把最左边的10个不重复的英文字母（不区分大小写）挑选出来。 如没有10个英文字母，显示信息“not found”。

### 输入格式

&emsp;&emsp;在一行中输入字符串。

### 输出格式

&emsp;&emsp;在一行中输出最左边的10个不重复的英文字母或显示信息“not found"。

### 输入样例1

在这里给出一组输入。例如：

{% note success no-icon %}poemp134567

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例1

在这里给出相应的输出。例如：

{% note success no-icon %}not found

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输入样例2

在这里给出一组输入。例如：

{% note success no-icon %}This 156is a test example

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例2

在这里给出相应的输出。例如：

{% note success no-icon %}Thisaexmpl

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

## 题解

&emsp;&emsp;很简单，直接上代码，不解释：

```C
//判断输入的数组中是否包含指定值
bool contain(const char record[], int c) {
    for (int i = 0; record[i] != '\0'; ++i) {
        //忽略大小写
        if (tolower(record[i]) == tolower(c)) return true;
    }
    return false;
}

int main() {
    char record[11] = {'\0'};
    int size = 0;
    int c;
    while (c = getchar(), c != '\n' && c != EOF) {
        //如果c是字母并且record中不存在c，则将c放入数组中
        if (isalpha(c) && !contain(record, c)) {
            record[size++] = (char) c;
            //如果数量达到10则直接退出
            if (size == 10) break;
        }
    }
    if (size != 10) printf("not found");
    else printf("%s", record);
    return 0;
}
```

# #2 显示指定范围的素数并求和

## 题干

### 描述

&emsp;&emsp;本题要求显示给定整数M和N区间内素数并对它们求和。

### 输入格式

&emsp;&emsp;在一行输入两个正整数M和N（1≤M≤N≤1000）。

### 输出格式

&emsp;&emsp;显示指定范围的素数，素数间空一格，每五个换一行。 单独一行输出素数的个数及素数的和。

### 输入样例

&emsp;&emsp;在这里给出一组输入。例如：

{% note success no-icon %}4 30

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例

&emsp;&emsp;在这里给出相应的输出。例如：

{% note success no-icon %}5 7 11 13 17

19 23 29 

amount=8 sum=124

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

## 题解

&emsp;&emsp;很简单，直接贴代码，不解释：

```C
//判断指定数是否为质数
bool is(int n) {
    if (n == 1) return false;
    if (n == 2) return true;
    double d = sqrt(n) + 1;
    for (int i = 2; i < d; ++i) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int record[1000];	//记录质数
    int size = 0;	//质数的数量
    int m, n;
    scanf("%d %d", &m, &n);
    unsigned long long sum = 0;
    for (int i = m; i <= n; ++i) {
        if (is(i)) {
            record[size++] = i;
            sum += i;
        }
    }
    for (int i = 0; i != size; ++i) {
        if (i % 5 == 0 && i != 0) printf("\n");
        printf("%d ", record[i]);
    }
    printf("\namount=%d sum=%llu", size, sum);
    return 0;
}
```

# #3 输入一个整数，在一行中输出相应个数的星号

## 题干

### 输入样例

{% note success no-icon %}5

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例

{% note success no-icon %}\*\*\*\*\*

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

## 题解

```C
int main() {
    int n;
    scanf("%d", &n);
    while (n--) printf("*");
    return 0;
}
```

# #4 跳一跳

## 题干

### 描述

&emsp;&emsp;**Drizzle** 面前有一条由一堆`非负整数`组成的道路，从第一个数字起步，每次他都能跳出不大于当前数字的距离，每个数字之间的距离为1，那么他最少需要跳多少次才能到达终点？

### 要求

输入：第一行输入道路中数字的个数`n`也就是道路的长度，第二行输入这n个数字

输出：输出一个数字，表示最少跳跃次数

### 输入样例

{% note success no-icon %}5

2 3 1 1 4

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例

{% note success no-icon %}2

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 解释

&emsp;&emsp;解释: 跳到最后一个位置的最小跳跃数是 2。从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。

### 范围

对于 20% 的数据：n≤100

对于 100% 的数据：n≤1000000

所有整数元素在`int`范围内

## 题解

&emsp;&emsp;这道题也不难，只要保证每次跳跃都是最优解就能保证最终得到最优解。

```C
int n;
int road[1000000];

//求区间内的最优解
//参数：
//	start - 起始位置（包括）
//	length - 长度
//返回：
//	跳跃到的下标
int max(int start, int length) {
    int end = start + length;
    //如果可以直接跳到终点则返回n
    if (end >= n) return n;
    int max = -1;
    int index = -1;
    //找到可以跳的最远的点
    for (int i = start; i != end; ++i) {
        if (road[i] + i > max) {
            max = road[i] + i;
            index = i;
        }
    }
    return index;
}

int main() {
    scanf("%d", &n);
    for (int i = 0; i != n; ++i) scanf("%d", &road[i]);
    int result = 0;
    for (int i = 0; i != n;) {
        i = max(i + 1, road[i]);
        ++result;
    }
    printf("%d", result);
    return 0;
}
```

# #5 数据类型转换

## 题干

### 描述

&emsp;&emsp;本题目要求定义一个float类型变量，键盘输入大于0且小于100的实数，拆分成整数部分和小数部分。输出乘积。

### 输入格式

&emsp;&emsp;输入一个正的实数。

### 输出格式

&emsp;&emsp;拆分成整数部分和小数部分，输出乘积，保留两位小数。

### 输入样例

{% note success no-icon %}12.15

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例

{% note success no-icon %}1.80

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

## 题解

&emsp;&emsp;很简单，直接贴代码，不解释：

```C
int main() {
    float f;
    scanf("%f", &f);
    int k = (int) f;
    float result = k * (f - k);
    printf("%.2f", result);
    return 0;
}
```

# #6 位1的个数

## 题干

### 描述

&emsp;&emsp;输入一个非负整数，求它变成二进制后1的个数（提示：用bin函数）。

### 输入格式

&emsp;&emsp;输入一个正整数。

### 输出格式

&emsp;&emsp;输出`1`的个数。

### 输入样例1

&emsp;&emsp;在这里给出一组输入。例如：

{% note success no-icon %}37

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例1

在这里给出相应的输出。例如：

{% note success no-icon %}3

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输入样例2

&emsp;&emsp;在这里给出一组输入。例如：

{% note success no-icon %}0

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例2

&emsp;&emsp;在这里给出相应的输出。例如：

{% note success no-icon %}0

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

## 题解

&emsp;&emsp;虽然题干上说使用`bin`函数，但是我们直接使用位运算就能解决问题了。

```C
int main() {
    int n;
    scanf("%d", &n);
    int result = 0;
    while (n != 0) {
        if ((n & 1) == 1) ++result;
        n >>= 1;
    }
    printf("%d", result);
    return 0;
}
```

# #7 求π的近似值

## 题干

### 描述

&emsp;&emsp;用公式求*π*的近似值：*π*2/6=1+1/22+1/32+1/42+……

&emsp;&emsp;用公式求*π*的近似值：*π*2/6=1+1/22+1/32+1/42+。。。

### 输入格式

&emsp;&emsp;在一行输入误差范围。

### 输出格式

&emsp;&emsp;在一行输出*π*的近似值（保留6位小数）。

### 输入样例

&emsp;&emsp;在这里给出一组输入。例如：

{% note success no-icon %}0.00000001

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例

&emsp;&emsp;在这里给出相应的输出。例如：

{% note success no-icon %}3.141497

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

## 题解

&emsp;&emsp;很简单，直接上代码，不解释：

```C
int main() {
    double result = 0;
    double r;
    scanf("%lf", &r);
    for (int i = 1;; ++i) {
        double k = 1.0 / (i * i);
        if (k < r) break;
        result += k;
    }
    printf("%.6f", sqrt(result * 6));
    return 0;
}
```

# #8 查验身份证

## 题干

### 描述

&emsp;&emsp;一个合法的身份证号码由17位地区、日期编号和顺序编号加1位校验码组成。校验码的计算规则如下：

&emsp;&emsp;首先对前17位数字加权求和，权重分配为：{7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2}；然后将计算的和对11取模得到值`Z`；最后按照以下关系对应`Z`值与校验码`M`的值：

```
Z：0 1 2 3 4 5 6 7 8 9 10
M：1 0 X 9 8 7 6 5 4 3 2
```

&emsp;&emsp;现在给定一些身份证号码，请你验证校验码的有效性，并输出有问题的号码。

### 输入格式

&emsp;&emsp;现在给定一些身份证号码，请你验证校验码的有效性，并输出有问题的号码。

### 输出格式

&emsp;&emsp;按照输入的顺序每行输出1个有问题的身份证号码。这里并不检验前17位是否合理，只检查前17位是否全为数字且最后1位校验码计算准确。如果所有号码都正常，则输出`All passed`。

### 输入样例1

{% note success no-icon %}4

320124198808240056

12010X198901011234

110108196711301866

37070419881216001X

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例1

{% note success no-icon %}12010X198901011234 

110108196711301866 

37070419881216001X

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输入样例2

{% note success no-icon %}2

320124198808240056

110108196711301862

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例2

{% note success no-icon %}All passed

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

## 题解

&emsp;&emsp;这道题难点在加权求和，可能很多人不知道加权求和是什么。加权求和就是每个数乘上其权重再求和，知道这个之后代码就很好写了：

```C
int main() {
    int weight[] = {7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2};
    char MS[] = {'1','0','X','9','8','7','6','5','4','3','2'};
    char id[19] = {'\0'};
    int t;
    scanf("%d", &t);
    int size = t;
    while (t--) {
        getchar();	//扔掉多余的换行符
        int result = 0;
        for (int i = 0; i != 17; ++i) {
            int temp = getchar();
            id[i] = (char) temp;
            int k = (temp - '0') * weight[i];
            result += k;
        }
        char m = MS[result % 11];
        id[17] = (char) getchar();
        if (toupper(id[17]) == m) --size;
        else printf("%s\n", id);
    }
    if (size == 0) printf("All passed");
    return 0;
}
```

# #9 输入数据范围的简单判断

## 题干

### 描述

&emsp;&emsp;输入一个三位整数，按照对称原则扩充为5位整数。

### 输入格式

&emsp;&emsp;输入一个三位整数。 注意：如果输入的不是三位数（两位或者四位）则不处理，没有任何输出。

### 输出格式

&emsp;&emsp;当输入三位整数时则输出一个5位整数，将这个三位数的前后各增加一位，分别复制三位数的百位和个位。 当输入数据不是三位时，没有输出信息。

### 输入样例

{% note success no-icon %}123

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例

{% note success no-icon %}11233

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

## 题解

&emsp;&emsp;很简单，直接贴代码，不解释：

```C
int main() {
    int n;
    scanf("%d", &n);
    if (n < 100 || n > 999) return 0;
    n += (n / 100) * 1000;
    n *= 10;
    n += (n / 10) % 10;
    printf("%d", n);
    return 0;
}
```

# #10 计算 21+22+23+...+m

## 题干

### 描述

&emsp;&emsp;输入一个正整数m(30<=m<=100)，计算表达式 21+22+23+...+m 的值。

### 输入格式

&emsp;&emsp;在一行输入一个正整数m。

### 输出格式

&emsp;&emsp;在一行中按照格式“sum = S”输出对应的和S。

### 输入样例

&emsp;&emsp;在这里给出一组输入。例如：

{% note success no-icon %}90

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

### 输出样例

在这里给出相应的输出。例如：

{% note success no-icon %}sum = 3885

{% inlineimage https://image.emptydreams.xyz/icon/warning.png %} 结尾无空行{% endnote %}

## 题解

&emsp;&emsp;很简单，直接贴代码，不解释：

```C
int main() {
    int n;
    scanf("%d", &n);
    long long sum = 0;
    for (int i = 21; i <= n; ++i) sum += i;
    printf("sum = %lld", sum);
    return 0;
}
```

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}











