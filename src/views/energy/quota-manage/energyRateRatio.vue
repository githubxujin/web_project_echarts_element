<template>
  <div class="energy-ratio">
    <div class="ratio-title">累计能耗与定额比</div>

    <div class="CylindricalPlotBox">
      <div class="m-items" v-show="isEmpty">
        <!--数值-->
        <div class="box-line" :style="{height:'60%'}" ref="boxline">
          <div style="left: 0px" class="left-items">
            <div class="top-text" :style="topVal">
              <p>当前理论定额</p>
              <p style="color:#1881BF">{{theoryQuota}}kWh</p>
            </div>
            <!-- <p class="top-text" :style="topVal">
              当前理论定额
              <span>{{theoryQuota}}kWh</span>
            </p>-->
          </div>
          <div style="right: 8px;max-width:190px;" class="right-items">
            <!-- <p style="text-align: left" class="m-text" :style="textStyle">
              <span style="color: #1881BF">
                <span v-html="totalEnergy>10000?totalEnergyRate+'万':totalEnergy"></span>
              </span>
            </p>-->
            <p
              style="text-align: left;color: #E16264"
              class="top-text"
              v-if="exceed>0"
              :style="topOverObj"
            >已超出定额{{exceed}}%</p>
            <!-- <p style="text-align: left" class="bottom-text">当前累计总能耗{{unit}}</p> -->
          </div>
        </div>
        <div class="total-quota">
          <span style="display:block;">年总定额</span>
          <span>{{quotaTotal}}kWh</span>
        </div>
        <div class="thoery-quota" :style="thoeryStyle">
          <span style="display:block;">当前累计总能耗</span>
          <span v-html="totalEnergy>10000?totalEnergyRate+'万kWh':totalEnergy+'kWh'"></span>
        </div>
        <!--柱形图-->
        <div class="m-items-box">
          <!--理论定额-->
          <div class="fl def-quota">
            <div class="data-position" :style="quotaMapStyle">
              <div class="position-box"></div>
            </div>
          </div>
          <!--年总定额柱形图-->
          <div class="newSum_box">
            <div class="data-position" :style="totalQuotaMapStyle">
              <div class="position-box"></div>
            </div>
          </div>
          <!--累计总能耗-->
          <div class="fr def-quota">
            <div class="data-position" :style="expendStyle">
              <div class="position-box" :style="positionBoxStyle"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-data" v-show="!isEmpty">暂无数据</div>
      <div class="bottomDate">({{date}})</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    plotData: {//关于定额的所有数据
      type: Object
    },
    energyType: {
      type: String,
      default: '01'
    },
    year: {
      type: Number,
      default: 2019
    }
  },
  data () {
    return {
      date: "",//柱形图下面日期
      quotaTotal: 3254000,//年总定额
      quotaTotalRate: '',
      theoryQuota: 0,//理论定额
      theoryQuotaRate: '',//理论定额
      totalEnergy: 150000,//累计总能耗
      totalEnergyRate: '',//累计总能耗
      exceed: 0,//超出定额
      unit: "kWh",//单位
      isEmpty: true,
      textStyle: {//数值样式
        lineHeight: "0px",
        height: ""
      },
      quotaMapStyle: {//定额柱形图样式
        height: "60%",
        maxHeight: '200px'
      },
      totalQuotaMapStyle: {//年总定额图样式
        height: "100%"
      },
      expendStyle: {//累计总能耗样式
        height: "100px",
        maxHeight: "220px",
        // minHeight: "5px"
      },
      positionBoxStyle: {//超出定额渐变色
        background: "linear-gradient(#d74242, #44d1eb 0%, #22a1c9)"
      },
      thoeryStyle: {
        top: "120px",
      }
    }
  },
  computed: {
    quotaRight () {
      let length = this.quotaTotal.toString().length - 6 >= 0 ?
        (this.quotaTotal.toString().length - 6) : 0;
      return length * 10 + 'px';
    },
    topVal () {
      return { top: this.quotaTotal > 0 ? '-36px' : '-38px', lineHeight: '20px', textAlign: 'left' };
    },
    topOverObj () {
      return { top: this.totalEnergy > 0 ? '-32px' : '-7px' };
    }
  },
  mounted () {
    this.showData()
    this.init()
  },
  methods: {
    showData () {
      let date = new Date().getFullYear();
      let startTime = new Date().getFullYear() + '-01-01';
      this.quotaTotal = this.plotData.yearTotalQuota > 10000 ? (this.plotData.yearTotalQuota > 100000000 ? (this.plotData.yearTotalQuota / 100000000).toFixed(2) + '亿' : (this.plotData.yearTotalQuota / 10000).toFixed(2) + '万') : this.plotData.yearTotalQuota;//本月总定额
      this.theoryQuota = this.plotData.threoryQuota > 10000 ? (this.plotData.threoryQuota > 100000000 ? (this.plotData.threoryQuota / 100000000).toFixed(2) + '亿' : (this.plotData.threoryQuota / 10000).toFixed(2) + '万') : this.plotData.threoryQuota;//理论定额
      this.totalEnergy = this.plotData.totalEnergy;//累计总能耗
      this.totalEnergyRate = this.plotData.totalEnergy > 10000 ? (this.plotData.totalEnergy / 10000).toFixed(2) : this.plotData.totalEnergy;//累计总能耗
      this.isEmpty = this.quotaTotal || this.theoryQuota || this.totalEnergy;

      // this.quotaTotal = this.quotaTotal //年总定额
      // this.totalEnergy = this.totalEnergy //累计总能耗
      // this.theoryQuota = this.theoryQuota//理论定额
      this.date = this.year === date ? `${startTime}至今` : `${this.year}-01-01~${this.year}-12-31`
    },
    init () {
      this.totalQuotaMapStyle.height = this.plotData.yearTotalQuota === 0 ? (0 + "%") : (100 + "%");//年总定额为0时不显示，否则显示100%
      let quotaNum = (parseInt(this.plotData.threoryQuota) / parseInt(this.plotData.yearTotalQuota)) * 100;//  理论定额/年总定额
      quotaNum = quotaNum && quotaNum != 'Infinity' ? quotaNum : (parseInt(this.plotData.yearTotalQuota) === 0 ? this.plotData.threoryQuota : 0);//避免quotaNum=NaN
      this.$refs.boxline.style.height = quotaNum ? quotaNum + "%" : 25 + '%';
      this.$refs.boxline.style.maxHeight = '200px';
      this.quotaMapStyle.height = quotaNum + "%";//定额柱形图样式
      this.textStyle.position = 'relative'
      console.log(quotaNum, 456456456456)
      if (quotaNum <= 25) {
        this.textStyle.bottom = 40 + 'px'
        // this.textStyle.top = 14 + 'px'
      } else if (quotaNum > 25) {
        this.textStyle.top = 15 + 'px'
      }
      let multiple = 0;
      if (parseInt(this.plotData.yearTotalQuota) === 0 && parseInt(this.totalEnergy) !== 0) {//如果年总定额为0且累计总能耗不为0就显示100%高度
        multiple = 100;
      } else {
        multiple = parseInt(this.plotData.yearTotalQuota) === 0 ? 0 : ((parseInt(this.totalEnergy) / parseInt(this.plotData.yearTotalQuota)) * 100);//  累计总能耗/总定额
      }
      multiple = multiple ? multiple : (parseInt(this.plotData.yearTotalQuota) === 0 ? this.totalEnergy : 0);
      //超出定额
      if (multiple > quotaNum && parseInt(this.plotData.threoryQuota) !== 0) {
        let multiple1 = (parseInt(this.totalEnergy) / parseInt(this.plotData.threoryQuota)) * 100;//  累计总能耗/理论定额
        let difference = parseInt(multiple1 - 100) > 100 ? parseInt(multiple1 - 100) : (multiple1 - 100).toFixed(2);
        this.exceed = difference;
        this.expendStyle.height = multiple * 2 < 220 ? multiple * 2 + 'px' : 220 + 'px';
        this.thoeryStyle.top = multiple * 2 < 200 ? (70 - multiple) + 'px' : -61 + 'px'
        let gap = (1 - ((quotaNum * 2) / parseInt(this.expendStyle.height))) * 100;
        this.positionBoxStyle.background = "linear-gradient(#d74242, #44d1eb " + gap + "%, #22a1c9)";
      } else {
        this.expendStyle.height = multiple + "%";
        this.thoeryStyle.top = 150 - (multiple * 2) + 'px'
        this.exceed = 0;//不显示超定额
        this.positionBoxStyle.background = "linear-gradient(#d74242, #44d1eb 0%, #22a1c9)";
      }
    }
  },
  watch: {
    energyType (val) {
      this.unit = val === '01' ? 'kWh' : 'm³'
    },
    plotData: {
      handler: function (newValue, oldValue) {
        this.showData()
        this.init()
      },
      deep: true
    },
    year (val) {
      this.showData()
      this.init()
    }
  }

}
</script>
<style lang="scss" scoped>
@import "./energyRateRatio.scss";
.energy-ratio {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px 10px;
  .ratio-title {
    color: #1980be;
    padding: 0px 20px;
    border-left: 3px solid #1980be;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }
  .total-quota {
    width: 125px;
    text-align: right;
    line-height: 20px;
    font-weight: 600;
    position: absolute;
    top: -61px;
    left: 106px;
  }
  .thoery-quota {
    line-height: 20px;
    font-weight: 600;
    position: absolute;
    text-align: left;
    right: 136px;
  }
  .empty-data {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>


