<template>
  <div class="cool-station-editor">
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
        <el-col :span="12">
          <el-form-item prop="deviceType" label="设备类型">
            <TreeSelect
              v-model="form.deviceType"
              placeholder="请选择"
              :clearable="true"
              :data="deviceTypeList"
            ></TreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="location" label="设备安装地址">
            <el-input v-model.trim="form.location" placeholder="请输入" clearable :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="meterIdList" label="所属支路">
            <ProjectTree
              class="project-tree"
              v-model="form.meterIdList"
              :dataArray="branchDataArray"
              :defaultProps="branchDefaultProps"
              :checkedLabel="form.meterNameList"
              placeholder
              inputType="textarea"
              :rows="2"
              :showTabs="false"
              :showTitle="false"
              @change="branchChange"
              :anotherStyle="false"
            ></ProjectTree>
            <!-- <TreeSelect
              v-model="form.meterIdList"
              placeholder="请选择"
              :clearable="true"
              @change="branchChange"
              :data="branchDataArray"
              :defaultProps="defaultProps"
              :isOnlyLeafSelect="true"
            ></TreeSelect>-->
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
            maxlength="100"
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
import ProjectTree from '@/components/projecttree'
import TreeSelect from '@/components/treeSelect'
import { coolingStationAdd, coolingStationEdit, deviceTypeQuery, meterGetArray, meterGetTreeArray } from '@/services/system-settings.js'
import axios from '@/axios/axios.js'
import { statusEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
export default {
  components: { ProjectTree, TreeSelect },
  props: {
    editDialogVisible: Boolean,
    coolStationItem: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      statusEnum, // 启用，禁用
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      deviceTypeList: [], // 设备类型列表
      form: {
        id: '',
        number: '',
        name: '',
        deviceType: '',
        location: '',
        meterIdList: [],
        meterNameList: '',
        status: 0,
        remark: '',
        shopNumber: ''
      },
      formRules: { // 表单规则
        number: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
      },
      branchDataArray: [], // 支路下拉树选项
      branchDefaultProps: { // project tree选项
        children: 'children',
        label: 'name',
        key: 'id'
      },
      defaultProps: {
        children: 'childList',
        label: 'configName',
        key: 'id',
        disabled: 'disabled'
      },
      branchCheckedLabel: '请选择支路', //project-tree展示的内容
    }
  },
  computed: {
    isEdit () { // 判断是否编辑
      return Boolean(this.coolStationItem)
    },
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      // 如果是新增则用当前登陆者的shopNumber
      params.shopNumber = params.shopNumber || this.$store.getters.getUserInfo.shopNumber
      // 后端不要的东西
      delete params.meterNameList
      return params
    }
  },
  created () {
    this.initData()
  },
  methods: {
    coolingStationAdd, // 新增冷站设备
    coolingStationEdit, // 编辑冷站设备
    deviceTypeQuery, // 获取设备类型列表
    meterGetArray, // 获取支路列表
    meterGetTreeArray, // 获取支路下拉树列表
    initData () {
      this.dialogLoading = true
      const configType = [14]
      const shopNumber = this.params.shopNumber
      axios.all([this.deviceTypeQuery({ deviceType: 3, flat: 0 }), this.meterGetTreeArray({ shopNumber })]).then(axios.spread((res1, res2) => {
        this.dialogLoading = false
        if (res1.code !== 200 || res2.code !== 200) return Promise.reject(res1, res2)
        this.deviceTypeList = res1.data.children || []
        let dataArr = (res2.data || {}).array || []
        this.branchDataArray = [{
          label: "支路",
          type: "branch",
          data: dataArr
        }]
      })).catch(_ => {
        this.dialogLoading = false
        console.error('获取设备类型及支路列表失败(errorMessage)：', _);
      })
    },
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'coolingStationEdit'
      if (!this.isEdit) {
        funName = 'coolingStationAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增冷站设备成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑冷站设备失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        switch (prop) {
          case 'meterIdList': this.form[prop] = []
            break;
          case 'status': this.form[prop] = 0
            break;
          default: this.form[prop] = '';
            break;
        }
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:coolStationItem', null)
      this.$emit('update:editDialogVisible', false)
    },
    branchChange () { // 支路change事件
      // let checkedNodeList = arguments[1].filter(item => !item.children)
      let value = [];
      let labelList = arguments[1].map(item => {
        value.push(item.id);
        return `[${item.electricAddr}]${item.name}`
      })
      this.form.meterNameList = labelList.join(',') || '请选择支路'
      setTimeout(_ => { // 多选支路id问题
        this.form.meterIdList = value || [];
      }, 200)
    }
  },
  watch: {
    editDialogVisible: { // 监听editDialogVisible，获取冷站设备信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible || !this.coolStationItem) return
        Object.keys(this.form).forEach(prop => {
          let value = this.coolStationItem[prop]
          switch (prop) {
            case 'meterIdList':
              this.form[prop] = value || [];
              break;
            default:
              this.form[prop] = value;
              break;
          }
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
.cool-station-editor {
  .text-center {
    text-align: center;
  }
  .project-tree {
    width: 520px;
  }
}
</style>

