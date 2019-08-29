<template>
  <div class="u-layout-container">
    <div class="u-layout-search two">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">年份：</p>
            <el-date-picker v-model="year" type="year" placeholder="选择年"></el-date-picker>
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
            <p class="text">状态：</p>
            <el-select v-model="status" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
          type="primary"
          icon="el-icon-plus"
          v-if="pageBtns.some(val=>val=='add')"
          @click="()=>{addEditRangeTitle='新增保养计划';showAddWin=true;isEdit=false;}"
        >新增</el-button>
        <el-button type="primary" icon="el-icon-view" @click="()=>{showPlanCheckWin=true}">计划核查</el-button>
      </div>
    </div>
    <div class="datatable-box" ref="table" :style="{'height':tableHeight+'px'}">
      <div
        v-for="(item,index) in tableData"
        :key="index"
        class="grid-content"
        :class="{'disabled':curYearMonth>item.monthStr}"
      >
        <div class="item-header">
          <span>{{item.monthStr}}</span>
          <span>{{item.monthCount}}</span>
        </div>
        <div class="item-content">
          <template v-if="item.monthList">
            <p v-for="(subItem,subIndex) in item.monthList" :key="subIndex">
              <span class="text-ellipse plan-name" :title="subItem.planName">{{subItem.planName}}</span>
              <span
                class="text-ellipse"
                :title="subItem.startTimeStr+'~'+subItem.endTimeStr"
              >{{subItem.startTimeStr}}~{{subItem.endTimeStr}}</span>
              <span
                class="text-ellipse device-name"
                :title="subItem.deviceNames"
              >{{subItem.deviceNames}}</span>
              <i
                class="el-icon-edit edit"
                v-if="pageBtns.some(val=>val=='edit')"
                @click="getPlanInfo(subItem.planId)"
              ></i>
            </p>
          </template>
        </div>
      </div>
    </div>
    <!-- 计划核查 -->
    <el-dialog
      v-dialogDrag
      title="计划核查"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showPlanCheckWin"
      width="620px"
    >
      <plan-check v-if="showPlanCheckWin" @onHide="showPlanCheckWin=false"></plan-check>
    </el-dialog>
    <!-- 新增/编辑 -->
    <el-dialog
      v-dialogDrag
      :title="addEditRangeTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showAddWin"
      width="800px"
    >
      <add-plan
        v-if="showAddWin"
        @onHide="showAddWin=false"
        @submitForm="submitSave"
        @refreshList="refreshList"
        :isEdit="isEdit"
        :id="curId"
      ></add-plan>
    </el-dialog>
  </div>
</template>

<script>
import baseOptions from '@/utils/baseOptions';
import TreeSelect from '@/components/treeSelect';
import { getDeviceTree, addMaintainPlan, maintainPlanPageList, editMaintainPlan } from '@/services/operation';
import PlanCheck from './PlanCheck';
import AddPlan from './AddPlan';
import dateUtils from '@/utils/datetime-utils.js';

export default {
  extends: baseOptions,
  components: {
    TreeSelect,
    PlanCheck,
    AddPlan
  },
  data () {
    return {
      btnLoading: false, // 查询按钮loading状态
      tableHeight: 400,
      tableData: [],
      year: new Date(),
      pickerBeginYearAfter: {
        //只能操作当前年份份及之前的年份
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      deviceIdAndTypeId: '', //设备ID
      status: 0,//状态：启用
      statusOptions: [{
        value: 0,
        label: '启用'
      }, {
        value: 1,
        label: '禁用'
      }],
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      addEditRangeTitle: '',//添加编辑计划标题
      showAddWin: false,//显示新增计划弹窗
      showPlanCheckWin: false,//显示计划核查弹窗
      isEdit: false,//是否是编辑
      curId: 0,//当前选中保养计划ID
      curYearMonth: dateUtils.getCurYearMonth()
    }
  },
  created () {
    this.initDeviceTree();
    this.getItemList();
  },
  mounted: function () {
    this.$common.initTableHeight(this, 250, 0);
  },
  computed: {

  },
  methods: {
    // 查询请求
    getItemList () {
      console.log('查询')
      this.$common.updateLoadingStatus(true);
      this.btnLoading = true;
      let year = this.year ? this.year.getFullYear() + '-01-01' : '';
      console.log('this.year :', this.year);
      maintainPlanPageList({ shopNumber: this.shopNumber, deviceIdAndType: this.deviceIdAndTypeId, year: year, status: this.status }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.array;
        }
        this.$common.updateLoadingStatus(false);
        this.btnLoading = false;
      }).catch(() => {
        this.btnLoading = false;
      })
    },
    editClick (row) {
      console.log(row)
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
    //新增、编辑保养计划回调
    submitSave (data) {
      if (this.isEdit) {
        data.id = this.curId;
        editMaintainPlan(data).then(res => {
          if (res.code == 200) {
            this.$common.winCallBack(this, '编辑成功！', () => { this.showAddWin = false });
          }
        });
      } else {
        addMaintainPlan(data).then(res => {
          if (res.code == 200) {
            this.$common.winCallBack(this, '新增成功！', () => { this.showAddWin = false });
          }
        });
      }
    },
    //获取计划详情
    getPlanInfo (id) {
      this.isEdit = true;
      this.curId = id;
      this.addEditRangeTitle = '编辑保养计划';
      this.showAddWin = true;
    },
    //删除后，刷新列表
    refreshList () {
      this.showAddWin = false;
      this.getItemList();
    }
  }
}
</script>

<style lang="scss" scoped>
.u-layout-container {
  height: 100%;
}
.grid-content {
  border-radius: 4px;
  min-height: 240px;
  margin: 0px 5px 20px 5px;
  border: #f2f2f2 1px solid;
  min-width: 420px;
  overflow: hidden;
  width: 24%;
  .item-header {
    height: 38px;
    line-height: 38px;
    background-color: #81d3f8;
    display: flex;
    justify-content: space-between;
    padding: 0px 8px;
  }
  .item-content {
    height: 200px;
    line-height: 38px;
    padding: 0px 5px;
    overflow-y: auto;
    p {
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      line-height: 38px;
      height: 38px;
      span {
        padding: 0px 5px;
      }
    }
    .edit {
      padding-top: 10px;
      cursor: pointer;
      font-size: 16px;
      padding-right: 5px;
      &:hover {
        color: $hoverColor;
      }
    }
  }
}
.grid-content.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  .item-header {
    // background-color: #cdedfc;
  }
  .item-content {
    // color: #b7adad;
    .edit {
      display: none;
    }
  }
}
.datatable-box {
  padding-left: 10px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.device-name {
  max-width: 130px;
  width: 40%;
}
.plan-name {
  max-width: 120px;
  width: 40%;
}
</style>