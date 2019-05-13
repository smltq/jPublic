(function () {
    var _ = typeof require == 'function' ? require('..') : window._;
    QUnit.module('demo');

    QUnit.test('字符串空判断：isNullOrEmpty', function (assert) {
        function empty(str) {
            if (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g, "") === "") {
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
        assert.ok(notEmpty("   "), "非空字符串判断正确");
        assert.ok(notEmpty(student.skill), "非空字符串判断正确");
        assert.ok(notEmpty(null), "非空字符串判断正确");
        assert.ok(notEmpty('undefined'), "非空字符串判断正确");
    });
}());