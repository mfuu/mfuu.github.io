---
layout: page
title: About
description: 打码改变世界
keywords: MF
comments: true
menu: 关于
permalink: /about/
---

学无止尽

## 联系

<ul>
{% for website in site.data.social %}
<li>{{website.sitename }}：<a href="{{ website.url }}" target="_blank">@{{ website.name }}</a></li>
{% endfor %}
</ul>


## Skill Keywords 👨‍💻

{% for skill in site.data.skills %}
<div class="btn-inline">
{% for keyword in skill.keywords %}
<button class="btn btn-outline" type="button">{{ keyword }}</button>
{% endfor %}
</div>
{% endfor %}
