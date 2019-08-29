<template>
  <div class="water-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="给排水设备" name="default">
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
            <el-form-item label="设备类型：">
              <div style="width:200px;">
                <el-select v-model="form.deviceType" placeholder="全部" :clearable="true">
                  <el-option
                    v-for="(item,index) in deviceTypeList"
                    :key="index"
                    :label="item.configName"
                    :value="item.id"
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
    >
      <span slot="title" class="dialog-header">{{waterItem?'编辑': '新增'}}</span>
      <water-editor
        ref="waterEditor"
        :editDialogVisible.sync="editDialogVisible"
        :waterItem.sync="waterItem"
        :deviceTypeList="deviceTypeList"
        @success="search"
      ></water-editor>
    </el-dialog>
  </div>
</template>
<script>
import Pager from '@/components/table/Pager'
import WaterEditor from './WaterEditor.vue'
import utils from '@/utils/utils.js'
import { drainageQuery, deviceTypeQuery } from '@/services/system-settings.js'
import { statusEnum } from '@/enum/dicts.js'
export default {
  components: { Pager, WaterEditor },
  data () {
    return {
      activeName: 'default',
      tableHeight: 500,
      statusEnum: JSON.parse(JSON.stringify(statusEnum)), // 状态字典
      deviceTypeList: [], // 设备类型
      dataList: [], // 表格数据
      form: { // 表单内容
        name: '',
        deviceType: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      waterItem: null, // 编辑对象
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
    },
    itemPropList () {
      return [
        {
          label: '设备编号',
          prop: 'number',
        }, {
          label: '设备名称',
          prop: 'name',
        }, {
          label: '设备类型',
          prop: 'deviceType',
          dict: this.deviceTypeList,
          options: {
            label: 'configName',
            value: 'id'
          }
        }, {
          label: '所属单位',
          prop: 'belongToName',
        }, {
          label: '位置',
          prop: 'location',
        }, {
          label: '状态',
          prop: 'status',
          dict: statusEnum
        }]
    }, // 表格列展示属性列表

  },
  created () {
    this.initData()
    this.search()
  },
  methods: {
    drainageQuery,
    deviceTypeQuery,
    initData () {
      this.deviceTypeQuery({ deviceType: 2, flat: 1 }).then(res => {
        let arr = res.data.children.filter(item => ![6, 7].includes(item.id))
        this.deviceTypeList = arr
        this.deviceTypeList.unshift({
          configName: '全部',
          id: ''
        })
      })
      this.statusEnum.unshift({
        label: '全部',
        status: ''
      })
    },
    search (pager = this.pager) { // 查询    
      this.$common.updateLoadingStatus(true)
      this.drainageQuery(Object.assign({}, this.params, pager)).then(res => {
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
      this.waterItem = null;
      this.editDialogVisible = true
      console.log('新增表计参数')
    },
    editItem (item) { // 编辑
      this.waterItem = item;
      this.editDialogVisible = true
      console.log('编辑:', item);
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs.waterEditor && this.$refs.waterEditor.cancle()
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
.water-management {
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
