<template>
  <div class="inspection">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
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
              <el-button class="el-button el-button--primary el-button--small is-round" icon="el-icon-search" @click="query">查询</el-button>
          </div>
      </div>

        <div class="u-layout-right-item">
            <el-button class="el-button el-button--primary el-button--small is-round" @click="exportData" v-if="pageBtns.some(val=>val=='export')">导出</el-button>
      </div>
    </div>
      <div
          class="echartsTitle"
      >{{datetimeUtils.GMTToStrRorType(checkTime.start,timeType==1?'day':timeType==2?'month':'year')}}至{{datetimeUtils.GMTToStrRorType(checkTime.end,timeType==1?'day':timeType==2?'month':'year')}}响应报表</div>
    <div class="datatable-box">
      <el-table :data="list"
                :height="tableHeight"
                ref="table"
                class="el-table--border"
                style="width: 100%;">
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
        <el-table-column prop="region"
                         label="区域">
        </el-table-column>
          <el-table-column prop="responseTimeLength"
                           label="确认时间（min）">
          </el-table-column>
        <el-table-column prop="finishTimeLength"
                         label="完成时间（min）">
        </el-table-column>
      </el-table>
    </div>
    <pager :pager="pager"
           @query="query"
           @setPager="setPager"></pager>
  </div>
</template>
<script>
import datePick from "@/components/timerange/index";
import pager from "@/components/table/Pager";
import { getAlarmResponseReportList, exportAlarmResponseList } from '@/services/report-manage';
import datetimeUtils from '@/utils/datetime-utils'
import baseOptions from '@/utils/baseOptions';
export default {
    extends: baseOptions,
  components: { datePick, pager },
  data () {
    return {
      datetimeUtils: datetimeUtils,
        defaultStartTime:datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'),
      checkTime: {},
      list: [], tableHeight: 400,
      echartwidth: '100%',
      tablewidth: '100%',
      options: [{
        label: '全部',
        value: '0'

      }, {
        label: '确认时间',
        value: '1'
      }
        , {
        label: '完成时间',
        value: '2'
      }
      ],
      indexType: '0', check_Time: '', timeType: 1,
      pager: {
        total: 0,
        pageSize: 10,
        pageNum: 0
      }
      , start: new Date(datetimeUtils.getPreDate(15, ',')), end: new Date()
    }
  }
  , created () {
  }, mounted () {
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
        this.checkTime.start = datetimeUtils.getSpecialDay(this.checkTime.start,"-");
        this.checkTime.end = datetimeUtils.getSpecialDay(this.checkTime.end,"-");
      getAlarmResponseReportList({shopNumber:topShopNumers, start: this.checkTime.start, end: this.checkTime.end, timeType: this.timeType }).then((res) => {
        this.pager.total = res.data.total;
        this.list = res.data.list;
      }).catch((error) => {
        console.log(error)
      })
    }, setPager (val) {
      this.pager.pageSize = val.pageSize;
      this.pager.pageNum = val.pageNum;
    }, switchTime (index) {
          this.timeType = index;
      },
    checkedTime (res) {
        this.checkTime = res;
    }, exportData () {
          let topShopNumers = '', that = this;
          this.checkedShopNumbers.forEach(function (v, i) {
              topShopNumers += v;
              if (that.checkedShopNumbers.length - 1 != i) {
                  topShopNumers += ','
              }
          });
              exportAlarmResponseList(`?token=${localStorage.getItem('$token_info')}&shopNumber=${topShopNumers}&start=${
        this.checkTime.start
        }&end=${this.checkTime.end}&timeType=${
        this.timeType
        }`);
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
