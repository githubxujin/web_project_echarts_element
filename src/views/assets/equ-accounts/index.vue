<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="设备信息库"
                     name="deviceInfo">
          <deviceInfo></deviceInfo>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import deviceInfo from './DeviceInfo.vue'
export default {
  components: { deviceInfo },
  data () {
    return {
      activeName: 'deviceInfo'
    };
  },
  methods: {

  }
};
</script>
