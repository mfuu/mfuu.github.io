---
layout: post
title: 解决 GitHub Page 构建失败的问题
categories: [GitHub page]
description: GitHub Action：The process '/usr/bin/git' failed with exit code 128
keywords: GitHub
---


## 问题

### 错误日志

```
Running post deployment cleanup jobs… 🗑️
/usr/bin/git worktree remove github-pages-deploy-action-temp-deployment-folder --force
fatal: 'github-pages-deploy-action-temp-deployment-folder' is not a working tree
Error: The process '/usr/bin/git' failed with exit code 128
Deployment failed! ❌
```

### 脚本

```yml
name: Build and Deploy

on:
  push:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.1
        with: 
          persist-credentials: false

      - name: Set Ruby 2.7
        uses: actions/setup-ruby@v1
        with:
          ruby-version: 2.7

      - name: Install and Build
        run: |
          gem install bundler
          bundle install
          bundle exec jekyll build
        
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@3.6.2
        with:
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          BRANCH: built
          FOLDER: _site
          CLEAN: true
```

## 处理

修改`ci.yml`脚本

```yml
name: Build and Deploy

on:
  push:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.1
        with: 
          persist-credentials: false

      - name: Set Ruby 2.7
        uses: actions/setup-ruby@v1
        with:
          ruby-version: 2.7

      - name: Install and Build
        run: |
          gem install bundler
          bundle install
          bundle exec jekyll build
        
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@3.6.2
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}   # 新增内容
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          BRANCH: built
          FOLDER: _site
          CLEAN: true
```