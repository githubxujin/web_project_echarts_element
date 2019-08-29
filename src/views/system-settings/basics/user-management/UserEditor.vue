<template>
  <div class="user-editor">
    <el-form
      v-loading="dialogLoading"
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="90px"
      size="mini"
      inline
      :label-position="'left'"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="realName" label="姓名">
            <el-input v-model.trim="form.realName" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="picture" label="照片">
            <el-upload
              ref="upload"
              :headers="{token:tokenInfo}"
              class="avatar-uploader"
              :action="$store.state.base.uploadUrl"
              :show-file-list="false"
              :multiple="false"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList"
              :accept="$common.getMimeTypeList('jpg,png,gif').join(',')"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="userName" label="账号">
            <el-input
              v-model.trim="form.userName"
              placeholder="请输入"
              clearable
              :maxlength="16"
              :disabled="isEdit"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="password" label="密码">
            <el-input
              v-model.trim="form.password"
              placeholder="请输入"
              :type="passwordType"
              :maxlength="16"
              autocomplete="off"
              :disabled="isEdit"
              style="width:160px;"
            >
              <i
                v-show="!isEdit"
                slot="suffix"
                class="iconfont"
                :class="{'icon-eye': passwordType === 'text', 'icon-eye1':  passwordType === 'password'}"
                @click="passwordType = passwordType === 'text' ? 'password' : 'text'"
              ></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button round size="mini" @click="resetPassWord" style="height:28px;">重 置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="roleId" label="角色">
            <el-select v-model.trim="form.roleId" placeholder="请选择" clearable>
              <el-option
                v-for="item in roleList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="phone" label="手机号">
            <el-input v-model.trim="form.phone" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="jobNumber" label="工号">
            <el-input v-model.trim="form.jobNumber" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="orgId" label="部门">
            <TreeSelect v-model="form.orgId" placeholder="请选择" :clearable="true" :data="orgList"></TreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="positionId" label="职位">
            <el-select v-model="form.positionId" placeholder="请选择" clearable>
              <el-option
                v-for="item in positionList"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isEdit">
          <el-form-item prop="payRollStatus" label="在职状态">
            <el-radio-group v-model="form.payRollStatus">
              <el-radio
                v-for="item in workStateEnum"
                v-show="isEdit ? true : item.value !== 3"
                :label="item.value"
                :key="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="text-center">
        <el-button
          type="primary"
          size="mini"
          @click="submit"
          :loading="submitLoading"
        >{{isEdit ? '确 定' : '新 增'}}</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import TreeSelect from '@/components/treeSelect'
import { adminGetInfo, adminAdd, adminEdit, roleListQuery, configTypeQuery, configTypeTreeQuery, adminResetPwd } from '@/services/system-settings.js' // 62部门
import { validatePass, validateUserName, validateRealName, isPhone } from '@/utils/validate-utils.js'
import { workStateEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
import axios from '@/axios/axios.js'
export default {
  components: { TreeSelect },
  props: {
    dialogVisible: Boolean,
    userItem: Object
  },
  data () {
    var validatePassWord = (rule, value, callback) => {

    }
    return {
      workStateEnum, // 工作状态
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      roleList: [], // 角色列表
      orgList: [], // 组织列表
      positionList: [], // 职位列表
      passwordType: 'password',
      form: {
        id: '',
        userId: '',
        userName: '',
        password: '',
        roleId: '',
        roleName: '',
        jobNumber: '',
        realName: '',
        phone: '',
        orgId: '',
        orgName: '',
        positionId: '',
        positionName: '',
        payRollStatus: 1,
        picture: '',
        pictureName: '',
        shopNumbers: []
      },
      formRules: { // 表单规则
        userName: [
          { required: true, message: '请输入帐号', trigger: 'blur' },
          { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        orgId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: validateRealName, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: Regexps.mobile, message: '请输入正确的手机号格式', trigger: 'change' }
        ],
        payRollStatus: [{ required: true, message: '请选择在职状态', trigger: 'change' }]
      },
      imageUrl: '', // 头像链接
      updateImageUrl: null,// 更新后的图片URI
      imgSize: null
    }
  },
  created () {
    this.initData()
  },
  computed: {
    fileList () { // 头像文件集合
      if (!this.form.picture) return []
      return [{ name: this.form.pictureName, url: this.form.picture }]
    },
    isEdit () { // 判断是否编辑
      return Boolean(this.userItem)
    },
    params () { // 格式化表单数据
      let params = JSON.parse(JSON.stringify(this.form))
      params.picture = this.updateImageUrl ? this.updateImageUrl : null
      if (!this.isEdit) {
        let shopNumber = (this.$store.getters.getUserInfo || {}).shopNumber
        params.shopNumbers = [shopNumber]
      }
      return params
    },
    tokenInfo () {
      return this.$store.getters.getTokenInfo
    }
  },
  watch: {
    dialogVisible: { // 监听userItem，获取用户信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible || !this.userItem) return
        Object.keys(this.form).forEach(prop => {
          this.form[prop] = this.userItem[prop]
        }, this)
        // 编辑状态密码设置为******，此接口编辑密码无效，密码编辑有单独的接口
        this.form.password = '******'
        // 回显图片
        this.imageUrl = this.form.picture
      }
    }
  },
  methods: {
    adminGetInfo, // 获取用户信息
    adminAdd, // 新增用户
    adminEdit, // 编辑用户
    roleListQuery, // 角色列表请求
    configTypeQuery, // 获取字典
    configTypeTreeQuery, // 获取字典下拉树
    initData () { // 获取角色岗位列表
      this.dialogLoading = true
      axios.all([this.roleListQuery(), this.configTypeQuery({ configType: 59 }), this.configTypeTreeQuery({ configType: 62 })]).then(axios.spread((res1, res2, res3) => {
        this.dialogLoading = false
        this.roleList = (res1.data || {}).array.filter(item => { // 过滤掉集团角色
          return item.id > 2
        })
        this.positionList = (res2.data || {})[59] || []
        this.orgList = (res3.data || {})[62] || []
      })).catch(...errors => {
        this.dialogLoading = false
        console.error('获取角色列表或职位列表失败(errorMessage)：', errors);
      })
    },
    resetPassWord () {
      // this.form.password = 123456;
      // this.$message.warning('密码重置为123456，点击确认后生效');
      adminResetPwd(this.params).then(res => {
        if (res.code === 200) {
          this.$message.success('密码重置成功！');
          this.form.password = 123456;
        }
      })
    },
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'adminEdit'
      if (!this.isEdit) {
        funName = 'adminAdd'
      }
      this.dialogLoading = true
      // this.$store.commit('user/setUserInfo', newVal)
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增用户成功！')
        this.$emit('success')
        console.log(this.params)
        this.cancle()
      }).catch(_ => {
        console.error('编辑用户信息失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = prop === 'payRollStatus' ? 1 : ''
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$refs.upload && this.$refs.upload.clearFiles()
      this.imageUrl = ''
      this.updateImageUrl = ''
      // this.$emit('update:userItem', null)
      this.$emit('update:dialogVisible', false)
    },
    beforeAvatarUpload (file) { // 头像上传前
      this.imgSize = file.size / 1024 < 500 ? '1' : '0';
      console.log(file)
      let isJPEG = file.type === 'image/jpeg';
      let isJPG = file.type === 'image/jpg';
      let isGIF = file.type === 'image/gif';
      let isSVG = file.type === 'image/svg';
      let isPNG = file.type === 'image/png';
      let isBMP = file.type === 'image/bmp';
      if (!isJPG && !isGIF && !isPNG && !isBMP && !isJPEG && !isSVG) {
        this.$message.error('上传文件必须是图片，请重新上传')
        return
      }
      if (this.imgSize === '0') {
        this.$message({
          message: '上传文件大小不能超过500k!',
          type: 'error'
        });
        this.submitLoading = false
      } else {
        this.submitLoading = true
      }
      return this.imgSize === '1' ? true : false;
    },
    handleAvatarSuccess (res, file) { // 头像上传完成
      this.submitLoading = false
      if (res.code !== 200) { // 头像上传失败，清除上传
        this.$refs.upload && this.$refs.upload.clearFiles()
        this.imageUrl = ''
        this.updateImageUrl = ''
        return
      }
      let data = res.data
      // 保存修改后的图片链接，提交时候判断是否有，有则提交picture无则给picture置空
      this.form.picture = data.filePath
      this.form.pictureName = data.fileName
      this.submitLoading = false
      this.imageUrl = URL.createObjectURL(file.raw);
      this.updateImageUrl = data.filePath
    },
    handleAvatarError (err, file, fileList) { // 头像上传失败
      this.submitLoading = false
      this.$message.error('头像上传失败！');
    },
  }
}
</script>
<style lang="scss" scoped>
.user-editor {
  .text-center {
    text-align: center;
  }
}
</style>
<style  lang="scss" scoped>
.user-editor {
  .avatar-uploader {
    /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    /deep/ .el-upload:hover {
      border-color: #409eff;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
}
</style>

