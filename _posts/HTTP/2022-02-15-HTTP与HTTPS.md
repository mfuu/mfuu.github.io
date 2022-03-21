---
layout: post
title: HTTP与HTTPS
categories: [网络]
description: HTTP与HTTPS
keywords: HTTP
---

### 常见的状态码

* 2xxx 成功
  * 200 OK，表示从客户端发来的请求在服务端被正确处理
  * 204 No Content，表示请求成功，但响应报文不含实体的主体部分
  * 205 Reset Content，表示请求成功，但响应报文不含实体的主体部分，并且要求请求方重置内容
  * 206 Partial Content，进行范围请求

* 3xx 重定向
  * 301 moved permanently，永久重定向，表示资源已被分配了新的 URL
  * 302 found，临时重定向，表示资源临时被分配了新的 URL
  * 303 see other，表示资源存在另一个 URL，应使用 GET 方法获取资源
  * 304 not modified，表示服务器允许访问资源，但因为发生请求未满足条件的情况
  * 307 temporary redirect，临时重定向，与 302 类似，但是期望客户端保持请求方法不变向新的地址发出请求

* 4xx 客户端错误
  * 400 bad request，请求报文存在语法错误
  * 401 unauthorized，表示发送的请求需要有通过 HTTP 认证的认证信息
  * 403 forbidden，表示请求资源的访问被服务器拒绝
  * 404 not found，表示服务器上没有找到请求的资源

* 5xx 服务器错误
  * 500 internal server error，表示服务器端在执行请求时发生了错误
  * 501 Not Implemented，表示服务器不支持当前请求所需要的某个功能
  * 503 service unavailable，表示服务器暂时处于超负载或正在停机维护，无法处理请求


### HTTP 首部

| 通用字段 | 作用 |
| ---------- | ----- |
| Cache-Control | 控制缓存的行为 |
| Connection | 浏览器想要优先使用的连接类型 |
| Date | 创建报文时间 |
| Pragma | 报文指令 |
| Via | 代理服务器相关信息 |
| Transfer-Encoding | 传输编码方式 |
| Upgrade | 要求客户端升级协议 |
| Warning | 在内容中可能存在错误 |


| 请求字段 | 作用 |
| ---------- | ----- |
| Accept | 能正确接收的媒体类型 |
| Accept-Charset | 能正确接收的字符集 |
| Accept-Encoding | 能正确接收的编码格式列表 |
| Accept-Language | 能正确接收的语言列表 |
| Expect | 期待服务端的指定行为 |
| From | 请求方邮箱地址 |
| Host | 服务器的域名 |
| if-Match | 两端资源标记比较 |
| if-Modified-Since | 本地资源未修改返回 304（比较时间） |
| if-None-Match | 本地资源未修改返回 304（比较标记）  |
| User-Agent | 客户端信息 |
| Max-Forwards | 限制可能被代理及网关转发的次数 |
| Proxy-Authorization | 向代理服务器发送验证信息 |
| Range | 请求某个内容的一部分 |
| Referer | 表示浏览器所访问的前一个页面 |
| TE | 传输编码方式 |


| 响应字段 | 作用 |
| ---------- | ----- |
| Accept-Ranges | 是否支持某些种类的范围 |
| Age | 资源在代理缓存中存在的时间 |
| ETag | 资源标识 |
| Location | 客户端重定向到某个 URL |
| Proxy-Authenticate | 向代理服务器发送验证信息 |
| Server | 服务器名字 |
| WWW-Authenticate | 获取资源需要的验证信息


| 实体字段 | 作用 |
| ---------- | ----- |
| Allow | 资源的正确请求方式 |
| Content-Encoding | 内容的编码格式 |
| Content-Length | request body 长度 |
| Content-Language | 内容使用的语言 |
| Content-Location | 返回数据的备用地址 |
| Content-MD5 | Base64 加密格式的内容 MD5 检验值 |
| Content-Range | 内容的位置范围 |
| Content-Type | 内容的媒体类型 |
| Expires | 内容的过期时间 |
| Last-modified | 内容的最后修改时间 |

  
### http和https的基本概念
**http**：超文本传输协议，是互联网上应用最广泛的一种网络协议，是一个客户端和服务器端请求和应答的标准（TCP），用于从WWW服务器传输超文本到本地浏览器的传输协议，它可以使浏览器更加高效，使网络传输减少。
**https**：是以安全为目标的HTTP通道，简单讲是HTTP的安全版，即HTTP下加入SSL层，HTTPS的安全基础是SSL，因此加密的详细内容就需要SSL。
**htts协议的主要作用**：建立一个信息安全通道，来确保数组的传输，确保网站的真实性。

### http和https的区别
&emsp;&emsp;http传输的数据都是未加密的，也就是明文。SSL协议就是对http协议传输的数据进行加密处理，简单来说https协议是由http和ssl协议构建的可进行加密传输和身份认证的网络协议，比http协议的安全性更高。

主要的区别如下：
* https协议需要ca证书，费用较高
* http是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议
* 使用不同的链接方式，端口也不同，一般而言，http协议的端口为80，https的端口为443
* http的连接很简单，是无状态的；https协议是由ssl + http协议构建的可进行加密传输、身份认证的网络协议，比http协议安全

### https协议的工作原理

**https的SSL加密是在传输层实现的。**

* 客户端使用https url访问服务器，则要求web服务器简历ssl链接
* web服务器接收到客户端的请求之后，会将网站的证书（证书中包含了公钥）返回或者说传输给客户端
* 客户端和web服务器开始协商 ssl 链接的安全等级，也就是加密等级
* 客户端浏览器通过双方协商一致的安全等级，建立会话密钥，然后通过网站的公钥来加密会话密钥，并传送给网站
* web服务器通过自己的私钥解密出会话密钥
* web服务器通过会话密钥加密与客户端之间的通信

### https协议的优点
* 使用https协议可认证用户和服务器，确保数据发送到正确的客户机和服务器
* https协议是由 ssl + http 协议构建的可进行加密传输、身份认证的网络协议，要比http协议更安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性
* https是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本

### https协议的缺点
* https握手阶段比较费时，会使页面加载时间延长50%，增加10% ~ 20%的耗电
* https缓存不如http高效，会增加数据开销
* ssl证书也需要钱，功能越强大的证书费用越高
* ssl证书需要绑定IP，不能在同一个IP上绑定多个域名，ipv4资源支持不了这种消耗


### TLS

TLS 协议位于传输层之上，应用层之下。首次进行 TLS 协议传输需要两个 RTT，接下来可以通过 Session Resumption 减少到一个 RTT

在 TLS 中使用了两种加密技术，分别为：对称加密和非对称加密
* 对称加密：两边拥有相同的密钥，两边都直到如何将密文加密解密
* 非对称加密：有公钥私钥之分，公钥所有人都可以知道，可以将数据用公钥加密，但是将数据解密必须使用私钥，私钥只有分发公钥的一方才知道

TLS 握手过程：
* 1.客户端发送一个随机值，需要的协议和加密方式
* 2.服务端收到客户端的随机值，自己也产生一个随机值，并根据客户端需求的协议和加密方式使用对应的方式，发送自己的证书（如果需要验证客户端证书需要说明）
* 客户端收到服务端的证书并验证是否有效，验证通过会再生成一个随机值，通过服务端证书的公钥去加密这个随机值并发送给服务端，如果服务端需要验证客户端证书的话会附带证书
* 服务端收到加密过的随机值并使用私钥解密获得第三个随机值，这时候两端都拥有了三个随机值，可以通过这三个随机值按照之前约定的加密方式生成密钥，接下来的通信就可以通过该密钥来加密解密

通过以上步骤可知，在 TLS 握手阶段，两端使用非对称加密的方式来通信，但是因为非对称加密损耗的性能比对称加密大，所以在正式传输数据时，两端使用对称加密的方式通信


### HTTP 2.0

> 二进制传输

HTTP 2.0 中所有加强性能的核心点在于此。在此之前的 HTTP 版本中，都是通过文本的方式传输数据，在 HTTP 2.0 中引入了新的编码机制，所有的传输数据都会被分割，并采用二进制格式编码。

> 多路复用

在 HTTP 2.0 中，有两个非常重要的概念，分别是帧（frame）和流（stream）

帧代表最小的数据单位，每个帧会标识出该帧属于哪个流，流也就是多个帧组成的数据流

多路复用，就是在一个 TCP 连接中可以存在多条流。换句话说，也就是可以发送多个请求，对端可以通过帧中的标识知道属于哪个请求。通过这种技术，可以避免 HTTP 旧版本中的对头阻塞问题，极大的提高传输性能

> Header 压缩

在 HTTP 1.x 中，我们使用文本的形式传输 header，在 header 携带 cookie 的情况下，可能每次都需要重复传输几百到几千的字节

在 HTTP 2.0 中，使用了 HPACK 压缩格式对传输的 header 进行编码，减少了 header 的大小。并在两端维护了索引表，用于记录出现过的 header，后面在传输过程中就可以传输已经记录过的 header 的键名，对端收到数据后就可以通过键名找到对应的值

> 服务端 Push

在 HTTP 2.0 中，服务端可以在客户端某个请求后，主动推送其他资源。


### DNS

DNS 的作用就是通过域名查询到具体的 IP（DNS 是基于 UDP 做的查询）

因为 IP 存在数字和英文的组合（IPv6），很不利于记忆，所以就出现了域名。你可以把域名看成是某个 IP 的别名，DNS 就是去查询这个别名的真正名称是什么。

在 TCP 握手之前就已经进行了 DNS 查询，这个查询是操作系统自己做的。当你在浏览器中想要访问 `www.xxx.com` 时，会进行以下操作：

* 1.操作系统会首先在本地缓存中查询
* 2.没有的话会去系统配置的 DNS 服务器中查询
* 3.还没有的话，会直接去 DNS 根服务器查询，这一步查询会找出谁负责 `com` 这个一级域名的服务器
* 4.然后去该服务器查询 `xxx` 这个二级域名
* 5.接下来三级域名的查询其实是我们配置的，你可以给 `www` 这个域名配置一个 IP，然后还可以给别的三级域名配置一个 IP

以上是 DNS 迭代查询，还有一种是递归查询，区别就是前者是由客户端去做请求，后者是由系统配置的 DNS 服务器做请求，得到结果后将数据返回给客户端


### 面试问题

> **POST 与 GET 的区别**

从技术上说：

* GET 请求能缓存，POST 不能
* POST 相对 GET 安全一点，因为 GET 请求都包含在 URL 里，且会被浏览器保存历史记录，POST 不会，但在抓包的情况下都是一样的
* POST 可以通过 request body 来传输比 GET 更多的数据
* URL 有长度限制，会影响 GET 请求，但是这个长度限制是浏览器规定的，不是 RFC 规定的
* POST 支持更多的编码类型且不对数据类型限制

从本质上说：

* GET 与 POST 都是 TCP 链接，但 GET 产生一个 TCP 数据包，POST 产生两个 TCP 数据包。
  * 对于 GET 方式的请求，浏览器会把 http header 和 data 一并发送出去，服务器响应 200（返回数据）
  * 对于 POST ，浏览器先发送 header，服务器响应 100，浏览器再发送 data，服务器响应 200 ok（返回数据）



> **POST 请求体格式**

* **application/x-www-form-urlencoded**

最常见的 POST 数据提交方式。使用浏览器的原生 form 表单，如果不设置 enctype 属性，那么最终就会以 `application/x-www-form-urlencoded` 方式提交数据。请求结构如下：

```js
POST  HTTP/1.1
Host: www.xxx.com
Cache-Control: no-cache
Postman-Token: ...
Content-Type: application/x-www-form-urlencoded

key=value&testKey=testValue
```

请求头中的 content-type 设置为 application/x-www-form-urlencoded，提交的数据请求 body 中按照 `key1=value1&key2=value2` 进行编码，key 和 value 都要进行 urlencode

* **multipart/form-data**

使用表单上传文件时，必须让 from 的 enctype 等于这个值。请求结构如下：

```js
POST  HTTP/1.1
Host: www.xxx.com
Cache-Control: no-cache
Postman-Token: ...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="key"

value
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="testKey"

testValue
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="imgFile"; filename="no-file"
Content-Type: application/octet-stream


<data in here>
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

首先请求头中的 content-type 是 multipart/form-data，并且会随机生成一个 boundary，用于区分请求 body 中的各个数据，每个数据以 --boundary 开始，以 --boundary-- 结尾


* **application/json**

application/json 作为响应头用来告诉服务端消息主体是序列化后的 JSON 字符串。由于 JSON 规范的流行，除了低版本 IE 之外的各大浏览器都原生支持 JSON.stringify，服务端语言也都有处理 JSON 的函数。

* **application/octet-stream**

只可以上传二进制数据，通常用来上传文件。由于没有键值，所以一次只能上传一个文件

* **text/xml**

这是一种使用 HTTP 作为传输协议，XML 作为编码方式的远程调用规范



> **从输入URL到页面加载完成的过程**
1. 首先做DNS查询，如果这一步做了智能DNS解析的话，会提供访问速度最快的IP地址回来
2. 接下来是TCP握手，应用层会下发数据给传输层，这里TCP协议会指明两端的端口号，然后下发给网络层。网络层中的IP协议会确定IP地址，并且指示了数据传输中如何跳转路由器。然后包会再被封装到数据链路层中的数据帧结构中，最后就是物理层的传输
3. TCP握手结束后会进行TLS握手，然后就开始正式的传输数据
4. 数据在进入服务端之前，可能还会先经过负责负载均衡的服务器，它的作用就是将请求合理的分发到多台服务器上，这时假设服务端会响应一个HTML文件
5. 首先浏览器会判断状态码是什么，如果是200就继续解析，如果是400或500的话就会报错，如果300的话会进行重定向，这里会有个重定向计数器，避免过多次的重定向，超过次数也会报错
6. 浏览器开始解析文件，如果是gzip格式的话会先解压，然后通过文件的编码格式直到如何去解码文件
7. 文件解码成功后会正式开始渲染流程，先根据HTML构建DOM树，有CSS的话会构建CSSOM树。如果遇到script标签，会判断是否存在async或者defer，前者会并行进行下载并执行JS，后者会先下载文件，等HTML解析完成后顺序执行，如果以上都没有，就会阻塞渲染流程直到JS执行完毕。遇到文件下载的会去下载文件
8. 初始的HTML被完全加载和解析后会触发DOMContentLoaded事件
9. CSSOM树和DOM树构建完成后会开始生成Render树，这一步就是确定页面元素的布局、样式等
10. 在生成Render树的过程中，浏览器就开始调用GPU绘制，合成图层，将内容显示在屏幕上了
