<template>
  <div>
    <el-form label-width="90px" size="mini" inline :label-position="'right'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="入库单号：">{{detailData.id}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库金额：">{{detailData.inAmount}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作人：">{{detailData.operatorName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库时间：">{{detailData.inTime}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">{{detailData.desc}}</el-form-item>
        </el-col>
      </el-row>
      <div class="datatable-box">
        <el-table
          style="width:100%"
          :data="detailData.inStorageSparePartList"
          class="el-table--border"
          :height="200"
        >
          <el-table-column prop="sparePartName" label="配件名称"></el-table-column>
          <el-table-column prop="specification" label="规格型号"></el-table-column>
          <el-table-column prop="unitPrice" label="单价"></el-table-column>
          <el-table-column prop="num" label="数量"></el-table-column>
          <el-table-column prop="amount" label="金额"></el-table-column>
        </el-table>
      </div>
      <el-row class="text-center">
        <el-button round size="mini" @click="close">关 闭</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean
    },
    detailData: {
      type: Object
    }
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    close () {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>


