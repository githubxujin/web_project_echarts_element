const pre = '/safeManage';
export default {
    //-------------------通讯监测--------------------//
    getMeterMonitorData: pre + '/communicationMonitor/getMeterMonitorData', // 获取通讯监测数据
    getMeterMonitorHistoryData:
        pre + '/communicationMonitor/getMeterMonitorHistoryData', //获取通讯监测历史数据

    //---------------------报警----------------------//
    getAlarmList: pre + '/alarm/getAlarmList', //报警概览
    editAlarm: pre + '/alarm/editAlarm', //编辑报警数据
    getAlarmConditionTree: pre + '/alarm/getAlarmConditionTree', ///{shopNumber} 获取报警条件树
    ignoreAlarm: pre + '/alarm/ignoreAlarm', //忽略报警

    getAlarmStatisticListByTime:
        pre + '/alarmStatistic/getAlarmStatisticListByTime', //报警统计--按时间分组
    getAlarmStatisticListBySystem:
        pre + '/alarmStatistic/getAlarmStatisticListBySystem ', //报警统计--按子系统分组

    autoBill: pre + '/alarm/autoBill', // 转工单
    getRecentAlarmListByMeter: pre + '/alarm/getRecentAlarmListByMeter', //根据支路ID获取最近的报警记录
    getHistryAlarmListByDeviceId: pre + '/alarm/getHistryAlarmListByDeviceId', //根据设备id获取历史报警数据

    //---------------------供配电系统----------------------//
    getEleSafeList: pre + '/eleSafe/getEleSafeList', // 供配电系统图形展示接口 ?transformerId
    sketchMap: pre + '/elevator/sketchMap', //电梯系统示意图
    getDetailList: pre + '/elevator/getDetailList', //电梯系统详情列表
    getEleRecord: pre + '/eleSafe/getEleRecord', //供配电运行记录

    //---------------------运行记录----------------------//
    getTransformerOfPowerSupple:
        pre + '/runningRecord/getTransformerOfPowerSupple', //获取供配电变压器
    getMeterOfPowerSupple: pre + '/runningRecord/getMeterOfPowerSupple', //获取供配电支路
    getParamOfPowerSupple: pre + '/runningRecord/getParamOfPowerSupple', //获取供配电参数
    getPowerSupplyDistributionList:
        pre + '/runningRecord/getPowerSupplyDistributionList', //供配电列表
    getPowerSupplyDistributionGraph:
        pre + '/runningRecord/getPowerSupplyDistributionGraph', //供配电图表
    getElevatorFaultList: pre + '/runningRecord/getElevatorFaultList', //电梯故障列表查询
    getAlarmStatistics: pre + '/elevator/getAlarmStatistics', //电梯报警统计
    getElevatorFaultGraph: pre + '/runningRecord/getElevatorFaultGraph', //电梯故障图表查询
    exportElevatorFaultData: '/api' + pre + '/runningRecord/exportElevatorFaultData', //电梯故障列表导出

    getAirConditionerEquipment:
        pre + '/runningRecord/getAirConditionerEquipment', //获取空调设备
    getACEquipmentParam: pre + '/runningRecord/getACEquipmentParam', //获取空调设备
    getAirConditionerList: pre + '/runningRecord/getAirConditionerList', //获取空调列表数据
    getAirConditionerGraph: pre + '/runningRecord/getAirConditionerGraph', //获取空调列表数据
    exportAirConditionerData:
        '/api' + pre + '/runningRecord/exportAirConditionerData', //空调列表导出

    exportDrainage:  '/api'+pre + '/runningRecord/exportDrainage', //导出给排水液位及故障列表
    getWaterSupplyDrainageByGanttChart:
        pre + '/runningRecord/getWaterSupplyDrainageByGanttChart', //给排水甘特图数据查询
    getWaterSupplyDrainageByLineChart:
        pre + '/runningRecord/getWaterSupplyDrainageByLineChart', //给排水折线图数据查询
    getWaterSupplyDrainageFaultList:
        pre + '/runningRecord/getWaterSupplyDrainageFaultList', //给排水故障列表查询
    getWaterSupplyDrainageSysStyle:
        pre + '/runningRecord/getWaterSupplyDrainageSysStyle', //获取给排水系统类型
    getWaterSupplyDrainageEquipStyle:
        pre + '/runningRecord/getWaterSupplyDrainageEquipStyle', //获取给排水设备类型
    getWaterSupplyDrainageListByLiquidLevel:
        pre + '/runningRecord/getWaterSupplyDrainageListByLiquidLevel', //给排水液位列表查询
    getWaterSupplyDrainageSysStyle:
        pre + '/runningRecord/getWaterSupplyDrainageSysStyle', //获取给排水系统类型
    exportPowerSupplyDistribution:  '/api'+pre + '/runningRecord/exportPowerSupplyDistribution', //供配电

    //---------------------其他----------------------//
    getVideoUrl: 'video/elevator/getVideoUrl', //电梯摄像头路径
    //--空调 --//
    getAirList: pre + '/eleSafe/getAirList' //获取点
};
