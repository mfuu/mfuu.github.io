### _config.yml

```yml
title # 网站标题
subtitle # 副标题
description # keywords description
keywords # html keywords

# cdn 加速
cdn:
    jsdelivr:
        enabled: true

components
  share # 文章分享

highlight_theme # markdown样式

# 导航
navs:
  -
    href: /
    label: HOME

  -
    href: /categories/
    label: categories

  -
    href: /archives/
    label: archives

paginate: 10 # 每页显示多少文章

comments_provider # 评论组件
  gitalk # https://github.com/gitalk/gitalk#install
  utterances # https://utteranc.es/

simple_jekyll_search # 搜索
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
---

Content here
```