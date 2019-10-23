<template>
  <div class="alarm-view">
    <div class="p-left" :class="!collapse?'hideTree':'showTree'">
      <div class="left-header">报警名称</div>
      <left-menu
        @foldClick="foldClick"
        :collapse="collapse"
        :folding="true"
        :items="treeData"
        :defaultProps="defaultProps"
        :defaultCheckedKeys="checkKeys"
        v-model="checkKeys"
      ></left-menu>
    </div>
    <div class="p-container" :class="collapse?'reduceBox':'expendBox'">
      <div class="u-layout-search two u-layout-dobule">
        <div class="u-layout-left-proviso">
          <div class="u-layout-left-item">
            <div class="title-input-group u-title-input-group">
              <p class="text">报警名称：</p>
              <div class="input-container">
                <div class="item select-input">
                  <el-input v-model="searchOptions.alarmName" placeholder="报警名称" clearable></el-input>
                </div>
              </div>
            </div>
            <div class="title-input-group u-title-input-group">
              <p class="text">报警级别：</p>
              <div class="input-container" style="width:170px;">
                <div style="border-radius: 2px;" class="item select-input">
                  <mult-select v-model="level" :options="levelOptions"></mult-select>
                </div>
              </div>
              <!-- <div class="input-container multiple" :style="{width:getAlarmLevelWidth()}">
                <div style="border-radius: 2px;" class="item select-input">
                  <el-select v-model="level" multiple placeholder="请选择" clearable>
                    <el-option
                      v-for="item in levelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>-->
            </div>
            <div class="title-input-group u-title-input-group">
              <p class="text">报警状态：</p>
              <div class="input-container" style="width:170px;">
                <div style="border-radius: 2px;" class="item select-input">
                  <mult-select v-model="status" :options="statusOptions"></mult-select>
                </div>
              </div>
            </div>
            <div class="title-input-group u-title-input-group">
              <datePick v-model="checkTime" title="报警时间" :defaultStartTime="defaultStartTime"></datePick>
            </div>
            <div class="title-input-group u-title-input-group">
              <el-button
                type="primary"
                icon="el-icon-search"
                round
                :loading="btnLoading"
                @click="refreshPage"
              >查询</el-button>
            </div>
          </div>
        </div>
        <div class="u-layout-right-item">
          <el-button
            type="primary"
            v-if="pageBtns.some(val=>val=='batch-transfer-bill')"
            @click="openBatchTransferBill"
          >批量转工单</el-button>
          <el-button
            type="primary"
            v-if="pageBtns.some(val=>val=='batch-ignore')"
            @click="batchIgnoreClick"
          >批量忽略</el-button>
        </div>
      </div>
      <div class="datatable-box">
        <el-table
          :data="tableData"
          :height="tableHeight"
          @selection-change="changeFun"
          border
          style="width: 100%"
          ref="table"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="55" prop="id"></el-table-column>
          <el-table-column prop="alarmName" label="报警名称">
            <template slot-scope="scope">
              <span class="two-text-ellipse" :title="scope.row.alarmName">{{scope.row.alarmName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="报警级别"
            align="center"
            width="100"
            sortable="custom"
            prop="alarmLevel"
          >
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">{{ alarmLevel[scope.row.alarmLevel] }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="deviceName" label="报警设备"></el-table-column>
          <el-table-column prop="alarmLocation" label="报警位置">
            <template slot-scope="scope">
              <span
                class="two-text-ellipse"
                :title="scope.row.alarmLocation"
              >{{scope.row.alarmLocation}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="alarmTime"
            align="center"
            label="报警时间"
            width="160"
            sortable="custom"
          ></el-table-column>
          <el-table-column label="报警状态" align="center" width="100" prop="status" sortable="custom">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <span
                  :class="{'red':scope.row.status==alarmStatusEnum.noSure}"
                >{{alarmStatus[scope.row.status] }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <div class="opration-btn">
                <el-button
                  v-if="pageBtns.some(val => val == 'detail')"
                  @click="openDetail(scope.row)"
                  type="text"
                  size="small"
                >详情</el-button>
                <el-button
                  v-if="showTransferBillBtn(scope.row)"
                  @click="openTransferBill(scope.row)"
                  type="text"
                  size="small"
                >转为工单</el-button>
                <el-button
                  v-if="showIgnoreBtn(scope.row)"
                  type="text"
                  size="small"
                  @click="ignoreClick(scope.row)"
                >忽略</el-button>
                <el-button
                  v-if="showAlarmSetBtn(scope.row)"
                  type="text"
                  size="small"
                  @click="alarmSetClick(scope.row)"
                >报警条件</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <Pager :pager="pager" @query="getItemList"></Pager>
      </div>
    </div>
    <!-- 报警设置 -->
    <el-dialog
      :visible.sync="editDialogVisible"
      width="960px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
      title="编辑"
    >
      <alarm-editor
        v-if="editDialogVisible"
        ref="pointTableEditor"
        :editDialogVisible.sync="editDialogVisible"
        :alarmId.sync="alarmConditionId"
        @success="alarmSetCallBack"
      ></alarm-editor>
    </el-dialog>
    <!-- 转单 -->
    <el-dialog
      v-dialogDrag
      v-if="showTransferBill"
      :title="transferBillTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showTransferBill"
      width="680px"
    >
      <transfer-bill
        @onHide="showTransferBill=false"
        :tbData="trassferBillData"
        @submitForm="transferBillSubmit"
      ></transfer-bill>
    </el-dialog>
    <!-- 报警详情 -->
    <el-dialog
      v-dialogDrag
      v-if="showDetailWin"
      :title="detailTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showDetailWin"
      width="900px"
    >
      <alarm-detail
        @onHide="showDetailWin=false"
        :deviceId="curItem.deviceId"
        :alarmType="curItem.alarmType"
      ></alarm-detail>
    </el-dialog>
  </div>
</template>

<script>
import Pager from '../../../components/table/Pager'
import leftMenu from '../../../components/leftMenu/index'
import datePick from "@/components/timerange/separateTime.vue";
import { getAlarmList, editAlarm, getAlarmConditionTree, ignoreAlarm, autoBill } from '../../../services/safety';
import datetimeUtils from '@/utils/datetime-utils.js';
import { alarmStatus, alarmLevel, alarmStatusOptions, alarmLevelOptions, alarmStatusEnum } from '../../../enum/alarm-enum.js';
import TransferBill from './TransferBill';
import AlarmEditor from '../../../views/system-settings/basics/custom-alarm-management/AlarmEditor';
import baseOptions from '@/utils/baseOptions';
import MultSelect from '@/components/form/MultSelect.vue';
import AlarmDetail from './AlarmDetail';
import forbidBack from '@/utils/mixins/forbidBack.js';
export default {
  extends: baseOptions,
  components: {
    Pager,
    leftMenu,
    datePick,
    TransferBill,
    AlarmEditor,
    MultSelect,
    AlarmDetail
  },
  mixins: [forbidBack],
  data () {
    let _startTime = datetimeUtils.getPreDate(67);
    return {
      alarmConditionId: '',
      collapse: true,//控制左侧树的显示和隐藏
      btnLoading: false, // 查询按钮loading状态
      tableHeight: 400,
      levelOptions: alarmLevelOptions(),
      statusOptions: alarmStatusOptions(),
      alarmStatus,//报警状态键值对
      alarmStatusEnum,
      alarmLevel,
      alarmId: '',//报警ID
      checkKeys: [],//报警类型ID
      defaultStartTime: _startTime,
      pager: {
        total: 100,
        pageNum: 1,
        pageSize: 15,
      },
      tableData: [],
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      editDialogVisible: false,//显示报警设置弹窗
      multipleSelection: [], //所有选中行
      showTransferBill: false,//显示转单弹窗
      transferBillTitle: '转单',
      trassferBillData: [], //转单数据列表
      curItem: {},//当前选中项
      checkTime: {},
      level: [1, 2], //报警级别（默认一级、二级；可选一级、二级、三级、四级、五级）
      status: [],//报警状态
      //搜索对象
      searchOptions: {
        shopNumber: '', pageNum: 1, pageSize: 15, alarmName: '',
        orderType: '', orderField: '',
        alarmLevel: '',
        status: '',//报警状态
        start: datetimeUtils.getSpecialDay(_startTime, '-'),
        end: datetimeUtils.getSpecialDay(new Date(), '-'),
        alarmCondition: ''
      },
      showDetailWin: false,
      detailTitle: '',//报警详情标题文字
    }
  },
  created: async function () {
    //接收页面参数：checkKeys
    console.log('this.$route.params', this.$route.params);

    let id = this.$route.params.id;
    if (id) {
      this.alarmId = id;
    }
    let status = this.$route.params.status;
    console.log('status :', status);
    if (status) {
      this.status = status;
    }
    await this.initData();
  },
  mounted: function () {
    this.$common.initTableHeight(this);
  },
  watch: {
    shopNumber (val) {
      console.log('shopNumber变化了')
      if (val) {
        this.initLeftTree();
      }
    },
    level (val) {
      this.$common.initTableHeight(this);
    }
  },
  methods: {
    //--------------------------控制按钮显示权限 start-------------------------------
    //显示转单按钮
    showTransferBillBtn (row) {
      return this.pageBtns.some(val => val == 'transfer-bill') && row.status == this.alarmStatusEnum.noSure;
    },
    //显示忽略按钮
    showIgnoreBtn (row) {
      return this.pageBtns.some(val => val == 'ignore') && row.status == this.alarmStatusEnum.noSure;
    },
    //显示报警条件设置按钮
    showAlarmSetBtn (row) {
      return this.pageBtns.some(val => val == 'alarm-condition-set');
    },
    //--------------------------控制按钮显示权限 end-------------------------------
    //初始化左侧树-并查询数据
    async initLeftTree (flag) {
      // debugger
      await getAlarmConditionTree(this.shopNumber).then(res => {
        // console.log('res', res)
        this.treeData = res.data;
        if (flag) {
          console.log('初始化 :', this.checkKeys);
          this.getCheckKeys(res.data, this.checkKeys);
        }
        // console.log('this.checkKeys', this.checkKeys)
      })
    },
    async initData () {
      await this.initLeftTree(true);
      await this.getItemList();
    },
    async refreshPage () {
      await this.initLeftTree(false);
      await this.getItemList();
    },
    //获取所有选中项Key
    getCheckKeys (data, checkKeys) {
      if (!data) {
        return;
      }
      var that = this;
      const { type } = this.$route.query
      console.log(this.$route.query)
      data.forEach(item => {

        if (type) {
          if (String(item.id) === type) {
            checkKeys.push(type)
            item.childList && item.childList.map(o => { checkKeys.push(o.id) })
          }
        } else {
          console.log('type', type)
          if (item.id && Object.prototype.toString.call(item.id).indexOf('String') != -1) { //字符串类型
            checkKeys.push(item.id);
          }
          if (item.childList) {
            that.getCheckKeys(item.childList, checkKeys);
          }
        }

      });
    },
    // 查询请求
    async getItemList () {
      // console.log('查询')
      this.$common.updateLoadingStatus(true);
      this.btnLoading = true;

      this.searchOptions.alarmCondition = this.checkKeys.join(',');
      this.searchOptions.shopNumber = this.shopNumber;
      this.searchOptions.start = this.checkTime.start;
      this.searchOptions.end = this.checkTime.end;
      this.searchOptions.pageNum = this.pager.pageNum;
      this.searchOptions.pageSize = this.pager.pageSize;
      this.searchOptions.alarmLevel = this.level.join(',');
      this.searchOptions.status = this.status.join(',');

      await getAlarmList(this.searchOptions, this.alarmId).then((res) => {
        if (res.data) {
          this.pager.total = res.data.total;
          this.tableData = res.data.list ? res.data.list : [res.data];
        }
        this.alarmId = '';
        this.closeLoading();
      }).catch((error) => {
        this.closeLoading();
      }
      )
    },
    //关闭Loading
    closeLoading () {
      this.btnLoading = false;
      this.$common.updateLoadingStatus(false);
    },
    //转为工单
    openTransferBill (row) {
      console.log(row);
      this.showTransferBill = true;
      this.transferBillTitle = '报警转工单';
      this.trassferBillData = [];
      this.trassferBillData.push(row);
    },
    //详情
    openDetail (row) {
      this.curItem = row;
      this.detailTitle = '报警详情(' + row.deviceName + ')';
      this.showDetailWin = true;
    },
    //批量转为工单
    openBatchTransferBill () {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择待转项！',
          type: 'error'
        });
        return;
      }
      console.log('this.multipleSelection', this.multipleSelection)
      let item = this.multipleSelection.find((n) => (n.status == this.alarmStatusEnum.processing))
      if (item) {
        this.$message({
          message: '[' + item.alarmName + ']是处理中的报警,不能转工单！',
          type: 'error'
        });
        return;
      }
      item = this.multipleSelection.find((n) => (n.status == this.alarmStatusEnum.recovered))
      if (item) {
        this.$message({
          message: '[' + item.alarmName + ']是已忽略的报警,不能转工单！',
          type: 'error'
        });
        return;
      }
      item = this.multipleSelection.find((n) => (n.status == this.alarmStatusEnum.resolved))
      if (item) {
        this.$message({
          message: '[' + item.alarmName + ']是已恢复的报警,不能转工单！',
          type: 'error'
        });
        return;
      }
      this.showTransferBill = true;
      this.transferBillTitle = '报警批量转工单';
      this.trassferBillData = this.multipleSelection;
    },
    //转单-提交
    transferBillSubmit (data) {
      console.log('data', data);
      let items = data.map(n => {
        return { alarmId: n.id, userId: n.users }
      });
      autoBill(items).then(res => {
        console.log('res', res)
        if (res.code === 200) {
          this.$message({
            message: '转单成功！',
            type: 'success'
          });
          this.showTransferBill = false;
          this.refreshPage();
        }
      })
    },
    //复选框状态改变
    changeFun (val) {
      this.multipleSelection = val;
    },
    //获取所有选中了的报警记录ID
    getCheckedAlarmIds () {
      let ids = [];
      this.multipleSelection.forEach(n => {
        ids.push(n.id);
      })
      return ids;
    },
    //忽略
    ignoreClick (row) {
      console.log(row);
      this.$confirm('确认忽略选中信息吗?', '忽略', {
        cancelButtonText: '取 消',
        confirmButtonText: '确 定',
        type: 'warning'
      }).then(() => {
        // editAlarm({ id: row.id, status: this.alarmStatusEnum.recovered }).then((res) => {
        //   console.log('忽略：', res);
        //   if (res.code === 200) {
        //     this.$message({
        //       message: '忽略成功！',
        //       type: 'success'
        //     });
        //     this.refreshPage();
        //   }
        // })
        ignoreAlarm({ alarmIds: row.id }).then(res => {
          //操作成功-提示
          if (res.code === 200) {
            this.$message({
              message: '忽略成功！',
              type: 'success'
            });
            this.refreshPage(); //刷新界面
          }
        })
      });
    },
    //批量忽略
    batchIgnoreClick () {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择忽略项！',
          type: 'error',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      this.$confirm('确认忽略选中信息吗?', '批量忽略', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        let item = this.multipleSelection.find((n) => (n.status != this.alarmStatusEnum.noSure))
        if (item) {
          this.$message({
            message: '只有待确认状态下的记录能够忽略！',
            type: 'error'
          });
          return;
        }
        // console.log('multipleSelection', this.multipleSelection)
        ignoreAlarm({ alarmIds: this.getCheckedAlarmIds().join(',') }).then(res => {
          // console.log('res', res)
          //操作成功-提示
          if (res.code === 200) {
            this.$message({
              message: '忽略成功！',
              type: 'success'
            });
            this.refreshPage(); //刷新界面
          }
        })
      })
    },
    //折叠展开
    foldClick () {
      // console.log('折叠')
      this.collapse = !this.collapse
    },
    //报警条件设置
    alarmSetClick (row) {
      this.curItem = row;
      this.alarmConditionId = row.alarmConditionId;
      this.editDialogVisible = true;
    },
    //报警设置回调
    alarmSetCallBack () {
      this.editDialogVisible = false;
      this.initLeftTree(false); //刷新界面
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs.pointTableEditor && this.$refs.pointTableEditor.cancle();
    },
    //隐藏报警设置弹窗
    hideAlarmSet () {
      this.editDialogVisible = false;
    },
    //自动设置报警级别下拉框的宽度
    getAlarmLevelWidth (defaultWidth = 85, size = 59) {
      return this.level.length <= 1 ? defaultWidth + 'px' : defaultWidth + (this.level.length - 1) * size + 'px';
    },
    //排序变化
    sortChange (data) {
      if (data.prop) {
        this.searchOptions.orderType = data.order == 'ascending' ? 'asc' : 'desc';
        this.searchOptions.orderField = data.prop;
        this.getItemList();
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.u-layout-search .title-input-group .input-container.multiple {
  // width: 310px;
  min-width: 90px;
  .el-select {
    width: 100%;
  }
}
.u-layout-search .u-layout-left-item {
  padding-right: 10px;
}
.alarm-view {
  // background: #eff4f8;
  width: 100%;
  height: 100%;
}
/deep/ .left-tree {
  // border-bottom-left-radius: 10px;
  // border-bottom-right-radius: 10px;
  height: calc(100% - 42px) !important;
}
.p-left {
  width: 240px;
  background: #eff4f8;
  height: 100%;
  // border-radius: 5px;
  position: absolute;
  left: 0px;
  border-right: 1px #e4e7ed solid;
  &.hideTree {
    width: 0px;
    .left-header {
      display: none;
    }
  }
  &.showTree {
    width: 240px;
    .left-header {
      display: block;
    }
  }
}
.red {
  color: #e11c25;
}
.left-header {
  height: 42px;
  line-height: 42px;
  background-color: #fafbfc;
  color: #0064aa;
  // border-top-left-radius: 10px;
  // border-top-right-radius: 10px;
  padding-left: 15px;
}
.p-container {
  width: calc(100% - 255px);
  float: right;
  height: 100%;
  background: #fff;
  // border-radius: 10px;
  /deep/ .date-picker {
    width: 340px;
  }
  &.reduceBox {
    width: calc(100% - 255px);
  }
  &.expendBox {
    width: calc(100% - 10px);
  }
}
</style>
<style lang="scss" >
</style>
