<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="设备名称" prop="deviceIdAndTypeId">
        <TreeSelect
          v-model="ruleForm.deviceIdAndTypeId"
          placeholder="请选择设备名称"
          :clearable="false"
          :data="treeData"
          :defaultProps="defaultProps"
          :onlyLeafSelect="true"
        ></TreeSelect>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="故障类型" prop="faultType">
            <el-select v-model="ruleForm.faultType" placeholder="请选择故障类型">
              <el-option
                v-for="(item,index) in faultTypeOptions"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="padding-left:20px;">
          <el-form-item label="是否紧急">
            <el-radio-group v-model="ruleForm.urgent">
              <el-radio :label="0">通常</el-radio>
              <el-radio :label="1">紧急</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="故障描述" class="form-item-textarea" prop="faultDesc">
        <el-input type="textarea" v-model="ruleForm.faultDesc" placeholder="故障说明..."></el-input>
      </el-form-item>
      <el-form-item label="报修人" prop="reportName">
        <el-input v-model="ruleForm.reportName" placeholder="报修人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="联系电话" maxlength="13"></el-input>
      </el-form-item>
      <el-form-item label="位置" prop="address">
        <!-- <el-input v-model="ruleForm.address" placeholder="位置"></el-input> -->
        <position-input v-model="ruleForm.address" placeholder="位置"></position-input>
      </el-form-item>
      <el-row>
        <el-col :span="4">
          <el-form-item label="预期时间" prop="expectTime"></el-form-item>
        </el-col>
        <el-col :span="20">
          <el-date-picker
            v-model="ruleForm.expectTime"
            type="datetime"
            placeholder="请选择预期时间"
            :picker-options="pickerDisabled"
            format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="上传图片" prop></el-form-item>
        </el-col>
        <el-col :span="20">
          <el-upload
            :action="$store.state.base.uploadUrl"
            :headers="$store.getters.getUploadHeader"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :before-remove="beforeRemove"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :beforeUpload="utils.beforeAvatarUpload"
            :accept="$common.getMimeTypeList('jpg,png,gif').join(',')"
            :on-error="onError"
            multiple
            :limit="limit"
            :on-exceed="onExceed"
            ref="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <viewer
            v-show="dialogVisible"
            :images="billImages"
            class="img-viewer"
            @inited="inited"
            ref="viewer"
          >
            <!-- //一定要一个数组，否则报错 -->
            <img v-for="(img,index) in billImages" :src="img.url" class="image" :key="index" />
          </viewer>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="ruleForm.memo"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addRepairBill, getRepairFaultType, getDeviceTree, getDeviceLocation } from '../../../../services/operation';
import TreeSelect from '@/components/treeSelect';
import PositionInput from '@/components/form/PositionInput.vue';
import { validateTel } from '@/utils/validate-utils.js'
import utils from '@/utils/utils.js';
export default {
  components: {
    TreeSelect,
    PositionInput
  },
  computed: {
    fileList () {
      return this.billImages.map(n => {
        return { name: n.name, url: n.url };
      })
    },
    images () {
      let images = JSON.parse(JSON.stringify(this.billImages)).map(item => {
        return item.url
      })
      return images
    }
  },
  data () {
    return {
      utils,
      limit: 9,
      keyword: '',
      dialogVisible: false,
      faultTypeOptions: [],
      billImages: [],//
      ruleForm: {
        shopNumber: this.$store.getters.shopNumber,
        deviceIdAndTypeId: '', //设备名称
        faultType: '',//故障类型
        reportName: this.$store.getters.getUserInfo.realName,//报修人
        phone: '', //联系电话
        address: '',//位置
        faultDesc: '',//故障描述
        expectTime: '',//预期时间
        memo: '',//备注
        repairBillImages: [],
        urgent: 0,//是否紧急
      },
      rules: {
        deviceIdAndTypeId: [
          { required: true, message: '请选择设备名称', trigger: 'blur' },
        ],
        faultType: [
          { required: true, message: '请选择故障类型', trigger: 'blur' },
        ],
        memo: [
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
        ],
        address: [
          { max: 80, message: '长度不能超过 80 个字符', trigger: 'blur' }
        ],
        reportName: [
          { max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }
        ],
        faultDesc: [
          { required: true, message: '故障描述不能为空', trigger: 'blur' },
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
        ],
        phone: [{ validator: validateTel, trigger: 'blur' }],
        address: [
          { required: true, message: '请输入位置', trigger: 'blur' },
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
        ]
      },
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      $viewer: null,
      pickerDisabled: {  //验证时间范围
        disabledDate: (time) => {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  created () {
    // console.log('用户', this.$store.getters.getUserInfo.realName);
    this.initDeviceTree();
    this.initData();
  },
  watch: {
    'ruleForm.deviceIdAndTypeId': function (val) {
      if (!val) return;
      getDeviceLocation(val).then(res => {
        if (res.data) {
          this.ruleForm.address = res.data;
        }
      })
    }
  },
  methods: {
    inited (viewer) {
      this.$viewer = viewer
    },
    initData () {
      // var that = this;
      getRepairFaultType().then(res => {
        if (res.code == 200) {
          this.faultTypeOptions = res.data.array;
        }
      })
    },
    //提交
    submitForm (formName) {
      var that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          console.log('验证成功')
          that.ruleForm.repairBillImages = that.billImages.map(n => {
            return { pictureName: n.name, pictureUrl: n.path }
          });
          addRepairBill(that.ruleForm).then(res => {
            console.log('提交表单：', res)
            if (res.code == 200) {
              that.$message({
                message: '报修成功！',
                type: 'success',
                duration: that.$baseConfig.messageDuration
              });
              that.$emit("callBack")
              that.isHide();
            }
          });
        }
      }
      );
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
    onError (err, file, fileList) {
      console.log('onError :', err, file, fileList);
      console.log('this.$refs.upload:', this.$refs.upload.uploadFiles); //this.$refs.upload.clearFiles()
      let uploadFiles = this.$refs.upload.uploadFiles;
      let index = uploadFiles.findIndex(n => n.name == file.name && n.url == file.url);
      // console.log('index', index)
      uploadFiles.splice(index, 1);

      // this.handleRemove(file, fileList);
      this.$message({
        message: '图片上传失败！',
        type: 'error',
        duration: this.$baseConfig.messageDuration
      });
    },
    beforeRemove (file, fileList) {
      console.log('移除吗', file, fileList);
      console.log('移除吗this.billImages', this.billImages);

      // return this.$confirm(`确定移除 ${file.name}？`, '提示');
      //图片大于2M时不提示，直接自动删除
      const isLt2M = file.size / 1024 / 1024 < this.$baseConfig.imgLimitSize;
      if (!isLt2M) {
        return true;
      }

      return this.$confirm('确认删除该维修工单图片？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      });
    },
    handleRemove (file, fileList) {
      this.removeImg(file);
    },
    //文件超出个数限制时的钩子
    onExceed (files, fileList) {
      console.log('onExceed :', files, fileList, files.length + fileList.length);
      if (files.length + fileList.length > this.limit) {
        this.$message({
          message: '图片最多允许上传' + this.limit + '张',
          type: 'error',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
    },
    handlePictureCardPreview (file) {
      this.dialogVisible = true;
      // debugger;
      let index = this.billImages.findIndex(n => n.name == file.name && n.url == file.url);
      this.$viewer.show();
      this.$viewer.view(index); //显示当前选中项的图片
    },
    handleSuccess (res, file, fileList) {
      console.log('上传成功', res, file, fileList);
      if (res.code == 200) {
        let data = res.data;
        this.addImg(data, file);
      } else {
        this.onError(res, file, fileList);
      }
    },
    addImg (data, file) {
      this.billImages.push({ name: data.fileName, url: file.url, path: data.filePath });
      console.log('添加this.billImages', this.billImages);
    },
    removeImg (file) {
      console.log('data', file, this.billImages)
      let index = this.billImages.findIndex(n => n.name == file.name && n.url == file.url);
      console.log('index', index)
      if (index != -1) {
        this.billImages.splice(index, 1);
      }
      console.log('删除this.billImages', this.billImages)
    },
    //初始化设备树
    initDeviceTree () {
      getDeviceTree(this.ruleForm.shopNumber).then(res => {
        console.log('res', res)
        if (res.data.array) {
          this.treeData = res.data.array;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-upload-list--picture-card .el-upload-list__item,
/deep/ .el-upload--picture-card {
  height: 120px;
  line-height: 120px;
  margin-bottom: 10px;
}
.image {
  display: none;
}
/deep/ .el-select,
/deep/ .TreeSelect,
/deep/ .el-date-editor.el-input {
  width: 100%;
}

.map {
  width: 100%;
  height: 300px;
}
</style>
<style>
.tangram-suggestion-main {
  z-index: 99999 !important;
}
</style>
