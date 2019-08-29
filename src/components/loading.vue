<template>
  <div class="markbox" v-if="loading" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="sun-loading"></div>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    loading: function () {
      return this.$store.getters.getLoading;
    }
  },
  created () {
    var that = this;

  }
}
</script>
<style lang="scss" scoped>
/*loading开始*/
.sun-loading {
  width: 45px;
  height: 45px;
  display: block;
  animation: sunLoading 1s steps(12, end) infinite;
  background: transparent url('../assets/images/loding.gif');
  background-size: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
/*loading结束*/
</style>
