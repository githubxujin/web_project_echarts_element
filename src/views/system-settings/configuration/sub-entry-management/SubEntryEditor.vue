<template>
  <div class="subentry-editor">
    <el-form
      v-loading="dialogLoading"
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="90px"
      size="mini"
      inline
      :label-position="'left'"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="number" label="分项编号">
            <el-input v-model.trim="form.number" placeholder="请输入" :maxlength="16" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="subName" label="分项名称">
            <el-input
              :disabled="true"
              v-model.trim="form.subName"
              placeholder="请输入"
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="energyType" label="能耗类型">
            <el-select v-model="form.energyType" placeholder="全部" :disabled="true">
              <el-option
                v-for="(item,index) in energyTypeEnum"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="energyUnit" label="能耗单位">
            <el-select v-model="form.energyUnit" placeholder="全部" :disabled="true">
              <el-option
                v-for="(item,index) in unitList"
                :key="index"
                :label="item.configName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="parentCode" label="所属分项">
            <el-input
              :disabled="true"
              v-model.trim="form.parentName"
              placeholder="请输入"
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="status" label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                :key="index"
                v-for="(item, index) in statusEnum"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item prop="expression" label="分项表达式">
          <div
            class="expression-block"
            :title="form.expression"
            @click="handleExpression"
          >{{form.expression}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="descr" label="描述信息">
          <el-input
            style="width:520px;"
            type="textarea"
            placeholder="请输入内容"
            v-model.trim="form.descr"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row class="text-center">
        <el-button type="primary" size="mini" @click="submit" :loading="submitLoading">确 定</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-row>
    </el-form>
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
import TreeSelect from '@/components/treeSelect'
import { subentryAdd, subentryEdit, configTypeQuery, subentryGetArray } from '@/services/system-settings.js'
import { energyTypeEnum, statusEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
import axios from '@/axios/axios.js'
export default {
  components: { TreeSelect, BranchExpressions },
  props: {
    dialogVisible: Boolean,
    subentryItem: Object
  },
  data () {
    return {
      energyTypeEnum,
      statusEnum,
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      form: {
        id: '',
        number: '',
        subName: '',
        energyType: '',
        energyUnit: '',
        parentCode: '',
        expression: '',
        expressionJson: '',
        expressionText: '',
        subentryInfo: '',
        descr: '',
        shopNumber: '',
        status: '',
        parentName:''
      },
      formRules: { // 表单规则
        // number: [{ required: true, message: '请填写分项编号', trigger: 'blur' }],
        // subName: [{ required: true, message: '请填写分项名称', trigger: 'blur' }]
      },
      unitList: [], // 能耗下拉列表
      treeData: [], // 分项下拉列表
      defaultProps: { // treeSelect默认属性
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      selectedExpressions: [], // 传入支路表达式列表
      expressionsDialog: false,
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
  computed: {
    params () { // 格式化表单数据
      let params = JSON.parse(JSON.stringify(this.form))
      return params
    }
  },
  created () {
    this.initData()
  },
  methods: {
    subentryAdd, // 新增用户
    subentryEdit, // 编辑用户
    configTypeQuery, // 全局配置
    subentryGetArray, // 获取分项对应支路列表及分项列表
    initData () { // 初始化能耗单位列表
      const shopNumber = this.params.shopNumber
      const configType = 32
      this.configTypeQuery({ configType }).then(res => {
        this.unitList = (res.data || {})[32] // 能耗单位列表
      }).catch(_ => {
        console.error('能耗单位列表获取失败(errorMessage):', _);
      })
    },
    submit () { // 提交编辑
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      this.dialogLoading = true
      this.subentryEdit(this.params).then(res => {
        this.dialogLoading = false
        this.$message.success('编辑成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑分项信息失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = ''
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$refs.upload && this.$refs.upload.clearFiles()
      this.$emit('update:subentryItem', null)
      this.$emit('update:dialogVisible', false)
    },
    handleExpression () { // 点击编辑支路表达式
      this.selectedExpressions = this.form.expressionJson ? JSON.parse(unescape(this.form.expressionJson)) : [];
      const shopNumber = this.params.shopNumber
      this.subentryGetArray({ shopNumber, energyType: this.form.energyType, includeMeter: true }).then(res => {
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
    expressionsChange (expressions) { // 保存编辑的表达式到表单form
      let expression = "";
      expressions.forEach(item => {
        if (item.type === "branch") {
          expression += `[${item.number}]${item.name}`;
        } else if (item.type === "number") {
          expression += item.value;
        } else if (item.type === 'sub') {
          expression += `<${item.number}>${item.name}`;
        } else {
          expression += item.type;
        }
      });
      this.form.expression = expression // 设置数据列表显示的表达式
      this.form.expressionJson = escape(JSON.stringify(expressions)) // 设置数据列表传送给后端的表达式
    }
  },
  watch: {
    subentryItem: { // 监听subentryItem，获取分项信息
      immediate: true,
      deep: true,
      handler: function (val) {
        if (!val && val !== 0) return
        Object.keys(this.form).forEach(prop => {
          this.form[prop] = val[prop]
        }, this)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.subentry-editor {
  .text-center {
    text-align: center;
  }
  .expression-block {
    display: block;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    width: 520px;
    height: 32px;
    line-height: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px;
    box-sizing: border-box;
    cursor: pointer;
  }
}
</style>
