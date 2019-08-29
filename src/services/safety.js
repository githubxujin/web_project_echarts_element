/**
 * 【安全管理】相关的业务操作
 */

import url from '../axios/url';
import request from '../axios/request';

//-------------------------------------通讯监测---------------------------
/**
 * 获取通讯监测数据
 * @param {*} shopNumber: 店铺编码
 */
export function getMeterMonitorData (shopNumber) {
    return request.get(url.safety.getMeterMonitorData + '/' + shopNumber);
}
/**
 * 获取通讯监测历史数据
 * @param {*} params :{
  "dayType": "1-当天 2-2天 3-3天 4-自定义",
  "meterNumber": "string",
  "queryTime": "string",
  "shopNumber": "string"
}
 */

export function getMeterMonitorHistoryData (params) {
    return request.post(url.safety.getMeterMonitorHistoryData, params);
}
//-------------------------------------报警---------------------------
/**
 * 报警概览
 * @param {*} params
 */

export function getAlarmList (params, id) {
    return request.post(url.safety.getAlarmList + '?alarmId=' + id, params);
}
/**
 * 编辑报警数据
 * @param {*} param
 */

export function editAlarm (params) {
    return request.post(url.safety.editAlarm, params);
}
/**
 * 忽略报警
 * @param {} params
 */

export function ignoreAlarm (params) {
    return request.postForm(url.safety.ignoreAlarm, params);
}
/**
 * 获取报警条件树
 * @param {*} params ：门店编码
 */

export function getAlarmConditionTree (params) {
    return request.get(url.safety.getAlarmConditionTree + '/' + params);
}

/**
 * 报警统计--按时间分组
 * @param {*} param
 */

export function getAlarmStatisticListByTime (params) {
    return request.post(url.safety.getAlarmStatisticListByTime, params);
}
/**
 * 报警统计--按子系统分组
 * @param {*} param
 */

export function getAlarmStatisticListBySystem (params) {
    return request.post(url.safety.getAlarmStatisticListBySystem, params);
}
/**
 * 转工单
 */
export function autoBill (params) {
    return request.post(url.safety.autoBill, params);
}
/**
 * 获取转单人员列表-带部门
 */
export function getExecuteDepartList (shopNumber) {
    return request.get(url.operation.getExecuteDepartList + '/' + shopNumber);
}
/**
 * 根据支路ID获取最近的报警记录
 * @param {*} params
 */
export function getRecentAlarmListByMeter (params) {
    return request.get(url.safety.getRecentAlarmListByMeter, params);
}
/**
 * 根据设备id获取历史报警数据
 * @param {*} params
 */
export function getHistryAlarmListByDeviceId (params) {
    return request.get(url.safety.getHistryAlarmListByDeviceId, params);
}
//-------------------------------------供配电---------------------------
/**
 * 供配电系统图形展示接口
 * @param {*} params  transformerId:变压器ID
 */

export function getEleSafeList (params) {
    return request.get(url.safety.getEleSafeList, params);
}
/**
 * 供配电运行记录
 * @param {*} params
 */
export function getEleRecord (params) {
    return request.get(url.safety.getEleRecord, params);
}
//-------------------------------------电梯系统---------------------------
/**
 * 电梯系统示意图
 * @param {*} param
 */

export function sketchMap (params) {
    return request.get(url.safety.sketchMap + '/' + params);
}
/**
 * 电梯报警统计
 * @param {*} param
 */

export function getAlarmStatistics (params) {
    return request.get(url.safety.getAlarmStatistics + '/' + params);
}
/**
 * 电梯系统详情列表
 * @param {*} param
 */

export function getDetailList (params) {
    return request.get(url.safety.getDetailList + '/' + params);
}
/**
 * 电梯摄像头Url
 * @param {*} param
 */
export function getVideoUrl (params) {
    return request.get(url.safety.getVideoUrl, params);
}
/*
 * 供配电列表
***/

export function getPowerSupplyDistributionList (params) {
    return request.post(url.safety.getPowerSupplyDistributionList, params);
}
//图形

export function getPowerSupplyDistributionGraph (params) {
    return request.post(url.safety.getPowerSupplyDistributionGraph, params);
}

//获取供配电变压器

export function getTransformerOfPowerSupple (params) {
    return request.get(url.safety.getTransformerOfPowerSupple + '/' + params);
}
//获取支路

export function getMeterOfPowerSupple (params) {
    return request.post(url.safety.getMeterOfPowerSupple, params);
}
//获取供配电参数

export function getParamOfPowerSupple (params) {
    return request.get(url.safety.getParamOfPowerSupple + '/' + params);
}

export function exportPowerSupplyDistribution (params) {
    let openurl = url.safety.exportPowerSupplyDistribution + params;
    console.log(openurl);
    window.open(openurl);
}
//电梯故障列表查询
export function getElevatorFaultList (params) {
    return request.post(url.safety.getElevatorFaultList, params);
}
//图形报表

export function getElevatorFaultGraph (params) {
    return request.post(url.safety.getElevatorFaultGraph, params);
}
//电梯导出
export function exportElevatorFaultData (params) {
    let openurl = url.safety.exportElevatorFaultData + params;
    window.open(openurl);
}
//--空调--//
export function getAirConditionerEquipment (params) {
    return request.get(url.safety.getAirConditionerEquipment + '/' + params);
}
export function getACEquipmentParam (params) {
    return request.get(url.safety.getACEquipmentParam + '/' + params);
}
export function getAirConditionerList (params) {
    return request.postFormData(url.safety.getAirConditionerList, params);
}
export function getAirConditionerGraph (params) {
    return request.postFormData(url.safety.getAirConditionerGraph, params);
}
export function exportAirConditionerData (params) {
    let openurl = url.safety.exportAirConditionerData + params;
    console.log(openurl);
    window.open(openurl);
}


//給排水
export function exportDrainage (params) {
    let openurl = url.safety.exportDrainage + params;
    console.log(openurl);
    window.open(openurl);
}


export function getWaterSupplyDrainageByGanttChart (params) {
    return request.postFormData(
        url.safety.getWaterSupplyDrainageByGanttChart,
        params
    );
}

export function getWaterSupplyDrainageByLineChart (params) {
    return request.postFormData(
        url.safety.getWaterSupplyDrainageByLineChart,
        params
    );
}

export function getWaterSupplyDrainageEquipStyle (params) {
    return request.get(url.safety.getWaterSupplyDrainageEquipStyle, params);
}

export function getWaterSupplyDrainageFaultList (params) {
    return request.postFormData(
        url.safety.getWaterSupplyDrainageFaultList,
        params
    );
}

export function getWaterSupplyDrainageListByLiquidLevel (params) {
    return request.postFormData(
        url.safety.getWaterSupplyDrainageListByLiquidLevel,
        params
    );
}

export function getWaterSupplyDrainageSysStyle (params) {
    return request.get(url.safety.getWaterSupplyDrainageSysStyle, params);
}
//空调
export function getAirList (params) {
    return request.get(url.safety.getAirList + params);
}
