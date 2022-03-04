---
layout: post
title: vue—$nextTick原理
categories: [vue]
description: vue—$nextTick原理
keywords: vue
---


## vue2

### 示例

```vue
...
<button @click="handleChange">click</button>
<div ref="msg">{{ msg }}</div>
<div v-if="msg1">{{ msg1 }}</div>
<div v-if="msg2">{{ msg2 }}</div>
<div v-if="msg3">{{ msg3 }}</div>
...
data() {
  return {
    msg: 'aaa',
    msg1: '',
    msg2: '',
    msg3: ''
  }
},
methods: {
  handleChange() {
    this.msg = 'bbb'
    this.msg1 = this.$refs,msg.innerHTML
    this.$nextTick(() => {
      this.msg2 = this.$refs,msg.innerHTML
    })
    this.msg3 = this.$refs,msg.innerHTML
  }
}
```

![nextTick](https://user-images.githubusercontent.com/51625532/156286813-5b10608f-46cb-47e1-8f7f-49be89b3a8a4.gif)

从图中可以清楚的看到，msg1 和 msg3 显示的内容还是变更前的数据，而 msg2 显示的时变更后的数据。因为 vue 中的 DOM 更新是异步的。

### 源码解析

源码目录 `src/core/util/next-tick.js`，源码版本 `2.6.11`，我们来逐步分析。

```js
/* @flow */
/* globals MutationObserver */

import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

export let isUsingMicroTask = false

const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
let timerFunc

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

首先找到定义 `nextTick` 函数的地方，看看它具体做了什么操作：

```js
const callbacks = []
let pending = false

let timerFunc

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    ...
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

首先定义了三个重要的变量：
* callbacks：用来存储所有需要执行的回调函数
* pending：用来标致是否正在执行回调函数
* timerFunc：用来触发执行回调函数

在 nextTick 的外层定义变量形成一个闭包，我们每次调用 `$nextTick()` 的过程其实就是在向 callbacks 新增回调函数的过程

callbacks 新增回调函数后又执行了 timerFunc 函数，pending 标致表示同一个时间只能执行一次。

```js
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

我们来看一下 timerFunc 的赋值过程（降级处理）：
* 先判断是否支持 promise，如果支持，则利用 promise 来触发执行回调函数
* 如果不支持 promise，判断是否支持 MurationObserver，如果支持，则实例化一个观察者对象，观察文本节点发生变化时触发执行所有回调函数
* 以上两者都不支持，则判断是否支持 setImmediate
* 如果都不支持，则利用 setTimeout 设置延时为 0

有关 setImmediate 和 setTimeout 的区别可以查看 [深入理解js事件循环机制（Node.js）](https://github.com/mf-note/Blog/issues/2)

降级处理的目的都是将 flushCallbacks 放入到微任务或宏任务，等待下一次事件循环来执行。最后看 flushCallbacks 到底做了什么：

```js
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

通过代码可以看出，flushCallbacks 做的事非常简单：将 callbacks 数组复制一份，然后把 callbacks 置为空，最后把复制的数组中的每个函数依次执行一次。


## vue3

### 示例

```vue
<template>
 <div ref="msgRef">{{ msg }}</div>
 <button @click="handleClick">click</button>
</template>
<script setup>
  import { ref, nextTick } from 'vue'
  const msg = ref('aaa')
  const msgRef = ref(null)
  async function handleClick(){
     msg.value = 'bbb'
     console.log(msgRef.value.innerText) // aaa
     await nextTick()
     console.log(msgRef.value.innerText) // bbb
  }
  return { msg, test, handleClick }
</script>
```

### 源码解析

`nextTick()`方法源码目录 `runtime-core/src/scheduler.ts`

```ts
export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```

可以看出，nextTick 接收一个函数作为参数，同时会创建一个微任务

在页面调用 nextTick 的时候，会执行该函数，把参数 `fn` 赋值给 `p.then()`，在队列的任务完成后，fn 就执行了

