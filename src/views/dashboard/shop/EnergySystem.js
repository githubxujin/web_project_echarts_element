export const option = {
    color: ['#b3d465', '#71c455', '#00b7ee', '#d18463'],
    title: {
        text: '',
        x: 'center',
        y: 'bottom',
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        // zlevel:100,
        z: 2,
        style: {
            text: ``,
            fill: '#fff',
            width: 20,
            height: 20,
            font: '12px Microsoft YaHei'
        }
    },
    series: [{
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
            normal: {
                position: 'inner',
                fontSize: '10',
                align: 'center',
                verticalAlign: 'bottom'
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '14',
                    fontWeight: 'bold'
                }
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: []
    }]
}
