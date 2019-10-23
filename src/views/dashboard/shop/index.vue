<template>
  <div class="shop-home-page">
    <div class="shop-header">
      <Logo logo-name="logo" />
      <div class="layout-tree" v-if="roleType==1">
        <Projecttree v-model="treeData" :isMultiple="false" @change="treeCheckChange"></Projecttree>
      </div>
      <span v-else class="shop-title text-ellipse" :title="subBranchName">{{subBranchName}}</span>
      <top-user />
      <top-nav />
    </div>
    <div class="shop-container">
      <div class="shop-right">
        <!-- 报警信息 配电排水 -->
        <div class="shop-right-top">
          <div class="alarm-total-info">
            <alarm-info :shopNumber="shopCode" :itemData="allData.totalInfoData"></alarm-info>
          </div>
          <div class="power-water-system">
            <div class="power-system">
              <power-system :shopNumber="shopCode" :itemData="allData.powerData"></power-system>
            </div>
            <div class="water-system">
              <water-system :shopNumber="shopCode" :itemData="allData.waterData"></water-system>
            </div>
          </div>
        </div>
        <!-- 电梯 空调 能耗 -->
        <div class="shop-right-bottom">
          <div class="air-system">
            <air-system :shopNumber="shopCode" :itemData="allData.airData"></air-system>
          </div>
          <div class="elevator-system">
            <elevator-system :shopNumber="shopCode" :itemData="allData.elevatorData"></elevator-system>
          </div>
          <div class="energy-system">
            <energy-system :itemData="allData.energyData" :shopNumber="shopCode"></energy-system>
          </div>
        </div>
      </div>
    </div>
    <!-- 报警弹窗提示 根据报警条数,根据指令一条一条展示数据-->
    <el-dialog
      v-dialogDrag
      title="报警"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
      class="alarmPop"
      :visible.sync="showAlarmPwPopup"
    >
      <alarm-page
        :info="AlarmObject[ind]"
        @isHidealarmPage="hideAlarm"
        :index="ind"
        :length="AlarmObject.length"
        :orderHandler="orderHandler"
        @getNextAlarmInfo="getNextAlarmInfo"
      />
    </el-dialog>
  </div>
</template>
<script>
import Logo from '@/components/logo/index';
import TopUser from '@/components/nav/TopUser';
import TopNav from '@/components/nav/TopNav'
import leftBar from '@/components/layout/shop/LeftTabBar.vue';
import PowerSystem from './PowerSystem.vue';
import waterSystem from './WaterSystem.vue';
import EnergySystem from './EnergySystem.vue';
import ElevatorSystem from './ElevatorSystem.vue';
import AirSystem from './AirSystem.vue';
import AlarmInfo from './AlarmTotalInfo.vue';
import AlarmPage from './AlarmPage.vue';
import Projecttree from '../../../components/projecttree/index.js';
import { initWebSocket } from "@/utils/websocket";
import { getOrderHandlerByShop } from "@/services/dashboard";
import forbidBack from '@/utils/mixins/forbidBack.js';

let count = 0;
export default {
  components: { Logo, TopUser, TopNav, leftBar, PowerSystem, waterSystem, EnergySystem, ElevatorSystem, AirSystem, AlarmInfo, AlarmPage, Projecttree }, //Menu
  mixins: [forbidBack],
  data () {
    return {
      treeData: [],
      shopCode: '',
      subBranchName: '',//分店名称，应该在vuex中取
      showAlarmPwPopup: false,
      websocketInstance: null, //websocket对象
      initWebSocketParams: { //websocket参数
        shopNumber: '',
        pageCode: '200'
      },
      allData: {//webscoket返回的数据
        powerData: null,
        waterData: null,
        energyData: null,
        airData: null,
        elevatorData: null,
        totalInfoData: null
      },
      orderHandler: [],
      AlarmObject: [],
      ind: 0,//展示的第几条报警数据
      alarmInfo: {},
    }
  },
  computed: {
    roleType: function () {
      return this.$store.getters.getUserInfo.roleType;
    },
    shopNumber: function () {
      return this.$store.getters.shopNumber;
    },
    curShop: function () {
      return this.$store.getters.getCurShop;
    },
  },
  watch: {
    shopNumber (val) {
      this.shopCode = val;
      this.initWebSocketParams.shopNumber = val;
      if (this.websocketInstance) {
        this.websocketInstance.close()
        this.websocketInstance = initWebSocket(this.initWebSocketParams,
          this.getComponentData.bind(this),
          '/ws/common/shopHomePage-ws/websocket'
        )
      }
    },
    curShop: {
      handler: function (newVal, oldVal) {
        this.shopCode = vanewVal.shopNumber;
        this.initWebSocketParams.shopNumber = vanewVal.shopNumber;
        if (this.websocketInstance) {
          this.websocketInstance.close()
          this.websocketInstance = initWebSocket(this.initWebSocketParams,
            this.getComponentData.bind(this),
            '/ws/common/shopHomePage-ws/websocket'
          )
        }
      },
      deep: true
    }
  },
  created () {
    this.initShopName();
    // 开启websocket长连接
    this.websocketInstance = initWebSocket(this.initWebSocketParams,
      this.getComponentData.bind(this),
      '/ws/common/shopHomePage-ws/websocket'
    )
    this.getOrderHandlerByShop();
  },
  destroyed () {
    if (this.websocketInstance) {
      this.websocketInstance.close();
    }
  },
  methods: {
    initShopName () {
      let res = [];
      if (this.curShop && this.curShop.shopNumber) {
        res.push(this.curShop.shopNumber);
      }
      this.treeData = res;
      this.shopCode = this.roleType == 2 ? this.shopNumber : this.curShop.shopNumber;
      this.initWebSocketParams.shopNumber = this.shopCode;
      this.subBranchName = this.$store.getters.getCurShopName;
    },
    // 获取门店工单处理人
    getOrderHandlerByShop () {
      getOrderHandlerByShop({ shopNumber: this.shopCode }).then(res => {
        if (res.code == 200) {
          this.orderHandler = res.data && res.data.array.length > 0 ? res.data.array : []
        } else {
          this.orderHandler = []
        }
      })
    },
    // 处理报警信息，使报警弹窗弹出
    // handleAlarmInfo () {
    //   for (const key in this.AlarmObject) {
    //     this.showAlarmPwPopup.push(true)
    //   }
    // },
    // 确认报警信息，关闭报警弹窗
    hideAlarm (ind, userId) {
      // for (const key in this.AlarmObject) {
      //   if (this.AlarmObject[key].data.alarmId == userId) {
      //     delete this.AlarmObject[key]
      //   }
      // }
      // console.log(this.AlarmObject, 66666666666666666)
      // this.alarmInfo = this.AlarmObject;
      // this.showAlarmPwPopup.splice(ind, 1, false)
      this.showAlarmPwPopup = false;
      this.AlarmObject = [];
      this.ind = 0;
    },
    treeCheckChange (...args) {
      let curNode = args[1];
      if (curNode && curNode.id) {
        this.$store.commit('base/updateCurShop', { shopId: curNode.id, shopNumber: curNode.shopNumber, shopName: curNode.shopName });
      }
    },
    // websocket回调函数，对数据进行分配
    getComponentData (res) {
      if (typeof (res) == "string") {
        this.allData.totalInfoData = res;
        // console.log('综合报警信息', res)
      } else {
        switch (res.code) { //综合报警信息
          case 1:
            console.log('shuju', res)
            this.allData.totalInfoData = res.data
            break;
          case 2://供配电
            this.allData.powerData = res.data;
            break;
          case 3://给排水
            this.allData.waterData = res.data;
            break;
          case 4://空调
            this.allData.airData = res.data;
            break;
          case 5://电梯
            this.allData.elevatorData = res.data.data;
            break;
          case 6://能耗
            this.allData.energyData = res.data;
            break;
          default:
            this.AlarmObject.push(res.data);
            console.log('报警弹窗中显示的报警信息', this.AlarmObject)
            if (this.AlarmObject.length > 0) {
              this.showAlarmPwPopup = true;
            }
        }
      }
    },
    getNextAlarmInfo () {
      this.ind += 1
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/components/layout/scss/head.scss";
.shop-home-page {
  width: 100%;
  height: 100%;
  background-color: #182237;
  overflow: hidden;
  color: #b8daf5;
  min-height: 800px;
  .alarmPop {
    /deep/ .el-dialog__header {
      background-color: #b7230b;
      padding: 0 0 0 10px;
    }
    /deep/ .el-dialog__header .el-dialog__title,
    /deep/ .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }

  .shop-header {
    height: 98px;
    line-height: 98px;
    padding: 0px 15px;
  }
  .shop-container {
    width: 100%;
    height: calc(100% - 98px);
    // min-height: 782px;
    padding: 10px 30px;
    box-sizing: border-box;
    background-color: rgba(20, 35, 64, 0.5);
    overflow: hidden;
    overflow-y: auto;
    .shop-right {
      vertical-align: middle;
      display: inline-block;
      width: calc(100% - 10px);
      height: 100%;
      min-height: 760px;
      .shop-right-top {
        width: 100%;
        height: calc(100% - 320px);
        max-height: 530px;
        background: rgba(23, 38, 69, 0.2);
        margin-bottom: 10px;
        display: flex;
        align-content: space-around;
        .alarm-total-info {
          flex: 2;
          margin-right: 10px;
          padding: 0px 5px;
          // min-height: 531px;
          background: rgba(25, 47, 85, 0.33);
        }
        .power-water-system {
          flex: 1;
          min-width: 400px;
          .power-system,
          .water-system {
            // flex: 1;
            width: 100%;
            height: calc(50% - 8px);
            padding: 5px 10px;
            // min-height: 258px;
            box-sizing: border-box;
            position: relative;
            background-color: rgba(25, 47, 85, 0.33);
          }
          .water-system {
            margin-top: 16px;
          }
        }
      }
      .shop-right-bottom {
        width: 100%;
        height: 310px;
        display: flex;
        justify-content: space-between;
        // align-content: space-around;
        .air-system,
        .elevator-system,
        .energy-system {
          flex: 1;
          background-color: rgba(25, 47, 85, 0.33);
        }
        .elevator-system {
          margin: 0px 10px;
        }
        .energy-system {
          min-width: 400px;
          position: relative;
        }
      }
    }
  }
}
@media screen and (max-width: 1870px) {
  /deep/ .pm-title {
    display: none !important;
  }
  .shop-title {
    max-width: 300px;
  }
}
@media screen and (max-width: 1520px) {
  .shop-title {
    max-width: 250px;
  }
}
@media screen and (max-width: 1446px) {
  .shop-title {
    max-width: 200px;
  }
}
</style>



