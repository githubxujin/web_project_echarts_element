<template>
  <div class="opration-total p-container">
    <div class="sub-nav single">
      <div class="u-line-block" ref="chartsDiv">
        <div class="u-layout-search pb0">
          <div class="u-layout-left-item">
            <div class="title-input-group u-title-input-group">
              <datePick v-model="checkTime" title="时间筛选" :defaultStartTime="defaultStartTime"></datePick>
            </div>
            <div class="title-input-group u-title-input-group pt10">
              <el-button
                type="primary"
                icon="el-icon-search"
                round
                :loading="btnTimeLoading"
                @click="onRepairSearch"
              >查询</el-button>
            </div>
          </div>
        </div>
        <div class="u-layout-charts fl">
          <MyEcharts
            @eclick="eclick"
            :id="'timeBar'"
            :height="chartHeight"
            width="70%"
            :option="repiarBarOption"
            :loading="timeBarLoading"
          />
          <MyEcharts
            :id="'timePie'"
            :height="chartHeight"
            :style="{width: '30%'}"
            :option="timePieOption"
            :loading="timePieLoading"
          />
          <div class="bottom-title-left">{{checkTimeShow.start}}~{{checkTimeShow.end}}各系统维修工单统计</div>
          <div class="bottom-title-right">{{checkTimeShow.start}}~{{checkTimeShow.end}}各系统维修工单占比</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import datePick from '@/components/timerange/separateTime';
import MyEcharts from '@/components/echarts/index' // echarts
import { BarOption, PieOption, HourDayMonthYear, getStackBarSeriesData, getPieSeriesData } from './options';
import utils from '@/utils/utils';
import datetimeUtils from '@/utils/datetime-utils.js';
import { getBillCharts } from '@/services/operation.js';
import { getAlarmStatisticListByTime } from '@/services/safety';
export default {
  components: {
    datePick,
    MyEcharts
  },
  data () {
    return {
      activeName: 'default',
      dateOptionData: HourDayMonthYear,
      timeType: 1, //日
      btnTimeLoading: false,
      timeBarLoading: true,
      timePieLoading: true,
      checkTime: {},
      checkTimeShow: {},//展示用
      checkTimeSysShow: {},//展示用
      chartHeight: '200px',
      repiarBarOption: utils.deepCopy(BarOption),
      timePieOption: utils.deepCopy(PieOption),
      defaultStartTime: datetimeUtils.getPreDate(7)
    }
  },
  computed: {
    shopNumber () {
      return this.$store.getters.shopNumber;
    }
  },
  created () {
    this.$common.updateLoadingStatus(true);
  },
  mounted () {
    this.$common.initChartHeight(this, 120);
    this.onRepairSearch();
  },
  methods: {
    //控制时间chart的loading
    ctrlTimeLoading (val) {
      this.btnTimeLoading = val;
      this.timeBarLoading = val;
      this.timePieLoading = val;
    },
    //关闭时间模块Loading
    closeTimeLoading () {
      this.$common.updateLoadingStatus(false);
      this.ctrlTimeLoading(false);
    },
    //时间查询
    onRepairSearch () {
      this.ctrlTimeLoading(true);
      this.checkTimeShow = utils.deepCopy(this.checkTime);
      getBillCharts({
        startTime: this.checkTime.start, endTime: this.checkTime.end, shopNumber: this.shopNumber
      }).then((res) => {
        if (res.data) {
          let optons = Object.assign({}, this.repiarBarOption)
          optons.legend.data = res.data.legendData;
          let colors = ['#EE6E6D', '#FEC069', '#5CBDF0', '#67CC80', '#E8BF5E', '#FEC069', '#5CBDF0', '#67CC80'];
          optons.color = colors;
          optons.xAxis[0].data = res.data.xAxisData;
          optons.series = getStackBarSeriesData(res.data.columnar_seriesData, '维修');
          console.log('optons', optons)
          this.repiarBarOption = optons;

          let pieOption = Object.assign({}, this.timePieOption);
          pieOption.legend.data = res.data.legendData;
          pieOption.color = colors;
          pieOption.series[0].data = res.data.pie_seriesData;
          this.timePieOption = pieOption;
        }
        console.log('res', res);
        this.closeTimeLoading();
      }).catch(error => {
        this.closeTimeLoading();
      })
    },
    //时间选择
    checkedTime (res) {
      console.log('checkedTime:', res);
    },
    eclick (params) {
      console.log('params', params)
    }
  }
}
</script>
<style lang="scss">
.opration-total {
  .p-container {
    .date-picker {
      width: 320px;
    }
  }
  .u-layout-search {
    display: block;
  }
}
</style>

<style lang="scss" scoped>
@import './index.scss';
</style>
