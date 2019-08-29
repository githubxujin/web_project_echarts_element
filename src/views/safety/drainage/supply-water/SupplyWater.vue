<template>
  <div class="supply-water">
    <div class="basic-table" v-if="basicData.length">
      <div class="table-content" v-show="basicShow">
        <p class="header">
          <span>报警次数</span>
          <router-link tag="a" to="/safety/alarm/view">查看详情</router-link>
          <i class="iconfont icon-fanhui"></i>
        </p>
        <table border="0" cellspacing="0">
          <tr class="thead">
            <td width="150">设备名称</td>
            <td>本月报警次数</td>
            <td>安全运行时长</td>
          </tr>
          <tr>
            <td>
              <router-link tag="a" to="/safety/alarm/view">{{basicData.name}}</router-link>
            </td>
            <td>{{basicData.alarmCount}}</td>
            <td>{{basicData.safePeriod}}</td>
          </tr>
          <tr v-for="(item, index) in basicData.pumps" :key="index">
            <td>
              <router-link tag="a" to="/safety/alarm/view">{{item.name}}</router-link>
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
    <i
      v-if="videoMonitorList.length"
      @click="videoModelVisible = true"
      class="iconfont icon-xiayiji video-btn"
    ></i>
    <empty-data v-if="!dataList.length && !$store.getters.getLoading" msg="暂无给水系统数据" />
    <div class="water-container">
      <el-radio-group v-model="tabPosition" class="tab-groups">
        <el-radio-button
          v-for="(item,index) in dataList"
          :key="index"
          :label="item.number"
        >{{item.name}}</el-radio-button>
      </el-radio-group>
      <empty-data
        v-if="dataList.length && !activatedDevice && !$store.getters.getLoading"
        msg="暂无对应给水系统数据"
      />
      <section class="section" v-if="activatedDevice">
        <div class="block1">
          <span class="label-span">市政供水</span>
          <span class="line1">
            <span class="x-line" :class="{'running': lineStatusList.bus}"></span>
          </span>
        </div>
        <div class="block2" v-show="activatedDevice.pumps.length">
          <!-- 泵左边Y轴 -->
          <span class="line line-left" v-show="activatedDevice.pumps.length > 1">
            <span class="line-up">
              <span class="y-line" :class="{'running': lineStatusList.subUp}"></span>
            </span>
            <span class="line-down">
              <span
                v-if="activatedDevice.pumps[activatedDevice.pumps.length-1] && activatedDevice.pumps[activatedDevice.pumps.length-1].status && activatedDevice.pumps[activatedDevice.pumps.length-1].status==='0'"
                class="y-line"
                :class="{'running': lineStatusList.subDown}"
              ></span>
              <span v-else class="y-line"></span>
            </span>
          </span>

          <div :class="{'only-one-pump': activatedDevice.pumps.length === 1}">
            <div v-for="(item, index) in activatedDevice.pumps" :key="index" class="pump-item">
              <div class="pump-picture">
                <span class="line1 left">
                  <span class="x-line" :class="{'running': item.status === '0'}"></span>
                </span>
                <img
                  v-if="item.status"
                  class="picture"
                  :src="item.status === '0'? pumpRunningPng : item.status === '2' ? pumpStopPng : pumpTroublePng"
                />
                <img v-else class="picture" style="opacity:0.5" :src="pumpStopPng" />
                <span class="line1 right">
                  <span class="x-line" :class="{'running': item.status === '0'}"></span>
                </span>
              </div>
              <p class="name">
                {{item.name}}:
                <span
                  :class="{'running': item.status === '0', 'trouble': item.status === '1'||!item.status}"
                >{{item.status==='0'?'正常':item.status==='1'?'故障':item.status==='2'?'停止':'请配置参数'}}</span>
                &nbsp;&nbsp;
                <span
                  :class="{'trouble':!item.control}"
                >{{item.control?item.control:'请配置参数'}}</span>
              </p>
            </div>
          </div>
          <!-- 泵右边边Y轴 -->
          <span class="line line-right" v-show="activatedDevice.pumps.length > 1">
            <span class="line-up">
              <span
                v-if="activatedDevice.pumps[activatedDevice.pumps.length-1] && activatedDevice.pumps[activatedDevice.pumps.length-1].status && activatedDevice.pumps[activatedDevice.pumps.length-1].status==='0'"
                class="y-line"
                :class="{'running': lineStatusList.subUp}"
              ></span>
              <span v-else class="y-line"></span>
            </span>
            <span class="line-down">
              <span class="y-line" :class="{'running': lineStatusList.subUp}"></span>
            </span>
          </span>
          <span class="bottom-label label-span">离心式水泵</span>
        </div>
        <div class="block3">
          <span class="line1">
            <span class="x-line" :class="{'running': lineStatusList.bus}"></span>
          </span>
          <span class="label-span">高位生活水箱</span>
          <span class="line1 line2">
            <span class="x-line" :class="{'running': lineStatusList.bus}"></span>
          </span>
        </div>
        <div class="block4">
          <span class="line">
            <span class="line-up line3">
              <span class="y-line" :class="{'running': lineStatusList.bus}"></span>
            </span>
          </span>
          <span class="line1 line4">
            <span class="x-line" :class="{'running': lineStatusList.bus}"></span>
          </span>
          <div>
            <div class="water-tank">
              <div class="picture">
                <img :src="tapPng" class="tap" alt />
              </div>
              <div class="unit">
                <span>单位：米</span>
              </div>
              <div class="box">
                <div class="up" :style="{bottom: `-${74 + 200 * (1-heightScale)}px`}"></div>
                <div class="right" :style="{height: 200 * heightScale + 'px'}"></div>
                <div class="front" :style="{height: 200 * heightScale + 'px'}"></div>
              </div>
              <div class="level-mark">
                <span
                  class="level-line"
                  :class="{'short-line': (item.number % 1)}"
                  v-for="item in liquidLevelList"
                  :key="item.number"
                  :style="{bottom: item.top}"
                  v-show=" item.number==0 || !specialLiquidLevelList.includes(item.number) "
                >
                  <span v-show="!(item.number % 1)">{{item.number}}</span>
                  <!-- <span>{{item.number}}</span>
                  <span>{{item}}</span>
                  <span>{{specialLiquidLevelList}}</span>-->
                </span>
                <!-- 水箱液位上下限 -->
                <!-- <span>{{liquidLevel}}</span> -->
                <span
                  v-show="liquidLevel.upperLimit!=0"
                  class="level-line limit-line"
                  :style="{bottom: (liquidLevel.upperLimit / liquidLevel.height) * 100 + '%'}"
                >
                  <span>{{liquidLevel.upperLimit}}</span>
                </span>
                <span
                  v-show="liquidLevel.lowerLimit!=0"
                  class="level-line limit-line"
                  :style="{bottom: (liquidLevel.lowerLimit / liquidLevel.height) * 100 + '%'}"
                >
                  <span>{{liquidLevel.lowerLimit}}</span>
                </span>
                <!-- <span
                  class="level-line current-line"
                  :class="{'error-line': (liquidLevel.currentFluid > liquidLevel.upperLimit && liquidLevel.upperLimit!=0) || (liquidLevel.currentFluid < liquidLevel.lowerLimit && liquidLevel.lowerLimit!=0)}"
                  :style="{top: (1 - liquidLevel.currentFluid / liquidLevel.height) * 100 + '%'}"
                  :title="liquidLevel.currentFluid"
                >-->
                <span
                  class="level-line current-line"
                  :style="{top: (liquidLevel.currentFluid > liquidLevel.height ? 0 :1 - liquidLevel.currentFluid / liquidLevel.height) * 100 + '%'}"
                  :title="liquidLevel.currentFluid"
                >
                  <span class="cur-mark"></span>
                  <span class="cur-value">{{liquidLevel.currentFluid}}</span>
                </span>
              </div>
              <div class="background-color"></div>
              <div class="background-color2"></div>
            </div>
            <span class="label-span">高位生活水箱</span>
          </div>
        </div>
      </section>
      <!-- 监控视频弹窗 -->
      <el-dialog :visible.sync="videoModelVisible" width="800px" :close-on-click-modal="false">
        <span slot="title" class="dialog-header">查看视频监控</span>
        <water-video
          :videoMonitorList="videoMonitorList"
          :videoModelVisible.sync="videoModelVisible"
        ></water-video>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import EmptyData from '@/components/form/EmptyData';
import { mapGetters, mapActions } from 'vuex'
import { videoMonitorArray } from '@/services/system-settings.js'
import pumpRunningPng from '@/assets/images/drainage/pumpRunning.png'
import pumpStopPng from '@/assets/images/drainage/pumpStop.png'
import pumpTroublePng from '@/assets/images/drainage/pumpTrouble.png'
import tapPng from '@/assets/images/drainage/tap.png'
import WaterVideo from '../out-water/WaterVideo'
export default {
  name: 'SupplyWater',
  components: { EmptyData, WaterVideo },
  data () {
    return {
      pumpRunningPng,
      pumpStopPng,
      pumpTroublePng,
      tapPng,
      tabPosition: '',
      basicData: [],
      dataList: [],
      basicShow: true,
      videoMonitorList: [],
      videoModelVisible: false
    };
  },
  computed: {
    ...mapGetters('drainage', ['getWebsocket', 'getSupplySystem']),
    activatedDevice () { // 当前供水设备组
      let dataList = JSON.parse(JSON.stringify(this.dataList))
      console.log("dataList=", dataList)
      console.log("this.tabPosition=", this.tabPosition)
      let activatedDevice = dataList[0]
      for (let index = 0, len = dataList.length; index < len; index++) {
        const item = dataList[index];
        if (item.number === this.tabPosition) {
          activatedDevice = item
          this.basicData = this.dataList.find(item => item.number === this.tabPosition)
          console.log("activatedDevice=", activatedDevice)
          break;
        }
      }

      // 给水泵排个序 正常的在上边 停止及故障在下边 防止水流动画不和谐
      (activatedDevice && activatedDevice.pumps || []).sort(function (pump1, pump2) {//status:0-运行 1-故障 2-停止 如果没有status就提示“请配置参数”，控制方式没有也要提示“请配置参数”
        if (pump1.status === '0' && pump2.status !== '0') return -1
        else if (pump1.status !== '0' && pump2.status === '0') return 1
        else 0
      })
      return activatedDevice
    },
    liquidLevel () { // 水箱高度 上下限 水位
      let {
        height,
        upperLimit,
        lowerLimit,
        currentFluid
      } = this.activatedDevice
      console.log("this.activatedDevice=:", this.activatedDevice)
      return {
        height: height || 0,
        upperLimit: upperLimit || 0,
        lowerLimit: lowerLimit || 0,
        currentFluid: currentFluid || 0
      }
    },
    liquidLevelList () { // 水位刻度列表
      if (!this.liquidLevel.height) return []
      let scale = Math.ceil(this.liquidLevel.height / 5);//均分成5等分，scale米一个刻度
      let levelSize = Math.floor(this.liquidLevel.height / scale)
      let arr = []

      for (let index = 0; index < levelSize + 1; index++) {
        arr.push({
          index: index,
          number: index * scale,
          top: (index * scale / this.liquidLevel.height) * 100 + '%'
        })
      }
      if (this.liquidLevel.height % scale > 0) {
        arr.push({
          index: arr.length,
          number: this.liquidLevel.height,
          top: '100%'
        })
      }
      console.log("scale:", scale, "levelSize:", levelSize, "this.liquidLevel.height", this.liquidLevel.height, ",arr:", arr)
      return arr
    },
    specialLiquidLevelList () { // 上下限水位、当前水位
      let { upperLimit, lowerLimit, currentFluid } = this.liquidLevel
      console.log("this.liquidLevel:", this.liquidLevel, ",[upperLimit, lowerLimit, currentFluid]:", [upperLimit, lowerLimit, currentFluid])
      return [upperLimit, lowerLimit, currentFluid]
    },
    heightScale () { // 当前水位百分比
      if (!this.liquidLevel.height) return 0
      if (this.liquidLevel.currentFluid > this.liquidLevel.height) {
        return 1;
      } else {
        return this.liquidLevel.currentFluid / this.liquidLevel.height
      }

    },
    lineStatusList () {
      if (!this.activatedDevice.pumps.length) {
        return {
          bus: true
        }
      }
      let stateList = this.activatedDevice.pumps.map(item => item.status)
      console.log("stateList=", stateList);
      let bus = stateList.includes('0')
      console.log("bus:", bus)
      let upList = stateList.slice(0, Math.floor(stateList.length / 2))
      let downList = stateList.slice(Math.floor(stateList.length / 2), stateList.length)
      let subUp = upList.includes('0')
      let subDown = downList.includes('0')
      return {
        bus,
        subUp,
        subDown
      }
    }
  },
  created () {
    if (!this.getWebsocket) {
      const shopNumber = this.$store.getters.shopNumber
      this.initWebsocket({ uri: '/ws/common/drainage-ws/websocket', params: { shopNumber } })
    }
    videoMonitorArray({ shopNumber: this.$store.getters.shopNumber, type: 2 }).then((res) => {
      if (res.code === 200) {
        this.videoMonitorList = res.data.array;
      }
    })
    this.$store.commit('base/updateLoadingStatus', { isLoading: false }); //关闭loading
  },
  methods: {
    ...mapActions('drainage', ['initWebsocket']),
    initSocketData (val) {
      if (!val) return
      val = JSON.parse(JSON.stringify(val))
      this.dataList = val.detail || []
      this.basicData = val.basic || []
      if (!this.tabPosition) this.tabPosition = (this.dataList[0] || {}).number || ''
    }

  },
  watch: {
    '$store.getters.shopNumber': { // 监听shopNumber的变化
      immediate: false,
      handler: function (val) {
        val && this.initWebsocket({ uri: '/ws/common/drainage-ws/websocket', params: { shopNumber: val } })
      }
    },
    'getSupplySystem': {
      immediate: true,
      handler: function (val) {
        this.initSocketData(val)
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/safety/drainage/out-water') {
      this.$store.state.drainage.websocket && this.$store.state.drainage.websocket.close()
      this.$store.commit('drainage/updateWebsocket', null)
    }
    next();
  }
}
</script>
<style lang="scss" scoped>
.supply-water {
  height: 100%;
  overflow: auto;
  position: relative;
  text-align: center;
  min-height: 200px;
  color: #333333;
  margin-bottom: 20px;
  .video-btn {
    position: absolute;
    width: 30px;
    right: 20px;
    top: 0;
    line-height: 40px;
    font-size: 20px;
    background-color: #dcdfe6;
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
      i {
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
  .water-container {
    font-size: 18px;
    .tab-groups {
      margin: 30px 0;
      position: relative;
      z-index: 2;
    }
    .section {
      display: flex;
      justify-content: center;
      > div {
        display: inline-block;
        align-items: center;
      }
      .label-span {
        display: inline-block;
        background: #0090e5;
        color: white;
        border-radius: 4px;
        padding: 0 20px;
      }
      .block1,
      .block3 {
        display: inline-flex;
      }
      .block2 {
        position: relative;
        padding: 60px 60px 0 60px;
        .picture {
          width: 150px;
          height: 100px;
        }
        .pump-item {
          padding-top: 55px;
          .running {
            color: #2eb34a;
          }
          .trouble {
            color: #f0213e;
          }
          .name {
            max-width: 212px;
            margin-left: -20px;
            white-space: nowrap;
          }
        }
        .bottom-label {
          margin-top: 20px;
        }
      }
      .block4 {
        display: flex;
        position: relative;
        padding-right: 50px;
        .water-tank {
          position: relative;
          width: 527px;
          height: 417px;
          margin-bottom: 20px;
          .unit {
            position: absolute;
            top: -32px;
            z-index: 10;
            right: -40px;
            font-size: 12px;
          }
          .box {
            position: absolute;
            top: 50px;
            z-index: 9;
            &.error {
              > div {
                background-color: rgba(228, 20, 54, 0.55);
              }
            }
            > div {
              opacity: 0.7;
              position: absolute;
              bottom: -200px;
              text-align: center;
              line-height: 200px;
              border: 1px solid #fff;
              &.right {
                // width: 477px;
                width: 470px;
                transform: rotateY(79.9deg) translateX(1333px) translateY(17px)
                  skewY(-13.5deg);
                background-color: #2099e0;
              }
              &.front {
                // width: 400px;
                width: 396px;
                transform: translateX(30px) translateY(75px);
                background-color: #037bc2;
              }
              &.up {
                // width: 400px;
                width: 396px;
                height: 113px;
                transform: translateX(72px) skewX(-36.5deg);
                background: linear-gradient(0deg, #88dcff, #008fe4);
              }
            }
          }
          .picture {
            width: 100%;
            height: 100%;
            background: url("../../../../assets/images/drainage/waterTrank.png")
              no-repeat;
            background-size: contain;
            position: relative;
            z-index: 10;
            .tap {
              position: absolute;
              left: -24px;
              top: 76px;
              width: 25px;
              height: 30px;
            }
          }
          .level-mark {
            position: absolute;
            right: 0;
            top: 10px;
            height: 200px;
            // width: 5px;
            width: 12px;
            border-left: 1px solid #333;
            .level-line {
              position: absolute;
              left: 0px;
              width: 19px;
              height: 0;
              font-size: 14px;
              border-top: 2px solid #333;
              > span {
                position: absolute;
                left: 21px;
                bottom: -6px;
                line-height: normal;
              }
              &.short-line {
                width: 21px;
                border-top-color: #999;
              }
              &.limit-line {
                margin-top: -2px;
                width: 61px;
                border-top: 4px solid #f0213e;
                color: #f0213e;
                font-size: 20px;
                > span {
                  left: 65px;
                }
              }
              &.current-line {
                margin-top: -4px;
                bottom: 0;
                width: 61px;
                height: auto;
                border-top: 3px solid #f0213e;
                background: rgba(240, 33, 62, 0.2);
                color: #f0213e;
                .cur-mark {
                  left: 0;
                  top: -15px;
                  bottom: auto;
                  border: 6px solid #f0213e;
                  border-top-color: transparent;
                  border-left-color: transparent;
                }
                .cur-value {
                  left: 41px;
                  bottom: auto;
                  top: -20px;
                }
                // > span {
                //   left: 0;
                //   top: -15px;
                //   bottom: auto;
                //   border: 6px solid #f0213e;
                //   border-top-color: transparent;
                //   border-left-color: transparent;
                // }
                &.error-line {
                  border-top: 3px solid #f0213e;
                  color: #f0213e;
                  background: #f0213c9c;
                  > span {
                    border-color: #f0213e;
                    border-top-color: transparent;
                    border-left-color: transparent;
                  }
                }
              }
            }
          }
          .background-color {
            background: #656565;
            position: absolute;
            height: 80%;
            width: 57%;
            // right: 12px;
            right: 15px;
            top: 1px;
            z-index: 7;
          }
          .background-color2 {
            background: #fff;
            position: absolute;
            height: 50px;
            width: 50px;
            right: 12px;
            bottom: 65px;
            z-index: 8;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.supply-water {
  .line1 {
    display: inline-block;
    height: 8px;
    line-height: 8px;
    width: 83px;
    vertical-align: middle;
    overflow: hidden;
    .x-line {
      position: relative;
      left: -150px;
      width: 250px;
      display: block;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid #0090e5;
      border-left: none;
      border-right: none;
      background: url("../../../../assets/images/drainage/right-stop.png") 0 -1px
        repeat-x;
      background-size: 15px 8px;
      &.running {
        background: url("../../../../assets/images/drainage/right.png") 0 -1px repeat-x;
        background-size: 15px 8px;
        animation: running 10s linear infinite 1s;
      }
    }
    @keyframes running {
      0% {
        left: -150px;
      }
      100% {
        left: 0;
      }
    }
    &.line2 {
      width: 30px;
    }
  }
  .water-container .section .block2 {
    .only-one-pump {
      .pump-item {
        padding-top: 130px;
        .line1.left {
          width: 91px;
          left: -60px;
        }
        .line1.right {
          width: 91px;
          right: -60px;
        }
      }
    }
  }
  .pump-picture {
    position: relative;
    width: 212px;
    .line1 {
      position: absolute;
      top: 40%;
      &.left {
        left: -50px;
      }
      &.right {
        right: -52px;
      }
    }
  }
  .line {
    width: 8px;
    text-align: center;
    position: absolute;
    top: 160px;
    bottom: 160px;
    &.line-left {
      left: 0;
      .line-down {
        border-bottom: 1px solid #0090e5;
        box-sizing: border-box;
      }
      .line-up {
        border-top: 1px solid #0090e5;
        box-sizing: border-box;
      }
    }
    &.line-right {
      right: 0;
      .line-down {
        top: 0;
        bottom: unset;
        border-top: 1px solid #0090e5;
        box-sizing: border-box;
      }
      .line-up {
        bottom: 0;
        top: unset;
        border-bottom: 1px solid #0090e5;
        box-sizing: border-box;
      }
    }
    .line-up {
      position: absolute;
      top: 0;
      left: 0;
      height: 50%;
      width: 10px;
      overflow: hidden;
      border: 1px solid #0090e5;
      border-top: none;
      border-bottom: none;
      box-sizing: border-box;
      .y-line {
        display: block;
        width: 100%;
        height: 200%;
        position: relative;
        top: 0;
        background: url("../../../../assets/images/drainage/up-stop.png") -1px 0
          repeat-y;
        background-size: 10px 15px;
        &.running {
          background: url("../../../../assets/images/drainage/up.png") -1px 0 repeat-y;
          background-size: 10px 15px;
          animation: runningUp 10s linear infinite 1s;
        }
      }
    }
    @keyframes runningUp {
      0% {
        top: 0%;
      }
      100% {
        top: -100%;
      }
    }
    .line-down {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50%;
      width: 10px;
      border: 1px solid #0090e5;
      border-top: none;
      border-bottom: none;
      overflow: hidden;
      box-sizing: border-box;
      .y-line {
        display: block;
        width: 100%;
        height: 200%;
        position: relative;
        top: -100%;
        background: url("../../../../assets/images/drainage/down-stop.png") -1px
          0 repeat-y;
        background-size: 10px 15px;
        &.running {
          background: url("../../../../assets/images/drainage/down.png") -1px 0 repeat-y;
          background-size: 10px 15px;
          animation: runningDown 10s linear infinite 1s;
        }
      }
    }
    @keyframes runningDown {
      0% {
        top: -100%;
      }
      100% {
        top: 0%;
      }
    }
  }
  .block4 {
    .line {
      top: unset;
      bottom: calc(50% - 4px);
      height: 145px;
      .line3 {
        height: 100%;
        border-bottom: 1px solid #0090e5;
      }
    }
    .line1.line4 {
      width: 50px;
      position: relative;
      top: -142px;
      border-left: 1px solid #0090e5;
    }
  }
}
</style>
