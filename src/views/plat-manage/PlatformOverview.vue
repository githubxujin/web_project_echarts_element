<template>
  <div class="inspection">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">门店名称：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <el-input v-model="name" :clearable="true" placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">门店类型：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <!--el-ui 根据需求增加配置-->

                <el-select v-model="shopType" :clearable="true" placeholder="请选择">
                  <el-option
                    v-for="item in shopoptions"
                    :key="item.id"
                    :label="item.configName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item" style="padding-right:0px">
          <div class="title-input-group">
            <p class="text">所属区域：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <el-select
                  v-model="regiona"
                  :clearable="true"
                  placeholder="大区"
                  @change="getAreaList(regiona, 'regionp')"
                >
                  <el-option
                    v-for="(item,index) in regionaList"
                    :key="index"
                    :label="item.cityName"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <div></div>
              </div>
            </div>
          </div>
        </div>

        <div class="u-layout-left-item" style="padding-left:-5px;padding-right:0px">
          <div class="title-input-group">
            <p class="text">&nbsp;</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <el-select
                  v-model="regionp"
                  :clearable="true"
                  placeholder="省"
                  @change="getAreaList(regionp, 'regionn')"
                >
                  <el-option
                    v-for="(item,index) in regionpList"
                    :key="index"
                    :label="item.cityName"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item" style="padding-left:-5px;padding-right:0px">
          <div class="title-input-group">
            <p class="text">&nbsp;</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <el-select v-model="regionn" :clearable="true" placeholder="市">
                  <el-option
                    v-for="(item,index) in regionnList"
                    :key="index"
                    :label="item.cityName"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item" style="padding-top:5px;margin-left:-15px;">
          <div class="title-input-group">
            <datePick v-model="check_Time" title="录入时间" type="daterange" @changeTime="changeTime"></datePick>
          </div>
        </div>
        <div class="u-layout-left-item">
          <el-button
            class="el-button el-button--primary el-button--small is-round"
            icon="el-icon-search"
            @click="query"
          >查询</el-button>
        </div>
      </div>

      <div class="u-layout-right-item">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          v-if="pageBtns.some(val=>val=='add')"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <div class="datatable-box">
      <el-table
        :data="list"
        :height="tableHeight"
        ref="table"
        class="el-table--border"
        style="width: 100%;"
      >

        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>

        <el-table-column prop="number" label="门店编号" width="180"></el-table-column>
        <el-table-column prop="name" label="门店名称"></el-table-column>
        <el-table-column prop="area" label="面积"></el-table-column>
        <el-table-column prop="shopTypeName" label="门店类型"></el-table-column>
        <el-table-column prop="regionAName" label="所属区域" width="280">
          <template slot-scope="scope">
            <span>{{scope.row.regionAName}} {{scope.row.regionPName}} {{scope.row.regionNName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="leadingPerson" label="负责人"></el-table-column>

        <el-table-column prop="leadingPhone" label="联系电话"></el-table-column>

        <el-table-column prop="createTime" label="录入时间"></el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              @click="seedetails(scope.row)"
              type="text"
              v-if="pageBtns.some(val=>val=='detail')"
              size="small"
            >详情</el-button>
            <el-button
              @click="editdetails(scope.row)"
              type="text"
              v-if="pageBtns.some(val=>val=='edit')"
              size="small"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pager :pager="pager" @query="query" @setPager="setPager"></pager>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">门店详情</span>
      <PlatformOverviewDetails
        :dialogVisible.sync="dialogVisible"
        :details="details"
        v-if="dialogVisible"
      ></PlatformOverviewDetails>
    </el-dialog>

    <el-dialog :visible.sync="editdialogVisible" width="40%" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">{{dialogTitle}}</span>
      <EditPlatformOverview
        :editdialogVisible.sync="editdialogVisible"
        :details="details"
        v-if="editdialogVisible"
      ></EditPlatformOverview>
    </el-dialog>
  </div>
</template>

<script>
import datePick from "@/components/timerange/datePick";
import tableDataList from "@/components/table/tableDataList";
import pager from "@/components/table/Pager";
import datetimeUtils from '@/utils/datetime-utils.js';
import { configTypeQuery } from '@/services/system-settings.js'
import { getcityListQuery, getCityList, getShopList } from '@/services/plat-manage';
import PlatformOverviewDetails from './PlatformOverviewDetails'
import EditPlatformOverview from './EditPlatformOverview'
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { datePick, tableDataList, pager, PlatformOverviewDetails, EditPlatformOverview },
  data () {
    return {
      details: {},
      name: '', shopTypeName: '', dialogVisible: false, editdialogVisible: false, regiona: '', regionp: '', regionn: '', dialogTitle: '',
      regionaList: [],
      regionpList: [],
      regionnList: [],
      list: [], tableHeight: 400,
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      shopoptions: [
      ],
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '一级',
        label: '一级'
      }
        , {
        value: '二级',
        label: '二级'
      }
        , {
        value: '三级',
        label: '三级'
      }, {
        value: '四级',
        label: '四级'
      }, {
        value: '五级',
        label: '五级'
      }
      ],
      shopType: '', check_Time: '', inputTimeStart: '', inputTimeEnd: '',
      pager: {
        total: 0,
        pageSize: 10,
        pageNum: 0
      }
    }
  }

  , created () {

  }, mounted () {
    this.inputTimeStart = datetimeUtils.GMTToStr(datetimeUtils.getPreDate(12)).toString().split(" ")[0] + ' 0:0:0';
    this.inputTimeEnd = datetimeUtils.GMTToStr(new Date()).toString().split(" ")[0] + ' 23:59:59';
    this.getArea();
    this.query();
    this.$common.initTableHeight(this);
  },
  methods: {
    getArea () {
      configTypeQuery({ configType: 56 }).then((res) => {
        this.shopoptions = res.data[56];
        this.shopoptions.unshift({ configName: '全部', id: '' })
      }).catch((error) => {
        console.log(error)
      });

      getcityListQuery({ areaId: 100000 }).then((res) => {
        this.regionaList = res.data.array;
      }).catch((error) => {
        console.log(error)
      });
    }, numerical (i) {
      return i;    },
    query () {
      let topShopNumers = '', that = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumers += v;
        if (that.checkedShopNumbers.length - 1 != i) {
          topShopNumers += ','
        }
      });
      getShopList({
        number: "",
        "name": this.name,
        "shopType": this.shopType,
        "regiona": this.regiona,
        "regionp": this.regionp,
        "regionn": this.regionn,
        "inputTimeStart": this.inputTimeStart,
        "inputTimeEnd": this.inputTimeEnd,
        "pageNum": this.pager.pageNum,
        "pageSize": this.pager.pageSize
      }).then((res) => {
        this.pager.total = res.data.total;
        this.list = res.data.list;
      }).catch((error) => {
        console.log(error)
      });
    },
    changeTime (start, end) {
      this.inputTimeStart = start ? start + ' 0:0:0' : '';
      this.inputTimeEnd = end ? end + ' 23:59:59' : '';
    },
    get_Data () {
      this.isdata = true;
    },
    getCharts () {
      this.isdata = false;
    }, seedetails (item) {
      this.details = item;
      this.dialogVisible = true;
    }, editdetails (item) {
      this.dialogTitle = '编辑门店';
      this.details = item;
      this.editdialogVisible = true;
    },
    getAreaList (obj, type) {
      if (type == 'regionp') {
        this.regionpList = [];
        this.regionp = ''; this.regionnList = []; this.regionn = '';
        if (obj) {
          getcityListQuery({ areaId: obj }).then((res) => {
            this.regionpList = res.data.array;
          }).catch((error) => {
            console.log(error)
          });        }
      }
      else if (type == 'regionn') {
        this.regionnList = []; this.regionn = '';
        if (obj) {
          getcityListQuery({ areaId: obj }).then((res) => {
            this.regionnList = res.data.array;
          }).catch((error) => {
            console.log(error)
          });
        }      }
    }, add () {
      this.dialogTitle = '新增门店';
      this.details = {};
      this.editdialogVisible = true;
    } //分页
    , setPager (val) {
      this.pager.pageSize = val.pageSize;
      this.pager.pageNum = val.pageNum;
    }, test () {
      let a = this.regionn;
    },
    indexMethod (index) { // 序号
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    }
  },
  watch: {
    editdialogVisible: {
      handler: function (newval, oldval) {
        if (newval.length >= 3 && oldval == true) {
          this.editdialogVisible = false;
          this.checkedShopNumbers.push(newval);
          this.query();
        } else {
          this.query();
        }
      },
      checkedShopNumbers: {
        handler (val) {
          this.query();
        },
        deep: true
      }
    }
  }
}
</script>
