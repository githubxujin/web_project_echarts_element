// 运维管理
const operationRouter = {
    path: '/operation',
    component: resolve =>
        require(['@/components/layout/shop/home.vue'], resolve),
    // redirect: '/operation/repair',
    name: 'operation',
    meta: {
        title: '运维管理'
    },
    children: [
        {
            path: '/operation/bill-search',
            component: () => import('@/components/layout/Container.vue'),
            name: 'bill-search',
            meta: { title: '工单查询' },
            children: [
                {
                    path: '/operation/bill-search/repair',
                    component: () =>
                        import('@/views/operation/bill-search/repair-bill/index.vue'),
                    meta: {
                        title: '维修工单'
                    }
                },
                {
                    path: '/operation/bill-search/maintain',
                    component: () =>
                        import('@/views/operation/bill-search/maintain-bill/index.vue'),
                    meta: {
                        title: '保养工单'
                    }
                },
                {
                    path: '/operation/bill-search/check',
                    component: () =>
                        import('@/views/operation/bill-search/check-bill/index.vue'),
                    meta: {
                        title: '巡检工单'
                    }
                }
            ]
        },
        {
            path: '/operation/maintain',
            component: () => import('@/components/layout/Container.vue'),
            name: 'maintain',
            meta: { title: '保养' },
            children: [
                {
                    path: '/operation/maintain/standard',
                    component: () =>
                        import('@/views/operation/maintain/standard/index.vue'),
                    meta: {
                        title: '保养标准'
                    }
                },
                {
                    path: '/operation/maintain/maintain-template',
                    component: () =>
                        import('@/views/operation/maintain/template/index.vue'),
                    meta: {
                        title: '保养模板'
                    }
                },
                {
                    path: '/operation/maintain/range',
                    component: () =>
                        import('@/views/operation/maintain/range/index.vue'),
                    meta: {
                        title: '保养计划'
                    }
                }
            ]
        },
        {
            path: '/operation/check',
            component: () => import('@/components/layout/Container.vue'),
            name: 'check',
            meta: { title: '巡检' },
            children: [
                {
                    path: '/operation/check/standard',
                    component: () =>
                        import('@/views/operation/check/standard/index.vue'),
                    meta: {
                        title: '巡检标准'
                    }
                },
                {
                    path: '/operation/check/check-template',
                    component: () =>
                        import('@/views/operation/check/template/index.vue'),
                    meta: {
                        title: '巡检模板'
                    }
                },
                {
                    path: '/operation/check/range',
                    component: () =>
                        import('@/views/operation/check/range/index.vue'),
                    meta: {
                        title: '巡检计划'
                    }
                }
            ]
        },
        {
            path: '/operation/total',
            component: () => import('@/components/layout/Container.vue'),
            meta: { title: '运维统计' },
            children: [
                {
                    path: '/operation/total/repair',
                    component: () =>
                        import('@/views/operation/total/Repair.vue'),
                    meta: {
                        title: '维修任务完成情况'
                    }
                },
                {
                    path: '/operation/total/check-maintain',
                    component: () =>
                        import('@/views/operation/total/CheckMaintain.vue'),
                    meta: {
                        title: '巡检保养完成情况'
                    }
                }
            ]
        },
        {
            path: '/operation/member',
            component: () => import('@/components/layout/Container.vue'),
            meta: { title: '人员管理' },
            children: [
                {
                    path: '/operation/member/member-list',
                    component: () =>
                        import('@/views/operation/member/MemberList.vue'),
                    meta: {
                        title: '人员管理'
                    }
                },
                {
                    path: '/operation/member/scheduling',
                    component: () =>
                        import('@/views/operation/member/scheduling/index.vue'),
                    meta: {
                        title: '排班管理'
                    }
                }
            ]
        }
    ]
};
export default operationRouter;
