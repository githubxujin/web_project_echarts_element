<template>
  <div class="branch-editor">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      v-loading="dialogLoading"
      label-width="90px"
      size="mini"
      inline
      :label-position="'left'"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item prop="electricAddr" label="电表地址">
            <el-input v-model.trim="form.electricAddr" placeholder="请输入" clearable :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="name" label="支路名称">
            <el-input v-model.trim="form.name" placeholder="请输入" clearable :maxlength="36"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="parentId" label="所属支路">
            <el-select v-model="form.parentId" placeholder="请选择" clearable>
              <el-option
                v-for="item in meterList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="deviceType" label="所属设备类型">
            <TreeSelect
              v-model="form.deviceType"
              placeholder="请选择"
              :clearable="true"
              :data="deviceTypeListCopy"
              @change="changeDeviceType(form.deviceType)"
            ></TreeSelect>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="transformer" label="所属变压器">
            <!-- 目前测试环境变压器的id为8，但是这是主键，随环境的变化可能会有所变化 -->
            <el-select
              v-model="form.transformer"
              placeholder="请选择"
              clearable
              :disabled="form.deviceType===8?false:true"
            >
              <el-option
                v-for="item in transformerList"
                :label="item.name"
                :value="item.number"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="accountNo" label="户号">
            <el-input
              v-model.trim="form.accountNo"
              placeholder="请输入"
              clearable
              :maxlength="36"
              :disabled="form.deviceType===8?false:true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="measureType" label="计量设备类型">
            <el-select v-model="form.measureType" placeholder="请选择" clearable>
              <el-option
                v-for="item in (dicts || {})[15] || []"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="fictitious" label="是否虚拟支路">
            <el-radio-group v-model="form.fictitious">
              <el-radio
                v-for="item in yesOrNoEnum"
                :key="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="collector" label="所属采集器">
            <el-select
              v-model="form.collector"
              @change="changeCollector"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in collectorList"
                :label="item.name"
                :value="item.number"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="com" label="所属端口">
            <el-select v-model="form.com" placeholder="请选择" clearable>
              <el-option v-for="item in comList" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="oneDevice" label="是否单个设备">
            <el-radio-group v-model="form.oneDevice">
              <el-radio
                v-for="item in yesOrNoEnum"
                :key="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- <el-form-item prop="deviceNo" label="对应设备编号">
            <el-select
              v-model="form.deviceNo"
              placeholder="请选择"
              clearable
              :disabled="~~form.oneDevice !== 0"
            ></el-select>
          </el-form-item>-->
          <el-form-item prop="deviceNo" label="对应设备编号">
            <el-input
              v-model.trim="form.deviceNo"
              clearable
              :maxlength="36"
              :disabled="~~form.oneDevice !== 0"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="electricNo" label="配电柜编号">
            <el-input v-model.trim="form.electricNo" clearable :maxlength="36"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="loopNo" label="配电回路编号">
            <el-input v-model.trim="form.loopNo" clearable :maxlength="36"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="electricType" label="配电元件类型">
            <el-select v-model="form.electricType" placeholder="请选择" clearable>
              <el-option
                v-for="item in (dicts || {})[16] || []"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="communicationMode	" label="通讯方式">
            <el-select v-model="form.communicationMode	" placeholder="请选择" clearable>
              <el-option
                v-for="item in (dicts || {})[17] || []"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="totalGauges" label="是否总表">
            <el-radio-group v-model="form.totalGauges">
              <el-radio
                v-for="item in yesOrNoEnum"
                :key="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="reserve" label="是否备用">
            <el-radio-group v-model="form.reserve">
              <el-radio
                v-for="item in yesOrNoEnum"
                :key="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="status" label="支路状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="item in statusEnum"
                :key="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 命令集合校验提示语 -->
      <p v-show="orderListTip" class="orderListTip">{{orderListTip}}</p>
      <!-- 命令集合 -->
      <branch-editor-table ref="branchTable" :dicts="dictsCopy" :gathers="form.gathers"></branch-editor-table>
      <el-row class="text-center">
        <el-button type="primary" size="mini" @click="submit">{{branchItem ? '确 定' : '新 增'}}</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import BranchEditorTable from './BranchEditorTable'
import TreeSelect from '@/components/treeSelect'
import { meterGetInfo, meterAdd, meterEdit, meterGetArray, configTypeQuery, transformerGetArray, collectorGetArray, collectorGetPort, tachometerGetArray, meterGetEnergyHTypeArray, deviceTypeQuery } from '@/services/system-settings.js'
import { yesOrNoEnum, statusEnum } from '@/enum/dicts.js'
import axios from '@/axios/axios.js'
const baseFrom = {
  id: '',
  electricAddr: '', // 电表地址
  name: '', // 支路名称
  parentId: '', // 所属支路
  deviceType: '', // 所属设备类型
  transformer: '', // 所属变压器
  accountNo: '', // 户号
  measureType: '', // 计量设备类型
  fictitious: 1, // 是否虚拟支路
  collector: '', // 所属采集器
  com: '', // 所属端口
  oneDevice: 1, // 是否单个设备
  deviceNo: '', // 对应设备编号
  electricNo: '', // 配电柜编号
  loopNo: '', // 配电回路编号
  electricType: '', //配电元件类型
  communicationMode: '', // 通讯方式
  totalGauges: 1, // 是否总表
  reserve: 1, // 是否备用
  status: 0, // 默认启用，支路状态
  gathers: [], // 指令集合
  buildId: ''
}
export default {
  name: 'branch-editor',
  props: {
    editDialogVisible: Boolean,
    branchItem: {
      type: Object,
      defaut: () => null
    }
  },
  components: { BranchEditorTable, TreeSelect },
  data () {
    return {
      yesOrNoEnum, // 是否列表
      statusEnum, // 状态列表
      dialogLoading: false,
      dicts: null,
      meterList: [], // 支路下拉列表
      transformerList: [], // 变压器下拉列表
      collectorList: [], // 采集器下拉列表
      comList: [], // 采集器端口下拉列表
      tachoList: [], // 采集命令下拉列表
      energyTypeList: [], // 能耗类型下拉列表
      deviceTypeList: [], // 设备类型下拉树
      form: JSON.parse(JSON.stringify(baseFrom)),
      formRules: {
        electricAddr: [{ required: true, message: '请输入电表地址', trigger: 'blur' },],
        name: [{ required: true, message: '请输入支路名称', trigger: 'blur' }],
        measureType: [{ required: true, message: '请选择计量设备类型', trigger: 'change' }],
        parentId: [{ validator: this.validatorParentId, trigger: 'blur' }]
      },
      orderListTip: '', // 指令列表校验提示语
      isInit1: true, // 初始化标志位，用于采集所属端口
      isInit2: true, // 初始化标志位，用于采集命令
    }
  },
  computed: {
    isEdit () { // 判断是否编辑
      // 重置form
      this.form = JSON.parse(JSON.stringify(baseFrom));
      return Boolean(this.branchItem)
    },
    dictsCopy () { // 集成字典传给gatherTable
      let dicts = JSON.parse(JSON.stringify(this.dicts || {}))
      dicts.tachoList = this.tachoList
      dicts.energyTypeList = this.energyTypeList
      dicts.meterList = this.meterList
      dicts.deviceTypeList = this.deviceTypeList
      return dicts
    },
    deviceTypeListCopy () {
      let deviceTypeList = JSON.parse(JSON.stringify(this.deviceTypeList))
      deviceTypeList.forEach(item => {
        item.disabled = true
      })
      return deviceTypeList
    },
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      if (this.$refs.branchTable) {
        params.gathers = this.$refs.branchTable.form.tableDataList || []
      }
      // 如果是新增则用当前登陆者的shopNumber
      params.buildId = params.buildId || this.$store.getters.getUserInfo.shopNumber
      return params
    }
  },
  methods: {
    meterGetInfo,
    meterAdd,
    meterEdit,
    configTypeQuery, // 获取全局参数 ， 15计量设备类型，16配电元件类型，17通信方式，18数值类型，32单位
    meterGetArray, // 支路下拉列表
    transformerGetArray, // 变压器列表
    collectorGetArray, // 采集器列表
    collectorGetPort, // 采集器端口列表
    tachometerGetArray, // 采集命令列表
    meterGetEnergyHTypeArray, // 能耗类型列表
    deviceTypeQuery, // 获取设备类型
    initData () { // 初始化（除采集器端口下拉列表外）
      let shopNumber, buildId;
      this.dialogLoading = true
      const configType = [14, 15, 16, 17, 18, 32] // 14 设备类型， 15计量设备类型，16配电元件类型，17通信方式，18数值类型，32单位
      shopNumber = buildId = this.params.buildId
      // 请求列表,如果dicts不为null，说明已经初始化过字典和各个下拉列表了

      let requestList = this.dicts ? [] : [this.configTypeQuery({ configType }), this.meterGetArray({ shopNumber }), this.transformerGetArray({ shopNumber }), this.collectorGetArray({ shopNumber }), this.meterGetEnergyHTypeArray(), this.deviceTypeQuery({ deviceType: 6, flat: 0 })]
      this.isEdit && requestList.push(this.meterGetInfo(this.branchItem))// 编辑状态，需要初始化支路详情
      requestList[1] = this.meterGetArray({ shopNumber });//需要初始化支路下拉列表
      // 发起请求
      axios.all(requestList).then(axios.spread((...args) => {
        this.dialogLoading = false
        let infoIndex = this.dicts ? 0 : 6 // 根据请求列表 获取详情响应数据所在位置
        if (args[infoIndex]) { // 如果有数据则初始化支路详情
          Object.keys(this.form).forEach(prop => {
            this.form[prop] = args[infoIndex]['data'][prop]
          })
          // 因改变数据会触发部分校验，需要清除校验结果(非重置表单)
          this.$nextTick(_ => {
            this.$refs.form && this.$refs.form.clearValidate()
          })
        }
        if (!this.dicts) {
          this.dicts = args[0].data || {} // 全局参数
          // this.meterList = args[1].data.array || [] // 支路下拉列表
          this.transformerList = args[2].data.array || [] // 变压器下拉列表
          this.collectorList = args[3].data.array || [] // 采集器下拉列表
          console.log('this.collectorList', this.collectorList)
          this.energyTypeList = args[4].data.array || [] // 能耗类型下拉列表
          this.deviceTypeList = args[5].data || [] // 设备类型下拉树
          console.log('所属设备类型下拉树树deviceTypeList:', this.deviceTypeList);
        }
        this.meterList = args[1].data.array || [] // 支路下拉列表
        // 初始化采集器端口
        this.initCollectorComs(this.form.collector)
        // 初始化命令列表（放最后面 因为要用到字典）
        this.initTachoList(this.form.measureType)
      })).catch(_ => {
        this.dialogLoading = false
        console.error('支路初始化信息失败(errorMessage)：', _);
      })
    },
    changeDeviceType (id) {
      console.log("切换设备类型：", id)
      if (id && id !== 8) {//设备类型不为变压器,所属变压器/户号置空
        this.form.transformer = '';
        this.form.accountNo = '';
      }
    },
    submit () {
      let result = false
      // 校验表单数据
      this.$refs.form.validate(res => {
        result = res
      })
      // 校验表格数据
      const result2 = this.validateOrderList()
      result = result && result2
      if (!result) return
      let funName = 'meterEdit'
      if (!this.isEdit) {
        funName = 'meterAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增支路成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑支路失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () {
      Object.keys(this.form).forEach(prop => { // 重置数据
        let originalValue = ''
        if (['fictitious', 'oneDevice', 'totalGauges', 'reserve', 'status'].includes(prop)) originalValue = 0
        if (prop === 'gathers') originalValue = []
        this.form[prop] = originalValue
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:branchItem', null)
      this.$emit('update:editDialogVisible', false)
    },
    validateOrderList () { // 校验表单数据，并提示
      const orderList = this.$refs.branchTable ? this.$refs.branchTable.form.tableDataList : []
      if (!this.$refs.branchTable || !orderList.length) {
        this.orderListTip = '命令列表不能为空'
        return false
      }
      // 表单字段规则校验
      let result = true
      this.$refs.branchTable.$refs.ruleForm.validate(res => {
        result = res
      })
      this.orderListTip = result ? '' : '请检查命令列表数据必填性及合法性！'
      return result
    },
    initCollectorComs (val = this.form.collector) { // 初始化采集器端口
      if (val || val === 0) {
        let id = ""
        for (let index = 0, len = this.collectorList.length; index < len; index++) {
          if (val === this.collectorList[index].number) {
            id = this.collectorList[index].id
            break
          }
        }
        if (!id && id !== 0) return // collectorList中没有找到number对应id，则不请求采集器端口列表
        this.collectorGetPort({ id }).then(res => {
          this.isInit1 = false
          this.comList = res.data ? res.data.split(',') : []
          this.$nextTick(_ => {
            this.$refs.form && this.$refs.form.clearValidate()
          })
        })
      } else {
        this.isInit1 = false
      }
    },
    initTachoList (val = this.form.measureType) { // 初始化采集命令列表
      if (val || val === 0) {
        console.log('params', this.params)
        const shopNumber = this.params.buildId
        this.tachometerGetArray({ shopNumber, deviceType: val }).then(res => {
          this.isInit2 = false
          this.tachoList = (res.data || {}).array || []
          this.$nextTick(_ => {
            this.$refs.form && this.$refs.form.clearValidate()
          })
        })
      } else {
        this.isInit2 = false
      }
    },
    validatorParentId (rule, value, callback) {
      if (!value) return callback();
      if (this.meterList.find(item => item.id === value).name === this.form.name) {
        return callback(new Error('所属支路不能为本身，请重新选择'))
      }
      return callback();
    },
    changeCollector (val) {
      // if (this.isInit1) return // 初始化状态不做处理
      this.form.com = ''
      if (!val && val !== 0) {
        this.comList = []
        return
      }
      this.initCollectorComs(val)
    }
  },
  watch: {
    editDialogVisible: { // 监听editDialogVisible，获取点表信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible) return
        this.isInit2 = this.isInit1 = true // 重置初始化标志位
        this.orderListTip = '';
        this.initData()
      }
    },
    'form.deviceType': { // 联动所属变压器
      immediate: true,
      handler: function (val) {
        if (~~val !== 8) this.form.transformer = ''
      }
    },
    // 'form.collector': { // 更新采集器端口
    //   immediate: true,
    //   handler: function (val) {
    //     console.log('val', val)
    //     if (this.isInit1) return // 初始化状态不做处理
    //     this.form.com = ''
    //     if (!val && val !== 0) {
    //       this.comList = []
    //       return
    //     }
    //     this.initCollectorComs(val)
    //   }
    // },
    'form.oneDevice': { // 联动设备编号
      immediate: true,
      handler: function (val) {
        if (~~val !== 0) this.form.deviceNo = ''
      }
    },
    'form.measureType': {
      immediate: true,
      handler: function (val) {
        if (this.isInit2) return // 初始化状态不做处理
        this.form.gathers = []
        if (!val && val !== 0) {
          this.tachoList = []
          return
        }
        this.initTachoList(val)
      }
    },
    // 'form.parentId': {
    //   immediate: true,
    //   handler: function (val) {
    //     if (!val) return // 初始化状态不做处理
    //     if (this.meterList.some(item => item.name === this.form.name)) {
    //       this.$message.error('所属支路不能为本身，请重新选择');
    //       setTimeout(() => {
    //         this.form.parentId = '';
    //       }, 20);
    //     }
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.branch-editor {
  .text-center {
    text-align: center;
  }
  .orderListTip {
    color: red;
    font-size: 12px;
  }
}
</style>
