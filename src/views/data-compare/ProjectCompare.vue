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
                             :requestParams="{treeType: 1}"
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
          // { text: '时间', prop: 'time', sortable: true },
          // { text: '001号门店', prop: '001号门店', sortable: true },
          // { text: '项目二', prop: 'city', sortable: true },
          // { text: '项目三', prop: 'totalarea', sortable: true },
          // { text: '项目四', prop: 'energy', sortable: true },
          // { text: '项目五', prop: 'energy', sortable: true }
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
      objectoptions: [{
        value: '全部',
        label: '全部'
      }, {
        value: '红星美凯龙龙华店',
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

        // toolbox: {
        //     show: true,
        //     feature: {
        //         dataView: {show: true, readOnly: true,lang:['','关闭']},
        //         magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        //         restore: {show: true},
        //         saveAsImage: {show: true}
        //     }
        // }

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
        //
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
        //     magicType: { type: ['line', 'bar'] },
        //     //   restore: {show: true},
        //     //   saveAsImage: {show: true}
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
        topShopNumer += v;
        if (t.checkedShopNumbers.length - 1 != i) {
          topShopNumer += ','
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
        this.chartOption.yAxis.name = "单位(个)";
      }
      else if (this.compareParam == 2) {
        this.chartOption.yAxis.name = "单位(min)";
      }
      else if (this.compareParam == 3) {
        this.chartOption.yAxis.name = "单位(%)";
      }
      else if (this.compareParam == 4) {
        this.chartOption.yAxis.name = "单位(kWh)";
          if (this.detailIndex==2){
              this.chartOption.yAxis.name = "单位(kWh/m²)";
          }
      }

      let obj={        compareParam: this.compareParam, compareTarget: thisShop_Number, currentTarget: topShopNumer, detailIndex: this.detailIndex==0?'':this.detailIndex, timeType: this.timeType
          , start: this.checkTime.start, end: this.checkTime.end      };
        getShopCompareListReverse(obj).then((res) => {
            // console.log("getShopCompareListReverse:"+JSON.stringify(res))
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
        this.chartOption.xAxis.name=this.timeType==1?this.chartOption.xAxis.name='日期(日)':this.timeType==2? this.chartOption.xAxis.name='日期(月)':this.chartOption.xAxis.name='日期(年)';
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
          // let obj = {
          //     "unit": '%',
          //     "value": JSON.parse(dataObj.replace('}]',''))
          // };
          this.chartOption.series.push(param);

        }
        // debugger
         // console.log(JSON.stringify(this.chartOption))
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
        { label: '平均能耗', value: 2 }];
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
        this.detailIndex
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
