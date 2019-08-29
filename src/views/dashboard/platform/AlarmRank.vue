<template>
  <div class="alarm-rank">
    <card-head title="待解决报警数量排名" @lookMore="lookMore()"></card-head>
    <template v-if="rankList!=null">
      <MyEcharts
        :id="'exampleId'"
        :style="{width: '100%','min-height':height}"
        :option="chartOptions"
        v-loading="loading"
        :element-loading-text="$baseConfig.loading.text"
        :element-loading-spinner="$baseConfig.loading.spinner"
        :element-loading-background="$baseConfig.loading.background"
        @eclick="eclick"
      />
    </template>
    <template v-else>
      <empty-data msg="门店运行良好，无安全隐患，请继续保持哦" :height="height"></empty-data>
    </template>
  </div>
</template>

<script>
import CardHead from './CardHead';
import MyEcharts from '@/components/echarts/index' // echarts
import utils from '@/utils/utils.js';
import { getAlarmRankList } from '../../../services/dashboard';
import EmptyData from '../../../components/form/EmptyData';
import { alarmRankOptions } from './map-options/alarm-rank-options';
export default {
  props: {
    shopNumber: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  components: {
    CardHead,
    MyEcharts,
    EmptyData
  },
  data () {
    return {
      loading: true,
      chartOptionTmpl: alarmRankOptions, //option模板
      chartOptions: {},
      rankList: []
    }
  },
  watch: {
    shopNumber: function (val) {
      // console.log('val', val)
      this.initData(val);
    }
  },
  mounted () {

  },
  methods: {
    //更新数据
    updateAlarmRankData (res) {
      let list = res.data.list;
      this.rankList = list.length == 0 ? null : list;
      // console.log('list', list)
      let shopNames = []; //门店数组
      let alarmNums = []; //报警数目数组
      list.forEach(n => {
        shopNames.push(n.shopName)
        alarmNums.push(n.total);
      });
      this.chartOptionTmpl.xAxis[0].data = shopNames;
      this.chartOptionTmpl.series[0].data = alarmNums;
      this.initCharts();
    },
    initData (shopNumber) {
      getAlarmRankList({ pageNum: 0, pageSize: 8, shopNumber: shopNumber, orderField: 'total', orderType: 'desc' }).then((res) => {
        this.updateAlarmRankData(res);
        this.loading = false;
      }).catch((error) => {
        console.log(error)
        this.loading = false;
      });
    },
    initCharts () {
      this.chartOptions = utils.chartNewLine(this.chartOptionTmpl, 4, 'xAxis');
    },
    lookMore () {
      // console.log('查看更多')
      //data-rank/index
      this.$router.push({ path: '/data-rank/alarm-level' })
    },
    //echarts点击事件
    eclick (params) {
      // console.log('params', params)
      let index = params.dataIndex;
      var curItem = this.rankList.length > 0 ? this.rankList[index] : null;
      console.log('curItem', curItem)
      if (curItem) {
        this.$store.commit('base/updateCurShop', { shopNumber: curItem.shopNumber, shopName: curItem.shopName });
        // this.$router.push({ path: '/safety/alarm/view', name: 'AlarmView', params: { referer: 'index', status: ['0', '2'] } });
        this.$common.jumpShopIndex(this, curItem.shopNumber, 'alarm-rank');
      }
      // //跳转到门店首页
      // this.$router.push({ path: '/shop-index' });
    }
  }
}
</script>

<style lang="scss" scoped>
.i-content {
  padding: 8px 18px;
}
/deep/ .u-layout-empty {
  .img,
  .info {
    color: white;
  }
}
</style>
