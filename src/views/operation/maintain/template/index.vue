<template>
  <div class="u-layout-container">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">模板编号/名称：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="templateNumber" placeholder="请输入编号/名称" clearable></el-input>
              </div>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">设备类型：</p>
            <tree-select
              v-model="deviceIdAndTypeId"
              placeholder="请选择"
              :clearable="true"
              :data="treeData"
              :defaultProps="defaultProps"
              :onlyLeafSelect="true"
            ></tree-select>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">保养周期：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <el-select v-model="cycleTime" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in MaintainCycleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
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
        <el-table-column prop="templateNumber" label="模板编号"></el-table-column>
        <el-table-column prop="templateName" label="模板名称"></el-table-column>
        <el-table-column prop="deviceTypeStr" label="设备类型"></el-table-column>
        <el-table-column prop="cycleTimeStr" label="周期" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="pageBtns.some(val=>val=='detail')"
              @click="detailClick(scope.row)"
              type="text"
              size="small"
            >详情</el-button>
            <el-button
              v-if="pageBtns.some(val => val == 'delete')"
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
      title="添加保养模板"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showAddWin"
      v-if="showAddWin"
      width="680px"
    >
      <add-template @onHide="showAddWin=false" @submitForm="submitAdd"></add-template>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      v-dialogDrag
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showDetailWin"
      width="480px"
    >
      <span
        slot="title"
        class="text-ellipse dialog-header-text"
        v-text="detailTitle"
        :title="detailTitle"
      ></span>
      <template-detail
        v-if="showDetailWin"
        @onHide="showDetailWin=false"
        :id="curItem.templateNumber"
      ></template-detail>
    </el-dialog>
  </div>
</template>

<script>
import Pager from '@/components/table/Pager'
import TreeSelect from '@/components/treeSelect';
import { getDeviceTypeTree, addMaintainTemplate, maintainTemplateList, deleteMaintainTemplate, getMaintainCycleSelected } from '@/services/operation.js';
import AddTemplate from './AddTemplate';
import TemplateDetail from './TemplateDetail';
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: {
    Pager,
    TreeSelect,
    AddTemplate,
    TemplateDetail
  },
  data () {
    return {
      btnLoading: false, // 查询按钮loading状态
      showAddWin: false,
      tableHeight: 400,
      detailTitle: '',//详情弹窗标题
      showDetailWin: false,//是否显示详情弹窗
      curItem: { templateNumber: '' },//当前选中行数据
      pager: {
        total: 100,
        pageNum: 1,
        pageSize: 15,
      },
      templateNumber: '', //模板编号
      deviceIdAndTypeId: '', //设备ID
      cycleTime: '',//保养周期
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      tableData: [],
      MaintainCycleOptions: [], //保养周期列表
    }
  },
  created () {
    this.initData();
    this.getItemList();
  },
  mounted: function () {
    this.$common.initTableHeight(this);
  },
  watch: {
    //门店编码
    shopNumber (val) {
      this.getItemList();
    }
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
      this.getCycleSelectedItem();
    },
    //获取巡检周期下拉框数据
    getCycleSelectedItem () {
      getMaintainCycleSelected(this.shopNumber).then(res => {
        if (res.code == 200) {
          this.MaintainCycleOptions = res.data.array;
          // if (res.data.array.length > 0) {
          //   this.cycleTime = res.data.array[0].value;
          // }
        }
      });
    },
    // 查询请求
    getItemList () {
      console.log('查询')
      this.$common.updateLoadingStatus(true);
      this.btnLoading = true;
      maintainTemplateList({
        shopNumber: this.shopNumber, templateNumber: this.templateNumber,
        pageNum: this.pager.pageNum, pageSize: this.pager.pageSize,
        cycleTime: this.cycleTime,
        deviceType: this.getDeviceId(this.deviceIdAndTypeId)
      }).then(res => {
        this.tableData = res.data.list;
        this.pager.total = res.data.total;
        this.btnLoading = false;
        this.$common.updateLoadingStatus(false);
      }).catch(() => {
        this.btnLoading = false;
      })
    },
    //获取真实的设备ID
    getDeviceId (val) {
      return val.includes(',') ? parseInt(val.split(',')[0]) : '';
    },
    //添加
    addClick () {
      this.showAddWin = true;
    },
    //详情
    detailClick (row) {
      this.curItem = row;
      this.detailTitle = row.templateName;
      this.showDetailWin = true;
      console.log(row)
    },
    //删除
    deleteClick (row) {
      this.$confirm('确认删除选中信息吗?', '删除', {
        cancelButtonText: '取 消',
        confirmButtonText: '确 定',
        type: 'warning'
      }).then(() => {
        deleteMaintainTemplate(row.templateNumber).then((res) => {
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
      this.getCycleSelectedItem();
    },
    //添加模板
    submitAdd (data) {
      console.log('data', data)
      data.shopNumber = this.shopNumber;
      addMaintainTemplate(data).then(res => {
        this.winCallBack('添加成功!', this.showAddWin = false);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.u-layout-container {
  height: 100%;
}
</style>