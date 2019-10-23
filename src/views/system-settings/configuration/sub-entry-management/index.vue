<template>
  <div class="subentry-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="分项管理" name="default">
          <!-- 查询条件 -->
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="搜索：">
              <el-input
                v-model.trim="form.number"
                placeholder="请输入分项编号或名称"
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
            <el-form-item label="能耗类型：">
              <div style="width:120px;">
                <el-select v-model="form.subType" placeholder="全部" :clearable="true">
                  <el-option
                    v-for="(item,index) in energyTypeEnum"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="状态：">
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

            <el-form-item class="float-right" v-if="pageBtns.some(val => val === 'add')">
              <el-button
                @click="$common.debounce(addNew)()"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              >导入</el-button>
            </el-form-item>
            <el-form-item class="float-right" v-if="pageBtns.some(val => val === 'add')">
              <el-button
                @click="$common.debounce(editItem)()"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              >新增</el-button>
            </el-form-item>
          </el-form>
          <div calss="tableBox">
            <el-table :data="dataList" :height="tableHeight" style="width: 100%" ref="table" border>
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
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :show-overflow-tooltip="true"
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
      width="800px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">{{subentryItem ? '编辑':'新增'}}</span>
      <subentry-editor
        ref="subentryEditor"
        :dialogVisible.sync="editDialogVisible"
        :subentryItem.sync="subentryItem"
        @success="search"
      ></subentry-editor>
    </el-dialog>
    <el-dialog :visible.sync="addDialogVisible" width="500px" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">选择分项</span>
      <subentryAdder
        v-if="addDialogVisible"
        ref="subentryAdd"
        :addDialogVisible.sync="addDialogVisible"
        @success="search"
      ></subentryAdder>
    </el-dialog>
  </div>
</template>
<script>
import Pager from '@/components/table/Pager'
import subentryEditor from './SubEntryEditor.vue'
import subentryAdder from './SubEntryAdder'
import utils from '@/utils/utils.js'
import { subentryQuery, subentryGetInfo, subentryGetArray, subentryAdd, subentryEdit } from '@/services/system-settings.js'
import { energyTypeEnum, statusEnum } from '@/enum/dicts.js'
export default {
  components: { Pager, subentryEditor, subentryAdder },
  data () {
    return {
      activeName: 'default',
      tableHeight: 500,
      energyTypeEnum: JSON.parse(JSON.stringify(energyTypeEnum)),
      statusEnum: JSON.parse(JSON.stringify(statusEnum)),
      itemPropList: [{
        label: '分项编号',
        prop: 'number',
      }, {
        label: '分项名称',
        prop: 'subName',
      }, {
        label: '所属分项',
        prop: 'parentName',
      }, {
        label: '能耗类型',
        prop: 'subType',
        dict: energyTypeEnum
      }, {
        label: '状态',
        prop: 'status',
        dict: statusEnum
      }], // 表格列展示属性列表
      dataList: [], // 表格数据
      form: { // 表单内容
        number: '',
        subType: '', // 能耗类型
        status: '',
        buildId: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      subentryItem: null, // 编辑对象
      editDialogVisible: false, // 编辑框显示属性
      addDialogVisible: false, // 新增框显示属性
    }
  },
  computed: {
    pageBtns () {
      return this.$store.getters.getPageBtns || [];
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
    this.energyTypeEnum.unshift({
      label: '全部',
      status: ''
    })
    this.statusEnum.unshift({
      label: '全部',
      status: ''
    })
    this.search()
  },
  methods: {
    subentryQuery,
    search (pager = this.pager) { // 查询
      this.$common.updateLoadingStatus(true)
      console.log('进入查询');
      this.subentryQuery(Object.assign({}, this.params, pager)).then(res => {
        this.$common.updateLoadingStatus(false)
        let data = res.data || {}
        this.dataList = data.list || []
        this.pager.total = data.total
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
        console.error("分项列表查询失败(errorMessage):", _);
      })
    },
    addNew () { // 新增
      this.addDialogVisible = true
    },
    editItem (item) { // 编辑
      this.subentryItem = item || null;
      this.editDialogVisible = true
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs['subentryEditor'] && this.$refs['subentryEditor'].cancle()
    },
    resetTableHeight () { // 重置table高度
      this.$common.initTableHeight(this);
    },
    indexMethod (index) { // 序号
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
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
.subentry-management {
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
