<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="负荷预测" name="default">
          <load-prediction></load-prediction>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import loadPrediction from './LoadPrediction.vue'

export default {
  components: { loadPrediction },
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
