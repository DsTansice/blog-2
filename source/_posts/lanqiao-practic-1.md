---
title: 蓝桥寒假训练赛（1）题解
top_img: false
toc_number: false
cover: https://image.emptydreams.xyz/bg/b29.jpg!/fxfn2/550x500
date: 2021-12-29 14:38:48
categories:
  - C/C++
tags:
  - 题解
  - 教程
  - PTA
description: 蓝桥寒假训练赛（1）详细题解。
---

## 注意

&emsp;&emsp;该博客是为了帮助同学学习，并非为了协助同学刷题，请读者保持自觉，**请勿做CV工具人**。另外为了节省篇幅，代码中不再写明`#include`，如果遇到我没有声明的函数，那么就是某一个头文件中的函数，读者搜索“`c` + 函数名字”就能查到相关信息。

##

&emsp;&emsp;本题要求将输入的任意3个整数从小到大输出。

### 题解

{% tabs bjdx %}

<!--tab C语言 -->
```c
int compare(const void* a, const void* b) {
    return (*((int*) a) - *((int*) b));
}

int main() {
    int num[3];
    scanf("%d %d %d", &num[0], &num[1], &num[2]);
    qsort(num, 3, sizeof(int), compare);
    printf("%d->%d->%d", num[0], num[1], num[2]);
    return 0;
}
```
<!-- endtab -->

<!-- tab C++ -->
```c++
int main() {
    int num[3];
    cin >> num[0] >> num[1] >> num[2];
    sort(&num[0], &num[3]);
    cout << num[0] << "->" << num[1] << "->" << num[2];
    return 0;
}
```
<!-- endtab -->

{% endtabs %}

## 计算阶乘和

&emsp;&emsp;对于给定的正整数N，需要你计算 S=1!+2!+3!+...+N!。

### 题解

```c
int main() {
    int n;
    scanf("%d", &n);
    int result = 0;
    int k = 1;
    for (int i = 1; i <= n; ++i) {
        k *= i;
        result += k;
    }
    printf("%d", result);
    return 0;
}
```

## 跟奥巴马一起画方块

&emsp;&emsp;美国总统奥巴马不仅呼吁所有人都学习编程，甚至以身作则编写代码，成为美国历史上首位编写计算机代码的总统。2014年底，为庆祝“计算机科学教育周”正式启动，奥巴马编写了很简单的计算机代码：在屏幕上画一个正方形。现在你也跟他一起画吧！

### 题解

&emsp;&emsp;注意题干要求的“四舍五入”，我们可以通过标准库中的`round`函数完成四舍五入操作。

```c
int main() {
    int width;
    char out;
    scanf("%d %c", &width, &out);
    int height = (int) round(width / 2.0);
    for (int i = 0; i != height; ++i) {
        if (i != 0) printf("\n");
        for (int k = 0; k != width; ++k) {
            printf("%c", out);
        }
    }
    return 0;
}
```

## N个数求和

&emsp;&emsp;本题的要求很简单，就是求`N`个数字的和。麻烦的是，这些数字是以有理数分子/分母的形式给出的，你输出的和也必须是有理数的形式。

### 题解

&emsp;&emsp;这道题是一道分数加减运算的题，思想很简单，通分相加，最终化简即可。如果题目输入范围很大，也可以每加`X`次化简一次。

&emsp;&emsp;至于怎么化简，只需要分子和分母同时处以最大公约数即可。在`C++`的标准库中提供了`std::__gcd`函数（`C++14`又提供了`std::gcd`），而`C`方面则是`GUN`的库中提供了`__gcd`函数，但是标准库中并没有提供，所以需要自行编写。

{% tabs ngsqh %}

<!-- tab C语言 -->
```c
long long gcd(long long a, long long b) {
    return (b > 0) ? gcd(b, a % b) : a;
}

int main() {
    long long den = 1;  //分母
    long long num = 0;  //分子
    long long n, a, b;
    scanf("%lld", &n);
    while (n--) {
        scanf("%lld/%lld", &a, &b);
        a *= den;   den *= b;   num *= b;   num += a;
    }
    if (num == 0) return (printf("0"), 0);
    long long k = gcd(num, den);
    num /= k;   den /= k;
    if (num > den) printf("%lld %lld/%lld", num / den, num % den, den);
    else printf("%lld/%lld", num, den);
    return 0;
}
```
<!-- endtab -->

<!-- tab C++ -->
```c++
int main() {
    long long den = 1;  //分母
    long long num = 0;  //分子
    long long n, a, b;
    cin >> n;
    while (n--) {
        scanf("%lld/%lld", &a, &b);
        a *= den;   den *= b;   num *= b;   num += a;
    }
    if (num == 0) {
        cout << 0;
        return 0;
    }
    long long k = __gcd(num, den);
    num /= k;   den /= k;
    if (num > den) printf("%lld %lld/%lld", num / den, num % den, den);
    else printf("%lld/%lld", num, den);
    return 0;
}
```
<!-- endtab -->

{% endtabs %}

## 查验身份证

&emsp;&emsp;一个合法的身份证号码由17位地区、日期编号和顺序编号加1位校验码组成。校验码的计算规则如下：

&emsp;&emsp;首先对前17位数字加权求和，权重分配为：{7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2}；然后将计算的和对11取模得到值`Z`；最后按照以下关系对应`Z`值与校验码`M`的值：

```
Z：0 1 2 3 4 5 6 7 8 9 10
M：1 0 X 9 8 7 6 5 4 3 2
```

&emsp;&emsp;现在给定一些身份证号码，请你验证校验码的有效性，并输出有问题的号码。

### 题解

&emsp;&emsp;见：[《网安、人工智能21级班级团体训练欢乐赛(二)题解》](https://blog.emptydreams.xyz/pta_happy_2/#查验身份证)。

## 奇偶排序

&emsp;&emsp;给定一个长度为n(0<n≤200)的正整数序列，按照以下要求排序：

1. 奇数排在偶数前面；
2. 奇数与偶数各自从小到大排列；
3.
&emsp;&emsp;请根据以上要求完成排序，输出排序后的整数序列。

### 题解

&emsp;&emsp;思路很简单，奇偶数分别放到两个数组里面，输入完后排序，最后输出就行。

&emsp;&emsp;`compare`函数[上文](#比较大小)已经写过了，这里就不写了。

{% tabs jopx %}

<!-- tab C语言 -->
```c
int main() {
    int oddSize = 0, evenSize = 0;
    int odd[200];
    int even[200];
    int n, temp;
    scanf("%d", &n);
    while (n--) {
        scanf("%d", &temp);
        if (temp & 1) odd[oddSize++] = temp;
        else even[evenSize++] = temp;
    }
    qsort(odd, oddSize, sizeof(int), compare);
    qsort(even, evenSize, sizeof(int), compare);
    for (int i = 0; i != oddSize; ++i) {
        if (i != 0) printf("\n");
        printf("%d", odd[i]);
    }
    if (oddSize != 0) printf("\n");
    for (int i = 0; i != evenSize; ++i) {
        if (i != 0) printf("\n");
        printf("%d", even[i]);
    }
    return 0;
}
```
<!-- endtab -->

<!-- tab C++ -->
```c++
int main() {
    int oddSize = 0, evenSize = 0;
    int odd[200];
    int even[200];
    int n, temp;
    cin >> n;
    while (n--) {
        scanf("%d", &temp);
        if (temp & 1) odd[oddSize++] = temp;
        else even[evenSize++] = temp;
    }
    sort(&odd[0], &odd[oddSize]);
    sort(&even[0], &even[evenSize]);
    for (int i = 0; i != oddSize; ++i) {
        if (i != 0) printf("\n");
        printf("%d", odd[i]);
    }
    if (oddSize != 0) printf("\n");
    for (int i = 0; i != evenSize; ++i) {
        if (i != 0) printf("\n");
        printf("%d", even[i]);
    }
    return 0;
}
```
<!-- endtab -->

{% endtabs %}

## 输出不重复的数组元素

&emsp;&emsp;本题要求编写程序，对顺序读入的`n`个整数，顺次输出所有不重复的整数。

### 题解

{% tabs scbcfdszys %}

<!-- tab C语言 -->
```c
bool contain(int nums[], int length, int value) {
    for (int i = 0; i != length; ++i) {
        if (nums[i] == value) return true;
    }
    return false;
}

int main() {
    int recordSize = 0;
    int record[20];
    int n;
    cin >> n;
    while (n--) {
        scanf("%d", &record[recordSize]);
        if (!contain(record, recordSize, record[recordSize])) ++recordSize;
    }
    for (int i = 0; i != recordSize; ++i) {
        if (i != 0) printf(" ");
        printf("%d", record[i]);
    }
    return 0;
}
```
<!-- endtab -->

<!-- tab C++ -->
```c++
int main() {
    int recordSize = 0;
    int record[20];
    int n;
    cin >> n;
    const auto start = record;
    while (n--) {
        scanf("%d", &record[recordSize]);
        const auto end = &record[recordSize];
        if (find(start, end, *end) == end) ++recordSize;
    }
    for (int i = 0; i != recordSize; ++i) {
        if (i != 0) printf(" ");
        printf("%d", record[i]);
    }
    return 0;
}
```
<!-- endtab -->

{% endtabs %}

## 整数进制转换

&emsp;&emsp;编程序实现如下功能：输入一个十进制正整数和一个表示进制的正整数`n`（`n` < 10），然后将这个十进制整数转换为`n`进制整数，最后输出结果。 提示：可以先将求得的`n`进制整数的每一位数存入一个数组中，然后再按符合要求的顺序输出。

### 题解

```c
void dec2Svn(int n, int k) {
    static int cache[32];
    int i = 0;
    for (int m = n; m != 0; ++i) {
        cache[i] = m % k;
        m /= k;
    }
    --i;
    for (; i != -1; --i) {
        printf("%d", cache[i]);
    }
}

int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    dec2Svn(n, k);
    return 0;
}
```

## 嵌套循环-素数个数

&emsp;&emsp;输入入2个正整数`A`和`B`，然后输出它们之间的素数个数（不包含`A`，`B`）。

### 题解

```c
bool isPrime(int n) {
    if (n == 1) return false;
    else if (n == 2) return true;
    int max = (int) sqrt(n) + 1;
    for (int i = 2; i != max; ++i) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int A, B;
    scanf("%d %d", &A, &B);
    if (A < 0 || B < 0) return 0;
    int result = 0;
    for (int i = A + 1; i != B; ++i) {
        if (isPrime(i)) ++result;
    }
    printf("%d", result);
    return 0;
}
```

## 最长对称子串

&emsp;&emsp;对给定的字符串，本题要求你输出最长对称子串的长度。例如，给定`Is PAT&TAP symmetric?`，最长对称子串为`s PAT&TAP s`，于是你应该输出`11`。

### 题解

&emsp;&emsp;这道题我们需要寻找最长对称子串，我们首先考虑的一个问题是怎么寻找对称子串？对称字符串有一个非常显著的特性——轴对称，我们可以通过这一特性判断一个字符串是否对称。所以我们可以设定一个变量`i`来指示对称字符串的中心，然后向两边延申检查该对称子串的长度有多长。

&emsp;&emsp;需要注意的是，只有一个字符的字符串一定是对称的。对称字符串的长度可能是偶数也可能是奇数。

{% tabs zcdczc %}

<!-- C语言 -->
```c
int max(int a, int b) {
    return a > b ? a : b;
}

//从输入的字符串的指定位置向两边搜索对称子串
//参数：
//  str - 字符串
//  index - 对称位置右侧的坐标
//  stop - 是否终止递归
//注意：
//  调用该函数时必须保证 index > 0
int check(const char str[], int index, bool stop) {
    if (index == 1 && stop) return 1;
    int leftIndex = stop ? index - 2 : index - 1;
    int length = 0;
    int strLength = strlen(str);
    for (;leftIndex != -1 && index != strLength; --leftIndex, ++index) {
        if (str[leftIndex] == str[index]) length += 2;
        else break;
    }
    int result = stop ? (length + 1) : max(length, check(str, index, true));
    return result == 0 ? 1 : result;
}

int main() {
    int maxLength = 1;  //初始化为1是为了处理字符串长度为1的情况
    string str;
    char str[1001];
    gets(str);
    int strLength = strlen(str);
    for (int i = 1; i != strLength; ++i) {
        maxLength = max(maxLength, check(str, i, false));
    }
    printf("%d", maxLength);
    return 0;
}
```
<!-- endtab -->

<!-- C++ -->

&emsp;&emsp;很明显`C++`的代码短一点，所以，各位，努力学`C++`吧{% inlineimage https://image.emptydreams.xyz/icon/bili/xiao.png %}

```c++
//从输入的字符串的指定位置向两边搜索对称子串
//参数：
//  str - 字符串
//  index - 对称位置右侧的坐标
//  stop - 是否终止递归
//注意：
//  调用该函数时必须保证 index > 0
int check(const string& str, int index, bool stop = false) {
    if (index == 1 && stop) return 1;
    int leftIndex = stop ? index - 2 : index - 1;
    int length = 0;
    for (;leftIndex != -1 && index != str.length(); --leftIndex, ++index) {
        if (str[leftIndex] == str[index]) length += 2;
        else break;
    }
    int result = stop ? (length + 1) : max(length, check(str, index, true));
    return result == 0 ? 1 : result;
}

int main() {
    int maxLength = 1;  //初始化为1是为了处理字符串长度为1的情况
    string str;
    getline(cin, str);
    for (int i = 1; i != str.length(); ++i) {
        maxLength = max(maxLength, check(str, i));
    }
    cout << maxLength;
    return 0;
}
```
<!-- endtab -->

{% endtabs %}

## A-B

&emsp;&emsp;本题要求你计算A−B。不过麻烦的是，A和B都是字符串 —— 即从字符串A中把字符串B所包含的字符全删掉，剩下的字符组成的就是字符串A−B。

### 题解

&emsp;&emsp;见：[《PTA人工智能(2)内部训练赛题解》](https://blog.emptydreams.xyz/pta_inner/#字符串A-B)。

## 集合相似度

&emsp;&emsp;给定两个整数集合，它们的相似度定义为：<code>N<sub>c</sub> / N<sub>t</sub> × 100%</code>。其中<code>N<sub>c</sub></code>是两个集合都有的不相等整数的个数，<code>N<sub>t</sub></code>是两个集合一共有的不相等整数的个数。你的任务就是计算任意一对给定集合的相似度。

### 题解

{% tabs jhxsdd, 2 %}

<!-- tab C语言 -->

{% p blue center, 等待探姬姐姐补充ing<br/>
如果一直没有就是探姬姐姐鸽了 %}

<!-- endtab -->

<!-- tab C++ -->

{% p blue center, 按理来说一个`new`对应一个`delete`，我偷懒没有写，大家可不要学哦~ %}

```c++

&emsp;&emsp;题目中的输入范围很大，这限制我们不能使用数组下标表示某个值，所以只能通过遍历的方式查重了。

//不重复的列表
struct noRepeatList {
    int* list;
    //数组大小
    int allSize;
    //已用空间大小
    int realSize = 0;
    //是否已经排序
    bool isSort = false;

    noRepeatList(int size) : allSize(size), list(new int[size]) {}

    //获取已用空间大小
    int size() const {
        return realSize;
    }

    int& operator [](int index) {
        return list[index];
    }

    //将一个值放入列表
    void put(int value) {
        //查重，如果存在则不放入
        if (contain(value)) return;
        list[realSize++] = value;
    }

    //判断列表中是否包含指定元素
    bool contain(int value) const {
        if (isSort) {   //如果已经有序则使用二分法查找
            int left = 0, right = realSize - 1;
            do {
                int mid = (left + right) >> 1;
                if (list[mid] == value) return true;
                else if (list[mid] > value) right = mid - 1;
                else left = mid + 1;
            } while (left <= right);
            return false;
        } else {
            return find(begin(), end(), value) != end();
        }
    }

    void sort() {
        sort(begin(), end());
        isSort = true;
    }

    int* begin() const {
        return list;
    }

    int* end() const {
        return list + realSize;
    }

};

int main() {
    int n, size;
    cin >> n;
    auto inputs = new noRepeatList*[n];
    for (int i = 0; i != n; ++i) {
        scanf("%d", &size);
        inputs[i] = new noRepeatList(size);
        while (size--) {
            int temp;
            scanf("%d", &temp);
            inputs[i]->put(temp);
        }
        inputs[i]->sort();
    }
    scanf("%d", &n);
    int a, b;
    while (n--) {
        scanf("%d %d", &a, &b);
        --a, --b;
        int nc = 0;
        noRepeatList& before = *inputs[a];
        noRepeatList& after = *inputs[b];
        //双指针查找两个列表中重复的元素的个数，减少遍历次数
        //注：该方法的前提是两个列表均有序
        for (int i = 0, j = 0; i != before.size() && j != after.size();) {
            if (before[i] == after[j]) {
                ++nc;
                if (i == before.size() - 1) ++j;
                else ++i;
            } else if (before[i] < after[j]) {
                ++i;
            } else {
                ++j;
            }
        }
        int nt = before.size() + after.size() - nc;
        printf("%.2f%\n", nc * 100.0 / nt);
    }
    return 0;
}
```
<!-- endtab -->

{% endtabs %}

## 家庭房产

&emsp;&emsp;给定每个人的家庭成员和其自己名下的房产，请你统计出每个家庭的人口数、人均房产面积及房产套数。

### 题解

```c++
//存储结果
struct resultInfo {

	//家庭成员中最小的code
	int minCode = 10000;
	//成员数量
	int num = 0;
	//人均房产数量
	double house = 0;
	//人均房产面积
	double area = 0;

	bool operator<(resultInfo& that) const {
		if (fabs(area - that.area) < 1e-6) return minCode < that.minCode;
		return area > that.area;
	}

};

//个人信息
struct individual {

	//编码
	int code = 0;
	//房产数量
	int house = 0;
	//房产面积
	int area = 0;
	//与当前个体有关系的个体列表
	int relation[7]{};
	//列表大小
	int relationAmount = 0;
	//该个体是否为虚拟的个体
	bool vir = false;

	//向该个体的关系列表添加一个人
	void addRelation(int thatCode) {
		if (thatCode != -1) nextRelation() = thatCode;
	}

	//获取关系列表中下一个写入点
	int& nextRelation() {
		return relation[relationAmount++];
	}

	//遍历关系列表
	void forEachRelation(function<void(int&)>&& p) {
		for (int i = 0 ; i != relationAmount ; ++i) {
			p(relation[i]);
		}
	}

};

//家庭列表
struct {

	//根据个体编码获取其家庭编码
	int getHomeCode(int individualCode) const {
		return reverse[individualCode];
	}

	//将指定家庭的成员全部移动到另一个家庭
	//参数：
	//  fromCode - 数据源的家庭编码
	//  toCode - 目的家庭编码
	void move(int fromCode, int toCode) {
		if (fromCode == toCode) return;
		forEach(fromCode, [&](int& indCode) {
			reverse[indCode] = toCode;
		});
		memmove(&data[toCode][getListAmount(toCode) + 1], &data[fromCode][1],
		        sizeof(int) * getListAmount(fromCode));
		data[toCode][0] += getListAmount(fromCode);
		data[fromCode][0] = 0;
	}

	//将指定个体加入到指定家庭中
	//参数：
	//  homeCode - 家庭编码
	//  individualCode - 个体编码
	void putIn(int homeCode, int individualCode) {
		data[homeCode][++data[homeCode][0]] = individualCode;
		reverse[individualCode] = homeCode;
	}

	//获取指定家庭的成员个数
	int getListAmount(int homeCode) const {
		return data[homeCode][0];
	}

	//遍历指定家庭的所有成员
	//注：遍历过程中允许添加新的成员
	void forEach(int homeCode, function<void(int&)>&& p) {
		for (int i = 1 ; i <= getListAmount(homeCode) ; ++i) {
			p(data[homeCode][i]);
		}
	}

private:
	//存储家庭数据，下标表示家庭编码
	//注：家庭编码为0时表示该个体尚未加入家庭
	int data[1001][1001]{};
	//存储指定个体的家庭编码，下标表示个体编码
	int reverse[10000]{};
} homeList;

//存储非虚拟个体
individual allList[1000];
//存储所有个体（包括虚拟个体），下标为个体编码
individual* codeList[10000];

int main() {
	int n, father, mother, temp;
	cin >> n;
	//输入并初步处理数据
	for (int i = 0 ; i != n ; ++i) {
		individual& next = allList[i];
		scanf("%d %d %d %d", &next.code, &father, &mother, &temp);
		next.addRelation(father);
		next.addRelation(mother);
		while (temp--) scanf("%d", &next.nextRelation());
		scanf("%d %d", &next.house, &next.area);
		homeList.putIn(i + 1, next.code);   //为每个个体分配家庭编号
		codeList[next.code] = &next;
	}
	//检查是否有allList中不存在的个体
	//如果有则创建一个虚拟个体并放入codeList中
	for (int i = 0 ; i != n ; ++i) {
		individual& ind = allList[i];
		ind.forEachRelation([&ind](int& code) {
			if (codeList[code] == nullptr) {
				auto virInd = new individual();
				virInd->vir = true;
				codeList[code] = virInd;
			}
			if (codeList[code]->vir)
				codeList[code]->addRelation(ind.code);
		});
	}
	vector<resultInfo> result;
	//合并数据
	for (int homeCode = 1 ; homeCode <= n ; ++homeCode) {
		if (homeList.getListAmount(homeCode) != 0) {
			resultInfo info;
			int house = 0;  //家庭总房产数量
			int area = 0;   //家庭总房产面积
			//遍历成员列表，将所有与成员有关系的人都编入当前家庭中
			homeList.forEach(homeCode, [homeCode, &house, &area, &info](int& code) {
				individual& ind = *codeList[code];
				ind.forEachRelation([homeCode](int& relation) {
					int dist = homeList.getHomeCode(relation);
					if (dist == 0) homeList.putIn(homeCode, relation);
					else homeList.move(dist, homeCode);
				});
				house += ind.house;
				area += ind.area;
				info.minCode = min(info.minCode, code);
			});
			info.num = homeList.getListAmount(homeCode);
			info.house = (double) house / info.num;
			info.area = (double) area / info.num;
			result.push_back(info);
		}
	}
	//按题目要求排序
	sort(result.begin(), result.end());
	//打印数据
	printf("%d", result.size());
	for (const auto& item : result) {
		printf("\n%04d %d %.3f %.3f", item.minCode, item.num, item.house, item.area);
	}
	return 0;
}
```

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，这次的题真的很难Orz，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}
