<template>
  <div class="energySystem">
    <span class="border left-top" />
    <span class="border right-top" />
    <span class="border left-bottom" />
    <span class="border right-bottom" />
    <card-head :showError="false" :title="title" @goToPage="goToPage"></card-head>
    <div class="today-energy">
      <div class="title">
        <span :class="{active:tabInd===1}" @click="onTab(1)">今日能耗</span>
        <span class="separate">|</span>
        <span :class="{active:tabInd===2}" @click="onTab(2)">今日费用</span>
      </div>
      <div class="chart" @click="goToPage">
        <v-chart :option="todayOption" id="todayEnergy" />
      </div>
      <p>{{todayEnergyTitle}}</p>
    </div>
    <div class="month-energy">
      <div class="title">
        <span class="active">本月能耗</span>
      </div>
      <div class="chart" @click="goToPage">
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
import { getEnergyAlarmList } from '@/services/dashboard.js'
export default {
  components: { cardHead, vChart },
  props: {
    shopNumber: {
      type: String
    },
    // itemData: {
    //   type: Object
    // }
  },
  data () {
    return {
      title: '能管系统',
      tabInd: 2,
      todayOption: utils.deepCopy(option),
      monthOption: utils.deepCopy(option),
      monthEnergyTitle: '与定额相比节约800kWh',
      todayEnergyTitle: '与昨日相比增加2%',
      shopCode: this.shopNumber
    }
  },
  created () {
    console.log(222, this.shopNumber)
    this.initOption()
  },
  watch: {
    shopNumber (val) {
      if (val) {
        this.shopCode = val;
        this.getEnergyAlarmList();
      }
    },
    itemData: {
      handler: function (val) {
        if (val) {

        }
      },
      deep: true
    }
  },
  methods: {
    onTab (num) {
      this.tabInd = num
    },
    initOption () {
      this.getTodayEnergy()
      this.getMonthEnergy()
      this.getEnergyAlarmList();
    },
    // 获取能耗信息
    getEnergyAlarmList () {
      getEnergyAlarmList({ shopNumber: this.shopCode }).then(res => {

      })
    },
    //   请求今日能耗数据
    getTodayEnergy () {
      this.todayOption.series[0].name = this.tabInd == 2 ? '今日费用' : '今日能耗';
      // this.todayOption.title.text = '与昨日相比增加2%';
      this.todayOption.color = ['#b3d363', '#73c353', '#d18366'];
      if (this.tabInd === 1) {
        this.todayOption.series[0].data = [
          { value: 435, name: '低谷' },
          { value: 700, name: '平段' },
          { value: 1350, name: '高峰' }
        ]
      } else {
        this.todayOption.series[0].data = [
          { value: 535, name: '低谷' },
          { value: 679, name: '平段' },
          { value: 1548, name: '高峰' }
        ]
      }
      let total = 0;
      this.todayOption.series[0].data.forEach(item => {
        total += item.value;
      });
      this.todayOption.graphic.style.text = this.tabInd == 2 ? total + '元' : total + 'kWh';
    },
    getMonthEnergy () {
      this.monthOption.series[0].name = '本月能耗';
      // this.monthOption.title.text = '与定额相比节约800kWh';
      this.monthOption.color = ['#c3c325', '#30b14c', '#01b7ed'];
      this.monthOption.series[0].data = [
        { value: 10000, name: '低谷' },
        { value: 20000, name: '平段' },
        { value: 35000, name: '高峰' }
      ]
      let total = 0;
      this.monthOption.series[0].data.forEach(item => {
        total += item.value;
      });
      this.monthOption.graphic.style.text = total / 10000 + '万kWh';
    },
    goToPage () {
      this.$router.push({ path: '/energy/energy-search' })
    }
  },
  watch: {
    tabInd (newValue, oldValue) {
      this.getTodayEnergy()
    }
  }
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


