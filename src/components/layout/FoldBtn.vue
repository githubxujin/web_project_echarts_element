<template>
  <div class="fold-btn" :class="show?'right':'left'" :title="show?'折叠':'展开'">
    <i
      class="left-active-btn"
      :class="show?'iconfont icon-shouqix right':'iconfont icon-zhankai1 left'"
      @click="leftActiveBtn"
    ></i>
  </div>
</template>

<script>
/**
 * 折叠/展开按钮
 */
export default {
  data () {
    return {
      show: true,
    }
  },
  methods: {
    // 控制树显示和隐藏
    leftActiveBtn () {
      this.show = !this.show;
      this.$emit("foldClick");
    },
  }
}
</script>

<style lang="scss" scoped>
.left-active-btn {
  position: relative;
  top: calc(50% - 20px);
  &.left {
    left: 0px;
  }
  &.right {
    right: -33px;
  }
  &:hover {
    color: blue;
  }
}
.fold-btn {
  position: absolute;
  top: calc(50% - 40px);
  //   top: 50%;
  &.left {
    left: -5px;
  }
  &.right {
    right: -33px;
  }
}
</style>