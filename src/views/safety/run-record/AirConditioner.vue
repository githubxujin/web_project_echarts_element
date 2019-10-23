<template>
  <div class="inspection">
    <div class="u-layout-search two u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">设备：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <el-select v-model="equipmentId" @change="getNumberParamOptions">
                  <el-option
                    v-for="item in equipmentOptions"
                    :key="item.equipmentId"
                    :label="item.name"
                    :value="item.equipmentId"
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
                <!--:style="{width:getWidth()}"-->
                <!--multiple-->
                <!--clearable-->
                <!--placeholder="请选择">-->
                <!--<el-option v-for="item in numberParamOptions"-->
                <!--:key="item.paramIds"-->
                <!--:label="item.name"-->
                <!--:value="item.paramIds">-->
                <!--</el-option>-->
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
        :id="'exampleId2'"
        v-if="chartOption.series.length != 0"
        :style="{width:echartwidth, height: '665px'}"
        :option="chartOption"
      />
      <div class="echartsTitle" v-if="chartOption.series.length != 0">
        {{datetimeUtils.GMTToStr(checkTime.start).length>0?datetimeUtils.GMTToStr(checkTime.start).split(' ')[0]:''}}~{{datetimeUtils.GMTToStr(checkTime.end).length>0?datetimeUtils.GMTToStr(checkTime.end).split(' ')[0]:''}}
        空调明细
      </div>
      <div
        v-if="chartOption.series.length == 0"
        style="text-align: center;height:400px;color: #909399; padding-top: 200px;font-size: 12px"
      >
        <span>{{loadText}}</span>
      </div>
    </div>
    <div v-if="isdata" class="datatable-box">
      <tableDataList
        id="tableList"
        :style="{width:tablewidth}"
        :show-sequence="tableData.showSequence"
        :v-table-data="tableData"
      ></tableDataList>
    </div>
  </div>
</template>
<script>
import MultSelect from '@/components/form/MultSelect.vue';
import datePick from "@/components/timerange/separateTime";
import myEcharts from '@/components/echarts/index';
import tableDataList from "@/components/table/tableDataList.vue";
import utils from '@/utils/utils.js';
import datetimeUtils from '@/utils/datetime-utils'
import {  getTransformerOfPowerSupple, getMeterOfPowerSupple, getParamOfPowerSupple,
  getAirConditionerEquipment, getACEquipmentParam, getAirConditionerList, getAirConditionerGraph, exportAirConditionerData, exportDrainage} from '@/services/safety'
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { datePick, myEcharts, tableDataList, MultSelect },
  data () {
    return {
      loadText: '暂无数据',
      datetimeUtils: datetimeUtils,
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      equipmentId: null,
      equipmentOptions: [],
      meterId: null,
      meterOptions: [],
      number: null, numberOptions: [],
      numberParam: [],
      numberParamOptions: [],
      defaultStartTime: datetimeUtils.getPreDate(10),
      checkTime: { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(10), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') },
      tableData: {
        tHead: [
          // { text: '门店名称', prop: 'proname', sortable: true },
          // { text: '总报警数', prop: 'type', sortable: true },
          // { text: '一级', prop: 'city', sortable: true },
          // { text: '二级', prop: 'totalarea' },
          // { text: '三级', prop: 'energy', sortable: true },
          // { text: '四级', prop: 'energy', sortable: true },
          // { text: '五级', prop: 'energy', sortable: true }
        ],
        data: [],
        total: 0,
        showCheckbox: false,
        showSequence: false,
        height: '690',
        paging: false,

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
          name: '',//电耗(kWh)
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
          data: [],
          type: 'line',
          smooth: true
        }],
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
      }
    }
  }
  , created () {
    this.$message.closeAll();
  }, mounted () {
    var obj = document.getElementsByClassName("el-select__tags");
    obj[0].style = "";
    var obj = document.getElementsByClassName("el-select el-select--small");
    obj[1].style = "width: 250px;";
    this.init();
  },
  watch: {
    //门店编码
    shopNumber (val) {
      console.log('shopNumber变化了')
      if (val) {
        this.init();
      }
    }
  },
  methods: {
    init () {
      this.equipmentId = null; this.numberParam = []; this.numberParamOptions = []; let that = this;
      getAirConditionerEquipment(this.shopNumber).then((res) => {
        if (res.data.length > 0) {
          this.equipmentId = res.data[0].equipmentId;
          this.equipmentOptions = res.data;
          getACEquipmentParam("?equipmentId=" + this.equipmentId + "&shopNumber=" + this.shopNumber).then((res) => {
            if (res.data.length > 0) {
              let tree = []
              let parent = { label: '', option: [] };
              this.paramOfPowerSupple = res.data
              res.data.forEach(item => {
                parent.label = item.paramTypeName;
                parent.option = item.params.map(sub => ({ value: sub.paramId, label: sub.name }))
                tree.push(JSON.parse(JSON.stringify(parent)));
              })

              this.numberParamOptions = tree;
              this.numberParam = [tree[0].option[0].value]
            }
            this.query();
          });
        }
      });
    }, getNumberParamOptions () {
      this.numberParam = []; this.numberParamOptions = []; let that = this;
      getACEquipmentParam("?equipmentId=" + this.equipmentId + "&shopNumber=" + this.shopNumber).then((res) => {
        if (res.data.length > 0) {
          let tree = []
          let parent = { label: '', option: [] };
          this.paramOfPowerSupple = res.data
          res.data.forEach(item => {
            parent.label = item.paramTypeName;
            parent.option = item.params.map(sub => ({ value: sub.paramId, label: sub.name }))
            tree.push(JSON.parse(JSON.stringify(parent)));
          })

          this.numberParamOptions = tree;
          this.numberParam = [tree[0].option[0].value]
          this.query();
        }
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
    },
    query () {

      let param_Ids = '';
      let t = this;
      this.numberParam.forEach(function (n, i) {
        param_Ids += n;
        if (t.numberParam.length - 1 != i) {
          param_Ids += ','
        }
      });
      if (param_Ids == '') {
        this.$message.error("参数不能为空");
        return;
      }
      this.loadText = "加载中...";
      let o = { endTime: this.checkTime.end + " 23:59:59", equipmentId: this.equipmentId, paramIds: param_Ids, shopNumber: this.shopNumber, startTime: this.checkTime.start + " 00:00:00" };
      if (!this.isdata) {
        let colors = ['#5F85E4', '#4EBB52', '#D88D51', '#783DDD', '#F2CC1C'];
        this.chartOption.xAxis[0].data = []; this.chartOption.series = [];
        getAirConditionerGraph(o).then((res) => {
          if (res.data.length > 0) {
            let obj = res.data;
            for (let i = 0; i < obj.length; i++) {
              let obji = obj[i];
              let param = {
                name: obji.name,
                data: [],
                type: 'line',
                smooth: true,
                color: colors[i],
              };
              this.chartOption.legend.data.push(obji.name);
              for (let j = 0; j < obji.paramValue.length; j++) {
                let objj = obji.paramValue[j];
                param.data.push(objj.currValue);
                if (!this.chartOption.xAxis[0].data.includes(objj.time)) {
                  this.chartOption.xAxis[0].data.push(objj.time);
                }
              }
              this.chartOption.series.push(param)
            }
          }
          if (this.chartOption.series.length == 0) {
            this.loadText = "暂无数据";
            this.$message({
              message: '暂无数据！',
              type: 'warning',
              duration: 500
            });
          }
          //this.initCharts();
        });
      }
      else {
        this.tableData.tHead = []; this.tableData.data = [];
        getAirConditionerList(o).then((res) => {
          this.tableData.data = res.data;
          this.tableData.tHead.push({ text: '时间', prop: 'time', sortable: true });
          for (let k = 0; k < this.numberParam.length; k++) {
            for (let i = 0; i < this.numberParamOptions.length; i++) {
              if (this.numberParam[k] == this.numberParamOptions[i].value && this.tableData.data && this.tableData.data.length > 0 && this.tableData.data[0].hasOwnProperty(this.numberParam[k].toString())) {
                let o = this.numberParamOptions[i];
                this.tableData.tHead.push({ text: o.label, prop: o.value.toString(), sortable: true });
              }
              else if (this.numberParam[k] == this.numberParamOptions[i].value) {
                this.tableData.tHead.push({ text: this.numberParamOptions[i].label, prop: '' });
              }
            }
          }
          this.loadText = "暂无数据";
          console.log(JSON.stringify(this.numberParam))
          console.log(JSON.stringify(this.numberParamOptions))
        });
      }
    },
    initCharts () {
      this.chartOption = utils.chartNewLine(this.chartOption, 4, 'xAxis');
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
    }, getWidth (defaultWidth = 150, size = 150) {
      return this.numberParam.length <= 1 ? defaultWidth + 'px' : defaultWidth + (this.numberParam.length - 1) * size + 'px';
    }, exportData () {
      let param_Ids = '';
      let t = this;
      this.numberParam.forEach(function (n, i) {
        param_Ids += n;
        if (t.numberParam.length - 1 != i) {
          param_Ids += ','
        }
      });
      if (param_Ids == '') {
        this.$message.error("参数不能为空");
        return;
      }
      exportAirConditionerData(`?token=${localStorage.getItem('$token_info')}&shopNumber=${this.shopNumber}&startTime=${this.checkTime.start + " 00:00:00"}&endTime=${
        this.checkTime.end + " 23:59:59"
        }&equipmentId=${this.equipmentId}&paramIds=${param_Ids.toString()}`);
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
