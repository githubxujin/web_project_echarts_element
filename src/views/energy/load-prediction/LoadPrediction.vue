<template>
  <div class="load-prediction">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group" style="vertical-align: middle;">
            <div class="input-container">
              <tab-btn :dataArr="queryData" :value="queryType" @change="getQueryType"></tab-btn>
            </div>
          </div>

          <div class="title-input-group u-title-input-group">
            <p class="text">优化策略：</p>
            <div class="input-container">
              <el-select v-model="strategy" placeholder="请选择">
                <el-option
                  v-for="item in strategyType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @change="changeStrategy"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 预测曲线 -->
    <div class="line-charts">
      <v-Chart :option="echartOption" id="predictionChart" :style="{height:'360px'}"></v-Chart>
    </div>
    <!-- 本月能耗与定额比，下月能耗预测 -->
    <div class="energy-prediction clear">
      <div class="month-quota-rate fl">
        <div class="prediction-title">本月能耗与定额比</div>
        <cylindrical-plot :plotData="plotData"></cylindrical-plot>
      </div>
      <div class="next-month-prediction fr">
        <div class="prediction-title">下月能耗预测</div>
        <div class="prediction-detail">
          <div class="detail-item">
            <div class="item-mark">
              <i class="iconfont icon-dian"></i>
            </div>
            <div class="item-eleinfo">
              <p>{{nextMonth}}用电总量/费用</p>
              <p>
                <span>{{predictData.elec.forestEnergyTotalNextMonth}}</span> kWh / ￥
                <span>{{predictData.elec.forestEnergyTotalFeeNextMonth}}</span> 元
              </p>
            </div>
          </div>
          <div class="detail-item">
            <div class="item-mark water">
              <i class="iconfont icon-shui water"></i>
            </div>
            <div class="item-eleinfo">
              <p>{{nextMonth}}用水总量/费用</p>
              <p>
                <span>{{predictData.water.forestEnergyTotalNextMonth}}</span> m³ / ￥
                <span>{{predictData.water.forestEnergyTotalFeeNextMonth}}</span> 元
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tabBtn from '@/components/tabs/Tabs.vue';
import vChart from '@/components/echarts/index';
import { echartOption } from './loadPrediction.js';
import cylindricalPlot from './CylindricalPlot'
import { getPredictAnalyze, getCurMonthEnergyQuotaRate, energyPredict } from '@/services/energy'
export default {
  components: { tabBtn, vChart, cylindricalPlot },
  data () {
    return {
      queryType: 1,
      strategy: 1,
      queryData: [
        { label: '今天', value: 1 },
        { label: '未来两天', value: 2 },
        { label: '未来一周', value: 3 },
      ],
      strategyType: [
        { label: '时间序列法', value: 1 },
        { label: '数量序列法', value: 2 }
      ],
      shopNumber: '',
      searchFile: {
        queryType: 1,
        shopNumber: '',
        regionId: '440300',
        strategy: 1
      },
      echartOption: echartOption,
      plotData: {},
      predictData: {
        elec: {},
        water: {}
      },
      nextMonth: '',
    }
  },
  created () {
    this.initParam()
    this.getCurMonthEnergyQuotaRate()
    this.energyPredict()
  },
  mounted () {
    this.getForecast()
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
    }
  },
  watch: {
    searchFile: {
      handler: function (newValue, oldValue) {
        this.getForecast()
      },
      deep: true
    },
    shopNumbers (val) {
      this.searchFile.shopNumber = val;
      this.shopNumber = val;
      this.getForecast()
      this.getCurMonthEnergyQuotaRate()
      this.energyPredict()
    },
    curShop: {
      handler: function (val, old) {
        this.searchFile.shopNumber = val.shopNumber;
        this.shopNumber = val.shopNumber;
        this.getForecast()
        this.getCurMonthEnergyQuotaRate()
        this.energyPredict()
      },
      deep: true
    },
  },
  methods: {
    initParam () {
      this.shopNumber = this.roleType == 2 ? this.shopNumbers : this.curShop.shopNumber;
      this.searchFile.shopNumber = this.shopNumber;
      let time = new Date().getMonth() + 1;
      this.nextMonth = time == 12 ? 1 + '月' : (time + 1) + '月';
    },
    // 切换时间粒度
    getQueryType (val) {
      this.queryType = val;
      this.searchFile.queryType = val;
    },
    // 更改优化策略
    changeStrategy (val) {
      this.strategy = val;
      this.searchFile.strategy = val;
    },
    // 获取预测曲线
    async getForecast () {
      let res = await getPredictAnalyze(this.searchFile);
      if (res.code === 200) {
        this.echartOption = echartOption;
        let times = [];
        let actual = [];
        let forecast = [];
        let optimize = [];
        if (res.data && res.data.array.length > 0) {
          for (let item of res.data.array) {
            times.push(item.time.slice(2, 13));
            (item.actual || item.actual === 0) && actual.push(this.fromatNumber(item.actual));
            forecast.push(this.fromatNumber(item.predict));
            optimize.push(this.fromatNumber(item.optimize));
          }
          this.timeName = `${times[0]}时 至${times[times.length - 1]}时 电耗预测分析`;
        }
        this.echartOption.xAxis[0].data = times;
        this.echartOption.series[0].data = actual;
        this.echartOption.series[1].data = forecast;
        this.echartOption.series[2].data = optimize;
        // console.log(this.echartOption.series)
      }
    },
    fromatNumber (val = 0) {
      if (!~~val) return val;
      return val <= 100 ? Number(val).toFixed(2) : Number(val).toFixed(0)
    },
    // 本月能耗与定额比
    async getCurMonthEnergyQuotaRate () {
      let param = {
        energyType: '01',
        shopNumber: this.shopNumber,
        subCode: '01000'
      }
      let res = await getCurMonthEnergyQuotaRate(param)
      if (res.code == 200) {
        this.plotData = res.data ? res.data : {}
      } else {
        console.log(res.msg)
      }
    },
    // 下月能耗预测
    async energyPredict () {
      let res = await energyPredict({ shopNumber: this.shopNumber })
      if (res.code == 200) {
        if (res.data) {
          this.predictData.elec = res.data.elec.nextMonth;
          this.predictData.water = res.data.water.nextMonth;
          console.log(this.predictData)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.load-prediction {
  width: 100%;
  height: 100%;
  max-height: 762px;
  overflow: hidden;
  /deep/ .u-title-input-group .el-select .el-input__inner {
    width: 115px;
    border: 1px solid #ccc;
    border-radius: 2px !important;
  }
  .line-charts {
    width: 100%;
    height: 360px;
  }
  .energy-prediction {
    width: 100%;
    height: 330px;
    .month-quota-rate,
    .next-month-prediction {
      width: 50%;
      height: 100%;
      padding: 0px 30px;
      box-sizing: border-box;
    }
    .prediction-title {
      color: #1980be;
      padding: 0px 20px;
      border-left: 3px solid #1980be;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }
    .next-month-prediction {
      .prediction-detail {
        height: 306px;
        width: 100%;
        padding: 0px 20%;
        .detail-item {
          height: 50%;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          .item-mark {
            text-align: center;
            height: 60px;
            width: 60px;
            line-height: 60px;
            border-radius: 50%;
            border: 1px solid #fec16b;
            position: absolute;
            top: 40px;
            &.water {
              border: 1px solid #3abede;
            }
            i {
              color: #fec16b;
              font-size: 30px;
              &.water {
                color: #3abede;
              }
            }
          }
          .item-eleinfo {
            position: absolute;
            top: 40px;
            left: 100px;
            height: 60px;
            line-height: 30px;
            p {
              letter-spacing: 2px;
              font-size: 16px;
              color: #616263;
              &:last-child {
                font-size: 18px;
                span {
                  font-size: 20px;
                  font-weight: 600;
                  color: #344047;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>



