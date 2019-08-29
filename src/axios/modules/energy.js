export default {
    getLeftTree: '/energy/energy/getLeftTree',//分项/支路树查询
    getEnergyList: '/energy/energy/getEnergyList',//能耗查询

    getYearQuota: '/energy/quota/getYearQuota',//获取月定额/实际能耗
    getTotalEnergyConsumeQuota: '/energy/quota/getTotalEnergyConsumeQuota',//累计能耗与定额比
    getQuotaDetail: '/energy/quota/getQuotaDetail',//项目定额详情
    getQuotaSetting: '/energy/quota/getQuotaSetting',//查询定额设置'
    setQuot: 'energy/quota/setQuota',//定额设置
    splitbenchmarkQuota: 'energy/quota/splitbenchmarkQuota',//定额拆分
    exportQuotaSetting: '/api/energy/quota/exportQuotaSetting',//定额设置导出
    exportQuotaDetail: '/api/energy/quota/exportQuotaDetail',//项目定额详情导出'

    getEnergyConsume: 'energy/reportForms/getEnergyConsume',// 能耗报表查询
    exportEnergyConsume: '/api/energy/reportForms/exportEnergyConsume',// 能耗报表导出

    getPredictAnalyze: 'energy/loadPredict/getPredictAnalyze',// 负荷预测分析查询
    getCurMonthEnergyQuotaRate: 'energy/loadPredict/getCurMonthEnergyQuotaRate',// 本月能耗与定额比
    energyPredict: 'energy/loadPredict/energyPredict',// 下月能耗预测

}