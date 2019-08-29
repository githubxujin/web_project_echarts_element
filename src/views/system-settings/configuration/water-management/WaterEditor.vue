<template>
  <div class="water-editor">
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
          <el-form-item prop="number" label="设备编号">
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
          <el-form-item prop="name" label="设备名称">
            <el-input v-model.trim="form.name" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item prop="dataAddress" label="数据地址">
            <el-input v-model.trim="form.dataAddress" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>-->
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
        <el-col :span="12">
          <!-- <span>{{deviceTypeListCopy}}</span> -->
          <el-form-item prop="deviceType" label="设备类型">
            <!-- 14/15多加一个高度参数 -->
            <el-select
              v-model="form.deviceType"
              placeholder="请选择"
              clearable
              @change="deviceTypeChange"
            >
              <el-option
                v-for="item in deviceTypeListCopy"
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
          <el-form-item prop="belongTo" label="所属设备">
            <el-select v-model="form.belongTo" placeholder="请选择" clearable>
              <el-option
                v-for="item in deviceList"
                :label="item.number"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="location" label="位置">
            <el-input v-model.trim="form.location" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="volume" label="体积">
            <el-input
              v-model.trim="form.volume"
              placeholder="请输入"
              clearable
              :maxlength="16"
              :disabled="volumeEdited"
            >
              <span slot="suffix">
                m
                <sup>3</sup>
              </span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="model" label="型号">
            <el-input v-model.trim="form.model" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="flow" label="流量">
            <el-input
              v-model.trim="form.flow"
              placeholder="请输入"
              clearable
              :maxlength="16"
              :disabled="flowEdited"
            >
              <span slot="suffix">
                m
                <sup>3</sup>/s
              </span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="[14,15].includes(~~form.deviceType)">
          <el-form-item prop="height" label="高度">
            <el-input v-model.trim="form.height" placeholder="请输入" clearable :maxlength="16">
              <span slot="suffix">m</span>
            </el-input>
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
import { drainageAdd, drainageEdit, drainageGetArray, meterGetArray } from '@/services/system-settings.js'
import { yesOrNoEnum, statusEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
export default {
  components: {},
  props: {
    editDialogVisible: Boolean,
    waterItem: {
      type: Object,
      default: () => null
    },
    deviceTypeList: Array
  },
  data () {
    return {
      yesOrNoEnum, // 是否
      statusEnum, // 启用，禁用
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      initFlag: false, // 所属单位初始化标志位
      deviceList: [], // 设备列表
      meterList: [], // 支路列表
      form: {
        id: '',
        number: '',
        name: '',
        // dataAddress: '',
        meterId: '',
        deviceType: '',
        height: '',
        belongTo: '',
        location: '',
        volume: '',
        model: '',
        flow: '',
        backend: 1,
        status: 0,
        shopNumber: ''
      },
      formRules: { // 表单规则
        number: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        // dataAddress: [{ required: true, message: '请输入数据地址', trigger: 'blur' }],
        volume: [{ pattern: Regexps.positiveNumber, message: '只能是正数', trigger: 'blur' }],
        flow: [{ pattern: Regexps.positiveNumber, message: '只能是正数', trigger: 'blur' }],
        height: [
          { validator: this.validateHeight, trigger: 'blur' },
          { pattern: Regexps.positiveNumber, message: '只能是正数', trigger: 'blur' }
        ]
      },
      volumeEdited: false,
      flowEdited: false,
    }
  },
  computed: {
    deviceTypeListCopy () {
      let deviceTypeList = JSON.parse(JSON.stringify(this.deviceTypeList || []))
      deviceTypeList.shift()
      console.log('deviceTypeList:', deviceTypeList);
      return deviceTypeList
    },
    isEdit () { // 判断是否编辑
      return Boolean(this.waterItem)
    },
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      // 如果是新增则用当前登陆者的shopNumber
      params.shopNumber = params.shopNumber || this.$store.getters.getUserInfo.shopNumber
      if (params.deviceType || params.deviceType === 0) {
        const arr = this.deviceTypeListCopy
        for (let index = 0, len = arr.length; index < len; index++) {
          if (arr[index].id !== params.deviceType) continue
          params.configType = arr[index].configType
          params.pid = arr[index].pid
          break;
        }
      }
      // 高度 设备不为高位水箱或集水井情况下置空高度 空字符串改为空对象
      params.height = [14, 15].includes(~~params.deviceType) && params.height || params.height === 0 ? params.height : null
      /**
       * 在前端通过id值判断是否是有问题的
       */
      // 如果是备用生活水箱水泵 则用是否备用字段 置为是 否则为 否
      params.backend = [14, 17].includes(params.deviceType) ? 0 : 1
      return params
    }
  },
  created () {
    this.initDict()
  },
  methods: {
    drainageAdd, // 新增给排水设备
    drainageEdit, // 编辑给排水设备
    drainageGetArray, // 获取给排水设备
    meterGetArray, // 获取支路列表
    initDict () { // 初始化数据
      this.$common.updateLoadingStatus(true)
      const shopNumber = this.params.shopNumber
      this.meterGetArray({ shopNumber }).then(res => {
        this.meterList = res.data.array || []
        this.$common.updateLoadingStatus(false)
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
      })
    },
    initDevice (value) {
      this.deviceList = []
      if (~~this.params.pid < 1) return
      this.drainageGetArray({
        shopNumber: this.params.shopNumber,
        deviceType: this.params.pid
      }).then(res => {
        this.deviceList = res.data.array || []

      }).catch(_ => {
        this.deviceList = []
        console.error('获取设备列表失败(errorMessage)：', _);
      })
    },
    deviceTypeChange (value) { // 设备类型变化
      // console.log("设备类型：",value)
      this.form.belongTo = ''
      if (value === 12 || value === 16) {//设备类型为水泵时，禁用体积
        this.form.volume = '';
        this.volumeEdited = true;
        this.flowEdited = false;
      } else if (value === 14 || value === 15) {//设备类型为生活水池或集水井时，禁用流量
        this.form.flow = '',
          this.flowEdited = true;
        this.volumeEdited = false;
      } else {
        this.volumeEdited = false;
        this.flowEdited = false;
      }
      this.initDevice(value)
    },
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'drainageEdit'
      if (!this.isEdit) {
        funName = 'drainageAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增给排水设备成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑给排水设备失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = ''
      }, this)
      this.form.status = this.form.backend = 0
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:waterItem', null)
      this.$emit('update:editDialogVisible', false)
      this.volumeEdited = false;
      this.flowEdited = false;
    },
    validateHeight (rule, value, callback) {
      if ([14, 15].includes(~~this.form.deviceType) && !value && value !== 0) return callback(new Error('必填'))
      return callback()
    }
  },
  watch: {
    editDialogVisible: { // 监听editDialogVisible，获取给排水设备信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible || !this.waterItem) return
        Object.keys(this.form).forEach(prop => {
          let value = this.waterItem[prop]
          this.form[prop] = value
        }, this)
        this.initDevice(this.form.deviceType)
        this.$nextTick(_ => {
          this.$refs.form && this.$refs.form.clearValidate()
        })
      }
    },
    'form.deviceType': {
      immediate: true,
      handler: function (val) {
        console.log('val', val);
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
.water-editor {
  .text-center {
    text-align: center;
  }
}
</style>

