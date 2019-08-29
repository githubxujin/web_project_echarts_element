/**
 * 挂载到Vue上面的公共方法
 */
import Vue from 'vue';
import store from '../store/index';
import MIME_TYPE_LIST from '@/enum/MIME_TYPE_LIST';
import { generateToken } from '@/services/system-settings';
/**原型扩展 */
Array.prototype.indexOf = function(val) {
    //prototype 给数组添加属性
    for (var i = 0; i < this.length; i++) {
        //this是指向数组，this.length指的数组类元素的数量
        if (this[i] == val) return i; //数组中元素等于传入的参数，i是下标，如果存在，就将i返回
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    // console.log('remove', val, index);
    if (index > -1) {
        this.splice(index, 1);
    }
};
// 声明----如果有此 contains 直接用最好
Array.prototype.contains = function(needle) {
    for (var i in this) {
        if (this[i] === needle) return true;
    }
    return false;
};
// 移除字符串两边的空格
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};
/**
 * 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
 **/
String.prototype.isNumber = function() {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(this) || regNeg.test(this)) {
        return true;
    } else {
        return false;
    }
};
export default class common extends Vue {
    static first = null;
    static guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0)
                .toString(16)
                .substring(1);
        }
        return (
            S4() +
            S4() +
            '-' +
            S4() +
            '-' +
            S4() +
            '-' +
            S4() +
            '-' +
            S4() +
            S4() +
            S4()
        );
    }
    /**
     * 弹窗操作成功后的回调
     * @param {*} vm vue对象
     * @param {*} msg 提示信息
     * @param {*} closeWin 关闭弹窗方法
     */
    static winCallBack(vm, msg, closeWin) {
        vm.$message({
            message: msg,
            type: 'success',
            duration: vm.$baseConfig.messageDuration
        });
        if (closeWin) {
            closeWin();
        }
        if (vm.getItemList) {
            vm.getItemList();
        }
    }
    /**
     * 跳转到门店首页
     * @param {*} vm vue对象
     * @param {*} shopNumber 门店编码
     */
    static jumpShopIndex(vm, shopNumber, referer, id) {
        // debugger;
        let userName = vm.$store.getters.getUserInfo.userName;
        let ipAddressInfo = vm.$store.getters.getShopAddressInfo;
        console.log('jumpShopIndex :', userName, ipAddressInfo, shopNumber);
        var ip = ''; //IP地址
        if (ipAddressInfo) {
            ip = ipAddressInfo[shopNumber]
                ? ipAddressInfo[shopNumber].shopIp
                : '';
            console.log('ip :', ip);
        }
        if (!ip) {
            vm.$message({
                message: '该门店编码找不到IP地址',
                type: 'error',
                duration: vm.$baseConfig.messageDuration
            });
            return;
        }
        // return;
        generateToken()
            .then(res => {
                if (!res.data.token) return Promise.reject(res);
                let url = `http://${ip}/auto-login?token=${
                    res.data.token
                }&userName=${userName}`;
                if (referer) {
                    url = `http://${ip}/auto-login?token=${
                        res.data.token
                    }&userName=${userName}&referer=${referer}`;
                }
                if (id) {
                    url = `http://${ip}/auto-login?token=${
                        res.data.token
                    }&userName=${userName}&referer=${referer}&id=${id}`;
                }
                window.open(url, '_self');
            })
            .catch(_ => {
                console.error('获取凭证失败', _);
            });
    }
    /**
     * 初始化table的滚动高度
     * @param {*} h 需要减去的高度,210是顶部导航+面包屑导航+底部分页的高度
     * @param {*} top 当没有设置table的offsetTop时，需要减去的顶部容器高度
     */
    static initTableHeight(vm, h = 210, top = 80) {
        let self = vm;
        vm.$nextTick(function() {
            self.tableHeight = common.calcTableHeaight(vm, h, top);
            // 监听窗口大小变化
            window.onresize = function() {
                self.tableHeight = common.calcTableHeaight(vm, h, top);
            };
        });
    }
    //计算表格高度
    static calcTableHeaight(vm, h, top) {
        let self = vm;
        let offsetTop =
            self.$refs.table &&
            self.$refs.table.$el &&
            self.$refs.table.$el.offsetTop
                ? self.$refs.table.$el.offsetTop
                : top;
        let tableHeight = window.innerHeight - offsetTop - h;
        // console.log('offsetTop', offsetTop, 'tableHeight :', tableHeight);
        return tableHeight;
    }
    /**
     * 初始化Charts的滚动高度
     * @param {*} h 需要减去的高度
     * @param {*} d 父容器高度
     */
    static initChartHeight(vm, h = 60, d = 0) {
        vm.$nextTick(function() {
            // 监听窗口大小变化
            let self = vm;
            let offsetTop =
                self.$refs.chartsDiv && self.$refs.chartsDiv.offsetHeight
                    ? self.$refs.chartsDiv.offsetHeight
                    : d;
            let chartHeight = offsetTop - h;
            self.chartHeight = chartHeight + 'px';
            window.onresize = function() {
                self.chartHeight = chartHeight + 'px';
            };
        });
    }
    /**
     * 更新Loading状态
     * @param  status
     */
    static updateLoadingStatus(status) {
        store.commit('base/updatePageLoadingStatus', status); //页面启用loading标识
        store.commit('base/updateLoadingStatus', { isLoading: status });
    }
    /**
     * 防抖函数
     * @param {
     *  function
     * }
     * @returns {
     *  function
     * }
     */
    static debounce(method, delay = 400) {
        let timer = null;
        return function() {
            const self = this;
            const args = arguments;
            timer && clearTimeout(timer);
            timer = setTimeout(function() {
                method.apply(self, args);
            }, delay);
        };
    }
    //节流函数
    static throttle(method, context) {
        clearTimeout(method.tId);
        return function() {
            method.tId = setTimeout(function() {
                method.call(context);
            }, 300);
        };
    }
    static getType(val) {
        if (val === null) return 'Null';
        if (val === undefined) return 'Undefined'; // IE9兼容
        let type = Object.prototype.toString.call(val);
        type = type.substring(8, type.length - 1);
        return type;
    }
    /**
     * 获取文件类型MIME_TYPE
     */
    static getMimeTypeList(extList = []) {
        let acceptList = [];
        const type = common.getType(extList);
        if (!['String', 'Array'].includes(type)) return acceptList;
        if (type === 'String') {
            extList = extList ? extList.split(',') : [];
        }
        extList.forEach(item => {
            if (MIME_TYPE_LIST[item]) acceptList.push(MIME_TYPE_LIST[item]);
        });
        return acceptList;
    }
    //消息提示,防止重复提示的
    static message(params) {
        console.log('message :', common.first);
        if (common.first == null) {
            this.$message(params);
            common.first = new Date().getTime(); // 记录第一次按下回退键的时间
            setTimeout(function() {
                // 2s中后清除
                common.first = null;
            }, 2000);
        } else {
            if (new Date().getTime() - common.first > 2000) {
                // 如果两次按下的时间小于2s，
                common.first = null;
            }
        }
    }
}
