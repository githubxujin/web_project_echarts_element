<template>
  <div class="transformer-editor">
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
          <el-form-item prop="number" label="变压器编号">
            <el-input
              v-model.trim="form.number"
              placeholder="请输入"
              clearable
              :maxlength="16"
              :disabled="isEdit"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="name" label="变压器名称">
            <el-input v-model.trim="form.name" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="position" label="设备安装位置">
            <el-input v-model.trim="form.position" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="capacity" label="容量">
            <el-input v-model.trim="form.capacity " placeholder="请输入" clearable :maxlength="7">
              <span slot="suffix">KVA</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item prop="meterIds" label="包含支路">
          <ProjectTree
            class="project-tree"
            v-model="form.meterIds"
            :dataArray="branchDataArray"
            :defaultProps="branchDefaultProps"
            :checkedLabel="form.meterInfo"
            placeholder
            inputType="textarea"
            :rows="2"
            :showTabs="false"
            :showTitle="false"
            :checkStrictly="true"
            @change="branchChange"
            :anotherStyle="false"
          ></ProjectTree>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="remark" label="备注">
          <el-input
            style="width:520px;"
            type="textarea"
            placeholder="请输入内容"
            v-model.trim="form.remark"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row class="text-center">
        <el-button
          type="primary"
          size="mini"
          @click="submit"
          :loading="submitLoading"
        >{{isEdit ? '确 定' : '新 增'}}</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import ProjectTree from '@/components/projecttree'
import url from '@/axios/url.js'
import { transformerAdd, transformerEdit, meterGetTreeArray } from '@/services/system-settings.js'
import Regexps from '@/utils/regexp.js'
export default {
  components: { ProjectTree },
  props: {
    dialogVisible: Boolean,
    transformerItem: Object
  },
  data () {
    return {
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      form: {
        id: '',
        number: '',
        name: '',
        position: '',
        capacity: '',
        meterIds: [],
        meterInfo: '',
        remark: '',
        shopNumber: ''
      },
      formRules: { // 表单规则
        number: [{ required: true, message: '请输入变压器编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入变压器名称', trigger: 'blur' }],
        capacity: [{ pattern: Regexps.positiveInteger, message: '只能是正整数', trigger: 'blur' }]
      },
      branchDataArray: [], // 支路下拉树选项
      branchDefaultProps: { // project tree选项
        children: 'children',
        label: 'name',
        key: 'id'
      },
      branchCheckedLabel: '请选择支路', //project-tree展示的内容
    }
  },
  computed: {
    isEdit () { // 判断是否编辑
      return Boolean(this.transformerItem)
    },
    params () { // 格式化表单数据
      let params = JSON.parse(JSON.stringify(this.form))
      if (!this.isEdit) {
        params.shopNumber = (this.$store.getters.getUserInfo || {}).shopNumber
      }
      return params
    }
  },
  created () {
    this.initData()
  },
  methods: {
    meterGetTreeArray, // 下拉树请求
    transformerAdd, // 新增用户
    transformerEdit, // 编辑用户
    initData () {
      const shopNumber = this.params.shopNumber
      this.meterGetTreeArray({ shopNumber }).then(res => {
        let dataArr = (res.data || {}).array || []
        this.branchDataArray = [{
          label: "支路",
          type: "branch",
          data: dataArr
        }]
      }).catch(_ => {
        console.error('支路下拉树获取失败(errorMessage):', _);
      })
    },
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'transformerEdit'
      if (!this.isEdit) {
        funName = 'transformerAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增变压器成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑变压器信息失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        switch (prop) {
          case 'meterIds': this.form[prop] = []; break;
          default: this.form[prop] = ''; break;
        }
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$refs.upload && this.$refs.upload.clearFiles()
      this.$emit('update:transformerItem', null)
      this.$emit('update:dialogVisible', false)
    },
    branchChange () { // 支路change事件
      // let checkedNodeList = arguments[1].filter(item => !item.children)
      let labelList = arguments[1].map(item => {
        return `[${item.number}]${item.name}`
      })
      this.form.meterInfo = labelList.join(',') || '请选择支路'
      console.log('branchChange args:', arguments[1], this.form.meterInfo);
    }
  },
  watch: {
    transformerItem: { // 监听transformerItem，获取用户信息
      immediate: true,
      deep: true,
      handler: function (val) {
        if (!val && val !== 0) return
        val.meterIds = val.meterIds || []
        Object.keys(this.form).forEach(prop => {
          this.form[prop] = val[prop]
        }, this)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.transformer-editor {
  .text-center {
    text-align: center;
  }
  .project-tree {
    width: 520px;
  }
}
</style>
