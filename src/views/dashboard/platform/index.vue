<template>
  <div class="platform">
    <div class="index-top">
      <Logo logo-name="logo" link-url="plat-index" />
      <div class="layout-tree">
        <Projecttree v-model="treeData" :allChecked="true" @nodeClick="nodeClick"></Projecttree>
      </div>
      <top-user />
      <Menu />
    </div>
    <div class="index-container">
      <div class="i-left">
        <Map :shopNumber="shopNumber" ref="map"></Map>
      </div>
      <div class="i-right">
        <span class="border left-top" />
        <span class="border right-top" />
        <span class="border left-bottom" />
        <span class="border right-bottom" />
        <div class="i-content" ref="rightContent">
          <!-- 待处理报警详情 -->
          <alarm-detail :shopNumber="shopNumber" ref="alarmDetal"></alarm-detail>
          <!-- 待处理报警排名 -->
          <alarm-rank :shopNumber="shopNumber" ref="alarmRank" :height="rankHeight"></alarm-rank>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '../../../components/logo/index';
import TopUser from '../../../components/nav/TopUser';
import Menu from './Menu';
import Projecttree from '../../../components/projecttree/index.js';
import AlarmDetail from './AlarmDetail';
import AlarmRank from './AlarmRank';
import Map from './Map';
import { initWebSocket, sendWsData } from "@/utils/websocket";
export default {
  components: {
    Logo,
    TopUser,
    Menu,
    Projecttree,
    AlarmDetail,
    AlarmRank,
    Map
  },
  data () {
    return {
      treeData: [],
      shopNumber: '',
      websocketInstance: null, //websocket对象
      rankHeight: '',
    }
  },
  created () {
    console.log('created :');
    this.websocketInstance = this.createdSocket();
  },
  mounted () {
    var offsetHeight = this.$refs.rightContent.offsetHeight;
    //     var clientHeight = document.clientHeight;
    // alert(clientHeight + ',' + offsetHeight)
    this.rankHeight = offsetHeight - 450 - 118 + 'px';
  },
  watch: {
    treeData: {
      // immediate: true,
      handler: function (val) {
        // console.log('treeData:', val);
        if (val) {
          this.shopNumber = val.join(',')
        }
        this.$store.commit("base/updateCheckedShopNumbers", val);
        if (this.websocketInstance) {
          this.websocketInstance.close()
        }
        this.websocketInstance = this.createdSocket();
      },
      deep: true
    }
  },
  methods: {
    //创建socket对象
    createdSocket () {
      let that = this;
      console.log('that.shopNumber :', that.shopNumber);
      return initWebSocket({ shopNumbers: that.shopNumber },
        function (result) {
          console.log('收到的消息', result)
          if (!result.code) {
            return;
          }
          switch (result.code) {
            case 1: //集团首页数据地图
              that.$refs.map.updateMapData(result.data);
              break;
            case 2: //待处理报警详情
              that.$refs.alarmDetal.updateDetailData(result.data);
              break;
            case 3: //待处理报警排名
              that.$refs.alarmRank.updateAlarmRankData(result.data);
              break;
            default:
              break;
          }
        },
        '/ws/common/groupHomePage-ws/websocket'
      )
    },
    nodeClick (...args) {
      console.log('nodeClick', args);
      let curNode = args[1];
      if (curNode) {
        this.$store.commit('base/updateCurShop', { shopId: curNode.id, shopNumber: curNode.key, shopName: curNode.label });
        //跳转到门店首页
        // this.$router.push({ path: '/shop-index' });
        this.$common.jumpShopIndex(this, curNode.key);
      }
    }
  },
  destroyed () {
    if (this.websocketInstance) {
      this.websocketInstance.close()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../index.scss';
$borderColor: #3c5c75;
.platform {
  background-color: #182237;
  height: 100%;
  overflow: hidden;
  .index-top {
    height: 98px;
    line-height: 98px;
    padding: 0px 15px;
  }
  /deep/ .top-user {
    margin-right: 20px;
  }
}
.index-container {
  height: calc(100% - 118px);
  min-height: 560px;
  display: block;
  padding: 10px 20px;
  background-color: #182037;
  .i-left {
    width: calc(100% - 571px);
    float: left;
    display: block;
    height: 100%;
    background: $bcColor;
    margin-right: 15px;
    position: relative;
  }
  .i-right {
    width: 555px;
    float: right;
    display: block;
    height: 100%;
    // min-height: 838px;
    background: #1b243f;
    max-width: 555px;
    min-width: 450px;
    position: relative;
    .i-content {
      padding: 8px 18px;
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
    }
  }
}
</style>
