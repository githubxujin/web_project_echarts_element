<template>
  <div class="point-table-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="自定义报警" name="default">
          <!-- 查询条件 -->
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="报警名称：">
              <el-input
                v-model.trim="form.alarmName"
                placeholder="请输入报警名称"
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
            <el-form-item label="监控对象：">
              <TreeSelect
                v-model="form.alarmDevice"
                placeholder="请选择"
                :clearable="true"
                :data="deviceTreeList"
                @change="deviceSelectChange"
              ></TreeSelect>
            </el-form-item>
            <el-form-item label="报警级别：">
              <el-select v-model="form.alarmLevel" placeholder="全部" :clearable="true">
                <el-option
                  v-for="item in alarmLevelList"
                  :key="item.id"
                  :label="item.configName"
                  :value="item.id"
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
            <el-form-item
              class="float-right"
              v-if="pageBtns.some(val => val === 'edit') || pageBtns.some(val => val === 'add')"
            >
              <el-button
                v-if="pageBtns.some(val => val === 'edit')"
                @click="$common.debounce(batchSet)()"
                type="primary"
                size="mini"
              >批量设置</el-button>
              <el-button
                v-if="pageBtns.some(val => val === 'add')"
                @click="$common.debounce(addNew)()"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              >新增</el-button>
            </el-form-item>
          </el-form>
          <div calss="tableBox">
            <el-table
              :data="dataList"
              :height="tableHeight"
              style="width: 100%"
              ref="table"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column type="selection" width="55"></el-table-column>
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
                  <span v-else-if="item.prop==='upgradeTime'  && scope.row[item.prop]">{{scope.row[item.prop]}}
                    <span v-if="scope.row['upgradeTimeUnit']==='1'">分钟</span>
                    <span v-else-if="scope.row['upgradeTimeUnit']==='2'">小时</span>后升级</span>
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
      top="50px"
      width="950px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">编辑</span>
      <alarm-editor
        ref="alarmEditor"
        :editDialogVisible.sync="editDialogVisible"
        :alarmId.sync="alarmId"
        @success="search"
      ></alarm-editor>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="batchDialogVisible" width="1000px" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">批量编辑自定义报警</span>
      <batch-editor
        ref="batchEditor"
        :batchDialogVisible.sync="batchDialogVisible"
        :selection="selection"
        @success="search"
      ></batch-editor>
    </el-dialog>
  </div>
</template>
<script>
import TreeSelect from '@/components/treeSelect'
import Pager from '@/components/table/Pager'
import AlarmEditor from './AlarmEditor.vue'
import BatchEditor from './BatchEditor.vue'
import utils from '@/utils/utils.js'
import { alarmQueryList, configTypeQuery, alarmDeviceTreeSelectiveQuery } from '@/services/system-settings.js'
import axios from '@/axios/axios.js'
export default {
  components: { TreeSelect, Pager, AlarmEditor, BatchEditor },
  data () {
    return {
      activeName: 'default',
      tableHeight: 500,
      alarmTypeList: [ // 所属系统列表
        {
          label: '供配电',
          value: 1
        }, {
          label: '给排水',
          value: 2
        }, {
          label: '空调',
          value: 3
        }, {
          label: '电梯',
          value: 4
        }, {
          label: '能管',
          value: 5
        }],
      deviceTreeList: [], // 设备列表树
      alarmLevelList: [],// 告警级别列表
      dataList: [], // 表格数据
      selection: [], // 选中项
      form: { // 表单内容
        alarmName: '',
        alarmDevice: '', // 这个属性没用的，用来满足treeSlect的value属性必传的要求
        systemType: '',
        deviceType: '',
        deviceId: '',
        alarmLevel: '',
        status: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      alarmId: null, // 编辑对象
      editDialogVisible: false, // 编辑框显示属性
      batchDialogVisible: false // 批量设置框显示属性
    }
  },
  computed: {
    pageBtns () {
      return this.$store.getters.getPageBtns || [];
    },
    itemPropList () {// 表格列展示属性列表
      return [{
        label: '名称',
        prop: 'alarmName',
      },
      {
        label: '监控对象',
        prop: 'alarmDeviceName',
      },
      {
        label: '位置',
        prop: 'alarmLocation',
      },
      {
        label: '级别',
        prop: 'alarmLevel',
        dict: this.alarmLevelList,
        option: { // 翻译字典配置项
          label: 'configName',
          value: 'id'
        }
      },
      {
        label: '升级机制',
        prop: 'upgradeTime'
      },
      // {
      //   label: '升级机制',
      //   prop: 'alarmSystemType',
      //   dict: this.alarmTypeList
      // },
      {
        label: '备注',
        prop: 'remark',
      }]
    },
    params () { // 格式化查询条件
      let form = JSON.parse(JSON.stringify(this.form))
      delete form.alarmDevice
      Object.keys(form).forEach(prop => {
        if (!form[prop] && form[prop] !== 0) delete form[prop]
      })
      return form
    }
  },
  created () {
    this.initDict(this.search)
  },
  methods: {
    alarmDeviceTreeSelectiveQuery,
    configTypeQuery,
    alarmQueryList,
    initDict (callback) { // 下拉数据初始化
      const configType = 28
      const shopNumber = (this.$store.getters.getUserInfo || {}).shopNumber
      this.$common.updateLoadingStatus(true)
      axios.all([this.configTypeQuery({ configType }), this.alarmDeviceTreeSelectiveQuery({ shopNumber })]).then(axios.spread((...args) => {
        this.alarmLevelList = args[0].data[28]
        this.deviceTreeList = args[1].data.array || []
        callback && callback()
      })).catch(_ => {
        this.$common.updateLoadingStatus(false)
        console.error('查询下拉数据失败(errorMessage):', _);
      })
    },
    search (pager = this.pager) { // 查询
      this.$common.updateLoadingStatus(true)
      this.alarmQueryList(Object.assign({}, this.params, pager)).then(res => {
        this.$common.updateLoadingStatus(false)
        let data = res.data || {}
        this.dataList = data.list || []
        this.pager.total = data.total
      }).catch(_ => {
        this.$common.updateLoadingStatus(false)
        console.error("自定义告警查询失败(errorMessage):", _);
      })
    },
    addNew () { // 新增
      this.$router.push('/settings/basics/new-alarm')
    },
    batchSet () {
      if (!this.selection.length) {
        this.$message.warning('请先选择设置项！')
        return
      }
      this.batchDialogVisible = true
    },
    editItem (item) { // 编辑
      this.alarmId = item.id;
      this.editDialogVisible = true
    },
    deviceSelectChange (item) { // 设备下拉选中回调,根节点中间节点叶子节点 传不同的参数给后端进行查询
      this.form.systemType = null
      this.form.deviceType = null
      this.form.deviceId = null
      if (!item) return;
      console.log('item :', item);
      let data = item.data;
      if (data.deviceType || data.deviceType === 0) { // 叶子节点
        this.form.deviceType = data.deviceType || ''
        this.form.deviceId = data.realId || ''
      } else if (data.pid === 0) { // 根节点
        this.form.systemType = data.id || ''
      } else { // 中间节点 data.configType
        this.form.deviceType = data.id || ''
      }
    },
    resetDialogForm () { // 重置弹窗表格内容
      this.$refs['alarmEditor'] && this.$refs['alarmEditor'].cancle()
    },
    resetTableHeight () { // 重置table高度
      this.$common.initTableHeight(this);
    },
    handleSelectionChange (selection) { // 选中项变更
      this.selection = selection
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
.point-table-management {
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
