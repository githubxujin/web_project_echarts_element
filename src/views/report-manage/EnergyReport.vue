<template>
  <div class="inspection">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <!--<div class="title-input-group">-->
          <!--<p class="text">-->
          <!--能耗类型：-->
          <!--</p>-->
          <!--<div class="input-container">-->

          <!--<div style="border-radius: 2px;"-->
          <!--class="item select-input">-->
          <!--&lt;!&ndash;el-ui 根据需求增加配置&ndash;&gt;-->
          <!--<el-select v-model="indexType"-->
          <!--placeholder="请选择">-->
          <!--<el-option v-for="item in options"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
        </div>
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
                   v-if="pageBtns.some(val=>val=='export')"
                   @click="exportData">导出</el-button>
      </div>
    </div>
      <div
          class="echartsTitle"
      >{{datetimeUtils.GMTToStrRorType(checkTime.start,timeType==1?'day':timeType==2?'month':'year')}}至{{datetimeUtils.GMTToStrRorType(checkTime.end,timeType==1?'day':timeType==2?'month':'year')}}能耗报表</div>
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
        <el-table-column prop="mergeName"
                         label="区域">
        </el-table-column>
        <el-table-column prop="actUsed"
                         label="总能耗(kWh)">
        </el-table-column>
        <el-table-column prop="areaUsed"
                         :label="areaUsedlabel">
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
import pager from "@/components/table/Pager";
import { getPlatformEnergyConsume, exportPlatformEnergyConsume } from '@/services/report-manage';
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
      isdata: false,
        areaUsedlabel:'单位面积日能耗(kWh/㎡)',
      options: [{
        label: '全部', value: '0'
      }, {
        label: '实际总能耗', value: '1'
      }, {
        label: '单位面积能耗', value: '2'
      }
      ], check_Time: '',
      pager: {
        total: 0,
        pageSize: 10,
        pageNum: 0
      }, startTime: new Date(datetimeUtils.getPreDate(15, ',')), endTime: new Date(), timeType: 1, indexType: '0'
    }
  }
  , created () {
    // this.echartwidth = document.body.clientWidth * 0.85 + 'px';
    // this.tablewidth = document.body.clientWidth * 0.8 + 'px';
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
      this.areaUsedlabel=this.timeType==1?"单位面积日能耗(kWh/㎡)":this.timeType==2?"单位面积月能耗(kWh/㎡)":"单位面积年能耗(kWh/㎡)";
      getPlatformEnergyConsume({        shopNumber: topShopNumers, start: this.checkTime.start + ' 0:0:0', end: this.checkTime.end + ' 23:59:59', timeType: this.timeType, pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize      }).then((res) => {
        this.pager.total = res.data.total;
        this.list = res.data.array;
      }).catch((error) => {
        console.log(error)
      })
    },
    checkedTime (res) {
      this.checkTime = res;
      console.log('getTime:' + JSON.stringify(res));
    }, setPager (val) {
      this.pager.pageSize = val.pageSize;
      this.pager.pageNum = val.pageNum;
    }, switchTime (index) {
      this.timeType = index;
    },
    exportData () {
      let topShopNumers = '', that = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumers += v;
        if (that.checkedShopNumbers.length - 1 != i) {
          topShopNumers += ','
        }
      });
      exportPlatformEnergyConsume(`?token=${localStorage.getItem('$token_info')}&start=${
      this.checkTime.start + ' 0:0:0'
        }&end=${this.checkTime.end + ' 23:59:59' }&timeType=${
        this.timeType
        }&shopNumber=${topShopNumers}`);
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
