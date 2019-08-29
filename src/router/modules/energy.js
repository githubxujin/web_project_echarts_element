// 用能管理
const energyRouter = {
    path: '/energy',
    component: resolve =>
        require(['@/components/layout/shop/home.vue'], resolve),
    // redirect: '/energy/energy-search',
    name: 'energy',
    meta: {
        title: '用能管理'
    },
    children: [
        {
            path: '/energy/energy-search',
            component: () => import('@/views/energy/energy-search/index.vue'),
            name: 'energy-search',
            meta: { title: '能耗查询' }
        },
        {
            path: '/energy/quota-manage',
            component: () => import('@/views/energy/quota-manage/index.vue'),
            name: 'quota-manage',
            meta: { title: '定额管理' }
        },
        {
            path: '/energy/load-prediction',
            component: () => import('@/views/energy/load-prediction/index.vue'),
            name: 'load-prediction',
            meta: { title: '负荷预测' }
        },
        {
            path: '/energy/energy-report',
            component: () => import('@/views/energy/energy-report/index.vue'),
            name: 'energy-report',
            meta: { title: '能耗报表' }
        }
    ]
};
export default energyRouter;
