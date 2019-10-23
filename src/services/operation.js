/**
 * 【运维管理】相关的业务操作
 */

import url from '../axios/url';
import request from '../axios/request';

//-------------------------------------人员管理---------------------------
/**
 * 分页查询-人员信息
 * @param {*} params
 */
export function getMemberList(params) {
    return request.post(url.operation.getMemberList, params);
}
/**
 * 获取人员信息
 * @param {*} id
 */
export function getInfo(id) {
    return request.get(url.operation.getInfo + '/' + id);
}
//-------------------------------------工单查询---------------------------
/**
 * 分页查询-维修工单
 * @param {*} params
 */
export function getRepairList(params) {
    return request.post(url.operation.getRepairList, params);
}
/**
 * 获取-维修工单
 * @param {*} params :工单ID
 */
export function getRepairBill(params) {
    return request.get(url.operation.getRepairBill + '/' + params);
}
/**
 *新增-维修工单
 * @param {*} params
 */
export function addRepairBill(params) {
    return request.post(url.operation.addRepairBill, params);
}
/**
 * 获取故障类型下拉框数据
 */
export function getRepairFaultType() {
    return request.get(url.operation.getRepairFaultType);
}
/**
 * 获取设备数
 * @param {*} shopNumber ：门店编码
 */
export function getDeviceTree(shopNumber) {
    return request.get(url.operation.getDeviceTree + '/' + shopNumber);
}
/**
 * 维修-撤单
 * @param {*} billNumber ：维修工单号
 */
export function revokeRepairBill(params) {
    return request.get(url.operation.revokeRepairBill, params);
}
/**
 * 维修-挂单
 * @param {*} billNumber ：维修工单号
 */
export function repairSuspend(params) {
    return request.get(url.operation.repairSuspend, params);
}
/**
 * 获取执行人员列表
 * @param {*} shopNumber ：门店编码
 */
export function executeList(params) {
    return request.get(url.operation.executeList, params);
}
/**
 * 维修派工
 * @param {*} params
 */
export function repairDispatch(params) {
    return request.postForm(url.operation.repairDispatch, params);
}
/**
 * 维修转单
 * @param {*} params
 */
export function repairTransfer(params) {
    return request.postForm(url.operation.repairTransfer, params);
}
/**
 * 维修审核
 * @param {*} params
 */
export function repairAudit(params) {
    return request.postForm(url.operation.repairAudit, params);
}
/**
 * 获取审核原因
 * @param {*} params
 */
export function getCheckMsg(params) {
    return request.postForm(url.operation.getCheckMsg, params);
}
/**
 * 获取设备位置
 * @param {*} deviceIdAndType
 */
export function getDeviceLocation(deviceIdAndType) {
    return request.get(url.operation.getDeviceLocation + '/' + deviceIdAndType);
}
//-------------------------保养工单-------------------------
/**
 * 保养工单列表-分页
 * @param {*} params
 */
export function getMaintainBillList(params) {
    return request.post(url.operation.getMaintainBillList, params);
}
/**
 * 获取工单详情
 * @param {*} billId
 */
export function getMaintainBillInfo(billId) {
    return request.get(url.operation.getMaintainBillInfo + '/' + billId);
}
/**
 * 获取设备参数列表
 * @param {*} params
 */
export function getMaintainParamList(params) {
    return request.get(url.operation.getMaintainParamList, params);
}
/**
 * 派工
 * @param {*} params
 */
export function maintainDispatch(params) {
    return request.postForm(url.operation.maintainDispatch, params);
}
/**
 * 保养审核
 * @param {*} params
 */
export function maintainAudit(params) {
    return request.post(url.operation.maintainAudit, params);
}
/**
 * 获取审核原因
 * @param {*} billNumber
 */
export function getMaintainAuditMsg(billNumber) {
    return request.get(url.operation.getMaintainAuditMsg + '/' + billNumber);
}
/**
 * 撤单
 * @param {*} params
 */
export function revokeMaintainBill(params) {
    return request.get(url.operation.revokeMaintainBill, params);
}
//-------------------------巡检工单-------------------------
/**
 * 巡检工单分页查询
 * @param {*} params
 */
export function getCheckBillList(params) {
    return request.post(url.operation.getCheckBillList, params);
}
/**
 * 获取巡检工单详情
 * @param {*} checkId
 */
export function getCheckInfo(checkId) {
    return request.get(url.operation.getCheckInfo + '/' + checkId);
}
/**
 * 获取设备参数列表
 * @param {*} params
 */
export function getCheckParamList(params) {
    return request.get(url.operation.getCheckParamList, params);
}
/**
 * 巡检工单-撤单
 * @param {*} params
 */
export function revokeCheckBill(params) {
    return request.get(url.operation.revokeCheckBill, params);
}
/**
 * 巡检派工
 * @param {*} params
 */
export function checkDispatch(params) {
    return request.postForm(url.operation.checkDispatch, params);
}
/**
 * 巡检工单审核
 * @param {*} params
 */
export function checkAudit(params) {
    return request.post(url.operation.checkAudit, params);
}
/**
 * 获取审核原因
 * @param {*} billNumber
 */
export function getCheckAuditMsg(billNumber) {
    return request.get(url.operation.getCheckAuditMsg + '/' + billNumber);
}
/**
 * 获取审核原因
 * @param {*} billNumber
 */
export function getLikeBill(params) {
    return request.get(url.operation.getLikeBill, params);
}
//-------------------------------------保养标准---------------------------
/**
 * 获取单位下拉框数据
 */
export function getUnit() {
    return request.get(url.operation.getUnit);
}
/**
 * 获取设备类型树
 */
export function getDeviceTypeTree() {
    return request.get(url.operation.getDeviceTypeTree);
}
/**
 * 保养标准分页查询
 * @param {*} params
 */
export function maintainStandardList(params) {
    return request.post(url.operation.maintainStandardList, params);
}
/**
 * 添加保养标准
 * @param {*} params
 */
export function addMaintainStandard(params) {
    return request.post(url.operation.addMaintainStandard, params);
}
/**
 * 获取保养标准详情
 * @param {*} id
 */
export function getMaintainStandardInfo(id) {
    return request.get(url.operation.getMaintainStandardInfo + '/' + id);
}
/**
 * 编辑保养标准
 * @param {*} params
 */
export function editMaintainStandard(params) {
    return request.post(url.operation.editMaintainStandard, params);
}
/**
 * 删除保养标准
 * @param {*} id
 */
export function delMaintainStandard(id) {
    return request.get(url.operation.delMaintainStandard + '/' + id);
}
//-------------------------------------巡检标准---------------------------
/**
 * 巡检标准分页查询
 * @param {*} params
 */
export function checkStandardList(params) {
    return request.post(url.operation.checkStandardList, params);
}
/**
 * 添加巡检标准
 * @param {*} params
 */
export function addCheckStandard(params) {
    return request.post(url.operation.addCheckStandard, params);
}
/**
 * 获取巡检标准详情
 * @param {*} id
 */
export function getCheckStandardInfo(id) {
    return request.get(url.operation.getCheckStandardInfo + '/' + id);
}
/**
 * 编辑巡检标准
 * @param {*} params
 */
export function editCheckStandard(params) {
    return request.post(url.operation.editCheckStandard, params);
}
/**
 * 删除巡检标准
 * @param {*} id
 */
export function delCheckStandard(id) {
    return request.get(url.operation.delCheckStandard + '/' + id);
}
//-------------------------------------保养模板---------------------------
/**
 * 添加保养模板
 * @param {*} params
 */
export function addMaintainTemplate(params) {
    return request.post(url.operation.addMaintainTemplate, params);
}
/**
 * 保养模板分页列表
 * @param {*} params
 */
export function maintainTemplateList(params) {
    return request.post(url.operation.maintainTemplateList, params);
}
/**
 * 根据设备类型获取参数列表
 * @param {*} params
 */
export function getMaintainStandardParamList(params) {
    return request.post(url.operation.getMaintainStandardParamList, params);
}
/**
 * 获取保养模板参数列表
 */
export function getMaintainParam(templateNumber) {
    return request.get(url.operation.getMaintainParam + '/' + templateNumber);
}
/**
 * 删除保养模板
 * @param {*} templateNumber
 */
export function deleteMaintainTemplate(templateNumber) {
    return request.get(
        url.operation.deleteMaintainTemplate + '/' + templateNumber
    );
}
/**
 * 获取保养周期下拉框数据
 * @param {*} shopNumber
 */
export function getMaintainCycleSelected(shopNumber) {
    return request.get(
        url.operation.getMaintainCycleSelected + '/' + shopNumber
    );
}
//-------------------------------------巡检模板---------------------------
/**
 * 添加巡检模板
 * @param {*} params
 */
export function addCheckTemplate(params) {
    return request.post(url.operation.addCheckTemplate, params);
}
/**
 * 巡检模板分页列表
 * @param {*} params
 */
export function checkTemplateList(params) {
    return request.post(url.operation.checkTemplateList, params);
}
/**
 * 获取巡检模板参数列表
 */
export function getCheckParam(templateNumber) {
    return request.get(url.operation.getCheckParam + '/' + templateNumber);
}
/**
 * 根据设备类型获取参数列表
 * @param {*} params
 */
export function getCheckStandardParamList(params) {
    return request.post(url.operation.getCheckStandardParamList, params);
}
/**
 * 获取巡检周期下拉框数据
 * @param {*} shopNumber
 */
export function getCheckCycleSelected(shopNumber) {
    return request.get(url.operation.getCheckCycleSelected + '/' + shopNumber);
}
/**
 * 删除巡检模板
 * @param {*} templateNumber
 */
export function deleteCheckTemplate(templateNumber) {
    return request.get(
        url.operation.deleteCheckTemplate + '/' + templateNumber
    );
}
//-------------------------------------保养计划---------------------------
/**
 * 新增保养计划
 * @param {*} params
 */
export function addMaintainPlan(params) {
    return request.post(url.operation.addMaintainPlan, params);
}
/**
 * 预览
 * @param {*} params
 */
export function previewMaintainPlan(params) {
    return request.post(url.operation.previewMaintainPlan, params);
}
/**
 * 获取保养设备列表
 * @param {*} params
 */
export function getMaintainDeviceList(params) {
    return request.get(url.operation.getMaintainDeviceList, params);
}
/**
 * 获取设备所属模板
 * @param {*} params
 */
export function getMaintainTemplateByDevice(params) {
    return request.post(url.operation.getMaintainTemplateByDevice, params);
}
/**
 * 保养计划分页列表
 * @param {*} params
 */
export function maintainPlanPageList(params) {
    return request.post(url.operation.maintainPlanPageList, params);
}
/**
 * 计划核查
 * @param {*} shopNumber
 */
export function maintainPlanAudit(shopNumber) {
    return request.get(url.operation.maintainPlanAudit + '/' + shopNumber);
}
/**
 * 保养计划详情
 * @param {*} id
 */
export function getMaintainPlanInfo(id) {
    return request.get(url.operation.maintainPlanInfo + '/' + id);
}
/**
 * 编辑页面预览
 * @param {*} params
 */
export function getMaintainEditPreView(params) {
    return request.get(url.operation.getMaintainEditPreView, params);
}
/**
 * 查看已投计划
 * @param {*} params
 */
export function getMaintainListByDevice(params) {
    return request.get(url.operation.getMaintainListByDevice, params);
}
/**
 * 保养计划编辑
 * @param {*} params
 */
export function editMaintainPlan(params) {
    return request.post(url.operation.editMaintainPlan, params);
}
/**
 * 删除保养计划
 * @param {} id
 */
export function delMaintainPlan(id) {
    return request.get(url.operation.delMaintainPlan + '/' + id);
}
/**
 * 立即生成前查询
 * @param {*} params
 */
export function beforeGenerateMaintainBill(params) {
    return request.post(url.operation.beforeGenerateMaintainBill, params);
}
/**
 * 立即生成
 * @param {*} params
 */
export function generateMaintainBill(params) {
    return request.post(url.operation.generateMaintainBill, params);
}
//-------------------------------------巡检计划---------------------------
/**
 * 分页查询
 * @param {*} params
 */
export function checkPlanPageList(params) {
    return request.post(url.operation.checkPlanPageList, params);
}
/**
 * 获取设备列表
 * @param {*} params
 */
export function getDeviceList(params) {
    return request.get(url.operation.getDeviceList, params);
}
/**
 * 获取设备所属模板
 * @param {*} params
 */
export function getTemplateByDevice(params) {
    return request.post(url.operation.getTemplateByDevice, params);
}
/**
 * 新增巡检计划
 * @param {*} params
 */
export function addCheckPlan(params) {
    return request.post(url.operation.addCheckPlan, params);
}
/**
 * 获取设备巡检计划列表
 * @param {*} params
 */
export function getListByDevice(params) {
    return request.get(url.operation.getListByDevice, params);
}
/**
 * 编辑巡检计划
 * @param {*} params
 */
export function editCheckPlan(params) {
    return request.post(url.operation.editCheckPlan, params);
}
/**
 * 删除巡检计划
 * @param {*} id
 */
export function deleteCheckPlan(id) {
    return request.get(url.operation.deleteCheckPlan + '/' + id);
}
/**
 * 获取巡检计划信息
 * @param {*} id
 */
export function getCheckPlanInfo(id) {
    return request.get(url.operation.getCheckPlanInfo + '/' + id);
}
/**
 * 立即生成巡检计划
 * @param {*} params
 */
export function generateCheckBill(params) {
    return request.post(url.operation.generateCheckBill, params);
}
/**
 * 立即生成前查询
 * @param {*} params
 */
export function beforeGenerateCheckBill(params) {
    return request.post(url.operation.beforeGenerateCheckBill, params);
}
//-----------------------------------运维统计------------------------------
/**
 * 运维统计-维修工单
 * @param {*} params
 */
export function getBillCharts(params) {
    return request.post(url.operation.getBillCharts, params);
}
/**
 * 统计-巡检保养完成情况
 * @param {*} params
 */
export function getCheckBillCharts(params) {
    return request.post(url.operation.getCheckBillCharts, params);
}
//-------------------------------------排班管理---------------------------
/**
 * 获取班次信息
 */
export function getShopClasses(shopNumber) {
    return request.get(url.operation.getShopClasses + '/' + shopNumber);
}
/**
 * 编辑班次信息
 * @param {*} params
 */
export function editClasses(params) {
    return request.post(url.operation.editClasses, params);
}
/**
 * 获取排班信息
 * @param {*} params
 */
export function getMemberClasses(params) {
    return request.get(url.operation.getMemberClasses, params);
}
/**
 * 获取已排班月份
 * @param {*} shopNumber
 */
export function getClassesMonth(shopNumber) {
    return request.get(url.operation.getClassesMonth + '/' + shopNumber);
}
/**
 * 获取班次选项
 * @param {*} shopNumber
 */
export function getClassesTitle(shopNumber) {
    return request.get(url.operation.getClassesTitle + '/' + shopNumber);
}
/**
 * 设置排班信息
 * @param {*} params
 */
export function editMemberClasses(params) {
    return request.post(url.operation.editMemberClasses, params);
}
/**
 * 获取部门下拉框数据
 */
export function getDepartSelected() {
    return request.get(url.operation.getDepartSelected);
}
/**
 * 获取人员排班信息
 * @param {*} params
 */
export function getInfoClasses(params) {
    return request.get(url.operation.getInfoClasses, params);
}
