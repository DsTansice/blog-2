---
title: pta_happy_3
date: 2021-12-02 00:03:14
top_img: false
toc_number: false
categories:
  - C/C++
tags:
  - 教程
  - 题解
  - PTA
cover: https://image.emptydreams.xyz/bg/b22.jpg!/fxfn2/550x500
description: PTA-网安、人工智能21级班级团体训练欢乐赛（三）详细题解
---

# 注意

&emsp;&emsp;该博客是为了帮助同学学习，并非为了协助同学刷题，请读者保持自觉，**请勿做CV工具人**。另外为了节省篇幅，代码中不再写明`#include`，如果遇到我没有声明的函数，那么就是某一个头文件中的函数，读者搜索“`c` + 函数名字”就能查到相关信息。

&emsp;&emsp;为了减轻工作量，本篇题解中不再完全模仿PTA的题目格式，没有特殊说明均表示输入输出结尾无空行。

# 我爱编程

&emsp;&emsp;请编程输出文字：I love Computer,I love Programm,I love C!。

## 输出样例

>I love Computer,I love Programm,I love C!

## 题解

```c
int main() {
    printf("I love Computer,I love Programm,I love C!");
    return 0;
}
```

# 苹果装盘

&emsp;&emsp;有N个苹果要全部装盘，每个盘子装两个，编程输入苹果数量N，输出这些苹果能装多少盘。

## 输入格式

&emsp;&emsp;一个整数N。

## 输出格式

&emsp;&emsp;一个整数，盘子数量。

## 样例1

>input: 15

>output: 20

## 样例2

>input: 8

>output: 10

## 题解

```c
int main() {
    int n;
    scanf("%d", &n);
    printf(((n % 2 == 0) ? (n / 2) : ((n / 2) + 1)));
    return 0;
}
```

# 三天打鱼两天晒网

&emsp;&emsp;中国有句俗语叫“三天打鱼两天晒网”。假设某人从某天起，开始“三天打鱼两天晒网”，问这个人在以后的第N天中是“打鱼”还是“晒网”？

## 输入格式

&emsp;&emsp;输入在一行中给出一个不超过1000的正整数N。

## 输出格式

&emsp;&emsp;在一行中输出此人在第N天中是“Fishing”（即“打鱼”）还是“Drying”（即“晒网”），并且输出“in day N”。

## 样例1

>input: 103

>output: Fishing in day 103

## 样例2

>input: 34

>output: Drying in day 34

## 题解

```c
int main() {
    int n;
    scanf("%d", &n);
    if (n % 5 >= 1 && n % 5 <= 3) printf(Fishing in day %d", n);
    else printf("Drying in day %d", n);
    return 0;
}
```

# 房子的高度

&emsp;&emsp;众所周知，KUN作为内蒙首富，在内蒙有一座海景房，在房子的最高层恰好可以看到太平洋（在二维平面内近似成一个点）。我们非常想知道KUN到底有多富有以及KUN的房子到底有多高。我们可以通过以下方式对KUN的房子的高度进行估计（由于KUN的房子实在是太高了，我们可以近似的认为房子最高层的高度等于房子的高度）。

![](https://images.ptausercontent.com/1fad4804-f069-44ea-90c3-8448eb304fc1.jpg)

## 输入格式

&emsp;&emsp;一行两个整数表示地球的半径`r`和从房顶到太平洋的距离`d`。（1≤r,d≤10^5^）

## 输出格式

&emsp;&emsp;一行一个实数表示KUN海景房的高度，保证答案是一个整数。

## 输入样例

>3 4

## 输出样例

>2

## 题解

&emsp;&emsp;因为在房子的最高层恰好可以看到太平洋，所以可知∆ABC是直角三角形，故根据勾股定理可算出答案。

```c
int main() {
    unsigned long long r, d;
    scanf("%llu %llu", &r, &d);
    unsigned long long k = r * r + d * d;
    printf("%llu", ((int) sqrt(k) - r));
    return 0;
}
```

# 运输打折问题

&emsp;&emsp;某运输公司对用户计算运费。路程（S）越远，每公里运费越低。标准如下：

![](https://images.ptausercontent.com/414e65c0-a1d9-4419-8b0d-956a66b1e2a3.PNG)

&emsp;&emsp;其中基本运输费用为每吨每公里1元，现请你帮助该运输公司设计自动计费程序，帮助会计人员计算运输费用。

## 输入格式

&emsp;&emsp;输入每次运输的载重（吨）、里程（公里）。

## 输出格式

&emsp;&emsp;输出其运输费用，精确到元。

## 样例1

>input: 1 200

>output: 200

## 样例2

>input: 10 2500

>output: 22500

## 题解

```c
int main() {
    double t, x;
    scanf("%lf %lf", &t, &x);
    double result;
    if (x >= 3000) {
        result = x * 0.85;
    } else if (x >= 2000) {
        result = x * 0.9;
    } else if (x >= 1000) {
        result = x * 0.92;
    } else if (x >= 500) {
        result = x * 0.95;
    } else if (x >= 250) {
        result = x * 0.98;
    } else result += x;
    printf("%.0f", result * t);
    return 0;
}
```

# 三角形

&emsp;&emsp;请构造一个函数，用于判断给定三条边，能不能组成一个三角形。

## 输入格式

&emsp;&emsp;测试数据有多组，处理到文件结尾。每组数据第一行包含一个整数`M`，接下有`M`行，每行一个实例，包含三个正数`A`、`B`、`C`。其中`A`、`B`、`C`均小于`1000`。

## 输出格式

&emsp;&emsp;对于每个测试实例，如果三条边长`A`、`B`、`C`能组成三角形的话，输出`YES`，否则`NO`。

## 输入样例

>2
1 2 3
2 2 2

## 输出样例

>NO
YES

## 题解

```c
int main() {
    int t, a, b, c;
    bool start = false;
    while (scanf("%d", &t)) {
        while (t--) {
            if (start) printf("\n");
            else start = true;
            scanf("%d %d %d", &a, &b, &c);
            if (a + b > c && a + c > b && b + c > a) printf("YES");
            else printf("NO");
        }
    }
    return 0;
}
```

# 逆序输出数字

&emsp;&emsp;程序每次读入一个正整数，然后输出按位逆序的数字。注意：当输入的数字含有结尾的0时，输出不应带有前导的0。

## 输入格式

&emsp;&emsp;输入一个正整数。

## 输出格式

&emsp;&emsp;不带前导零的反序正整数。

## 输入样例

>71800

## 输出样例

>817

## 题解

```c
int main() {
    char str[50];
    scanf("%s", str);
    int len = strlen(str);
    bool start = false;
    for (int i = len - 1; i != -1; --i) {
        if (str[i] == '0') {
            if (!start) continue;   //跳过第一个非零数字前的所有零
        } else {
            start = true;   //当遇到第一个非零数字时表示输出开始
        }
        printf("%c", str[i]);
    }
    if (!start) printf("0");    //处理输入为0的情况
    return 0;
}
```

# 计算最大值出现的次数

&emsp;&emsp;计算一维数组中最大值出现的次数。

## 输入格式

&emsp;&emsp;输入在一行`n`（ `n <= 1000`，代表数组的大小）,在下一行中输入`n`个整数，为一维数组的元素。

## 输出格式

&emsp;&emsp;输出最大值和出现的次数。

## 输入样例

>4
4 2 2 4

## 输出样例

>4 2

## 题解

```c
int main() {
    int n, k;
    scanf("%d", &n);
    int max = INT_MIN;
    int amount[1001] = {0};
    for (int i = 0; i != n; ++i) {
        cin >> k;
        if (k > max) max = k;
        ++amount[k];
    }
    printf("%d %d", max,amount[max]);
    return 0;
}
```

# 图形打印A

&emsp;&emsp;输入一个数字`d`以及一个正整数`n` ，然后使用给定数字`d`作为基本有元素打印`2n-1`行的图形，图形第一行1个`d`，第二行2个，第三行3个……以此类推；然后从第`n+1`行开始，每一行比上一行少一个，直到第`2n-1`行只有一个`d`。相见样例。

## 输入格式

&emsp;&emsp;输入一个数字`d`以及一个正整数`n`。`d`只会是`0~9`中的某个数 ， 1<=`n`<=100。

## 输出格式

&emsp;&emsp;按照要求输出图形。

## 输入样例

>0 5

## 输出样例

>0
00
000
0000
00000
0000
000
00
0

## 题解

```c
int main() {
    int d, n;
    scanf("%d %d", &d, &n);
    for (int i = 1; i < n; ++i) {
        for (int k = 0; k != i; ++k) printf("%d", d);
        printf("\n");
    }
    for (int i = n; i != 0; --i) {
        for (int k = 0; k != i; ++k) printf("%d", d);
        if (i != 1) printf("\n");
    }
    return 0;
}
```

# 相邻数对

&emsp;&emsp;给定`n`个不同的整数，问这些数中有多少对整数，它们的值正好相差1。

## 输入格式

&emsp;&emsp;输入的第一行包含一个整数`n`，表示给定整数的个数。 第二行包含所给定的`n`个整数（1 <= n <= 1000并且所有整数均属于[0, 10000]）。

## 输出格式

&emsp;&emsp;输出一个整数，表示值正好相差1的数对的个数。

## 输入样例

>6
10 2 6 3 7 8

## 输出样例

>3

## 样例说明

&emsp;&emsp;值正好相差1的数对包括(2, 3), (6, 7), (7, 8)。

## 题解

```c
int main() {
    int n;
    scanf("%d", &n);
    int size = 0;
    int nums[n];
    int result = 0;
    for (int i = 0; i != n; ++i) {
        scanf("%d", &nums[i]);
        for (int k = 0; k != size; ++k) {
            if (abs(nums[k] - nums[i]) == 1) ++result;
        }
        ++size;
    }
    printf("%d", result);
    return 0;
}
```

# 素因子分解

&emsp;&emsp;给定某个正整数 N，求其素因子分解结果，即给出其因式分解表达式 N=p~1~​^k1^×p~2~^k2^⋯p~m~^km^。

## 输入格式

&emsp;&emsp;输入`long int`范围内的正整数`N`。

## 输出格式

&emsp;&emsp;按给定格式输出N的素因式分解表达式，即 N=p1^k1* p2^k2 * … * pm^km，其中`pi`为素因子并要求由小到大输出，指数`ki`为`pi`的个数；当`ki`为`1`即因子`pi`只有一个时不输出`ki`。

## 输入样例

>1323

## 输出样例

>1323=3\^3\*7\^2

## 题解

&emsp;&emsp;本题题解由探姬妹妹提供，本人负责格式化，想要解释请到QQ群`@探姬`，或者发送邮件至admin@probius.xyz。

```c
int main() {
    long long n;//long long防爆
    bool flag = false;//标志是否需要打印*
    scanf("%lld", &n);
    printf("%lld=", n);

    if (n > 1) {
        //开始遍历：
        for (long long i = 2; i <= n; i++) {
            long long p = 0, k = 0;
			//求余判断得质因数，循环刷新指数值：
            while (n % i == 0) {
                n /= i;
                p = i;
                k++;
            }
			//常规拼接 pn^kn 的打印处理
            if (p != 0) {
                if (flag) printf("*");
                else flag = true;
                printf("%lld", p);
            }
            if (k > 1) printf("^%lld", k);
        }
    } else printf("1");//特殊情况
    return 0;
}
```

# 位运算

&emsp;&emsp;给定一个数，将该数的某二进制位上置0、置1或取反。

## 输入格式

&emsp;&emsp;第1行：输入一个十进制整数。（32位int取值范围，其二进制数补码表示）

&emsp;&emsp;第2行后：每行输入一个位操作运算要求。

&emsp;&emsp;格式：输入位操作运算类型（1表示置0， 2表示置1，3表示按位取反） 位数（从最低位向高位，范围从0~31）

&emsp;&emsp;最终以键盘输入^Z 或 文件结束(EOF标志)。

## 输出格式

&emsp;&emsp;输出位运算后的整数值。

## 输入样例

>3
1 0
1 1
2 3
3 1
3 2
2 0

## 输出样例

>15

## 题解

&emsp;&emsp;这道题涉及到了二进制的计算（位运算），不了解的童鞋可以先去看[《二进制运算从入门到入坟》](https://blog.emptydreams.xyz/binary/)，了解位运算之后这道题就很简单了。

```c
int main() {
    int n, op, k;
    scanf("%d", &n);
    while (scanf("%d %d", &op, &k)) {
        switch (op) {
            case 1: {
                int value = ~(1 << k);
                n &= value;
                break;
            }
            case 2: {
                int value = 1 << k;
                n |= value;
                break;
            }
            default: {
                int value = (n >> k) & 1;
                if (value == 1) {
                    value = ~(1 << k);
                    n &= value;
                } else {
                    value = 1 << k;
                    n |= value;
                }
                break;
            }
        }
    }
    cout << n;
    return 0;
}
```

# 检查密码

&emsp;&emsp;本题要求你帮助某网站的用户注册模块写一个密码合法性检查的小功能。该网站要求用户设置的密码必须由不少于6个字符组成，并且只能有英文字母、数字和小数点`.`，还必须既有字母也有数字。

## 输入格式

&emsp;&emsp;输入第一行给出一个正整数`N`（`N` ≤ 100），随后`N`行，每行给出一个用户设置的密码，为不超过 80 个字符的非空字符串，以回车结束。

**注意**： 题目保证不存在只有小数点的输入。

## 输出格式

&emsp;&emsp;对每个用户的密码，在一行中输出系统反馈信息，分以下5种：

<ul>
<li> 如果密码合法，输出<code>Your password is wan mei.</code>
<li> 如果密码太短，不论合法与否，都输出<code>Your password is tai duan le.</code>
<li> 如果密码长度合法，但存在不合法字符，则输出<code>Your password is tai luan le.</code>
<li> 如果密码长度合法，但只有字母没有数字，则输出<code>Your password needs shu zi.</code>
<li> 如果密码长度合法，但只有数字没有字母，则输出<code>Your password needs zi mu.</code>
</ul>

## 输入样例

>5
123s
zheshi.wodepw
1234.5678
WanMei23333
pass*word.6

## 输出样例

>Your password is tai duan le.
Your password needs shu zi.
Your password needs zi mu.
Your password is wan mei.
Your password is tai luan le.

## 题解

```c
int main() {
    int n, input;
    scanf("%d", &n);
    getchar();
    bool start = false;
    while (n--) {
        if (start) printf("\n");
        else start = true;
        int dig = 0;
        int alp = 0;
        int len = 0;
        bool err = false;
        while ((input = getchar()) != '\n' && input != EOF) {
            ++len;
            if (err) continue;
            if (isdigit(input)) ++dig;
            else if (isalpha(input)) ++alp;
            else if (input != '.') err = true;
        }
        if (len < 6) cout << "Your password is tai duan le.";
        else if (err) cout << "Your password is tai luan le.";
        else if (dig == 0) cout << "Your password needs shu zi.";
        else if (alp == 0) cout << "Your password needs zi mu.";
        else cout << "Your password is wan mei.";
    }
    return 0;
}
```

# 求解幂集问题

&emsp;&emsp;参见[求解幂集问题(c语言+蛮力法)](https://blog.csdn.net/MJ980629/article/details/105971921)。

# 有课几何

&emsp;&emsp;小明看到课表上某课程的上课周次是这样标示的：1, 8,12-17,3-6 。请你编写程序，将从输入设备上输入的如前述类似的周次表示字符串，转换成标准的周次表示。

## 输入格式

&emsp;&emsp;一个数字表示某一周，两个数字中间以`-`号分隔的表示某周次区间，`a-b`表示 区间`[a,b]`，程序确保`a<b`，但不能够确保周次间是升序排列的。所有的周次在`[1，20]`内。 输入有若干行，每行一个课程的上课周次。

## 输出格式

&emsp;&emsp;从小到大的顺序输出有课程的周次，周与周间以逗号分隔，最后没有逗号。

## 输入样例

>3-5,8,13-15,17,10-12
13-18,5-9
3-13 , 13 - 17

## 输出样例

>3,4,5,8,10,11,12,13,14,15,17
5,6,7,8,9,13,14,15,16,17,18
3,4,5,6,7,8,9,10,11,12,13,14,15,16,17

## 题解

&emsp;&emsp;这道题最大难点在如何正确的输入数据，因为输入数据没有标准的规律，可能有`-`也可能没有，可能连着好几个数字也可能连着都是`a-b`。

&emsp;&emsp;我的处理方法是先把一整行读出来，然后在末尾添加一个`,`（这样做是为了内部读取的时候不会停在最后面，后面会再细说），处理时通过`sscanf`处理数据。

&emsp;&emsp;这道题不会`C++`的就看[网上的代码](https://bbs.csdn.net/topics/399056888)吧。

```c++
using std::vector;
using std::string;
using std::sort;
using std::max;
using std::getline;
using std::cin;
using std::isdigit;

struct node {
    int start;  //区间的起始位置
    int end;    //区间的结束位置
    //重载小于操作符，用于排序
    bool operator <(const node& obj) const {
        return start < obj.start;
    }
};

//输出数据
void printAll(vector<node>& record) {
    static bool space = false;  //存储是否需要打印换行符
    if (space) printf("\n");
    else space = true;
    sort(record.begin(), record.end()); //排序
    int last = 0;   //存储上一个区间的结束位置
    bool start = false;
    for (const auto &item : record) {
        //使用max获取本次起始和上次结束的最大值，防止打印重复的值
        for (int i = max(item.start, last + 1); i <= item.end && i > last; ++i) {
            last = i;   //更新
            if (start) printf(",");
            else start = true;
            printf("%d", i);
        }
    }
}

int main() {
    string str;
    int start = -1, end = -1;
    while (getline(cin, str)) {
        str.push_back(',');
        vector<node> record;
        int k;
        for (int i = 0; i != str.length(); ++i) {
            if (isdigit(str[i])) {
                //从字符串中读取数据
                sscanf(&str[i], "%d", &k);
                if (k > 10) ++i;    //如果数字大于10说明该数字占两格
                if (start == -1) start = k;
                else end = k;
            } else if (str[i] == ',') {
                //遇到逗号时标志一个区间的结束
                //如果end为-1表示该区间只有一个数字
                //到这里可以很清楚的明白为什么要在末尾添加一个逗号了
                //没有逗号的话读取完最后一个数字会卡在sscanf
                if (end == -1) end = start;
                record.push_back({start, end});
                //now数据
                start = end = -1;
            }
        }
        printAll(record);
    }
    return 0;
}
```

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}
