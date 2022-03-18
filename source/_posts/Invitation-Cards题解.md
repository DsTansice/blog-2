---
title: Invitation Cards 题解
top_img: false
cover: 'https://image.kmar.top/bg/b5.jpg!/fw/550'
categories:
  - C/C++
tags:
  - 题解
  - 最短路
  - BFS
description: 一道比较特殊的最短路的题，费了些时间。
abbrlink: d1fab83d
date: 2022-03-18 18:55:27
---
  
## 题目地址

1. [洛谷 - 中文 - 貌似不能提交](https://www.luogu.com.cn/problem/UVA721)
2. [POJ - 英文](http://poj.org/problem?id=1511)

## 题目大致含义

&emsp;&emsp;给我们`P`个点，`Q`条单向路径，求从`点1`出发到各点的距离之和与从各点到`点1`的距离之和的和的最小值。

## 解题思路及历程

&emsp;&emsp;这道题一看就是最短路，首选算法自然是`Dijkstra`（不过看网上说`SPFA`也能 A），而且看数据规模也不能使用邻接矩阵存图，那么显而易见就只剩下一种方法了，即“邻接表 + 最短路”。

&emsp;&emsp;最短路我们这里不再多说，我们很轻易的就能写出下面的代码：

```c++
struct node {
    int code, int value;
    node(int code, int value): code(code), value(value) {}
    bool operator<(node that) const {
        return value > that.value;
    }
};

list<node> linkMap[1000001];
int result[1000001];
bool record[1000001];

void dijk() {
    memset(result, 0x7f, sizeof(result));
    memset(record, false, sizeof(record));
    priority_queue<node> queue;
    queue.emplace(1, 0);
    do {
        node it = queue.top();  queue.pop();
        record[it.code] = true;
        for (auto next : linkMap[it.code]) {
            if (record[next.code]) continue;
            int value = it.value + next.value;
            if (value < result[next.code]) {
                result[next.code] = value;
                queue.emplace(next.code, value);
            }
        }
    } while (!queue.empty());
}
```

&emsp;&emsp;这样子就能轻松的跑出最短路了。现在我们再回过头来看题，我们不仅需要求出从起点到其它点的距离之和，还需要求出其它点到起点的距离之和，为了减少代码重复，肯定是需要重复利用写好的最短路的代码的，这样我们不难写出来下面的代码：

```c++
//这里省掉了前面声明过的变量

void dijk(int head, int tail) {
    memset(result, 0x7f, sizeof(result));
    memset(record, false, sizeof(record));
    priority_queue<node> queue;
    queue.emplace(head, 0);
    do {
        node it = queue.top();  queue.pop();
        record[it.code] = true;
        for (auto next : linkMap[it.code]) {
            if (record[next.code]) continue;
            int value = it.value + next.value;
            if (value < result[next.code]) {
                result[next.code] = value;
                if (next.code != tail) queue.emplace(next.code, value);
            }
        }
    } while (!queue.empty());
}

int solve(int p) {
    dijk(1, -1);
    int ans = 0;
    for (int i = 2; i <= p; ++i) ans += result[i];
    for (int i = 2; i <= p; ++i) {
        dijk(i, 1);
        ans += result[1];
    }
    return ans;
}
```

&emsp;&emsp;接下来只需要写出来`main()`然后调用上面的代码就能得到结果了。

&emsp;&emsp;但是当你兴高采烈的把代码交上去时却发现……它T了。是哪里出了问题呢？很显然，是我们调用了太多次的`dijk`，让我们来想办法少调用几次。

&emsp;&emsp;这其实很简单，想一想我们用`dijk`求出来的是什么，是一个点到其它所有点的最短路径，那么我们能否把从其它点回来的计算转换为计算从起点到其它点的最短路呢？答案是可以的。我们只需要存两个图，一个图中路径方向与题目输入方向一致，一个图与题目输入方向相反，这样我们对第一个图求`dijk`求得就是人出发所需的费用，对第二个图求`dijk`就是人回来所需的费用。

&emsp;&emsp;有了这个想法，改代码就很简单了：

```c++
//这里省掉一部分前面已经声明过的变量

list<node> linkMap[1000001];
list<node> reverseMap[1000001];

void dijk(list<node> link[]) {
    memset(result, 0x7f, sizeof(result));
    memset(record, false, sizeof(record));
    priority_queue<node> queue;
    queue.emplace(1, 0);
    do {
        node it = queue.top();  queue.pop();
        record[it.code] = true;
        for (auto next : link[it.code]) {
            node next = *iter;
            if (record[next.code]) continue;
            int value = it.value + next.value;
            if (value < result[next.code]) {
                result[next.code] = value;
                queue.emplace(next.code, value);
            }
        }
    } while (!queue.empty());
}

int solve(int p) {
    int ans = 0;
    dijk(linkMap);
    for (int i = 2; i <= p; ++i) ans += result[i];
    dijk(reverseMap);
    for (int i = 2; i <= p; ++i) ans += result[i];
    return ans;
}
```

&emsp;&emsp;这样，我们是不是就非常完美的把每次求最短路的次数压缩到了两次？ 然而，当你把代码交上去的时候就发现，它又双叒叕TLE了。这次的问题出现在哪里了呢？

&emsp;&emsp;原来是数据结构出了问题，当我们使用`list<node> linkMap[]`这种结构时，每次计算前都需要使用如下代码来清空上一次的图：

```c++
for (int i = 1; i <= p; ++i) {
    linkMap[i].clear();
    reverseMap[i].clear();
}
```

&emsp;&emsp;在测试数量比较少的时候这并不是什么问题，但是当数据数量多起来之后，每次计算前的`clear()`就成了一个负担，因为`clear()`的时候需要清理链表中的内存。

&emsp;&emsp;仔细思考一下，我们清理数据浪费时间得原因是`memset`对于`STL`并不适用，那么我们直接使用数组是不是就可以了呢？

&emsp;&emsp;这么看来，我们就不得不放弃使用`list<node>`来存储了。难道我们要使用邻接矩阵吗？这是必然不可能的，因为使用邻接矩阵必然会出现MLE的情况。所以我们还是要使用邻接表，但是一个点可能有多个边与之对应，所以我们不能采用`node linkMap[]`的形式存储。

&emsp;&emsp;那么我们是否可以把所有边存到一个一位数组里呢（`edge lineMap[]`）？显然这么做也是不可以的，因为在求最短路的时候我们需要快速地求得一个点对应得所有边，这么存储得话就必须遍历整个数组才可以了。

&emsp;&emsp;不过上面这种方式我们也不要全盘否定，它给了我们一个新的思路，我们是否可以用一个数组存储所有得边，然后其它地方通过下标来访问边。

&emsp;&emsp;其实就是我们手写了一个链表出来，结构很简单：

```c++
struct {
    int next;
    int code;
    int value;
} point[2000002];
int pointSize;

int linkMap[1000001];
int reverseMap[1000001];
```

&emsp;&emsp;我们来解释一下这个结构，其中：

1. `linkMap`和`reverseMap`存的都是链表得起始位置
2. `struct::next`存的是下一个节点得位置
3. `struct::code`存的是当前边所对应的终点
4. `struct::value`存的是当前边的长度
5. `pointSize`存的是边的数量

{% p center, 这里有一点要注意，因为我们存了两个图，所以边的数量会是题目输入的两倍，所以数组大小不能只开`1000001`%}

&emsp;&emsp;接下来要考虑的就是如何向图中添加边，这是一个单向链表，为了节省性能，我们选择每次加边时把新的边换成链表中第一个元素，然后让其中的`next`指向旧表头：

```c++
inline void linkPoint(int link[], int head, int tail, int value) {
    int key = pointSize++;
    point[key].next = link[head];
    point[key].code = tail;
    point[key].value = value;
    link[head] = key;
}
```

&emsp;&emsp;那么如何遍历链表呢？仔细观察链表的连接方式，我们会发现，当不存在下一个元素时，`struct::next`的值一定为`0`，所以我们只需要一直遍历到`next`为`0`即可：

```c++
int key = ...   //这里是获取表头
while (key != 0) {
    //do something...
    key = point[key].next;
}
```

&emsp;&emsp;接下来，只需要把`dijk`修改一下，然后把剩余的代码补上就可以了。

&emsp;&emsp;最后最后，你发现它`WA`了，因为虽然每一次求最短路时长度不会超过`1000000000`，但是求两次之和就不一定了，所以我们需要使用`long long`存储结果。

{% p center, 按理说`int`也是能存下`2000000000`的，但是确实换成`long long`才能AC，具体原因有谁清除的话可以 在评论区发一下。 %}

## AC代码

{% p center, POJ上是不支持C++11的，我特意用了C++11的语法噢~ %}

```c++
#include <bits/stdc++.h>

using namespace std;

struct node {
    //当前点的编号
    int code;
    //当前路径长度
    int value;
    node(int code, int value): code(code), value(value) {}
    bool operator<(node that) const {
        return value > that.value;
    }
};

//使用结构体数组来实现链表
//这里不能使用list<T>，重复的clear()会TLE
struct {
    int next;
    int code;
    int value;
} point[2000002];
int pointSize;

//正向图
int linkMap[1000001];
//反向图
int reverseMap[1000001];

inline void linkPoint(int link[], int a, int b, int value) {
    int key = pointSize++;
    point[key].next = link[a];
    point[key].code = b;
    point[key].value = value;
    link[a] = key;
}

long long bfs(const int link[], int p) {
    static bool record[1000001];
    static int result[1000001];
    memset(result, 0x7f, sizeof(result));
    memset(record, false, sizeof(record));
    priority_queue<node> queue;
    queue.emplace(1, 0);
    do {
        node it = queue.top();  queue.pop();
        record[it.code] = true;
        int key = link[it.code];
        while (key != 0) {
            int next = point[key].code;
            if (!record[next]) {
                int value = it.value + point[key].value;
                if (value < result[next]) {
                    result[next] = value;
                    queue.emplace(next, value);
                }
            }
            key = point[key].next;
        }
    } while (!queue.empty());
    int ans = 0;
    for (int i = 2; i <= p; ++i) ans += result[i];
    return ans;
}

int main() {
    int t, p, q;
    cin >> t;
    int head, tail, value;
    while (t--) {
        scanf("%d %d", &p, &q);
        memset(linkMap, 0, sizeof(linkMap));
        memset(reverseMap, 0, sizeof(reverseMap));
        pointSize = 1;
        for (int i = 1; i <= q; ++i) {
            scanf("%d %d %d", &head, &tail, &value);
            linkPoint(linkMap, head, tail, value);
            linkPoint(reverseMap, tail, head, value);
        }
        auto result = bfs(linkMap, p) + bfs(reverseMap, p);
        printf("%lld\n", result);
    }
    return 0;
}
```

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}