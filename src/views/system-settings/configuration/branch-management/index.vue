<template>
  <div class="branch-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="支路管理" name="default">
          <!-- 查询条件 -->
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="关键字：" label-width="70px">
              <el-input
                v-model.trim="form.name"
                placeholder="请输入电表地址/支路名称"
                :clearable="true"
                @keyup.native.enter.stop="$common.debounce(search)()"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  style="cursor: pointer;"
                  @click="$common.debounce(search)()"
                ></i>
              </el-input>
            </el-form-item>
            <el-form-item label="状态：" label-width="60px">
              <div style="width:120px;">
                <el-select v-model="form.status" placeholder="全部" :clearable="true">
                  <el-option
                    v-for="(item,index) in statusEnum"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label-width="50px" label=" ">
              <el-button
                @click="$common.debounce(search)()"
                type="primary"
                size="mini"
                icon="el-icon-search"
              >查询</el-button>
            </el-form-item>
            <el-form-item class="float-right">
              <el-button
                @click="$common.debounce(addNew)()"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                v-if="pageBtns.some(val => val === 'add')"
              >新增</el-button>
              <el-button
                v-if="pageBtns.some(val => val === 'import')"
                @click="$common.debounce(importData)()"
                size="mini"
              >导入</el-button>
            </el-form-item>
          </el-form>
          <div calss="tableBox">
            <el-table :data="dataList" ref="table" :height="tableHeight" style="width: 100%" border>
              <el-table-column
                header-align="center"
                align="center"
                type="index"
                :index="indexMethod"
                label="序号"
              ></el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                v-for="(item, index) in itemPropList"
                :key="index"
                :label="item.label"
                :width="item.width"
              >
                <template slot-scope="scope">
                  <span v-if="item.dict">{{scope.row[item.prop] | translate(item.dict)}}</span>
                  <span v-else>{{scope.row[item.prop]}}</span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                label="操作"
                width="180"
                v-if="pageBtns.some(val => val === 'edit')"
              >
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="editItem(scope.row)">编辑</el-button>
                    <el-button type="text" @click="changeTable(scope.row)">换表</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <Pager :pager="pager" @setPager="search"></Pager>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog
      :visible.sync="editDialogVisible"
      width="65%"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">{{branchItem?'编辑支路信息': '新增支路信息'}}</span>
      <branch-editor
        ref="branchEditor"
        :editDialogVisible.sync="editDialogVisible"
        :branchItem.sync="branchItem"
        @success="search"
      ></branch-editor>
    </el-dialog>
    <!-- 换表弹窗 -->
    <el-dialog
      :visible.sync="changeDialogVisible"
      width="900px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">{{`支路换表信息(${branchItem && branchItem.name})`}}</span>
      <branch-change-table-editor
        ref="branchChangeTable"
        :changeDialogVisible.sync="changeDialogVisible"
        :branchItem.sync="branchItem"
      ></branch-change-table-editor>
    </el-dialog>
    <!-- 导入弹窗 -->
    <el-dialog
      :visible.sync="importDialogVisible"
      width="500px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">导入支路信息</span>
      <branch-import ref="branchImport" :importDialogVisible.sync="importDialogVisible"></branch-import>
    </el-dialog>
  </div>
</template>
<script>
import Pager from '@/components/table/Pager'
import BranchEditor from './BranchEditor.vue'
import BranchChangeTableEditor from './BranchChangeTableEditor.vue'
import BranchImport from './BranchImport.vue'
import { statusEnum } from '@/enum/dicts.js'
import { meterQuery } from '@/services/system-settings.js'

// import { } from '@/services/system-settings.js'
import utils from '@/utils/utils.js'
export default {
  components: { Pager, BranchEditor, BranchChangeTableEditor, BranchImport },
  data () {
    return {
      activeName: 'default',
      tableHeight: 400,
      itemPropList: [{
        label: '电表地址',
        prop: 'number',
      }, {
        label: '支路名称',
        prop: 'name',
      }, {
        label: '所属支路',
        prop: 'parentName',
      }, {
        label: '状态',
        prop: 'status',
        dict: statusEnum,
        width: 180
      }], // 表格列展示属性列表
      dataList: [], // 表格数据
      form: { // 表单内容
        name: '',
        status: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      branchItem: null, // 编辑对象
      editDialogVisible: false, // 编辑框显示属性
      changeDialogVisible: false, // 支路信息换表框显示属性
      importDialogVisible: false // 支路信息导入框显示属性
    }
  },
  computed: {
    pageBtns () {
      return this.$store.getters.getPageBtns || [];
    },
    statusEnum () {
      let statusEnumCopy = JSON.parse(JSON.stringify(statusEnum))
      statusEnumCopy.unshift({
        label: '全部',
        status: ''
      })
      return statusEnumCopy
    },
    params () { // 格式化查询条件
      let form = JSON.parse(JSON.stringify(this.form))
      Object.keys(form).forEach(prop => {
        if (!form[prop] && form[prop] !== 0) delete form[prop]
      })
      return form
    }
  },
  created () {
    this.search()
  },
  methods: {
    meterQuery, // 支路列表查询
    search (pager = this.pager) { // 查询
      this.$common.updateLoadingStatus(true)
      this.meterQuery(Object.assign({}, this.params, pager)).then(res => {
        this.$common.updateLoadingStatus(false)
        this.dataList = (res.data || {}).list || []
        this.pager.total = (res.data || {}).total
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
        console.log("点表列表查询失败(errorMessage):", _);
      })
    },
    addNew () { // 新增
      this.branchItem = null;
      this.editDialogVisible = true
      console.log('新增用户')
    },
    editItem (item) { // 编辑
      this.branchItem = item;
      this.editDialogVisible = true
      console.log('编辑:', item);
    },
    changeTable (item) { // 换表
      this.branchItem = item;
      this.changeDialogVisible = true
      console.log('换表:', item);
    },
    importData () { // 打开导入窗口
      //导入成功后重新请求页面数据
      this.importDialogVisible = true
    },
    resetDialogForm () { // 重置弹窗表格内容
      let dialog = ''
      this.editDialogVisible && (dialog = 'branchEditor')
      this.changeDialogVisible && (dialog = 'branchChangeTable')
      this.importDialogVisible && (dialog = 'branchImport')
      this.$refs[dialog] && this.$refs[dialog].cancle()
    },
    indexMethod (index) {
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    },
    resetTableHeight () { // 重置table高度
      this.$common.initTableHeight(this);
    }
  },
  mounted () {
    // 重置table高度
    this.resetTableHeight()
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.resetTableHeight)
  },
  beforeDestroy () {
    // 移除监听窗口大小变化事件
    window.removeEventListener('resize', this.resetTableHeight)
  }
}
</script>
<style lang="scss" scoped>
.branch-management {
  .search-bar {
    padding-top: 15px;
    .float-right {
      float: right;
    }
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
