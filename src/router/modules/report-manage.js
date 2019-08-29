const reportManageRouter = {
    path: '/report-manage',
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
                    path: '/report-manage/alarm-report',
                    component: () =>
                        import('@/views/report-manage/AlarmReport.vue'),
                    meta: {
                        title: '报警报表'
                    }
                },
                {
                    path: '/report-manage/response-report',
                    component: () =>
                        import('@/views/report-manage/ResponseReport.vue'),
                    meta: {
                        title: '响应报表'
                    }
                },
                {
                    path: '/report-manage/equ-online',
                    component: () =>
                        import('@/views/report-manage/EquOnline.vue'),
                    meta: {
                        title: '设备在线'
                    }
                },
                {
                    path: '/report-manage/energy-report',
                    component: () =>
                        import('@/views/report-manage/EnergyReport.vue'),
                    meta: {
                        title: '能耗报表'
                    }
                }
            ]
        }
    ]
};
export default reportManageRouter;
