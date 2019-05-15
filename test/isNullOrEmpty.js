(function () {
    var _ = typeof require == 'function' ? require('..') : window._;
    QUnit.module('String');

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
        // assert.ok(empty1(student.skill), "empty1空字符串判断正确");
        // assert.ok(empty1(undefined), "empty1空字符串判断正确");
        // assert.ok(empty1(null), "empty1空字符串判断正确");
        // assert.ok(empty1(""), "empty1空字符串判断正确");
        // assert.ok(empty1(''), "empty1空字符串判断正确");
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

        //console.log(_.extendOwn({name: "xlshen"}, {name: "XXX", age: 20}));
    });
}());