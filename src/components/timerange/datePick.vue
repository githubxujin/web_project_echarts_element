<template>
  <div class="date-picker">
    <span class="desc-name">{{ title }}：</span>
    <el-date-picker
      v-model="value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      @change="getTime"
      :editable="false"
    />
  </div>
</template>
<script>
/**
 * 连选日期组件，开始时间和分开时间必须同时选择的组件
*/
import datetimeUtils from '@/utils/datetime-utils.js';
export default {
  props: {
    title: {
      type: String,
      default: '时间'
    },
    startTime: {
      type: Date,
      default: () => datetimeUtils.getPreDate(12)
    },
    endTime: {
      type: Date,
      default: () => new Date()
    }
  },
  data () {
    return {
      value: [this.startTime, this.endTime],
      pickerMinDate: '',
      pickerOptions: {
        // onPick: ({ maxDate, minDate }) => {
        //   this.pickerMinDate = minDate.getTime()
        //   if (maxDate) {
        //     this.pickerMinDate = ''
        //   }
        // },
        disabledDate: (time) => {
          // if (this.pickerMinDate !== '') {
          //   const day90 = (90 - 1) * 24 * 3600 * 1000
          //   let maxTime = this.pickerMinDate + day90
          //   if (maxTime > new Date()) {
          //     maxTime = new Date()
          //   }
          //   return time.getTime() > maxTime
          // }
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    getTime (val) {
      // console.log(val)
      let start = val ? datetimeUtils.getSpecialDay(val[0], '-') : '';
      let end = val ? datetimeUtils.getSpecialDay(val[1], '-') : '';
      this.$emit('changeTime', start, end)
    }
  }
}
</script>
<style lang="scss" scoped>
.date-picker {
  min-width: 320px;
  .desc-name {
    margin-left: 15px;
  }
}
/deep/ .el-range-editor .el-range-input {
  border-radius: 2px;
  border: 1px solid #c3c9d5;
  box-sizing: border-box;
}
/deep/ .el-range-editor.el-input__inner {
  padding: 1px 10px;
}
</style>
<style>
.date-picker .el-date-editor--daterange.el-input__inner {
  border: none;
  width: 260px;
}
</style>

