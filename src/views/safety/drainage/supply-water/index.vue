<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="给水系统" name="default">
          <keep-alive>
            <SupplyWater></SupplyWater>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import SupplyWater from './SupplyWater.vue'
export default {
  components: { SupplyWater },
  data () {
    return {
      activeName: 'default'
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/safety/drainage/out-water') {
      this.$store.state.drainage.websocket && this.$store.state.drainage.websocket.close()
      this.$store.commit('drainage/updateWebsocket', null)
    }
    next();
  }
};
</script>

<style lang="scss" scoped>
.supply-water {
  position: relative;
  text-align: center;
  min-height: 200px;
  .basic-table {
    position: absolute;
    top: 0;
    left: 0;
    border-collapse: collapse;
    border-spacing: 0;
    td {
      padding: 0 20px;
      &.error {
        color: #f0213e;
      }
    }
    tr {
      &.thead {
        background: #b4bbc5;
      }
      &:nth-child(odd),
      &:hover:not(.thead) {
        background: #f2f2f2;
      }
    }
  }
}
</style>
