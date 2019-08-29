<template>
  <div>
    <el-row>
      <span>设备类型</span>
      <el-select v-model="type" style="width:120px; margin-left:15px" placeholder="请选择">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-row>
    <div class="datatable-box">
      <el-table
        :height="400"
        :data="ledgerList"
        ref="table"
        class="el-table--border"
        style="width: 100%;"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="50"></el-table-column>
        <el-table-column prop="deviceTypeStr" label="设备类型"></el-table-column>
        <el-table-column prop="total" label="总数"></el-table-column>
        <el-table-column prop="useNum" label="使用中"></el-table-column>
        <el-table-column prop="repairNum" label="维修中"></el-table-column>
        <el-table-column prop="idleNum" label="闲置中"></el-table-column>
      </el-table>
      <pager :pager="pager" @query="getLedgerList" @setPager="onChangePage"></pager>
    </div>
    <el-row class="text-center">
      <el-button round size="mini" @click="close">关 闭</el-button>
    </el-row>
  </div>
</template>
<script>
import pager from "@/components/table/Pager";
export default {
  components: { pager },
  props: {
    LedgerDialogVisible: Boolean,
    shopNumber: String
  },
  data () {
    return {
      type: 1,
      typeList: [
        { value: 1, label: '供配电系统' }
      ],
      ledgerList: [
        { deviceTypeStr: '供配电', total: 12, useNum: 8, repairNum: 3, idleNum: 1 }
      ],
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
    }
  },
  methods: {
    indexMethod (index) {
      return (
        (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
      );
    },
    getLedgerList () {

    },
    onChangePage (val) {
      this.pager.pageNum = val.pageNum;
      this.pager.pageSize = val.pageSize;
    },
    close () {
      this.$emit('update:LedgerDialogVisible', false);
    }
  }
}
</script>
<style lang="scss" scoped>
</style>


