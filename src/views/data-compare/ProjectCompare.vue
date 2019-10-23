<template>
  <div class="inspection">
    <div class="u-layout-search three u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">对比对象：</p>
            <div class="input-container">
              <div style="border-radius: 2px;"
                   class="item select-input">
                <projectTree v-model="thisShopNumber"
                             :showTabs="false"
                             :clearable="true"
                             :isMultiple="false"
                             :requestParams="{treeType:2}"
                             :anotherStyle="false"
                             @ajaxSuccess="ajaxSuccess"
                             :showTitle="false"></projectTree>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">对比参数：</p>
            <div class="input-container">
              <div style="border-radius: 2px;"
                   class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select v-model="compareParam"
                           @change="getParameteroptions"
                           placeholder="请选择">
                  <el-option v-for="item in compareParamOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>

        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">明细指标：</p>
            <div class="input-container">
              <div style="border-radius: 2px;"
                   class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select v-model="detailIndex"
                           placeholder="请选择">
                  <el-option v-for="item in detailIndexOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>

        <div class="u-layout-left-item">
          <div class="title-input-group">
            <datePick v-model="checkTime"
                      type="daterange"
                      :compareTime="true"
                      :clearable="false"
                      :defaultStartTime="defaultStartTime"
                      @checkedTime="checkedTime"
                      @switchTime="switchTime"></datePick>
          </div>
        </div>

        <div class="u-layout-left-item">
          <el-button class="el-button el-button--primary el-button--small is-round"
                     icon="el-icon-search"
                     @click="query">查询</el-button>
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
    <myEcharts :id="'exampleId_project'"
               :style="{height: '700px','line-height':'20px'}"
               :option="chartOption"
               v-if="!isdata&&chartOption.series.length != 0" />
      <div  v-if="!isdata&&chartOption.series.length == 0" style="text-align: center;height:400px;color: #909399; padding-top: 200px;font-size: 12px">
          <span>暂无数据</span></div>
      <div v-if="isdata" class="datatable-box">
          <tableDataList
              id="tableList"
              :show-sequence="tableData.showSequence"
              :v-table-data="tableData"
          ></tableDataList>
      </div>
  </div>
</template>

<script>
import projectTree from '@/components/projecttree'
import datePick from "@/components/timerange/index";
import myEcharts from '@/components/echarts/index';
import tableDataList from "@/components/table/tableDataList";
import utils from '@/utils/utils.js';
import { getShopCompareList, exportShopCompareList ,getShopCompareListReverse} from '@/services/data-compare';
import datetimeUtils from '@/utils/datetime-utils'
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { datePick, myEcharts, tableDataList, projectTree },
  data () {
    return {
      isloadpage: false,
      datetimeUtils: datetimeUtils,
      thisShopNumber: [],
      isdata: false,
      defaultStartTime: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'),
      checkTime: {},
      tableData: {
        tHead: [
        ],
        data: [],
        total: 0,
        showCheckbox: false,
        showSequence: false,
        height: '690',
        paging: false
      },
      echartwidth: '100%',
      tablewidth: '100%',
      compareParam: 1,
      compareParamOptions: [{
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
      detailIndex:0,
      detailIndexOptions: [
        { label: '全部', value: 0 },
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 },
        { label: '四级', value: 4 },
        { label: '五级', value: 5 },
      ],
      list: [],
      timeType: 1,
      objectoptions: [
      ], parameteroptions: [{
        value: '报警级别',
        label: '报警级别'
      }, {
        value: '响应时间',
        label: '响应时间'
      }
        , {
        value: '设备在线',
        label: '设备在线'
      }
      ],
      quotaoptions: [{
        value: '全部',
        label: '全部'
      }, {
        value: '一级及以上',
        label: '一级及以上'
      }
        , {
        value: '二级及以上',
        label: '二级及以上'
      }
        , {
        value: '三级及以上',
        label: '三级及以上'
      }
        , {
        value: '四级及以上',
        label: '四级及以上'
      }
        , {
        value: '五级及以上',
        label: '五级及以上'
      }
      ],
      objecvalue: '', check_Time: '',
      parametervalue: '', quotavalue: '',
      chartOption: {
          color: ['#028CF7','#4852DD','#9D67FF','#0DD789','#F19F02','#11AA07','#F14D4D','#00FFFC','#FF8080','#6FD1FF','#A39823'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [],
          left: "center"
        },
        grid: {
          left: '3%',
          right: '3%',
          top: '5%',
          bottom: '7%',
          // containLabel: true
        },
        xAxis: {
          name: "",
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

        },
        yAxis: {
            minInterval:1,
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
        series: []
      }
    }
  },
  created () {
    this.echartwidth = document.body.clientWidth * 0.85 + 'px';
  },
  mounted () {
    this.checkTime = { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') };

  }, methods: {
    query () {

      this.isloadpage = true;
      let thisShop_Number = '', topShopNumer = '', t = this;
      this.thisShopNumber.forEach(function (v, i) {
        thisShop_Number += v;
        if (t.thisShopNumber.length - 1 != i) {
          thisShop_Number += ','
        }
      });
      this.checkedShopNumbers.forEach(function (v, i) {
        //   debugger
        // topShopNumer += v;
        if (t.checkedShopNumbers.length - 1 == i) {
            topShopNumer += v;
        }
      });
      if (!thisShop_Number || !topShopNumer) {
        this.$message.error("请选择门店或对比对象");
        return;
      }
      else if (thisShop_Number == topShopNumer) {
        this.$message.error("对比的两个门店不能一样");  return;
      }
      if (this.compareParam == 1) {
          this.chartOption.yAxis.name = "数量(个)";
      }
      else if (this.compareParam == 2) {
          this.chartOption.yAxis.name = "时间(min)";
      }
      else if (this.compareParam == 3) {
          this.chartOption.yAxis.name = "占比(%)";
      }
      else if (this.compareParam == 4) {
          this.chartOption.grid.left='3%';
          this.chartOption.yAxis.name = "总能耗(kWh)";
          if (this.detailIndex==2){
              this.chartOption.grid.left='4%';
              this.chartOption.yAxis.name = "单位面积能耗(kWh/m²)";
          }
      }

      let obj={        compareParam: this.compareParam, compareTarget: thisShop_Number, currentTarget: topShopNumer, detailIndex: this.detailIndex==0?'':this.detailIndex, timeType: this.timeType
          , start: this.checkTime.start, end: this.checkTime.end      };
        getShopCompareListReverse(obj).then((res) => {
            if (res.data.length>0){
              this.tableData.tHead=[];
                let t_count = JSON.stringify(res.data[0]).toString().split('":"').length-1;
               if (t_count>=1){
                   this.tableData.tHead.push({ text: '时间', prop: 'time', sortable: true });
               }
               for (let i=0;i<t_count-1;i++){
                   this.tableData.tHead.push({text: res.data[0]['shop'+i], prop: 'shop'+i, sortable: true});

               }
                this.tableData.data=res.data.splice(1);
            }

        });
        this.chartOption.xAxis.name=this.timeType==1?this.chartOption.xAxis.name='日':this.timeType==2? this.chartOption.xAxis.name='月':this.chartOption.xAxis.name='年';
      getShopCompareList(obj).then((res) => {
        let obj = res.data;
        this.list = obj;
        // this.tableData.data = obj;
        this.chartOption.legend.data = [];
        this.chartOption.xAxis.data = []; this.chartOption.series = [];
        console.log(JSON.stringify(obj).toString())
        let count = JSON.stringify(obj).toString().split(':[').length;
        for (let i = 0; i < count; i++) {
          let iobj = JSON.stringify(obj).toString().split('],')[i];
          if (!iobj || iobj.indexOf(":[") == -1) {
            continue;
          }
          let pName = iobj.split(":[")[0].replace('{"', '').replace('"', '').replace('"', '');
          if (i == 0) {
            this.chartOption.xAxis.data = obj[pName];
          }
          let a = pName.indexOf("时间");
          if (pName.indexOf("时间") > -1) {
            continue;
          }
          let param = {
            name: pName,
            type: 'line',
              smooth: true,
            data: []
          };
          this.chartOption.legend.data.push(pName);
          let dataObj = "[" + iobj.split(":[")[1] + "]";
          param.data = JSON.parse(dataObj.replace('}]', ''));
          this.chartOption.series.push(param);

        }
        if (this.chartOption.series.length == 0) {
            this.chartOption.xAxis.data=[];
            this.tableData.data=[];
         // this.$message.warning("暂无数据");
        }
        console.log('aaa:' + JSON.stringify(this.chartOption.legend.data))

      }).catch((error) => {
        console.log(error)
      });
    }, switchTime (index) {
      this.timeType = index;
    },
    checkedTime (res) {
      if (res == "1") {
        this.tabIndex = 'date';
      }
      else if (res == "2") {
        this.tabIndex = 'month';
      }
      else if (res == "3") {
        this.tabIndex = 'year';
      }
      else {
        this.checkTime = res;
        console.log('getTime:' + JSON.stringify(res));
      }
    },
    get_Data () {
      this.isdata = true;
    }, getParameteroptions () {
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
    getCharts () {
      this.isdata = false;
    }, exportData () {
      let thisShop_Number = '', topShopNumer = '', t = this;
      this.thisShopNumber.forEach(function (v, i) {
        thisShop_Number += v;
        if (t.thisShopNumber.length - 1 != i) {
          thisShop_Number += ','
        }
      });
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumer += v;
        if (t.checkedShopNumbers.length - 1 != i) {
          topShopNumer += ','
        }
      });
      exportShopCompareList(`?token=${localStorage.getItem('$token_info')}&compareParam=${this.compareParam}&start=${
        this.checkTime.start
        }&end=${this.checkTime.end }&detailIndex=${
          this.detailIndex==0?'':this.detailIndex
        }&compareTarget=${thisShop_Number}&currentTarget=${topShopNumer}&timeType=${this.timeType}`);
    }, ajaxSuccess (data, copydata) {
      try {
        this.thisShopNumber = [];
        let shopNO = data[0].data[0].children[0].children[0].children[0].shopNumber;
        this.thisShopNumber.push(shopNO);
      } catch (e) {
        console.log(e);
      }

      this.query();
    }
  }, watch: {
    // //门店编码
    // shopNumber (val) {
    //   console.log('shopNumber变化了')
    //   alert(val)
    // },
    checkedShopNumbers: {
      handler (val) {
        if (this.isloadpage) {
          this.query();        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
