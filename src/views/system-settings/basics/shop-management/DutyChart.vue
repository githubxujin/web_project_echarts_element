<template>
  <div class="duty-chart" v-loading="loading">
    <header class="title">
      工作时间
      <div class="float-right">
        <el-button @click="submit" type="text">保存</el-button>
      </div>
    </header>
    <el-form :model="form" ref="rulesForm" class="rules-form" inline label-width="40px">
      <el-row
        v-for="(item, index) in form.workTimeList"
        :key="index"
        class="chart-row"
        :class="{'disabled': item.status}"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item
              :prop="`workTimeList[${index}].name`"
              label="名称"
              :rules="[{
                          validator: (rule, value, callback) => {
                            return validateName(rule, value, callback, index)
                          },
                          trigger: 'blur'
                        }]"
            >
              <el-input
                class="duty-name"
                v-model="form.workTimeList[index].name"
                :disabled="Boolean(form.workTimeList[index].status)"
                :clearable="true"
                maxlength="64"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="类别">忙时</el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="日期" class="week-selector">
              <el-form-item
                :prop="`workTimeList[${index}].timeStart`"
                :rules="[{
                          validator: (rule, value, callback) => {
                            return validateTime(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }]"
              >
                <el-select
                  v-model="form.workTimeList[index].timeStart"
                  @change="weekChange(index)"
                  placeholder="请选择"
                  :disabled="Boolean(form.workTimeList[index].status)"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in weekList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>至
              <el-form-item
                :prop="`workTimeList[${index}].timeEnd`"
                :rules="[{
                          validator: (rule, value, callback) => {
                            return validateTime(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }]"
              >
                <el-select
                  v-model="form.workTimeList[index].timeEnd"
                  @change="weekChange(index)"
                  placeholder="请选择"
                  :disabled="Boolean(form.workTimeList[index].status)"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in weekList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="上班时间"
              label-width="60px"
              class="duty-time"
              :prop="`workTimeList[${index}].workStart`"
              :rules="[{
                          validator: (rule, value, callback) => {
                            return validateDuty(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }]"
            >
              <el-time-select
                v-model="form.workTimeList[index].workStart"
                :picker-options="{
    start: '00:00',
    step: '00:15',
    end: '24:00',
    maxTime: form.workTimeList[index].workEnd
  }"
                placeholder="选择时间"
                :disabled="Boolean(form.workTimeList[index].status)"
              ></el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="下班时间"
              label-width="60px"
              class="duty-time"
              :prop="`workTimeList[${index}].workEnd`"
              :rules="[{
                          validator: (rule, value, callback) => {
                            return validateDuty(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }]"
            >
              <el-time-select
                v-model="form.workTimeList[index].workEnd"
                :picker-options="{
    start: '00:00',
    step: '00:15',
    end: '24:00',
    minTime: form.workTimeList[index].workStart
  }"
                placeholder="选择时间"
                :disabled="Boolean(form.workTimeList[index].status)"
              ></el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="时段" class="date-range">
              <el-form-item
                :prop="`workTimeList[${index}].dateStart`"
                :rules="[{
                          validator: (rule, value, callback) => {
                            return validateDate(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }]"
              >
                <el-date-picker
                  v-model="form.workTimeList[index].dateStart"
                  format="MM-dd"
                  value-format="MM-dd"
                  :disabled="Boolean(form.workTimeList[0].status || form.workTimeList[1].status)"
                  @change="dateChange(index)"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                :prop="`workTimeList[${index}].dateEnd`"
                :rules="[{
                          validator: (rule, value, callback) => {
                            return validateDate(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }]"
              >
                <el-date-picker
                  v-model="form.workTimeList[index].dateEnd"
                  format="MM-dd"
                  value-format="MM-dd"
                  @change="dateChange(index)"
                  :disabled="Boolean(form.workTimeList[0].status || form.workTimeList[1].status)"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="类别">闲时</el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="日期" class="week-selector">
              <el-form-item
                :prop="`workTimeList[${index}].timeStartIdle`"
                :rules="[{
                          validator: (rule, value, callback) => {
                            return validateTime(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }]"
              >
                <el-select
                  v-model="form.workTimeList[index].timeStartIdle"
                  @change="weekChange(index, 'Idle')"
                  placeholder="请选择"
                  :clearable="true"
                  :disabled="Boolean(form.workTimeList[index].status)"
                >
                  <el-option
                    v-for="item in weekList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>至
              <el-form-item
                :prop="`workTimeList[${index}].timeEndIdle`"
                :rules="[{
                          validator: (rule, value, callback) => {
                            return validateTime(rule, value, callback, index)
                          },
                          trigger: 'change'
                        }]"
              >
                <el-select
                  v-model="form.workTimeList[index].timeEndIdle"
                  @change="weekChange(index, 'Idle')"
                  placeholder="请选择"
                  :clearable="true"
                  :disabled="Boolean(form.workTimeList[index].status)"
                >
                  <el-option
                    v-for="item in weekList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="上班时间"
              label-width="60px"
              class="duty-time"
              :prop="`workTimeList[${index}].workStartIdle`"
              :rules="[{
                          validator: (rule, value, callback) => {
                            return validateDuty(rule, value, callback, index, 'Idle')
                          },
                          trigger: 'change'
                        }]"
            >
              <el-time-select
                v-model="form.workTimeList[index].workStartIdle"
                :picker-options="{
    start: '00:00',
    step: '00:15',
    end: '24:00',
    maxTime: form.workTimeList[index].workEndIdle
  }"
                placeholder="选择时间"
                :disabled="Boolean(form.workTimeList[index].status)"
              ></el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="下班时间"
              label-width="60px"
              class="duty-time"
              :prop="`workTimeList[${index}].workEndIdle`"
              :rules="[{
                          validator: (rule, value, callback) => {
                            return validateDuty(rule, value, callback, index, 'Idle')
                          },
                          trigger: 'change'
                        }]"
            >
              <el-time-select
                v-model="form.workTimeList[index].workEndIdle"
                :picker-options="{
    start: '00:00',
    step: '00:15',
    end: '24:00',
    minTime: form.workTimeList[index].workStartIdle
  }"
                placeholder="选择时间"
                :disabled="Boolean(form.workTimeList[index].status)"
              ></el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button
          class="btn-handler"
          @click="statusChange(index)"
          :type="form.workTimeList[index].status ? '-' : 'info'"
        >{{form.workTimeList[index].status ? '启用' : '禁用'}}</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import moment from 'moment';
import { dutyChartQuery, dutyChartSave } from '@/services/system-settings.js'
export default {
  name: "DutyChart",
  data () {
    const this_year = new Date().getFullYear()
    return {
      loading: true, // 工作时间loading
      pickerOptions: {
        disabledDate (time) {
          return new Date(time).getFullYear() !== this_year;
        }
      },
      shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber,
      weekList: [
        {
          label: '周一',
          value: 1
        }, {
          label: '周二',
          value: 2
        }, {
          label: '周三',
          value: 3
        }, {
          label: '周四',
          value: 4
        }, {
          label: '周五',
          value: 5
        }, {
          label: '周六',
          value: 6
        }, {
          label: '周日',
          value: 7
        }
      ],
      form: {
        workTimeList: [
          {
            id: null,
            name: '',
            dateStart: '',
            dateEnd: '',
            type: 1,
            typeIdle: 0,
            timeStart: null,
            timeStartIdle: null,
            timeEnd: null,
            timeEndIdle: null,
            workStart: '',
            workStartIdle: '',
            workEnd: '',
            workEndIdle: '',
            status: 0,
            shopNumber: ''
          },
          {
            id: null,
            name: '',
            dateStart: '',
            dateEnd: '',
            type: 1,
            typeIdle: 0,
            timeStart: null,
            timeStartIdle: null,
            timeEnd: null,
            timeEndIdle: null,
            workStart: '',
            workStartIdle: '',
            workEnd: '',
            workEndIdle: '',
            status: 0,
            shopNumber: ''
          }
        ]
      }
    }
  },
  computed: {
    params () {
      let workTimeList = JSON.parse(JSON.stringify(this.form.workTimeList))
      workTimeList.forEach(item => {
        item.shopNumber = this.shopNumber
        item.timeStart = item.timeStart || null
        item.timeStartIdle = item.timeStartIdle || null
        item.timeEnd = item.timeEnd || null
        item.timeEndIdle = item.timeEndIdle || null
      }, this)
      return { workTimeList }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    dutyChartQuery,
    dutyChartSave,
    initData () { // 初始化数据
      this.loading = true
      this.dutyChartQuery({ shopNumber: this.shopNumber }).then(res => {
        this.loading = false
        let data = res.data.array || []
        if (!data.length) {
          return
        } else if (data.length === 1) {
          data.push(this.form.workTimeList[0])
        }
        this.form.workTimeList = data
        console.log(this.form.workTimeList)
      }).catch(_ => {
        this.loading = false
      })
    },
    submit () { // 校验并提交
      this.$refs.rulesForm.validate()
      let result = this.validateForm()
      if (!result) return
      this.loading = true
      this.dutyChartSave(this.params).then(res => {
        this.$message.success('编辑工作时间成功！')
        this.loading = false
        // 重新获取数据
        this.initData()
      }).catch(_ => {
        this.$message.warning('编辑工作时间失败！')
        this.loading = false
        // 重新获取数据
        this.initData()
      })
    },
    validateForm () { // 嵌套太深 this.$refs.rulesForm.validate 无法进入校验回调获取校验结果，用这个方法代替必填性校验
      let weekList = JSON.parse(JSON.stringify(this.form.workTimeList))
      let result = true
      for (let index = 0, len = weekList.length; index < len; index++) {
        const item = weekList[index];
        if (item.status) continue;
        if (item.name && item.name.length > 20) {
          result = false;
          break;
        }
        if (!item.name || !item.dateStart || !item.dateEnd || !((item.timeStart && item.timeEnd && item.workStart && item.workEnd) || (item.timeStartIdle && item.timeEndIdle && item.workStartIdle && item.workEndIdle))) {
          result = false;
          break;
        }
        if ((item.timeStart || item.timeEnd) && (!item.workStart || !item.workEnd) || (item.timeStartIdle || item.timeEndIdle) && (!item.workStartIdle || !item.workEndIdle)) {
          result = false;
          break;
        }
      }
      return result
    },
    weekChange (index, key = '') { // 日期变化
      let item = this.form.workTimeList[index]
      let time1 = `timeStart${key}`
      let time2 = `timeEnd${key}`
      let otherTime1 = `timeStart${key ? '' : 'Idle'}`
      let otherTime2 = `timeEnd${key ? '' : 'Idle'}`
      if (item[time1] && item[time2]) { // 开始结束都有值
        if (item[time1] < item[time2] || item[time1] === item[time2]) { // 结束大于等于开始时，根据目前变更的忙或闲时操作当前时段另一（闲或忙）数据
          if (item[time1] === 1 && item[time2] === 7) { // 周一至周日占满了
            item[otherTime1] = item[otherTime2] = ''
          } else if (item[time1] === 1) { // 当前周一开始 非周日结束
            item[otherTime1] = item[time2] + 1
            item[otherTime2] = 7
          } else if (item[time2] === 7) {// 当前周日结束 非周一开始
            item[otherTime1] = 1
            item[otherTime2] = item[time1] - 1
          } else { // 其它情况
            item[otherTime1] = item[time2] + 1
            item[otherTime2] = item[time1] - 1
          }
        } else { // 结束小于开始时
          if (item[time1] - item[time2] === 1) { // 周一至周日占满了
            item[otherTime1] = item[otherTime2] = ''
          } else {  // 其它情况
            item[otherTime1] = item[time2] + 1
            item[otherTime2] = item[time1] - 1
          }
        }
      }
    },
    dateChange (index) { // 时段变化
      let item = this.form.workTimeList[index]
      const otherIndex = index ? 0 : 1
      if (item.dateStart === '01-01' && item.dateEnd === '12-31' && !this.form.workTimeList[otherIndex].status) { // 如果选了全年 且另一条是启用状态，则清空另一条时段并禁用
        this.statusChange(otherIndex)
      } else if (!this.form.workTimeList[otherIndex].status) { // 如果另一条为启用状态，修改另一条时段的时间满足两条加起来是一年的条件
        this.changeOtherDate(index)
      }
    },
    statusChange (index) { // 禁用状态变化
      let item = this.form.workTimeList[index]
      let item1 = this.form.workTimeList[(index ? 0 : 1)]
      console.log('当前数据', item, '相对数据', item1);
      item.status = item.status ? 0 : 1 // 变更禁用状态,1是禁用，0是启用
      if (!item.status) { // 变为启用
        if (item1.status == 1) {
          item.dateStart = '01-01'
          item.dateEnd = '12-31'
        }
        item1.dateStart = item1.dateEnd = null // 清空另一条数据的01-01至12-31时段数据
      } else {  // 变为禁用
        // debugger
        item.dateStart = item.dateEnd = null // 清空当前数据的时段
        item1.dateStart = '01-01'
        item1.dateEnd = '12-31'
      }
      // console.log('变化后数据', item, '相对数据', item1);
    },
    changeOtherDate (index) { // 修改另一条时段的时间满足两条加起来是一年的条件
      let item = this.form.workTimeList[index]
      if (!item.dateStart || !item.dateEnd) return
      const otherIndex = index ? 0 : 1
      const this_year = new Date().getFullYear()
      let startDate = ''
      let endDate = ''
      let startList = item.dateStart.split('-')
      let endList = item.dateEnd.split('-')
      if (item.dateStart === '01-01') { // 开始时间取另一条时段的结束时间，结束时间取12-31
        startDate = new Date(new Date(this_year, endList[0] - 1, endList[1]).getTime() + 24 * 36e5)
        endDate = new Date(this_year, 12, 31)
      } else if (item.dateEnd === '12-31') { // 开始时间取01-01，结束时间取另一条时段的开始时间
        startDate = new Date(this_year, 1, 1)
        endDate = new Date(new Date(this_year, startList[0] - 1, startList[1]).getTime() - 24 * 36e5)
      } else { // 开始时间取另一条时段的结束时间，结束时间取另一条时段的开始时间
        startDate = new Date(new Date(this_year, endList[0] - 1, endList[1]).getTime() + 24 * 36e5)
        endDate = new Date(new Date(this_year, startList[0] - 1, startList[1]).getTime() - 24 * 36e5)
      }
      this.form.workTimeList[otherIndex].dateStart = moment(startDate).format('MM-DD')
      this.form.workTimeList[otherIndex].dateEnd = moment(endDate).format('MM-DD')
    },
    validateName (rule, value, callback, index) { // 校验名字
      let item = this.form.workTimeList[index]
      if (item.status) return callback()
      if (!value) return callback(new Error('必填'))
      if (value.length > 20) return callback(new Error('名称请限制在20字符以内'))
    },
    validateTime (rule, value, callback, index) { // 校验日期
      let item = this.form.workTimeList[index]
      if (item.status) return callback()
      if (item.timeStart && item.timeEnd || item.timeStartIdle && item.timeEndIdle) return callback()
      if (!value) return callback(new Error('必选'))
    },
    validateDate (rule, value, callback, index) { // 校验时段
      let item = this.form.workTimeList[index]
      if (item.status) return callback()
      if (!value) return callback(new Error('必选'))
    },
    validateDuty (rule, value, callback, index, key = '') { // 校验上下班时间
      let item = this.form.workTimeList[index]
      if (item.status) return callback()
      if (!item[`timeStart${key}`]) return callback()
      if (!value) return callback(new Error('必选'))
    }
  }
}
</script>
<style lang="scss" scoped>
.duty-chart {
  padding-bottom: 20px;
  header.title {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    .float-right {
      float: right;
      /deep/ .el-button {
        font-size: 16px;
      }
    }
  }
  .rules-form {
    .chart-row {
      padding-right: 80px;

      &.disabled {
        /deep/ .el-form-item__error {
          display: none;
        }
      }
      .btn-handler {
        position: absolute;
        right: 0;
        top: 20px;
      }
    }
    /deep/ .el-input,
    /deep/ .el-input__inner {
      width: 150px;
    }
    .duty-name {
      width: 214px;
      /deep/ .el-input__inner {
        width: 214px;
      }
    }
    /deep/ .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      &.is-error {
        margin-bottom: 10px;
      }
    }
    .date-range,
    .duty-time,
    .week-selector {
      /deep/ .el-input,
      /deep/ .el-input__inner {
        width: 100px;
      }
    }
  }
}
</style>
