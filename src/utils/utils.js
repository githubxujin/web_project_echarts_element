import BaseConfig from '@/base-config';
import moment from 'moment';
//设定moment区域为中国
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
/**
 * 按需引用的公共方法
 */
export default class Utils {
    constructor() {}
    /**
     * 深拷贝
     * @param obj
     * @returns {any}
     */
    static deepCopy(obj) {
        if (obj === null) return null;
        return JSON.parse(JSON.stringify(obj));
    }
    /**
     * 判断是否为空
     */
    static notEmpty(val) {
        if (val || val === 0) return true;
        return false;
    }
    /**
     * echarts坐标轴换行
     * @param {*} option  ：echarts 的options
     * @param {*} number ： 指定每隔多少个字符换行
     * @param {*} axis  ：xAxis or yAxis，表示是x轴还是y轴
     */
    static chartNewLine(option, number = 4, axis) {
        // debugger
        /* 此处注意你的json是数组还是对象 */
        let axisLabel = option[axis][0]['axisLabel'];
        option[axis][0]['axisLabel'] = {
            interval: axisLabel.interval || 0, //横轴信息全部显示
            rotate: axisLabel.rotate || 0, //45度角倾斜显示
            fontSize: axisLabel.fontSize || '12',
            // lineHeight: 30,
            // height: 60,
            textStyle: axisLabel.textStyle,
            symbol: axisLabel.symbol,
            rich: axisLabel.rich || {
                row: {
                    // color: 'red',
                    lineHeight: 16
                }
            },
            padding: [5, 5, 5, 6],
            //只保留2行，最后一行文字超出时，显示省略号
            formatter: function (params) {
                var res = '';
                var paramsNameNumber = params.length; //文字长度

                if (paramsNameNumber > number) {
                    var oneLineText = params.substring(0, number);
                    res = '{row|' + oneLineText + '}' + '\n';
                    var twoLineText = '';
                    if (paramsNameNumber > 2 * number) {
                        twoLineText = params.substr(number, number - 1) + '...';
                    } else {
                        twoLineText = params.substring(
                            number,
                            paramsNameNumber
                        );
                    }
                    res += '{row|' + twoLineText + '}';
                } else {
                    res = '{row|' + params + '}';
                }
                return res; //+ '\n';
            }
            // formatter: function(params) {
            //     var arr = [];
            //     var paramsNameNumber = params.length; //文字长度
            //     var rowNumber = Math.ceil(paramsNameNumber / number);
            //     if (paramsNameNumber > number) {
            //         for (var p = 0; p < rowNumber; p++) {
            //             var tempStr = '';
            //             var start = p * number;
            //             var end = start + number;
            //             if (p == rowNumber - 1) {
            //                 tempStr = params.substring(start, paramsNameNumber);
            //             } else {
            //                 tempStr = params.substring(start, end) + '\n';
            //             }
            //             arr.push('{row|' + tempStr + '}');
            //         }
            //     } else {
            //         arr.push('{row|' + params + '}');
            //     }
            //     console.log('结果2', arr.join('\n'));
            //     return arr.join('\n');
            // }
        };
        return option;
    }
    /**
     * 判断数组元素
     */
    static arrayContain(array, obj) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == obj) {
                // 如果要求数据类型也一致，这里可使用恒等号===
                return true;
            }
        }
        return false;
    }
    /**
     *
     * @param {*}
     * 下载文件方法
     */
    static downloadFile(downUrl = '/api/admin/file/downloadFile') {
        var downLoadIframe = document.querySelector('#downLoadIframe');
        if (!downLoadIframe) {
            downLoadIframe = document.createElement('iframe');
            downLoadIframe.setAttribute('id', 'downLoadIframe');
        }
        downLoadIframe.src = `http://${
            process.env.BASE_IP
        }${downUrl}?token=${localStorage.getItem('$token_info')}`;
        downLoadIframe.style.display = 'none';
        if (!document.querySelector('#downLoadIframe'))
            document.body.appendChild(downLoadIframe);
    }
    /**
     * 限制上传文件大小不能超过10M
     * @param {*} file
     */
    static beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < BaseConfig.imgLimitSize;
        if (!isLt2M) {
            this.$message({
                message: '上传文件大小不能超过 2MB!',
                type: 'warning'
            });
        }
        return isLt2M;
    }
    //禁用浏览器返回
    static fobidden_back() {
        window.history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            this.back_common;
        });
    }
    //启用浏览器返回
    static enable_back() {
        history.go(-1);
        window.removeEventListener('popstate', this.back_common);
    }
    //根据日期类型验证日期范围是否有效
    static validDate(timeType, start, end) {
        console.log('validDate :', timeType, start, end);
        let s = moment(start);
        let e = moment(end);
        let message = '';
        let d = e.diff(s, 'days') + 1;
        console.log(d)
        switch (timeType) {
            case 0: //时 7天
                if (d > 7) {
                    message = '最多可查询7天';
                }
                break;
            case 1: //日 90天
                if (d > 90) {
                    message = '最多可查询90天';
                }
                break;
            case 2: //月 36月
                let m = e.diff(s, 'months');
                if (m > 36) {
                    message = '最多可查询36个月';
                }

                break;
            case 3: //年  12年
                let y = e.diff(s, 'years');
                if (y > 12) {
                    message = '最多可查询12年';
                }
                break;
            default:
                break;
        }
        console.log('message :', message);
        return message;
    }
    back_common() {
        history.pushState(null, null, document.URL);
    }
}
