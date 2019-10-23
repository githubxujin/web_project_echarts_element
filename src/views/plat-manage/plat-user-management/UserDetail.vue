<template>
  <div class="user-detail">
    <el-form
      v-loading="dialogLoading"
      ref="form"
      :model="form"
      label-width="80px"
      size="mini"
      inline
      :label-position="'right'"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="realName" label="姓名">{{form.realName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="picture" label="照片">
            <img v-if="form.picture" :src="form.picture" class="avatar" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="userName" label="帐号">{{form.userName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="roleId" label="角色">{{(form.roleId || '') | translate(roleListCopy)}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item prop="phone" label="手机号">{{form.phone}}</el-form-item>
        </el-col>
      </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item prop="jobNumber" label="工号"  class="shopNames">{{form.jobNumber}}</el-form-item>
            </el-col>
        </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            prop="shopNames"
            label="所属门店"
            class="shopNames"
          >{{(form.shopNames || []).join(',')}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="orgName" label="部门"  class="shopNames">{{form.orgName}}</el-form-item>
        </el-col>

      </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item prop="positionName" label="职位">{{form.positionName}}</el-form-item>
            </el-col>
        </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            prop="payRollStatus"
            label="状态"
          >{{form.payRollStatus| translate(workStateEnum)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row class="text-center">
        <el-button round size="mini" @click="cancle">关闭</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { workStateEnum } from '@/enum/dicts.js'
export default {
  props: {
    viewDialogVisible: Boolean,
    userItem: Object,
    roleList: { // 角色列表
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      workStateEnum,
      dialogLoading: false, // 弹框loading
      form: {
        userName: '',
        roleId: '',
        shopNames: '',
        realName: '',
        phone: '',
        orgName: '',
        positionName: '',
        jobNumber: '',
        picture: '',
        payRollStatus: ''
      }
    }
  },
  computed: {
    roleListCopy () {
      let roleListCopy = JSON.parse(JSON.stringify(this.roleList))
      roleListCopy = roleListCopy.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
      return roleListCopy
    }
  },
  methods: {
    cancle () {
      this.$emit('uodate:userItem', null)
      this.$emit('update:viewDialogVisible', false)
    }
  },
  watch: {
    viewDialogVisible: { // 监听userItem，获取用户信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible || !this.userItem) return
        Object.keys(this.form).forEach(prop => {
          this.form[prop] = this.userItem[prop]
        }, this)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-detail {
  .text-center {
    text-align: center;
  }
}
</style>
<style  lang="scss" scoped>
.user-detail {
  .shopNames {
    /deep/ .el-form-item__content {
      max-width: 420px;
      margin-bottom: 10px;
      max-height: 200px;
      overflow: auto;
      word-break: break-all;
    }
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
}
</style>

