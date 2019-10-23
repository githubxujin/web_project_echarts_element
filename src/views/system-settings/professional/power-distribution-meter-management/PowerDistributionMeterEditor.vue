<template>
  <div class="power-distribution-meter-editor">
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
          <el-form-item prop="name" label="参数名称">
            <el-input v-model.trim="form.name" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="meterId" label="所属支路">
            <el-select v-model="form.meterId" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in meterList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="gatherOrder" label="采集命令">
            <el-select v-model="form.gatherOrder" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in tachoList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="dataType" label="数据类型">
            <el-select v-model="form.dataType" placeholder="请选择" :disabled="isEdit">
              <el-option
                v-for="item in paramStateEnum"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="form.dataType === 0">
        <el-col :span="12">
          <el-form-item prop="upperLimit" label="上限">
            <el-input v-model.trim="form.upperLimit" placeholder="请输入" clearable :maxlength="9"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="lowerLimit" label="下限">
            <el-input v-model.trim="form.lowerLimit" placeholder="请输入" clearable :maxlength="9"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-show="form.dataType === 1"
        v-for="(item, index) in form.powerPointTableMappingList"
        :key="item.copyId || item.id"
      >
        <el-col :span="12">
          <el-form-item
            class="is-required"
            :prop="`powerPointTableMappingList[${index}].returnValue`"
            label="返回值"
            :rules="[{
                      validator: (rule, value, callback) => {
                        return validateReturnValue(rule, value, callback, index)
                      },
                      trigger: 'blur'
                    }]"
          >
            <el-input v-model.trim="item.returnValue" placeholder="请输入" :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            class="is-required"
            :prop="`powerPointTableMappingList[${index}].returnValueDesc`"
            label="值含义"
            :rules="[{
                      validator: (rule, value, callback) => {
                        return validateReturnValueDesc(rule, value, callback, index)
                      },
                      trigger: 'blur'
                    }]"
          >
            <el-input v-model.trim="item.returnValueDesc" placeholder="请输入" :maxlength="16"></el-input>
          </el-form-item>
          <i
            v-show="index > 0 && !item.id && item.id !== 0"
            @click="deleteFormParam(index)"
            class="el-icon-remove-outline delete params-icon"
          ></i>
          <i
            v-show="index === 0"
            @click="addFormParam"
            class="el-icon-circle-plus-outline add params-icon"
          ></i>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="unit" label="单位">
            <el-select v-model="form.unit" placeholder="请选择" clearable>
              <el-option
                v-for="item in unitList"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
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
        <el-form-item prop="remark" label="备注">
          <el-input
            style="width:520px;"
            type="textarea"
            placeholder="请输入内容"
            v-model.trim="form.remark"
            maxlength="200"
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
import { powerDistributionMeterGetInfo, powerDistributionMeterAdd, powerDistributionMeterEdit, configTypeQuery, tachometerGetArray } from '@/services/system-settings.js'
import axios from '@/axios/axios.js'
import Regexps from '@/utils/regexp.js'
import { statusEnum, paramStateEnum } from '@/enum/dicts.js'
let RegexpNumber = /^[+-]{0,1}(\d+)$|^[+-]{0,1}(\d+\.\d{0,2})$/;
export default {
  components: {},
  props: {
    editDialogVisible: Boolean,
    powerDistributionMeterId: {
      type: [String, Number],
      default: () => null
    },
    meterList: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    const numberRule = {
      pattern: Regexps.number, message: '仅支持数字', trigger: 'blur'
    }
    return {
      paramStateEnum, // 数值/枚举
      statusEnum,
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      tachoList: [], // 采集命令下拉列表
      unitList: [], // 单位列表
      form: {
        id: '',
        name: '',
        meterId: '',
        gatherOrder: '',
        dataType: 0,
        upperLimit: '',
        lowerLimit: '',
        powerPointTableMappingList: [JSON.parse(JSON.stringify(this.paramObj))],
        unit: '',
        status: 0,
        remark: '',
        shopNumber: ''
      },
      formRules: { // 表单规则
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        gatherOrder: [{ required: true, message: '请选择采集命令', trigger: 'blur' }],
        meterId: [{ required: true, message: '请选择所属支路', trigger: 'change' }],
        dataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
        upperLimit: [numberRule, {
          validator: this.validateUpperLimit, trigger: 'blur'
        }],
        lowerLimit: [numberRule, {
          validator: this.validateLowerLimit, trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    paramObj: {
      cache: false,
      get () {
        const copyId = new Date().getTime()
        return {
          copyId,
          returnValue: '',
          returnValueDesc: ''
        }
      }
    },
    isEdit () { // 判断是否编辑
      return Boolean(this.powerDistributionMeterId)
    },
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      // 如果是新增则用当前登陆者的shopNumber
      params.shopNumber = params.shopNumber || this.$store.getters.getUserInfo.shopNumber
      if (params.dataType !== 1) { // 如果不是枚举类型则清空枚举列表
        params.pointTableMappingList = []
      }
      if (params.dataType !== 0) { // 如果不是数值类型则清空上下限
        params.upperLimit = null
        params.lowerLimit = null
      }
      return params
    },
    mappingValueList () {
      const MappingValueList = this.form.powerPointTableMappingList.filter(item => {
        return Boolean(item.returnValue || item.returnValue === 0)
      }).map(item => {
        return `${item.returnValue}`
      })
      return MappingValueList
    },
    mappingDescList () {
      const MappingDescList = this.form.powerPointTableMappingList.filter(item => {
        return Boolean(item.returnValueDesc || item.returnValueDesc === 0)
      }).map(item => item.returnValueDesc)
      return MappingDescList
    },
  },
  created () {
    this.initData()
  },
  methods: {
    powerDistributionMeterGetInfo, // 获取配电参数详情
    powerDistributionMeterAdd, // 新增配电参数
    powerDistributionMeterEdit, // 编辑配电参数
    configTypeQuery, // 获取单位列表
    tachometerGetArray, // 获取采集命令列表
    initData () {
      this.dialogLoading = true
      const configType = [32] // 32 单位
      const shopNumber = this.params.shopNumber
      axios.all([this.configTypeQuery({ configType }), this.tachometerGetArray({ shopNumber, deviceType: -1 })]).then(axios.spread((...args) => {
        this.unitList = args[0].data[32]
        this.tachoList = args[1].data.array || []
        this.dialogLoading = false
      })).catch(_ => {
        this.dialogLoading = false
      })
    },
    addFormParam () {
      this.form.powerPointTableMappingList.push(JSON.parse(JSON.stringify(this.paramObj)))
    },
    deleteFormParam (index) {
      this.form.powerPointTableMappingList.splice(index, 1)
    },
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'powerDistributionMeterEdit'
      if (!this.isEdit) {
        funName = 'powerDistributionMeterAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增配电参数成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑配电参数失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = ''
      }, this)
      this.form.dataType = this.form.status = 0
      this.form.powerPointTableMappingList = [JSON.parse(JSON.stringify(this.paramObj))]
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:powerDistributionMeterId', null)
      this.$emit('update:editDialogVisible', false)
    },
    validateReturnValue (rule, value, callback, index) {
      if (this.form.dataType !== 1) return callback()
      if (!value && value !== 0) {
        return callback(new Error('请输入返回值'))
      }
      if (!/^[+-]{0,1}(\d+)$/.test(value)) {
        return callback(new Error('请输入整数'))
      }
      let mappingValueList = this.mappingValueList.filter((item, itemIndex) => itemIndex !== index)
      if (mappingValueList.some(val => val === value)) {
        return callback(new Error('返回值重复'))
      }
      return callback()
    },
    validateReturnValueDesc (rule, value, callback, index) {
      if (this.form.dataType !== 1) return callback()
      if (!value && value !== 0) {
        return callback(new Error('请输入值含义'))
      }
      let mappingDescList = this.mappingDescList.filter((item, itemIndex) => itemIndex !== index)
      if (mappingDescList.some(val => val === value)) {
        return callback(new Error('值含义重复'))
      }
      return callback()
    },
    validateUpperLimit (rule, value, callback) {
      if (!RegexpNumber.test(this.form.upperLimit) || !RegexpNumber.test(this.form.lowerLimit)) {
        if (value && !RegexpNumber.test(value)) {
          return callback(new Error('仅输入数字且保留两位小数'))
        }
        return callback()
      }
      if ((value || value === 0) && (this.form.lowerLimit || this.form.lowerLimit === 0) && parseInt(value) < parseInt(this.form.lowerLimit)) {
        return callback(new Error('上限不能低于下限'))
      }
      return callback()
    },
    validateLowerLimit (rule, value, callback) {
      if (!RegexpNumber.test(this.form.upperLimit) || !RegexpNumber.test(this.form.lowerLimit)) {
        if (value && !RegexpNumber.test(value)) {
          return callback(new Error('仅输入数字且保留两位小数'))
        }
        return callback()
      }
      if ((value || value === 0) && (this.form.upperLimit || this.form.upperLimit === 0) && parseInt(value) > parseInt(this.form.upperLimit)) {
        return callback(new Error('下限不能高于上限'))
      }
      return callback()
    }
  },
  watch: {
    editDialogVisible: { // 监听editDialogVisible，获取配电参数信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible || !this.powerDistributionMeterId && this.powerDistributionMeterId !== 0) return
        this.powerDistributionMeterGetInfo({ id: this.powerDistributionMeterId }).then(res => {
          let data = res.data || {}
          Object.keys(this.form).forEach(prop => {
            let value = data[prop]
            this.form[prop] = value
          }, this)
          if (!this.form.powerPointTableMappingList || !this.form.powerPointTableMappingList.length) {
            this.form.powerPointTableMappingList = [JSON.parse(JSON.stringify(this.paramObj))]
          }
          this.$nextTick(_ => {
            this.$refs.form && this.$refs.form.clearValidate()
          })
        })
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
.power-distribution-meter-editor {
  .text-center {
    text-align: center;
  }
  .params-icon {
    margin-top: 6px;
    vertical-align: middle;
    font-size: 20px;
    color: #1982bf;
    cursor: pointer;
    &.delete {
      color: #ff3366;
    }
  }
}
</style>

