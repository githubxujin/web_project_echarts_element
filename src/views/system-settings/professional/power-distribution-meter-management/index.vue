<template>
  <div class="power-distribution-meter-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="配电参数" name="default">
          <!-- 查询条件 -->
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="参数名称：">
              <el-input
                v-model.trim="form.name"
                placeholder="请输入参数名称"
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
            <el-form-item label="所属支路：">
              <div>
                <el-select v-model="form.meterId" placeholder="全部" :clearable="true" filterable>
                  <el-option
                    v-for="item in meterList"
                    :label="item.name"
                    :value="item.id"
                    :key="item.id"
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
                  >{{scope.row[item.prop] | translate(item.dict, item.option)}}</span>
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
      <span slot="title" class="dialog-header">{{powerDistributionMeterId?'编辑': '新增'}}</span>
      <PowerDistributionMeterEditor
        ref="powerDistributionMeterEditor"
        :editDialogVisible.sync="editDialogVisible"
        :powerDistributionMeterId.sync="powerDistributionMeterId"
        :meterList="meterList"
        @success="search"
      ></PowerDistributionMeterEditor>
    </el-dialog>
  </div>
</template>
<script>
import Pager from '@/components/table/Pager'
import PowerDistributionMeterEditor from './PowerDistributionMeterEditor.vue'
import utils from '@/utils/utils.js'
import axios from '@/axios/axios.js'
import { powerDistributionMeterQuery, meterGetArray } from '@/services/system-settings.js'
import { statusEnum, paramStateEnum } from '@/enum/dicts.js'
export default {
  components: { Pager, PowerDistributionMeterEditor },
  data () {
    return {
      activeName: 'default',
      tableHeight: 500,
      meterList: [],
      dataList: [], // 表格数据
      form: { // 表单内容
        name: '',
        meterId: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      powerDistributionMeterId: null, // 编辑对象
      editDialogVisible: false // 编辑框显示属性
    }
  },
  computed: {
    pageBtns () {
      return this.$store.getters.getPageBtns || [];
    },
    itemPropList () {
      return [
        {
          label: '参数名称',
          prop: 'name',
        },
        {
          label: '采集命令',
          prop: 'gatherOrderName'
        },
        {
          label: '所属支路',
          prop: 'meterName',
        },
        {
          label: '数据类型',
          prop: 'dataType',
          dict: paramStateEnum
        },
        {
          label: '上限',
          prop: 'upperLimit',
        },
        {
          label: '下限',
          prop: 'lowerLimit',
        },
        {
          label: '状态',
          prop: 'status',
          dict: statusEnum
        },
      ] // 表格列展示属性列表
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
    powerDistributionMeterQuery, // 查询配电支路点表列表
    meterGetArray, // 获取支路列表
    initData (callback) { // 初始化数据
      this.$common.updateLoadingStatus(true)
      const shopNumber = this.params.shopNumber
      axios.all([this.meterGetArray({ shopNumber })]).then(axios.spread((...args) => {
        this.meterList = args[0].data.array || []
        callback && callback()
        !callback && (this.$common.updateLoadingStatus(false))
      })).catch(_ => {
        this.$common.updateLoadingStatus(false)
      })
    },
    search (pager = this.pager) { // 查询
      this.$common.updateLoadingStatus(true)
      this.powerDistributionMeterQuery(Object.assign({}, this.params, pager)).then(res => {
        this.$common.updateLoadingStatus(false)
        let data = res.data || {}
        this.dataList = data.list || []
        this.pager.total = data.total
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
        console.log("配电支路点表查询失败(errorMessage):", _);
      })
    },
    addNew () { // 新增
      this.powerDistributionMeterId = null;
      this.editDialogVisible = true
      console.log('新增配电支路点表')
    },
    editItem (item) { // 编辑
      this.powerDistributionMeterId = item.id;
      this.editDialogVisible = true
      console.log('编辑:', item);
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs.powerDistributionMeterEditor && this.$refs.powerDistributionMeterEditor.cancle()
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
.power-distribution-meter-management {
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
