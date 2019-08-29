<template>
  <div class="elevator-diagram">
    <el-scrollbar class="ele-scroll">
      <el-row class="status-img" :gutter="30">
        <el-col :xl="6" :lg="8" :md="8" :xs="8" :sm="8" v-for="(item,ind) in eleData" :key="ind">
          <div class="status-item">
            <div class="top-title" :class="[item.elevatorStatus?'bad':'active']">
              <span>{{item.name}}</span>
              <span
                class="fr"
                :class="{active:item.cameraStatus==1}"
                v-html="item.elevatorStatus==1?'故障':(item.cameraStatus==1?'摄像头故障':'正常')"
              ></span>
            </div>
            <div class="ele-status clear">
              <div class="floor-info fl">
                <i class="camera" :class="{active:item.cameraStatus}"></i>
                <div class="floor">
                  <i class="uparrow" :class="{active:item.runningStatus==2}"></i>
                  <p class="floor-num">{{item.floor}}</p>
                  <i class="downarrow" :class="{active:item.runningStatus==0}"></i>
                </div>
              </div>
              <div class="ele-info fr">
                <!-- 下行开门无人-->
                <img src="@/assets/images/elevator/openDoor.png" v-show="item.liftCarStatus=='110'">
                <!-- 下行开门载人 -->
                <img
                  src="@/assets/images/elevator/openDoorDown.png"
                  v-show="item.liftCarStatus=='111'"
                >
                <!-- 下行关门无人 -->
                <img
                  src="@/assets/images/elevator/normalGoDown.png"
                  v-show="item.liftCarStatus=='100'"
                >
                <!-- 下行关门载人 -->
                <!-- <img
                  src="@/assets/images/elevator/normalPersonGoDown.png"
                  v-show="item.liftCarStatus=='101'"
                >-->

                <!-- 平层开门无人 -->
                <img
                  src="@/assets/images/elevator/normalStop.png"
                  v-show="item.liftCarStatus=='010'"
                >

                <!-- 平层开门载人 -->
                <!-- <img
                  src="@/assets/images/elevator/stopOpenPerson.png"
                  v-show="item.liftCarStatus=='011'"
                >-->

                <!-- 平层关门无人 -->
                <img
                  src="@/assets/images/elevator/normalStop.png"
                  v-show="item.liftCarStatus=='000'"
                >
                <!-- 平层关门载人 -->
                <!-- <img
                  src="@/assets/images/elevator/stopClosePerson.png"
                  v-show="item.liftCarStatus=='001'"
                >-->

                <!-- 开门载人上行-->
                <img
                  src="@/assets/images/elevator/openPersonUp.png"
                  v-show="item.liftCarStatus=='211'"
                >
                <!-- 开门无人上行-->
                <img src="@/assets/images/elevator/openDoor.png" v-show="item.liftCarStatus=='210'">
                <!-- 关门无人上行-->
                <!-- <img src="@/assets/images/elevator/closePersonUp.png" v-show="item.liftCarStatus=='200'"> -->
                <!-- 关门载人上行-->
                <img src="@/assets/images/elevator/normalUp.png" v-show="item.liftCarStatus=='201'">

                <!-- 悬停开门无人-->
                <img src="@/assets/images/elevator/openDoor.png" v-show="item.liftCarStatus=='310'">
                <!-- 悬停开门载人-->
                <img
                  src="@/assets/images/elevator/openPersonUp.png"
                  v-show="item.liftCarStatus=='311'"
                >
                <!-- 悬停关门无人-->
                <!-- <img src="@/assets/images/elevator/closePersonStop.png" v-show="item.liftCarStatus=='300'"> -->
                <img
                  src="@/assets/images/elevator/openDoorDown.png"
                  v-show="item.liftCarStatus=='300'"
                >
                <!-- 悬停关门载人-->
                <img
                  src="@/assets/images/elevator/openPersonUp.png"
                  v-show="item.liftCarStatus=='301'"
                >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script>

export default {
  props: {
    eleData: {
      type: Array
    }
  },
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.elevator-diagram {
  width: 100%;
  height: 100%;
  min-height: 770px;
  .status-img {
    width: 100%;
    height: 100%;
    margin: 0px !important;
    box-sizing: border-box;
    .status-item {
      width: 100%;
      min-width: 260px;
      max-width: 340px;
      height: 375px;
      border-radius: 10px;
      border: 1px solid #ccc;
      background: #fff;
      margin: 5px 0px;
      box-sizing: border-box;
      .top-title {
        color: #fff;
        height: 60px;
        line-height: 60px;
        box-sizing: border-box;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        &.active {
          background-color: #2d90d4;
        }
        &.bad {
          background-color: #f0213f;
        }
        span {
          &:first-child {
            font-size: 20px;
            padding-left: 19px;
          }
          &:last-child {
            display: inline-block;
            height: 100%;
            padding: 0px 10px;
            border-top-right-radius: 10px;
            &.active {
              background-color: #f0213f;
            }
          }
        }
      }
      .ele-status {
        width: 100%;
        height: 315px;
        padding-right: 30px;
        box-sizing: border-box;
        .floor-info {
          width: 100px;
          height: 100%;
          box-sizing: border-box;
          padding: 27px 33px 30px;
          font-size: 24px;
          font-weight: 600;
          color: #0062a9;
          text-align: center;
          i.camera {
            display: block;
            width: 35px;
            height: 31px;
            margin-left: 2px;
            background: url(../../../assets/images/elevator/camera.png)
              no-repeat 0 0;
            &.active {
              background: url(../../../assets/images/elevator/badcamera.png);
            }
          }
          .floor {
            width: 100%;
            margin-top: 30px;
            .uparrow,
            .downarrow {
              display: block;
              width: 43px;
              height: 43px;
              background: url(../../../assets/images/elevator/upArrow-unselect.png)
                no-repeat 0 0;
              &.active {
                background: url(../../../assets/images/elevator/upArrow-selected.png)
                  no-repeat 0 0;
              }
            }
            .downarrow {
              background: url(../../../assets/images/elevator/downArrow-unselect.png)
                no-repeat 0 0;
              background-size: 100% 100%;
              &.active {
                background: url(../../../assets/images/elevator/downArrow-select.png)
                  no-repeat 0 0;
              }
            }
            .floor-num {
              margin: 27px 0px;
              text-align: center;
            }
          }
        }
        .ele-info {
          width: calc(100% - 100px);
          height: 100%;
          box-sizing: border-box;
          padding: 10px 10px 20px;
          img {
            width: 100%;
            height: 100%;
          }
          //   background-color: pink;
        }
      }
    }
  }
}
</style>


