import request from "../axios/request";
import url from "../axios/url";
import axios from 'axios';
export function getAlarmList (params) {
    return request.post(url.reportManage.getAlarmList, params);
}
//响应时间排名列表查询
export function getAlarmResponseReportList (params) {
    return request.post(url.reportManage.getAlarmResponseReportList, params);
}
export function getPlatformEnergyConsume (params) {
    return request.post(url.reportManage.getPlatformEnergyConsume, params);
}

export function getOnlinedeviceList (params) {
    return request.post(url.reportManage.getOnlinedeviceList, params);
}

export function exportAlarmList (params) {
    let openurl = url.reportManage.exportAlarmList + params;
    console.log("导出URL:"+openurl);
    window.open(openurl);
}

export function exportAlarmResponseList (params) {
    let openurl = url.reportManage.exportAlarmResponseList + params;
    console.log("导出URL:"+openurl);
    window.open(openurl);
}
export function exportPlatformEnergyConsume (params) {
    let openurl = url.reportManage.exportPlatformEnergyConsume + params;
    console.log("导出URL:"+openurl);
    window.open(openurl);
}
export function exportOnlinedeviceList (params) {
    let openurl = url.reportManage.exportOnlinedeviceList + params;
    console.log("导出URL:"+openurl);
    window.open(openurl);
}


export function  exportData (url,data) {
    //const form = this.getSearchForm() // 要发送到后台的数据
    axios({ // 用axios发送post请求
        method: 'post',
        url: url, // 请求地址
        data: data, // 参数
        responseType: 'blob' // 表明返回服务器返回的数据类型
    })
        .then((res) => { // 处理返回的文件流
            const content = res
            const blob = new Blob([content])
            const fileName = '测试表格123.xls'
            if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
            } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName)
            }
        })
}


