<template>
  <div>
    <el-button type="primary" size="mini" :disabled="disabled || time > 0">{{text}}</el-button>
  </div>
</template>

<script>
/**
 * 倒计时间组件
 */
export default {
  props: {
    second: {
      type: Number,
      'default': 60
    },
    disabled: {
      type: Boolean,
      'default': false
    },
    word: {
      type: String,
      default: '验证码'
    }
  },
  // 初始化时间
  data: function () {
    return {
      time: 0
    };
  },
  methods: {
    run: function () {
      this.time = this.second;
      this.timer();
    },
    stop: function () {
      this.time = 0;
      this.disabled = false;
    },
    timer: function () {
      if (this.time > 0) {
        this.time--;
        setTimeout(this.timer, 1000);
      }
    }
  },
  computed: {
    text: function () {
      return this.time > 0 ? this.time + 's再获取' : this.word;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>