// 此文件用于存储全局公用配置
export default class BaseConfig {
    constructor() {}
    static webSocketPrefix = 'ws://192.168.1.152'; //websocket 地址 192.168.1.152 42.159.154.44
    static P_TITLE = '红星美凯龙智能设备设施管理平台'; //项目名称
    static ADMIN_TITLE = '智能设备设施管理平台'; //后台显示的项目名称
    //验证提示
    static validate = {
        //密码
        pwd: {
            min: 5,
            max: 16,
            message: '长度在5到16个字符',
            trigger: 'blur'
        }
    };
    //loading对象实体
    static loading = {
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(240,248,255, 0.5)'
    };
    // 请求ip+port地址
    static BASE_IP = process.env.BASE_IP;
    static messageDuration = 2000;
    static imgLimitSize = 10; //限制上传图片文件大小，单位M
}
