<template>
  <div class="tab-sub">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="技术参数" name="techParam">
        <el-form ref="form" :model="form" :key="'techParams'">
          <el-table
            :data="form.techParams"
            height="200"
            border
            style="width: 100%;margin-bottom: 10px"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="paramName" label="参数名称" header-align="center">
              <template slot-scope="scope">
                <span>{{form.techParams[scope.$index].paramName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="paramValue" label="参数值" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`techParams[${scope.$index}].paramValue`" :rules="inputRule">
                  <el-input
                    placeholder="请输入"
                    maxlength="8"
                    v-model.trim="form.techParams[scope.$index].paramValue"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="关联设备" name="sparePartList">
        <el-form ref="form" :model="form" :key="'sparePartList'">
          <el-table
            :data="copyData.sparePartList"
            height="200"
            border
            style="width: 100%;margin-bottom: 10px"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" label="配件名称" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`sparePartList[${scope.$index}].name`" :rules="inputRule">
                  <span>{{copyData.sparePartList[scope.$index].name}}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="number" label="规格型号" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`sparePartList[${scope.$index}].number`">
                  <span>{{copyData.sparePartList[scope.$index].specification}}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="当前库存" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`sparePartList[${scope.$index}].stock`" :rules="numberRule">
                  <span>{{copyData.sparePartList[scope.$index].stock}}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`sparePartList[${scope.$index}].unit`" :rules="inputRule">
                  <el-select
                    disabled
                    v-model="copyData.sparePartList[scope.$index].unit"
                    placeholder
                  >
                    <el-option
                      v-for="item in unitList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="设备图片" name="devicePicture">
        <div class="img-box">
          <div>
            <el-upload
              v-show="limit !== 0"
              :action="$store.state.base.uploadUrl"
              :headers="{token:tokenInfo}"
              list-type="picture-card"
              class="avatar-uploader"
              :on-preview="handlePictureCardPreview"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :beforeUpload="utils.beforeAvatarUpload"
              :accept="$common.getMimeTypeList('jpg,png,gif').join(',')"
              :on-error="onError"
              multiple
              :limit="limit"
              :file-list="billImages"
              :on-exceed="onExceed"
              ref="upload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>

          <viewer :images="showImgList" class="img-viewer" @inited="inited" ref="viewer">
            <div class="img-cell" v-for="(img,index) in showImgList" :key="index">
              <img :src="img.url" class="image" />
              <div class="handle-bar">
                <i @click="removeImg(img,index)" class="el-icon-delete" title="删除"></i>
              </div>
            </div>
          </viewer>
        </div>
      </el-tab-pane>
      <el-tab-pane label="附件" name="file">
        <el-table :data="form.files" height="200" border style="width: 100%;margin-bottom: 10px">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="fileName" label="附件名称" header-align="center"></el-table-column>
          <el-table-column width="100" header-align="center" align="center">
            <template slot="header" slot-scope="scope">
              <!-- <el-input v-model="search" size="mini" placeholder="输入关键字搜索" /> -->
              <el-upload
                :action="$store.state.base.uploadUrl"
                :headers="{token:tokenInfo}"
                list-type="picture-card"
                class="avatar-uploader-excel"
                :on-preview="handlePictureCardPreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :beforeUpload="utils.beforeAvatarUpload"
                :accept="$common.getMimeTypeList('xls,xlsx,xlsm').join(',')"
                :on-error="onError"
                :limit="50"
                :on-exceed="onExceed"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </template>
            <template style="cursor: pointer" slot-scope="scope">
              <i
                style="cursor: pointer"
                class="el-icon-remove-outline"
                @click="delTableData(scope.$index)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="维修记录" name="repairRecord" v-if="isEdit">
        <el-form ref="form" :model="form">
          <el-table
            :data="form.repairRecord"
            height="200"
            border
            style="width: 100%;margin-bottom: 10px"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="number" label="工单号" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`repairRecord[${scope.$index}].number`" :rules="inputRule">
                  <el-input placeholder="请输入" v-model.trim="form.repairRecord[scope.$index].number"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="detail" label="故障明细" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`repairRecord[${scope.$index}].detail`" :rules="inputRule">
                  <el-input placeholder="请输入" v-model.trim="form.repairRecord[scope.$index].detail"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="maintainer" label="维修人" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`repairRecord[${scope.$index}].maintainer`" :rules="inputRule">
                  <el-input
                    placeholder="请输入"
                    v-model.trim="form.repairRecord[scope.$index].maintainer"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="time" width="220" label="完工时间" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`repairRecord[${scope.$index}].time`" :rules="inputRule">
                  <el-date-picker
                    v-model="form.repairRecord[scope.$index].time"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="保养记录" name="serviceRecord" v-if="isEdit">
        <el-form ref="form" :model="form">
          <el-table
            :data="form.maintainRecord"
            height="200"
            border
            style="width: 100%;margin-bottom: 10px"
          >
            <el-table-column type="paramValue" label="序号" width="50"></el-table-column>
            <el-table-column prop="number" label="工单号" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`maintainRecord[${scope.$index}].number`" :rules="inputRule">
                  <el-input
                    placeholder="请输入"
                    v-model.trim="form.maintainRecord [scope.$index].number"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="计划名称" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`maintainRecord[${scope.$index}].name`" :rules="inputRule">
                  <el-input placeholder="请输入" v-model.trim="form.maintainRecord[scope.$index].name"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="maintainer" label="保养人" header-align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`maintainRecord[${scope.$index}].maintainer`"
                  :rules="inputRule"
                >
                  <el-input
                    placeholder="请输入"
                    v-model.trim="form.maintainRecord[scope.$index].maintainer"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="serviceRecord_time"
              width="220"
              label="保养时间"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-form-item :prop="`maintainRecord[${scope.$index}].time`" :rules="inputRule">
                  <el-date-picker
                    v-model="form.maintainRecord[scope.$index].time"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import Regexps from '@/utils/regexp.js'
import utils from '@/utils/utils.js';
// 0 技术参数 1 关联设备 2 设备图片 3 附件 4 维修记录 5 保养记录
const tabMap = {
  '0': { add: '', delete: '', prefix: 'techParams', data: { paramName: '', paramValue: '' } },
  '1': { add: '', delete: '', prefix: 'relationDevice', data: { deviceNumber: '', deviceName: '', deviceCount: '', unitId: '' } },
  '2': { add: '', delete: '', prefix: 'imgList', data: { type: '', model: '', unitPrice: '', number: '', price: '' } },
  '3': { add: 'addFile', delete: '', prefix: 'files', data: { type: '', model: '', unitPrice: '', number: '', price: '' } },
  '4': { add: '', delete: '', prefix: 'repairRecord', data: { number: '', detail: '', time: '', maintainer: '' } },
  '5': { add: '', delete: '', prefix: 'maintainRecord', data: { number: '', name: '', time: '', maintainer: '' } },
}
export default {
  props: {
    paramData: Array, // 参数列表
    unitList: Array, // 单位列表
    isEdit: Boolean,
    tabInfoDetail: Object
  },
  data () {
    return {
      utils,
      activeName: 'techParams',
      limit: 20,
      form: {
        techParams: [], // 技术参数
        relationDevice: [], // 关联设备
        imgList: [], // 设备图片
        files: [], // 附件数
        repairRecord: [],// 维修记录
        maintainRecord: []// 保养记录
      },
      techParams: [],
      copyData: { attachment: null, deviceAccountId: null, deviceNumber: '', devicePicture: '', id: '', sparePartList: [], techParam: null },
      inputRule: [
        // { required: true, message: '必填', trigger: 'blur' }
      ],
      numberRule: [
        {
          required: true, message: '必填', trigger: 'blur'
        },
        // {
        //   pattern: Regexps.positiveNumber, message: '仅支持正数', trigger: 'blur'
        // }
      ],
      formRules: {
        // paramValue: [
        //   { required: true, message: '必填', trigger: 'blur' }
        // ],
        // deviceName: [
        //   { required: true, message: '必填', trigger: 'blur' }
        // ],
        // deviceNumber: [
        //   { required: true, message: '必填', trigger: 'blur' }
        // ],
        // deviceCount: [
        //   { required: true, message: '必填', trigger: 'blur' }
        // ],
        // deviceUnit: [
        //   { required: true, message: '必填', trigger: 'blur' }
        // ]
      },
      $viewer: null,
      dialogVisible: false,
      billImages: [],// 存放图片的数组
      showImgList: [], // 备份图片
      imgList: [],
      fileList: [], // 文件数组
      tab: '0'
    }
  },
  computed: {
    tokenInfo () {
      return this.$store.getters.getTokenInfo
    },
    uploadUrl () {
      // let uploadUrl = this.url.systemSettings.dictImport
      let uploadUrl = '';
      return `/api${uploadUrl}`
    }
  },
  watch: {
    paramData (newVal) {
      // 设备变换清楚技术参数 
      console.log('newVal', newVal)
      this.form.techParams = JSON.parse(JSON.stringify(newVal));
    },
    tabInfoDetail: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.copyData = { ... this.copyData, ...JSON.parse(JSON.stringify(this.tabInfoDetail)) };
        this.tab = '0';
        this.activeName = 'techParam';
        console.log('val', this.tabInfoDetail)
        let imgList = val.devicePicture ? val.devicePicture.split(',').map((item, i) => ({ url: item, name: 'pci' + i + '.jpg', path: item })) : [];
        this.billImages = JSON.parse(JSON.stringify(imgList))
        this.showImgList = JSON.parse(JSON.stringify(imgList))
        this.form.files = val.attachment ? JSON.parse(val.attachment) : [];
      }
    }
  },
  methods: {
    handleClick (tab) {
      console.log('tab', tab)
      if (tab.name !== 'techParam') {
        this.tab = tab.index;
      }
    },
    // 
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        });
        return false;
      }
      if (this.billImages.length === 20) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        });
        return false;
      }
      return true;
    },
    addTableData () {  // 新增一条数据
      this.$refs.upload2.click();
      console.log('this.$refs.upload2', this.$refs.upload2)
      // if (tabMap[this.tab].add) {
      //   this.$refs.label.click();
      // } else {
      //   this.form[tabMap[this.tab].prefix].push(JSON.parse(JSON.stringify(tabMap[this.tab].data)))
      // }

    },
    checkData () {
      let result = false
      this.$refs.form.validate(res => {
        result = res
      });
      if (!result) return;
    },
    addDeviceData () {  // 新增一条数据
      this.form.tableDataList.push({
        type: '',
        model: '',
        unitPrice: '',
        number: '',
        price: ''
      });
    },
    delTableData (index) { // 删除一条数据
      this.form[tabMap[this.tab].prefix].splice(index, 1)
    },
    inited (viewer) {
      this.$viewer = viewer
    },
    /**  -----------文件上传  start-------------  */
    // handleChange (file, fileList) {
    handleChange (e) {
      let file = e.target.files[0];
      this.fileList.push(file)
      this.form.files.push({ fileName: file.name, file: file })
    },
    handleError () {
      this.dialogLoading = false
      this.form.name = ''
      this.$message.error('导入失败！')
    },
    /**  -----------文件上传     end-------------  */
    onError (err, file, fileList) {
      console.log('onError :', err, file, fileList);
      console.log('this.$refs.upload:', this.$refs.upload.uploadFiles); //this.$refs.upload.clearFiles()
      let uploadFiles = this.$refs.upload.uploadFiles;
      let index = uploadFiles.findIndex(n => n.name == file.name && n.url == file.url);
      uploadFiles.splice(index, 1);

      // this.handleRemove(file, fileList);
      this.$message({
        message: '图片上传失败！',
        type: 'error',
        duration: this.$baseConfig.messageDuration
      });
    },
    beforeRemove (file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < this.$baseConfig.imgLimitSize;
      if (!isLt2M) {
        return true;
      }

      return this.$confirm('确认删除该设备图片？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      });
    },
    handleRemove (file, fileList) {
      // this.removeImg(file);
      let i = this.showImgList.findIndex(item => item.name === file.name);
      console.log('i', i)
      this.showImgList.splice(i, 1);
    },
    // //文件超出个数限制时的钩子
    onExceed (files, fileList) {
      console.log('onExceed :', files, fileList, files.length + fileList.length);
      if (files.length + fileList.length > this.limit) {
        this.$message({
          message: '图片最多允许上传' + 20 + '张',
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
      if (res.code == 200) {
        console.log('res', res.data)
        let data = res.data;
        if (this.tab === '3') {
          this.addFile(data, file);
        } else {
          this.addImg(data, file);
        }
        console.log('this.billImages', this.billImages)
      } else {
        this.onError(res, file, fileList);
      }
      console.log('billImages', this.billImages)
    },
    addImg (data, file) {
      this.showImgList.push({ name: data.fileName, url: file.url, path: data.imgServer + '/' + data.filePath });
    },
    addFile (data, file) {
      this.form.files.push({ fileName: data.fileName, url: data.imgServer + '/' + data.filePath })
    },
    removeImg (file, i) {
      this.$confirm('确认删除该设备图片？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        this.$nextTick(_ => {
          // this.billImages.splice(i, 1);
          this.showImgList.splice(i, 1);
          this.billImages = JSON.parse(JSON.stringify(this.showImgList))
        })
      })
    },
    renderAddFile (h) { // 新增支路数据表头渲染函数
      return h(
        'label',
        {
          'class': {
            'el-icon-plus': true
          },
          style: {
            cursor: 'pointer'
          },
          attrs: {
            title: '新增一条数据'
          },
          on: {
            click: this.addTableData
          }
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.img-box {
  display: flex;
  .avatar-uploader {
    display: inline-block;
    /deep/ .el-upload-list {
      display: none;
    }
  }
}
.avatar-uploader-excel {
  display: inline-block;
  padding: 0;
  /deep/ div {
    padding: 0 !important;
  }
  /deep/ .el-upload-list {
    display: none;
  }
  i {
    font-size: 17px;
  }
}
.img-viewer {
  display: inline-block;
  .img-cell {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    position: relative;
    margin-left: 20px;
    .handle-bar {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      line-height: 30px;
      height: 0;
      transition: height 0.1s ease-out;
      text-align: center;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
      .exchange-uploader {
        display: inline-block;
        line-height: normal;
      }
      i {
        display: inline-block;
        font-size: 18px;
        color: white;
        padding: 0 10px;
        vertical-align: middle;
        &:hover {
          color: rgba(25, 130, 191, 0.8);
        }
        &.el-icon-delete:hover {
          color: red;
        }
      }
    }
    &:hover {
      .handle-bar {
        height: 30px;
      }
    }
  }
}

.tab-sub {
  width: 100%;
  height: 100%;
  .image {
    width: 100%;
    height: 100%;
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
    /deep/ .el-upload--picture-card,
    /deep/ .el-upload-list--picture-card .el-upload-list__item {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
    /deep/ .el-upload-list--picture-card .el-upload-list__item {
      line-height: 0px;
    }
  }
  .avatar-uploader-excel {
    /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 2px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    /deep/ .el-upload:hover {
      border-color: #409eff;
    }
    /deep/ .el-upload--picture-card,
    /deep/ .el-upload-list--picture-card .el-upload-list__item {
      width: 30px;
      height: 30px;
      line-height: 32px;
      position: relative;
      top: 8px;
    }
    /deep/ .el-upload-list--picture-card .el-upload-list__item {
      line-height: 0px;
    }
  }
  /deep/ .el-tabs__nav-wrap {
    margin: 0px;
  }
  /deep/ .el-tab-pane {
    padding: 0px;
    height: 210px;
    overflow-y: auto;
  }
  /deep/ .el-tabs__nav-scroll {
    padding: 0px;
  }
  /deep/ .el-tabs__content {
    padding: 0px;
  }
  /deep/ .el-form-item {
    margin-bottom: auto;
    margin-right: auto;
    &.is-error {
      margin-bottom: 20px;
    }
  }
  /deep/ .el-form-item--small {
    min-height: auto;
    line-height: normal;
  }
}
</style>

