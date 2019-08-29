<template>
  <!-- 4个时间粒度共用一套时间日期组件在切换时会有bug,故分开写 -->
  <div>
    <div v-show="dateType=='datetime'">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="datetime"
        :clearable="false"
        :format="format"
        placeholder="选择年"
        :picker-options="pickerBeginYearBefore"
        @change="checkStartdate"
        @blur="getTimeInterval"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="datetime"
        style="width:130px;"
        :format="format"
        placeholder="选择年"
        :clearable="false"
        :picker-options="pickerBeginYearAfter"
        @change="checkEnddate"
        @blur="getTimeInterval"
      />
    </div>
    <div v-show="dateType=='date'">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="date"
        :clearable="false"
        :format="format"
        placeholder="选择年"
        :picker-options="pickerBeginYearBefore"
        @change="checkStartdate"
        @blur="getTimeInterval"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="date"
        style="width:130px;"
        :format="format"
        placeholder="选择年"
        :clearable="false"
        :picker-options="pickerBeginYearAfter"
        @change="checkEnddate"
        @blur="getTimeInterval"
      />
    </div>
    <div v-show="dateType=='month'">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="month"
        :clearable="false"
        :format="format"
        placeholder="选择年"
        :picker-options="pickerBeginYearBefore"
        @change="checkStartdate"
        @blur="getTimeInterval"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="month"
        style="width:130px;"
        :format="format"
        placeholder="选择年"
        :clearable="false"
        :picker-options="pickerBeginYearAfter"
        @change="checkEnddate"
        @blur="getTimeInterval"
      />
    </div>
    <div v-show="dateType=='year'">
      <el-date-picker
        v-model="startTime"
        style="width:130px;"
        type="year"
        :clearable="false"
        :format="format"
        placeholder="选择年"
        :picker-options="pickerBeginYearBefore"
        @change="checkStartdate"
        @blur="getTimeInterval"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="year"
        style="width:130px;"
        :format="format"
        placeholder="选择年"
        :clearable="false"
        :picker-options="pickerBeginYearAfter"
        @change="checkEnddate"
        @blur="getTimeInterval"
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
      message: '',
      pickerBeginYearBefore: {// 开始时间小于结束时间，且小于当前时间，开始时间不能小于当天前7天
        disabledDate: time => {
          const beginDateVal = this.endTime
          // const currentTime = this.endTime.getTime() - 86400 * 1000 * 7
          // if (beginDateVal) {
          return time.getTime() > Date.now() || time.getTime() > beginDateVal.getTime();
          // } else {
          //   return time.getTime() > Date.now()
          // }
        }
      },
      pickerBeginYearAfter: {// 结束时间不能大于今天,小于开始时间
        disabledDate: time => {
          let beginDateVal = this.startTime;
          return time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
        }
      }
      // pickerBeginYearAfter: {// 结束时间不能大于今天
      //   disabledDate: time => {
      //     const beginDateVal = this.startTime;
      //     const currentTime = datetimeUtils.getNextDate(7);
      //     if (beginDateVal) {
      //       return time.getTime() > currentTime || time.getTime() > Date.now() || time.getTime() < beginDateVal.getTime();
      //     } else {
      //       return time.getTime() > Date.now()
      //     }
      //   }
      // }
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
      this.time.start = val ? datetimeUtils.getformatDateTime(val, '-') : '';
      // this.$emit('checkedTime', this.time)
    },
    checkEnddate (val) {
      console.log(this.endTime)
      if (val) {
        this.handleDate(val)
      }
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
    getTimeInterval () {
      if (this.dateType == 'date') {
        let gap = this.endTime.getTime() - this.startTime.getTime();
        let time = 86400 * 1000 * 90
        if (gap > time) {
          this.$message.error('最多可查询90天');
        }
        this.message = gap > time ? '最多可查询90天' : ''
        this.$emit('checkedTime', this.time, this.message)
      } else if (this.dateType == 'month') {
        let gap = this.endTime.getFullYear() - this.startTime.getFullYear();
        let preMonth = this.startTime.getMonth() < this.endTime.getMonth();
        if (gap > 3 || gap == 3 && preMonth) {
          this.$message.error('最多可查询36个月')
          this.message = '最多可查询36个月'
        } else {
          this.message = ''
        }
        this.$emit('checkedTime', this.time, this.message)
      } else if (this.dateType == 'year') {
        this.$emit('checkedTime', this.time, this.message)
      } else {
        let gap = this.endTime.getTime() - this.startTime.getTime();
        let time = 86400 * 1000 * 7
        if (gap > time) {
          this.$message.error('最多可查询7天')
        }
        this.message = gap > time ? '最多可查询7天' : ''
        this.$emit('checkedTime', this.time, this.message)
      }
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-input__suffix {
  right: 0px;
}
</style>

