const Mock = require('mockjs');

// 科室定额
const sectionQuota = function() {
    let item = {
        code: 200,
        data: {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: [
                    '直接访问',
                    '邮件营销',
                    '联盟广告',
                    '视频广告',
                    '搜索引擎'
                ]
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    magicType: {
                        show: true,
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'value'
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    data: [
                        '周一',
                        '周二',
                        '周三',
                        '周四',
                        '周五',
                        '周六',
                        '周日'
                    ]
                }
            ],
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            label: { show: true, position: 'insideRight' }
                        }
                    },
                    data: [320, 302, 301, 334, 390, 330, 320]
                },
                {
                    name: '邮件营销',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            label: { show: true, position: 'insideRight' }
                        }
                    },
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '联盟广告',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            label: { show: true, position: 'insideRight' }
                        }
                    },
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '视频广告',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            label: { show: true, position: 'insideRight' }
                        }
                    },
                    data: [150, 212, 201, 154, 190, 330, 410]
                },
                {
                    name: '搜索引擎',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            label: { show: true, position: 'insideRight' }
                        }
                    },
                    data: [820, 832, 901, 934, 1290, 1330, 1320]
                }
            ]
        },
        msg: 'success'
    };
    return item;
};
// 通讯监测
const getMeterMonitorData ={
	"data": {
		"array": [{
			"collectorStatus": 1,
			"collectorOnlineRate": "100",
			"collectorId": 1128,
			"coms": [{
				"comId": 1,
				"comName": "com1",
				"branches": [{
					"branchId": 59295,
					"branchOrder": 1,
					"branchNumber": "000000000014",
					"branchValue": 25685.9,
					"branchName": "1#变压器",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59296,
					"branchOrder": 2,
					"branchNumber": "000000000017",
					"branchValue": 8825.1,
					"branchName": "2#变压器",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59297,
					"branchOrder": 3,
					"branchNumber": "000000210660",
					"branchValue": 12496.71,
					"branchName": "内部事故照明",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59298,
					"branchOrder": 4,
					"branchNumber": "000000210848",
					"branchValue": 3074.96,
					"branchName": "厨房用电",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59314,
					"branchOrder": 5,
					"branchNumber": "HQRXC812-01",
					"branchValue": 0.0,
					"branchName": "冷量表",
					"onlineRate": "0",
					"status": 0
				}]
			}, {
				"comId": 2,
				"comName": "com2",
				"branches": [{
					"branchId": 59299,
					"branchOrder": 1,
					"branchNumber": "000000210849",
					"branchValue": 20506.09,
					"branchName": "照明干线",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59300,
					"branchOrder": 2,
					"branchNumber": "000000210850",
					"branchValue": 4935.35,
					"branchName": "电梯",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59301,
					"branchOrder": 3,
					"branchNumber": "000000210851",
					"branchValue": 3877.83,
					"branchName": "1-3层照明插座",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59302,
					"branchOrder": 4,
					"branchNumber": "000000210852",
					"branchValue": 1164.32,
					"branchName": "配电房空调用电",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59303,
					"branchOrder": 5,
					"branchNumber": "000000250070",
					"branchValue": 1234.21,
					"branchName": "地下照明插座",
					"onlineRate": "98.7",
					"status": 1
				}]
			}, {
				"comId": 3,
				"comName": "com3",
				"branches": [{
					"branchId": 59304,
					"branchOrder": 1,
					"branchNumber": "000006950705",
					"branchValue": 0.0,
					"branchName": "客梯",
					"onlineRate": "0",
					"status": 1
				}, {
					"branchId": 59305,
					"branchOrder": 2,
					"branchNumber": "000006950726",
					"branchValue": 974.08,
					"branchName": "冷却塔（包含送风机等）",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59306,
					"branchOrder": 3,
					"branchNumber": "000007090504",
					"branchValue": 2100.42,
					"branchName": "1#空调主机",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59307,
					"branchOrder": 4,
					"branchNumber": "000007090505",
					"branchValue": 1359.18,
					"branchName": "冷却水泵",
					"onlineRate": "98.7",
					"status": 1
				}, {
					"branchId": 59308,
					"branchOrder": 5,
					"branchNumber": "000007090506",
					"branchValue": 1381.63,
					"branchName": "空调主机",
					"onlineRate": "98.7",
					"status": 1
				}]
            }],
			"collectorName": "采集器01"
		}, {
			"collectorStatus": 0,
			"collectorOnlineRate": "0",
			"collectorId": 2177,
			"coms": [],
			"collectorName": "采集器1000000"
		}]
	},
	"code": 200,
	"msg": "",
	"errors": null
}
// 通讯监测详情
const getMeterDetailsData={
	"data": {
		"dataList": [{
			"branchValue": 25686.99,
			"status": 0,
			"reportTime": "2019-05-29 00:00:00"
		}, {
			"branchValue": 25687.02,
			"status": 0,
			"reportTime": "2019-05-29 00:15:00"
		}, {
			"branchValue": 25687.06,
			"status": 0,
			"reportTime": "2019-05-29 00:30:00"
		}, {
			"branchValue": 25687.09,
			"status": 0,
			"reportTime": "2019-05-29 00:45:00"
		}, {
			"branchValue": 25687.13,
			"status": 0,
			"reportTime": "2019-05-29 01:00:00"
		}, {
			"branchValue": 25687.16,
			"status": 0,
			"reportTime": "2019-05-29 01:15:00"
		}, {
			"branchValue": 25687.19,
			"status": 0,
			"reportTime": "2019-05-29 01:30:00"
		}, {
			"branchValue": 25687.22,
			"status": 0,
			"reportTime": "2019-05-29 01:45:00"
		}, {
			"branchValue": 25687.25,
			"status": 0,
			"reportTime": "2019-05-29 02:00:00"
		}, {
			"branchValue": 25687.28,
			"status": 0,
			"reportTime": "2019-05-29 02:15:00"
		}, {
			"branchValue": 25687.31,
			"status": 0,
			"reportTime": "2019-05-29 02:30:00"
		}, {
			"branchValue": 25687.34,
			"status": 0,
			"reportTime": "2019-05-29 02:45:00"
		}, {
			"branchValue": 25687.37,
			"status": 0,
			"reportTime": "2019-05-29 03:00:00"
		}, {
			"branchValue": 25687.4,
			"status": 0,
			"reportTime": "2019-05-29 03:15:00"
		}, {
			"branchValue": 25687.43,
			"status": 0,
			"reportTime": "2019-05-29 03:30:00"
		}, {
			"branchValue": 25687.46,
			"status": 0,
			"reportTime": "2019-05-29 03:45:00"
		}, {
			"branchValue": 25687.49,
			"status": 0,
			"reportTime": "2019-05-29 04:00:00"
		}, {
			"branchValue": 25687.52,
			"status": 0,
			"reportTime": "2019-05-29 04:15:00"
		}, {
			"branchValue": 25687.55,
			"status": 0,
			"reportTime": "2019-05-29 04:30:00"
		}, {
			"branchValue": 25687.58,
			"status": 0,
			"reportTime": "2019-05-29 04:45:00"
		}, {
			"branchValue": 25687.62,
			"status": 0,
			"reportTime": "2019-05-29 05:00:00"
		}, {
			"branchValue": 25687.65,
			"status": 0,
			"reportTime": "2019-05-29 05:15:00"
		}, {
			"branchValue": 25687.68,
			"status": 0,
			"reportTime": "2019-05-29 05:30:00"
		}, {
			"branchValue": 25687.71,
			"status": 0,
			"reportTime": "2019-05-29 05:45:00"
		}, {
			"branchValue": 25687.74,
			"status": 0,
			"reportTime": "2019-05-29 06:00:00"
		}, {
			"branchValue": 25687.77,
			"status": 0,
			"reportTime": "2019-05-29 06:15:00"
		}, {
			"branchValue": 25687.8,
			"status": 0,
			"reportTime": "2019-05-29 06:30:00"
		}, {
			"branchValue": 25687.83,
			"status": 0,
			"reportTime": "2019-05-29 06:45:00"
		}, {
			"branchValue": 25687.87,
			"status": 0,
			"reportTime": "2019-05-29 07:00:00"
		}, {
			"branchValue": 25687.9,
			"status": 0,
			"reportTime": "2019-05-29 07:15:00"
		}, {
			"branchValue": 25687.94,
			"status": 0,
			"reportTime": "2019-05-29 07:30:00"
		}, {
			"branchValue": 25687.97,
			"status": 0,
			"reportTime": "2019-05-29 07:45:00"
		}, {
			"branchValue": 25688.0,
			"status": 0,
			"reportTime": "2019-05-29 08:00:00"
		}, {
			"branchValue": 25688.16,
			"status": 0,
			"reportTime": "2019-05-29 08:15:00"
		}, {
			"branchValue": 25688.4,
			"status": 0,
			"reportTime": "2019-05-29 08:30:00"
		}, {
			"branchValue": 25688.51,
			"status": 0,
			"reportTime": "2019-05-29 08:45:00"
		}, {
			"branchValue": 25688.65,
			"status": 0,
			"reportTime": "2019-05-29 09:00:00"
		}, {
			"branchValue": 25688.88,
			"status": 0,
			"reportTime": "2019-05-29 09:15:00"
		}]
	},
	"code": 200,
	"msg": "",
	"errors": null
}
Mock.mock(
    '/api/admin/deviceDetection/getMeterMonitor?pmId=1',
    'get',
    getMeterMonitorData
);
Mock.mock('/sectionQuota/list', 'post', sectionQuota);
Mock.mock(
	/\/api\/admin\/deviceDetection\/getMeterMonitorHistoryData?[\s\S]*?/,
    'get', 
	getMeterDetailsData
);
/*支路信息列表*/
export const describeBranch = {
    "data": {
        "alarmList":[{"id":1,"name":"xx支路报警信息"}], //报警信息列表
        "fan":{"status":1},  //风机
        "loadRate":"30",//负载率
        "capacitorInfo":{"status":'投用',val:'3X100'},//电容信息
        //功率
        "power":{"have":'',"nothave":''},
        //电压
        "voltage":[
            {
                "name": "Ua",
                "data": 220
            }, {
                "name": "Ub",
                "data": 220
            }, {
                "name": "Uc",
                "data": 220
            },
            {
                "name": "Uab",
                "data": 380
            }, {
                "name": "Ubc",
                "data": 380
            }, {
                "name": "Uca",
                "data": 380
            }
        ],
        //电流
        "electricity":[
            {
                "name": "Ia",
                "data": 11
            }, {
                "name": "Ib",
                "data": 22
            }, {
                "name": "Ic",
                "data": 33
            }
        ],
        //基础支路
        "baseBranchList":[
            {
                "branchId": 1,
                "branchOpenStatus": 0,
                "branchOrder": "",
                "parentOrder": "",
                "branchName": "S1-2TM变压器进线",
                "branchType": 0
            },
            {
                "branchId": 4,
                "branchOpenStatus": 1,
                "branchOrder": "",
                "parentOrder": "",
                "branchName": "电容补偿",
                "branchType": 1
            },
            {
                "branchId": 2,
                "branchOpenStatus": 0,
                "branchOrder": "",
                "parentOrder": "",
                "branchName": "联络",
                "branchType": 2
            }
        ],
        "branchList": [
            {
                "parentOrder": "",
                "branchInfos": [
                    {
                        "branchId": 5,
                        "branchOpenStatus": 0,
                        "branchOrder": "4125",
                        "parentOrder": "3335",
                        "branchName": "商户电表箱",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4135",
                        "parentOrder": "3335",
                        "branchName": "泛光照明",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4127",
                        "parentOrder": "3335",
                        "branchName": "泛光照明",
                        "branchType": 3
                    }
                ]
            },
            {
                "parentOrder": "3336",
                "branchInfos": [
                    {
                        "branchId": 5,
                        "branchOpenStatus": 0,
                        "branchOrder": "4125",
                        "parentOrder": "3336",
                        "branchName": "商户电表箱",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4128",
                        "parentOrder": "3336",
                        "branchName": "泛光照明",
                        "branchType": 3
                    }
                ]
            },
            {
                "parentOrder": "3337",
                "branchInfos": [
                    {
                        "branchId": 5,
                        "branchOpenStatus": 0,
                        "branchOrder": "4125",
                        "parentOrder": "3335",
                        "branchName": "商户电表箱",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4129",
                        "parentOrder": "3337",
                        "branchName": "泛光照明",
                        "branchType": 3
                    }
                ]
            },
            {
                "parentOrder": "3338",
                "branchInfos": [
                    {
                        "branchId": 5,
                        "branchOpenStatus": 0,
                        "branchOrder": "4125",
                        "parentOrder": "3338",
                        "branchName": "商户电表箱",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4130",
                        "parentOrder": "3338",
                        "branchName": "泛光照明",
                        "branchType": 3
                    }
                ]
            },
            {
                "parentOrder": "3339",
                "branchInfos": [
                    {
                        "branchId": 5,
                        "branchOpenStatus": 0,
                        "branchOrder": "4125",
                        "parentOrder": "3339",
                        "branchName": "商户电表箱",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4131",
                        "parentOrder": "3339",
                        "branchName": "泛光照明",
                        "branchType": 3
                    }
                ]
            },
            {
                "parentOrder": "3340",
                "branchInfos": [
                    {
                        "branchId": 5,
                        "branchOpenStatus": 0,
                        "branchOrder": "4125",
                        "parentOrder": "3340",
                        "branchName": "商户电表箱",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4132",
                        "parentOrder": "3340",
                        "branchName": "泛光照明",
                        "branchType": 3
                    }
                ]
            },
            {
                "parentOrder": "3341",
                "branchInfos": [
                    {
                        "branchId": 5,
                        "branchOpenStatus": 0,
                        "branchOrder": "4125",
                        "parentOrder": "3341",
                        "branchName": "商户电表箱",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4133",
                        "parentOrder": "3341",
                        "branchName": "泛光照明",
                        "branchType": 3
                    }
                ]
            },
            {
                "parentOrder": "3342",
                "branchInfos": [
                    {
                        "branchId": 5,
                        "branchOpenStatus": 0,
                        "branchOrder": "4125",
                        "parentOrder": "3342",
                        "branchName": "商户电表箱",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4134",
                        "parentOrder": "3342",
                        "branchName": "泛光照明",
                        "branchType": 3
                    },
                    {
                        "branchId": 3,
                        "branchOpenStatus": 1,
                        "branchOrder": "4127",
                        "parentOrder": "3342",
                        "branchName": "泛光照明",
                        "branchType": 3
                    }
                ]
            }
        ],
        //温度
        "temperatures": [{
            "name": "A相温度",
            "data": "35°C"
        }, {
            "name": "B相温度",
            "data": "35°C"
        }, {
            "name": "C相温度",
            "data": "35°C"
        }
        ],
        "temperature": "25°C", //室内温度
        "humidity": "52%", //相对湿度
        "waterStatus":1,//水浸状态
        "powerDescription": "引自高压AH9柜 #03变压器 SCB10-1600KVA/10KV",
        //功率因素
        "factors": [
            {
                "name": "总",
                "data": 66
            },
            {
            "name": "A相",
            "data": 11
        }, {
            "name": "B相",
            "data": 22
        }, {
            "name": "C相",
            "data": 33
        }
        ]
    },
    "code": 200,
    "msg": "",
    "errors": null
}
/*支路参数列表*/
export const branchParamsList = {
    "code": 200,
    "msg": "",
    "errors": null,
    data: {
        tableHeader: [
         {id: 4, code: '000000000295', name: '联络4', isMiddle: true},
            {id: 5, code: '000000000295', name: '联络5', isMiddle: true},
            {id: 6, code: '000000000295', name: '联络6', isMiddle: false},
             {
                id: 7,
                code: '000000000295',
                name: '联络7',
                isMiddle: false
            },
             {
                id: 8, code: '000000000295',
                name: '联络8',
                isMiddle: false
            }, 
            {id: 9, code: '000000000295', name: '联络9', isMiddle: false}, {
                id: 10,
                code: '000000000295',
                name: '联络10',
                isMiddle: false
            },
            {id: 11, code: '000000000295', name: '联络11', isMiddle: false}, {
                id: 12,
                code: '000000000295',
                name: '联络13',
                isMiddle: false
            }, {
                id: 9, code: '000000000295',
                name: '联络14',
                isMiddle: false
            },
            {id: 15, code: '000000000295', name: '联络16', isMiddle: false}, {
                id: 17,
                code: '000000000295',
                name: '联络17',
                isMiddle: false
            }, {
                id: 18, code: '000000000295',
                name: '联络18',
                isMiddle: false
            }, {id: 19, code: '000000000295', name: '联络19', isMiddle: false},
            {id: 20, code: '000000000295', name: '联络20', isMiddle: false}, {id: 21, name: '联络21', isMiddle: false}, {
                id: 22, code: '000000000295',
                name: '联络22',
                isMiddle: true
            }, {id: 23, code: '000000000295', name: '联络23', isMiddle: false}],
        tableData: [
            {
                group:'voltage',
                powername1: '325',
                powername2: '65',
                powername3: '-',
                powername4: '325',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-',
                isExe1: false,
                isExe2: true,
                isExe3: false,
                isExe4: false,
                isExe5: false,
                isExe6: false,
                isExe7: false,
                isExe8: false,
                isExe9: false,
                isExe10: false,
                isExe11: false,
                isExe12: false,
                isExe13: false,
                isExe14: false,
                isExe15: false,
                isExe16: false,
                isExe17: false,
                isExe20: false,
                isExe21: false,
                isExe22: false,
                isExe23: false,
                isExe24: false
            },
            
            {
                group:'voltage',
                powername1: '2727',
                powername2: '7272',
                powername3: '424',
                powername4: '325',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername14: '65',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-',
                isExe3: true
            },
            {
                group:'voltage',
                powername1: '-',
                powername2: '65',
                powername3: '552',
                powername4: '325',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-'
            },
            {
                group:'electricity',
                powername1: '-',
                powername2: '-',
                powername3: '424',
                powername4: '325',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-'
            },
            {
                group:'electricity',
                powername1: '-',
                powername2: '65',
                powername3: '552',
                powername4: '325',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-'
            },
            {
                group:'electricity',
                powername1: '2727',
                powername2: '7272',
                powername3: '424',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-'
            },
            {
                group:'alert',
                powername1: '-', powername2: '65', powername3: '552'},
            {
                group:'ammeter',
                powername1: '2727',
                powername2: '7272',
                powername3: '424',
                powername4: '325',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-'
            },
            {
                group:'P',
                powername1: '--',
                powername2: '--',
                powername3: '--',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername4: '65',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-'
            },
            {
                group:'Pmax',
                powername1: '--',
                powername2: '--',
                powername3: '--',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername4: '65',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-'
            },
            {
                group:'other',
                powername1: '--',
                powername2: '--',
                powername3: '--',
                powername5: '65',
                powername6: '-',
                powername7: '325',
                powername8: '65',
                powername9: '-',
                powername10: '-',
                powername11: '65',
                powername12: '-',
                powername13: '-',
                powername4: '65',
                powername15: '-',
                powername16: '-',
                powername17: '65',
                powername18: '-',
                powername19: '-',
                powername20: '65',
                powername21: '-',
                powername22: '-',
                powername23: '-',
                powername24: '-'
            }
        ]
    }
}