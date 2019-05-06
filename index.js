// 加法函数
function add(x) {
    return function (y) {
        return x + y;
    }
}

// 乘法函数
function multi(x) {
    return function (y) {
        return x * y;
    }
}