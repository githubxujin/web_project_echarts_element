<template>
  <div class="content">
    <div id="sky">
      <div class="bird">
        <div class="wind"></div>
        <div class="wind"></div>
        <div class="wind"></div>
        <div class="wind"></div>
        <div class="wind"></div>
        <div class="wind"></div>
        <div class="wind"></div>
        <div class="wind"></div>
        <div class="wind"></div>
        <div class="wind"></div>
        <div class="bird_body">
          <div class="bird_head"></div>
          <div class="bird_wing_left">
            <div class="bird_wing_left_top"></div>
          </div>
          <div class="bird_wing_right">
            <div class="bird_wing_right_top"></div>
          </div>
          <div class="bird_tail_left"></div>
          <div class="bird_tail_right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//系统跳转过渡页
import { shopLogin } from '@/services/system-settings'
import { setAuthoritiesArr } from '../../utils/permission.js';
import Storages from '../../utils/storages'
export default {
  created () {
    console.log('this.$route :', this.$route);
    /*** 集团跳转门店测试代码START */
    if (this.$route.query.token && this.$route.query.userName) {
      this.shopLogin(this.$route.query).then(res => {
        // 存储当前用户权限
        if (res.data.permission) {
          setAuthoritiesArr(res.data.permission);//存储权限
        }
        // 存储用户信息
        if (res.data.info) {
          // console.log('res.data.info :', res.data.info);
          this.$store.commit('user/setUserInfo', res.data.info);
          if (res.data.info.shopname) {
            this.$store.commit('base/updateCurShopName', res.data.info.shopname);
          }
        }
        // success
        if (res.data.token) {
          this.$store.commit('user/setRequestHeader', res.data.token);
          let referer = this.$route.query.referer;
          let id = this.$route.query.id;
          if (referer == 'alarm-rank') {
            this.loginSuccess({ path: '/safety/alarm/view', name: 'AlarmView', params: { referer: 'index', status: ['0', '2'] } });
          } else if (referer == 'alarm-detail') {
            this.loginSuccess({ path: '/safety/alarm/view', name: 'AlarmView', params: { referer: 'index', id: id } });
          } else {
            this.loginSuccess({ path: '/shop-index' });
          }
        }
      }).catch(error => {
        console.error('跳转失败：', error);
        history.back(-1); //返回上一页
        // this.$message.error('跳转失败！请联系管理员')
      })
    } else {
      history.back(-1); //返回上一页
    }
    /*** 集团跳转门店测试代码END */
  },
  methods: {
    shopLogin,
    //登录前的处理
    preLogin () {
      this.loginInfo = {
        loginInfo: this.ruleForm,
        loginstate: this.remember
      }
      Storages.removeSessionStorage('$pwErr')
      Storages.setLocalStorage('$loginInfo', this.loginInfo)
    },
    //登录成功回调
    loginSuccess (params) {
      // console.log('loginSuccess-toUrl', toUrl)
      this.preLogin();
      const it = this;
      this.$message({
        message: '正在跳转...',
        type: 'success',
        duration: 500,
        onClose: function () {
          it.btnLoading = false;
          // 模拟跳转
          it.$router.push(params);
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.content {
  background: #eef;
  height: 100vh;
  overflow: hidden;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
#sky {
  margin-top: -60px;
  -webkit-perspective: 400px;
  perspective: 400px;
  -webkit-filter: drop-shadow(0px 150px 10px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0px 150px 10px rgba(0, 0, 0, 0.2));
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
#sky div {
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
#sky .bird {
  -webkit-animation: fly 10000ms linear infinite;
  animation: fly 10000ms linear infinite;
}
#sky .bird .wind {
  position: absolute;
  left: 50%;
  width: 4px;
  height: 200px;
  margin-left: -2px;
  border-radius: 999px;
  overflow: hidden;
}
#sky .bird .wind:nth-child(1) {
  -webkit-transform: translate3d(-122px, -30px, -86px) rotateY(90deg);
  transform: translate3d(-122px, -30px, -86px) rotateY(90deg);
}
#sky .bird .wind:nth-child(1)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 126, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 1236ms 2599ms linear infinite;
  animation: wind 1236ms 2599ms linear infinite;
}
#sky .bird .wind:nth-child(2) {
  -webkit-transform: translate3d(32px, -121px, -34px) rotateY(90deg);
  transform: translate3d(32px, -121px, -34px) rotateY(90deg);
}
#sky .bird .wind:nth-child(2)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 70, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 2177ms 1587ms linear infinite;
  animation: wind 2177ms 1587ms linear infinite;
}
#sky .bird .wind:nth-child(3) {
  -webkit-transform: translate3d(138px, -74px, -87px) rotateY(90deg);
  transform: translate3d(138px, -74px, -87px) rotateY(90deg);
}
#sky .bird .wind:nth-child(3)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 39, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 1678ms 4564ms linear infinite;
  animation: wind 1678ms 4564ms linear infinite;
}
#sky .bird .wind:nth-child(4) {
  -webkit-transform: translate3d(85px, 120px, -30px) rotateY(90deg);
  transform: translate3d(85px, 120px, -30px) rotateY(90deg);
}
#sky .bird .wind:nth-child(4)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 175, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 2543ms 2190ms linear infinite;
  animation: wind 2543ms 2190ms linear infinite;
}
#sky .bird .wind:nth-child(5) {
  -webkit-transform: translate3d(-164px, 50px, 80px) rotateY(90deg);
  transform: translate3d(-164px, 50px, 80px) rotateY(90deg);
}
#sky .bird .wind:nth-child(5)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 135, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 2320ms 1941ms linear infinite;
  animation: wind 2320ms 1941ms linear infinite;
}
#sky .bird .wind:nth-child(6) {
  -webkit-transform: translate3d(-128px, -33px, -46px) rotateY(90deg);
  transform: translate3d(-128px, -33px, -46px) rotateY(90deg);
}
#sky .bird .wind:nth-child(6)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 136, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 2906ms 2276ms linear infinite;
  animation: wind 2906ms 2276ms linear infinite;
}
#sky .bird .wind:nth-child(7) {
  -webkit-transform: translate3d(188px, -79px, -86px) rotateY(90deg);
  transform: translate3d(188px, -79px, -86px) rotateY(90deg);
}
#sky .bird .wind:nth-child(7)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 24, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 1960ms 1181ms linear infinite;
  animation: wind 1960ms 1181ms linear infinite;
}
#sky .bird .wind:nth-child(8) {
  -webkit-transform: translate3d(7px, -72px, -3px) rotateY(90deg);
  transform: translate3d(7px, -72px, -3px) rotateY(90deg);
}
#sky .bird .wind:nth-child(8)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 165, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 1514ms 2132ms linear infinite;
  animation: wind 1514ms 2132ms linear infinite;
}
#sky .bird .wind:nth-child(9) {
  -webkit-transform: translate3d(48px, 29px, -22px) rotateY(90deg);
  transform: translate3d(48px, 29px, -22px) rotateY(90deg);
}
#sky .bird .wind:nth-child(9)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 102, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 2159ms 4594ms linear infinite;
  animation: wind 2159ms 4594ms linear infinite;
}
#sky .bird .wind:nth-child(10) {
  -webkit-transform: translate3d(67px, 98px, -65px) rotateY(90deg);
  transform: translate3d(67px, 98px, -65px) rotateY(90deg);
}
#sky .bird .wind:nth-child(10)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 177, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 1345ms 3194ms linear infinite;
  animation: wind 1345ms 3194ms linear infinite;
}
#sky .bird .wind:nth-child(11) {
  -webkit-transform: translate3d(158px, 133px, 6px) rotateY(90deg);
  transform: translate3d(158px, 133px, 6px) rotateY(90deg);
}
#sky .bird .wind:nth-child(11)::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 300px;
  background: rgba(100, 200, 181, 0.3);
  border-radius: 999px;
  -webkit-transform: translateY(-300px);
  transform: translateY(-300px);
  -webkit-animation: wind 1130ms 2202ms linear infinite;
  animation: wind 1130ms 2202ms linear infinite;
}
#sky .bird_body {
  position: relative;
  width: 30px;
  height: 40px;
  background: #bbafe6;
}
#sky .bird_head {
  position: absolute;
  top: -30px;
  border-right: 15px solid transparent;
  border-bottom: 30px solid #c4a4e5;
  border-left: 15px solid transparent;
  -webkit-transform-origin: 50% 100%;
  transform-origin: 50% 100%;
  -webkit-transform: rotateX(-20deg);
  transform: rotateX(-20deg);
}
#sky .bird_wing_left {
  position: absolute;
  left: -30px;
  height: 30px;
  border-right: 30px solid #8997f5;
  border-bottom: 10px solid transparent;
  -webkit-transform-origin: 100% 0;
  transform-origin: 100% 0;
  -webkit-animation: wingLeft 1000ms cubic-bezier(0.36, 0.1, 0.16, 1) infinite
    alternate;
  animation: wingLeft 1000ms cubic-bezier(0.36, 0.1, 0.16, 1) infinite alternate;
}
#sky .bird_wing_left_top {
  position: absolute;
  left: -30px;
  border-right: 30px solid #b670ec;
  border-bottom: 30px solid transparent;
  -webkit-transform-origin: 100% 0;
  transform-origin: 100% 0;
  -webkit-animation: wingLeft 1000ms cubic-bezier(0.545, 0.08, 0.52, 0.975)
    infinite alternate;
  animation: wingLeft 1000ms cubic-bezier(0.545, 0.08, 0.52, 0.975) infinite
    alternate;
}
#sky .bird_wing_right {
  position: absolute;
  left: 30px;
  height: 30px;
  border-left: 30px solid #b8a0f4;
  border-bottom: 10px solid transparent;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-animation: wingRight 1000ms cubic-bezier(0.36, 0.1, 0.16, 1) infinite
    alternate;
  animation: wingRight 1000ms cubic-bezier(0.36, 0.1, 0.16, 1) infinite
    alternate;
}
#sky .bird_wing_right_top {
  position: absolute;
  border-left: 30px solid #ac96f1;
  border-bottom: 30px solid transparent;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-animation: wingRight 1000ms cubic-bezier(0.545, 0.08, 0.52, 0.975)
    infinite alternate;
  animation: wingRight 1000ms cubic-bezier(0.545, 0.08, 0.52, 0.975) infinite
    alternate;
}
#sky .bird_tail_left {
  position: absolute;
  top: 40px;
  border-right: 30px solid transparent;
  border-top: 40px solid #7471cf;
  -webkit-transform-origin: 50% 0;
  transform-origin: 50% 0;
  -webkit-transform: rotateX(-20deg);
  transform: rotateX(-20deg);
}
#sky .bird_tail_right {
  position: absolute;
  top: 40px;
  border-left: 30px solid transparent;
  border-top: 40px solid #6cbed9;
  -webkit-transform-origin: 50% 0;
  transform-origin: 50% 0;
  -webkit-transform: rotateX(-20deg);
  transform: rotateX(-20deg);
}

@-webkit-keyframes fly {
  0% {
    -webkit-transform: rotateX(-120deg) rotateZ(0deg) rotateX(10deg);
    transform: rotateX(-120deg) rotateZ(0deg) rotateX(10deg);
  }
  100% {
    -webkit-transform: rotateX(-120deg) rotateZ(360deg) rotateX(10deg);
    transform: rotateX(-120deg) rotateZ(360deg) rotateX(10deg);
  }
}

@keyframes fly {
  0% {
    -webkit-transform: rotateX(-120deg) rotateZ(0deg) rotateX(10deg);
    transform: rotateX(-120deg) rotateZ(0deg) rotateX(10deg);
  }
  100% {
    -webkit-transform: rotateX(-120deg) rotateZ(360deg) rotateX(10deg);
    transform: rotateX(-120deg) rotateZ(360deg) rotateX(10deg);
  }
}
@-webkit-keyframes wingLeft {
  0% {
    -webkit-transform: rotateY(-40deg);
    transform: rotateY(-40deg);
  }
  100% {
    -webkit-transform: rotateY(40deg);
    transform: rotateY(40deg);
  }
}
@keyframes wingLeft {
  0% {
    -webkit-transform: rotateY(-40deg);
    transform: rotateY(-40deg);
  }
  100% {
    -webkit-transform: rotateY(40deg);
    transform: rotateY(40deg);
  }
}
@-webkit-keyframes wingRight {
  0% {
    -webkit-transform: rotateY(40deg);
    transform: rotateY(40deg);
  }
  100% {
    -webkit-transform: rotateY(-40deg);
    transform: rotateY(-40deg);
  }
}
@keyframes wingRight {
  0% {
    -webkit-transform: rotateY(40deg);
    transform: rotateY(40deg);
  }
  100% {
    -webkit-transform: rotateY(-40deg);
    transform: rotateY(-40deg);
  }
}
@-webkit-keyframes wind {
  0% {
    -webkit-transform: translateY(-300px);
    transform: translateY(-300px);
  }
  100% {
    -webkit-transform: translateY(200px);
    transform: translateY(200px);
  }
}
@keyframes wind {
  0% {
    -webkit-transform: translateY(-300px);
    transform: translateY(-300px);
  }
  100% {
    -webkit-transform: translateY(200px);
    transform: translateY(200px);
  }
}
</style>