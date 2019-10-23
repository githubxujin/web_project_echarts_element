<template>
  <div
    class="alarmInfo"
    v-loading="loading"
    :element-loading-text="$baseConfig.loading.text"
    :element-loading-spinner="$baseConfig.loading.spinner"
    :element-loading-background="$baseConfig.loading.background"
  >
    <span class="border left-top" />
    <span class="border right-top" />
    <span class="border left-bottom" />
    <span class="border right-bottom" />
    <div class="top-card">
      <span class="rectangle"></span>
      <span class="card-title">综合报警信息</span>
      <span v-for="item in warnNum" :key="item.name" class="warn">
        <i
          class="iconfont icon-gongpeidian active"
          v-if="item.name==='ele'&&item.num"
          @click="goPage('ele')"
        ></i>
        <i
          class="iconfont icon-geipaishui active"
          v-if="item.name==='water'&&item.num"
          @click="goPage('water')"
        ></i>
        <i
          class="iconfont icon-kongtiao1 active"
          v-if="item.name==='air'&&item.num"
          @click="goPage('air')"
        ></i>
        <i
          class="iconfont icon-dianti-deep active"
          v-if="item.name==='elevator'&&item.num"
          @click="goPage('elevator')"
        ></i>
        <span class="warn-num" v-show="item.num">X{{item.num}}</span>
      </span>
    </div>
    <div class="warning-notice">
      <!-- <div v-if="detailInfo!=null"> -->
      <el-row class="e-row" v-show="!isEmpty">
        <el-col :span="2">报警时间</el-col>
        <el-col :span="2">位置</el-col>
        <el-col :span="2" style="padding-left:15px;box-sizing:border-box;">设备</el-col>
        <el-col :span="3" style="padding-left:15px;box-sizing:border-box;">报警名称</el-col>

        <el-col :span="7" :offset="3">
          <ul class="steps">
            <!-- <li>待处理</li> -->
            <!-- <li>已确认</li> -->
            <li class="status">待确认</li>
            <li class="status">处理中</li>
            <li class="status">已恢复</li>
          </ul>
        </el-col>
        <el-col :span="2" style="text-align:center;">处理人</el-col>
        <el-col :span="3" style="text-align:center;">响应时间</el-col>
      </el-row>
      <el-row class="e-row" v-for="(item,index) in detailInfo" :key="index" v-show="!isEmpty">
        <div
          @click="goToPage(item)"
          @mouseenter="setBackColor(index)"
          @mouseleave="delBackColor(index)"
          ref="info"
        >
          <el-col :span="2" :title="item.alarmTime">
            <span class="text">{{item.alarmTime}}</span>
          </el-col>
          <el-col :span="2" :title="item.alarmLocation">
            <span class="text">{{item.alarmLocation}}</span>
          </el-col>
          <el-col
            :span="2"
            :title="item.deviceName"
            style="padding-left:15px; box-sizing:border-box;"
          >
            <span class="text">{{item.deviceName}}</span>
          </el-col>
          <el-col
            :span="3"
            :title="item.alarmName"
            style="padding-left:15px; box-sizing:border-box;"
          >
            <span class="text">{{item.alarmName}}</span>
          </el-col>
          <el-col :span="1" style="text-align:center">
            <span class="iconfont i-icon" :class="alarmSystemIcon[item.alarmType]"></span>
          </el-col>
          <el-col :span="2" style="text-align:center">
            <level-button :text="item.alarmLevel"></level-button>
          </el-col>
          <el-col :span="7">
            <ul class="steps progress">
              <li>
                <i class="circle" :class="{active:item.status===0,across:item.status>0}"></i>
                <div class="line"></div>
              </li>
              <li>
                <div class="left-line"></div>
                <i
                  class="circle"
                  :class="{active:item.status&&item.status===2,across:item.status>2}"
                ></i>
                <div class="line"></div>
              </li>
              <li>
                <div class="left-line"></div>
                <i
                  class="circle"
                  :class="{active:item.status&&item.status===3,across:item.status>3}"
                ></i>
                <!-- <div class="line"></div> -->
              </li>
              <!-- <li>
              <div class="left-line"></div>
              <i class="circle" :class="{active:item.status&&item.status===3}"></i>
              </li>-->
            </ul>
          </el-col>
          <el-col :span="2" style="text-align:center;">
            <span class="text">{{item.handler}}</span>
          </el-col>
          <el-col :span="3" style="text-align:center;">
            <span class="text">{{item.responseTimeLengthStr}}</span>
          </el-col>
        </div>
      </el-row>
      <span v-show="isEmpty" class="good-run-status">当前各系统运行状态良好，无报警信息</span>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import LevelButton from '../../../components/form/LevelButton';
import { getShopAlarmList } from '@/services/dashboard';
import { alarmSystemIcon } from '../../../enum/alarm-enum.js';

export default {
  components: { LevelButton },
  props: {
    shopNumber: {
      type: String,
      default: '002'
    },
    itemData: {
      type: String
    }
  },
  data () {
    return {
      shopCode: this.shopNumber,
      warnNum: [
        { name: 'ele', num: '' },
        { name: 'water', num: '' },
        { name: 'air', num: '' },
        { name: 'elevator', num: '' }
      ],
      detailInfo: [],
      isEmpty: false,
      loading: true,
      alarmSystemIcon
    }
  },
  created () {
    // console.log(111, this.itemData)
    this.getShopAlarmList()
  },
  watch: {
    shopNumber (newValue, old) {
      this.shopCode = newValue;
      this.getShopAlarmList()
    },
    itemData (val) {
      this.getWebData(val);
      this.isEmpty = false;
    }
  },
  methods: {
    async getShopAlarmList () {
      let res = await getShopAlarmList({ shopNumber: this.shopCode })
      if (res.code == 200) {
        this.loading = false;
        if (res.data && res.data.list.length > 0) {
          this.getWebData(res)
          this.isEmpty = false;
        } else {
          this.detailInfo = [];
          this.isEmpty = true;

        }
      } else {
        console.log(res.msg)
        this.loading = false;
      }
    },
    getWebData (res) {
      if (typeof (res) != 'string') {
        this.warnNum[0].num = res.data.ele;
        this.warnNum[1].num = res.data.water;
        this.warnNum[2].num = res.data.airConditioner;
        this.warnNum[3].num = res.data.elevator;
        this.detailInfo = res.data.list.filter((item, index) => {
          this.isEmpty = false;
          return item.alarmTime = item.alarmTime.slice(5, 16)
          // return index < 9;
        });
      } else {
        // console.log(JSON.parse(res), 4444)
        this.warnNum[0].num = JSON.parse(res).data.data.ele;
        this.warnNum[1].num = JSON.parse(res).data.data.water;
        this.warnNum[2].num = JSON.parse(res).data.data.airConditioner;
        this.warnNum[3].num = JSON.parse(res).data.data.elevator;
        // this.detailInfo = JSON.parse(res).data.list
        this.detailInfo = JSON.parse(res).data.data.list.filter((item, index) => {
          this.isEmpty = false;
          return item.alarmTime = item.alarmTime.slice(5, 16)
        });
      }

    },
    goToPage (item) {
      this.$router.push({ path: '/safety/alarm/view', name: 'AlarmView', params: { referer: 'index', id: item.id, type: item.alarmType } });
    },
    goPage (type) {
      switch (type) {
        case 'ele':
          this.$router.push({ path: '/safety/power-sys' })
          break;
        case 'water':
          this.$router.push({ path: '/safety/drainage/out-water' })
          break;
        case 'air':
          this.$router.push({ path: '/safety/air-sys/air-condition-monitoring' })
          break;
        default:
          this.$router.push({ path: '/safety/elevator-sys' })
          break;
      }
    },
    setBackColor (ind) {
      this.$refs['info'][ind].style.backgroundColor = "#384a5c";
      this.$refs['info'][ind].style.width = '100%';
      this.$refs['info'][ind].style.height = '100%';
    },
    delBackColor (ind) {
      this.$refs['info'][ind].style.backgroundColor = "#172745"
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../index.scss";
.alarmInfo {
  width: 100%;
  height: 100%;
  padding: 0px 5px;
  color: #e8f6ff;
  position: relative;
  max-height: 530px;
  left: -5px;
  .top-card {
    height: 44px;
    line-height: 44px;
    width: 100%;
    box-sizing: border-box;
    //   padding:20px;
    .rectangle {
      width: 3px;
      height: 18px;
      display: block;
      color: #cbd713;
      background-color: #cbd713;
      float: left;
      margin: 14px 8px 0px 10px;
    }
    .card-title {
      color: #cbd713;
      font-size: 20px;
    }
    .warn {
      margin-left: 5px;
      font-size: 17px;
    }
    .active {
      color: #63c8fc;
      -moz-animation-duration: ceil($number: 0);
    }
    .warn-num {
      color: #a02925;
    }
  }
  .warning-notice {
    width: 100%;
    height: calc(100% - 45px);
    overflow: hidden;
    overflow-y: auto;
    padding: 0px 15px;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    .good-run-status {
      line-height: 400px;
    }
    .e-row {
      // height: calc(100% / 10) !important;
      height: 45px;
      line-height: 45px;
      .el-col {
        height: 45px;
        text-align: left;
      }
      .el-col-3,
      .el-col-2 {
        height: 45px;
      }
      .text {
        display: inline-block;
        width: 100%;
        height: 100%;
        white-space: nowrap; /* 自适应宽度*/
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .steps {
        width: 100%;
        height: 100%;
        padding-left: 10px;
        display: flex;
        justify-content: space-around;
        box-sizing: border-box;
        li {
          flex: 1;
          position: relative;
          &.status {
            padding-left: 5px;
            box-sizing: border-box;
          }
          .circle {
            position: absolute;
            // left: 20%;
            left: 16%;
            // margin-left:-10px;
            top: 17px;
            display: inline-block;
            vertical-align: middle;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            border: 1px solid #e8f6ff;
            &.across {
              background-color: #2bb345;
            }
            &.active {
              width: 12px;
              height: 12px;
              top: 13px;
              background: url(../../../assets/images/shopIndex/select.png)
                no-repeat 0 0;
              background-size: 100% 100%;
            }
          }
          .line {
            float: right;
            width: calc(75%);
            margin-top: 22px;
            border-bottom: 1px dashed #e8f6ff;
          }
          .left-line {
            float: left;
            width: calc(17%);
            margin-top: 22px;
            border-bottom: 1px dashed #e8f6ff;
          }
        }
      }
    }
  }
}
</style>


