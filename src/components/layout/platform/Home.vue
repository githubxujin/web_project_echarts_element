<template>
  <div class="app-container">
    <v-head />
    <div class="content-container">
      <v-sidebar category="plat" />
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
        <!-- <loading></loading> -->
      </div>
    </div>
  </div>
</template>

<script>
import vHead from './Header.vue'
import vSidebar from '../../sidebar/index'
// import loading from '../../Loading'
export default {
  name: 'Home',
  components: {
    vHead,
    vSidebar,
    // loading
  },
  computed: {
    loading: function () {
      return this.$store.getters.getLoading;
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/home.scss';
</style>
