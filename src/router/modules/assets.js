// 资产管理
const assetsRouter = {
    path: '/assets',
    component: resolve =>
        require(['@/components/layout/shop/home.vue'], resolve),
    // redirect: '/assets/equ-accounts',
    name: 'assets',
    meta: {
        title: '资产管理'
    },
    children: [
        {
            name: 'deviceinfo',
            path: '/assets/equ-accounts',
            component: () => import('@/views/assets/equ-accounts/index.vue'),
            meta: {
                title: '设备信息库'
            }
        },
        {
            name: 'partsinfo',
            path: '/assets/partsinfo',
            component: () => import('@/views/assets/parts-infomation/index.vue'),
            meta: {
                title: '备件信息'
            }
        },
        {
            name: 'storagemanagement',
            path: '/assets/storage-management',
            component: () => import('@/views/assets/storage-management/index.vue'),
            meta: {
                title: '入库管理'
            }
        },
        {
            name: 'warehousemanagement',
            path: '/assets/warehouse-management',
            component: () => import('@/views/assets/warehouse-management/index.vue'),
            meta: {
                title: '出库管理'
            }
        }
    ]
};
export default assetsRouter;
