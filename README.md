### _config.yml

```yml
title # 网站标题

components
  share # 文章分享

highlight_theme # markdown样式

navs # 导航

comments_provider # 评论组件
  gitalk # https://github.com/gitalk/gitalk#install
  utterances # https://utteranc.es/

simple_jekyll_search # 搜索
```


### Categories

```
_includes
  xxx.html

_layouts
  xxx.html

_post
  xxx.md

assets

images

pages

_config.yml

index.html
```

### posts

```
---
layout: post
title: template page
categories: [cate1, cate2]
description: some word here
keywords: keyword1, keyword2
---

Content here
```