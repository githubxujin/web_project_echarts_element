<template>
  <div class="inspection">
    <div class="u-layout-search two u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">关键字：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="keyword" :clearable="true" placeholder="请输入编号/名称"></el-input>
              </div>
            </div>
          </div>
        </div>

        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">配件类型：</p>
            <div class="input-container">
              <div class="item select-input">
                <TreeSelect
                  v-model="type"
                  placeholder="请选择"
                  :clearable="true"
                  :data="partsType"
                  :defaultProps="defaultProps"
                ></TreeSelect>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">库存状态：</p>
            <div class="input-container">
              <div class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select v-model="stockStatus" placeholder="请选择" clearable @clear="getAll">
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
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
        <el-table-column prop="number" label="配件编码" width="180"></el-table-column>
        <el-table-column prop="name" label="配件名称"></el-table-column>
        <el-table-column prop="type" label="配件类型"></el-table-column>
        <el-table-column prop="specification" label="规格型号"></el-table-column>
        <el-table-column prop="unitName" label="单位"></el-table-column>
        <el-table-column prop="stock" label="当前库存"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-show="scope.row.status==0">启用</span>
            <span v-show="scope.row.status==1">禁用</span>
          </template>
        </el-table-column>
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

    <el-dialog :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">配件详情</span>
      <partsDetail
        :dialogVisible.sync="dialogVisible"
        :detailData="detailData"
        v-if="dialogVisible"
      ></partsDetail>
    </el-dialog>

    <el-dialog :visible.sync="editdialogVisible" width="650px" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">{{title}}</span>
      <editPartsInfo
        :editdialogVisible.sync="editdialogVisible"
        :detailData="detailData"
        v-if="editdialogVisible"
        :shopNumber="shopNumber"
        :partsType="partsType"
        @success="success"
      ></editPartsInfo>
    </el-dialog>
  </div>
</template>

<script>
import tableDataList from "@/components/table/tableDataList";
import pager from "@/components/table/Pager";
import partsDetail from "./PartsDetail";
import editPartsInfo from "./EditPartsInfo";
import { queryList, delParts, getDetail } from '@/services/assets.js';
import { configTypeTreeQuery } from '@/services/system-settings';
import TreeSelect from '@/components/treeSelect'
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { tableDataList, pager, partsDetail, editPartsInfo, TreeSelect },
  data () {
    return {
      partsType: [],
      status: [
        { value: 1, label: '全部' },
        { value: 2, label: '高于警戒线' },
        { value: 3, label: '低于警戒线' }
      ],
      keyword: '',
      stockStatus: 1,
      type: '',
      defaultProps: {
        children: 'children',
        label: 'configName',
        key: 'id',
        disabled: 'disabled'
      },
      partsDatalist: [],
      tableHeight: 400,
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      dialogVisible: false,
      detailData: {},
      title: '新增配件',
      editdialogVisible: false,
      shopCode: ''
    }
  },
  created () {
    this.shopCode = this.roleType == 2 ? this.shopNumber : this.curShop.shopNumber;
    if (this.shopCode) {
      this.getPartsList();
    }
    this.getPartsType();
  },
  mounted () {
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
      this.getPartsList()
    },
    curShop: {
      handler: function (newVal, oldVal) {
        this.shopCode = vanewVal.shopNumber;
        this.getPartsList()
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
      queryList({ keyword: this.keyword, pageNum: this.pager.pageNum, pageSize: this.pager.pageSize, shopNumber: this.shopCode, stockStatus: this.stockStatus, type: this.type }).then(res => {
        if (res.code == 200) {
          this.partsDatalist = res.data.list;
          this.pager.total = res.data.total;
        } else {
          this.partsDatalist = [];
          this.pager.total = 0;
        }
      })
    },
    getPartsType () {
      configTypeTreeQuery({ configType: 99 }).then(res => {
        this.partsType = (res.data || {})[99] || []
      })
    },
    getAll () {
      this.stockStatus = 1;
    },
    onChangePage (val) {
      this.pager.pageNum = val.pageNum;
      this.pager.pageSize = val.pageSize;
    },
    seedetails (item) {
      getDetailgetDetail({ id: item.id }).then(res => {
        this.detailData = res.data
      }).catch(err => {
        console.log(err)
      })
      this.dialogVisible = true;
    },
    addParts () {
      this.title = "新增备件";
      this.detailData = {}
      this.editdialogVisible = true
    },
    editdetails (item) {
      this.title = "编辑备件"
      this.detailData = item
      this.editdialogVisible = true;
    },
    deleteData (item) {
      this.$confirm(`确认删除这条数据吗?`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        delParts({ id: item.id }).then(res => {
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

