<template>
  <div class="tachometer-editor">
    <el-form
      v-loading="dialogLoading"
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="105px"
      size="mini"
      inline
      :label-position="'left'"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="code" label="参数编号">
            <el-input
              v-model.trim="form.code"
              placeholder="请输入"
              clearable
              :maxlength="16"
              :disabled="isEdit"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="name" label="参数名称">
            <el-input v-model.trim="form.name" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="deviceType" label="计量设备类型">
            <el-select v-model="form.deviceType" placeholder="请选择" clearable>
              <el-option
                v-for="item in deviceTypeList"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="dataType" label="数据类型">
            <el-select v-model="form.dataType" placeholder="请选择">
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
      <el-row v-show="form.dataType !== 1">
        <el-col :span="12">
          <el-form-item prop="upperLimit" label="上限">
            <el-input v-model.trim="form.upperLimit" placeholder="请输入" clearable :maxlength="10"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="lowerLimit" label="下限">
            <el-input v-model.trim="form.lowerLimit" placeholder="请输入" clearable :maxlength="10"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-show="form.dataType === 1"
        v-for="(item, index) in form.tachometerMappingList"
        :key="item.copyId || item.id"
      >
        <el-col :span="12">
          <el-form-item
            class="is-required input-with-select"
            :prop="`tachometerMappingList[${index}].returnValue`"
            label="返回值"
            :rules="[{
                      validator: (rule, value, callback) => {
                        return validateReturnValue(rule, value, callback, index)
                      },
                      trigger: 'blur'
                    }]"
          >
            <el-input v-model.trim="item.returnValue" placeholder="请输入" :maxlength="16">
              <!-- <el-select v-model="item.operator" slot="prepend" class="select-with-input">
                <el-option
                  v-for="item in symbolEnum"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>-->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            class="is-required"
            :prop="`tachometerMappingList[${index}].returnValueDesc`"
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
            v-show="index > 0"
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
          <el-form-item prop="paramType" label="参数类型">
            <el-select v-model="form.paramType" placeholder="请选择">
              <el-option
                v-for="item in energyList"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="energyUnit" label="单位">
            <el-select v-model="form.energyUnit" placeholder="请选择">
              <el-option
                v-for="item in unitList"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="calculateType" label="数据计算类型">
            <el-select v-model="form.calculateType" placeholder="请选择">
              <el-option
                v-for="item in calculateTypeEnum"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="decimalLength" label="小数点位数">
            <el-input v-model.trim="form.decimalLength" placeholder="请输入" clearable :maxlength="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="command1" label="命令一">
            <el-input v-model.trim="form.command1" placeholder="请输入" clearable :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="command2" label="命令二">
            <el-input v-model.trim="form.command2" placeholder="请输入" clearable :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="command3" label="命令三">
            <el-input v-model.trim="form.command3" placeholder="请输入" clearable :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="consolidateData" label="表计合并点数据">
            <el-input
              v-model.trim="form.consolidateData"
              placeholder="请输入"
              clearable
              :maxlength="64"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="param" label="是否参数">
            <el-radio-group v-model="form.param">
              <el-radio
                :key="index"
                v-for="(item, index) in yesOrNoEnum"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="readCommand" label="采集读数命令">
            <el-radio-group v-model="form.readCommand">
              <el-radio
                :key="index"
                v-for="(item, index) in yesOrNoEnum"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
const paramObj = { copyId: new Date().getTime(), returnValue: '', returnValueDesc: '' }
import { tachometerAdd, tachometerEdit, configTypeQuery, tachometerGetInfo } from '@/services/system-settings.js'
import { yesOrNoEnum, statusEnum, paramStateEnum, symbolEnum, calculateTypeEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js';
let RegexpNumber = /^[+-]{0,1}(\d+)$|^[+-]{0,1}(\d+\.\d{0,2})$/;
import { meterGetEnergyHTypeArray, dictGetArray } from '@/services/system-settings.js'
export default {
  components: {},
  props: {
    editDialogVisible: Boolean,
    tachometerItem: {
      type: Object,
      default: () => null
    }
  },
  data () {
    const numberRule = {
      pattern: Regexps.number, message: '仅支持数字', trigger: 'blur'
    }
    return {
      yesOrNoEnum, // 是/否
      statusEnum, // 启用，禁用
      paramStateEnum, // 数值/枚举
      symbolEnum, // 逻辑符号<>!=
      Regexps, // 正则集合
      calculateTypeEnum, // 运算类型集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      deviceTypeList: [], // 设备类型列表
      form: {
        id: '',
        code: '',
        name: '',
        deviceType: '',
        dataType: 0,
        tachometerMappingList: [JSON.parse(JSON.stringify(this.paramObj))],
        calculateType: 1,
        decimalLength: '',
        upperLimit: '',
        lowerLimit: '',
        paramType: '',
        energyUnit: '',
        command1: '',
        command2: '',
        command3: '',
        consolidateData: '',
        param: 0,
        status: 0,
        readCommand: 0,
        shopNumber: ''
      },
      energyList: [], // 能耗类型列表
      unitList: [], // 单位列表
      formRules: { // 表单规则
        code: [{ required: true, message: '请输入参数编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        paramType: [{ required: true, message: '请选择参数类型', trigger: 'change' }],
        deviceType: [{ required: true, message: '请选择计量设备类型', trigger: 'change' }],
        decimalLength: [{ validator: this.validateDecimalLength, trigger: 'blur' }],
        upperLimit: [numberRule, {
          validator: this.validateUpperLimit, trigger: 'blur'
        }],
        lowerLimit: [numberRule, {
          validator: this.validateLowerLimit, trigger: 'blur'
        }],
        consolidateData: [{ pattern: Regexps.number, message: '只能是数字', trigger: 'blur' }]
      }
    }
  },
  computed: {
    paramObj: {
      cache: false,
      get: function () {
        let paramObjCopy = JSON.parse(JSON.stringify(paramObj))
        paramObjCopy.copyId = new Date().getTime()
        return paramObjCopy
      }
    },
    mappingValueList () {
      const MappingValueList = this.form.tachometerMappingList.filter(item => {
        return Boolean(item.returnValue || item.returnValue === 0)
      }).map(item => {
        return `${item.returnValue}`
      })
      return MappingValueList
    },
    mappingDescList () {
      const MappingDescList = this.form.tachometerMappingList.filter(item => {
        return Boolean(item.returnValueDesc || item.returnValueDesc === 0)
      }).map(item => item.returnValueDesc)
      return MappingDescList
    },
    isEdit () { // 判断是否编辑
      return Boolean(this.tachometerItem)
    },
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      // 如果是新增则用当前登陆者的shopNumber
      params.shopNumber = params.shopNumber || this.$store.getters.getUserInfo.shopNumber
      if (params.dataType !== 1) { // 如果不是枚举类型则清空枚举列表
        params.tachometerMappingList = []
      }
      if (!params.decimalLength && params.decimalLength !== 0) delete params.decimalLength
      if (!params.consolidateData && params.consolidateData !== 0) delete params.consolidateData
      return params
    }
  },
  created () {
    this.initData()
  },
  methods: {
    tachometerAdd, // 新增表计参数
    tachometerEdit, // 编辑表计参数
    configTypeQuery, // 获取设备类型 及 数据类型列表
    tachometerGetInfo, // 获取详情
    initData () {
      this.dialogLoading = true
      const configType = 15
      this.configTypeQuery({ configType }).then(res => {
        this.dialogLoading = false
        this.deviceTypeList = res.data[configType]
      }).catch(_ => {
        this.dialogLoading = false
        console.error('获取计量设备类型及数据类型列表失败(errorMessage)：', _);
      })
      // 单位列表接口
      dictGetArray({ configType: '32,101' }).then(res => {
        this.energyList = res.data['101'];
        this.unitList = res.data['32']
      })
    },
    addFormParam () {
      this.form.tachometerMappingList.push(JSON.parse(JSON.stringify(this.paramObj)))
    },
    deleteFormParam (index) {
      this.form.tachometerMappingList.splice(index, 1)
    },
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'tachometerEdit'
      if (!this.isEdit) {
        funName = 'tachometerAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增表计参数成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑表计参数失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        if (['param', 'status', 'readCommand', 'dataType'].includes(prop)) { this.form[prop] = 0; }
        else if (prop === 'tachometerMappingList') { this.form[prop] = [JSON.parse(JSON.stringify(this.paramObj))]; }
        else if (prop === 'calculateType') { this.form[prop] = 1 }
        else { this.form[prop] = '' }
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:tachometerItem', null)
      this.$emit('update:editDialogVisible', false)
    },
    validateReturnValue (rule, value, callback, index) { // 校验方法
      if (this.form.dataType !== 1) return callback()
      if (!value && value !== 0) {
        return callback(new Error('请输入返回值'))
      }
      if (!/^[+-]{0,1}(\d+)$/.test(value)) {
        return callback(new Error('请输入整数'))
      }
      // let row = this.form.tachometerMappingList[index]
      // if (!this.Regexps.number.test(value) && !['=', '!='].includes(row.operator)) {
      //   return callback(new Error('只能在\'=\'或\'!=\'情况下输入非数字'))
      // }
      let mappingValueList = this.mappingValueList.filter((item, itemIndex) => itemIndex !== index)
      if (mappingValueList.some(val => val === value)) {
        return callback(new Error('返回值重复'))
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
    },
    validateReturnValueDesc (rule, value, callback, index) { // 校验方法
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
    validateDecimalLength (rule, value, callback) {
      if (!value && value !== 0) return callback()
      if (!Regexps.positiveInteger0.test(value) || value > 126) return callback(new Error('必须是小于127的自然数'))
      return callback()
    }
  },
  watch: {
    editDialogVisible: { // 监听editDialogVisible，获表计参数信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible || !this.tachometerItem) return
        this.dialogLoading = true
        this.tachometerGetInfo({ id: this.tachometerItem.id }).then(res => {
          let data = res.data
          Object.keys(this.form).forEach(prop => {
            let value = data[prop]
            switch (prop) {
              case 'tachometerMappingList':
                this.form[prop] = value && value.length ? value : [JSON.parse(JSON.stringify(this.paramObj))]
                break;
              default:
                this.form[prop] = value;
                break;
            }
          }, this)
          this.$nextTick(_ => {
            this.$refs.form && this.$refs.form.clearValidate()
          })
          this.dialogLoading = false
        })
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
.tachometer-editor {
  .text-center {
    text-align: center;
  }
  .input-with-select {
    /deep/ .el-form-item__content {
      width: 193px;
    }
    .select-with-input {
      width: 60px;
    }
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

