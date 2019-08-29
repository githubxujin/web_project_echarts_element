<template>
  <div class="p-container">
    <div class="sub-nav">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="门店概览" name="platform-overview">
          <PlatformOverview></PlatformOverview>
        </el-tab-pane>
        <el-tab-pane label="用户管理" name="user-management">
          <UserManagement></UserManagement>
        </el-tab-pane>
        <el-tab-pane label="短信模版" name="sms-template">
          <SmsTemplate></SmsTemplate>
        </el-tab-pane>
        <el-tab-pane label="系统类别预置" name="system-categoryreset">系统类别预置</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PlatformOverview from './PlatformOverview.vue'
import SmsTemplate from './SmsTemplate.vue'
import UserManagement from './plat-user-management'
export default {
  components: { PlatformOverview, SmsTemplate, UserManagement },
  data () {
    return {
      activeName: 'platform-overview'
    };
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
