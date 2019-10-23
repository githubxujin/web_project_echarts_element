<template>
  <div class="SubEntryAdder" v-loading="dialogLoading">
    <el-scrollbar
      ref="scrollbar"
      class="tree-scrollbar"
      tag="div"
      wrap-class="select-dropdown__wrap"
      view-class="el-select-dropdown__list"
    >
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="number"
        :default-expand-all="true"
        :props="defaultProps"
        :check-strictly="true"
        @check="nodeCheck"
      ></el-tree>
    </el-scrollbar>
    <el-button @click="handleExpression" type="primary">编辑表达式</el-button>
    <div class="btn-group">
      <el-button @click="submit" type="primary">确定</el-button>
      <el-button @click="cancle">取消</el-button>
    </div>
    <el-dialog
      :visible.sync="expressionDialog"
      width="700px"
      :before-close="resetExpressionDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <span slot="title" class="dialog-header">编辑表达式</span>
      <ExpressionListEditor
        :expressionDialog.sync="expressionDialog"
        :checkedNodeList="checkedNodeList"
        @submit="stageNodeList"
      ></ExpressionListEditor>
    </el-dialog>
  </div>
</template>
<script>
import ExpressionListEditor from './ExpressionListEditor'
import { subentryAdd, subentryGetTemplateTreeArray, subentryQuery } from '@/services/system-settings.js'
import axios from '@/axios/axios.js'
export default {
  name: 'SubEntryAdder',
  components: { ExpressionListEditor },
  props: {
    addDialogVisible: Boolean
  },
  data () {
    return {
      dialogLoading: true, // 弹窗loading
      expressionDialog: false, // 编辑表达式
      treeData: [], // 分项下拉树
      defaultProps: {
        children: 'children',
        label: 'subName'
      },
      checkedNodeList: [],
      cachedNodeList: []
    }
  },
  computed: {
    buildId () {
      return this.$store.getters.getUserInfo.shopNumber
    }
  },
  created () {
    this.initData()
  },
  methods: {
    subentryAdd, // 新增
    subentryGetTemplateTreeArray, // 分项数据获取树
    subentryQuery, // 已新增分项列表
    initData () {
      this.dialogLoading = true
      const buildId = this.buildId
      axios.all([this.subentryGetTemplateTreeArray(), this.subentryQuery({ buildId })]).then(axios.spread((...args) => {
        let treeData = args[0].data.array || []
        let subentryNumberList = (args[1].data.list || []).map(item => {
          return item.number
        })
        let subentryStrs = subentryNumberList.join(',');
        subentryStrs = `,${subentryStrs},`
        this.treeData = this.setItemDisabled(treeData, subentryStrs)
        this.dialogLoading = false
      })).catch(_ => {
        console.error('初始化新增分项数据失败(ErrorMessage)：', _);
        this.dialogLoading = false
      })
    },
    setItemDisabled (data = [], subentryStrs = '') { // 已有分项置灰
      // 获取所有树节点
      data.forEach(item => {
        if (subentryStrs.indexOf(`,${item.number},`) > -1) item.disabled = true
        const childrenLabel = this.defaultProps.children
        if (item[childrenLabel] && item[childrenLabel].length) {
          item = this.setItemDisabled(item[childrenLabel], subentryStrs);
        }
      }, this);
      return data
    },
    nodeCheck (item, checkedObject) { // 选中复选框,如果有子则全选子
      if (!checkedObject.checkedKeys.includes(item.number)) return
      let toCheckList = []
      if (item.children && item.children.length) {
        toCheckList = item.children.filter(item => !item.disabled).map(item => item.number)
      }
      if (toCheckList.length) {
        let checkedList = this.$refs.tree.getCheckedKeys()
        toCheckList = checkedList.concat(toCheckList)
        toCheckList = Array.from(new Set(toCheckList))
        this.$refs.tree && this.$refs.tree.setCheckedKeys(toCheckList)
      }
    },
    submit () { // 提交新增
      this.checkedNodeList = this.getCheckedNodeList()
      if (!this.checkedNodeList.length) {
        this.$message.warning('请选择分项！')
        return
      }
      const buildId = this.buildId
      const subentryList = this.checkedNodeList.map(item => {
        let {
          subName,
          number,
          energyUnit,
          expression,
          expressionJson,
          expressionText,
          subType,
          parentCode,
          status
        } = item
        return {
          buildId,
          subName,
          number,
          energyUnit,
          expression,
          expressionJson,
          expressionText,
          subType,
          parentCode,
          status
        }
      })
      this.dialogLoading = true
      this.subentryAdd({ subentryList }).then(res => {
        this.dialogLoading = false
        this.$message.success('新增分项成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        this.dialogLoading = false
        console.error('新增分项失败(errorMessage):', _);
      })
    },
    cancle () { // 关闭表单
      this.$emit('update:addDialogVisible', false)
    },
    getCheckedNodeList () { // 获取编辑对象列表
      let checkedNode = this.$refs.tree.getCheckedNodes()
      let haltCheckecNode = this.$refs.tree.getHalfCheckedNodes()
      let checkedNodeList = [...checkedNode, ...haltCheckecNode].filter(item => !item.disabled)
      // 用缓存中对象替换即将要编辑同一分项对象
      this.cachedNodeList.forEach(cachedItem => {
        for (let index = 0, len = checkedNodeList.length; index < len; index++) {
          const checkedItem = checkedNodeList[index];
          if (checkedItem.number === cachedItem.number) {
            checkedNodeList[index] = cachedItem;
            break;
          }
        }
      });
      checkedNodeList.sort((a, b) => {
        return a.id - b.id
      })
      return JSON.parse(JSON.stringify(checkedNodeList))
    },
    handleExpression () { // 编辑选中分项表达式
      this.checkedNodeList = this.getCheckedNodeList()
      if (!this.checkedNodeList.length) {
        this.$message.warning('请选择分项！')
        return
      }
      this.expressionDialog = true
    },
    stageNodeList (nodeList) { // 缓存编辑过的分项
      // 非此次编辑对象但是为历史编辑对象的集合
      let noExitList = []
      // 避免嵌套循环
      let nodeListNumberStrs = nodeList.map(item => item.number).join(',')
      this.cachedNodeList.forEach(cachedItem => {
        if (`,${nodeListNumberStrs},`.indexOf(`,${cachedItem.number},`) < 0) {
          noExitList.push(cachedItem)
        }
      })
      this.cachedNodeList = JSON.parse(JSON.stringify(nodeList)).concat(noExitList)
    },
    resetExpressionDialog () { // 关闭表达式组件
      this.expressionDialog = false
    }
  },
  watch: {
    addDialogVisible: {
      immediate: true,
      handler: function (val) {
        if (!val) return
        this.initData()
        this.checkedNodeList = []
        this.cachedNodeList = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.SubEntryAdder {
  .btn-group {
    float: right;
  }
  .tree-scrollbar {
    height: 400px;
    margin-bottom: 20px;
    .select-dropdown__wrap {
      max-height: 100%;
      overflow-x: hidden;
    }
    /deep/ .el-tree-node__children {
      // > .el-tree-node:first-child {
      //   display: none;
      // }
    }
    /deep/ .el-scrollbar__bar.is-horizontal {
      display: none;
    }
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    /deep/ .el-checkbox {
      &.is-disabled {
        .el-checkbox__input,
        .is-indeterminate.is-disabled {
          .el-checkbox__inner {
            &::before {
              background-color: unset;
              box-sizing: content-box;
              content: "";
              border: 1px solid #3678ba;
              border-left: 0;
              border-top: 0;
              height: 7px;
              left: 4px;
              position: absolute;
              top: 1px;
              transform: rotate(45deg) scaleY(1);
              width: 3px;
              transition: transform 0.15s ease-in 0.05s;
              transform-origin: center;
            }
          }
        }
      }
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        &::before {
          background-color: #3678ba;
          box-sizing: content-box;
          content: "";
          border: 1px solid #ffffff;
          border-left: 0;
          border-top: 0;
          height: 7px;
          left: 4px;
          position: absolute;
          top: 1px;
          transform: rotate(45deg) scaleY(1);
          width: 3px;
          transition: transform 0.15s ease-in 0.05s;
          transform-origin: center;
        }
      }
    }
  }
}
</style>
