<template>
  <div class="repair-bill u-layout-container">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">搜索：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="billNumber" placeholder="工单号/故障描述" clearable></el-input>
              </div>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">设备名称：</p>
            <TreeSelect
              v-model="deviceIdAndTypeId"
              placeholder="请选择"
              :clearable="true"
              :data="treeData"
              :defaultProps="defaultProps"
              :onlyLeafSelect="true"
            ></TreeSelect>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">故障类型：</p>
            <el-select v-model="faultType" placeholder="请选择故障类型" clearable>
              <el-option
                v-for="(item,index) in faultTypeOptions"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">工单状态：</p>
            <div class="input-container" style="width:170px;">
              <div style="border-radius: 2px;" class="item select-input">
                <mult-select v-model="status" :options="statusOptions"></mult-select>
              </div>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <date-pick v-model="checkTime" title="时间"></date-pick>
          </div>
          <div class="title-input-group u-title-input-group">
            <el-button
              type="primary"
              icon="el-icon-search"
              round
              :loading="btnLoading"
              @click="getItemList"
            >查询</el-button>
          </div>
        </div>
      </div>
      <div class="u-layout-right-item">
        <el-button
          v-if="pageBtns.some(val=>val=='add')"
          type="primary"
          icon="el-icon-plus"
          @click="showAdd=true"
        >新增</el-button>
      </div>
    </div>
    <div class="datatable-box">
      <el-table :data="tableData" :height="tableHeight" border style="width: 100%" ref="table">
        <el-table-column type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
        <el-table-column prop="billNumber" label="工单号" align="center" width="180"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称">
          <template slot-scope="scope">
            <span class="two-text-ellipse" :title="scope.row.deviceName">{{scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="faultTypeStr" label="故障类型"></el-table-column>
        <el-table-column prop="sourceStr" label="报修来源" align="center"></el-table-column>
        <el-table-column prop="faultDesc" label="故障描述">
          <template slot-scope="scope">
            <span class="two-text-ellipse" :title="scope.row.faultDesc">{{scope.row.faultDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否紧急" align="center">
          <template slot-scope="scope">{{isUrgency[scope.row.urgent]}}</template>
        </el-table-column>
        <el-table-column prop="repairTimeStr" label="报修时间" align="center"></el-table-column>
        <el-table-column prop="expectTimeStr" label="预期时间" align="center"></el-table-column>
        <el-table-column prop="repairUserName" label="指派人" align="center"></el-table-column>
        <el-table-column label="处理状态" align="center">
          <template slot-scope="scope">{{ scope.row.statusStr }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <div class="opration-btn">
              <el-button
                v-if="showBtn('detail')"
                @click="detailClick(scope.row)"
                type="text"
                size="small"
              >详情</el-button>
              <el-button
                v-if="showDispatchingBtn(scope.row)"
                type="text"
                size="small"
                @click="openDispatching(scope.row)"
              >派工</el-button>
              <el-button
                v-if="showTransferBtn(scope.row)"
                type="text"
                size="small"
                @click="openTransfer(scope.row)"
              >转单</el-button>
              <el-button
                v-if="showRevokeBtn(scope.row)"
                type="text"
                size="small"
                @click="cancleClick(scope.row)"
              >撤单</el-button>
              <el-button
                v-if="showWaitingBtn(scope.row)"
                type="text"
                size="small"
                @click="waitingClick(scope.row)"
              >挂单</el-button>
              <el-button
                v-if="showAuditBtn(scope.row)"
                type="text"
                size="small"
                @click="openAudit(scope.row)"
              >{{getAuditText(scope.row)}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pager :pager="pager" @query="getItemList"></Pager>
    </div>
    <!-- 新增 -->
    <el-dialog
      v-dialogDrag
      title="填写报修单"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showAdd"
      v-if="showAdd"
      width="680px"
    >
      <Add @onHide="hideAddWin" @callBack="getItemList"></Add>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      v-dialogDrag
      title="工单详情"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showDetailWin"
      width="680px"
    >
      <Detail
        v-if="showDetailWin"
        @onHide="hideDetailWin"
        :curBill="curBill"
        @submitDetail="getItemList"
        :showDetailDispatchingBtn="showDetailDispatchingBtn"
      ></Detail>
    </el-dialog>
    <!-- 派工/转单 -->
    <el-dialog
      v-dialogDrag
      :title="dispatchingTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showDispatchingWin"
      width="720px"
    >
      <select-user
        :handleType="handleType"
        :billNumber="curBillNumber"
        @onHide="hideDispatchinglWin"
        @submitForm="submitDispatching"
        :changeTag="changeTag"
        :haveAudit="haveAudit"
      ></select-user>
    </el-dialog>
    <!-- 审核 -->
    <el-dialog
      v-if="showAuditWin"
      v-dialogDrag
      :title="auditTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showAuditWin"
      width="380px"
    >
      <Audit
        @onHide="hideAuditWin"
        @submitForm="submitAudit"
        :msg="curCheckMsg"
        :msgLabel="msgLabel"
      ></Audit>
    </el-dialog>
    <!-- 挂单/撤单 -->
    <el-dialog
      v-if="showHangOrCancle"
      v-dialogDrag
      :title="hangOrCancleTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showHangOrCancle"
      width="480px"
    >
      <hang-cancle
        :title="hangOrCancleTitle"
        @onHide="showHangOrCancle=false"
        @submitForm="submitHangOrCancle"
      ></hang-cancle>
    </el-dialog>
    <!-- 转单审核 -->
    <el-dialog
      v-dialogDrag
      title="转单审核"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showTransferAuditWin"
      width="720px"
    >
      <select-user-audit
        v-if="showTransferAuditWin"
        @onHide="showTransferAuditWin=false"
        @submitForm="submitTransferAudit"
        :changeTag="changeTag"
        :handleType="2"
        :msg="curCheckMsg"
      ></select-user-audit>
    </el-dialog>
  </div>
</template>

<script>
import datePick from "@/components/timerange/separateTime.vue";
import Pager from '../../../../components/table/Pager'
import Add from './Add';
import Detail from './Detail';
import SelectUser from '../SelectUser';
import Audit from '../Audit.vue';
import SelectUserAudit from './SelectUserAudit';

import { getRepairList, getDeviceTree, revokeRepairBill, repairDispatch, repairTransfer, repairAudit, getCheckMsg, repairSuspend, getRepairFaultType } from '../../../../services/operation';
import { RepairBillStatus, isUrgency, BillStatusEnum } from '../../../../enum/operation-enum';
import TreeSelect from '@/components/treeSelect'
import HangCancle from '../HangOrCancle';
import MultSelect from '@/components/form/MultSelect.vue';
import baseOptions from '@/utils/baseOptions';

export default {
  extends: baseOptions,
  components: {
    datePick,
    Pager,
    Add,
    Detail,
    SelectUser,
    TreeSelect,
    Audit,
    HangCancle,
    MultSelect,
    SelectUserAudit
  },
  data () {
    return {
      handleType: 1,//操作类型
      changeTag: '',//变更标识
      showAdd: false,//显示新增界面
      showDetailWin: false,//显示详情界面
      showDispatchingWin: false,//显示派工页面
      showAuditWin: false,//显示审核页面
      btnLoading: false, // 查询按钮loading状态
      checkTime: '',
      tableHeight: 400,
      isUrgency, //是否紧急
      pager: {
        total: 100,
        pageNum: 1,
        pageSize: 15,
      },
      billNumber: '',//工单号
      deviceIdAndTypeId: '', //设备ID
      status: [-1], //状态
      statusOptions: RepairBillStatus,
      BillStatusEnum,//工单状态枚举
      tableData: [],
      curBill: {},//当前选中工单
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      curCheckMsg: '',//当前审核原因
      hangOrCancleTitle: '',//挂单or撤单
      showHangOrCancle: false,//显示挂单or撤单
      msgLabel: '',//审核弹窗的说明文字
      auditTitle: '',//审核弹窗标题文字
      showTransferAuditWin: false,//显示转单审核页面
      showDetailDispatchingBtn: false,//显示详情页面的派工按钮
      faultType: '',//故障类型
      faultTypeOptions: [],
      dispatchingTitle: '选择执行人员'
    }
  },
  created () {
    this.initDeviceTree();
    getRepairFaultType().then(res => {
      if (res.code == 200) {
        this.faultTypeOptions = res.data.array;
      }
    })
  },
  mounted: function () {
    this.getItemList();
    this.$common.initTableHeight(this);
  },
  computed: {
    //是否有审核权限
    haveAudit () {
      return this.showBtn('audit');
    },
    //只有抓单才传工单号
    curBillNumber () {
      return this.handleType == 2 ? this.curBill.billNumber : '';
    }
  },
  watch: {
    //门店编码
    shopNumber (val) {
      console.log('shopNumber变化了')
      if (val) {
        this.getItemList();
      }
    }
  },
  methods: {
    //--------------------------控制按钮显示权限-------------------------------
    //显示按钮 name:按钮名称
    showBtn (name) {
      return this.pageBtns.some(val => val == name);
    },
    //显示挂单按钮
    showWaitingBtn (row) {
      return this.showBtn('waiting') && row.status == this.BillStatusEnum.waitingOver;
    },
    //是否显示派工按钮
    showDispatchingBtn (row) {
      return this.showBtn('dispatching') && row.status == this.BillStatusEnum.waiting;
    },
    //是否显示撤单按钮
    showRevokeBtn (row) {
      return this.showBtn('cancle') && (row.status == this.BillStatusEnum.waiting || row.status == this.BillStatusEnum.waitingOver || row.status == this.BillStatusEnum.hanging);
    },
    //是否显示转单按钮
    showTransferBtn (row) {
      return this.showBtn('transfer-bill') && (row.status == this.BillStatusEnum.waitingOver || row.status == this.BillStatusEnum.hanging);
    },
    //显示审核按钮
    showAuditBtn (row) {
      return this.showBtn('audit') && (row.status == this.BillStatusEnum.cancelAudit || row.status == this.BillStatusEnum.hangAudit
        || row.status == this.BillStatusEnum.overAudit || row.status == this.BillStatusEnum.transferAudit);
    },
    //获取审核按钮显示文字
    getAuditText (row) {
      if (row.status == this.BillStatusEnum.cancelAudit) {
        return '撤单审核';
      }
      if (row.status == this.BillStatusEnum.hangAudit) {
        return '挂单审核';
      }
      if (row.status == this.BillStatusEnum.overAudit) {
        return '完工审核';
      }
      if (row.status == this.BillStatusEnum.transferAudit) {
        return '转单审核';
      }
    },
    //-------------------------------end---------------------------------------
    //控制loading隐藏和显示
    ctrlLoading (flag) {
      this.btnLoading = flag;
      this.$common.updateLoadingStatus(flag);
    },
    // 查询请求
    getItemList () {
      this.ctrlLoading(true)
      getRepairList({
        pageNum: this.pager.pageNum, pageSize: this.pager.pageSize, shopNumber: this.shopNumber, billNumber: this.billNumber,
        startTime: this.checkTime.start, endTime: this.checkTime.end, deviceIdAndTypeId: this.deviceIdAndTypeId, status: this.status.join(','),
        faultType: this.faultType
      }).then(res => {
        // console.log('res', res)
        this.tableData = res.data.list;
        this.pager.total = res.data.total;
        this.ctrlLoading(false)
      }).catch(error => {
        this.ctrlLoading(false)
      })
      // console.log('查询')
    },
    //详情
    detailClick (row) {
      this.showDetailWin = true;
      this.showDetailDispatchingBtn = this.showDispatchingBtn(row);
      // console.log(row)
      this.curBill = row;
      this.changeTag = this.$common.guid();
    },
    //初始化设备树
    initDeviceTree () {
      getDeviceTree(this.shopNumber).then(res => {
        // console.log('res', res)
        if (res.data.array) {
          this.treeData = res.data.array;
        }
      })
    },
    //挂单 or 撤单 操作
    submitHangOrCancle (data) {
      let item = { billNumber: this.curBill.billNumber, msg: data.reason };
      if (this.hangOrCancleTitle == '撤单') {
        revokeRepairBill(item).then(res => {
          // console.log('res', res);
          if (res.code === 200) {
            this.winCallBack('撤单成功！', this.showHangOrCancle = false);
          }
        })
      } else { //挂单
        repairSuspend(item).then(res => {
          // console.log('res', res);
          if (res.code === 200) {
            this.winCallBack('挂单成功！', this.showHangOrCancle = false);
          }
        })
      }
    },
    //撤单
    cancleClick (row) {
      this.curBill = row;
      this.hangOrCancleTitle = '撤单';
      this.showHangOrCancle = true;
    },
    //挂单
    waitingClick (row) {
      this.curBill = row;
      this.hangOrCancleTitle = '挂单';
      this.showHangOrCancle = true;
    },
    //隐藏添加弹窗
    hideAddWin () {
      this.showAdd = false;
    },
    //隐藏详情弹窗
    hideDetailWin () {
      this.showDetailWin = false;
    },
    //***************派工****************** */
    //打开派工弹窗
    openDispatching (row) {
      // console.log(row);
      this.curBill = row;
      this.showDispatchingWin = true;
      // this.dispatchingTitle = '派工';
      this.changeTag = this.$common.guid();
      this.handleType = 1;
    },
    //弹窗操作之后回调
    winCallBack (msg, closeWin) {
      this.$message({
        message: msg,
        type: 'success',
        duration: this.$baseConfig.messageDuration
      });
      if (closeWin) {
        closeWin();
      }
      this.getItemList();
    },
    //执行派工操作
    submitDispatching (data) {
      let userId = data.user ? data.user.userId : '';
      let item = { billNumber: this.curBill.billNumber, userId: userId };
      console.log('item', item);
      if (this.handleType == 1) {//派工
        repairDispatch(item).then(res => {
          // console.log('res', res);
          if (res.code == 200) {
            this.winCallBack('派工成功！', this.hideDispatchinglWin());
          }
        })
      } else { //转单
        item.msg = data.ruleForm.msg;
        repairTransfer(item).then(res => {
          // console.log('res', res);
          if (res.code == 200) {
            this.winCallBack('转单成功！', this.hideDispatchinglWin());
          }
        })
      }
    },
    //隐藏派工弹窗
    hideDispatchinglWin () {
      this.showDispatchingWin = false;
    },
    //***************转单****************** */
    //打开转单弹窗
    openTransfer (row) {
      this.curBill = row;
      this.changeTag = this.$common.guid();
      this.handleType = 2;
      this.showDispatchingWin = true;
      // this.dispatchingTitle = '转单';
    },
    //***************审核****************** */
    //打开审核弹窗
    openAudit (row) {
      let isTransferAudit = false;//是否是转单审核
      console.log('object :', row.status, BillStatusEnum.hangAudit);
      switch (row.status) {
        case BillStatusEnum.cancelAudit:
          this.msgLabel = '撤单原因';
          this.auditTitle = "撤单审核";
          break;
        case BillStatusEnum.overAudit:
          this.msgLabel = '完工原因';
          this.auditTitle = '完工审核';
          break;
        case BillStatusEnum.transferAudit:
          this.msgLabel = '转单原因';
          this.auditTitle = '转单审核';
          isTransferAudit = true;
          break;
        case BillStatusEnum.hangAudit:
          this.msgLabel = '挂单原因';
          this.auditTitle = '挂单审核'
          break;
        default:
          break;
      }
      getCheckMsg({ billNumber: row.billNumber, billStatus: row.status }).then(res => {
        if (res.code == 200) {
          this.curCheckMsg = res.data;
        }
      })
      this.curBill = row;
      if (isTransferAudit) { //如果是转单审核
        this.showTransferAuditWin = true;
      } else {
        this.showAuditWin = true;
      }
    },
    //关闭审核弹窗
    hideAuditWin () {
      this.showAuditWin = false;
    },
    //提交审核
    submitAudit (data) {
      let item = { userId: '', billNumber: this.curBill.billNumber, checkResult: data.checkResult, rejectInfo: data.rejectInfo };
      if (data.user) {
        item.userId = data.user.userId;
      }
      console.log('object :', data, item);
      repairAudit(item).then(res => {
        // console.log('res', res);
        if (res.code == 200) {
          this.winCallBack('审核成功！', this.hideAuditWin());
        }
      })
    },
    //提交转单审核
    submitTransferAudit (data) {
      let item = { userId: '', billNumber: this.curBill.billNumber, checkResult: data.ruleForm.checkResult, rejectInfo: data.ruleForm.rejectInfo };
      if (data.user) {
        item.userId = data.user.userId;
      }
      repairAudit(item).then(res => {
        if (res.code == 200) {
          this.winCallBack('转单审核成功！', this.showTransferAuditWin = false);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style  lang="scss">
.repair-bill {
  .u-layout-search .TreeSelect {
    .el-input__inner {
      border: 1px solid #c3c9d5;
      // border-radius: 30px !important;
    }
  }
  .el-message-box__status + .el-message-box__message {
    padding-left: 0px;
  }
}
</style>
