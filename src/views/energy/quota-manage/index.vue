<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="定额设置" name="default">
          <div class="quato-manage">
            <div class="u-layout-search u-layout-dobule">
              <div class="u-layout-left-proviso">
                <div class="u-layout-left-item">
                  <div class="title-input-group u-title-input-group">
                    <div class="input-container">
                      <tab-btn :dataArr="energyData" :value="energyType" @change="getEnergyType"></tab-btn>
                    </div>
                  </div>

                  <div class="title-input-group u-title-input-group">
                    <p class="text">日期：</p>
                    <div class="input-container">
                      <el-select
                        v-model="year"
                        placeholder="请选择"
                        class="date-select"
                        @change="getYear"
                      >
                        <el-option
                          v-for="item in dateTime"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="u-layout right-item">
                <div class="u-layout-right-item">
                  <div class="title-input-group u-title-input-group">
                    <div class="input-container">
                      <el-button type="primary" round @click="setQuota" v-if="showSettingBtn">设置定额</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 柱状图，累计能耗与定额比 -->
            <div class="quato-chart">
              <div class="v-charts fl">
                <v-chart :option="option" id="quatoChart" :style="{height:'380px'}" />
              </div>
              <div class="fr right-box">
                <energy-rate-ratio :energyType="energyType" :year="year" :plotData="plotData"></energy-rate-ratio>
              </div>
            </div>
            <div class="quato-detail">
              <div class="titleAndExport">
                <span class="title">门店定额详情</span>
                <el-button
                  round
                  icon="el-icon-upload2"
                  @click="exportQuotaDetail"
                  v-if="showExportBtn"
                >导出</el-button>
              </div>
              <div class="energy-detial-table">
                <div class="datatable-box">
                  <el-table :data="tableData.tData" style="width: 100%" ref="table">
                    <el-table-column
                      v-for="(item,index) in tableData.tHead"
                      :key="index"
                      :prop="item.prop"
                      :label="item.text"
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.itemName==='去年同比'">
                          <span v-if="item.prop==='itemName'">{{scope.row[item.prop]}}</span>
                          <span
                            v-else-if="item.prop!=='itemName'&&scope.row[item.prop]==='--'"
                          >{{scope.row[item.prop]}}</span>
                          <!-- <span
                            v-else-if="item.prop!=='itemName'&&yearOverYear[parseInt(item.prop)]==='--'||item.prop!=='itemName'&&yearOverYear[parseInt(item.prop)]===0"
                          >{{scope.row[item.prop]}}</span>
                          <span
                            v-else-if="item.prop!=='itemName'&&yearOverYear[parseInt(item.prop)]>0"
                          >
                            <i class="el-icon-sort-up" style="color:#ff5a5d"></i>
                            <i class="iconfont icon-up-arrow" style="color:#ff5a5d"></i>
                            {{scope.row[item.prop]}}
                          </span>-->
                          <span
                            v-else-if="item.prop!=='itemName'&&yearOverYear[index]==1&&scope.row[item.prop]!='--'"
                          >
                            <!-- <i class="el-icon-sort-up" style="color:#ff5a5d"></i> -->
                            <i class="iconfont icon-up-arrow" style="color:#ff5a5d"></i>
                            {{scope.row[item.prop]}}
                          </span>
                          <span
                            v-else-if="item.prop!=='itemName'&&yearOverYear[index]==0&&scope.row[item.prop]!='--'"
                          >
                            <!-- <i class="el-icon-sort-down" style="color:#81b776"></i> -->
                            <i class="iconfont icon-up-arrow1" style="color:#81b776"></i>
                            {{scope.row[item.prop]}}
                          </span>
                          <!-- <span v-else>
                            <i class="el-icon-sort-down" style="color:#81b776"></i>
                            <i class="iconfont icon-up-arrow1" style="color:#81b776"></i>
                            {{scope.row[item.prop]}}
                          </span>-->
                        </span>
                        <span v-else-if="scope.row.itemName==='环比'">
                          <span v-if="item.prop==='itemName'">{{scope.row[item.prop]}}</span>
                          <span
                            v-else-if="item.prop!=='itemName'&&scope.row[item.prop]==='--'"
                          >{{scope.row[item.prop]}}</span>
                          <span
                            v-else-if="item.prop!=='itemName'&&linkRelativeRatio[index]==1&&scope.row[item.prop]!='--'"
                          >
                            <!-- <i class="el-icon-sort-up" style="color:#ff5a5d"></i> -->
                            <i class="iconfont icon-up-arrow" style="color:#ff5a5d"></i>
                            {{scope.row[item.prop]}}
                          </span>
                          <span
                            v-else-if="item.prop!=='itemName'&&linkRelativeRatio[index]==0&&scope.row[item.prop]!='--'"
                          >
                            <!-- <i class="el-icon-sort-down" style="color:#81b776"></i> -->
                            <i class="iconfont icon-up-arrow1" style="color:#81b776"></i>
                            {{scope.row[item.prop]}}
                          </span>
                        </span>
                        <span v-else>
                          <span>{{scope.row[item.prop]}}</span>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 定额设置 -->
      <el-dialog
        v-dialogDrag
        :title="title"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="957px"
        :visible.sync="showQuatoSetting"
      >
        <quato-setting
          :searchFile="searchFile"
          :dateTime="dateTime"
          v-if="showQuatoSetting"
          @isHide="isHide"
        ></quato-setting>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import tabBtn from '@/components/tabs/Tabs.vue'
import vChart from '@/components/echarts/index';
import energyRateRatio from './EnergyRateRatio.vue';
import quatoSetting from './QuatoSetting.vue'
import { getYearQuota, getTotalEnergyConsumeQuota, getQuotaDetail } from '@/services/energy'
import energyDetails from '@/axios/modules/energy.js'
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { tabBtn, vChart, energyRateRatio, quatoSetting },
  data () {
    return {
      activeName: 'default',
      energyData: [
        { value: '01', icon: 'iconfont icon-dian' },
        { value: '02', icon: 'iconfont icon-shui' },
      ],
      energyType: '01',//水02，电01
      defTypeColor: ["", "#FEC068", "#4EB9DB", "#F49794"],
      energyUnit: ['', '用电量:kWh', '用水量:m³'],
      dateTime: [],
      year: new Date().getFullYear(),//外部日期年份
      searchFile: {//查询月定额与实际能耗的参数
        energyType: '01',
        // shopNumber: '440300B112',
        shopNumber: '',
        year: new Date().getFullYear(),
      },
      option: {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['实际能耗', '超定额', { name: "定额", height: '1' }],
          itemWidth: 32,
          itemHeight: 8,
          right: 50
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: true,
            lineStyle: {
              // 网格颜色
              color: ['#E5EFF5']
            }
          }
        }],
        yAxis: [{
          type: 'value',
          name: '',//y轴单位
          splitLine: {
            show: true,
            lineStyle: {
              // 网格颜色
              color: ['#E5EFF5']
            }
          }
        }],
        series: []
      },
      plotData: {//定额，累计定额，年总定额等数据组成的对象
        yearTotalQuota: 0,
        threoryQuota: 0,
        totalEnergy: 0
      },
      tableData: {
        tHead: [
          {
            text: '明细',
            prop: "itemName",
            width: 240,
          },
          {
            text: '1月',
            prop: "1",
          },
          {
            text: '2月',
            prop: "2"
          },
          {
            text: '3月',
            prop: "3"
          },
          {
            text: '4月',
            prop: "4"
          },
          {
            text: '5月',
            prop: "5"
          },
          {
            text: '6月',
            prop: "6"
          },
          {
            text: '7月',
            prop: "7"
          },
          {
            text: '8月',
            prop: "8"
          },
          {
            text: '9月',
            prop: "9"
          },
          {
            text: '10月',
            prop: "10"
          },
          {
            text: '11月',
            prop: "11"
          },
          {
            text: '12月',
            prop: "12"
          },
          {
            text: '合计',
            prop: "13",
          }
        ],
        tData: []
      },
      title: '',
      linkRelativeRatio: [],//环比
      yearOverYear: [],//同比
      showQuatoSetting: false
    };
  },
  created () {
    this.title = this.roleType == 2 ? this.$store.getters.getUserInfo.shopName + '-定额设置' : this.curShop.shopName + '-定额设置'
  },
  mounted () {
    this.getDate();
    this.getTotalEnergyConsumeQuota();
    this.getQuotaDetail()
    // this.getYearQuota();
  },
  computed: {
    roleType: function () {
      return this.$store.getters.getUserInfo.roleType;
    },
    curShop: function () {
      return this.$store.getters.getCurShop;
    },
    shopNumbers: function () {
      return this.$store.getters.shopNumber;
    },
    // -----------------按钮权限---------------------
    //显示转单按钮
    showExportBtn () {
      return this.pageBtns.some(val => val == 'export');
    },
    showSettingBtn () {
      return this.pageBtns.some(val => val == 'setting-quota');
    },
    // -----------------按钮权限结束---------------------
  },
  watch: {
    searchFile: {
      handler (newName, oldName) {
        this.getYearQuota();
        this.getTotalEnergyConsumeQuota();
        this.getQuotaDetail()
      },
      deep: true
    },
    shopNumbers (val) {
      this.searchFile.shopNumber = val;
      this.getYearQuota();
      this.getTotalEnergyConsumeQuota();
      this.getQuotaDetail()
    },
    curShop: {
      handler (newVal, old) {
        this.searchFile.shopNumber = newVal.shopNumber;
        this.title = newVal.shopName + '-定额设置';
      },
      deep: true
    }
  },
  methods: {

    // 获取日期
    getDate () {
      console.log(this.$store.getters.getUserInfo, this.curShop)
      this.searchFile.shopNumber = this.roleType == 2 ? this.shopNumbers : this.curShop.shopNumber;
      console.log('门店编号', this.searchFile.shopNumber)
      let now = new Date().getFullYear() + 1
      for (let i = 2007; i <= now; i++) {
        this.dateTime.push({ label: i + '年', value: i })
      }
    },
    getEnergyType (val) {
      this.energyType = val;
      this.searchFile.energyType = val;
    },
    getYear (val) {
      this.searchFile.year = val;
      this.year = val;
    },
    //获取用能/定额
    async getYearQuota () {
      let res = await getYearQuota(this.searchFile)
      if (res.code === 200) {
        if (res.data && res.data.array && res.data.array.length > 0) {
          let realityUsed = [];//实际能耗
          let quatoUsed = [];//定额能耗
          res.data.array.forEach(item => {
            realityUsed.push(item.used);
            quatoUsed.push(item.quota);
          })
          let result = this.quotaDataProcessing(realityUsed, quatoUsed);//计算数据
          // console.log(result)
          if (result) {
            this.getQuotaTabledata(result);//渲染左一柱形图
          }
        } else {
          this.option.series = [];//显示数据为空
        }
        console.log('this.option', this.option)
      } else {
        console.log(res.msg)
      }
    },
    //处理定额及用能数据
    quotaDataProcessing (usd, defd) {
      console.log("柱形图1数据处理实际能耗usd=", usd, ";定额数据defd=", defd)
      var data = {};
      var maxHight = 0
      for (let i = 0; i < usd.length; i++) {
        if (usd[i] > maxHight) {
          maxHight = usd[i];
        }
        if (defd[i] > maxHight) {
          maxHight = defd[i];
        }
      }
      console.log('最大值', maxHight)
      // console.log("maxHight", maxHight);
      var used = [];//定额用能与实际用能的集合
      var vldefd = [];
      var hidedef = [];//隐藏的数据
      var overhight = [];//超定额
      // console.log("maxHight=",maxHight);
      defd.forEach(function (v, i) {
        //用量计算
        let lessuse = maxHight * 0.02;
        if (usd[i] == 0 || usd[i] == "--" || usd[i] === undefined || usd[i] === null) {
          used.push(0);
        } else if (v == 0 || v == "--" || v === undefined || v === null) {
          used.push(usd[i]);
          // Math.abs()
        } else {
          // console.log("usd[i] - lessuse",usd[i] - lessuse,"Math.abs(v - lessuse)",Math.abs(v - lessuse))
          // used.push(usd[i] <= v ? ((usd[i] - lessuse)>=0?(usd[i] - lessuse):usd[i]) : Math.abs(v - lessuse));//为了达到展示效果，实际能耗不能按实际值展示
          used.push(usd[i] <= v ? ((usd[i] - lessuse) >= 0 ? usd[i] : (usd[i] > 0) ? lessuse : 0) : Math.abs(v - lessuse));//为了达到展示效果，实际能耗不能按实际值展示
        }
        //定额遮挡数据计算
        let hide = maxHight * 0.01;
        if (v == 0 || v === undefined || v === null) {
          vldefd.push(0)
          hidedef.push(0);
        } else if (v == "--") {
          vldefd.push('--')
          hidedef.push(0);
        } else {
          vldefd.push(hide)

          if (usd[i] == 0 || usd[i] == "--") {
            hidedef.push(v);
          } else {
            hidedef.push(Math.abs(parseInt(v - hide)));
          }
        }
        //超额数据计算
        if ((v == 0 || v === undefined || v === null) && (usd[i] !== "--" || usd[i] == 0)) {//定额和实际能耗都为0，超定额也为0
          overhight.push(0)
        } else if (v == '--' || usd[i] == "--") {
          overhight.push('--')
        } else {
          overhight.push(usd[i] > v ? usd[i] - v : "0")
        }
      });
      console.log('used：', used)
      data['used'] = used;
      data['def'] = vldefd;
      data['hidedef'] = hidedef;
      data['overhight'] = overhight;
      this.option.tooltip['formatter'] = function (params) {//鼠标移动到该柱形图就会触发该方法
        let index = params[0].dataIndex;
        let usdParam = ((usd[index] !== undefined && usd[index] !== null && usd[index] !== "--" && usd[index] != "") ? parseInt(usd[index]) : "--");//实际能耗
        let defParam = (defd[index] !== undefined && defd[index] !== null && defd[index] !== "--" && defd[index] != "") ? parseInt(defd[index]) : "--";//定额
        // console.log("实际能耗及定额分别为",usd[index],defd[index])
        // console.log("params=", params)
        let sty = '<span style=\"margin-right:5px;border-radius:50%;display: inline-block;width: 10px;height: 10px;background: '
        let param_0 = params[0] !== undefined ? params[0] : "";
        let param_1 = params[1] !== undefined ? params[1] : "";
        let param_2 = params[2] !== undefined ? params[2] : "";
        let param_3 = params[3] !== undefined ? params[3] : "";

        /* let tip = (param_0 != "" ? params[0].name : "") + '<br/> ' + '<span style="margin-right:5px;border-radius:50%;display: inline-block;width: 10px;height: 10px;background: '
             + (param_3 != "" ? params[3].color.colorStops[0].color : "") + '"></span>' + (param_3 != "" ? params[3].seriesName : "") + ' : ';*/
        let tip = (param_0 != "" ? params[0].name : "") + '<br/> ';
        // + (param_3 != "" ? params[3].color.colorStops[0].color : "") + '"></span>' + (param_3 != "" ? params[3].seriesName : "") + ' : ';
        //实际能耗/定额2/定额/超定额
        if (params) {
          let len = params.length;//数组长度
          // console.log(params)
          for (let i = 0; i < len; i++) {
            let arr = params[i];
            let name = arr.seriesName;
            if (name === "超定额") {
              // if (arr.value == 0) {
              //   tip += sty + arr.color.colorStops[0].color + '"></span>' + arr.seriesName + ' : ' + '--' + '<br/> ';
              // } else {
              tip += sty + arr.color.colorStops[0].color + '"></span>' + arr.seriesName + ' : ' + arr.value + '<br/> ';
              // tip += (param_3 != "" ? params[3].value + '<br/> ' : "");//超能耗
              // }
            } else if (name === "定额") {
              if (arr.value == 0) {
                tip += sty + arr.color + '"></span>' + arr.seriesName + ' : ' + arr.value + '<br/> ';//定额
              } else {
                tip += sty + arr.color + '"></span>' + arr.seriesName + ' : ' + defParam + '<br/> ';//定额
              }

            } else if (name === "实际能耗") {
              if (arr.value == 0) {
                tip += sty + arr.color + '"></span>' + arr.seriesName + ' : ' + "--" + '<br/> ';
              } else {
                tip += sty + arr.color + '"></span>' + arr.seriesName + ' : ' + usdParam + '<br/> ';
              }
            }
          }
        }
        return tip;
      }
      // console.log(data, 565656)
      return data;
    },
    //渲染页面定额及用能图表
    getQuotaTabledata (resultData) {
      // console.log("柱形图1查询", resultData)
      this.option.yAxis[0].name = this.energyUnit[parseInt(this.energyType)];
      this.option.series = [{
        name: '实际能耗',
        type: 'bar',
        barWidth: '50%',
        z: 3,
        data: resultData.used,
        barGap: "-100%",
        itemStyle: {
          color: '#fec068',
          z: 2
        },
      },
      {
        name: '定额2',
        type: 'bar',
        barWidth: '50%',
        data: resultData.hidedef,
        stack: "数据1",
        itemStyle: {
          color: "rgba(0,0,0,0)",
          // color: "#0000FF",
          z: 1
        },

      },
      {
        name: '定额',
        type: 'bar',
        barWidth: '50%',
        stack: "数据1",
        data: resultData.def,
        itemStyle: {
          color: "#7D7D7D",
          // color: "#1E90FF",

        }
      },
      {
        name: '超定额',
        type: 'bar',
        barWidth: '50%',
        stack: "数据1",
        data: resultData.overhight,
        itemStyle: {
          normal: {
            z: 2,
            color: new this.$echarts.graphic.LinearGradient(
              0, 0, 0, 1, [
              { offset: 0, color: '#D94040' },
              { offset: 1, color: this.defTypeColor[parseInt(this.energyType)] }
            ]
            )
          }
        }
      }
      ]
    },
    // 获取累计能耗定额比
    async getTotalEnergyConsumeQuota () {
      let res = await getTotalEnergyConsumeQuota(this.searchFile);
      if (res.code === 200) {
        if (res.data && res.data.array && res.data.array.length > 0) {
          this.plotData.yearTotalQuota = res.data.array[0].totalQuota;
          this.plotData.threoryQuota = res.data.array[1].curTotalQuota;
          this.plotData.totalEnergy = res.data.array[2].curTotalUsed;
        }
      } else {
        console.log(res.msg)
      }
    },
    // 获取门店详情信息
    async getQuotaDetail () {
      let res = await getQuotaDetail(this.searchFile);
      if (res.code === 200) {
        if (res.data) {
          this.linkRelativeRatio = res.data.linkRatioFlag
          this.yearOverYear = res.data.yearOYearFlag
          for (const key in res.data) {
            let obj = {};
            if (key === 'quota') {//定额
              obj.itemName = this.energyType == '01' ? '定额(kWh)' : '定额(m³)';
              this.handleDetail(res.data[key], obj)
              this.tableData.tData.splice(0, 1, obj)
            } else if (key === 'used') {//实际能耗
              obj.itemName = this.energyType == '01' ? '实际能耗(kWh)' : '实际能耗(m³)';
              this.handleDetail(res.data[key], obj)
              this.tableData.tData[1] = obj
            } else if (key === 'overQuota') {
              obj.itemName = this.energyType == '01' ? '超定额(kWh)' : '超定额(m³)';
              this.handleDetail(res.data[key], obj)
              this.tableData.tData[2] = obj
            } else if (key === 'overQuotaPercent') {
              obj.itemName = '超定额百分比';
              this.handleDetail(res.data[key], obj)
              this.tableData.tData[3] = obj
            } else if (key === "yearOYear") {
              obj.itemName = '去年同比';
              this.handleDetail(res.data[key], obj)
              this.tableData.tData[4] = obj
            } else if (key === 'linkRatio') {
              obj.itemName = '环比';
              this.handleDetail(res.data[key], obj)
              this.tableData.tData[5] = obj
            }
          }
        }
      }
    },
    handleDetail (arr, obj) {
      arr.forEach((item, i) => {
        if (i !== 0) {
          obj[i] = arr[i]
        }

      })
    },
    setQuota () {
      this.showQuatoSetting = true;
    },
    isHide () {
      this.showQuatoSetting = false;
      this.getYearQuota();
      this.getTotalEnergyConsumeQuota();
      this.getQuotaDetail()
    },
    // 导出定额详情
    exportQuotaDetail () {
      location.href = `${energyDetails.exportQuotaDetail}?token=${localStorage.getItem('$token_info')}&&year=${this.year}&&energyType=${this.energyType}&&shopNumber=${this.searchFile.shopNumber}`
    }
  }
};
</script>

<style lang="scss" scoped>
.p-container {
  overflow: auto;
  .quato-manage {
    width: 100%;
    height: 100%;
    .u-title-input-group {
      vertical-align: top;
    }
    .input-container {
      .date-select {
        width: 94px;
      }
      /deep/ .el-select .el-input__inner {
        border: 1px solid #ccc;
        border-radius: 2px !important;
      }
      /deep/ .el-button--small.is-round {
        padding: 9px 15px;
        border: 1px solid #666;
        color: #fff;
      }
    }
    .quato-chart {
      width: 100%;
      height: 380px;
      .v-charts {
        width: calc(100% - 530px);
        height: 380px;
      }
      .right-box {
        width: 520px;
        height: 100%;
      }
    }
    .quato-detail {
      width: 100%;
      height: 290px;
      margin-top: 5px;
      .titleAndExport {
        width: 100%;
        height: 26px;
        line-height: 26px;
        box-sizing: border-box;
        padding-left: 15px;
        margin-bottom: 10px;
        border-left: 3px solid #1980be;
        color: #1980be;
        .title {
          color: #1980be;
          font-size: 16px;
          font-weight: 600;
          margin-right: 10px;
          vertical-align: middle;
        }
      }
      /deep/ .el-table .cell {
        padding: 0px;
      }
    }
  }
}
</style>



