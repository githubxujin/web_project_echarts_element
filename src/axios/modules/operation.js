const pre = '/maintainManage';
export default {
    //-------------------------人员管理-------------------------
    getMemberList: pre + '/member/getMemberList', //分页查询-人员信息
    memberAdd: pre + '/member/add', //新增-人员信息
    memberEdit: pre + '/member/edit', //编辑-人员信息
    getInfo: pre + '/member/getInfo', //获取-人员信息 /{id}
    getExecuteDepartList: pre + '/member/getExecuteDepartList', //获取转单人员列表

    //********************* 工单查询 ****************************
    //-------------------------维修工单-------------------------
    getRepairList: pre + '/repairBill/getRepairList', //分页查询-维修工单
    addRepairBill: pre + '/repairBill/add', //新增-维修工单
    getRepairBill: pre + '/repairBill/getInfo', //获取-维修工单 /{repairId}
    getRepairFaultType: pre + '/repairBill/getFaultType', //获取故障类型下拉框数据
    getDeviceTree: pre + '/repairBill/getDeviceTree', // 获取设备树/{shopNumber}
    revokeRepairBill: pre + '/repairBill/revoke', // 撤单/{billNumber}
    executeList: pre + '/member/executeList', //获取执行人员列表 /{shopNumber}

    repairTransfer: pre + '/repairBill/change', // 转单
    repairDispatch: pre + '/repairBill/dispatch', //派工
    repairAudit: pre + '/repairBill/check', //审核
    getCheckMsg: pre + '/repairBill/getCheckMsg', // 获取审核原因
    repairSuspend: pre + '/repairBill/suspend', // 挂单
    getDeviceLocation: pre + '/repairBill/getDeviceLocation', ///{deviceIdAndType}获取设备位置

    //-------------------------保养工单-------------------------
    getMaintainBillList: pre + '/maintainBill/getMaintainBillList', //分页查询
    getMaintainBillInfo: pre + '/maintainBill/getInfo', ///{billId}获取工单详情
    getMaintainParamList: pre + '/maintainBill/getParamList', //获取设备参数列表
    revokeMaintainBill: pre + '/maintainBill/revoke', //撤单
    maintainDispatch: pre + '/maintainBill/dispatch', //派工
    maintainAudit: pre + '/maintainBill/check', //审核
    getMaintainAuditMsg: pre + '/maintainBill/getCheckMsg', ///{billNumber}获取审核原因

    //-------------------------巡检工单-------------------------
    getCheckBillList: pre + '/checkBill/getCheckBillList', //分页查询
    getCheckInfo: pre + '/checkBill/getInfo/', //{checkId}获取工单详情
    getCheckParamList: pre + '/checkBill/getParamList', // 获取设备参数列表
    revokeCheckBill: pre + '/checkBill/revoke', //撤单
    checkDispatch: pre + '/checkBill/dispatch', //派工
    checkAudit: pre + '/checkBill/check', //审核
    getCheckAuditMsg: pre + '/checkBill/getCheckMsg', ///{billNumber}获取审核原因

    //-------------------------保养标准-------------------------
    getUnit: pre + '/checkStandard/getUnit', // 获取单位下拉框数据
    getDeviceTypeTree: pre + '/checkStandard/getDeviceTypeTree', // 获取设备类型树
    maintainStandardList: pre + '/maintainStandard/getList', //分页查询
    addMaintainStandard: pre + '/maintainStandard/add ', //新增
    getMaintainStandardInfo: pre + '/maintainStandard/getInfo', ///{id}详情
    editMaintainStandard: pre + '/maintainStandard/edit', //编辑
    delMaintainStandard: pre + '/maintainStandard/del', ///{id}删除

    //-------------------------巡检标准-------------------------
    addCheckStandard: pre + '/checkStandard/add', // 新增
    delCheckStandard: pre + '/checkStandard/del', ///{id}删除
    editCheckStandard: pre + '/checkStandard/edit', //编辑
    getCheckStandardInfo: pre + '/checkStandard/getInfo', ///{id}详情
    checkStandardList: pre + '/checkStandard/getList', //分页查询

    //-------------------------保养模板-------------------------
    addMaintainTemplate: pre + '/maintainTemplate/add', //新增
    maintainTemplateList: pre + '/maintainTemplate/getList', // 分页查询
    getMaintainParam: pre + '/maintainTemplate/getParam', ///{templateNumber}获取模板参数列表
    getMaintainStandardParamList: pre + '/maintainStandard/getListByDeviceType', // 根据设备类型获取参数列表
    deleteMaintainTemplate: pre + '/maintainTemplate/delete', ///{templateNumber}删除
    getMaintainCycleSelected: pre + '/maintainTemplate/getCycleSelected', ///{shopNumber}获取保养周期下拉框数据

    //-------------------------巡检模板-------------------------
    addCheckTemplate: pre + '/checkTemplate/add', //新增
    checkTemplateList: pre + '/checkTemplate/getList', // 分页查询
    getCheckParam: pre + '/checkTemplate/getParam', ///{templateNumber}获取模板参数列表
    getCheckStandardParamList: pre + '/checkStandard/getListByDeviceType', // 根据设备类型获取参数列表
    getCheckCycleSelected: pre + '/checkTemplate/getCycleSelected', //{shopNumber} 获取巡检周期下拉框数据
    deleteCheckTemplate: pre + '/checkTemplate/delete', ///{templateNumber}删除巡检模板

    //-------------------------保养计划-------------------------
    addMaintainPlan: pre + '/maintainPlan/add', // 新增
    previewMaintainPlan: pre + '/maintainPlan/preview', //预览
    getMaintainDeviceList: pre + '/maintainPlan/getDeviceList', //获取保养设备列表
    getMaintainTemplateByDevice: pre + '/maintainPlan/getTemplateByDevice', //获取设备所属模板
    maintainPlanPageList: pre + '/maintainPlan/getList', //列表
    maintainPlanAudit: pre + '/maintainPlan/checked', ///{shopNumber}计划核查
    getMaintainEditPreView: pre + '/maintainPlan/getEditPreView', //编辑页面预览
    maintainPlanInfo: pre + '/maintainPlan/getInfo', ///{id}详情
    getMaintainListByDevice: pre + '/maintainPlan/getListByDevice', //查看已投计划
    editMaintainPlan: pre + '/maintainPlan/edit', //编辑
    delMaintainPlan: pre + '/maintainPlan/delete', //{id}删除
    beforeGenerateMaintainBill:
        pre + '/maintainPlan/beforeGenerateMaintainBill', // 立即生成前查询
    generateMaintainBill: pre + '/maintainPlan/generateMaintainBill', //立即生成

    //-------------------------巡检计划-------------------------
    checkPlanPageList: pre + '/checkPlan/getList', //分页查询
    getDeviceList: pre + '/checkPlan/getDeviceList', //获取设备列表
    getTemplateByDevice: pre + '/checkPlan/getTemplateByDevice', //获取设备所属模板
    addCheckPlan: pre + '/checkPlan/add', //新增
    getListByDevice: pre + '/checkPlan/getListByDevice', //获取设备巡检计划列表
    editCheckPlan: pre + '/checkPlan/edit', //编辑
    deleteCheckPlan: pre + '/checkPlan/delete', ///{id}删除
    getCheckPlanInfo: pre + '/checkPlan/getInfo', ///{id}获取巡检计划信息
    generateCheckBill: pre + '/checkPlan/generateCheckBill', //立即生成
    beforeGenerateCheckBill: pre + '/checkPlan/beforeGenerateCheckBill', //立即生成前查询

    //-------------------------运维统计-------------------------
    getBillCharts: pre + '/repairBill/getBillCharts', //运维统计-维修工单
    getCheckBillCharts: pre + '/checkBill/getCheckBillCharts', // 统计-巡检保养完成情况

    //-------------------------人员管理-------------------------
    getShopClasses: pre + '/member/getShopClasses', ///{shopNumber}获取班次信息
    editClasses: pre + '/member/editClasses', // 编辑班次信息
    getMemberClasses: pre + '/member/getMemberClasses', // 获取排班信息
    getClassesMonth: pre + '/member/getClassesMonth', ///{shopNumber}获取已排班月份
    getClassesTitle: pre + '/member/getClassesTitle', ///{shopNumber}获取班次选项
    editMemberClasses: pre + '/member/editMemberClasses', //设置排班信息
    getDepartSelected: pre + '/member/getDepartSelected', // 获取部门下拉框数据
    getInfoClasses: pre + '/member/getInfoClasses' // 获取人员排班信息
};
