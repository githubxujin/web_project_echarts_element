<template>
  <div class="new-alarm">
    <el-form
      :model="form"
      :rules="rules"
      label-width="100px"
      ref="rulesForm"
      v-loading="dialogLoading"
    >
      <el-form-item label="报警名称" prop="alarmName">
        <el-input v-model.trim="form.alarmName" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="监控对象" prop="alarmDevice">
        <TreeSelect
          v-model="form.alarmDevice"
          placeholder="请选择"
          :data="deviceList"
          @change="alarmDeviceTypeChange"
        ></TreeSelect>
      </el-form-item>
      <el-form-item label="位置" prop="alarmLocation">
        <el-input v-model.trim="form.alarmLocation" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="参数条件" class="alarmConditionParamList is-required">
        <div v-for="(item, index) in form.alarmConditionParamList" :key="item.copyId">
          <el-form-item
            labelWidth="0px"
            :prop="`alarmConditionParamList[${index}].relateOperator`"
            v-show="Boolean(index)"
            :rules="[
                        {
                          validator: (rule, value, callback) => {
                            return validateRelateOperator(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }
                        ]"
            class="hasUnit"
          >
            <el-select
              v-model="form.alarmConditionParamList[index].relateOperator"
              placeholder="请选择条件"
              clearable
            >
              <el-option
                v-for="item in logicEnum"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            labelWidth="0px"
            :prop="`alarmConditionParamList[${index}].alarmParam`"
            :class="{'first-line': index === 0}"
            :rules="[
                          {required: true, message: '必选', trigger: 'change'}
                        ]"
          >
            <el-select
              v-model="form.alarmConditionParamList[index].alarmParam"
              placeholder="请选择参数"
              @change="alarmParamChange(index)"
              clearable
            >
              <el-option
                v-for="item in paramsTypeList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            labelWidth="0px"
            class="hasUnit"
            :prop="`alarmConditionParamList[${index}].firstOperator`"
            :rules="[
                          {required: true, message: '必选', trigger: 'change'}
                        ]"
          >
            <el-select v-model="form.alarmConditionParamList[index].firstOperator" clearable>
              <el-option
                v-for="item in symbolEnum"
                v-show="form.alarmConditionParamList[index].dataType ? ['=', '!='].includes(item.value) : true"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            labelWidth="0px"
            :prop="`alarmConditionParamList[${index}].firstOperateValue`"
            :rules="[
                          {
                          validator: (rule, value, callback) => {
                            return validateFirstOperateValue(rule, value, callback, index)
                          },
                          trigger: 'blur'
                        },
                        {
                          validator: (rule, value, callback) => {
                            return validateFirstOperateValue(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }
                        ]"
          >
            <el-input
              v-show="!item.dataType"
              maxlength="20"
              v-model.trim="form.alarmConditionParamList[index].firstOperateValue"
              placeholder="请输入数值"
            ></el-input>
            <el-select
              class="value-selector"
              v-show="item.dataType"
              v-model="form.alarmConditionParamList[index].firstOperateValue"
              :clearable="true"
            >
              <el-option
                v-for="item in item.selectList"
                :label="item.returnValueDesc"
                :value="item.id.toString()"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-form-item
            labelWidth="0px"
            class="hasUnit"
            :prop="`alarmConditionParamList[${index}].middleOperator`"
            :rules="[
                        {
                          validator: (rule, value, callback) => {
                            return validateMiddleOperator(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }
                        ]"
          >
            <el-select v-model="form.alarmConditionParamList[index].middleOperator" clearable>
              <el-option
                v-for="item in logicEnum"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            labelWidth="0px"
            class="hasUnit"
            :prop="`alarmConditionParamList[${index}].secondOperator`"
            :rules="[
                        {
                          validator: (rule, value, callback) => {
                            return validateSecondOperator(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }
                        ]"
          >
            <el-select v-model="form.alarmConditionParamList[index].secondOperator" clearable>
              <el-option
                v-for="item in symbolEnum"
                v-show="form.alarmConditionParamList[index].dataType ? ['=', '!='].includes(item.label) : true"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            labelWidth="0px"
            :prop="`alarmConditionParamList[${index}].secondOperateValue`"
            :rules="[
                        {
                          validator: (rule, value, callback) => {
                            return validateSecondOperateValue(rule, value, callback, index)
                          },
                          trigger: 'blur'
                        },
                        {
                          validator: (rule, value, callback) => {
                            return validateSecondOperateValue(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }
                        ]"
          >
            <el-input
              v-show="!item.dataType"
              v-model.trim="form.alarmConditionParamList[index].secondOperateValue"
              placeholder="请输入数值"
            ></el-input>
            <el-select
              class="value-selector"
              v-show="item.dataType"
              v-model="form.alarmConditionParamList[index].secondOperateValue"
              :clearable="true"
            >
              <el-option
                v-for="item in item.selectList"
                :label="item.returnValueDesc"
                :value="item.id.toString()"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <i
            v-show="index < form.alarmConditionParamList.length-1"
            @click="deleteFormParam(index)"
            class="el-icon-remove-outline delete params-icon"
          ></i>
          <i
            v-show="index === form.alarmConditionParamList.length-1"
            @click="addFormParam"
            class="el-icon-circle-plus-outline add params-icon"
          ></i>
        </div>
      </el-form-item>
      <el-form-item label="级别">
        <el-select v-model="form.alarmLevel" clearable>
          <el-option
            v-for="item in alarmLevelList"
            :key="item.id"
            :label="item.configName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="持续时间" class="hasUnit" prop="lastTime">
        <el-input v-model="form.lastTime" maxlength="8">
          <el-select slot="append" v-model="form.lastTimeUnit">
            <el-option
              v-for="item in timeTypeList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-input>后报警
      </el-form-item>
      <el-form-item label="升级机制" class="hasUnit" prop="upgradeTime">
        <el-input v-model.trim="form.upgradeTime" maxlength="8">
          <el-select slot="append" v-model="form.upgradeTimeUnit">
            <el-option
              v-for="item in timeTypeList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-input>后升级
      </el-form-item>
      <el-form-item label="推送首页展示">
        <el-radio-group v-model="form.show">
          <el-radio
            :key="index"
            v-for="(item, index) in pushEnum"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="直接生成工单">
        <el-radio-group v-model="form.workOrder">
          <el-radio
            :key="index"
            v-for="(item, index) in yesOrNoEnum"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="指派给" prop="executer">
        <TreeSelect
          v-model="form.executer"
          placeholder="请选择"
          :clearable="true"
          :data="executerList"
          :defaultProps="defaultProps"
        ></TreeSelect>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio
            :key="index"
            v-for="(item, index) in statusEnum"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="建议">
        <el-input
          v-model.trim="form.remark"
          type="textarea"
          style="width:280px;"
          :rows="3"
          placeholder="请输入内容"
          :maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submit">确 定</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-form-item>
    </el-form>
    <img class="device-img" v-if="pictureUrl" :src="pictureUrl" alt />
  </div>
</template>
<script>
const paramObj = { copyId: new Date().getTime(), relateOperator: '', alarmParam: '', dataType: 0, selectList: [], firstOperator: '', firstOperateValue: '', middleOperator: '', secondOperator: '', secondOperateValue: '' }
const defaultProps = {
  children: 'children',
  label: 'name',
  key: 'id',
  disabled: 'disabled'
}
import TreeSelect from '@/components/treeSelect'
import { yesOrNoEnum, pushEnum, statusEnum, logicEnum, symbolEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
import axios from '@/axios/axios.js'
import { alarmGetInfo, alarmEdit, transformerGetArray, deviceTypeQuery, alarmDeviceTreeQuery, alarmParameterQuery, configTypeQuery, alarmAdminListQuery, alarmPointMappingQuery, alarmGetDevicePicture } from '@/services/system-settings.js'
export default {
  name: 'NewAlarm',
  props: {
    alarmId: [String, Number, Object],
    editDialogVisible: Boolean
  },
  components: { TreeSelect },
  data () {
    return {
      defaultProps, // treeSelect属性选项
      Regexps, // 正则集合
      pushEnum, // 是否推送
      statusEnum, // 启用，禁用
      yesOrNoEnum, // 是否
      logicEnum, // 与或非
      symbolEnum, // 逻辑符号<>!=
      shopNumber: this.$store.getters.shopNumber,
      dialogLoading: false,
      timeTypeList: [{ label: '分钟', value: 1 }, { label: '小时', value: 2 }],
      deviceTypeList: [], // 设备类型列表
      deviceList: [], // 设备列表
      alarmLevelList: [], // 告警级别列表
      paramsTypeList: [], // 条件参数列表
      executerList: [], // 推送人员列表
      pictureUrl: '', // 设备图片地址
      form: {
        id: '',
        alarmSystemType: '',
        alarmName: '',
        alarmDevice: '',
        alarmDeviceType: '',
        alarmDeviceName: '',
        alarmDeviceId: '',
        alarmDeviceNumber: '',
        alarmLocation: '',
        alarmConditionParamList: [],
        alarmLevel: '',
        lastTime: '',
        lastTimeUnit: '',
        upgradeTime: '',
        upgradeTimeUnit: '',
        show: '',
        status: '',
        workOrder: '',
        executer: '',
        remark: ''
      },
      rules: {
        alarmName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        alarmDevice: [
          { required: true, message: '必选', trigger: 'change' }
        ],
        executer: [{ required: true, message: '必选', trigger: 'change' }],
        remark: [
          { pattern: Regexps.chinese, message: '只能是汉字', trigger: 'blur' }
        ],
        lastTime: [
          { pattern: Regexps.positiveInteger, message: '只能是正整数', trigger: 'blur' }
        ],
        upgradeTime: [
          { pattern: Regexps.positiveInteger, message: '只能是正整数', trigger: 'blur' }
        ]
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
    params () {
      let form = JSON.parse(JSON.stringify(this.form))
      // form.alarmConditionParamList.forEach(item => {
      //   item.firstOperateValue = ~~item.firstOperateValue
      //   item.secondOperateValue = ~~item.secondOperateValue
      // })
      form.shopNumber = this.shopNumber
      return form
    }
  },
  created () {
    this.initDict()
  },
  methods: {
    alarmEdit, // 编辑告警
    alarmGetInfo, // 新增告警
    deviceTypeQuery, // 获取设备类型列表
    transformerGetArray, // 获取电压列表数据
    alarmDeviceTreeQuery, // 根据activeKey => type获取设备下拉树
    alarmParameterQuery, // 根据设备typeList获取告警参数列表
    configTypeQuery, // 告警等级下拉列表
    alarmAdminListQuery, // 获取推送人员列表
    alarmPointMappingQuery, // 获取参数映射枚举列表
    alarmGetDevicePicture, // 获取告警设备图片
    initDict () {
      // 获取告警等级参数列表
      this.configTypeQuery({ configType: 28 }).then(res => {
        this.alarmLevelList = res.data[28]
      })
      // 获取推送人员列表
      this.alarmAdminListQuery({ shopNumber: this.shopNumber }).then(res => {
        this.executerList = this.handleExecuterList(res.data.array)
      }).catch(_ => {
        console.error('获取推送人员下拉列表失败(errorMessage):', _);
      })
    },
    initData () { // 初始化报警数据
      this.dialogLoading = true
      this.alarmGetInfo({ alarmConditionId: this.alarmId }).then(res => {
        let data = res.data
        Object.keys(this.form).forEach(prop => {
          prop !== 'alarmConditionParamList' && (this.form[prop] = data.alarmCondition[prop])
          if (['show', 'status', 'workOrder', 'lastTimeUnit', 'upgradeTimeUnit'].includes(prop)) this.form[prop] = ~~data.alarmCondition[prop]
        }, this)
        let alarmConditionParamList = res.data.alarmConditionParamList.length ? res.data.alarmConditionParamList : [JSON.parse(JSON.stringify(paramObj))]
        alarmConditionParamList.forEach(item => {
          item.copyId = item.alarmConditionId || item.copyId
          item.selectList = []
        })
        this.form['alarmConditionParamList'] = alarmConditionParamList
        // 获取枚举类参数的映射下拉列表
        let pointTableIdList = alarmConditionParamList.filter(item => Boolean(item.dataType)).map(item => item.alarmParam)
        pointTableIdList.length && this.alarmPointMappingQuery({ shopNumber: this.shopNumber, type: this.form.alarmSystemType, pointTableIdList }).then(mappingRes => {
          this.form['alarmConditionParamList'].forEach(item => {
            item.selectList = item.dataType ? mappingRes.data[item.alarmParam] : []
          })
        })
        this.form['alarmDevice'] = this.form.alarmDeviceId || this.form.alarmDeviceType
        this.dialogLoading = false
      }).catch(_ => {
        this.dialogLoading = false
      })
    },
    alarmDeviceTypeChange (item) { // 设备变更
      this.form.alarmDeviceNumber = null
      if (!item) {
        this.form.alarmDeviceName = ''
        this.form.alarmLocation = ''
        return
      }
      let data = item.data
      /**
       * 子项有deviceType 父项只有id
       */
      this.form.alarmDeviceName = data.configName || ''
      this.form.alarmDeviceType = data.deviceType || data.id || null
      this.form.alarmDeviceId = data.deviceType ? data.id : null
      this.form.alarmDeviceNumber = data.deviceType ? data.number : null
      this.form.alarmLocation = data.location || ''
    },
    alarmParamChange (index) { // 参数修改
      let item = this.form.alarmConditionParamList[index];
      // 清空对应行参数的条件
      ['dataType', 'firstOperator', 'firstOperateValue', 'middleOperator', 'secondOperator', 'secondOperateValue'].forEach(prop => {
        item[prop] = ''
      }, this)
      // 清空枚举类条件下拉列表
      item.selectList = []
      // 找寻对应参数的dataType
      if (item.alarmParam || item.alarmParam === 0) {
        for (let index = 0; index < this.paramsTypeList.length; index++) {
          if (this.paramsTypeList[index].id === item.alarmParam) {
            item.dataType = this.paramsTypeList[index].dataType
            break;
          }
        }
      }
      // 如果是枚举类型，则请求参数映射的枚举列表selectList
      if (item.dataType) {
        this.alarmPointMappingQuery({ shopNumber: this.shopNumber, type: this.form.alarmSystemType, pointTableIdList: [item.alarmParam] }).then(res => {
          item.selectList = res.data[item.alarmParam] || []
        })
      }
    },
    addFormParam () {
      this.form.alarmConditionParamList.push(JSON.parse(JSON.stringify(this.paramObj)))
    },
    deleteFormParam (index) {
      this.form.alarmConditionParamList.splice(index, 1)
    },
    submit () {
      let result = false
      this.$refs.rulesForm.validate(vali => {
        result = vali
      })
      if (!result) return
      this.$common.updateLoadingStatus(true)
      this.alarmEdit(this.params).then(res => {
        this.$emit('success')
        this.$common.updateLoadingStatus(false)
        this.$message.success('编辑告警成功!')
        this.cancle()
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
      })
    },
    resetForm () {
      Object.keys(this.form).forEach(prop => {
        if (prop === 'alarmConditionParamList') {
          this.form[prop] = []
        }
        else { this.form[prop] = '' }
      }, this)
      this.$nextTick(_ => {
        this.$refs.rulesForm && this.$refs.rulesForm.clearValidate()
      })
    },
    cancle () {
      this.$emit('update:alarmId', null)
      this.$emit('update:editDialogVisible', false)
    },
    getAllItemArr (data = [], id) {
      // 获取所有无子项的树节点
      let allArr = [];
      data.forEach(item => {
        if (item.children && item.children.length) {
          const itemArr = this.getAllItemArr(item.children, id);
          allArr = allArr.concat(itemArr);
        } else if (!item.children && (item.deviceType || item.deviceType === 0)) {
          allArr.push(item);
        }
      }, this);
      return allArr;
    },
    getDeviceList (data, id) { // 将设备树数据转换成列表数据
      let allArr = [];
      data.forEach(item => {
        if (item.id === id) {
          allArr.push(item)
        }
        if (item.children && item.children.length) {
          const itemArr = this.getDeviceList(item.children, id);
          allArr = allArr.concat(itemArr);
        }
      }, this);
      return allArr;
    },
    handleExecuterList (data = []) { // 处理推送人员列表不规范数据
      data = JSON.parse(JSON.stringify(data))
      data.forEach(item => {
        item.name = item.configName || item.realName
        item.disabled = item.hasOwnProperty('children') ? true : false
        if (item.children) {
          item.children = this.handleExecuterList(item.children)
        } else if (item.hasOwnProperty('children')) {
          item.children = []
        }
      })
      return data
    },
    validateRelateOperator (rule, value, callback, index) { // 校验 参数条件 第一逻辑符
      if (index > 0 && !value && value !== 0) {
        return callback(new Error('必选'))
      }
      return callback()
    },
    validateFirstOperateValue (rule, value, callback, index) { // 校验 参数条件 第一参数
      let item = this.form.alarmConditionParamList[index]
      if (!value && value !== 0) return item.dataType ? callback(new Error('必选')) : callback(new Error('必填'))
      if (!item.dataType && value && !this.Regexps.positiveNumber.test(value)) return callback(new Error('仅支持正数'))
      return callback()
    },
    validateMiddleOperator (rule, value, callback, index) { // 校验 参数条件 第二逻辑符
      let item = this.form.alarmConditionParamList[index]
      if ((item.secondOperator || item.secondOperateValue) && !value && value !== 0) {
        return callback(new Error('必选'))
      }
      return callback()
    },
    validateSecondOperator (rule, value, callback, index) { // 校验 参数条件 第二运算符
      let item = this.form.alarmConditionParamList[index]
      if ((item.middleOperator || item.secondOperateValue) && !value && value !== 0) {
        return callback(new Error('必选'))
      }
      return callback()
    },
    validateSecondOperateValue (rule, value, callback, index) { // 校验 参数条件 第二参数
      let item = this.form.alarmConditionParamList[index]
      if ((item.middleOperator || item.secondOperator)) {
        if (!value && value !== 0) return item.dataType ? callback(new Error('必选')) : callback(new Error('必填'))
      }
      if (!item.dataType && value && !this.Regexps.positiveNumber.test(value)) return callback(new Error('仅支持正数'))
      return callback()
    }
  },
  watch: {
    'alarmId': {
      immediate: true,
      handler: function (val) {
        if (!val && val !== 0) {
          this.resetForm()
          return
        }
        this.initData()
      }
    },
    'form.alarmSystemType': {
      immediate: true,
      handler: function (val) {
        if (!val && val !== 0) return
        this.alarmDeviceTreeQuery({
          shopNumber: this.shopNumber,
          type: val
        }).then(res => {
          // 获取设备下拉树
          this.deviceList = res.data.children
        }).catch(_ => {
          this.deviceList = []
        })
      }
    },
    'form.alarmDeviceNumber': {
      immediate: true,
      handler: function (val) { // 获取设备变更后的对应设备图片地址
        this.pictureUrl = ''
        if (!val || ![2, 3, 4].includes(~~this.form.alarmSystemType)) return
        this.alarmGetDevicePicture(this.form).then(res => {
          this.pictureUrl = res.data.pictureUrl
        }).catch(_ => {
          this.pictureUrl = ''
        })
      }
    },
    'deviceList': function (val, oldVal) {
      if (!this.deviceList.length || (!this.form.alarmDevice && this.form.alarmDevice !== 0)) return
      let deviceList = this.getDeviceList(this.deviceList, this.form.alarmDevice)
      if (!deviceList.length) return
      let ids = []
      if (deviceList.length) {
        let deviceFirst = deviceList[0]
        if (!deviceFirst.deviceType && deviceFirst.deviceType !== 0) {
          let deviceList = this.getAllItemArr(deviceFirst.children || [])
          ids = deviceList.map(item => {
            return item.id
          })
        } else if (deviceFirst.deviceType || deviceFirst.deviceType === 0) {
          ids = [deviceFirst.id]
        }
      }
      this.alarmParameterQuery({ shopNumber: this.shopNumber, ids: ids, type: this.form.alarmSystemType }).then(res => {
        this.paramsTypeList = res.data.parameterInfo
      }).catch(_ => {
        this.form.alarmConditionParamList = [JSON.parse(JSON.stringify(this.paramObj))]
      })
    },
    'form.alarmDevice': function (val, oldVal) {
      if (val || val === 0) { // 获取改设备或设备类型下面的所有非叶子节点数据，然后请求对应的参数列表
        let deviceList = this.getDeviceList(this.deviceList, val)
        if (!deviceList.length) return
        let ids = []
        if (deviceList.length) {
          let deviceFirst = deviceList[0]
          if (!deviceFirst.deviceType && deviceFirst.deviceType !== 0) {
            let deviceList = this.getAllItemArr(deviceFirst.children || [])
            ids = deviceList.map(item => {
              return item.id
            })
          } else if (deviceFirst.deviceType || deviceFirst.deviceType === 0) {
            ids = [deviceFirst.id]
          }
        }
        this.alarmParameterQuery({ shopNumber: this.shopNumber, ids: ids, type: this.form.alarmSystemType }).then(res => {
          this.paramsTypeList = res.data.parameterInfo
          if (oldVal || oldVal === 0) this.form.alarmConditionParamList = [JSON.parse(JSON.stringify(this.paramObj))]
        }).catch(_ => {
          this.form.alarmConditionParamList = [JSON.parse(JSON.stringify(this.paramObj))]
        })
      } else {
        this.paramsTypeList = []
        this.form.alarmConditionParamList = [JSON.parse(JSON.stringify(this.paramObj))]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.new-alarm {
  $color: #0063a7;
  height: 100%;
  color: #333333;
  position: relative;
  /deep/ .el-input {
    width: 280px;
  }
  .hasUnit {
    /deep/ .el-select {
      width: 80px;
      .el-input {
        width: 80px;
      }
    }
  }
  .alarmConditionParamList {
    margin-bottom: 0px;
    /deep/ .el-form-item {
      display: inline-block;
      .el-input {
        width: 100px;
      }
      .el-select {
        .el-input {
          width: 120px;
        }
        &.value-selector {
          .el-input {
            width: 100px;
          }
        }
      }
      &.first-line {
        .el-select,
        .el-input {
          width: 214px;
        }
      }
      &.hasUnit {
        .el-select {
          width: 80px;
          .el-input {
            width: 80px;
          }
        }
      }
    }
    .params-icon {
      vertical-align: middle;
      font-size: 20px;
      color: #1982bf;
      cursor: pointer;
      &.delete {
        color: #ff3366;
      }
    }
  }
  .alarm-condition-list {
    /deep/ .el-form-item__label {
      float: none;
    }
    /deep/ .el-form-item__content {
      .inline {
        height: 32px;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipse;
      }
      .el-checkbox {
        max-width: 100%;
        & + .el-checkbox {
          margin-left: 0;
        }
        .el-checkbox__label {
          max-width: calc(100% - 24px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .device-img {
    max-width: 300px;
    max-height: 300px;
    position: absolute;
    right: 50px;
    bottom: 100px;
  }
}
</style>
