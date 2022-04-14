---
layout: github
title: vue-virtual-drag-list
keywords: virtual,vue,list,drag,sort,big-data
description: vue-virtual-drag-list demo
permalink: /vue-virtual-drag-list/
---


<html lang="en-us">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>拖动排序</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-virtual-draglist@2.5.1/dist/draglist.min.js"></script>
  <script src="../assets/js/mock.js"></script>
  <script src="../assets/js/sentences.js"></script>
  <style>
    html, body {
      height: 100%;
      width: 100%;
      padding: 0;
      margin: 0;
    }
    #app {
      height: 100%;
    }
    .header {
      padding: 20px;
    }
    #v-draggable-virtual-list {
      /* height: 100%; */
      height: 80%;
      /* overflow: hidden; */
      position: relative;
      border: 1px solid #37ff19;
      background: #84ff1914;
    }
    .content {
      height: 100%;
      overflow: auto;
    }
    .index {
      color: #1984ff;
      cursor: grab;
    }
    .test-item {
      padding: 16px;
      border-bottom: 1px solid #1984ff;
    }
    .loading {
      font-size: 16px;
      height: 20px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="header">
      <button @click="reset">reset</button>
      <button @click="editing = !editing">change editing</button>
      <button @click="toBottom">bottom</button>

      allow drag: {{ editing }}
    </div>
    <div id="v-draggable-virtual-list">
      <virtual-list ref="list" :data-source="dataSource" :data-key="'id'" :keeps="50" :size="60" :draggable="editing" @top="handleTop" @bottom="handleBottom" @ondragend="ondragend">
        <template slot="item" slot-scope="{ record, index, dataKey }">
          <div class="test-item">
            <div class="sort index" draggable="true" v-if="editing" @click="handleClick">
              <i class="f7-icons">sort_ios</i>
            </div>
            <span>{{ record.id }}</span>
            <span>{{ record.desc }}</span>
          </div>
        </template>
        <template slot="header">
          <div class="loading">header</div>
        </template>
        <template slot="footer">
          <div class="loading">footer</div>
        </template>
      </virtual-list>
    </div>
  </div>
  <script type="text/javascript">
    new Vue({
      el: '#app',
      data() {
        return {
          editing: true,
          dataSource: getPageData(60, 0),
        }
      },
      components: { virtualList: VirtualDragList },
      methods: {
        reset() {
          this.$refs.list.reset()
        },
        handleTop() {
          console.log('is to top')
        },
        handleBottom() {
          console.log('is to bottom')
        },
        ondragend(arr) {
          console.log('new arr after drag end', arr)
        },
        toBottom() {
          this.$refs.list.scrollToBottom()
        },
        handleClick() {
          console.log('click')
        }
      }
    })
  </script>
</body>

</html>

