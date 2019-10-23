<template>
  <div class="inspection">
    <div class="u-layout-search two u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">变压器：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <el-select v-model="paramId" @change="getMeterOptions">
                  <el-option
                    v-for="item in numberOptions"
                    :key="item.transformerId"
                    :label="item.name"
                    :value="item.transformerId"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">支路：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <!--el-ui 根据需求增加配置-->

                <el-select v-model="meterId" @change="getNumberParamOptions">
                  <el-option
                    v-for="item in meterOptions"
                    :key="item.meterId"
                    :label="item.name"
                    :value="item.meterId"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">参数：</p>
            <div class="input-container multiple" style="width:250px ">
              <div style="border-radius: 2px;" class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <!-- <mult-select v-model="numberParam" :options="numberParamOptions"></mult-select> -->
                <el-select
                  @change="changeNumber"
                  multiple
                  collapse-tags
                  clearable
                  v-model="numberParam"
                  placeholder="请选择"
                >
                  <el-option-group
                    v-for="group in numberParamOptions"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.option"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-option-group>
                </el-select>
                <!--<el-select v-model="numberParam"-->
                <!--multiple-->
                <!--clearable-->
                <!--placeholder="请选择">-->
                <!--<el-option v-for="item in numberParamOptions"-->
                <!--:key="item.paramId"-->
                <!--:label="item.name"-->
                <!--:value="item.paramId"></el-option>-->
                <!--</el-select>-->
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
    <div v-if="!isdata">
      <myEcharts
        :id="'exampleId'"
        v-if="chartOption.series.length != 0"
        :style="{width:echartwidth, height: '665px'}"
        :option="chartOption"
      />

      <div class="echartsTitle" v-if="chartOption.series.length != 0">
        {{datetimeUtils.GMTToStr(checkTime.start).length>0?datetimeUtils.GMTToStr(checkTime.start).split(' ')[0]:''}}~{{datetimeUtils.GMTToStr(checkTime.end).length>0?datetimeUtils.GMTToStr(checkTime.end).split(' ')[0]:''}}
        供配电明细
      </div>
      <div
        v-if="chartOption.series.length == 0"
        style="text-align: center;height:400px;color: #909399; padding-top: 200px;font-size: 12px"
      >
        <span>{{loadText}}</span>
      </div>
    </div>
    <div v-if="isdata">
      <!--:span-method="objectSpanMethod"-->
      <el-table :data="tableData" style="width: 100%" height="700">
        <el-table-column
          :prop="item.prop"
          v-for="item in tHead"
          :label="item.text"
          :key="item.prop"
          width="200"
        ></el-table-column>
        <!--<el-table-column prop="test003"-->
        <!--label="test003"-->
        <!--width="150"></el-table-column>-->
        <!--<el-table-column prop="A相电流"-->
        <!--label="A相电流"></el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script>
import MultSelect from '@/components/form/MultSelect.vue';
import datePick from "@/components/timerange/separateTime";
import myEcharts from '@/components/echarts/index';
import TreeSelect from '@/components/treeSelect'
import tableDataList from "@/components/table/tableDataList.vue";
import datetimeUtils from '@/utils/datetime-utils'
import { getTransformerOfPowerSupple, getMeterOfPowerSupple, getParamOfPowerSupple, getPowerSupplyDistributionGraph, getPowerSupplyDistributionList, exportPowerSupplyDistribution } from '@/services/safety'
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { datePick, myEcharts, tableDataList, MultSelect, TreeSelect },
  data () {
    return {
      loadText: '暂无数据',
      datetimeUtils: datetimeUtils,
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      meterId: null, paramId: null,
      meterOptions: [],
      number: null, numberOptions: [],
      numberParam: [],
      numberParams: '',
      numberParamOptions: [],
      defaultStartTime: datetimeUtils.getPreDate(10),
      checkTime: { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(10), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') }
      , tableData: [], tHead: [], paramOfPowerSupple: [],
      chartOption: {
        color: ['#028CF7', '#4852DD', '#9D67FF', '#0DD789', '#F19F02', '#11AA07', '#F14D4D', '#00FFFC', '#FF8080', '#6FD1FF', '#A39823'],
        // noDataLoadingOption :{
        //     text: '暂无数据',
        //     effect:'bubble',
        //     effectOption : {
        //         effect: {
        //             n: 0 //气泡个数为0
        //         }
        //     },
        //     textStyle: {
        //         fontSize: 32,
        //         fontWeight: 'bold'
        //     }
        // },
        noDataLoadingOption: {
          text: '暂无数据',
          effect: 'bubble',
          effectOption: {
            effect: {
              n: 0
            }
          }
        },

        grid: {
          left: '3%',
          right: '4%',
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
          name: '',
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
        series: [],
        tooltip: {
          trigger: 'axis'
        },
      }
    }
  }
  , created () {
    this.$message.closeAll();
    // this.echartwidth = document.body.clientWidth * 0.85 + 'px';
    // this.tablewidth = document.body.clientWidth * 0.8 + 'px';
  }, mounted () {
    var obj = document.getElementsByClassName("el-select__tags");
    obj[0].style = "";
    var obj = document.getElementsByClassName("el-select el-select--small");
    obj[2].style = "width: 250px;";
    this.init();
  }, watch: {
    //门店编码
    shopNumber (val) {
      console.log('shopNumber变化了')
      if (val) {
        this.init();
      }
    },
    numberParam: {
      immediate: true,
      handler: function (val) {
        if (val.length === 0) return;
        this.query();
      }
    }
  },
  methods: {
    init () {
      this.paramId = null; this.meterId = null; this.numberParam = []; let that = this; this.numberParamOptions = [];
      getTransformerOfPowerSupple(this.shopNumber).then((res) => {
        if (res.data.length > 0) {
          this.paramId = res.data[0].transformerId;
          this.numberOptions = res.data;
          getMeterOfPowerSupple({ shopNumber: this.shopNumber, transformerId: this.paramId }).then((res) => {
            if (res.data.length > 0) {
              this.meterId = res.data[0].meterId;
              this.meterOptions = res.data;
              getParamOfPowerSupple(this.meterId).then((res) => {
                if (res.data && res.data.length) {
                  let tree = []
                  let parent = { label: '', option: [] };
                  this.paramOfPowerSupple = res.data
                  res.data.forEach(item => {
                    parent.label = item.paramTypeName;
                    parent.option = item.params.map(sub => ({ value: sub.paramId, label: sub.name }))
                    tree.push(JSON.parse(JSON.stringify(parent)));
                  })

                  this.numberParamOptions = tree;
                  console.log('item', this.numberParamOptions)
                  this.numberParam = [tree[0].option[0].value];
                }
                // this.query();
              });

            }
          });
        }
      });
    }, getMeterOptions () {
      this.meterId = null; this.numberParam = []; let that = this; this.numberParamOptions = [];
      getMeterOfPowerSupple({ shopNumber: this.shopNumber, transformerId: this.paramId }).then((res) => {
        if (res.data.length > 0) {
          this.meterId = res.data[0].meterId;
          this.meterOptions = res.data;
          getParamOfPowerSupple(this.meterId).then((res) => {
            if (res.data && res.data.length) {
              let tree = []
              let parent = { label: '', option: [] };
              res.data.forEach(item => {
                parent.label = item.paramTypeName;
                parent.option = item.params.map(sub => ({ value: sub.paramId, label: sub.name }))
                tree.push(JSON.parse(JSON.stringify(parent)));
              })

              this.numberParamOptions = tree;
              console.log('item', this.numberParamOptions)
              this.numberParam = [tree[0].option[0].value];
            }
            // this.query();
          });

        }
      });
    }, getNumberParamOptions () {
      this.numberParam = []; let that = this; this.numberParamOptions = [];
      getParamOfPowerSupple(this.meterId).then((res) => {
        if (res.data && res.data.length) {
          let tree = []
          let parent = { label: '', option: [] };
          res.data.forEach(item => {
            parent.label = item.paramTypeName;
            parent.option = item.params.map(sub => ({ value: sub.paramId, label: sub.name }))
            tree.push(JSON.parse(JSON.stringify(parent)));
          })

          this.numberParamOptions = tree;
          console.log('item', this.numberParamOptions)
          this.numberParam = [tree[0].option[0].value];
        }
        //  this.query();
      });
    },
    changeNumber (node) {
      let indexList = [];
      node.forEach(number => {
        this.numberParamOptions.forEach((sub, i) => {
          if (sub.option.some(s => s.value === number)) {
            if (!indexList.includes(i)) {
              indexList.push(i);

            }
          }
        })
      })
      if (indexList.length > 1) {
        this.numberParam = [node[node.length - 1]]
      }
      console.log('paramOfPowerSupple:' + JSON.stringify(this.paramOfPowerSupple))
      // this.numberParams = node.paramId;
    },
    query () {
      this.$message.close();
      let t = this;
      if (this.numberParam.length === 0) {
        this.$message.error("参数不能为空")
        return;
      }
      let paramCode = this.numberParam.join(',');
      this.chartOption.grid.top = "30px";
      if (this.numberParamOptions[0].option.length > 10) {
        this.chartOption.grid.top = "50px";
      }
      this.loadText = "加载中...";
      this.paramOfPowerSupple.forEach(item => {
        debugger
        item.params.forEach(it => {
          if (it.paramId == this.numberParam[0])
            t.chartOption.yAxis.name = item.paramTypeName + "(" + item.unit + ")";
        })
      });

      let o = { shopNumber: this.shopNumber, transformerId: this.paramId, meterId: this.meterId, paramIds: paramCode, startTime: this.checkTime.start, endTime: this.checkTime.end };
      if (!this.isdata) {
        let colors = ['#5F85E4', '#4EBB52', '#D88D51', '#783DDD', '#F2CC1C'];
        getPowerSupplyDistributionGraph(o).then((res) => {
          let rd = res.data.runningData;
          this.chartOption.xAxis[0].data = []; this.chartOption.series = []; this.chartOption.legend.data = [];
          //{"data":[{"number":"003","name":"test003"},{"number":"004","name":"A相电流"}],"code":200,"msg":"成功","errors":null}
          console.log(JSON.stringify(this.numberParam))
          console.log(JSON.stringify(this.numberParamOptions[0].option))
          for (let i = 0; i < this.numberParam.length; i++) {
            let j = 0;
            let iv = this.numberParam[i];
            for (j; j < this.numberParamOptions[0].option.length; j++) {
              if (iv == this.numberParamOptions[0].option[j].value) {

                if (res.data.runningData.length == 0) { continue; }

                for (let l = 0; l < res.data.runningData.length; l++) {
                  if (res.data.runningData[l].hasOwnProperty(this.numberParamOptions[0].option[j].label)) {
                    let rd = res.data.runningData[l][this.numberParamOptions[0].option[j].label];
                    console.log(rd.length + ':' + JSON.stringify(rd));
                    // break;
                    //  console.log(this.numberParamOptions[j].name+':'+JSON.stringify(rd).length);
                    // continue;
                    if (rd.length == 0) { continue; }
                    this.chartOption.legend.data.push(this.numberParamOptions[0].option[j].label);
                    // console.log(JSON.stringify(rd))
                    let param = {
                      name: this.numberParamOptions[0].option[j].label,
                      type: 'line',
                      smooth: true,
                      color: colors[i],
                      data: []
                    };
                    for (let k = 0; k < rd.length; k++) {
                      let o = rd[k];
                      if (!this.chartOption.xAxis[0].data.includes(o.time)) {
                        this.chartOption.xAxis[0].data.push(o.time);
                      }
                      param.data.push(o.value);
                    }
                    this.chartOption.series.push(param);
                  }

                }
                console.log('结果：' + JSON.stringify(this.chartOption.series))
              }
            }
          }
          this.loadText = "暂无数据";
          if (this.chartOption.series.length == 0) {
            this.loadText = "暂无数据";
            // this.chartOption.showLoading({
            //         text: '暂无数据',
            //         color: '#3C404B',
            //         textColor: '#3C404B',
            //         maskColor: 'rgba(255, 255, 255, 0.8)',
            //     }
            // );
            this.$message({
              message: '暂无数据！',
              type: 'warning',
              duration: 500
            });
          }

          this.chartOption.tooltip.formatter = function (params, ticket, callback) {

            let htmlStr = '<div>' + params[0].name + '</br>';
            for (let i = 0; i < params.length; i++) {
              htmlStr += params[i].seriesName + ':' + params[i].value + 'kWh</br>';
            }
            return htmlStr;
          };
        }).catch((error) => {
          this.loadText = "暂无数据";
        });
      }
      else {
        this.tHead = [];
        this.tableData = [];
        let o = { shopNumber: this.shopNumber, transformerId: this.paramId, meterId: this.meterId, paramIds: paramCode, startTime: this.checkTime.start, endTime: this.checkTime.end };
        getPowerSupplyDistributionList(o).then((res) => {

          this.tHead.push({ text: '时间', prop: '时间' })
          for (let i = 0; i < this.numberParam.length; i++) {
            let j = 0;
            let iv = this.numberParam[i];
            for (j; j < this.numberParamOptions[0].option.length; j++) {
              if (iv == this.numberParamOptions[0].option[j].value) {
                // let rd = res.data.runningData[i][this.numberParamOptions[j].name];
                this.tHead.push({ text: this.numberParamOptions[0].option[j].label, prop: this.numberParamOptions[0].option[j].label })

              }
            }
          }
          this.loadText = "暂无数据";
          this.tableData = res.data.runningData;
        });
      }
    },
    getData () {
      this.isdata = true;
      this.query();
    },
    getCharts () {
      this.isdata = false;
      this.query();
    }, getWidth (defaultWidth = 100, size = 100) {
      return this.numberParam.length <= 1 ? defaultWidth + 'px' : defaultWidth + (this.numberParam.length - 1) * size + 'px';
    }, exportData () {
      let t = this;
      let paramCode = '';
      this.numberParam.forEach(function (n, i) {
        paramCode += n;
        if (t.numberParam.length - 1 != i) {
          paramCode += ','
        }
      });
      if (paramCode == '') {
        this.$message.error("参数不能为空")
        return;
      }
      exportPowerSupplyDistribution(`?token=${localStorage.getItem('$token_info')}&shopNumber=${this.shopNumber}&startTime=${this.checkTime.start}&endTime=${
        this.checkTime.end
        }&paramIds=${
        paramCode
        }&transformerId=${
        this.paramId
        }&meterId=${
        this.meterId
        }`);
    },

    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {

      return {
        rowspan: 0,
        colspan: 0
      };
      if (columnIndex === 0) {
        if (rowIndex % 4 === 0) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
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
