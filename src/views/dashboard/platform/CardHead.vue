<template>
  <div class="card-head">
    <span class="rectangle"></span>
    <span v-text="title" class="card-title"></span>
    <span class="card-more" @click="lookMore()">查看更多</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '待解决报警详情'
    }
  },
  methods: {
    //查看更多
    lookMore () {
      this.$emit("lookMore");
    }
  }
}
</script>

<style lang="scss" scoped>
$fontColor: #cbd713;
$moreColor: #e6efff;
.card-head {
  height: 44px;
  line-height: 44px;
  .card-title {
    color: $fontColor;
    font-size: 20px;
    font-family: FZZZHUNHJW--GB1-0;
    font-weight: 400;
  }
  .card-more {
    color: $moreColor;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    float: right;
    cursor: pointer;
    &:hover {
      // text-decoration: underline;
      color: #7abef9;
    }
  }
}
</style>