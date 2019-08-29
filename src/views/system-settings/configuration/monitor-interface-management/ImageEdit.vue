<template>
  <div class="image-edit" onselectstart="return false">
    <div class="point-list p-abs">
      <div class="point-list-box">
        <p title="点击添加点位" class="item cursor-pointer operate actived" @click="checkTabs()">添加点位</p>
      </div>
    </div>
    <!--图片显示区域 980x640-->
    <div class="img-area p-abs" ref="imgContainer">
      <!--图片层-->
      <div class="img-box">
        <img
          ref="showImg"
          :style="{ width: imgBoxWidth + 'px', height: imgBoxHeight + 'px' }"
          :src="imgInfo.url"
          alt
        />
      </div>
      <!--鼠标操作层-->
      <div
        ref="mouseMark"
        class="mouse-mark p-abs"
        @mousemove="mouseDownAndMove($event)"
        :style="{width: imgBoxWidth + 'px', height: imgBoxHeight + 'px'}"
      >
        <span
          @mousedown="pointMouseDown($event, index)"
          v-for="(item, index) of pointsArr"
          :key="index"
        >
          <a
            class="point"
            :key="index"
            :class="{'finished' : item.finishedStatus}"
            :style="{left: item.x+'px', top: item.y+'px'}"
            @dblclick="pointDblclick(index,$event)"
          ></a>
        </span>
        <!--项目-内容编辑弹窗imgEditConfigInject.type=='project'-->
        <div
          class="content-edit p-abs project"
          :style="{left: editPopupSize.left + 'px', top: editPopupSize.top + 'px'}"
          v-show="showEditPopup"
        >
          <a class="conner p-abs" :style="{}"></a>
          <i title="关闭" @click="closePonit" class="el-icon-close close p-abs"></i>
          <p class="title">参数配置</p>
          <p class="ipt-item">
            <span class="sigle-title">集水井：</span>
            <el-select
              @change="selectChange"
              v-model="currentPointUnitForm.id"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in sumpData"
                :key="item.id"
                :label="item.name"
                :disabled="item.disabled"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
          <p class="ipt-item fl" style="width: 150px">
            <span class="sigle-title">X坐标：</span>
            <span class="locate-text">
              <el-input size="mini" v-model.number="currentPointUnitForm.x" placeholder="X坐标"></el-input>
            </span>
          </p>
          <p class="ipt-item fl">
            <span class="sigle-title">Y坐标：</span>
            <span class="locate-text">
              <el-input size="mini" v-model.number="currentPointUnitForm.y" placeholder="Y坐标"></el-input>
            </span>
          </p>
          <p class="ipt-btn">
            <button class="item delete" @click="deletePoint">删除</button>
            <span class="ipt-space"></span>
            <button class="item save" @click="savePoint">确定</button>
          </p>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="saveImgEdit()">保存</el-button>
        <span class="space"></span>
        <el-button @click="cancel()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
/**图片编辑
 */
import utils from '../../../../utils/utils';
import { getAllSump, saveSumpPosition } from '../../../../services/system-settings'

export default {
  props: {
    imgEditConfig: { type: Object, default: {} }
  },
  components: {
  },
  computed: {
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    }
  },
  data () {
    return {
      sumpData: [], //集水井数据列表
      clickTimeId: null,//按下延时触发
      containerSize: {            //容器可视区域
        width: "",
        height: ""
      },
      imgBoxWidth: '',            //图片容器
      imgBoxHeight: "",
      imgBoxLeft: "",
      imgBoxTop: "",
      //   imgBoxMargin: "auto",
      imgInfo: {
        naturalWidth: "",
        naturalHeight: "",
        width: "",
        height: "",
        currentScale: 1,
        url: "",
        imgObj: null
      },
      //点位
      mouseDown: false,
      //鼠标操作区域位置
      mouseAreaPosition: {
        offsetBodyLeft: 0,
        offsetBodyTop: 0
      },
      mouseDownPoint: null,
      //鼠标移动计算过程缓存值
      pointLeft: 0,
      pointTop: 0,
      pointWidth: 24,
      /**************/
      imgEditConfigInject: null,
      pointsArr: [], //点位数组
      currentPointIndex: 0,
      //点位数据添加模板
      pointUnit: {
        name: "",
        x: "",
        y: "",
        finishedStatus: false       //是否已添加信息并保存
      },
      //点位信息，界面信息详情弹窗表单用
      currentPointUnitForm: {
        id: "",
        x: "",
        y: "",
        finishedStatus: false,      //是否已添加信息并保存
      },
      //弹窗消息
      messageBox: null,
      allowMove: true,  //编辑信息状态不允许拖动
      showEditPopup: false,
      //点位信息编辑弹窗属性
      editPopupSize: {
        width: 350,
        height: 180,
        left: 0,
        top: 0,
      }
    }
  },
  created () {
    this.initData();
    //引入 图片编辑弹窗配置参数
    this.imgEditConfigInject = this.imgEditConfig;
    //初始化默认添加一个点位
    this.addPonit();
  },
  mounted () {
    //获取容器属性
    this.getContainerSize();
    //获取图片属性
    this.getImgInfo(this.imgEditConfigInject.url);
    //绑定全局鼠标弹起事件
    this.addEventMouseup();
  },
  methods: {
    //初始化界面数据
    initData () {
      getAllSump(this.shopNumber).then(res => {
        console.log('res', res);
        this.sumpData = res.data.array;
        this.initPointInfo();//初始化点位

        console.log('前0.sumpData', this.sumpData, this.pointsArr);
        // 并集
        this.pointsArr.forEach(n => {
          let res = this.sumpData.find(f => { return f.id == n.id });
          console.log('object :', res);
          if (res == undefined) {
            this.sumpData.push({ disabled: false, id: n.id, name: n.name });
          }
        })
        console.log('后0.sumpData', this.sumpData)

        this.updateSumpData();
      })
    },
    //更新集水井数据状态
    updateSumpData () {
      let _sumpData = this.sumpData.map(n => {
        let disabled = this.pointsArr.some(s => s.id == n.id) ? true : false;
        return { id: n.id, name: n.name, disabled: disabled };
      });
      this.sumpData = _sumpData;
      //更新点位的完成状态
      this.pointsArr.forEach(n => {
        n.finishedStatus = n.id && n.x && n.y;
      })
    },
    //初始化点位
    initPointInfo () {
      let pointsArr = this.imgEditConfigInject.pointsArr;
      this.pointsArr = pointsArr.map(n => {
        return {
          x: n.x * this.imgInfo.currentScale,
          y: n.y * this.imgInfo.currentScale,
          id: n.id,
          name: n.name
        }
      });
      console.log('pointsArr', pointsArr, this.pointsArr)
    },
    selectChange () {
      console.log('selectChange')
      this.updateSumpData();
    },
    //获取图片信息
    getImgInfo (imgUrl) {
      this.imgInfo.imgObj = new Image();
      this.imgInfo.imgObj.onload = this.imgOnload;
      this.imgInfo.imgObj.onerror = (e) => {
        console.error("图片加载失败", e);
      }
      this.imgInfo.imgObj.src = imgUrl;
    },
    //图片加载成功
    imgOnload (e) {
      console.log("图片加载成功", e);
      this.imgInfo.naturalHeight = e.path[0].naturalHeight;
      this.imgInfo.naturalWidth = e.path[0].naturalWidth;
      //计算比例
      this.countImgScale();
      //设置界面显示图片
      this.imgInfo.url = this.imgEditConfigInject.url;
      //计算 mouseMark 区域的相对位置
      this.$nextTick(() => {
        this.getMouseMarkOffsetBody(this.$refs.mouseMark);
      })
    },
    //获取容器实际大小
    getContainerSize () {
      this.containerSize.width = this.$refs.imgContainer.offsetWidth;
      this.containerSize.height = this.$refs.imgContainer.offsetHeight;
      console.log('this.containerSize', this.containerSize.width, this.containerSize.height);
    },
    //计算实际显示尺寸及比例
    countImgScale () {
      console.log(this.containerSize);
      console.log(this.imgInfo);
      let widthScale = this.containerSize.width / this.imgInfo.naturalWidth,
        heightScale = this.containerSize.height / this.imgInfo.naturalHeight;

      var scale = widthScale; //缩放比例

      if (widthScale > heightScale) {  //宽缩放度大于高，高度铺满，按高进行缩放
        //height 100%
        // this.imgBoxTop = 0;
        this.imgInfo.height = this.containerSize.height;
        //缩放比例宽
        this.imgInfo.width = this.imgInfo.width * heightScale;
        scale = heightScale;
        this.imgBoxLeft = (this.containerSize.width - this.imgInfo.width) / 2;
      } else if (widthScale < heightScale) { //高缩放度大于宽，按宽进行缩放
        //width 100%
        // this.imgBoxTop = (this.containerSize.height - this.imgInfo.height) / 2;
        this.imgInfo.width = this.containerSize.width;
        this.imgInfo.height = this.imgInfo.height * widthScale;
      } else {
        this.imgInfo.width = this.containerSize.width;
        this.imgInfo.height = this.containerSize.height;
      }
      //使用定位计算，取消margin自动计算
      // this.imgBoxMargin = 0;
      //设置图片及图片容器大小
      //减小取舍误差 减去边框 2
      this.imgBoxWidth = this.imgInfo.width - 2;
      this.imgBoxHeight = this.imgInfo.height - 2;
      //图片自身的显示比例
      this.imgInfo.currentScale = scale;
      console.log('缩放比例', scale)
      this.$nextTick(() => {
        //图片显示完成 防止闪屏
        this.$refs.imgContainer.style.opacity = 1;
      })
    },
    //计算 mouseMark 区域的相对位置
    getMouseMarkOffsetBody (target) {
      while (target) {
        this.mouseAreaPosition.offsetBodyLeft += target.offsetLeft;
        this.mouseAreaPosition.offsetBodyTop += target.offsetTop;
        target = target.offsetParent;
      }
      console.log('区域的相对位置', target, this.mouseAreaPosition)
    },
    //点位按下
    pointMouseDown (event, index) {
      let This = this;
      // 取消上次延时未执行的方法
      clearTimeout(This.clickTimeId);
      //执行延时
      This.clickTimeId = setTimeout(function () {
        //此处为鼠标按下事件要执行的代码
        console.log("鼠标按下");
        //正在编辑 终止移动
        // if(!this.allowMove) return;
        This.currentPointIndex = index;
        This.mouseDown = true;
        This.mouseDownPoint = event.target;
      }, 250);
    },
    pointMouseUp (e) {
      if (this.mouseDown) {
        e.preventDefault();
        // console.log("鼠标弹起",e.clientX,e.clientY);
        this.mouseDown = false;
        this.mouseDownPoint = null;
      }
    },
    //点位双击
    pointDblclick (index, event) {
      //显示编辑弹窗，禁止移动
      this.showEditPopup = true;
      this.currentPointIndex = index;
      // 取消上次延时未执行的方法
      clearTimeout(this.clickTimeId);
      // console.log("鼠标双击");
      if (event) {
        event.stopPropagation();
      }
      //切换对应数据
      this.changePointData(index);
      //计算编辑弹窗的位置
      this.countEditPopupLocate();
      //正在编辑 终止移动
      this.allowMove = false;
    },
    addEventMouseup () {
      document.body.addEventListener("mouseup", this.pointMouseUp)
    },
    //点位按下并移动
    mouseDownAndMove (event) {
      if (this.mouseDown) {
        console.log('鼠标按下', this.mouseAreaPosition, event, event.clientX)
        this.pointLeft = (event.clientX - this.mouseAreaPosition.offsetBodyLeft - this.pointWidth / 2);
        this.pointTop = (event.clientY - this.mouseAreaPosition.offsetBodyTop - this.pointWidth / 2);
        //存储坐标
        this.pointsArr[this.currentPointIndex].x = this.pointLeft;
        this.pointsArr[this.currentPointIndex].y = this.pointTop;

        //输出测试
        console.log("相对图片X:", event.clientX, event.clientY, this.pointLeft, this.pointTop);
      }
    },
    //添加点位按钮
    checkTabs () {
      //判断是否存在未编辑的点位
      let index = this.checkNotSavePonit();
      if (index !== null) {
        //this.messageInfo({message: "存在未添加信息的点位(灰色)，请双击编辑", duration: 3000});
        //切换到对应未添加信息的点位
        this.pointDblclick(index);
        return;
      }
      //添加对应点位
      this.addPonit();
    },
    //判断是否存在未编辑的点位
    checkNotSavePonit () {
      for (let i = 0, len = this.pointsArr.length; i < len; i++) {
        if (!this.pointsArr[i].finishedStatus) {
          return i;
        }
      }
      return null;
    },
    //添加点位
    addPonit () {
      this.pointsArr.push(utils.deepCopy(this.pointUnit));
    },
    //删除点位
    deletePoint () {
      if (this.pointsArr[this.currentPointIndex]) {
        this.pointsArr.splice(this.currentPointIndex, 1);
        this.updateSumpData();
        //关闭
        this.closePonit();
      }
    },
    //计算编辑弹窗的位置
    countEditPopupLocate () {
      console.log('计算编辑弹窗的位置')
      let currentPonit = this.pointsArr[this.currentPointIndex];
      //剩余高度空间
      let residualHeight = this.containerSize.height - currentPonit.y; //this.imgBoxTop;
      //剩余宽度空间
      let residualWidth = this.containerSize.width - currentPonit.x;//this.imgBoxLeft;
      //上下
      if ((residualHeight - this.pointWidth / 2) > this.editPopupSize.height) {
        //高度足，显示在点位下方
        this.editPopupSize.top = currentPonit.y + this.pointWidth;
      } else {
        //高度不足，显示在点位上方
        this.editPopupSize.top = currentPonit.y - this.editPopupSize.height;
      }

      //左右
      if ((residualWidth - this.pointWidth / 2) > this.editPopupSize.width) {
        //右侧
        this.editPopupSize.left = currentPonit.x + this.pointWidth;
      } else {
        //左侧
        this.editPopupSize.left =
          currentPonit.x - this.editPopupSize.width;
      }
    },
    //计算编辑弹窗的位置
    countEditPopupLocateInit () {
      let currentPonit = this.pointsArr[this.currentPointIndex];
      //上下
      this.editPopupSize.top = currentPonit.y
      //左右
      this.editPopupSize.left = currentPonit.x
    },
    //切换对应的点位数据
    changePointData (index) {
      this.currentPointUnitForm = utils.deepCopy(this.pointsArr[index]);
      console.log('展示的坐标：', this.currentPointUnitForm, this.imgInfo.currentScale);
    },
    //保存点位编辑结果
    savePoint () {
      this.pointsArr[this.currentPointIndex] = this.currentPointUnitForm;
      console.log('savePoint保存的坐标', this.currentPointUnitForm)
      let x = this.currentPointUnitForm.x;
      let y = this.currentPointUnitForm.y;
      if (x < 0 || x > 980) {
        this.$message({
          message: 'x轴范围必须介于0~980之间',
          type: 'error',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      if (y < 0 || y > 640) {
        this.$message({
          message: 'y轴范围必须介于0~640之间',
          type: 'error',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      this.updateSumpData();
      //关闭
      this.closePonit();
    },
    //关闭点位信息编辑
    closePonit () {
      //关闭编辑弹窗
      this.showEditPopup = false;
      //允许拖动
      this.allowMove = true;
    },
    //取消图片编辑
    cancel () {
      this.closePopup();
    },
    //关闭图片编辑
    closePopup () {
      event.stopPropagation && event.stopPropagation();
      this.$emit("onHide")
    },
    //保存图片编辑
    saveImgEdit () {
      let data = {
        originUrl: this.imgEditConfig.originUrl,
        sumpList: this.pointsArr.map(n => {
          return { x: n.x / this.imgInfo.currentScale, y: n.y / this.imgInfo.currentScale, id: n.id }
        })
      };
      console.log('data', data);
      saveSumpPosition(data).then(res => {
        // console.log('res', res);
        if (res.code == 200) {
          this.$message({
            message: '保存成功！',
            type: 'success',
            duration: this.$baseConfig.messageDuration
          });
          //关闭
          this.closePopup();
        }
      })
    },
    //消息弹窗
    messageInfo (config) {
      if (!config.message) return;
      this.messageBox && this.messageBox.close();
      this.messageBox = this.$message({
        type: config.type || "error",
        message: config.message,
        duration: config.duration || 3000
      })
    },
  },
  beforeDestroy () {
    this.imgInfo = null;
    //解绑鼠标弹起事件
    document.body.removeEventListener("mouseup", this.pointMouseUp);
  }
}
</script>
<style lang="scss">
.image-edit {
  .mouse-mark {
    .content-edit.project {
      width: 350px !important;
      height: 180px !important;
    }
  }
  .el-checkbox__label {
    color: white !important;
    margin-right: 10px;
  }
}
</style>
<style scoped lang="scss">
.el-dialog .dialog-footer {
  bottom: 20px;
  width: 100%;
  left: 0px;
  position: absolute;
}
.el-dialog .el-dialog__body {
  padding: 20px 30px 40px 30px;
}
.image-edit .mouse-mark .content-edit .title {
  width: 100%;
}
.image-edit {
  width: 100%;
  height: 660px;
  background: #fff;
  margin: auto;
  .row {
    height: 30px;
    line-height: 30px;
  }
  .image-edit-title {
    background: #1881bf;
    height: 40px;
    line-height: 40px;
    padding: 0 0 0 30px;
    color: #fff;

    .image-edit-close {
      float: right;
      margin: 12px;
      cursor: pointer;
    }
  }
  .point-list,
  .img-area {
    top: 40px;
    bottom: 50px;
    height: 640px;
  }
  .point-list {
    padding: 10px;
    left: 0;
    width: 140px;
    box-sizing: border-box;
    background: #f7f7f7;
    position: absolute;

    .point-list-box {
      background: #f7fbfc;
      border: 1px solid #e4e7ef;
      border-radius: 3px;
    }

    .item {
      text-align: center;
      width: 120px;
      height: 36px;
      line-height: 36px;
      color: #515151;
    }

    .tabs-title {
      background: #1881bf;
      color: #fff;
    }

    .operate.actived,
    .operate:hover {
      color: #fff;
      background: #4eb9db;
    }
  }

  .img-area {
    left: 140px;
    right: 0;
    position: absolute;
  }

  .footer-btn {
    left: 0;
    right: 0;
    bottom: 0;
    height: 50px;
    text-align: center;
    padding: 10px 0;
    background: #f7f7f7;
    box-sizing: border-box;

    .space {
      padding: 0 20px;
    }
  }

  .img-box,
  .mouse-mark {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    // margin: auto;
    border: 1px dotted #ff3333;
  }
  .img-box {
    z-index: 1;
    opacity: 0.5;
  }
  .mouse-mark {
    z-index: 2;

    .point {
      position: absolute;
      left: 0;
      top: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      background: url('../../../../assets/images/common/img-edit-energy-gray.png')
        no-repeat;
      background-size: 100% 100%;
    }

    .point.finished {
      background: url('../../../../assets/images/common/img-edit-energy.png')
        no-repeat;
      background-size: 100% 100%;
    }

    .content-edit {
      width: 240px;
      height: 360px;
      background: rgba(35, 46, 52, 0.8);
      /*border-radius: 3px;*/
      top: 20px;
      left: 20px;

      .close {
        right: 10px;
        top: 12px;
        color: #fff;
        cursor: pointer;
      }

      .conner {
        border: 14px solid transparent;
      }

      .title {
        font-size: 16px;
        line-height: 40px;
        color: #fff;
        height: 40px;
        text-align: center;
        border-bottom: 1px solid #9c9c9c;
        margin-bottom: 10px;
      }

      .ipt-item {
        height: 24px;
        line-height: 24px;
        padding: 5px 10px;
        padding-left: 15px;
      }

      .ipt-btn {
        padding: 20px;
        text-align: center;
        line-height: 56px;

        .item {
          width: 80px;
          height: 24px;
          line-height: 24px;
          border-radius: 2px;
          color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
        }
        .ipt-space {
          padding: 0 15px;
        }
        .save {
          border: 0;
          background: #0098f9;
        }

        .delete {
          border: 1px solid rgba(255, 255, 255, 0.9);
          background: none;
        }
      }

      .sigle-ipt,
      .dobule-ipt {
        height: 24px;
        font-size: 16px;
        line-height: 24px;
        background: rgba(161, 189, 208, 0.23);
        border: 1px solid #9c9c9c;
        padding: 0 5px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
      }

      .sigle-title,
      .dobule-title,
      .connect-line {
        color: rgba(255, 255, 255, 0.9);
      }

      .sigle-ipt {
        width: 140px;
      }

      .sigle-title {
        width: 60px;
        display: inline-block;
      }

      .dobule-ipt {
        width: 40px;
      }
      .dobule-title {
        display: inline-block;
        width: 84px;
      }

      /*坐标文本*/
      .locate-text {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 80px;
        display: inline-flex;
      }
    }
  }
}
</style>
