//维修工单状态
export const RepairBillStatus = [
    {
        label: '全部',
        value: -1
    },
    {
        label: '待派工',
        value: 0
    },
    {
        label: '待完工',
        value: 1
    },
    {
        label: '已撤单',
        value: 2
    },
    {
        label: '挂单中',
        value: 3
    },
    {
        label: '待评价',
        value: 4
    },
    {
        label: '已关闭',
        value: 5
    },
    {
        label: '撤单-待审核',
        value: 6
    },
    {
        label: '挂单-待审核',
        value: 7
    },
    {
        label: '完工-待审核',
        value: 8
    },
    {
        label: '转单-待审核',
        value: 9
    }
];
//维修工单枚举
export const BillStatusEnum = {
    //待派工
    waiting: 0,
    //待完工
    waitingOver: 1,
    //已撤单
    canceled: 2,
    //待评价
    waitAppraise: 4,
    //已关闭
    closed: 5,
    //撤单-待审核
    cancelAudit: 6,
    //挂单-待审核
    hangAudit: 7,
    //完工-待审核
    overAudit: 8,
    //转单-待审核
    transferAudit: 9
};
//---------------------------巡检-----------------------------
//巡检工单状态
export const CheckBillStatus = [
    {
        label: '全部',
        value: -1
    },
    {
        label: '待派工',
        value: 0
    },
    {
        label: '待完工',
        value: 1
    },
    {
        label: '撤单-待审核',
        value: 2
    },
    {
        label: '待评价',
        value: 3
    },
    {
        label: '已撤单',
        value: 4
    },
    {
        label: '已关闭',
        value: 5
    }
];
//巡检工单枚举
export const CheckBillStatusEnum = {
    //待派工
    waiting: 0,
    //待完工
    waitingOver: 1,
    //撤单-待审核
    cancelAudit: 2,
    //待评价
    waitAppraise: 3,
    //已撤单
    canceled: 4,
    //已关闭
    closed: 5
};
//---------------------------保养-----------------------------
//保养工单状态
export const MaintainBillStatus = [
    {
        label: '全部',
        value: -1
    },
    {
        label: '待派工',
        value: 0
    },
    {
        label: '待完工',
        value: 1
    },
    {
        label: '撤单-待审核',
        value: 2
    },
    {
        label: '待评价',
        value: 3
    },
    {
        label: '已撤单',
        value: 4
    },
    {
        label: '已关闭',
        value: 5
    }
];
//保养工单枚举
export const MaintainBillStatusEnum = {
    //待派工
    waiting: 0,
    //待完工
    waitingOver: 1,
    //撤单-待审核
    cancelAudit: 2,
    //待评价
    waitAppraise: 3,
    //已撤单
    canceled: 4,
    //已关闭
    closed: 5
};
//工单来源
export const BillSource = {
    PC: 0,
    APP: 1,
    //商户（微信小程序）
    WX: 2,
    //系统报价
    SYS: 3
};
//是否紧急
export const isUrgency = {
    0: '正常',
    1: '紧急'
};
//是否超限
export const isOverLimit = {
    0: '否',
    1: '是'
};
//风险评估
export const RiskJudge = {
    //自动
    Auto: 0,
    //人工
    Man: 1,
    //不评估
    None: 2
};
//输入类型
export const inputTypeOptions = [
    { label: '区间量', value: 0 },
    { label: '开关量', value: 1 },
    { label: '数值量', value: 2 },
    { label: '文本量', value: 3 }
];
//风险判断
export const judgeTypeOptions = [
    { label: '区间', value: 0 },
    { label: '越大越好', value: 1 },
    { label: '越小越好', value: 2 }
];
//保养周期
export const MaintainCycleOptions = [
    { label: '日', value: 'A' },
    { label: '周', value: 'B' },
    { label: '半月', value: 'C' },
    { label: '月', value: 'D' },
    { label: '季', value: 'E' },
    { label: '半年', value: 'F' },
    { label: '年', value: 'G' }
];
//保养周期枚举
export const MaintainCycleEnum = {
    // 日
    day: 'A',
    //周
    week: 'B',
    //半月
    halfMonth: 'C',
    //月
    month: 'D',
    //季
    quarter: 'E',
    //半年
    halfYear: 'F',
    //年
    year: 'G'
};
//巡检周期
export const CheckCycleOptions = [
    // { label: '分', value: 'A' },
    { label: '时', value: 'B' },
    { label: '日', value: 'C' },
    { label: '周', value: 'D' },
    { label: '月', value: 'E' },
    { label: '季', value: 'F' },
    { label: '年', value: 'G' }
];
/**
 * 根据班次名称获取班次图标
 * @param {*} name
 */
export const GetIconByClassName = function(name) {
    let icon = '';
    switch (name) {
        case '整班':
            icon = 'icon-quan';
            break;
        case '白班':
            icon = 'icon-bai';
            break;
        case '夜班':
            icon = 'icon-ye';
            break;
        case '早班':
            icon = 'icon--zaoban';
            break;
        case '中班':
            icon = 'icon--zhongban';
            break;
        case '晚班':
            icon = 'icon--wanban';
            break;
        default:
            break;
    }
    return 'iconfont ' + icon;
};
