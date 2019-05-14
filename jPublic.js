/**
 * @file js工具库.
 * @copyright jPublic.js 2019
 * @author https://github.com/smltq/jPublic.git
 */
(function () {
    // 基线开始
    //----------------------
    /**
     * 获得root,兼容web,微信,note等
     */
    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global) || this || {};

    var ArrayProto = Array.prototype, ObjProto = Object.prototype;

    /**
     * 为快速访问核心原型创建快速引用变量
     */
    var push = ArrayProto.push,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    /**
     * 定义将要实现的 ECMAScript 5 原生方法
     */
    var nativeKeys = Object.keys;

    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    /**
     * 创建全局对象:_
     * @global
     * @module _
     */
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    /**
     * 当前版本号
     * @type {string}
     * @default
     * @readOnly
     * @alias module:_.VERSION
     */
    _.VERSION = '1.8.3';

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }
    // 基线结束

    //私有成员开始
    //----------------------
    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
            case 3:
                return function (value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };

    var shallowProperty = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    var has = function (obj, path) {
        return obj != null && hasOwnProperty.call(obj, path);
    }

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = shallowProperty('length');
    var isArrayLike = function (collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    var builtinIteratee;
    var cb = function (value, context, argCount) {
        if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
        return _.property(value);
    };

    var createAssigner = function (keysFunc, defaults) {
        return function (obj) {
            var length = arguments.length;
            if (defaults) obj = Object(obj);
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!defaults || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    var collectNonEnumProps = function (obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

        //构造函数是一种特殊情况
        var prop = 'constructor';
        if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    };
    //私有成员结束

    //集合函数开始
    //---------------
    /**
     * 生成可应用于集合中的每个元素的回调。<br>
     * _.iteratee支持许多常见回调用例的简写语法。<br>
     * 根据值的类型，_.iteratee 各种结果
     * @param value
     * @param context
     * @alias module:_.iteratee
     * @method
     * @example
     * // 空值
     * _.iteratee();
     * => _.identity()
     * // 函数
     * _.iteratee(function(n) { return n * 2; });
     * => function(n) { return n * 2; }
     * // 对象
     * _.iteratee({firstName: 'Chelsea'});
     * => _.matcher({firstName: 'Chelsea'});
     * // 其它
     * _.iteratee('firstName');
     * => _.property('firstName');
     */
    _.iteratee = builtinIteratee = function (value, context) {
        return cb(value, context, Infinity);
    };

    /**
     * 返回一个断言函数，这个函数会给你一个断言可以用来辨别给定的对象是否匹配attrs指定键/值属性。
     * @param attrs
     * @alias module:_.matcher
     * @example
     * var ready = _.matcher({selected: true, visible: true});
     * var readyToGoList = _.filter(list, ready);
     */
    _.matcher = function (attrs) {
        attrs = _.extendOwn({}, attrs);
        return function (obj) {
            return _.isMatch(obj, attrs);
        };
    };

    /**
     * 类似于 extend, 但只复制自己的属性覆盖到目标对象。（注：不包括继承过来的属性）。
     * @type {Function}
     * @alias module:_.extendOwn
     */
    _.extendOwn = createAssigner(_.keys);

    /**
     * 判断properties中的键和值是否包含在object中。
     * @param {Object} object   查找目标
     * @param {Object} attrs    查找对象
     * @alias module:_.isMatch
     * @example
     * var stooge = {name: 'moe', age: 32};
     * _.isMatch(stooge, {age: 32});
     * => true
     */
    _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };

    /**
     * 遍历list中的所有元素，按顺序用遍历输出每个元素。<br>
     * 如果传递了context参数，则把iteratee绑定到context对象上。<br>
     * 每次调用iteratee都会传递三个参数：(element, index, list)。<br>
     * 如果list是个JavaScript对象，iteratee的参数是 (value, key, list))。<br>
     * 返回list以方便链式调用。<br>
     * @param {Object} obj   遍历目标
     * @param {Function} iteratee   迭代器
     * @param {Object} context  绑定的目标对象
     * @alias module:_.each
     * @example
     * _.each([1, 2, 3], alert);
     * => 依次提示每个数字...
     * _.each({one: 1, two: 2, three: 3}, alert);
     * => 依次提示每个数字...
     */
    _.each = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };
    //集合函数结束

    //通用函数开始
    //---------------
    /**
     * 返回一个对象里所有的方法名, 而且是已经排序的 — 也就是说, 对象里每个方法(属性值是一个函数)的名称.
     * @param {Object}  obj 查找对象
     * @returns {this}
     * @alias module:_.functions
     * @example
     * _.functions(_);
     * => ["arrayDiff", "arrayEquals", "arrayIsRepeat", "clone", "debounce", "defineColor" ...
     */
    _.functions = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    /**
     * 获得当前Url参数值
     * @param {String}  name    参数名
     * @returns {string|null}
     * @alias module:_.getUrlParam
     */
    _.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    };

    /**
     * 函数去抖,空闲时间大于或等于wait，执行fn
     * @param {Function}    fn          要调用的函数
     * @param {Integer}     wait        延迟时间(单位毫秒)
     * @param {Boolean}     immediate   给immediate参数传递false绑定的函数先执行，而不是wait之后执行
     * @returns 实际调用函数
     * @alias module:_.debounce
     * @example
     * var lazyLayout = _.debounce(calculateLayout, 300);
     * $(window).resize(lazyLayout);
     */
    _.debounce = function (fn, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) fn.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) fn.apply(context, args);
        }
    };

    /**
     * 函数节流 每wait时间间隔，执行fn
     * @param {Function}    fn      要调用的函数
     * @param {Integer}     wait    延迟时间，单位毫秒
     * @param {Object}      scope   scope代替fn里this的对象
     * @returns {Function} 实际调用函数
     * @alias module:_.throttle
     * @example
     * var throttled = _.throttle(updatePosition, 100);
     * $(window).scroll(throttled);
     */
    _.throttle = function (fn, wait, scope) {
        wait || (wait = 250);
        var last, deferTimer;
        return function () {
            var context = scope || this;
            var now = _.now(), args = arguments;
            if (last && now < last + wait) {
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, wait);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    };

    /**
     * 函数只执行一次
     * @param {Function}    fn      要执行的函数
     * @param {Object}      context 上下文
     * @returns {function(): *}
     * @alias module:_.runOnce
     * @example
     * var a = 0;
     * var canOnlyFireOnce = runOnce(function () {
     *      a++;
     *      console.log(a);
     * });
     * canOnlyFireOnce(); =>1
     * canOnlyFireOnce(); => nothing
     * canOnlyFireOnce(); => nothing
     */
    _.runOnce = function (fn, context) {
        var result;
        return function () {
            if (fn) {
                result = fn.apply(context || this, arguments);
                fn = null;
            }
            return result;
        };
    };

    /**
     * 轮询条件函数，根据状态执行相应回调
     * @param {Function}    fn          条件函数
     * @param {Function}    callback    成功回调
     * @param {Function}    errback     失败回调
     * @param {Integer}     timeout     超时间隔(毫秒)
     * @param {Integer}     interval    轮询间隔(毫秒)
     * @alias module:_.poll
     * @example
     *
     * 确保元素可见
     * poll(
     *    function () {
     *       return document.getElementById('lightbox').offsetWidth > 0;
     *    },
     *    function () {
     *       // Done, success callback
     *    },
     *    function () {
     *      // Error, failure callback
     *    }
     * );
     */
    _.poll = function (fn, callback, errback, timeout, interval) {
        var endTime = Number(new Date()) + (timeout || 2000);
        interval = interval || 100;
        (function p() {
            // 如果条件满足，调用回调
            if (fn()) {
                callback();
            }
            //如果在结束时间内，继续进入循环判断
            else if (Number(new Date()) < endTime) {
                setTimeout(p, interval);
            }
            //超时，抛出异常
            else {
                errback(new Error('timed out for ' + fn + ': ' + arguments));
            }
        })();
    };

    /**
     * 返回一个min 和 max之间的随机整数。<br>
     * 如果你只传递一个参数，那么将返回0和这个参数之间的整数
     * @param min 随机数下限,没传默认为0
     * @param max 随机数上限
     * @returns {number}
     * @alias module:_.getRandom
     * @example
     * _.random(0, 100);
     * => 48
     */
    _.getRandom = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    /**
     * 获取表单数据
     * @param frm
     * @alias module:_.getFormJson
     */
    _.getFormJson = function (frm) {
        var o = {};
        var a = frm.serializeArray();
        _.each(a, function () {
            o[this.name] = this.value;
        });
        return o;
    };

    /**
     * 复制文本到剪切板
     * @alias module:_.copyToClipboard
     */
    _.copyToClipboard = function (text) {
        if (window.clipboardData && window.clipboardData.setData) {
            return clipboardData.setData("Text", text);
        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");
            } catch (ex) {
                console.warn("复制到剪贴板异常:", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };

    /**
     * 定义操作列
     * @param {Array} arr   一个数组
     * @param {Integer} value   对应行的id值
     * @returns {string} 返回html字符串
     * @alias module:_.defineOperate
     *
     * @example
     * var arr = [
     *      { text: "删除", fn: "detailDataGrid.Delete({0})" },
     *      {text: "修改", fn: "detailDataGrid.Edit({0})" }]
     */
    _.defineOperate = function (arr, value) {
        var str = "";
        var len = arr.length, i = 0;
        while (i < len) {
            str += _.format("<a style='cursor: pointer;' onclick='{1}' href='javascript:;'>{0}</a>", arr[i].text, _.format(arr[i].fn, value));
            str += (i == len - 1 ? "" : " | ");
            i++;
        }
        return str;
    };

    /**
     * 获取当前网站根路径
     * @alias module:_.getRootPath
     */
    _.getRootPath = function () {
        var curPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curPath.indexOf(pathName);
        var localhostPaht = curPath.substring(0, pos);
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPaht + projectName);
    };

    /**
     * 格式化字符串
     * @alias module:_.format
     */
    _.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };

    /**
     * 去左右空格
     * @param str 字符串
     * @param chars 要移除的字符（默认为空白字符)
     * @alias module:_.trim
     */
    _.trim = function (str, chars) {
        return this.ltrim(this.rtrim(str, chars), chars);
    };

    /**
     * 去左空格
     * @param str 字符串
     * @param chars 要移除的字符（默认为空白字符)
     * @alias module:_.ltrim
     */
    _.ltrim = function (str, chars) {
        chars = chars || "\\s";
        return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
    };

    /**
     * 去右空格
     * @param str 字符串
     * @param chars 要移除的字符（默认为空白字符)
     * @alias module:_.rtrim
     */
    _.rtrim = function (str, chars) {
        chars = chars || "\\s";
        return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
    };

    /**
     * 判断对象是否函数
     * @param obj
     * @alias module:_.isFunction
     */
    _.isFunction = function (obj) {
        return typeof obj == 'function' || false;
    };

    /**
     * 判断是否object对象
     * @param obj
     * @returns {boolean}
     * @alias module:_.isObject
     */
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    /**
     * 是否为空字符串
     * @param str
     * @returns {boolean}
     * @alias module:_.isNullOrEmpty
     */
    _.isNullOrEmpty = function (str) {
        if (!str || _.trim(str) === '') {
            return true;
        }
        return false;
    };

    /**
     * 如果object 不包含任何值(没有可枚举的属性)，返回true。
     * 对于字符串和类数组（array-like）对象，如果length属性为 0，那么_.isEmpty检查返回true。
     * _.isEmpty([1, 2, 3]);
     * => false
     * _.isEmpty({});
     * => true
     * @param obj
     * @returns {boolean}
     */
    _.isEmpty = function (obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isArguments(obj))) return obj.length === 0;
        if (_.isString(obj)) return _.isNullOrEmpty(obj);
        return _.keys(obj).length === 0;
    };

    /**
     * 判断是否数组
     * @param obj
     * @returns {boolean}
     * @alias module:_.isArray
     */
    _.isArray = function (obj) {
        return toString.call(obj) === '[object Array]';
    };

    /**
     * 是否数值
     * @param value
     * @returns {boolean}
     * @alias module:_.isNumeric
     */
    _.isNumeric = function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };

    /**
     * 是否字符串
     * @param value
     * @returns {boolean}
     * @alias module:_.isString
     */
    _.isString = function (value) {
        return typeof value === 'string';
    };

    /**
     * 如果object是一个参数对象，返回true。
     * (function(){ return _.isArguments(arguments); })(1, 2, 3);
     * => true
     * _.isArguments([1,2,3]);
     * => false
     */
    _.isArguments = function (obj) {
        return has(obj, 'callee');
    };

    /**
     * 截取字符串
     * @param str 原始字符串
     * @param limit 长度限制
     * @param suffix 超过替换字符
     * @returns {string|*}
     * @alias module:_.truncate
     */
    _.truncate = function (str, limit, suffix) {
        if (_.isString(str)) {
            if (typeof suffix !== 'string') {
                suffix = '';
            }
            if (str.length > limit) {
                return str.slice(0, limit - suffix.length) + suffix;
            }
            return str;
        }
    };

    /**
     * 金额格式化(RMB)
     * @param s
     * @param n
     * @returns {string}
     * @alias module:_.fmoney
     */
    _.fmoney = function (s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        if (typeof (s) == "undefined" || (!s && s != 0)) {
            return '';
        }
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var ss = s.split(".");
        var l = ss[0], r = ss[1];
        ss[0] = ss[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
        return ss[0] + "." + r.substring(0, n);// 保留n位小数
    };

    /**
     * 定义文字颜色
     * @param value
     * @param color
     * @returns {string}
     * @alias module:_.defineColor
     */
    _.defineColor = function (value, color) {
        return '<span style="color:' + (color || "#FF0000") + '">' + value + "</span>";
    };

    /**
     * 字节格式化
     * formatBytes(bytes,decimals)
     * 示例：
     * formatBytes(1024);       // 1 KB
     * formatBytes('1024');     // 1 KB
     * formatBytes(1234);       // 1.21 KB
     * formatBytes(1234, 3);    // 1.205 KB
     * @param bytes
     * @param decimals
     * @returns {string}
     * @alias module:_.formatBytes
     */
    _.formatBytes = function (bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * 如果list中的所有元素都通过predicate的真值检测就返回true。
     * （注：如果存在原生的every方法，就使用原生的every。）
     * predicate 通过 iteratee 进行转换，以简化速记语法。
     * @param list
     * @param predicate
     * @param context
     * @returns {boolean}
     * @alias module:_.every
     */
    _.every = function (list, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(list) && _.keys(list),
            length = (keys || list).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(list[currentKey], currentKey, list)) return false;
        }
        return true;
    };

    /**
     * 如果list中有任何一个元素通过 predicate 的真值检测就返回true。
     * 一旦找到了符合条件的元素, 就直接中断对list的遍历。
     * predicate 通过 iteratee 进行转换，以简化速记语法。
     * @param list
     * @param predicate
     * @param context
     * @returns {boolean}
     * @alias module:_.some
     */
    _.some = function (list, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(list) && _.keys(list),
            length = (keys || list).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(list[currentKey], currentKey, list)) return true;
        }
        return false;
    };

    /**
     * 一个用来创建整数灵活编号的列表的函数，便于each 和 map循环。
     * 如果省略start则默认为 0；
     * step 默认为 1.返回一个从start 到stop的整数的列表，用step来增加 （或减少）独占。
     * 值得注意的是，如果stop值在start前面（也就是stop值小于start值），那么值域会被认为是零长度，而不是负增长。-如果你要一个负数的值域 ，请使用负数step.
     * 示例：
     _.range(10);
     => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     _.range(1, 11);
     => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
     _.range(0, 30, 5);
     => [0, 5, 10, 15, 20, 25]
     _.range(0, -10, -1);
     => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
     _.range(0);
     => []
     * @param start
     * @param stop
     * @param step
     * @returns {any[]}
     * @alias module:_.range
     */
    _.range = function (start, stop, step) {
        if (stop == null) {
            stop = start || 0;
            start = 0;
        }
        if (!step) {
            step = stop < start ? -1 : 1;
        }
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }
        return range;
    };

    /**
     * 检索object拥有的所有可枚举属性的名称。
     * 示例：
     * _.keys({one: 1, two: 2, three: 3});
     * => ["one", "two", "three"]
     * @param obj
     * @returns {Array|*}
     * @alias module:_.keys
     */
    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    /**
     * 创建对象的(浅克隆)副本
     * @param obj
     * @returns {*|_|*}
     * @alias module:_.clone
     */
    _.clone = function (obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    //通用函数结束

    //日期相关开始
    //-----------------------
    /**
     * 获取当前时间戳，兼容旧环境（毫秒）
     * @alias module:_.now
     */
    _.now = Date.now || function () {
        return new Date().valueOf();
    };

    /**
     * 获取当前服务器时间(Date)
     * @returns {Date}
     * @alias module:_.serverTime
     */
    _.serverTime = function () {
        var xmlHttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttp.open("HEAD", location.href, false);
        xmlHttp.send();
        return new Date(xmlHttp.getResponseHeader("Date"));
    };

    /**
     * 获取月份第一天
     * @param date
     * @returns {Date}
     * @alias module:_.firstDay
     */
    _.firstDay = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    /**
     * 获取月份最后一天
     * @param date
     * @returns {Date}
     * @alias module:_.lastDay
     */
    _.lastDay = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    /**
     * 获取上个月第一天
     * @param date
     * @returns {Date}
     * @alias module:_.firstMonthDay
     */
    _.firstMonthDay = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), date.getMonth() - 1, 1);
    };

    /**
     * 获取上个月最后一天
     * @param date
     * @returns {Date}
     * @alias module:_.lastMonthDay
     */
    _.lastMonthDay = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), date.getMonth(), 0);
    };

    /**
     * 获取本年第一天
     * @param date
     * @returns {Date}
     * @alias module:_.firstYearDay
     */
    _.firstYearDay = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), 0, 1);
    };

    /**
     * 获取本年最后一天
     * @param date
     * @returns {Date}
     * @alias module:_.lastYearDay
     */
    _.lastYearDay = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), 11, 31);
    };

    /**
     * 获得本周的开始日期
     * @param date
     * @returns {Date}
     * @alias module:_.getWeekStartDate
     */
    _.getWeekStartDate = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
    };

    /**
     * 获得本周的结束日期
     * @param date
     * @returns {Date}
     * @alias module:_.getWeekEndDate
     */
    _.getWeekEndDate = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 - date.getDay());
    };

    /**
     * 获得上周的开始日期
     * @param date
     * @returns {Date}
     * @alias module:_.getLastWeekStartDate
     */
    _.getLastWeekStartDate = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() - 6);
    };

    /**
     * 获得上周的结束日期
     * @param date
     * @returns {Date}
     * @alias module:_.getLastWeekEndDate
     */
    _.getLastWeekEndDate = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
    };

    /**
     * 获取去年第一天
     * @param date
     * @returns {Date}
     * @alias module:_.lastYearFirstDay
     */
    _.lastYearFirstDay = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear() - 1, 0, 1);
    };

    /**
     * 获取去年最后一天
     * @param date
     * @returns {Date}
     * @alias module:_.lastYearLastDay
     */
    _.lastYearLastDay = function (date) {
        date || (date = new Date());
        return new Date(date.getFullYear() - 1, 11, 31);
    };

    /**
     * 将 Date 转化为指定格式的String 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)
     * 可以用 1-2 个占位符 年(y)可以用 1-4 个占位符 毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 示例：
     * dateFormat(date,"yyyy-MM-dd hh:mm:ss.S") ==> 2016-05-04 08:09:04.423
     * dateFormat(date,"yyyy-M-d h:m:s.S") ==>2016-05-04 8:9:4.18
     * @param date 日期,为空默认当前时间
     * @param format 格式化字符串,默认为(yyyy-MM-dd hh:mm:ss)
     * @returns {*}
     * @alias module:_.dateFormat
     */
    _.dateFormat = function (date, format) {
        date instanceof Date || (date = new Date(date));
        format = format || "yyyy-MM-dd hh:mm:ss";
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return format;
    };

    /**
     * 返回日期的yyyy-MM-dd格式
     * @param date 日期
     * @alias module:_.shortDateFormat
     */
    _.shortDateFormat = function (date) {
        if (!date) {
            return "";
        }
        return this.dateFormat(date, 'yyyy-MM-dd');
    };

    /**
     * 将时间格式化为指定格式的String
     * 示例：
     * formatTime(25) ==> '0:00:25'
     * formatTime(63846) ==> '17:44:06'
     * @param n
     * @returns {string}
     * @alias module:_.formatTime
     */
    _.formatTime = function (n) {
        var hours = Math.floor(n / 60 / 60);
        var minutes = Math.floor((n - (hours * 60 * 60)) / 60);
        var seconds = Math.round(n - (hours * 60 * 60) - (minutes * 60));
        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
    };

    /**
     * 反格式化,与formatTime函数相反
     * @param string
     * @returns {number}
     * @alias module:_.unformatTime
     */
    _.unformatTime = function (string) {
        var timeArray = string.split(':'), seconds = 0;
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        } else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    };
    //日期相关结束

    //数组工具相关开始
    //-------------
    /**
     * 数组差集，以第一个数组为主
     * @param a
     * @param b
     * @returns {*}
     * @alias module:_.arrayDiff
     */
    _.arrayDiff = function (a, b) {
        var filtered = a.filter(function (e) {
            return b.indexOf(e) === -1;
        });
        return filtered;
    };

    /**
     * 洗牌数组
     * @param array
     * @returns {Array}
     * @alias module:_.arrayShuffle
     */
    _.arrayShuffle = function (array) {
        var copy = [], n = array.length, i;
        while (n) {
            i = Math.floor(Math.random() * n--);
            copy.push(array.splice(i, 1)[0]);
        }
        return copy;
    };

    /**
     * 数组元素是否重复
     * @param arr
     * @returns {boolean}
     * @alias module:_.arrayIsRepeat
     */
    _.arrayIsRepeat = function (arr) {
        var hash = {};
        for (var i in arr) {
            if (hash[arr[i]]) {
                return true;
            }
            hash[arr[i]] = true;
        }
        return false;
    };

    /**
     * 数组去重
     * @param arr
     * @returns {Array}
     * @alias module:_.arrayUnique
     */
    _.arrayUnique = function (arr) {
        var a = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            if (a.indexOf(arr[i]) === -1) {
                a.push(arr[i]);
            }
        }
        return a;
    };

    /**
     * 判断数组是否相等,默认为严格模式比较
     * 示例：
     * var arr1 = [1, 2, 3, 4];
     * var arr2 = [2, 1, 4, 3];
     * var arr3 = [2, 2, 3, 4];
     * var arr4 = [1, 2, 3, 4];
     * arr1.equals(arr2)==> false   arr1.equals(arr2, false)==>true
     * arr1.equals(arr3)==>false    arr1.equals(arr3, false)==>false
     * arr1.equals(arr4)==>true     arr1.equals(arr4, false)==>true
     * @param array
     * @param strict
     * @returns {boolean}
     * @alias module:_.arrayEquals
     */
    _.arrayEquals = function (array, strict) {
        if (!array) return false;
        if (arguments.length == 1) strict = true;
        if (this.length != array.length) return false;
        for (var i = 0; i < this.length; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i], strict)) return false;
            } else if (strict && this[i] != array[i]) {
                return false;
            } else if (!strict) {
                return this.sort().equals(array.sort(), true);
            }
        }
        return true;
    };
    //数组工具相关结束

    /**
     * 精度范围
     * @alias module:_.EPSILON
     */
    _.EPSILON = Math.pow(2, -52);

    /**
     * 默认数值保留小数位数
     * @alias module:_.DEFAULT_SCALE
     */
    _.DEFAULT_SCALE = 2;

    /**
     * 加
     * @param x
     * @param y
     * @returns {number}
     * @alias module:_.numAdd
     */
    _.numAdd = function (x, y) {
        var result = Number(x) + Number(y);
        return result;
    };

    /**
     * 减
     * @param x
     * @param y
     * @returns {number}
     * @alias module:_.numSubtract
     */
    _.numSubtract = function (x, y) {
        var result = Number(x) - Number(y);
        return result;
    };

    /**
     * 乘
     * @param x
     * @param y
     * @returns {number}
     * @alias module:_.numMultiply
     */
    _.numMultiply = function (x, y) {
        var result = Number(x) * Number(y);
        return result;
    };

    /**
     * 除
     * @param x
     * @param y
     * @returns {number}
     * @alias module:_.numDivide
     */
    _.numDivide = function (x, y) {
        var result = Number(x) / Number(y);
        return result;
    };

    /**
     * 固定小数位数
     * @param x
     * @param digits
     * @returns {string|*}
     * @alias module:_.toFixed
     */
    _.toFixed = function (x, digits) {
        if (typeof (x) == "undefined" || x === '') {
            return '';
        } else if (!_.isNumeric(x)) {
            return x;
        }
        digits = digits || this.DEFAULT_SCALE;
        x = (x + '').replace("E", "e");
        if ((x + '').indexOf('e') != -1) {
            return (+(Math.round(+(x)) + 'e' + -digits)).toFixed(digits);
        }
        return (+(Math.round(+(x + 'e' + digits)) + 'e' + -digits)).toFixed(digits);
    };

    /**
     * 移除数值指数表示
     * @param x
     * @returns {string}
     * @alias module:_.toFixed
     */
    _.removeExponent = function (x) {
        if (Math.abs(x) < 1.0) {
            var e = parseInt(x.toString().split('e-')[1]);
            if (e) {
                x *= Math.pow(10, e - 1);
                x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
            }
        } else {
            var e = parseInt(x.toString().split('+')[1]);
            if (e > 20) {
                e -= 20;
                x /= Math.pow(10, e);
                x += (new Array(e + 1)).join('0');
            }
        }
        return x;
    };

    /**
     * 判断两个小数数值是否相等
     * 示例：
     * equal(0.1+0.2, 0.3) 结果：true
     * @param x
     * @param y
     * @returns {boolean}
     * @alias module:_.numEqual
     */
    _.numEqual = function (x, y) {
        return Math.abs(x - y) < this.EPSILON;
    };

    /**
     * 比较两数大小，x>y返回1，x==y返回0，否则返回-1
     * @param x
     * @param y
     * @returns {number}
     * @alias module:_.numCompare
     */
    _.numCompare = function (x, y) {
        if (!_.isNumeric(x) || !_.isNumeric(y)) {
            throw "Parameter is not a number!";
        }
        if (_.numEqual(x, y)) return 0;
        else if (x > y) return 1;
        else return -1;
    };

    //这里继续扩展函数
    //示例:_.a1=function(){};

    /**
     * 允许自己的实用程序函数扩展jPublic。传递一个 {name: function}定义的哈希添加到jPublic对象，以及面向对象封装。
     * @param obj
     * @returns {_}
     * @alias module:_.extend
     */
    _.extend = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return chainResult(this, func.apply(_, args));
            };
        });
        return _;
    };
    _.extend(_);
}());
