<template>
  <div class="video-box">
    <div class="video-header">
      <el-radio-group v-model="tabCurrent">
        <el-radio-button
          v-for="(item,index) in videoMonitorList"
          :key="index"
          :label="item.id"
        >{{item.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="video-content">
      <camera-player
        v-if="videoUrl"
        :videoUrl="videoUrl"
        @hideDialog="$emit('update:videoModelVisible', false)"
      ></camera-player>
      <div v-if="!videoUrl && !loading" style="lineHeight: 300px;">摄像头故障，暂无视频</div>
    </div>
  </div>
</template>

<script>
import CameraPlayer from '../../elevator-sys/CameraPlayer';
import { videoMonitorUrl } from '@/services/system-settings.js'
export default {
  components: { CameraPlayer },
  props: {
    videoMonitorList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      videoUrl: '',
      tabCurrent: 1,
      loading: true
    }
  },
  created () {
    this.tabCurrent = this.videoMonitorList[0].id;
    this.$nextTick(_ => {
      this.getUrl(this.videoMonitorList[0].number);
    })
  },
  watch: {
    'tabCurrent': function (newVal) {
      let currentMonitor = this.videoMonitorList.find((item) => item.id === newVal);
      this.getUrl(currentMonitor.number);
    }
  },
  methods: {
    getUrl (number) {
      videoMonitorUrl({ shopNumber: this.$store.getters.shopNumber, number: number, systemType: 2 }).then(res => {
        this.loading = false;
        this.videoUrl = res.data.videoUrl || '';
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.video-box {
  .video-header {
    text-align: left;
  }
  .video-footer {
    text-align: right;
    span {
      padding: 10px 30px;
      font-size: 20px;
      border-radius: 4px;
    }
  }
}
</style>