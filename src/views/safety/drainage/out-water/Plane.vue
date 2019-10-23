<template>
  <div class="out-water-plane">
    <div class="basic-table" v-if="basicData">
      <div class="table-content" v-show="basicShow">
        <p class="header">
          <span>报警次数</span>
          <router-link tag="a" to="/safety/alarm/view?type=2">查看详情</router-link>
        </p>
        <table border="0" cellspacing="0">
          <tr class="thead">
            <td>设备名称</td>
            <td>本月报警次数</td>
            <td>安全运行时长</td>
          </tr>
          <tr v-for="(item, i) in basicData" :key="i">
            <td>
              <router-link tag="a" :to="`/safety/alarm/view?type=2`">{{item.name}}</router-link>
            </td>
            <td>{{item.alarmCount}}</td>
            <td>{{item.safePeriod}}</td>
          </tr>
        </table>
      </div>
      <i
        :class="{'hiden': !basicShow}"
        class="iconfont icon-fanhui"
        @click="basicShow = !basicShow"
      ></i>
    </div>
    <!-- <span
      v-if="this.videoMonitorList.length>0"
      class="video iconfont icon-shipin"
      @click="videoModelVisible = true"
      title="查看视频监控"
    ></span>-->
    <i
      v-if="videoMonitorList.length"
      @click="videoModelVisible = true"
      class="iconfont icon-shipin video-btn"
    ></i>
    <img
      v-if="pictureUrl"
      :src="pictureUrl"
      @load="getOriginalPictureSize"
      alt
      class="original-picture"
    />
    <empty-data v-if="!pictureArray.length && !$store.getters.getLoading" msg="暂无排水系统数据" />
    <div class="tab-groups" v-if="pictureArray.length > 0">
      <el-radio-group v-model="originUrl">
        <el-radio-button
          v-for="(item,index) in pictureArray"
          :key="index"
          :label="item.originUrl"
        >{{item.name || item.pictureName}}</el-radio-button>
      </el-radio-group>
    </div>
    <section
      class="picture-container"
      ref="pictureContainer"
      :style="{'height': sectionHeight + 'px', minWidth: resizePictureSize.width + 'px'}"
      v-if="pictureArray.length > 0"
    >
      <empty-data v-if="!hasPicture && !$store.getters.getLoading" msg="暂无对应排水系统数据" />
      <img
        @load="getResizePictureSize"
        v-show="pictureUrl"
        :src="pictureUrl"
        class="resize-picture"
        height="100%"
        alt
      />
      <el-popover
        trigger="click"
        placement="right"
        v-for="(item, index) in pointListCopy"
        :key="index"
      >
        <div class="sump-item-card">
          <div>
            <p class="title">{{item.name}}</p>
            <ol class="detail">
              <li>位置：{{item.location}}</li>
              <li v-for="(pump,index) in item.pumps" :key="index">
                {{pump.name}}:
                <span
                  :class="{'error-color': pump.status === '1','normal-color': pump.status === '0'}"
                >{{pump.status | statusRender}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;{{pump.control}}
              </li>
              <li>
                液位：
                <span
                  :style="{color: ['故障', '无有效数据', '异常'].includes(item.fluidLevel) ? 'red' : ''}"
                >{{item.fluidLevel}}</span>
              </li>
            </ol>
          </div>
          <div>
            <div class="catchment-item">
              <div class="picture" :class="{'error': item.status}">
                <span class="alarm alarm1"></span>
                <span class="alarm alarm2"></span>
                <span class="normal"></span>
              </div>
              <p class="name">{{item.name}}</p>
            </div>
          </div>
        </div>
        <div
          slot="reference"
          class="pointer-picture"
          :class="{'error': item.errorStatus}"
          v-bind:style="{left: item.x - (item.errorStatus ? 22 : 11) + 'px', top: item.y -  (item.errorStatus ? 54 : 27) + 'px'}"
        >
          <img :src="item.errorStatus ? pointerError : pointer" alt="点位" width="100%" height="100%" />
        </div>
      </el-popover>
    </section>
    <!-- 监控视频弹窗 -->
    <el-dialog :visible.sync="videoModelVisible" width="800px" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">查看视频监控</span>
      <water-video :videoMonitorList="videoMonitorList" :videoModelVisible.sync="videoModelVisible"></water-video>
    </el-dialog>
  </div>
</template>
<script>
import EmptyData from '@/components/form/EmptyData';
import { mapGetters, mapActions } from 'vuex'
import { monitorPictureQuery, videoMonitorArray } from '@/services/system-settings.js'
import pointer from '@/assets/images/drainage/pointer.png'
import pointerError from '@/assets/images/drainage/pointerError.png'
import WaterVideo from './WaterVideo'
export default {
  name: 'plane',
  components: { EmptyData, WaterVideo },
  data () {
    return {
      pointer,
      pointerError,
      originUrl: '',
      pictureArray: [],
      sectionHeight: 200,
      basicData: null,
      pointList: [],
      basicShow: true,
      OriginalPictureSize: {
        width: 200,
        height: 200
      },
      resizePictureSize: {
        width: 200,
        height: 200
      },
      videoMonitorList: [],
      videoModelVisible: false,
      timesFlag: false
    }
  },
  computed: {
    ...mapGetters('drainage', ['getWebsocket', 'getDrainageSystem']),
    hasPicture () {
      const pictureUrl = this.pictureUrl || ''
      return pictureUrl.split('/')[pictureUrl.split('/').length - 1] !== 'null'
    },
    pictureUrl () {
      let pictureUrl = ''
      for (let index = 0, len = this.pictureArray.length; index < len; index++) {
        const item = this.pictureArray[index];
        // 报警次数显示
        if (item.originUrl === this.originUrl) {
          pictureUrl = item.pictureUrl
          // this.basicData = this.pointList.filter(item => item.originUrl === this.originUrl).filter(item => item.fluidLevel !== '正常')
          this.basicData = this.pointList.filter(item => item.originUrl === this.originUrl)
          break;
        }
      }
      return pictureUrl
    },
    pointListCopy () {
      let originUrl = this.originUrl
      let pointList = JSON.parse(JSON.stringify(this.pointList))
      pointList = pointList.filter(item => { // 根据originUrl过滤属于当前图片的点位数据
        return item.originUrl === originUrl
      })
      let scalSize = this.resizePictureSize.width / this.OriginalPictureSize.width
      pointList.forEach((item, index) => {
        let pumpStatus = item.pumps.map(pump => pump.status).join(',')
        item.errorStatus = (pumpStatus && pumpStatus.indexOf('1') > -1) || ['故障', '无有效数据', '异常'].includes(item.fluidLevel)
        item.status = item.fluidLevel === '故障'
        item.x = item.x * scalSize
        item.y = item.y * scalSize
      }, this)
      return pointList
    }
  },
  filters: {
    statusRender: function (val) {
      if (val === '0') {
        return "运行";
      }
      if (val === '1') {
        return "故障";
      }
      if (val === '2') {
        return "停止";
      }
    }
  },
  created () {
    this.$common.updateLoadingStatus(true);
    this.initData()

  },
  methods: {
    ...mapActions('drainage', ['initWebsocket']),
    videoMonitorArray,
    monitorPictureQuery,
    initData () {
      const shopNumber = this.$store.getters.shopNumber
      this.monitorPictureQuery({ shopNumber, type: 239 }).then(res => {
        if (res.data) {
          // 无图片处理
          res.data.array.forEach((item, i) => {
            if (!item.originUrl) item.originUrl = 'empty' + i;
          })
        }
        this.pictureArray = (res.data || {}).array
        this.pictureArray.length && (this.originUrl = this.pictureArray[0].originUrl)
        this.$nextTick(_ => {
          this.initPictureSize()
        })
      }).catch(_ => { })
      if (!this.getWebsocket) {
        this.initWebsocket({ uri: '/ws/common/drainage-ws/websocket', params: { shopNumber } })
      }
      this.videoMonitorArray({ shopNumber: this.$store.getters.shopNumber, type: 2 }).then((res) => {
        if (res.code === 200) {
          this.videoMonitorList = res.data.array;
        }
      })
    },
    initPictureSize () {
      this.resetSectionHeight()
      if (window.attachEvent) {
        window.attachEvent("onresize", this.getResizePictureSize)
        window.attachEvent("onresize", this.resetSectionHeight)
      } else {
        window.addEventListener('resize', this.getResizePictureSize)
        window.addEventListener('resize', this.resetSectionHeight)
      }
    },
    getOriginalPictureSize () {
      this.$common.updateLoadingStatus(false);
      let ele = document.querySelector('.original-picture')
      if (!ele) return
      this.OriginalPictureSize.width = parseInt(window.getComputedStyle(ele, null).getPropertyValue("width"))
      this.OriginalPictureSize.height = parseInt(window.getComputedStyle(ele, null).getPropertyValue("height"))
    },
    getResizePictureSize () {
      let ele = document.querySelector('.resize-picture')
      if (!ele) return
      let _self = this
      setTimeout(function () {
        _self.resizePictureSize.width = parseInt(window.getComputedStyle(ele, null).getPropertyValue("width"))
        _self.resizePictureSize.height = parseInt(window.getComputedStyle(ele, null).getPropertyValue("height"))
      }, 300)
    },
    resetSectionHeight () { // 重置section高度
      this.$nextTick(function () {
        if (!this.$refs.pictureContainer) return
        console.log('this.$refs.pictureContainer.offsetTop:', this.$refs.pictureContainer.offsetTop);
        const sectionHeight = window.innerHeight - this.$refs.pictureContainer.offsetTop - 190;
        this.sectionHeight = sectionHeight < 200 ? 200 : sectionHeight
      })
    },
    initSocketData (val) {
      if (!val) return
      val = JSON.parse(JSON.stringify(val))
      this.pointList = val.detail || [];
      // const { alarm } = this.$route.query;
      // if (alarm) {
      //   let alarmItem = val.detail.find(item => item.fluidLevel !== '正常');
      //   if (alarmItem) {
      //     this.originUrl = alarmItem.originUrl
      //   } else {
      //     this.originUrl = val.detail[0].originUrl
      //   }
      // }
    }
  },
  watch: {
    '$store.getters.shopNumber': { // 监听shopNumber的变化
      immediate: false,
      handler: function (val) {
        val && this.initWebsocket({ uri: '/ws/common/drainage-ws/websocket', params: { shopNumber: val } })
      }
    },
    'getDrainageSystem': {
      immediate: true,
      handler: function (val) {
        this.initSocketData(val)
      }
    },
    'pointList': {
      immediate: true,
      handler: function (val) {
        let errorData = val.find(item => {
          let pumpStatus = item.pumps.map(pump => pump.status).join(',');
          return (pumpStatus && pumpStatus.indexOf('1') > -1) || ['故障', '无有效数据', '异常'].includes(item.fluidLevel)
        })
        const { alarm } = this.$route.query;
        if (errorData && this.pictureArray.length && !this.timesFlag && alarm) {
          this.originUrl = errorData.originUrl
          this.timesFlag = true;
        }
      }
    },
    'pictureArray': {
      immediate: true,
      handler: function (val) {
        if (this.pointList.length) {
          let errorData = this.pointList.find(item => {
            let pumpStatus = item.pumps.map(pump => pump.status).join(',');
            return (pumpStatus && pumpStatus.indexOf('1') > -1) || ['故障', '无有效数据', '异常'].includes(item.fluidLevel)
          })
          const { alarm } = this.$route.query;
          if (errorData && this.pictureArray.length && !this.timesFlag && alarm) {
            this.originUrl = errorData.originUrl
            this.timesFlag = true;
          }
        }

      }
    }
  },
  mounted () {
    // this.initPictureSize()
  },
  beforeRouteLeave (to, from, next) {
    if (window.detachEvent) {
      window.detachEvent("onresize", this.getResizePictureSize)
      window.detachEvent("onresize", this.resetSectionHeight)
    } else {
      window.removeEventListener('resize', this.getResizePictureSize)
      window.removeEventListener('resize', this.resetSectionHeight)
    }
    if (to.path !== '/safety/drainage/suppley-water') {
      this.$store.state.drainage.websocket && this.$store.state.drainage.websocket.close()
      this.$store.commit('drainage/updateWebsocket', null)
    }
    next();
  }
}
</script>
<style lang="scss" scoped>
.out-water-plane {
  text-align: center;
  position: relative;
  /deep/ .el-dialog__header {
    font-size: 14px;
    text-align: left;
  }
  .video-btn {
    font-size: 40px;
    position: absolute;
    right: 30px;
    top: 10px;
    z-index: 999;
    cursor: pointer;
  }
  .basic-table {
    position: absolute;
    top: 0;
    left: 20px;
    border-collapse: collapse;
    border-spacing: 0;
    z-index: 10;
    background: #fff;
    i {
      position: absolute;
      top: 0;
      right: -20px;
      width: 20px;
      line-height: 40px;
      background-color: #dcdfe6;
      cursor: pointer;
      &.hiden {
        transform: rotate(180deg);
      }
    }
    table {
      border-top: 1px solid #dcdfe6;
      border-left: 1px solid #dcdfe6;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      a {
        color: #333;
      }
    }
    td,
    th {
      padding: 0 20px;
      border-bottom: 1px solid #dcdfe6;
      border-right: 1px solid #dcdfe6;
      &.error {
        color: #f0213e;
      }
    }
    tr {
      &:nth-child(odd),
      &:hover:not(.thead) {
        background: #f2f2f2;
      }
      &.thead {
        background: #b4bbc5;
      }
      a {
        color: #333;
      }
    }
  }
  .original-picture {
    position: fixed;
    top: 20000px;
  }
  .tab-groups {
    padding: 20px 0;
    max-width: 1230px;
    overflow-x: auto;
    margin-left: 380px;
    /deep/ .el-radio-group {
      white-space: nowrap;
    }
  }
  .picture-container {
    position: relative;
    display: inline-block;
    /deep/ .el-popper {
      .alarm {
        span {
          color: #f0213e;
        }
      }
    }

    .pointer-picture {
      position: absolute;
      width: 22px;
      height: 27px;
      cursor: pointer;
      &.error {
        width: 44px;
        height: 54px;
        &::before {
          position: absolute;
          left: 22px;
          bottom: 0;
          display: block;
          content: "";
          background-color: #e3bbbb;
          width: 1px;
          height: 1px;
          border-radius: 50%;
          animation: ripple 3s linear infinite;
        }
        &::before::before,
        &::before::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 4px;
          border-radius: 50%;
          animation: ripple 3s linear infinite 1s;
        }
        &::before::after {
          animation: ripple 3s linear infinite 2s;
        }
        $ripple-color: rgba(255, 0, 0, 0.2);
        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0px $ripple-color, 0 0 0 20px $ripple-color,
              0 0 0 40px $ripple-color;
          }
          100% {
            box-shadow: 0 0 0 20px $ripple-color, 0 0 0 40px $ripple-color,
              0 0 0 60px rgba(255, 0, 0, 0);
          }
        }
      }
      img {
        position: relative;
        z-index: 1;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.sump-item-card {
  color: #333333;
  > div {
    display: inline-block;
    vertical-align: top;
  }
  .title {
    font-size: 30px;
    color: #0090e5;
  }
  .detail {
    font-size: 16px;
    padding-left: 20px;
    padding-top: 20px;
    list-style-type: disc;
    li {
      line-height: 40px;
    }
    .error-color {
      color: #f0213e;
    }
    .normal-color {
      color: #00a054;
    }
  }
  .catchment-item {
    width: 219px;
    padding: 0 20px;
    height: auto;
    &.hidden {
      > * {
        display: none;
      }
    }
    .picture {
      height: 189px;
      background: url("../../../../assets/images/drainage/catchment1.png") 100%
        100% no-repeat;
      position: relative;
      .alarm {
        width: 29px;
        height: 24px;
        position: absolute;
        right: -2px;
        top: 43px;
        &.alarm1 {
          background: url("../../../../assets/images/drainage/alarm1.png") 100%
            100% no-repeat;
        }
        &.alarm2 {
          opacity: 0;
          background: url("../../../../assets/images/drainage/alarm2.png") 100%
            100% no-repeat;
          right: -9px;
          top: 45px;
        }
      }
      .normal {
        width: 29px;
        height: 24px;
        position: absolute;
        right: 3px;
        top: 90px;
        background: url("../../../../assets/images/drainage/normal.png") 100%
          100% no-repeat;
      }
      &.error {
        background: url("../../../../assets/images/drainage/catchment2.png")
          100% 100% no-repeat;
        .alarm2 {
          animation: blink 1s infinite;
          @keyframes blink {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 100;
            }
            100% {
              opacity: 0;
            }
          }
        }
      }
    }
    .name {
      color: #666666;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>
