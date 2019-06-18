(function () {
    var _ = typeof require == 'function' ? require('..') : window._;
    var templateSettings;

    QUnit.module('utility', {

        beforeEach: function () {
            templateSettings = _.clone(_.templateSettings);
        },

        afterEach: function () {
            _.templateSettings = templateSettings;
        }
    });

    QUnit.test('获取随机数：getRandom', function (assert) {
        var array = _.range(1000);
        var min = Math.pow(2, 31);
        var max = Math.pow(2, 62);
        assert.ok(_.every(array, function () {
            return _.getRandom(min, max) >= min;
        }), '是否应该产生一个大于或等于最小值的随机数');

        assert.ok(_.some(array, function () {
            return _.getRandom(Number.MAX_VALUE) > 0;
        }), '当传递“Number.MAX_VALUE”时，应该生成一个随机数');
    });

    QUnit.test('字节格式化：formatBytes', function (assert) {
        assert.ok(_.formatBytes(1024) == '1 KB', '1KB转换正确');
        assert.ok(_.formatBytes('1024') == '1 KB', '1KB转换正确');
        assert.ok(_.formatBytes(1234) == '1.21 KB', '1.21KB转换正确');
        assert.ok(_.formatBytes(1234, 3) == '1.205 KB', '1.205KB转换正确');
    });

    QUnit.test('比较两个数值的大小：numCompare', function (assert) {
        assert.ok(_.numCompare(3, 5) == -1, '3<5,判断正确');
        assert.throws(function () {
            _.numCompare('ab', 3)
        }, 'ab与3是不同类型无法判断');
        assert.ok(_.numCompare(3, 3) == 0, '3>3，两个数值相等,判断错误');
        assert.ok(_.numCompare(0.1, 0.11) == -1, '0.1<0.11,判断正确');
        assert.ok(_.numCompare(-1, -2) == 1, '-1>-2,判断正确');
        assert.ok(_.numCompare(0, -1) == 1, '0>-1,判断正确');
    });

    QUnit.test('去左空格：ltrim', function (assert) {
        assert.ok(_.ltrim('    abcdegfg', ' ') == 'abcdegfg', '    abcdegfg去除左空格成功');
        assert.ok(_.ltrim('  dff  fad', ' ') == 'dff  fad', '  dff  fad去除左空格成功');
        assert.ok(_.ltrim('dff  fad', ' ') == 'dff  fad', 'dff  fad去除左空格成功');
        assert.ok(_.ltrim('_ad', ' ') == '_ad', '_ad不含左空格');
    });

    QUnit.test('去右空格：rtrim', function (assert) {
        assert.ok(_.rtrim('abcdegfg     ', ' ') == 'abcdegfg', 'abcdegfg     去除右空格成功');
        assert.ok(_.rtrim('abcd  egfg     ', ' ') == 'abcd  egfg', 'abcd  egfg     去除右空格成功');
        assert.ok(_.rtrim('abcd  egfg', ' ') == 'abcd  egfg', 'abcd  egfg去除右空格成功');
        assert.ok(_.rtrim('ab——', ' ') == 'ab——', 'ab——不含右空格');
    });

    QUnit.test('判断是否为数组:_.isArray', function (assert) {
        //assert.ok(_.isArray([{1:2},{1:3}]) == true,'[{1:2},{1:3}]是数组');
        assert.ok(_.isArray([1, 2, 3]) == true, '[1,2,3]是数组');
        assert.ok(_.isArray([[1], [3]]) == true, '[[1],[3]]是数组');
        assert.ok(_.isArray([1]) == true, '[1]是数组');
        assert.ok(_.isArray([1], [2]) == true, '[1],[2]是数组');
        assert.ok(_.isArray({1: 2}) == false, '{1:2}不是数组');
        //assert.ok(_.isArray(a) == false,'a不是数组');
        assert.ok(_.isArray('a') == false, '字母a不是数组');
        assert.ok(_.isArray("a") == false, '"a"不是数组');
        assert.ok(_.isArray(123) == false, '123不是数组');
        assert.ok(_.isArray(null) == false, 'null不是数组');
        assert.ok(_.isArray(true) == false, 'true不是数组');
        assert.ok(_.isArray(undefined) == false, 'undefinded不是数组');
        //assert.ok(_.isArray(['a','b','c']) == true,'['a','b','c']是数组.');
    });

    QUnit.test('判断是否为数值： _.isNumeric', function (assert) {
        var obj = [123, 0123, "123", 0, 123.12, +123, -123, "-12", [1], [1, 2], 0xFF, "0xFF", 8e5, "8e5", "a", ["a"], {11: 2}, null, true];
        for (var i = 0; i < obj.length; i++) {
            var result = _.isNumeric(obj[i]);
            if (result)
                assert.ok(result, obj[i] + '是数值');
            else {
                assert.notOk(result, obj[i] + '不是数值');
            }
        }
    });

    QUnit.test('阿拉伯数字转中文数字： _.cl', function (assert) {
        //十口语化
        assert.ok(_.cl("100111", {tenMin: true}) == "十万零一百一十一");
        //非口语化
        assert.ok(_.cl("100111") == "一十万零一百一十一");
        //带小数点
        assert.ok(_.cl("13.5", {tenMin: true}) == "十三点五");
        //超大数
        assert.ok(_.cl(1e16) == "一亿亿");
    });

    QUnit.test('固定获取月份第一天：_.firstDay', function (assert) {
        assert.ok(_.dateFormat(_.firstDay(new Date('2019-05-09 06:20:30'))) == '2019-05-01 00:00:00', '2019年5月的第一天是2019-05-01');
    });

    QUnit.test('固定获取月份最后一天：_.firstDay', function (assert) {
        assert.ok(_.dateFormat(_.lastDay(new Date('2019-11-1 06:20:30'))) == '2019-11-30 00:00:00', '2019年11月的最后一天是2019-11-30');
        assert.ok(_.dateFormat(_.lastDay(new Date('2019-12-1 06:20:30'))) == '2019-12-31 00:00:00', '2019年12月的最后一天是2019-12-31');
        assert.ok(_.dateFormat(_.lastDay(new Date('2019-2-3 06:20:30'))) == '2019-02-28 00:00:00', '2019年2月的最后一天是2019-02-28');
    });

    QUnit.test('获取随机日期：_.getRandomDate', function (assert) {
        assert.ok(_.dateFormat(_.getRandomDate()), '随机日期' + _.dateFormat(_.getRandomDate()));
    });

    QUnit.test('随机获取月份第一天：_.firstDay', function (assert) {
        var a = new Date()
        for(var i = 0 ; i < 5; i++)
        {
            a = _.getRandomDate();
            assert.ok(_.dateFormat(_.firstDay(a)), _.dateFormat(a) + '的第一天是' + _.dateFormat(_.firstDay(a)));
        }       
    });

    QUnit.test('随机获取月份最后一天：_.lastDay', function (assert) {
        var a = new Date();
        for(var i = 0; i < 5; i++)
        {
            a = _.getRandomDate();
            assert.ok(_.dateFormat(_.lastDay(a)), _.dateFormat(a) + '的最后一天是' + _.dateFormat(_.lastDay(a)));
        }
    });

    QUnit.test('数组差集:_.difference', function (assert) {
        assert.ok(_.equals(_.difference([1, 2], [1, 2]), []), '[1, 2], [1, 2]的差集是[]');
        assert.ok(_.equals(_.difference([1, 2, 3], [1, 2]), [3]), '[1, 2, 3], [1, 2]的差集是[3]');
        assert.ok(_.equals(_.difference([1, 2, 3], [4, 5, 6]), [1, 2, 3]), '[1, 2, 3], [4, 5, 6]的差集是[1, 2, 3]');
        //assert.ok(_.equals(_.difference([[1], [2]], [[1]]), [[2]]), 'pass');
        assert.ok(_.equals(_.difference(['a', 'b'], ['a']), ['b']), 'pass');
        assert.ok(_.equals(_.difference(["a", 'b'], ['b']), ['a']), 'pass');
        //assert.ok(_.equals(_.difference([{11: 2}], [{4: 5}]), [{11: 2}]), 'pass');
    });

    QUnit.test('数组元素是否重复:_.isRepeat',function(assert){
        assert.ok(_.isRepeat([1,2,3]) == false,'数组[1,2,3]没有重复元素');
        assert.ok(_.isRepeat([1,2,3,3]),'数组[1,2,3,3]有重复元素');
        assert.ok(_.isRepeat([1,2,3.2,3]) == false,'数组[1,2,3.2,3]没有重复元素');
        assert.ok(_.isRepeat([-1,1]) == false,'数组[-1,1]没有重复元素');
        assert.ok(_.isRepeat(['a','A']) == false,'数组[\'a\',\'A\']没有重复元素');
        assert.ok(_.isRepeat([0,0,0,1]),'数组[0,0,0,1]有重复元素');
    });

    QUnit.test('获得本周的开始日期和结束日期：_.getWeekStartDate/_.getWeekEndDate',function(assert){
        assert.ok(_.dateFormat(_.getWeekStartDate()),'本周的开始日期是'+_.dateFormat(_.getWeekStartDate()));
        assert.ok(_.dateFormat(_.getWeekEndDate()),'本周的开始日期是'+_.dateFormat(_.getWeekEndDate()));
    });

    QUnit.test('返回日期的yyyy-MM-dd格式:_.shortDateFormat',function(assert){
        assert.ok(_.now(),_.now());
        assert.throws(function(){
            _.shortDateFormat(new Date('adcvb'))
        },'abcvb的日期格式不正确');
        assert.throws(function(){
            _.shortDateFormat(new Date(-100000000000))
        },'-100000000000的日期格式不正确');
        assert.ok(_.shortDateFormat(new Date(2016,4,5,17,55,55)),'2016,4,5,17,55,55的简洁日期为'+_.shortDateFormat(new Date(2016,4,5,17,55,55)));
        assert.ok(_.shortDateFormat(new Date(2016,1,33,17,55,55)),'2016,1,33,17,55,55的简洁日期为'+_.shortDateFormat(new Date(2016,1,33,17,55,55)));
        assert.ok(_.shortDateFormat(new Date(2016,4,5,17,55)),'2016,4,5,17,55的简洁日期为'+_.shortDateFormat(new Date(2016,4,5,17,55)));
        assert.ok(_.shortDateFormat(new Date(2016,4,5,17)),'2016,4,5,17的简洁日期为'+_.shortDateFormat(new Date(2016,4,5,17)));
        assert.ok(_.shortDateFormat(new Date(2016,4,5)),'2016,4,5的简洁日期为'+_.shortDateFormat(new Date(2016,4,5)));
        assert.ok(_.shortDateFormat(new Date(2016,4)),'2016,4的简洁日期为'+_.shortDateFormat(new Date(2016,4)));
        assert.ok(_.shortDateFormat(new Date(2016)),'2016的简洁日期为'+_.shortDateFormat(new Date(2016)));
        assert.ok(_.shortDateFormat(new Date(99,4,5)),'99,4,5的简洁日期为'+_.shortDateFormat(new Date(99,4,5)));
        assert.ok(_.shortDateFormat(new Date("October 13, 2014 11:13:00")),'"October 13, 2014 11:13:00"的简洁日期为'+_.shortDateFormat(new Date("October 13, 2014 11:13:00")));
        assert.ok(_.shortDateFormat(new Date(100000000000)),'100000000000的简洁日期为'+_.shortDateFormat(new Date(100000000000)));
    });

    QUnit.test('将时间格式化为指定格式的String的相互转换:_.formatTime，_.unformatTime',function(assert){
        //try{
        assert.ok(_.formatTime(96420),'96420秒的指定string格式为'+_.formatTime(96420));
        assert.ok(_.formatTime(0),'0秒的指定string格式为'+_.formatTime(0));
        //assert.ok(_.formatTime(-20),'0秒的指定string格式为'+_.formatTime(-20));
        assert.throws(function(){
            _.formatTime(-20)
        },'-20时间错误');
        for(var i = 0 ; i<5 ; i++)
            {
                var a = _.getRandom(0,86400);
                assert.ok(_.formatTime(a),a+'秒的指定string格式为'+_.formatTime(a));
                assert.ok(_.unformatTime(_.formatTime(a)),_.formatTime(a)+'的秒格式为'+_.unformatTime(_.formatTime(a)));
            }
        //}catch(error){
            //alert('时间错误');
        //};             
    });

    QUnit.test('洗牌数组： _.shuffle',function(assert){
        assert.ok(_.shuffle([1,2,3,4,5]),'[1,2,3,4,5]洗牌后的数组'+_.shuffle([1,2,3,4,5]));
        assert.ok(_.shuffle([1]),'[1]洗牌后的数组'+_.shuffle([1]));
        assert.ok(_.shuffle(['a','b','c','d']),'[\'a\',\'b\',\'c\',\'d\']洗牌后的数组'+_.shuffle(['a','b','c','d']));
        assert.ok(_.shuffle([2,'a','b','c','d',1,3]),'[2,\'a\',\'b\',\'c\',\'d\'1,3]洗牌后的数组'+_.shuffle([2,'a','b','c','d',1,3]));
    });

    QUnit.test('数组去重：_.unique ',function(assert){
        assert.ok(_.unique([1, 2, 3, 5, 5]),'[1, 2, 3, 5, 5]数组去重后['+_.unique([1, 2, 3, 5, 5])+']');
        assert.ok(_.unique([1, 1,1,1,1]),'[1, 1,1,1,1]数组去重后'+_.unique([1, 1,1,1,1]));
        assert.ok(_.unique([1, -1,0,-0]),'[1,-1,0,-0]数组去重后'+_.unique([1,-1,0,-0]));
        assert.ok(_.unique([1, 1, 'a', 'A']),'[1, 1, \'a\', \'A\']数组去重后'+_.unique([1, 1, 'a', 'A']));
        assert.ok(_.unique(['abcd', 'ab']),'[\'abcd\', \'ab\']数组去重后'+_.unique(['abcd', 'ab']));
    });

    QUnit.test('数组严格比较：_.equals',function(assert){
        var arr1 = [1, 2, 3, 4];
        var arr2 = [2, 1, 4, 3];
        var arr3 = [2, 2, 3, 4];
        var arr4 = [1, 2, 3, 4];
        var arr5 = [1,2];
        assert.ok(_.equals(arr1,arr2) == false,'数组[1, 2, 3, 4]和数组 [2, 1, 4, 3]不是严格相等');
        assert.ok(_.equals(arr1,arr2,false),'不严格比较数组[1, 2, 3, 4]和数组 [2, 1, 4, 3]是相等的');
        assert.ok(_.equals(arr1,arr5) == false,'数组[1, 2, 3, 4]和数组 [1,2]不是严格相等');
        assert.ok(_.equals(arr1,arr3) == false,'数组[1, 2, 3, 4]和数组 [2, 2, 3, 4]不是严格相等');
        assert.ok(_.equals(arr1,arr4),'数组[1, 2, 3, 4]和数组 [[1, 2, 3, 4]是严格相等');
    });

/**
 * QUnit.test('获取当前服务器时间：_.serverTime',function(assert){
        assert.ok(_.dateFormat(_.serverTime()),'服务器当前时间为'+_.dateFormat(_.serverTime()));
    });
 */

}());
