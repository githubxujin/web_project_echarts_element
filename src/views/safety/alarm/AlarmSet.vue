<template>
  <div class="alarm-set">
    <el-form ref="alarmSet">
      <div class="head-info">
        <span class="fl">以下级别生成报警后自动生成工单并指派给员工：</span>
        <el-checkbox-group v-model="billAlarmLevel" prop="billAlarmLevel">
          <el-checkbox
            :label="item.value"
            v-for="item in alarmLevelOptions"
            :key="item.value"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="head-info">
        <span class="fl">以下级别生成报警后在首页弹窗通知：</span>
        <el-checkbox-group v-model="homeAlarmLevel" prop="homeAlarmLevel">
          <el-checkbox
            :label="item.value"
            v-for="item in alarmLevelOptions"
            :key="item.value"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in alarmTypes" :label="item.name" :name="item.name" :key="item.id">
          <params-list :billAlarmLevel="billAlarmLevel"></params-list>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submitForm()">提 交</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { alarmLevelOptions } from '../../../enum/alarm-enum';
import ParamsList from './ParamsList';
export default {
  components: {
    ParamsList
  },
  data () {
    return {
      activeName: '',
      alarmLevelOptions: alarmLevelOptions(),
      billAlarmLevel: [1],
      homeAlarmLevel: [1],
      alarmTypes: [
        { id: 1, name: '供配电' },
        { id: 2, name: '给排水' },
        { id: 3, name: '空调' },
        { id: 4, name: '电梯' },
        { id: 5, name: '能管' }
      ] //报警类型
    }
  },
  created () {
    console.log('this.alarmLevelOptions', this.alarmLevelOptions);
    this.activeName = this.alarmTypes[0].name;
  },
  methods: {
    submitForm () {
      this.$emit("onHide");
    },
    handleClick (...args) {

    },
    //关闭
    isHide () {
      this.$refs.alarmSet.resetFields();
      this.$emit("onHide");
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.alarm-set {
  .head-info {
    .fl {
      width: 310px;
    }
  }
  .el-tabs.el-tabs--top {
    background-color: white;
  }
  .el-tabs--top .el-tabs__item.is-top:nth-child(2),
  .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
  .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
  .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2) {
    padding-left: 20px;
  }
  .el-tabs--top .el-tabs__item.is-top:first-child {
    padding-left: 0px;
  }
  .el-tabs--top .el-tabs__item.is-top:last-child,
  .el-tabs--top .el-tabs__item.is-bottom:last-child,
  .el-tabs--bottom .el-tabs__item.is-top:last-child,
  .el-tabs--bottom .el-tabs__item.is-bottom:last-child {
    padding-right: 20px;
  }
  .el-tabs__item.is-active {
    color: white;
    background: #0262a3;
  }
  .el-tabs__item {
    margin-right: 20px;
    color: black;
    background: #eeeeee;
    border-radius: 10px;
  }
  .el-tabs__active-bar {
    height: 0px;
  }
  .el-tabs__nav-scroll {
    padding-left: 0px;
  }
}
</style>
