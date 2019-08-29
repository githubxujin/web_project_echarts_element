const platManageRouter = {
    path: '/plat-manage',
    component: resolve =>
        require(['@/components/layout/platform/home.vue'], resolve),
    meta: {
        title: '平台管理'
    },
    children: [
        {
            path: '',
            component: () => import('@/components/layout/Container.vue'),
            children: [
                {
                    path: '/plat-manage/platform-overview',
                    component: () =>
                        import('@/views/plat-manage/PlatformOverview.vue'),
                    meta: {
                        title: '门店概览'
                    }
                },
                {
                    path: '/plat-manage/user-management',
                    component: resolve =>
                        require([
                            '@/views/plat-manage/plat-user-management/index.vue'
                        ], resolve),
                    name: 'plat-user-management',
                    meta: { title: '用户管理' }
                },
                {
                    path: '/plat-manage/sms-template',
                    component: () =>
                        import('@/views/plat-manage/SmsTemplate.vue'),
                    meta: {
                        title: '短信模版'
                    }
                }
            ]
        }
    ]
}
export default platManageRouter
