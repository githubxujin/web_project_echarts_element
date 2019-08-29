<template>
  <div class="detail-info">
    <div class="datatable-box">
      <el-table :data="tableData.tData" style="width: 100%" ref="table">
        <el-table-column
          v-for="item in tableData.tHead"
          :key="item.text"
          :prop="item.prop"
          :label="item.text"
        >
          <template slot-scope="scope">
            <span
              v-if="item.prop=='elevatorStatus'"
              :class="{warn:scope.row.elevatorStatus.indexOf('故障')!=-1}"
            >{{scope.row[item.prop]}}</span>
            <span v-else-if="item.prop==='openDoor'" v-html="scope.row[item.prop]?'开门':'关门'"></span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getDetailList } from '@/services/safety'
export default {
  data () {
    return {
      tableData: {
        tHead: [
          { text: '电梯编号', prop: 'number' },
          { text: '电梯', prop: 'name' },
          { text: '电梯状态', prop: 'elevatorStatus' },
          { text: '电梯运行', prop: 'runningStatus' },
          { text: '所在楼层', prop: 'floor' },
          { text: '有无载客', prop: 'anyPassenger' },
          { text: '轿门状态', prop: 'openDoor' },
        ],
        tData: []
      }
    }
  },
  created () {
    this.shopNumber = this.$store.getters.getUserInfo.roleType == 2 ? this.shopNumbers : this.$store.getters.getCurShop.shopNumber;
    this.getDetailList();
  },
  computed: {
    shopNumbers () {
      return this.$store.getters.shopNumber;
    },
  },
  watch: {
    shopNumbers (val) {
      this.shopNumber = val;
      this.getDetailList();
    },
  },
  methods: {
    // 获取详情列表
    async getDetailList () {
      let res = await getDetailList(this.shopNumber)
      if (res.code == 200) {
        if (res.data && res.data.length > 0) {
          this.tableData.tData = res.data
        } else {
          this.tableData.tData = []
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.warn {
  color: #d4021f;
}
</style>


