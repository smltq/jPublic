(function () {
    var _ = typeof require == 'function' ? require('..') : window._;
    QUnit.module('demo');

    QUnit.test('字符串空判断：isNullOrEmpty', function (assert) {
        function empty(str) {
            if (str == 'undefined' || !str || !/[^\s]/.test(str)) {
                return true;
            } else {
                return false;
            }
        }

        function notEmpty(str) {
            if (!str) {
                return true;
            }
            return false;
        }

        var student = {className: "测试班", name: "我是张三", age: 18};
        assert.ok(empty("   "), "空字符串判断正确");
        assert.ok(empty(' '), "空字符串判断正确");
        assert.ok(empty(student.skill), "空字符串判断正确");
        assert.ok(empty(undefined), "空字符串判断正确");
        assert.ok(empty(null), "空字符串判断正确");
        assert.ok(empty(""), "空字符串判断正确");
        assert.ok(empty(''), "空字符串判断正确");
        assert.ok(empty('undefined'), "空字符串判断正确");

        // assert.ok(!notEmpty("   "), "非空字符串判断正确");
        // assert.ok(notEmpty(student.skill), "非空字符串判断正确");
        // assert.ok(notEmpty(null), "非空字符串判断正确");
        // assert.ok(!notEmpty('undefined'), "非空字符串判断正确");



    });
}());