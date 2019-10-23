<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="repair">
          <template slot="label">
            <span class="fl">电梯示意图</span>
            <i
              class="u-tag iconfont icon-icon-life-alarm"
              @mouseenter="showHistoryAlarm"
              v-show="historyData.length>0"
            ></i>
          </template>
          <elevator-view :eleData="eleData"></elevator-view>
          <el-dialog
            title="报警统计"
            :visible.sync="dialogTableVisible"
            :close-on-click-modal="false"
            width="50%"
          >
            <el-table :data="historyData">
              <el-table-column property="name" label="对象" @click="goToPage(scope.row)"></el-table-column>
              <el-table-column property="curMonthAlarmNum" label="本月报警数"></el-table-column>
              <el-table-column property="lastMonthAlarmNum" label="上月报警数"></el-table-column>
              <el-table-column property="halfYearAlarmNum" label="半年内报警数"></el-table-column>
              <el-table-column property="oneYearAlarmNum" label="一年内报警数"></el-table-column>
              <el-table-column property="safeRunDuration" label="安全运行时长"></el-table-column>
            </el-table>
            <el-row class="text-center">
              <!-- <el-button type="primary" round size="mini" @click="close">确 定</el-button> -->
              <el-button round size="mini" @click="close">关 闭</el-button>
            </el-row>
          </el-dialog>
          <!-- <elevator-diagram :eleData="eleData"></elevator-diagram> -->
        </el-tab-pane>
        <!-- <el-tab-pane label="详情列表" name="maintain">
          <detial-table-info></detial-table-info>
        </el-tab-pane>-->
        <!-- <el-tab-pane label="摄像头影像" name="cameraImage">
          <camera-image :videoState="videoState"></camera-image>
        </el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import elevatorView from './ElevatorView';
import elevatorDiagram from './ElevatorDiagram';
import detialTableInfo from './DetialTableInfo';
import cameraImage from './CameraImage';
import { sketchMap, getAlarmStatistics } from '@/services/safety';
import { initWebSocket } from "@/utils/websocket";
export default {
  components: { elevatorDiagram, detialTableInfo, cameraImage, elevatorView },
  data () {
    return {
      activeName: 'repair',
      shopNumber: '',
      eleData: [],
      historyData: [],
      dialogTableVisible: false,
      videoState: 'show',
      websocketInstance: null, //websocket对象
      initWebSocketParams: { //websocket参数
        shopNumber: ''
      },
    };
  },
  created () {
    this.shopNumber = this.$store.getters.getUserInfo.roleType == 2 ? this.$store.getters.getUserInfo.shopNumber : this.$store.getters.getCurShop.shopNumber;
    if (this.shopNumber) {
      this.getSketchMap();
      this.getAlarmStatistics();
    }
    this.initWebSocketParams.shopNumber = this.shopNumber;
    this.websocketInstance = initWebSocket(this.initWebSocketParams,
      this.getComponentData.bind(this),
      '/ws/safeManage/elevator/websocket'
    )
  },
  destroyed () {
    if (this.websocketInstance) {
      this.websocketInstance.close()
    }
  },
  computed: {
    shopNumbers () {
      return this.$store.getters.shopNumber;
    },
  },
  watch: {
    shopNumbers (val) {
      this.shopNumber = val;
      this.getSketchMap();
      this.getAlarmStatistics()
    }
  },
  methods: {
    showHistoryAlarm () {

      this.dialogTableVisible = true;
    },
    handleClick (tab, event) {
      console.log(tab, event);
      if (tab.index != 1) {
        this.videoState = "hide"
      } else {
        this.videoState = "show"
      }
    },
    // 获取电梯示意图和运行数据
    async getSketchMap () {
      let res = await sketchMap(this.shopNumber)
      if (res.code == 200) {
        if (res.data && res.data.elevatorDetail.length > 0) {
          this.eleData = res.data.elevatorDetail
        } else {
          this.eleData = []
        }
      }
    },
    getAlarmStatistics () {
      getAlarmStatistics(this.shopNumber).then(res => {
        this.historyData = res.data || []
      }).catch(err => {
        console.log(err)
      })
    },
    getComponentData (res) {
      if (res.code == 200) {
        this.eleData = res.data.elevatorDetail
      }
    },
    goToPage (item) {
      this.$router.push({ path: '/safety/alarm/view', name: 'AlarmView', params: { referer: 'index', id: item.id } });
    },
    close () {
      this.dialogTableVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.p-container {
  overflow: auto;
  .sub-nav {
    /deep/ .el-tabs {
      height: 100%;
    }
  }
  /deep/ .el-tab-pane {
    overflow-y: auto;
  }
  .u-tag {
    margin-left: 10px;
    color: #ff0300;
    font-size: 28px;
  }
}
</style>
