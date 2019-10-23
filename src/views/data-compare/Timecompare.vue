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
              <datePick
                  timeName="对比时间"
                  v-model="checkTimeTo"
                  type="daterange"
                  :compareTime="true"
                  :clearable="false"
                  :tab_Index="tabIndex"
                  :defaultStartTime="defaultStartTime"
                  @checkedTime="checkedTimeTo"
              ></datePick>
          </div>
        </div>

        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">对比参数：</p>
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
      tabIndex: 1,
      isdata: false,
      granularityData: [
        { name: '日', id: 'date' },
        { name: '月', id: 'month' }
      ],
      timeType: 1,
      defaultStartTime: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'),
      checkTime: {},  checkTimeTo: {},
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
      objectoptions: [
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
          color: ['#028CF7','#4852DD','#9D67FF','#0DD789','#F19F02','#11AA07','#F14D4D','#00FFFC','#FF8080','#6FD1FF','#A39823'],
        tooltip: {
            trigger: "axis",
            // axisPointer: {
            //     type: 'cross'
            // }
        },
        legend: {
          data: [],
          left: "center"
        },
        grid: {
          left: '3%',
          right: '3%'
        },
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
        yAxis:   {
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
      this.checkTimeTo=this.checkTime;
    this.query();
  }, methods: {
    query () {
      let timeGap, compiGap;
      this.checkTime.start = datetimeUtils.GMTToStr(this.checkTime.start);
      this.checkTime.end = datetimeUtils.GMTToStr(this.checkTime.end);
        this.checkTimeTo.start = datetimeUtils.GMTToStr(this.checkTimeTo.start);
        this.checkTimeTo.end = datetimeUtils.GMTToStr(this.checkTimeTo.end);
      if ((new Date(this.checkTime.end)).getTime() < (new Date(this.checkTime.start)).getTime()) {
        this.$message.error("第一项的时间开始时间不能大于结束时间");
        return;
      }
        if ((new Date(this.checkTimeTo.end)).getTime() < (new Date(this.checkTimeTo.start)).getTime()) {
            this.$message.error("对比时间开始时间不能大于结束时间");
            return;
        }
      let topShopNumer = '', t = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        // topShopNumer += v;
        if (t.checkedShopNumbers.length - 1 == i) {
            topShopNumer += v;
        }
      });

      switch (this.timeType) {
        case 1:
          this.checkTime.start = this.checkTime.start.split(" ")[0];
          this.checkTimeTo.start = this.checkTimeTo.start.split(" ")[0];
          this.checkTime.end = this.checkTime.end.split(" ")[0];
          this.checkTimeTo.end = this.checkTimeTo.end.split(" ")[0];
          timeGap = new Date(this.checkTimeTo.end).getTime() - new Date(this.checkTimeTo.start).getTime();
          compiGap = new Date(this.checkTime.end).getTime() - new Date(this.checkTime.start).getTime();
          break;
        case 2:
          let yearGap = new Date(this.checkTimeTo.end).getFullYear() - new Date(this.checkTimeTo.start).getFullYear();
          if (yearGap == 0) {
            timeGap = new Date(this.checkTimeTo.end).getMonth() - new Date(this.checkTimeTo.start).getMonth() + 1;

          } else if (yearGap > 0) {
            let gap1 = 12 - new Date(this.checkTimeTo.start).getMonth() //开始年份到12月之间有多少个月
            let gap2 = new Date(this.checkTimeTo.end).getMonth() + 1
            timeGap = gap1 + gap2;
          }
          let yearGap1 = new Date(this.checkTime.end).getFullYear() - new Date(this.checkTime.start).getFullYear();
          if (yearGap1 == 0) {
            compiGap = new Date(this.checkTime.end).getMonth() + 1 - new Date(this.checkTime.start).getMonth()

          } else if (yearGap1 > 0) {
            let gap1 = 12 - new Date(this.checkTime.start).getMonth()//开始年份到12月之间有多少个月
            let gap2 = new Date(this.checkTime.end).getMonth() + 1;
            compiGap = gap1 + gap2;
          }
          break;
        case 3:
          timeGap = new Date(this.checkTimeTo.end).getFullYear() - new Date(this.checkTimeTo.start).getFullYear();
          compiGap = new Date(this.checkTime.end).getFullYear() - new Date(this.checkTime.start).getFullYear();
          break;
      }
        if (!topShopNumer) {
            this.$message.error("请选择门店");
            return;
        }
      if (compiGap != timeGap) {
        this.$message.error("时间对比的时间范围必须一致");
        return;
      }

      if (this.compareParam == 1) {
        this.chartOption.yAxis.name = "数量(个)";
      }
      if (this.compareParam == 2) {
        this.chartOption.yAxis.name = "时间(min)";
      }
      if (this.compareParam == 3) {
        this.chartOption.yAxis.name = "占比(%)";
      }
      if (this.compareParam == 4) {
          this.chartOption.grid.left='3%';
        this.chartOption.yAxis.name = "总能耗(kWh)";
        if (this.detailIndex == 2) {
            this.chartOption.grid.left='4%';
          this.chartOption.yAxis.name = "单位面积能耗(kWh/m²)";
        }
      }
      this.chartOption.xAxis[0].name = this.timeType == 1 ? this.chartOption.xAxis.name = '日' : this.timeType == 2 ? this.chartOption.xAxis.name = '月' : this.chartOption.xAxis.name = '年';
      this.chartOption.xAxis[1].name = this.timeType == 1 ? this.chartOption.xAxis.name = '日' : this.timeType == 2 ? this.chartOption.xAxis.name = '月' : this.chartOption.xAxis.name = '年';
      let detailIndex = this.detailIndex == 0 ? '1,2,3,4,5' : this.detailIndex.toString();
      let obj = {        compareParam: this.compareParam, currentTarget: topShopNumer, detailIndex: detailIndex, timeType: this.timeType
        , start: this.checkTime.start, end: this.checkTime.end, compareEnd:this.checkTimeTo.end, compareStart: this.checkTimeTo.start     };
console.log(JSON.stringify(this.checkTimeTo))
      getTimeCompareListReverse(obj).then((res) => {
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
      this.chartOption.xAxis[1].data = res.data.compare["时间"];
        this.chartOption.series = [];
        console.log('this.startTime:'+this.startTime)
        if (this.timeType == 2) {
          if (this.chartOption.xAxis[0].data.length == 0) {
                let t=new Date(this.checkTime.start);
            this.chartOption.xAxis[0].data.push(t.getFullYear()+'-'+(t.getMonth() + 1));
          }
          if (this.chartOption.xAxis[1].data.length == 0) {
              let t=new Date(this.checkTimeTo.start);
            this.chartOption.xAxis[1].data.push(t.getFullYear()+'-'+(t.getMonth() + 1));
          }        }
        let count = JSON.stringify(obj).toString().split('[').length - 1;
        for (let i = 0; i < count; i++) {
          let iobj = JSON.stringify(cpobj).toString().split('],')[i];
          let pName = iobj.split(":[")[0].replace('{"', '').replace('"', '').replace('"', '') + "(比对)";
          console.log(pName+'_'+pName.indexOf("时间(比对)"));
          if (pName.indexOf("时间(比对)") > -1 && pName.length == 6) {
            continue;
          }
          let param = {
              xAxisIndex:0,
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
              xAxisIndex:1,
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
      }).catch((error) => {
        console.log(error)
      });
    },
    checkedTime (res) {
      this.checkTime = res;
      console.log('checkedTime:' + JSON.stringify(res));
    },checkedTimeTo (res) {
            console.log('checkedTimeTo:' + JSON.stringify(res));
            this.checkTimeTo = res;
        },
    switchTime (index) {
      if (index == "1") {
        this.tabIndex = 1;
        this.checkTime.start = datetimeUtils.getPreDate(15);//.format('L');
        this.checkTime.end = new Date();

          this.checkTimeTo.start=datetimeUtils.getPreDate(30);
          this.checkTimeTo.end =  new Date();
      }
      else if (index == "2") {
        this.tabIndex = 2;
        this.checkTime.start = datetimeUtils.getBeforeMonth(1);
        this.checkTime.end = new Date();

          this.checkTimeTo.start =  this.checkTime.start;
          this.checkTimeTo.end = new Date();
      }
      else if (index == "3") {
        this.tabIndex =3;
        this.checkTime.start =new Date(new Date().getFullYear(), '01', '01')
        this.checkTime.end =  new Date();
          this.checkTimeTo.start = new Date(new Date().getFullYear(), '01', '01')
          this.checkTimeTo.end =  new Date();
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
        { label: '单位面积能耗', value: 2 }];
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
      exportTimeCompareList(`?token=${localStorage.getItem('$token_info')}&compareParam=${this.compareParam}&start=${
          datetimeUtils.getSpecialDay(this.checkTime.start,"-")
        }&end=${ datetimeUtils.getSpecialDay(this.checkTime.end,"-")}&compareStart=${
          datetimeUtils.getSpecialDay(this.checkTimeTo.start,"-")
        }&compareEnd=${
          datetimeUtils.getSpecialDay(this.checkTimeTo.end,"-")
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


