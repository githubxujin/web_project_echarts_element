<template>
  <div class="p-container">
    <div class="sub-nav">
      <el-tabs v-model="activeName">
        <el-tab-pane label="能耗报表" name="default">
          <energy-report></energy-report>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import energyReport from './EnergyReport.vue'
export default {
  components: { energyReport },
  data () {
    return {
      activeName: 'default'
    };
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.p-container {
  overflow: auto;
}
</style>
