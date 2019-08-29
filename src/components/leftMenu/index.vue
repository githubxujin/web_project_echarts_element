<template>
  <div class="left-tree">
    <el-tree
      v-if="collapse"
      ref="tree"
      :data="items"
      show-checkbox
      default-expand-all
      :node-key="nodeKey"
      highlight-current
      :props="defaultProps"
      :render-content="renderContent"
      :default-checked-keys="defaultCheckedKeys"
      @check="checkNode"
      @check-change="treeCheckChange"
    />
    <fold-btn @foldClick="foldClick" v-if="folding"></fold-btn>
  </div>
</template>

<script>
import FoldBtn from '@//components/layout/FoldBtn.vue';
export default {
  props: {
    //开启折叠
    folding: {
      type: Boolean,
      default: false
    },
    collapse: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array,
      default: () => [
        {
          id: 0,
          label: '全部',
          num: 10,
          children: [
            {
              id: 1,
              label: '一级 1111111111111111111',
              parentId: 0,
              num: 2,
              children: [{
                id: 4,
                label: '二级 1-11111111111111111111111111',
                parentId: 1,
                num: 1,
                children: [{
                  id: 9,
                  label: '三级 1-1-1',
                  parentId: 4
                }, {
                  id: 10,
                  num: 1,
                  parentId: 4,
                  label: '三级 1-1-2'
                }]
              }]
            }, {
              id: 2,
              label: '一级 2',
              parentId: 0,
              num: 5,
              children: [{
                id: 5,
                parentId: 2,
                num: 2,
                label: '二级 2-1'
              }, {
                id: 6,
                parentId: 2,
                num: 3,
                label: '二级 2-2'
              }]
            }, {
              id: 3,
              label: '一级 3',
              parentId: 0,
              num: 3,
              children: [{
                id: 7,
                num: 2,
                parentId: 3,
                label: '二级 3-1'
              }, {
                id: 8,
                num: 1,
                parentId: 3,
                label: '二级 3-2'
              }]
            }
          ]        }

      ]
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: {
        children: 'children',
        label: 'label'
      }
    }
  },
  components: {
    FoldBtn
  },
  data () {
    return {
    }
  },
  methods: {
    renderContent (h, { node, data, store }) {
      return (<span class='custom-tree-node' style='text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'>
        <span title={node.label}>
          <span>{node.label}</span>
          <span v-show={data.num}>
            ({data.num})
                    </span>
        </span>
      </span>)
    },
    checkNode (node) {
      this.$emit('checkNode', node);
    },
    treeCheckChange (...args) {
      const checkKeys =
        this.$refs.tree && this.$refs.tree.getCheckedKeys();
      console.log('checkKeys', checkKeys)
      this.$emit('input', checkKeys || [])
    },
    foldClick () {
      this.$emit('foldClick');
    }
  }
}
</script>
<style lang="scss" scoped>
.left-tree {
  min-width: 210px;
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
  overflow-y: auto;
  // border-radius: 10px;
}
</style>

