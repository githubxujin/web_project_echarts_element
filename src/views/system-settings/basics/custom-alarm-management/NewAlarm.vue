<template>
  <div class="new-alarm">
    <p class="page-title">
      <i @click="cancle" class="iconfont icon-fanhui">返回</i>
      <span class="line">|</span>
      <span>新增自定义报警</span>
    </p>
    <div class="page-content">
      <header class="alarm-type-list">
        <span
          v-for="(item, index) in alarmTypeList"
          :key="index"
          :class="{'activated': form.alarmSystemType === item.value}"
          @click="alarmTypeChange(item)"
        >{{item.label}}</span>
      </header>
      <section class="alarm-section">
        <div class="device-box"></div>
        <div class="form-box">
          <!-- <p class="form-title">新增报警条件</p> -->
          <div class="form-content-box">
            <div class="form-content-box-left">
              <div class="device-type-list">
                <span
                  v-for="(item, index) in deviceTypeList"
                  :key="index"
                  :class="{'activated': activeKey2 === item.id}"
                  @click="deviceTypeChange(item)"
                >{{item.configName}}</span>
              </div>
            </div>
            <div class="form-content-box-right">
              <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <div class="inline-block">
                  <el-form-item label="报警名称" prop="alarmName">
                    <el-input v-model.trim="form.alarmName" maxlength="20"></el-input>
                  </el-form-item>
                  <el-form-item label="监控对象" prop="alarmDevice">
                    <TreeSelect
                      v-model="form.alarmDevice"
                      placeholder="请选择"
                      :clearable="true"
                      :data="deviceList"
                      @change="alarmDeviceTypeChange"
                    ></TreeSelect>
                  </el-form-item>
                  <el-form-item label="位置" prop="alarmLocation">
                    <el-input v-model.trim="form.alarmLocation" maxlength="50"></el-input>
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
                        <el-select
                          v-model="form.alarmConditionParamList[index].firstOperator"
                          clearable
                        >
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
                        <el-select
                          v-model="form.alarmConditionParamList[index].middleOperator"
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
                        <el-select
                          v-model="form.alarmConditionParamList[index].secondOperator"
                          clearable
                        >
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
                    <el-input v-model="form.lastTime">
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
                    <el-input v-model.trim="form.upgradeTime">
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
                  <el-form-item label="备注">
                    <el-input
                      v-model.trim="form.remark"
                      type="textarea"
                      style="width:280px;"
                      :rows="3"
                      placeholder="请输入内容"
                      :maxlength="100"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="inline-block" v-show="copyAlarmConditionList.length">
                  <el-form-item label="已设置报警条件" class="alarm-condition-list" label-width="0">
                    <el-checkbox-group v-model="form.alarmConditionList">
                      <div
                        class="inline"
                        :title="alarm.alarmName"
                        v-for="alarm in alarmInfo"
                        :key="alarm.id"
                      >
                        <el-checkbox :label="alarm.id">{{alarm.alarmName}}</el-checkbox>
                      </div>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="submit">确 定</el-button>
                  <el-button size="mini" @click="cancle">取 消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </section>
    </div>
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
import axios from '@/axios/axios.js'
import { getBtnsByIndex } from '@/utils/permission.js';
import TreeSelect from '@/components/treeSelect'
import { yesOrNoEnum, pushEnum, statusEnum, logicEnum, symbolEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
import { alarmAdd, transformerGetArray, deviceTypeQuery, alarmDeviceTreeQuery, alarmParameterQuery, configTypeQuery, alarmAdminListQuery, alarmPointMappingQuery } from '@/services/system-settings.js'
export default {
  name: 'NewAlarm',
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
      activeKey2: 1,
      shopNumber: this.$store.getters.shopNumber,
      alarmTypeList: [ // 所属系统列表
        {
          label: '供配电',
          value: 1
        }, {
          label: '给排水',
          value: 2
        }, {
          label: '空调',
          value: 3
        }, {
          label: '电梯',
          value: 4
        }, {
          label: '能管',
          value: 5
        }],
      timeTypeList: [{ label: '分钟', value: 1 }, { label: '小时', value: 2 }],
      deviceTypeList: [], // 设备类型列表
      deviceList: [], // 设备列表
      alarmLevelList: [], // 告警级别列表
      paramsTypeList: [], // 条件参数列表
      alarmInfo: [], // 报警列表
      executerList: [], // 推送人员列表
      form: {
        alarmSystemType: 1,
        alarmName: '',
        alarmDevice: '',
        alarmDeviceType: '',
        alarmDeviceName: '',
        alarmDeviceId: '',
        alarmDeviceNumber: '',
        alarmLocation: '',
        alarmConditionParamList: [JSON.parse(JSON.stringify(paramObj))],
        alarmLevel: '',
        lastTime: '',
        lastTimeUnit: 2,
        upgradeTime: '',
        upgradeTimeUnit: 2,
        show: 0,
        status: 0,
        workOrder: 0,
        executer: '',
        remark: '派人查看',
        alarmConditionList: []
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
      },
      copyAlarmConditionList: [], // 报警条件备份
      deviceType:'',//设备类型
    }
  },
  created () {
    if (!this.isAuth) this.$router.push('/settings/basics/custom-alarm-management')
    this.initData()
  },
  computed: {
    isAuth () { // 是否有自定义告警新增权限
      let parentPath = this.$route.meta.parentPath
      let btns = getBtnsByIndex(parentPath)
      let isAuth = btns.some(val => val === 'add')
      return isAuth
    },
    paramObj: {
      cache: false,
      get: function () {
        let paramObjCopy = JSON.parse(JSON.stringify(paramObj))
        paramObjCopy.copyId = new Date().getTime()
        //console.log("paramObjCopy:",paramObjCopy)
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
       //console.log("form1=",form)
      form.alarmConditionList = this.alarmInfo.map(item => {
        item.status = form.alarmConditionList.includes(item.id) ? 0 : 1
        return item
      })
     // console.log("form2=",form)
      return form
    }
  },
  methods: {
    alarmAdd, // 新增告警
    deviceTypeQuery, // 获取设备类型列表
    transformerGetArray, // 获取电压列表数据
    alarmDeviceTreeQuery, // 根据activeKey => type获取设备下拉树
    alarmParameterQuery, // 根据设备typeList获取告警参数列表
    configTypeQuery, // 告警等级下拉列表
    alarmAdminListQuery, // 获取推送人员列表
    alarmPointMappingQuery, // 获取参数映射枚举列表
    // 获取给排水数据
    // 获取能管数据
    // 获取空调数据
    // 获取电梯数据
    initData () {
      // // 获取电压器列表（用于图例的循环展示）
      // this.transformerGetArray({ shopNumber: this.shopNumber }).then(res => {
      // })
      // 获取告警等级参数列表
      this.configTypeQuery({ configType: 28 }).then(res => {
        this.alarmLevelList = res.data[28]
        this.form.alarmLevel = (this.alarmLevelList[1] || {}).id
      })
      // 获取推送人员列表
      this.alarmAdminListQuery({ shopNumber: this.shopNumber }).then(res => {
        this.executerList = this.handleExecuterList(res.data.array)
        console.log('this.executerList:', this.executerList);
      }).catch(_ => {
        console.error('获取推送人员下拉列表失败(errorMessage):', _);
      })
    },
    alarmTypeChange (item) {
      this.$refs['form'].resetFields()
      this.form.alarmSystemType = item.value
    },
    deviceTypeChange (item) {
      //console.log("设备类型切换：",item)
      this.$refs['form'].resetFields()
      this.activeKey2 = item.id
      this.form.alarmDevice = item.id
      this.form.alarmDeviceType = item.id
      this.form.alarmDeviceName = item.configName
    },
    alarmDeviceTypeChange (item) {
     // console.log("报警设备类型切换：",item)
     // debugger
      this.form.alarmDeviceNumber = null
      if (!item) {
        this.form.alarmDeviceName = ''
        this.form.alarmLocation = ''
        return
      }
      let data = item.data
      /**
       * 子项有deviceType 父项只有id  activeKey2 为选中父项
       */
      this.activeKey2 = data.deviceType || data.id
      this.form.alarmDeviceName = data.configName || ''
      this.form.alarmDeviceType = data.deviceType || data.id || null
      this.form.alarmDeviceId = data.deviceType ? data.id : null
      this.form.alarmDeviceNumber = data.deviceType ? data.number : null
      this.form.alarmLocation = data.location || ''
      if(!data.deviceType && data.id){//选中的是父项
        this.deviceType=data.id;
      }else{
        this.deviceType='';
      }
     // console.log("this.deviceType:",this.deviceType)
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
      this.$refs.form.validate(vali => {
        result = vali
      })
      if (!result) return
      this.$common.updateLoadingStatus(true)
      this.alarmAdd(this.params).then(res => {
        this.$common.updateLoadingStatus(false)
        this.$message.success('新增告警成功!')
        this.cancle()
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
      })
      console.log('提交新增');
    },
    cancle () {
      this.$router.push('/settings/basics/custom-alarm-management')
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
    'form.alarmSystemType': {
      immediate: true,
      handler: function (value) {
        this.activeKey2 = null
        this.form.alarmDevice = null
        this.form.alarmDeviceType = null
        this.form.alarmDeviceId = null
        this.form.alarmDeviceNumber = null
        this.form.alarmDeviceName = null
        axios.all([this.alarmDeviceTreeQuery({
          shopNumber: this.shopNumber,
          type: value
        }), this.deviceTypeQuery({ deviceType: value, flat: 1 })]).then(axios.spread((...args) => {
          // 获取设备下拉树
          this.deviceList = args[0].data.children
          // 获取设备类型下拉树
          let arr = args[1].data.children
          if (value === 2) { // 过滤掉给水和排水选项（这两个是所属系统类别）
            arr = arr.filter(item => ![6, 7].includes(item.id))
          }
          this.deviceTypeList = arr
          let firstObj = this.deviceTypeList[0] || {}
          this.activeKey2 = firstObj.id || null
          this.form.alarmDeviceType = firstObj.id || null
          this.form.alarmDevice = firstObj.id || null
          this.form.alarmDeviceName = firstObj.configName || null
          this.deviceType=this.form.alarmDeviceType
         // console.log("监听form:",this.form);
        })).catch(_ => {
          this.deviceTypeList = []
          this.deviceList = []
        })
      }
    },
    'form.alarmDevice': {
      handler: function (val) {
        if (val || val === 0) { // 获取改设备或设备类型下面的所有非叶子节点数据，然后请求对应的参数列表
          let deviceList = this.getDeviceList(this.deviceList, val)
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
          this.alarmParameterQuery({ shopNumber: this.shopNumber, ids: ids, type: this.form.alarmSystemType ,deviceType:this.deviceType}).then(res => {
            this.alarmInfo = res.data.alarmInfo || []
            this.form.alarmConditionList = res.data.alarmInfo.filter(item => !item.status).map(item => item.id)
            this.copyAlarmConditionList = res.data.alarmInfo.filter(item => !item.status).map(item => item.id)
            this.paramsTypeList = res.data.parameterInfo
            this.form.alarmConditionParamList = [JSON.parse(JSON.stringify(this.paramObj))]
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
}
</script>
<style lang="scss" scoped>
.new-alarm {
  $color: #0063a7;
  height: 100%;
  color: #333333;
  min-width: 1200px;
  .page-title {
    line-height: 40px;
    font-size: 16px;
    background-color: white;
    border-radius: 5px;
    color: $color;
    padding: 0 30px;
    margin-bottom: 30px;
    i {
      cursor: pointer;
    }
    .line {
      margin: 0 10px;
    }
  }
  .page-content {
    background-color: white;
    min-height: calc(100% - 70px);
    .alarm-type-list {
      padding-left: 47px;
      border-bottom: 1px solid #e4e4e4;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        padding: 0 25px;
        margin-bottom: -1px;
        cursor: pointer;
        &:hover {
          color: $color;
        }
        &.activated {
          color: $color;
          border-bottom: 2px solid $color;
        }
      }
    }
    .alarm-section {
      padding: 30px;
      .form-box {
        .form-title {
          font-size: 16px;
          margin-bottom: 38px;
        }
        .form-content-box {
          .form-content-box-left {
            float: left;
            min-height: 100px;
            .device-type-list {
              border-right: 1px solid #e4e4e4;
              display: inline-block;
              span {
                display: block;
                height: 43px;
                line-height: 43px;
                padding-right: 25px;
                margin-right: -1px;
                cursor: pointer;
                &:hover {
                  color: $color;
                }
                &.activated {
                  color: $color;
                  border-right: 2px solid $color;
                }
              }
            }
          }
          .form-content-box-right {
            margin-left: 350px;
            .inline-block {
              display: inline-block;
              height: 100%;
              vertical-align: text-top;
              &:first-child {
                width: 890px;
              }
              &:nth-child(2) {
                max-width: 250px;
              }
            }
            /deep/ .el-input {
              width: 280px;
            }
            .hasUnit {
              /deep/ .el-select {
                width: 100px;
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
          }
        }
      }
    }
  }
}
</style>
