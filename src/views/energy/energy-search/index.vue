<template>
  <div class="p-container">
    <div class="sub-nav single energy-search">
      <i
        class="left-active-btn"
        :class="show?'iconfont icon-shouqix':'iconfont icon-zhankai1'"
        @click="leftActiveBtn"
        :title="show?'折叠':'展开'"
      ></i>
      <div class="left-tab-tree" :class="!collapse?'hide-tree':'show-tree'">
        <left-side-tree :collapse="collapse" @leftTreeData="getLeftTreeData"></left-side-tree>
      </div>
      <div class="right-energy-info" :class="collapse?'reduceBox':'expendBox'">
        <div class="energy-info">
          <el-tabs v-model="activeName">
            <el-tab-pane label="能耗查询" name="default">
              <div class="energy-search-info">
                <div class="u-layout-search two u-layout-dobule">
                  <div class="u-layout-left-proviso">
                    <div class="u-layout-left-item">
                      <div class="title-input-group u-title-input-group">
                        <p class="text">时间粒度：</p>
                        <div class="input-container">
                          <tab-btn
                            :dataArr="timeGranularity"
                            :value="timetype"
                            @change="getTimeType"
                          ></tab-btn>
                        </div>
                      </div>

                      <div class="title-input-group u-title-input-group">
                        <p class="text">对比条件：</p>
                        <div class="input-container">
                          <tab-btn
                            :dataArr="comparisonType"
                            :value="compareType"
                            @change="getComparisonType"
                          ></tab-btn>
                        </div>
                      </div>

                      <div class="title-input-group u-title-input-group">
                        <p class="text">时间筛选：</p>
                        <div class="input-container">
                          <select-time
                            :dateType="dateType"
                            :vFormat="format"
                            :defaultStartTime="startTime"
                            :defaultEndTime="endTime"
                            @checkedTime="getTime"
                          ></select-time>
                        </div>
                      </div>

                      <div class="title-input-group u-title-input-group">
                        <el-button
                          type="primary"
                          icon="el-icon-search"
                          round
                          @click="$common.throttle(getList)()"
                        >查询</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="u-layout-right-item">
                    <el-button
                      @click="getCharts"
                      class="el-button el-button--primary el-button--small"
                    >图形</el-button>
                    <el-button
                      @click="getData"
                      class="el-button el-button--primary el-button--small"
                    >数据</el-button>
                  </div>
                </div>
                <!-- 能耗图形 -->
                <div class="e-charts">
                  <v-chart
                    :option="lineOption"
                    id="energySearch"
                    :style="{height:'500px'}"
                    @eclick="eclick"
                    v-if="!isData"
                  />
                  <div v-else class="table-display-data">
                    <el-table
                      :data="tableList.tData"
                      border
                      style="width: 100%"
                      ref="table"
                      height="490"
                    >
                      <el-table-column
                        v-for="item in tableList.tHead"
                        :key="item.text"
                        :prop="item.prop"
                        :label="item.text"
                        align="center"
                      ></el-table-column>
                    </el-table>
                  </div>
                </div>
                <!-- 能耗表格展示 -->
                <div class="table-title">{{tableTitle}} 能耗查询明细</div>
                <div class="datatable-box">
                  <el-table :data="tableData.tData" border style="width: 100%" ref="table">
                    <el-table-column
                      v-for="item in tableData.tHead"
                      :key="item.text"
                      :prop="item.prop"
                      :label="item.text"
                      :sortable="item.sortable"
                      align="center"
                    ></el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import leftSideTree from '@/components/sideTree/index.vue'
import tabBtn from '@/components/tabs/Tabs.vue'
import selectTime from '@/components/timerange/selectTime.vue'
import datetimeUtils from '@/utils/datetime-utils'
import { lineOption } from './energySearch'
import { getEnergyList } from '@/services/energy'
import vChart from '@/components/echarts/index';

export default {
  components: { leftSideTree, tabBtn, selectTime, vChart },
  data () {
    return {
      activeName: 'default',
      show: true,
      collapse: true,//控制左侧树的显示和隐藏
      timeGranularity: [
        { label: '时', value: 1 },
        { label: '日', value: 2 },
        { label: '月', value: 4 },
        { label: '年', value: 6 },
      ],//时间粒度
      comparisonType: [
        { label: '无对比', value: 1 },
        { label: '同比', value: 2 },
        { label: '环比', value: 3 },
      ],//对比条件
      dateType: 'datetime',//时间类型
      format: 'yyyy-MM-dd HH',//时间格式
      startTime: new Date(datetimeUtils.getPreDate(3).toLocaleDateString().replace(/\//g, '-') + " 00:00:00"),
      endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59),
      searchFile: {
        compareType: 1,
        timeType: 1,
        endTime: new Date().toLocaleDateString().replace(/\//g, '-') + " 23:59:59",
        startTime: datetimeUtils.getPreDate(3).toLocaleDateString().replace(/\//g, '-') + " 00:00:00",
        energyType: '',
        shopNumber: '',
        subCode: '01000',
        subType: '1',
      },
      timetype: 1,
      compareType: 1,
      tableHead: [],//放置实际选项表头
      currentData: [],
      compareHead: [],//放置对比表头
      compareData: [],
      isData: false,
      tableTitle: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(3), '-') + " 00:00:00" + '~' + datetimeUtils.getSpecialDay(new Date()) + " 23:59:59",
      tableData: {
        tHead: [
          {
            text: "对象名称",
            prop: "name",
            sortable: true
          },
          {
            text: "累计能耗（kWh）",
            prop: "totalEnergy",
            sortable: true
          },
          {
            text: "平均值（kWh）",
            prop: "avgEnergy",
            sortable: true
          },
          {
            text: "最大值（kWh）",
            prop: "maxEnergy",
            sortable: true
          },
          {
            text: "能耗最大值产生时间",
            prop: "maxEnergyDate",
            sortable: true
          }
        ],
        tData: []
      },
      tableHeight: 'auto',
      energyList: [],//能耗列表
      lineOption: lineOption,
      unit: 'kWh',
      seriesArr: [],//放置echarts需要的数据
      message: '',
      tableList: {
        tHead: [
          {
            text: '时间',
            prop: 'time'
          }
        ],
        tData: []
      }//放置处理过后的图表数据
    };
  },
  created () {
  },
  computed: {
    roleType: function () {
      return this.$store.getters.getUserInfo.roleType;
    },
    curShop: function () {
      return this.$store.getters.getCurShop;
    },
    shopNumber: function () {
      return this.$store.getters.shopNumber;
    }
  },
  watch: {
    shopNumber (val) {
      this.searchFile.shopNumber = val;
      this.getEnergyList()
    },
    curShop: {
      handler: function (val, old) {
        this.searchFile.shopNumber = val.shopNumber;
        this.getEnergyList()
      },
      deep: true
    },
    unit (val) {
      this.tableData.tHead[1].text = "累计能耗" + (val);
      this.tableData.tHead[2].text = "平均值" + (val);
      this.tableData.tHead[3].text = "最大值" + (val);
    }
  },
  methods: {
    // 控制树显示和隐藏
    leftActiveBtn () {
      this.show = !this.show
      this.collapse = !this.collapse
    },
    getLeftTreeData (data) {
      if (data.number) {
        this.initDate(data)
        this.getEnergyList()
      } else {
        this.$message.error('请选择分项')
      }
    },
    initDate (val) {
      this.searchFile.energyType = val.type;
      this.searchFile.subCode = val.number;
      this.searchFile.subType = val.subType;
      this.searchFile.shopNumber = this.roleType == 2 ? this.shopNumber : this.curShop.shopNumber;
      this.unit = this.searchFile.energyType == '01' ? 'kWh' : 'm³'
    },
    // 获得时间粒度
    getTimeType (type) {
      this.timetype = type
      this.searchFile.timeType = type
      this.endTime = new Date(datetimeUtils.getCurYearMonthDay() + " 23:59:59")
      switch (type) {
        case 1:
          this.dateType = 'datetime'
          this.format = "yyyy-MM-dd HH"
          this.startTime = new Date(datetimeUtils.getTodayCurBeforeEndDate(3))
          this.searchFile.startTime = datetimeUtils.getTodayCurBeforeEndDate(3);
          break;
        case 2:
          this.dateType = 'date'
          this.format = "yyyy-MM-dd"
          this.startTime = new Date(datetimeUtils.getTodayCurBeforeEndDate(15))
          // this.searchFile.startTime = datetimeUtils.getTodayCurBeforeEndDate(15);
          break;
        case 4:
          this.dateType = 'month'
          this.format = "yyyy-MM"
          this.startTime = datetimeUtils.getBeforeMonth(1);
          let month = datetimeUtils.getBeforeMonth(1).getMonth() + 1 <= 9 ? '0' + (datetimeUtils.getBeforeMonth(1).getMonth() + 1) : datetimeUtils.getBeforeMonth(1).getMonth() + 1
          this.searchFile.startTime = datetimeUtils.getBeforeMonth(1).getFullYear() + '-' + month + '-' + datetimeUtils.getBeforeMonth(1).getDate() + " 00:00:00";
          break;
        default:
          this.dateType = 'year'
          this.format = "yyyy"
          this.startTime = new Date(new Date().getFullYear() - 12, '01', '01');
          this.searchFile.startTime = new Date().getFullYear() - 12 + '-' + '01-01 00:00:00'
      }
      // this.searchFile.endTime = new Date().toLocaleDateString().replace(/\//g, '-') + " 23:59:59";
    },
    getComparisonType (type) {
      this.compareType = type
      this.searchFile.compareType = type
    },
    // 获取开始时间和结束时间
    getTime (time, message) {
      this.searchFile.startTime = time.start;
      this.searchFile.endTime = time.end;
      this.message = message
      console.log('月对应的时间', time)
    },
    getList () {
      if (this.message) {
        this.$message.error(this.message)
        return false
      }
      switch (this.dateType) {
        case 'datetime':
          this.tableTitle = `${this.searchFile.startTime}~${this.searchFile.endTime}`
          break;
        case 'date':
          this.tableTitle = this.searchFile.startTime.slice(0, 10) !== this.searchFile.endTime.slice(0, 10) ? `${this.searchFile.startTime.slice(0, 10)}日~${this.searchFile.endTime.slice(0, 10)}日` : `${this.searchFile.endTime.slice(0, 10)}日`
          break;
        case 'month':
          this.tableTitle = this.searchFile.startTime.slice(0, 7) !== this.searchFile.endTime.slice(0, 7) ? `${this.searchFile.startTime.slice(0, 7)}月~${this.searchFile.endTime.slice(0, 7)}月` : `${this.searchFile.endTime.slice(0, 7)}月`
          break;
        default:
          this.tableTitle = this.searchFile.startTime.slice(0, 4) !== this.searchFile.endTime.slice(0, 4) ? `${this.searchFile.startTime.slice(0, 4)}年~${this.searchFile.endTime.slice(0, 4)}年` : `${this.searchFile.endTime.slice(0, 4)}年`
          break;
      }
      this.getEnergyList();
    },
    // 查询能耗信息
    async getEnergyList () {
      const tipEnum = {
        "1": "分项",
        "2": "支路"
      }
      if (!this.searchFile.subCode) {
        this.$message.error(`请选择${tipEnum[this.searchFile.subType]}`);
        return false;
      }
      let result = await getEnergyList(this.searchFile);
      this.tableData.tData = result.data.energyInfo;
      this.energyList = result.data.energyList;
      // 每条线为一个对象，对象里面包含点的数组集合，样式，名称，类型
      let xData = []//放置x轴的标度
      let xData1 = []//放置x轴的标度
      let lendData = []//标记标签
      let solidArr = []//被对比对象的数据信息
      let dottedArr = []//环比对象的数据信息
      let dashedArr = []//同比对象的数据信息
      let echartColor = ['#4EB9DB', '#C88FC2', '#4BC484', '#8E73F3', '#D94949', '#FEC068', '#3183FF', '#BAE730', '#91B2B4', '#FF8969'];//自定义线条的颜色
      this.energyList.forEach((item, ind) => {
        // 确定线型
        if (item.name.indexOf('同比') > -1) {
          dashedArr.push(item)
        } else if (item.name.indexOf('环比') > -1) {
          dottedArr.push(item)
        } else {
          solidArr.push(item)
        }
      })
      let compareArr = this.searchFile.compareType === 2 ? dashedArr : dottedArr;
      this.handleEchartsData(solidArr, lendData, echartColor, xData, xData1, 'solidArr', compareArr);
      if (compareArr.length > 0) {
        this.handleEchartsData(compareArr, lendData, echartColor, xData, xData1, 'compareArr', solidArr);
      }
      this.initLineData(Array.from(new Set(xData)), Array.from(new Set(xData1)), lendData, this.seriesArr)
    },
    // 讲数据处理成echarts需要的数据格式
    handleEchartsData (arr, lendData, echartColor, xData, xData1, type, compareArr) {
      arr.forEach((sub, ind) => {
        lendData.push(sub.name);
        let obj = {
          name: sub.name,
          type: "line",
          smooth: true,
          symbol: "circle",
          showSymbol: false, //只有在 tooltip hover 的时候显示
          symbolSize: 6,
          itemStyle: {
            normal: {
              lineStyle: {
                type: ''  // 环比'dotted'点虚线，'solid'实线，同比'dashed' 线虚线
              }
            }
          },
          data: []
        };
        obj.itemStyle.normal.lineStyle.type = type == 'solidArr' ? 'solid' : (this.searchFile.compareType == 2 ? 'dashed' : 'dotted');
        obj.itemStyle.normal.color = echartColor[ind];
        if (sub.list.length > 0) {
          sub.list.forEach(item => {
            obj.data.push(item.curtotal)
            if (type == 'solidArr') {
              xData.push(item.dateTime)
            } else {
              xData1.push(item.dateTime)
              obj.xAxisIndex = 1;
            }
          })
        }
        this.seriesArr.push(obj)
      })
    },
    // 绘制折线图
    initLineData (xData, xData1, lendData, seriesData) {
      this.currentData = [];
      this.compareHead = [];
      this.compareData = [];
      this.tableHead = [];
      this.tableList.tHead = [{ text: '时间', prop: 'time' }];
      this.tableList.tData = [];
      let that = this
      this.lineOption.xAxis[0].data = xData;
      this.lineOption.xAxis[1].data = xData1;
      this.lineOption.color = ['#4EB9DB', '#C88FC2', '#4BC484', '#8E73F3', '#D94949', '#FEC068', '#3183FF', '#BAE730', '#91B2B4', '#FF8969'];
      this.lineOption.legend.data = lendData;
      this.lineOption.series = seriesData;
      seriesData.forEach(item => {
        if (item.name.indexOf('同比') > -1 || item.name.indexOf('环比') > -1) {
          if (this.compareData.length == 0) {
            this.compareData.push(item)
          } else {
            let ind = this.compareData.findIndex(value => value.name == item.name);
            if (ind == -1) {
              this.compareData.push(item)
            }
          }
        } else {
          if (this.currentData.length == 0) {
            this.currentData.push(item)
          } else {
            let ind = this.currentData.findIndex(value => value.name == item.name);
            if (ind == -1) {
              this.currentData.push(item)
            }
          }
        }
      })
      this.currentData.forEach(item => {
        let obj = {}
        obj.text = item.name;
        obj.prop = item.name;
        this.tableList.tHead.push(obj)
      })
      if (this.compareData.length > 0) {
        this.tableList.tHead.push({ text: '对比时间', prop: 'compareTime' })
        this.compareData.forEach(item => {
          let obj = {}
          obj.text = item.name;
          obj.prop = item.name;
          this.tableList.tHead.push(obj)
        })
      }
      xData.forEach((item, i) => {
        let data = {}
        this.tableList.tHead.forEach(item => {
          data[item.prop] = ""
        })
        data.time = item;
        this.currentData.forEach(sub => {
          data[sub.name] = sub.data[i]
        })
        if (this.compareData.length > 0) {
          data.compareTime = xData1[i]
          this.compareData.forEach(sub => {
            data[sub.name] = sub.data[i]
          })
        }
        this.tableList.tData.push(data)
      })
      let yName = this.searchFile.energyType === '01' ? "用电量:kWh" : "用水量:m³"
      this.lineOption.yAxis[0].name = yName;
      this.lineOption.tooltip.formatter = function (params, ticket, callback) {
        let htmlStr = '';
        params.forEach((item, ind) => {
          let color = item.color;//图例颜色
          // console.log(item)
          if (ind === 0 || ind === lendData.length / 2) {
            htmlStr += item.name + '<br/>';//x轴的名称
          }
          htmlStr += '<div>';
          //为了保证和原来的效果一样，这里自己实现了一个点的效果
          htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;' +
            'border-radius:5px;background-color:' + color + ';"></span>';
          htmlStr += item.seriesName + '：' + item.value + ' ' + that.unit;
          htmlStr += '</div>';
        })
        return htmlStr;
      }
      this.seriesArr = [];
    },
    getCharts () {
      this.isData = false;
    },
    getData () {
      this.isData = true;
    },
    //点击曲线点
    eclick (param) {
      console.log(param.name)
      let name = param.name;
      if (name.indexOf('年') != -1) {
        let year = name.splite('年')[0];
        this.dateType = 'month';
        this.timetype = 4;
        this.searchFile.timeType = 4;
        this.startTime = new Date(year, 1, 1);
        this.searchFile.startTime = year + '-' + '01' + '-' + '01' + " 00:00:00";
        this.endTime = new Date(year, 12, 31, 23, 59, 59);
        this.searchFile.endTime = year + '-' + '12' + '-' + '31' + " 23:59:59";
        this.format = "yyyy-MM";
        this.getEnergyList();
      } else if (name.indexOf('月') != -1) {
        // return
        let year = name.split('月')[0].split('-')[0];
        let month = parseInt(name.split('月')[0].split('-')[1]);
        this.dateType = 'date';
        this.timetype = 2;
        this.searchFile.timeType = 2;
        this.format = "yyyy-MM-dd";
        this.startTime = new Date(year, month - 1, 1);
        this.searchFile.startTime = year + '-' + month + '-' + '01' + " 00:00:00";
        if (/^1|3|5|7|8|10|12$/.test(month)) {
          this.endTime = new Date(year, month - 1, 31, 23, 59, 59);
          this.searchFile.endTime = year + '-' + month + '-' + '31' + " 23:59:59";
        } else if (/^4|6|9|11$/.test(month)) {
          this.endTime = new Date(year, month - 1, 30, 23, 59, 59);
          this.searchFile.endTime = year + '-' + month + '-' + '30' + " 23:59:59";
        } else {
          if (year % 4 == 0 && year % 100 != 0 || year % 100 == 0 && year % 400 == 0) {
            this.endTime = new Date(year, month - 1, 29, 23, 59, 59);
            this.searchFile.endTime = year + '-' + month + '-' + '29' + " 23:59:59";
          } else {
            this.endTime = new Date(year, month - 1, 28, 23, 59, 59);
            this.searchFile.endTime = year + '-' + month + '-' + '28' + " 23:59:59";

          }
        }
        this.getEnergyList();
      } else if (name.indexOf('日') != -1) {
        let year = name.split('日')[0].split('-')[0];
        let month = name.split('日')[0].split('-')[1];
        let day = name.split('日')[0].split('-')[2];
        this.dateType = 'datetime'
        this.timetype = 1;
        this.searchFile.timeType = 1;
        this.format = "yyyy-MM-dd HH"
        this.startTime = new Date(year, month - 1, day);
        this.searchFile.startTime = year + '-' + month + '-' + day + " 00:00:00";
        this.endTime = new Date(year, month - 1, day, 23, 59, 59);
        this.searchFile.endTime = year + '-' + month + '-' + day + " 23:59:59";
        console.log(this.searchFile.startTime, this.searchFile.endTime)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.p-container {
  .energy-search {
    background-color: #f1f6fb;
    position: relative;
    .left-active-btn {
      position: absolute;
      top: 50%;
      left: 215px;
      z-index: 9;
      &.icon-zhankai1 {
        left: 0px;
      }
    }
    .left-tab-tree {
      width: 220px;
      height: 100%;
      float: left;
      background-color: #fff;
      transition: all 0.1s ease-out;

      &.hide-tree {
        width: 0px;
      }
      &.show-tree {
        width: 220px;
      }
    }
    .right-energy-info {
      width: calc(100% - 230px);
      height: 100%;
      background-color: #fff;
      float: right;
      transition: all 0.1s ease-out;
      overflow: auto;
      &.reduceBox {
        width: calc(100% - 230px);
      }
      &.expendBox {
        width: calc(100% - 10px);
      }

      .energy-search-info {
        width: 100%;
        height: 100%;
        max-height: 762px;
        overflow: hidden;
        overflow-y: auto;
        /deep/ .u-layout-search .el-input__inner {
          border-radius: 2px !important;
          height: 30px;
          border: 1px solid #c3c9d5;
        }
        .table-title {
          width: 100%;
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          color: #363636;
        }
        .e-charts {
          height: 500px;
          width: 100%;
          box-sizing: border-box;
          .coustom-echarts-table {
            td {
              padding: 0px;
            }
          }
        }
      }
    }
  }
  /deep/ .el-table__header tr,
  /deep/ .el-table__header th {
    background: #eef0f7;
  }
}
</style>
