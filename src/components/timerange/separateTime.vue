<template>
  <div class="date-picker">
    <span class="desc-name">{{ title }}:</span>
    <el-date-picker
      v-model="start"
      style="width:127px;"
      type="date"
      :clearable="clearable"
      placeholder="选择日"
      @change="checkStartdate"
      :picker-options="pickerBeginYearBefore"
      :editable="false"
    />
    <span>至</span>
    <el-date-picker
      v-model="end"
      type="date"
      style="width:127px;"
      placeholder="选择日"
      :clearable="clearable"
      :picker-options="pickerBeginYearAfter"
      @change="checkEnddate"
      :editable="false"
    />
  </div>
</template>
<script>
/**
 * 开始时间与结束时间分开选择的组件
 */
import datetimeUtils from '@/utils/datetime-utils.js';
export default {
  props: {
    title: {
      type: String,
      default: '时间'
    },
    defaultStartTime: {
      type: [Date, String],
      default: () => datetimeUtils.getPreDate(12)
    },
    defaultEndTime: {
      type: [Date, String],
      default: () => new Date()
    },
    //开启结束时间限制
    enabledEndTimeLimit: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      start: this.defaultStartTime,
      end: this.defaultEndTime,
      time: {
        start: '',
        end: ''
      },
      pickerBeginYearBefore: {// 结束时间不能大于今天
        disabledDate: time => {
          const beginDateVal = this.end;
          if (beginDateVal) {
            let limitWhere = this.enabledEndTimeLimit ? time.getTime() > Date.now() : false;
            return limitWhere || time.getTime() > beginDateVal.getTime()
          }
        }
      },
      pickerBeginYearAfter: {// 结束时间不能大于今天
        disabledDate: time => {
          const beginDateVal = this.start;
          if (beginDateVal) {
            let limitWhere = this.enabledEndTimeLimit ? time.getTime() > Date.now() : false;
            return limitWhere || time.getTime() < beginDateVal.getTime()
          }
        }
      }
    }
  },
  watch: {
    defaultStartTime (val) {
      // this.startTime = val;
      this.time.start = datetimeUtils.getSpecialDay(val, '-')
    },
    defaultEndTime (val) {
      // this.endTime = val;
      this.time.end = datetimeUtils.getSpecialDay(val, '-')
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.time.start = datetimeUtils.getSpecialDay(this.defaultStartTime, '-')
      this.time.end = datetimeUtils.getSpecialDay(this.defaultEndTime, '-')
      this.$emit('input', this.time);
    },
    checkStartdate (val) {
      this.time.start = val ? datetimeUtils.getSpecialDay(val, '-') : '';
      this.$emit('checkedTime', this.time)
      this.$emit('input', this.time);
      console.log(this.time)
    },
    checkEnddate (val) {
      this.time.end = val ? datetimeUtils.getSpecialDay(val, '-') : '';
      this.$emit('checkedTime', this.time)
      console.log(this.time)
      this.$emit('input', this.time);
    }
  }
}
</script>
<style lang="scss" scoped>
.date-picker {
  // width: 310px;
  // height:60px;
  // line-height:60px;
  // margin-top: 10px;
  // .desc-name {
  //   margin-right: 15px;
  // }
  /deep/ .el-date-editor.el-input,
  /deep/ .el-date-editor.el-input__inner {
    // border-radius: 28px;
    border: 1px solid #c3c9d5;
    box-sizing: border-box;
    padding: 1px 8px;
    padding: 0px 8px;
    line-height: 30px;
  }
  /deep/ .el-date-editor .el-input__inner,
  /deep/ .el-select .el-input__inner {
    height: 100%;
    line-height: 32px;
  }
  /deep/ .u-layout-search .el-input__inner {
    border: none;
  }
}
</style>

