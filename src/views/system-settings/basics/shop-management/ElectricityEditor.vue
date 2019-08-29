<template>
  <div class="electricity-editor">
    <el-form
      v-loading="dialogLoading"
      ref="form"
      :model="form"
      label-width="90px"
      :rules="formRules"
      size="mini"
      inline
      :label-position="'left'"
    >
      <el-row>
        <el-form-item prop="startDate" label="开始日期">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
          ></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-table
          class="price-table"
          :data="form.priceList"
          border
          :max-height="300"
          style="width: 100%"
          ref="priceTable"
          :span-method="objectSpanMethod"
        >
          <el-table-column width="120" label="类目" header-align="center" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.type | translate(timeCategoryEnum)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="单价（元/kWh）"
            prop="price"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <div class="price-cell">
                <el-form-item :prop="`priceList[${scope.$index}].price`">
                  <el-input
                    v-model.trim="form.priceList[scope.$index].price"
                    @input="priceInput(scope)"
                    @blur="priceBlur(scope)"
                    :rules="[{
                          validator: (rule, value, callback) => {
                            return validatePrice(rule, value, callback, scope)
                          },
                          trigger: 'blur'
                        }]"
                  ></el-input>
                </el-form-item>
                <!-- <i class="el-icon-circle-plus-outline price-icon" @click="addCell(scope, 'price')"></i>
                <i class="el-icon-remove-outline delete price-icon" @click="deleteCell(scope, 'price')"></i>-->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="时段" header-align="center" align="center" prop="time">
            <template slot-scope="scope">
              <div class="time-cell">
                <el-row>
                  <el-col :span="10">
                    <el-form-item
                      :prop="`priceList[${scope.$index}].startTime`"
                      :rules="[{
                          validator: function (rule, value, callback) {
                            return validateTime(rule, value, callback, scope, 'startTime')
                          },
                          trigger: 'blur'
                        }]"
                    >
                      <el-time-select
                        v-model="form.priceList[scope.$index].startTime"
                        :picker-options="{
                          start: '00:00',
                          step: '00:15',
                          end: '24:00',
                          maxTime: form.priceList[scope.$index].endTime
                        }"
                        placeholder="选择时间"
                      ></el-time-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      :prop="`priceList[${scope.$index}].endTime`"
                      :rules="[{
                          validator: (rule, value, callback) => {
                            return validateTime(rule, value, callback, scope, 'endTime')
                          },
                          trigger: 'blur'
                        }]"
                    >
                      <el-time-select
                        v-model="form.priceList[scope.$index].endTime"
                        :picker-options="{
                          start: '00:00',
                          step: '00:15',
                          end: '24:00',
                          minTime: form.priceList[scope.$index].startTime
                        }"
                        placeholder="选择时间"
                      ></el-time-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <i
                      class="el-icon-circle-plus-outline price-icon"
                      @click="addCell(scope, 'time')"
                    ></i>
                    <i
                      class="el-icon-remove-outline delete price-icon"
                      @click="deleteCell(scope, 'time')"
                    ></i>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="text-center btn-group">
        <el-button type="primary" size="mini" @click="submit" :loading="submitLoading">确 定</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import moment from 'moment';
import { timeCategoryEnum } from '@/enum/dicts.js'
import { electrovalenceEdit } from '@/services/system-settings.js'
import Regexps from '@/utils/regexp.js'
export default {
  props: {
    dialogVisible: Boolean,
    currentPrice: {
      type: Object,
      default: () => {
        return {
          startDate: new Date(),
          priceList: []
        }
      }
    }
  },
  data () {
    return {
      timeCategoryEnum, // 时段类目
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      pickerOptions1: {
        disabledDate (time) { // 今天是否可以启动？
          return time.getTime() < Date.now() - 24 * 36e5;
        }
      },
      form: {
        startDate: '',
        priceList: []
      },
      formRules: {
        startDate: [{
          type: 'date', required: true, message: '请选择电价开始日期', trigger: 'change'
        }]
      },
      priceSpan: [], // 计算时段类型内连续数据长度
      priceSpanSum: [] // 价格类型长度 和列表
    }
  },
  created () {
    this.form.startDate = new Date();
  },
  computed: {
    typeSpan () { // 计算时段类型连续数据长度
      let typeSpan = []
      const typeList = timeCategoryEnum.map(item => item.value)
      typeList.forEach(type => {
        let typeDataList = this.form.priceList.filter(item => item.type === type)
        typeDataList.length && typeSpan.push(typeDataList.length)
      }, this);
      return typeSpan
    },
    typeSpanSum () { // 时段类型长度 和列表
      let typeSpanSum = []
      let sum = 0
      console.log(this.typeSpan, 'chagdu')
      for (let index = 0; index < this.typeSpan.length; index++) {
        const item = this.typeSpan[index];
        sum += item
        typeSpanSum.push(sum)
      }
      return typeSpanSum
    },
    submitParams () { // 提交参数格式化
      let {
        startDate,
        priceList
      } = JSON.parse(JSON.stringify(this.form))
      startDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss')
      priceList = priceList.filter(item => item.price) // 过滤掉没有填写电价的数据
      priceList.forEach(item => {
        item.time = item.startTime && [item.startTime, item.endTime].join('-') // 合并电价开始结束日期
        delete item.startTime
        delete item.endTime
      })
      return {
        startDate,
        priceList,
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      }
    },
    timeIsCrossOrLack () { // 判断时间是否交叉或缺失，用的简单方法 有算法可以优化的话麻烦优化下
      let _this = this
      let timeArrList = this.form.priceList.map(item => {
        if (item.startTime && item.endTime) {
          let timeArr = _this.timeToArr(item)
          return timeArr
        }
        return []
      }).filter(item => item.length)
      let timeArr = []
      timeArrList.forEach(item => {
        timeArr = timeArr.concat(item)
      })
      let timeArrCopy = Array.from(new Set(timeArr))
      let isCross = timeArr.length - timeArrCopy.length !== timeArrList.length - 1 // 是否交叉
      let isLack = timeArrCopy.length < 24 * 4 + 1 // 24小时是否缺失
      return isCross || isLack
    }
  },
  watch: {
    'dialogVisible': { // 每次点击编辑出现弹窗的时候就重新初始化一遍
      immediate: true,
      handler: function (val) {
        if (!val) return
        this.initData()
      }
    }
  },
  methods: {
    electrovalenceEdit,
    timeToArr (item) {
      var min = item.startTime ? item.startTime.split(':') : []
      min = Number(min[0]) + (min[1] / 60)
      var max = item.endTime ? item.endTime.split(':') : []
      max = Number(max[0]) + (max[1] / 60)
      let len = (max - min) / 0.25
      let timeArr = []
      for (let index = 0; index < len + 1; index++) {
        timeArr.push(min + index * 0.25)
      }
      return timeArr
    },
    initData () {
      let currentPrice = JSON.parse(JSON.stringify(this.currentPrice)) || {}
      currentPrice.priceList = this.formatPricelist(currentPrice.priceList) // 补充时段类目种类,避免编辑的时候缺失某一时段类目
      currentPrice.startDate = new Date(currentPrice.startDateTimestamp)
      this.form = currentPrice
      this.countPriceSpan()
      this.countPriceSpanSum()
    },
    submit () { // 提交编辑 
      let result = false
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      if (this.timeIsCrossOrLack) { // 校验时间的交叉及全天覆盖
        this.$message.warning('请检查电价时间段是否有交叉或者全天覆盖缺失！')
        return
      }
      this.electrovalenceEdit(this.submitParams).then(res => {
        this.$message({
          type: 'success',
          message: '编辑电价信息成功！'
        })
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        console.error('编辑电价信息失败(errorMessage):', _);
      })
    },
    cancle () { // 重置表单并关闭表单
      this.$nextTick(_ => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
      this.$emit('update:dialogVisible', false)
    },
    addCell (scope, cellType = 'price') { // 新增对应价位或时间段数据
      let index = 0
      for (let ind = 0; ind < this.priceSpanSum.length; ind++) {
        if (scope.$index < this.priceSpanSum[ind]) {
          index = this.priceSpanSum[ind]
          break
        }
      }
      const price = cellType === 'price' ? '' : scope.row.price
      this.form.priceList.splice(index, 0, {
        type: scope.row.type,
        price: '',
        time: ''
      })
      this.countPriceSpan()
      this.countPriceSpanSum()
    },
    deleteCell (scope, cellType = 'price') { // 删除对应价位或时间段的数据
      let deleteSize = 1
      if (cellType === 'price') { // 如果是价格后面删除按钮 则删除该类目下该价格下所有数据
        let index = -1
        for (let ind = 0; ind < this.priceSpanSum.length; ind++) {
          if (scope.$index < this.priceSpanSum[ind]) {
            index = ind
            break
          }
        }
        deleteSize = this.priceSpan[index]
      }
      let arg = [scope.$index, deleteSize]
      let type = scope.row.type
      let existLen = this.form.priceList.filter((item) => {
        return type === item.type
      }).length
      if (existLen < 2) { // 如果该类目只有最后一条，则给该条目压入压入空数据
        arg.push({
          type: scope.row.type,
          price: '',
          time: ''
        })
      }
      this.form.priceList.splice(...arg)
      this.countPriceSpan()
      this.countPriceSpanSum()
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 表格行聚合方法
      let spanList = [];
      let spanSumList = [];
      if (columnIndex === 0) {
        spanList = this.typeSpan
        spanSumList = this.typeSpanSum
      }
      // 去掉价目聚合
      // else if (columnIndex === 1) {
      //   spanList = this.priceSpan
      //   spanSumList = this.priceSpanSum
      // }
      // if (columnIndex < 2) {
      if (columnIndex === 0) {
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
    formatPricelist (priceList = []) { // 补充时段类目种类,避免编辑的时候缺失某一时段类目
      priceList = JSON.parse(JSON.stringify(priceList))
      let priceListCopy = []
      this.timeCategoryEnum.forEach(timeItem => {
        let typeList = []
        priceList.forEach(item => {
          if (item.type === timeItem.value) {
            item.price = item.price.toString() // 价格转为字符串，方便与新增编辑的聚合；时间拆分为开始结束
            item.time = item.time ? item.time.split('-') : null
            item.startTime = item.time[0]
            item.endTime = item.time[1]
            typeList.push(item)
          }
        })
        if (!typeList.length) {
          priceListCopy.push({
            type: timeItem.value,
            time: null,
            startTime: '',
            endTime: '',
            price: ''
          })
        } else {
          priceListCopy.push(...typeList)
        }
      })
      return priceListCopy
    },
    validateTime (rule, value, callback, scope, prop) { // 校验时间端必填性及时间格式
      const price = scope.row.price
      if (!price && price !== 0 && !value && value !== 0) return callback() // 没有价格情况下 不校验时间必填性
      if ((price || price === 0) && !value) return callback(new Error(`请输入${prop === 'endTime' ? '结束' : '开始'}时间`)) // 有价格条件下校验时间必填性
      const regexp = /^(\d{1,2}):(\d{1,2})$/;
      if (!regexp.test(value)) return callback(new Error('格式(HH:mm)不正确')) // 校验时间格式

      let startTime = (scope.row.startTime || '').split(':')
      let endTime = (scope.row.endTime || '').split(':')
      let valueTime = value.split(':')
      if (valueTime[0] > 24 || valueTime[1] > 60 || (valueTime[0] > 23 && valueTime[1] > 0)) return callback(new Error('时间超出范围')) // 校验时间范围合法性
      let startTimeCopy = (startTime[0] || 0) * 60 + startTime[1] || 0
      let endTimeCopy = (endTime[0] || 0) * 60 + endTime[1] || 0
      if (startTimeCopy && endTimeCopy && (startTimeCopy - endTimeCopy) > - 1) return callback(new Error(`不能${prop === 'startTime' ? '大' : '小'}于等于${prop === 'startTime' ? '结束' : '开始'}时间`)) // 校验时间范围合法性
      return callback()
    },
    validatePrice (rule, value, callback, scope) { // 在有时间的情况下校验价格的必填性及数字格式
      if (!value && value !== 0 && (scope.row.startTime || scope.row.endTime)) return callback(new Error('请输入电价'))
      const regexp = /(^(0\.0*[1-9]+[0-9]*$|[1-9]+[0-9]*\.[0-9]*[0-9]$|[1-9]+[0-9]*$)|^0$)/ // 非负数正则表达式
      if (!regexp.test(value)) return callback(new Error('格式为非负数'))
      return callback()
    },
    countPriceSpan () {
      let priceSpanList = []
      const typeList = timeCategoryEnum.map(item => item.value)
      typeList.forEach(type => {
        let typeDataList = this.form.priceList.filter(item => item.type === type)
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
      this.priceSpan = priceSpanList
    },
    countPriceSpanSum () { // 计算价格类型长度 和 列表
      let priceSpanSum = []
      let sum = 0
      for (let index = 0; index < this.priceSpan.length; index++) {
        const item = this.priceSpan[index];
        sum += item
        priceSpanSum.push(sum)
      }
      this.priceSpanSum = priceSpanSum
    },
    priceInput (scope) {
      let price = scope.row.price.replace(/[^\d\.]/g, '');
      let priceList = price.split('.');
      this.form.priceList[scope.$index].price = priceList.map(item => item.substr(0, 6)).join('.');
    },
    priceBlur (scope) {
      this.form.priceList[scope.$index].price = scope.row.price.match(/^\d*(\.?\d{0,4})/g)[0]
      this.sortForm(scope)
      this.countPriceSpan()
      this.countPriceSpanSum()
    },
    // handleInput (e) {
    //   console.log(e)
    //   // 通过正则过滤小数点后两位
    //   e.target.value = (e.target.value.match(/^\d*(\.?\d{0,4})/g)[0]) || null
    // },
    sortForm (scope) { // 在改变电价的时候给列表根据价格在各类目内排序以便聚合
      let value = scope.row.price
      if (!value && value !== 0 || isNaN(Number(value))) return // 空及非数字 不做出反应
      this.form.priceList.sort(function (item1, item2) { // 先根据类目排序再根据价格排序
        if (item1.type === item2.type) {
          return item1.price - item2.price
        } else {
          return item1.type - item2.type
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.electricity-editor {
  .text-center {
    text-align: center;
  }
  .price-table {
    .price-cell {
      /deep/ .el-input {
        width: 100px;
      }
    }
    .price-icon {
      vertical-align: middle;
      font-size: 20px;
      cursor: pointer;
      font-size: 20px;
      color: #1982bf;
      cursor: pointer;
      &.delete {
        color: #ff3366;
      }
    }
    .time-cell,
    .price-cell {
      /deep/ input {
        text-align: center;
      }
    }
    /deep/ tr:hover td {
      background-color: initial;
      &:hover {
        background-color: #f5f7fa;
      }
    }
    /deep/ .el-form-item--mini.el-form-item {
      margin-bottom: 0px;
      &.is-error {
        margin-bottom: 20px;
      }
    }
    /deep/ .el-date-editor--time-select {
      max-width: 150px;
    }
  }
  .btn-group {
    padding-top: 20px;
  }
}
</style>

