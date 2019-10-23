<template>
  <div class="camera">
    <div id="video"></div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button
          round
          size="medium"
          style="padding:10px 30px; font-size:16px;"
          @click="closeDialog"
        >关 闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ckplayerPlugin',
  props: {
    videoUrl: {
      type: String
    }
  },
  data () {
    return {
      videoObject: {
        container: "#video", //“#”代表容器的ID，“.”或“”代表容器的class
        variable: "player", //该属性必需设置，值等于下面的new chplayer()的对象
        autoplay: true, //自动播放
        volume: 0,
        live: true,
        video: "" //视频地址(必填)
      }
    }
  },
  watch: {
    videoUrl (val) {
      this.videoObject.video = this.videoUrl;
      let player = new ckplayer(this.videoObject);
    }
  },
  mounted: function () {
    // 挂载完成后进行
    this.videoObject.video = this.videoUrl;
    let player = new ckplayer(this.videoObject);
  },
  methods: {
    closeDialog () {
      this.video = "";
      this.$emit('hideDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.camera {
  width: 100%;
  height: 400px;
  #video {
    width: 100%;
    height: 340px;
    margin: 0 auto;
  }
}
/deep/.dialog-footer{
    margin-top: 20px;
}
</style>

