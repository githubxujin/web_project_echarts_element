<template>
  <div class="elevator-editor">
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
          <el-form-item prop="number" label="电梯编号">
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
          <el-form-item prop="name" label="电梯名称">
            <el-input v-model.trim="form.name" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="dataAddress" label="数据地址">
            <el-input
              v-model.trim="form.dataAddress"
              placeholder="请输入数据地址"
              clearable
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="meterId" label="所属支路">
            <el-select v-model="form.meterId" placeholder="请选择" clearable>
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
          <el-form-item prop="cameraIP" label="监控地址">
            <el-input v-model.trim="form.cameraIP" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="cameraPort" label="端口">
            <el-input v-model.trim="form.cameraPort" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="cameraAccount" label="用户名">
            <el-input v-model.trim="form.cameraAccount" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="cameraPassword" label="密码">
            <!-- <el-input
              v-model.trim="form.cameraPassword"
              placeholder="请输入"
              clearable
              :maxlength="16"
            ></el-input>-->
            <pwd-btn :maxlength="16" v-model.trim="form.cameraPassword" placeholder="请输入"></pwd-btn>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="location" label="位置">
            <el-input v-model.trim="form.location" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="volume" label="容积">
            <el-input v-model.trim="form.volume" placeholder="请输入" :maxlength="7">
              <span slot="suffix" class="upper-little">
                m
                <sup>3</sup>
              </span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="upperFloor" label="最高层">
            <el-input v-model.trim="form.upperFloor" placeholder="请输入" :maxlength="7">
              <span slot="suffix">层</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="payLoad" label="载重">
            <el-input v-model.trim="form.payLoad" placeholder="请输入" :maxlength="7">
              <span slot="suffix">KG</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="lowerFloor" label="最低层">
            <el-input v-model.trim="form.lowerFloor" placeholder="请输入" :maxlength="7">
              <span slot="suffix">层</span>
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
      <el-row>
        <el-col :span="24">
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
import url from '@/axios/url.js'
import PwdBtn from '@/components/form/PwdBtn'
import { elevatorAdd, elevatorEdit } from '@/services/system-settings.js'
import Regexps from '@/utils/regexp.js'
import { statusEnum } from '@/enum/dicts.js'

export default {
  props: {
    meterList: { // 支路下拉列表
      type: Array,
      default: () => []
    },
    dialogVisible: Boolean,
    elevatorItem: Object
  },
  components: {
    PwdBtn
  },
  data () {
    const numberRule = {
      pattern: Regexps.integerNumber, message: '仅支持整数和0', trigger: 'blur'
    }
    return {
      Regexps, // 正则集合
      statusEnum, // 状态列表
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      form: {
        id: '',
        number: '',
        name: '',
        dataAddress: '',
        location: '',
        cameraIP: '',
        cameraPort: '',
        cameraAccount: '',
        cameraPassword: '',
        volume: '',
        payLoad: '',
        upperFloor: '',
        lowerFloor: '',
        meterId: '',
        status: 0,
        remark: '',
        shopNumber: ''
      },
      formRules: { // 表单规则
        number: [{ required: true, message: '请输入电梯编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入电梯名称', trigger: 'blur' }],
        dataAddress: [{ required: true, message: '请输入数据地址', trigger: 'blur' }],
        volume: [{ pattern: Regexps.positiveNumber, message: '只能是正数', trigger: 'blur' }],
        payLoad: [{ pattern: Regexps.positiveNumber, message: '只能是正数', trigger: 'blur' }],
        upperFloor: [numberRule, {
          validator: this.validateUpperFloor, trigger: 'blur'
        }],
        lowerFloor: [numberRule, {
          validator: this.validateLowerFloor, trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    isEdit () { // 判断是否编辑
      return Boolean(this.elevatorItem)
    },
    params () { // 格式化表单数据
      let params = JSON.parse(JSON.stringify(this.form))
      if (!this.isEdit) {
        params.shopNumber = (this.$store.getters.getUserInfo || {}).shopNumber
      }
      return params
    }
  },
  methods: {
    elevatorAdd, // 新增电梯
    elevatorEdit, // 编辑电梯
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'elevatorEdit'
      if (!this.isEdit) {
        funName = 'elevatorAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增电梯成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑电梯信息失败(errorMessage):', _);
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
      this.$emit('update:elevatorItem', null)
      this.$emit('update:dialogVisible', false)
    },
    validateUpperFloor (rule, value, callback) {
      if (!Regexps.integerNumber.test(this.form.upperFloor) || !Regexps.integerNumber.test(this.form.lowerFloor)) return callback()
      if ((value || value === 0) && (this.form.lowerFloor || this.form.lowerFloor === 0) && Number(value) < Number(this.form.lowerFloor)) {
        return callback(new Error('最高层不能低于最低层'))
      }
      return callback()
    },
    validateLowerFloor (rule, value, callback) {
      if (!Regexps.integerNumber.test(this.form.upperFloor) || !Regexps.integerNumber.test(this.form.lowerFloor)) return callback()
      if ((value || value === 0) && (this.form.upperFloor || this.form.upperFloor === 0) && Number(value) > Number(this.form.upperFloor)) {
        return callback(new Error('最低层不能高于最高层'))
      }
      return callback()
    }
  },
  watch: {
    elevatorItem: { // 监听elevatorItem，获取用户信息
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
.elevator-editor {
  .upper-little {
    font-size: 14px;
    position: relative;
    top: -5px;
  }
  .text-center {
    text-align: center;
  }
}
</style>
