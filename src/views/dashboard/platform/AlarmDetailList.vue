<template>
  <div class="alarm-detail-list">
    <div class="datatable-box">
      <div class="u-layout-search u-layout-dobule">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">门店名称：</p>
            <Projecttree v-model="treeData" :allChecked="false" :anotherStyle="false"></Projecttree>
          </div>
          <div class="title-input-group u-title-input-group">
            <p class="text">报警名称：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="searchOptions.alarmName" placeholder="报警名称" clearable></el-input>
              </div>
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
      <el-table
        v-loading="loading"
        :element-loading-text="$baseConfig.loading.text"
        :element-loading-spinner="$baseConfig.loading.spinner"
        :element-loading-background="$baseConfig.loading.background"
        :data="tableData"
        :height="tableHeight"
        @sort-change="sortChange"
        border
        style="width: 100%"
        ref="table"
      >
        <el-table-column prop="shopName" label="门店名称"></el-table-column>
        <el-table-column prop="alarmName" label="报警名称" width="130">
          <template slot-scope="scope">
            <el-link
              class="ellipse"
              type="primary"
              :title="scope.row.alarmName"
              @click="goToPage(scope.row)"
            >{{scope.row.alarmName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="报警时间" align="center" sortable="custom" prop="alarmTime">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.alarmTime |timeFormat }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="alarmType" label="报警类别" align="center">
          <template slot-scope="scope">
            <span class="iconfont i-icon" :class="alarmSystemIcon[scope.row.alarmType]"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="报警级别"
          width="100"
          align="center"
          sortable="custom"
          prop="alarmLevel"
        >
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <level-button :text="scope.row.alarmLevel"></level-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="处理状态" width="100" align="center" sortable="custom" prop="status">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <status-button :text="scope.row.status"></status-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="handler" label="处理人" align="center"></el-table-column>
        <el-table-column label="响应时间" align="center" sortable="custom" prop="responseTimeLength">
          <template slot-scope="scope">{{scope.row.responseTimeLengthStr}}</template>
        </el-table-column>
      </el-table>
      <Pager :pager="pager" @query="getItemList"></Pager>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <!-- <el-button type="primary" @click="isHide">确 定</el-button> -->
        <el-button @click="isHide">关 闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAlarmList } from '@/services/dashboard';
import LevelButton from '../../../components/form/LevelButton';
import StatusButton from '../../../components/form/StatusButton';
import { alarmStatus, alarmSystem, alarmSystemIcon } from '../../../enum/alarm-enum.js';
import Projecttree from '@/components/projecttree/index.js';
import Pager from '@/components/table/Pager'
export default {
  components: {
    LevelButton,
    StatusButton,
    Pager,
    Projecttree
  },
  data () {
    return {
      loading: false,
      btnLoading: false,
      tableHeight: 400,
      searchOptions: {
        shopNumber: '', pageNum: 1, pageSize: 15, alarmName: '',
        orderType: '', orderField: '', status: '0,2'
      },
      alarmSystemIcon,
      tableData: [],
      pager: {
        total: 100,
        pageNum: 1,
        pageSize: 15,
      },
      treeData: [],
    }
  },
  watch: {
    treeData: {
      handler: function (val) {
        if (val) {
          this.searchOptions.shopNumber = val.join(',')
        }
      }
    }
  },
  created () {
    console.log('created :', this.checkedShopNumbers);
    if (this.checkedShopNumbers) { //记录选中状态
      this.treeData = this.checkedShopNumbers;
      // this.$refs.elTree.setCheckedNodes(this.checkedShopNumbers);
    }
    this.getItemList();
  },
  computed: {
    checkedShopNumbers () {
      return this.$store.getters.getCheckedShopNumbers;
    }
  },
  methods: {
    getItemList () {
      this.ctrlLoading(true);
      this.searchOptions.pageNum = this.pager.pageNum;
      this.searchOptions.pageSize = this.pager.pageSize;
      console.log('searchOptions', this.searchOptions)
      //待解决报警详情
      getAlarmList(this.searchOptions).then((res) => {
        console.log('res', res)
        this.tableData = res.data.list;
        this.pager.total = res.data.total;
        if (this.tableData.length == 0) {
          this.tableData = null;
        }
        this.ctrlLoading(false);
      }).catch(() => {
        this.ctrlLoading(false);
      });
    },
    //排序变化
    sortChange (data) {
      console.log('data', data);
      if (data.prop) {
        this.searchOptions.orderType = data.order == 'ascending' ? 'asc' : 'desc';
        this.searchOptions.orderField = data.prop;
        this.getItemList();
      }
    },
    ctrlLoading (flag) {
      this.btnLoading = flag;
      this.loading = flag;
    },
    //关闭
    isHide () {
      this.$emit('isHideMore');
    },
    //页面跳转
    goToPage (item) {
      this.$store.commit('base/updateCurShop', { shopId: item.shopId, shopNumber: item.shopNumber, shopName: item.shopName });
      // this.$router.push({ path: '/safety/alarm/view', name: 'AlarmView', params: { referer: 'index', id: item.id } });
      this.$common.jumpShopIndex(this, item.shopNumber, 'alarm-detail', item.id);
    },
  }
}
</script>

<style lang="scss" scoped>
.u-layout-search {
  padding: 0 0px 10px 0px;
  .u-layout-left-item {
    padding: 0px 30px 0 0;
  }
}
.ellipse {
  /deep/ .el-link--inner {
    width: 108px;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>
