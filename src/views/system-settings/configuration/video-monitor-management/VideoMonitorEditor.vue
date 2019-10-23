<template>
  <div class="video-monitor-editor">
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
          <el-form-item prop="number" label="监控编号">
            <el-input
              :disabled="isEdit"
              v-model.trim="form.number"
              placeholder="请输入监控编号"
              clearable
              :maxlength="20"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="name" label="摄像头名称">
            <el-input v-model.trim="form.name" placeholder="请输入摄像头名称" clearable :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="type" label="类型">
            <el-select v-model="form.type" placeholder="请选择" clearable @change="changeType">
              <el-option
                v-for="item in monitorTypeList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="cameraIP" label="视频监控IP">
            <el-input
              v-model.trim="form.cameraIP"
              placeholder="请输入视频监控IP"
              clearable
              :maxlength="20"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="cameraPort" label="端口">
            <el-input v-model.trim="form.cameraPort" placeholder="请输入端口" clearable :maxlength="5"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="cameraAccount" label="登录名">
            <el-input
              v-model.trim="form.cameraAccount"
              placeholder="请输入登录名"
              clearable
              :maxlength="20"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="cameraPassword" label="密码">
            <pwd-btn :maxlength="10" v-model.trim="form.cameraPassword" placeholder="请输入密码"></pwd-btn>
            <!-- <el-input
              v-model.trim="form.cameraPassword"
              placeholder="请输入密码"
              clearable
              :maxlength="10"
            ></el-input>-->
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
        <el-col>
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
import { monitorGetInfo, videoMonitorEdit, videoMonitorAdd, getSumpPosition } from '@/services/system-settings.js'
import { statusEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
import PwdBtn from '@/components/form/PwdBtn'
export default {
  props: {
    editDialogVisible: Boolean,
    monitorTypeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    monitorItem: {
      type: Object,
      default: () => null
    }
  },
  components: { PwdBtn },
  data () {
    return {
      statusEnum, // 启用，禁用\
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      form: {
        id: '',
        name: '',
        number: '',
        type: '',
        cameraIP: '',
        cameraAccount: '',
        cameraPassword: '',
        cameraPort: '',
        status: 0,
        remark: ''
      },
      formRules: { // 表单规则
        number: [{ required: true, message: '请输入监控编号', trigger: 'blur' }, { validator: this.testNumber, message: '编号不能包含汉字', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        cameraIP: [
          { required: true, message: '请输入视频监控IP', trigger: 'blur' },
          { pattern: Regexps.checkIP, message: '请输入正确IP地址', trigger: 'blur' }],
        cameraPort: [{ required: true, message: '请输入端口号', trigger: 'blur' }, { pattern: Regexps.checkPort, message: '端口号应在0-65535之间', trigger: 'blur' }],
        cameraAccount: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        cameraPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        // remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
      selectedType: '',//所选类型id
    }
  },
  computed: {
    isEdit () { // 判断是否编辑
      return Boolean(this.monitorItem)
    },
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      // 如果是新增则用当前登陆者的shopNumber
      params.shopNumber = params.shopNumber || this.$store.getters.getUserInfo.shopNumber
      return params
    }
  },
  methods: {
    testNumber (rule, value, callback) {
      if (!rule) return callback()
      if (Regexps.chinese.test(value)) {
        return callback(new Error('编号不能包含汉字)'))
      }
      return callback()
    },
    //类型改变
    changeType (id) {
      // console.log("id=",id,",this.selectedType=",this.selectedType)
      this.selectedType = id;
    },
    videoMonitorAdd, // 新增视频监控配置
    videoMonitorEdit, // 编辑视频监控配置
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'videoMonitorEdit'
      if (!this.isEdit) {
        funName = 'videoMonitorAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增视频监控配置成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑视频监控配置失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = ''
      }, this)
      this.form.status = 0
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:monitorItem', null)
      this.$emit('update:editDialogVisible', false)
    }
  },
  watch: {
    editDialogVisible: { // 监听editDialogVisible，获取视频监控配置信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible || !this.monitorItem) return
        // this.initData()
      }
    },
    monitorItem: { // 监听transformerItem，获取视频监控信息
      immediate: true,
      deep: true,
      handler: function (val) {
        if (!val && val !== 0) return
        // val.meterIds = val.meterIds || [];
        console.log(val)
        Object.keys(this.form).forEach(prop => {
          this.form[prop] = val[prop]
        }, this)
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
.video-monitor-editor {
  .text-center {
    text-align: center;
  }
}
</style>

