export default {
    tooltip: {
        show: false,
        trigger: 'item',
        backgroundColor: 'rgba(10,55,100,0.9)',
        borderColor: '#01EFF2',
        borderWidth: 1,
        padding: [11, 8],
        confine: true,
        textStyle: {
            color: '#B6E1F7',
            lineHeight: 24
        },
        hideDelay: 0
        //鼠标停留在省份显示的数据
        // formatter: function(obj) {
        //     if (obj.data) {
        //         let str =
        //             '<div class="bmr-row bmr-justify-center bmr-items-center bmr-map-tips">'
        //         str += '<h3>' + obj.data.name + '</h3>'
        //         str += '</div>'
        //         str +=
        //             '<div class="bmr-row bmr-justify-center bmr-items-center bmr-map-tips">'
        //         str += '<span>今日能耗</span>'
        //         str += '</div>'
        //         str +=
        //             '<div class="bmr-row bmr-justify-center bmr-items-center bmr-map-tips">'
        //         str += '<h4>总项目数：<sup></sup></h4>'
        //         str += '<span>' + (obj.data.num || 0) + '个<sup></sup></span>'
        //         str += '</div>'
        //         str +=
        //             '<div class="bmr-row bmr-justify-center bmr-items-center bmr-map-tips">'
        //         str += '<h4>总面积：<sup></sup></h4>'
        //         str += '<span>' + (obj.data.area || 0) + 'm<sup>2</sup></span>'
        //         str += '</div>'
        //         str +=
        //             '<div class="bmr-row bmr-justify-center bmr-items-center bmr-map-tips">'
        //         str += '<h4>总能耗：<sup></sup></h4>'
        //         str +=
        //             '<span>' + (obj.data.energy || 0) + 'kWh<sup></sup></span>'
        //         str += '</div>'
        //         str +=
        //             '<div class="bmr-row bmr-justify-center bmr-items-center bmr-map-tips">'
        //         str += '<h4>单位面积能耗：<sup></sup></h4>'
        //         str +=
        //             '<span>' +
        //             (obj.data.unitArea || 0) +
        //             'kWh/m<sup>2</sup></span>'
        //         str += '</div>'
        //         return str
        //     }
        // }
    },

    toolbox: {
        show: false,
        orient: 'vertical',
        x: 'right',
        y: 'center',
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: false
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    roamController: {
        show: false,
        x: 'right',
        mapTypeControl: {
            china: true
        }
    },
    visualMap: {
        min: 800,
        max: 50000,
        realtime: false,
        calculable: false,
        inRange: {
            color: ['#093C5F', '#094361', '#093756']
        },
        show: false
    },
    geo: {
        map: 'china',
        roam: true,
        selectedMode: 'single',
        symbolSize: 8,
        zoom: 1.2,
        itemStyle: {
            areaColor: '#093C5F',
            borderColor: '#03C9D2',
            borderWidth: 1
            // color: '#093C5F',
        },
        emphasis: {
            label: {
                show: false, //默认不显示省份名称
                textStyle: {
                    color: '#00ff00' //省份标签字体颜色
                }
            },
            itemStyle: {
                areaColor: '#093C5F',
                color: '#093C5F',
                borderColor: '#03C9D2'
            }
        }
    },
    series: [{
            name: '正常',
            type: 'scatter',
            symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAPCAYAAADQ4S5JAAABKUlEQVQokX2STStFURSGn3tdJuYm1MnAROn+jOtKlDLxMbklPwCZGKyJ/AEDSYmBzEUtf0DJzEBG7vYxoJiIfIWW1jntc1ze0d5rvc9erbddEhFSSS0ZBmaAKlABToFtYFc0fOFFM7YBW8AkeXUDg8CU1JJx0fBc9vZKC3OsIWDN7iWONu2VC6DdDTZagTc3ViKwahPqkdk0KxrqomEUGCtMGjGgp1DcyULQsAc8Rb3EgNsCMBCl1gt0Rr1r26ELuAI6vHjjIbwAi0BfBPSXRcOdZ53KQlgFNgrmfdFwlsa6BDz+nSofwJwdfgDRYHss/AMsi4bzDHCtAwctzMcGpJcM8L8yDTQj8z1gX+L9F+DQgxmAV+ATmBANl7EnBzh0AjSAedFwmGsC33ONV1TTMxBSAAAAAElFTkSuQmCC',
            coordinateSystem: 'geo', //该系列使用的坐标系
            data: [],
            map: 'china',
            roam: true,
            selectedMode: 'single',
            symbolSize: 12, //8
            itemStyle: {
                color: 'yellow',
                borderColor: '#4B843D',
                borderWidth: 4
            }
        },
        {
            name: '报警',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: 18,
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            scale: 4,
            symbol: 'image://data:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMzBiZDMzMi0wNjgzLWZjNDAtODg2Ni1kOTk1YzUwNjlkZjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTVEMDA4RENDMjIxMTFFOUJBMDJCMzFFMTRCNjFFOTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTVEMDA4REJDMjIxMTFFOUJBMDJCMzFFMTRCNjFFOTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDM3YzY4ZWYtYjk0OC1iYjRmLWFiYzItYTlkNWZjN2NkNGEyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjEzMGJkMzMyLTA2ODMtZmM0MC04ODY2LWQ5OTVjNTA2OWRmNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuipP9oAAADAUExURf8aAP/k4f+8vP+nmP/8/P8LAP/Duf+0qP/5+f9bQP9kSv9JK/8SAP96Zf8SEv/s6f+aif8zM/9sbP8ODv/Z0//Ly/+Jif8aGv89Hf/S0v8FAP/y8v8iAP/Jwf9VVf/19P9pUP9XO//Syv/h3P/Dw/+Mef+Fhf8BAP9dXf+EcP8oKP8mAv8zEv+MjP8sCv/08v+Jdv+vov8wDv9vV/8pBv+7sP8HB/9PMv8nA/9wcP/g4P85GP8AAP////8kAP///91LXEIAAABAdFJOU////////////////////////////////////////////////////////////////////////////////////wDCe7FEAAAC5klEQVR42syXa3eiMBCGI4IiKGq5WbRiu1oUL9ur2jrB//+vNiCFQIYup92es+8XOZiHGd4MyYScMcm2Mx2akMgcTh1bRocRhJSWRoIFHlOQXBpLSa4B+1uXDfYUQiZRogkhisduuVv/L7DqsKBeN+VyTbqMNxz1M1gKARQSoSIKQChVwupbAF4FmuAeBG8qDr8PIRATLiYfwPAdg23307BZcNcW4bkJihD2dnYsB1fAnJdhG2M7lA4ihLaLcMMARUxyQemNeFcBo8HD/hCJG0UrFGaxhz4HX4GXsZuH2edwNPHgKoelIMh9fqW0J8Lrpt/MPQ8C6QNWQ+jmz21RKt8K8IBSesrGdCFUU9jhko4i3ae0P0ouNUrTcD3GWkc+cecCjw0oFMczG3h3Gaj1dsnvTM4emCYOxjiBt+VZilPs8DeexpT6h9J8bWNYdqFUlccW/c2HiTYylbVSnYIrM1gCrzwXL50Lezrom8ubtLXyGA8kBi95qznpzT5Ln/4ajNC/u7A8E9kA7DPcNemH1MUaqxQwZGLnWR/1XfaWd5TT6wtCe2ATJ/N6fUNl63EVu3q8oQWls70eac+73G+HTDOvn9KRveRzKor5pbctlV21cr+nJMwnqvkRJp7XoqwoSl+kkcMh2XN+PXUe2pZ1SIqxpENc86zqLS13bE8gEL1oi/AiOi1W2ohflQIgYolkGfJ6xOxG4YYIv/5vcPBVmBm2R0q7FhxPVQjka3BcJNOvw1Nyj2wVtWAF7skcsbsW7MGcqKboWB14AqaKLkN14GQZwhbAOvBlARSX3qi3EqRF6NJ7Lvm96eDSy14j282tTys0KG43fWSja9FKbZCNrrjF1oK5LbawuXdqpM1v7ufzG5f4SZuh0ivairOKNzQVfSBraNRCK+VirRQuBdxGsYm7NmvGjpu461rtI87O/23j+r2WuV6zfqX+xDHhmwcUpnH10Wj8s4ey/Di4vxwH99XHwT8CDADb9wQ/zwFLlgAAAABJRU5ErkJggg==',
            hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果。
            encode: {
                value: 2
            },
            itemStyle: {
                normal: {
                    color: 'red',
                    shadowColor: 'rgba(255, 36, 0, 0.1)',
                    shadowBlur: 10,
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }
            },
            zlevel: 1,
            // emphasis: {
            //     label: {
            //         show: false
            //     },
            //     itemStyle: {
            //         color: '#D52B00',
            //         borderColor: '#D52B00'
            //     }
            // },
            data: []
        },
        {
            name: '掉线',
            type: 'effectScatter',
            selectedMode: 'single',
            symbolSize: 16,
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            effectType: 'emphasis',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            itemStyle: {
                borderWidth: 6,
                color: '#A7AFB9',
                borderColor: '#A7AFB9'
            },
            emphasis: {
                label: {
                    show: false
                },
                itemStyle: {
                    color: '#A7AFB9',
                    borderColor: '#A7AFB9'
                }
            },
            data: []
        }
    ]
};
