//0-正常，1-拆分，2- 数据《=0，3-比上次数据小，4-超过限额，5-中断，默认中断
export const StatusArrays = {
    0: '正常',
    1: '拆分',
    2: '数据<=0',
    3: '比上次数据小',
    4: '超过限额',
    5: '中断'
};
//根据在线率获取样式-颜色
export function getClassByRateFun(val) {
    let _class = '';
    if (val < 10) {
        _class = 'c1';
    } else if (val >= 10 && val < 20) {
        _class = 'c10';
    } else if (val >= 20 && val < 80) {
        _class = 'c20';
    } else if (val >= 80 && val < 90) {
        _class = 'c80';
    } else {
        _class = 'c90';
    }
    return _class;
}
