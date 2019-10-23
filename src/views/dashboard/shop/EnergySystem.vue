<template>
  <div
    class="energySystem"
    v-loading="loading"
    :element-loading-text="$baseConfig.loading.text"
    :element-loading-spinner="$baseConfig.loading.spinner"
    :element-loading-background="$baseConfig.loading.background"
  >
    <span class="border left-top" />
    <span class="border right-top" />
    <span class="border left-bottom" />
    <span class="border right-bottom" />
    <card-head :showError="false" :title="title" @goToPage="goToPage"></card-head>
    <div class="today-energy">
      <div class="title">
        <span :class="{active:todayTabInd===1}" @click="onTab(1)">今日能耗</span>
        <span class="separate">|</span>
        <span :class="{active:todayTabInd===2}" @click="onTab(2)">今日费用</span>
      </div>
      <div class="chart" @click="goToPage('day')">
        <v-chart :option="todayOption" id="todayEnergy" />
      </div>
      <p>{{todayEnergyTitle}}</p>
    </div>
    <div class="month-energy">
      <div class="title">
        <span :class="{active:monthTabInd===1}" @click="changeTab(1)">本月能耗</span>
        <!-- <span class="separate">|</span>
        <span :class="{active:monthTabInd===2}" @click="changeTab(2)">本月费用</span>-->
      </div>
      <div class="chart" @click="goToPage('month')">
        <v-chart :option="monthOption" id="monthEnergy" />
      </div>
      <p>{{monthEnergyTitle}}</p>
    </div>
  </div>
</template>
<script>
import cardHead from './ShopCartHead';
import vChart from '@/components/echarts/index';
import { option } from './EnergySystem';
import utils from '@/utils/utils.js';
import { getEnergyConsumeAndCost } from '@/services/dashboard'
export default {
  components: { cardHead, vChart },
  props: {
    shopNumber: {
      type: String
    },
    itemData: {
      type: Object
    }
  },
  data () {
    return {
      title: '能管系统',
      todayTabInd: 2,
      monthTabInd: 1,
      todayOption: JSON.parse(JSON.stringify(option)),
      monthOption: JSON.parse(JSON.stringify(option)),
      monthEnergyTitle: '',
      todayEnergyTitle: '',
      shopCode: this.shopNumber,
      energyDataBase: null,
      loading: true,
    }
  },
  created () {
    this.getEnergyConsumeAndCost();
  },
  watch: {
    shopNumber (val) {
      if (val) {
        this.shopCode = val;
        this.getEnergyConsumeAndCost();
      }
    },
    tabInd (newValue, oldValue) {
      this.getTodayEnergy()
    },
    itemData: {
      handler: function (newVal) {
        if (newVal) {
          this.energyDataBase = newVal.data;
          this.getTodayEnergy();
          this.getMonthEnergy();
        }
      },
      deep: true
    },
  },
  methods: {
    onTab (type) {
      this.todayTabInd = type;
      this.getTodayEnergy();
    },
    changeTab (type) {
      this.monthTabInd = type
      this.getMonthEnergy();
    },
    initOption () {
      this.getEnergyConsumeAndCost();
    },
    getEnergyConsumeAndCost () {
      getEnergyConsumeAndCost({ shopNumber: this.shopCode }).then(res => {
        this.energyDataBase = res.data || {};
        this.loading = false;
      }).then(res => {
        this.getTodayEnergy();
        this.getMonthEnergy();
      })
    },
    //  请求今日能耗数据 (1:能耗；2:费用)
    getTodayEnergy () {
      console.log('数据变化', this.todayTabInd)
      let todayData = this.energyDataBase.today;
      this.todayOption.series[0].name = this.todayTabInd == 2 ? '今日费用' : '今日能耗';
      // this.todayOption.title.text = '与昨日相比增加2%';
      this.todayOption.color = ['#b3d363', '#73c353', '#d18366'];
      if (this.todayTabInd === 1) {
        this.todayOption.series[0].data = [
          { value: todayData.lowUse, name: '低谷' },
          { value: todayData.flatUse, name: '平段' },
          { value: todayData.highUse, name: '高峰' }
        ]
      } else {
        this.todayOption.series[0].data = [
          { value: todayData.lowCost, name: '低谷' },
          { value: todayData.flatCost, name: '平段' },
          { value: todayData.highCost, name: '高峰' }
        ]
      }
      this.todayEnergyTitle = '与昨日相比增加' + (this.todayTabInd === 1 ? todayData.useLinkRatio : todayData.costLinkRatio);
      let total = this.todayTabInd === 1 ? todayData.totalUse : todayData.totalCost;

      this.todayOption.graphic.style.text = this.todayTabInd == 2 ? total + '元' : total + 'kWh';

    },
    getMonthEnergy () {
      let monthData = this.energyDataBase.month;
      this.monthOption.series[0].name = this.monthTabInd == 2 ? '本月费用' : '本月能耗';
      // this.monthOption.title.text = '与定额相比节约800kWh';
      this.monthOption.color = ['#c3c325', '#30b14c', '#01b7ed'];
      if (this.monthTabInd === 1) {
        this.monthOption.series[0].data = [
          { value: monthData.lowUse, name: '低谷' },
          { value: monthData.flatUse, name: '平段' },
          { value: monthData.highUse, name: '高峰' }
        ]
      } else {
        this.monthOption.series[0].data = [
          { value: monthData.lowCost, name: '低谷' },
          { value: monthData.flatCost, name: '平段' },
          { value: monthData.highCost, name: '高峰' }
        ]
      }

      let total = this.monthTabInd === 1 ? monthData.totalUse : monthData.totalCost;
      this.monthEnergyTitle = `与定额相比节约${this.monthTabInd === 1 ? monthData.saveEnergy + '元' : monthData.saveCost + 'kWh'}`;

      this.monthOption.graphic.style.text = (total / 10000).toFixed(2) + (this.monthTabInd == 2 ? '万元' : '万kWh');
    },
    goToPage (type) {
      this.$router.push({ path: '/energy/energy-search', name: 'energy-search', params: { referer: type } })
    }
  },
  // watch: {
  //   tabInd (newValue, oldValue) {
  //     this.getTodayEnergy()
  //   }
  // }
}
</script>
<style lang="scss" scoped>
@import "../index.scss";
.energySystem {
  width: 100%;
  height: 100%;
  color: #e8efff;
  padding: 0px 10px;
  box-sizing: border-box;
  .today-energy,
  .month-energy {
    width: 50%;
    height: calc(100% - 44px);
    text-align: center;
    padding: 10px 0px;
    box-sizing: border-box;
    .title {
      color: #8190a3;
      .separate {
        display: inline-block;
        color: #e8efff;
        margin: 0px 5px;
      }
      .active {
        color: #e8efff;
      }
    }
    .charts {
      width: 100%;
      height: 230px;
      cursor: pointer;
    }
  }
  .today-energy {
    float: left;
  }
  .month-energy {
    float: right;
  }
}
</style>


