// 安全管理
const safetyRouter = {
    path: '/safety',
    component: resolve =>
        require(['@/components/layout/shop/home.vue'], resolve),
    name: 'safety',
    meta: {
        title: '安全管理'
    },
    children: [
        {
            path: '/safety/power-sys',
            component: () => import('@/views/safety/power-sys/index.vue'),
            meta: {
                title: '供配电系统'
            }
        },
        {
            path: '/safety/drainage',
            component: () => import('@/components/layout/Container.vue'),
            meta: {
                title: '给排水系统'
            },
            children: [
                {
                    path: '/safety/drainage/suppley-water',
                    component: () =>
                        import('@/views/safety/drainage/supply-water/SupplyWater.vue'),
                    meta: {
                        title: '给水系统'
                    }
                },
                {
                    path: '/safety/drainage/out-water',
                    component: () =>
                        import('@/views/safety/drainage/out-water/Plane.vue'),
                    meta: {
                        title: '排水系统'
                    }
                }
            ]
        },
        {
            path: '/safety/air-sys',
            component: () => import('@/components/layout/Container.vue'),
            meta: {
                title: '空调系统'
            },
            children: [
                {
                    path: '/safety/air-sys/air-condition-monitoring',
                    component: () =>
                        import('@/views/safety/air-sys/AirConditionMonitoring.vue'),
                    meta: {
                        title: '空调示意图'
                    }
                }
            ]
        },
        {
            path: '/safety/elevator-sys',
            component: () => import('@/views/safety/elevator-sys/index.vue'),
            meta: {
                title: '电梯系统'
            }
        },
        {
            path: '/safety/communication',
            component: () => import('@/views/safety/communication/index.vue'),
            meta: {
                title: '通讯监测'
            }
        },
        {
            path: '/safety/alarm',
            component: () => import('@/components/layout/Container.vue'),
            meta: {
                title: '报警',
                showProjectTree: true
            },
            children: [
                {
                    name: 'AlarmView',
                    path: '/safety/alarm/view',
                    component: () =>
                        import('@/views/safety/alarm/AlarmView.vue'),
                    meta: {
                        title: '报警概览'
                    }
                },
                {
                    path: '/safety/alarm/total',
                    component: () =>
                        import('@/views/safety/alarm/AlarmTotal.vue'),
                    meta: {
                        title: '报警统计'
                    }
                }
            ]
        },
        {
            path: '/safety/run-record',
            component: () => import('@/components/layout/Container.vue'),
            meta: {
                title: '运行记录',
                showProjectTree: true
            },
            children: [
                {
                    path: '/safety/run-record/power-distribution',
                    component: () =>
                        import('@/views/safety/run-record/PowerDistribution.vue'),
                    meta: {
                        title: '供配电'
                    }
                },
                {
                    path: '/safety/run-record/water-supply-sewerage',
                    component: () =>
                        import('@/views/safety/run-record/WaterSupplySewerage.vue'),
                    meta: {
                        title: '给排水'
                    }
                },
                {
                    path: '/safety/run-record/air-conditioner',
                    component: () =>
                        import('@/views/safety/run-record/AirConditioner.vue'),
                    meta: {
                        title: '空调'
                    }
                },
                {
                    path: '/safety/run-record/elevator',
                    component: () =>
                        import('@/views/safety/run-record/Elevator.vue'),
                    meta: {
                        title: '电梯'
                    }
                }
            ]
        }
    ]
};
export default safetyRouter;
