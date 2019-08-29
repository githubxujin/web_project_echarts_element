<template>
  <div class="tab-sub">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="技术参数" name="params">
        <el-form ref="form" :model="form">
          <el-table
            :data="form.tableDataList"
            height="200"
            border
            style="width: 100%;margin-bottom: 10px"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="paramName" label="参数名称" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`tableDataList[${scope.$index}].paramName`" :rules="inputRule">
                  <el-input v-model.trim="form.tableDataList[scope.$index].paramName"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="paramValue" label="参数值" header-align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`tableDataList[${scope.$index}].paramValue`"
                  :rules="numberRule"
                >
                  <el-input v-model.trim="form.tableDataList[scope.$index].paramValue"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              width="50"
              header-align="center"
              align="center"
              :render-header="renderAddTag"
            >
              <template style="cursor: pointer" slot-scope="scope">
                <i
                  style="cursor: pointer"
                  class="el-icon-remove-outline"
                  @click="delTableData(scope.$index)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="关联设备" name="relatedEquipment">
        <el-form ref="form" :model="form">
          <el-table
            :data="form.tableDataList"
            height="200"
            border
            style="width: 100%;margin-bottom: 10px"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="paramName" label="配件名称" header-align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`tableDataList[${scope.$index}].paramName`" :rules="inputRule">
                  <el-input v-model.trim="form.tableDataList[scope.$index].paramName"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="paramValue" label="规格型号" header-align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`tableDataList[${scope.$index}].paramValue`"
                  :rules="numberRule"
                >
                  <el-input v-model.trim="form.tableDataList[scope.$index].paramValue"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="paramValue" label="当前库存" header-align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`tableDataList[${scope.$index}].paramValue`"
                  :rules="numberRule"
                >
                  <el-input v-model.trim="form.tableDataList[scope.$index].paramValue"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="paramValue" label="单位" header-align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`tableDataList[${scope.$index}].paramValue`"
                  :rules="numberRule"
                >
                  <el-input v-model.trim="form.tableDataList[scope.$index].paramValue"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              width="50"
              header-align="center"
              align="center"
              :render-header="renderAddDevice"
            >
              <template style="cursor: pointer" slot-scope="scope">
                <i
                  style="cursor: pointer"
                  class="el-icon-remove-outline"
                  @click="delTableData(scope.$index)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="设备图片" name="devicePicture">
        <el-upload
          :action="$store.state.base.uploadUrl"
          :headers="{token:tokenInfo}"
          list-type="picture-card"
          class="avatar-uploader"
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
      </el-tab-pane>
      <el-tab-pane label="附件" name="file">
        <el-table
          :data="form.tableDataList"
          height="200"
          border
          style="width: 100%;margin-bottom: 10px"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="fileName" label="附件名称" header-align="center"></el-table-column>
          <el-table-column prop="paramValue" label="操作" header-align="center">
            <span>下载</span>
          </el-table-column>
          <el-table-column
            width="50"
            header-align="center"
            align="center"
            :render-header="renderAddFile"
          >
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
        <el-table
          :data="form.tableDataList"
          height="200"
          border
          style="width: 100%;margin-bottom: 10px"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="fileName" label="工单号" header-align="center"></el-table-column>
          <el-table-column prop="paramValue" label="故障明细" header-align="center"></el-table-column>
          <el-table-column prop="paramValue" label="维修人" header-align="center"></el-table-column>
          <el-table-column prop="paramValue" label="完工时间" header-align="center"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="保养记录" name="serviceRecord" v-if="isEdit">
        <el-table
          :data="form.tableDataList"
          height="200"
          border
          style="width: 100%;margin-bottom: 10px"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="fileName" label="工单号" header-align="center"></el-table-column>
          <el-table-column prop="paramValue" label="计划名称" header-align="center"></el-table-column>
          <el-table-column prop="paramValue" label="保养人" header-align="center"></el-table-column>
          <el-table-column prop="paramValue" label="保养时间" header-align="center"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Regexps from '@/utils/regexp.js'
import utils from '@/utils/utils.js';
export default {
  props: ['isEdit'],
  data () {
    return {
      utils,
      activeName: 'params',
      limit: 5,
      form: {
        tableDataList: []
      },
      inputRule: {
        required: true,
        message: '必填',
        trigger: 'blur'
      },
      numberRule: [
        {
          required: true, message: '必填', trigger: 'blur'
        },
        {
          pattern: Regexps.positiveNumber, message: '仅支持正数', trigger: 'blur'
        }
      ],
      $viewer: null,
      dialogVisible: false,
      billImages: [],//存放图片的数组
    }
  },
  computed: {
    tokenInfo () {
      return this.$store.getters.getTokenInfo
    }
  },
  methods: {
    handleClick (tab) {
      console.log(tab)
    },
    addTableData () {  // 新增一条数据
      this.form.tableDataList.push({
        type: '',
        model: '',
        unitPrice: '',
        number: '',
        price: ''
      });
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
    addFileData () {  // 新增一条数据
      this.form.tableDataList.push({
        type: '',
        model: '',
        unitPrice: '',
        number: '',
        price: ''
      });
    },
    delTableData (index) { // 删除一条数据
      console.log(index)
      this.form.tableDataList.splice(index, 1)
    },
    inited (viewer) {
      this.$viewer = viewer
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

      return this.$confirm('确认删除该设备图片？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      });
    },
    handleRemove (file, fileList) {
      this.removeImg(file);
    },
    // //文件超出个数限制时的钩子
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
    renderAddTag (h) { // 新增支路数据表头渲染函数
      return h(
        'i',
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
    },
    renderAddDevice (h) { // 新增支路数据表头渲染函数
      return h(
        'i',
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
            click: this.addDeviceData
          }
        }
      )
    },
    renderAddFile (h) { // 新增支路数据表头渲染函数
      return h(
        'i',
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
            click: this.addFileData
          }
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-sub {
  width: 100%;
  height: 100%;
  .image {
    display: none;
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

