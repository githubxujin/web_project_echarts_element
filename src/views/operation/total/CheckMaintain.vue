<template>
  <div class="opration-total p-container">
    <div class="sub-nav single">
      <div class="u-line-block" ref="chartsDiv">
        <div class="u-layout-search pb0">
          <div class="u-layout-left-item">
            <div class="title-input-group u-title-input-group">
              <datePick v-model="checkTimeSys" title="日期筛选" :defaultStartTime="defaultStartTime"></datePick>
            </div>
            <div class="title-input-group u-title-input-group pt10">
              <el-button
                type="primary"
                icon="el-icon-search"
                round
                @click="getItemList"
                :loading="btnTypeLoading"
              >查询</el-button>
            </div>
          </div>
        </div>
        <div class="u-layout-charts fl">
          <MyEcharts
            :id="'typeBar'"
            :height="chartHeight"
            width="70%"
            :option="checkMaintainBarOption"
            :loading="typeBarLoading"
          />
          <MyEcharts
            :id="'typePie'"
            :height="chartHeight"
            :style="{width: '30%'}"
            :option="checkMaintainPieOption"
            :loading="typePieLoading"
          />
          <div
            class="bottom-title-left"
          >{{checkTimeSysShow.start}}~{{checkTimeSysShow.end}}巡检保养计划完成情况</div>
          <div
            class="bottom-title-right"
          >{{checkTimeSysShow.start}}~{{checkTimeSysShow.end}}巡检保养任务占比</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import datePick from '@/components/timerange/separateTime';
import MyEcharts from '@/components/echarts/index' // echarts
import { CheckMaintainPieOption, CheckMaintainBarOption, getBarSeriesData, getPieSeriesData } from './options';
import utils from '@/utils/utils';
import datetimeUtils from '@/utils/datetime-utils.js';
import { getCheckBillCharts } from '@/services/operation.js';

export default {
  components: {
    datePick,
    MyEcharts
  },
  data () {
    return {
      btnTypeLoading: false,
      typeBarLoading: true,
      typePieLoading: true,
      checkTimeSys: {},
      checkTimeShow: {},//展示用
      checkTimeSysShow: {},//展示用
      chartHeight: '200px',
      checkMaintainBarOption: utils.deepCopy(CheckMaintainBarOption),
      checkMaintainPieOption: utils.deepCopy(CheckMaintainPieOption),
      defaultStartTime: datetimeUtils.getPreDate(7)
    }
  },
  computed: {
    shopNumber () {
      return this.$store.getters.shopNumber;
    }
  },
  mounted () {
    this.$common.initChartHeight(this, 120);
    this.getItemList();
  },
  methods: {
    //控制类型chart的loading
    ctrlTypeLoading (val) {
      this.btnTypeLoading = val;
      this.typeBarLoading = val;
      this.typePieLoading = val;
      this.$common.updateLoadingStatus(val);
    },
    //查询
    getItemList () {
      this.ctrlTypeLoading(true);
      this.checkTimeSysShow = utils.deepCopy(this.checkTimeSys);
      getCheckBillCharts({
        startTime: this.checkTimeSys.start, endTime: this.checkTimeSys.end, shopNumber: this.shopNumber
      }).then(res => {
        if (res.data) {
          let optons = Object.assign({}, this.checkMaintainBarOption)
          optons.legend.data = res.data.title;
          // optons.color = [];
          optons.xAxis[0].data = res.data.xpoint;
          optons.series = getBarSeriesData(res.data.xpointvalue);
          console.log('optons :', JSON.stringify(optons));
          this.checkMaintainBarOption = optons;

          let pieOption = Object.assign({}, this.checkMaintainPieOption);
          pieOption.color = optons.color;
          let sum = 0;
          res.data.pie.forEach(n => {
            for (var p in n) {
              sum += n[p]
            }
          });
          pieOption.title.subtext = sum;
          pieOption.title.text = '总计划数(单)';
          pieOption.series[0].data = getPieSeriesData(res.data.pie);
          this.checkMaintainPieOption = pieOption;
        }
        // console.log('res', res);
        this.ctrlTypeLoading(false);
      }).catch(error => {
        this.ctrlTypeLoading(false);
      })
    },
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
