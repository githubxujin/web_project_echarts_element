<template>
  <div class="app-container">
    <v-head />
    <div class="content-container">
      <v-sidebar :menuArr="menuArr" :defaultKey="$route.path" :defaultOpens="defaultOpens" />
      <div
        class="main-container"
        v-loading="loading"
        :element-loading-text="$baseConfig.loading.text"
        :element-loading-spinner="$baseConfig.loading.spinner"
        :element-loading-background="$baseConfig.loading.background"
      >
        <transition name="move" mode="out-in">
          <!-- 缓存部分组件 -->
          <template v-if="$route.meta.keepAlive">
            <keep-alive>
              <router-view />
            </keep-alive>
          </template>
          <template v-else>
            <router-view />
          </template>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { getBtnsByIndex } from '@/utils/permission.js';
import vHead from './Header.vue'
import vSidebar from './sidebar/index.vue'
export default {
  name: 'Home',
  components: {
    vHead,
    vSidebar
  },
  data () {
    return {
      menuArr: [],
      defaultOpens: [],
      activatedPath: ''
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler: function (val) {
        this.activatedPath = this.$route.path
        this.activatedPath && this.getBtns(this.activatedPath)
      }
    }
  },
  created () {
    this.initAuth()
  },
  computed: {
    loading: function () {
      return this.$store.getters.getLoading;
    }
  },
  methods: {
    initAuth () {
      const authArr = JSON.parse(window.localStorage.getItem('$shopAuthoritiesArr') || '[]')
      for (let index = 0, len = authArr.length; index < len; index++) {
        const item = authArr[index];
        if (item.index === '/settings') {
          this.menuArr = item.subs || []
          // this.defaultOpens = this.menuArr.map(item => {
          //   return item.index
          // })
          break
        }
      }
    },
    //根据index获取page中button权限
    getBtns (key) {
      var btns = getBtnsByIndex(key);
      console.log('btns:', btns)
      if (btns && btns.length > 0) {
        this.$store.commit('permission/setPageBtns', btns)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../scss/home.scss";
.app-container {
  .main-container {
    width: 100%;
    padding-left: 190px;
    box-sizing: border-box;
  }
}
</style>
