import { ConstDataZoom } from '../../../utils/const-data';
export const BarOption = {
    color: ['#F1726b', '#f58e6b', '#e7c156', '#73b9dd', '#65ca84'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    dataZoom: ConstDataZoom,
    legend: {
        data: ['一级', '二级', '三级', '四级', '五级'],
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 20,
        right: 45
    },
    grid: {
        left: 50,
        right: 0,
        top: 30,
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            silent: false,
            data: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月'
            ],
            axisTick: {
                alignWithLabel: true
            },
            splitLine: {
                show: true,
                lineStyle: {
                    // 网格颜色
                    color: ['#E5EFF5']
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisLabel: {
                color: '#3A3A3A',
                interval: 'auto'
            },
            splitArea: {
                show: false
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '次数',
            minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数。
            nameTextStyle: {
                color: '#838383'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    // 网格颜色
                    color: ['#E5EFF5']
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#E5EFF5'
                }
            },
            axisLabel: {
                color: '#3A3A3A',
                interval: 0
            }
        }
    ],
    series: [
        {
            name: '一级',
            type: 'bar',
            data: [320, 332, 301, 334, 390, 320, 332, 301, 334, 390]
        },
        {
            name: '二级',
            type: 'bar',
            data: [220, 182, 191, 234, 290, 220, 182, 191, 234, 290]
        },
        {
            name: '三级',
            type: 'bar',
            data: [150, 232, 201, 154, 190, 150, 232, 201, 154, 190]
        },
        {
            name: '四级',
            type: 'bar',
            data: [220, 182, 191, 234, 290, 220, 182, 191, 234, 290]
        },
        {
            name: '五级',
            barGap: 0,
            type: 'bar',
            data: [220, 182, 191, 234, 290, 220, 182, 191, 234, 290]
        }
    ]
};

export const PieOption = {
    /*tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },*/
    color: ['#ee6e6d', '#f19469', '#e7bf5f', '#74b8dd', '#67cb82'],
    title: {
        text: 0,
        textStyle: {
            color: '#3A3A3A',
            fontSize: 30,
            fontWeight: 'normal'
        },
        subtext: '',
        subtextStyle: {
            color: '#3A3A3A',
            fontSize: 14
        },
        x: 'center',
        y: '46%'
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['45%', '65%'],
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
                    name: '一级告警'
                    // itemStyle: {
                    //     color: '#ee6e6d'
                    // }
                },
                {
                    value: 50,
                    name: '二级告警'
                    // itemStyle: {
                    //     color: '#f19469'
                    // }
                },
                {
                    value: 300,
                    name: '三级告警'
                    // itemStyle: {
                    //     color: '#e7bf5f'
                    // }
                },
                {
                    value: 500,
                    name: '四级告警'
                    // itemStyle: {
                    //     color: '#74b8dd'
                    // }
                },
                {
                    value: 350,
                    name: '五级告警'
                    // itemStyle: {
                    //     color: '#67cb82'
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
    console.log('res', res);
    return res;
};
export const HourDayMonthYear = [
    // { name: '时', id: 0 },
    { name: '日', id: 1 },
    { name: '月', id: 2 },
    { name: '年', id: 3 }
];

export const getBarSeriesData = items => {
    let res = Object.keys(items).map(key => {
        console.log('key', key);
        return { type: 'bar', name: key, data: items[key] };
    });
    return res;
};
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
    console.log('seriesData', seriesData);
    return seriesData;
};
