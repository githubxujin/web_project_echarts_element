<template>
  <div class="energy-ratio">
    <div class="CylindricalPlotBox" style="height:306px;">
      <div class="m-items">
        <!--数值-->
        <div class="box-line" :style="{height:'60%'}" ref="boxline">
          <div style="left: 0px" class="left-items">
            <p class="m-text" :style="textStyle" ref="mtext">
              <span style="position: relative">{{quotaTotal}}</span>
            </p>
            <p class="top-text" :style="topVal">
              当前理论定额
              <span style="color:#1881BF">{{theoryQuota}} {{unit}}</span>
            </p>
            <p class="bottom-text">本月总定额({{unit}})</p>
          </div>
          <div style="right: 10px;max-width:190px;" class="right-items">
            <p style="text-align: left" class="m-text" :style="textStyle">
              <span style="color: #1881BF">{{totalEnergy}}</span>
            </p>
            <p
              style="text-align: left;color: #E16264"
              class="top-text"
              v-if="exceed>0"
              :style="topOverObj"
            >已超出定额{{exceed}}%</p>
            <p style="text-align: left" class="bottom-text">本月累计用电总能耗({{unit}})</p>
          </div>
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
  },
  data () {
    return {
      date: "",//柱形图下面日期
      quotaTotal: 0,//年总定额
      //   quotaTotalRate: '',
      theoryQuota: 0,//理论定额
      //   theoryQuotaRate: '',//理论定额
      totalEnergy: 0,//累计总能耗
      //   totalEnergyRate: '',//累计总能耗
      exceed: 0,//超出定额
      unit: "kWh",//单位
      textStyle: {//数值样式
        lineHeight: "0px",
        height: ""
      },
      quotaMapStyle: {//定额柱形图样式
        height: "60%",
        maxHeight: "200px"
      },
      totalQuotaMapStyle: {//年总定额图样式
        height: "100%"
      },
      expendStyle: {//累计总能耗样式
        height: "100px",
        maxHeight: "230px"
      },
      positionBoxStyle: {//超出定额渐变色
        background: "linear-gradient(#d74242, #44d1eb 0%, #22a1c9)"
      },
    }
  },
  created () {
    // this.init()
  },
  mounted () {
    this.init()
  },
  computed: {
    quotaRight () {
      let length = this.quotaTotal.toString().length - 6 >= 0 ?
        (this.quotaTotal.toString().length - 6) : 0;
      return length * 20 + 'px';
    },
    topVal () {
      return { top: this.quotaTotal >= 0 ? '-32px' : '-7px' };
    },
    topOverObj () {
      return { top: this.totalEnergy >= 0 ? '-32px' : '-7px' };
    }
  },
  watch: {
    plotData: {
      handler: function (newValue, oldValue) {
        this.showData()
        this.init()
      },
      deep: true
    }
  },
  methods: {
    showData () {
      this.quotaTotal = this.plotData.quotaTotal;//本月总定额
      this.theoryQuota = this.plotData.quota;//理论定额
      this.totalEnergy = this.plotData.expend;//累计总能耗
      this.date = this.plotData.date
    },
    init () {
      this.totalQuotaMapStyle.height = this.quotaTotal === 0 ? (0 + "%") : (100 + "%");//年总定额为0时不显示，否则显示100%
      let quotaNum = (parseInt(this.theoryQuota) / parseInt(this.quotaTotal)) * 100;//  理论定额/年总定额
      quotaNum = quotaNum ? quotaNum : (parseInt(this.quotaTotal) === 0 ? this.theoryQuota : 0);//避免quotaNum=NaN
      this.$refs.boxline.style.height = quotaNum ? quotaNum + "%" : 25 + '%';
      this.$refs.boxline.style.maxHeight = '200px';
      this.quotaMapStyle.height = quotaNum + "%";//定额柱形图样式
      // this.textStyle.height = quotaNum * 2 + "px";
      this.textStyle.position = 'relative';
      // if (quotaNum >= 10 && quotaNum < 25 || quotaNum > 0 && quotaNum < 10) {
      //   this.textStyle.bottom = 40 + 'px'
      // } else if (quotaNum >= 25 || quotaNum == 0) {
      //   this.textStyle.top = 14 + 'px'
      // }
      if (quotaNum < 50) {
        this.textStyle.top = 14 + 'px'
      } else {
        this.textStyle.top = 125 + 'px'
      }
      let multiple = 0;
      if (parseInt(this.quotaTotal) === 0 && parseInt(this.totalEnergy) !== 0) {//如果年总定额为0且累计总能耗不为0就显示100%高度
        multiple = 100;
      } else {
        multiple = parseInt(this.quotaTotal) === 0 ? 0 : ((parseInt(this.totalEnergy) / parseInt(this.quotaTotal)) * 100);//  累计总能耗/总定额
      }
      multiple = multiple ? multiple : (parseInt(this.quotaTotal) === 0 ? this.totalEnergy : 0);
      //超出定额
      if (multiple > quotaNum && parseInt(this.theoryQuota) !== 0) {
        let multiple1 = (parseInt(this.totalEnergy) / parseInt(this.theoryQuota)) * 100;//  累计总能耗/理论定额
        let difference = parseInt(multiple1 - 100) > 100 ? parseInt(multiple1 - 100) : (multiple1 - 100).toFixed(2);
        this.exceed = difference;
        this.expendStyle.height = multiple * 2 < 230 ? multiple * 2 + 'px' : 230 + 'px';
        console.log(this.expendStyle.height)
        let gap = (1 - ((quotaNum * 2) / parseInt(this.expendStyle.height))) * 100;
        this.positionBoxStyle.background = "linear-gradient(#d74242, #44d1eb " + gap + "%, #22a1c9)";
      } else {
        this.expendStyle.height = multiple + "%";
        this.exceed = 0;//不显示超定额
        this.positionBoxStyle.background = "linear-gradient(#d74242, #44d1eb 0%, #22a1c9)";
      }
    }
  },

}
</script>
<style lang="scss" scoped>
@import "../quota-manage/energyRateRatio.scss";
.energy-ratio {
  width: 100%;
  height: 100%;
  min-width: 500px;
  max-width: 550px;
  margin: 0 auto;
  .ratio-title {
    color: #1980be;
    padding: 0px 20px;
    border-left: 3px solid #1980be;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }
}
</style>


