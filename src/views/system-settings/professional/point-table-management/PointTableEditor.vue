<template>
  <div class="point-table-editor">
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
          <el-form-item prop="number" label="点位编码">
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
          <el-form-item prop="name" label="参数名称">
            <el-input v-model.trim="form.name" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="coolStationId" label="所属设备">
            <el-select v-model="form.coolStationId" placeholder="请选择" clearable>
              <el-option
                v-for="item in coolStationList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="meterId" label="所属支路">
            <el-select v-model="form.meterId" placeholder="请选择" clearable>
              <el-option
                v-for="item in meterList"
                :label="item.name"
                :value="item.meterId"
                :key="item.meterId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="gatherOrder" label="采集命令">
            <el-select
              v-model="form.gatherOrder"
              placeholder="请选择"
              clearable
              filterable
              :disabled="isEdit"
            >
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
            <el-input v-model.trim="form.upperLimit" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="lowerLimit" label="下限">
            <el-input v-model.trim="form.lowerLimit" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-show="form.dataType === 1"
        v-for="(item, index) in form.pointTableMappingList"
        :key="item.copyId || item.id"
      >
        <el-col :span="12">
          <el-form-item
            class="is-required input-with-select"
            :prop="`pointTableMappingList[${index}].returnValue`"
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
            :prop="`pointTableMappingList[${index}].returnValueDesc`"
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
import { pointTableGetInfo, pointTableAdd, pointTableEdit, configTypeQuery, coolingStationGetArray, tachometerGetArray, tachometerGetMappingArray, coolingStationGetMeterList } from '@/services/system-settings.js'
import axios from '@/axios/axios.js'
import { statusEnum, paramStateEnum, symbolEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
let RegexpNumber = /^[+-]{0,1}(\d+)$|^[+-]{0,1}(\d+\.\d{0,2})$/;
export default {
  components: {},
  props: {
    editDialogVisible: Boolean,
    pointTableId: [String, Number]
  },
  data () {
    const numberRule = {
      pattern: Regexps.number, message: '仅支持数字', trigger: 'blur'
    }
    return {
      paramStateEnum,  // 数值/枚举
      statusEnum, // 启用，禁用
      symbolEnum, // 逻辑符号<>!=
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      coolStationList: [], // 冷站设备列表
      tachoList: [], // 采集命令列表
      unitList: [], // 单位列表
      meterList: [], // 支路列表
      form: {
        id: '',
        number: '',
        name: '',
        meterId: '',
        coolStationId: '',
        gatherOrder: '',
        dataType: 0,
        upperLimit: '',
        lowerLimit: '',
        pointTableMappingList: [JSON.parse(JSON.stringify(this.paramObj))],
        unit: '',
        status: 0,
        remark: '',
        shopNumber: ''
      },
      formRules: { // 表单规则
        number: [{ required: true, message: '请输入点位编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        gatherOrder: [{ required: true, message: '请选择采集命令', trigger: 'blur' }],
        coolStationId: [{ required: true, message: '请选择所属设备', trigger: 'change' }],
        meterId: [{ required: true, message: '请选择支路', trigger: 'change' }],
        upperLimit: [numberRule, {
          validator: this.validateUpperLimit, trigger: 'blur'
        }],
        lowerLimit: [numberRule, {
          validator: this.validateLowerLimit, trigger: 'blur'
        }]
      },
      branchInitFlag: false, // 支路数据是否已经初始化
      tachometerInitFlag: false// 表计枚举列表是否以及初始化
    }
  },
  computed: {
    mappingValueList () {
      const MappingValueList = this.form.pointTableMappingList.filter(item => {
        return Boolean(item.returnValue || item.returnValue === 0)
      }).map(item => {
        return `${item.returnValue}`
      })
      return MappingValueList
    },
    mappingDescList () {
      const MappingDescList = this.form.pointTableMappingList.filter(item => {
        return Boolean(item.returnValueDesc || item.returnValueDesc === 0)
      }).map(item => item.returnValueDesc)
      return MappingDescList
    },
    paramObj: {
      cache: false,
      get () {
        const copyId = new Date().getTime()
        return {
          copyId,
          // operator: '=',
          returnValue: '',
          returnValueDesc: ''
        }
      }
    },
    isEdit () { // 判断是否编辑
      return Boolean(this.pointTableId || this.pointTableId === 0)
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
    }
  },
  created () {
    this.initData()
  },
  methods: {
    pointTableGetInfo, //获取冷站详情
    pointTableAdd, // 新增冷站参数
    pointTableEdit, // 编辑冷站参数
    configTypeQuery,
    coolingStationGetArray, // 获取冷站设备列表
    tachometerGetArray, // 获取表计列表
    tachometerGetMappingArray, // 获取表计默认枚举
    coolingStationGetMeterList, // 获取冷站支路列表
    initData () {
      this.dialogLoading = true
      const configType = [32] // 32 单位
      const shopNumber = this.params.shopNumber
      axios.all([this.configTypeQuery({ configType }), this.coolingStationGetArray({ shopNumber }), this.tachometerGetArray({ shopNumber, deviceType: -1 })]).then(axios.spread((...args) => {
        this.dialogLoading = false
        this.unitList = args[0].data[32]
        this.coolStationList = args[1].data.array || []
        this.tachoList = args[2].data.array || []
      })).catch(_ => {
        this.dialogLoading = false
        console.error('获取单位列表或冷站设备列表或采集命令列表失败(errorMessage)：', _);
      })
    },
    addFormParam () {
      this.form.pointTableMappingList.push(JSON.parse(JSON.stringify(this.paramObj)))
    },
    deleteFormParam (index) {
      this.form.pointTableMappingList.splice(index, 1)
    },
    submit () { // 提交编辑或新增

      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'pointTableEdit'
      if (!this.isEdit) {
        funName = 'pointTableAdd'
      }
      debugger
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增冷站参数成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑冷站参数失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = ''
      }, this)
      this.form.dataType = this.form.status = 0
      this.form.pointTableMappingList = [JSON.parse(JSON.stringify(this.paramObj))]
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:pointTableId', null)
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
      let row = this.form.pointTableMappingList[index]
      // if (!this.Regexps.number.test(value) && !['=', '!='].includes(row.operator)) {
      //   return callback(new Error('只能在\'=\'或\'!=\'情况下输入非数字'))
      // }
      let mappingValueList = this.mappingValueList.filter((item, itemIndex) => itemIndex !== index)
      if (mappingValueList.some(val => val === row.operator + value)) {
        return callback(new Error('返回值重复'))
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
    validateUpperLimit (rule, value, callback) { // 校验方法
      //温度允许有负数
      if (this.form.unit != 73 && (!RegexpNumber.test(this.form.upperLimit) || !Regexps.positiveNumber.test(this.form.lowerLimit))) {
        if (value && !RegexpNumber.test(value)) {
          return callback(new Error('仅输入数字且保留两位小数'))
        }
        return callback()
      }
      if ((value || value === 0) && (this.form.lowerLimit || this.form.lowerLimit === 0) && parseFloat(value) < parseFloat(this.form.lowerLimit)) {
        return callback(new Error('上限不能低于下限'))
      }
      if (this.form.unit === 73 && (!Regexps.twoDecimal.test(value))) {
        return callback(new Error('最多保留2位小数'))
      }
      return callback()
    },
    validateLowerLimit (rule, value, callback) { // 校验方法
      if (this.form.unit != 73 && (!RegexpNumber.test(this.form.upperLimit) || !Regexps.positiveNumber.test(this.form.lowerLimit))) {
        if (value && !RegexpNumber.test(value)) {
          return callback(new Error('仅输入数字且保留两位小数'))
        }
        return callback()
      }
      if ((value || value === 0) && (this.form.upperLimit || this.form.upperLimit === 0) && parseFloat(value) > parseFloat(this.form.upperLimit)) {
        return callback(new Error('下限不能高于上限'))
      }
      if (this.form.unit === 73 && (!Regexps.twoDecimal.test(value))) {
        return callback(new Error('最多保留2位小数'))
      }
      return callback()
    }
  },
  watch: {
    'form.coolStationId': {
      immediate: true,
      handler: function (value) {
        if (this.branchInitFlag) { // 支路列表已初始化情况下，清空设备对应支路列表及支路选项
          this.form.meterId = ''
          this.meterList = []
        }
        if (!value && value !== 0) return
        this.coolingStationGetMeterList({ id: value }).then(res => {
          this.branchInitFlag = true
          this.meterList = res.data.array || []
        }).catch(_ => {
          this.branchInitFlag = true
          this.meterList = []
          console.error('获取冷战设备列表失败(errorMessage):', _);
        })
      }
    },
    'form.gatherOrder': {
      immediate: true,
      handler: function (value) {
        if (!this.tachometerInitFlag) return // 采集命令未初始化的情况下变动不管
        //清空枚举类，清空上下限数据
        if (!this.isEdit) { // 编辑状态下不删除，如果编辑下可删除 注意 初始化的时候别不小心删了
          this.form.upperLimit = ''
          this.form.lowerLimit = ''
          this.form.pointTableMappingList = [JSON.parse(JSON.stringify(this.paramObj))]
        }
        if (value || value === 0) { // 变动非清空情况下，带出采集命令对应默认数据
          // 带出采集命令对应的数据类型
          if (!this.isEdit) { // 编辑情况下先不带出命令采集
            for (let index = 0, len = this.tachoList.length; index < len; index++) {
              if (this.tachoList[index].id === value) {
                this.form.dataType = this.tachoList[index].dataType || 0
                break
              }
            }
          }
          // 如果是枚举类，则请求默认枚举类列表
          if (this.form.dataType === 1 && !this.isEdit) { // 编辑情况下先不做处理
            this.tachometerGetMappingArray({ tachometerIdList: [value] }).then(res => {
              this.form.pointTableMappingList = res.data.array.map(item => {
                let {
                  id,
                  operator,
                  returnValue,
                  returnValueDesc
                } = item
                return {
                  copyId: id,
                  operator,
                  returnValue,
                  returnValueDesc
                }
              })
            }).catch(_ => {
              this.form.pointTableMappingList = [JSON.parse(JSON.stringify(this.paramObj))]
            })
          }
        }
      }
    },
    editDialogVisible: { // 监听editDialogVisible，获取冷站参数信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        this.branchInitFlag = false // 重置支路列表初始化标志
        this.tachometerInitFlag = false // 重置表计参数初始化标志
        if (!visible || !this.pointTableId && this.pointTableId !== 0) {
          this.tachometerInitFlag = true
          return
        }
        this.pointTableGetInfo({ id: this.pointTableId }).then(res => {
          let data = res.data || {}
          Object.keys(this.form).forEach(prop => {
            let value = data[prop]
            this.form[prop] = value
          }, this)
          this.tachometerInitFlag = true
          if (!this.form.pointTableMappingList || !this.form.pointTableMappingList.length) {
            this.form.pointTableMappingList = [JSON.parse(JSON.stringify(this.paramObj))]
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
.point-table-editor {
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

