---
layout: post
title: Vue—可拖拽排序的虚拟滚动列表
categories: [Vue, JavaScript]
description: Vue—可拖拽排序的虚拟滚动列表
keywords: Vue, JavaScript, drag, drop, sort, draggable, sortable
pinned: true
---

## 背景

在工作中，有时候会遇到单个列表渲染成百上千条数据的情况，并且不能使用分页减少渲染的数据量。这种情况下网站的性能肯定会大打折扣，导致页面频繁出现卡顿。所以我们有必要了解对于一次性插入大量数据，如何提升渲染效率。

### 大数据列表渲染分析

#### 数据渲染的方式

1. 一次性全部渲染
2. 时间分片
3. 虚拟列表

#### 优化思路

1. 将列表数据使用Object.freeze()处理。一般来说列表数据在请求完之后是不会做变动的，这样处理之后vue不会再做getter和setter转换，数据将不再是响应式的，一定程度上减少了性能消耗；
2. 减少计算属性computed和dom的判断处理；
3. 减少dom渲染。

#### 常用的做法

1. 时间分片（它的本质就是将长任务分割为一个个执行时间很短的任务，然后再一个个地执行）
2. 虚拟列表（从源头解决问题，dom太多就减少dom）

### 列表渲染的实现

#### 一次性全部渲染

不做任何操作，直接将列表数据全部渲染，这里模拟的10w条纯文本测试数据，看下layout时间：

![impicture_20211231_144833](https://user-images.githubusercontent.com/51625532/147808190-dd292feb-e128-4e66-87fa-e281b421d6a3.png)

一共用了接近5s的时间，并且页面操作也显得十分卡顿。
在了解Event Loop后会发现：对于大量数据渲染的时候，JS运算并不是性能的瓶颈，性能的瓶颈主要在于渲染阶段

#### 时间分片

依旧以10w条数据渲染效率来进行验证：（为了获得浏览器的渲染时间，根据Event Loop可知，每次 GUI 渲染完都会执行一个宏任务，所以我们可以在后面添加一个定时器（宏任务），渲染完成后执行得到渲染时间，因为 requestAnimationFrame 或定时器是一个宏任务，所以每执行一次 GUI 渲染后就执行一次相关的回调，也就实现了每次添加 50 个 li 节点，从而达到了分片加载的目的，效果如图所示）

```html
<body>
  <ul id="list"></ul>
</body>
<script type="text/javascript">
  const time = Date.now()
  let index = 0, id = 0
  function load() {
    index += 50
    if (index < 10000) {
      requestAnimationFrame(() => { // 用 requestAnimationFrame（也是宏任务）代替了 setTimeout，性能更好点
        const fragment = document.createDocumentFragment() // IE 浏览器需要使用文档碎片，一般可不用
        for (let i = 0; i < 50; i++) {
          const li = document.createElement('li')
          li.innerText = id++
          fragment.appendChild(li)
        }
        list.appendChild(fragment)
      })
      load()
    }
  }
  load()
  console.log(Date.now() - time)
  setTimeout(() => {
    console.log(Date.now() - time)
  })
</script>
```

![GIF 2021-12-20 16-53-23](https://user-images.githubusercontent.com/51625532/147808255-15845f54-2dac-46dc-8709-313c925c64f9.gif)

#### 虚拟列表

先看效果图：（每页设置只渲染10条数据）

![GIF 2021-12-20 17-10-04](https://user-images.githubusercontent.com/51625532/147808295-2b4589a6-29f5-4d91-9b6b-3d3915d6d1b8.gif)

layout时间不到1s

![impicture_20211231_145118](https://user-images.githubusercontent.com/51625532/147808320-8cd1c47e-dab3-40f4-8c30-72f9ea3f3fc6.png)

## 虚拟列表的实现

目标：  
* 能够高效快速的渲染数据
* 实现不定高的列表
* 自定义展示内容长度
* 支持拖拽排序

### 实现每一项不定高

使用ResizeObserver方法去监听dom的变化，返回每一项的真实高度

```js
if (typeof ResizeObserver !== 'undefined') {
  this.resizeObserver = new ResizeObserver(() => {
    this.dispatchSizeChange()
  })
  this.resizeObserver.observe(this.$el)
}
```


在父组件中监听到每个子项返回其真实高度后，用一个 `sizeStack: new Map()` 存起来（做一次缓存，将第一个子元素返回的高度保存，如果之后每一个子元素的高度都与第一项相同，则后续的计算方法会更简单）

```js
onItemResized(uniqueKey, size) {
  this.sizeStack.set(uniqueKey, size)
  // 初始为固定高度fixedSizeValue, 如果大小没有变更不做改变，如果size发生变化，认为是动态大小，去计算平均值
  if (this.calcType === 'INIT') {
    this.fixedSize = size
    this.calcType = 'FIXED'
  } else if (this.calcType === 'FIXED' && this.fixedSize !== size) {
    this.calcType = 'DYNAMIC'
    delete this.fixedSize
  }
  if (this.calcType !== 'FIXED' && this.firstTotalSize !== 'undefined') {
    if (this.sizeStack.size < Math.min(this.keeps, this.uniqueKeys.length)) {
      this.firstTotalSize = [...this.sizeStack.values()].reduce((acc, cur) => acc + cur, 0)
      this.firstAverageSize = Math.round(this.firstTotalSize / this.sizeStack.size)
    } else {
      delete this.firstTotalSize
    }
  }
}
```

### 实现滚动时变更当前渲染数据

为滚动父元素添加执行滚动事件，通过当前滚动高度去计算首位和末尾元素

```js
handleScroll(event) {
  ...
  // 如果不存在滚动元素 || 滚动高度小于0 || 超出最大滚动距离
  if (scrollTop < 0 || (scrollTop + clientHeight > scrollHeight + 1) || !scrollHeight) {
    return
  }
  // 记录上一次滚动的距离，判断当前滚动方向
  this.direction = scrollTop < this.offset ? 'FRONT' : 'BEHIND'
  this.offset = scrollTop
  const overs = this.getScrollOvers()
  if (this.direction === 'FRONT') {
    this.handleFront(overs)
  } else if (this.direction === 'BEHIND') {
    this.handleBehind(overs)
  }
}
```
### 二分法获取当前节点之前滚动的数量

基本原理：
1. 如果 offset < middle，则 high = mid - 1，只需要在数组的前一半元素中继续查找
2. 如果 offset = middle，匹配成功，查找结束
3. 如果 offset > middle，则 low = mid + 1，只需要在数组的后一半元素中继续查找
4. 如果 while 循环结束后都没有找到 value，返回 0

```js
getScrollOvers() {
  // 如果有header插槽，需要减去header的高度，offset为当前滚动高度
  const offset = this.offset - this.headerSize
  if (offset <= 0) return 0
  if (this.isFixedType()) return Math.floor(offset / this.fixedSize)
  let low = 0
  let middle = 0
  let middleOffset = 0
  let high = this.uniqueKeys.length
  while (low <= high) {
    middle = low + Math.floor((high - low) / 2)
    middleOffset = this.getIndexOffset(middle)
    if (middleOffset === offset) {
      return middle
    } else if (middleOffset < offset) {
      low = middle + 1
    } else if (middleOffset > offset) {
      high = middle - 1
    }
  }
  return low > 0 ? --low : 0
}
```

### 插槽以及滚动事件

顶部和底部插槽

```js
export const Slots = Vue.component('virtual-draglist-slots', {
  mixins: [mixin],
  render (h) {
    const { tag } = this
    return h(tag, {
      ...
    }, this.$slots.default)
  }
})
```

增加判断是否滚动到顶部/底部，在scroll方法中判断当前滚动高度

```js
handleScroll(event) {
  ...
  if (this.direction === 'FRONT') {
    ...
    if (!!this.list.length && scrollTop <= 0) this.$emit('top')
  } else if (this.direction === 'BEHIND') {
    ...
    if (clientHeight + scrollTop >= scrollHeight) this.$emit('bottom')
  }
}
```

### 拖拽排序

简单的实现方式：

```js
mousedown(e) {
  // 仅设置了draggable=true的元素才可拖动
  const draggable = e.target.getAttribute('draggable')
  if (!draggable) return
  ...
  document.onmousemove = (evt) => {
    evt.preventDefault()
    ...
    const { target = null, item = null } = this.getTarget(evt)
    // 记录拖拽目标元素
    this.dragState.newNode = target
    this.dragState.newIitem = item
    const { oldNode, newNode, oldItem, newIitem } = this.dragState
    // 拖拽前后不一致，改变拖拽节点位置
    if (oldItem != newIitem) {
      ...
    }
  }
  document.onmouseup = () => {
    document.onmousemove = null
    document.onmouseup = null
    const { oldItem, oldIndex, newIndex } = this.$parent.dragState
    // 拖拽前后不一致，数组重新赋值
    if (oldIndex != newIndex) {
      let newArr = [...this.dataSource]
      newArr.splice(oldIndex, 1)
      newArr.splice(newIndex, 0, oldItem)
      ...
    }
  }
}
```

## 最终效果

![GIF 2021-12-22 17-40-02](https://user-images.githubusercontent.com/51625532/147808147-72acec33-9dc1-49f7-912b-49216e3a6cc3.gif)



**源码地址：**[https://github.com/mfuu/vue-virtual-drag-list](https://github.com/mfuu/vue-virtual-drag-list)

**npm地址：**[https://www.npmjs.com/package/vue-virtual-draglist](https://www.npmjs.com/package/vue-virtual-draglist)
