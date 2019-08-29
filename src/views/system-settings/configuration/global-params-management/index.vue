<template>
  <div class="dict-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="全局参数配置" name="default">
          <el-tabs v-model="form.type" type="card" class="tab-header-block">
            <el-tab-pane
              v-for="item in tabListData"
              :label="item.name"
              :name="item.id.toString()"
              :key="item.name"
            ></el-tab-pane>
          </el-tabs>
          <!-- 查询条件 -->
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="所属子类：" v-show="subTypeList.length">
              <el-select v-model="form.configType" placeholder="全部">
                <el-option
                  v-for="(item,index) in subTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.tid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="float-right"
              v-if="pageBtns.some(val => val === 'import') || pageBtns.some(val => val === 'add')"
            >
              <el-button
                v-if="pageBtns.some(val => val === 'add')"
                @click="$common.debounce(addNew)()"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              >新增</el-button>
              <el-button
                v-if="pageBtns.some(val => val === 'import')"
                @click="$common.debounce(importNew)()"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              >导入</el-button>
            </el-form-item>
          </el-form>
          <div calss="tableBox">
            <el-table
              :data="dataList"
              :height="tableHeight"
              style="width: 100%"
              ref="table"
              @cell-dblclick="cellDbClick"
              :class="{'input-is-error': !editStatus}"
              border
            >
              <el-table-column
                header-align="center"
                align="center"
                type="index"
                :index="indexMethod"
                label="序号"
              ></el-table-column>
              <el-table-column header-align="center" align="center" prop="configName" label="类别名称">
                <template slot-scope="scope">
                  <el-input
                    v-show="dictItem.property === 'configName' && dictItem.id === scope.row.id"
                    v-model.trim="dataList[scope.$index].configName"
                    @blur="editItem(scope)"
                    v-focus
                    :suffix-icon="editLoading?'el-icon-loading' : ''"
                    :readonly="editLoading"
                    maxlength="32"
                  ></el-input>
                  <!-- <el-tooltip
                    v-show="dictItem.property !== 'configName' || dictItem.id !== scope.row.id"
                    class="item"
                    effect="dark"
                    :content="scope.row.configName"
                    placement="top"
                  >-->
                  <span class="no-wrap">{{scope.row.configName}}</span>
                  <!-- </el-tooltip> -->
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" prop="rank" label="排序">
                <template slot-scope="scope">
                  <el-input
                    v-show="dictItem.property === 'rank' && dictItem.id === scope.row.id"
                    v-model.trim="dataList[scope.$index].rank"
                    @blur="editItem(scope)"
                    v-focus
                    :suffix-icon="editLoading?'el-icon-loading' : ''"
                    :readonly="editLoading"
                  ></el-input>
                  <span
                    v-show="dictItem.property !== 'rank' || dictItem.id !== scope.row.id"
                  >{{scope.row.rank}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" prop="pid" label="父类">
                <template slot-scope="scope">
                  <el-select
                    v-if="dictItem.property === 'pid' && dictItem.id === scope.row.id"
                    v-model="dataList[scope.$index].pid"
                    @visible-change="pidVisibleChange"
                    @change="editItem(scope)"
                    :filterable="true"
                    :disabled="editLoading"
                    clearable
                    v-focus
                  >
                    <el-option
                      v-for="item in dictListSelf"
                      :key="item.id"
                      :label="item.configName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <!-- <el-tooltip
                    v-show="dictItem.property !== 'pid' || dictItem.id !== scope.row.id"
                    class="item"
                    effect="dark"
                    :content="scope.row.pid | translate(dictList, translateOptions)"
                    placement="top"
                  >-->
                  <span class="no-wrap">{{scope.row.pid | translate(dictList, translateOptions)}}</span>
                  <!-- </el-tooltip> -->
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" prop="content" label="备注">
                <template slot-scope="scope">
                  <el-input
                    v-show="dictItem.property === 'content' && dictItem.id === scope.row.id"
                    v-model.trim="dataList[scope.$index].content"
                    @blur="editItem(scope)"
                    :suffix-icon="editLoading?'el-icon-loading' : ''"
                    :readonly="editLoading"
                    v-focus
                  ></el-input>
                  <!-- <el-tooltip
                    v-show="dictItem.property !== 'content' || dictItem.id !== scope.row.id"
                    class="item"
                    effect="dark"
                    :content="scope.row.content"
                    placement="top"
                  >-->
                  <span class="no-wrap">{{scope.row.content}}</span>
                  <!-- </el-tooltip> -->
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                label="操作"
                width="180"
                v-if="pageBtns.some(val => val === 'delete')"
              >
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="delItem(scope.row)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <Pager :pager="pager" @setPager="getDataList"></Pager>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 编辑导入窗口 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :width="openDialog === 'dictEditor' ? '700px' : '500px'"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">{{openDialog === 'dictEditor' ? '新增类别' : '导入类别'}}</span>
      <component
        :is="openDialog"
        ref="dialog"
        :dialogVisible.sync="dialogVisible"
        :data="form"
        :tabListData="tabListData"
        :subTypeListCopy="subTypeList"
        :dictListCopy="dictList"
        @success="search"
      ></component>
    </el-dialog>
  </div>
</template>
<script>
import Pager from '@/components/table/Pager'
import dictEditor from './DictEditor.vue'
import dictImport from './DictImport'
import utils from '@/utils/utils.js'
import Regexps from '@/utils/regexp.js'
import { dictGetType, dictQuery, dictEdit, dictDelete, dictGetArray } from '@/services/system-settings.js'
const translateOptions = { // 翻译字典配置项
  label: 'configName',
  value: 'id'
}
export default {
  components: { Pager, dictEditor, dictImport },
  directives: {
    focus: {
      inserted: (el) => {
        el.getElementsByTagName('input')[0].focus()
      },
      componentUpdated: (el) => {
        el.getElementsByTagName('input')[0].focus()
      }
    }
  },
  data () {
    return {
      Regexps, // 正则集合
      translateOptions,
      activeName: 'default',
      tabListData: [], // 大类tab列表
      subTypeList: [], // 子类列表
      dictList: [], // 字典列表
      dictListSelf: [], // 除却自己的字典
      tableHeight: 500,
      dataList: [], // 表格数据
      form: { // 表单内容
        type: '',
        configType: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      dictItem: {}, // 编辑对象判断条件
      editLoading: false, // 正在提交编辑状态
      editStatus: true, // 编辑是否成功标志位
      dialogVisible: false, // 编辑框显示属性
      dialogVisible: false, // 导入框显示属性
      openDialog: '' // 打开的dialog
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
      if (!this.subTypeList.length) {
        for (let index = 0, len = this.tabListData.length; index < len; index++) {
          if (this.tabListData[index].id.toString() === form.type) {
            form.configType = this.tabListData[index].tid
            break;
          }
        }
      }
      return form
    }
  },
  created () {
    this.initData()
  },
  methods: {
    dictGetType, // 公共配置菜单
    dictQuery, // 查询字典列表 分页
    dictGetArray, // 查询字典列表不分页
    dictEdit, // 编辑
    dictDelete, // 删除
    initData () { // 初始化大类小类
      this.$common.updateLoadingStatus(true)
      this.tabListData = []
      this.dictGetType().then(res => {
        this.$common.updateLoadingStatus(false)
        this.tabListData = (res.data || {}).array || []
        this.form.type = (this.tabListData[0] || {}).id.toString() || ''
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
      })
    },
    initDict () { // 初始化字典列表用于翻译父类
      this.dictGetArray(this.params).then(res => {
        this.dictList = res.data[this.params.configType]
      }).catch(_ => {
        this.dictList = []
      })
    },
    search (pager = this.pager) { // 查询列表
      this.initDict()
      this.getDataList()
    },
    getDataList () {
      this.$common.updateLoadingStatus(true)
      this.dictQuery(Object.assign({}, this.params, this.pager)).then(res => {
        this.$common.updateLoadingStatus(false)
        let data = res.data || {}
        data.list.forEach(item => {
          if (~~item.pid === 0) item.pid = ''
        })
        this.dataList = data.list
        this.pager.total = data.total
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
        console.log("表计参数列表查询失败(errorMessage):", _);
      })
    },
    addNew () { // 新增
      this.dialogVisible = true
      this.openDialog = 'dictEditor'
      console.log('新增表计参数')
    },
    importNew () {
      this.dialogVisible = true
      this.openDialog = 'dictImport'
    },
    cellDbClick (row, column, cell, event) {
      // 在编辑状态再次双击避免导致再次赋值，防止在失焦或值变化回调中判断值是否不变时误判
      if (column.property === this.dictItem.property && row.id === this.dictItem.id || !this.editStatus || this.editLoading) return
      // 选择父类时，过滤掉自己
      if (column.property === 'pid') {
        this.dictListSelf = this.dictList.filter(item => { return item.id !== row.id })
      }
      // 赋值编辑对象 id 及 property用于判断编辑对象,如果编辑失败需要改变值 则可用dictItem内部保存的原始值
      this.dictItem = {
        ...row,
        property: column.property,
        originData: row[column.property]
      }
    },
    editItem (scope) { // 失焦或值改变时编辑字典
      console.log('blur', this.dataList[scope.$index], scope.row);
      const property = this.dictItem.property
      if (scope.row.system === 0) {
        this.$message({
          type: 'error',
          message: '系统内置属性，无法编辑!'
        });
        scope.row[property] = this.dictItem.originData  // 显示原始值
        this.dictItem = {} // 清空编辑对象判断条件
        return
      }
      if (this.dictItem[property] === scope.row[property]) { // 值不变情况下 不请求接口修改
        this.dictItem = {} // 清空编辑对象判断条件
        return
      }
      if (this.dictItem.property === 'rank' && !this.Regexps.positiveInteger0.test(scope.row.rank) || scope.row.rank > 127) {  // 输入值进行校验，校验失败不请求接口修改
        // this.editStatus = false // 标志编辑失败
        this.$message({
          type: 'error',
          message: '排序值必须为0-127之间的自然数！'
        });
        scope.row[property] = this.dictItem.originData
        this.dictItem = {} // 清空编辑对象判断条件
        return
      }
      scope.row.rank = parseInt(scope.row.rank)
      this.editLoading = true // 标志编辑中
      this.dictEdit(scope.row).then(res => {
        this.dictItem = {} // 清空编辑对象判断条件
        this.editStatus = true // 标志编辑成功
        this.editLoading = false // 标志不在编辑中
        if (property === 'configName') { // 修改了名字情况下重新初始化字典列表用于翻译父节点数据
          this.initDict()
        }
      }).catch(_ => {
        this.editStatus = false // 标志编辑失败
        this.editLoading = false// 标志不在编辑中
      })
    },
    delItem (item) {
      this.$confirm(`删除后将不再显示，请确认'${item.configName}'类别未被使用。确认是否删除？`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        this.dictDelete(item).then(res => {
          if (res.code !== 200) return Promise.reject('失败')
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.search()
        }).catch(_ => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        });
      });
    },
    pidVisibleChange (visible) { // select 下拉框消失情况下 情况编辑对象判断条件
      if (!visible) this.dictItem = {}
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs.dialog && this.$refs.dialog.cancle()
    },
    resetTableHeight () { // 重置table高度
      this.$common.initTableHeight(this);
    },
    indexMethod (index) { // 序号
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    }
  },
  watch: {
    dialogVisible: (val, oldVal) => {
      console.log('dialogVisible', val, oldVal);
    },
    'form.type': { // 大类变动且只有大类，无小类时 触发查询
      handler: function (val) {
        if (!val) {
          this.subTypeList = []
        } else {
          for (let index = 0, len = this.tabListData.length; index < len; index++) {
            if (this.form.type === this.tabListData[index].id.toString()) {
              this.subTypeList = this.tabListData[index].array || []
              this.form.configType = (this.subTypeList[0] || {}).tid || ''
              if (!this.form.configType && this.form.configType !== 0) {
                this.pager.pageNum = 1
                this.search()
              }
              break;
            }
          }
        }
      }
    },
    'form.configType': { // 小类变动时，触发查询（即使是不同type之下的configType也是不会一样的，configType具备唯一性）
      handler: function (val) {
        if (!val && val !== 0) return
        console.log('form.configType');
        this.pager.pageNum = 1
        this.search()
      }
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
.dict-management {
  .no-wrap {
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .input-is-error {
    /deep/ .el-input__inner {
      border-color: #f56c6c;
    }
  }
  .tab-header-block {
    margin: 10px -15px 0 -15px;
    background-color: unset;
    /deep/ .el-tabs__header.is-top {
      margin: 0;
    }
    /deep/ .el-tabs__nav-wrap {
      background-color: unset;
      .el-tabs__nav-next {
        line-height: 40px;
        font-size: 12px;
        border-left: 1px solid #e4e7ed;
        width: 20px;
        z-index: 100;
      }
      .el-tabs__nav-prev {
        line-height: 40px;
        font-size: 12px;
        border-right: 1px solid #e4e7ed;
        width: 20px;
        z-index: 100;
      }
      .el-tabs__nav-scroll {
        .el-tabs__item {
          cursor: pointer;
          background: #f4f7fa;
          border-bottom: 1px solid #e4e7ed;
          &.is-active {
            background: white;
            border-bottom: 1px solid transparent;
          }
        }
      }
      &.is-scrollable {
        .el-tabs__nav-scroll {
          padding-left: 0px;
        }
      }
    }
    /deep/ .el-tabs__content {
      margin: 0;
      height: 0;
    }
  }
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
