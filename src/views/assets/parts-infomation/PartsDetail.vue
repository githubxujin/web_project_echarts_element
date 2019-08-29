<template>
  <div class="parts-detail">
    <el-form label-width="90px" size="mini" inline :label-position="'right'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="配件编码：">{{detailData.number}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配件名称：">{{detailData.name}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="配件类型：">{{detailData.typeName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格型号：">{{detailData.specification}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="库存警戒值：">{{detailData.stockAlertValue}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前库存：">{{detailData.stock}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="关联设备类型：">{{detailData.deviceTypeName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位：">{{detailData.unitName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否启用：">
            <span v-show="detailData.status==0">启用</span>
            <span v-show="detailData.status!=0">禁用</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="text-center">
          <el-button round size="mini" @click="close">关 闭</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    detailData: {
      type: Object
    },
    dialogVisible: {
      type: Boolean
    }
  },
  data () {
    return {

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
.parts-detail {
  /deep/ .el-form-item__label {
    width: 98px !important;
  }
}
</style>


