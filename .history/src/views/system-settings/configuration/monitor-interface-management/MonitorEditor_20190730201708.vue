<template>
  <div class="monitor-editor">
    <el-form
      v-loading="dialogLoading"
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="80px"
      size="mini"
      inline
      :label-position="'left'"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="name" label="名称">
            <el-input v-model.trim="form.name" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="type" label="类型">
            <el-select v-model="form.type" placeholder="请选择" clearable>
              <el-option
                v-for="item in monitorTypeList"
                :label="item.configName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-form-item prop="content" label="监控内容">
          <el-input
            style="width:520px;"
            type="textarea"
            placeholder="请输入内容"
            v-model.trim="form.content"
            maxlength="1000"
            show-word-limit
            :rows="5"
          ></el-input>
        </el-form-item>
      </el-row>-->
      <el-row>
        <el-col :span="12">
          <el-form-item prop="pictureUrl" label="照片">
            <el-upload
              ref="upload"
              :headers="$store.getters.getUploadHeader"
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
              <img v-if="imgEditConfig.url" :src="imgEditConfig.url" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button
              type="primary"
              class="fl"
              style="margin-top: 14px;"
              @click="openImgEdit"
              v-show="imgEditConfig.url && monitorItem && monitorItem.type==239"
            >编辑</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="status" label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                :key="index"
                v-for="(item, index) in statusEnum"
                :label="item.value"
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
    <!-- 图片编辑 -->
    <el-dialog
      v-dialogDrag
      v-if="showImgEdit"
      title="图片编辑"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="showImgEdit"
      width="1120px"
      height="720px"
    >
      <image-edit @onHide="hideImgEditWin" :imgEditConfig="imgEditConfig"></image-edit>
    </el-dialog>
  </div>
</template>
<script>
import { monitorGetInfo, monitorAdd, monitorEdit, getSumpPosition } from '@/services/system-settings.js'
import { statusEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
import ImageEdit from './ImageEdit';
export default {
  components: {
    ImageEdit
  },
  props: {
    editDialogVisible: Boolean,
    monitorTypeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    monitorItem: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      imgEditConfig: { originUrl: '', url: '', pointsArr: [] },//图片编辑配置 sumpList
      showImgEdit: false,//显示图片编辑
      statusEnum, // 启用，禁用
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      deviceTypeList: [], // 设备类型列表
      dataTypeList: [], // 数据类型列表
      form: {
        id: '',
        name: '',
        type: '',
        content: '',
        originUrl: '',
        pictureName: '',
        pictureUrl: '',
        status: 0,
        shopNumber: ''
      },
      updateImageUrl: '', // 更新后的图片URI
      formRules: { // 表单规则
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    fileList () { // 头像文件集合
      if (!this.form.pictureUrl) return []
      return [{ name: this.form.pictureName, url: this.form.pictureUrl }]
    },
    isEdit () { // 判断是否编辑
      return Boolean(this.monitorItem)
    },
    params () {
      let params = JSON.parse(JSON.stringify(this.form))
      // 如果是新增则用当前登陆者的shopNumber
      params.shopNumber = params.shopNumber || this.$store.getters.getUserInfo.shopNumber
      params.pictureUrl = this.updateImageUrl ? this.updateImageUrl : null
      return params
    }
  },
  methods: {
    //隐藏图片编辑弹窗
    hideImgEditWin () {
      this.showImgEdit = false;
    },
    //打开图片编辑弹窗
    openImgEdit () {
      getSumpPosition(this.form.id).then(res => {
        // console.log('res', res);
        if (res.data.sumpList) {
          this.imgEditConfig.pointsArr = res.data.sumpList;
        }
        this.showImgEdit = true;
      })
    },
    monitorGetInfo, // 获取详情
    monitorAdd, // 新增监控界面配置
    monitorEdit, // 编辑监控界面配置
    initData () {
      this.dialogLoading = true
      this.monitorGetInfo(this.monitorItem).then(res => {
        let data = res.data;
        Object.keys(this.form).forEach(prop => {
          this.form[prop] = data[prop]
        })
        this.imgEditConfig.url = this.form.pictureUrl;
        this.imgEditConfig.originUrl = this.form.originUrl;
        // 因改变数据会触发部分校验，需要清除校验结果(非重置表单)
        this.$nextTick(_ => {
          this.$refs.form && this.$refs.form.clearValidate()
          this.dialogLoading = false
        })
      }).catch(_ => {
        this.dialogLoading = false
        console.log('获取监控界面详情失败:', _);
      })
    },
    submit () { // 提交编辑或新增
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let funName = 'monitorEdit'
      if (!this.isEdit) {
        funName = 'monitorAdd'
      }
      this.dialogLoading = true
      this[funName](this.params).then(res => {
        this.dialogLoading = false
        this.$message.success(this.isEdit ? '编辑成功！' : '新增监控界面配置成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑监控界面配置失败(errorMessage):', _);
        this.dialogLoading = false
      })
    },
    cancle () { // 重置表单并关闭表单
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = ''
      }, this)
      this.form.status = 0
      this.imgEditConfig.url = ''
      this.updateImageUrl = ''
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:monitorItem', null)
      this.$emit('update:editDialogVisible', false)
    },
    beforeAvatarUpload (file) { // 头像上传前
      this.submitLoading = true
    },
    handleAvatarSuccess (res, file) { // 头像上传完成
      this.submitLoading = false
      if (res.code !== 200) { // 头像上传失败，清除上传
        this.$refs.upload && this.$refs.upload.clearFiles()
        this.imgEditConfig.url = ''
        this.updateImageUrl = ''
        return
      }
      let data = res.data
      // 保存修改后的图片链接，提交时候判断是否有，有则提交picture无则给picture置空
      this.form.pictureUrl = data.filePath
      this.form.pictureName = data.fileName
      this.submitLoading = false
      this.imgEditConfig.url = URL.createObjectURL(file.raw);
      this.updateImageUrl = data.filePath
    },
    handleAvatarError (err, file, fileList) { // 头像上传失败
      this.submitLoading = false
      this.$message.error('头像上传失败！');
    },
  },
  watch: {
    editDialogVisible: { // 监听editDialogVisible，获取监控界面配置信息
      immediate: true,
      deep: true,
      handler: function (visible) {
        if (!visible || !this.monitorItem) return
        this.initData()
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
.monitor-editor {
  .text-center {
    text-align: center;
  }
  .avatar-uploader {
    float: left;
    width: 56px;
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

