<template>
  <div class="branch-change-table" v-loading="dialogLoading">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="100px"
      size="mini"
      inline
      :label-position="'left'"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="原电表地址">
            <el-input
              v-model.trim="history.old.number"
              placeholder="原电表地址"
              :disabled="true"
              :maxlength="36"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最终读数">
            <el-input
              v-model.trim="history.old.electricData"
              placeholder="最终读数"
              :disabled="true"
              :maxlength="36"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="number" label="新电表地址">
            <el-input v-model.trim="form.number" placeholder="请输入新电表地址" clearable :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="electricData" label="初始读数">
            <el-input
              v-model.trim="form.electricData"
              placeholder="请输入初始读数"
              clearable
              :maxlength="12"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="history" v-if="history.list.length">
        <h4>更换记录</h4>
        <el-scrollbar
          ref="scrollbar"
          class="history-scrollbar"
          tag="div"
          wrap-class="select-dropdown__wrap"
          view-class="el-select-dropdown__list"
        >
          <ul class="history-list">
            <li v-for="(item, index) in history.list" :key="index">
              <span>{{`原电表地址：${item.meterNo}`}}</span>
              <span>{{`更换人：${item.createName}`}}</span>
              <span>{{`更换时间：${item.createTime}`}}</span>
            </li>
          </ul>
        </el-scrollbar>
      </el-row>
      <el-row class="text-center">
        <el-button type="primary" size="mini" @click="submit">{{branchItem ? '确 定' : '新 增'}}</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { meterGetHistory, meterTrade } from '@/services/system-settings.js'
import Regexps from '@/utils/regexp.js'
export default {
  props: {
    changeDialogVisible: Boolean,
    branchItem: Object
  },
  data () {
    return {
      Regexps, // 正则集合
      dialogLoading: false,
      form: {
        id: '',
        number: '',
        electricData: '',

      },
      formRules: {
        number: [{ required: true, message: '请输入新电表地址' }],
        electricData: [
          { required: true, message: '请输入初始读数' },
          { pattern: Regexps.positiveNumber, message: '只能是正数', trigger: 'blur' }
        ]
      },
      history: {
        old: {},
        list: []
      }
    }
  },
  computed: {
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      params.shopNumber = params.shopNumber || this.$store.getters.getUserInfo.shopNumber
      params.electricDataOld = this.history.old.electricData || '';
      return params
    }
  },
  methods: {
    meterGetHistory, // 换表-获取支路历史信息
    meterTrade, // 换表
    cancle () {
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = ''
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:changeDialogVisible', false)
    },
    submit () {
      let result = false
      // 校验表单数据
      this.$refs.form.validate(res => {
        result = res
      })
      // 校验表格数据
      if (!result) return
      this.dialogLoading = true
      this.meterTrade(this.params).then(res => {
        this.dialogLoading = false
        this.$message.success('换表成功！')
        this.cancle()
      }).catch(_ => {
        console.error('换表失败:', _);
        this.dialogLoading = false
      })
    }
  },
  watch: {
    'changeDialogVisible': {
      immediate: true,
      handler: function (visible) {
        if (!visible || !this.branchItem) return
        let id = this.form.id = this.branchItem.id
        this.dialogLoading = true
        this.meterGetHistory({ id }).then(res => {
          this.history = res.data
          this.dialogLoading = false
        }).catch(err => {
          console.log('换表请求错误:', err)
          this.dialogLoading = false
        })
      }
    }
  }
}
</script>
<style lang="scss">
</style>

<style lang="scss" scoped>
/deep/ .select-dropdown__wrap {
  max-height: 100%;
  overflow-x: hidden;
}
.branch-change-table {
  .history {
    background: #f7fbfc;
    margin-bottom: 20px;
    h4 {
      padding-left: 50px;
      font-size: 14px;
      color: #3a3a3a;
      height: 40px;
      line-height: 40px;
      background: #f1f1f1;
    }
    .history-scrollbar {
      height: 200px;
    }
    .history-list {
      span {
        color: #555;
        font-size: 14px;
        display: inline-block;
        height: 50px;
        line-height: 50px;
        width: 33%;
        padding-left: 50px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
