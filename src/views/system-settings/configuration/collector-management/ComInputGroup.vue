<template>
  <div class="com-input-group">
    <span
      v-for="(item,index) in valList"
      :key="index"
      class="input-item"
      :class="{'has-value': valList[index].value}"
    >
      <el-input v-model.trim="valList[index].value" :disabled="valList[index].disabled">
        <i
          v-if="!valList[index].disabled"
          class="el-icon-close el-input__icon"
          slot="suffix"
          @click="handleDelete(index)"
          title="删除"
        ></i>
      </el-input>
    </span>
    <el-button icon="el-icon-plus" circle size="mini" @click="handleAdd" title="新增端口"></el-button>
  </div>
</template>
<script>
export default {
  name: 'com-input-group',
  props: {
    value: Array
  },
  data () {
    return {
      valList: []
    }
  },
  methods: {
    handleDelete (index) {
      this.valList.splice(index, 1)
    },
    handleAdd () {
      this.valList.push({
        value: '',
        disabled: false
      })
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler: function (list = []) {
        if (JSON.stringify(list) === JSON.stringify(this.valList)) return
        this.valList = JSON.parse(JSON.stringify(list))
      }
    },
    valList: {
      immediate: true,
      deep: true,
      handler: function (val) {
        if (JSON.stringify(this.value) === JSON.stringify(val)) return
        this.$emit('input', JSON.parse(JSON.stringify(val)))
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.com-input-group {
  min-width: 120px;
  .el-icon-close {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .input-item {
    display: inline-block;
    width: 100px;
    padding: 0 10px 10px 0;
    &:last-child {
      padding: 0;
    }
  }
}
</style>
