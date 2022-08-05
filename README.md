### _config.yml

```yml
# cdn 加速
cdn:
    jsdelivr:
        enabled: true

components
  share # 文章分享

highlight_theme # markdown样式

comments_provider # support provider:  disqus, gitment, gitalk, utterances, beaudar
```


### Categories

```
│  favicon.ico
│  index.html
│  README.md
│  _config.yml
│  
├─.github
│  │  FUNDING.yml
│  │  
│  └─workflows
│          ci.yml
│          
├─assets
|
├─images
|
├─pages
│      
├─_data
│      
├─_includes
│      
├─_layouts
│      
├─_posts
```

### posts

```
---
layout: post
title: template page
categories: [cate1, cate2]
description: some word here
keywords: keyword1, keyword2
pinned: true
---

Content here
```