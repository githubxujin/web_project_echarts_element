/**
 * 首页相关的业务操作
 */

import url from '../axios/url';
import request from '../axios/request';

/**
 * 报警概览|集团首页待解决报警详情
 */

export function getAlarmList(params) {
    return request.post(url.dashboard.getAlarmList, params);
}

/**
 * 集团首页待解决报警数量|报警级别排名
 */

export function getAlarmRankList(params) {
    return request.post(url.dashboard.getAlarmRankList, params);
}

/**
 * 获取数据地图
 * @param {} params
 */

export function getDataMap(params) {
    return request.post(url.dashboard.getDataMap, params);
}

/**
 * 门店首页综合报警信息
 */

export function getShopAlarmList(params) {
    return request.post(url.dashboard.getShopAlarmList, params);
}
/**
 * 门店首页电梯报警信息
 */
// export function getLiftAlarmList (params) {
//     return request.get(url.dashboard.getLiftAlarmList + '/' + params);
// }
export function getLiftAlarmList(params) {
    return request.get(url.safety.sketchMap + '/' + params);
}
/**
 * 门店首页给排水报警信息
 */
export function getWaterAlarmList(params) {
    return request.get(url.dashboard.getWaterAlarmList + '/' + params);
}
/**
 * 门店首页配电报警信息
 */
export function getElectricAlarmList(params) {
    return request.postForm(url.dashboard.getElectricAlarmList, params);
}
/**
 * 门店首页能耗报警信息
 */
export function getEnergyAlarmList(params) {
    return request.get(url.dashboard.getEnergyAlarmList, params);
}
/**
 * 根据门店编码获取工单处理人
 */
export function getOrderHandlerByShop(params) {
    return request.get(url.dashboard.getOrderHandlerByShop, params);
}
/**
 * 根据报警id和处理人id生成报警工单
 */
export function generateAlarmOrder(params) {
    return request.get(url.dashboard.generateAlarmOrder, params);
}
