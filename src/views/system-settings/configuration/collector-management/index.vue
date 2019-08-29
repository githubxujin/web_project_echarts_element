<template>
  <div class="collector-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="采集器管理" name="default">
          <!-- 查询条件 -->
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="采集器名称：">
              <el-input
                v-model.trim="form.collectorName"
                placeholder="请输入采集器编号或名称"
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
      width="800px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">{{collectorItem?'编辑采集器': '新增采集器'}}</span>
      <collector-editor
        ref="collectorEditor"
        :editDialogVisible.sync="editDialogVisible"
        :collectorItem.sync="collectorItem"
        @success="search"
      ></collector-editor>
    </el-dialog>
  </div>
</template>
<script>
import Pager from '@/components/table/Pager'
import CollectorEditor from './CollectorEditor.vue'
import utils from '@/utils/utils.js'
import { collectorQuery, collectorGetInfo, collectorGetArray, collectorAdd, collectorEdit } from '@/services/system-settings.js'
import { yesOrNoEnum, statusEnum } from '@/enum/dicts.js'
export default {
  components: { Pager, CollectorEditor },
  data () {
    return {
      activeName: 'default',
      tableHeight: 500,
      yesOrNoEnum,
      statusEnum: JSON.parse(JSON.stringify(statusEnum)),
      itemPropList: [{
        label: '采集器编号',
        prop: 'number',
      }, {
        label: '采集器名称',
        prop: 'name',
      },
      //  {
      //   label: '所属系统',
      //   prop: 'belongToName',
      // }, 
      {
        label: '设备安装地址',
        prop: 'installAddress',
      }, {
        label: '是否在线',
        prop: 'online',
        dict: yesOrNoEnum
      }, {
        label: '状态',
        prop: 'status',
        dict: statusEnum
      }], // 表格列展示属性列表
      dataList: [], // 表格数据
      form: { // 表单内容
        collectorName: '',
        status: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      collectorItem: null, // 编辑对象
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
    collectorQuery,
    search (pager = this.pager) { // 查询
      this.$common.updateLoadingStatus(true)
      this.collectorQuery(Object.assign({}, this.params, pager)).then(res => {
        this.$common.updateLoadingStatus(false)
        let data = res.data || {}
        this.dataList = data.list || []
        this.pager.total = data.total
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
        console.log("采集器列表查询失败(errorMessage):", _);
      })
    },
    addNew () { // 新增
      this.collectorItem = null;
      this.editDialogVisible = true
      console.log('新增采集器')
    },
    editItem (item) { // 编辑
      this.collectorItem = item;
      this.editDialogVisible = true
      console.log('编辑:', item);
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs.collectorEditor && this.$refs.collectorEditor.cancle()
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
.collector-management {
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
