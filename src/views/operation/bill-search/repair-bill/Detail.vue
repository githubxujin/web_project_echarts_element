<template>
  <div class="repair-detail" v-loading="dialogLoading">
    <el-steps :space="320" align-center :active="curActiveStatus" finish-status="success">
      <el-step title="待派工"></el-step>
      <el-step title="处理中"></el-step>
      <el-step title="已关闭"></el-step>
    </el-steps>
    <div class="main-body">
      <el-tabs>
        <el-tab-pane label="工单信息">
          <el-row>
            <el-col :span="4">
              <div>工单号：</div>
            </el-col>
            <el-col :span="20">
              <div>{{curBill.billNumber}} 【{{curBill.statusStr}}】</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>设备名称：</div>
            </el-col>
            <el-col :span="20">
              <div>{{billDetail.deviceName}}</div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">
              <div>故障类型：</div>
            </el-col>
            <el-col :span="20">
              <div>{{billDetail.faultTypeStr}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>故障描述：</div>
            </el-col>
            <el-col :span="20">
              <div>{{billDetail.faultDesc}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>报修来源：</div>
            </el-col>
            <el-col :span="20">
              <div>{{curBill.sourceStr}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>联系电话：</div>
            </el-col>
            <el-col :span="20">
              <div>{{billDetail.phone}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>位置：</div>
            </el-col>
            <el-col :span="20">
              <div>{{billDetail.address}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>报修时间：</div>
            </el-col>
            <el-col :span="20">
              <div>{{curBill.repairTimeStr}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>现场图片：</div>
            </el-col>
            <el-col :span="20">
              <viewer :images="repiarImgs" class="img-viewer">
                <!-- //一定要一个数组，否则报错 -->
                <img v-for="(img,index) in repiarImgs" :src="img.pictureUrl" :key="index" />
              </viewer>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>备注：</div>
            </el-col>
            <el-col :span="20">
              <div>{{billDetail.memo}}</div>
            </el-col>
          </el-row>
          <!-- 完工 -->
          <div v-if="billDetail.status!=BillStatusEnum.waiting">
            <el-row>
              <el-col :span="24">完成情况</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div>维修人员：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.repairUserName}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div>联系电话：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.repairUserPhone}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div>所属部门：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.repairUserDepartName}}</div>
              </el-col>
            </el-row>
            <el-row
              v-if="billDetail.status==BillStatusEnum.waitAppraise||billDetail.status==BillStatusEnum.closed"
            >
              <el-col :span="4">
                <div>完成时间：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.repairFinishTime}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div>维修说明：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.result}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div>现场图片：</div>
              </el-col>
              <el-col :span="20">
                <viewer :images="overImgs" class="img-viewer">
                  <!-- //一定要一个数组，否则报错 -->
                  <img v-for="(img,index) in overImgs" :src="img.pictureUrl" :key="index" />
                </viewer>
              </el-col>
            </el-row>
          </div>
          <!-- 已关闭 -->
          <div v-if="billDetail.source==BillSource.WX&&billDetail.status==BillStatusEnum.closed">
            <el-row>
              <el-col :span="4">
                <div>评分：</div>
              </el-col>
              <el-col :span="20">
                <div>
                  <el-rate v-model="billDetail.score" disabled show-score></el-rate>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div>评价：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.appraise}}</div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="跟踪记录">
          <div class="block">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in billDetail.operationList"
                :key="index"
                :type="curBill.status==9?'primary':''"
                :color="(index+1)==billDetail.operationList.length?'#0bbd87':''"
                size="large"
                :timestamp="activity.createTime"
              >{{activity.name}} {{activity.message}} {{activity.memo?'---'+activity.memo:''}}</el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" v-if="showDetailDispatchingBtn" @click="openDispatching">派 工</el-button>
        <!-- <el-button type="primary" @click="isHide">关 闭</el-button> &&billDetail.status==BillStatusEnum.waiting-->
        <el-button @click="isHide">关 闭</el-button>
      </div>
    </div>
    <!-- 派工/转单 -->
    <el-dialog
      v-dialogDrag
      title="选择执行人员"
      append-to-body
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showDispatchingWin"
      width="720px"
    >
      <select-user
        :handleType="handleType"
        @onHide="hideDispatchinglWin"
        @submitForm="submitDispatching"
        :changeTag="changeTag"
      ></select-user>
    </el-dialog>
  </div>
</template>

<script>
import { getRepairBill, repairDispatch } from '../../../../services/operation';
import { BillStatusEnum, BillSource } from '../../../../enum/operation-enum';
import SelectUser from '../SelectUser';

export default {
  components: {
    SelectUser
  },
  props: {
    curBill: {
      type: Object,
      default: {}
    },
    showDetailDispatchingBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dialogLoading: false,
      BillStatusEnum,
      BillSource,
      billDetail: { address: '' },
      repiarImgs: [],//报修工单图片
      overImgs: [],//完工工单图片
      handleType: 1,//1：派工
      showDispatchingWin: false,//显示派工页面
      changeTag: ''
    }
  },
  created () {
    this.initData();
  },
  computed: {
    //流程状态
    curActiveStatus () {
      let res = 0;
      if (this.curBill.status == this.BillStatusEnum.waiting) {
        res = 0;
      } else if (this.curBill.status == this.BillStatusEnum.closed) {
        res = 2;
      } else {
        res = 1;
      }
      // console.log('状态', this.curBill.status, res)
      return res;
    }
  },
  methods: {
    initData () {
      this.dialogLoading = true;
      getRepairBill(this.curBill.id).then(res => {
        console.log('res', res)
        if (res.data) {
          this.billDetail = res.data;
          this.repiarImgs = this.getCurImgs(res.data.repairBillImages, 0);
          this.overImgs = this.getCurImgs(res.data.repairBillImages, 1);
        }
        this.dialogLoading = false;
      }).catch(error => {
        this.dialogLoading = false;
      })
    },
    //获取图片（0：维修，1：完工）
    getCurImgs (imgs, tag) {
      return (imgs && imgs.length > 0) ? imgs.filter(n => n.imgType == tag) : [];
    },
    //关闭
    isHide () {
      this.$emit("onHide");
    },
    //打开派工弹窗
    openDispatching () {
      // console.log(row);
      this.showDispatchingWin = true;
      this.changeTag = this.$common.guid();
    },
    //执行派工操作
    submitDispatching (data) {
      let item = { billNumber: this.curBill.billNumber, userId: data.user.id };
      repairDispatch(item).then(res => {
        // console.log('res', res);
        if (res.code == 200) {
          this.$common.winCallBack(this, '派工成功！', this.hideDispatchinglWin());
          this.isHide();
          this.$emit("submitDetail");
        }
      })
    },
    //隐藏派工弹窗
    hideDispatchinglWin () {
      this.showDispatchingWin = false;
    },
  }
}
</script>
<style lang="scss" scoped>
.repair-detail {
  .el-timeline {
    padding-left: 4px;
    padding-top: 5px;
  }
}
</style>

<style lang="scss" scoped>
/deep/ .el-rate {
  height: 40px;
  line-height: 40px;
}
/deep/ .el-rate__item {
  line-height: 40px;
}
/deep/ .el-step.is-horizontal .el-step__line {
  top: 18px;
}
/deep/ .el-dialog__body {
  padding-top: 10px;
}
.img-viewer {
  img {
    width: 100px;
    height: 100px;
    float: left;
  }
}
/deep/ .el-tabs__content {
  height: 500px;
  overflow-y: auto;
}
/deep/ .el-tabs__nav-scroll {
  padding-left: 0px !important;
}
/deep/ .el-tabs__content {
  padding-top: 0px;
  margin-top: 0px;
}
/deep/ .el-tabs__header {
  margin: 0px;
}
/deep/ .el-form-item--small .el-form-item__label {
  line-height: 40px;
}
</style>