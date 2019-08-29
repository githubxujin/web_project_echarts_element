<template>
  <div>
    <div class="datatable-box">
      <el-table :data="tableData" height="300" border style="width: 100%">
        <el-table-column prop="cycleTime" label="周期" align="center"></el-table-column>
        <el-table-column prop="planName" label="计划" align="center"></el-table-column>
        <el-table-column prop="deviceName" label="设备" align="center"></el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button @click="isHide">关 闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { maintainPlanAudit } from '@/services/operation';
export default {
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.initData();
  },
  computed: {
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    }
  },
  methods: {
    initData () {
      maintainPlanAudit(this.shopNumber).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.array;
        }
      })
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
  }
}
</script>

<style lang="scss" scoped>
</style>