//报警级别
export const alarmLevel = {
    1: '一级',
    2: '二级',
    3: '三级',
    4: '四级',
    5: '五级'
};

//报警'状态，0：未确认，1：已确认，2：处理中，3：已解决',
export const alarmStatus = {
    0: '未确认',
    1: '已恢复',
    2: '处理中',
    3: '已解决'
};
//报警状态枚举
export const alarmStatusEnum = {
    //未确认
    noSure: 0,
    //已恢复
    recovered: 1,
    //处理中
    processing: 2,
    //已解决
    resolved: 3
};
//报警类别
export const alarmSystem = {
    1: '供配电系统',
    2: '给排水系统',
    3: '空调系统',
    4: '电梯系统',
    5: '能管系统'
};
//报警类别图标
export const alarmSystemIcon = {
    1: 'icon-gongpeidian',
    2: 'icon-geipaishui',
    3: 'icon-kongtiao1',
    4: 'icon-dianti-deep',
    5: 'icon-jienengguanli'
};
//报警状态配置项
export const alarmStatusOptions = function() {
    let res = [];
    res.push({
        label: '全部',
        value: -1
    });
    for (var x in alarmStatus) {
        res.push({ value: x, label: alarmStatus[x] });
    }
    return res;
};
//报警级别配置项
export const alarmLevelOptions = function() {
    let res = [];
    for (var x in alarmLevel) {
        res.push({ value: parseInt(x), label: alarmLevel[x] });
    }
    console.log('res', res);
    return res;
};
