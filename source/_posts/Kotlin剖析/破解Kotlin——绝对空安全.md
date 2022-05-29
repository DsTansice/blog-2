---
title: 破解Kotlin——绝对空安全
top_img: false
cover: 'https://image.kmar.top/bg/b22.jpg!/fw/700'
abbrlink: 3954bf28
date: 2022-05-29 08:17:00
categories:
  - Kotlin
tags:
  - 日志
  - 多线程
description: Kotlin的?.可以确保绝对的空安全，即使是在多线程环境下也不会出现意外，那么底层是如何实现的呢？
---

## 空安全

&emsp;&emsp;首先我们说明什么是空安全。

&emsp;&emsp;在JVM中，有一个异常名为`NullPointerException`（简称NPE），翻译过来就是空指针异常，这种异常通常出现在我们访问`null`的指针的情况。而空安全就是指不会出现访问空指针的情况，从而避免NPE的出现。

&emsp;&emsp;在Java开发中，NPE的存在可以说是屡见不鲜了，Kotlin通过将可空与不可空分为两种不同的类型而很大程度上讲NPE的出现从运行期转到了编译期，降低了排错难度。

## 用法

&emsp;&emsp;Kotlin中有一个运算符为`?.`，其作用就是访问一个可空类型，如果指针为`null`就返回`null`，否则返回结果。

&emsp;&emsp;比如下面这段代码（注释对应每一个输出的输出内容）：

```kotlin
fun main() {
    val obj1: String = "123A"
    val obj2: String? = "123A"
    val obj3: String? = null
    println(obj1?.lowercase())  //123a
    println(obj2?.lowercase())  //123a
    println(obj3?.lowercase())  //null
}
```

## 多线程环境

&emsp;&emsp;这个运算符即使在多线程环境下仍然能够保证空安全，比如下面这段代码：

```kotlin
var obj: String? = "abc"

fun main() {
    Thread {
        var tmp: String? = null
        while (true) {
            obj = tmp.apply { tmp = obj }
        }
    }.start()
    while (true) {
        println(obj?.uppercase())
    }
}
```

&emsp;&emsp;这段代码无论如何都不会抛出空指针异常。

## 底层解析

&emsp;&emsp;可能很多人看到这里还没感觉什么，但是如果我们把上面的代码改成下面这样子：

```kotlin
var obj: String? = "abc"

fun main() {
    Thread {
        var tmp: String? = null
        while (true) {
            obj = tmp.apply { tmp = obj }
        }
    }.start()
    while (true) {
        if (obj != null) println(obj!!.uppercase())
        else println(null)
    }
}
```

&emsp;&emsp;尝试运行后就会发现，很快程序便抛出了空指针异常。这是为什么呢？

&emsp;&emsp;因为多线程环境中，当计算机执行完`if (obj != null)`后其它线程仍然可以修改`obj`的值。也就是说，在我们执行完判空`if`后，指针的值才变成了`null`。

&emsp;&emsp;那么这种问题Kotlin的`?.`是如何避免的呢？我们看一下`?.`反编译的结果：

```java
public final class TestKt {
    @Nullable
    private static String obj = "abc";
    
    @Nullable
    public static final String getObj() {
        return obj;
    }
    
    public static final void setObj(@Nullable String var0) {
        obj = var0;
    }
    
    public static final void main() {
        (new Thread((Runnable) null.INSTANCE)).start();
        
        while (true) {
            String var10000 = obj;
            String var0;
            if (var10000 != null) {
                var0 = var10000;
                String var1 = var0.toLowerCase(Locale.ROOT);
                Intrinsics.checkNotNullExpressionValue(var1, "this as java.lang.String).toLowerCase(Locale.ROOT)");
                var10000 = var1;
            } else {
                var10000 = null;
            }
            
            var0 = var10000;
            System.out.println(var0);
        }
    }
    
    // $FF: synthetic method
    public static void main(String[] var0) {
        main();
    }
}
```

&emsp;&emsp;可以发现，Kotlin先把外界的值复制到了栈中，然后通过栈中存储的指针进行操作，简化出来的代码就是：

```java
class Test {
    
    private static String obj = "abc";
    
    public static void main(String[] args) {
        // 这里省略把obj赋null的代码
        
        while (true) {
            String tmp = obj;
            String result = tmp == null ? null : tmp.toLowerCase();
            System.out.println(result);
        }
    }

}
```

&emsp;&emsp;是不是非常的简单，把外部的值赋值到栈中再使用，这样子就避开了外部变动对内部的影响，无论外部怎么变动，循环中访问到的一定是同一个对象。

&emsp;&emsp;这在多线程开发中是一个常用的技巧，我个人认为可以归类到“保护性拷贝”之中。