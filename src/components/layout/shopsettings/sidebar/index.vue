<template>
  <div class="system-settings-side-bar">
    <div class="bar-contain">
      <el-menu router :default-active="defaultKey" :default-openeds="defaultOpens">
        <menuTree :menuArr="menuArr"></menuTree>
      </el-menu>
    </div>
  </div>
</template>
<script>
import menuTree from './MenuTree.vue'
export default {
  components: { menuTree },
  props: {
    menuArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultKey: {
      type: String,
      default: () => {
        return this.$route.path
      }
    },
    defaultOpens: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
<style lang="scss" scoped>
.system-settings-side-bar {
  position: fixed;
  top: 98px;
  z-index: 2;
  width: 174px;
  background: white;
  height: calc(100% - 98px);
  border-radius: 5px;
  overflow: hidden;
  .bar-contain {
    width: 190px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  /deep/ .el-menu {
    border: none;
    background-color: initial;
  }
}
</style>
