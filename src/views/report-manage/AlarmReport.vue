<template>
  <div class="u-layout-container">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">明细指标：</p>
            <div class="input-container multiple"
                 :style="{width:getWidth()}">
              <div style="border-radius: 2px;"
                   class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select v-model="alarmLevel"
                           @change="updateAlarmLevel"
                           :style="{width:getWidth()}"
                           multiple
                           clearable
                           placeholder="请选择">
                  <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <datePick v-model="checkTime"
                      type="daterange"
                      :compareTime="true"
                      :clearable="false"
                      :defaultStartTime="defaultStartTime"
                      @checkedTime="checkedTime"
                      @switchTime="switchTime"></datePick>
          </div>
        </div>

        <div class="u-layout-left-item">
          <el-button class="el-button el-button--primary el-button--small is-round"
                     icon="el-icon-search"
                     @click="query(1)">查询</el-button>
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
      >{{datetimeUtils.GMTToStrRorType(checkTime.start,timeType==1?'day':timeType==2?'month':'year')}}至{{datetimeUtils.GMTToStrRorType(checkTime.end,timeType==1?'day':timeType==2?'month':'year')}}报警报表</div>
    <div class="datatable-box">
      <el-table :height="tableHeight"
                :data="list"
                class="el-table--border"
                style="width: 100%;">
        <el-table-column type="index"
                         label="序号"
                         width="50"></el-table-column>
        <el-table-column prop="shopNumber"
                         label="门店编号"
                         width="180"></el-table-column>
        <el-table-column prop="shopName"
                         label="门店名称"></el-table-column>
        <el-table-column prop="cityName"
                         label="区域"></el-table-column>
        <el-table-column v-if="alarmLevelstate.includes(1)"
                         prop="level1"
                         label="一级报警(个)"></el-table-column>
        <el-table-column v-if="alarmLevelstate.includes(2)"
                         prop="level2"
                         label="二级报警(个)"></el-table-column>
        <el-table-column v-if="alarmLevelstate.includes(3)"
                         prop="level3"
                         label="三级报警(个)"></el-table-column>
        <el-table-column v-if="alarmLevelstate.includes(4)"
                         prop="level4"
                         label="四级报警(个)"></el-table-column>
        <el-table-column v-if="alarmLevelstate.includes(5)"
                         prop="level5"
                         label="五级报警(个)"></el-table-column>
          <el-table-column prop="total"
                           label="总计"></el-table-column>
      </el-table>
      <pager :pager="pager"
             @query="query"
             @setPager="setPager"></pager>
    </div>
  </div>
</template>

<script>
import datePick from "@/components/timerange/index";
import pager from "@/components/table/Pager";
import { getAlarmList, exportAlarmList } from '@/services/report-manage';
import datetimeUtils from '@/utils/datetime-utils'
import baseOptions from '@/utils/baseOptions';
var Enumerable = require('linq');
export default {
  extends: baseOptions,
  components: { datePick, pager },
  data () {
    return {
      datetimeUtils: datetimeUtils, alarmLevel: [1, 2, 3, 4, 5],alarmLevelstate:[1, 2, 3, 4, 5],
      defaultStartTime:datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'),
      checkTime: {},
      list: [], tableHeight: 400,
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      options: [{
        value: 1,
        label: '一级'
      }
        , {
        value: 2,
        label: '二级'
      }
        , {
        value: 3,
        label: '三级'
      }, {
        value: 4,
        label: '四级'
      }, {
        value: 5,
        label: '五级'
      }
      ],
      check_Time: '', alarmType: '',
      pager: {
        total: 0,
        pageSize: 10,
        pageNum: 1
      }, timeType: 1, startTime: new Date(datetimeUtils.getPreDate(30, ',')), endTime: new Date()
    }
  }

  , created () {
        this.checkTime = { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(30), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') };
  }, mounted () {
    this.query();
    this.$common.initTableHeight(this);
  },
  methods: {
    query () {
      let alarmLevels = '';
      let topShopNumers = '', that = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumers += v;
        if (that.checkedShopNumbers.length - 1 != i) {
          topShopNumers += ','
        }
      });

      this.alarmLevel.forEach(function (n, i) {
        if (n == 0) {
          alarmLevels = '1,2,3,4,5'
        } else {
          alarmLevels += n;        }
        if (that.alarmLevel.length - 1 != i) {
          alarmLevels += ','
        }
      });
      if (alarmLevels == '') {
        this.$message.error("明细指标不能为空");
        return;
      }
      this.alarmLevelstate=this.alarmLevel;
      getAlarmList({        shopNumber: topShopNumers, alarmLevel: alarmLevels, timeType: this.timeType, start: this.checkTime.start.split(" ")[0], end: this.checkTime.end.split(" ")[0], timeType: this.timeType, pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize      }).then((res) => {
        this.pager.total = res.data.total;
        this.list = res.data.list;
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
    }, exportData () {
      let alarmLevels = '';
      let topShopNumers = '', that = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumers += v;
        if (that.checkedShopNumbers.length - 1 != i) {
          topShopNumers += ','
        }
      });

      this.alarmLevel.forEach(function (n, i) {
        if (n == 0) {
          alarmLevels = '1,2,3,4,5'
        } else {
          alarmLevels += n;        }
        if (that.alarmLevel.length - 1 != i) {
          alarmLevels += ','
        }
      });
      if (alarmLevels == '') {
        this.$message.error("明细指标不能为空");
        return;
      }
      exportAlarmList(`?token=${localStorage.getItem('$token_info')}&start=${
        this.checkTime.start.split(" ")[0]
        }&end=${this.checkTime.end.split(" ")[0]}&timeType=${
        this.timeType
        }&alarmLevel=${alarmLevels}&shopNumber=${topShopNumers}&deviceName=&alarmCondition=`);
    }, getWidth (defaultWidth = 100, size = 60) {
      return this.alarmLevel.length <= 1 ? defaultWidth + 'px' : defaultWidth + (this.alarmLevel.length - 1) * size + 'px';
    }, updateAlarmLevel () {
      this.alarmLevel = Enumerable.from(this.alarmLevel).distinct("x=>x").toArray();//条件查询
    },
  }, watch: {
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
        /*align-items: start;*/
    }
    .echartsTitle {
        text-align: center;
        color: #909399;
        font-size: 16px;
    }
</style>
