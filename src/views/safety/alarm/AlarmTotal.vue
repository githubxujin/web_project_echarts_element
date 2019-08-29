<template>
  <div class="p-container">
    <div class="u-line-block mb20" ref="chartsDiv">
      <div class="u-layout-search pb0">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <datePick
              v-model="checkTime"
              type="daterange"
              :clearable="false"
              @switchTime="switchTime"
              :granularityData="dateOptionData"
            ></datePick>
          </div>
          <div class="title-input-group u-title-input-group">
            <el-button
              type="primary"
              icon="el-icon-search"
              round
              :loading="btnTimeLoading"
              @click="onTimeSearch"
            >查询</el-button>
          </div>
        </div>
        <h3 class="alarm-nums-tit">
          <span></span>报警次数与百分比
        </h3>
      </div>
      <div class="u-layout-charts fl">
        <MyEcharts
          @eclick="eclick"
          :id="'timeBar'"
          :height="chartHeight"
          width="70%"
          :option="timeBarOption"
          :loading="timeBarLoading"
        />
        <MyEcharts
          :id="'timePie'"
          :height="chartHeight"
          :style="{width: '30%'}"
          :option="timePieOption"
          :loading="timePieLoading"
        />
      </div>
    </div>
    <div class="u-line-block">
      <div class="u-layout-search u-layout-dobule">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <datePick
              v-model="checkTimeSys"
              type="daterange"
              :clearable="false"
              :loading="typeBarLoading"
              @switchTime="switchSysTime"
              :granularityData="dateOptionData"
            ></datePick>
          </div>
          <div class="title-input-group u-title-input-group">
            <el-button
              type="primary"
              icon="el-icon-search"
              round
              @click="onTypeSearch"
              :loading="btnTypeLoading"
            >查询</el-button>
          </div>
        </div>
        <h3 class="alarm-nums-tit">
          <span></span>报警次数与百分比
        </h3>
      </div>
      <div class="u-layout-charts fl">
        <MyEcharts
          :id="'typeBar'"
          :height="chartHeight"
          width="70%"
          :option="typeBarOption"
          :loading="typeBarLoading"
        />
        <MyEcharts
          :id="'typePie'"
          :height="chartHeight"
          :style="{width: '30%'}"
          :option="typePieOption"
          :loading="typePieLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>

import datePick from '../../../components/timerange/index';
import MyEcharts from '../../../components/echarts/index' // echarts
import { BarOption, PieOption, getColorsByLevels, HourDayMonthYear, getBarSeriesData, getPieSeriesData } from './options';
import utils from '../../../utils/utils';
import datetimeUtils from '@/utils/datetime-utils.js';
import { getAlarmStatisticListByTime, getAlarmStatisticListBySystem } from '../../../services/safety';
export default {
  components: {
    datePick,
    MyEcharts
  },
  data () {
    return {
      dateOptionData: HourDayMonthYear,
      timeType: 1, //日
      btnTimeLoading: false,
      timeBarLoading: true,
      timePieLoading: true,
      btnTypeLoading: false,
      typeBarLoading: true,
      typePieLoading: true,
      checkTime: {},
      checkTimeSys: {},
      chartHeight: '200px',
      timeBarOption: utils.deepCopy(BarOption),
      timePieOption: utils.deepCopy(PieOption),
      typeBarOption: utils.deepCopy(BarOption),
      typePieOption: utils.deepCopy(PieOption),
      sysTimeType: 1,//日
    }
  },
  computed: {
    shopNumber () {
      return this.$store.getters.shopNumber;
    }
  },
  created () {
    this.$common.updateLoadingStatus(true);
    this.typeBarOption.xAxis[0].data = ['供配电系统', '给排水系统', '空调系统', '电梯系统', '配电安全', '通讯监测'];
    this.typePieOption.series[0].data = [{ name: '供配电系统', value: 300 }, { name: '给排水系统', value: 500 }, { name: '空调系统', value: 150 },
    { name: '电梯系统', value: 100 }, { name: '配电安全', value: 30 }, { name: '通讯监测', value: 200 }];
  },
  mounted () {
    this.$common.initChartHeight(this);
    this.onTimeSearch();
    this.onTypeSearch();
  },
  methods: {
    //控制时间chart的loading
    ctrlTimeLoading (val) {
      this.btnTimeLoading = val;
      this.timeBarLoading = val;
      this.timePieLoading = val;
    },
    //控制类型chart的loading
    ctrlTypeLoading (val) {
      this.btnTypeLoading = val;
      this.typeBarLoading = val;
      this.typePieLoading = val;
    },
    //关闭时间模块Loading
    closeTimeLoading () {
      this.$common.updateLoadingStatus(false);
      this.ctrlTimeLoading(false);
    },
    //时间查询
    onTimeSearch () {
      console.log('checkTime', this.checkTime)
      this.ctrlTimeLoading(true);
      if (this.checkTime.end && this.checkTime.end.length == 10) {
        this.checkTime.end = this.checkTime.end + ' ' + datetimeUtils.getCurShortTime();
      }
      getAlarmStatisticListByTime({
        timeType: this.timeType, start: this.checkTime.start, end: this.checkTime.end, shopNumber: this.shopNumber
      }).then((res) => {
        if (res.data) {
          let optons = Object.assign({}, this.timeBarOption)
          optons.legend.data = res.data.titles;
          optons.color = getColorsByLevels(res.data.titles);
          optons.xAxis[0].data = res.data.xpoint;
          optons.series = getBarSeriesData(res.data.xpointvalue);
          console.log('timeBarOption.xAxis[0].data', optons);
          this.timeBarOption = optons;

          let pieOption = Object.assign({}, this.timePieOption);
          // console.log('pieOption', pieOption, res.data.pie)
          // pieOption.legend.data = res.data.title;
          pieOption.color = optons.color;
          pieOption.title.text = res.data.total;
          pieOption.series[0].data = getPieSeriesData(res.data.pie);
          this.timePieOption = pieOption;
        }
        // console.log('res', res);
        this.closeTimeLoading();
      }).catch(error => {
        this.closeTimeLoading();
      })
    },
    //类型查询
    onTypeSearch () {
      this.ctrlTypeLoading(true);
      if (this.checkTimeSys.end && this.checkTimeSys.end.length == 10) {
        this.checkTimeSys.end = this.checkTimeSys.end + ' ' + datetimeUtils.getCurShortTime();
      }
      getAlarmStatisticListBySystem({
        timeType: this.sysTimeType, start: this.checkTimeSys.start, end: this.checkTimeSys.end, shopNumber: this.shopNumber
      }).then(res => {
        if (res.data) {
          let optons = Object.assign({}, this.typeBarOption)
          optons.legend.data = res.data.titles;
          console.log('optons :', optons);
          // optons.color = getColorsByLevels(res.data.title);
          optons.xAxis[0].data = res.data.xpoint;
          optons.series = getBarSeriesData(res.data.xpointvalue);
          this.typeBarOption = optons;

          let pieOption = Object.assign({}, this.typePieOption);
          pieOption.color = optons.color;
          pieOption.title.text = res.data.total;
          pieOption.series[0].data = getPieSeriesData(res.data.pie);
          this.typePieOption = pieOption;
        }
        // console.log('res', res);
        this.ctrlTypeLoading(false);
      }).catch(error => {
        this.ctrlTypeLoading(false);
      })
    },
    //时间粒度切换
    switchTime (res) {
      this.timeType = res;
      console.log('switchTime:', res);
    },
    //分类时间粒度切换
    switchSysTime (res) {
      this.sysTimeType = res;
    },
    eclick (params) {
      console.log('params', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.u-line-block {
  width: 100%;
  display: block;
  height: calc(50% - 10px);
  background-color: #fff;
  min-height: 250px;
}

.p-container {
  background-color: #f1f6fb;
}
.u-layout-charts {
  width: 100%;
  position: relative;
}
.u-layout-charts.fl {
  > div {
    float: left;
  }
}
.alarm-nums-tit {
  padding-left: 14px;
  position: absolute;
  font-size: 16px;
  color: #1881bf;
  top: 25px;
  right: calc(30% - 162px);
}

.alarm-nums-tit span {
  position: absolute;
  top: 11px;
  left: 0;
  display: inline-block;
  width: 4px;
  background: #1881bf;
  height: 18px;
}
.u-layout-search {
  position: relative;
  padding: 20px 0px 0px 30px;
}
</style>