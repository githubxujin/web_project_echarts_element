<template>
  <div class="forget-password">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-row :gutter="0">
        <el-col :span="24">
          <el-form-item prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="手机号" maxlength="11">
              <i slot="prefix" class="iconfont icon-shouji"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <el-form-item prop="code">
            <el-input
              class="code"
              v-model="ruleForm.code"
              placeholder="验证码"
              maxlength="6"
              minlength="6"
            >
              <i slot="prefix" class="iconfont icon-yanzhengma"></i>
              <timer-btn slot="suffix" @click.native="sendCode()" :disabled="disabled" ref="btn" />
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <el-form-item prop="password">
            <pwd-btn
              v-model.trim="ruleForm.password"
              placeholder="新密码"
              :showPrefix="true"
              maxlength="16"
            ></pwd-btn>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <el-form-item prop="checkPass">
            <pwd-btn
              v-model.trim="ruleForm.checkPass"
              placeholder="新密码确认"
              :showPrefix="true"
              maxlength="16"
            ></pwd-btn>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 忘记密码
 */
import Regexps from '@/utils/regexp.js'
import PwdBtn from '../../components/form/PwdBtn'
import TimerBtn from './TimerBtn'
import { isPhone, validatePwd, validatePwdCheck, validateCode } from '@/utils/validate-utils.js'
import { getSmsCode, changePwdBySms } from '../../services/user-service.js';
export default {
  components: {
    PwdBtn,
    TimerBtn
  },
  data () {
    return {
      disabled: false,
      ruleForm: {
        phone: '',
        password: '',
        code: '', //验证码
        checkPass: '' //确认密码
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: isPhone },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' },
        ],
        password: [
          { validator: validatePwd, trigger: 'blur' },
          this.$baseConfig.validate.pwd
        ],
        checkPass: [
          { validator: (rule, value, callback) => { return validatePwdCheck(rule, value, callback, this.ruleForm.password) }, trigger: 'blur' },
          this.$baseConfig.validate.pwd
        ]
      }
    }
  },
  methods: {
    //发送验证码
    sendCode: function () {
      if (this.ruleForm.phone == '') {
        this.$message({
          message: '请输入手机号！',
          type: 'error',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      this.$refs.btn.run(); //启动倒计时
      this.disabled = false;
      getSmsCode(this.ruleForm.phone).then((res) => {
        console.log('验证码：', res)
        if (res.code === 200) {
          this.$message({
            message: '短信验证码获取成功，请注意查收！',
            type: 'success',
            duration: this.$baseConfig.messageDuration
          });
        }
      });
    },
    //修改密码
    submitForm (formName) {
      var that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          console.log('验证成功')
          changePwdBySms({ phone: that.ruleForm.phone, password: that.ruleForm.password, code: that.ruleForm.code }).then(res => {
            console.log('提交表单：', res)
            if (res.code == 200) {
              that.$message({
                message: '密码修改成功！',
                type: 'success'
              });
              that.isHide();
            }
          });
        }
      }
      );
    },
    isHide () {
      this.$refs['ruleForm'].resetFields();
      this.$emit('isHideForgetPwd');
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input--prefix .el-input__inner {
  padding-left: 40px;
  border: none;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0px;
}
/deep/ .el-form-item__content {
  margin-left: 5px !important;
}
</style>
<style lang="sass">
.forget-password{
 .code{
  .el-input__suffix {
    top: -5px;
  }
}
}

</style>
