---
title: 破解Kotlin——属性重写
top_img: false
cover: 'https://image.kmar.top/bg/b18.jpg!/fw/550'
categories:
  - Kotlin
tags:
  - 日志
  - 面向对象
description: 众所周知，JVM中是没有属性重写这一个功能的，那么KT是如何在JVM中实现属性重载的呢？
abbrlink: e9cc8407
date: 2022-05-18 11:47:52
---

## getter和setter

&emsp;&emsp;在介绍底层原理之前，我们要先了解`getter`和`setter`，这两者其实是一种类型的东西，为了行文方便，下文只说明`getter`。所谓的`getter`，其实就是对外界隐藏属性本身，然后通过一个名为`get***`的函数让外界对属性进行访问（修改），对于布尔类型，其`getter`一般采用`is***`的命名规则，`setter`和普通类型一样使用`get***`。

&emsp;&emsp;在Java中书写的`getter`长这样：

```java
public class Simple {
    
    private int tmp = 0;
    
    //getter
    public int getTmp() {
        return tmp;
    }
    
    //setter
    public void setTmp(int tmp) {
        this.tmp = tmp;
    }
    
}
```

&emsp;&emsp;那么对于KT，其`getter`是什么样子的呢？非常简单：

```kotlin
class Simple {
    
    var tmp: Int = 0
    
}
```

&emsp;&emsp;为了照顾对于KT不熟悉的同学，我们再简单说明一下。KT中会自动为`var`属性编写`getter`和`setter`，为`val`属性编写`getter`。如果我们将上面的代码反编译为Java就能发现其中的原理：

```java
public final class Simple {
   private int tmp;

   public final int getTmp() {
      return this.tmp;
   }

   public final void setTmp(int var1) {
      this.tmp = var1;
   }
}
```

## 语言层面解析

&emsp;&emsp;接下来，我们先说明KT中属性重写属性的写法：

```kotlin
open class Father {
    
    open val tmp: Int = 0
    
}

class Son : Father() {
    
    override val tmp: Int = 1
    
}

fun main() {
    println(Father().tmp)           //output:   0
    println((Son() as Father).tmp)  //output:   1
}
```

&emsp;&emsp;上面的代码就成功的实现了属性的重写。但是不要忘了，JVM是不支持属性重写的，那么KT是如何实现的呢？

&emsp;&emsp;现在，让我们再写一段代码：

```kotlin
open class Father {
    
    open val simple = "Father".apply { println("父类初始化属性值") }
    
    fun printSimple() = println(simple)
    
}

class Son : Father() {
    
    override val simple = "Son".apply { println("子类初始化属性值") }
    
}

fun main() {
    Son().printSimple()
}
```

&emsp;&emsp;对于这一段代码，应当输出什么呢？小伙伴可以先自行思考一下。

&emsp;&emsp;按照我们的理解，KT实现了属性的重写，那么父类的属性就不应当被初始化，但是实际上，这段代码却会输出：

```
父类初始化属性值
子类初始化属性值
Son
```

&emsp;&emsp;事实证明，即使子类重写了父类的属性，父类中仍然会对其进行初始化，但是无论是子类还是父类访问这个属性时，都会访问到子类中定义的值。

&emsp;&emsp;那么我们如何解决这个问题呢？最简单的办法就是在父类中把属性改为`lazy`，即懒加载。很好理解，我们让父类中的属性在第一次被访问时才进行初始化，但是子类重写了属性后父类中的属性就不会被访问，那么这个属性就永远不会被初始化。（PS：这里说“永远”并不是很严谨，因为还是有办法访问到的，不过就算访问到了，也会进行初始化。）

&emsp;&emsp;于是代码就变成了下面这样：

```kotlin
open class Father {

    open val simple by lazy {
        "Father".apply { println("父类初始化属性值") }
    }
    
    fun printSimple() = println(simple)
    
}

class Son : Father() {
    
    override val simple = "Son".apply { println("子类初始化属性值") }
    
}

fun main() {
    Son().printSimple()
    //output:
    //  子类初始化属性值
    //  Son
}
```

## 底层解析

&emsp;&emsp;上面我们只说了现象以及解决方案，那么造成这种现象的原因是什么呢？

&emsp;&emsp;想必有些读者已经猜出来原因了，KT实现属性重写的方式很简单——重写`getter`和`setter`。没错，KT并没有真的重写属性，而是重写了要重写的属性对应的函数，这样，无论是子类还是父类，都会访问到子类中的值了。

&emsp;&emsp;我们把上文写的代码反编译一下试试：

{% tabs kotlin2java %}

<!-- tab Kotlin -->
```kotlin
open class Father {
    
    open val simple = "Father".apply { println("父类初始化属性值") }
    
    fun printSimple() = println(simple)
    
}

class Son : Father() {
    
    override val simple = "Son".apply { println("子类初始化属性值") }
    
}
```
<!-- endtab -->

<!-- tab 反编译 -->
```java
public class Father {
   @NotNull
   private final String simple;

   @NotNull
   public String getSimple() {
      return this.simple;
   }

   public final void printSimple() {
      String var1 = this.getSimple();
      System.out.println(var1);
   }

   public Father() {
      String var1 = "Father";
      int var3 = false;
      String var4 = "父类初始化属性值";
      System.out.println(var4);
      Unit var6 = Unit.INSTANCE;
      this.simple = var1;
   }
}

// Son.java
public final class Son extends Father {
   @NotNull
   private final String simple;

   @NotNull
   public String getSimple() {
      return this.simple;
   }

   public Son() {
      String var1 = "Son";
      int var3 = false;
      String var4 = "子类初始化属性值";
      System.out.println(var4);
      Unit var6 = Unit.INSTANCE;
      this.simple = var1;
   }
}

```
<!-- endtab -->

{% endtabs %}

&emsp;&emsp;反编译出来的代码印证了我们刚刚的结论，同时也说明了为什么父类仍然会对属性进行初始化，因为其是在父类的构造函数中对属性进行赋值。无论怎么写，子类都无法避免调用父类的构造函数。

---

&emsp;&emsp;看到这里，是不是感觉KT还是有不少“坑”的？实际上，只要是语法糖多的语言，坑一定不会少。因为语法糖向程序员隐藏了代码的底层实现，如果你不了解语法糖背后的原理，那么就很容易掉进这些坑中。

&emsp;&emsp;所以无论是使用什么语言，都不能知其然而不知其所以然。无论是通过阅读还是实践，都要想办法弄明白其中的原理，来防止自己哪一天掉到坑里去。但是也不应该为了避免掉坑就不使用语法糖，语法糖的出现就是为了增加开发效率，减少出错概率的，只要我们清楚其中的原理，就不会出现问题。