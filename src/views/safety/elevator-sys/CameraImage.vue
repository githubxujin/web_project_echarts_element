<template>
  <div class="camera-image">
    <div class="video-box clear">
      <!-- <video
        v-for="(item,index) in list"
        :key="index"
        :id="item.id"
        class="video-js vjs-default-skin vjs-big-play-centered"
        preload="auto"
        autoplay
        controls
        ref="videoplayer"
      >
        <source :src="item.src" type="rtmp/flv">
      </video>-->
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
// import SWF_URL from 'videojs-swf/dist/video-js.swf'
// videojs.options.flash.swf = SWF_URL
export default {
  props: {
    videoState: {
      type: String
    }
  },
  data () {
    return {
      list: [
        { src: "rtmp://192.168.1.40:1935/live/0010868182009536473", id: 'my-player' },
        { src: "rtmp://192.168.1.40:1935/live/0010868182009536473", id: 'my-player1' },
        // { src: "rtmp://192.168.1.83:1935/live/1921681224001", id: 'my-player3' },
        // { src: "rtmp://192.168.1.83:1935/live/1921681224001", id: 'my-player4' },
        // { src: "rtmp://192.168.1.83:1935/live/1921681224001", id: 'my-player5' },
      ],
      videoSrc: '',
      videoPlayer: ''
    }
  },
  watch: {
    videoState (val) {
      if (val == 'hide') {
        console.log(121212)
        this.list.forEach(item => {
          videojs(item.id).dispose()
        })
      } else {
        this.createVideo()
      }
    }
  },
  mounted () {
    this.createVideo();
  },
  beforeDestroy () {
    console.log(12121212)
    this.list.forEach(item => {
      videojs(item.id).dispose()
    })
  },
  methods: {
    init () {
      // this.videoSrc = 'rtmp://192.168.1.83:1935/live/1921681224001';
      // this.videoPlayer = videojs('my-player');// 关联video标签的id
      // this.videoPlayer.src({
      //   src: this.videoSrc,
      //   type: 'rtmp/flv',
      // });
      // this.videoPlayer.play();
      this.list.forEach(item => {
        let videoPlayer = videojs(item.id);
        videoPlayer.src({
          src: item.src,
          type: 'rtmp/flv'
        });
        videoPlayer.play()
      })
    },
    createVideo () {
      let str = "";
      this.list.forEach(item => {
        str += "<div style='width:24%; margin-right:10px; height:350px; margin-bottom:10px; float: left;'>" + "<video id=" + item.id + " class='video-js vjs-default-skin vjs-big-play-centered  vjs-16-9' autoplay controls preload='auto' poster='//vjs.zencdn.net/v/oceans.png' style='object-fit: fill;width:100%;height:100%;'>" +
          "<source src=" + item.src + " type='rtmp/flv' >" +
          "</video>" +
          "</div>";
      })
      $('.video-box').html(str)
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.camera-image {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .video-js {
    width: 24%;
    height: 400px;
    flex: 1;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .video-box {
    width: 100%;
    height: 100%;
    padding: 10px 15px;
    // display: flex;
    // justify-content: space-between;
    .video-js {
      width: 24%;
      height: 400px;
      float: left;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>


