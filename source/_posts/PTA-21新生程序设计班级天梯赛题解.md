---
title: PTA-21新生程序设计班级天梯赛题解
top_img: false
toc_number: false
katex: true
cover: 'https://image.kmar.top/bg/b25.jpg!/fxfn2/550x500'
categories:
  - C/C++
tags:
  - 教程
  - 题解
  - PTA
description: 2021级新生程序设计班级天梯赛详细题解
abbrlink: a1192983
date: 2021-12-05 00:54:08
---

## 注意

&emsp;&emsp;该博客是为了帮助同学学习，并非为了协助同学刷题，请读者保持自觉，**请勿做CV工具人**。另外为了节省篇幅，代码中不再写明`#include`，如果遇到我没有声明的函数，那么就是某一个头文件中的函数，读者搜索“`c` + 函数名字”就能查到相关信息。

&emsp;&emsp;后面几道难题采用了`C++`进行编写，题解中会给出网上的`C`语言解法（如果找得到的话），特别简单的题只给出代码。

&emsp;&emsp;抄题和写题解雀食是非常不容易的一个活，有能力的小伙伴还是支持一下吧QAQ。

---

## 你好，天梯赛

&emsp;&emsp;这道超级简单的题目没有任何输入。

&emsp;&emsp;你只需要在一行中输出短句“Hello, Tian Ti Sai!”就可以了。

### 输出样例

> Hello, Tian Ti Sai!

### 题解

```c
int main() {
    printf("Hello, Tian Ti Sai!");
    return 0;
}
```

## 天梯赛考场

&emsp;&emsp;假设我们的天梯赛考场座位有n排m列，请计算，该考场总共能安排多少学生就坐？

### 输入格式

&emsp;&emsp;两个整数，n和m，空格隔开，分别代表考场有n排，m列。

### 输出格式

&emsp;&emsp;两个整数，n和m，空格隔开，分别代表考场有n排，m列。

### 输入样例

> 5 6

### 输出样例

> 30

### 题解

```c
int main() {
    long long n, m;
    scanf("%lld %lld", &n, &m);
    printf("%lld", n  m);
    return 0;
}
```

## 算法竞赛 · 进阶指南

> 探索一门学问有三个层次：求其解，知其原因，究其思维之本。
> 　　　　　—— 《算法竞赛 · 进阶指南》

&emsp;&emsp;请问`int`类型最多可以存多大的数？`long long`类型最多可以存多大的数？

### 输入格式

&emsp;&emsp;输入一个大写字母`I`或者`L`。

### 输出格式

&emsp;&emsp;如果输入的是大写字母`I`，输出`int`类型的最大值：`2147483647`

&emsp;&emsp;如果输入的大写字母是`L`，输出`long long`类型的最大值：`9223372036854775807`

### 题解

```c
int main() {
    char input;
    scanf("%c", &input);
    if (input == 'I') printf("%d", INT_MAX);
    else printf("%lld", LLONG_MAX);
    return 0;
}
```

## AK

> 我就像一个网瘾少年，享受着每次AK。
> 　　　　　—— HRS

&emsp;&emsp;你想要输出一个有`n`个字符的字符串以获得自信。

&emsp;&emsp;那么你是否可以如愿输出一个具有AK的完整的"AK"字符串？

&emsp;&emsp;完整的"AK"字符串必须含有AK这两个字符且不能有多余无法匹配的A或者K。

&emsp;&emsp;如 AKAKAK就是完整的，而AKA就是不完整的。

### 输入格式

&emsp;&emsp;一个整数`n`(0 ≤ `n` ≤ 100)。

### 输出格式

&emsp;&emsp;如果可以输出完整的 "AK" 字符串，在第一行输出`YES`，然后在第二行输出这样的字符串。

&emsp;&emsp;如果不可以，输出`NO`。

### 输入样例

> 6

### 输出样例

> AKAKAK

### 样例说明

&emsp;&emsp;`6`可以涵盖三个`AK`

&emsp;&emsp;说明可以，输出`YES`

&emsp;&emsp;并输出三个`AK`

### 题解

&emsp;&emsp;注意处理`n == 0`的情况，`n`为零时是无法输出完整的AK的，所以应当输出`NO`，而单纯的`n % 2`或者使用`n & 1`是无法排除`n`为零的情况的。

```c
int main() {
    int n;
    scanf("%d", &n);
    if (n % 2 == 0 && n != 0) {
        printf("YES\n");
        int k = n / 2;
        for (int i = 0; i != k; ++i) printf("AK");
    } else {
        printf("NO");
    }
    return 0;
}
```

## 天鸟火炮

&emsp;&emsp;小Z生活的部落有一座保卫安全的天鸟火炮，他想设置一个数值`c`，当敌人出动全部兵力的`c%`或者更多时，它才会触发保卫部落安全。

### 输入格式

&emsp;&emsp;第一行一个整数`T`(1 ≤ `T` ≤ 1000)，表示`T`组数据，

&emsp;&emsp;下面`T`行每行三个整数`a`,`b`,`c`(0 ≤ `a` ≤ 10<sup>5</sup>, 0 ≤ `b` ≤ `a` , 1 ≤ `c` ≤ 100)分别表示敌人的总兵力、出动的兵力以及小Z设置的数值。

### 输出格式

&emsp;&emsp;`T`行，如果部落安全则输出`Yes`，否则输出`No`，不含双引号，

&emsp;&emsp;每组数据占一行。

### 输入样例

> 2
> 300 200 60
> 300 100 60

### 输出样例

> Yes
> No

### 题解

```c
int main() {
    int t, a, b, c;
    scanf("%d", &t);
    bool start = false;
    while (t--) {
        if (start) printf("\n");
        else start = true;
        scanf("%d %d %d", &a, &b, &c);
        double k = (c / 100.0) * a;
        if (b >= k) printf("Yes");
        else printf("No");
    }
    return 0;
}
```

## 从你的全世界路过

> 我希望有个如你一般的人，如山间清爽的风，如古城温暖的光。从清晨到夜晚，由山野到书房。只要最后是你，就好。
> 　　　　　—— 《从你的全世界路过》

&emsp;&emsp;我们定义 “如`x`一般的数” 是`x`的幂。
&emsp;&emsp;给你一个数`x`和一个数`y`，请你判断`y`是不是如`x`一般的数。

### 输入格式

&emsp;&emsp;输入两个整数`x`,`y`(1 ≤ `x`, `y` ≤ 10<sup>5</sup>)。

### 输出格式

&emsp;&emsp;如果`y`是如`x`一般的数，输出`YES`，否则输出`NO`。

### 输入样例

> 2 8

### 输出样例

> YES

### 题解

{% tabs cndqsjlg %}

<!-- tab 循环解法 -->

&emsp;&emsp;这道题需要注意时间成本问题，这里我们采用了从大往小计算的方式，即每次循环将`y`除以`x`，直至不能再整除。这么做需要注意一个特殊情况，即`x`为一但`y`不为一的情况，如果不特殊处理的话该程序就会陷入无限循环。

&emsp;&emsp;直接采用正序运算的方法的话肯定会TLE，但是使用快速幂来进行正序运算的话我没有试过，有兴趣的可以尝试一下，然后把结果发到评论区。

```c
int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    if (x == 1 && y != 1) {
        printf("NO");
        return 0;
    }
    while (y % x == 0) y /= x;
    if (y == 1) printf("YES");
    else printf("NO");
    return 0;
}
```

<!-- endtab -->

<!-- tab 数学解法 -->

&emsp;&emsp;该方法由群友——Dissolve提供。

&emsp;&emsp;通过对数运算我们可以知道，<code>log<sub>x</sub>y</code>为整数时说明`x`是`y`的整数次幂。通过换底公式易得，当<code>log<sub>e</sub>(y) / log<sub>e</sub>(x)</code>为整数时说明`x`是`y`得整数次幂。

```c
int main() {
    double x, y;
    scanf("%lf %lf", &x, &y);
    double result = log(y) / log(x);
    int integer = (int) result;
    if (fabs(result - integer) < 1e-6)
        printf("YES");
    else
        printf("NO");
    return 0;
}
```

<!-- endtab -->

{% endtabs %}

## 双城之战

> 蔚：爆爆，正是你的与众不同让你强大，牢牢记住这一点，好吗？
> 　　　　　—— 《双城之战》

&emsp;&emsp;我们在这里定义两个名字完全一样的人是同一个人。

&emsp;&emsp;请你在多个影视人物中找出第几个人是游戏角色。

### 输入格式

&emsp;&emsp;第 1 行一个字符串代表你锁定的游戏角色名字。

&emsp;&emsp;第 2 行一个正整数`n`,(1 ≤ `n` ≤ 10<sup>3</sup>)。

&emsp;&emsp;第 3→`n+2` 行每行一个字符串代表给出的影视人物名字。

&emsp;&emsp;给出的所有字符串长度不超过 10<sup>3</sup>。

&emsp;&emsp;保证这`n`个影视人物中有且只有一个是你锁定的游戏角色。

### 输出格式

&emsp;&emsp;输出一行，只有一个数字，代表给出的影视人物中第几个人是你锁定的游戏角色。

### 输入样例

> Jinx
> 2
> Baobao
> Jinx

### 输出样例

> 2

### 题解

&emsp;&emsp;这道题只需要存下目标名字，然后逐个比较就行了，并不需要把所有输入的名字都存下来，然后再遍历所有名称。同时使用`gets`(或`getline`)防止名字中间带空格。

{% tabs sczj %}

<!-- tab C语言 -->

```c
int main() {
    char name[1001];
    char now[1001];
    gets(name);
    int n;
    scanf("%d", &n);
    getchar();
    for (int i = 1; i <= n; ++i) {
        gets(now);
        if (strcmp(name, now) == 0) {
            printf("%d", i);
            break;
        }
    }
    return 0;
}
```

<!-- endtab -->

<!-- tab C++ -->

&emsp;&emsp;使用`c++`中的`string`可以有效少轻工作量。

```c++
int main() {
    string name;
    getline(cin, name);
    int n;
    scanf("%d", &n);
    getchar();
    string now;
    for (int i = 1; i <= n; ++i) {
        getline(cin, now);
        if (name == now) {
            printf("%d", i);
            break;
        }
    }
    return 0;
}
```

<!-- endtab -->

{% endtabs %}

## 这个世界不需要守望先锋

> "Old soldiers never die, and they don't fade away."
> 　　　　　—— 士兵76

&emsp;&emsp;士兵76在高台上悠哉的出入，敌方神出鬼没的末日铁拳突然出现准备将76击杀。士兵76随即开启大招战术目镜准备应敌。

&emsp;&emsp;士兵76开启大招后每发子弹可以造成 20 点伤害，且一定会命中。

&emsp;&emsp;末日铁拳有 250 点血量，每释放一个技能可以增加 25 点血量。

&emsp;&emsp;现在告诉你末日铁拳释放的技能数`n`，请你计算士兵76至少需要多少发子弹才能击杀末日铁拳。

### 输入格式

&emsp;&emsp;末日铁拳释放的技能数`n`（ `n`为`int`型整数）。

### 输出格式

&emsp;&emsp;输出一个整数表示士兵76击杀末日铁拳至少需要的子弹数。

### 输入样例

> 2

### 输出样例

> 15

### 题解

{% tabs swxf %}

<!-- tab C语言 -->

```c
int main() {
    unsigned long long n;
    scanf("%llu", &u);
    unsigned long long bleed = 250 + n * 25;
    if (bleed % 20 == 0) printf("%llu", bleed / 20);
    else printf("%llu", bleed / 20 + 1);
    return 0;
}
```

<!-- endtab -->

<!-- tab C++ -->

```c++
int main() {
    unsigned long long n;
    cin >> n;
    unsigned long long bleed = 250 + n * 25;
    if (bleed % 20 == 0) cout << (bleed / 20);
    else cout << (bleed / 20 + 1);
    return 0;
}
```

<!-- endtab -->

{% endtabs %}

## 天堂旅行团

> 她是乌云中的最后一缕光，牢狱里的最后一把钥匙，
> 我伸手穿过头顶河水，抓到的最后一根稻草。
> 　　　　　—— 《天堂旅行团》

&emsp;&emsp;众所周知每个天堂都有自己的高度，这些高度决定了它们在人们心中的位置。

&emsp;&emsp;高度越高，对应的位置也就越靠前。

&emsp;&emsp;给你一些天堂的高度h，请你输出在人们心中位置能排在第二的天堂高度。

### 输入格式

&emsp;&emsp;第一行一个正整数`n`(2 ≤ `n` ≤ 10<sup>7</sup>)。

&emsp;&emsp;第二行 n 个正整数 h<sub>1</sub>, h<sub>2</sub>, ..., h<sub>n</sub>分别表示每个天堂的高度 (1 ≤ <code>h<sub>i</sub></code> ≤ 10<sup>5</sup>)。


### 输出格式

&emsp;&emsp;输出一个正整数，代表能排在第二位的天堂高度。

### 输入样例

> 3
> 3 5 4

### 输出样例

> 4

### 题解

&emsp;&emsp;这道题输入规模比较大，采用排序的方法显然是非常容易TLE的，但我们只要找到第二大的数字就可以了。

{% tabs ttlxt %}

<!-- tab C语言 -->

```c
int main() {
    int n, k;
    scanf("%d", &n);
    int max = INT_MIN, max2 = INT_MIN + 1;
    while (n--) {
        scanf("%d", &k);
        if (k > max) {
            max2 = max;
            max = k;
        } else if (k > max2) {
            max2 = k;
        }
    }
    printf("%d", max2);
    return 0;
}
```

<!-- endtab -->

<!-- tab C++ -->

```c++
int main() {
    int n, k;
    cin >> n;
    int max = INT_MIN, max2 = INT_MIN + 1;
    while (n--) {
        scanf("%d", &k);
        if (k > max) {
            max2 = max;
            max = k;
        } else if (k > max2) {
            max2 = k;
        }
    }
    cout << max2;
    return 0;
}
```

<!-- endtab -->

{% endtabs %}

## 肖申克的救赎

> 心若是牢笼，处处为牢笼，自由不在外面，而在于内心。
> 　　　　　—— 《肖申克的救赎》

&emsp;&emsp;有`n`层内心的牢笼，你要从第 1 层开始逐层突破

&emsp;&emsp;突破第`i`层会扣除 <code>a<sub>i</sub></code> 的心灵力，但你会获得 <code>a<sub>i</sub></code> 的救赎值

&emsp;&emsp;心灵力不能降到负数，不然你将会变成一具如同行尸走肉的躯壳

&emsp;&emsp;已知你有值为`h`的心灵力

&emsp;&emsp;那么你最多可以获得多少救赎值？

&emsp;&emsp;<sub>ps：你当然有可能逃出去</sub>

### 输入格式

&emsp;&emsp;第一行一个`n`表示内心牢笼的层数 (1 ≤ `n` ≤ 100)。

&emsp;&emsp;第二行给你`n`个整数 a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, ..., a<sub>n</sub> (0 ≤ <code>a<sub>i</sub></code> ≤ 100)。

&emsp;&emsp;第三行一个整数`h`表示你的心灵值 (1 ≤ `h` ≤ 1000)。


### 输出格式

&emsp;&emsp;输出一个整数，表示你最多可以获得多少救赎值。

### 输入样例

> 4
> 1 2 3 4
> 4

### 输出样例

> 3

### 题解

{% tabs xskdjs %}

<!-- tab C语言 -->

```c
int main() {
    int n, b;
    scanf("%d", &n)
    int a[n];
    for (int i = 0; i != n; ++i) {
        scanf("%d", &a[i]);
    }
    scanf("%d", &b);
    int result = 0;
    for (int i = 0; i != n; ++i) {
        if (b - a[i] >= 0) {
            b -= a[i];
            result += a[i];
        }
    }
    printf("%d", result);
    return 0;
}
```

<!-- endtab -->

<!-- tab C++ -->

```c++
int main() {
    int n, b;
    cin >> n;
    int a[n];
    for (auto& i : a) cin >> i;
    cin >> b;
    int result = 0;
    for (auto i : a) {
        if (b - i >= 0) {
            b -= i;
            result += i;
        } else break;
    }
    cout << result;
    return 0;
}

```

<!-- endtab -->

{% endtabs %}

## 请再一次做我的棋子

> “世间的事，太痛苦了。我该怎样才能忘却呢？”
> “下棋吧。”
> “棋，能代替世间吗？”
> “能。因为纵横十九道内，栖息着宇宙。”

&emsp;&emsp;《王者荣耀》中奕星的大招是画出一个矩形。LT是一个强迫症患者，如果画出来的矩形不是正方形，他就会很难受。现在告诉你奕星大招的四个顶点，请你判断这个矩形是否为正方形。

### 输入格式

&emsp;&emsp;第一行输入四个整数 x<sub>i</sub> (0 ≤ <code>x<sub>i</sub></code> ≤ 10000)。

&emsp;&emsp;第二行输入四个整数 y<sub>i</sub> (0 ≤ <code>y<sub>i</sub></code> ≤ 10000)。

### 输出格式

&emsp;&emsp;如果矩形是正方形，输出`好耶!`，否则输出`emo！`。

### 输入样例

> 0 0 2 2
> 0 2 0 2

### 输出样例

> 好耶!

### 题解

&emsp;&emsp;这道题主要是如何判断一个图形是否是正方形，有两种方法。第一种是通过判断直角，第二种是判断两点距离。

&emsp;&emsp;这里我们采用第二种方法，仔细观察正方形不难发现，如果一个图形是正方形，那么所有点间的长度一共有两种，即边长和对角线长。如果一个图形所有点间的距离数量不等于`2`说明一定不是矩形。

&emsp;&emsp;编写的时候需要注意两个点，一是输出的答案中有一个感叹号是中文感叹号，二是输入数据可能存在两个点重叠在一起的情况。

{% tabs qzzycwdqz %}

<!-- tab C语言 -->

```c
//计算两个点间的距离
double task(const int p0[2], const int p1[2]) {
    long long dx = p0[0] - p1[0];
    long long dy = p0[1] - p1[1];
    return sqrt(dx * dx + dy * dy);
}

//比较两个double是否相等
bool compareDouble(double a, double b) {
    return fabs(a - b) < 1e-8;
}

int main() {
    int location[4][2];
    for (int i = 0; i != 4; ++i) scanf("%d", &location[i][0]);
    for (int i = 0; i != 4; ++i) scanf("%d", &location[i][1]);
    double v0 = -1, v1 = -1;
    int a0 = 1, a1 = 1;
    for (int i = 0; i != 3; ++i) {
        for (int k = i + 1; k != 4; ++k) {
            //如果有两个点重叠的情况那么必然不可能组成正方形
            if (location[i][0] == location[k][0]
                && location[i][1] == location[k][1]) {
                printf("emo！");
                return 0;
            }
            double temp = task(location[i], location[k]);
            //如果第一个距离还没出现则更新第一个点的值
            if (compareDouble(v0, -1)) v0 = temp;
            else {
                //如果第一个距离已经存在
                //那么判断当前距离是否和第一个距离相等
                //如果相等则将第一个距离的数量+1
                if (compareDouble(v0, temp)) ++a0;
                else if (compareDouble(v1, -1)) v1 = temp;
                else if (compareDouble(v1, temp)) ++a1;
                else {
                    //如果第二个距离已经存在且当前距离和第二个距离不相等
                    //说明出现了第三个距离，那么一定不是正方形
                    printf("emo！");
                    return 0;
                }
            }
        }
    }
    if ((a1 == 2 && a0 == 4) || (a1 == 4 && a0 == 2))
        printf("好耶!");
    else printf("emo！");
    return 0;
}
```

<!-- endtab -->

<!-- tab C++ -->

```c++
//计算两个点间的距离
double task(const int p0[2], const int p1[2]) {
    int dx = p0[0] - p1[0];
    int dy = p0[1] - p1[1];
    return sqrt(dx * dx + dy * dy);
}

//比较两个double是否相等
bool compareDouble(double a, double b) {
    return fabs(a - b) < 1e-8;
}

int main() {
    int location[4][2];
    for (auto &i : location) cin >> i[0];
    for (auto &i : location) cin >> i[1];
    double v0 = -1, v1 = -1;
    int a0 = 1, a1 = 1;
    for (int i = 0; i != 3; ++i) {
        for (int k = i + 1; k != 4; ++k) {
            //如果有两个点重叠的情况那么必然不可能组成正方形
            if (location[i][0] == location[k][0]
                && location[i][1] == location[k][1]) {
                printf("emo！");
                return 0;
            }
            double temp = task(location[i], location[k]);
            //如果第一个距离还没出现则更新第一个点的值
            if (compareDouble(v0, -1)) v0 = temp;
            else {
                //如果第一个距离已经存在
                //那么判断当前距离是否和第一个距离相等
                //如果相等则将第一个距离的数量+1
                if (compareDouble(v0, temp)) ++a0;
                else if (compareDouble(v1, -1)) v1 = temp;
                else if (compareDouble(v1, temp)) ++a1;
                else {
                    //如果第二个距离已经存在且当前距离和第二个距离不相等
                    //说明出现了第三个距离，那么一定不是正方形
                    printf("emo！");
                    return 0;
                }
            }
        }
    }
    if ((a1 == 2 && a0 == 4) || (a1 == 4 && a0 == 2))
        printf("好耶!");
    else printf("emo！");
    return 0;
}
```

<!-- endtab -->

{% endtabs %}

## 夏摩山谷

> 世界多有荒诞之处，却又分明是生活日常的组成部分。
> 　　　　　—— 《夏摩山谷》

&emsp;&emsp;佛廊深处每天都会出现一个数字n ，方丈对每个数设置了一个宁静值Q，Q的计算公式是这样的：

&emsp;&emsp;$36\sum\limits_{i=1}^n\sum\limits_{j=1}^n\sum\limits_{a=1}^i\sum\limits_{b=1}^j(a\times b)\qquad$

&emsp;&emsp;这样的日子将持续`T`天，请你计算出这个宁静值`Q`并对10<sup>9</sup> + 7取模。

### 输入格式

&emsp;&emsp;第 1 行输入一个正整数`T`(`T` ≤ 1000)。

&emsp;&emsp;第 2 行到`T+1`行每行给你一个数`n`(`n` ≤ 10<sup>8</sup>)。

### 输出格式

&emsp;&emsp;对于每个输入的 n，输出这个数的宁静值`Q`

&emsp;&emsp;每组数据占一行，每个数后面没有多余的空格。

### 输入样例

> 5
> 1
> 2
> 16
> 43
> 88

### 输出样例

> 36
> 576
> 23970816
> 248819551
> 855810928

### 样例说明

#### 第一个样例：

&emsp;&emsp;输入`1`

&emsp;&emsp;$Q=36\times\sum_{i=1}^{n}\sum_{j=1}^{n}\sum_{a=1}^{i}\sum_{b=1}^{j}(a\times b)=36\times 1\times 1\times 1 = 36$

#### 第二个样例：

&emsp;&emsp;输入`2`

&emsp;&emsp;i = 1, j = 1 时：

&emsp;&emsp;&emsp;Q<sub>1</sub> = 1 × 1 = 1

&emsp;&emsp;i = 1, j = 2 时：

&emsp;&emsp;&emsp;Q<sub>2</sub> = 1 × 1 + 1 × 2 = 3

&emsp;&emsp;i = 2, j = 1 时：

&emsp;&emsp;&emsp;Q<sub>3</sub> = 1 × 1 + 2 × 1 = 3

&emsp;&emsp;i = 2, j = 2 时：

&emsp;&emsp;&emsp;Q<sub>4</sub> = 1 × 1 + 1 × 2 + 2 × 1 + 2 × 2 = 9

&emsp;∴Q = 36 × (Q<sub>1</sub> + Q<sub>2</sub> + Q<sub>3</sub> + Q<sub>4</sub>) = 576

### 题解

{% tabs xmsg %}

<!-- tab zyz -->

本题解由[ZYZ](https://www.chivas-regal.top/)提供。

$36\sum\limits_{i=1}^n\sum\limits_{j=1}^n\sum\limits_{a=1}^i\sum\limits_{b=1}^ja\times b\qquad O(n^4)\rightarrow3分$

看后面

$\begin{aligned}&1\times(1+2+\dots+j)\\&2\times(1+2+\dots+j)\\&\vdots\\&i\times(1+2+\dots+j)\end{aligned}$

$=(1+2+\dots+i)(1+2+\dots+j)=\frac{(1+i)i}2\frac{(1+j)j}2$

那么原式 $=9\sum\limits_{i=1}^n\sum\limits_{j=1}^n(i+i^2)(j+j^2)\qquad O(n^2)\rightarrow15$分

同上一步理，乘法分配律，变成 $9\sum\limits_{i=1}^n(i+i^2)\sum\limits_{j=1}^n(j+j^2)$  

对于 $\sum\limits_{i=1}^n(i+i^2)$ 前一部分使用 等差数列求和 后一部分使用等差数列求平方和

$\begin{aligned}&=\frac{(1+n)n}2+\frac{n(n+1)(2n+1)}6\\&=\frac{n(n+1)3+n(n+1)(2n+1)}6\\&=\frac{n(n+1)(2n+4)}6\\&=\frac{n(n+1)(n+2)}3\end{aligned}$  

$j$ 那一部分一样，那么原式就变成

$\begin{aligned}&9\frac{n(n+1)(n+2)}3\frac{n(n+1)(n+2)}3\\=&n^2(n+1)^2(n+2)^2\end{aligned}$

$O(1)\rightarrow25$分

最终代码实现如下：

```c
const int mod = 1e9 + 7;

int main () {
    int cass;
    long long n;
    scanf("%d", &cass);
    while (cass-- ) {
        scanf("%lld", &n);
        printf("%lld\n", n * n % mod * (n + 1)
            % mod * (n + 1) % mod * (n + 2)
            % mod * (n + 2) % mod);
    }
}
```

<!-- endtab -->

<!-- tab zhy -->

本题解由[there hello](https://www.therehello.top/xia_mo_shan_gu/)提供。

求$36\sum_{i=1}^{n}\sum_{j=1}^{n}\sum_{a=1}^{i}\sum_{b=1}^{j}(a*b)$

答案对$10^9+7$取模。

$$\begin{aligned}
\mathrm{令}S_n&=1+2+\cdots n=\frac{(n+1)n}{2}\\
\mathrm{因}\sum_{b=1}^{j}(a*b)&=a*1+a*2+\cdots a*j=a*S_j\\
\mathrm{得}\sum_{a=1}^{i}\sum_{b=1}^{j}(a*b)&=1*S_j+2*S_j+\cdots i*S_j=S_i*S_j\\
\mathrm{得}\sum_{j=1}^{n}\sum_{a=1}^{i}\sum_{b=1}^{j}(a*b)&=S_i*S_1+S_i*S_2+\cdots S_i*S_n=S_i*(S_1+S_2+\cdots S_n)\\
\mathrm{得}\sum_{i=1}^{n}\sum_{j=1}^{n}\sum_{a=1}^{i}\sum_{b=1}^{j}(a*b)&=S_1*(S_1+S_2+\cdots S_n)+S_2*(S_1+S_2+\cdots S_n)+\cdots S_n*(S_1+S_2+\cdots S_n)\\&=(S_1+S_2+\cdots S_n)^2
\end{aligned}$$

此时问题的关键就在于如何求和$S_1+S_2+\cdots S_n$，~~如果你像zyz学长一样强大的，可以现推~~可惜我不会。

联想到杨辉三角，我们来看看杨辉三角长什么样子。

```
1
1  1
1  2  1
1  3  3  1
1  4  6  4  1
1  5 10 10  5  1
```

发现了么？第三列即是$S_n$，而第四列即是我们要找的答案。

即

$$S_1+S_2+\cdots S_n=C_{n+2}^{3}=\frac{(n+2)!}{(n-1)!3!}=(n+2)\cdot (n+1)\cdot n/6$$

则

$$36*(S_1+S_2+\cdots S_n)^2=(n+2)\cdot (n+2)\cdot (n+1)\cdot (n+1)\cdot n\cdot n$$

对了，别忘了处处取模。

```c++
##define mo 1000000007

int main(){
	int t;
	cin >> t;
	long long n;
	while (t--){
		cin >> n;
		cout << ((((n+2)*(n+1)%mo)*(n*(n+2)%mo)%mo)*((n+1)*n%mo))%mo;
		if(t) cout<<"\n";
	}
}
```

<!-- endtab -->

{% endtabs %}

## 进制转化

&emsp;&emsp;小Z学了进制表示法，他可以把一个十进制数 4 转化成二进制`0b100`或者`100B`

&emsp;&emsp;其中 0b 和 B 都是二进制的标识

&emsp;&emsp;已知：

|进制|标识|
|:-:|:-:|
|二进制|前加`0b`或后加`B`|
|八进制   |前加`0o`或后加`O`   |
|十六进制   |前加`0x`或者后加`H`   |

&emsp;&emsp;请你把一些数根据对应的标识化成十进制数。

### 输入格式

一个整数`T`(1 ≤ `T` ≤ 10000) 表示有多少个进制数需要转化成十进制。

下面`T`行每行一个或二或八或十六进制的数。

保证转化后的十进制下的数小于 2<sup>31</sup>。

### 输出格式

&emsp;&emsp;`T`行分别是对应输入的十进制数。

### 输入样例

> 3
> 100B
> 0o100
> 100H

### 输出样例

> 4
> 64
> 256

### 提示

&emsp;&emsp;十六进制下 10 用字母 a 表示， 11 用字母 b 表示，以此类推……

&emsp;&emsp;十六进制中字母可用大写或小写字母表示。

### 题解

&emsp;&emsp;难度不大，但是有坑，要注意十六进制数结尾可能为`B`。

{% tabs jzzh %}

<!-- tab C语言 -->

```c
//进制转换，将指定进制的数字转换为十进制
//参数：
//  str - 包含数字的字符串
//  start - 数字在字符串中的起始位置（不包含）
//  end - 数字在字符串中的结束位置（包含）
//  k - N进制（十六进制为16）
//返回值：
//  转换后的数字(int)
int conversation(char str[], int start, int end, int k) {
    int result = 0;
    for (int i = end, mi = 1; i != start; --i, mi *= k) {
        if (isdigit(str[i])) result += mi * (str[i] - '0');
        else result += mi * (toupper(str[i]) - 'A' + 10);
    }
    return result;
}

int main() {
    int n, k;
    scanf("%d%*c", &n);
    char str[40];
    int wrap = false;
    while (n--) {
        if (wrap) printf("\n");
        else wrap = true;
        gets(str);
        int start = -1, end, base;  //存储数字区间以及进制
        int len = strlen(str);

        if (str[0] == '0') {    //如果字符串以0开头
            start = 1;  end = len - 1;
            switch (str[1]) {   //判断第二位是否满足某个进制的规则
                case 'b': case 'B': base = 2; break;
                case 'o': case 'O': base = 8; break;
                case 'x': case 'X': base = 16; break;
                default: start = -1; break; //如果不满足则将start恢复初值
            }
        }
        if (start == -1) {  //start为-1表明开头没有标明进制类型
            end = len - 2;
            switch (str[len - 1]) {    //判断结尾符号满足哪一个
                case 'b': case 'B': base = 2; break;
                case 'o': case 'O': base = 8; break;
                default: base = 16; break;
            }
        }
        //打印结果
        printf("%d", conversation(str, start, end, base));
    }
    return 0;
}
```

<!-- endtab -->

<!-- tab C++ -->

```c++
//进制转换，将指定进制的数字转换为十进制
//参数：
//  str - 包含数字的字符串
//  start - 数字在字符串中的起始位置（不包含）
//  end - 数字在字符串中的结束位置（包含）
//  k - N进制（十六进制为16）
//返回值：
//  转换后的数字(int)
int conversation(string& str, int start, int end, int k) {
    int result = 0;
    for (int i = end, mi = 1; i != start; --i, mi *= k) {
        if (isdigit(str[i])) result += mi * (str[i] - '0');
        else result += mi * (toupper(str[i]) - 'A' + 10);
    }
    return result;
}

int main() {
    int n, k;
    scanf("%d%*c", &n);
    string str;
    int wrap = false;
    while (n--) {
        if (wrap) printf("\n");
        else wrap = true;
        getline(cin, str);
        int start = -1, end, base;  //存储数字区间以及进制

        if (str[0] == '0') {    //如果字符串以0开头
            start = 1;  end = str.length() - 1;
            switch (str[1]) {   //判断第二位是否满足某个进制的规则
                case 'b': case 'B': base = 2; break;
                case 'o': case 'O': base = 8; break;
                case 'x': case 'X': base = 16; break;
                default: start = -1; break; //如果不满足则将start恢复初值
            }
        }
        if (start == -1) {  //start为-1表明开头没有标明进制类型
            end = str.length() - 2;
            switch (str[str.length() - 1]) {    //判断结尾符号满足哪一个
                case 'b': case 'B': base = 2; break;
                case 'o': case 'O': base = 8; break;
                default: base = 16; break;
            }
        }
        //打印结果
        printf("%d", conversation(str, start, end, base));
    }
    return 0;
}
```

<!-- endtab -->

{% endtabs %}

## 小Z爱读书

&emsp;&emsp;“书中自有黄金屋 书中自有颜如玉”，噢！小Z现在太爱读书了，以至于做梦都在想读书的画面。现在他想回想一下梦里的场景，也就是一本书的画面，这本书是立体的，所以是一个长方体。 他需要画出这个长方体的立体图像以便向大家分享他梦中的场景，如图所示是一个长为 7 宽为 4 高为 5 的长方体。

> &emsp;&emsp;&emsp;@@@@@@@
> &emsp;&emsp;@&emsp;&emsp;&emsp;&emsp;&emsp;@@
> &emsp;@&emsp;&emsp;&emsp;&emsp;&emsp;@&emsp;@
> @@@@@@@&emsp;&emsp;@
> @&emsp;&emsp;&emsp;&emsp;&emsp;@&emsp;&emsp;@
> @&emsp;&emsp;&emsp;&emsp;&emsp;@&emsp;@
> @&emsp;&emsp;&emsp;&emsp;&emsp;@@
> @@@@@@@

&emsp;&emsp;现在请你帮小Z用任意字符画出长为`a`，宽为`b`，高为`c`的长方体。

### 输入格式

&emsp;&emsp;单实例。

&emsp;&emsp;第一行一个字符`t`表示需要用`t`来构建出长方体。

&emsp;&emsp;第二行三个数`a`, `b`, `c`表示长方体的长宽高(1 ≤ `a`, `b`, `c` ≤ 500)。

### 输出格式

 &emsp;&emsp;输出小Z梦中长方体的样子。

### 输入样例

 > @
 > 7 4 5

### 输出样例

> &emsp;&emsp;&emsp;@@@@@@@
> &emsp;&emsp;@&emsp;&emsp;&emsp;&emsp;&emsp;@@
> &emsp;@&emsp;&emsp;&emsp;&emsp;&emsp;@&emsp;@
> @@@@@@@&emsp;&emsp;@
> @&emsp;&emsp;&emsp;&emsp;&emsp;@&emsp;&emsp;@
> @&emsp;&emsp;&emsp;&emsp;&emsp;@&emsp;@
> @&emsp;&emsp;&emsp;&emsp;&emsp;@@
> @@@@@@@

### 题解

&emsp;&emsp;题其实不难，找到规律就能写出来。注意长宽高可能为`1`这个坑。

```c
int len, width, height;
char p;

//打印指定数量个空格
void printSpace(int n) {
    for (int i = 0; i != n; ++i) printf(" ");
}

//打印指定数量个字符
void printfChar(int n) {
    for (int i = 0; i != n; ++i) printf("%c", p);
}

//获取最右侧的高所在那条线在指定行的坐标
int getAfterIndex(int i) {
    static int max = 0;
    //计算初始坐标
    if (max == 0) return (max = len + width - 2);
    if (i <= height) return max;
    //观察图形可以知道：
    //  当总行数下标超过高度时，右侧高会逐渐向左靠近
    //  所以此时每次让坐标减少1就可以了
    return --max;
}

//打印最右侧的高
//参数：
//  i - 当前行数
//  k - 当前行已经打印的字符的数量（包括空格）
//补充：
void printAfter(int i, int k) {
    if (height == 1) return;
    int space = getAfterIndex(i) - k;
    //如果space>=0表明右侧高所在位置已经打印过字符
    if (space >= 0) {
        printSpace(space);
        printf("%c", p);
    }
}

int main() {
    int i = 2;
    scanf("%c %d %d %d", &p, &len, &width, &height);
    printSpace(width - 1);  //打印第一行前方的空格
    printfChar(len);    //打印第一行的符号
    printf("\n");
    //打印两个平行线间的图形
    for (int k = 2; k < width; ++k) {
        printSpace(width - k);  //打印行前空格
        printf("%c", p);    //打印左侧空格
        if (len != 1) {
            //打印中间空格及右侧符号
            printSpace(len - 2);
            printf("%c", p);
        }
        //打印最右侧的高
        printAfter(i++, width - k + len);
        printf("\n");
    }
    if (width != 1) printfChar(len);
    printAfter(i++, len);
    if (width != 1) printf("\n");
    //打印第二组平行线间的图形
    for (int k = 2; k < height; ++k) {
        printf("%c", p);
        if (len != 1) {
            printSpace(len - 2);
            printf("%c", p);
        }
        printAfter(i++, len);
        printf("\n");
    }
    if (height != 1) printfChar(len);
    return 0;
}
```

## 震惊长安第一拳

&emsp;&emsp;作为郑轻第一打野（?），LT 十分擅长裴擒虎这个英雄。开局反蓝，复活反红，两分丢龙，六分点投，震惊长安第一拳的 LT 再次来到了王者峡谷。斩获十连败的 LT 心想：一定是因为自己没有皮肤！于是 LT 偷偷把 CR 写的脚本偷偷复制下来，打算卖掉一部分脚本来买皮肤。

&emsp;&emsp;LT 一共复制了 a 份自瞄脚本，b 份透视脚本，c 份加伤害脚本，他打算将这些脚本打包以套餐的形式卖出。

> 套餐一：购买一份自瞄脚本，一份加伤害脚本，赠送一份透视脚本。
> 套餐二：购买两份自瞄脚本，赠送一份透视脚本。
> 套餐三：购买两份透视脚本，赠送一份自瞄脚本。

&emsp;&emsp;但是 LT 有一个怪癖，他不想向连续的两个人出售同一份套餐。请你帮 LT 算一算，他最多能出售多少份套餐呢？

### 输入格式

输入第一行包含一个正整数`T`(`T` ≤ 10<sup>5</sup>)。

接下来`T`行每行包含 3 个正整数`a`, `b`, `c`(0 ≤ `a`, `b`, `c` ≤ 10<sup>6</sup>)。

依次表示自瞄脚本、透视脚本和加伤害脚本各有多少个。

### 输出格式

&emsp;&emsp;输出`T`行，每行一个整数，表示最多售多少份套餐。

### 输入样例

> 2
> 4 4 0
> 4 2 0

### 输出样例

> 2
> 1

### 样例说明

&emsp;&emsp;在第一组样例中，LT卖出一份套餐二，一份套餐三
&emsp;&emsp;在第二组样例中，LT只能卖出一份套餐二或者一份套餐三

### 题解

&emsp;&emsp;本题题解由[ZYZ](https://www.chivas-regal.top/)提供。

&emsp;&emsp;这个题采⽤⼆分查找正确答案

&emsp;&emsp;可以发现，对于任意套餐，都需要⼀份⾃瞄⼀份透视

&emsp;&emsp;所以我们⼆分⼀下套餐数量，检查合不合法

&emsp;&emsp;令 分别为如果⼀份套餐只有“⾃瞄和透视”，剩余⾃瞄

&emsp;&emsp;个数、透视个数、加伤害个数

&emsp;&emsp;第⼀个套餐要加⼀个“加伤害”，第⼆个要加⼀个“⾃瞄”，第三个加⼀个“透视”

&emsp;&emsp;因为不能有连续的套餐，所以任意的套餐数量为

&emsp;&emsp;我们⼆分出来的 （套餐数量），检查⽅式就是尽可能充分利

&emsp;&emsp;⽤我们的剩余脚本个数多拿

&emsp;&emsp;看看在这⼀次情况下我们可以拿的套餐数量是否多于 ，如果

&emsp;&emsp;多了就继续往上⼆分，否则往下⼆分

&emsp;&emsp;(下界是 ，上界是 ⾃瞄 透视 )

```c
int a, b, c;

int min(int a, int b) {
    return a < b ? a : b;
}

int check(int x) {
    int A = a - x, B = b - x, C = c;
    int res = 0;
    int mx = (x + 1) / 2;
    res += min(mx, A);
    res += min(mx, B);
    res += min(mx, C);
    if (res >= x) return 1;
    return 0;
}

int main() {
    int cass;
    for (scanf("%d", &cass); cass; cass--) {
        scanf("%d %d %d", &a, &b, &c);
        int l = 0, r = min(a, b);
        while (l <= r) {
            int mid = (l + r) >> 1;
            if (check(mid)) l = mid + 1;
            else r = mid - 1;
        }
        printf("%d\n", r);
    }
    return 0;
}
```

---

{% tip info %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}
