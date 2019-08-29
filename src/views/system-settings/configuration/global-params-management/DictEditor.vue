<template>
  <div class="tachometer-editor">
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
          <el-form-item prop="type" label="所属大类">
            <el-select
              v-model="form.type"
              placeholder="请选择"
              @change="typeChange(form.type, 'type')"
              clearable
            >
              <el-option
                v-for="item in tabListData"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="configType" :class="{'is-required': subTypeList.length}" label="所属子类">
            <el-select
              v-model="form.configType"
              placeholder="请选择"
              @change="typeChange(form.configType, 'configType')"
              clearable
            >
              <el-option
                v-for="item in subTypeList"
                :label="item.name"
                :value="item.tid"
                :key="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="configName" label="类别名称">
            <el-input v-model.trim="form.configName" clearable :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="pid" label="所属父类">
            <el-select v-model="form.pid" placeholder="请选择" clearable>
              <el-option
                v-for="item in dictList"
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
          <el-form-item prop="rank" label="排序">
            <el-input v-model.trim="form.rank"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item prop="content" label="备注">
          <el-input
            style="width:520px;"
            type="textarea"
            placeholder="请输入内容"
            v-model.trim="form.content"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row class="text-center">
        <el-button type="primary" size="mini" @click="submit">新 增</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { dictAdd, dictGetArray } from '@/services/system-settings.js'
import Regexps from '@/utils/regexp.js'
export default {
  components: {},
  props: {
    dialogVisible: Boolean,
    tabListData: {
      type: Array,
      default: () => { return [] }
    },
    data: {
      type: Object,
      dafault: () => { return {} }
    },
    subTypeListCopy: {
      type: Array,
      default: () => { return [] }
    },
    dictListCopy: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    const validateRank = (rule, value, callback) => {
      if (!Regexps.positiveInteger0.test(value) || value > 127) return callback(new Error('排序值必须为0-127之间的自然数！'))
      return callback()
    }
    return {
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      typeInitFlag: false, // 类别列表是否已初始化标志位
      subTypeList: [], // 子类列表
      dictList: [], // 父类列表
      form: {
        type: '',
        configType: '',
        configName: '',
        pid: '',
        rank: 0,
        content: ''
      },
      formRules: { // 表单规则
        type: [{ required: true, message: '请选择所属大类', trigger: 'change' }],
        configType: [{ validator: this.validateConfigType, trigger: 'change' }],
        configName: [{ required: true, message: '请输入类别名称', trigger: 'blur,change' }],
        rank: [{ required: true, message: '请输入排序', trigger: 'blur,change' }, { validator: validateRank, trigger: 'blur,change' }]
      }
    }
  },
  computed: {
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      if (!this.subTypeList.length) {
        for (let index = 0, len = this.tabListData.length; index < len; index++) {
          if (this.tabListData[index].id === params.type) {
            params.configType = this.tabListData[index].tid
            break;
          }
        }
      }
      params.shopNumber = this.$store.getters.getUserInfo.shopNumber
      return params
    }
  },
  created () {
  },
  methods: {
    dictAdd, // 新增表计参数
    dictGetArray, // 获取父类列表
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      this.dialogLoading = true
      this.dictAdd(this.params).then(res => {
        this.dialogLoading = false
        this.$message.success('新增成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        if (prop === 'rank') {
          this.form[prop] = 0
        } else {
          this.form[prop] = ''
        }
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:dialogVisible', false)
    },
    typeChange (value, type) {
      if (!this.typeInitFlag) return // 未初始化不做操作
      // 已初始化
      if (type === 'type') {
        this.dictList = [] // 清空父类列表
        this.subTypeList = [] // 清空小类列表
        this.form.configType = '' // 清空小类值
        this.form.pid = '' // 清空父类值
        this.$nextTick(_ => {
          this.$refs.form && this.$refs.form.clearValidate()
        })
        if (!value && value !== 0) return
        // 获取小类列表
        for (let index = 0, len = this.tabListData.length; index < len; index++) {
          if (this.form.type.toString() === this.tabListData[index].id.toString()) {
            this.subTypeList = this.tabListData[index].array || []
            break;
          }
        }
        if (!this.subTypeList.length) { // 子类列表无长度 则通过大类来获取父类列表
          this.dictGetArray(this.params).then(res => {
            this.dictList = res.data[this.params.configType]
          }).catch(_ => {
            this.dictList = []
          })
        }
      } else if (type === 'configType') {
        if (this.subTypeList.length) this.dictList = [] // 子类列表有长度清空父类列表
        this.form.pid = '' // 清空父类值
        if (!value && value !== 0) return
        // 获取父类列表
        this.dictGetArray(this.params).then(res => {
          this.dictList = res.data[this.params.configType]
        }).catch(_ => {
          this.dictList = []
        })
      }
    },
    validateConfigType (rule, value, callback) {
      if (!this.subTypeList.length) return callback()
      if (!value && value !== 0) return callback('请选择所属子类')
      return callback()
    }
  },
  watch: {
    'dialogVisible': {
      immediate: true,
      handler: function (val) {
        if (!val) return
        this.typeInitFlag = false // 初始化 类别初始化标志位
        let data = JSON.parse(JSON.stringify(this.data || {}))
        data.type = Number(data.type)
        this.form = Object.assign({}, this.form, data)
        this.$nextTick(_ => {
          this.$refs.form && this.$refs.form.clearValidate()
          this.typeInitFlag = true
        })
      }
    },
    subTypeListCopy: {
      immediate: true,
      handler: function (val) {
        this.subTypeList = JSON.parse(JSON.stringify(val || []))
      }
    },
    dictListCopy: {
      immediate: true,
      handler: function (val) {
        this.dictList = JSON.parse(JSON.stringify(val || []))
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
}
</style>

