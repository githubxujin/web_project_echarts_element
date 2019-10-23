<template>
  <div class="elevator-diagram">
    <el-row class="status-img" :gutter="30">
      <el-col :xl="6" :lg="8" :md="8" :xs="8" :sm="8" v-for="(item,ind) in eleList" :key="ind">
        <div class="status-item" ref="hoverBox">
          <div class="top-title" :class="[item.elevatorStatus?'bad':'',item.anyData?'':'graying']">
            <span :title="item.name.length>8?item.name:''">{{item.name}}</span>
            <span
              class="fr"
              :class="{active:item.cameraStatus==1}"
              :title="item.elevatorStatusDescr.length>8?item.elevatorStatusDescr:''"
              v-html="item.elevatorStatusDescr?item.elevatorStatusDescr:(item.anyData?'正常':'无数据')"
            ></span>
          </div>
          <div class="ele-status clear">
            <div class="floor-info fl">
              <i
                class="ele-camera"
                :class="[item.cameraStatus?'active':'',item.anyData?'':'graying']"
                @click="showCamera(item,ind)"
              ></i>
              <div class="ele-floor">
                <span class="up-arrow" :class="{active:item.runningStatus==1}">
                  <i class="iconfont icon-uparrow"></i>
                </span>
                <p class="floor-num">{{item.floor}}</p>
                <span class="down-arrow" :class="{active:item.runningStatus==2}">
                  <i class="iconfont icon-downarrow"></i>
                </span>
              </div>
            </div>
            <div class="ele-info fr">
              <!-- 下行开门无人-->
              <img src="@/assets/images/elevator/open-noPerson.png" v-show="item.anyPassenger!='1'" />
              <!-- 下行开门载人 -->
              <img src="@/assets/images/elevator/open-person.png" v-show="item.anyPassenger=='1'" />
            </div>
          </div>
        </div>
      </el-col>
      <span
        style="display: block;text-align: center;line-height: 200px;"
        v-if="!eleList.length"
      >暂无数据</span>
    </el-row>
    <el-dialog
      v-dialogDrag
      title="视频"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
      :visible.sync="showPop"
      v-if="showPop"
    >
      <camera-player :videoUrl="videoUrl" @hideDialog="showPop=false"></camera-player>
    </el-dialog>
  </div>
</template>
<script>
import cameraPlayer from './CameraPlayer'
import { getVideoUrl } from '@/services/safety'

export default {
  components: { cameraPlayer },
  props: {
    eleData: {
      type: Array
    }
  },
  data () {
    return {
      showPop: false,
      videoUrl: '',
      number: '',//当前设备编号
      eleList: [],
      isFirst: []
    }
  },
  created () {
    this.eleList = this.eleData;
  },
  watch: {
    eleData (val) {
      this.eleList = this.eleData;
      this.eleList.forEach(item => {
        this.isFirst.push(false)
      })
    }
  },
  methods: {
    showCamera (item, ind) {
      let that = this
      this.number = item.number;
      if (item.anyData) {
        if (item.cameraStatus) {
          if (this.isFirst[ind]) {
            return
          }
          this.$message.error('摄像头故障，请及时处理');
          this.isFirst[ind] = true;
          setTimeout(function () {
            that.isFirst[ind] = false;
          }, 3000);
        } else {
          getVideoUrl({ shopNumber: this.$store.getters.shopNumber, number: this.number }).then(res => {
            console.log(res)
            if (res.code == 200) {
              this.videoUrl = res.data ? res.data : ''
            }
          })
          this.showPop = true
        }
      }
    },

    // getPosition (ind, event) {
    //   // 已屏幕中心为界，显示电梯信息
    //   let screenWidth = document.body.clientWidth;
    //   let screenHeight = document.body.clientHeight;
    //   //   let left = this.$refs.hoverBox[ind].getBoundingClientRect().left;
    //   //   let top = this.$refs.hoverBox[ind].getBoundingClientRect().top;
    //   //   this.$refs['ele-detail'][ind].style.display = "block";
    //   //   if (left <= screenWidth / 2) {
    //   //     this.$refs['ele-detail'][ind].style.left = left + this.$refs.hoverBox[ind].clientWidth + 5 + 'px';
    //   //     this.$refs['ele-detail'][ind].style.top = top + 'px';
    //   //   } else {
    //   //     this.$refs['ele-detail'][ind].style.left = left - this.$refs['ele-detail'][ind].clientWidth - 5 + 'px';
    //   //     this.$refs['ele-detail'][ind].style.top = top + 'px';
    //   //   }
    //   //   已鼠标在盒子中的位置作为盒子的展示位置
    //   console.log(event, this.$refs.hoverBox[ind].clientWidth)
    //   this.$refs['ele-detail'][ind].style.display = "block";
    //   let hoverBoxWidth = this.$refs.hoverBox[ind].clientWidth;
    //   let hoverBoxHeight = this.$refs.hoverBox[ind].clientHeight;
    //   let eleInfoWidth = this.$refs['ele-detail'][ind].clientWidth;
    //   let eleInfoHeight = this.$refs['ele-detail'][ind].clientHeight;
    //   let that = this;
    //   this.$refs.hoverBox[ind].addEventListener('mousemove', function (event) {
    //     // if (event.offsetX + eleInfoWidth > hoverBoxWidth) {
    //     //   that.$refs['ele-detail'][ind].style.left = event.screenX - eleInfoWidth + 'px';
    //     //   that.$refs['ele-detail'][ind].style.top = event.clientY + 'px';
    //     // } else if (event.offsetY + eleInfoHeight > hoverBoxHeight) {
    //     //   that.$refs['ele-detail'][ind].style.left = event.screenX + 'px';
    //     //   that.$refs['ele-detail'][ind].style.top = event.clientY - eleInfoHeight + 'px';
    //     // } else {
    //     if (event.screenX + eleInfoWidth > screenWidth) {
    //       that.$refs['ele-detail'][ind].style.left = event.screenX - eleInfoWidth + 'px';
    //       that.$refs['ele-detail'][ind].style.top = event.clientY + 'px';
    //     } else if (event.clientY + that.$refs.hoverBox[ind].offsetTop > screenHeight) {
    //       that.$refs['ele-detail'][ind].style.left = event.screenX + 'px';
    //       that.$refs['ele-detail'][ind].style.top = event.clientY - eleInfoHeight + 'px';
    //     } else {
    //       that.$refs['ele-detail'][ind].style.left = event.screenX + 10 + 'px';
    //       that.$refs['ele-detail'][ind].style.top = event.clientY + 10 + 'px';
    //     }

    //   })

    // },
    // hideInfo (ind) {
    //   this.$refs['ele-detail'][ind].style.display = "none";
    // }
  }
}
</script>
<style lang="scss" scoped>
.elevator-diagram {
  width: 100%;
  height: 100%;
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
      background: #f1f6fb;
      margin: 5px 0px;
      box-sizing: border-box;
      position: relative;
      .top-title {
        color: #fff;
        width: 100%;
        height: 60px;
        line-height: 60px;
        box-sizing: border-box;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        background-color: #2eb34a;
        &.bad {
          background-color: #f0213f;
        }
        &.graying {
          background-color: #ccc;
        }
        span {
          white-space: nowrap; /* 自适应宽度*/
          overflow: hidden;
          text-overflow: ellipsis;
          &:first-child {
            display: inline-block;
            width: 48%;
            font-size: 20px;
            padding-left: 19px;
            box-sizing: border-box;
          }
          &:last-child {
            display: inline-block;
            max-width: 48%;
            height: 100%;
            padding: 0px 10px;
            border-top-right-radius: 10px;
            text-align: right;
            box-sizing: border-box;
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
          padding: 27px 30px 30px;
          font-size: 24px;
          font-weight: 600;
          color: #0062a9;
          text-align: center;
          i.ele-camera {
            display: block;
            width: 33px;
            height: 30px;
            padding: 2px;
            border: 1px solid rgba(0, 99, 167, 1);
            border-radius: 6px;
            cursor: pointer;
            background: url(../../../assets/images/elevator/camera.png)
              no-repeat 50% 50%;
            &.active {
              border: none;
              background: url(../../../assets/images/elevator/badcamera.png)
                no-repeat 50% 50%;
            }
            &.graying {
              border: none;
              background: url(../../../assets/images/elevator/grayCamera.png)
                no-repeat 50% 50%;
              cursor: not-allowed;
            }
          }
          .ele-floor {
            width: 100%;
            margin-top: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            .up-arrow,
            .down-arrow {
              display: block;
              width: 43px;
              height: 43px;
              border-radius: 43px;
              color: #fff;
              background-color: #e2e2e2;
              position: relative;
              // border: 1px solid #ccc;
              &.active {
                background-color: #2bb0ff;
              }
            }
            .up-arrow {
              i {
                font-size: 23px;
                position: absolute;
                top: -5px;
                left: 10px;
              }
            }
            .down-arrow {
              i {
                font-size: 23px;
                position: absolute;
                bottom: -7px;
                left: 10px;
              }
            }
            .floor-num {
              margin: 15px 0px;
              text-align: center;
              height: 40px;
            }
          }
        }
        .ele-info {
          width: calc(100% - 110px);
          height: 100%;
          box-sizing: border-box;
          padding: 10px 10px 15px;
          img {
            width: 100%;
            height: 100%;
          }
          //   background-color: pink;
        }
      }
      .ele-detail-info {
        position: fixed;
        padding: 10px;
        border-radius: 6px;
        display: none;
        background-color: #fff;
        z-index: 10;
        p {
          line-height: 20px;
          &:first-child {
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>


