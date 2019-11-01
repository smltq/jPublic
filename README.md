# jPublic

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/smltq/jPublic/pulls)
[![GitHub stars](https://img.shields.io/github/stars/smltq/jPublic.svg?style=social&label=Stars)](https://github.com/smltq/jPublic)
[![GitHub forks](https://img.shields.io/github/forks/smltq/jPublic.svg?style=social&label=Fork)](https://github.com/smltq/jPublic)
 
交流QQ群：1017567122

## 前言

在我们开发项目的时候，无论项目规模大小，在所难免会写一些工具型函数来解决一些问题，随着项目开发和维护的时间越来越长，这些工具型函数会越来越多，同时还会穿插在各个项目的各模块或者文件当中，使得项目变的越来越臃肿，也不方便复用和维护。这时我们就会提取出一个类似的工具库或者基础库作为项目基础依赖，在项目中重复利用起来。
为了这样的工具库或类库更易扩展、易维护、易复用和更加稳定，我们就需要更好的去管理完善工具库。

## jPublic项目介绍

jPublic 是一个 JavaScript 工具库，它提供了一整套函数式编程的实用功能，但是不依赖任何第三方插件。它弥补了 jQuery、Underscore等没有实现的功能，希望能成为我们项目必不可少的部分。

jPublic 目前提供了80多个函数，包括常用的：debounce、throttle、poll等。

本项目托管在GitHub上。 你可以通过issues page、QQ群等途径报告bug以及参与特性讨论。

jPublic是一个完全开源的JavaScript函数库。

### 组织结构

``` lua
+-- docs  API文档
|   +-- index.html          文档入口
|   +-- ...
+-- test  测试
|   +-- utility.js
|   +-- testIndex.html      单元测试入口
|   +-- ...
--- .gitignore              git忽略规则
--- LICENSE                 开源协议
--- README.md               项目说明
--- favicon.ico             icon

--- karma.conf.js           karma配置

--- jsdoc.json              文档生成配置
--- package.json            npm配置

--- jPublic.js              源文件
--- jPublic-min.js          压缩文件
--- jPublic-min.map         sourcemap

```

### 环境配置

技术 | 名称 | 官网
----|------|----
karma| 测试框架  | [https://github.com/karma-runner](https://github.com/karma-runner)
qunit| 单元测试工具  | [https://qunitjs.com/](https://qunitjs.com/)
jsdoc| 文档生成  | [https://github.com/jsdoc/jsdoc](https://github.com/jsdoc/jsdoc)
nodejs| js运行时  | [https://nodejs.org/zh-cn/](https://nodejs.org/zh-cn/)
UglifyJS2| 压缩工具  | [https://github.com/mishoo/UglifyJS2/tree/v2.x](https://github.com/mishoo/UglifyJS2/tree/v2.x)

### 引入方式

```
Require.js      require(["jPublic"]
页面            <script src="jPublic.min.js"></script>
```

## 在线文档

- API文档：https://smltq.github.io/jPublic/
- 码云文档：https://tqlin.gitee.io/jpublic/module-_.html#.DEFAULT_SCALE（国内建议访问这个地址）
- 码云仓库：https://gitee.com/tqlin/jPublic

## FAQ

- [JavaScript空字符串判断](https://www.cnblogs.com/tqlin/p/10858492.html)
- [这个正则怎么读](https://www.cnblogs.com/tqlin/p/10960127.html)

## 许可证

[MIT](LICENSE "MIT")
