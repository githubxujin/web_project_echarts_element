<template>
  <div class="monitor-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="监控界面配置" name="default">
          <!-- 查询条件 -->
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="监控界面名称：">
              <el-input
                v-model.trim="form.name"
                placeholder="请输入名称"
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
                  <span
                    v-if="item.dict"
                  >{{scope.row[item.prop] | translate(item.dict, item.options)}}</span>
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
      :modal-append-to-body="false"
    >
      <span slot="title" class="dialog-header">{{monitorItem?'编辑监控界面': '新增监控界面'}}</span>
      <monitor-editor
        ref="monitorEditor"
        :editDialogVisible.sync="editDialogVisible"
        :monitorItem.sync="monitorItem"
        :monitorTypeList="monitorTypeList"
        @success="search"
      ></monitor-editor>
    </el-dialog>
  </div>
</template>
<script>
import Pager from '@/components/table/Pager'
import MonitorEditor from './MonitorEditor.vue'
import utils from '@/utils/utils.js'
import { monitorQuery, configTypeQuery } from '@/services/system-settings.js'
import { statusEnum } from '@/enum/dicts.js'
export default {
  components: { Pager, MonitorEditor },
  data () {
    return {
      activeName: 'default',
      tableHeight: 500,
      statusEnum: JSON.parse(JSON.stringify(statusEnum)), // 状态字典
      monitorTypeList: [], // 监控界面类型列表
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
      monitorItem: null, // 编辑对象
      editDialogVisible: false // 编辑框显示属性
    }
  },
  computed: {
    pageBtns () {
      return this.$store.getters.getPageBtns || [];
    },
    itemPropList () {// 表格列展示属性列表
      return [
        {
          label: '监控界面名称',
          prop: 'name',
        },
        {
          label: '监控界面类型',
          prop: 'type',
          dict: this.monitorTypeList,
          options: {
            label: 'configName',
            value: 'id'
          }
        },
        {
          label: '状态',
          prop: 'status',
          dict: statusEnum
        }
      ]
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
    this.initData(this.search)
  },
  methods: {
    monitorQuery,
    configTypeQuery,
    initData (callback) {
      this.$common.updateLoadingStatus(true)
      const configType = 22
      this.configTypeQuery({ configType }).then(res => {
        this.monitorTypeList = res.data[configType]
        callback && callback()
        !callback && this.$common.updateLoadingStatus(false)
      }).catch(_ => {
        callback && callback()
        !callback && this.$common.updateLoadingStatus(false)
      })
      this.statusEnum.unshift({
        label: '全部',
        status: ''
      })
    },
    search (pager = this.pager) { // 查询
      this.$common.updateLoadingStatus(true)
      this.monitorQuery(Object.assign({}, this.params, pager)).then(res => {
        this.$common.updateLoadingStatus(false)
        let data = res.data || {}
        this.dataList = data.list || []
        this.pager.total = data.total
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
        console.log("表计参数列表查询失败(errorMessage):", _);
      })
    },
    addNew () { // 新增
      this.monitorItem = null;
      this.editDialogVisible = true
      console.log('新增表计参数')
    },
    editItem (item) { // 编辑
      this.monitorItem = item;
      this.editDialogVisible = true
      console.log('编辑:', item);
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs.monitorEditor && this.$refs.monitorEditor.cancle()
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
.monitor-management {
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
