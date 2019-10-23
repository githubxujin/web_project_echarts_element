<template>
  <div
    class="elevator-systems"
    v-loading="loading"
    :element-loading-text="$baseConfig.loading.text"
    :element-loading-spinner="$baseConfig.loading.spinner"
    :element-loading-background="$baseConfig.loading.background"
  >
    <span class="border left-top" />
    <span class="border right-top" />
    <span class="border left-bottom" />
    <span class="border right-bottom" />
    <card-head :showError="false" :title="title" :num="warnNum" @goToPage="toElevator"></card-head>
    <div class="ele-container">
      <el-row :gutter="10">
        <el-col
          v-for="(item,index) in liftData"
          :key="index"
          :xl="6"
          :lg="6"
          :md="6"
          :sm="6"
          :xs="6"
        >
          <div
            class="ele-item"
            @mouseenter="showBox(item,index)"
            @mouseleave="hideBox(item,index)"
            ref="item"
            @click="toElevator"
          >
            <span>{{item.floor}}</span>
            <div>
              <div class="elevator-image1">
                <img
                  src="@/assets/images/shopIndex/ele-person-normal.png"
                  v-show="item.anyPassenger==1&&item.elevatorStatus==0&&!item.cameraStatus"
                />
                <img
                  src="@/assets/images/shopIndex/empty-data.png"
                  v-show="item.anyData==0&&!item.cameraStatus"
                />
                <img
                  src="@/assets/images/shopIndex/ele-normal-empty.png"
                  v-show="item.anyPassenger==0&&item.elevatorStatus==0&&item.anyData&&!item.cameraStatus"
                />
                <img
                  src="@/assets/images/shopIndex/ele-empty-bad.png"
                  v-show="item.anyPassenger==0&&item.elevatorStatus!=0||item.anyPassenger==0&&item.cameraStatus"
                />
                <img
                  src="@/assets/images/shopIndex/ele-person-bad.png"
                  v-show="item.anyPassenger==1&&item.elevatorStatus!=0||item.anyPassenger==1&&item.cameraStatus"
                />
                <div class="floor-statu">
                  <i class="iconfont icon-uparrow up" :class="{active:item.runningStatus=='1'}"></i>
                  <i class="iconfont icon-downarrow down" :class="{active:item.runningStatus=='2'}"></i>
                </div>
              </div>
            </div>
            <span :title="item.name.length>=11?item.name:''" class="ele-name">{{item.name}}</span>
            <div class="float-box" ref="floatBox">
              <span style="display:inline-block">{{item.name}}</span>
              <p>{{item.location}}</p>
              <p>{{item.elevatorStatusDescr}}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import cardHead from './ShopCartHead';
import { getLiftAlarmList } from '@/services/dashboard'
export default {
  components: { cardHead },
  props: {
    shopNumber: {
      type: String,
    },
    itemData: {
      type: Object
    }
  },
  data () {
    return {
      title: '电梯系统',
      liftData: [],
      warnNum: null,
      loading: true,
    }
  },
  created () {
    this.getLiftAlarmList()
  },
  mounted () {
    // window.addEventListener('scroll', this.scrollTop);
  },
  watch: {
    shopNumber (val) {
      this.getLiftAlarmList()
    },
    itemData: {
      handler: function (val, old) {
        if (val) {
          this.liftData = val.elevatorDetail;
          this.warnNum = val.falutElevatorNum
        }
      },
      deep: true
    }
  },
  methods: {
    toElevator () {
      this.$router.push({ path: '/safety/elevator-sys' })
    },
    // scrollTop () {
    //   let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop //滚动条的高
    //   console.log(scrollTop)
    // },
    showBox (obj, num) {
      let top = this.$refs.item[num].getBoundingClientRect().top;
      let left = this.$refs.item[num].getBoundingClientRect().left + this.$refs.item[num].getBoundingClientRect().width - 10;
      if (obj.elevatorStatus != '0' && obj.anyData || obj.cameraStatus) {
        this.$refs.floatBox[num].style.display = 'block';
        this.$refs.floatBox[num].style.left = left + 'px';
        this.$refs.floatBox[num].style.top = top + 'px';
      }
    },
    hideBox (obj, num) {
      this.$refs.floatBox[num].style.display = 'none';
    },
    getLiftAlarmList () {
      getLiftAlarmList(this.shopNumber).then(res => {
        this.loading = false;
        if (res.code == 200) {
          if (res.data && res.data.elevatorDetail.length > 0) {
            this.liftData = res.data.elevatorDetail;
            this.warnNum = res.data.falutElevatorNum
          } else {
            this.liftData = []
          }
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import "../index.scss";
.elevator-systems {
  width: 100%;
  height: 100%;
  color: #e8efff;
  padding: 0px 10px;
  box-sizing: border-box;
  position: relative;
  .ele-container {
    height: calc(100% - 44px);
    overflow: hidden;
    overflow-y: auto;
  }
  .ele-item {
    text-align: center;
    margin-bottom: 15px;
    height: 118px;
    position: relative;
    cursor: pointer;
    span {
      text-align: center;
      &:first-child {
        display: block;
        height: 19px;
      }
    }
    .elevator-image1 {
      position: relative;
      // left: 3%;
      margin: 8px 0px;
      img {
        // width: calc(100%-20px);
        height: 100%;
        max-height: 60px;
      }
      .floor-statu {
        display: inline-block;
        width: 20px;
        position: absolute;
        top: 10px;
        margin-left: 3px;
        .up,
        .down {
          display: block;
          color: #45516a;
          font-size: 20px;
          margin-bottom: 2px;
        }
        .active {
          color: #2eb34a;
        }
      }
    }
    .ele-name {
      width: 100%;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .float-box {
      position: fixed;
      top: 0px;
      width: 165px;
      height: 115px;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #67cbff;
      padding: 10px;
      line-height: 20px;
      text-align: left;
      display: none;
      background-color: #135786;
      color: #f8ffff;
      z-index: 1000;
    }
    .ele-statu,
    .ele-warnning-statu {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../../../static/img/shop-index/run.png) no-repeat 0 0;
      background-size: 100% 100%;
    }
    .ele-warnning-statu {
      background: url(../../../../static/img/shop-index/problem.png) no-repeat 0
        0;
      background-size: 100% 100%;
    }
  }
}
</style>


