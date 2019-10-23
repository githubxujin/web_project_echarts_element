<template>
  <div class="audit">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item :label="msgLabel">{{msg}}</el-form-item>
      <el-form-item label="审核" prop="checkResult">
        <el-radio-group v-model="ruleForm.checkResult">
          <el-radio :label="0">通过</el-radio>
          <el-radio :label="1">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="ruleForm.checkResult==1" label="驳回原因" prop="rejectInfo">
        <el-input v-model="ruleForm.rejectInfo"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="$common.throttle(submitForm)()" :loading="btnLoading">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    },
    msgLabel: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ruleForm: { rejectInfo: '', checkResult: 0 },
      rules: {
        rejectInfo: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        checkResult: [
          { required: true, message: '请输入审核结果', trigger: 'blur' },
        ]
      },
    }
  },
  computed: {
    btnLoading: function () {
      return this.$store.getters.getBtnLoading;
    }
  },
  methods: {
    //提交
    submitForm () {
      if (this.ruleForm.checkResult == 0) { //通过
        this.$store.commit('base/updateBtnLoading', true);
        this.$emit("submitForm", this.ruleForm);
      } else { //驳回
        this.$refs['ruleForm'].validate((valid) => {
          console.log('this.ruleForm :', this.ruleForm);
          if (valid) {
            this.$store.commit('base/updateBtnLoading', true);
            this.$emit("submitForm", this.ruleForm);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
  }
}
</script>

<style lang="scss" scoped>
</style>