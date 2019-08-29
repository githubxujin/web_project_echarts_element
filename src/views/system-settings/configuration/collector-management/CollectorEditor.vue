<template>
  <div class="collector-editor">
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
          <el-form-item prop="number" label="采集器编号">
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
          <el-form-item prop="name" label="采集器名称">
            <el-input v-model.trim="form.name" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="ipAddress" label="采集器IP地址">
            <el-input v-model.trim="form.ipAddress" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="installAddress" label="设备安装地址">
            <el-input
              v-model.trim="form.installAddress"
              placeholder="请输入"
              clearable
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item prop="belongTo" label="所属系统">
            <TreeSelect
              v-model="form.belongTo"
              :data="systemTypeList"
              placeholder="请选择"
              :clearable="true"
            ></TreeSelect>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item prop="online" label="是否在线">
            <el-radio-group v-model="form.online">
              <el-radio
                :key="index"
                v-for="(item, index) in yesOrNoEnum"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="status" label="采集器状态">
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
        <el-col :span="24">
          <el-form-item prop="coms" label="采集器端口" label-width="100%">
            <ComInputGroup v-model="form.coms"></ComInputGroup>
          </el-form-item>
        </el-col>
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
import ComInputGroup from './ComInputGroup'
import TreeSelect from '@/components/treeSelect'
import { collectorGetInfo, collectorGetArray, configTypeTreeQuery, collectorAdd, collectorEdit, configTypeQuery, getSystemType } from '@/services/system-settings.js'
import { yesOrNoEnum, statusEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
export default {
  components: { ComInputGroup, TreeSelect },
  props: {
    editDialogVisible: Boolean,
    collectorItem: {
      type: Object,
      default: () => null
    }
  },
  data () {
    var validateComs = function (rule, value, callback) {
      let valList = value.map(item => { // 取值
        return item.value
      })
      if (!valList.length || valList.join(',') === '') return callback(new Error('请输入采集器端口'))
      if (Array.from(new Set(valList)).length !== valList.length) return callback(new Error('请不要输入重复的采集器端口'))
      return callback()
    }
    return {
      yesOrNoEnum, // 是，否
      statusEnum, // 启用，禁用
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      systemTypeList: [], // 系统类型列表
      form: {
        id: '',
        number: '',
        name: '',
        ipAddress: '',
        installAddress: '',
        belongTo: '',
        online: 0,
        status: 0,
        coms: [],
        comStatus: {},
        shopNumber: ''
      },
      formRules: { // 表单规则
        number: [{ required: true, message: '请输入采集器编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入采集器名称', trigger: 'blur' }],
        ipAddress: [{ pattern: Regexps.ip, message: 'ip地址格式不正确', trigger: 'blur' }],
        coms: [
          { type: 'array', required: true, message: '请输入采集器端口', trigger: 'blur' },
          { validator: validateComs, trigger: 'change' }
        ],
      }
    }
  },
  computed: {
    fileList () { // 头像文件集合
      if (!this.form.picture) return []
      return [{ name: this.form.pictureName, url: this.form.picture }]
    },
    isEdit () { // 判断是否编辑
      return Boolean(this.collectorItem)
    },
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      // 如果是新增则用当前登陆者的shopNumber
      params.shopNumber = params.shopNumber || this.$store.getters.getUserInfo.shopNumber
      params.coms = params.coms.map(item => item.value).filter(item => item).join(',')
      return params
    }
  },
  created () {
    // this.initData()
  },
  methods: {
    collectorGetArray, // 获取采集器列表
    collectorGetInfo, // 获取采集器信息
    collectorAdd, // 新增采集器
    collectorEdit, // 编辑采集器
    configTypeQuery, // 获取所属系统列表
    configTypeTreeQuery,
    getSystemType,
    initData () {
      this.dialogLoading = true
      this.getSystemType().then(res => {
        this.dialogLoading = false
        this.systemTypeList = res.data.array
      }).catch(_ => {
        this.dialogLoading = false
        console.error('获取系统列表失败(errorMessage)：', _);
      })
    },
    validateForm () { // 对端口长度进行校验
      return this.params.coms.length > 64;
    },
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      result = this.validateForm();
      if (result) {
        this.$message.error('采集器端口总长度请限制在64字符以内')
        return
      }
      let funName = 'collectorEdit'
      if (!this.isEdit) {
        funName = 'collectorAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增采集器成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑采集器失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        // 是否在线 及状态默认值值为0;端口默认为空数组
        switch (prop) {
          case 'coms': this.form[prop] = []; break;
          case 'comStatus': this.form[prop] = {}; break;
          case 'online': this.form[prop] = 0; break;
          case 'status': this.form[prop] = 0; break;
          default: this.form[prop] = ''; break;
        }
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:collectorItem', null)
      this.$emit('update:editDialogVisible', false)
    }
  },
  watch: {
    editDialogVisible: { // 监听editDialogVisible，获取采集器信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        let val = this.collectorItem
        if (!visible || !val) return
        val = JSON.parse(JSON.stringify(val))
        val.coms = val.coms ? val.coms.split(',') : []
        val.coms = val.coms.map(item => {
          return {
            value: item,
            disabled: (val.comStatus || {}).hasOwnProperty(item)
          }
        })
        Object.keys(this.form).forEach(prop => {
          let value = val[prop]
          // coms字符串split为[]
          this.form[prop] = value
        }, this)
        this.$nextTick(_ => {
          this.$refs.form && this.$refs.form.clearValidate()
        })
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
.collector-editor {
  .text-center {
    text-align: center;
  }
}
</style>

