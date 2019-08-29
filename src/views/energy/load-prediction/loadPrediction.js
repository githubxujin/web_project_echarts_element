export const echartOption = {
    color: ["#FEC068", "#11AA07", "#4EB9DB"],
    tooltip: {
        trigger: "axis",
        formatter: function (params, ticket, callback) {
            let htmlStr = '';
            for (let i = 0; i < params.length; i++) {
                let param = params[i];
                let xName = param.name;//x轴的名称
                let seriesName = param.seriesName;//图例名称
                let value = param.value || '';//y轴值
                let color = param.color;//图例颜色
                if (i === 0) {
                    htmlStr += xName + '时能耗分析<br/>';//x轴的名称
                }
                htmlStr += '<div>';
                //为了保证和原来的效果一样，这里自己实现了一个点的效果
                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;' +
                    'border-radius:5px;background-color:' + color + ';"></span>';

                //圆点后面显示的文本
                const unitSymbol = value ? ' kWh' : '--';
                htmlStr += seriesName + '：' + value + unitSymbol;

                htmlStr += '</div>';
            }
            return htmlStr;
        }
    },
    legend: {
        icon: "rect",
        itemWidth: 10,
        itemHeight: 10,
        top: 10,
        data: ["实际能耗", "预测能耗", "优化值"]
    },
    grid: {
        top: "15%",
        left: "3%",
        right: "5%",
        bottom: "15%",
        containLabel: true
    },
    xAxis: [
        {
            type: "category",
            name: "时",
            nameTextStyle: {
                color: "#555"
            },
            splitLine: {
                show: true,
                lineStyle: {
                    // 网格颜色
                    color: "#E5EFF5"
                }
            },
            axisLine: {
                lineStyle: {
                    color: "#D6D6D6" //坐标线的颜色
                }
            },
            axisTick: {
                show: false
                /* lineStyle:{
                     color: "red"  //刻度颜色
                 }*/
            },
            axisLabel: {
                color: "#555",
            },
            boundaryGap: false,
            data: []
        }
    ],
    yAxis: [
        {
            type: "value",
            name: "用电量 kWh",
            nameTextStyle: {
                color: "#555"
            },
            splitLine: {
                show: true,
                lineStyle: {
                    // 网格颜色
                    color: "#E5EFF5"
                }
            },
            axisLine: {
                lineStyle: {
                    color: "#D6D6D6"
                }
            },
            axisTick: {
                show: false
                /* lineStyle:{
                     color: "red"  //刻度颜色
                 }*/
            },
            axisLabel: {
                color: "#555"
            }
        }
    ],
    series: [
        {
            name: "实际能耗",
            type: "line",
            symbol: "circle",
            showSymbol: false, //只有在 tooltip hover 的时候显示
            /*  itemStyle: {
                color: "rgba(24,199,227,0.2)",
            },*/
            lineStyle: {
                color: "#FEC068"
            },
            smooth: 0.5,
            data: []
        },
        {
            name: "预测能耗",
            type: "line",
            symbol: "circle",
            showSymbol: false, //只有在 tooltip hover 的时候显示
            /* itemStyle: {
                color: "rgba(118,228,79,0.2)",
            },*/
            lineStyle: {
                color: "#0BA800"
            },
            smooth: 0.5,
            data: []
        },
        {
            name: "优化值",
            type: "line",
            symbol: "circle",
            showSymbol: false, //只有在 tooltip hover 的时候显示
            /* itemStyle: {
                color: "rgba(118,228,79,0.2)",
            },*/
            lineStyle: {
                color: "#4EB9DB",
                type: "dotted"
            },
            smooth: 0.5,
            data: []
        }
    ]
}