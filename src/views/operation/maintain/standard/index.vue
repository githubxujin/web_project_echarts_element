<template>
  <div class="u-layout-container">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">保养参数：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="paraName" placeholder="请输入" clearable></el-input>
              </div>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">设备类型：</p>
            <tree-select
              v-model="deviceType"
              placeholder="请选择"
              :clearable="true"
              :data="treeData"
              :defaultProps="defaultProps"
              :onlyLeafSelect="false"
            ></tree-select>
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
          @click="addClick"
        >新增</el-button>
      </div>
    </div>
    <div class="datatable-box">
      <el-table :data="tableData" :height="tableHeight" border style="width: 100%" ref="table">
        <el-table-column type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
        <el-table-column prop="paraName" label="保养参数"></el-table-column>
        <el-table-column prop="deviceTypeStr" label="设备类型"></el-table-column>
        <el-table-column prop="inputTypeStr" label="输入类型" align="center"></el-table-column>
        <el-table-column prop="standardValue" label="标准值"></el-table-column>
        <el-table-column prop="unitStr" label="单位" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
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
      <Pager :pager="pager" @query="getItemList" @setPager="onChangePage"></Pager>
    </div>
    <!-- 新增/编辑 -->
    <el-dialog
      v-dialogDrag
      :title="AddEditTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showAddEditWin"
      v-if="showAddEditWin"
      width="680px"
      custom-class="add-standard"
    >
      <add-edit-standard
        @onHide="showAddEditWin=false"
        @submitForm="submitAddEdit"
        :id="selectedId"
      ></add-edit-standard>
    </el-dialog>
  </div>
</template>

<script>
import Pager from '@/components/table/Pager';
import AddEditStandard from './AddEditStandard';
import { getDeviceTypeTree, maintainStandardList, addMaintainStandard, editMaintainStandard, delMaintainStandard } from '@/services/operation.js';
import TreeSelect from '@/components/treeSelect';
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: {
    Pager,
    AddEditStandard,
    TreeSelect
  },
  data () {
    return {
      selectedId: '',//当前选中行ID
      showAddEditWin: false,//显示心中弹窗
      AddEditTitle: '',//新增or编辑
      btnLoading: false, // 查询按钮loading状态
      checkTime: '',
      tableHeight: 400,
      pager: {
        total: 100,
        pageNum: 1,
        pageSize: 15,
      },
      paraName: '',//参数名称
      deviceType: '', //设备类型
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      status: '',
      statusOptions: [],
      tableData: []
    }
  },
  watch: {
    //门店编码
    shopNumber (val) {
      this.getItemList();
    },
    // //页面有权限的按钮
    // pageBtns () {
    //   return this.$store.getters.getPageBtns;
    // }
  },
  created () {
    this.initData();
    this.getItemList();
  },
  mounted: function () {
    this.$common.initTableHeight(this);
  },
  methods: {
    //初始化界面数据
    initData () {
      getDeviceTypeTree().then(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.treeData = res.data.array;
        }
      })
    },
    // 查询请求
    getItemList () {
      console.log('查询')
      this.$common.updateLoadingStatus(true);
      this.btnLoading = true;
      let type = this.deviceType ? this.deviceType.split(',')[0] : '';
      maintainStandardList({
        deviceType: type, shopNumber: this.shopNumber, paraName: this.paraName,
        pageNum: this.pager.pageNum, pageSize: this.pager.pageSize
      }).then(res => {
        console.log('res', res);
        this.tableData = res.data.list;
        this.pager.total = res.data.total;
        this.btnLoading = false;
        this.$common.updateLoadingStatus(false);
      }).catch(() => {
        this.btnLoading = false;
      })
    },
    //分页
    onChangePage (val) {
      console.log(val)
    },
    //添加
    addClick () {
      this.selectedId = '';
      this.AddEditTitle = '添加保养标准';
      this.showAddEditWin = true;
    },
    //编辑
    editClick (row) {
      this.selectedId = row.id;
      this.AddEditTitle = '编辑保养标准';
      this.showAddEditWin = true;
      console.log(row)
    },
    //删除
    deleteClick (row) {
      console.log(row)
      this.$confirm('确认删除选中信息吗?', '删除', {
        cancelButtonText: '取 消',
        confirmButtonText: '确 定',
        type: 'warning'
      }).then(() => {
        delMaintainStandard(row.id).then((res) => {
          console.log('忽略：', res);
          if (res.code === 200) {
            this.winCallBack('删除成功！');
          }
        })
      });
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
    //添加、编辑表单
    submitAddEdit (data) {
      data.shopNumber = this.shopNumber;
      console.log('data', data)
      //编辑
      if (this.selectedId) {
        data.id = this.selectedId;
        editMaintainStandard(data).then(res => {
          console.log('res', res);
          if (res.code == 200) {
            this.winCallBack('编辑成功!', this.showAddEditWin = false)
          }
        })
      } else {    //添加
        addMaintainStandard(data).then(res => {
          console.log('res', res);
          if (res.code == 200) {
            this.winCallBack('添加成功!', this.showAddEditWin = false)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tab-pane {
  overflow-y: hidden;
}
</style>
<style lang="scss">
@import '../../scss/window.scss';
</style>