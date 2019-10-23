import url from '@/axios/url.js'
import request from '@/axios/request'
/*******************************集团登陆门店**************************************/
/**
 * 登陆门店
 * @returns {
 *    code 200
 * }
 */
export function shopLogin(params) {
    return request.post(url.systemSettings.shopLogin, params)
}
/**
 * 登陆门店凭证
 * @returns {
 *    code 200
 * }
 */
export function generateToken() {
    return request.get(url.systemSettings.generateToken)
}
/*******************************集团登陆门店**************************************/
/*******************************用户管理START**************************************/
/**
 * 查询用户列表
 * @returns {
 *    array: 用户列表
 * }
 */
export function adminQueryList(params) {
    return request.post(url.systemSettings.adminQueryList, params)
}

/**
 * 新增用户
 * @returns {
 *    code 200
 * }
 */
export function adminAdd(params) {
    return request.post(url.systemSettings.adminAdd, params)
}

/**
 * 删除用户
 * @returns {
 *    code 200
 * }
 */
export function adminDelete(params) {
    return request.get(url.systemSettings.adminDelete.replace('$', params.id))
}

/**
 * 修改用户信息
 * @returns {
 *    code 200
 * }
 */
export function adminEdit(params) {
    return request.post(url.systemSettings.adminEdit, params)
}

/**
 * 重置密码
 * @returns {
 *    code 200
 * }
 */
export function adminResetPwd(params) {
    return request.get(url.systemSettings.adminResetPwd.replace('$', params.id))
}

/**
 * 获取用户详细信息
 * @returns {
 *    object: 用户信息
 * }
 */
export function adminGetInfo(params) {
    return request.get(url.systemSettings.adminGetInfo.replace('$', params.id))
}
/*******************************用户管理END**************************************/

/*******************************门店管理START**************************************/
/**
 * 获取当前门店详情
 * @param {String|Number} shopNumber
 * @return {
 *  Object: 门店详情
 * }
 */
export function shopGetInfo(params) {
    return request.get(
        url.systemSettings.shopGetInfo.replace('$', params.shopNumber)
    )
}

/**
 * 编辑当前门店信息
 * @param {Object} params
 * @return {
 *  code 200
 * }
 */
export function shopEdit(params) {
    return request.post(url.systemSettings.shopEdit, params)
}

/**
 * 获取当前门店照片信息
 * @param {String|Number} shopNumber
 * @return {
 *  Object: 门店照片列表
 * }
 */
export function shopPictureQuery(params) {
    return request.get(
        url.systemSettings.shopPictureQuery.replace('$', params.shopNumber)
    )
}

/**
 * 新增当前门店照片信息
 * @param {Object} params
 * @return {
 *  code 200
 * }
 */
export function shopPictureAdd(params) {
    return request.post(url.systemSettings.shopPictureAdd, params)
}

/**
 * 删除当前门店照片信息
 * @param {Object} params
 * @return {
 *  code 200
 * }
 */
export function shopPictureDelete(params) {
    return request.post(url.systemSettings.shopPictureDelete, params)
}

/**
 * 编辑当前门店照片信息
 * @param {Object} params
 * @return {
 *  code 200
 * }
 */
export function shopPictureEdit(params) {
    return request.post(url.systemSettings.shopPictureEdit, params)
}

/**
 * 获取分时电价数据
 * @return {
 *    object: 当前电价 及 历史电价
 * }
 */
export function electrovalenceQuery(params) {
    return request.get(
        url.systemSettings.electrovalenceQuery.replace('$', params.shopNumber)
    )
}

/**
 * 编辑分时电价数据
 * @return {
 *    code 200
 * }
 */
export function electrovalenceEdit(params) {
    return request.post(url.systemSettings.electrovalenceEdit, params)
}

/**
 * 获取值班时间数据
 * @return {
 *    array
 * }
 */
export function dutyChartQuery(params) {
    return request.get(
        url.systemSettings.dutyChartQuery.replace('$', params.shopNumber)
    )
}

/**
 * 编辑值班时间数据
 * @return {
 *    code 200
 * }
 */
export function dutyChartSave(params) {
    return request.post(url.systemSettings.dutyChartSave, params)
}
/*******************************门店管理END**************************************/

/*******************************自定义报警START**************************************/
/**
 * 查询自定义报警列表
 * @returns {
 *    array: 自定义报警列表
 * }
 */
export function alarmQueryList(params) {
    return request.post(url.systemSettings.alarmQueryList, params)
}

/**
 * 新增自定义报警
 * @returns {
 *    code 200
 * }
 */
export function alarmAdd(params) {
    return request.post(url.systemSettings.alarmAdd, params)
}

/**
 * 删除自定义报警
 * @returns {
 *    code 200
 * }
 */
export function alarmDelete(params) {
    return request.get(url.systemSettings.alarmDelete, params)
}

/**
 * 修改自定义报警信息
 * @returns {
 *    code 200
 * }
 */
export function alarmEdit(params) {
    return request.post(url.systemSettings.alarmEdit, params)
}

/**
 * 批量修改自定义报警信息
 * @returns {
 *    code 200
 * }
 */
export function alarmEditBatch(params) {
    return request.post(url.systemSettings.alarmEditBatch, params)
}
/**
 * 获取自定义报警详细信息
 * @returns {
 *    object: 自定义报警信息
 * }
 */
export function alarmGetInfo(params) {
    return request.get(url.systemSettings.alarmGetInfo, params)
}

/**
 * 获取自定义报警设备下拉树
 * @returns {
 *    object: 报警设备下拉树
 * }
 */
export function alarmDeviceTreeQuery(params) {
    return request.post(url.systemSettings.alarmDeviceTreeQuery, params)
}

/**
 * 获取自定义报警参数列表
 * @returns {
 *    object: 自定义报警信息
 * }
 */
export function alarmParameterQuery(params) {
    return request.post(url.systemSettings.alarmParameterQuery, params)
}
/**
 * 获取自定义报警设备下拉树-查询告警列表用
 * @returns {
 *    object: 报警设备下拉树-查询告警列表用
 * }
 */
export function alarmDeviceTreeSelectiveQuery(params) {
    return request.get(
        url.systemSettings.alarmDeviceTreeSelectiveQuery.replace(
            '$',
            params.shopNumber
        )
    )
}
/**
 * 获取自定义报警推送人员列表
 * @returns {
 *    object: 推送人员列表
 * }
 */
export function alarmAdminListQuery(params) {
    return request.get(
        url.systemSettings.alarmAdminListQuery.replace('$', params.shopNumber)
    )
}

/**
 * 获取参数映射枚举列表
 * @returns {
 *    list: 参数映射枚举列表
 * }
 */
export function alarmPointMappingQuery(params) {
    return request.post(url.systemSettings.alarmPointMappingQuery, params)
}

/**
 * 获取告警设备图片
 * @returns {
 *    list: pitcure
 * }
 */

export function alarmGetDevicePicture(params) {
    return request.post(url.systemSettings.alarmGetDevicePicture, params)
}
/*******************************自定义报警END**************************************/
/*******************************支路信息START**************************************/
/**
 * 支路列表查询
 * @return {
 *    code 200
 * }
 */
export function meterQuery(params) {
    return request.post(url.systemSettings.meterQuery, params)
}
/**
 * 支路详情查询
 * @return {
 *    code 200
 * }
 */
export function meterGetInfo(params) {
    return request.get(url.systemSettings.meterGetInfo.replace('$', params.id))
}
/**
 * 新增支路
 * @return {
 *    code 200
 * }
 */
export function meterAdd(params) {
    return request.post(url.systemSettings.meterAdd, params)
}
/**
 * 编辑支路信息
 * @return {
 *    code 200
 * }
 */
export function meterEdit(params) {
    return request.post(url.systemSettings.meterEdit, params)
}
/**
 * 获取能耗类型下拉树
 * @return {
 *    tree
 * }
 */
export function meterGetEnergyHTypeArray() {
    return request.get(url.systemSettings.meterGetEnergyHTypeArray)
}
/**
 * 换表历史-支路信息
 * @return {
 *    array
 * }
 */
export function meterGetHistory(params) {
    return request.get(
        url.systemSettings.meterGetHistory.replace('$', params.id)
    )
}
/**
 * 导入-支路信息
 * @return {
 *    code 200
 * }
 */
export function meterImport(params) {
    return request.get(url.systemSettings.meterImport, params)
}
/**
 * 换表-支路信息
 * @param {*} params
 */
export function meterTrade(params) {
    return request.post(url.systemSettings.meterTrade, params)
}
/**
 * 获取支路下拉树
 * @return {
 *  array
 * }
 */
export function meterGetTreeArray(params) {
    return request.get(
        url.systemSettings.meterGetTreeArray.replace('$', params.shopNumber)
    )
}
/**
 * 获取支路列表
 * @return {
 *  array
 * }
 */
export function meterGetArray(params) {
    return request.get(
        url.systemSettings.meterGetArray.replace('$', params.shopNumber)
    )
}

export function meterGetArrayByType(params) {
    return request.post(url.systemSettings.meterGetArrayByType, params)
}
/**
 * 根据设备类型获取支路列表
 * @return {
 *  array
 * }
 */
export function meterArray(params) {
    return request.post(url.systemSettings.meterArray, params)
}
/*******************************支路信息END**************************************/
/*******************************分项管理START**************************************/
/**
 * 分项列表查询
 * @return {
 *    code 200
 * }
 */
export function subentryQuery(params) {
    return request.post(url.systemSettings.subentryQuery, params)
}

/**
 * 编辑分项信息
 * @return {
 *    code 200
 * }
 */
export function subentryEdit(params) {
    return request.post(url.systemSettings.subentryEdit, params)
}
/**
 * 增加分项信息
 * @return {
 *    code 200
 * }
 */
export function subentryAdd(params) {
    return request.post(url.systemSettings.subentryAdd, params)
}
/**
 * 新增分项信息
 * @return {
 *    code 200
 * }
 */
export function subentryAddOne(params) {
    return request.post(url.systemSettings.subentryAddOne, params)
}
/**
 * 获取分项列表
 * @return {
 *  array
 * }
 */
export function subentryGetArray(params) {
    return request.post(url.systemSettings.subentryGetArray, params)
}
/**
 * 获取分项下拉树
 * @return {
 *  array
 * }
 */
export function subentryGetTreeArray(params) {
    return request.get(
        url.systemSettings.subentryGetTreeArray.replace('$', params.shopNumber)
    )
}

/**
 * 获取系统分项模板树
 * @return {
 *  array
 * }
 */
export function subentryGetTemplateTreeArray() {
    return request.get(url.systemSettings.subentryGetTemplateTreeArray)
}
/*******************************分项管理END**************************************/
/*******************************采集器管理START**************************************/
/**
 * 采集器列表查询
 * @return {
 *    code 200
 * }
 */
export function collectorQuery(params) {
    return request.post(url.systemSettings.collectorQuery, params)
}
/**
 * 采集器详情查询
 * @return {
 *    code 200
 * }
 */
export function collectorGetInfo(params) {
    return request.post(
        url.systemSettings.collectorGetInfo.replace('$', params.id)
    )
}
/**
 * 新增采集器
 * @return {
 *    code 200
 * }
 */
export function collectorAdd(params) {
    return request.post(url.systemSettings.collectorAdd, params)
}
/**
 * 编辑采集器信息
 * @return {
 *    code 200
 * }
 */
export function collectorEdit(params) {
    return request.post(url.systemSettings.collectorEdit, params)
}
/**
 * 获取所有采集器
 * @return {
 *    code 200
 * }
 */
export function collectorGetArray(params) {
    return request.get(
        url.systemSettings.collectorGetArray.replace('$', params.shopNumber)
    )
}
/**
 * 获取所有采集器
 * @return {
 *    array
 * }
 */
export function collectorGetPort(params) {
    return request.get(
        url.systemSettings.collectorGetPort.replace('$', params.id)
    )
}
/*******************************采集器管理END**************************************/

/*******************************变压器管理START**************************************/
/**
 * 变压器列表查询
 * @return {
 *    code 200
 * }
 */
export function transformerQuery(params) {
    return request.post(url.systemSettings.transformerQuery, params)
}
/**
 * 新增变压器
 * @return {
 *    code 200
 * }
 */
export function transformerAdd(params) {
    return request.post(url.systemSettings.transformerAdd, params)
}
/**
 * 编辑变压器信息
 * @return {
 *    code 200
 * }
 */
export function transformerEdit(params) {
    return request.post(url.systemSettings.transformerEdit, params)
}
/**
 * 获取所有变压器
 * @return {
 *    code 200
 * }
 */
export function transformerGetArray(params) {
    return request.get(
        url.systemSettings.transformerGetArray.replace('$', params.shopNumber)
    )
}
/*******************************变压器管理END**************************************/
/*******************************表计参数管理START**************************************/
/**
 * 表计参数列表查询
 * @return {
 *    list
 * }
 */
export function tachometerQuery(params) {
    return request.post(url.systemSettings.tachometerQuery, params)
}

/**
 * 获取表计参数详情
 * @return {
 *    Object
 * }
 */
export function tachometerGetInfo(params) {
    return request.get(
        url.systemSettings.tachometerGetInfo.replace('$', params.id)
    )
}
/**
 * 新增表计参数
 * @return {
 *    code 200
 * }
 */
export function tachometerAdd(params) {
    return request.post(url.systemSettings.tachometerAdd, params)
}
/**
 * 编辑表计参数信息
 * @return {
 *    code 200
 * }
 */
export function tachometerEdit(params) {
    return request.post(url.systemSettings.tachometerEdit, params)
}
/**
 * 删除表计参数信息
 * @return {
 *    code 200
 * }
 */
export function tachometerDelete(params) {
    return request.get(
        url.systemSettings.tachometerDelete.replace('$', params.id)
    )
}

/**
 * 获取表计默认枚举
 * @return {
 *    array
 * }
 */
export function tachometerGetMappingArray(params) {
    return request.post(url.systemSettings.tachometerGetMappingArray, params)
}
/**
 * 根据计量设备类型获取表计列表
 * @return {
 *    code 200
 * }
 */
export function tachometerGetArray(params) {
    return request.get(
        url.systemSettings.tachometerGetArray
            .replace('$1', params.shopNumber)
            .replace('$2', params.deviceType)
    )
}

/*******************************表计参数管理END**************************************/

/*******************************冷站参数START**************************************/
/**
 * 冷站参数管理列表查询
 * @return {
 *    list
 * }
 */
export function pointTableQuery(params) {
    return request.post(url.systemSettings.pointTableQuery, params)
}

/**
 * 新增冷站参数
 * @return {
 *    code 200
 * }
 */
export function pointTableAdd(params) {
    return request.post(url.systemSettings.pointTableAdd, params)
}
/**
 * 编辑冷站参数信息
 * @return {
 *    code 200
 * }
 */
export function pointTableEdit(params) {
    return request.post(url.systemSettings.pointTableEdit, params)
}
/**
 * 删除冷站参数信息
 * @return {
 *    code 200
 * }
 */
export function pointTableDelete(params) {
    return request.get(
        url.systemSettings.pointTableDelete.replace('$', params.id)
    )
}
/**
 * 获取冷站参数详情
 * @return {
 *    code 200
 * }
 */
export function pointTableGetInfo(params) {
    return request.get(
        url.systemSettings.pointTableGetInfo.replace('$', params.id)
    )
}
/*******************************冷站参数END**************************************/
/*******************************点表映射管理START**************************************/
/**
 * 点表映射列表查询
 * @return {
 *    list
 * }
 */
export function pointTableMapQuery(params) {
    return request.post(url.systemSettings.pointTableMapQuery, params)
}

/**
 * 新增点表映射
 * @return {
 *    code 200
 * }
 */
export function pointTableMapAdd(params) {
    return request.post(url.systemSettings.pointTableMapAdd, params)
}
/**
 * 编辑点表映射信息
 * @return {
 *    code 200
 * }
 */
export function pointTableMapEdit(params) {
    return request.post(url.systemSettings.pointTableMapEdit, params)
}
/**
 * 删除点表映射信息
 * @return {
 *    code 200
 * }
 */
export function pointTableMapDelete(params) {
    return request.get(
        url.systemSettings.pointTableMapDelete.replace('$', params.id)
    )
}
/**
 * 获取点表列表
 * @return {
 *  array
 * }
 */
export function pointTableGetArray(params) {
    return request.get(
        url.systemSettings.pointTableGetArray.replace('$', params.shopNumber)
    )
}
/*******************************点表映射管理END**************************************/
/*******************************配电参数START**************************************/
/**
 * 配电参数列表查询
 * @return {
 *    list
 * }
 */
export function powerDistributionMeterQuery(params) {
    return request.post(url.systemSettings.powerDistributionMeterQuery, params)
}

/**
 * 新增配电参数
 * @return {
 *    code 200
 * }
 */
export function powerDistributionMeterAdd(params) {
    return request.post(url.systemSettings.powerDistributionMeterAdd, params)
}
/**
 * 编辑配电参数信息
 * @return {
 *    code 200
 * }
 */
export function powerDistributionMeterEdit(params) {
    return request.post(url.systemSettings.powerDistributionMeterEdit, params)
}

/**
 * 获取配电参数详情
 * @return {
 *    code 200
 * }
 */
export function powerDistributionMeterGetInfo(params) {
    return request.get(
        url.systemSettings.powerDistributionMeterGetInfo.replace('$', params.id)
    )
}
/*******************************配电参数END**************************************/
/*******************************给排水管理START**************************************/
/**
 * 给排水列表查询
 * @return {
 *    list
 * }
 */
export function drainageQuery(params) {
    return request.post(url.systemSettings.drainageQuery, params)
}

/**
 * 新增给排水
 * @return {
 *    code 200
 * }
 */
export function drainageAdd(params) {
    return request.post(url.systemSettings.drainageAdd, params)
}
/**
 * 编辑给排水信息
 * @return {
 *    code 200
 * }
 */
export function drainageEdit(params) {
    return request.post(url.systemSettings.drainageEdit, params)
}
/**
 * 删除给排水信息
 * @return {
 *    code 200
 * }
 */
export function drainageDelete(params) {
    return request.get(
        url.systemSettings.drainageDelete.replace('$', params.id)
    )
}
/**
 * 根据shopNumber和pid获取给排水列表
 * @return {
 *    code 200
 * }
 */
export function drainageGetArray(params) {
    return request.post(url.systemSettings.drainageGetArray, params)
}
/**
 * 根据获取给排水设备列表
 * @return {
 *    code 200
 * }
 */
export function drainageGetTreeArray(params) {
    return request.get(
        url.systemSettings.drainageGetTreeArray.replace('$', params.shopNumber)
    )
}
/*******************************给排水管理END**************************************/
/*******************************给排水参数管理START**************************************/
/**
 * 给排水参数列表查询
 * @return {
 *    list
 * }
 */
export function drainagePointTableQuery(params) {
    return request.post(url.systemSettings.drainagePointTableQuery, params)
}

/**
 * 新增给排水参数
 * @return {
 *    code 200
 * }
 */
export function drainagePointTableAdd(params) {
    return request.post(url.systemSettings.drainagePointTableAdd, params)
}
/**
 * 编辑给排水参数信息
 * @return {
 *    code 200
 * }
 */
export function drainagePointTableEdit(params) {
    return request.post(url.systemSettings.drainagePointTableEdit, params)
}
/**
 * 删除给排水参数信息
 * @return {
 *    code 200
 * }
 */
export function drainagePointTableDelete(params) {
    return request.get(
        url.systemSettings.drainagePointTableDelete.replace('$', params.id)
    )
}
/**
 * 获取给排水参数详情
 * @return {
 *    code 200
 * }
 */
export function drainagePointTableGetInfo(params) {
    return request.get(
        url.systemSettings.drainagePointTableGetInfo.replace('$', params.id)
    )
}
/*******************************给排水参数END**************************************/
/*******************************电梯管理START**************************************/
/**
 * 电梯列表查询
 * @return {
 *    list
 * }
 */
export function elevatorQuery(params) {
    return request.post(url.systemSettings.elevatorQuery, params)
}

/**
 * 新增电梯
 * @return {
 *    code 200
 * }
 */
export function elevatorAdd(params) {
    return request.post(url.systemSettings.elevatorAdd, params)
}
/**
 * 编辑电梯信息
 * @return {
 *    code 200
 * }
 */
export function elevatorEdit(params) {
    return request.post(url.systemSettings.elevatorEdit, params)
}
/**
 * 删除电梯信息
 * @return {
 *    code 200
 * }
 */
export function elevatorDelete(params) {
    return request.get(
        url.systemSettings.elevatorDelete.replace('$', params.id)
    )
}

/*******************************电梯管理END**************************************/
/*******************************冷站设备管理START**************************************/
/**
 * 冷站设备管理列表查询
 * @return {
 *    list
 * }
 */
export function coolingStationQuery(params) {
    return request.post(url.systemSettings.coolingStationQuery, params)
}

/**
 * 新增冷站设备
 * @return {
 *    code 200
 * }
 */
export function coolingStationAdd(params) {
    return request.post(url.systemSettings.coolingStationAdd, params)
}
/**
 * 编辑冷站设备信息
 * @return {
 *    code 200
 * }
 */
export function coolingStationEdit(params) {
    return request.post(url.systemSettings.coolingStationEdit, params)
}
/**
 * 删除冷站设备信息
 * @return {
 *    code 200
 * }
 */
export function coolingStationDelete(params) {
    return request.get(
        url.systemSettings.coolingStationDelete.replace('$', params.id)
    )
}
/**
 * 获取冷站设备列表
 * @return {
 *  array
 * }
 */
export function coolingStationGetArray(params) {
    return request.get(
        url.systemSettings.coolingStationGetArray.replace(
            '$',
            params.shopNumber
        )
    )
}
/**
 * 获取冷站设备支路列表
 * @return {
 *    array
 * }
 */
export function coolingStationGetMeterList(params) {
    return request.get(
        url.systemSettings.coolingStationGetMeterList.replace('$', params.id)
    )
}
/*******************************冷站设备管理END**************************************/
/*******************************监控界面配置管理START**************************************/
/**
 * 监控界面配置列表查询
 * @return {
 *    list
 * }
 */
export function monitorQuery(params) {
    return request.post(url.systemSettings.monitorQuery, params)
}

/**
 * 获取监控界面配置详情
 * @return {
 *    Object
 * }
 */
export function monitorGetInfo(params) {
    return request.get(
        url.systemSettings.monitorGetInfo.replace('$', params.id)
    )
}
/**
 * 新增监控界面配饰
 * @return {
 *    code 200
 * }
 */
export function monitorAdd(params) {
    return request.post(url.systemSettings.monitorAdd, params)
}
/**
 * 编辑监控界面配置信息
 * @return {
 *    code 200
 * }
 */
export function monitorEdit(params) {
    return request.post(url.systemSettings.monitorEdit, params)
}
/**
 * 删除监控界面配置信息
 * @return {
 *    code 200
 * }
 */
export function monitorDelete(params) {
    return request.get(url.systemSettings.monitorDelete.replace('$', params.id))
}
/**
 * 删除监控界面配置信息图片信息
 * @return {
 *    code 200
 * }
 */
export function monitorPictureQuery(params) {
    return request.post(url.systemSettings.monitorPictureQuery, params)
}
/**
 * 获取所有集水井
 * @param {*} shopNumber
 */
export function getAllSump(shopNumber) {
    return request.get(url.systemSettings.getAllSump + '/' + shopNumber)
}
/**
 * 更新集水井位置
 * @param {*} params
 */
export function saveSumpPosition(params) {
    return request.post(url.systemSettings.saveSumpPosition, params)
}
/**
 * 获取所有集水井位置
 * @param {*} id
 */
export function getSumpPosition(id) {
    return request.get(url.systemSettings.getSumpPosition + '/' + id)
}
/**
 * 获取视频监控管理列表
 * @param {*} params
 */
export function videoMonitorQuery(params) {
    return request.post(url.systemSettings.videoMonitorQuery, params)
}
/**
 * 视频监控管理编辑
 * @param {*} params
 */
export function videoMonitorEdit(params) {
    return request.post(url.systemSettings.videoMonitorEdit, params)
}
/**
 * 视频监控管理保存
 * @param {*} params
 */
export function videoMonitorAdd(params) {
    return request.post(url.systemSettings.videoMonitorSave, params)
}
/**
 * 视频监控列表数据
 * @param {*} params
 */
export function videoMonitorArray(params) {
    return request.post(url.systemSettings.videoMonitorArray, params)
}

/**
 * 视频监控地址
 * @param {*} params
 */
export function videoMonitorUrl(params) {
    return request.get(url.systemSettings.videoMonitorUrl, params)
}
/*******************************监控界面配置管理END**************************************/
/*******************************全局参数配置START**************************************/
/**
 * 新增字典
 * @return {
 *    code 200
 * }
 */
export function dictAdd(params) {
    return request.post(url.systemSettings.dictAdd, params)
}

/**
 * 删除冷站设备信息
 * @return {
 *    code 200
 * }
 */
export function dictDelete(params) {
    return request.get(url.systemSettings.dictDelete.replace('$', params.id))
}
/**
 * 编辑字典
 * @return {
 *    code 200
 * }
 */
export function dictEdit(params) {
    return request.post(url.systemSettings.dictEdit, params)
}
/**
 * 字典列表查询
 * @return {
 *    list
 * }
 */
export function dictQuery(params) {
    return request.post(url.systemSettings.dictQuery, params)
}
/**
 * 字典列表查询 不分页
 * @return {
 *    list
 * }
 */
export function dictGetArray(params) {
    return request.get(
        url.systemSettings.dictGetArray.replace('$', params.configType)
    )
}
/**
 * 查询公共配置菜单
 * @return {
 *    list
 * }
 */
export function dictGetType() {
    return request.get(url.systemSettings.dictGetType)
}
/**
 * 根据父ID查询子配置菜单
 * @return {
 *    list
 * }
 */
export function dictGetTypeArray(params) {
    return request.get(
        url.systemSettings.dictGetTypeArray.replace('$', params.id)
    )
}
/**
 * 导出导入字典模板
 * @return {
 *    code 200
 * }
 */
export function dictExport() {
    return request.get(url.systemSettings.dictExport)
}
/*******************************全局参数配置END**************************************/
/*******************************公共接口START**************************************/
/**
 * 查询全局系统配置（不分页）
 * @param {
 *  Object: {configType: [Number|String|Array]}
 * }
 * @return {
 *  object
 * }
 */
export function configTypeQuery(params) {
    let configType =
        params.configType instanceof Array
            ? params.configType.join(',')
            : params.configType
    return request.get(
        url.systemSettings.configTypeQuery.replace('$', configType)
    )
}
/**
 * 查询全局系统配置树结构数据
 * @param {
 *  Object: {configType: [Number|String|Array]}
 * }
 * @return {
 *  object
 * }
 */
export function configTypeTreeQuery(params) {
    let configType =
        params.configType instanceof Array
            ? params.configType.join(',')
            : params.configType
    return request.get(
        url.systemSettings.configTypeTreeQuery.replace('$', configType)
    )
}
/**
 * 查询 所属系统 列表
 * @return {
 *  array
 * }
 */
export function getSystemType() {
    return request.get(url.systemSettings.getSystemType)
}
/**
 * 查询城市下拉列表（不分页）
 * @param {
 *  Object: {areaId: [Number|String]}
 * }
 * @return {
 *  array
 * }
 */
export function cityListQuery(params = {}) {
    const areaId = params.areaId || 100000 // 100000为中国areaId
    return request.get(url.systemSettings.cityListQuery.replace('$', areaId))
}

/**
 * 获取角色下拉列表
 * @return {
 *  array
 * }
 */
export function roleListQuery() {
    return request.get(url.systemSettings.roleListQuery)
}
/**
 * 获取组织下拉列表
 * @return {
 *  array
 * }
 */
export function orgListQuery(params = {}) {
    return request.get(
        url.systemSettings.orgListQuery.replace('$', params.shopNumber)
    )
}
/**
 * 获取职位下拉列表
 * @return {
 *  array
 * }
 */
export function posListQuery(params = {}) {
    return request.get(
        url.systemSettings.posListQuery.replace('$', params.shopNumber)
    )
}

/**
 * 获取设备类型列表或树 1-6(供配电、给排水、空调、电梯、能管、全部), 1/0(1:下拉，0:下拉树)
 * @return {
 *  array
 * }
 */
export function deviceTypeQuery(params = {}) {
    return request.get(
        url.systemSettings.deviceTypeQuery
            .replace('$1', params.deviceType)
            .replace('$2', params.flat)
    )
}

/*******************************公共接口END**************************************/
