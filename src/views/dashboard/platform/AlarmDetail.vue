<template>
  <div>
    <card-head @lookMore="lookMore()"></card-head>
    <div
      class="i-row"
      v-loading="loading"
      :element-loading-text="$baseConfig.loading.text"
      :element-loading-spinner="$baseConfig.loading.spinner"
      :element-loading-background="$baseConfig.loading.background"
    >
      <template v-if="items!=null">
        <transition-group name="el-zoom-in-center" tag="div">
          <el-row class="i-line" v-for="item in items" :key="item.id">
            <detail-row :item="item"></detail-row>
          </el-row>
        </transition-group>
      </template>
      <template v-else>
        <empty-data msg="门店运行良好，无安全隐患，请继续保持哦" height="450px"></empty-data>
      </template>

      <!-- <el-row class="i-line">
        <span class="i-info fl">湖北武汉——创世纪商业城中心</span>
        <span class="i-datetime fl">03-19 12:22:06</span>
        <span class="iconfont nhjc-shebeijiance fl i-icon"></span>
        <status-button text="3"></status-button>
        <level-button text="2"></level-button>
      </el-row>-->
    </div>
    <el-dialog
      v-dialogDrag
      title="待解决报警详情"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="isShowMore"
      width="960px"
    >
      <alarm-detail-list v-if="isShowMore" @isHideMore="isShowMore=false"></alarm-detail-list>
    </el-dialog>
  </div>
</template>

<script>
import CardHead from './CardHead';
import LevelButton from '../../../components/form/LevelButton';
import StatusButton from '../../../components/form/StatusButton';
import { getAlarmList } from '@/services/dashboard';
import EmptyData from '../../../components/form/EmptyData';
import AlarmDetailList from './AlarmDetailList';
import DetailRow from './DetailRow'

export default {
  props: {
    shopNumber: {
      type: String,
      default: ''
    }
  },
  components: {
    CardHead,
    LevelButton,
    StatusButton,
    EmptyData,
    AlarmDetailList,
    DetailRow
  },
  data () {
    return {
      loading: true,
      isShowMore: false,
      items: []
    }
  },
  watch: {
    shopNumber: function (val) {
      // console.log('shopNumber', val)
      this.initData(val);
    }
  },
  created () {
    // this.initData()
  },
  methods: {
    //数据更新
    updateDetailData (res) {
      this.items = res.data.list;
      if (this.items.length == 0) {
        this.items = null;
      }
    },
    initData (shopNumber) {
      //待解决报警详情
      getAlarmList({ pageNum: 0, pageSize: 9, shopNumber: shopNumber, status: '0,2' }).then((res) => {
        console.log('res', res)
        this.updateDetailData(res);
        this.loading = false;
      }).catch((error) => {
        console.log(error)
        this.loading = false;
      });
    },
    //查看更多
    lookMore () {
      console.log('查看更多')
      this.isShowMore = true;
    },
  }
}
</script>

<style lang="scss" scoped>
// @import '@/assets/scss/variables.scss';
.i-row {
  min-height: 450px;
  .el-row {
    color: $fontColor;
    height: 50px;
    line-height: 50px;
    .i-status-btn {
      margin-right: 0px;
    }
    // cursor: pointer;
    &:hover {
      background-color: #384a5c;
    }
  }
  .i-line {
    &:after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0px;
      height: 1px;
      content: '';
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      background-color: #3c6581;
      width: 100%;
    }
  }
  .bottom {
    clear: both;
    text-align: center;
  }
}
/deep/ .u-layout-empty {
  .img,
  .info {
    color: white;
  }
}
</style>