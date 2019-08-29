<template>
  <div class="quato-setting">
    <div class="query-condition">
      <div class="energy-tab">
        <tab-btn :dataArr="energyData" :value="type" @change="getEnergyType"></tab-btn>
      </div>
      <el-select v-model="year" placeholder="请选择" @change="getYear">
        <el-option
          v-for="item in dateTime"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        plain
        round
        icon="el-icon-upload2"
        class="fr button"
        @click="exportQuota"
      >导出定额</el-button>
    </div>
    <div class="datatable-box">
      <el-table :data="tableData.tData" style="width: 100%" ref="table">
        <el-table-column
          v-for="item in tableData.tHead"
          :key="item.text"
          :prop="item.prop"
          :label="item.text"
          :width="item.width"
          min-width="58"
          align="center"
        >
          <template slot-scope="scope">
            <!-- v-if="showEdit[scope.$index][item.prop]&&item.prop!='itemName'&&item.prop!='total'&&(year>now||(year==now&&parseInt(item.prop)>=month))" -->
            <input
              v-if="showEdit[scope.$index][item.prop]&&item.prop!='itemName'&&item.prop!='total'&&(year>now||(year==now&&parseInt(item.prop)>=month))"
              type="text"
              v-model="tableData.tData[scope.$index][item.prop]"
              ref="myInput"
              @blur="sumTotal(scope.row,scope.$index,item.prop)"
            />
            <span
              v-else
              @dblclick="editData(scope.row,scope.$index,item.prop)"
            >{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" round @click="submitData">保 存</el-button>
        <el-button round @click="cancel">取 消</el-button>
      </div>
      <span class="fr tip">* 双击数字可修改定额</span>
    </div>
  </div>
</template>
<script>
import tabBtn from '@/components/tabs/Tabs.vue'
import { getQuotaSetting, setQuot, splitbenchmarkQuota } from '@/services/energy'
import energyDetail from '@/axios/modules/energy'
import utils from '@/utils/utils.js'
export default {
  props: {
    searchFile: {
      type: Object
    },
    dateTime: {
      type: Array
    }
  },
  components: { tabBtn },
  watch: {
    searchFile: {
      handler: function (newValue, oldValue) {
        // 重新查看水汽信息
        this.initData()
      },
      deep: true
    },
  },
  data () {
    return {
      energyData: [
        { value: '01', icon: 'iconfont icon-dian' },
        { value: '02', icon: 'iconfont icon-shui' },
      ],
      type: '01',
      year: 2019,
      now: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      searchCondition: {},//查询条件
      tableData: {
        tHead: [
          {
            text: '明细',
            prop: "itemName",
            width: 120
          },
          {
            text: '1月',
            prop: "1月",
          },
          {
            text: '2月',
            prop: "2月"
          },
          {
            text: '3月',
            prop: "3月"
          },
          {
            text: '4月',
            prop: "4月"
          },
          {
            text: '5月',
            prop: "5月"
          },
          {
            text: '6月',
            prop: "6月"
          },
          {
            text: '7月',
            prop: "7月"
          },
          {
            text: '8月',
            prop: "8月"
          },
          {
            text: '9月',
            prop: "9月"
          },
          {
            text: '10月',
            prop: "10月"
          },
          {
            text: '11月',
            prop: "11月"
          },
          {
            text: '12月',
            prop: "12月"
          },
          {
            text: '合计',
            prop: "total",
          }
        ],
        tData: [],
      },
      showEdit: [],
      showBorder: [],
      elecData: {},//电能耗
      waterData: {},//水能耗
      eleTableData: [],
      waterTabledata: []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    getEnergyType (val) {
      console.log(val)
      this.type = val;
      this.searchCondition.energyType = val;
      if (val === '02') {
        if (this.waterTabledata.length > 0) {
          this.tableData.tData = this.waterTabledata;
          this.getShowEdit();
        } else {
          this.getQuotaSetting(this.searchCondition)
        }
      } else {
        if (this.eleTableData.length > 0) {
          this.tableData.tData = this.eleTableData;
          this.getShowEdit();
        } else {
          this.getQuotaSetting(this.searchCondition)
        }
      }
    },
    getYear (val) {
      this.year = val;
      this.searchCondition.year = val;
      this.getQuotaSetting(this.searchCondition)
      if (this.searchCondition.energyType === '01') {
        this.getQuotaSetting({ year: this.year, energyType: '02', shopNumber: this.searchFile.shopNumber })
      } else {
        this.getQuotaSetting({ year: this.year, energyType: '01', shopNumber: this.searchFile.shopNumber })
      }
    },
    initData () {
      this.year = this.searchFile.year;
      this.type = this.searchFile.energyType;
      this.searchCondition = utils.deepCopy(this.searchFile);
      this.getQuotaSetting(this.searchCondition)
      if (this.searchCondition.energyType === '01') {
        this.getQuotaSetting({ year: this.year, energyType: '02', shopNumber: this.searchFile.shopNumber })
      } else {
        this.getQuotaSetting({ year: this.year, energyType: '01', shopNumber: this.searchFile.shopNumber })
      }
    },
    async getQuotaSetting (param) {
      this.tableData.tData = []
      let res = await getQuotaSetting(param)
      if (res.code === 200) {
        if (res.data) {
          let energyData = utils.deepCopy(res.data)
          for (const key in energyData) {
            // console.log(key)
            let obj = {}
            energyData[key].forEach((item, i) => {
              if (i === 0) {
                obj.itemName = energyData[key][i]
              } else if (i === 13) {
                obj.total = energyData[key][i]
              } else {
                let index = i + '月'
                obj[index] = energyData[key][i];
              }
            });
            switch (key) {
              case 'benchmark':
                if (param.energyType === '01') {
                  this.eleTableData.splice(0, 1, obj)
                } else {
                  this.waterTabledata.splice(0, 1, obj)
                }
                break;
              case 'temp':
                if (param.energyType === '01') {
                  this.eleTableData[1] = obj
                }
                break;
              case 'quota':
                if (param.energyType === '01') {
                  this.eleTableData[3] = obj
                } else {
                  this.waterTabledata[2] = obj
                }
                break;
              default:
                if (param.energyType === '01') {
                  this.eleTableData[2] = obj
                } else {
                  this.waterTabledata[1] = obj
                }
            }
            this.tableData.tData = this.type === '01' ? this.eleTableData : this.waterTabledata
            this.getShowEdit()
          }
          for (const key in res.data) {
            res.data[key].splice(0, 1)
            res.data[key].splice(res.data[key].length - 1, 1)
            if (param.energyType === '01') {
              this.elecData[key] = res.data[key]
              this.elecData.energyType = param.energyType
            } else {
              this.waterData[key] = res.data[key]
              this.waterData.energyType = param.energyType
            }
          }
        }
      } else {
        console.log(res.msg)
      }
    },
    // 用于判断表格中对应的值是否是编辑状态，true为编辑状态，false为未编辑状态
    getShowEdit () {
      this.showEdit = [];
      this.tableData.tData.forEach((item, index) => {
        let obj = {}
        for (const key in item) {
          obj[key] = false
        }
        this.showEdit.push(obj);
        this.showBorder = JSON.parse(JSON.stringify(this.showEdit))
        // console.log(this.showBorder, 444444444444)
      })
    },
    // 双击编辑数据
    editData (row, index, prop) {
      this.showEdit[index][prop] = true;
      //聚焦
      this.$nextTick(_ => {
        this.$refs["myInput"] && this.$refs["myInput"][0].focus();
      });
    },
    // 失焦计算总和
    sumTotal (row, index, prop) {
      this.showEdit[index][prop] = false;
      this.showBorder = JSON.parse(JSON.stringify(this.showEdit))
      if (isNaN(parseInt(row[prop]))) {
        row[prop] = 0;
      } else {
        row[prop] = parseInt(row[prop]);
      }
      if (this.type == '01') {
        if (index != 1 && parseInt(row[prop]) < 0) {
          this.$message.error('数值不能为负值,已自动替换为0');
          row[prop] = 0;
        }
      } else {
        if (parseInt(row[prop]) < 0) {
          this.$message.error('数值不能为负值,已自动替换为0');
          row[prop] = 0;
        }
      }

      this.tableData.tData[index][prop] = parseInt(row[prop]);
      // 实现基准=定额+节能目标的联动
      switch (this.type) {
        case '01':
          if (index == 3 && this.tableData.tData[3][prop] >= 0) {
            if (this.tableData.tData[0][prop] > this.tableData.tData[3][prop]) {
              this.tableData.tData[2][prop] = parseInt(this.tableData.tData[0][prop]) - parseInt(this.tableData.tData[3][prop]);
            } else {
              this.tableData.tData[0][prop] = this.tableData.tData[2][prop] + this.tableData.tData[3][prop];
            }
          } else if (index == 2 && this.tableData.tData[2][prop] >= 0) {
            if (this.tableData.tData[0][prop] > this.tableData.tData[2][prop]) {
              this.tableData.tData[3][prop] = this.tableData.tData[0][prop] - this.tableData.tData[2][prop];
            } else {
              this.tableData.tData[0][prop] = this.tableData.tData[3][prop] + this.tableData.tData[2][prop];
            }
          } else if (index == 0 && this.tableData.tData[0][prop] >= 0) {
            let gap = this.tableData.tData[3][prop] - this.tableData.tData[0][prop]
            if (gap > 0) {//定额大于基准的情况
              if (this.tableData.tData[2][prop] > this.tableData.tData[0][prop]) {
                this.tableData.tData[3][prop] = 0;
                this.tableData.tData[2][prop] = this.tableData.tData[0][prop];
              } else {
                this.tableData.tData[3][prop] = this.tableData.tData[0][prop] - this.tableData.tData[2][prop];
              }
            } else {//基准大于定额
              if (this.tableData.tData[2][prop] > this.tableData.tData[0][prop]) {
                this.tableData.tData[3][prop] = 0;
                this.tableData.tData[2][prop] = this.tableData.tData[0][prop];
              } else {
                this.tableData.tData[3][prop] = this.tableData.tData[0][prop] - this.tableData.tData[2][prop]
              }
            }
          }
          break;
        default:
          if (index == 2 && this.tableData.tData[2][prop] >= 0) {
            if (this.tableData.tData[0][prop] > this.tableData.tData[2][prop]) {
              this.tableData.tData[1][prop] = parseInt(this.tableData.tData[0][prop]) - parseInt(this.tableData.tData[2][prop]);
            } else {
              this.tableData.tData[0][prop] = this.tableData.tData[2][prop] + this.tableData.tData[1][prop];
            }
          } else if (index == 1 && this.tableData.tData[1][prop] >= 0) {
            if (this.tableData.tData[0][prop] > this.tableData.tData[1][prop]) {
              this.tableData.tData[2][prop] = this.tableData.tData[0][prop] - this.tableData.tData[1][prop];
            } else {
              this.tableData.tData[0][prop] = this.tableData.tData[1][prop] + this.tableData.tData[2][prop];
            }
          } else if (index == 0 && this.tableData.tData[0][prop] >= 0) {
            let gap = this.tableData.tData[2][prop] - this.tableData.tData[0][prop]
            if (gap > 0) {//定额大于基准的情况
              if (this.tableData.tData[1][prop] > this.tableData.tData[0][prop]) {
                this.tableData.tData[2][prop] = 0;
                this.tableData.tData[1][prop] = this.tableData.tData[0][prop];
              } else {
                this.tableData.tData[2][prop] = this.tableData.tData[0][prop] - this.tableData.tData[1][prop];
              }
            } else {//基准大于定额
              if (this.tableData.tData[1][prop] > this.tableData.tData[0][prop]) {
                this.tableData.tData[2][prop] = 0;
                this.tableData.tData[1][prop] = this.tableData.tData[0][prop];
              } else {
                this.tableData.tData[2][prop] = this.tableData.tData[0][prop] - this.tableData.tData[1][prop]
              }
            }
          }
          break;
      }
      // 计算每一行的总和
      this.tableData.tData.forEach((item, ind) => {
        let total = 0;
        for (const key in item) {
          if (key !== 'itemName' && key !== "total") {
            if (!isNaN(parseInt(item[key])) && item['itemName'] !== '温度（℃）') {
              total += parseInt(item[key])
            }
          }
        }
        item['total'] = item['itemName'] !== '温度（℃）' ? total : '--';
      })
      this.handlerTableDate(this.tableData.tData)
    },
    // 将表格数据出处理成后台需要的格式
    handlerTableDate (arr) {
      let obj = {}
      arr.forEach(item => {
        if (item.itemName.indexOf('基准') !== -1) {
          // console.log(item.itemName, 1)
          obj.benchmark = []
          this.handlerTableObject(item, obj.benchmark)
        } else if (item.itemName.indexOf('温度') !== -1) {
          // console.log(item.itemName, 2)
          obj.temp = []
          this.handlerTableObject(item, obj.temp)
        } else if (item.itemName.indexOf('节能目标') !== -1) {
          // console.log(item.itemName, 3)
          obj.energySavingGoal = []
          this.handlerTableObject(item, obj.energySavingGoal)
        } else if (item.itemName.indexOf('定额') !== -1) {
          // console.log(item.itemName, 45454545)
          obj.quota = []
          this.handlerTableObject(item, obj.quota)
        }
      })
      if (this.type === '01') {
        this.elecData.energyType = this.type
        for (const key in obj) {
          this.elecData[key] = obj[key]
        }
      } else {
        this.waterData.energyType = this.type
        for (const key in obj) {
          this.waterData[key] = obj[key]
        }
      }
      // console.log(this.waterData, this.elecData)
    },
    handlerTableObject (item, obj) {
      let data = utils.deepCopy(item);
      delete data.itemName;
      delete data.total;
      for (const key in data) {
        obj[parseInt(key) - 1] = parseFloat(data[key])
      }
      return obj
    },
    // 保存定额设置
    submitData () {
      let ele = this.checkedObj(this.elecData);
      let water = this.checkedObj(this.waterData);
      console.log(ele)
      if (ele || water) {
        return
      }
      setQuot({ elecData: JSON.stringify(this.elecData), waterData: JSON.stringify(this.waterData), shopNumber: this.searchFile.shopNumber, year: this.year }).then(res => {
        if (res.code === 200) {
          this.$message.success('定额设置成功')
          splitbenchmarkQuota({ shopNumber: this.searchFile.shopNumber, year: this.year }).then(res => {
            if (res.code == 200) {
              console.log('定额拆分成功')
            }
          })
          this.$emit('isHide')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkedObj (obj) {
      let boolean = false
      for (const key in obj) {
        if (key != 'energyType' && key != 'temp') {
          let data = obj[key].findIndex((value) => value < 0);
          if (data != -1) {
            this.$message.error('数值不能为负值，请重新输入')
            boolean = true
          }
        }
      }
      return boolean;
    },
    exportQuota () {
      location.href = `${energyDetail.exportQuotaSetting}?shopNumber=${this.searchFile.shopNumber}&&year=${this.year}&&token=${localStorage.getItem('$token_info')}`
    },
    cancel () {
      this.$emit('isHide');
      //   清空未保存的数据
      this.elecData = {};
      this.waterData = {};
    }
  }
}
</script>
<style lang="scss" scoped>
.quato-setting {
  .query-condition {
    width: 100%;
    height: 40px;
    line-height: 40px;
    .energy-tab {
      width: 85px;
      display: inline-block;
      position: relative;
      top: 3px;
      margin-right: 10px;
    }
    /deep/ .el-input {
      width: 94px;
    }
    .button {
      margin-top: 6px;
      height: 28px;
    }
    /deep/ .el-select .el-input__inner {
      background-color: #fff;
      border: 1px solid #ccc;
    }
  }
  /deep/ .el-table .cell {
    padding: 0px;
    input {
      width: 100%;
      box-sizing: border-box;
    }
  }
  .tip {
    color: #1881bf;
    margin-top: 10px;
  }
  .warn {
    border: 1px solid red;
  }
}
</style>



