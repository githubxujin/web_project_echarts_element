<template>
  <div class="inspection">
    <div class="u-layout-search two u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <datePick v-model="checkTime" title="录入时间" :defaultStartTime="defaultStartTime"></datePick>
          </div>
        </div>
        <div class="u-layout-left-item">
          <el-button
            class="el-button el-button--primary el-button--small is-round"
            icon="el-icon-search"
            @click="query"
          >查询</el-button>
        </div>
      </div>
      <div class="u-layout-left-item">
        <el-button @click="getCharts" class="el-button el-button--primary el-button--small">图形</el-button>
        <el-button @click="getData" class="el-button el-button--primary el-button--small">数据</el-button>
        <el-button
          class="el-button el-button--primary el-button--small"
          @click="exportData"
          v-if="pageBtns.some(val=>val=='export')"
        >导出</el-button>
      </div>
    </div>
    <div v-if="!isdata">
      <div id="container" style="height: 665px"></div>
    </div>

    <div class="datatable-box" v-if="isdata">
      <el-table :height="tableHeight" :data="list" class="el-table--border" style="width: 100%;">
        <!--<el-table-column type="index"-->
        <!--label="序号"-->
        <!--width="50"></el-table-column>-->
        <el-table-column prop="name" label="设备"></el-table-column>
        <el-table-column prop="starTime" :sortable="true" label="故障开始时间"></el-table-column>
        <el-table-column prop="recoverTime" :sortable="true" label="故障修复时间"></el-table-column>

        <el-table-column prop="duration" :sortable="true" label="时长(min)"></el-table-column>
        <el-table-column prop="faultDetail" label="故障明细"></el-table-column>
      </el-table>
      <pager :pager="pager" @query="query()" @setPager="setPager"></pager>
    </div>
  </div>
</template>

<script>
import pager from "@/components/table/Pager";
import datePick from "@/components/timerange/separateTime";
import myEcharts from '@/components/echarts/index';
import tableDataList from "@/components/table/tableDataList.vue";
import datetimeUtils from '@/utils/datetime-utils'
import utils from '@/utils/utils.js';
import { getElevatorFaultGraph, getElevatorFaultList, exportElevatorFaultData } from '@/services/safety'
var myChart, echarts, _rawData;
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { datePick, myEcharts, tableDataList, pager },
  data () {
    return {
      list: [],
      tableHeight: 650,
      datetimeUtils: datetimeUtils,
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      pager: {
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      type_options: [{
        value: '待处理报警',
        label: '待处理报警'
      }, {
        value: '所有报警',
        label: '所有报警'
      }]
      , category_options: [{
        value: '1号集水井',
        label: '1号集水井'
      }, {
        value: '2号集水井',
        label: '2号集水井'
      }
        , {
        value: '3号集水井',
        label: '3号集水井'
      }
      ],
      value: '', category_value: '', defaultStartTime: datetimeUtils.getPreDate(10),
      checkTime: { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(10), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') },
      tableData: {
        tHead: [
          { text: '设备', prop: 'name' },
          // { text: '报警名称', prop: 'alarmName' },
          { text: '故障开始时间', prop: 'starTime', sortable: true },
          { text: '故障修复时间', prop: 'recoverTime', sortable: true },
          { text: '时长(min)', prop: 'duration', sortable: true },
          { text: '故障明细', prop: 'faultDetail' }
          // { text: '所在楼层', prop: 'floor', sortable: true },
          // { text: '有无载客', prop: 'anyPassenger' }
        ],
        data: [],
        total: 0,
        showCheckbox: false,
        showSequence: false,
        height: '690',
        paging: false,

      },
      chartOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['第1阶段', '第2阶段', '第3阶段', '第4阶段', '第5阶段']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['1#集水井', '2#集水井', '3#集水井', '4#集水井', '5#集水井', '6#集水井', '7#集水井']
        },
        series: [
          {
            name: '第1阶段',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: '第2阶段',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '第3阶段',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '第4阶段',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },
          {
            name: '第5阶段',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
          }
        ],

        dataZoom: [
          {
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            height: 16,
            borderColor: 'transparent',
            backgroundColor: '#e4eff5',
            fillerColor: '#79b9df',
            handleSize: 20,
            handleStyle: {
              shadowBlur: 6
            },
            labelFormatter: '',
            startValue: 0,
            endValue: 1000,
            zoomLock: false,
            bottom: '2%'
          }
        ]
      }
    }
  }, created () {
    echarts = this.$echarts;
    //this.echartwidth = document.body.clientWidth * 0.85 + 'px';
    // this.tablewidth = document.body.clientWidth * 0.8 + 'px';
  }, mounted () {

    _rawData = {
      parkingApron: {
        data: [
          ["6号集水井"],
          ["5号集水井"],
          ["4号集水井"],
          ["3号集水井"],
          ["2号集水井"],
          ["1号集水井"]
        ]
      },
      flight: {
        dimensions: ["设备故障时间", "开始时间", "结束时间", "D:"
        ],
        data: [
          [],
          // [1, new Date("2019/05/5 08:00:20"), new Date("2019/05/6 08:00:20"), "此阶段掉线", false],
          // [1, new Date("2019/05/6 08:00:20"), new Date("2019/05/7 08:00:20"), "此阶段在线", true],
          //
          // [3, new Date("2019/05/2 08:00:20"), new Date("2019/05/5 08:00:20"), "此阶段在线", true],
          // [3, new Date("2019/05/5 08:00:20"), new Date("2019/05/6 08:00:20"), "此阶段掉线", false],
          // [4, new Date("2019/05/6 08:00:20"), new Date("2019/05/9 08:00:20"), "此阶段在线", true]
        ]
      }
    };
    this.query();
  },
  watch: {
    //门店编码
    shopNumber (val) {
      console.log('shopNumber变化了')
      if (val) {
        this.query();
      }
    }
  },
  methods: {
    query () {
      if (!this.isdata) {

        _rawData.parkingApron.data = []; _rawData.flight.data = [];
        getElevatorFaultGraph({
          shopNumber: this.shopNumber,
          startTime: this.checkTime.start,
          endTime: this.checkTime.end
        }).then((res) => {
          if (res.code == 200) {
            for (let i = 0; i < res.data.length; i++) {
              let obj = res.data[i];
              _rawData.parkingApron.data.push([obj.name]);
              //  _rawData.flight.data.push([i, new Date(this.checkTime.start), new Date(this.checkTime.end), "", true])

              for (let j = 0; j < obj.faultTime.length; j++) {
                let objItem = obj.faultTime[j];
                _rawData.flight.data.push([i, new Date(objItem.startTime), new Date(objItem.endTime), "此阶段故障", false])
              }
            }
            if (_rawData.parkingApron.data.length == 0) {
              this.$message({
                message: '暂无数据！',
                type: 'warning',
                duration: 500
              });
            }
            myChart = echarts.init(document.getElementById("container"));
            myChart.setOption(option = makeOption());
            //myChart.reset();
            //  myChart.showLoading();
          }
        });

      }
      else {

        getElevatorFaultList({
          shopNumber: this.shopNumber,
          startTime: this.checkTime.start,
          endTime: this.checkTime.end,
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize
        }).then((res) => {
          this.pager.total = res.data.total;
          this.list = res.data.list;
        });
      }
    }
    , setPager (val) {
      this.pager.pageSize = val.pageSize;
      this.pager.pageNum = val.pageNum;
    },
    initCharts () {
      // this.chartOption = utils.chartNewLine(this.chartOption, 4, 'xAxis');
    },
    getTime (v) {
      console.log(JSON.stringify(v));
    },
    getData () {
      this.isdata = true;
      this.query();
    },
    getCharts () {
      this.isdata = false;
      this.query();
    }, exportData () {
      if (_rawData.parkingApron.data.length == 0) {
        return this.$message({
          message: '暂无数据！',
          type: 'warning',
          duration: 500
        });
      }
      exportElevatorFaultData(`?token=${localStorage.getItem('$token_info')}&shopNumber=${this.shopNumber}&startTime=${this.checkTime.start}&endTime=${
        this.checkTime.end
        }`);
    }
  }
}
var app = {},
  option = null;
var HEIGHT_RATIO = 0.6;
var DIM_CATEGORY_INDEX = 0;
var DIM_TIME_ARRIVAL = 1;
var DIM_TIME_DEPARTURE = 2;
var _draggable;
var _cartesianXBounds = [];
var _cartesianYBounds = [];
function makeOption () {
  return {
    tooltip: {},
    animation: false,
    title: {
      text: '电梯设备运行记录',
      left: 'center'
    },
    dataZoom: [{
      type: 'slider',
      xAxisIndex: 0,
      filterMode: 'weakFilter',
      height: 20,
      bottom: 0,
      start: 0,
      end: 26,
      handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      showDetail: false
    }],
    grid: {
      show: true,
      top: 70,
      bottom: 20,
      left: 100,
      right: 20,
      backgroundColor: '#fff',
      borderWidth: 0
    },
    xAxis: {
      type: 'time',
      position: 'top',
      splitLine: {
        lineStyle: {
          color: ['#E9EDFF']
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        lineStyle: {
          color: '#929ABA'
        }
      },
      axisLabel: {
        color: '#929ABA',
        inside: false,
        align: 'center'
      }
    },
    yAxis: {
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      min: 0,
      max: _rawData.parkingApron.data.length
    },
    series: [{
      id: 'flightData',
      type: 'custom',
      renderItem: renderGanttItem,
      dimensions: _rawData.flight.dimensions,
      encode: {
        x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
        y: DIM_CATEGORY_INDEX,
        tooltip: [DIM_CATEGORY_INDEX, DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE]
      },
      data: _rawData.flight.data
    }, {
      type: 'custom',
      renderItem: renderAxisLabelItem,
      dimensions: _rawData.parkingApron.dimensions,
      encode: {
        x: -1, // Then this series will not controlled by x.
        y: 0
      },
      data: echarts.util.map(_rawData.parkingApron.data, function (item, index) {
        let a = [index].concat(item[0]);
        return a;
      })
    }]
  };
}

function renderGanttItem (params, api) {
  var categoryIndex = api.value(DIM_CATEGORY_INDEX);
  var timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL), categoryIndex]);
  var timeDeparture = api.coord([api.value(DIM_TIME_DEPARTURE), categoryIndex]);

  var coordSys = params.coordSys;
  _cartesianXBounds[0] = coordSys.x;
  _cartesianXBounds[1] = coordSys.x + coordSys.width;
  _cartesianYBounds[0] = coordSys.y;
  _cartesianYBounds[1] = coordSys.y + coordSys.height;

  var barLength = timeDeparture[0] - timeArrival[0];
  // Get the heigth corresponds to length 1 on y axis.
  var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO;
  barHeight = 45;
  var x = timeArrival[0];
  var y = timeArrival[1] - barHeight;

  var flightNumber = api.value(3) + '';
  var flightNumberWidth = echarts.format.getTextRect(flightNumber).width;
  var text = (barLength > flightNumberWidth + 40 && x + barLength >= 180) ?
    flightNumber : '';

  var rectNormal = clipRectByRect(params, {
    x: x,
    y: y,
    width: barLength,
    height: barHeight
  });
  var rectVIP = clipRectByRect(params, {
    x: x,
    y: y,
    width: (barLength) / 2,
    height: barHeight
  });
  var rectText = clipRectByRect(params, {
    x: x,
    y: y,
    width: barLength,
    height: barHeight
  });
  //alert(api.value(5));
  return {
    type: 'group',
    children: [{
      type: 'rect',
      ignore: !rectNormal,
      shape: rectNormal,
      style: api.style({
        fill: api.value(4) ? '#67CC81' : '#EE6D6D'
      })
    }, {
      type: 'rect',
      ignore: !rectVIP && !api.value(4),
      shape: rectVIP,
      style: api.style({
        fill: api.value(4) ? '#67CC81' : '#EE6D6D'
      })
    }, {
      type: 'rect',
      ignore: !rectText,
      shape: rectText,
      style: api.style({
        fill: 'transparent',
        stroke: 'transparent',
        text: text,
        textFill: '#fff'
      })
    }]
  };
}

function renderAxisLabelItem (params, api) {
  var y = api.coord([0, api.value(0)])[1];
  if (y < params.coordSys.y + 5) {
    return;
  }
  return {
    type: 'group',
    position: [
      10,
      y
    ],
    children: [{
      type: 'path',
      shape: {
        d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
        x: 0,
        y: -20,
        width: 90,
        height: 20,
        layout: 'cover'
      },
      style: {
        fill: '#FFFFFF'//368c6c
      }
    }, {
      type: 'text',
      style: {
        x: 24,
        y: -3,
        text: api.value(1),
        textVerticalAlign: 'bottom',
        textAlign: 'center',
        textFill: '#2B2B2B'//fff
      }
    }]
  };
}


function clipRectByRect (params, rect) {
  return echarts.graphic.clipRectByRect(rect, {
    x: params.coordSys.x,
    y: params.coordSys.y,
    width: params.coordSys.width,
    height: params.coordSys.height
  });
}


</script>

<style lang="scss" scoped>
.echartsTitle {
  text-align: center;
  color: #909399;
  font-size: 16px;
  height: 16px;
  margin-top: -10px;
}
</style>
