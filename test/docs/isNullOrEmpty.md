# JavaScript空字符串判断

本文完整示例代码GIT仓：

- 测试用例完整代码：[isNullOrEmpty](https://github.com/smltq/jPublic/blob/master/test/isNullOrEmpty.js)
- jPublic GIT仓：[jPublic](https://github.com/smltq/jPublic)

## 比较常见写法

```js
    if (str == 'undefined' || !str || !/[^\s]/.test(str)) {
        //为空
    } else {
        //不为空
    }
```
### 这种写法缺点
- 代码比较长，难于记住
- 需要复制的时候要找代码，费时间

### 解决方案

- 对于这种常用的代码段，我们项目上经常会把他封装成一个通用函数，放到项目工具库中，然后需要使用的时候直接调用
- 使用第三方工具库，比如jPublic.js，GIT仓：[https://github.com/smltq/jPublic](https://github.com/smltq/jPublic)

## 收到的反馈总结

有人可能觉得，判断一个字符串为空，直接写成这样：

a. 
```js
    if (str) {
        //为空
    } else {
        //不为空
    }
```
在实际生产环境中并没有什么问题，何必要如上写一段这么长的代码来判断。（PS:一些特殊数据下，真的就显示正常吗？针对这种情况，我下面会写出测试用例来判断运行结果）

### 其它判断空代码

网络上还有很多各种情况的空字符串判断，如下：

b. 
```js
  if (variable1 !== null || variable1 !== undefined || variable1 !== '') { 
    var variable2 = variable1; 
  }
```

c. 
```js
   function isEmpty(property) {
      return (property === null || property === "" || typeof property === "undefined");
   }
```

d. 
```js
function isEmpty(strIn) {
    if (strIn === undefined) {
        return true;
    } else if (strIn == null) {
        return true;
    } else if (strIn == "") {
        return true;
    } else {
        return false;
    }
}
```

e. 
```js
String.isEmpty = function (value) {
    return (!value || value == undefined || value == "" || value.length == 0);
}
```

等各种空字符串判断方法，这些代码多少都有些脓肿和判断不全的，了解js if(xx)自动转换的朋友都知道，任何一个值，只要它不是 undefined、null、 0、NaN或空字符串（""），那么无论是任何对象，即使是值为假的Boolean对象，在条件语句中都为真。
所以以上代码，像比如：null==str、""==str等，其实都可以直接使用if(xx)简化。

## 以下是我写的测试用例代码

```js
    QUnit.test('字符串空判断：empty', function (assert) {
        function empty(str) {
            if (str == 'undefined' || !str || !/[^\s]/.test(str)) {
                return true;
            } else {
                return false;
            }
        }

        var student = {className: "测试班", name: "我是张三", age: 18};
        assert.ok(empty("   "), "empty空字符串判断正确");
        assert.ok(empty(' '), "empty空字符串判断正确");
        assert.ok(empty(student.skill), "empty空字符串判断正确");
        assert.ok(empty(undefined), "empty空字符串判断正确");
        assert.ok(empty(null), "empty空字符串判断正确");
        assert.ok(empty(""), "empty空字符串判断正确");
        assert.ok(empty(''), "empty空字符串判断正确");
    });

    QUnit.test('字符串空判断：empty1', function (assert) {
        function empty1(str) {
            if (str) {
                return true;
            }
            return false;
        }

        var student = {className: "测试班", name: "我是张三", age: 18};
        assert.ok(empty1("   "), "empty1空字符串判断正确");
        assert.ok(empty1(' '), "empty1空字符串判断正确");
        assert.ok(empty1(student.skill), "empty1空字符串判断正确");
        assert.ok(empty1(undefined), "empty1空字符串判断正确");
        assert.ok(empty1(null), "empty1空字符串判断正确");
        assert.ok(empty1(""), "empty1空字符串判断正确");
        assert.ok(empty1(''), "empty1空字符串判断正确");
    });

    QUnit.test('字符串空判断：isNullOrEmpty', function (assert) {
        var student = {className: "测试班", name: "我是张三", age: 18};
        assert.ok(_.isNullOrEmpty("   "), "isNullOrEmpty 空字符串判断正确");
        assert.ok(_.isNullOrEmpty(' '), "isNullOrEmpty 空字符串判断正确");
        assert.ok(_.isNullOrEmpty(student.skill), "isNullOrEmpty 空字符串判断正确");
        assert.ok(_.isNullOrEmpty(undefined), "isNullOrEmpty 空字符串判断正确");
        assert.ok(_.isNullOrEmpty(null), "isNullOrEmpty 空字符串判断正确");
        assert.ok(_.isNullOrEmpty(""), "isNullOrEmpty 空字符串判断正确");
        assert.ok(_.isNullOrEmpty(''), "isNullOrEmpty 空字符串判断正确");
    });
```

### 单元测试运行结果

String: 字符串空判断：empty (7)Rerun2 ms           ============>>>表示7个用例都通过测试
String: 字符串空判断：empty1 (5, 2, 7)Rerun2 ms    ============>>>表示7个用例有5个测试未通过
String: 字符串空判断：isNullOrEmpty (7)Rerun       ============>>>表示7个用例都通过测试

### 运行效果图

![运行效果](https://img2018.cnblogs.com/blog/75999/201905/75999-20190513191538467-1138767292.png)

github
