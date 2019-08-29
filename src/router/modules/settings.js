const settingRouter = {
    path: '/settings',
    component: resolve =>
        require(['@/components/layout/shopsettings/home.vue'], resolve),
    redirect: '/settings/basics/user-management',
    name: 'settings',
    meta: {
        title: '设置'
    },
    children: [
        {
            path: '/settings/basics',
            component: { template: '<router-view/>' },
            children: [
                {
                    path: '/settings/basics/user-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/basics/user-management/index.vue'
                        ], resolve),
                    name: 'user-management',
                    meta: { title: '用户管理' }
                },
                {
                    path: '/settings/basics/shop-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/basics/shop-management/index.vue'
                        ], resolve),
                    name: '/settings/basics/shop-management',
                    meta: { title: '门店管理' }
                },
                {
                    path: '/settings/basics/custom-alarm-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/basics/custom-alarm-management/index.vue'
                        ], resolve),
                    name: 'alarm-management',
                    meta: { title: '自定义报警' }
                },
                {
                    path: '/settings/basics/new-alarm',
                    component: resolve =>
                        require([
                            '@/views/system-settings/basics/custom-alarm-management/NewAlarm.vue'
                        ], resolve),
                    name: 'new-alarm',
                    meta: {
                        title: '新增自定义报警',
                        parentPath: '/settings/basics/custom-alarm-management'
                    }
                }
            ],
            name: 'basics',
            redirect: '/settings/basics/user-management',
            meta: { title: '基础设置' }
        },
        {
            path: '/settings/configuration',
            component: { template: '<router-view/>' },
            children: [
                {
                    path: '/settings/configuration/branch-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/branch-management/index.vue'
                        ], resolve),
                    name: 'branch-management',
                    meta: { title: '支路信息' }
                },
                {
                    path: '/settings/configuration/sub-entry-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/sub-entry-management/index.vue'
                        ], resolve),
                    name: 'sub-entry-management',
                    meta: { title: '分项管理', requireAuth: false }
                },
                {
                    path: '/settings/configuration/collector-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/collector-management/index.vue'
                        ], resolve),
                    name: 'collector-management',
                    meta: { title: '采集器管理' }
                },
                {
                    path: '/settings/configuration/transformer-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/transformer-management/index.vue'
                        ], resolve),
                    name: 'transformer-management',
                    meta: { title: '变压器管理' }
                },
                {
                    path: '/settings/configuration/tachometer-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/tachometer-management/index.vue'
                        ], resolve),
                    name: 'tachometer-management',
                    meta: { title: '表计参数' }
                },
                {
                    path: '/settings/configuration/cool-station-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/cool-station-management/index.vue'
                        ], resolve),
                    name: 'cool-station-management',
                    meta: { title: '冷站设备' }
                },
                {
                    path: '/settings/configuration/water-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/water-management/index.vue'
                        ], resolve),
                    name: 'water-management',
                    meta: { title: '给排水设备' }
                },
                {
                    path: '/settings/configuration/elevator-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/elevator-management/index.vue'
                        ], resolve),
                    name: 'elevator-management',
                    meta: { title: '电梯设备' }
                },
                {
                    path: '/settings/configuration/global-params-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/global-params-management/index.vue'
                        ], resolve),
                    name: 'global-params-management',
                    meta: { title: '全局参数配置' }
                },
                {
                    path:
                        '/settings/configuration/monitor-interface-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/monitor-interface-management/index.vue'
                        ], resolve),
                    name: 'monitor-interface-management',
                    meta: { title: '监控界面配置' }
                },
                {
                    path: '/settings/configuration/video-monitor-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/configuration/video-monitor-management/index.vue'
                        ], resolve),
                    name: 'video-monitor-management',
                    meta: { title: '视频监控配置' }
                }
            ],
            name: 'configuration',
            redirect: '/settings/configuration/branch-management',
            meta: { title: '基础配置' }
        },
        {
            path: '/settings/professional',
            component: { template: '<router-view/>' },
            children: [
                {
                    path: '/settings/professional/point-table-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/professional/point-table-management/index.vue'
                        ], resolve),
                    name: 'point-table-management',
                    meta: { title: '点表管理' }
                },
                {
                    path: '/settings/professional/point-table-map-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/professional/point-table-map-management/index.vue'
                        ], resolve),
                    name: 'point-table-map-management',
                    meta: { title: '点表映射值' }
                },
                {
                    path:
                        '/settings/professional/power-distribution-meter-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/professional/power-distribution-meter-management/index.vue'
                        ], resolve),
                    name: 'power-distribution-meter-management',
                    meta: { title: '配电支路点表' }
                },
                {
                    path: '/settings/professional/water-point-table-management',
                    component: resolve =>
                        require([
                            '@/views/system-settings/professional/water-point-table-management/index.vue'
                        ], resolve),
                    name: 'water-point-table-management',
                    meta: { title: '给排水点表' }
                }
            ],
            name: 'professionalConfiguration',
            redirect: '/settings/professional/point-table-management',
            meta: { title: '专业配置' }
        },
        {
            path: '/settings/digital-signage-view',
            component: { template: '<router-view/>' },
            children: [
                {
                    path: '/settings/digital-signage-view/digital-signage',
                    redirect: '/digital-signage'
                }
            ],
            name: 'digital-signage-view',
            meta: { title: '电子看板' }
        }
    ]
}

export default settingRouter
