<template>
  <div>
    <div v-show="dateType==0">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="datetime"
        :clearable="false"
        placeholder="选择时"
        :picker-options="pickerBeginYearBefore"
        @change="checkStartdate"
        :format="vFormat"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="datetime"
        style="width:130px;"
        placeholder="选择时"
        :clearable="false"
        :picker-options="pickerBeginYearAfter"
        @change="checkEnddate"
        :format="vFormat"
      />
    </div>
    <div v-show="dateType==1">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="date"
        :clearable="false"
        placeholder="选择日"
        :picker-options="pickerBeginYearBefore"
        @change="checkStartdate"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="date"
        style="width:130px;"
        placeholder="选择日"
        :clearable="false"
        :picker-options="pickerBeginYearAfter"
        @change="checkEnddate"
      />
    </div>
    <div v-show="dateType==2">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="month"
        :clearable="false"
        placeholder="选择月"
        :picker-options="pickerBeginYearBefore"
        @change="checkStartdate"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="month"
        style="width:130px;"
        placeholder="选择月"
        :clearable="false"
        :picker-options="pickerBeginYearAfter"
        @change="checkEnddate"
      />
    </div>
    <div v-show="dateType==3">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="year"
        :clearable="false"
        placeholder="选择年"
        :picker-options="pickerBeginYearBefore"
        @change="checkStartdate"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="year"
        style="width:130px;"
        placeholder="选择年"
        :clearable="false"
        :picker-options="pickerBeginYearAfter"
        @change="checkEnddate"
      />
    </div>
  </div>
</template>
<script>
import datetimeUtils from '@/utils/datetime-utils.js';
export default {
  props: {
    defaultStartTime: {
      type: Date,
      default: new Date(new Date().getFullYear() - 12, '01', '01')
    },
    defaultEndTime: {
      type: Date,
      default: new Date()
    },
    dateType: {
      type: Number,
      default: 1
    },
    vFormat: {
      type: String,
      default: 'yyyy-MM-dd HH'
    }
  },
  data () {
    return {
      startTime: this.defaultStartTime,
      endTime: this.defaultEndTime,
      time: {
        start: '',
        end: ''
      },
      pickerBeginYearBefore: {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前90天
        disabledDate: time => {
          const beginDateVal = this.endTime
          const currentTime = this.endTime.getTime() - 86400 * 1000 * 90
          if (beginDateVal) {
            return time.getTime() < currentTime.getTime() || time.getTime() > beginDateVal.getTime();
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerBeginYearAfter: {// 结束时间不能大于今天
        disabledDate: time => {
          const beginDateVal = this.startTime;
          const currentTime = this.endTime.getTime() + 86400 * 1000 * 90
          if (beginDateVal) {
            return time.getTime() > currentTime.getTime() || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  watch: {
    defaultStartTime (val) {
      this.startTime = val;
      this.time.start = datetimeUtils.getSpecialDay(val, '-')
    },
    defaultEndTime (val) {
      this.endTime = val;
      this.time.end = datetimeUtils.getSpecialDay(val, '-')
    },
    dateType (val) {
      if (this.defaultStartTime && this.defaultEndTime) {
        this.init()
      }
    },
    // startTime (val) {
    //   if (this.dateType === 'date') {
    //     this.pickerBeginYearAfter = {// 结束时间不能大于今天
    //       disabledDate: time => {
    //         var beginDateVal = val;
    //         var currentTime = val.getTime() + 90 * 60 * 60 * 24 * 1000
    //         if (beginDateVal) {
    //           return time.getTime() > currentTime || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
    //         } else {
    //           return time.getTime() > Date.now()
    //         }
    //       }
    //     }
    //   } else if (this.dateType === 'month') {
    //     this.pickerBeginYearAfter = {// 结束时间不能大于本月
    //       disabledDate: time => {
    //         var beginDateVal = val;
    //         var threeMonths = val.setMonth(val.getMonth() + 36);
    //         val.setMonth(val.getMonth() - 36)
    //         if (beginDateVal) {
    //           return time.getTime() > threeMonths || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
    //         }
    //       }
    //     }
    //   } else {
    //     this.pickerBeginYearAfter = '';
    //   }
    // },
    // endTime (val) {
    //   if (this.dateType === 'date') {
    //     this.pickerBeginYearBefore = {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前90天
    //       disabledDate: time => {
    //         var beginDateVal = val
    //         var currentTime = val.getTime() - 90 * 60 * 60 * 24 * 1000;
    //         return time.getTime() < currentTime || time.getTime() > beginDateVal.getTime();
    //       }
    //     }
    //   } else if (this.dateType === 'month') {
    //     this.pickerBeginYearBefore = {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前90天
    //       disabledDate: time => {
    //         var beginDateVal = val;
    //         var threeMonthago = val.setMonth(val.getMonth() - 36);
    //         val.setMonth(val.getMonth() + 36);
    //         if (beginDateVal) {
    //           return time.getTime() < threeMonthago || time.getTime() > beginDateVal.getTime();
    //         }
    //       }
    //     }
    //   } else {
    //     this.pickerBeginYearBefore = '';
    //   }
    // }
  },
  created () {
    this.init();
  },
  methods: {
    init () {
      this.time.start = datetimeUtils.getformatDateTime(this.defaultStartTime, '-')
      this.handleDate(this.defaultEndTime)
    },
    checkStartdate (val) {
      this.time.start = datetimeUtils.getformatDateTime(val, '-')
      this.$emit('checkedTime', this.time)
    },
    checkEnddate (val) {
      this.handleDate(val)
      this.$emit('checkedTime', this.time)
    },
    handleDate (val) {
      if (this.dateType === 0) {
        this.time.end = datetimeUtils.getformatDateTime(val, '-')
        this.pickerBeginYearBefore = {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前3天
          disabledDate: time => {
            const beginDateVal = this.endTime
            const currentTime = this.endTime.getTime() - 86400 * 1000 * 3
            if (beginDateVal) {
              return time.getTime() < currentTime || time.getTime() > beginDateVal.getTime();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
        this.pickerBeginYearAfter = {// 结束时间不能大于今天
          disabledDate: time => {
            const beginDateVal = this.startTime;
            const currentTime = this.endTime.getTime() + 86400 * 1000 * 3
            if (beginDateVal) {
              return time.getTime() > currentTime || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
      }
      else if (this.dateType === 1) {
        this.time.end = datetimeUtils.getSpecialDay(val, '-')
        this.pickerBeginYearBefore = {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前90天
          disabledDate: time => {
            const beginDateVal = this.endTime
            const currentTime = this.endTime.getTime() - 86400 * 1000 * 90
            if (beginDateVal) {
              return time.getTime() < currentTime || time.getTime() > beginDateVal.getTime();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
        this.pickerBeginYearAfter = {// 结束时间不能大于今天
          disabledDate: time => {
            const beginDateVal = this.startTime;
            const currentTime = this.endTime.getTime() + 86400 * 1000 * 90
            if (beginDateVal) {
              return time.getTime() > currentTime || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
      } else if (this.dateType === 2) {
        const year = val.getFullYear();
        const month = val.getMonth() + 1;
        const Month = month > 9 ? month : '0' + month;
        if (/^1|3|5|7|8|10|12$/.test(month)) {
          this.time.end = new Date().getFullYear() + '-' + Month + '-' + 31
        } else if (/^4|6|9|11$/.test(month)) {
          this.time.end = new Date().getFullYear() + '-' + Month + '-' + 31
        } else {
          if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            this.time.end = year + '-' + Month + '-' + 29;
          } else {
            this.time.end = year + '-' + Month + '-' + 28;
          }
        }
        this.pickerBeginYearBefore = {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前90天
          disabledDate: time => {
            var beginDateVal = this.endTime;
            var threeMonthago = beginDateVal.setMonth(beginDateVal.getMonth() - 36);
            beginDateVal.setMonth(beginDateVal.getMonth() + 36);
            if (beginDateVal) {
              return time.getTime() < threeMonthago || time.getTime() > beginDateVal.getTime();
            }
          }
        }
        this.pickerBeginYearAfter = {// 结束时间不能大于本月
          disabledDate: time => {
            var beginDateVal = this.startTime;
            var threeMonths = beginDateVal.setMonth(beginDateVal.getMonth() + 36);
            beginDateVal.setMonth(beginDateVal.getMonth() - 36)
            if (beginDateVal) {
              return time.getTime() > threeMonths || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
      } else {
        this.time.end = val.getFullYear() + '-12-31';
        this.pickerBeginYearBefore = {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前7天
          disabledDate: time => {
            const beginDateVal = this.endTime
            if (beginDateVal) {
              return time.getTime() > beginDateVal.getTime() || time.getTime() > Date.now();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
        this.pickerBeginYearAfter = {// 结束时间不能大于今年
          disabledDate: time => {
            const beginDateVal = this.startTime;
            if (beginDateVal) {
              return time.getTime() > Date.now() || time.getTime() < beginDateVal
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
      }

      // this.$emit('checkedTime', this.dateType)
    }
  }
}
</script>

<style>
</style>

