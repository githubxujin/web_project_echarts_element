<template>
  <div>
    <div class="datatable-box">
      <el-table :data="tableData" height="200" border style="width: 100%">
        <el-table-column prop="paramName" :label="title+'参数'"></el-table-column>
        <el-table-column prop="standardValue" label="标准值"></el-table-column>
        <el-table-column prop="practicalValue" label="实际值"></el-table-column>
        <el-table-column prop="riskResult" label="风险评估结果" align="center"></el-table-column>
      </el-table>
    </div>
    <el-row>
      <el-col :span="4">
        <div>{{title}}说明：</div>
      </el-col>
      <el-col :span="20">
        <div>{{result}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div>{{title}}图片：</div>
      </el-col>
      <el-col :span="20">
        <viewer :images="imgs" class="img-viewer">
          <!-- //一定要一个数组，否则报错 -->
          <img v-for="(img,index) in imgs" :src="img" :key="index" />
        </viewer>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button @click="isHide">关 闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCheckParamList, getMaintainParamList } from '@/services/operation';
export default {
  props: {
    title: {
      type: String,
      default: '巡检'
    },
    //工单号
    billNumber: {
      type: String,
      default: ''
    },
    //设备ID
    deviceId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableData: [],
      imgs: [],
      result: ''
    }
  },
  created () {
    this.initData();
  },
  methods: {
    //初始化界面数据
    initData () {
      if (this.title == '巡检') {
        getCheckParamList({ billNumber: this.billNumber, deviceId: this.deviceId }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.paramList;
            this.imgs = res.data.checkImageList;
            this.result = res.data.checkResult;
          }
        })
      } else {
        getMaintainParamList({ billNumber: this.billNumber, deviceId: this.deviceId }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.paramList;
            this.imgs = res.data.maintainImageList;
            this.result = res.data.maintainResult;
          }
        })
      }
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  line-height: 38px;
}
.img-viewer img {
  width: 100px;
  height: 100px;
  float: left;
}
</style>