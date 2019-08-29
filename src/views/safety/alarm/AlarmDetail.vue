<template>
  <div>
    <div class="datatable-box">
      <el-table ref="Table" border :data="tableData" style="width: 100%" height="320px">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="alarmName" label="报警名称"></el-table-column>
        <el-table-column prop="alarmLocation" label="报警位置"></el-table-column>
        <el-table-column label="报警时间" align="center" width="140">
          <template slot-scope="scope">{{scope.row.alarmTime|timeFormat('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
        <el-table-column label="报警级别" align="center">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ alarmLevel[scope.row.alarmLevel] }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="suggestion" label="处理建议"></el-table-column>
        <el-table-column prop="deviceName" label="状态" align="center">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span
                :class="{'red':scope.row.status==alarmStatusEnum.noSure}"
              >{{alarmStatus[scope.row.status] }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pager :pager="pager" @query="getItemList"></Pager>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Pager from '@/components/table/Pager'
import { getHistryAlarmListByDeviceId } from '../../../services/safety';
import { alarmStatus, alarmLevel, alarmStatusEnum } from '../../../enum/alarm-enum.js';
export default {
  components: {
    Pager
  },
  props: {
    deviceId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      pager: {
        total: 100,
        pageNum: 1,
        pageSize: 15,
      },
      tableData: [],
      alarmStatusEnum,
      alarmStatus,
      alarmLevel,
    }
  },
  created () {
    this.getItemList();
  },
  computed: {
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    }
  },
  methods: {
    // 查询请求
    getItemList () {
      getHistryAlarmListByDeviceId({ shopNumber: this.shopNumber, deviceId: this.deviceId, pageNum: this.pager.pageNum, pageSize: this.pager.pageSize }).then(res => {
        if (res.data) {
          this.pager.total = res.data.total;
          this.tableData = res.data.list;
        }
      })
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
  }
}
</script>

<style lang="scss" scoped>
.red {
  color: #e11c25;
}
.el-dialog .dialog-footer {
  margin-top: 0px;
}
</style>