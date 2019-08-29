const alarmRankOptions = {
    color: ['rgba(184,114,58,1)'], //['#A96932'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '0',
        containLabel: true,
        borderColor: 'red'
    },
    xAxis: [
        {
            type: 'category',
            data: [],
            axisTick: {
                alignWithLabel: true
            },
            // nameLocation:'end',//坐标轴名称显示位置。
            // x轴的字体样式
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#E6EFFF'
                },
                interval: 0 //横轴信息全部显示
            },
            // x轴的颜色和宽度
            axisLine: {
                lineStyle: {
                    color: '#3C6581',
                    width: 1 //这里是坐标轴的宽度,可以去掉
                }
            }
        }
    ],
    yAxis: [
        {
            minInterval: 1,
            type: 'value',
            name: '数量：个',
            nameTextStyle: {
                color: '#E6EFFF'
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#E6EFFF'
                }
            },
            // y轴的颜色和宽度
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#3C6581',
                    width: 1 //这里是坐标轴的宽度
                },
                symbol: ['none', 'arrow'],
                symbolSize: [6, 10] //第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）。
            },
            //背景网格线
            splitLine: {
                show: false,
                lineStyle: {
                    // 使用深浅的间隔色
                    color: '#ccc',
                    type: 'dashed',
                    shadowBlur: 10
                }
            }
        }
    ],
    series: [
        {
            name: '待解决报警数',
            type: 'bar',
            barWidth: '20',
            label: {
                normal: {
                    show: true,
                    position: 'top' //'inside'
                }
            },
            data: [10, 52, 200, 334, 390, 330, 220, 40]
        }
    ]
};

export { alarmRankOptions };
