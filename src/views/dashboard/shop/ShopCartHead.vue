<template>
  <div class="card-head">
    <span class="rectangle"></span>
    <span v-text="title" class="card-title" @click="goToPage"></span>
    <span class="warn-num" v-show="num>0" @click="goToPage">
      <i class="alarm-icon"></i>
      X {{num}}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '供配电系统'
    },
    num: {
      type: Number,
      default: 3
    },
    showError: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goToPage () {
      this.$emit('goToPage')
    }
  }
}
</script>

<style lang="scss" scoped>
$fontColor: #cbd713;
$moreColor: #ed341c;
.card-head {
  height: 44px;
  line-height: 44px;
  .card-title {
    color: $fontColor;
    font-size: 20px;
    font-weight: 400;
    cursor: pointer;
  }
  .warn-num {
    color: $moreColor;
    font-size: 18px;
    float: right;
    margin-right: 10px;
    cursor: pointer;
    .alarm-icon {
      display: inline-block;
      width: 20px;
      height: 18px;
      background: url(../../../../static/img/shop-index/alarm.png) no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
}
</style>