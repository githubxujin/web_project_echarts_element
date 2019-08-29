<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="出库管理" name="warehouseInfo">
          <warehouseInfo></warehouseInfo>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import warehouseInfo from './WarehouseInfo.vue'
export default {
  components: { warehouseInfo },
  data () {
    return {
      activeName: 'warehouseInfo'
    };
  },
  methods: {

  }
};
</script>
