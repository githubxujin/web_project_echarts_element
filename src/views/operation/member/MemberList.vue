<template>
  <div class="u-layout-container">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">姓名：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="memberName" placeholder="请输入" clearable></el-input>
              </div>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">工号：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="memberNumber" placeholder="请输入" clearable></el-input>
              </div>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">状态：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select v-model="status" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="item in statusOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">部门：</p>
            <tree-select
              v-model="departId"
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
      <div class="u-layout-right-item"></div>
    </div>
    <div class="datatable-box">
      <el-table :data="tableData" :height="tableHeight" border style="width: 100%" ref="table">
        <el-table-column type="index" label="序号" :index="indexMethod" width="50"></el-table-column>
        <el-table-column prop="jobNumber" label="工号" width="180" align="center"></el-table-column>
        <el-table-column prop="realName" label="姓名" width="180"></el-table-column>
        <el-table-column prop="orgName" label="部门"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="billCount" label="当前工单数"></el-table-column>
        <el-table-column prop="status" label="状态" width="180" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="pageBtns.some(val=>val=='detail')"
              type="text"
              size="small"
              @click="onEdit(scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 详情 -->
    <el-dialog
      v-dialogDrag
      :title="addEditTitle"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showAddEdit"
      width="800px"
    >
      <add-edit v-if="showAddEdit" @onHide="hideAddEditWin" :isEdit="isEdit" :id="curUserId"></add-edit>
    </el-dialog>
  </div>
</template>

<script>
import datePick from "@/components/timerange/separateTime.vue";
import AddEdit from './AddEdit';
// import Detail from './Detail';
import { getMemberList, getDepartSelected } from '../../../services/operation';
import baseOptions from '@/utils/baseOptions';
import TreeSelect from '@/components/treeSelect';

export default {
  extends: baseOptions,
  components: {
    datePick,
    AddEdit,
    TreeSelect
    // Detail,
  },
  data () {
    return {
      isEdit: false,
      addEditTitle: '人员详情',
      showAddEdit: false,//显示新增界面
      showDispatching: false,//显示派工页面
      btnLoading: false, // 查询按钮loading状态
      checkTime: '',
      tableHeight: 400,
      pager: {
        total: 100,
        pageNum: 1,
        pageSize: 2000,
      },
      curUserId: '',//当前人员ID
      memberName: '', //姓名
      memberNumber: '', //工号
      departId: '', //部门ID
      tableData: [],
      status: '',//状态
      statusOption: [
        { label: '休假', value: 0 },
        { label: '空闲', value: 1 },
        { label: '忙碌', value: 2 },
      ],
      treeData: [],//部门树
      defaultProps: {
        children: 'options',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
    }
  },
  created () {
    this.initData();
    this.getItemList();
  },
  mounted: function () {
    this.$common.initTableHeight(this, 150);
  },
  watch: {
    //门店编码
    shopNumber (val) {
      this.getItemList();
    }
  },
  methods: {
    //初始化数据
    initData () {
      getDepartSelected().then(res => {
        if (res.code == 200) {
          this.treeData = res.data.array;
        }
      })
    },
    ctrlLoading (flag) {
      this.btnLoading = flag;
      this.$common.updateLoadingStatus(flag);
    },
    // 查询请求
    getItemList () {
      this.ctrlLoading(true)
      getMemberList({
        pageNum: this.pager.pageNum, pageSize: this.pager.pageSize, shopNumber: this.shopNumber, memberName: this.memberName,
        memberNumber: this.memberNumber, departId: this.departId, status: this.status
      }).then(res => {
        console.log('res', res)
        this.tableData = res.data.array;
        this.ctrlLoading(false)
      }).catch(error => {
        this.ctrlLoading(false)
      })
      console.log('查询')
    },
    //分页
    onChangePage (val) {
      console.log(val)
    },
    checkedTime (res) {
      console.log('getTime:', res);
    },
    //打开编辑弹窗
    onEdit (row) {
      console.log(row)
      this.showAddEdit = true;
      this.isEdit = true;
      this.curUserId = row.userId;
    },
    //隐藏 添加/编辑 弹窗
    hideAddEditWin () {
      console.log('hideAddEditWin :');
      this.showAddEdit = false;
    },
  }
}
</script>

<style lang="scss" scoped>
</style>