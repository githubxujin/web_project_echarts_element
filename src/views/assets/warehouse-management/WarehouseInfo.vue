<template>
  <div class="inspection">
    <div class="u-layout-search two u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">出库单号：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="id" :clearable="true" placeholder="请输入出库单号"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">配件名称：</p>
            <div class="input-container">
              <div class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <TreeSelect
                  v-model="sparePartId"
                  placeholder="请选择"
                  :clearable="true"
                  :data="partsType"
                  :defaultProps="defaultProps"
                  @change="getPartKey"
                ></TreeSelect>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <datePick v-model="checkTime" title="操作时间" :defaultStartTime="defaultStartTime"></datePick>
          </div>
        </div>
        <div class="u-layout-left-item">
          <el-button
            class="el-button el-button--primary el-button--small is-round"
            @click="getPartsList"
          >
            <i class="iconfont el-icon-search" style="font-size:14px;"></i>
            查询
          </el-button>
        </div>
      </div>
      <div class="u-layout-right-item">
        <el-button
          class="el-button el-button--primary el-button--small is-round"
          @click="addParts"
          v-if="showAddBtn"
        >
          <i class="iconfont el-icon-plus" style="font-size:14px;"></i>
          新增
        </el-button>
      </div>
    </div>
    <div class="datatable-box">
      <el-table
        :height="tableHeight"
        :data="partsDatalist"
        ref="table"
        class="el-table--border"
        style="width: 100%;"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="50"></el-table-column>
        <el-table-column prop="id" label="出库单号" width="180"></el-table-column>
        <el-table-column prop="relateBill" label="关联工单号"></el-table-column>
        <el-table-column prop="sparePartName" label="出库配件"></el-table-column>
        <el-table-column prop="outAmount" label="金额"></el-table-column>
        <el-table-column prop="receiveId" label="领用人"></el-table-column>
        <el-table-column prop="operatorName" label="操作人"></el-table-column>
        <el-table-column prop="outTime" label="操作时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              @click="seedetails(scope.row)"
              type="text"
              size="small"
              v-if="showDetailBtn"
            >详情</el-button>
            <el-button
              @click="editdetails(scope.row)"
              type="text"
              size="small"
              v-if="showEditBtn"
            >编辑</el-button>
            <el-button
              @click="deleteData(scope.row) "
              type="text"
              size="small"
              v-if="showDeleteBtn"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pager :pager="pager" @query="getPartsList" @setPager="onChangePage"></pager>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">出库单详情</span>
      <warehouseDetail
        :dialogVisible.sync="dialogVisible"
        :detailData="details"
        v-if="dialogVisible"
      ></warehouseDetail>
    </el-dialog>

    <el-dialog :visible.sync="editdialogVisible" width="700px" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">{{title}}</span>
      <editWarehouseInfo
        :editdialogVisible.sync="editdialogVisible"
        :detailData="details"
        :partsType="partsType"
        v-if="editdialogVisible"
        :shopNumber="shopNumber"
        @success="success"
      ></editWarehouseInfo>
    </el-dialog>
  </div>
</template>

<script>
import tableDataList from "@/components/table/tableDataList";
import pager from "@/components/table/Pager";
import datePick from "@/components/timerange/separateTime";
import warehouseDetail from "./WarehouseDetail";
import editWarehouseInfo from "./EditWarehouseInfo";
import datetimeUtils from '@/utils/datetime-utils'
import { getOutStorageList, getSparePartTree, delOutStoraData, getOutStoraDetail } from '@/services/assets.js';
import TreeSelect from '@/components/treeSelect'
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { tableDataList, pager, datePick, warehouseDetail, editWarehouseInfo, TreeSelect },
  data () {
    return {
      id: '',
      sparePartId: '',
      sparePartType: '',
      partsType: [],
      partsList: [],
      checkTime: { start: datetimeUtils.getSpecialDay(datetimeUtils.getPreDate(10), '-'), end: datetimeUtils.getSpecialDay(new Date(), '-') },
      defaultStartTime: datetimeUtils.getPreDate(10),
      shopCode: '',
      partsDatalist: [],
      tableHeight: 400,
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      defaultProps: {
        children: 'children',
        label: 'configName',
        key: 'id',
        disabled: 'disabled'
      },
      dialogVisible: false,
      editdialogVisible: false,
      details: {},
      title: '新增出库单'
    }
  },
  mounted () {
    this.shopCode = this.roleType == 2 ? this.shopNumber : this.curShop.shopNumber;
    if (this.shopCode) {
      this.getPartsType();
      this.getPartsList();
    }
    this.$common.initTableHeight(this);
  },
  computed: {
    roleType: function () {
      return this.$store.getters.getUserInfo.roleType;
    },
    shopNumber: function () {
      return this.$store.getters.shopNumber;
    },
    curShop: function () {
      return this.$store.getters.getCurShop;
    },
  },
  watch: {
    shopNumber (val) {
      this.shopCode = val;
      this.getPartsType();
      this.getPartsList();
    },
    curShop: {
      handler: function (newVal, oldVal) {
        this.shopCode = newVal.shopNumber;
        this.getPartsType();
        this.getPartsList();
      },
      deep: true
    }
  },
  methods: {
    // -----------------按钮权限---------------------
    //显示转单按钮
    showAddBtn () {
      return this.pageBtns.some(val => val == 'add');
    },
    showEditBtn () {
      return this.pageBtns.some(val => val == 'edit');
    },
    showDetailBtn () {
      return this.pageBtns.some(val => val == 'detail');
    },
    showDeleteBtn () {
      return this.pageBtns.some(val => val == 'delete');
    },
    showImportBtn () {
      return this.pageBtns.some(val => val == 'import');
    },
    // -----------------按钮权限结束---------------------
    //初始化界面数据
    getPartsList () {
      getOutStorageList({ id: this.id, sparePartId: this.sparePartId, sparePartType: this.sparePartType, start: this.checkTime.start, end: this.checkTime.end, pageNum: this.pager.pageNum, pageSize: this.pager.pageSize, shopNumber: this.shopCode }).then(res => {
        this.partsDatalist = res.data.list || [];
        this.pager.total = res.data.total || 0;
      }).catch(err => {
        console.log(err)
      })
    },
    getPartsType () {
      getSparePartTree({ shopNumber: this.shopCode }).then(res => {
        this.partsType = res.data || []
      })
    },
    getPartKey (node, data) {
      this.sparePartId = data.isSparePart ? data.id : '';
      this.sparePartType = data.isSparePart ? '' : data.id
    },
    onChangePage (val) {
      this.pager.pageNum = val.pageNum;
      this.pager.pageSize = val.pageSize;
    },
    seedetails (item) {
      this.getInfo(item.id);
      this.dialogVisible = true;
    },
    addParts () {
      this.title = "新增出库单";
      this.editdialogVisible = true
    },
    editdetails (item) {
      this.title = "编辑出库单"
      this.getInfo(item.id);
      this.editdialogVisible = true;
    },
    getInfo (id) {
      getOutStoraDetail({ id: id }).then(res => {
        this.details = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    deleteData (item) {
      this.$confirm(`确认删除这条数据吗?`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        delOutStoraData({ id: item.id }).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功")
            this.getPartsList()
          } else {
            this.$message.success("删除失败")
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        });
      });
    },
    success () {
      this.getPartsList()
    }
  }
}
</script>
<style scoped lang="scss">
.warn {
  color: red;
}
</style>

