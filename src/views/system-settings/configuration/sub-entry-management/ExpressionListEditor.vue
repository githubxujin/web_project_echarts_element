<template>
  <div class="expression-list-editor">
    <el-scrollbar
      ref="scrollbar"
      class="expression-list-scrollbar"
      tag="div"
      wrap-class="select-dropdown__wrap"
      view-class="el-select-dropdown__list"
    >
      <div class="subentry-item" v-for="(item, index) in nodeList" :key="index">
        <span class="item-label">{{item.subName}}</span>
        <span class="item-content">
          <div
            class="expression-block"
            :title="item.expression"
            @click="handleExpression(item, index)"
          >{{item.expression}}</div>
        </span>
      </div>
    </el-scrollbar>
    <el-button @click="submit" type="primary">确定</el-button>
    <el-button @click="cancle">取消</el-button>
    <!-- 支路表达式弹窗 -->
    <el-dialog
      v-dialogDrag
      title="分项表达式"
      :visible.sync="expressionsDialog"
      width="800px"
      :append-to-body="true"
    >
      <branch-expressions
        ref="expressions"
        :tabsData="expressionsTabsData"
        :defaultExpressions="selectedExpressions"
        :visible.sync="expressionsDialog"
        @submit="expressionsChange"
      ></branch-expressions>
    </el-dialog>
  </div>
</template>
<script>
import BranchExpressions from '@/components/expressions/BranchExpressions.vue'
import { subentryGetArray } from '@/services/system-settings.js'
export default {
  name: 'expression-list-editor',
  components: {
    BranchExpressions
  },
  props: {
    expressionDialog: Boolean,
    checkedNodeList: { // 传入的分项列表
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      nodeList: [], // 编辑后的分项列表
      expressionsDialog: false,
      selectedExpressions: [], // 初始表达式
      expressionsIndex: -1, // 点击的表达式在列表中index位置
      expressionsTabsData: [
        {
          name: '支路选择',
          label: 'branch',
          resList: []
        },
        {
          name: '分项选择',
          label: 'sub',
          resList: []
        }
      ]
    }
  },
  methods: {
    subentryGetArray,
    handleExpression (item, index) { // 点击支路表达式
      this.expressionsIndex = index // 保存编辑表达式的位置
      this.selectedExpressions = item.expressionJson ? JSON.parse(unescape(item.expressionJson || [])) : [];
      const buildId = this.$store.getters.getUserInfo.shopNumber
      this.subentryGetArray({ buildId, subType: item.energyType, includeMeter: true }).then(res => { // 请求对应支路列表和分项列表
        this.expressionsTabsData[0].resList = res.data.meter
        let subentryList = res.data.subentry
        subentryList.forEach(item => {
          item.name = item.subName
        })
        this.expressionsTabsData[1].resList = subentryList
        this.expressionsDialog = true
      }).catch(_ => {
        console.error('请求分项及支路列表数据失败(errorMessage):', _);
      })
    },
    expressionsChange (expressions) { // 保存编辑的表达式
      let expression = "";
      expressions.forEach(item => {
        if (item.type === "branch") {
          expression += `[${item.electricAddr}]${item.name}`;
        } else if (item.type === "number") {
          expression += item.value;
        } else if (item.type === 'sub') {
          expression += `<${item.number}>${item.name}`;
        } else {
          expression += item.type;
        }
      });
      this.$set(this.nodeList[this.expressionsIndex], 'expression', expression) // 设置数据列表显示的表达式
      this.$set(this.nodeList[this.expressionsIndex], 'expressionJson', escape(JSON.stringify(expressions))) // 设置数据列表传送给后端的表达式
    },
    submit () { // 确认表达式编辑完成
      this.$emit('submit', this.nodeList)
      this.cancle()
    },
    cancle () { // 取消表达式编辑
      this.$emit('update:expressionDialog', false)
    },
  },
  watch: {
    'checkedNodeList': {
      immediate: true,
      handler: function (val) {
        if (this.$common.getType(val) !== 'Array') {
          this.nodeList = []
          return
        }
        this.nodeList = JSON.parse(JSON.stringify(val))
        console.log('nodeList', this.nodeList)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.expression-list-editor {
  $height: 50px;
  .subentry-item {
    font-size: 16px;
    line-height: $height;
    height: $height;
    .item-label {
      float: left;
      width: 150px;
      line-height: 32px;
    }
    .item-content {
      display: block;
      margin-left: 150px;
      height: $height;
      .expression-block {
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        display: block;
        height: 32px;
        line-height: 32px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: rgb(247, 247, 247);
        padding: 0 10px;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }
  .expression-list-scrollbar {
    height: 400px;
    margin-bottom: 20px;
    .select-dropdown__wrap {
      max-height: 100%;
      overflow-x: hidden;
    }
    /deep/ .el-scrollbar__bar.is-horizontal {
      display: none;
    }
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>

