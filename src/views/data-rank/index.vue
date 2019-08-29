<template>
  <div class="p-container">
    <div class="sub-nav">
      <el-tabs v-model="activeIndex"
               @tab-click="handleClick">
        <!-- lazy -->
        <el-tab-pane v-for="item in tabsData"
                     :label="item.title"
                     :name="item.index"
                     :key="item.index">
          <template v-if="item.index==activeIndex">
            <router-view></router-view>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import AlarmLevel from './AlarmLevel.vue'
import ResponseTime from './ResponseTime.vue'
import EquonLine from './EquOnline.vue'
export default {
  components: { AlarmLevel, ResponseTime, EquonLine },
  data () {
    return {
      activeIndex: '/data-rank/AlarmLevel',
      tabsData: [{ index: '/data-rank/AlarmLevel', title: '报警级别排名' }, { index: '/data-rank/ResponseTime', title: '响应时间排名' }, { index: '/data-rank/EquOnline', title: '设备在线排名' }]
    };
  },
  watch: {
    '$route': function (to, from) { // 路由改变时执行
      this.activeIndex = this.$route.path;
    }
  },
  created () {
    this.activeIndex = this.$route.path;
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
      // this.activeIndex = tab.name;
      this.$router.push({ path: this.activeIndex });
    }
  }
};
</script>

<style lang="scss" scoped>
/*/deep/ .sub-nav {*/
/*height: 100%;*/
/*line-height: 10px;*/
/*border-radius: 5px;*/
/*display: block;*/
/*background-color: white;*/
/*}*/

/deep/ .el-input__inner {
  border-radius: 3px !important;
  background: #ffffff;
  border-color: #ffffff;
}
</style>

