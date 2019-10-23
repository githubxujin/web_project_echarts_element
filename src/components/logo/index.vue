<template>
  <div class="logo">
    <img :src="logoUrl" @click="jumpToIndex()" />
    <div class="pm-title" v-text="title" />
  </div>
</template>

<script>
import Storages from '../../utils/storages.js'
export default {
  props: {
    logoName: {
      type: String,
      default: 'logo'
    },
    linkUrl: {
      type: String,
      default: 'shop-index'
    }
  },
  data () {
    return {
      title: this.$baseConfig.ADMIN_TITLE,
      roleType: this.$store.getters.getUserInfo.roleType
    }
  },
  computed: {
    logoUrl () {
      return require('../../assets/images/logo/' + this.logoName + '.png')
    },
    userInfo: function () {
      return this.$store.getters.getUserInfo;
    }
  },
  methods: {
    // 跳转到首页
    jumpToIndex () {
      let url = this.linkUrl;
      let roleType = this.userInfo.roleType;
      console.log('roleType:', roleType, this.userInfo.blocIp)
      if (roleType) {
        url = roleType == 1 ? '/plat-index' : '/shop-index';
      }
      if (this.userInfo.blocIp && roleType == 2) { //如果是跳转登录，回集团首页
        let indexUrl = this.userInfo.blocIp + '/plat-index';
        console.log('indexUrl :', indexUrl);
        window.location.href = indexUrl;
      } else {
        this.$router.push({
          path: url
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$logoColor: #67cbff;
.pm-title {
  display: inline-block;
  font-size: 36px;
  color: $logoColor;
  font-family: FZZYJW--GB1-0;
  font-weight: 400;
  padding-left: 8px;
}
.logo {
  float: left;
  height: 98px;
  line-height: 98px;
  img {
    width: 249px;
    height: 61px;
    cursor: pointer;
    position: relative;
    top: 18%;
  }
}
@media screen and (max-width: 1685px) {
  .pm-title {
    display: none;
  }
}
</style>
