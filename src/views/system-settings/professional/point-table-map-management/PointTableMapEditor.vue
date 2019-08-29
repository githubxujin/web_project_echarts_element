<template>
  <div class="point-table-map-editor">
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
          <el-form-item prop="type" label="映射值类型">
            <el-select v-model="form.type" placeholder="请选择" clearable :disabled="isEdit">
              <el-option
                v-for="item in typeList"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="pointTableId" label="点表地址">
            <el-select v-model="form.pointTableId" placeholder="请选择" clearable :disabled="isEdit">
              <el-option
                v-for="item in pointTableAddrList"
                :label="item.physicalAddress"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="returnValue" label="点表返回值">
            <el-input v-model.trim="form.returnValue" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="returnValueDesc" label="值含义">
            <el-input
              v-model.trim="form.returnValueDesc"
              placeholder="请输入"
              clearable
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="keyValue" label="对应关键值">
            <el-input v-model.trim="form.keyValue" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="keyValueDesc" label="关键值含义">
            <el-input v-model.trim="form.keyValueDesc" placeholder="请输入" clearable :maxlength="16"></el-input>
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
import { pointTableMapAdd, pointTableMapEdit, configTypeQuery, pointTableGetArray } from '@/services/system-settings.js'
import axios from '@/axios/axios.js'
import { statusEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
export default {
  components: {},
  props: {
    editDialogVisible: Boolean,
    pointTableMapItem: {
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
      typeList: [], // 映射值类型列表
      pointTableAddrList: [], // 点表地址列表
      form: {
        id: '',
        type: '',
        pointTableAddr: '',
        pointTableId: '',
        returnValue: '',
        returnValueDesc: '',
        keyValue: '',
        keyValueDesc: '',
        shopNumber: ''
      },
      formRules: { // 表单规则
        type: [{ required: true, message: '请选择映射值类型', trigger: 'change' }],
        pointTableId: [{ required: true, message: '请选择点表地址', trigger: 'change' }]
      }
    }
  },
  computed: {
    isEdit () { // 判断是否编辑
      return Boolean(this.pointTableMapItem)
    },
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      // 如果是新增则用当前登陆者的shopNumber
      params.shopNumber = params.shopNumber || this.$store.getters.getUserInfo.shopNumber
      const addrLen = this.pointTableAddrList.length
      for (var i = 0; i < addrLen; i++) {
        if (params.pointTableId === this.pointTableAddrList[i].id) {
          params.pointTableAddr = this.pointTableAddrList[i].physicalAddress
          break;
        }
      }
      return params
    }
  },
  created () {
    this.initData()
  },
  methods: {
    pointTableMapAdd, // 新增点表
    pointTableMapEdit, // 编辑点表
    configTypeQuery, // 获取映射值类型列表
    pointTableGetArray,
    initData () {
      this.dialogLoading = true
      const configType = [23]
      const shopNumber = this.params.shopNumber
      axios.all([this.configTypeQuery({ configType }), this.pointTableGetArray({ shopNumber })]).then(axios.spread((res1, res2) => {
        this.dialogLoading = false
        if (res1.code !== 200 || res2.code !== 200) return Promise.reject(res1, res2)
        this.typeList = res1.data['23']
        this.pointTableAddrList = res2.data.array || []
      })).catch(_ => {
        this.dialogLoading = false
        console.error('获取映射值类型列表或点表地址列表失败(errorMessage)：', _);
      })
    },
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'pointTableMapEdit'
      if (!this.isEdit) {
        funName = 'pointTableMapAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增点表映射值成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑点表映射值失败(errorMessage):', _);
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
      this.$emit('update:pointTableMapItem', null)
      this.$emit('update:editDialogVisible', false)
    }
  },
  watch: {
    editDialogVisible: { // 监听editDialogVisible，获取点表信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible || !this.pointTableMapItem) return
        Object.keys(this.form).forEach(prop => {
          let value = this.pointTableMapItem[prop]
          this.form[prop] = value
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
.point-table-map-editor {
  .text-center {
    text-align: center;
  }
}
</style>

