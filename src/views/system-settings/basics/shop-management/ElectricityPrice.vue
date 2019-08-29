<template>
  <div class="electricity-price" v-loading="loading">
    <div class="current-price-box">
      <header class="header">
        <span class="title">电价设置</span>
        <div class="float-right">
          <el-button @click="dialogVisible = true" type="text">
            编辑
            <i class="el-icon-edit-outline"></i>
          </el-button>
          <el-button @click="historyVisible = true" type="text">历史电价</el-button>
        </div>
      </header>
      <section class="section">
        <el-table
          v-if="currentPrice"
          class="price-table"
          :data="currentPrice.priceList"
          border
          :max-height="300"
          style="width: 100%"
          ref="priceTable"
          :span-method="objectSpanMethod"
        >
          <el-table-column
            width="120"
            label="类目"
            header-align="center"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{scope.row.type | translate(timeCategoryEnum)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="单价(元/kWh)"
            prop="price"
            header-align="center"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            label="时段"
            header-align="center"
            align="center"
            prop="time"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
      </section>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">编辑电价</span>
      <electricity-editor
        :currentPrice="currentPrice"
        ref="electricityEditor"
        :dialogVisible.sync="dialogVisible"
        @success="initData"
      ></electricity-editor>
    </el-dialog>
    <el-dialog :visible.sync="historyVisible" :close-on-click-modal="false">
      <span slot="title" class="dialog-header">历史电价</span>
      <el-table
        v-if="historyPrice"
        class="history-price-box"
        border
        :data="historyPrice"
        :max-height="300"
        style="width: 100%"
        ref="historyPriceTable"
      >
        <el-table-column
          width="100"
          label="启用时间"
          prop="startDate"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div>{{scope.row.startDate | timeSubStr}}</div>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="停用时间"
          prop="endDate"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div>{{scope.row.endDate | timeSubStr}}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(type, index) in timeCategoryEnum"
          :label="type.label"
          :key="index"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index2) in scope.row[type.value]"
              :key="index2"
              class="history-price-cell"
            >
              <span
                style="display: inline-block;"
                class="history-price"
              >{{isNaN(Number(item.price)) ? 0 : item.price}}(元/kWh)</span>
              <span style="display: inline-block;" class="history-time-list">
                <span
                  v-for="(time, index3) in item.timeList"
                  :key="index3"
                  class="history-time"
                >{{time}}</span>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import ElectricityEditor from './ElectricityEditor'
import { timeCategoryEnum } from '@/enum/dicts.js'
import { electrovalenceQuery } from '@/services/system-settings.js'
export default {
  name: 'electricity-price',
  components: { ElectricityEditor },
  data () {
    return {
      loading: false,
      timeCategoryEnum,
      dialogVisible: false,
      historyVisible: false,
      electroValenceObject: null
    }
  },
  created () {
    this.initData();
  },
  computed: {
    currentPrice () { // 当前电价
      if (!this.electroValenceObject || !this.electroValenceObject.current) return {}
      return this.electroValenceObject.current
    },
    typeSpan () { // 当前电价-计算时段类型连续数据长度
      let typeSpan = []
      if (!this.currentPrice) return typeSpan
      const typeList = timeCategoryEnum.map(item => item.value)
      typeList.forEach(type => {
        let typeDataList = this.currentPrice.priceList.filter(item => item.type === type)
        typeDataList.length && typeSpan.push(typeDataList.length)
      }, this);
      return typeSpan
    },
    priceSpan () { // 当前电价-计算时段类型内连续数据长度
      let priceSpanList = []
      if (!this.currentPrice) return priceSpanList
      const typeList = timeCategoryEnum.map(item => item.value)
      typeList.forEach(type => {
        let typeDataList = this.currentPrice.priceList.filter(item => item.type === type)
        if (typeDataList.length) {
          const priceList = typeDataList.map(item => {
            return item.price
          })
          for (let index = 0, num = 0; index < priceList.length; index++) {
            num++
            if (index === priceList.length - 1) { // 最后一个
              if (index !== 0 && priceList[index] !== priceList[index - 1]) { // 不为第一个，在最后一个，且不等于前一个的情况下
                priceSpanList.push(num - 1)
                priceSpanList.push(1)
              } else {
                priceSpanList.push(num)
              }
              continue
            }
            if (index !== 0 && priceList[index] !== priceList[index - 1]) { // 中间一个不等前一个的情况下
              priceSpanList.push(num - 1)
              num = 1
            }
          }
        }
      }, this);
      return priceSpanList
    },
    typeSpanSum () { // 当前电价-时段类型长度 和列表
      let typeSpanSum = []
      let sum = 0
      for (let index = 0; index < this.typeSpan.length; index++) {
        const item = this.typeSpan[index];
        sum += item
        typeSpanSum.push(sum)
      }
      return typeSpanSum
    },
    priceSpanSum () { // 当前电价-价格类型长度 和列表
      let priceSpanSum = []
      let sum = 0
      for (let index = 0; index < this.priceSpan.length; index++) {
        const item = this.priceSpan[index];
        sum += item
        priceSpanSum.push(sum)
      }
      return priceSpanSum
    },
    historyPrice () { // 历史电价数据聚合处理
      if (!this.electroValenceObject || !this.electroValenceObject.history) return []
      let historyPriceList = JSON.parse(JSON.stringify(this.electroValenceObject.history)) // 深拷贝一份历史电价数据
      // 遍历每条历史数据
      historyPriceList.forEach(item => {
        let typeList = this.formatHistoryPriceList(item.priceList)
        Object.assign(item, typeList)
      }, this)
      console.log('historyPriceList:', historyPriceList);
      return historyPriceList
    }
  },
  methods: {
    electrovalenceQuery,
    initData () { // 初始化电价数据
      const shopNumber = (this.$store.getters.getUserInfo || {}).shopNumber
      this.loading = true
      this.electrovalenceQuery({ shopNumber }).then(res => {
        this.loading = false
        this.electroValenceObject = res.data
      }).catch(_ => {
        this.loading = false
        console.error('查询电价信息失败(errorMessage):', _);
      })
    },
    resetDialogForm () { // 重置编辑表单
      this.$refs.electricityEditor && this.$refs.electricityEditor.cancle()
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 当前电价表格行聚合方法
      let spanList = [];
      let spanSumList = [];
      if (columnIndex === 0) {
        spanList = this.typeSpan
        spanSumList = this.typeSpanSum
      } else if (columnIndex === 1) {
        spanList = this.priceSpan
        spanSumList = this.priceSpanSum
      }
      if (columnIndex < 2) {
        const index = spanSumList.indexOf(rowIndex)
        if (rowIndex === 0) {
          return {
            rowspan: spanList[0],
            colspan: 1
          }
        } else if (index > -1) {
          return {
            rowspan: spanList[index + 1],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    formatHistoryPriceList (value = []) {
      let result = {} //各类目电价列表{1：priceListCopy1，2：priceListCopy2，3：priceListCopy3}
      this.timeCategoryEnum.forEach(dict => { // 根据电价类目提取数据
        let dataList = (value || []).filter(item => item.type === dict.value) // 提取各种类目类型的电价数据
        let priceList = dataList.map(item => item.price) // 提取类目类型===type的电价列表
        priceList = Array.from(new Set(priceList)).sort((a, b) => a - b) // 去重排序 [88,99,100]
        let priceListCopy = [] // 电价列表priceListCopy = [{price: 88, timeList:['00:00-01:00','02:00-03:00','04:00-05:00']}]
        priceList.forEach(price => {
          let timeList = dataList.filter(item => item.price === price)
          timeList = timeList.map(item => item.time)
          priceListCopy.push({
            price: price,
            timeList: timeList
          })
        }, this)
        result[dict.value] = priceListCopy
      }, this)
      return result
    }
  },
  filters: {
    timeSubStr (val) {
      if (!val) return val
      return val.substr(0, 10)
    }
  }
}
</script>
<style lang="scss" scoped>
.electricity-price {
  .header {
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    .float-right {
      float: right;
      /deep/ .el-button {
        font-size: 16px;
      }
    }
  }
  .section {
    padding: 20px 0;
  }
  .current-price-box {
    padding-right: 15px;
    .price-table {
      /deep/ tr:hover td {
        background-color: initial;
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
  .history-price-box {
    /deep/ .cell.el-tooltip {
      padding: 0;
    }
    $border: 1px solid #efefef;
    .history-price-cell {
      border-top: $border;
      text-align: left;
      position: relative;
      span,
      div {
        text-align: center;
      }
      &:first-child {
        border-top: none;
      }
      .history-price {
        width: 80px;
        position: absolute;
        top: calc(50% - 12px);
        text-align: center;
      }
      .history-time-list {
        padding-left: 90px;
        .history-time {
          display: block;
        }
      }
    }
  }
}
</style>
