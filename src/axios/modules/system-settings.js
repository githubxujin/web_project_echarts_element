const prefix = '/system-setting'
export default {
    // 集团跳转门店
    shopLogin: prefix + '/index/shopLogin', // 集团用户跳转门店获取用户权限数据
    generateToken: prefix + '/index/generateToken', // 集团用户生成获取门店权限的凭证
    // 注册接口
    register: '/manage/company/register',
    // 基础设置-用户管理
    adminAdd: prefix + '/admin/add', // 新增-用户信息
    adminDelete: prefix + '/admin/delete/$', // 删除-用户信息
    adminEdit: prefix + '/admin/edit', // 编辑-用户信息
    adminGetInfo: prefix + '/admin/getInfo/$', //获取用户详细信息
    adminQueryList: prefix + '/admin/getList', // 分页查询-用户信息
    adminResetPwd: prefix + '/admin/resetPwd/$', // 重置密码

    // 基础设置-门店管理
    shopGetInfo: prefix + '/shop/getInfo/$', // 获取门店详情
    shopEdit: prefix + '/shop/edit', // 编辑门店信息
    shopPictureQuery: prefix + '/shop/getPictureList/$', // 获取门店图片信息
    shopPictureAdd: prefix + '/shop/addPicture', // 新增门店图片信息
    shopPictureDelete: prefix + '/shop/deletePicture', // 删除门店图片信息
    shopPictureEdit: prefix + '/shop/editPicture', // 编辑门店图片信息
    electrovalenceQuery: prefix + '/electrovalence/getElectrovalenceInfo/$', // 查询分时电价信息
    electrovalenceEdit: prefix + '/electrovalence/edit', // 分时电价-编辑
    dutyChartQuery: prefix + '/workTime/getList/$', // 值班时间查询
    dutyChartSave: prefix + '/workTime/save', // 值班时间编辑保存

    // 基础设置-自定义报警
    alarmAdd: prefix + '/alarmCondition/add', // 新增-自定义报警信息
    alarmDelete: prefix + '/alarmCondition/del', // 删除-自定义报警信息
    alarmEdit: prefix + '/alarmCondition/edit', // 编辑-自定义报警信息
    alarmEditBatch: prefix + '/alarmCondition/editBatch', // 批量编辑-自定义报警信息
    alarmGetInfo: prefix + '/alarmCondition/getAlarmConditionInfo', //获取自定义报警详细信息
    alarmQueryList: prefix + '/alarmCondition/getAlarmConditionList', // 分页查询-自定义报警信息
    alarmDeviceTreeQuery: prefix + '/alarmCondition/getDeviceTree', // 获取设备下拉树
    alarmParameterQuery: prefix + '/alarmCondition/getParameter', // 获取参数列表
    alarmDeviceTreeSelectiveQuery:
        prefix + '/alarmCondition/getDeviceTreeSelective/$', // 查询条件-获取设备下拉树
    alarmAdminListQuery: prefix + '/alarmCondition/getAdminList/$', // 获取推送人员列表
    alarmPointMappingQuery: prefix + '/alarmCondition/getPointMapping', // 获取参数映射
    alarmGetDevicePicture: prefix + '/alarmCondition/getDevicePicture', // 获取设备图片

    // 配置信息-支路信息
    meterQuery: prefix + '/meter/getList', // 获取支路列表
    meterAdd: prefix + '/meter/add', // 新增支路
    meterEdit: prefix + '/meter/edit', // 编辑支路
    meterGetInfo: prefix + '/meter/getInfo/$', // 获取换表详情
    meterGetEnergyHTypeArray: prefix + '/meter/getEnergyHTypeArray', // 获取能耗类型下拉树
    meterGetHistory: prefix + '/meter/getHistory/$', // 换表历史-支路信息
    meterImport: prefix + '/meter/import', // 导入-支路信息
    meterTrade: prefix + '/meter/tradeMeter', //换表-支路信息
    meterGetArray: prefix + '/meter/getArray/$', // 获取支路列表
    meterGetArrayByType: prefix + '/meter/getArray', // 获取支路列表
    meterArray: prefix + '/meter/getArray', // 根据设备类型获取支路列表
    meterGetTreeArray: prefix + '/meter/getMeterTree/$', // 获取支路下拉树

    // 配置信息-分项管理
    subentryQuery: prefix + '/subentry/getList', // 分项列表查询
    subentryEdit: prefix + '/subentry/edit', // 编辑分项信息
    subentryAdd: prefix + '/subentry/add', // 新增分项
    subentryAddOne: prefix + '/subentry/addOne', // 新增分项
    subentryGetArray: prefix + '/subentry/getArray', // 获取分项列表
    subentryGetTreeArray: prefix + '/subentry/getTreeArray/$', // 获取分项下拉树
    subentryGetTemplateTreeArray: prefix + '/subentry/getSubentryTemplateTree', // 获取系统分项模板树

    // 配置信息-变压器管理
    transformerQuery: prefix + '/transformer/getList', // 获取变压器列表
    transformerAdd: prefix + '/transformer/add', // 新增变压器
    transformerEdit: prefix + '/transformer/edit', // 编辑变压器
    transformerGetArray: prefix + '/transformer/getArray/$', // 获取所有变压器

    // 配置信息-采集器管理
    collectorQuery: prefix + '/collector/getList', // 采集器列表查询
    collectorGetInfo: prefix + '/collector/getInfo/$', // 采集器详情查询
    collectorAdd: prefix + '/collector/add', // 新增采集器
    collectorEdit: prefix + '/collector/edit', // 编辑采集器信息
    collectorGetArray: prefix + '/collector/getArray/$', // 获取所有采集器
    collectorGetPort: prefix + '/collector/getCollectorPort/$', // 获取采集器对应端口列表

    // 配置信息-表计参数
    tachometerQuery: prefix + '/tachometer/getList', // 表计参数列表查询
    tachometerGetInfo: prefix + '/tachometer/getInfo/$', // 表计参数详情查询
    tachometerAdd: prefix + '/tachometer/add', // 新增表计参数
    tachometerDelete: prefix + '/tachometer/delete/$', // 删除表计参数
    tachometerEdit: prefix + '/tachometer/edit', // 编辑表计参数信息
    tachometerGetArray: prefix + '/tachometer/getTachometerArray/$1/$2', // 根据计量设备类型获取表计列表
    tachometerGetMappingArray: prefix + '/tachometer/getMappingArray', // 获取表计默认枚举列表

    // 配置信息-冷站参数
    pointTableQuery: prefix + '/pointTable/getList', // 冷站参数列表查询
    pointTableAdd: prefix + '/pointTable/add', // 新增冷站参数
    pointTableDelete: prefix + '/pointTable/delete/$', // 删除冷站参数
    pointTableEdit: prefix + '/pointTable/edit', // 编辑冷站参数信息
    pointTableGetArray: prefix + '/pointTable/getArray/$', // 获取冷站参数列表
    pointTableGetInfo: prefix + '/pointTable/getInfo/$', // 获取冷站参数详情

    // 配置信息-点表映射
    pointTableMapQuery: prefix + '/pointTableMap/getList', // 点表映射列表查询
    pointTableMapAdd: prefix + '/pointTableMap/add', // 新增点表映射
    pointTableMapDelete: prefix + '/pointTableMap/delete/$', // 删除点表映射
    pointTableMapEdit: prefix + '/pointTableMap/edit', // 编辑点表映射信息

    // 配置信息-配电参数
    powerDistributionMeterQuery: prefix + '/powerDistributionMeter/getList', //配电参数列表查询
    powerDistributionMeterAdd: prefix + '/powerDistributionMeter/add', // 新增配电参数
    powerDistributionMeterEdit: prefix + '/powerDistributionMeter/edit', // 编辑配电参数信息
    powerDistributionMeterGetInfo: prefix + '/powerDistributionMeter/getInfo/$', // 获取配电参数详情
    // 配置信息-给排水设备
    drainageQuery: prefix + '/drainage/getList', // 给排水设备列表查询
    drainageAdd: prefix + '/drainage/add', // 新增给排水设备
    drainageDelete: prefix + '/drainage/delete/$', // 删除给排水设备
    drainageEdit: prefix + '/drainage/edit', // 编辑给排水设备信息
    drainageGetArray: prefix + '/drainage/getArray', // 获取给排水设备列表
    drainageGetTreeArray: prefix + '/drainage/getTreeArray/$', // 获取给排水设备树

    // 配置信息-给排水参数
    drainagePointTableQuery: prefix + '/drainagePointTable/getList', // 给排水参数列表查询
    drainagePointTableAdd: prefix + '/drainagePointTable/add', // 新增给排水参数
    drainagePointTableDelete: prefix + '/drainagePointTable/delete/$', // 删除给排水参数
    drainagePointTableEdit: prefix + '/drainagePointTable/edit', // 编辑给排水参数信息
    drainagePointTableGetInfo: prefix + '/drainagePointTable/getInfo/$', // 获取给排水参数详情

    // 配置信息-冷站设备
    coolingStationQuery: prefix + '/coolingStation/getList', // 冷站设备列表查询
    coolingStationAdd: prefix + '/coolingStation/add', // 新增冷站设备
    coolingStationDelete: prefix + '/coolingStation/delete/$', // 删除冷站设备
    coolingStationEdit: prefix + '/coolingStation/edit', // 编辑冷站设备信息
    coolingStationGetArray: prefix + '/coolingStation/getArray/$', // 获取冷站设备列表
    coolingStationGetMeterList: prefix + '/coolingStation/getMeterList/$', // 获取冷站设备支路列表

    // 配置信息-电梯管理
    elevatorQuery: prefix + '/elevator/getList', // 电梯列表查询
    elevatorAdd: prefix + '/elevator/add', // 新增电梯
    elevatorDelete: prefix + '/elevator/delete/$', // 删除电梯
    elevatorEdit: prefix + '/elevator/edit', // 编辑电梯信息

    // 配置信息-监控页面配置
    monitorQuery: prefix + '/monitor/getList', // 监控页面配置列表查询
    monitorGetInfo: prefix + '/monitor/getInfo/$', // 监控页面配置详情查询
    monitorAdd: prefix + '/monitor/add', // 新增监控页面配置
    monitorDelete: prefix + '/monitor/delete/$', // 删除监控页面配置
    monitorEdit: prefix + '/monitor/edit', // 编辑监控页面配置信息
    monitorPictureQuery: prefix + '/monitor/getPicture', // 获取监控页面背景图片
    getAllSump: prefix + '/drainage/getAllSump', ///{shopNumber} 获取所有集水井
    saveSumpPosition: prefix + '/drainage/saveSumpPosition', //更新集水井位置 Post
    getSumpPosition: prefix + '/monitor/getSumpPosition', //获取所有集水井位置  Get /monitor/getSumpPosition/{id}

    // 配置信息-全局参数设置
    dictAdd: prefix + '/system/addCfg', // 全局系统设置-新增配置
    dictDelete: prefix + '/system/deleteCfg/$', // 全局系统设置-删除配置
    dictEdit: prefix + '/system/editCfg', // 全局系统配置-编辑配置
    dictExport: prefix + '/system/exportTemplate', // 全局系统配置-配置导出
    dictGetArray: prefix + '/system/getArray/$', // 全局系统配置-查询配置(不分页)
    dictQuery: prefix + '/system/getList', // 全局系统配置-列表查询配置
    dictGetType: prefix + '/system/getType', // 全局系统设置-查询公共配置菜单
    dictGetTypeArray: prefix + '/system/getTypeArray/$', // 全局系统设置-根据父ID查询子配置菜单
    dictImport: prefix + '/system/import', // 全局系统配置-配置导入

    // 视频监控管理
    videoMonitorQuery: prefix + '/videoMonitor/getList', // 视频监控-查询列表
    videoMonitorEdit: prefix + '/videoMonitor/edit', // 视频监控-编辑
    videoMonitorSave: prefix + '/videoMonitor/add', // 视频监控-保存
    videoMonitorArray: prefix + '/videoMonitor/getArray', // 视频监控-下拉数据
    videoMonitorUrl: '/video/push/getRtmpVideoUrl', // 视频监控-视频路径
    videoMonitorKey: prefix + '/videoMonitor/getByPrimaryKey/$', // 视频监控-根据主键获取信息

    // 全局接口
    configTypeQuery: prefix + '/system/getArray/$', // 查询全局系统配置（不分页）
    configTypeTreeQuery: prefix + '/system/getTreeArray/$', // 查询全局系统配置树结构数据
    cityListQuery: prefix + '/addr/getCityList/$', // 获取城市列表接口
    roleListQuery: prefix + '/admin/getRoleList', // 获取角色下拉列表
    orgListQuery: prefix + '/org/getOrgTree/$', // 获取门店组织架构树
    posListQuery: prefix + '/org/getPositionList/$', // 获取职位列表
    deviceTypeQuery: prefix + '/system/getDeviceType/$1/$2', // 获取设备类型列表或树 1-6(供配电、给排水、空调、电梯、能管、全部), 1/0(1:下拉，0:下拉树)
    getSystemType: prefix + '/system/getSystemType' // 获取 所属系统 列表
}
