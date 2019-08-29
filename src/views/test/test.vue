<template>
  <div class="test">
    <!-- <component
      :is="componentId"
      v-model="value"
      @nodeClick="nodeClick"
      :isMultiple="false"
      @change="treeChange"
    />
    -->
    <TreeSelect v-model="value" :data="data"></TreeSelect>
    <!-- <el-button @click="changeValue">改变一下</el-button> -->
  </div>
</template>
<script>
/**
 * 测试组件用页面
 */
import projectTree from '@/components/projecttree/index'
import TreeSelect from '@/components/treeSelect'
import { configTypeTreeQuery } from '@/services/system-settings.js'

export default {
  name: 'Test',
  components: {
    projectTree,
    TreeSelect
  },
  data () {
    return {
      data: [],
      componentId: 'projectTree',
      value: '',
      selectValue: ''
    }
  },
  created () {
    this.componentId = 'projectTree'
    this.configTypeTreeQuery({ configType: 14 }).then(res => {
      this.data = res.data[14].map(item => {
        item.disabled = true
        return item
      })
    })
  },
  watch: {
    value (val, oldVal) {
      console.log('value', val, oldVal);
    }
  },
  methods: {
    configTypeTreeQuery,
    changeValue () {
      this.value = 1
    },
    treeChange (...args) {
      console.log('args', args);
    },
    nodeClick (...args) {
      console.log(args);
    }
  }
}
</script>
<style lang="scss" scoped>
.test {
  height: 800px;
  width: 1920px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
</style>

