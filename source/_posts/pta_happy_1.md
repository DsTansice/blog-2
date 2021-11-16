---
title: PTA-21班级团体训练欢乐赛(一)题解
date: 2021-11-15 20:31:10
top_img: false
categories: 
  - C/C++
tags:
  - 教程
  - 题解
cover: https://image.emptydreams.xyz/bg/b18.jpg!/fxfn2/550x500
description: PTA-网安、人工智能21级班级团体训练欢乐赛（一）详细题解
---



# 注意

&emsp;&emsp;[点击查看题目列表](https://pintia.cn/problem-sets/1456526446360133632/problems/type/7)

&emsp;&emsp;为了避免不必要的问题，这里不再列出题目信息，只说明标题。同时该博客是为了帮助同学学习，并非为了协助同学刷题，请读者保持自觉，**请勿做CV工具人**。另外为了节省篇幅，代码中不再写明`#include`，如果遇到我没有声明的函数，那么就是某一个头文件中的函数，读者搜索“`c` + 函数名字”就能查到相关信息。

# 直角三角形面积

&emsp;&emsp;改题目直接套用海伦公式即可：

```C
int main () {
    int t, a, b, c;
    scanf("%d", &t);
    while (t--) {
        scanf("%d %d %d", &a, &b, &c);
        double p = (a + b + c) / 2.0;
        double s = sqrt(p * (p - a) * (p - b) * (p - c));
        printf("%.0f\n", s);
    }
    return 0;
}
```

# sdut-分数加减法

&emsp;&emsp;这道题难度较大，需要进行两个分数的加减法。首先我们要考虑如何存储数据，这里有两个方案：

<ol>
    <li>使用<code>double</code>存储分数</li>
    <li>使用两个整数分别存储分子和分母</li>
</ol>

&emsp;&emsp;第一个方案运算起来十分方便，到最后还需要想办法把`double`转换成分数的表示形式，可以通过以下代码得出结果（没有做特殊数据的处理）：

```C
//用于化简分子和分母
//参数：
//	numerator - 分子
//	numerator - 分母
void reduce(int* numerator, int* denominator) {
    //声明n和d只是因为*?打出来太麻烦了，可以选择直接用指针
    int n = *numerator;
    int d = *denominator;
    int min = n < d ? n : d;
    for (int i = min; i != 1 && abs(n) > 1; --i) {
        hear:
        if (n % i == 0 && d % i == 0) {
            n /= i;	d /= i;
            goto hear;
        }
    }
    *numerator = n;
    *denominator = d;
}

//整数求base的power次幂
//参数：
//	base - 底数
//	power - 幂
int intPow(int base, int power) {
    int result = 1;
    for (int i = 0; i < power; ++i) {
        result *= base;
    }
    return result;
}

//裁剪掉小数后面多余的0
void preProcess(char value[]) {
    int zeroIndex = -1;
    bool start = false;
    bool pre = false;
    for (int i = 0; value[i] != '\0'; ++i) {
        if (start) {
            if (value[i] == '0') {
                if (!pre) {
                    zeroIndex = i;
                    pre = true;
                }
            } else pre = false;
        } else if (value[i] == '.') {
            start = true;
        }
    }
    if (pre) value[zeroIndex] = '\0';
}

//将小数部分转换成整型
//参数：
//	value[] - 存储小数的字符串
//	length* - 用于存储小数长度的int指针
//	result* - 用于存储结果的int指针
//注意：
//	如果字符串中不包含小数点则长度与值都为0
void strDecimal2Int(char value[], int* result, int* length) {
    preProcess(value);
    bool start = false;
    *result = *length = 0;
    for (int i = 0; value[i] != '\0'; ++i) {
        if (start) {
            ++(*length);
            *result *= 10;
            *result += value[i] - '0';
        } else if (value[i] == '.') {
            start = true;
        }
    }
}

//以分数形式打印double（不会自动换行）
void printDouble(double value) {
    static char data[50];
    int decimal, length;
    sprintf(data, "%f", value);	//将double转换为字符串
    strDecimal2Int(data, &decimal, &length);	//提取其中的小数部分
    int denominator = intPow(10, length);	//计算分母
    reduce(&decimal, &denominator);	//化简
    int integer = (int) value;	//获取double的整数部分
    decimal += integer * denominator;	//将整数部分整合到分子上
    //打印值
    if (value < 0) printf("-");
    printf("%d/%d", decimal, denominator);
}
```

&emsp;&emsp;现在我们只需要调用`printDouble`就可以按照分数形式打印小数了ヾ(≧▽≦*)o！但是还没高兴太久，我们就发现这个方案有一个致命的缺陷，因为不是所有分数都是有限小数，一旦两个数构成了无限小数或小数位大于16的小数，那么这个方案便会丢失精度，输出奇奇怪怪的数据。

&emsp;&emsp;欸，搞了半天，又要重新来做第二个方案了。我们需要考虑以下问题：（化简的代码上面谢过了就不写了）

<ul>
    <li>如何进行加减操作？</li>
    <li>什么时候通分和化简？</li>
    <li>如何处理特殊值？</li>
</ul>

&emsp;&emsp;首先，进行加减操作前我们肯定需要先进行通分才行，但是有出现了一个问题，如何通分？有两个选择：

<ol>
    <li>最简通分</li>
    <li>直接相乘</li>
</ol>

&emsp;&emsp;第一种方法看似可以减少后面的计算量，但是求最简通分仍然需要进行大量计算，并且加减运算后还需要进行化简，很可能得不偿失，并且代码复杂度明显大于第二种，所以我们采用第二种方法。

&emsp;&emsp;然后加减操作的方法就非常简单了，通分后直接运算即可。

&emsp;&emsp;最后，我们还需要处理特殊值。我们先来考虑有什么特殊值：

<ol>
    <li>零</li>
    <li>非零整数</li>
    <li>负数</li>
</ol>

&emsp;&emsp;为什么`0`要和非零整数分开考虑呢？因为无法通过`0 % *`的方式判断其是否为整数，并且还会报错。知道需要考虑什么类型的整数后思路就清晰了，直接判断是否为特殊值然后特殊处理即可。最终，我们写下下面的代码：

```C
int main () {
    //a0,a1为第一个数的分子和分母
    //b0,b1为第二个数的分子和分母
    //m为通分后的分母
    int a0, a1, b0, b1, m;
    char op;	//操作符
    int k = 0;	//换行标识符，防止第一次计算也打印换行符
    while (~scanf("%d/%d%c%d/%d", &a0, &a1, &op, &b0, &b1)) {
        if (k == 0) k = 1;
        else printf("\n");
        if (a1 == b1) {	//如果两个数分母相同则不通分
            m = a1;
        } else {	//如果分母不同则进行通分
            m = a1 * b1;
            a0 *= b1;
            b0 *= a1;
        }
        int z = op == '+' ? a0 + b0 : a0 - b0;	//加减操作
        if (z == 0) printf("0");
        else if (z % m == 0) printf("%d", z / m);
        else {
            reduce(&z, &m);	//化简
            if (m * z < 0) printf("-");
            printf("%d/%d", abs(z), abs(m));
        }
    }
    return 0;
}
```

# 置点不动产——认真学习，努力工作买买房子吧

&emsp;&emsp;这个题也很简单，需要注意的就是到底先判断年份还是先计算涨幅，直接上代码：

```C
int main () {
    int n, k, i;
    scanf("%d %d", &n, &k);
    long long sum = n;
    double money = 200;
    double bl = (100 + k) / 100.0;
    for (i = 1; i != 21 && sum < money; ++i) {
        sum += n;
        money *= bl;
    }
    if (i == 21) printf("Impossible");
    else printf("%d", i);
    return 0;
}
```

# 综艺节目打分计算问题

&emsp;&emsp;这个题有两个思路：

<ol>
    <li>先输入所有值，然后排序，最后计算除去首位和末尾的总值并求平均数</li>
    <li>计算所有数的总和，然后减去最大值和最小值，最后求平均值</li>
</ol>

&emsp;&emsp;很明显第二个思路更加简单，这里也直接给出代码：

```C
int main () {
    unsigned long long sum = 0;
    int min = 101, max = -1;
    int temp;
    int size = -2;
    while (~scanf("%d", &temp)) {
        sum += temp;
        if (temp < min) min = temp;
        if (temp > max) max = temp;
        ++size;
    }
    sum -= min;	sum -= max;
    printf("%lld", sum / size);
    return 0;
}
```

# 数字金字塔

&emsp;&emsp;这道题是非常经典的题目，所有这种打印图形的题目的思路都一样，就是找规律。这道题要求的图形的规律非常明显，我们规定：

```
n表示总行数
line表示当前行的下标（从1开始）
spaceLength|line表示指定行上的空格数量
```

&emsp;&emsp;其中，`n`为常数，`line`为自变量，易得：

```
spaceLength|line = n - line;
```

&emsp;&emsp;随后直接打印就行了：

```C
int main () {
    int n;
    scanf("%d", &n);
    for (int line = 1; line <= n; ++line) {
        int spaceLength = n - line;
        for (int space = 0; space < spaceLength; ++space) printf(" ");
        for (int i = 1; i != line; ++i) printf("%d", i);
        for (int i = line; i != 0; --i) printf("%d", i);
        printf("\n");
    }
    return 0;
}
```

# 分段函数求值

&emsp;&emsp;非常简单的题目，不解释：

```C
int main () {
    double x, result;
    scanf("%lf", &x);
    if (x < 0) {
        result = x * x;
    } else if (x < 10) {
        result = 2 * x - 1;
    } else {
        result = 3 * x - 11;
    }
    printf("%.2f", result);
    return 0;
}
```

# 同数异形体

&emsp;&emsp;这道题的思路也不难，统计各个数字出现的次数就能判断是否为同数异形体（记得考虑相等的情况）：

```C
int main () {
    //存储两个数
    char num0[11], num1[11];
    scanf("%s %s", nm0, num1);
    bool equal = true;	//存储两个数是否相等
    bool length = true;	//存储两个数的长度是否相等
    int result0[10] = {0};	//存储第一个数中各个数出现的次数
    int result1[10] = {0};	//存储第二个数中各个数出现的次数
    for (int i = 0; ; ++i) {
        //如果单独一个数先遇到了结束符，则两个数的长度不相等
        //如果同时遇到结束符则不做特殊标志直接退出循环
        if (num0[i] == '\0') {
            if (num1[i] != '\0') length = false;
            break;
        } else if (num1[i] == '\0') {
            length = false;
            break;
        }
        //更新统计数据
        ++result0[num0[i] - '0'];
        ++result1[num1[i] - '0'];
        //如果当前位上的数不相等，则两个数一定不相等
        if (num0[i] != num1[i]) equal = false;
    }
    //如果两个数长度不相等则一定不相等且不是同数异形体
    if (!length) printf("Different");
    else if (equal) printf("Equal");
    else {
        bool result = true;
        //遍历两个数组判断各个数出现的次数是否相同
        for (int i = 0; i < 10; ++i) {
            if (result0[i] != result1[i]) {
                result = false;
                break;
            }
        }
        printf(result ? "ALIEN" : "Different");
    }
    return 0;
}
```

&emsp;&emsp;下面是探姬小姐姐提供的代码，性能表现没有具体测试，各有优劣（不同的地方就是我的是直接逐位处理数据，探姬是先整体分析然后再判断，我稍微改动了亿点点）：

```C
int main() {
    char s1[100], s2[100];
    scanf("%s", s1);
    scanf("%s", s2);
    //判断两个字符串是否相等
    if (strcmp(s1,s2) == 0) printf("Equal");
    else {
        int s1_num[10] = {0}, s2_num[10] = {0};
        //统计各个数字的出现次数
        for (int i = 0; i < strlen(s1); i++) s1_num[s1[i] - '0']++;
        for (int i = 0; i < strlen(s2); i++) s2_num[s2[i] - '0']++;
        //判断出现次数是否相等
        for (int i = 0; i < 10; i++) {
            if (s1_num[i] != s2_num[i]) {
                printf("Different");
                return 0;
            }
        }
        printf("ALIEN");
    }
    return 0;
}
```



# n个小朋友分糖果

&emsp;&emsp;这道题我们先考虑怎么存储数据，很显然，我们应该用数组存储。接下来，这道题最难的地方就来了，我们都知道，数组是有头有尾的，那么如何在逻辑上让这个数组首尾相连？当然，我们不能通过修改内存来实现这个效果，但是我们可以通过一些“旁门左道”实现这个功能，即通过两个函数计算下一个坐标和上一个坐标，就能做到无缝衔接数组的开头和结尾：

```C
//获取上一个小朋友的下标
//参数：
//	index - 当前下标
//	n - 数组长度
int getPre(int index, int n) {
    if (index - 1 == -1) return n - 1;
    else return index - 1;
}

//获取下一个小朋友的下标
//参数：
//	index - 当前下标
//	n - 数组长度
int getNext(int index, int n) {
    if (index + 1 == n) return 0;
    else return index + 1;
}
```

&emsp;&emsp;接下来我们需要处理分糖的操作，这里我们同样封装成一个函数，这样后面只需要无脑调用就可以了：

```C
//参数：
//	nums[] - 存储糖果数量的数组
//	index - 要进行分糖的下朋友的下标
//	n - 数组长度（小朋友的数量）
void task(int nums[], int index, int n) {
    int k = nums[index] / 3;
    nums[index] = k;	//更新当前小朋友糖的数量
    nums[getPre(index, n)] += k;	//增加左侧小朋友糖的数量
    nums[getNext(index, n)] += k;	//增加右侧小朋友糖的数量
}
```

&emsp;&emsp;输入、输出和无脑调用环节：

```C
int main() {
    int n;
    scanf("%d", &n);
    int nums[n];
    for (int i = 0; i < n; ++i) scanf("%d", &nums[i]);
    for (int i = 0; i < n; ++i) {
        task(nums, i, n);
    }
    for (int i = 0; i < n; ++i) printf(" %d", nums[i]);
    return 0;
}
```

# 真睡还是装睡

&emsp;&emsp;非常简单，不做解释：

```C
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    if (a < 15 || a > 20 || b < 50 || b > 70) printf("F");
    else printf("T");
    return 0;
}
```

# 最小回文数

&emsp;&emsp;这道题最难的地方就是如何按从小到大的顺序生成回文数，我们有两种方法：

## 方法一

&emsp;&emsp;暴力生成法，逐个测试是否为回文数，直到遇到回文数然后返回。代码中的`isPalindrome`是判断一个数是否为回文数，因为该方法非常消耗时间，基本上不可用，不再给出`isPalindrome`的定义。（有人说这道题数据很水，有想法的童鞋可以自己试一试。）

```C
int create(int min) {
    for (int i = min + 1; i <= INT_MAX; ++i) {
        if (isPalindrome(i)) return i;
    }
    return -1;
}
```

## 方法二

&emsp;&emsp;这道题优解难度较大，直接上代码，能看懂的看懂，看不懂的就自己试试暴力算法吧：

```C
//将数组形式的数转换为整型
lu arrayToInt(const int nums[], int n) {
    lu result = 0;
    for (int i = n - 1, s = 1; i != -1; --i, s *= 10) {
        result += nums[i] * s;
    }
    return result;
}

//使当前回文数指定位数+1
//参数：
//  nums[] - 当前回文数
//  length - 回文数长度
//  left - 左侧自加位点下标
//  right - 右侧自加位点下标
//返回值：
//  是否生成成功，如果生成的新的回文数的位数大于length就会生成失败
//注：
//  left可以和right相等，两个值相等时不会重复自加
//  不论是否生成成功，都会修改nums的值
bool plus(int nums[], int length, int left, int right) {
    if (++nums[left] == 10) {
        if (left == 0) return false;
        nums[left] = nums[right] = 0;
        return plus(nums, length, left - 1, right + 1);
    } else {
        nums[right] = nums[left];
    }
    return true;
}

//计算一个数的长度
int getLength(int n) {
    int result = 0;
    while (n != 0) {
        ++result;
        n /= 10;
    }
    return result;
}

//生成一个最小的回文数
//参数：
//  minNum - 最小值（不包含）
lu createMinPalindrome(int minNum) {
    static int cache[12];   //存储回文数
    lu value = 0;   //存储当前回文数的int值
    int minLength = getLength(minNum);    //获取最小值的长度，以获取回文数的最小长度
    //如果最小数只有一位直接返回结果
    if (minLength <= 1) return minNum == 9 ? 11 : minNum + 1;
    for (int length = minLength; ; ++length) {
        //初始化cache
        memset(cache, 0, sizeof(int) * length);
        cache[0] = cache[length - 1] = 1;   //首尾位置的数替换成1
        int k = length / 2; //计算中点下标，奇偶情况分别处理
        int left = (length % 2 == 0 ? k - 1 : k);
        //循环自增，直到比minNum大
        //do-while的条件是为了在所有位都为9后进入下一次外部循环
        //这道题很明显只有minNum各个位上均为9时会进入第二次外部循环
        //因为概率出现较低，提前判断会让平均运行时间增大，就不提前判断了
        do {
            value = arrayToInt(cache, length);
            if (value > minNum) return value;
        } while (plus(cache, length, left, k));
    }
}

int main () {
    int t, n;
    scanf("%d", &t);
    while (t--) {
        scanf("%d", &n);
        printf("%u\n", createMinPalindrome(n));
    }
    return 0;
}
```



---

{% tip info %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}





















