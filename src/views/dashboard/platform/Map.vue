<template>
  <div
    class="i-map-container"
    @click.self="ctrlShopDetail(true)"
    v-loading="loading"
    :element-loading-text="$baseConfig.loading.text"
    :element-loading-spinner="$baseConfig.loading.spinner"
    :element-loading-background="$baseConfig.loading.background"
  >
    <div class="i-info">
      平台应用于
      <span class="i-key">
        <ICountUp
          :startVal="countAnimation.start"
          :endVal="mapInfo.coverShopTotal"
          :decimals="countAnimation.decimals"
          :duration="countAnimation.duration"
        ></ICountUp>
      </span>个门店，覆盖
      <span class="i-key">
        <ICountUp
          :startVal="countAnimation.start"
          :endVal="mapInfo.coverCityTotal"
          :decimals="countAnimation.decimals"
          :duration="countAnimation.duration"
        ></ICountUp>
      </span>个城市，覆盖率
      <span class="i-key" v-text="mapInfo.coverRate"></span>
      <br />累计监测报警 一级：
      <span class="i-key">
        <ICountUp
          :startVal="countAnimation.start"
          :endVal="mapInfo.alarmOneLevelTotal"
          :decimals="countAnimation.decimals"
          :duration="countAnimation.duration"
        ></ICountUp>
      </span>个，二级：
      <span class="i-key">
        <ICountUp
          :startVal="countAnimation.start"
          :endVal="mapInfo.alarmTwoLevelTotal"
          :decimals="countAnimation.decimals"
          :duration="countAnimation.duration"
        ></ICountUp>
      </span>个，当前待解决报警：
      <span class="i-key">
        <ICountUp
          :startVal="countAnimation.start"
          :endVal="mapInfo.unSolvedAlarmTotal"
          :decimals="countAnimation.decimals"
          :duration="countAnimation.duration"
        ></ICountUp>
      </span>个
    </div>
    <div class="i-map" id="mapContainer"></div>
    <span
      v-if="showFold"
      class="fold"
      @click="onFold"
      :title="isFold?'折叠':'展开'"
      :class="isFold?'up':'down'"
    >
      <i class="iconfont" :class="isFold?'icon-downarrow':'icon-uparrow'"></i>
    </span>
    <transition name="el-zoom-in-center">
      <div class="i-shop-info" v-if="showDetail&&curShopPoint">
        <span class="border left-bottom" />
        <span class="border right-bottom" />
        <div class="i-show-head">
          <span
            class="i-show-name"
            @click="goToShopIndex(curShopPoint.number)"
          >{{curShopPoint.name}}</span>
          <dl>
            <dd v-for="(item,index) in curShopPoint.alarmStatisticGroupBySystem" :key="index">
              <i class="iconfont fl i-icon" :class="alarmSystemIcon[item.alarmType]"></i>
              <span class="one-level">X{{item.num}}</span>
            </dd>
          </dl>
        </div>
        <div class="i-shop-detail">
          <dl>
            <dd>
              累计待处理报警：
              <span>{{curShopPoint.unresolvedAlarmTotal}}</span>个
            </dd>
            <dd>
              建筑面积：
              <span>{{curShopPoint.area}}</span>㎡
            </dd>
          </dl>
          <dl>
            <dd>
              今日新增报警：
              <span>{{curShopPoint.addAlarmTotalToday}}</span>个
            </dd>
            <dd
              v-if="curShopPoint.address"
              class="text-ellipse"
              style="padding-right: 4px;"
              :title="'详细地址：'+curShopPoint.address"
            >详细地址：{{curShopPoint.address}}</dd>
            <dd v-else class="text-ellipse">详细地址：{{curShopPoint.address}}</dd>
          </dl>
          <dl>
            <dd>
              今日解决报警：
              <span>{{curShopPoint.resolvedAlarmTotalToday}}</span>个
            </dd>
            <dd>
              联系电话：
              <span>{{curShopPoint.telephone}}</span>
            </dd>
          </dl>
          <dl>
            <dd>
              日均响应时长：
              <span>{{curShopPoint.avarageResponseTime}}</span>
            </dd>
            <dd>
              接入时间：
              <span>{{curShopPoint.joinTime}}</span>
            </dd>
          </dl>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ICountUp from 'vue-countup-v2';
import chinaJson from '../../../assets/json/china'
import china_option from './map-options/china-map-option'
// import { chinaData,convertData, pointsData, alarmPointData, uplinePointData } from '../../../mock/json'
import { getDataMap } from '../../../services/dashboard';
import { alarmStatus, alarmSystem, alarmSystemIcon } from '@/enum/alarm-enum.js';

export default {
  props: {
    shopNumber: {
      type: String,
      default: ''
    }
  },
  components: {
    ICountUp
  },
  watch: {
    shopNumber: function (val) {
      // console.log('shopNumber', val)
      this.initData(this.shopNumber);
    }
  },
  data () {
    return {
      loading: true,
      showDetail: false,//显示门店详细信息
      showFold: false,//显示折叠/展开按钮
      isFold: false,//是否是折叠按钮
      //地图信息数据实体
      mapInfo: {
        coverShopTotal: 0,
        coverCityTotal: 0,
        alarmOneLevelTotal: 0,
        alarmTwoLevelTotal: 0,
        unSolvedAlarmTotal: 0,
        coverRate: '',
        shopList: []
      },
      mapOption: Object.assign({}, china_option),
      seriesIndex: 0, //series序列索引
      dataName: 0,
      //门店详情实体--当前点击的门店节点信息
      curShopPoint: {
        name: '', unresolvedAlarmTotal: 0, addAlarmTotalToday: 0, resolvedAlarmTotal: 0, avarageResponseTime: 0,
        area: 0, address: '', telephone: '', joinTime: '', number: ''
      },
      countAnimation: {
        start: 0,
        decimals: 0,
        duration: 3
      },
      mapChart: null,
      alarmSystemIcon
    };
  },
  created () {
    // this.initData(this.shopNumber);
    this.$echarts.registerMap('china', chinaJson)//注册中国地图
  },
  mounted () {
    this.mapChartsInit();
    // this.setMapView();
    this.$autoStop();
  },
  methods: {
    //跳转到门店首页
    goToShopIndex (shopNumber) {
      this.$common.jumpShopIndex(this, shopNumber);
    },
    //折叠/展开
    onFold () {
      this.showDetail = !this.showDetail;
      this.isFold = !this.isFold;
    },
    //根据ID获取地图容器
    mapChartsInit: function () {
      this.mapChart = this.$echarts.init(document.getElementById('mapContainer'))
    },
    //绘制map地图+更新门店详情
    setMapView (pointsData, alarmPointData, uplinePointData) {
      let curMapOption = this.mapChart.getOption() || this.mapOption;
      curMapOption.series[0].data = pointsData;
      curMapOption.series[1].data = alarmPointData;
      curMapOption.series[2].data = uplinePointData;
      this.mapChart.setOption(curMapOption)//显示中国地图
      //如果门店详情弹窗是显示状态，更新弹窗数据
      if (this.showDetail) {
        switch (this.seriesIndex) {
          case 0:
            this.curShopPoint = pointsData.find(n => n.name == this.dataName);
            break;
          case 1:
            this.curShopPoint = alarmPointData.find(n => n.name == this.dataName);
            break;
          case 2:
            this.curShopPoint = uplinePointData.find(n => n.name == this.dataName);
            break;
          default:
            break;
        }
        console.log('this.curShopPoint :', this.curShopPoint);
        // console.log('object :', this.seriesIndex, this.curShopPoint, this.dataName, alarmPointData);
      }
    },
    //控制门店详情弹窗隐藏和显示
    ctrlShopDetail (show) {
      this.showDetail = show;
      this.isFold = show;
      this.showFold = show;
    },
    //构造Item项
    getItem (item) {
      let obj = { name: '', value: [] };
      obj.name = item ? item.name : '';
      obj.value.push(item.x);
      obj.value.push(item.y);
      Object.assign(item, obj);
      return item;
    },
    //更新地图数据
    updateMapData (res) {
      this.mapInfo = res.data;
      let shopList = res.data.shopList;
      let pointsSeriesData = []; //绿色—正常 1
      let alarmPointSeriesData = []; // 红色—高级报警 2
      let uplinePointSeriesData = []; //灰色—通讯掉线 0
      // console.log('shopList :', shopList);
      shopList.forEach(n => {
        switch (n.status) {
          case 2:
            alarmPointSeriesData.push(this.getItem(n));
            break;
          case 0:
            uplinePointSeriesData.push(this.getItem(n));
            break;
          default: //1 绿色
            pointsSeriesData.push(this.getItem(n));
            break;
        }
      });
      this.setMapView(pointsSeriesData, alarmPointSeriesData, uplinePointSeriesData);
    },
    initData (shopNumber) {
      if (!shopNumber) { this.loading = false; return; };
      let that = this;
      getDataMap({ shopNumbers: shopNumber }).then((res) => {
        // console.log('地图数据', res)
        that.updateMapData(res);
        that.mapChart.on('click', function (params) {
          console.log('data', params, params.data)
          if (params.data) {
            that.dataName = params.name;
            //seriesIndex
            that.seriesIndex = params.seriesIndex;
            that.curShopPoint = params.data;
            that.ctrlShopDetail(true);
          } else {
            // that.ctrlShopDetail(false); //点击地图其它位置时，自动隐藏弹窗
          }
        });
        that.loading = false;
      }).catch((error) => {
        console.log(error)
        that.loading = false;
      });
      //如果当前选中的门店编码中包含选中的门店则显示弹窗详情，否则隐藏
      console.log('initData :', shopNumber);
      console.log('this.curShopPoint.number :', this.curShopPoint.number);
      if (this.curShopPoint.number && shopNumber && shopNumber.indexOf(this.curShopPoint.number) != -1) {
        this.ctrlShopDetail(true);
      } else {
        this.ctrlShopDetail(false);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$infoColor: #6eedfc;
@import '../index.scss';
.i-map-container {
  height: 100%;
}
.i-info {
  display: block;
  line-height: 56px;
  position: absolute;
  margin: 10px 0px 0px 40px;
  font-size: 20px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: $infoColor;
  z-index: 2;
  .i-key {
    color: white;
    font-size: 36px;
    font-weight: 600;
    margin: 0px 2px;
  }
}
.fold {
  display: block;
  width: 24px;
  height: 14px;
  background: #1b4569;
  z-index: 3;
  position: absolute;
  margin-left: -12px;
  left: 50%;
  cursor: pointer;
  text-align: center;
  &.up {
    bottom: 120px;
    border-radius: 0px 0px 4px 4px;
  }
  &.down {
    border-radius: 4px 4px 0px 0px;
    bottom: 0px;
    .iconfont {
      position: absolute;
      bottom: 0px;
      left: 4px;
    }
  }
  &:hover {
    color: $hoverColor;
    .iconfont {
      color: $fontColor;
    }
  }
  .iconfont {
    color: #67cbff;
  }
}
.i-shop-info {
  background: rgba(25, 47, 85, 0.33);
  height: 128px;
  width: calc(100% - 40px);
  // background-color: #1b243f;
  display: block;
  bottom: 0px;
  position: absolute;
  padding: 4px 20px;
  color: #dfe8f8;
  z-index: 2;
  .one-level {
    color: $oneLevelColor;
  }
  .i-show-head {
    height: 52px;
    line-height: 52px;
    font-size: 20px;
    .i-show-name {
      float: left;
      cursor: pointer;
      &:hover {
        // text-decoration: underline;
        color: #7abef9;
      }
    }
    dl {
      float: left;
      margin-left: 25px;
    }
    dd {
      line-height: 52px;
      height: 52px;
      float: left;
      // width: 60px;
      margin: 0px 5px;
      .i-icon {
        margin: 0px 4px;
        font-size: 24px;
      }
      span {
        font-size: 18px;
      }
    }
  }
  .i-shop-detail {
    dl {
      float: left;
      width: 25%;
    }
    dd {
      line-height: 38px;
      height: 38px;
    }
  }
}
.i-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
