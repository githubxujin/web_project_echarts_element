<template>
  <div class="p-container">
    <div class="sub-nav">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="平面图" name="plane">
          <keep-alive>
            <Plane v-if="activeName === 'plane'"></Plane>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="示意图" name="sketchMap">
          <keep-alive>
            <sketchMap v-if="activeName === 'sketchMap'"></sketchMap>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="详情列表" name="detailList">
          <keep-alive>
            <tableList v-if="activeName === 'detailList'"></tableList>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import Plane from './Plane'
import sketchMap from './SketchMap'
import tableList from './TableList'
export default {
  components: { Plane, sketchMap, tableList },
  data () {
    return {
      activeName: 'plane'
    };
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/safety/drainage/suppley-water') {
      this.$store.state.drainage.websocket && this.$store.state.drainage.websocket.close()
      this.$store.commit('drainage/updateWebsocket', null)
    }
    next();
  }
};
</script>

<style lang="scss" scoped>
</style>
