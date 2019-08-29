<template>
  <div>
    <div class="datatable-box">
      <el-table ref="Table" border :data="tableData" style="width: 100%" height="320px">
        <el-table-column prop="planName" label="计划名称"></el-table-column>
        <el-table-column prop="cycleTimeStr" label="周期"></el-table-column>
        <el-table-column prop="previousTimeStr" label="上次生成时间"></el-table-column>
        <el-table-column prop="nextTimeStr" label="下次生成时间"></el-table-column>
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
import { getListByDevice } from '@/services/operation';
export default {
  props: {
    deviceIdAndType: {
      type: String,
      default: ''
    },
  },
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
    },
  },
  methods: {
    initData () {
      getListByDevice({ shopNumber: this.shopNumber, deviceIdAndType: this.deviceIdAndType }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.array;
        }
      });
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    }
  }
}
</script>

<style lang="scss" scoped>
</style>