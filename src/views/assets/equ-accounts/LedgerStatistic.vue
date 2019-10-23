<template>
  <div>
    <el-row>
      <span>设备类型</span>
      <el-select v-model="deviceType" placeholder="请选择设备类型" clearable>
        <el-option v-for="item in deviceList" :label="item.name" :value="item.id" :key="item.id"></el-option>
      </el-select>
      <!-- <tree-select
        v-model="deviceType"
        placeholder="请选择设备类型"
        :clearable="true"
        :data="deviceList"
        :defaultProps="defaultProps"
        :onlyLeafSelect="true"
      ></tree-select>-->
    </el-row>
    <div class="datatable-box">
      <el-table
        :height="400"
        :data="showList"
        ref="table"
        class="el-table--border"
        style="width: 100%;"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="50"></el-table-column>
        <el-table-column prop="deviceName" label="设备类型"></el-table-column>
        <el-table-column prop="total" label="总数"></el-table-column>
        <el-table-column prop="useNum" label="使用中"></el-table-column>
        <el-table-column prop="repairNum" label="维修中"></el-table-column>
        <el-table-column prop="idleNum" label="已报废"></el-table-column>
      </el-table>
      <pager :pager="pager" @query="getLedgerList" @setPager="onChangePage"></pager>
    </div>
    <el-row class="text-center">
      <el-button round size="mini" @click="close">关 闭</el-button>
    </el-row>
  </div>
</template>
<script>
import { getDeviceList, getAccountStatistic } from '@/services/assets.js';
import TreeSelect from '@/components/treeSelect';
import pager from "@/components/table/Pager";
export default {
  components: { pager, TreeSelect },
  props: {
    deviceList: Array,
    LedgerDialogVisible: Boolean,
    shopNumber: String
  },
  data () {
    return {
      ledgerList: [
      ],
      showList: [],
      deviceType: '',
      pager: {
        total: 20,
        pageNum: 1,
        pageSize: 15,
      },
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      }
    }
  },
  created () {
    this.deviceType = this.deviceList[0].id;
    this.initData();
  },
  methods: {
    indexMethod (index) {
      return (
        (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
      );
    },
    initData () {
      let params = {
        shopNumber: this.$store.getters.getUserInfo.shopNumber,
        sysType: this.deviceType
      }
      getAccountStatistic(params).then(res => {
        if (res.code == 200) {
          this.pager.total = res.data.length;
          this.ledgerList = res.data;
        } else {
          this.pager.total = 0;
          this.ledgerList = [];
        }
        this.onChangePage(this.pager);
      })
    },
    getLedgerList () {

    },
    onChangePage (val) {
      this.pager.pageNum = val.pageNum;
      this.pager.pageSize = val.pageSize;
      this.showList = this.chunk(this.ledgerList, val.pageSize)[val.pageNum - 1];
    },
    // 前端分页
    chunk (array, size) {
      //获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
      const length = array.length
      //判断不是数组，或者size没有设置，size小于1，就返回空数组
      if (!length || !size || size < 1) {
        return []
      }
      //核心部分
      let index = 0 //用来表示切割元素的范围start
      let resIndex = 0 //用来递增表示输出数组的下标

      //根据length和size算出输出数组的长度，并且创建它。
      let result = new Array(Math.ceil(length / size))
      //进行循环
      while (index < length) {
        //循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
        result[resIndex++] = array.slice(index, (index += size))
      }
      //输出新数组
      return result
    },
    close () {
      this.$emit('update:LedgerDialogVisible', false);
    }
  },
  watch: {
    deviceType: function (val) {
      console.log('deviceType', val)
      this.initData();
    },
    LedgerDialogVisible: function (val) {
      if (val) {
        this.initData();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>


