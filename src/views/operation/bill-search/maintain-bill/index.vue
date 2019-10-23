<template>
  <div class="maintain-bill u-layout-container">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">搜索：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="billNumber" placeholder="工单号/工单名称" clearable></el-input>
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
            <p class="text">工单状态：</p>
            <div class="input-container" style="width:170px;">
              <div style="border-radius: 2px;" class="item select-input">
                <mult-select v-model="status" :options="statusOptions"></mult-select>
              </div>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <date-pick v-model="maintainTime" title="时间"></date-pick>
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
    </div>
    <div class="datatable-box">
      <el-table :data="tableData" :height="tableHeight" border style="width: 100%" ref="table">
        <el-table-column type="index" label="序号" :index="indexMethod" width="50"></el-table-column>
        <el-table-column prop="billNumber" label="工单号" align="center"></el-table-column>
        <el-table-column prop="billName" label="工单名称" align="center"></el-table-column>
        <el-table-column prop="deviceNames" label="设备名称">
          <template slot-scope="scope">
            <span class="two-text-ellipse" :title="scope.row.deviceNames">{{scope.row.deviceNames}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTimeStr" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="endTimeStr" label="截止时间" align="center"></el-table-column>
        <el-table-column label="是否超限" align="center">
          <template slot-scope="scope">{{isOverLimit[scope.row.timeOuts]}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{ scope.row.statusStr }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <div class="opration-btn">
              <el-button
                v-if="showBtn('detail')"
                @click="openDetail(scope.row)"
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
                v-if="showRevokeBtn(scope.row)"
                type="text"
                size="small"
                @click="openCancle(scope.row)"
              >撤单</el-button>
              <el-button
                v-if="showCancleAuditBtn(scope.row)"
                type="text"
                size="small"
                @click="openCancleAudit(scope.row)"
              >撤单审核</el-button>
              <el-button
                v-if="showAppraiseAuditBtn(scope.row)"
                type="text"
                size="small"
                @click="openAppraiseAudit(scope.row)"
              >评价审核</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pager :pager="pager" @query="getItemList"></Pager>
    </div>
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
        @onHide="showDetailWin = false"
        :curBill="curBill"
        @submitDetail="getItemList"
        :showDetailDispatchingBtn="showDetailDispatchingBtn"
        :showDetailAppraiseAuditBtn="showDetailAppraiseAuditBtn"
      ></Detail>
    </el-dialog>
    <!-- 派工 -->
    <el-dialog
      v-dialogDrag
      title="选择执行人员"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showDispatchingWin"
      width="720px"
    >
      <select-user
        @onHide="hideDispatchinglWin"
        @submitForm="submitDispatching"
        :changeTag="changeTag"
      ></select-user>
    </el-dialog>
    <!-- 撤单审核 -->
    <el-dialog
      v-dialogDrag
      title="撤单审核"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showCancleAuditWin"
      width="380px"
    >
      <cancle-audit
        v-if="showCancleAuditWin"
        @onHide="showCancleAuditWin = false"
        @submitForm="submitAudit"
        :msg="curMaintainMsg"
      ></cancle-audit>
    </el-dialog>
    <!-- 撤单 -->
    <el-dialog
      v-if="showCancleWin"
      v-dialogDrag
      :title="cancleTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showCancleWin"
      width="480px"
    >
      <hang-cancle :title="cancleTitle" @onHide="showCancleWin=false" @submitForm="submitCancle"></hang-cancle>
    </el-dialog>
    <!-- 评价审核 -->
    <el-dialog
      v-dialogDrag
      title="评价审核"
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
import datePick from "@/components/timerange/separateTime.vue";
import Pager from '../../../../components/table/Pager';
import Detail from './Detail';
import SelectUser from '../SelectUser';
import CancleAudit from './CancleAudit.vue';

import { getMaintainBillList, getDeviceTree, revokeMaintainBill, maintainDispatch, maintainAudit, getMaintainAuditMsg } from '../../../../services/operation';
import { MaintainBillStatus, isOverLimit, MaintainBillStatusEnum } from '../../../../enum/operation-enum';
import TreeSelect from '@/components/treeSelect';
import HangCancle from '../HangOrCancle';
import MultSelect from '@/components/form/MultSelect.vue';
import baseOptions from '@/utils/baseOptions';
import AppraiseAudit from './AppraiseAudit';

export default {
  extends: baseOptions,
  components: {
    datePick,
    Pager,
    Detail,
    SelectUser,
    TreeSelect,
    CancleAudit,
    HangCancle,
    MultSelect,
    AppraiseAudit
  },
  data () {
    return {
      changeTag: '',//变更标识
      showDetailWin: false,//显示详情界面
      showDispatchingWin: false,//显示派工页面
      showCancleAuditWin: false,//显示撤单审核页面
      btnLoading: false, // 查询按钮loading状态
      maintainTime: '',
      tableHeight: 400,
      isOverLimit, //是否超限
      pager: {
        total: 100,
        pageNum: 1,
        pageSize: 15,
      },
      billNumber: '',//工单号
      deviceIdAndTypeId: '', //设备ID
      status: [-1], //状态
      statusOptions: MaintainBillStatus,
      BillStatusEnum: MaintainBillStatusEnum,//工单状态枚举
      tableData: [],
      curBill: {},//当前选中工单
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      curMaintainMsg: '',//当前审核原因
      cancleTitle: '',//挂单or撤单
      showCancleWin: false,//显示撤单弹窗
      showAppraiseAuditWin: false,//显示评价审核弹窗
      showDetailDispatchingBtn: false,//显示详情页面的派工按钮
      showDetailAppraiseAuditBtn: false,//显示详情页面的审核按钮
    }
  },
  created () {
    this.initDeviceTree();
  },
  mounted: function () {
    this.getItemList();
    this.$common.initTableHeight(this);
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
    //是否显示派工按钮
    showDispatchingBtn (row) {
      return this.showBtn('dispatching') && row.status == this.BillStatusEnum.waiting;
    },
    //是否显示撤单按钮
    showRevokeBtn (row) {
      return this.showBtn('cancle') && (row.status == this.BillStatusEnum.waiting || row.status == this.BillStatusEnum.waitingOver);
    },
    //显示撤单审核按钮
    showCancleAuditBtn (row) {
      return this.showBtn('audit') && row.status == this.BillStatusEnum.cancelAudit;
    },
    //显示评价审核按钮
    showAppraiseAuditBtn (row) {
      return this.showBtn('audit') && row.status == this.BillStatusEnum.waitAppraise;
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
      getMaintainBillList({
        pageNum: this.pager.pageNum, pageSize: this.pager.pageSize, shopNumber: this.shopNumber, billNumber: this.billNumber,
        startTime: this.maintainTime.start, endTime: this.maintainTime.end, deviceIdAndTypeId: this.deviceIdAndTypeId, status: this.status.join(',')
      }).then(res => {
        //console.log('res', res)
        this.tableData = res.data.list;
        this.pager.total = res.data.total;
        this.ctrlLoading(false)
      }).catch(error => {
        this.ctrlLoading(false)
      })
      console.log('查询')
    },
    //详情
    openDetail (row) {
      this.showDetailWin = true;
      this.showDetailDispatchingBtn = this.showDispatchingBtn(row);
      this.showDetailAppraiseAuditBtn = this.showAppraiseAuditBtn(row);
      // console.log(row)
      this.curBill = row;
      this.changeTag = this.$common.guid();
    },
    //初始化设备树
    initDeviceTree () {
      getDeviceTree(this.shopNumber).then(res => {
        //console.log('res', res)
        if (res.data.array) {
          this.treeData = res.data.array;
        }
      })
    },
    // 提交撤单操作
    submitCancle (data) {
      let item = { billNumber: this.curBill.billNumber, msg: data.reason };
      revokeMaintainBill(item).then(res => {
        //console.log('res', res);
        if (res.code === 200) {
          this.$common.winCallBack(this, '撤单成功！', this.showCancleWin = false);
        }
      })
    },
    //点击撤单按钮
    openCancle (row) {
      this.curBill = row;
      this.cancleTitle = '撤单';
      this.showCancleWin = true;
    },
    //***************派工****************** */
    //打开派工弹窗
    openDispatching (row) {
      // console.log(row);
      this.curBill = row;
      this.showDispatchingWin = true;
      this.changeTag = this.$common.guid();
    },
    //执行派工操作
    submitDispatching (data) {
      let item = { billNumber: this.curBill.billNumber, userId: data.user.userId };
      // console.log('item', item);
      maintainDispatch(item).then(res => {
        //console.log('res', res);
        if (res.code == 200) {
          this.$common.winCallBack(this, '派工成功！', this.hideDispatchinglWin());
        }
      })
    },
    //隐藏派工弹窗
    hideDispatchinglWin () {
      this.showDispatchingWin = false;
    },
    //***************审核****************** */
    //打开撤单审核弹窗
    openCancleAudit (row) {
      getMaintainAuditMsg(row.billNumber).then(res => {
        //console.log('res', res);
        if (res.code == 200) {
          this.curMaintainMsg = res.data;
        }
      })
      this.curBill = row;
      this.showCancleAuditWin = true;
    },
    //提交撤单审核
    submitAudit (data) {
      let item = { billNumber: this.curBill.billNumber, checkResult: data.checkResult, rejectInfo: data.rejectInfo };
      maintainAudit(item).then(res => {
        //console.log('res', res);
        if (res.code == 200) {
          this.$common.winCallBack(this, '审核成功！', () => { this.showCancleAuditWin = false; });
        }
      })
    },
    //打开评价审核弹窗
    openAppraiseAudit (row) {
      this.curBill = row;
      this.showAppraiseAuditWin = true;
    },
    //提交评价审核
    submitAppraiseAudit (data) {
      let item = { billNumber: this.curBill.billNumber, checkResult: data.checkResult, rejectInfo: data.rejectInfo, appraiseInfo: data.appraiseInfo, score: data.score };
      maintainAudit(item).then(res => {
        if (res.code == 200) {
          this.$common.winCallBack(this, '审核成功！', () => { this.showAppraiseAuditWin = false; });
        }
      })
    }
  }
}
</script>

<style  lang="scss">
.maintain-bill {
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
