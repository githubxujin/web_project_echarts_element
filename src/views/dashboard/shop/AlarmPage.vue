<template>
  <div class="alarm-page" v-if="alarmInfo">
    <img class="warnning-img" src="@/assets/images/shopIndex/alarm.png" />
    <p class="system-info">{{alarmInfo.data.alarmName}}</p>
    <p class="alarm-date">{{alarmInfo.data.date}}</p>
    <p
      class="confirm-info"
      v-show="alarmInfo.data.hasGenerateBill"
    >已生成工单并指派给{{alarmInfo.data.handlerName}}处理</p>
    <p class="confirm-info" v-show="alarmInfo.data.hasGenerateBill==false">
      <span>是否生成工单并指派给</span>
      <el-select v-model="userId" placeholder="请选择" @change="getHandler">
        <el-option
          v-for="item in orderHandler"
          :key="item.id"
          :label="item.realName"
          :value="item.id"
          :disabled="item.disabled"
        ></el-option>
      </el-select>
      <span>处理</span>
    </p>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button
          type="primary"
          round
          size="medium"
          style="padding:10px 30px; font-size:16px;"
          @click="getNextAlarmInfo"
          v-show="length>1&&index!=length-1"
        >下一条</el-button>
        <el-button
          type="primary"
          round
          size="medium"
          style="padding:10px 30px; font-size:16px;"
          @click="confirm"
          v-show="alarmInfo.data.hasGenerateBill==false"
        >确 定</el-button>
        <el-button
          type="primary"
          round
          size="medium"
          style="padding:10px 30px; font-size:16px;"
          @click="checkDetail"
          v-show="alarmInfo.data.hasGenerateBill"
        >查看详情</el-button>

        <el-button
          round
          size="medium"
          style="padding:10px 30px; font-size:16px;"
          @click="isHide"
        >关 闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { alarmSystem } from '@/enum/alarm-enum.js'
import { generateAlarmOrder } from '@/services/dashboard.js'
export default {
  props: {
    info: {
      type: Object
    },
    index: {
      type: Number
    },
    orderHandler: {
      type: Array
    },
    length: {
      type: Number
    }
  },
  data () {
    return {
      userId: '',
      alarmInfo: {}
    }
  },
  created () {
    this.alarmInfo = this.info;
    this.userId = this.orderHandler.length > 0 ? this.orderHandler[0].id : '';
  },
  computed: {
    showText () {
      return alarmSystem[this.info.system]
    }
  },
  watch: {
    info: {
      handler: function (newObj, oldObj) {
        this.alarmInfo = newObj
      },
      deep: true
    }
  },
  methods: {
    getHandler (val) {
      this.userId = val;
    },
    confirm () {
      // this.$emit('isHidealarmPage', this.index)
      generateAlarmOrder({ alarmId: this.info.data.alarmId, handlerId: this.userId }).then(res => {
        if (res.code == 200) {
          this.$message.success('工单已生成，可进入工单详情页查看');
        } else {
          this.$message('工单生成失败');
        }
      })
    },
    checkDetail () {
      this.$router.push({ path: '/operation/bill-search/repair' });
    },
    getNextAlarmInfo () {
      this.$emit('getNextAlarmInfo')
    },
    isHide () {
      this.alarmInfo = { data: {} }
      this.$emit('isHidealarmPage')
    }
  }
}
</script>
<style lang="scss" scoped>
.alarm-page {
  text-align: center;
  padding: 15px 0px;
  .warnning-img {
    width: 128px;
    height: 112px;
    margin-bottom: 36px;
  }
  .system-info {
    font-size: 30px;
    font-weight: bold;
    color: #b7230b;
    margin-bottom: 36px;
  }
  .alarm-date {
    color: #b7230b;
    font-size: 24px;
    line-height: 36px;
    font-weight: 500;
  }
  .confirm-info {
    margin-top: 30px;
    color: #333333;
    font-size: 24px;
  }
  /deep/ .el-button--danger {
    width: 150px;
    height: 50px;
    border-radius: 25px;
    color: #e6efff;
    background: #b7230b;
    font-size: 24px !important;
  }
  /deep/ .el-select {
    width: 94px;
    top: -2px;
  }
}
</style>


