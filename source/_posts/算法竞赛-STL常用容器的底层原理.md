---
title: 算法竞赛-STL常用容器的底层原理
top_img: false
cover: 'https://image.kmar.top/bg/b6.jpg!/fw/550'
categories:
  - 通用
tags:
  - STL
  - 数组
  - 指针
description: 竞赛中常用的几个容器的用法、原理以及优劣势分析。
abbrlink: c58be33e
date: 2022-04-03 15:08:04
---
  
## 前言

&emsp;&emsp;最近我发现很多人看似`vector`、`map`和`set`都用的很溜，但是实际上却基本上不了解其底层原理，所以我们这里就讲一下常用的几个容器的原理，我们会将重点放在`vector`和`list`。

{% p blue center, 注意：容器的模板列表里面都有一个<code>_Alloc</code>，这个东西是用来管理内存的，本文我们不讨论这个 %}

## 键值存储

&emsp;&emsp;说到键值存储那肯定就是`map<K, V>`了，所谓键值存储就是通过一个键来获取对应的值，我们通常习惯将“键”称为`key`，将“值”称为`value`。在使用模板时，这两个的命名通常为两者的全拼或者使用两者的首字母。

&emsp;&emsp;常用的`map`有两种，一种是基于红黑树的，一种是基于哈希表的。真实应用中还有很多种`map`，比如基于数组的`ArrayMap`，基于完全平衡二叉树的`AVLMap`等等（这里的`ArrayMap`、`AVLMap`均不是具体类名，而是一个泛指）。

### map

&emsp;&emsp;`map`是基于红黑树实现的，存取的时间复杂度为`O(logN)`，我们先来看看`map`的类声明：

```c++
template <typename _Key, typename _Tp, typename _Compare = std::less<_Key>,
    typename _Alloc = std::allocator<std::pair<const _Key, _Tp> > >
  class map
```

&emsp;&emsp;其中`_key`、`_Tp`分别是`key`和`value`<small>（我也比较好奇`Tp`这个名字是怎么来的）</small>。

&emsp;&emsp;学过红黑树的应该都知道，红黑树中存储时是按照大小排序的，所以很显然我们需要比较两个`key`的大小，而`_Compare`就是负责给红黑树提供比大小的函数的类，可以看到，缺省的`_Compare`为`less<_Tp>`。

&emsp;&emsp;一个`_Compare`类的模板为：

```c++
// 可以声明为结构体也可以声明为类
// 这个结构体（类）必须要有一个无参构造函数
struct cmp {
    // 比较输入的两个参数的大小
    // 如果 a < b 则返回 true，否则返回 false
    // key 是类型名称
    // 根据具体情况可以选择是否使用引用
    bool operator()(const key& a, const key& b) const {
        return //...
    }
}
```

&emsp;&emsp;接着我们看一下标准库中`less<_Tp>`和`greater<_Tp>`的代码：

```c++
template<typename _Tp>
  struct less : public binary_function<_Tp, _Tp, bool> {
        _GLIBCXX14_CONSTEXPR
        bool operator()(const _Tp& __x, const _Tp& __y) const {
            return __x < __y;
        }
  };
  
template<typename _Tp>
  struct greater : public binary_function<_Tp, _Tp, bool>{
    _GLIBCXX14_CONSTEXPR
    bool operator()(const _Tp& __x, const _Tp& __y) const {
        return __x > __y;
    }
  };
```

&emsp;&emsp;可以看到，`less<_Tp>`和`greater<_Tp>`分别调用了`<`和`>`，所以当我们使用`less<_Tp>`时我们应当重载`<`，或者外部提供比较函数，`greater<_Tp>`同理。

### unordered_map

&emsp;&emsp;`unordered_map`是基于哈希表实现的，理想情况下的存取复杂度为`O(1)`，看起来非常的诱人，但是在竞赛中却很少使用，因为能使用哈希表的大多数情况都能直接使用数组取代，并且出题人很喜欢卡哈希表。我们来看看`unordered_map`的声明：

```c++
template<typename _Key, typename _Tp,
	   typename _Hash = hash<_Key>,
	   typename _Pred = equal_to<_Key>,
	   typename _Alloc = allocator<std::pair<const _Key, _Tp>>>
  class unordered_map
```

&emsp;&emsp;`_Key`和`_Tp`的作用与`map`相同，这里不再赘述。

&emsp;&emsp;`_Hash`字如其名，是用来生成哈希数的类（等价于`Java`中的`Object#hashcode()`）。`_Hash`的模板为：

```c++
// 可以声明为结构体也可以声明为类
// 这个结构体（类）必须要有一个无参构造函数
struct hashcode {
    // 为传入的key计算哈系数
    // 该函数要求计算时间应当尽量的缩短
    // 生成的哈系数尽量均匀的分布在整个unsigned int的取值范围之内
    // key 是类型名称
    // 根据具体情况可以选择是否使用引用
    unsigned int operator()(const key& k) const {
        return //...
    }
}
```

&emsp;&emsp;`_Pred`是用来判断两个`key`是否相等，缺省值为：

```c++
template<typename _Tp>
  struct equal_to : public binary_function<_Tp, _Tp, bool> {
    _GLIBCXX14_CONSTEXPR
    bool operator()(const _Tp& __x, const _Tp& __y) const {
        return __x == __y;
    }
  };
```

&emsp;&emsp;可见，当我们使用缺省的`_Pred`时，我们的`key`应当重载`==`。`_Pred`的模板如下：

```c++
struct equals {
    bool operator()(const key& a, const key& b) const {
        return //...
    }
}
```

### 优劣对比

#### 红黑树

1. 查询时间复杂度较为稳定
2. 内部元素有序
3. 查找的平均时间复杂度比哈希表要大

#### 哈希表

1. 查找的平均时间复杂度为`O(1)`
2. 查找时间复杂度不稳定，最差的时候会退化为`O(n)`
3. 内部元素无序
4. 空间利用率低
5. 非常容易被出题人卡数据

&emsp;&emsp;综上所述，写竞赛题的时候还是老老实实用`map`吧，免的节外生枝。

### 题外话

&emsp;&emsp;在`JDK`中，`HashMap<K, V>`的实现是“哈希表 + 链表 + 红黑树”，当多个`key`的`hashcode`冲突时会把内部的链表替换成红黑树，所以最差的时间复杂度为`O(logN)`。

&emsp;&emsp;也正是因为这个原因，实际应用中，我是非常少用红黑树的，大多数情况都会选择哈希表。

## set

&emsp;&emsp;我们就不再单独说明`set`了，将`set<K>`看作`map<K, void>`，`unordered_set<K>`看作`unordered_map<K, void>`即可。

### 元素标记

&emsp;&emsp;如果我们需要标记某个元素是否被使用过，可能会使用这样的代码：

```c++
//map<int, bool> record;
if (record[key]) {
    //出现过
} else {
    //没出现过
    record[key] = true;
}
```

&emsp;&emsp;这个功能我们也可以使用`set`进行编写：

```c++
//set<int> record;
if (record.find(key) == record.end()) {
    //没出现过
    record.insert(key);
} else {
    //出现过
}
```

&emsp;&emsp;这两段代码的功能是一样的，但是后者的效率高于前者，因为前者需要进行两次查询，改为下面的代码就能做到同样的效率：

```c++
//map<int, bool> record;
bool& value = record[key]
if (value) {
    //出现过
} else {
    //没出现过
    value = true;
}
```

## 线性表

### vector

&emsp;&emsp;`vector<V>`就是一个支持动态拓展的数组（不要把`Java`的`Vector`和`C++`的看成一个东西，`Java`中的`ArrayList`与`C++`的`vector`功能近似），我们来看一下这个类的声明：

```c++
template<typename _Tp, typename _Alloc = std::allocator<_Tp> >
  class vector : protected _Vector_base<_Tp, _Alloc>
```

&emsp;&emsp;相较于前面的声明，`vector`的声明就简单许多了<small>（多了一个类继承，这里我们不管它）</small>，`_Tp`就是要存储的类型。

#### 尾插

&emsp;&emsp;我们使用这张图来表示`vector`内部的存储，其中有数字标号的代表已经使用的空间，没有数字标号的表示已经分配但并未使用的空间：

![vector初始](https://image.kmar.top/posts/stlcyrqddcyl-0.jpg)

&emsp;&emsp;对于尾插，就是简简单单的把元素插入到数组的最后面，然后将大小加一：

![vector尾插](https://image.kmar.top/posts/stlcyrqddcyl-1.jpg)

&emsp;&emsp;但是如果数组已经没有多余的空间该怎么办呢？我们用一张图来表示：

![vector拓展](https://image.kmar.top/posts/stlcyrqddcyl-2.jpg)

&emsp;&emsp;可以看到，当进行空间拓展时，`vector`会多申请一部分空间，这是为了以后再次插入新的数据时可以直接插入而不用再拓展空间。同时，每次拓展都需要创建一个新的数组，并且需要复制并销毁旧数组的数据，这是一个相当耗时的操作，所以我们使用时尽量提前猜测一下数组的长度以进行预分配。

#### 随机插入

&emsp;&emsp;我们直接使用一个图来表示随机插入的操作：

![vector随机插入](https://image.kmar.top/posts/stlcyrqddcyl-3.jpg)

&emsp;&emsp;可以看到，每次随机插入都需要将尾部元素全部向后移动，这个也是比较耗时的，尤其是数组较大的时候。所以使用过程中如果数据需要频繁的进行随机写入，我们应当尽量不使用`vector`。

#### 随机删除

&emsp;&emsp;随机删除与随机插入正好相反，每次删除的时候都需要把尾部元素向前移动。

### list

&emsp;&emsp;`list<K>`内部是一个链表，我们看一下`list`的声明：

```c++
template<typename _Tp, typename _Alloc = std::allocator<_Tp> >
  class list : protected _List_base<_Tp, _Alloc>
```

&emsp;&emsp;同样很简单，`_Tp`就是要存储的呃元素的类型。但是其内部存储原理却和`vector`完全不同，我们抛开`STL`的实现，来尝试自己实现一个简易的`list`。

&emsp;&emsp;链表中的元素是存储在一个个节点里面的：

```c++
template<class V>
struct node {
    //存储在节点中的数据
    V value;
    // 指向上一个节点，没有则为 nullptr
    node<V>* pre;
    // 指向下一个节点，没有则为 nullptr
    node<V>* next;
};
```

&emsp;&emsp;然后我们在类中存储链表的头部和尾部对象就可以了。这样子的写法写出来的就是“双向链表”，如果去其中一个指针，那么就是“单向链表”。

&emsp;&emsp;如果我们要在头尾插入数据，那么操作起来就非常的简单，直接把表头（尾）修改为要插入的元素，并且让这个节点指向旧的表头（尾）即可。而如果要进行随机插入，则只需要先找到要操作的位点，然后修改相邻的两个节点的数据。

&emsp;&emsp;数据的删除与插入正好相反，这里不再赘述。

&emsp;&emsp;不难发现，链表在进行随机写入（删除）时不需要移动数据，只需要修改相邻的节点，所以链表的随机写入（删除）性能比`vector`好得多。但是链表无法快速的进行随机访问，因为想要访问第`N`个节点就需要从表头（尾）数到第`N`个。

### deque

&emsp;&emsp;`deque<V>`可以看作是`vecotr`和`list`的结合体，由链表和数组共同组成，具体原理我们这里不再描述。

&emsp;&emsp;其随机读写能力处在`vector`和`list`之间，但是因为原理，其空间利用率比两者都低。

### 优劣对比

#### vector

1. 随机访问性能高
2. 尾插性能高
3. 随机写入性能较差
4. 拓展性能较差

#### list

1. 随机访问性能较差
2. 随机写入性能高
3. 拓展性能高

### 链式前向星

&emsp;&emsp;综上所述，大家应该不难发现`list`与存图时使用的“链式前向星”有异曲同工之妙，实际上，链式前向星就是手写了一个链表。其实，大多数情况下我们都可以直接使用`list`取代链式前向星。

&emsp;&emsp;但是如果我们需要较为频繁的清图（删除图）的话就不能使用`list`了。因为使用链式前向星时我们可以直接使用`memset`进行操作，但是`list`则不能，必须对每一个`list`调用`clear()`函数，调用`clear()`的时候需要清理原有数据，一次清图可能还不显眼，多次清图时这就成了一个很大的负担。

&emsp;&emsp;所以，如果我们不需要清图的话，直接使用`list`可以显著地降低代码复杂度，提高可读性，同时性能也不会有很大的区别。如果需要清图就只能使用链式前向星了。

---

{% p center, 光看不练是很难学好的，有能力的小伙伴可以尝试手写一个list和vector出来进行练习 %}

---

{% tip success %}<div class="text" style=" text-align:center;">创作不易，扫描下方打赏二维码支持一下吧ヾ(≧▽≦*)o</div>{% endtip %}