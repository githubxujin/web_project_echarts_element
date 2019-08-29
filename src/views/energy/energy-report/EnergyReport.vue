<template>
  <div class="energy-report">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">时间粒度：</p>
            <div class="input-container">
              <tab-btn :dataArr="dateArr" :value="timeType" @change="gettimeType"></tab-btn>
            </div>
          </div>

          <div class="title-input-group u-title-input-group">
            <p class="text">时间筛选：</p>
            <div class="input-container">
              <el-date-picker
                v-model="date"
                type="month"
                placeholder="选择月"
                :clearable="false"
                v-show="timeType===4"
                :picker-options="pickerBeginYearAfter"
                @change="getDate"
              ></el-date-picker>
              <el-date-picker
                v-model="date"
                type="year"
                placeholder="选择年"
                v-show="timeType===6"
                :clearable="false"
                :picker-options="pickerBeginYearAfter"
                @change="getDate"
              ></el-date-picker>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <div class="input-container">
              <el-button type="primary" round icon="el-icon-search" @click="getEnergyData">查询</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="u-layout right-item">
        <div class="u-layout-right-item">
          <div class="title-input-group u-title-input-group">
            <div class="input-container">
              <el-button round @click="excelReport" icon="el-icon-upload2" v-if="showExportBtn">导出报表</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="datatable-box">
      <div class="table-title">{{title}}</div>
      <el-table :data="tableData.tData" :height="tableHeight" style="width: 100%" ref="table">
        <el-table-column
          v-for="item in tableData.tHead"
          :key="item.text"
          :prop="item.prop"
          :label="item.text"
          :width="item.width"
          :fixed="item.fixed"
          min-width="50"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import tabBtn from '@/components/tabs/Tabs.vue'
import { getEnergyConsume } from '@/services/energy'
import energyDetail from '@/axios/modules/energy'
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { tabBtn },
  data () {
    return {
      timeType: 4,
      dateArr: [
        { label: '月', value: 4 },
        { label: '年', value: 6 }
      ],
      date: new Date(),
      pickerBeginYearAfter: {// 结束时间不能大于今天
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      searchFile: {
        timeType: 4,
        shopNumber: '',
        startTime: ''
      },
      tableData: {
        tHead: [],
        tData: []
      },
      tableHeight: 400,
      title: '',
    }
  },
  created () {
    this.getEnergyData()
  },
  mounted: function () {
    this.$common.initTableHeight(this);
  },
  computed: {
    roleType: function () {
      return this.$store.getters.getUserInfo.roleType;
    },
    curShop: function () {
      return this.$store.getters.getCurShop;
    },
    shopNumber: function () {
      return this.$store.getters.shopNumber;
    }
  },
  watch: {
    shopNumber (val) {
      console.log(123456)
      this.searchFile.shopNumber = val
      this.getEnergyData()
    },
    curShop: {
      handler: function (val, old) {
        this.searchFile.shopNumber = val.shopNumber
        this.getEnergyData()
      },
      deep: true
    },
  },
  methods: {
    // -----------------按钮权限---------------------
    //显示转单按钮
    showExportBtn () {
      return this.pageBtns.some(val => val == 'export');
    },
    // -----------------按钮权限结束---------------------
    init () {//初始化表头的数据
      this.searchFile.shopNumber = this.roleType == 2 ? this.shopNumber : this.curShop.shopNumber;
      let Month = this.date.getMonth() + 1 > 9 ? this.date.getMonth() + 1 : "0" + (this.date.getMonth() + 1);
      if (this.timeType === 4) {
        this.title = `${this.date.getFullYear()}-${Month} 能耗报表(kWh)`
        let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
        this.searchFile.startTime = this.searchFile.startTime ? this.searchFile.startTime : new Date().getFullYear() + '-' + month + '-' + '01 00:00:00'
        this.tableData.tHead = [
          { text: '时间', prop: 'date', width: 80, fixed: true },
          { text: '00时', prop: '00' },
          { text: '01时', prop: '01' },
          { text: '02时', prop: '02' },
          { text: '03时', prop: '03' },
          { text: '04时', prop: '04' },
          { text: '05时', prop: '05' },
          { text: '06时', prop: '06' },
          { text: '07时', prop: '07' },
          { text: '08时', prop: '08' },
          { text: '09时', prop: '09' },
          { text: '10时', prop: '10' },
          { text: '11时', prop: '11' },
          { text: '12时', prop: '12' },
          { text: '13时', prop: '13' },
          { text: '14时', prop: '14' },
          { text: '15时', prop: '15' },
          { text: '16时', prop: '16' },
          { text: '17时', prop: '17' },
          { text: '18时', prop: '18' },
          { text: '19时', prop: '19' },
          { text: '20时', prop: '20' },
          { text: '21时', prop: '21' },
          { text: '22时', prop: '22' },
          { text: '23时', prop: '23' },
          { text: '合计', prop: 'total' },
        ]
      } else {
        this.title = `${this.date.getFullYear()} 能耗报表(kWh)`
        this.searchFile.startTime = this.searchFile.startTime ? this.searchFile.startTime : new Date().getFullYear() + '-' + '01-01 00:00:00'
        this.tableData.tHead = [
          { text: '时间', prop: 'date', width: 80, fixed: true },
          { text: '1日', prop: '1日' },
          { text: '2日', prop: '2日' },
          { text: '3日', prop: '3日' },
          { text: '4日', prop: '4日' },
          { text: '5日', prop: '5日' },
          { text: '6日', prop: '6日' },
          { text: '7日', prop: '7日' },
          { text: '8日', prop: '8日' },
          { text: '9日', prop: '9日' },
          { text: '10日', prop: '10日' },
          { text: '11日', prop: '11日' },
          { text: '12日', prop: '12日' },
          { text: '13日', prop: '13日' },
          { text: '14日', prop: '14日' },
          { text: '15日', prop: '15日' },
          { text: '16日', prop: '16日' },
          { text: '17日', prop: '17日' },
          { text: '18日', prop: '18日' },
          { text: '19日', prop: '19日' },
          { text: '20日', prop: '20日' },
          { text: '21日', prop: '21日' },
          { text: '22日', prop: '22日' },
          { text: '23日', prop: '23日' },
          { text: '24日', prop: '24日' },
          { text: '25日', prop: '25日' },
          { text: '26日', prop: '26日' },
          { text: '27日', prop: '27日' },
          { text: '28日', prop: '28日' },
          { text: '29日', prop: '29日' },
          { text: '30日', prop: '30日' },
          { text: '31日', prop: '31日' },
          { text: '合计', prop: 'total' },
        ]
      }
    },
    gettimeType (val) {
      this.timeType = val
      this.searchFile.timeType = val
      this.date = new Date()
      let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
      this.searchFile.startTime = this.timeType === 4 ? `${new Date().getFullYear()}-${month}-01 00:00:00` : `${new Date().getFullYear()}-01-01 00:00:00`
    },
    getDate (val) {
      console.log(val)
      this.date = val ? val : new Date();
      let month = (val.getMonth() + 1) < 10 ? '0' + (val.getMonth() + 1) : (val.getMonth() + 1)
      if (val) {
        this.searchFile.startTime = this.timeType === 4 ? `${val.getFullYear()}-${month}-01 00:00:00` : `${val.getFullYear()}-01-01 00:00:00`
        console.log(this.searchFile.startTime)
      }
    },
    // 查询数据
    async getEnergyData () {
      this.init()
      let res = await getEnergyConsume(this.searchFile);
      if (res.code === 200) {
        if (res.data && res.data.array && res.data.array.length > 0) {
          let energyData = [];
          res.data.array.forEach(item => {
            let obj = {};
            for (const key in item) {
              if (key === 'xTotal') {
                obj.total = parseInt(item[key]);
              } else if (key === 'timeName') {
                obj.date = item[key]
              } else {
                if (this.searchFile.timeType === 4) {
                  item[key].forEach((sub, i) => {
                    if (i < 10) {
                      let ind = '0' + i;
                      obj[ind] = this.isMoreThan(sub)
                    } else {
                      obj[i] = this.isMoreThan(sub)
                    }
                  })
                } else {
                  item[key].forEach((sub, i) => {
                    let ind = (i + 1) + '日';
                    obj[ind] = this.isMoreThan(sub)
                  })
                }
              }
            }
            energyData.push(obj);
            this.tableData.tData = energyData;
          })
        }
      } else {
        console.log(res.msg)
      }
    },
    isMoreThan (sub) {
      let data = "";
      if (sub > 100) {
        data = parseInt(sub)
      } else {
        data = /^\d+$/.test(sub) ? sub : sub.toFixed(2)
      }
      return data
    },
    // 导出报表
    excelReport () {
      location.href = `${energyDetail.exportEnergyConsume}?shopNumber= ${this.searchFile.shopNumber}&&timeType=${this.timeType}&&startTime=${this.searchFile.startTime}&&token=${localStorage.getItem('$token_info')}`
    }
  }
}
</script>
<style lang="scss" scoped>
.energy-report {
  width: 100%;
  height: 100%;
  max-height: 762px;
  overflow: hidden;
  overflow-y: auto;
  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 96px;
    padding-right: 10px;
  }
  /deep/ .u-layout-search .el-input__inner {
    border-radius: 2px !important;
    height: 30px;
    border: 1px solid #c3c9d5;
  }
  /deep/ .el-button--small.is-round {
    padding: 9px 15px;
  }
  /deep/ .el-table .cell {
    padding: 0px;
  }
  .datatable-box {
    padding: 0px 30px;
    .table-title {
      text-align: center;
      width: 100%;
      font-weight: 600;
      color: #363636;
    }
  }
  .u-layout-search .title-input-group {
    vertical-align: middle;
  }
  .u-layout-right-item .el-button {
    height: 31px;
  }
}
</style>


