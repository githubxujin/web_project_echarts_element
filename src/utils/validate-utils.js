/**
 * 格式验证
 */
import Regexps from '@/utils/regexp.js';
import Utils from './utils';
// 密码
export function validatePwd(rule, value, callback) {
    if (!Utils.notEmpty(value)) {
        callback(new Error('请输入密码'));
    } else if (value.indexOf(' ') > -1) {
        callback(new Error('密码不能存在空格'));
    } else if (Regexps.chinese.test(value)) {
        callback(new Error('密码中不能存在汉字'));
    }
    callback();
}
export function validatePass(rule, value, callback) {
    if (!Utils.notEmpty(value)) {
        callback(new Error('请输入密码'));
    } else if (Regexps.chinese.test(value)) {
        callback(new Error('密码中不能存在汉字'));
    }
    callback();
}
// 确认密码
export function validatePwdCheck(rule, value, callback, oldPwd) {
    if (!Utils.notEmpty(value)) {
        return callback(new Error('请输入确认密码'));
    } else if (value.indexOf(' ') > -1) {
        return callback(new Error('密码不能存在空格'));
    } else if (value != oldPwd) {
        return callback(new Error('两次输入密码不一致!'));
    } else {
        return callback();
    }
}
// 登录名校验
export function validateUserName(rule, value, callback) {
    if (!Utils.notEmpty(value)) return callback();
    const pattern = /\s/;
    if (pattern.test(value)) {
        return callback(new Error('不能有空格'));
    }
    const len = (value || '').length;
    if (len > 16 || len < 5) {
        return callback(new Error('长度5到16位'));
    }
    return callback();
}
// 用户名
export function validateRealName(rule, value, callback) {
    if (!Utils.notEmpty(value)) return callback();

    if (!Regexps.realName.test(value)) {
        return callback(new Error('长度10位以内(可包含中英文和·)'));
    }
    const len = (value || '').length;
    if (len > 10 || len < 2) {
        return callback(new Error('长度2到10位'));
    }
    return callback();
}
// 手机
export function isPhone(rule, value, callback) {
    if (!Utils.notEmpty(value)) return callback();
    let patter = Regexps.mobile;
    if (!patter.test(value)) {
        return callback(new Error('请输入正确的手机号格式'));
    } else {
        return callback();
    }
}
// 联系方式（包含手机和固定电话）
export function validateTel(rule, value, callback) {
    if (!Utils.notEmpty(value)) return callback();
    if (Regexps.telephone.test(value)) return callback();
    return callback(new Error('请输入正确的手机号/固号'));
}

// 经纬度校验
export function validatelonlat(rule, value, callback) {
    if (!Utils.notEmpty(value)) return callback();
    let arr = value.split(',');
    if (arr.length !== 2) return callback('经纬度格式不正确!');
    if (!Regexps.longitude.test(arr[0])) {
        return callback(new Error('经度整数部分为0-180,小数部分为0到6位!'));
    }
    if (!Regexps.latitude.test(arr[1])) {
        return callback(new Error('纬度整数部分为0-90,小数部分为0到6位!'));
    }
    return callback();
}
//正整数
export function validatePositiveNumber(rule, value, callback) {
    if (!Utils.notEmpty(value)) {
        return callback();
    }
    var rex = Regexps.positiveInteger; //正整数
    let result = rex.test(value);
    if (result) {
        return callback();
    } else {
        callback(new Error('请输入正整数'));
    }
}
//正整数-且小于某个值
export function validateNumberLess(rule, value, callback, otherVal) {
    if (!Utils.notEmpty(value)) {
        return callback();
    }
    var rex = Regexps.number; //数字
    let result = rex.test(value);
    if (result) {
        if (!Utils.notEmpty(otherVal)) {
            callback();
        }
        if (Math.abs(value) > 100000000) {
            return callback(new Error('范围不能超过1亿'));
        } else if (Number(value) > Number(otherVal)) {
            callback(new Error('最小值不能大于最大值'));
        } else {
            return callback();
        }
    } else {
        callback(new Error('请输入数字'));
    }
}
//正整数-且大于某个值
export function validateNumberGreater(rule, value, callback, otherVal) {
    if (!Utils.notEmpty(value)) {
        return callback();
    }
    var rex = Regexps.number; //数字
    let result = rex.test(value);
    if (result) {
        if (!Utils.notEmpty(otherVal)) {
            // callback(new Error('请输入最小值'));
            callback();
        }
        if (Math.abs(value) > 100000000) {
            return callback(new Error('范围不能超过1亿'));
        } else if (Number(value) < Number(otherVal)) {
            callback(new Error('最大值不能小于最小值'));
        } else {
            return callback();
        }
    } else {
        callback(new Error('请输入数字'));
    }
}
//整数、小数-小于1个亿
export function validateIntOrNumber(rule, value, callback) {
    if (!Utils.notEmpty(value)) {
        return callback();
    }
    var rex = Regexps.number;
    let result = rex.test(value);

    if (result) {
        if (Math.abs(value) > 100000000) {
            return callback(new Error('范围不能超过1亿'));
        }
        return callback();
    } else {
        return callback(new Error('请输入正确的数字'));
    }
}
//验证码
export function validateCode(rule, value, callback) {
    if (!Utils.notEmpty(value)) {
        return callback();
    }
    var rex = Regexps.integerNumber;
    let result = rex.test(value);
    if (result) {
        return callback();
    } else {
        return callback(new Error('请输入正确的格式'));
    }
}
//限制最大正整数
export function validateMaxInt(rule, value, callback, maxVal) {
    if (!Utils.notEmpty(value)) {
        return callback();
    }
    var rex = Regexps.positiveInteger; //正整数
    let result = rex.test(value);
    if (result) {
        if (value > maxVal) {
            return callback(new Error('最大值不能超过' + maxVal));
        }
        return callback();
    } else {
        return callback(new Error('请输入正整数'));
    }
}
export function validateCompare(rule, value, callback, otherVal) {
    if (!Utils.notEmpty(value)) {
        return callback(new Error('请输入非正常文本'));
    } else if (value.indexOf(' ') > -1) {
        return callback(new Error('非正常不能存在空格'));
    } else if (value == otherVal) {
        return callback(new Error('正常文本和非正常文本不能相同!'));
    } else {
        return checkChartLength(rule, value, callback, 8, '非正常文本');
    }
}
export function checkChartLength(rule, value, callback, length, name) {
    let len = GetLength(value);
    if (len > length) {
        //重点重点，下面就是填写提示的文字
        callback(
            new Error(
                name + '长度为' + length + '个字符，一个中文字等于2个字符。'
            )
        );
    } else {
        callback();
    }
}
//获取字符长度，一个中文字等于2个字符
function GetLength(str) {
    console.log('str :', str);
    var l = str.length;
    var blen = 0;
    for (let i = 0; i < l; i++) {
        if ((str.charCodeAt(i) & 0xff00) != 0) {
            blen++;
        }
        blen++;
    }
    return blen;
}
