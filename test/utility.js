(function () {
    var _ = typeof require == 'function' ? require('..') : window._;
    var templateSettings;

    QUnit.module('Utility', {

        beforeEach: function () {
            templateSettings = _.clone(_.templateSettings);
        },

        afterEach: function () {
            _.templateSettings = templateSettings;
        }
    });

    QUnit.test('random', function (assert) {
        var array = _.getRandom(1000);
        var min = Math.pow(2, 31);
        var max = Math.pow(2, 62);
        assert.ok(_.every(array, function () {
            return _.getRandom(min, max) >= min;
        }), 'should produce a random number greater than or equal to the minimum number');

        assert.ok(_.some(array, function () {
            return _.getRandom(Number.MAX_VALUE) > 0;
        }), 'should produce a random number when passed `Number.MAX_VALUE`');
    });
}());
