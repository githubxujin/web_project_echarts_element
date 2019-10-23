const dataRankRouter = {
    path: '/data-rank',
    component: resolve =>
        require(['@/components/layout/platform/home.vue'], resolve),
    meta: {
        title: '数据对比'
    },
    children: [
        {
            path: '',
            component: () => import('@/components/layout/Container.vue'),
            children: [
                {
                    path: '/data-rank/alarm-level',
                    name: 'alarm-level',
                    component: () => import('@/views/data-rank/AlarmLevel.vue'),
                    meta: {
                        title: '报警级别排名'
                    }
                },
                {
                    path: '/data-rank/response-time',
                    component: () =>
                        import('@/views/data-rank/ResponseTime.vue'),
                    meta: {
                        title: '响应时间排名'
                    }
                },
                {
                    path: '/data-rank/equ-onLine',
                    component: () => import('@/views/data-rank/EquOnLine.vue'),
                    meta: {
                        title: '设备在线排名'
                    }
                },
                {
                    path: '/data-rank/energy-ranking',
                    component: () =>
                        import('@/views/data-rank/EnergyRanking.vue'),
                    meta: {
                        title: '能耗排名'
                    }
                }
            ]
        }
    ]
};
export default dataRankRouter;
