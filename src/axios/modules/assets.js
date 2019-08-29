export default {
        register: '/manage/company/register', // 注册接口
        getDeviceList: '/assetManage/deviceAccount/getList',//分页查询
        addDevice: '/assetManage/deviceAccount/add',//新增资产
        getBrand: '/assetManage/deviceAccount/getBrand',//获取品牌
        getFactory: '/assetManage/deviceAccount/getFactory',//获取生产厂家
        getParamsField: '/assetManage/deviceAccount/getParamsField',//根据设备类型获取技术参数
        getInfo: '/assetManage/deviceAccount/geiInfo',//获取设备信息
        getDeviceTypeTree: '/assetManage/deviceAccount/getDeviceTypeTree',//获取设备信息
        editDevice: '/assetManage/deviceAccount/edit',//编辑
        delDevice: '/assetManage/deviceAccount/del',//删除
        getSafeTime: '/assetManage/deviceAccount/getSafeTime',//获取保修期
        // 备件信息
        queryList: '/assetManage/sparePart/queryList',//列表查询
        addParts: '/assetManage/sparePart/add',//新增'
        editParts: '/assetManage/sparePart/edit',//新增'
        delParts: '/assetManage/sparePart/del',//删除'
        getDetail: '/assetManage/sparePart/getDetail',//  获取单个配件信息详情'
        // 入库管理
        getinStorageList: '/assetManage/inStorageBill/queryList',//  列表查询'
        addStorageData: '/assetManage/inStorageBill/add',//  新增'
        getStorageDetail: '/assetManage/inStorageBill/getDetail',//  详情'
        editStorageData: '/assetManage/inStorageBill/edit',//  编辑'
        delStorageData: '/assetManage/inStorageBill/del',//  删除'
        getSparePartTree: '/assetManage/sparePart/getSparePartTree',//   获取配件信息树结构'
        // 出库管理
        getOutStorageList: '/assetManage/outStorageBill/queryList',//  列表查询'
        addOutStoraData: '/assetManage/outStorageBill/add',//  新增'
        getOutStoraDetail: '/assetManage/outStorageBill/getDetail',//  详情'
        editOutStoraData: '/assetManage/outStorageBill/edit',//  编辑'
        delOutStoraData: '/assetManage/outStorageBill/del',//  删除'

}
