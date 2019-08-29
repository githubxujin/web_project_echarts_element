//http://momentjs.cn/docs/
import moment from 'moment';
//设定moment区域为中国
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

/**日期格式相关的处理 */
export default class datetimeUtils {
    constructor() {}
    static stringToDate(dateStr) {
        return moment(dateStr).toDate();
    }
    static pad2(n) {
        return n < 10 ? '0' + n : n;
    }
    /**
     * 获取前N天的日期
     * @param days 时间间隔天数
     * @returns {string}
     */
    static getPreDate(days) {
        return moment()
            .subtract(days, 'days')
            .toDate();
    }
    /**
     * 获取当前时间后N天的日期
     * @param days 时间间隔天数
     * @returns {Date}
     */
    static getNextDate(days) {
        return moment()
            .add(days, 'days')
            .toDate();
    }
    /**
     * 获取特定日期后N天的日期
     * @param days 时间间隔天数
     * @returns {Date}
     */
    static getDateNextDate(d, days) {
        return moment(d)
            .add(days, 'days')
            .toDate();
    }
    /**
     * 获取当前日期前n个月
     * @returns {Date}
     */
    static getBeforeMonth(val) {
        return moment()
            .subtract(val, 'M')
            .toDate();
    }
    /**
     * 获取指定日期前n个月
     * @param {*} d
     * @param {*} val
     */
    static getBeforeMonthByDate(d, val) {
        return moment(d)
            .subtract(val, 'M')
            .toDate();
    }
    /**
     * 获取指定日期后n个月
     * @param {*} d
     * @param {*} val
     */
    static getAfterMonthByDate(d, val) {
        return moment(d)
            .add(val, 'M')
            .toDate();
    }
    /**
     * 获取特定日期，特定格式的日期  yyyy,mm,dd
     * @returns {string}
     */
    static getSpecialDay(date, seperator = '-') {
        if (!date) {
            return '';
        }
        let d = moment(date).format(
            'YYYY' + seperator + 'MM' + seperator + 'DD'
        );
        console.log('date :', date, d);
        return moment(date).format(
            'YYYY' + seperator + 'MM' + seperator + 'DD'
        );
    }

    /**
     * 获取时间  yyyy-mm-dd hh:mm:ss  日期转字符串
     * @returns {string}
     */
    static getformatDateTime(d, seperator) {
        return moment(d).format(
            'YYYY' + seperator + 'MM' + seperator + 'DD' + ' HH:mm:ss'
        );
    }
    /**
     * 获取当前时分秒
     */
    static getCurShortTime() {
        return moment().format('HH:mm:ss');
    }

    /**
     * 获取当前年月日
     */
    static getCurYmdTime() {
        return moment().format('YYYY-MM-DD');
    }
    /**
     * 获取几天前，拼接 yyyy-mm-dd hh:mm:ss
     * todo 用于界面日期时间选择规则-结束时间
     */
    static getTodayCurBeforeEndDate(i) {
        const date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * i);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month > 9 ? month : '0' + month;
        let day = date.getDate();
        day = day > 9 ? day : '0' + day;
        // let hour = date.getHours();
        // hour = hour > 9 ? hour : '0' + hour;
        // let minute = date.getMinutes();
        // minute = minute > 9 ? minute : '0' + minute;
        // let second = date.getSeconds();
        // second = second > 9 ? second : '0' + second;
        return year + '-' + month + '-' + day + ` 00:00:00`;
    }

    //时间格式转换
    static GMTToStr(time) {
        let date = new Date(time);
        let Str =
            date.getFullYear() +
            '-' +
            (date.getMonth() + 1) +
            '-' +
            date.getDate() +
            ' ' +
            date.getHours() +
            ':' +
            date.getMinutes() +
            ':' +
            date.getSeconds();
        return Str;
    }
    static GMTToStrRorType(time, type) {
        let date = new Date(time);
        let Str = '';
        if (type == 'year') {
            Str = date.getFullYear() + '年';
        } else if (type == 'month') {
            Str = date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
        } else if (type == 'day') {
            Str =
                date.getFullYear() +
                '年' +
                (date.getMonth() + 1) +
                '月' +
                date.getDate() +
                '日';
        } else {
            Str =
                date.getFullYear() +
                '-' +
                (date.getMonth() + 1) +
                '-' +
                date.getDate() +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes() +
                ':' +
                date.getSeconds();
        }
        return Str;
    }
    //获取指定日期有多少天
    static getMonthLength(d) {
        // 将日期设置为下月一号
        d.setMonth(d.getMonth() + 1);
        d.setDate('1');
        // 获取本月最后一天
        d.setDate(d.getDate() - 1);
        return d.getDate();
    }
    /**
     * 获取指定日期当月所有的星期
     * @param {*} d
     * @param {*} days
     */
    static getMonthWeek(d, days) {
        let year = d.getFullYear();
        let month = d.getMonth();
        let weeks = [];
        for (var i = 1; i <= days; i++) {
            weeks.push(datetimeUtils.getWeek(year, month, i));
        }
        return weeks;
    }
    /**
     * 根据日期获取星期
     * @param {*} y ：年
     * @param {*} m ：月
     * @param {*} d ：日
     */
    static getWeek(y, m, d) {
        var myDate = new Date();
        myDate.setFullYear(y, m, d);
        var week = myDate.getDay();
        switch (week) {
            case 0:
                return '周日';
            case 1:
                return '周一';
            case 2:
                return '周二';
            case 3:
                return '周三';
            case 4:
                return '周四';
            case 5:
                return '周五';
            case 6:
                return '周六';
        }
    }
    //获取当前年月
    static getCurYearMonth() {
        return moment().format('YYYY-MM');
    }
    //获取当前年月日
    static getCurYearMonthDay() {
        return moment().format('YYYY-MM-DD');
    }
    /**
     * 获取指定日期年月
     * @param {*} d
     * return {String}
     */
    static getYearMonthByDate(d) {
        return moment(d).format('YYYY-MM');
    }
    //获取指定日期当月最后一天
    static getDateMonthLastDay(d) {
        return moment(d)
            .endOf('month')
            .toDate();
    }
    //获取指定多少天内
    static WithinTheSpecifiedDate(startTime, endTime, day) {
        let gap = endTime.getTime() - startTime.getTime();
        let time = 86400 * 1000 * day;
        if (gap > time) {
            return false;
        } else {
            return true;
        }
    }
}
