<template>
  <div class="u-layout-container">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
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
            <datePick
              :clearable="true"
              v-model="checkTime"
              title="上次时间"
              defaultStartTime
              defaultEndTime
            ></datePick>
          </div>
          <div class="title-input-group u-title-input-group">
            <datePick
              :clearable="true"
              :enabledEndTimeLimit="false"
              v-model="nextCheckTime"
              defaultStartTime
              defaultEndTime
              title="预计下次时间"
            ></datePick>
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
          @click="onAddClick"
        >新增</el-button>
      </div>
    </div>
    <div class="datatable-box">
      <el-table :data="tableData" :height="tableHeight" border style="width: 100%" ref="table">
        <el-table-column type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
        <el-table-column prop="planName" label="计划名称"></el-table-column>
        <el-table-column prop="deviceNames" label="设备名称">
          <template slot-scope="scope">
            <span class="two-text-ellipse" :title="scope.row.deviceNames">{{scope.row.deviceNames}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上次时间" prop="previousTimeStr"></el-table-column>
        <el-table-column label="预计下次时间" prop="nextTimeStr"></el-table-column>
        <el-table-column prop="cycleTimeStr" label="周期"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="pageBtns.some(val=>val=='edit')"
              @click="editClick(scope.row)"
              type="text"
              size="small"
            >编辑</el-button>
            <el-button
              v-if="pageBtns.some(val=>val=='delete')"
              type="text"
              size="small"
              @click="deleteClick(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pager :pager="pager" @query="getItemList"></Pager>
    </div>
    <!-- 新增/编辑 -->
    <el-dialog
      v-dialogDrag
      :title="addEditRangeTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showAddWin"
      width="800px"
    >
      <add-range
        v-if="showAddWin"
        @onHide="showAddWin=false"
        @submitForm="submitSave"
        :isEdit="isEdit"
        :id="curId"
      ></add-range>
    </el-dialog>
  </div>
</template>

<script>
import datePick from "@/components/timerange/separateTime.vue";
import Pager from '@/components/table/Pager';
import TreeSelect from '@/components/treeSelect';
import { getDeviceTree, checkPlanPageList, addCheckPlan, editCheckPlan, deleteCheckTemplate, deleteCheckPlan } from '@/services/operation';
import AddRange from './AddRange';
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: {
    datePick,
    Pager,
    TreeSelect,
    AddRange
  },
  data () {
    return {
      btnLoading: false, // 查询按钮loading状态
      checkTime: '',//上次时间
      nextCheckTime: '',//下次时间
      showAddWin: false,
      tableHeight: 400,
      pager: {
        total: 100,
        pageNum: 1,
        pageSize: 15,
      },
      deviceIdAndTypeId: '', //设备ID
      treeData: [],
      tableData: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      addEditRangeTitle: '',
      isEdit: false,//是否是编辑
      curId: '',//当前选中巡检计划ID
    }
  },
  created () {
    this.initDeviceTree();
    this.getItemList();
  },
  watch: {
    //门店编码
    shopNumber (val) {
      this.getItemList();
    }
  },
  mounted: function () {
    this.$common.initTableHeight(this);
  },
  methods: {
    //控制loading隐藏和显示
    ctrlLoading (flag) {
      this.btnLoading = flag;
      this.$common.updateLoadingStatus(flag);
    },
    // 查询请求
    getItemList () {
      this.ctrlLoading(true);
      checkPlanPageList({
        pageNum: this.pager.pageNum, pageSize: this.pager.pageSize, shopNumber: this.shopNumber, deviceIdAndType: this.deviceIdAndTypeId,
        previousTimeStart: this.checkTime.start, previousTimeEnd: this.checkTime.end,
        nextTimeStart: this.nextCheckTime.start, nextTimeEnd: this.nextCheckTime.end
      }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list;
          this.pager.total = res.data.total;
        }
        this.ctrlLoading(false);
      }).catch(() => { this.btnLoading = false; })
    },
    //初始化设备树
    initDeviceTree () {
      getDeviceTree(this.shopNumber).then(res => {
        console.log('res', res)
        if (res.data.array) {
          this.treeData = res.data.array;
        }
      })
    },
    //新增
    onAddClick () {
      this.isEdit = false;
      this.curId = 0;
      this.addEditRangeTitle = '新增巡检计划';
      this.showAddWin = true;
    },
    //编辑
    editClick (row) {
      console.log(row);
      this.isEdit = true;
      this.curId = row.id;
      this.addEditRangeTitle = '编辑巡检计划';
      this.showAddWin = true;
    },
    //删除
    deleteClick (row) {
      console.log(row)
      this.$confirm('确认删除选中信息吗?', '删除', {
        cancelButtonText: '取 消',
        confirmButtonText: '确 定',
        type: 'warning'
      }).then(() => {
        //删除业务逻辑
        deleteCheckPlan(row.id).then(res => {
          if (res.code == 200) {
            this.winCallBack('删除成功！');
          }
        })
      });
    },
    //新增、编辑巡检计划回调
    submitSave (data) {
      if (this.isEdit) {
        data.id = this.curId;
        editCheckPlan(data).then(res => {
          if (res.code == 200) {
            this.winCallBack('编辑成功！', () => { this.showAddWin = false });
          }
        });
      } else {
        addCheckPlan(data).then(res => {
          if (res.code == 200) {
            this.winCallBack('新增成功！', () => { this.showAddWin = false });
          }
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.u-layout-container {
  height: 100%;
}
</style>