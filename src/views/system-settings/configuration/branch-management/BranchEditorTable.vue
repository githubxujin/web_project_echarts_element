<template>
  <div class="branch-editor-table">
    <el-form :model="form" ref="ruleForm" inline>
      <el-table
        :data="form.tableDataList"
        height="200"
        border
        style="width: 100%;margin-bottom: 10px"
        empty-text=" "
      >
        <el-table-column
          width="50"
          header-align="center"
          align="center"
          :render-header="renderAddTag"
        >
          <template style="cursor: pointer" slot-scope="scope">
            <i
              style="cursor: pointer"
              class="el-icon-remove-outline"
              @click="delTableData(scope.$index)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="gatherOrder" label="采集命令" header-align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="`tableDataList[${scope.$index}].gatherOrder`"
              :rules="[selectRule]"
            >
              <el-select v-model="form.tableDataList[scope.$index].gatherOrder" placeholder="请选择">
                <el-option
                  v-for="item in (dicts || {})['tachoList'] || []"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="energyType" label="能耗类型" header-align="center">
          <template slot-scope="scope">
            <el-form-item :prop="`tableDataList[${scope.$index}].energyType`" :rules="[selectRule]">
              <el-select v-model="form.tableDataList[scope.$index].energyType" placeholder="请选择">
                <el-option
                  v-for="item in (dicts || {})['energyTypeList'] || []"
                  :label="item.name"
                  :value="item.number"
                  :key="item.number"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="valueType" label="数值类型" header-align="center" width="120px">
          <template slot-scope="scope">
            <el-form-item :prop="`tableDataList[${scope.$index}].valueType`" :rules="[selectRule]">
              <el-select v-model="form.tableDataList[scope.$index].valueType" placeholder="请选择">
                <el-option
                  v-for="item in (dicts || {})[18] || []"
                  :label="item.configName"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="ratedPower" label="额定功率" header-align="center" width="100px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`tableDataList[${scope.$index}].ratedPower`"
              :rules="[inputRule,numberRule,integerRule]"
            >
              <el-input v-model.trim="form.tableDataList[scope.$index].ratedPower" :maxlength="8"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" header-align="center" width="120px">
          <template slot-scope="scope">
            <el-form-item :prop="`tableDataList[${scope.$index}].unit`" :rules="[selectRule]">
              <el-select v-model="form.tableDataList[scope.$index].unit" placeholder="请选择">
                <el-option
                  v-for="item in (dicts || {})[32] || []"
                  :label="item.configName"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="ratio" label="变比" header-align="center" width="100px">
          <template slot-scope="scope">
            <el-form-item :prop="`tableDataList[${scope.$index}].ratio`" :rules="[numberRule]">
              <el-input v-model.trim="form.tableDataList[scope.$index].ratio" :maxlength="9"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="upperLimit" label="上限" header-align="center" width="100px">
          <template slot-scope="scope">
            <el-form-item :prop="`tableDataList[${scope.$index}].upperLimit`" :rules="[numberRule]">
              <el-input v-model.trim="form.tableDataList[scope.$index].upperLimit" :maxlength="9"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="lowerLimit" label="下限" header-align="center" width="100px">
          <template slot-scope="scope">
            <el-form-item :prop="`tableDataList[${scope.$index}].lowerLimit`" :rules="[numberRule]" >
              <el-input v-model.trim="form.tableDataList[scope.$index].lowerLimit" :maxlength="9"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="expression" label="支路表达式" header-align="center">
          <template slot-scope="scope">
            <div
              class="expression-block"
              :title="scope.row.expression"
              @click="handleExpression(scope.row, scope.$index)"
            >{{scope.row.expression}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- 支路表达式弹窗 -->
    <el-dialog
      v-dialogDrag
      title="支路表达式"
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
import Regexps from '@/utils/regexp.js'
export default {
  name: 'branch-editor-table',
  components: { BranchExpressions },
  props: {
    dicts: {
      type: Object,
      default: null
    },
    gathers: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      Regexps, // 正则集合
      form: {
        tableDataList: []
      },
      expressionsDialog: false,
      selectedExpressions: [],
      expressionsIndex: -1,
      selectRule: {
        required: true,
        message: '必选',
        trigger: 'change'
      },
      inputRule: {
        required: true,
        message: '必填',
        trigger: 'blur'
      },
      numberRule: {
        pattern: Regexps.positiveNumber, message: '仅支持正数', trigger: 'blur'
      },
      integerRule: {
        pattern: Regexps.integerNumber, message: '必须为整数', trigger: 'blur'
      }
    }
  },
  computed: {
    expressionsTabsData () {
      return [
        {
          name: '支路选择',
          label: 'branch',
          resList: (this.dicts || {}).meterList || []
        }
      ]
    }
  },
  methods: {
    addTableData () {  // 新增一条数据
      this.form.tableDataList.push({
        gatherOrder: '', //采集命令
        energyType: '', //能耗类型
        valueType: '', //数值类型
        ratedPower: '', //额定功率
        unit: '', //能耗单位
        ratio: '', //变比
        upperLimit: '', //上限
        lowerLimit: '', //下限
        expressionJson: '', //支路表达式 
        expression: ''
      });
    },
    delTableData (index) { // 删除一条数据
      this.form.tableDataList.splice(index, 1)
    },
    handleExpression (row, index) { // 点击支路表达式
      this.expressionsIndex = index // 保存编辑表达式的位置
      this.selectedExpressions = row.expressionJson ? JSON.parse(unescape(row.expressionJson)) : [];
      this.expressionsDialog = true
    },
    expressionsChange (expressions) {
      console.log('expressions:', expressions);
      let expression = "";
      expressions.forEach(item => {
        if (item.type == "branch") {
          expression += "[" + item.number + "]";
        } else if (item.type == "number") {
          expression += item.value;
        } else {
          expression += item.type;
        }
      });
      this.$set(this.form.tableDataList[this.expressionsIndex], 'expression', expression) // 设置数据列表显示的支路表达式
      this.$set(this.form.tableDataList[this.expressionsIndex], 'expressionJson', escape(JSON.stringify(expressions))) // 设置数据列表传送给后端的支路表达式
    },
    renderAddTag (h) { // 新增支路数据表头渲染函数
      return h(
        'i',
        {
          'class': {
            'el-icon-plus': true
          },
          style: {
            cursor: 'pointer'
          },
          attrs: {
            title: '新增一条数据'
          },
          on: {
            click: this.addTableData
          }
        }
      )
    }
  },
  watch: {
    'gathers': {
      immediate: true,
      handler: function (val) {
        if (JSON.stringify(val || []) === JSON.stringify(this.form.tableDataList || [])) return
        this.form.tableDataList = JSON.parse(JSON.stringify(val))
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.branch-editor-table {
  .expression-block {
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
  /deep/ .el-form-item {
    margin-bottom: auto;
    margin-right: auto;
    &.is-error {
      margin-bottom: 20px;
    }
  }
  /deep/ .el-form-item--small {
    min-height: auto;
    line-height: normal;
  }
}
</style>
