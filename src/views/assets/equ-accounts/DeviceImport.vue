<template>
  <div class="device-import" v-loading="dialogLoading">
    <el-form ref="form" :model="form" label-width="100px" size="mini" :label-position="'left'">
      <el-row>
        <p style="margin-left:80px">(Excel格式，数据量不超过1000条)</p>
        <el-form-item label="导入文件">
          <el-upload
            class="upload-trigger"
            ref="upload"
            :headers="{token:tokenInfo}"
            :multiple="false"
            :action="uploadUrl"
            :file-list="fileList"
            :auto-upload="false"
            :accept="$common.getMimeTypeList('xls,xlsx,xlsm').join(',')"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :on-error="handleError"
            :show-file-list="false"
          >
            <div>{{fileName}}</div>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="上传模板">
          <div @click="downLoadFile">
            <i class="el-icon-download"></i>下载导入模板
          </div>
        </el-form-item>
      </el-row>
      <el-row class="text-center">
        <el-button type="primary" size="mini" @click="submit">确 定</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import url from '@/axios/url.js'
import utils from '@/utils/utils.js'
export default {
  props: {
    importDialogVisible: Boolean,
  },
  data () {
    return {
      dialogLoading: false,
      fileList: [],
      form: {
        name: ''
      }
    }
  },
  computed: {
    uploadUrl () {
      // let uploadUrl = this.url.systemSettings.dictImport
      let uploadUrl = '';
      return `/api${uploadUrl}`
    },
    fileName () {
      return this.form.name || '请上传文件'
    },
    tokenInfo () {
      return this.$store.getters.getTokenInfo
    }
  },
  methods: {
    cancle () {
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = ''
      }, this)
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:importDialogVisible', false)
    },
    submit () {
    },
    downLoadFile () {
      // utils.downloadFile('/api/system-setting/excel/SystemGlobalSet.xlsx')
    },
    handleChange (file, fileList) {
      this.form.name = file.status === 'ready' ? file.name : ''
      this.fileList = file.status === 'ready' ? [file] : []
      this.fileList.length && this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    handleSuccess (res) {
      this.dialogLoading = false
      if (res.code !== 200) {
        this.$refs.upload && this.$refs.upload.clearFiles()
        this.form.name = ''
        this.$message.error('导入失败！')
        return
      }
      let errorData = []
      for (const name in res.data) {
        errorData.push({
          "name": name,
          "reason": res.data[name].reason,
          "row": res.data[name].row
        })
      }
      if (!errorData.length) {
        this.$message.success('导入成功！')
        this.$emit('success')
        this.cancle()
        return
      }
      errorData.length && this.$confirm('部分数据导入有问题，是否下载问题列表查看？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        this.handleDownload(errorData)
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        this.$emit('success')
        this.cancle()
      })
    },
    handleError () {
      this.dialogLoading = false
      this.form.name = ''
      this.$message.error('导入失败！')
    },
    handleDownload (errorList) {
      import('@/vendor/Export2Excel.js').then(excel => {
        const tHeader = ['参数名', '失败原因', '第几行']//头
        const filterVal = ['name', 'reason', 'row']//值
        const data = this.formatJson(filterVal, errorList)
        excel.export_json_to_excel(
          tHeader,
          data,
          '数据导入问题列表'
        )
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.device-import {
  /deep/ .el-form-item {
    margin-bottom: 10px;
    &.is-error {
      margin-bottom: 20px;
      /deep/ .el-form-item__error {
        background: none;
      }
    }
  }
  /deep/ .el-form-item__content {
    > div {
      cursor: pointer;
      padding: 0 10px;
      box-sizing: border-box;
      background: #efefef;
      border-radius: 5px;
      &:hover {
        background: #eee;
      }
    }
  }
  .upload-trigger {
    cursor: pointer;
    /deep/ .el-upload--text {
      width: 100%;
      text-align: left;
    }
  }
  .text-center {
    text-align: center;
  }
}
</style>