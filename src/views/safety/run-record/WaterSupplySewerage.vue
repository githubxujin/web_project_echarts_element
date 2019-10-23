<template>
  <div class="inspection">
    <div class="u-layout-search two u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">系统：</p>
            <div class="input-container">
              <div class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select
                  v-model="systemId"
                  @change="getCategoryOptions(systemId)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in systemIds"
                    :key="item.systemId"
                    :label="item.name"
                    :value="item.systemId"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>

        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">设备：</p>
            <div class="input-container multiple" style="width:250px ">
              <div style="border-radius: 2px;" class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <mult-select v-model="equipmentId" :options="category_options"></mult-select>
                <!--<el-select v-model="equipmentId"-->
                <!--:style="{width:getWidth()}"-->
                <!--multiple-->
                <!--clearable-->
                <!--placeholder="请选择">-->
                <!--<el-option v-for="item in category_options"-->
                <!--:key="item.equipmentId"-->
                <!--:label="item.name"-->
                <!--:value="item.equipmentId">
                 </el-option>
                </el-select>-->
              </div>
            </div>
          </div>
        </div>
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
    <div
      v-show="!isdata"
      id="containers"
      style="width:100%;height:620px;overflow: auto;overflow-x: hidden;"
    >
      <myEcharts
        :id="'exampleId4'"
        v-if="systemId!=7&&chartOption.series.length != 0"
        :style="{width:echartwidth, height: '665px'}"
        :option="chartOption"
      />
      <div
        v-if="(systemId!=7&&chartOption.series.length == 0)||(systemId==7&&loadText =='暂无数据')"
        style="text-align: center;height:400px;color: #909399; padding-top: 200px;font-size: 12px"
      >
        <span>{{loadText}}</span>
      </div>
      <div id="container" v-show="showContainer" style="height: 665px"></div>
      <!--<div class="echartsTitle">   msg_end.scrollIntoView(); -->
      <!--{{datetimeUtils.GMTToStr(checkTime.start).length>0?datetimeUtils.GMTToStr(checkTime.start).split(' ')[0]:''}}~{{datetimeUtils.GMTToStr(checkTime.end).length>0?datetimeUtils.GMTToStr(checkTime.end).split(' ')[0]:''}}-->
      <!--电梯明细</div>-->
    </div>
    <div v-if="isdata" class="datatable-box">
      <tableDataList
        id="tableList"
        v-show="systemId!=7"
        style="width: 48%;float: left"
        :show-sequence="tableData_LiquidLevel.showSequence"
        :v-table-data="tableData_LiquidLevel"
      ></tableDataList>
      <tableDataList
        id="tableList1"
        :style="systemId!=7?'width: 48%;float: left; padding-left: 10px':'width: 100%;float: left; padding-left: 10px'"
        :show-sequence="tableData.showSequence"
        :v-table-data="tableData"
      ></tableDataList>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
//设定moment区域为中国
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import MultSelect from '@/components/form/MultSelect.vue';
import datePick from "@/components/timerange/separateTime";
import myEcharts from '@/components/echarts/index';
import tableDataList from "@/components/table/tableDataList.vue";
import datetimeUtils from '@/utils/datetime-utils'
import utils from '@/utils/utils.js';
import {  getWaterSupplyDrainageSysStyle, getWaterSupplyDrainageEquipStyle, getWaterSupplyDrainageByGanttChart, getWaterSupplyDrainageByLineChart,
  getWaterSupplyDrainageFaultList, getWaterSupplyDrainageListByLiquidLevel,
  getElevatorFaultGraph, getElevatorFaultList, exportDrainage} from '@/services/safety'
var myChart, echarts, _rawData;
import baseOptions from '@/utils/baseOptions';
var t_time = '';
export default {
  extends: baseOptions,
  components: { datePick, myEcharts, tableDataList, MultSelect },
  data () {
    return {
      showContainer: true,
      loadText: '暂无数据',
      systemId: null,
      systemIds: [],
      ischart: true,
      datetimeUtils: datetimeUtils,
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      type_options: []
      , category_options: [],
      value: '', equipmentId: [], defaultStartTime: datetimeUtils.getPreDate(10),
      checkTime: { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(10), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') },
      tableData: {
        tHead: [],
        data: [],
        showSequence: false,
      }, tableData_LiquidLevel: {
        tHead: [],
        data: [],
        showSequence: false,
      },
      chartOption: {
        color: ['#028CF7', '#4852DD', '#9D67FF', '#0DD789', '#F19F02', '#11AA07', '#F14D4D', '#00FFFC', '#FF8080', '#6FD1FF', '#A39823'],
        grid: {
          left: '3%',
          right: '5%',
          top: '30px',
          bottom: '5%'
        },
        legend: {
          data: [],
          itemWidth: 9,
          itemHeight: 9,
          itemGap: 20,
          right: 45
        },
        xAxis: [{
          name: '时间(时)', type: 'category',
          data: [],   // x轴的字体样式
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
            symbol: ['none', 'arrow'],
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            color: '#3A3A3A',
            interval: 'auto'
          },
          splitArea: {
            show: true
          }
        }],
        yAxis: {
          name: '液位(m)',
          type: 'value',
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
            symbol: ['none', 'arrow'],
            lineStyle: {
              color: '#E5EFF5'
            }
          },
          axisLabel: {
            color: '#3A3A3A',
            interval: 0
          }
        },
        series: [{
          name: '空调明细',
          data: [5, 6, 7, 8, 9, 10, 12, 15, 16],
          type: 'line',
          smooth: true
        }],
        tooltip: {
          trigger: 'axis',
          // formatter: function (param) {
          //   console.log('param', param)
          // }
        },
      }
    }
  }, created () {
    this.$message.closeAll();
    t_time = (this.datetimeUtils.GMTToStr(this.checkTime.start).length > 0 ? this.datetimeUtils.GMTToStr(this.checkTime.start).split(' ')[0] : '') + '~' + (this.datetimeUtils.GMTToStr(this.checkTime.end).length > 0 ? this.datetimeUtils.GMTToStr(this.checkTime.end).split(' ')[0] : '');
    echarts = this.$echarts;
  }, mounted () {
    var obj = document.getElementsByClassName("el-select__tags");
    obj[0].style = "";
    var obj = document.getElementsByClassName("el-select el-select--small");
    obj[1].style = "width: 250px;";
    _rawData = {
      parkingApron: {
        data: [

        ]
      },
      flight: {
        dimensions: ["时间", "开始时间", "结束时间", "D:"
        ],
        data: [
          []
        ]
      }
    };
    this.init();
  },
  methods: {
    init () {
      this.chartOption.xAxis[0].data = [];
      this.chartOption.series = [];
      this.category_options = [];
      let that = this;
      getWaterSupplyDrainageSysStyle({
      }).then((res) => {
        if (res.code == 200) {
          this.systemId = res.data[0].systemId;
          this.systemIds = res.data;
          getWaterSupplyDrainageEquipStyle({ shopNumber: this.shopNumber, systemId: this.systemId }).then((rd) => {
            if (rd.code == 200) {
              if (rd.data.length > 0) {
                that.equipmentId.push(rd.data[0].equipmentId);
                rd.data.forEach(function (item, i) {
                  that.category_options.push({ label: item.name, value: item.equipmentId })
                });
                this.query();
              }
            }
          });
        }
      });
    },
    query () {
      this.showContainer = true;
      t_time = (this.datetimeUtils.GMTToStr(this.checkTime.start).length > 0 ? this.datetimeUtils.GMTToStr(this.checkTime.start).split(' ')[0] : '') + '~' + (this.datetimeUtils.GMTToStr(this.checkTime.end).length > 0 ? this.datetimeUtils.GMTToStr(this.checkTime.end).split(' ')[0] : '');
      let equipment_Ids = '';
      let t = this;
      this.equipmentId.forEach(function (n, i) {
        equipment_Ids += n;
        if (t.equipmentId.length - 1 != i) {
          equipment_Ids += ','
        }
      });
      if (equipment_Ids == '') {
        this.$message.error("设备不能为空");
        return;
      }

      console.log(JSON.stringify(this.checkTime));
      this.ischart = false;
      let o = {
        equipmentIds: equipment_Ids,
        shopNumber: this.shopNumber,
        startTime: this.checkTime.start + " 0:0:0",// this.checkTime.start + ' 00:00:00',
        endTime: this.checkTime.end + " 23:0:0",// this.checkTime.end + ' 23:59:59',
        systemId: this.systemId
      };
      if (!this.isdata) {

        this.loadText = "加载中...";
        this.ischart = true;
        this.chartOption.xAxis[0].data = [];
        this.chartOption.series = [];
        this.chartOption.legend.data = [];
        if (this.systemId == 6) {

          getWaterSupplyDrainageByLineChart(o).then((res) => {
            this.loadText = "";
            if (res.code == 200) {

              let obj = res.data;

              for (let i = 0; i < obj.length; i++) {
                let obji = obj[i].paramValue;
                this.chartOption.legend.data.push(obj[i].name);
                let param = {
                  name: obj[i].name,
                  data: [],
                  type: 'line',
                  smooth: true
                };
                for (let j = 0; j < obji.length; j++) {
                  let objj = obji[j];
                  if (!this.chartOption.xAxis[0].data.includes(objj.time)) {
                    this.chartOption.xAxis[0].data.push(objj.time);
                  }
                  param.data.push(objj.currValue)
                }
                this.chartOption.series.push(param);
              }
              if (this.chartOption.series.length == 0 && !this.isdata) {
                document.getElementById("containers").scrollTop = document.getElementById("containers").scrollHeight;
              }

              this.get_WaterSupplyDrainageByGanttChart(o);
            }

          });
        }
        else {
          this.get_WaterSupplyDrainageByGanttChart(o);
        }





      }
      else {
        this.tableData.data = []; this.tableData_LiquidLevel.data = [];
        getWaterSupplyDrainageFaultList(o).then((res) => {
          if (res.code == 200) {
            this.tableData.tHead = [
              { text: '生活水泵设备', prop: 'name' },
              { text: '开始时间', prop: 'startTime' },
              { text: '结束时间', prop: 'endTime' },
              { text: '时长（min）', prop: 'duration', sortable: true },
              { text: '故障明细', prop: 'detail' }
            ];
            this.tableData.data = res.data;
          };
          this.loadText = "暂无数据";
        });
        if (this.systemId == 6) {
          getWaterSupplyDrainageListByLiquidLevel(o).then((res) => {
            if (res.code == 200) {
              this.tableData_LiquidLevel.tHead = [
                { text: '时间', prop: 'time' },
                { text: '生活水箱设备', prop: 'name' },
                { text: '生活水箱液位（m）', prop: 'liquidLevel', sortable: true },
                { text: '是否超限', prop: 'overrun' }
              ];
              this.tableData_LiquidLevel.data = res.data;
            }
            this.loadText = "暂无数据";
          });        }

      }

    },
    get_WaterSupplyDrainageByGanttChart (objParam) {

      _rawData.parkingApron.data = []; _rawData.flight.data = [];
      getWaterSupplyDrainageByGanttChart(objParam).then((res) => {
        this.loadText = "加载中...";
        if (res.code == 200) {
          for (let i = 0; i < res.data.length; i++) {
            let obj = res.data[i];
            _rawData.parkingApron.data.push([obj.name]);
            for (let j = 0; j < obj.time.length; j++) {
              let objItem = obj.time[j];
              _rawData.flight.data.push([i, new Date(objItem.runningStartTime), new Date(objItem.runningEndTime), obj.name, false])
            }
          }

          myChart = echarts.init(document.getElementById("container"));
          myChart.setOption(option = makeOption());
        }
        if (_rawData.flight.data.length > 0 || this.chartOption.series.length > 0) {
          if (_rawData.flight.data.length == 0) {
            this.showContainer = false;
          }
        }
        else if (!this.isdate && _rawData.flight.data.length == 0 && this.chartOption.series.length == 0) {
          this.loadText = "暂无数据";
          this.showContainer = false;
          if (this.systemId == 6) {
            this.$message({
              message: '折线图和给排水系统暂无数据！',
              type: 'warning',
              duration: 1000
            });
          } else {
            this.$message({
              message: '给排水系统暂无数据！',
              type: 'warning',
              duration: 1000
            });
          }
        }
        else if (_rawData.flight.data.length == 0 && !this.isdata) {
          this.showContainer = false;
          this.$message({
            message: '给排水系统暂无数据！',
            type: 'warning',
            duration: 1000
          });
        }
        else if (this.chartOption.series.length == 0 && !this.isdata) {
          this.loadText = "暂无数据";
          this.$message({
            message: '折线图表暂无数据！',
            type: 'warning',
            duration: 500
          });
        }
      });
    },
    initCharts () {
      // this.chartOption = utils.chartNewLine(this.chartOption, 4, 'xAxis');
    },
    getTime (v) {
      console.log(JSON.stringify(v));
    },
    getCharts () {
      this.isdata = false;
      this.query();
    },
    getData () {
      this.isdata = true;
      this.query();
    },
    getCategoryOptions (sysId) {
      let that = this;
      this.equipmentId = []; this.category_options = [];
      getWaterSupplyDrainageEquipStyle({ shopNumber: this.shopNumber, systemId: sysId }).then((rd) => {
        if (rd.code == 200) {
          if (rd.data.length > 0) {
            this.equipmentId.push(rd.data[0].equipmentId);
            rd.data.forEach(function (item, i) {
              that.category_options.push({ label: item.name, value: item.equipmentId })
            });
            this.query();
          }
        }
      });
    }, getWidth (defaultWidth = 150, size = 150) {
      return this.equipmentId.length <= 1 ? defaultWidth + 'px' : defaultWidth + (this.equipmentId.length - 1) * size + 'px';
    },
    exportData () {
      let equipment_Ids = '';
      let t = this;
      this.equipmentId.forEach(function (n, i) {
        equipment_Ids += n;
        if (t.equipmentId.length - 1 != i) {
          equipment_Ids += ','
        }
      });
      if (equipment_Ids == '') {
        this.$message.error("设备不能为空");
        return;
      }
      // let o = {
      //     equipmentIds: equipment_Ids,
      //     shopNumber: this.shopNumber,
      //     startTime: this.checkTime.start + " 0:0:0",// this.checkTime.start + ' 00:00:00',
      //     endTime: this.checkTime.end + " 23:0:0",// this.checkTime.end + ' 23:59:59',
      //     systemId: this.systemId
      // };
      exportDrainage(`?token=${localStorage.getItem('$token_info')}&shopNumber=${this.shopNumber}&startTime=${this.checkTime.start + " 0:0:0"}&endTime=${
        this.checkTime.end + " 23:0:0"
        }&equipmentIds=${
        equipment_Ids
        }&systemId=${
        this.systemId
        }`);
    }
  }, watch: {
    systemId (oval, nval) {
    },
    shopNumber (val) {
      console.log('shopNumber变化了')
      if (val) {
        this.init();
      }
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
      text: t_time + '给排水设备运行记录',
      left: 'center'
    },
    tooltip: {
      formatter: function (params) {
        if (params.data.length > 3) {
          return '报警名称：' + params.data[3] + '<br/>' + '开始时间：' + moment(params.data[1]).format('YYYY-MM-DD HH:mm:ss') + '<br/>' + '结束时间：' + moment(params.data[2]).format('YYYY-MM-DD HH:mm:ss');
        }
      }
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
      encode: {
        x: [0, 1, 2],
        y: 0,
        // 表示『维度2』和『维度3』和『维度4』要显示到 tooltip 中。
        // tooltip: [1, 2, 3]
      },
      // 表示给『维度2』和『维度3』和『维度4』分别取名为『开始时间』和『结束时间』和『报警名称』，显示到 tooltip 中。
      dimensions: [null, '开始时间', '结束时间', '报警名称'],
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
