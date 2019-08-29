<template>
  <div class="branch-import" v-loading="dialogLoading">
    <el-form ref="form" :model="form" label-width="100px" size="mini" :label-position="'left'">
      <el-row>
        <el-form-item label="导入文件">
          <el-upload
            class="upload-demo"
            ref="upload"
            :headers="$store.getters.getUploadHeader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="form.fileList"
            :auto-upload="false"
            :show-file-list="false"
            :accept="$common.getMimeTypeList('xls,xlsx,xlsm').join(',')"
          >
            <el-button slot="trigger" size="small" type="text">只能上传EXCEL文件(数量不超过1000条)</el-button>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="上传模板"></el-form-item>
      </el-row>
      <el-row class="text-center">
        <el-button type="primary" size="mini" @click="submit">{{branchItem ? '确 定' : '新 增'}}</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { meterTrade } from '@/services/system-settings.js'
export default {
  props: {
    importDialogVisible: Boolean,
    branchItem: Object
  },
  data () {
    return {
      dialogLoading: false,
      form: {
        fileList: []
      }
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
    }
  },
  watch: {
    'importDialogVisible': {
      immediate: true,
      handler: function (visible) {
        if (!visible || !this.branchItem) return
        let id = this.form.id = this.branchItem.id
        this.dialogLoading = true
      }
    }
  }
}
</script>
<style lang="scss">
</style>

<style lang="scss" scoped>
</style>