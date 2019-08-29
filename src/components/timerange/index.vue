<template>
  <div class="time-range">
    <div class="time" :style="{height:outerHeight,lineHeight:outerHeight}">
      <span style="float:left;">时间粒度：</span>
      <ul
        class="tab-content"
        :style="{height:granularityHeight,lineHeight:granularityHeight,marginTop:marginTop}"
      >
        <li
          v-for="(item,index) in granularityData"
          :key="index"
          class="item"
          :class="{active:tabIndex==item.id}"
          @click="OnSwitchigranularity(item)"
        >{{ item.name }}</li>
      </ul>
    </div>
    <div class="data-picked">
      <year-picker
        :default-start-time="startTime"
        :default-end-time="endTime"
        :date-type="tabIndex"
        @checkedTime="checkedTime"
      />
    </div>
  </div>
</template>
<script>
import datetimeUtils from '@/utils/datetime-utils'
import yearPicker from './yearRange'
import moment from 'moment';
export default {
  components: {
    yearPicker
  },
  props: {
    granularityHeight: { // 时间粒度的高度
      type: String,
      default: '32px'
    },
    granularityData: {
      type: Array,
      default: () => [
        { name: '日', id: 1 },
        { name: '月', id: 2 },
        { name: '年', id: 3 }
      ]
    },
    outerHeight: {// 组件所在的高度
      type: String,
      default: '32px'
    },
    defaultStartTime: {
      type: String,
      default: ''
    }
    // compareTime: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data () {
    return {
      tabIndex: 1,
      startTime: datetimeUtils.getPreDate(15),
      endTime: new Date(),
      marginTop: 0
    }
  },
  created () {
    if (this.defaultStartTime) {
      this.startTime = new Date(this.defaultStartTime)
    }
    this.initTop();
  },
  methods: {
    // 切换时间粒度
    OnSwitchigranularity (obj) {
      this.tabIndex = obj.id;
      this.switchGranularity(this.tabIndex);
      this.$emit("switchTime", this.tabIndex);
      this.returnDateTime();
    },
    //返回构造的日期对象
    returnDateTime () {
      if (this.tabIndex == 0) {
        this.$emit('input', { start: moment(this.startTime).format('YYYY-MM-DD HH:mm:ss'), end: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss') });
      } else {
        this.$emit('input', { start: moment(this.startTime).format('YYYY-MM-DD') + ' 00:00:00', end: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss') });
      }
    },
    initTop () {
      if (this.outerHeight && this.granularityHeight) {
        this.marginTop = (parseInt(this.outerHeight.slice(0, -2)) - parseInt(this.granularityHeight.slice(0, -2))) / 2 + 'px'
      }
      this.returnDateTime();
    },
    switchGranularity (val) {
      switch (val) {
        case 0: //时
          this.startTime = datetimeUtils.getPreDate(3);//.format('L');
          this.endTime = new Date();
          break;
        case 1: //日
            if (this.defaultStartTime) {
                this.startTime = new Date(this.defaultStartTime)
            }else{
                this.startTime = datetimeUtils.getPreDate(15);//.format('L');
            }
          this.endTime = new Date();
          break;
        case 2: //月
          this.startTime = datetimeUtils.getBeforeMonth(1);
          this.endTime = new Date();
          break;
        case 3: //年
          this.startTime = new Date(new Date().getFullYear() - 12, '01', '01')
          this.endTime = new Date();
          break;
      }
    },
    checkedTime (data) {
      this.$emit("checkedTime", data);
      this.$emit('input', data);
    }
  }
}
</script>
<style  lang="scss">
.data-picked {
  .el-date-editor {
    .el-input__inner {
      border: none;
    }
  }
}
</style>
<style  scoped lang="scss">
.data-picked {
  .el-date-editor {
    .el-input__inner {
      border: none;
    }
  }
}
.time-range {
  box-sizing: border-box;
  .time {
    margin-right: 15px;
    height: 50px;
    line-height: 50px;
    display: inline-block;
    vertical-align: middle;
    .tab-content {
      display: inline-block;
      display: flex;
      justify-content: center;
      border: 1px solid #c3c9d5;
      box-sizing: border-box;
      overflow: hidden;
      .item {
        text-align: center;
        min-width: 33px;
        border-right: 1px solid #c3c9d5;
        cursor: pointer;
        &:last-child {
          border: 0 none;
        }
        &.active {
          background: #1881bf;
          color: #fff;
        }
      }
    }
  }
  .data-picked {
    display: inline-block;
  }
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
}
</style>

