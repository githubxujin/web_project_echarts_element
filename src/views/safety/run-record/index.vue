<template>
  <div class="p-container">
    <div class="sub-nav">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="供配电"
                     name="powerDistribution">
          <PowerDistribution></PowerDistribution>
        </el-tab-pane>
        <el-tab-pane label="给排水"
                     name="waterSupplySewerage">
          <WaterSupplySewerage></WaterSupplySewerage>
        </el-tab-pane>
        <el-tab-pane label="空调"
                     name="airConditioner">
          <AirConditioner></AirConditioner>
        </el-tab-pane>
        <el-tab-pane label="电梯"
                     name="maintain1">
          <Elevator></Elevator>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PowerDistribution from './PowerDistribution.vue'
import WaterSupplySewerage from './WaterSupplySewerage.vue'
import AirConditioner from './AirConditioner.vue'
import Elevator from './Elevator.vue'
export default {
  components: { PowerDistribution, WaterSupplySewerage, AirConditioner, Elevator },
  data () {
    return {
      activeName: 'powerDistribution'
    };
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
