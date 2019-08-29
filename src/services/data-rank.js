import request from '../axios/request';
import url from '../axios/url';

export function getAlarmLevelList(params) {
    return request.post(url.dataRank.getAlarmLevelList, params);
}
export function getAlarmResponseList(params) {
    return request.post(url.dataRank.getAlarmResponseList, params);
}
export function getDeviceOnlineList(params) {
    return request.post(url.dataRank.getDeviceOnlineList, params);
}

export function getEnergyRankList(params) {
    return request.post(url.dataRank.getEnergyRankList, params);
}
//导出
export function exportAlarmLevelList (params) {
    let openurl = url.dataRank.exportAlarmLevelList + params;
    console.log(openurl);
    window.open(openurl);
}
export function exportAlarmResponseList (params) {
    let openurl = url.dataRank.exportAlarmResponseList + params;
    console.log(openurl);
    window.open(openurl);
}
export function exportDeviceOnlineList (params) {
    let openurl = url.dataRank.exportDeviceOnlineList + params;
    console.log(openurl);
    window.open(openurl);
}
export function exportEnergyRankList (params) {
    let openurl = url.dataRank.exportEnergyRankList + params;
    console.log(openurl);
    window.open(openurl);
}
