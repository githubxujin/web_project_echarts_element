const menus = [
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/shop-index',
        pid: 0,
        remark: '门店首页',
        id: 216,
        title: '首页',
        menuType: 'menu',
        btns: []
    },
    {
        index: '/safety',
        pid: 0,
        remark: '安全管理',
        id: 2,
        title: '安全管理',
        menuType: 'menu',
        subs: [
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/safety/power-sys',
                pid: 2,
                remark: '安全管理-供配电系统',
                id: 21,
                title: '供配电系统',
                menuType: 'menu'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/safety/drainage',
                pid: 2,
                remark: '安全管理-给排水系统',
                id: 22,
                title: '给排水系统',
                menuType: 'sub',
                subs: [
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/safety/drainage/out-water',
                        pid: 22,
                        remark: '安全管理-排水系统',
                        id: 221,
                        title: '排水系统',
                        menuType: 'sub'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/safety/drainage/suppley-water',
                        pid: 22,
                        remark: '安全管理-给水系统',
                        id: 222,
                        title: '给水系统',
                        menuType: 'sub'
                    }
                ]
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/safety/air-sys',
                pid: 2,
                remark: '安全管理-空调系统',
                id: 23,
                title: '空调系统',
                menuType: 'menu'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/safety/elevator-sys',
                pid: 2,
                remark: '安全管理-电梯系统',
                id: 24,
                title: '电梯系统',
                menuType: 'page'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/safety/communication',
                pid: 2,
                remark: '安全管理-通讯监测',
                id: 25,
                title: '通讯监测',
                menuType: 'menu'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/safety/alarm',
                pid: 2,
                remark: '安全管理-报警',
                id: 26,
                title: '报警',
                menuType: 'page',
                subs: [
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/safety/alarm/view',
                        pid: 26,
                        remark: '安全管理-报警-报警概览',
                        id: 261,
                        title: '报警概览',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/safety/alarm/total',
                        pid: 26,
                        remark: '安全管理-报警-报警统计',
                        id: 262,
                        title: '报警统计',
                        menuType: 'page'
                    }
                ]
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/safety/run-record',
                pid: 2,
                remark: '安全管理-运行记录',
                id: 27,
                title: '运行记录',
                menuType: 'page',
                subs: [
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/safety/run-record/PowerDistribution',
                        pid: 27,
                        remark: '运行记录-供配电',
                        id: 271,
                        title: '供配电',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/safety/run-record/WaterSupplySewerage',
                        pid: 27,
                        remark: '运行记录-给排水',
                        id: 272,
                        title: '给排水',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/safety/run-record/AirConditioner',
                        pid: 27,
                        remark: '运行记录-空调',
                        id: 273,
                        title: '空调',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/safety/run-record/Elevator',
                        pid: 27,
                        remark: '运行记录-电梯',
                        id: 274,
                        title: '电梯',
                        menuType: 'page'
                    }
                ]
            }
        ],
        icon: 'iconfont nhjc-guanyuwomen'
    },
    {
        icon: 'iconfont nhjc-guanyuwomen',
        index: '/operation',
        pid: 0,
        remark: '运维管理',
        id: 9,
        title: '运维管理',
        menuType: 'menu',
        btns: [],
        subs: [
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/operation/bill-search',
                pid: 9,
                remark: '运维管理-工单查询',
                id: 26,
                title: '工单查询',
                menuType: 'page',
                subs: [
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/bill-search/repair',
                        pid: 26,
                        remark: '运维管理-工单查询-维修工单',
                        id: 261,
                        title: '维修工单',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/bill-search/maintain',
                        pid: 26,
                        remark: '运维管理-工单查询-保养工单',
                        id: 262,
                        title: '保养工单',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/bill-search/check',
                        pid: 26,
                        remark: '运维管理-工单查询-巡检工单',
                        id: 262,
                        title: '巡检工单',
                        menuType: 'page'
                    }
                ]
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/operation/maintain',
                pid: 9,
                remark: '运维管理-保养',
                id: 13,
                title: '保养',
                menuType: 'page',
                subs: [
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/maintain/standard',
                        pid: 13,
                        remark: '运维管理-保养-保养标准',
                        id: 131,
                        title: '保养标准',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/maintain/template',
                        pid: 13,
                        remark: '运维管理-保养-保养模板',
                        id: 132,
                        title: '保养模板',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/maintain/range',
                        pid: 13,
                        remark: '运维管理-保养-保养计划',
                        id: 133,
                        title: '保养计划',
                        menuType: 'page'
                    }
                ]
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/operation/check',
                pid: 9,
                remark: '运维管理-巡检',
                id: 14,
                title: '巡检',
                menuType: 'page',
                subs: [
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/check/standard',
                        pid: 26,
                        remark: '运维管理-巡检-巡检标准',
                        id: 261,
                        title: '巡检标准',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/check/template',
                        pid: 26,
                        remark: '运维管理-巡检-保巡检模板',
                        id: 262,
                        title: '巡检模板',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/check/range',
                        pid: 26,
                        remark: '运维管理-巡检-巡检范围',
                        id: 262,
                        title: '巡检范围',
                        menuType: 'page'
                    }
                ]
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/operation/total',
                pid: 9,
                remark: '运维管理-运维统计',
                id: 141,
                title: '运维统计',
                menuType: 'menu'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/operation/member',
                pid: 9,
                remark: '运维管理-人员管理',
                id: 142,
                title: '人员管理',
                menuType: 'page',
                subs: [
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/member/member-list',
                        pid: 26,
                        remark: '运维管理-人员管理',
                        id: 261,
                        title: '人员管理',
                        menuType: 'page'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/operation/member/scheduling',
                        pid: 26,
                        remark: '运维管理-排班管理',
                        id: 262,
                        title: '排班管理',
                        menuType: 'page'
                    }
                ]
            }
        ]
    },
    {
        icon: 'iconfont nhjc-nenghaofenxi',
        index: '/energy',
        pid: 0,
        remark: '用能管理',
        id: 68,
        title: '用能管理',
        menuType: 'menu',
        subs: [
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/energy/energy-search',
                name: 'energy-search',
                pid: 68,
                remark: '用能管理-能耗查询',
                id: 70,
                title: '能耗查询',
                menuType: 'menu'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/energy/quota-manage',
                pid: 68,
                remark: '用能管理-能流图',
                id: 71,
                title: '定额管理',
                menuType: 'menu'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/energy/load-prediction',
                pid: 68,
                remark: '用能管理-能耗预测',
                id: 72,
                title: '负荷预测',
                menuType: 'menu'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/energy/energy-report',
                pid: 68,
                remark: '用能管理-能耗报表',
                id: 73,
                title: '能耗报表',
                menuType: 'menu'
            }
        ]
    },
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/settings',
        pid: 0,
        remark: '设置',
        id: 11,
        title: '设置',
        menuType: 'menu',
        subs: [
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/settings/basics',
                pid: 5,
                remark: '设置-基本信息',
                id: 51,
                title: '基本信息',
                menuType: 'menu',
                subs: [
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/basics/user-management',
                        pid: 26,
                        remark: '基本信息-用户管理',
                        id: 261,
                        title: '用户管理',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/basics/shop-management',
                        pid: 26,
                        remark: '基本信息-门店管理',
                        id: 262,
                        title: '门店管理',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/basics/custom-alarm-management',
                        pid: 26,
                        remark: '基本信息-自定义报警',
                        id: 262,
                        title: '自定义报警',
                        menuType: 'menu'
                    }
                ]
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/settings/configuration',
                pid: 5,
                remark: '设置-配置信息',
                id: 52,
                title: '配置信息',
                menuType: 'menu',
                subs: [
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/configuration/branch-management',
                        pid: 26,
                        remark: '配置信息-支路信息',
                        id: 261,
                        title: '支路信息',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/configuration/collector-management',
                        pid: 26,
                        remark: '配置信息-采集器管理',
                        id: 262,
                        title: '采集器管理',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/configuration/transformer-management',
                        pid: 26,
                        remark: '配置信息-变压器管理',
                        id: 263,
                        title: '变压器管理',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/configuration/tachometer-management',
                        pid: 26,
                        remark: '配置信息-表计参数',
                        id: 264,
                        title: '表计参数',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/configuration/point-table-management',
                        pid: 26,
                        remark: '配置信息-点表管理',
                        id: 265,
                        title: '点表管理',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index:
                            '/settings/configuration/point-table-map-management',
                        pid: 26,
                        remark: '配置信息-点表映射值',
                        id: 266,
                        title: '点表管映射值',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index:
                            '/settings/configuration/cool-station-management',
                        pid: 26,
                        remark: '配置信息-冷站设备',
                        id: 267,
                        title: '冷站设备',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/configuration/water-management',
                        pid: 26,
                        remark: '配置信息-给排水设备',
                        id: 268,
                        title: '给排水设备',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index: '/settings/configuration/elevator-management',
                        pid: 26,
                        remark: '配置信息-电梯管理',
                        id: 269,
                        title: '电梯管理',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index:
                            '/settings/configuration/ monitor-interface-management',
                        pid: 26,
                        remark: '配置信息-监控界面配置',
                        id: 2610,
                        title: '监控界面配置',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index:
                            '/settings/configuration/global-params-management',
                        pid: 26,
                        remark: '配置信息-全局参数配置',
                        id: 2611,
                        title: '全局参数配置',
                        menuType: 'menu'
                    },
                    {
                        icon: 'iconfont nhjc-shouyegailan',
                        index:
                            '/settings/configuration/video-monitor-management',
                        pid: 26,
                        remark: '配置信息-视频监控管理',
                        id: 2612,
                        title: '视频监控管理',
                        menuType: 'menu'
                    }
                ]
            }
        ]
    }
];
const platMenus = [
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/plat-index',
        pid: 0,
        remark: '集团首页',
        id: 1,
        title: '集团首页',
        menuType: 'menu'
    },
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/data-rank/AlarmLevel',
        pid: 0,
        remark: '数据排名',
        id: 2,
        title: '数据排名',
        menuType: 'page',
        btns: [],
        subs: [
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/data-rank/AlarmLevel',
                pid: 2,
                remark: '数据排名-报警级别排名',
                id: 21111,
                title: '报警级别排名',
                menuType: 'page'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/data-rank/ResponseTime',
                pid: 2,
                remark: '数据排名-响应时间排名',
                id: 21112,
                title: '响应时间排名',
                menuType: 'page'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/data-rank/EquOnline',
                pid: 2,
                remark: '数据排名-设备在线排名',
                id: 21113,
                title: '设备在线排名',
                menuType: 'page'
            }
        ]
    },
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/data-compare/ProjectCompare',
        pid: 0,
        remark: '数据对比',
        id: 3,
        title: '数据对比',
        menuType: 'page',
        subs: [
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/data-compare/ProjectCompare',
                pid: 3,
                remark: '数据对比-项目对比',
                id: 310,
                title: '项目对比',
                menuType: 'page'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/data-compare/Timecompare',
                pid: 3,
                remark: '数据对比-时间对比',
                id: 311,
                title: '时间对比',
                menuType: 'page'
            }
        ]
    },
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/report-manage/AlarmReport',
        pid: 0,
        remark: '报表管理',
        id: 4,
        title: '报表管理',
        menuType: 'page',
        subs: [
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/report-manage/AlarmReport',
                pid: 4,
                remark: '报表管理-报警报表',
                id: 41,
                title: '报警报表',
                menuType: 'page'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/report-manage/ResponseReport',
                pid: 4,
                remark: '报表管理-响应报表',
                id: 42,
                title: '响应报表',
                menuType: 'page'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/report-manage/EquOnline',
                pid: 4,
                remark: '报表管理-设备在线',
                id: 43,
                title: '设备在线',
                menuType: 'page'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/report-manage/EnergyReport',
                pid: 4,
                remark: '报表管理-能耗报表',
                id: 44,
                title: '能耗报表',
                menuType: 'page'
            }
        ]
    },
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/plat-manage/PlatformOverview',
        pid: 0,
        remark: '平台管理',
        id: 5,
        title: '平台管理',
        menuType: 'page',
        subs: [
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/plat-manage/PlatformOverview',
                pid: 5,
                remark: '平台管理-门店概览',
                id: 51,
                title: '平台管理',
                menuType: 'page'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/plat-manage/user-management',
                pid: 5,
                remark: '平台管理-用户管理',
                id: 52,
                title: '平台管理',
                menuType: 'page'
            },
            {
                icon: 'iconfont nhjc-shouyegailan',
                index: '/plat-manage/SmsTemplate',
                pid: 5,
                remark: '平台管理-短信模版',
                id: 53,
                title: '平台管理',
                menuType: 'page'
            }
        ]
    }
];
const shopMenus = [
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/shop-index',
        pid: 0,
        remark: '首页',
        id: 1,
        title: '首页'
    },
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/safety',
        pid: 0,
        remark: '安全管理',
        id: 2,
        title: '安全管理'
    },
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/operation',
        pid: 0,
        remark: '运维管理',
        id: 3,
        title: '运维管理'
    },
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/energy',
        pid: 0,
        remark: '用能管理',
        id: 4,
        title: '用能管理'
    },
    {
        icon: 'iconfont nhjc-shouyegailan',
        index: '/assets',
        pid: 0,
        remark: '资产管理',
        id: 5,
        title: '资产管理'
    }
];
export { menus, platMenus, shopMenus };
