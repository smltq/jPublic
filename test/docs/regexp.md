# JavaScript正则表达式

- 问题地址：[这个正则怎么读](https://github.com/smltq/jPublic/issues/11)
- Github仓：[jPublic](https://github.com/smltq/jPublic)
- Gitee仓：[jPublic](https://gitee.com/tqlin/jPublic)
- Api文档：[文档](https://tqlin.gitee.io/jpublic/module-_.html#.DEFAULT_SCALE)

## 以下介绍正则解析过程

```js
    /(\d)(?=(\d\d\d)+(?!\d))/g.exec(100000000)
```
### 这里要注意下x(?=y)先行断言和x(?!y)正向否定查找两个特殊符号的使用（Negative Lookahead）。

- x(?=y)

`匹配'x'仅仅当'x'后面跟着'y'.这种叫做先行断言。
例如，/Jack(?=Sprat)/会匹配到'Jack'仅仅当它后面跟着'Sprat'。/Jack(?=Sprat|Frost)/匹配‘Jack’仅仅当它后面跟着'Sprat'或者是‘Frost’。但是‘Sprat’和‘Frost’都不是匹配结果的一部分。`

- x(?!y)

`匹配'x'仅仅当'x'后面不跟着'y',这个叫做正向否定查找。
例如，/\d+(?!\.)/匹配一个数字仅仅当这个数字后面没有跟小数点的时候。正则表达式/\d+(?!\.)/.exec("3.141")匹配‘141’而不是‘3.141’`

需要注意和理解的地方
1.x(?=y) 和 xy 匹配，但是返回的匹配结果是 x
2.Lookahead表达式不会产生匹配结果

### 简化拆分后,就是()(),即第一个分组是(\d),第二个是(\d\d\d)+,两个分组分别是$1,$2,这里要注意

(\d)

`匹配一个数字。
等价于[0-9]。
例如， /\d/ 或者 /[0-9]/ 匹配"B2 is the suite number."中的'2'。`

1.所以这里的$1匹配的是一个0-9的数字，$2匹配的是三个数字
2.我们注意到$2是带+号的，表示匹配1次到无限次之间，尽可能多地匹配，根据需要返回

### 理解js的exec返回值

返回值

`如果匹配成功，exec() 方法返回一个数组，并更新正则表达式对象的属性。返回的数组将完全匹配成功的文本作为第一项，将正则括号里匹配成功的作为数组填充到后面。
如果匹配失败，exec() 方法返回 null。`

返回参数介绍
result[0]               匹配的全部字符串
result[1], ...[n ]      括号中的分组捕获，即以上示例的$1，$2
index                   匹配到的字符位于原始字符串的基于0的索引值
input                   原始字符串

示例中
result[0]的结果是什么呢，按正则去划分，100 000  000，即$1就是匹配到的全部字符串100，(\d)就是100的最后一个数值0
result[1]就是$1,所以示例中result[0]=result[1]，因为$2是Lookahead表达式，所以示例中$1与匹配结果相等
result[2]就是$2,因为是从左到右匹配（向后匹配），所以最后一组就是$2的结果，即000
index是2（原因看上面返回参数介绍）
input忽悠不介绍了

## jPublic代码中正则的使用

```js
    /**
     * 金额格式化
     * @param {Number}  value   原始金额数值
     * @param {Integer} digit   保留小数位置(默认2位)
     * @returns {string}
     * @alias module:_.fmoney
     * @example
     * _.fmoney(100000000)
     * =>100,000,000.00
     *
     * _.fmoney(100000000.3434343, 3)
     * =>100,000,000.343
     */
    _.fmoney = function (value, digit) {
        digit = digit > 0 && digit <= 20 ? digit : 2;
        if (typeof (value) == "undefined" || (!value && value != 0)) {
            return '';
        }
        value = parseFloat((value + "").replace(/[^\d\.-]/g, "")).toFixed(digit) + "";
        var ss = value.split(".");
        var r = ss[1];
        ss[0] = ss[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
        return ss[0] + "." + r.substring(0, digit);
    };
```
- 通过我上面的介绍，是不是很容易理解了这段代码正则的含意啦
- 有问题欢迎给我提issue（Github或码云）都可以，我看到会第一时间解决
- 喜欢本js函数库的朋友，欢迎给下支持哦

## 参考资料

- [JavaScript正则介绍](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#special-negated-look-ahead)
- [Lookahead表达式](https://www.stefanjudis.com/today-i-learned/the-complicated-syntax-of-lookaheads-in-javascript-regular-expressions/)
- [exec函数介绍](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)
- [正则在线测试](https://regex101.com/?tdsourcetag=s_pcqq_aiomsg)