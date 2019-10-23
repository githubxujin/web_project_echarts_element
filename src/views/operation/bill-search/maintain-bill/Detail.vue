<template>
  <div class="maintain-detail" v-loading="dialogLoading">
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
              <div>工单信息：</div>
            </el-col>
            <el-col :span="20">
              <div>{{curBill.billNumber}} 【{{curBill.statusStr}}】</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>工单名称：</div>
            </el-col>
            <el-col :span="20">
              <div>{{curBill.billName}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>保养周期：</div>
            </el-col>
            <el-col :span="20">
              <div>{{billDetail.cycleTimeStr}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>保养设备：</div>
            </el-col>
            <el-col :span="20">
              <div>{{billDetail.deviceNames}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>开始时间：</div>
            </el-col>
            <el-col :span="20">
              <div>{{curBill.startTimeStr}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div>截止时间：</div>
            </el-col>
            <el-col :span="20">
              <div>{{curBill.endTimeStr}}</div>
            </el-col>
          </el-row>
          <!-- 已接单 -->
          <div v-if="billDetail.status!=MaintainBillStatusEnum.waiting">
            <el-row>
              <el-col :span="4">
                <div>执行人：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.maintainUserName}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div>联系电话：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.maintainUserPhone}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div>所在单位：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.maintainUserDepartName}}</div>
              </el-col>
            </el-row>
            <el-row
              v-if="billDetail.status==MaintainBillStatusEnum.waitAppraise||billDetail.status==MaintainBillStatusEnum.closed"
            >
              <el-col :span="4">
                <div>完成时间：</div>
              </el-col>
              <el-col :span="20">
                <div>{{billDetail.finishTimeStr}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div>完工说明：</div>
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
          <el-row>
            <el-col :span="24">
              <h4>保养信息</h4>
            </el-col>
          </el-row>
          <div class="datatable-box">
            <el-table :data="billDetail.maintainParams" height="200" border style="width: 100%">
              <el-table-column prop="deviceName" label="设备名称"></el-table-column>
              <el-table-column prop="location" label="位置"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <span class="u-link" @click="lookMaintainParam(scope.row)">查看保养参数</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 已关闭 -->
          <div v-if="billDetail.status==MaintainBillStatusEnum.closed">
            <el-row>
              <el-col :span="4">
                <div>评分：</div>
              </el-col>
              <el-col :span="20">
                <div class="detail-rate">
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
        <el-button type="primary" v-if="showDetailAppraiseAuditBtn" @click="openAppraiseAudit">审核评价</el-button>
        <el-button type="primary" v-if="showDetailDispatchingBtn" @click="openDispatching">派 工</el-button>
        <!-- <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button> -->
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
    <!-- 参数列表 -->
    <el-dialog
      v-dialogDrag
      title="参数列表"
      append-to-body
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showParamWin"
      width="780px"
    >
      <params-list
        v-if="showParamWin"
        title="保养"
        @onHide="showParamWin=false"
        :billNumber="curBill.billNumber"
        :deviceId="curDeviceId"
      ></params-list>
    </el-dialog>
    <!-- 派工 -->
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
        :handleType="1"
        @onHide="hideDispatchinglWin"
        @submitForm="submitDispatching"
        :changeTag="changeTag"
      ></select-user>
    </el-dialog>
    <!-- 评价审核 -->
    <el-dialog
      v-dialogDrag
      title="评价审核"
      append-to-body
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showAppraiseAuditWin"
      width="380px"
    >
      <appraise-audit
        v-if="showAppraiseAuditWin"
        @onHide="showAppraiseAuditWin = false"
        @submitForm="submitAppraiseAudit"
        :id="curBill.id"
      ></appraise-audit>
    </el-dialog>
  </div>
</template>

<script>
import { getMaintainBillInfo, maintainDispatch, maintainAudit } from '@/services/operation';
import { MaintainBillStatusEnum, BillSource } from '@/enum/operation-enum';
import ParamsList from '../ParamsList';
import SelectUser from '../SelectUser';
import AppraiseAudit from './AppraiseAudit';

export default {
  components: {
    ParamsList,
    SelectUser,
    AppraiseAudit
  },
  props: {
    curBill: {
      type: Object,
      default: {}
    },
    //显示派工按钮
    showDetailDispatchingBtn: {
      type: Boolean,
      default: true
    },
    //显示审核评价按钮
    showDetailAppraiseAuditBtn: {
      type: Boolean,
      default: true
    },
  },
  data () {
    return {
      dialogLoading: false,
      MaintainBillStatusEnum,
      BillSource,
      billDetail: { address: '' },
      overImgs: [],//巡检完工图片
      paramTitle: '',
      curDeviceId: '',
      showParamWin: false,
      showAppraiseAuditWin: false,//显示评价审核弹窗
      showDispatchingWin: false,//显示派工页面
      changeTag: '',//变更标识
    }
  },
  created () {
    this.initData();
  },
  computed: {
    //流程状态
    curActiveStatus () {
      let res = 0;
      if (this.curBill.status == this.MaintainBillStatusEnum.waiting) {
        res = 0;
      } else if (this.curBill.status == this.MaintainBillStatusEnum.closed || this.curBill.status == this.MaintainBillStatusEnum.canceled) {
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
      getMaintainBillInfo(this.curBill.id).then(res => {
        // console.log('res', res)
        if (res.data) {
          this.billDetail = res.data;
          this.overImgs = res.data.billImages;
          this.ruleForm.score = res.data.score;
        }
        this.dialogLoading = false;
      }).catch(error => {
        this.dialogLoading = false;
      })
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
    //查看保养参数
    lookMaintainParam (row) {
      console.log(row);
      this.paramTitle = row.paraName + '-保养参数详情';
      this.curDeviceId = row.deviceId;
      this.showParamWin = true;
    },
    //***************派工****************** */
    //打开派工弹窗
    openDispatching () {
      // console.log(row);
      this.showDispatchingWin = true;
      this.changeTag = this.$common.guid();
    },
    //执行派工操作
    submitDispatching (data) {
      let item = { billNumber: this.curBill.billNumber, userId: data.user.userId };
      maintainDispatch(item).then(res => {
        //console.log('res', res);
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
    //打开评价审核弹窗
    openAppraiseAudit () {
      this.showAppraiseAuditWin = true;
    },
    //提交评价审核
    submitAppraiseAudit (data) {
      let item = { billNumber: this.curBill.billNumber, checkResult: data.checkResult, rejectInfo: data.rejectInfo, appraiseInfo: data.appraiseInfo, score: data.score };
      maintainAudit(item).then(res => {
        if (res.code == 200) {
          this.$common.winCallBack(this, '评价成功！', () => { this.showAppraiseAuditWin = false; });
          this.isHide();
          this.$emit("submitDetail");
        }
      })
    }
  }
}
</script>
<style lang="scss">
.maintain-detail {
  .el-timeline {
    padding-left: 4px;
    padding-top: 5px;
  }
}
</style>

<style lang="scss" scoped>
@import url('../../scss/private.scss');
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
  height: 480px;
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
/deep/ .el-form-item--small .el-form-item__content {
  line-height: 40px;
}
.detail-rate {
  /deep/ .el-rate__icon {
  }
}
</style>