<template>
  <div class="p-container">
    <div class="sub-nav">
      <div class="inspection">
        <div class="u-layout-search two u-layout-dobule">
          <div class="u-layout-left-proviso">
            <div class="u-layout-left-item">
              <div class="title-input-group u-title-input-group">
                <p class="text">报警类型：</p>
                <div class="input-container">
                  <div style="border-radius: 2px;" class="item select-input">
                    <!--el-ui 根据需求增加配置-->
                    <el-select v-model="status" placeholder="请选择">
                      <el-option
                        v-for="item in type_options"
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
              <div class="title-input-group u-title-input-group">
                <p class="text">报警级别：</p>

                <div class="input-container multiple" :style="{width:getWidth()}">
                  <div style="border-radius: 2px;" class="item select-input">
                    <!--el-ui 根据需求增加配置-->
                    <el-select
                      v-model="alarmLevel"
                      @change="updateAlarmLevel"
                      :style="{width:getWidth()}"
                      multiple
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in category_options"
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
              <div class="title-input-group u-title-input-group">
                <datePick v-model="checkTime" title="时间" :defaultStartTime="defaultStartTime"></datePick>
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
        <div v-if="!isdata">
          <myEcharts :id="'exampleId'" :style="{height: '655px'}" :option="chartOption" v-if="!isdata&&(chartOption.series.length != 0&&chartOption.series[0].data.length != 0)"/>
          <div v-if="!isdata&&(chartOption.series.length != 0&&chartOption.series[0].data.length != 0)"
            class="echartsTitle"
          >{{datetimeUtils.GMTToStr(checkTime.start).length>0?datetimeUtils.GMTToStr(checkTime.start).split(' ')[0]:''}}~{{datetimeUtils.GMTToStr(checkTime.end).length>0?datetimeUtils.GMTToStr(checkTime.end).split(' ')[0]:''}}门店报警级别排名</div>
            <div  v-if="chartOption.series.length == 0||chartOption.series[0].data.length == 0" style="text-align: center;height:400px;color: #909399; padding-top: 200px;font-size: 12px">
                <span>暂无数据</span></div>
        </div>
        <div v-if="isdata" class="datatable-box">
            <div class="echartsTitle"
            >{{datetimeUtils.GMTToStrRorType(checkTime.start,'day')}}至{{datetimeUtils.GMTToStrRorType(checkTime.end,'day')}}报警级别排名报表</div>
          <tableDataList
            id="tableList"
            :style="{width:tablewidth}"
            :show-sequence="tableData.showSequence"
            :v-table-data="tableData"
          ></tableDataList>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import leftMenu from '@/components/leftMenu/index'
import datePick from "@/components/timerange/separateTime";
import myEcharts from '@/components/echarts/index';
import tableDataList from "@/components/table/tableDataList.vue";
import utils from '@/utils/utils.js';
import { getAlarmLevelList,exportAlarmLevelList } from '@/services/data-rank.js';
import datetimeUtils from '@/utils/datetime-utils'
import baseOptions from '@/utils/baseOptions';
var Enumerable = require('linq');
export default {
  extends: baseOptions,
  components: { datePick, myEcharts, tableDataList, leftMenu },
  data () {
    return {
      datetimeUtils: datetimeUtils,
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      defaultStartTime: datetimeUtils.getPreDate(30),
      checkTime: { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') },
      type_options: [{
        value: '0,2',
        label: '待处理报警'
      }, {
        value: '0,1,2,3',
        label: '所有报警'
      }]
      , category_options: [{
        value: 1,
        label: '一级'
      }
        , {
        value: 2,
        label: '二级'
      }
        , {
        value: 3,
        label: '三级'
      }, {
        value: 4,
        label: '四级'
      }, {
        value: 5,
        label: '五级'
      }
      ],
      status: '0,1,2,3', alarmLevel: [1, 2, 3, 4, 5], list: [],
      tableData: {
        tHead: [
          { text: '门店名称', prop: 'shopName', sortable: true },
          { text: '总报警数(个)', prop: 'total', sortable: true },
          { text: '一级(个)', prop: 'level1', sortable: true },
          { text: '二级(个)', prop: 'level2', sortable: true },
          { text: '三级(个)', prop: 'level3', sortable: true },
          { text: '四级(个)', prop: 'level4', sortable: true },
          { text: '五级(个)', prop: 'level5', sortable: true }
        ],
        data: [],
        total: 0,
        showCheckbox: false,
        showSequence: false,
        height: '690',
        paging: false,

      },
      chartOption: {
        color: ['#41A0F2'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['报警级别排名'],
          itemWidth: 9,
          itemHeight: 9,
          itemGap: 20,
          right: 45
        },
        grid: {
          left: '3%',
          right: '4%',
            top: '30px',
          bottom: '10%',
          containLabel: true
          //  borderColor: 'red'
        },
        xAxis: [
          {
            name: '门店名称',
            type: 'category',
            nameTextStyle: {
              color: '#838383'
            },
            silent: false,
            data: [
            ],
            axisTick: {
              alignWithLabel: true
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
          }
        ],
        yAxis: [
          {

            type: 'value',
            name: '次数(次)',
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
          }
        ],

        series: [
          {
            name: '报警级别排名',
            type: 'bar',
            barWidth: '30',
            label: {
              normal: {
                show: true,
                position: 'top'//'inside'
              }
            },
            data: []
          }
        ], dataZoom: [
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
            endValue: 5,
            zoomLock: false,
            bottom: '3%'
          }
        ]
      },
      list: []
    }
  }

  , created () {
    //this.echartwidth = document.body.clientWidth * 0.85 + 'px';
    //this.tablewidth = document.body.clientWidth * 0.8 + 'px';
  }, mounted () {
    this.query();
  },
  methods:
  {
    query () {
      let topShopNumers = '', that = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumers += v;
        if (that.checkedShopNumbers.length - 1 != i) {
          topShopNumers += ','
        }
      });
      let alarmLevels = '';
      this.alarmLevel.forEach(function (n, i) {
        if (n == 0) {
          alarmLevels = '1,2,3,4,5'
        } else {
          alarmLevels += n;        }
        if (that.alarmLevel.length - 1 != i) {
          alarmLevels += ','
        }
      });
      if (alarmLevels == '') {
        this.$message.error("报警级别不能为空");
        return;
      }
      this.tableData.tHead = [{ text: '门店名称', prop: 'shopName', sortable: true },
      { text: '总报警数(个)', prop: 'total', sortable: true }];
      if (this.alarmLevel.includes(1)) {
        this.tableData.tHead.push({ text: '一级(个)', prop: 'level1', sortable: true })
      }
      if (this.alarmLevel.includes(2)) {
        this.tableData.tHead.push({ text: '二级(个)', prop: 'level2', sortable: true })
      }
      if (this.alarmLevel.includes(3)) {
        this.tableData.tHead.push({ text: '三级(个)', prop: 'level3', sortable: true })
      }
      if (this.alarmLevel.includes(4)) {
        this.tableData.tHead.push({ text: '四级(个)', prop: 'level4', sortable: true })
      }
      if (this.alarmLevel.includes(5)) {
        this.tableData.tHead.push({ text: '五级(个)', prop: 'level5', sortable: true })
      }
        this.chartOption.legend.data=[];
        if(this.status=='0,2'){
            this.chartOption.legend.data.push('待处理报警排名');
            this.chartOption.series[0].name='待处理报警排名';
        }else{
            this.chartOption.legend.data.push('所有报警排名');
            this.chartOption.series[0].name='所有报警排名';
        }
      getAlarmLevelList({ shopNumber: topShopNumers, status: this.status, alarmLevel: alarmLevels, start: this.checkTime.start , end: this.checkTime.end  }).then((res) => {
        this.list = res.data.list;
        this.tableData.data = res.data.list;
        this.chartOption.xAxis[0].data = []; this.chartOption.series[0].data = [];
        for (let i = 0; i <= this.list.length; i++) {
          let o = this.list[i];
          if (!o || !o.shopName) { continue; }
          this.chartOption.xAxis[0].data.push(o.shopName);
          let obj = {
            "datas": [o.level1, o.level2, o.level3, o.level4, o.level5],
            "value": o.total
          };
          this.chartOption.series[0].data.push(obj);
        }
         this.getFormatter();
          console.log('aaa:'+JSON.stringify(this.chartOption.series))
        if (this.chartOption.series.length == 0) {
          this.$message.warning("暂无数据");        }
      }).catch((error) => {
        console.log(error)
      })

    },

      getFormatter(){
          let that=this;
          this.chartOption.tooltip.formatter = function (params, ticket, callback) {
              let htmlStr="";
              if(that.status=="0,1,2,3"){
                  htmlStr+= "<div>"+ params[0].name + "</br>所有报警："+ params[0].value +"次</br>"
              }else{
                  htmlStr+= "<div>"+ params[0].name + "</br>待处理总数："+ params[0].value +"次</br>"
              }
              if (that.alarmLevel.includes(1)) {
                  htmlStr+= "一级："+ params[0].data.datas[0] + "次</br>";
              }
              if (that.alarmLevel.includes(2)) {
                  htmlStr+= "二级："+ params[0].data.datas[1] + "次</br>";
              }
              if (that.alarmLevel.includes(3)) {
                  htmlStr+= "三级："+ params[0].data.datas[2] + "次</br>";
              }
              if (that.alarmLevel.includes(4)) {
                  htmlStr+= "四级："+ params[0].data.datas[3] + "次</br>";
              }
              if (that.alarmLevel.includes(5)) {
                  htmlStr+= "五级："+ params[0].data.datas[4] + "次</br>";
              }
              htmlStr+= "</div>"
              return htmlStr;
          };
      },
    changeTime (start, end) {
      this.startTime = start;
      this.endTime = end;
    },
    initCharts () {
      this.chartOption = utils.chartNewLine(this.chartOption, 4, 'xAxis');
    },
    get_Data () {
      this.isdata = true;
    },
    getCharts () {
      this.isdata = false;
    },
    getWidth (defaultWidth = 100, size = 60) {
      return this.alarmLevel.length <= 1 ? defaultWidth + 'px' : defaultWidth + (this.alarmLevel.length - 1) * size + 'px';
    }, updateAlarmLevel () {
      this.alarmLevel = Enumerable.from(this.alarmLevel).distinct("x=>x").toArray();//条件查询
    },
    exportData () {
        let topShopNumers = '', that = this;
        this.checkedShopNumbers.forEach(function (v, i) {
            topShopNumers += v;
            if (that.checkedShopNumbers.length - 1 != i) {
                topShopNumers += ','
            }
        });
        let alarmLevels = '';
        this.alarmLevel.forEach(function (n, i) {
            if (n == 0) {
                alarmLevels = '1,2,3,4,5'
            } else {
                alarmLevels += n;        }
            if (that.alarmLevel.length - 1 != i) {
                alarmLevels += ','
            }
        });
        if (alarmLevels == '') {
            this.$message.error("报警级别不能为空");
            return;
        }
        //{ shopNumber: topShopNumers, status: this.status, alarmLevel: alarmLevels, start: this.checkTime.start , end: this.checkTime.end  }

        exportAlarmLevelList(`?token=${localStorage.getItem('$token_info')}&shopNumber=${topShopNumers}&start=${this.checkTime.start }&end=${
            this.checkTime.end
            }&alarmLevel=${ alarmLevels}&status=${this.status}`);

    }, formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }, watch: {
        alarmLevel:{
            handler (val) {
                this.query();
            },
            deep: true
        },
    //门店编码
    checkedShopNumbers: {
      handler (val) {
        this.query();
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.click {
  color: #3678ba;
  border-color: #c3d7ea;
  background-color: #ebf2f8;
}
.echartsTitle {
    text-align: center;
    color: #909399;
    font-size: 16px;
     height:35px;
    margin-top: -20px;
}
</style>
