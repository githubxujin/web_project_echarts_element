<template>
  <div class="out-water-management">
    <el-form :inline="true" :model="form" class="search-bar" label-position="right">
      <el-form-item label="设备名称：">
        <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="位置：">
        <el-select v-model="form.location" placeholder="请选择">
          <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="50px" label=" ">
        <el-button
          @click="$common.debounce(search)()"
          type="primary"
          size="mini"
          icon="el-icon-search"
          round
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div calss="tableBox">
      <el-table :data="dataList" ref="table" :height="tableHeight" style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          type="index"
          :index="indexMethod"
          label="序号"
        ></el-table-column>
        <el-table-column header-align="center" align="center" prop="location" label="位置"></el-table-column>
        <el-table-column header-align="center" align="center" prop="number" label="编号"></el-table-column>
        <el-table-column header-align="center" align="center" prop="pump" label="水泵">
          <template slot-scope="scope">
            <span v-for="item in scope.row.pump.split(',')" :key="item">
              {{item}}
              <br>
            </span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="runingStatus" label="运行状态">
          <template slot-scope="scope">
            <span v-for="item in scope.row.runingStatus.split(',')" :key="item">
              {{item}}
              <br>
            </span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="operation" label="操作状态"></el-table-column>
        <el-table-column header-align="center" align="center" prop="floatingBall" label="浮球阀"></el-table-column>
        <el-table-column header-align="center" align="center" prop="status" label="状态"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { statusEnum } from '@/enum/dicts.js'

// import { } from '@/services/system-settings.js'
import utils from '@/utils/utils.js'
export default {
  data () {
    return {
      tableHeight: 400,
      itemPropList: [{
        label: '位置',
        prop: 'location',
      }, {
        label: '编号',
        prop: 'number',
      }, {
        label: '水泵',
        prop: 'pump',
        type: 'split'
      }, {
        label: '运行状态',
        prop: 'runingStatus',
        type: 'split'
      }, {
        label: '操作状态',
        prop: 'operation',
      }, {
        label: '浮球阀',
        prop: 'floatingBall',
      }, {
        label: '状态',
        prop: 'status',
      }], // 表格列展示属性列表
      dataList: [{
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }, {
        location: '-1F A区',
        number: '16#31',
        pump: '001,002',
        runingStatus: '运行,停止',
        operation: '远程',
        floatingBall: '开',
        status: '正常'
      }], // 表格数据
      form: { // 表单内容
        name: '',
        location: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      }
    }
  },
  computed: {
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
    search () { // 查询
      this.$common.updateLoadingStatus(true)
      console.log('this.params', this.params);
      this.$common.updateLoadingStatus(false)
    },
    indexMethod (index) {
      return index + 1
    },
    resetTableHeight () { // 重置table高度
      this.$nextTick(function () {
        const tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 200;
        this.tableHeight = tableHeight < 200 ? 200 : tableHeight
      })
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
.out-water-management {
  .search-bar {
    padding-top: 15px;
    .float-right {
      float: right;
    }
  }
}
</style>
