<template>
  <div class="p-container">
    <div class="sub-nav">
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="报警报表" name="alarm-report"><AlarmReport></AlarmReport></el-tab-pane>
          <el-tab-pane label="响应报表" name="response-report"><ResponseReport></ResponseReport></el-tab-pane>
          <el-tab-pane label="设备在线" name="equ-online"><EquOnline></EquOnline></el-tab-pane>
          <el-tab-pane label="能耗报表" name="energy-report"><EnergyReport></EnergyReport></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
    import AlarmReport from './AlarmReport.vue'
    import ResponseReport from './ResponseReport.vue'
    import EquOnline from './EquOnline.vue'
    import EnergyReport from './EnergyReport.vue'
export default {
    components: { AlarmReport,ResponseReport,EquOnline,EnergyReport },
    data() {
        return {
            activeName: 'alarm-report'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>
<style lang="scss" scoped>
    /deep/ .sub-nav {
        height: 100%;
        line-height: 10px;
        border-radius: 5px;
        display: block;
        background-color: white;
    }

    /deep/ .el-input__inner {
        border-radius: 3px !important;
        background: #ffffff;
        border-color: #ffffff;
    }
</style>

