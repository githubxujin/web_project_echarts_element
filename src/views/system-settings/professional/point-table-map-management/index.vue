<template>
  <div class="point-table-map-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="点表映射值" name="default">
          <!-- 查询条件 -->
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="映射值类型：">
              <el-select v-model="form.status" placeholder="全部" :clearable="true">
                <el-option
                  v-for="(item,index) in []"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
      <span slot="title" class="dialog-header">{{pointTableMapItem?'编辑': '新增'}}</span>
      <point-table-map-editor
        ref="pointTableMapEditor"
        :editDialogVisible.sync="editDialogVisible"
        :pointTableMapItem.sync="pointTableMapItem"
        @success="search"
      ></point-table-map-editor>
    </el-dialog>
  </div>
</template>
<script>
import Pager from '@/components/table/Pager'
import PointTableMapEditor from './PointTableMapEditor.vue'
import utils from '@/utils/utils.js'
import { pointTableMapQuery } from '@/services/system-settings.js'
export default {
  components: { Pager, PointTableMapEditor },
  data () {
    return {
      activeName: 'default',
      tableHeight: 500,
      itemPropList: [{
        label: '映射值类型',
        prop: 'typeName',
      },
      {
        label: '点表地址',
        prop: 'pointTableAddr',
      },
      {
        label: '点表返回值',
        prop: 'returnValue',
      },
      {
        label: '值含义',
        prop: 'returnValueDesc',
      }, {
        label: '对应关键值',
        prop: 'keyValue',
      }, {
        label: '关键值含义',
        prop: 'keyValueDesc'
      }], // 表格列展示属性列表
      dataList: [], // 表格数据
      form: { // 表单内容
        type: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      pointTableMapItem: null, // 编辑对象
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
    this.search()
  },
  methods: {
    pointTableMapQuery,
    search (pager = this.pager) { // 查询
      this.$common.updateLoadingStatus(true)
      this.pointTableMapQuery(Object.assign({}, this.params, pager)).then(res => {
        this.$common.updateLoadingStatus(false)
        let data = res.data || {}
        this.dataList = data.list || []
        this.pager.total = data.total
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
        console.log("点表映射值列表查询失败(errorMessage):", _);
      })
    },
    addNew () { // 新增
      this.pointTableMapItem = null;
      this.editDialogVisible = true
      console.log('新增点表映射值')
    },
    editItem (item) { // 编辑
      this.pointTableMapItem = item;
      this.editDialogVisible = true
      console.log('编辑:', item);
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs.pointTableMapEditor && this.$refs.pointTableMapEditor.cancle()
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
.point-table-map-management {
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
