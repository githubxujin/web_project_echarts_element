const pre = '/common'
export default {
    getAlarmList: pre + '/groupHome/getAlarmList', // 报警概览|集团首页待解决报警详情
    getAlarmRankList: pre + '/groupHome/getAlarmRankList', // 集团首页待解决报警数量|报警级别排名
    getDataMap: pre + '/groupHome/getDataMap', //数据地图
    getShopAlarmList: pre + '/shopHome/getAlarmList', //门店综合报警信息
    getLiftAlarmList: '/safeManage/elevator/sketchMap', //电梯系统示意图
    getWaterAlarmList: pre + '/shopHome/getWaterAlarmList', //给排水系统报警信息
    getElectricAlarmList: pre + '/shopHome/getElectricAlarmList', //供配电系统报警信息
    getEnergyAlarmList: pre + '/shopHome/getEnergyAlarmList', //能耗报警信息
    getOrderHandlerByShop: pre + '/shopHome/getOrderHandlerByShop', //根据门店编码获取工单处理人
    generateAlarmOrder: pre + '/shopHome/generateAlarmOrder', //根据报警id和处理人id生成报警工单
    getEnergyConsumeAndCost: pre + '/shopHome/energyConsumeAndCost' //今日/本月能耗费用查询（门店首页）
}
