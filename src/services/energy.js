import url from '@/axios/url.js';
import request from '@/axios/request';
/**
 * 查询左侧分项/支路树
 * @param {*} params
 */
export function getLeftTree (params) {
    return request.get(url.energy.getLeftTree, params);
}
/**
 * 查询能耗信息
 * @param {*} params
 */
export function getEnergyList (params) {
    return request.postForm(url.energy.getEnergyList, params);
}
/**
 * 获取月定额/实际能耗
 * @param {*} params
 */
export function getYearQuota (params) {
    return request.get(url.energy.getYearQuota, params);
}
/**
 * 获取累计能耗与定额比
 * @param {*} params
 */
export function getTotalEnergyConsumeQuota (params) {
    return request.get(url.energy.getTotalEnergyConsumeQuota, params);
}
/**
 * 获取门店定额
 * @param {*} params
 */
export function getQuotaDetail (params) {
    return request.get(url.energy.getQuotaDetail, params);
}
/**
 * 获取定额设置
 * @param {*} params
 */
export function getQuotaSetting (params) {
    return request.get(url.energy.getQuotaSetting, params);
}
/**
 * 保存定额设置
 * @param {*} params
 */
export function setQuot (params) {
    return request.postForm(url.energy.setQuot, params);
}
/**
 * 保存定额设置
 * @param {*} params
 */
export function splitbenchmarkQuota (params) {
    return request.get(url.energy.splitbenchmarkQuota, params);
}
/*
 * 能耗报表查询
 * @param {*} params
 */
export function getEnergyConsume (params) {
    return request.get(url.energy.getEnergyConsume, params);
}
/*
 * 负荷预测分析查询
 * @param {*} params
 */
export function getPredictAnalyze (params) {
    return request.get(url.energy.getPredictAnalyze, params);
}
/*
 * 本月能耗与定额比
 * @param {*} params
 */
export function getCurMonthEnergyQuotaRate (params) {
    return request.get(url.energy.getCurMonthEnergyQuotaRate, params);
}
/*
 * 下月能耗预测
 * @param {*} params
 */
export function energyPredict (params) {
    return request.postForm(url.energy.energyPredict, params);
}
