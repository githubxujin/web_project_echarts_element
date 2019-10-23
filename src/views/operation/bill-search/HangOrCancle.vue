<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item :label="title+'原因'" prop="reason">
        <el-input type="textarea" v-model="ruleForm.reason"></el-input>
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
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ruleForm: { reason: '' },
      rules: {
        reason: [
          { required: true, message: '请输入' + this.title + '原因', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
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
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('base/updateBtnLoading', true);
          this.$emit("submitForm", this.ruleForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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