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
      :label-position="'right'"
      class="editor-form"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="deviceNumber" label="设备编号">
            <el-input
              v-model="form.deviceNumber"
              placeholder="请输入"
              clearable
              :maxlength="16"
              :disabled="isEdit"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="accountNumber" label="资产编号">
            <el-input v-model="form.accountNumber" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="deviceName" label="设备名称">
            <el-input v-model="form.deviceName" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="deviceType" label="设备类型">
            <TreeSelect
              v-model="form.deviceType"
              placeholder="请选择"
              :clearable="true"
              :data="deviceList"
              :defaultProps="defaultProps"
              :isOnlyLeafSelect="true"
            ></TreeSelect>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="deviceModel" label="规格型号">
            <el-input v-model="form.deviceModel" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="useOrgId" label="使用部门">
            <TreeSelect v-model="form.useOrgId" placeholder="请选择" :clearable="true" :data="orgList"></TreeSelect>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="brand" label="品牌">
            <el-select v-model="form.brand" placeholder="请选择">
              <el-option
                v-for="item in brandList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="orgId" label="产权归属">
            <el-select v-model="form.orgId" placeholder="请选择">
              <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="factoryName" label="生产厂家">
            <el-select v-model="form.factoryName" placeholder="请选择">
              <el-option
                v-for="item in factoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="depreciationMethod" label="拆旧方法">
            <el-select v-model="form.depreciationMethod" placeholder="请选择">
              <el-option
                v-for="item in depreciationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="unitId" label="单位">
            <el-select v-model="form.unitId" placeholder="请选择">
              <el-option
                v-for="item in unitList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="installAddress" label="安装位置">
            <el-input v-model="form.installAddress" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="installTime" label="安装时间">
            <el-date-picker v-model="form.installTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="useTime" label="投入日期">
            <el-date-picker v-model="form.useTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="makTime" label="出厂日期">
            <el-date-picker v-model="form.makTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="safeTime" label="保修期">
            <el-select v-model="form.safeTime" placeholder="请选择">
              <el-option
                v-for="item in safeTimeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="meterId" label="对应支路">
            <el-select v-model="form.meterId" placeholder="请选择">
              <el-option
                v-for="item in branchList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="special" label="是否重点设备">
            <el-radio-group v-model="form.special">
              <el-radio
                v-for="item in yesOrNoEnum"
                :label="item.value"
                :key="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="deviceStatus" label="设备状态" class="device-status">
            <el-radio-group v-model="form.deviceStatus">
              <el-radio
                v-for="item in usedState"
                :label="item.value"
                :key="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="status" label="是否启用">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="item in statusEnum"
                :label="item.value"
                :key="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 技术参数，关联设备，设备图片，附件 -->
    <tab-relative-setting :isEdit="isEdit"></tab-relative-setting>
    <!-- 设备主图 -->
    <div class="device-img text-center">
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
        :accept="$common.getMimeTypeList('jpg,png,gif').join(',')"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span>设备主图</span>
    </div>
    <!-- 底部按钮 -->
    <el-row class="text-center">
      <el-button
        type="primary"
        round
        size="mini"
        @click="submit"
        :loading="submitLoading"
      >{{isEdit ? '确 定' : '新 增'}}</el-button>
      <el-button round size="mini" @click="close">取 消</el-button>
    </el-row>
  </div>
</template>
<script>
import { addDevice, getFactory, getParamsField, editDevice, getDeviceTypeTree, getSafeTime } from '@/services/assets';
import { meterArray, configTypeTreeQuery } from '@/services/system-settings';
import { getUnit } from '@/services/operation';
import Regexps from '@/utils/regexp.js'
import { usedState, statusEnum, yesOrNoEnum } from '@/enum/dicts.js'
import TreeSelect from '@/components/treeSelect'
import tabRelativeSetting from './TabRelativeSetting'
export default {
  props: {
    editdialogVisible: Boolean,
    details: {},
    brandList: Array,
    shopNumber: String
  },
  components: { TreeSelect, tabRelativeSetting },
  data () {
    return {
      usedState, statusEnum, yesOrNoEnum,
      isEdit: false,
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      defaultProps: {
        children: 'childList',
        label: 'configName',
        key: 'id',
        disabled: 'disabled'
      },
      factoryList: [],
      orgList: [],
      propertyList: [
        { name: '自有', id: '自有' },
        { name: '租赁', id: '租赁' },
        { name: '自有+租赁', id: '自有+租赁' },
        { name: '其他', id: '其他' },
      ],
      branchList: [],
      deviceList: [],
      unitList: [],
      depreciationList: [
        { name: '平均年限法', id: '平均年限法' },
        { name: '工作量法', id: '工作量法' },
        { name: '双倍余数递减法', id: '双倍余数递减法' },
        { name: '年数总和法', id: '年数总和法' },
      ],
      safeTimeList: [],
      form: {
        deviceNumber: '',
        accountNumber: '',
        deviceName: '',
        deviceType: '',
        brand: '',
        factoryName: '',
        installAddress: '',
        installTimeStr: '',
        orgId: '',
        deviceModel: '',
        unitId: '',
        makTimeStr: '',
        useTimeStr: '',
        depreciationMethod: '',
        safeTime: '',
        meterId: '',
        useOrgId: '',
        deviceStatus: 0,
        status: 0,
        special: 0,
        imgUrl: '',
      },
      formRules: { // 表单规则
        deviceNumber: [
          { required: true, message: '请输入设备编号', trigger: 'blur' },
          { validator: this.chinese, message: '编号请不要输入中文', trigger: 'blur' }
        ],
        accountNumber: [
          { required: true, message: '请输入资产编号', trigger: 'blur' },
          { validator: this.testShopName, message: '编号请不要输入中文', trigger: 'blur' }
        ],
        deviceName: [
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
        ],
        installAddress: [
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
        ],
        deviceModel: [
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
        ],
        depreciationYear: [
          { max: 10, message: '长度不能超过 10 个字符', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'blur' },
        ],

      },
      shopoptions: [],
      imageUrl: '',
      paramData: null,//根据设备类型动态返回的技术参数
      params: {}//放置技术参数
    }
  },
  computed: {
    tokenInfo () {
      return this.$store.getters.getTokenInfo
    }
  },
  created () {
    this.getFactory();
    this.getDepartment();
    this.getDeviceTypeTree();
    this.getUnit();
    this.getSafeTime()
  },
  methods: {
    testShopName (rule, value, callback) {
      if (!rule) return callback()
      if (Regexps.specialSymbols.test(value)) {
        return callback(new Error('禁止输入特殊符号)'))
      }
      return callback()
    },
    chinese (rule, value, callback) {
      if (value) {
        if (Regexps.chinese.test(value)) {
          return callback(new Error('编号中不能含有汉字'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    checkDate (rule, value, callback) {
      if (value) {
        if (!Regexps.checkDate.test(value)) {
          return callback(new Error('请输入正确格式的时间)'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    // 设备类型
    getDeviceTypeTree () {
      getDeviceTypeTree().then(res => {
        this.deviceList = res.code == 200 ? res.data.array : []
      })
    },
    // 获取生产厂家
    getFactory () {
      getFactory().then(res => {
        this.factoryList = res.code == 200 ? res.data.array : ''
      })
    },
    // 获取支路
    meterGetArray () {
      meterArray({ shopNumber: this.shopNumber, deviceType: this.form.deviceType }).then(res => {
        this.branchList = res.code == 200 ? res.data.array : []
      })
    },
    // 获取部门
    getDepartment () {
      configTypeTreeQuery({ configType: 62 }).then(res => {
        this.orgList = (res.data || {})[62] || []
      })
    },
    // 根据设备类型获取技术参数
    getParamsField (deviceType) {
      getParamsField(deviceType).then(res => {
        if (res.code == 200) {
          this.paramData = JSON.stringify(res.data) == "{}" ? null : res.data
        } else {
          this.paramData = {}
        }
      });
    },
    // 获取单位
    getUnit () {
      getUnit().then(res => {
        this.unitList = res.data && res.data.array.length > 0 ? res.data.array : []
      }).catch(err => {
        console.log('获取单位列表失败' + err)
      })
    },
    getSafeTime () {
      getSafeTime().then(res => {
        this.safeTimeList = res.data.array
      }).catch(err => {
        console.log('获取保修期失败' + err)
      })
    },
    beforeAvatarUpload (file) { // 头像上传前
      this.submitLoading = true
    },
    handleAvatarSuccess (res, file) { // 头像上传完成
      this.submitLoading = false
      if (res.code !== 200) { // 头像上传失败，清除上传
        this.$refs.upload && this.$refs.upload.clearFiles()
        this.imageUrl = ''
        return
      }
      let data = res.data
      // 保存修改后的图片链接，提交时候判断是否有，有则提交picture无则给picture置空
      this.form.imgUrl = data.filePath
      this.submitLoading = false
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleAvatarError (err, file, fileList) { // 头像上传失败
      this.submitLoading = false
      this.$message.error('头像上传失败！');
    },
    submit () {
      let result = false
      this.$refs.form.validate(res => {
        result = res
      });
      if (!result) return;
      this.form.shopNumber = this.shopNumber;
      let params = JSON.parse(JSON.stringify(this.form));
      this.dialogLoading = true;
      if (this.isEdit) {
        editDevice(params).then(res => {
          if (res.code == 200) {
            this.dialogLoading = false;
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = ''
            }, this);
            this.$refs.form && this.$refs.form.resetFields();
            this.$emit('update:editdialogVisible', false);
            this.$emit('success')
            this.$message.success("编辑成功");
          }
        }).catch((error) => {
          this.dialogLoading = false;
        });
      } else {
        addDevice(params).then(res => {
          if (res.code == 200) {
            this.dialogLoading = false;
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = ''
            }, this);
            this.$refs.form && this.$refs.form.resetFields();
            this.$emit('update:editdialogVisible', false);
            this.$emit('success');
            this.$message.success("添加成功");
          }
        }).catch((error) => {
          this.dialogLoading = false;
        });
      }
    },
    close () {
      this.form = {};
      this.imageUrl = ''
      this.$refs.upload && this.$refs.upload.clearFiles()
      this.$emit('update:editdialogVisible', false);
    }
  },
  watch: {
    details: {
      handler: function (newData, oldData) {
        this.form = JSON.parse(JSON.stringify(this.details))
        this.imageUrl = this.form.imgUrlStr;
        if (this.form && this.form.hasOwnProperty("id")) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      },
      deep: true
    },
    'form.deviceType': {
      handler (val, oldVal) {
        if (val) {
          this.getParamsField(this.form.deviceType)
          this.meterGetArray();
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.user-editor {
  position: relative;
  .text-center {
    text-align: center;
  }
  .editor-form {
    display: inline-block;
    width: 640px;
  }
  .device-img {
    position: absolute;
    right: -16px;
    top: 0px;
    width: 230px;
    height: 230px;
  }
}
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
  width: 220px;
  height: 220px;
  line-height: 220px;
  text-align: center;
}
.avatar {
  width: 220px;
  height: 220px;
  display: block;
}
/deep/ .el-textarea {
  width: 550px;
}
.device-status {
  /deep/ .el-radio-group {
    width: 210px;
  }
  /deep/ .el-radio {
    margin-right: 0px;
  }
}
.el-radio + .el-radio {
  margin-left: 3px;
}
.params {
  font-size: 16px;
  font-weight: 600;
}
/deep/ .el-input--prefix .el-input__inner {
  width: 193px;
}
</style>

