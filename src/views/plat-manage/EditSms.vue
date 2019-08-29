<template>
  <div class="user-editor">
    <el-form v-loading="dialogLoading"
             ref="form"
             :model="form"
             :rules="formRules"
             label-width="90px"
             size="mini"
             inline
           >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="templateId"
                        label="模版ID">
            <el-input v-model="form.templateId"
                      placeholder="请输入"
                      clearable
                      :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="title"
                        label="短信标题">
            <el-input v-model="form.title"
                      placeholder="请输入"
                      clearable
                      :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-form-item prop="content"
                      label="短信内容">
          <el-input type="textarea"
                    v-model="form.content"
                    placeholder="请输入"
                    :maxlength="70"
                    :rows="5"
                    clearable></el-input>
        </el-form-item>

      </el-row>

      <el-row>

        <el-form-item label="状态">
          <el-radio v-model="form.status"
                    label="0">启用</el-radio>
          <el-radio v-model="form.status"
                    label="1">禁用</el-radio>
        </el-form-item>

      </el-row>

      <el-row class="text-center">
        <el-button type="primary"
                   round
                   size="mini"
                   @click="submit"
                   :loading="submitLoading">{{isEdit ? '确 定' : '新 增'}}
        </el-button>

          <el-button round
                     size="mini"
                     @click="close">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { addSms, editSms } from '@/services/plat-manage';
import Regexps from '@/utils/regexp.js'

export default {
  props: {
    dialogVisible: Boolean,
    smsInfo: {}
  },
  data () {
    return {
      isEdit: false,
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      form: {
        templateId: '',
        title: '',
        content: '',
        status: "0"
      },
      formRules: { // 表单规则
        templateId: [
          { required: true, message: '请输入模版ID', trigger: 'blur' },
          { pattern: Regexps.positiveInteger, message: '模版ID必须为正整数', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        content: [{ required: true, message: '请输入模版内容', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.isEdit = false;
    if (this.smsInfo && this.smsInfo.hasOwnProperty("id")) {
      this.form.id = this.smsInfo.id;
      this.form.templateId = this.smsInfo.templateId;
      this.form.title = this.smsInfo.title;
      this.form.content = this.smsInfo.content;
      this.form.status = this.smsInfo.status.toString();
      this.isEdit = true;
    }

  }
  , methods: {
    submit () {
      let result = false
      this.$refs.form.validate(res => {
        result = res
      });
      if (!result) return
      let funName = 'adminEdit'
      let params = JSON.parse(JSON.stringify(this.form));
      this.dialogLoading = true;
      if (this.isEdit) {

        editSms(params).then((res) => {
          // alert(JSON.stringify(res));
          if (res.data === 1) {
            this.dialogLoading = false;
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = ''
            }, this);
            this.$refs.form && this.$refs.form.resetFields();
            this.$emit('update:dialogVisible', 1)
            this.$message.success("编辑成功");
          }
          else {
            this.dialogLoading = false;
            this.$message.error("编辑失败");
          }
        }).catch((error) => {
          this.dialogLoading = false;
        });
        return;
      }
      addSms(params).then((res) => {
        if (res.data === 1) {
          this.dialogLoading = false;
          Object.keys(this.form).forEach(prop => {
            this.form[prop] = ''
          }, this);
          this.$refs.form && this.$refs.form.resetFields();
          this.$emit('update:dialogVisible', 1)
          this.$message.success("添加成功");
        }
        else {
          this.dialogLoading = false;
          this.$message.error("添加失败");
        }
      }).catch((error) => {
        this.dialogLoading = false;
      });
    },
    close () {
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = ''
      }, this);
      this.$refs.form && this.$refs.form.resetFields();
      this.$emit('update:dialogVisible', false);
    }
  }
}
</script>
<style lang="scss" scoped>
.user-editor {
  .text-center {
    text-align: center;
  }
}
/deep/ .el-textarea {
  width: 550px;
}
</style>

