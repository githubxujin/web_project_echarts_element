import { ConstDataZoom } from '@/utils/const-data';
import utils from '@/utils/utils.js';

let _ConstDataZoom = utils.deepCopy(ConstDataZoom);
_ConstDataZoom[0].bottom = '0';

export const BarOption = {
    color: ['#EE6E6D', '#FEC069', '#5CBDF0', '#67CB82'],
    // title: {
    //     text: '维修工单统计',
    //     left: 25,
    //     top: 10
    // },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    dataZoom: _ConstDataZoom,
    legend: {
        data: ['供配电', '给排水', '空调', '电梯'],
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 20,
        right: 45,
        top: 0
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 20,
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['04-21', '04-22', '04-23', '04-24']
        }
    ],
    yAxis: [
        {
            type: 'value',
            minInterval: 1 //设置成1保证坐标轴分割刻度显示成整数。
        }
    ],
    series: [
        {
            name: '供配电',
            type: 'bar',
            barWidth: 30,
            stack: '搜索引擎',
            data: [620, 732, 701, 734]
        },
        {
            name: '给排水',
            type: 'bar',
            stack: '搜索引擎',
            data: [134, 290, 230, 220]
        },
        {
            name: '空调',
            type: 'bar',
            stack: '搜索引擎',
            data: [60, 190, 130, 110]
        },
        {
            name: '电梯',
            type: 'bar',
            stack: '搜索引擎',
            data: [62, 109, 110, 120]
        }
    ]
};
export const CheckMaintainBarOption = {
    color: ['#74C7F2', '#4387CD', '#B1E888', '#4EAA5D'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    dataZoom: _ConstDataZoom,
    legend: {
        data: ['巡检未完成', '巡检已完成', '保养未完成', '保养已完成'],
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 20,
        right: 45,
        top: 0
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 20,
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['04-21', '04-22', '04-23', '04-24']
        }
    ],
    yAxis: [
        {
            type: 'value',
            minInterval: 1 //设置成1保证坐标轴分割刻度显示成整数。
        }
    ],
    series: [
        {
            name: '巡检未完成',
            type: 'bar',
            barWidth: 30,
            data: [620, 732, 701, 734]
        },
        {
            name: '巡检已完成',
            type: 'bar',
            barWidth: 30,
            data: [134, 290, 230, 220]
        },
        {
            name: '保养未完成',
            type: 'bar',
            barWidth: 30,
            data: [60, 190, 130, 110]
        },
        {
            name: '保养已完成',
            type: 'bar',
            barWidth: 30,
            data: [62, 109, 110, 120]
        }
    ]
};
export const PieOption = {
    color: ['#69B6EF', '#3569BE', '#A5DF69', '#40923B'],
    // title: {
    //     text: '设备参数明细',
    //     // subtext: '纯属虚构',
    //     x: 'center'
    // },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
    },
    legend: {
        data: ['供配电', '给排水', '空调', '电梯'],
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 20,
        right: 45,
        top: 0
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 0
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: '65%',
            center: ['50%', '55%'],
            data: [
                { value: 335, name: '供配电' },
                { value: 310, name: '给排水' },
                { value: 234, name: '空调' },
                { value: 135, name: '电梯' }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
export const CheckMaintainPieOption = {
    /*tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },*/
    legend: {
        data: ['巡检未完成', '巡检已完成', '保养未完成', '保养已完成'],
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 20,
        right: 45,
        top: 0
    },
    color: ['#74C7F2', '#4387CD', '#B1E888', '#4EAA5D'],
    title: {
        text: 0,
        textStyle: {
            color: '#3A3A3A',
            fontSize: 16,
            fontWeight: 'normal'
        },
        subtext: '',
        subtextStyle: {
            color: '#3A3A3A',
            fontSize: 28
        },
        x: 'center',
        y: '46%'
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['40%', '60%'],
            itemStyle: {
                borderColor: 'rgba(255,255,255,1)',
                borderWidth: 8
            },
            label: {
                normal: {
                    formatter: '{per|{d}%} \n{hr|}\n  {b|{b}}',
                    align: 'right',
                    rich: {
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 1,
                            height: 0
                        },
                        b: {
                            fontSize: 14,
                            color: '#000',
                            lineHeight: 20
                        },
                        per: {
                            color: '#000',
                            fontSize: 16,
                            lineHeight: 20
                        }
                    }
                }
            },
            labelLine: {},
            data: [
                {
                    value: 150,
                    name: '巡检未完成'
                    // itemStyle: {
                    //     color: '#ee6e6d'
                    // }
                },
                {
                    value: 50,
                    name: '巡检已完成'
                    // itemStyle: {
                    //     color: '#f19469'
                    // }
                },
                {
                    value: 300,
                    name: '保养未完成'
                    // itemStyle: {
                    //     color: '#e7bf5f'
                    // }
                },
                {
                    value: 500,
                    name: '保养已完成'
                    // itemStyle: {
                    //     color: '#74b8dd'
                    // }
                }
            ]
        }
    ]
};
function getColorByText(txt) {
    let color = '';
    console.log('txt', txt);
    switch (txt) {
        case '一级':
            color = '#F1726b';
            break;
        case '二级':
            color = '#f58e6b';
            break;
        case '三级':
            color = '#e7c156';
            break;
        case '四级':
            color = '#73b9dd';
            break;
        default:
            color = '#65ca84';
            break;
    }
    return color;
}
//'#F1726b', '#f58e6b', '#e7c156', '#73b9dd', '#65ca84'
export const getColorsByLevels = items => {
    let res = [];
    console.log('items', items);
    items.forEach(item => {
        res.push(getColorByText(item));
    });
    // console.log('res', res);
    return res;
};
export const HourDayMonthYear = [
    { name: '时', id: 0 },
    { name: '日', id: 1 },
    { name: '月', id: 2 },
    { name: '年', id: 3 }
];
/**
 * 重新构造SeriesData
 * @param {*} items
 */
export const getBarSeriesData = items => {
    let series = [];
    items.forEach(item => {
        Object.keys(item).map(key => {
            // console.log('key', key);
            series.push({ type: 'bar', name: key, data: item[key] });
        });
    });
    return series;
};
/**
 * 构造堆叠bar SeriesData
 * @param {*} items
 * @param {*} stack ：堆叠名称
 */
export const getStackBarSeriesData = (items, stack) => {
    let res = items.map(n => {
        // console.log('n', n);
        let item = {
            type: 'bar',
            name: n.name,
            data: n.data,
            barWidth: 30,
            stack: '总计'
        };
        return item;
    });
    console.log('res :', res);
    return res;
};
/**
 * 重新构造Pie的SeriesData
 * @param {*} items
 */
export const getPieSeriesData = items => {
    var seriesData = [];
    if (items && items.length > 0) {
        seriesData = items.map(obj => {
            let item = { value: 0, name: '' };
            for (var i in obj) {
                item.value = obj[i];
                item.name = i;
            }
            return item;
        });
    }
    // console.log('seriesData', seriesData);
    return seriesData;
};
