<template>
  <div class="system-settings-menu-tree">
    <template v-for="item in menuArr">
      <template v-if="item.subs">
        <el-submenu :key="item.id" :index="item.index">
          <template slot="title">
            <i v-if="item.icon" :class="item.icon"/>
            <span slot="title" class="title">{{ item.title }}</span>
          </template>
          <MenuTree :menuArr="item.subs"/>
        </el-submenu>
      </template>
      <template v-else>
        <el-menu-item :key="item.id" :index="item.index">
          <i v-if="item.icon" :class="item.icon"/>
          <span class="title">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </template>
  </div>
</template>
<script>
export default {
  name: 'MenuTree',
  props: {
    menuArr: Array
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
.system-settings-menu-tree {
}
</style>
