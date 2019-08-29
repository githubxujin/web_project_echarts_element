<template>
  <div class="inspection">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <!--<div class="u-layout-left-item">-->
        <!--<div class="title-input-group">-->
        <!--<p class="text">-->
        <!--明细指标：-->
        <!--</p>-->
        <!--<div class="input-container">-->

        <!--<div style="border-radius: 2px;"-->
        <!--class="item select-input">-->
        <!--&lt;!&ndash;el-ui 根据需求增加配置&ndash;&gt;-->
        <!--<el-select v-model="onlineType"-->
        <!--placeholder="请选择">-->
        <!--<el-option v-for="item in onlineTypeOptions"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <datePick v-model="checkTime"
                      type="daterange"
                      :compareTime="true"
                      :clearable="false"
                      :defaultStartTime="defaultStartTime"
                      @checkedTime="checkedTime"
                      @switchTime="switchTime">
            </datePick>
          </div>
        </div>
        <div class="u-layout-left-item">
          <el-button class="el-button el-button--primary el-button--small is-round"
                     icon="el-icon-search"
                     @click="query">查询</el-button>
        </div>
      </div>

      <div class="u-layout-right-item">
        <el-button class="el-button el-button--primary el-button--small is-round"
                   @click="exportData"
                   v-if="pageBtns.some(val=>val=='export')">导出</el-button>
      </div>
    </div>
      <div
          class="echartsTitle"
      >{{datetimeUtils.GMTToStrRorType(checkTime.start,timeType==1?'day':timeType==2?'month':'year')}}至{{datetimeUtils.GMTToStrRorType(checkTime.end,timeType==1?'day':timeType==2?'month':'year')}}设备在线报表</div>
    <div class="datatable-box">
      <el-table :data="list"
                :height="tableHeight"
                ref="table"
                class="el-table--border"
                style="width: 100%;height:620px;overflow: auto;overflow-x: hidden;">
        <el-table-column type="index"
                         label="序号"
                         width="180">
        </el-table-column>
        <el-table-column prop="shopNumber"
                         label="门店编号"
                         width="180">
        </el-table-column>
        <el-table-column prop="shopName"
                         label="门店名称">
        </el-table-column>
        <el-table-column prop="cityName"
                         label="区域">
        </el-table-column>
        <el-table-column prop="avgVal"
                         label="平均在线率(%)">
        </el-table-column>
        <el-table-column prop="lowestVal"
                         label="最低在线率(%)">
        </el-table-column>

      </el-table>

    </div>
    <!--<pager :pager="pager"-->
    <!--@query="query"-->
    <!--@setPager="setPager"></pager>-->
  </div>
</template>

<script>
import datePick from "@/components/timerange/index";
import myEcharts from '@/components/echarts/index';
import tableDataList from "@/components/table/tableDataList";
import pager from "@/components/table/Pager";
import { getOnlinedeviceList, exportOnlinedeviceList } from '@/services/report-manage';
import datetimeUtils from '@/utils/datetime-utils'
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { datePick, myEcharts, tableDataList, pager },
  data () {
    return {
        timeType:1,
      datetimeUtils: datetimeUtils,
      defaultStartTime: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'),
      checkTime: {},
      list: [], tableHeight: 400,
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      onlineTypeOptions: [{
        value: -1,
        label: '全部'
      }, {
        value: 0,
        label: '平均在线'
      }
        , {
        value: 1,
        label: '最低在线'
      }
      ],
      onlineType: -1,
      pager: {
        total: 0,
        pageSize: 10,
        pageNum: 0
      }, start: new Date(datetimeUtils.getPreDate(15, ',')), end: new Date(), check_Time: ''
    }
  }
  , created () {
    // this.echartwidth = document.body.clientWidth * 0.85 + 'px';
    //this.tablewidth = document.body.clientWidth * 0.8 + 'px';
  }, mounted () {
    // getAlarmList(null).then((res) => {
    //     this.list=res.data.list;
    // }).catch((error) => {
    //   console.log(error)
    // })
    this.defaultStartTime = datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-');
    this.checkTime = { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') };
    this.query();
    this.$common.initTableHeight(this);
  },
  methods: {
    query () {
      let topShopNumers = '', that = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumers += v;
        if (that.checkedShopNumbers.length - 1 != i) {
          topShopNumers += ','
        }
      });
      getOnlinedeviceList({ shopNumber: topShopNumers, start: this.checkTime.start, end: this.checkTime.end, timeType: this.timeType }).then((res) => {

        this.list = res.data;
      }).catch((error) => {
        console.log(error)
      })
    }, setPager (val) {
      this.pager.pageSize = val.pageSize;
      this.pager.pageNum = val.pageNum;
    },
    checkedTime (res) {
      this.checkTime = res;

    }, switchTime (index) {
      this.timeType = index;
    },
    get_Data () {
      this.isdata = true;
    },
    getCharts () {
      this.isdata = false;
    },
    exportData () {
      let topShopNumers = '', that = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumers += v;
        if (that.checkedShopNumbers.length - 1 != i) {
          topShopNumers += ','
        }
      });
      exportOnlinedeviceList(`?token=${localStorage.getItem('$token_info')}&start=${
        this.checkTime.start
        }&end=${this.checkTime.end}&shopNumber=${topShopNumers}$timeType=${this.timeType}`);
    }
  }, watch: {
    //门店编码
    checkedShopNumbers: {
      handler (val) {
        this.query();
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
    .click {
        color: #3678ba;
        border-color: #c3d7ea;
        background-color: #ebf2f8;
    }
    .u-layout-search {
        padding: 20px 0px 0px 30px;
        display: flex;
        justify-content: space-between;
        align-items: start;
    }
    .echartsTitle {
        text-align: center;
        color: #909399;
        font-size: 16px;
    }
</style>
