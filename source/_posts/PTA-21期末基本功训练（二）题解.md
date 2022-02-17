---
title: PTA-21期末基本功训练（二）题解
top_img: false
cover: 'https://image.kmar.top/bg/b27.jpg!/fw/550'
categories:
  - C/C++
tags:
  - 题解
  - PTA
description: 网安、人工智能21级期末基本功训练（二）详细题解
abbrlink: d7176297
date: 2021-12-12 13:35:57
---

## 注意

&emsp;&emsp;该博客是为了帮助同学学习，并非为了协助同学刷题，请读者保持自觉，**请勿做CV工具人**。另外为了节省篇幅，代码中不再写明`#include`，如果遇到我没有声明的函数，那么就是某一个头文件中的函数，读者搜索“`c` + 函数名字”就能查到相关信息。

&emsp;&emsp;为了减少工作量，这里只写出题干，不再给名输入合适以及样例。

---

## 判断自守数

&emsp;&emsp;所谓自守数(也称守形数)，是指其平方数的低位部分恰为该数本身的自然数。例如：25<sup>2</sup>=625, 因此 25 是自守数。

&emsp;&emsp;注：0 和 1 也算自守数。

&emsp;&emsp;请编写函数，判断自守数。

### 题解

&emsp;&emsp;很简单的题，我们使用`unsigned long long`防止数据溢出，计算后通过循环算出`x`的位数，然后用取模运算判断最后几位是不是与原数相等。

&emsp;&emsp;这道题需要注意的就是输入的`x`也可能不是两位数，有可能是一位数或者三位数、四位数……

```c
int IsAutomorphic(int x) {
    unsigned long long s = (unsigned long long) x * x;
    int temp = x;
    int bit = 1;
    while (temp != 0) {
        temp /= 10;
        bit *= 10;
    }
    return (s % bit) == x;
}
```

## 统计英文字母的个数

&emsp;&emsp;编写函数

&emsp;&emsp;&emsp;`int countAlpha(const char *s);`

&emsp;&emsp;返回字符串`s`中英文字母的个数。

### 题解

&emsp;&emsp;输入的参数中没有给出字符串的长度，所以很明显我们要根据`'\0'`来判断字符串的结尾。这一点也可以说明为什么字符串一定要以`'\0'`结尾，因为很多函数包括标准库中的函数在处理字符串的时候不接受参数来指明字符串长度，而是以`'\0'`当作结束的标志，如果字符串没有以`'\0'`结束，那么就会出现越界访问的现象。同理，如果字符串中间错误的出现了`'\0'`，那么`'\0'`后面的字符就不会被处理。

```c
int countAlpha(const char *s) {
    int result = 0;
    for (int i = 0; s[i] != '\0'; ++i) {
        if (isalpha(s[i])) ++result;
    }
    return result;
}
```

## 国王的金币

&emsp;&emsp;国王将金币作为工资，发放给忠诚的骑士。

&emsp;&emsp;第1天，骑士收到1枚金币：`1`。

&emsp;&emsp;之后两天，每天收到2枚金币：`1 2 2`。

&emsp;&emsp;之后3天每天收到3枚金币：`1 2 2 3 3 3`。

&emsp;&emsp;这种工资发放模式一直延续。

&emsp;&emsp;求给定天数，计算一个骑士获得的金币。

### 题解

&emsp;&emsp;这道题数据并不大，直接模拟即可。我们使用`result`存储金币总量，用`plus`存储今天发放多少个金币，使用`level`标明当前数量的金币持续多少天，使用`amount`标明当天是当前`level`中的哪一天。

```c
int main() {
    int n;
    scanf("%d", &n);
    int result = 0;
    int plus = 1;
    int amount = 0;
    int level = 1;
    for (int i = 0; i != n; ++i) {
        result += plus;
        if (++amount == level) {
            amount = 0;
            ++plus;
            ++level;
        }
    }
    printf("%d", result);
    return 0;
}
```

## 死脑筋

&emsp;&emsp;HDL遇到了一个数学题：10000 元钱，一元钱可以买一瓶水，三个瓶盖可以换一瓶水，请问一共可以喝多少瓶水。死脑筋的 HDL 居然想要通过实践来得到答案，他还到处借钱凑齐 10000元。你决定帮他解出这个问题，为了 HDL 以后不再陷入这样的问题，你决定帮 HDL 写出一个通用程序：有`n`元钱，一元钱可以买一瓶水，`k`个瓶盖换一瓶水，一共可以喝到多少瓶水。

### 题解

&emsp;&emsp;这道题OJ上有一道基本一样的题，题号是[OJ1069](http://acm.zzuli.edu.cn/problem.php?id=1069)，有兴趣的可以看看。

{% tabs snj %}

<!-- tab 全天模拟法 -->

&emsp;&emsp;直接循环模拟每一天的情况就行了，但是这种方法有一个缺陷，当输入数据很大时容易`TLE`，不过这道题的数据倒没有那么大，时间也比较宽松。

```c
int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    int result = 0;
    for (int i = n, p = 0; i != 0;) {
        ++result;
        if (++p == k) {
            p = 0;
        } else {
            --i;
        }
    }
    printf("%d", result);
    return 0;
}
```
<!-- endtab -->

<!-- tab 跳跃模拟法 -->

&emsp;&emsp;这个也是通过模拟得出答案，不同的是每次模拟会一次性模拟最大量的数据。相对于全天模拟会有一定的性能提升。

&emsp;&emsp;老早写的代码了，当时我还在用`Java`刷OJ，大家自己体会代码的含义吧{% inlineimage https://image.kmar.top/icon/bili/zan.png %}，递归版本可能更好懂一点。

```c
int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    int result = n;
    int j, m;
    do {
        j = n / k;
        m = n % k;
        result += j;
        n = j + m;
    } while (n >= k);
    printf("%d", result);
    return 0;
}
```

<!-- endtab -->

<!-- tab 跳跃模拟法-递归版本 -->

```c
int simulate(int n, int k) {
    int j = n / k;
    int m = n % k;
    if (j + m < k) return j;
    return j + simulate(j + m, k);
}

int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    printf("%d", n + simulate(n, k));
    return 0;
}
```

<!-- endtab -->

{% endtabs %}

## 分数统计

&emsp;&emsp;老师想统计学生考试排名，假定一共有`n`名学生，学号为1至`n`。现按学号递增顺序给定每个学生的分数，请编写程序，帮助老师计算：对于每个学生，他的成绩比多少人高。假定考试满分为1000分，成绩均为整数。

### 题解

&emsp;&emsp;这道题思想其实不复杂，但是很多人可能会遇到时间超限的问题，所以我们需要用某种方法节省时间。

&emsp;&emsp;这里我们使用一个数组`amount`存储每个分数的人数，用`score`存储每个同学的成绩。然后使用`sum`存储低于某个分数的人数，比如`sum[i]`就是比`i`分低的人数<sub>（这个sum其实就是前缀和的思想）</sub>。

```c
int main() {
    int amount[1001] = {0};
    int score[100000];
    int n;
    scanf("%d", &n);
    for (int i = 0; i != n; ++i) {
        scanf("%d", &score[i]);
        ++amount[score[i]];
    }
    int sum[1001] = {0};
    for (int i = 1; i != 1001; ++i) {
        sum[i] = sum[i - 1] + amount[i - 1];
    }
    for (int i = 0; i != n; ++i) {
        printf("%d ", sum[score[i]]);
    }
    return 0;
}
```

## 加密数

&emsp;&emsp;有一个32位的int型的整数是一个加密数，它实际表示为另一个数，即将该数从高位至低位的每8位作为一个数（无符号）进行求和后的数。

&emsp;&emsp;&emsp;如：65920，其在计算机内的二进制数表示为：

{% p center, <code>00000000 00000001 00000001 10000000</code> %}

&emsp;&emsp;&emsp;则该加密数表示为：

{% p center, <code>0 + 1 + 1 + 128 = 130</code> %}

&emsp;&emsp;现有一组这样的数，将其解密后输出。

### 题解

&emsp;&emsp;这道题需要用到位运算，主要是移位和与运算，不了解的可以先看看[《二进制运算从入门到入坟》](/posts/2e876344/)。

![部分运算过程图解](https://image.kmar.top/posts/pta21qmjbgxletj-0.jpg)

&emsp;&emsp;图中只写出了`a`和`b`的运算，剩余的就交给同学们自己想象了{% inlineimage https://image.kmar.top/icon/bili/doge.png %}

```c
int main() {
    int input;
    bool start = false;
    while (~scanf("%d", &input)) {
        if (start) printf("\n");
        else start = true;
        int d = (input >> 24) & 0xff;
        int c = (input >> 16) & 0xff;
        int b = (input >> 8) & 0xff;
        int a = input & 0xff;
        printf("%d", a + b + c + d);
    }
    return 0;
}
```

## 数字反转

&emsp;&emsp;输入一个非 0 十进制整数(不允许前导0的存在，即不允许类似 0123 这样的输入)，将其反转输出。

### 题解

&emsp;&emsp;很简单的题，注意处理负号和前导0即可。

{% tabs szfz %}

<!-- tab C语言 -->
```c
int main() {
    char str[50];
    gets(str);
    int end, len = strlen(str);
    if (str[0] == '-') {
        end = 0;
        put('-');
    } else end = -1;
    bool start = false;
    for (int i = len - 1; i != end; --i) {
        if (start) {
            put(str[i]);
        } else if (str[i] != '0') {
            start = true;
            put(str[i]);
        }
    }
    return 0;
}
```
<!-- endtab -->

<!-- tab C++ -->
```c++
int main() {
    string str;
    cin >> str;
    int end;
    if (str[0] == '-') {
        end = 0;
        cout << '-';
    } else end = -1;
    bool start = false;
    for (int i = str.length() - 1; i != end; --i) {
        if (start) {
            cout << str[i];
        } else if (str[i] != '0') {
            start = true;
            cout << str[i];
        }
    }
    return 0;
}
```
<!-- endtab -->

{% endtabs %}

## 全能球员

&emsp;&emsp;已知有`n`名球类运动员，其中：

&emsp;&emsp;`a`人会篮球，`b`人会排球，`c`人会足球；

&emsp;&emsp;`p`人会篮球和排球，`q`人会篮球和足球，`r`人会排球和足球。

&emsp;&emsp;请问：三种球都会的人数`x`是多少？

### 题解

![关系图](https://image.kmar.top/posts/pta21qmjbgxletj-1.png)

&emsp;&emsp;由上图可以很清楚的观察几个数据之间的关系，注意：**p、q、r这三个数据都包含中央的k区间**。

&emsp;&emsp;由此我们可以很轻松的列出方程：

{% p center, <code>(a - p - q + k) + (b - p - r + k) + (c - q - r + k) + (p + q + r - 2k) = n</code> %}

&emsp;&emsp;其中，`(a - p - q + k)`是在计算`a`区间中不与其它区间重叠的部分，最后一个`(p + q + r - 2k)`是计算中央重叠的部分。最终这四个值加起来等于总面积。

&emsp;&emsp;化简之后易得：

{% p center, <code>k = n - a - b - c + p + q + r</code> %}

```c
int main() {
    int n, a, b, c, p, q, r;
    scanf("%d %d %d %d %d %d %d", &n, &a, &b, &c, &p, &q, &r);
    printf("%d", n - a - b - c + p + q + r);
    return 0;
}
```

## 机器人过桥

&emsp;&emsp;已知机器人每一步能前进`x`米，而桥长`a`米，机器人要走`n`步才能走过这座桥。请编写程序，输入`x`和`a`，计算并输出`n`。

### 题解

&emsp;&emsp;很简单得计算题，因为是浮点运算，所以使用`<`来进行等零判断。

```c
int main() {
    double x, a;
    scanf("%lf%lf", &x, &a);
    double result = a / x;
    int temp = (int) result;
    if (fabs(result - temp) < 1e-5) printf("%d", temp);
    else printf("%d", temp + 1);
    return 0;
}
```

## 区间

&emsp;&emsp;有一个长为`n`的序列，一个区间的权值定义为这个区间内不同数字的个数，请在这个序列中找出两段不相交的区间使它们的权值的和最大。

### 题解

&emsp;&emsp;这道题我们先来解析一下题意，这道题没有让我们找最小的区间，所以我们没有必要严格的控制两个区间的边界，只需要让两个区间没有交集就可以了。很容易可以想到，我们从数组中画一条线，线两边就是两个区间，即两个区间的边界一个在最左侧，一个在最右侧，然后中间又一个值来划分两个区间。

&emsp;&emsp;再来思考一下思路，有这么几个问题：

1. 怎么确定区间的分界在哪？
2. 怎么确定某个区间的权值是多少？

#### 确定分界

&emsp;&emsp;确定分界线并没有什么简洁的方法，把分界线从最左端遍历到最右端，取最优解即可。

#### 权值计算

&emsp;&emsp;首先，我们要清楚权值是什么。权值是这个区间内数字的种量。很明显，我们需要想办法统计一个区间内的数量，但是不要忘记一个点，我们确定分界线的时候是遍历了一遍的，所以如果每次都统计一次的话非常容易TLE，所以我们必须用一个一劳永逸的方法求出权值。

&emsp;&emsp;因为我们的区间必然是从边界开始的，不难想到使用前缀和（或后缀和）的方法进行求解。（什么是前缀和可以见：[前缀和](https://blog.csdn.net/fgy_u/article/details/109349710)，后缀和就是把前缀和反过来。）

##### 查重

&emsp;&emsp;新的问题又来了，计算权值时我们如何判断一个数是否与前面的数重复？如果使用一个新的数组存储出现过的数，每次查重时就与该数组内的元素进行比较，这样子雀食很容易进行判断。但是如果数据量很大，没查重一个数就要遍历一遍数组，全部数据跑下来就要遍历`n`便，况且我们还需要求后缀和，这么写很容易TLE。

&emsp;&emsp;所以我们必须使用一个巧妙的办法避免遍历来进行查重，观察输入数据的范围，发现其并不是特别大，那么我们能不能使用数组的下标来表示指定的数，然后用数组的值表明是否出现过呢？答案显然是可以的。

&emsp;&emsp;经过以上的讨论，我们便可以很轻松的写出如下代码：

```c
int num[1000000];
int sumBefore[1000000];
int sumAfter[1000000];
int record[100000];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i != n; ++i) {
        scanf("%d", &num[i]);
        if (i == 0) {
            sumBefore[0] = 1;
            record[num[i]] = 1;
        } else if (record[num[i]] == 0) {
            sumBefore[i] = sumBefore[i - 1] + 1;
            record[num[i]] = 1;
        } else sumBefore[i] = sumBefore[i - 1];
    }
    sumAfter[n - 1] = 1;
    memset(record, 0, sizeof(record));
    record[num[n - 1]] = 1;
    for (int i = n - 2; i != -1; --i) {
        if (record[num[i]] == 0) {
            sumAfter[i] = sumAfter[i + 1] + 1;
            record[num[i]] = 1;
        } else {
            sumAfter[i] = sumAfter[i + 1];
        }
    }
    int max = 0;
    for (int i = 1; i != n; ++i) {
        int temp = sumBefore[i - 1] + sumAfter[i];
        if (temp > max) max = temp;
    }
    printf("%d", max);
    return 0;
}
```

&emsp;&emsp;这个代码中间有一些小优化，比如将求前缀和的过程和输入数据的过程写到一个循环里，这样可以减少一次遍历；使用`memset`初始化数组又可以减少一次遍历。

## 空心等腰三角形*

&emsp;&emsp;请编写程序，输出空心等腰三角形。

### 题解

```c
int main() {
    int n;
    scanf("%d", &n);
    int s = 1;
    for (int line = 1; line != n; ++line) {
        int space = n - line;
        for (int i = 0; i != space; ++i) printf(" ");
        printf("*");
        if (line != 1) {
            for (int i = 0; i != s; ++i) printf(" ");
            printf("*");
            s += 2;
        }
        printf("\n");
    }
    for (int i = (n == 1 ? s - 1 : -2); i != s; ++i) printf("*");
    return 0;
}
```

## 数组元素的目标和

&emsp;&emsp;知识点：双指针

&emsp;&emsp;给定两个升序排序的有序数组`A`和`B`，以及一个目标值`x`。

&emsp;&emsp;数组下标从 0 开始。

&emsp;&emsp;请你求出满足`A[i]+B[j]=x`的数对`(i,j)`。

&emsp;&emsp;数组长度不超过10<sup>5</sup>。 同一数组内元素各不相同。 1 ≤ 数组元素 ≤ 10<sup>9</sup>

### 题解

&emsp;&emsp;首先分析题目，有几个非常重要的信息：

1. 数组`A`和`B`都是有序的，并且按升序排列
2. 数组下标从零开始
3. 数组元素的值小于10<sup>9</sup>，这说明两个数相加的和一定在`int`的范围之内

&emsp;&emsp;读完题，相信很多人都能把代码写出来，但是其中又有很多人会T掉。那么我们如何处理呢？这时候第一条信息的作用就凸显出来了，数组是有序的，那么我们查找数字的时候就可以使用二分法进行查找。

```c
//二分查找
//参数：
//  num[] - 源数组
//  length - 数组的大小
//  key - 要查找的值
//返回值：
//  如果找到指定的数，那么返回其在数组中的下标
//  如果数组中不包含指定的数，那么返回-(插入点 + 1)
//插入点：
//  数组中第一个大于key的元素的下标
int binarySearch(int num[], int length, int key) {
    int low = 0;
    int high = length - 1;
    while (low <= high) {
        int mid = (low + high) >> 1;
        int cmp = num[mid] - key;
        if (cmp < 0)
            low = mid + 1;
        else if (cmp > 0)
            high = mid - 1;
        else
            return mid; // key found
    }
    return -(low + 1);  // key not found.
}

int main() {
    int n, m, x, temp;
    scanf("%d %d %d", &n, &m, &x);
    int A[n];
    for (int i = 0; i != n; ++i) scanf("%d", &A[i]);
    for (int i = 0; i != m; ++i) {
        scanf("%d", &temp);
        int key = x - temp;
        int index = binarySearch(A, n, key);
        if (index >= 0) {
            printf("%d %d", index, i);
            break;
        }
    }
    return 0;
}
```

{% folding 出处 %}

&emsp;&emsp;以上代码中的`binarySearch`是我从`JDK1.8 Arrays#binarySearch0(Object[],int,int,Object)`方法中修改而来。

&emsp;&emsp;官方文档：

```
/**
 * Searches a range of
 * the specified array for the specified object using the binary
 * search algorithm.
 * The range must be sorted into ascending order
 * according to the
 * {@linkplain Comparable natural ordering}
 * of its elements (as by the
 * {@link #sort(Object[], int, int)} method) prior to making this
 * call.  If it is not sorted, the results are undefined.
 * (If the range contains elements that are not mutually comparable (for
 * example, strings and integers), it <i>cannot</i> be sorted according
 * to the natural ordering of its elements, hence results are undefined.)
 * If the range contains multiple
 * elements equal to the specified object, there is no guarantee which
 * one will be found.
 *
 * @param a the array to be searched
 * @param fromIndex the index of the first element (inclusive) to be
 *          searched
 * @param toIndex the index of the last element (exclusive) to be searched
 * @param key the value to be searched for
 * @return index of the search key, if it is contained in the array
 *         within the specified range;
 *         otherwise, <tt>(-(<i>insertion point</i>) - 1)</tt>.  The
 *         <i>insertion point</i> is defined as the point at which the
 *         key would be inserted into the array: the index of the first
 *         element in the range greater than the key,
 *         or <tt>toIndex</tt> if all
 *         elements in the range are less than the specified key.  Note
 *         that this guarantees that the return value will be &gt;= 0 if
 *         and only if the key is found.
 * @throws ClassCastException if the search key is not comparable to the
 *         elements of the array within the specified range.
 * @throws IllegalArgumentException
 *         if {@code fromIndex > toIndex}
 * @throws ArrayIndexOutOfBoundsException
 *         if {@code fromIndex < 0 or toIndex > a.length}
 * @since 1.6
 */
```

{% endfolding %}

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}