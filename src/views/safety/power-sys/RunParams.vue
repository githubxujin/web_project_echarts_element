<template>
  <div>
    <div class="top_search">
      <!-- 时间筛选 -->
      <div class="fl">
        <span>时间查询：</span>
        <el-date-picker v-model="curDate" type="date" placeholder="选择日期" format="yyyy-MM-dd"></el-date-picker>
      </div>
      <!-- //查询 -->
      <div class="item query-submit fl" @click="getItemList()">
        <i class="el-icon-search"></i> 查 询
      </div>
    </div>
    <div class="charts">
      <el-table :data="paramsTableData" style="width: 100%" height="400px">
        <el-table-column label="商户电表箱" align="center">
          <el-table-column prop="name" label="时间" width="80"></el-table-column>
          <el-table-column prop="province" label="AB线压" width="100"></el-table-column>
          <el-table-column prop="city" label="BC线压" width="100"></el-table-column>
          <el-table-column prop="address" label="CA线压" width="100"></el-table-column>
          <el-table-column prop="zip" label="A相电压" width="100"></el-table-column>
          <el-table-column prop="zip" label="B相电压" width="100"></el-table-column>
          <el-table-column prop="zip" label="C相电压" width="100"></el-table-column>
          <el-table-column prop="zip" label="报警类型" width="100"></el-table-column>
          <el-table-column prop="zip" label="峰值功率" width="100"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button @click="handleHide">关 闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import datetimeUtils from '@/utils/datetime-utils.js';
import { getEleRecord } from '../../../services/safety';
export default {
  components: {

  },
  props: ['meterId'],
  computed: {
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
  },
  data () {
    return {
      curDate: new Date(),
      paramsTableData:
        [
          {
            date: '2016-05-03',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-02',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-04',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-01',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-08',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-06',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-07',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }]
    }
  },
  created () {
    this.getItemList();
  },
  methods: {
    //用能趋势报表
    getItemList () {
      console.log('查询')
      let date = datetimeUtils.getSpecialDay(this.curDate, '/');
      console.log(date);

      getEleRecord({ shopNumber: this.shopNumber, date: date, meterId: this.meterId }).then(res => {
        console.log('res', res);
      });
    },
    //关闭
    handleHide () {
      this.$emit("handleHide")
    },
  }
}
</script>

<style lang="scss" scoped>
.top_search {
  padding-left: 28px;
  margin-top: 0px;
  overflow: hidden;
  /deep/ .el-input__inner {
    background-color: #fff;
    // border-radius: 28px;
    border: 1px solid #c3c9d5;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    height: 30px;
    line-height: 30px;
    border: none;
  }
}
.charts {
  width: 100%;
  height: 380px;
  margin-top: 10px;
}
</style>