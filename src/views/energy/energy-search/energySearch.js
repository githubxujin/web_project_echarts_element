export const lineOption = {
    color: ['#FF8E8E', '#979BF5', '#F5CB72', '#4BC2E7', '#F5A071', '#48D58E', '#F387A1', '#CF97F2', '#7EABF5', '#AADD61'],
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: 'cross'
        },
        position: function (pos, params, dom, rect, size) {
            let yPos = "20%";
            let xPos = 0;
            if (pos[0] < size.viewSize[0] / 2) {
                xPos = pos[0] + 10;
            } else {
                xPos = pos[0] - dom.offsetWidth - 10;
            }
            return [xPos, yPos];
        },
        formatter: ''
    },
    legend: {
        type: "scroll",
        icon: "rect",
        itemWidth: 10,
        itemHeight: 10,
        top: 5,
        left: 45,
        right: 120,
        data: []
    },
    toolbox: {
        show: true,
        right: 30,
        top: 10,
        feature: {
            mark: {
                show: true
            },
            // magicType: {
            //     show: true,
            //     type: ["line", "bar"]
            // },
        }
    },
    grid: {
        left: '50',
        right: '50',
        containLabel: true
    },
    calculable: true,
    xAxis: [
        {
            type: "category",
            // boundaryGap: false,
            name: '',//this.dateName,
            nameTextStyle: {
                color: "#3a3a3a"
            },
            axisLabel: {
                //X轴文字颜色
                show: true,
                textStyle: {
                    color: "#3A3A3A"
                },
            },
            splitLine: {
                //X轴方向网格线颜色
                show: true,
                lineStyle: {
                    color: ["#E5EFF5"]
                }
            },
            // axisTick: {
            //     alignWithLabel: true
            // },
            axisLine: {
                //X轴颜色
                lineStyle: {
                    color: "#D6D6D6",
                    width: 1
                }
            },
            data: []
        },
        {
            type: "category",
            // boundaryGap: false,
            name: '',//this.dateName,
            nameTextStyle: {
                color: "#3a3a3a"
            },
            // axisTick: {
            //     alignWithLabel: true
            // },
            axisLabel: {
                //X轴文字颜色
                show: true,
                textStyle: {
                    color: "#3A3A3A"
                },
                // interval: 1,
                // rotate: 20,
            },
            splitLine: {
                //X轴方向网格线颜色
                show: true,
                lineStyle: {
                    color: ["#E5EFF5"]
                }
            },

            axisLine: {
                //X轴颜色
                lineStyle: {
                    color: "#D6D6D6",
                    width: 1
                }
            },
            data: []
        },
    ],
    yAxis: [
        {
            type: "value",
            name: '',
            nameTextStyle: {
                color: "#3a3a3a"
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ["#E5EFF5"]
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#3A3A3A"
                }
            },
            nameGap: '20',
            // nameLocation: 'middle',
            axisLine: {
                lineStyle: {
                    color: "#D6D6D6",
                    width: 1
                }
            }
        }
    ],
    series: []
};