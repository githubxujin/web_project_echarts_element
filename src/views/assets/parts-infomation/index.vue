<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="备件信息" name="partsInfo">
          <partsInfo></partsInfo>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import partsInfo from './PartsInfo.vue'
export default {
  components: { partsInfo },
  data () {
    return {
      activeName: 'partsInfo'
    };
  },
  methods: {

  }
};
</script>
