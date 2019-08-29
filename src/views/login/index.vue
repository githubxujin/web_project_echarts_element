<template>
  <div class="login-wrap">
    <div class="login-main">
      <div class="login-type">
        <a class="item">登录</a>
      </div>

      <!--帐号密码登录-->
      <div :class="{'fade-in': currentLoginType === loginTypeEnum.user}" class="user">
        <!--用户名-->
        <div
          class="form-input username"
          :class="{
            'actived': userFocus,
            'empty' : usernameEmpty
          }"
        >
          <div class="icon-box">
            <i class="icon" />
          </div>
          <div class="ipt-box">
            <input
              ref="userInput"
              v-model="ruleForm.username"
              name="username"
              type="text"
              placeholder="帐号"
              class="ipt"
              @keyup="keyUpCheck($event)"
              @focus="focused('user')"
              @blur="blured('user')"
            />
          </div>
          <p v-if="usernameEmpty" class="empty position_a">帐号不能为空</p>
        </div>
        <!--密码-->
        <div
          class="form-input password"
          :class="{
            'actived': passwordFocus,
            'empty' : passwordEmpty
          }"
        >
          <div class="icon-box">
            <i class="icon" />
          </div>
          <div class="ipt-box">
            <input
              v-model="ruleForm.password"
              name="password"
              type="password"
              placeholder="密码"
              class="ipt"
              @keyup="keyUpCheck($event)"
              @focus="focused()"
              @blur="blured()"
            />
          </div>
          <p v-if="passwordEmpty" class="empty position_a">密码不能为空</p>
        </div>
        <!--验证码-->
        <div v-if="showIdentifyCode" class="form-input verification-code">
          <div class="icon-box">
            <i class="icon" />
          </div>
          <input
            v-model="userInputCode"
            class="item code-input ipt"
            type="text"
            :placeholder="codePlaceholder"
            :maxlength="identifyCodeLength"
          />
          <div @click="refresCode">
            <div class="item code-area" title="点击刷新验证码">
              <verification-code
                :identify-code="identifyCode"
                content-width="120"
                content-height="42"
              />
            </div>
            <div class="item refres-code" title="刷新">
              <i class="el-icon-refresh" />
            </div>
          </div>
        </div>

        <p class="rember-pw" :class="{checked: remember}" @click="rememberClick">
          <i class="check-box" />
          记住密码
        </p>
        <p class="error-info">
          <span v-if="errorMsg!=''" v-text="errorMsg"></span>
        </p>
        <p class="login-btn" :class="{'not-allow': !isAllowSubmit}" @click="submitForm">
          <el-button class="btn" :loading="btnLoading">
            登
            <i class="space" />录
            <span v-if="!isAllowSubmit">
              (
              {{ showSeconds }}
              )
            </span>
          </el-button>
        </p>
        <p class="fl scan-code-info" @click="download=true">手机扫一扫下载APP</p>
        <p class="alter-pw fr" @click="showForgetPwd=!showForgetPwd;">忘记密码</p>
      </div>
      <!--忘记密码-->
      <el-dialog
        v-dialogDrag
        title="忘记密码"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :visible.sync="showForgetPwd"
        width="400px"
      >
        <forget-password v-if="showForgetPwd" @isHideForgetPwd="showForgetPwd=false"></forget-password>
      </el-dialog>
      <!--扫码登录-->
      <div v-show="download" class="qrcode fade-in">
        <div class="qrcode-box">
          <!-- <i class="corner-border left-top" />
          <i class="corner-border right-top" />
          <i class="corner-border left-bottom" />
          <i class="corner-border right-bottom" />-->
          <div class="appDownload">
            <img src="/static/img/code.png" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <p>版权所有 深圳市紫衡技术有限公司 ©2010 All Rights Reserved.</p>
      <p>
        最佳分辨率1920*950，推荐使用
        <span class="emphasize">谷歌、360浏览器（极速模式）、IE10</span>及以上浏览器
      </p>
    </div>
  </div>
</template>
<script>
// vue 二维码生成组件
import Storages from '../../utils/storages'
import QRCode from 'qrcodejs2'
import VerificationCode from '../../components/VerificationCode.vue'

// import Store from '../../store'
import { menus, platMenus } from '../../mock/permission.js'
import { loginFun } from '../../services/user-service'
import { getShopAuthoritiesArr, setAuthoritiesArr } from '../../utils/permission.js';
import ForgetPassword from './ForgetPassword';
export default {
  components: {
    // QRCode,
    VerificationCode,
    ForgetPassword
  },
  data: function () {
    return {
      btnLoading: false, // 查询按钮loading状态
      showForgetPwd: false,//显示忘记密码
      download: false,
      userFocus: false,
      usernameEmpty: false,
      passwordFocus: false,
      passwordEmpty: false,
      remember: false,
      loginInfo: '',
      ruleForm: {
        username: '',
        password: ''
      },
      loginTypeEnum: {
        user: 'user',
        qrcode: 'qrcode'
      },
      currentLoginType: 'user', // 初始展示
      qrcodeEx: null,
      showIdentifyCode: false, // 是否显示图形验证码
      userInputCode: '', // 用户输入的验证码
      identifyCode: '', // 图形验证码
      passwordErrorCount: 3, // 密码错误次数出现图片验证码
      identifyCodeLength: 4,
      codePlaceholder: '请输入验证码',
      isAllowSubmit: true,
      interval: null,
      intervalCount: 3, // 限制再次提交时间 秒
      showSeconds: null,
      message: null,
      errorMsg: '',//错误信息 :用户名或密码错误，请重新输入
    }
  },
  created () {
    this.initData();
  },
  mounted () {
    let that = this;
    document.onkeydown = function (e) { // 回车提交表单
      // 兼容FF和IE和Opera
      var theEvent = window.event || e
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode
      if (code === 13) { //回车提交
        that.submitForm()
      }
    }
    // this.$refs.userInput && this.$refs.userInput.focus();
  },
  beforeDestroy () {
    document.onkeydown = null;
  },
  methods: {
    // 判断是否是IE浏览器
    isIE () {
      var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // && !isOpera // 判断是否IE浏览器
      if (isIE) {
        this.$message.error('当前浏览器是IE浏览器，为获得更好的用户体验，请使用谷歌浏览器访问本平台')
      }
    },
    focused (target) {
      if (target === 'user') {
        this.userFocus = true
        this.passwordFocus = false
      } else {
        this.userFocus = false
        this.passwordFocus = true
      }
    },
    blured (target) {
      if (target === 'user') {
        this.userFocus = false
        this.usernameEmpty = !this.ruleForm.username.length
      } else {
        this.passwordFocus = false
        this.passwordEmpty = !this.ruleForm.password.length
      }
    },
    rememberClick () {
      this.remember = !this.remember
    },
    // 鼠标移入获取App二维码
    getAppErCode () {
      this.download = false
    },
    // 鼠标移出清除App二维码
    clearAppErCode () {
      this.download = true
    },
    // 刷新图形验证码
    refresCode () {
      if (this.showIdentifyCode) {
        this.identifyCode = this.createRandomString(this.identifyCodeLength)
      }
    },
    //生成随机数
    createRandomString (len) {
      let str = ''
      for (let i = 0; i < len; i++) {
        // 数字48-57 A 65-90  a 97-122
        const num = Math.random() * 123 ^ 0 + 48
        if (num < 48 || num > 122 || num > 57 && num < 65 || num > 90 && num < 97) {
          i--
        } else {
          str += (String.fromCharCode(num))
        }
      }
      return str
    },
    // 校验验证码,去除大小写差异
    checkCode () {
      return (this.userInputCode.toLocaleLowerCase() === this.identifyCode.toLocaleLowerCase())
    },
    // 是否显示图片验证码
    checkShowImgCode (isInit) {
      let pwErr = Storages.getSessionStorage('$pwErr')
      if (pwErr === null) {
        !isInit && Storages.setSessionStorage('$pwErr', 1)
        return false
      }
      if (pwErr >= this.passwordErrorCount) {
        return true
      } else {
        !isInit && Storages.setSessionStorage('$pwErr', pwErr += 1)
      }
      return false
    },
    //初始化数据
    initData () {
      this.loginInfo = Storages.getLocalStorage('$loginInfo')
      this.remember = (this.loginInfo && this.loginInfo.loginstate);
      if (this.remember && this.loginInfo) {
        console.log('this.loginInfo', this.loginInfo)
        this.ruleForm.username = this.loginInfo.loginInfo.username;
        this.ruleForm.password = this.loginInfo.loginInfo.password;
      }
      // 是否显示图片验证码
      this.showIdentifyCode = this.checkShowImgCode(true)
      // 生成验证码
      this.refresCode()
    },
    submitForm () {
      this.errorMsg = '';
      // 模拟权限信息
      // console.log('menus', menus)
      var toUrl = '';
      if (!this.isAllowSubmit) return

      if (!this.ruleForm.username) {
        this.errorInfo('帐号不能为空')
        this.usernameEmpty = true
        return
      }

      if (!this.ruleForm.password) {
        this.errorInfo('密码不能为空')
        this.passwordEmpty = true
        return
      }
      // 图片验证码校验
      if (this.showIdentifyCode && !this.checkCode()) {
        // 图片验证码错误 
        this.userInputCode = ''
        this.refresCode()
        this.errorInfo('图形验证码错误')
        return
      }
      this.btnLoading = true;
      loginFun({
        userName: this.ruleForm.username,
        password: this.ruleForm.password
      }).then((res) => {
        console.log('登陆信息：', res)
        // 存储当前用户权限
        if (res.data.permission) {
          console.log('res.data.permission', res.data.permission)
          setAuthoritiesArr(res.data.permission);//存储权限
        }
        // 存储用户信息
        if (res.data.info) {
          // const userinfo = { shopname: '武汉竹叶山店', username: 'admin' } // 模拟存储店铺信息
          this.$store.commit('user/setUserInfo', res.data.info)
          toUrl = res.data.info.roleType == 1 ? '/plat-index' : '/shop-index'; //1：集团、2：门店
        }
        //存储门店IP地址信息
        if (res.data.addressInfo) {
          this.$store.commit('user/setShopAddressInfo', res.data.addressInfo)
        }
        // success
        if (res.data.token) {
          console.log('res.data.token----------------', res.data.token)
          this.$store.commit('user/setRequestHeader', res.data.token);
          this.loginSuccess(toUrl)
        }
      }).catch((error) => {
        console.log('error', error);
        this.errorMsg = error.msg;
        this.loginError(error.msg)
        this.errorInterval()
        this.btnLoading = false;
      })
    },
    // 错误倒计时
    errorInterval () {
      // 限制连续提交
      this.isAllowSubmit = false
      this.showSeconds = this.intervalCount
      this.interval = setInterval(
        () => {
          this.showSeconds -= 1
          if (this.showSeconds < 0) {
            this.showSeconds = this.intervalCount
            this.isAllowSubmit = true
            clearInterval(this.interval)
          }
        }, 1000)
    },
    // 登录错误提示
    loginError (msg) {
      // this.errorInfo(msg)
      // 错误次数记录;是否显示图片验证码
      this.showIdentifyCode = this.checkShowImgCode();
      if (this.showIdentifyCode) {
        // 生成验证码
        this.refresCode()
      }
    },
    //登录成功回调
    loginSuccess (toUrl) {
      console.log('loginSuccess-toUrl', toUrl)
      this.loginInfo = {
        loginInfo: this.ruleForm,
        loginstate: this.remember
      }
      Storages.removeSessionStorage('$pwErr')
      Storages.setLocalStorage('$loginInfo', this.loginInfo)
      const it = this;
      this.$message({
        message: '登陆成功，正在跳转...',
        type: 'success',
        duration: 500,
        onClose: function () {
          it.btnLoading = false;
          // 模拟跳转
          it.$router.push({
            path: toUrl
          });
        }
      })
    },
    // 错误提示
    errorInfo (msg) {
      this.message && this.message.close()
      this.message = this.$message({
        message: msg,
        type: 'error',
        duration: 3000,
        center: true
      })
    },
    // 输入检验
    keyUpCheck (event) {
      // console.log(event.keyCode)
      const val = event.target.value.replace(/ /g, '')
      if (event.target.name === 'username') {
        this.ruleForm.username = val
        this.usernameEmpty = !this.ruleForm.username.length
      } else {
        this.ruleForm.password = val
        this.passwordEmpty = !this.ruleForm.username.length
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import './login.scss';
</style>
<style lang="scss">
/*关闭Chrome浏览器表单自动填充默认样式*/
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
}
</style>

