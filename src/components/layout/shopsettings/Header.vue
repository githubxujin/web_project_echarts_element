<template>
  <div class="header">
    <Logo linkUrl="/shop-index" />
    <div class="shop-title text-ellipse">
      <span v-text="shopTitle" :title="shopTitle" />
    </div>
    <top-user />
    <top-nav />
  </div>
</template>

<script>
import Logo from '../../logo/index'
import TopNav from '../../nav/TopNav'
import TopUser from '../../nav/TopUser';
export default {
  components: {
    Logo,
    TopNav,
    TopUser
  },
  computed: {
    //门店名称
    shopTitle () {
      return this.$store.getters.getCurShopName;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/head.scss';
</style>
