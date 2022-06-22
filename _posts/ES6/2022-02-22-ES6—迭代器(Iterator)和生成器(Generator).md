---
layout: post
title: ES6-迭代器(Iterator)和生成器(Generator)
categories: [ES6]
description: ES6-迭代器(Iterator)和生成器(Generator)
keywords: ES6, javascript, Iterator, Generator
---


## 引入

首先看一个标准的for循环代码，通过变量 i 来跟踪数组的索引，循环每次执行时，如果 i 小于数组长度则加 1，并执行下一次循环

```js
const list = ['a', 'b', 'c']
for(let i = 0; i < list.length; i++) {
  console.log(list[i])
}
```

虽然循环语句语法简单，但如果将多次循环嵌套则需要追踪多个变量，代码复杂度会大大增加。迭代器的出现旨在消除这种复杂性并减少循环中的错误

## 迭代器

迭代器是一种特殊对象，它具有一些专门为迭代过程设计的专有接口，所有的迭代器对象都有一个 next() 方法，每次调用都返回一个结果对象，结果对象有两个属性：value（表示下一个将要返回额值）、done（一个布尔值，当没有更多可返回数据时返回 true）。

下面用ES5语法创建一个迭代器

```js
function testIterator(items) {
  var i = 0
  return {
    next: function() {
      var done = i >= items.length
      var value = !done ? items[i++] : undefined
      return {
        done: done,
        value: value
      }
    }
  }
}
var iterator = testIterator([1, 2, 3])
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

上面这段代码中，testIterator() 方法返回的对象有一个 next() 方法，每次调用都会将 items 数组的下一个值作为 value 返回。在 ES6 中引入了一个生成器对象，它可以让创建迭代器对象的过程变得更简单。

## 生成器

生成器是一种返回迭代器的函数，通过 function 关键字后的 * 来表示，函数中会用到新的关键字 yield。

```js
function *testIterator() {
  yield 1;
  yield 2;
  yield 3;
}
// 生成器能像普通函数那样被调用，但会返回一个迭代器
var iterator = testIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

yield 关键字是 ES6 的新特性，可以通过它来指定调用迭代器的 next() 方法时的返回值及返回顺序。

生成器最有趣的部分时，每当执行完一条 yield 语句后函数就会自动停止执行。比如在上面的代码中，执行完语句 `yield 1` 之后，函数便不再执行其他任何语句，直到再次调用迭代器的 next() 方法才会继续执行 `yield 2` 语句。

> yield 关键字只可再生成器内部使用，在其他地方使用会导致程序抛出错误

```js
function *testIterator(items) {
  items.forEach(function(item) {
    // 语法错误
    yield item
  })
}
```

从字面上看，yield 关键字确实在 testIterator() 函数内部，但是它与 return 关键字一样，都不能穿透函数边界。嵌套函数中的 return 语句不能用作外部函数的返回语句，而此处嵌套函数中的 yield 语句会导致程序抛出语法错误。

> 生成器函数表达式

只需要在 function 关键字和小括号中间添加 * 即可。（注意：不能使用箭头函数来创建生成器）

```js
let testIterator = function *(items) {
  for (let i = 0; i < items.length; i++) {
    yield items[i]
  }
}
let itreator = testIterator([1, 2, 3])
```

> 生成器对象的方法

由于生成器本身就是函数，因此可以将它们添加到对象中。

```js
// ES5
var obj = {
  testIterator: function *(items) {
    for(let i = 0; i < items.length; i++) {
      yield items[i]
    }
  }
}

// ES6
var obj = {
  *testIterator(items) {
   ...
  }
}

let itreator = testIterator([1, 2, 3])
```

> 状态机

生成器的一个常用功能是生成状态机

```js
let state = function *() {
  while(1) {
    yield 'A';
    yield 'B';
    yield 'C';
  }
}
let status = state()
console.log(status.next().value) // A
console.log(status.next().value) // B
console.log(status.next().value) // C
console.log(status.next().value) // A
console.log(status.next().value) // B
console.log(status.next().value) // C
```

## 可迭代对象

ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性，或者说，一个数据结构只要具有 Symbol.iterator 属性，就可以认为是"可遍历的"（iterable）。 Symbol.iterator 通过指定的函数可以返回一个作用于附属对象的迭代器。

在 ES6 中，所有的集合对象（数组、set集合、Map集合）和字符串都是可迭代对象，这些对象中都有默认的迭代器。（由于生成器默认会为 Symbol.iterator 属性赋值，因此所有通过生成器创建的迭代器都是可迭代对象）

> **for-of 循环（面试题 for of 原理）**

for-of 循环每次执行都会调用可迭代对象的 next() 方法，并将迭代器返回的结果对象的value属性存储在一个变量中，循环将持续执行这一过程，直到返回对象的 done 属性值为 true。

```js
let values = [1, 2, 3]
for (let num of values) {
  // 1
  // 2
  // 3
  console.log(num)
}
```

这段循环的代码通过调用 Symbol.iterator 方法来获取迭代器，这一过程是在 JS 引擎背后完成的。随后迭代器的 next() 方法被多次调用，从其返回对象的 value 属性读取值并存储在变量 num 中，依次为 1、2、3，当结果对象的 done 属性值为 true 时，循环结束，所以 num 不会被赋值为 undefined。

如果只需迭代数组或集合中的值，用 for-of 代替 for 循环是个不错的选择。相比传统的 for 循环，for-of 循环的控制条件更简单，不需要追踪复杂的条件，更少出错。

主意：如果将 for-of 语句用于 不可迭代对象、null、undefined 将会导致程序抛出错误。例如：

```js
function testIterator(items) {
  var i = 0
  return {
    next: function() {
      var done = i >= items.length
      var value = !done ? items[i++] : undefined
      return {
        done: done,
        value: value
      }
    }
  }
}
var iterator = testIterator([1, 2, 3])

for (let value of iterator) {  // Uncaught TypeError: iterator is not iterable
  console.log(value)
}
```

所以 for-of 循环可使用的范围包括：
1. 数组
2. Set
3. Map
4. 类数组对象（arguments、DOM NodeList）
5. Generator 对象
6. 字符串

> 访问默认迭代器

通过 Symbol.iterator 来访问对象默认的迭代器

```js
let values = [1, 2, 3]
let iterator = values[Symbol.iterator]()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

具有 Symbol.iterator 属性的对象都有默认的迭代器，因此可以用它来检测对象是否为可迭代对象

```js
function isIterator(object) {
  return typeof object[Symbol.iterator] === 'function'
}
console.log(isIterable([1, 2, 3])) // true
console.log(isIterable('Hello')) // true
console.log(isIterable(new Map())) // true
console.log(isIterable(new Set())) // true
console.log(isIterable(new WeakMap())) // false
console.log(isIterable(new WeakSet())) // false
```

> 模拟实现 for of

通过 Symbol.iterator 属性获取迭代器对象，然后 while 遍历一下：

```js
function forOf(obj, cb) {
  let iterable, result
  
  if (typeof obj[Symbol.iterator] !== 'function')  throw new TypeError(result + ' is not iterable')
  if (typeof cb !== 'function') throw new TypeError('cb must be callable')

  iterable = obj[Symbol.iterator]()

  result = iterable.next()
  while(!result.done) {
    cb(result.value)
    result = iterable.next()
  }
}
```

> 创建可迭代对象

默认情况下，开发者定义的对象都不是可迭代对象，如果给 Symbol.iterator 属性添加一个生成器，则可以将其变成可迭代对象

```js
let obj = {
  items: [],
  *[Symbol.iterator]() {
    for(let item of this.items) {
      yield item
    }
  }
}

for(let value of obj) {
  ...
}
```

## 内建迭代器

ES6中的集合对象、数组、Set集合和Map集合，都内建了三种迭代器：
* entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值。
* keys() 返回一个遍历器对象，用来遍历所有的键名。
* values() 返回一个遍历器对象，用来遍历所有的键值。

## 高级迭代器

> 迭代器传参

迭代器可以用 next() 方法返回值，也可以在生成器内部使用 yield 关键字来生成值。如果给迭代器的 next() 方法传递参数，则这个参数的值就会替代生成器内部上一条 yield 语句的返回值。

```js
function *testIterator() {
  let first = yield 1
  let second = yield first + 2
  yield second + 3
}
let iterator = testIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(4)) // { value: 6, done: false } // 4 + 2 = 6
console.log(iterator.next(5)) // { value: 8, done: false } // 5 + 3 = 8
console.log(iterator.next()) // { value: undefined, done: false }
```

> 在迭代器中抛出错误

通过 throw() 方法，当迭代器恢复执行时可令其抛出一个错误。这种主动抛出错误的能力对于异步编程而言至关重要，也能提供模拟结束函数执行的两种方法（返回值或抛出错误），从而增强生成器内部的编程弹性。

```js
function *testIterator() {
  let first = yield 1
  let second = yield first + 2
  yield second + 3
}
let iterator = testIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(4)) // { value: 6, done: false } // 4 + 2 = 6
console.log(iterator.throw(new Error('err'))) // 从生成器中抛出错误
```

在这个示例中，前两个表达式正常求值，而调用 throw() 方法后，在继续执行 let second 求值前，错误就会被抛出并阻止代码继续执行。

可以在生成器内部通过 try-catch 来捕获这些错误

```js
function *testIterator() {
  let first = yield 1
  let second
  try {
    second = yield first + 2
  } catch(e) {
    second = 6
  }
  yield second + 3
}
let iterator = testIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(4)) // { value: 6, done: false } // 4 + 2 = 6
console.log(iterator.throw(new Error('err'))) // { value: 9, done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

> 生成器返回语句

由于生成器也是函数，因此可以通过 return 语句提前退出函数执行，对于最后一次 next() 调用，可以主动为其指定一个返回值。在普通函数中可以通过 return 指定一个返回值，在生成器中，return 表示所有操作已经完成，属性 done 会被设置为 true

```js
function *testIterator() {
  yield 1
  return 
  yield 2
  yield 3
}
let iterator = testIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: undefined, done: false }
```

return 语句也可以返回一个指定的值，该值将被赋值给返回对象的 value 属性

```js
function *testIterator() {
  yield 1
  return 10
  yield 2
  yield 3
}
let iterator = testIterator()
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 10, done: false }
console.log(iterator.next()) // { value: undefined, done: false }
```

注意：展开运算符与 for-of 循环语句会直接忽略通过 return 语句指定的任何返回值，只要 done 变成 true 就立即停止读取其他的值。

> 委托生成器

在某些情况下，我们需要将两个迭代器合二为一，这时可以创建一个生成器，再给 yield 语句添加 * ，就可以将生成数据的过程委托给其他生成器。

```js
function *createNumberIterator() {
    yield 1;
    yield 2;
    return 3;
}

function *createRepeatingIterator(count) {
    for(let i=0; i<count; i++) {
        yield "repeat";
    }
}

function *createCombinedIterator() {
    let result = yield *createNumberIterator();
    yield *createRepeatingIterator(result);
}

var iterator = createCombinedIterator();

console.log(iterator.next());      // "{ value: 1, done: false }"
console.log(iterator.next());      // "{ value: 2, done: false }"
console.log(iterator.next());      // "{ value: "repeat", done: false }"
console.log(iterator.next());      // "{ value: "repeat", done: false }"
console.log(iterator.next());      // "{ value: "repeat", done: false }"
console.log(iterator.next());      // "{ value: undfined, done: true }"
```