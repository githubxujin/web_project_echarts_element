<template>
  <div class="inspection">
    <div class="u-layout-search three u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <datePick
              v-model="checkTime"
              type="daterange"
              :compareTime="true"
              :clearable="false"
              :defaultStartTime="defaultStartTime"
              @checkedTime="checkedTime"
              @switchTime="switchTime"
            ></datePick>
          </div>
          <div class="title-input-group">
            <p class="text">比对时间：</p>
            <!--<dPicker-->
            <!--:default-start-time="startTime"-->
            <!--:default-end-time="endTime"-->
            <!--:date-type="tabIndex"-->
            <!--@checkedTime="checkedTime"-->
            <!--&gt;</dPicker>-->
            <el-date-picker
              style="width: 117px"
              v-model="startTime"
              :type="tabIndex"
              :clearable="false"
              placeholder="选择日期"
            ></el-date-picker>
            <el-date-picker
              style="width: 117px"
              v-model="endTime"
              :type="tabIndex"
              :clearable="false"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </div>

        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">比对参数：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select v-model="compareParam" placeholder="请选择" @change="getParameteroptions">
                  <el-option
                    v-for="item in parameteroptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>

        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">明细指标：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select v-model="detailIndex" placeholder="请选择">
                  <el-option
                    v-for="item in detailIndexOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
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
      <!--<div class="u-layout-right-item">-->
      <!--<el-button class="el-button el-button&#45;&#45;primary el-button&#45;&#45;small"-->
      <!--@click="exportData"-->
      <!--v-if="pageBtns.some(val=>val=='export')">导出</el-button>-->
      <!--</div>-->
      <div class="u-layout-left-item">
        <el-button @click="getCharts" class="el-button el-button--primary el-button--small">图形</el-button>
        <el-button @click="get_Data" class="el-button el-button--primary el-button--small">数据</el-button>
        <el-button
          class="el-button el-button--primary el-button--small"
          @click="exportData"
          v-if="pageBtns.some(val=>val=='export')"
        >导出</el-button>
      </div>
    </div>
    <myEcharts
      :id="'exampleId_time'"
      :style="{height: '700px','line-height':'20px'}"
      :option="chartOption"
      v-if="!isdata&&chartOption.series.length != 0"
    ></myEcharts>
    <div
      v-if="!isdata&&chartOption.series.length == 0"
      style="text-align: center;height:400px;color: #909399; padding-top: 200px;font-size: 12px"
    >
      <span>暂无数据</span>
    </div>
    <div v-if="isdata" style="padding-left:40px">
      <tableDataList
        id="tableList"
        :show-sequence="tableData.showSequence"
        :v-table-data="tableData"
      ></tableDataList>
    </div>
  </div>
</template>

<script>
import datePick from "@/components/timerange/index";
import myEcharts from '@/components/echarts/index';
import tableDataList from "@/components/table/tableDataList";
import datetimeUtils from '@/utils/datetime-utils'
import { getTimeCompareList, exportTimeCompareList, getTimeCompareListReverse } from '@/services/data-compare';
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { datePick, myEcharts, tableDataList },
  data () {
    return {
      datetimeUtils: datetimeUtils,
      tabIndex: 'date',
      startTime: null,
      endTime: null,
      isdata: false,
      granularityData: [
        { name: '日', id: 'date' },
        { name: '月', id: 'month' }
      ],
      timeType: 1,
      defaultStartTime: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'),
      checkTime: {},
      tableData: {
        tHead: [
          { text: '时间', prop: 'time', sortable: true },
          { text: '时间(比对)', prop: 'time(比对)', sortable: true },
          { text: '001号门店', prop: '001号门店', sortable: true },
          { text: '001号门店(比对)', prop: '001号门店(比对)', sortable: true }
        ],
        data: [],
        total: 0,
        showCheckbox: false,
        showSequence: false,
        height: '690',
        paging: false
      },
      isdata: false,
      objectoptions: [{
        value: '全部',
        label: '全部'
      }, {
        value: 1,
        label: '红星美凯龙龙华店'
      }, {
        value: '红星美凯龙南山店',
        label: '红星美凯龙南山店'
      }
        , {
        value: '红星美凯龙福田店',
        label: '红星美凯龙福田店'
      }
        , {
        value: '红星美凯龙坂田店',
        label: '红星美凯龙坂田店'
      }, {
        value: '红星美凯龙五和店',
        label: '红星美凯龙五和店'
      }, {
        value: '红星美凯龙西里店',
        label: '红星美凯龙西里店'
      }
      ], parameteroptions: [{
        label: '报警级别',
        value: 1
      },
      {
        label: '响应时间',
        value: 2
      }, {
        label: '设备在线',
        value: 3
      },
      {
        label: '能耗监测',
        value: 4
      }
      ],
      quotaoptions: [{
        value: '全部',
        label: '全部'
      }, {
        value: '一级及以上',
        label: '一级及以上'
      }, {
        value: '二级及以上',
        label: '二级及以上'
      }, {
        value: '三级及以上',
        label: '三级及以上'
      }, {
        value: '四级及以上',
        label: '四级及以上'
      }, {
        value: '五级及以上',
        label: '五级及以上'
      }
      ],
      objecvalue: '', check_Time: {},
      compareParam: 1, detailIndex: 0,
      detailIndexOptions: [
        { label: '全部', value: 0 },
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 },
        { label: '四级', value: 4 },
        { label: '五级', value: 5 }
      ],
      chartOption: {
        // toolbox: {
        //   show: true,
        //   feature: {
        //     dataView: {
        //       buttonColor: '#1EA9FB',
        //       show: true,
        //       readOnly: true,
        //       optionToContent: function (opt) {
        //         console.log('opt:', opt);
        //         let axisData = opt.xAxis[0].data; //坐标数据
        //         let series = opt.series; //折线图数据
        //         let table = `<table class="coustom-echarts-table">`;
        //         // let tdHeads = `<thead><tr><td>${opt.xAxis[0].name}</td>`; //表头
        //         let tdHeads = `<thead><tr><td>时间</td>`; //表头
        //         //thead
        //         series.forEach(function (item, index) {
        //           tdHeads += `<td>${item.name}</td>`;
        //         });
        //         table += tdHeads + `</tr></thead>`;
        //
        //         //tbody
        //         let tdBodys = "<tbody>";
        //         for (
        //           let i = 0, l = axisData.length;
        //           i < l;
        //           i++
        //         ) {
        //           let evenTrClass = i % 2 === 0 ? "even" : "";
        //           //行
        //           tdBodys += `<tr class="${evenTrClass}"><td>${
        //             axisData[i]
        //             }</td>`;
        //           for (let j = 0; j < series.length; j++) {
        //             //列
        //             tdBodys += `<td>${
        //               series[j].data[i]
        //               }</td>`;
        //           }
        //           tdBodys += "</tr>";
        //         }
        //         //表
        //         table += `${tdBodys}</tbody></table>`;
        //         return table;
        //       }
        //     },
        //     magicType: { type: ['line', 'bar'] }
        //   }
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [],
          left: "center"
        },
        grid: {
          left: '3%',
          right: '4%',
          // top: '7%'
          // bottom: '7%'
          // containLabel: true
        },
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        xAxis: [{
          name: "日期(天)",
          type: 'category',
          data: [],
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
              // type:"arrow",
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
        }, {
          name: "日期(天)",
          type: 'category',
          data: [],
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
              // type:"arrow",
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
          name: "处理时间(min)",
          axisLine: {
            symbol: ['none', 'arrow']          },
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
        series: [
        ]
      }
    }
  },
  created () {

  },
  mounted () {
    this.checkTime = { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') };
    this.startTime = datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-');
    this.endTime = datetimeUtils.getSpecialDay(new Date(), '-');
    this.query();
    // this.chartOption = utils.chartNewLine(this.chartOption, 4, 'xAxis');
  }, methods: {
    query () {
      let timeGap, compiGap;
      this.startTime = datetimeUtils.GMTToStr(this.startTime);
      this.endTime = datetimeUtils.GMTToStr(this.endTime);

      this.checkTime.start = datetimeUtils.GMTToStr(this.checkTime.start);
      this.checkTime.end = datetimeUtils.GMTToStr(this.checkTime.end);
      // debugger
      //         alert((new Date(this.checkTime.end)).getTime());
      //         alert((new Date(this.checkTime.start)).getTime());

      if ((new Date(this.endTime)).getTime() < (new Date(this.startTime)).getTime()) {
        this.$message.error("比对时间开始时间不能大于结束时间");
        return;
      }
      let topShopNumer = '', t = this;

      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumer += v;
        if (t.checkedShopNumbers.length - 1 != i) {
          topShopNumer += ','
        }
      });

      switch (this.timeType) {
        case 1:
          this.startTime = this.startTime.split(" ")[0];
          this.checkTime.start = this.checkTime.start.split(" ")[0];
          this.endTime = this.endTime.split(" ")[0];
          this.checkTime.end = this.checkTime.end.split(" ")[0];

          timeGap = new Date(this.endTime).getTime() - new Date(this.startTime).getTime();
          compiGap = new Date(this.checkTime.end).getTime() - new Date(this.checkTime.start).getTime();
          break;
        case 2:
          //   if(this.startTime.split(" ")[0].length==9){
          //       this.startTime = this.startTime + "-1 00:00:00";
          //   }
          //   this.startTime = this.startTime.split("-")[1] + "-1 00:00:00";
          // this.checkTime.start = this.checkTime.start.split(" ")[1] + "-1 00:00:00";
          // this.endTime = this.endTime.split("-")[1] + "-30 23:59:59";
          // this.checkTime.end = this.checkTime.end.split("-")[1] + "-30 23:59:59";
          let yearGap = new Date(this.endTime).getFullYear() - new Date(this.startTime).getFullYear();
          // let monthGap = new Date(this.endDateValue).getMonth() - new Date(this.startDateValue).getMonth() + 1;
          if (yearGap == 0) {
            timeGap = new Date(this.endTime).getMonth() - new Date(this.startTime).getMonth() + 1;
            // console.log(this.timeGap, '同年月份间隔')
          } else if (yearGap > 0) {
            let gap1 = 12 - new Date(this.startTime).getMonth() //开始年份到12月之间有多少个月
            let gap2 = new Date(this.endTime).getMonth() + 1
            timeGap = gap1 + gap2;
            // console.log(this.timeGap, '跨年月份间隔')
          }
          let yearGap1 = new Date(this.checkTime.end).getFullYear() - new Date(this.checkTime.start).getFullYear();
          if (yearGap1 == 0) {
            compiGap = new Date(this.checkTime.end).getMonth() + 1 - new Date(this.checkTime.start).getMonth()
            // console.log(this.compiGap, '对比同年月份间隔')
          } else if (yearGap1 > 0) {
            let gap1 = 12 - new Date(this.checkTime.start).getMonth()//开始年份到12月之间有多少个月
            let gap2 = new Date(this.checkTime.end).getMonth() + 1
            compiGap = gap1 + gap2;
            // console.log(this.compiGap, '对比跨年月份间隔')
          }
          break;
        case 3:
          // this.startTime = this.startTime.split("-")[0] + "-01-01 00:00:00";
          // this.checkTime.start = this.checkTime.start.split("-")[0] + "-01-01 00:00:00";
          // this.endTime = this.endTime.split("-")[1] + "-12-31 23:59:59";
          // this.checkTime.end = this.checkTime.end.split("-")[1] + "-12-31 23:59:59";
          timeGap = new Date(this.endTime).getFullYear() - new Date(this.startTime).getFullYear();
          compiGap = new Date(this.checkTime.end).getFullYear() - new Date(this.checkTime.start).getFullYear();
          break;
      }

      if (compiGap != timeGap) {
        this.$message.error("时间比对的时间范围必须一致");
        return;
      }

      if (this.compareParam == 1) {
        this.chartOption.yAxis.name = "单位(个)";
      }
      if (this.compareParam == 2) {
        this.chartOption.yAxis.name = "单位(秒)";
      }
      if (this.compareParam == 3) {
        this.chartOption.yAxis.name = "单位(%)";
      }
      if (this.compareParam == 4) {
        this.chartOption.yAxis.name = "单位(kWh)";
        if (this.detailIndex == 2) {
          this.chartOption.yAxis.name = "单位(kWh/m²)";
        }
      }
      this.chartOption.xAxis[0].name = this.timeType == 1 ? this.chartOption.xAxis.name = '时间粒度(日)' : this.timeType == 2 ? this.chartOption.xAxis.name = '时间粒度(月)' : this.chartOption.xAxis.name = '时间粒度(年)';
      this.chartOption.xAxis[1].name = this.timeType == 1 ? this.chartOption.xAxis.name = '时间粒度(日)' : this.timeType == 2 ? this.chartOption.xAxis.name = '时间粒度(月)' : this.chartOption.xAxis.name = '时间粒度(年)';
      let detailIndex = this.detailIndex == 0 ? '1,2,3,4,5' : this.detailIndex.toString();
      let obj = {        compareParam: this.compareParam, currentTarget: topShopNumer, detailIndex: detailIndex, timeType: this.timeType
        , start: this.checkTime.start, end: this.checkTime.end, compareEnd: this.endTime, compareStart: this.startTime      };

      getTimeCompareListReverse(obj).then((res) => {
        // console.log("getTimeCompareListReverse:"+JSON.stringify(res))
        if (res.data.length > 0) {
          this.tableData.tHead = [];
          let t_count = JSON.stringify(res.data[0]).toString().split('":"').length - 1;
          for (let i = 0; i < t_count; i++) {
            this.tableData.tHead.push({ text: res.data[0][i.toString()], prop: i.toString(), sortable: true });
          }
          this.tableData.data = res.data.splice(1);
        }
      });
      getTimeCompareList(obj).then((res) => {
        let obj = res.data.current; let cpobj = res.data.compare;
        this.chartOption.legend.data = [];
        this.chartOption.xAxis[0].data = res.data.current["时间"];
        // this.chartOption.xAxis[1].data = res.data.compare["时间"];
        this.chartOption.series = [];
        if (this.timeType == 2) {
          if (this.chartOption.xAxis[0].data.length == 0) {
            this.chartOption.xAxis[0].data.push(this.checkTime.start.split("-1 ")[0]);
          }
          if (this.chartOption.xAxis[1].data.length == 0) {
            this.chartOption.xAxis[1].data.push(this.startTime.split("-1 ")[0]);
          }        }
        let count = JSON.stringify(obj).toString().split('[').length - 1;
        for (let i = 0; i < count; i++) {
          let iobj = JSON.stringify(cpobj).toString().split('],')[i];
          let pName = iobj.split(":[")[0].replace('{"', '').replace('"', '').replace('"', '') + "(比对)";
          if (pName.indexOf("时间(比对)") > -1 && pName.length == 6) {
            continue;
          }
          let param = {
            name: pName,
            type: 'line',
            // stack: '总量',
            smooth: true,
            data: [], itemStyle: {
              normal: {
                lineStyle: {
                  type: 'dotted'  //'dotted'虚线 'solid'实线
                }
              }
            }
          };
          this.chartOption.legend.data.push(pName);
          let dataObj = "[" + iobj.split(":[")[1] + "]";
          param.data = JSON.parse(dataObj.replace('}]', ''));
          this.chartOption.series.push(param);
        }
        for (let i = 0; i < count; i++) {
          let iobj = JSON.stringify(obj).toString().split('],')[i];
          let pName = iobj.split(":[")[0].replace('{"', '').replace('"', '').replace('"', '');
          if (pName.indexOf("时间") > -1 && pName.length == 2) {
            continue;
          }
          let param = {
            name: pName,
            type: 'line',
            // stack: '总量',
            smooth: true,
            data: [], itemStyle: {
              normal: {
                lineStyle: {
                  type: 'solid'  //'dotted'虚线 'solid'实线
                }
              }
            }
          };
          this.chartOption.legend.data.push(pName);
          let dataObj = "[" + iobj.split(":[")[1] + "]";
          let t = dataObj.replace('}]', '');
          param.data = JSON.parse(t);
          this.chartOption.series.push(param);
        }
        console.log('series:' + JSON.stringify(this.chartOption.series));

        if (res.data.current['时间'].length == 0) {
          this.$message.warning("暂无数据");        }
        console.log('aaa:' + JSON.stringify(this.chartOption.series))
        // this.chartOption.tooltip.formatter = function (params, ticket, callback) {
        //   console.log(JSON.stringify(params))
        //     // let htmlStr = '<div>' + params[0].name + '</br>';
        //     // for (let i = 0; i < t_numberParam.length; i++) {
        //     //     htmlStr += params[i].seriesName + ':' + params[i].value + 'kWh</br>';
        //     // }
        //     // return htmlStr;
        // };
      }).catch((error) => {
        console.log(error)
      });
    },
    checkedTime (res) {
      this.checkTime = res;
      console.log('getTime:' + JSON.stringify(res));
    },
    switchTime (index) {
      if (index == "1") {
        this.tabIndex = 'date';
        this.checkTime.start = this.startTime = datetimeUtils.getPreDate(15);//.format('L');
        this.checkTime.end = this.endTime = new Date();
      }
      else if (index == "2") {
        this.tabIndex = 'month';
        this.checkTime.start = this.startTime = datetimeUtils.getBeforeMonth(1);
        this.checkTime.end = this.endTime = new Date();
      }
      else if (index == "3") {
        this.tabIndex = 'year';
        this.checkTime.start = this.startTime = new Date(new Date().getFullYear() - 12, '01', '01')
        this.checkTime.end = this.endTime = new Date();
      }
      this.timeType = index;
    },
    getParameteroptions () {
      this.detailIndex = 1;
      if (this.compareParam == 1) {
        this.detailIndexOptions = [{ label: '全部', value: 0 },
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 },
        { label: '四级', value: 4 },
        { label: '五级', value: 5 }];
        this.detailIndex = 0;
      }
      else if (this.compareParam == 2) {
        this.detailIndexOptions = [{ label: '确认时间', value: 1 },
        { label: '完成时间', value: 2 }];
      }
      else if (this.compareParam == 3) {
        this.detailIndexOptions = [{ label: '平均在线', value: 1 },
        { label: '最低在线', value: 2 }];
      }
      else if (this.compareParam == 4) {
        this.detailIndexOptions = [{ label: '总能耗', value: 1 },
        { label: '平均能耗', value: 2 }];
      }
    },
    get_Data () {
      this.isdata = true;
    },
    getCharts () {
      this.isdata = false;
    }, exportData () {
      let topShopNumer = '', t = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumer += v;
        if (t.checkedShopNumbers.length - 1 != i) {
          topShopNumer += ','
        }
      });
      let detailIndex = this.detailIndex == 0 ? '1,2,3,4,5' : this.detailIndex.toString();
      /*this.startTime = datetimeUtils.GMTToStr(this.startTime).replace('8:0:0', '0:0:0');
      this.endTime = datetimeUtils.GMTToStr(this.endTime).replace('0:0:0', '23:59:59').replace('8:0:0', '23:59:59');*/
      this.startTime = datetimeUtils.getCurYmdTime(this.startTime);
      this.endTime = datetimeUtils.getCurYmdTime(this.endTime);
      exportTimeCompareList(`?token=${localStorage.getItem('$token_info')}&compareParam=${this.compareParam}&start=${
        this.checkTime.start
        }&end=${this.checkTime.end}&compareStart=${
        this.startTime
        }&compareEnd=${
        this.endTime
        } &detailIndex=${detailIndex}&currentTarget=${topShopNumer}&timeType=` + this.timeType);
    }
  }, watch: {
    checkedShopNumbers: {
      handler (val) {
        this.query();
      },
      deep: true
    }
  }
}
</script>


