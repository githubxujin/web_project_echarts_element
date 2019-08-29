<template>
  <div class="alexpression">
    <div class="clear">
      <!-- 支路表达式选项 -->
      <div style="width: 320px;display: inline-block;float: left">
        <el-tabs v-model="tabsLabel" type="card">
          <el-tab-pane
            v-for="(tab,index1) in tabsData"
            :key="index1"
            :label="tab.name"
            :name="tab.label"
          >
            <ul class="transferUl">
              <li
                v-for="(item, index2) in tab.resList"
                :key="index2"
                :class="{activated:tabActivatedKeys[index1] == index2}"
                @click="addExpression(item,index2,index1)"
              >
                <span>
                  {{tab.label == 'branch'?`[${item.number}]`:`<${item.number}>`}}
                  {{item.name}}
                </span>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 表达式运算符 -->
      <div style="width:100px;display: inline-block;float: left" class="operator">
        <p class="operationalCharacterTit">运算符</p>
        <div class="operationalCharacter">
          <div
            v-for="(ope, index) in operatorList"
            :class="{numberSty:ope.type =='inputNumber' ? true:false}"
            @click="operatorClick(ope.type)"
            :key="index"
          >{{ope.label}}</div>
        </div>
      </div>
      <!-- 表达式结果 -->
      <div style="width: 320px;display: inline-block;float: left">
        <p class="transdataTit">表达式</p>
        <div class="transdataBox">
          <ul class="transferUl">
            <li
              v-for="(item, index) in expressions"
              :class="{activated:replaceIndex == index}"
              :key="index"
            >
              <div
                style="display: inline-block;min-width: 100px"
                @click="expressionItemClick(index, 'replaceIndex')"
              >
                <span
                  v-if="item.type==='branch'||item.type==='region'||item.type==='org'||item.type==='sub'"
                >{{item.type == 'branch'?`[${item.number}]`:`<${item.number}>`}}{{item.name}}</span>
                <span v-else-if="item.type==='number'">{{item.value}}</span>
                <el-input-number
                  v-else-if="item.type==='inputNumber'"
                  :controls="false"
                  v-model="item.value"
                  @blur="inputBlur(index)"
                ></el-input-number>
                <span v-else>{{item.type || '空'}}</span>
              </div>
              <div class="optionbt" style="display: inline-block;float: right">
                <button @click="handleExpression(index,'up')">
                  <i class="el-icon-sort-up"></i>
                </button>
                <button @click="handleExpression(index,'down')">
                  <i class="el-icon-sort-down"></i>
                </button>
                <button @click="handleExpression(index,'del')">
                  <i class="el-icon-close"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submit">保 存</el-button>
        <el-button @click="cancle">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    // 列表展示参数
    tabsData: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 默认表达式
    defaultExpressions: {
      type: Array,
      default: () => { return [] }
    },
    // 组件展示与否
    visible: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.init()
  },
  data () {
    return {
      tabsLabel: '', // 支路列表
      tabActivatedKeys: {}, // 各tabs选项默认选中样式
      operatorList: [ // 操作符列表
        { type: '+', label: '+' },
        { type: '-', label: '-' },
        { type: '*', label: '*' },
        { type: '/', label: '/' },
        { type: '(', label: '(' },
        { type: ')', label: ')' },
        { type: 'inputNumber', label: '数 字' }
      ],
      replaceIndex: -1,
      expressions: []
    };
  },
  methods: {
    init () { // 初始化
      // 设置默认支路选项激活项
      for (let index in this.tabsData) {
        if (index == 0) {
          this.tabsLabel = this.tabsData[index].label;
        }
        this.tabActivatedKeys[index] = 0;
      }
      // 设置表达式默认选中项
      this.replaceIndex = -1
      this.expressions = JSON.parse(JSON.stringify(this.defaultExpressions))
    },
    submit () { // 保存表达式编辑，并返回
      const isInvalid = this.judgeExpression()
      if (!isInvalid) {
        this.$message({
          showClose: true,
          message: '无效表达式，请检查表达式合法性！',
          type: 'error'
        });
        return
      }
      this.$emit('submit', JSON.parse(JSON.stringify(this.expressions)));
      this.$emit('update:visible', false);
    },
    cancle () { // 取消编辑支路表达式
      this.init()
      this.$emit('cancle', false);
      this.$emit('update:visible', false);
    },
    addExpression (item, i, index) { // 新增或替换表达式元素
      const obj = {
        type: this.tabsLabel,
        name: item.name,
        value: item.id,
        number: item.number
      };
      if (this.replaceIndex >= 0) {
        this.expressions.splice(this.replaceIndex, 1, obj);
      } else {
        this.expressions.push(obj)
      }
      this.tabActivatedKeys[index] = i;
    },
    operatorClick (type) { // 新增或替换表达式元素
      const obj = { type: type };
      if (type == 'inputNumber') {
        obj.value = !this.expressions[this.replaceIndex] ? 0 : this.expressions[this.replaceIndex].value;
      }
      if (this.replaceIndex >= 0) {
        this.expressions.splice(this.replaceIndex, 1, obj);
      } else {
        this.expressions.push(obj)
      }
    },
    expressionItemClick (id, name) { // 表达式元素选中
      if (id == this[name]) {
        this[name] = -1;
      } else {
        this[name] = id;
      }
    },
    handleExpression (index, type) { // 移动表达式元素位置或删除
      if (type == 'del') {
        this.expressions.splice(index, 1)
      } else if (type == 'up' && index > 0) {
        let data = this.expressions[index];
        this.$set(this.expressions, index, this.expressions[index - 1])
        this.$set(this.expressions, index - 1, data)
      } else if (type == 'down' && index < this.expressions.length - 1) {
        let data = this.expressions[index];
        this.$set(this.expressions, index, this.expressions[index + 1])
        this.$set(this.expressions, index + 1, data)
      }
    },
    inputBlur (index) { // 表达式元素输入框失焦
      this.$set(this.expressions[index], 'type', 'number')
    },
    judgeExpression () { // 检查表达式合法性
      console.log('this.expressions:', this.expressions)
      let operatorList = this.operatorList.map(item => {
        return item.type
      }).filter(item => item !== 'inputNumber')
      let expressionsText = ''
      this.expressions.forEach(item => {
        if (operatorList.some(operator => { return operator === item.type })) {
          expressionsText += item.type
        } else {
          expressionsText += ' 1'
        }
      })
      let isInvalid = true
      try {
        eval(expressionsText)
        // 运算符连续
        if (/[\+\-\*\/]{2,}/.test(expressionsText)) {
            isInvalid = false
        }
      }
      catch (_) {
        isInvalid = false
      }
      return isInvalid
    }
  },
  watch: {
    'defaultExpressions': { // 监听传入的默认表达式
      handler: function (val) {
        this.expressions = JSON.parse(JSON.stringify(val))
      }
    },
    'visible': {
      immediate: true,
      handler: function (val) {
        // 每次显示都重新初始化一遍（此visible同v-show绑定值）
        if (val) this.init()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.alexpression {
  /deep/ .el-tabs__nav-wrap {
    margin-left: 0;
  }
  /deep/ .el-tabs__header {
    height: 36px;
    line-height: 36px;
  }
  /deep/ .el-tabs__header {
    margin: 0;
    margin-bottom: -2px;
    line-height: normal;
  }
  /deep/ .el-tabs__item,
  /deep/ .el-tabs__nav-wrap,
  /deep/ .el-tabs__nav.is-top {
    height: 36px;
    line-height: 36px;
  }
  .transferUl li {
    cursor: pointer;
  }

  .activated {
    background-color: #188fbf;
    color: #fff;
  }

  .operator div {
    cursor: pointer;
  }
}
</style>
<style>
.alexpression .el-tabs__item {
  height: 36px;
  line-height: 36px;
}

.alexpression .el-tabs__content {
  overflow: auto;
  height: 360px;
  box-sizing: border-box;
  margin-top: 0;
  padding-top: 15px;
  border: 1px #e4e7ed solid;
  background: rgba(247, 251, 252, 1);
}

.alexpression .el-tabs__content ul.transferUl li span {
  white-space: nowrap;
  padding-left: 10px;
}

.alexpression .el-tabs__item.is-active {
  background: rgba(247, 251, 252, 1);
  color: #188fbf;
  border-bottom: 0;
}

.alexpression .operationalCharacter {
  height: 360px;
  margin: 0 10px;
  border: 1px rgba(228, 231, 239, 1) solid;
}

.alexpression .operationalCharacter div {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

.alexpression .operationalCharacterTit {
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-weight: bold;
  color: #188fbf;
}

.alexpression .operationalCharacter .numberSty {
  border: 1px rgba(195, 201, 213, 1) solid;
  color: #3a3a3a;
  border-radius: 15px;
  font-size: 14px;
  margin: 10px 10px 0 10px;
}

.alexpression .transdataTit {
  height: 36px;
  line-height: 36px;
  padding-left: 10px;
  font-weight: bold;
  color: #188fbf;
}

.alexpression .transdataBox {
  border: 1px rgba(228, 231, 239, 1) solid;
  height: 360px;
  background: #f7fbfc;
  overflow: auto;
}

.alexpression .transdataBox ul li {
  padding: 0 10px;
  border-bottom: 1px rgba(210, 210, 210, 0.3) solid;
}

.alexpression .transdataBox ul li .optionbt button {
  text-align: center;
  border: none;
  color: #c3c9d5;
  cursor: pointer;
  font-size: 14px;
  outline: none;
  font-weight: bold;
  background: transparent;
}

.alexpression .transdataBox ul li .el-input__inner {
  height: 100%;
  line-height: inherit;
}
</style>
