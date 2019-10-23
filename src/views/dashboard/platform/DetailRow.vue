<template>
  <div>
    <div class="div-row">
      <!-- <el-tooltip placement="bottom" popper-class="i-popper">
        <div slot="content">
          {{item.shopName}}
          <br>
          报警类别：{{alarmSystem[item.alarmType]}}
          <br>
          报警名称：{{item.alarmName}}
          <br>
          报警时间：{{item.alarmTime|timeFormat}}
          <br>
          处理状态： {{alarmStatusText(item.status)}}
          <br>
          处理人：{{item.handler}}
        </div>
        <span class="i-info fl">{{item.shopName}}—{{item.alarmName}}</span>
      </el-tooltip>-->
      <span
        class="i-info fl"
        :title="item.shopName+'—'+item.alarmName"
        @click="goToPage(item)"
      >{{item.shopName}}—{{item.alarmName}}</span>
      <span class="i-datetime fl">{{item.alarmTime|timeFormat}}</span>
      <span class="iconfont fl i-icon" :class="alarmSystemIcon[item.alarmType]"></span>
      <status-button :text="item.status"></status-button>
      <level-button :text="item.alarmLevel"></level-button>
    </div>
  </div>
</template>

<script>
import LevelButton from '../../../components/form/LevelButton';
import StatusButton from '../../../components/form/StatusButton';
import { alarmStatus, alarmSystem, alarmSystemIcon } from '../../../enum/alarm-enum.js';

export default {
  components: {
    LevelButton,
    StatusButton,
  },
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      items: [],
      alarmSystemIcon,
      alarmSystem
    }
  },
  created () {
  },
  methods: {
    //跳转到新页面
    goToPage () {
      // console.log(this.item);
      // return;
      this.$store.commit('base/updateCurShop', { shopId: this.item.shopId, shopNumber: this.item.shopNumber, shopName: this.item.shopName });
      // this.$router.push({ path: '/safety/alarm/view', name: 'AlarmView', params: { referer: 'index', id: this.item.id } });
      this.$common.jumpShopIndex(this, this.item.shopNumber, 'alarm-detail', this.item.id);
    },
    alarmStatusText (val) {
      return alarmStatus[val];
    },
  }
}
</script>
<style>
.el-tooltip__popper.is-dark.i-popper {
  line-height: 25px;
  background: rgba(0, 0, 0, 0.7);
}
</style>

<style lang="scss" scoped>
.div-row {
  display: block;
  height: 50px;
}
.div-row div {
  float: right;
  margin: 0px 12px;
}
.div-row div.i-level-btn {
  margin-left: 0px;
}
.i-info {
  width: 168px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: #0090e5;
  }
}
.i-datetime {
  width: 132px;
  text-align: center;
}
.i-icon {
  font-size: 24px;
  width: 46px;
  text-align: center;
}
.el-link.el-link--default {
  float: left;
  line-height: 24px;
  height: 24px;
  margin-top: 13px;
  color: #e6efff;
  &:hover {
    color: #1ea9fb;
    // .el-link.el-link--default::after {
    //   background-color: #1ea9fb !important;
    // }
  }
}
</style>