<template>
  <div class="p-container">
    <div class="sub-nav">
      <div class="inspection">
        <div class="u-layout-search two u-layout-dobule">
          <div class="u-layout-left-proviso">
            <div class="u-layout-left-item">
              <div class="title-input-group u-title-input-group">
                <p class="text">在线类别：</p>
                <div class="input-container">
                  <div style="border-radius: 2px;" class="item select-input">
                    <!--el-ui 根据需求增加配置-->
                    <el-select v-model="onlineType" placeholder="请选择">
                      <el-option
                        v-for="item in onlineType_options"
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
                <el-button class="el-button el-button--primary el-button--small is-round"  icon="el-icon-search" @click="query">查询</el-button>
            </div>
          </div>
            <div class="u-layout-left-item">
                <el-button @click="getCharts" class="el-button el-button--primary el-button--small">图形</el-button>
                <el-button @click="get_Data" class="el-button el-button--primary el-button--small">数据</el-button>
                <el-button class="el-button el-button--primary el-button--small" @click="exportData" v-if="pageBtns.some(val=>val=='export')">导出</el-button>
          </div>
        </div>
        <div v-if="!isdata">
          <myEcharts v-if="!isdata&&(chartOption.series.length != 0&&chartOption.series[0].data.length != 0)"
            :id="'exampleId'"
            :style="{ height: '655px'}"
            :option="chartOption"
          />
          <div class="echartsTitle" v-if="!isdata&&(chartOption.series.length != 0&&chartOption.series[0].data.length != 0)">
            {{datetimeUtils.GMTToStr(checkTime.start).length>0?datetimeUtils.GMTToStr(checkTime.start).split(' ')[0]:''}}
            ~{{datetimeUtils.GMTToStr(checkTime.end).length>0?datetimeUtils.GMTToStr(checkTime.end).split(' ')[0]:''}} 门店设备在线排名
          </div>
            <div  v-if="chartOption.series.length == 0||chartOption.series[0].data.length == 0"
                  style="text-align: center;height:400px;color: #909399; padding-top: 200px;font-size: 12px">
                <span>暂无数据</span>
        </div>
        </div>
        <div v-if="isdata" class="datatable-box">
            <div class="echartsTitle"
            >{{datetimeUtils.GMTToStrRorType(checkTime.start,'day')}}至{{datetimeUtils.GMTToStrRorType(checkTime.end,'day')}}设备在线排名报表</div>
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
import datePick from "@/components/timerange/separateTime";
import myEcharts from '@/components/echarts/index';
import tableDataList from "@/components/table/tableDataList.vue";
import utils from '@/utils/utils.js';
import { getDeviceOnlineList,exportDeviceOnlineList } from '@/services/data-rank.js';
import datetimeUtils from '@/utils/datetime-utils'
import baseOptions from '@/utils/baseOptions';
export default {
    extends: baseOptions,
  components: { datePick, myEcharts, tableDataList },
  data () {
    return {
      datetimeUtils: datetimeUtils,
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      onlineType_options: [{
        value: 0,
        label: '平均在线率'
      }, {
        value: 1,
        label: '最低在线率'
      }],
      onlineType: 0, defaultStartTime: datetimeUtils.getPreDate(30),
      checkTime: { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') },
      list: [],
      tableData: {
        tHead: [
          { text: '门店名称', prop: 'shopName', sortable: true },
          { text: '在线率(%)', prop: 'val', sortable: true },
        ],
        data: [],
        total: 0,
        showCheckbox: false,
        showSequence: false,
        height: '690',
        paging: false,

      }, xName: '',
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
          data: [],
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
          // containLabel: true,
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
                color: '#ccc'
              }
            },
            axisLabel: {
              color: '#3A3A3A',
              interval: 'auto'
            },
            splitArea: {
              show: false
            }
          }
        ],
        yAxis: [
          {
              minInterval:1,
            type: 'value',
            name: '(%)',
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
            name: '设备在线排名',
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
        ],
      },
    }
  }

  , created () {
    //this.echartwidth = document.body.clientWidth * 0.84 + 'px';
    // this.tablewidth = document.body.clientWidth * 0.8 + 'px';
  }, mounted () {
    this.chartOption.tooltip.formatter = function (params, ticket, callback) {
      let htmlStr = "";
      console.log(JSON.stringify(params));
      htmlStr += `<div>
          `+ params[0].name + `
              </br>
             `+ params[0].data.unit + `：` + params[0].value + `%
              </div>`;
      return htmlStr;
    };
    this.query();
    //this.initCharts();
  },
  methods: {
    query () {
        let topShopNumers = '',that = this;
        if (this.checkedShopNumbers.length == 0) {
            let storage = window.localStorage;
            topShopNumers = storage.getItem("objTree");
        } else {
            this.checkedShopNumbers.forEach(function (v, i) {
                topShopNumers += v;
                if (that.checkedShopNumbers.length - 1 != i) {
                    topShopNumers += ','
                }
            });
        }
      this.xName = this.onlineType_options[this.onlineType].label;
      this.chartOption.yAxis[0].name = this.xName + "(%)";
      this.tableData.tHead[1].text = this.xName + "(%)";

        this.chartOption.legend.data=[];
        if(this.onlineType==0){
            this.chartOption.legend.data.push('平均在线率排名');
            this.chartOption.series[0].name='平均在线率排名';
        }else{
            this.chartOption.legend.data.push('最低在线率排名');
            this.chartOption.series[0].name='最低在线率排名';
        }
      getDeviceOnlineList({shopNumber:topShopNumers, onlineType: this.onlineType, start: this.checkTime.start, end: this.checkTime.end}).then((res) => {
        this.list = res.data;
        this.tableData.data = [];
        this.chartOption.xAxis[0].data = []; this.chartOption.series[0].data = [];
        for (let i = 0; i <= this.list.length; i++) {
          let o = this.list[i];
          o.shopName = o.shopName == null ? '' : o.shopName;
          this.chartOption.xAxis[0].data.push(o.shopName);
          if (this.onlineType == 0) {
            this.tableData.data.push({ shopName: o.shopName, val: o.avgVal });
            let obj = {
              "unit": this.xName,
              "value": o.avgVal
            };
            this.chartOption.series[0].data.push(obj);
          }
          else {
            this.tableData.data.push({ shopName: o.shopName, val: o.lowestVal });
            let obj = {
              "unit": this.xName,
              "value": o.lowestVal
            };
            this.chartOption.series[0].data.push(obj);
          }
        }
          if(this.chartOption.series.length==0){
              this.$message.warning("暂无数据");}
      }).catch((error) => {
        console.log(error)
      })
    },
    initCharts () {
      this.chartOption = utils.chartNewLine(this.chartOption, 4, 'xAxis');
    },
    get_Data () {
      this.isdata = true;
    },
    getCharts () {
      this.isdata = false;
    }, changeTime (start, end) {
      this.start = start;
      this.end = end;
    }, exportData () {
          let topShopNumers = '', that = this;
          if (this.checkedShopNumbers.length == 0) {
              let storage = window.localStorage;
              topShopNumers = storage.getItem("objTree");
          } else {
              this.checkedShopNumbers.forEach(function (v, i) {
                  topShopNumers += v;
                  if (that.checkedShopNumbers.length - 1 != i) {
                      topShopNumers += ','
                  }
              });
          }
          exportDeviceOnlineList(`?token=${localStorage.getItem('$token_info')}&shopNumber=${topShopNumers}&start=${this.checkTime.start }&end=${
              this.checkTime.end
              }&onlineType=${this.onlineType}`);
    }, formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  },  watch: {
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
