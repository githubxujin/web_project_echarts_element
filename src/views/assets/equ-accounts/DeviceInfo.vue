<template>
  <div class="inspection">
    <div class="u-layout-search two u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">设备名称：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="deviceName" :clearable="true" placeholder="请输入设备名称"></el-input>
              </div>
            </div>
          </div>
        </div>

        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">设备类型：</p>
            <tree-select
              v-model="deviceType"
              placeholder="请选择设备类型"
              :clearable="true"
              :data="treeData"
              :defaultProps="defaultProps"
              :onlyLeafSelect="true"
            ></tree-select>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">品牌：</p>
            <div class="input-container">
              <div class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select v-model="brand" placeholder="请选择品牌" clearable>
                  <el-option
                    v-for="item in brandArr"
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
          <div class="title-input-group">
            <p class="text">状态：</p>
            <div class="input-container">
              <div class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-select v-model="deviceStatus" placeholder="请选择" clearable @clear="getAll">
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
            @click="getDeviceList"
          >
            <i class="iconfont el-icon-search" style="font-size:14px;"></i>
            查询
          </el-button>
        </div>
      </div>
      <div class="u-layout-right-item">
        <el-button
          class="el-button el-button--primary el-button--small is-round"
          @click="addDevice"
          v-if="showAddBtn"
        >
          <i class="iconfont el-icon-plus" style="font-size:14px;"></i>
          新增
        </el-button>
        <el-button
          class="el-button el-button--primary el-button--small is-round"
          @click="showLedger"
          v-if="showAddBtn"
        >台账统计</el-button>

        <el-button
          style="background: #f3f5fa;color:#222222"
          v-if="showImportBtn"
          @click="$common.debounce(importDevice)()"
        >
          <i class="iconfont icon-xiazai-copy" style="color:#969ba6, margin-right:5px;"></i>导入设备
        </el-button>
      </div>
    </div>
    <div class="datatable-box">
      <el-table
        :height="tableHeight"
        :data="list"
        ref="table"
        class="el-table--border"
        style="width: 100%;"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="50"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" width="180"></el-table-column>
        <el-table-column prop="deviceTypeStr" label="设备类型"></el-table-column>
        <el-table-column prop="deviceModel" label="规格型号"></el-table-column>
        <el-table-column prop="installAddress" label="位置"></el-table-column>
        <el-table-column prop="brand" label="品牌"></el-table-column>
        <el-table-column prop="deviceStatusStr" label="状态">
          <template slot-scope="scope">
            <span
              :class="{warn:scope.row['deviceStatusStr']=='维修中'}"
            >{{scope.row['deviceStatusStr']}}</span>
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
            <el-popover placement="bottom" width="150" trigger="click">
              <!-- <canvas style="width:200px;" :id="'canvas'+scope.row.id"></canvas> -->
              <div
                v-loading="loading"
                style="width:150px;height:150px;"
                :id="'qrCode' + scope.row.id"
                :ref="'qrCode' + scope.row.id"
              ></div>
              <el-button
                slot="reference"
                @click="returnCode(scope.row)"
                type="text"
                size="small"
                v-if="showEditBtn"
              >二维码</el-button>
            </el-popover>

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
      <pager :pager="pager" @query="getDeviceList" @setPager="onChangePage"></pager>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">设备详情</span>
      <deviceinfodetails
        :dialogVisible.sync="dialogVisible"
        :tabInfoDetail="tabInfoDetail"
        :details="details"
        v-if="dialogVisible"
      ></deviceinfodetails>
    </el-dialog>

    <el-dialog :visible.sync="editdialogVisible" width="900px" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">{{title}}</span>
      <editdeviceinfo
        :editdialogVisible.sync="editdialogVisible"
        :details="details"
        :tabInfoDetail="tabInfoDetail"
        v-if="editdialogVisible"
        :deviceList="treeData"
        :brandList="brandList"
        :shopNumber="shopNumber"
        @success="success"
      ></editdeviceinfo>
    </el-dialog>

    <!-- 台账统计弹窗 -->
    <el-dialog :visible.sync="LedgerDialogVisible" width="50%" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">台账统计</span>
      <ledger-statistic
        :deviceList="treeData"
        :LedgerDialogVisible.sync="LedgerDialogVisible"
        :shopNumber="shopNumber"
      ></ledger-statistic>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog
      :visible.sync="importDialogVisible"
      width="500px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">导入设备</span>
      <device-import ref="deviceImport" :importDialogVisible.sync="importDialogVisible"></device-import>
    </el-dialog>
  </div>
</template>

<script>
import tableDataList from "@/components/table/tableDataList";
import pager from "@/components/table/Pager";
import deviceinfodetails from './DeviceInfoDetails'
import editdeviceinfo from './EditDeviceInfo'
import TreeSelect from '@/components/treeSelect';
import deviceImport from './DeviceImport';
import LedgerStatistic from './LedgerStatistic'
import { getDeviceTypeTree } from '@/services/operation.js';
import { getDeviceList, getBrand, getInfo, delDevice } from '@/services/assets.js';
import baseOptions from '@/utils/baseOptions';
// import QRCode from 'qrcode';
import QRCode from 'qrcodejs2';
export default {
  extends: baseOptions,
  components: { tableDataList, pager, deviceinfodetails, editdeviceinfo, TreeSelect, deviceImport, LedgerStatistic },
  data () {
    return {
      brand: '',
      brandList: [],
      brandArr: [],
      deviceName: '',
      deviceType: '',
      deviceStatus: -1,
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      status: [
        { value: -1, label: '全部' },
        { value: 0, label: '使用中' },
        { value: 1, label: '维修中' },
        { value: 2, label: '已报废' }
      ],
      dialogVisible: false,
      title: '设备新增',
      details: {},
      tabInfoDetail: {},
      tableHeight: 400,
      editdialogVisible: false,
      LedgerDialogVisible: false,
      list: [],
      isdata: false,
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      importDialogVisible: false,
      loading: false
    }
  },
  created () {
    this.initData();
    this.getDeviceList();
    this.getBrand();
  },
  mounted () {
    this.$common.initTableHeight(this);
  },
  computed: {
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
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
  },
  methods: {

    //初始化界面数据
    initData () {

      getDeviceTypeTree().then(res => {
        if (res.code == 200) {
          this.treeData = res.data.array;
          console.log(this.treeData)
        } else {
          this.treeData = [];
        }
      })
    },
    getDeviceList () {
      let type = this.deviceType ? this.deviceType.split(',')[0] : '';
      getDeviceList({ brand: this.brand, deviceName: this.deviceName, deviceStatus: this.deviceStatus, deviceType: type, pageNum: this.pager.pageNum, pageSize: this.pager.pageSize, shopNumber: this.shopNumber }).then(res => {
        if (res.code == 200) {
          this.pager.total = res.data.total;
          this.list = res.data.list
        } else {
          this.pager.total = 0;
          this.list = []
        }
      })
    },
    getAll () {
      this.deviceStatus = -1;
    },
    getBrand () {
      getBrand().then(res => {
        this.brandList = res.code == 200 ? res.data.array : [];
        this.brandArr = JSON.parse(JSON.stringify(this.brandList))
        this.brandArr.unshift({ value: '', label: '全部' })
      })
    },
    getCharts () {
      this.isdata = false;
    },//分页
    onChangePage (val) {
      this.pager.pageNum = val.pageNum;
      this.pager.pageSize = val.pageSize;
    },
    importDevice () {
      this.importDialogVisible = true;
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs.deviceImport && this.$refs.deviceImport.cancle()
    },
    seedetails (item) {
      this.getInfo(item.id);
      this.dialogVisible = true;
    },
    addDevice () {
      this.title = "设备新增";
      this.details = {};
      this.tabInfoDetail = {};
      this.editdialogVisible = true
    },
    showLedger () {
      this.LedgerDialogVisible = true;
    },
    editdetails (item) {
      this.title = "设备编辑"
      this.getInfo(item.id);
      this.editdialogVisible = true;
    },
    returnCode (item) {
      this.loading = true;
      document.getElementById('qrCode' + item.id).innerHTML = "";
      const dom = this.$refs['qrCode' + item.id];
      if (dom) dom.innerHTML = "";
      getInfo(item.id).then(res => {
        let details = res.data.basic;
        setTimeout(_ => {
          this.loading = false;
          // let text = `
          //   <span>设备名称：${details.deviceName}</span><br/>
          //   <span>设备编号：${details.deviceNumber}</span><br/>
          //   <span>规格型号：${details.deviceModel}</span><br/>
          //   <span>使用部门：${details.useOrgIdStr}</span><br/>
          //   <span>品牌：${details.brand}</span><br/>
          //   <span>生产厂家：${details.factoryName}</span><br/>
          //   <span>投入日期：${details.useTimeStr}</span><br/>
          // `
          let text = `
            设备名称：${details.deviceName || ''}\n设备编号：${details.deviceNumber || ''}\n设备类型：${details.deviceTypeStr || ''}\n规格型号：${details.deviceModel || ''}\n使用部门：${details.useOrgIdStr || ''}\n品牌：${details.brand || ''}\n生产厂家：${details.factoryName || ''}\n投入日期：${details.useTimeStr || ''}
          `

          new QRCode(this.$refs['qrCode' + item.id], {
            text,
            width: 150,
            height: 150,
            colorDark: "#333333", //二维码颜色
            colorLight: "#ffffff", //二维码背景色
            correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
          })
        }, 100)
      }).catch(err => {
        console.log(err)
      })
    },
    getInfo (id) {
      getInfo(id).then(res => {
        this.details = res.data.basic;
        this.tabInfoDetail = res.data.detail
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
        delDevice(item.id).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功")
            this.getDeviceList()
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
      this.getDeviceList()
    }
  }
}
</script>
<style scoped lang="scss">
.warn {
  color: red;
}
/deep/ .el-popover {
  display: flex;
  justify-content: center;
}
</style>

