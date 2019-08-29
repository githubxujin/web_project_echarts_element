<template>
  <div class="cool-station-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="冷站管理" name="default">
          <!-- 查询条件 -->
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="设备名称：">
              <el-input
                v-model.trim="form.name"
                placeholder="请输入设备名称"
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
      width="700px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">{{coolStationItem?'编辑': '新增'}}</span>
      <cool-station-editor
        ref="coolStationEditor"
        :editDialogVisible.sync="editDialogVisible"
        :coolStationItem.sync="coolStationItem"
        @success="search"
      ></cool-station-editor>
    </el-dialog>
  </div>
</template>
<script>
import Pager from '@/components/table/Pager'
import CoolStationEditor from './CoolStationEditor.vue'
import utils from '@/utils/utils.js'
import { coolingStationQuery } from '@/services/system-settings.js'
import { statusEnum } from '@/enum/dicts.js'
export default {
  components: { Pager, CoolStationEditor },
  data () {
    return {
      activeName: 'default',
      tableHeight: 500,
      statusEnum: JSON.parse(JSON.stringify(statusEnum)), // 状态字典
      itemPropList: [
        {
          label: '设备编号',
          prop: 'number',
        },
        {
          label: '设备名称',
          prop: 'name',
        },
        {
          label: '所属支路',
          prop: 'meterNameList',
        },
        {
          label: '状态',
          prop: 'status',
          dict: statusEnum
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
      coolStationItem: null, // 编辑对象
      editDialogVisible: false // 编辑框显示属性
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
    this.statusEnum.unshift({
      label: '全部',
      status: ''
    })
    this.search()
  },
  methods: {
    coolingStationQuery,
    search (pager = this.pager) { // 查询
      this.$common.updateLoadingStatus(true)
      this.coolingStationQuery(Object.assign({}, this.params, pager)).then(res => {
        this.$common.updateLoadingStatus(false)
        let data = res.data || {}
        this.dataList = data.list || []
        this.pager.total = data.total
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
      })
    },
    addNew () { // 新增
      this.coolStationItem = null;
      this.editDialogVisible = true
    },
    editItem (item) { // 编辑
      this.coolStationItem = item;
      this.editDialogVisible = true
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs.coolStationEditor && this.$refs.coolStationEditor.cancle()
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
<style>
.custom-tree-node{
  padding-right: 15px;
}
</style>

<style lang="scss" scoped>
.cool-station-management {
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
