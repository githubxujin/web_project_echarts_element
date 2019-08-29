<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="入库管理" name="storageInfo">
          <storageInfo></storageInfo>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import storageInfo from './StorageInfo.vue'
export default {
  components: { storageInfo },
  data () {
    return {
      activeName: 'storageInfo'
    };
  },
  methods: {

  }
};
</script>
