<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="示意图"
                     name="default">示意图</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
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
</style>
