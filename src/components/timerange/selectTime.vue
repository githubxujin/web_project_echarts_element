<template>
  <!-- 4个时间粒度共用一套时间日期组件在切换时会有bug,故分开写 -->
  <div>
    <div v-show="dateType=='datetime'">
      <!-- @blur="getTimeInterval" -->
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="datetime"
        :clearable="false"
        :format="format"
        placeholder="选择时间"
        :picker-options="pickerBeginHourBefore"
        @change="checkStartdate"
        :editable="false"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="datetime"
        style="width:130px;"
        :format="format"
        placeholder="选择时间"
        :clearable="false"
        :picker-options="pickerBeginHourAfter"
        @change="checkEnddate"
        :editable="false"
      />
    </div>
    <div v-show="dateType=='date'">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="date"
        :clearable="false"
        :format="format"
        placeholder="选择日期"
        :picker-options="pickerBeginDayBefore"
        @change="checkStartdate"
        :editable="false"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="date"
        style="width:130px;"
        :format="format"
        placeholder="选择日期"
        :clearable="false"
        :picker-options="pickerBeginDayAfter"
        @change="checkEnddate"
        :editable="false"
      />
    </div>
    <div v-show="dateType=='month'">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="month"
        :clearable="false"
        :format="format"
        placeholder="选择月份"
        :picker-options="pickerBeginMonthBefore"
        @change="checkStartdate"
        :editable="false"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="month"
        style="width:130px;"
        :format="format"
        placeholder="选择月份"
        :clearable="false"
        :picker-options="pickerBeginMonthAfter"
        @change="checkEnddate"
        :editable="false"
      />
    </div>
    <div v-show="dateType=='year'">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="year"
        :clearable="false"
        :format="format"
        placeholder="选择年份"
        :picker-options="pickerBeginYearBefore"
        @change="checkStartdate"
        :editable="false"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="year"
        style="width:130px;"
        :format="format"
        placeholder="选择年份"
        :clearable="false"
        :picker-options="pickerBeginYearAfter"
        @change="checkEnddate"
        :editable="false"
      />
    </div>
  </div>
</template>
<script>
import datetimeUtils from '@/utils/datetime-utils'
export default {
  props: {
    defaultStartTime: {
      type: Date,
      default: () => new Date(new Date().getFullYear() - 12, '01', '01')
    },
    defaultEndTime: {
      type: Date,
      default: () => new Date()
    },
    dateType: {
      type: String,
      default: 'datetime'
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
      format: this.vFormat || "yyyy-MM-dd HH:mm:ss",
      time: {
        start: '',
        end: ''
      },
      lastStartTime: this.defaultStartTime,
      lastEndTime: this.defaultEndTime,
      message: '',
      pickerBeginHourBefore: {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前7天
        disabledDate: time => {
          const beginDateVal = this.endTime;
          let end = datetimeUtils.getEndTime(this.endTime);
          const currentTime = end.getTime() - 86400 * 1000 * 7
          if (beginDateVal) {
            return time.getTime() > beginDateVal.getTime(); //time.getTime() < currentTime ||
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerBeginHourAfter: {// 结束时间不能大于今天
        disabledDate: time => {
          const beginDateVal = this.startTime;
          const currentTime = this.endTime.getTime() + 86400 * 1000 * 7
          if (beginDateVal) {
            return time.getTime() > currentTime || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerBeginDayBefore: {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前90天
        disabledDate: time => {
          const beginDateVal = this.endTime
          const currentTime = this.endTime.getTime() - 86400 * 1000 * 90
          if (beginDateVal) {
            return time.getTime() > beginDateVal.getTime(); //time.getTime() < currentTime ||
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerBeginDayAfter: {// 结束时间不能大于今天
        disabledDate: time => {
          const beginDateVal = this.startTime;
          const currentTime = this.endTime.getTime() + 86400 * 1000 * 90;
          if (beginDateVal) {
            return time.getTime() > currentTime || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime() - 1000 * 3600 * 24;
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerBeginMonthBefore: {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前90天
        disabledDate: time => {
          var beginDateVal = this.endTime;
          var threeMonthago = beginDateVal.setMonth(beginDateVal.getMonth() - 36);
          beginDateVal.setMonth(beginDateVal.getMonth() + 36);
          if (beginDateVal) {
            return time.getTime() > beginDateVal.getTime(); //time.getTime() < threeMonthago ||
          }
        }
      },
      pickerBeginMonthAfter: {// 结束时间不能大于本月
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
      },
      pickerBeginYearBefore: {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前7天
        disabledDate: time => {
          const beginDateVal = this.endTime
          if (beginDateVal) {
            return time.getTime() > beginDateVal.getTime() || time.getTime() > Date.now();
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerBeginYearAfter: {// 结束时间不能大于今年
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
  },
  created () {
    this.init();
  },
  watch: {
    defaultStartTime (val) {
      this.startTime = val;
      if (this.dateType === "datetime") {
        this.time.start = datetimeUtils.getformatDateTime(val, '-') + ''
      } else {
        this.time.start = datetimeUtils.getformatDateTime(val, '-') + " 00:00:00"
      }
    },
    defaultEndTime (val) {
      this.endTime = val;
      this.time.end = this.dateType === "datetime" ? datetimeUtils.getformatDateTime(val, '-') : datetimeUtils.getSpecialDay(val, '-')
    },
    dateType (val) {
      if (this.defaultStartTime && this.defaultEndTime) {
        this.init()
      }
    },
    vFormat (val) {
      this.format = val
    }
  },
  methods: {
    init () {
      this.time.start = this.dateType === "datetime" ? datetimeUtils.getformatDateTime(this.defaultStartTime, '-') : datetimeUtils.getSpecialDay(this.defaultStartTime, '-') + " 00:00:00"
      this.handleDate(this.defaultEndTime)
      this.$emit('checkedTime', this.time)
    },
    checkStartdate (val) {
      if (val) {
        this.lastStartTime = val;
      }
      this.startTime = val ? val : this.lastStartTime;
      this.time.start = val ? datetimeUtils.getformatDateTime(val, '-') : datetimeUtils.getformatDateTime(this.defaultStartTime, '-');
      this.$emit('checkedTime', this.time)
    },
    checkEnddate (val) {
      if (val) {
        this.lastEndTime = val;
      }
      this.endTime = val ? val : this.lastEndTime;
      if (val) {
        this.handleDate(val)
      }
      this.$emit('checkedTime', this.time)
    },
    handleDate (val) {
      if (this.dateType === 'date') {
        this.time.end = datetimeUtils.getSpecialDay(val, '-') + " 23:59:59"
        this.pickerBeginYearBefore = {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前90天
          disabledDate: time => {
            const beginDateVal = this.endTime;
            // const currentTime = this.endTime.getTime() - 86400 * 1000 * 90
            if (beginDateVal) {
              // return time.getTime() < currentTime || time.getTime() > beginDateVal.getTime();
              return time.getTime() > Date.now() || time.getTime() > beginDateVal.getTime();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
        this.pickerBeginYearAfter = {// 结束时间不能大于今天
          disabledDate: time => {
            const beginDateVal = this.startTime;
            // const currentTime = this.endTime.getTime() + 86400 * 1000 * 90
            if (beginDateVal) {
              return time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
      } else if (this.dateType === 'month') {
        const year = val.getFullYear();
        const month = val.getMonth() + 1;
        const Month = month > 9 ? month : '0' + month;
        if (/^1|3|5|7|8|10|12$/.test(month)) {
          this.time.end = year + '-' + Month + '-' + 31 + " 23:59:59"
        } else if (/^4|6|9|11$/.test(month)) {
          this.time.end = year + '-' + Month + '-' + 30 + " 23:59:59"
        } else {
          if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            this.time.end = year + '-' + Month + '-' + 29 + " 23:59:59";
          } else {
            this.time.end = year + '-' + Month + '-' + 28 + " 23:59:59";
          }
        }
        // console.log(year, month, this.time.end)
        this.pickerBeginYearBefore = {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前90天
          disabledDate: time => {
            var beginDateVal = this.endTime;
            // var threeMonthago = beginDateVal.setMonth(beginDateVal.getMonth() - 36);
            // beginDateVal.setMonth(beginDateVal.getMonth() + 36);
            if (beginDateVal) {
              return time.getTime() > Date.now() || time.getTime() > beginDateVal.getTime();
            }
          }
        }
        this.pickerBeginYearAfter = {// 结束时间不能大于本月
          disabledDate: time => {
            var beginDateVal = this.startTime;
            // var threeMonths = beginDateVal.setMonth(beginDateVal.getMonth() + 36);
            // beginDateVal.setMonth(beginDateVal.getMonth() - 36)
            if (beginDateVal) {
              // return time.getTime() > threeMonths || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
              return time.getTime() > Date.now() || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
      } else if (this.dateType === 'year') {
        this.time.end = val.getFullYear() + '-12-31' + " 23:59:59";
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
      } else {
        this.time.end = datetimeUtils.getformatDateTime(val, '-')
        this.pickerBeginYearBefore = {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前7天
          disabledDate: time => {
            const beginDateVal = this.endTime
            // const currentTime = this.endTime ? this.endTime.getTime() - 86400 * 1000 * 7 : ''
            // if (beginDateVal) {
            return time.getTime() > Date.now() || time.getTime() > beginDateVal.getTime();
            // } else {
            // return time.getTime() > Date.now()
            // }
          }
        },
          this.pickerBeginYearAfter = {// 结束时间不能大于今天
            disabledDate: time => {
              const beginDateVal = this.startTime;
              // const currentTime = this.startTime ? datetimeUtils.getDateNextDate(this.startTime, 7) : '';
              // if (beginDateVal) {
              return time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
              // } else {
              //   return time.getTime() > Date.now()
              // }
            }
          }
      }
    },
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-input__suffix {
  right: 0px;
}
</style>

