import url from '../axios/url'
import request from '../axios/request'

/**
 * 资产管理|查询设备信息
 */

export function getDeviceList(params) {
    return request.post(url.assets.getDeviceList, params)
}
/**
 * 资产管理|新增设备信息
 */

export function addDevice(params) {
    return request.post(url.assets.addDevice, params)
}
/**
 * 资产管理|获取品牌
 */

export function getBrand(params) {
    return request.get(url.assets.getBrand, params)
}
/**
 * 资产管理|获取生产厂家
 */

export function getFactory() {
    return request.get(url.assets.getFactory)
}
/**
 * 资产管理|根据设备类型获取技术参数
 */

export function getParamsField(params) {
    return request.get(url.assets.getParamsField + '/' + params)
}
/**
 * 资产管理|获取详情
 */

export function getInfo(params) {
    return request.get(url.assets.getInfo + '/' + params)
}
/**
 * 资产管理|编辑信息
 */

export function editDevice(params) {
    return request.post(url.assets.editDevice, params)
}
/**
 * 资产管理|编辑信息
 */

export function getDeviceTypeTree(params) {
    return request.get(url.assets.getDeviceTypeTree, params)
}
/**
 * 资产管理|删除数据
 */

export function delDevice(params) {
    return request.get(url.assets.delDevice + '/' + params)
}
/**
 * 资产管理|删除数据
 */

export function getSafeTime() {
    return request.get(url.assets.getSafeTime)
}
/**
 * 资产管理|备件信息获取数据
 */

export function queryList(params) {
    return request.post(url.assets.queryList, params)
}
/**
 * 资产管理|备件新增数据
 */

export function addParts(params) {
    return request.post(url.assets.addParts, params)
}
/**
 * 资产管理|备件新增数据
 */

export function editParts(params) {
    return request.post(url.assets.editParts, params)
}
/**
 * 资产管理|删除数据
 */

export function delParts(params) {
    return request.get(url.assets.delParts, params)
}
/**
 * 资产管理|删除数据
 */

export function getDetail(params) {
    return request.get(url.assets.getDetail, params)
}
/**
 * 资产管理|获取入库列表、
 */

export function getinStorageList(params) {
    return request.post(url.assets.getinStorageList, params)
}
/**
 * 资产管理|新增入库
 */

export function addStorageData(params) {
    return request.post(url.assets.addStorageData, params)
}
/**
 * 资产管理|编辑入库
 */

export function editStorageData(params) {
    return request.post(url.assets.editStorageData, params)
}
/**
 * 资产管理|入库详情
 */

export function getStorageDetail(params) {
    return request.get(url.assets.getStorageDetail, params)
}
/**
 * 资产管理|入库详情
 */

export function delStorageData(params) {
    return request.get(url.assets.delStorageData, params)
}
/**
 * 资产管理|入库详情
 */

export function getSparePartTree(params) {
    return request.get(url.assets.getSparePartTree, params)
}
/**
 * 资产管理|出库列表
 */

export function getOutStorageList(params) {
    return request.post(url.assets.getOutStorageList, params)
}
/**
 * 资产管理|新增出库
 */

export function addOutStoraData(params) {
    return request.post(url.assets.addOutStoraData, params)
}
/**
 * 资产管理|编辑出库
 */

export function editOutStoraData(params) {
    return request.post(url.assets.editOutStoraData, params)
}
/**
 * 资产管理|删除出库
 */

export function delOutStoraData(params) {
    return request.get(url.assets.delOutStoraData, params)
}
/**
 * 资产管理|获取详情
 */

export function getOutStoraDetail(params) {
    return request.get(url.assets.getOutStoraDetail, params)
}
/**
 * 资产管理|根据门店获取领用人
 */

export function getUserListByShopNumber(params) {
    return request.get(url.assets.getUserListByShopNumber, params)
}
/**
 * 资产管理|台账统计
 */

export function getAccountStatistic(params) {
    return request.get(url.assets.getAccountStatistic, params)
}
