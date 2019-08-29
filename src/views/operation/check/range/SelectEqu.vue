<template>
  <div>
    <div class="u-layout-search">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">设备：</p>
            <div class="input-container">
              <div class="item select-input">
                <el-input v-model="deviceName" placeholder="设备名称" clearable></el-input>
              </div>
            </div>
          </div>
          <div class="title-input-group u-title-input-group">
            <el-button
              type="primary"
              icon="el-icon-search"
              round
              :loading="btnLoading"
              @click="getItemList"
            >查询</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="datatable-box">
      <el-table
        ref="multipleTable"
        border
        :data="tableData"
        style="width: 100%"
        height="320px"
        @selection-change="changeFun"
        @row-click="handleCurrentChange"
      >
        <el-table-column type="selection" width="55" prop="id"></el-table-column>
        <el-table-column prop="name" label="设备"></el-table-column>
        <el-table-column prop="planName" label="已设计划"></el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceList } from '@/services/operation';
export default {
  props: {
    cycleTimeStr: {
      type: String,
      default: ''
    },
    //已选中的设备Id
    curDeviceIds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      btnLoading: false,
      multipleSelection: [],
      tableData: [],
      deviceName: '' //设备名称
    }
  },
  computed: {
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
    curDevices () {
      let items = [];
      this.tableData.forEach(n => {
        if (this.curDeviceIds.includes(n.id)) {
          items.push(n);
        }
      })
      return items;
    }
  },
  created () {
    console.log('this.curDeviceIds :', this.curDeviceIds);
    this.getItemList();
  },
  methods: {
    //控制loading隐藏和显示
    ctrlLoading (flag) {
      this.btnLoading = flag;
      this.$common.updateLoadingStatus(flag);
    },
    // 查询请求
    getItemList () {
      this.ctrlLoading(true);
      getDeviceList({ deviceName: this.deviceName, shopNumber: this.shopNumber, cycleTimeStr: this.cycleTimeStr }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.array;
        }
        this.$nextTick(n => {
          for (let i = 0; i < this.curDevices.length; i++) {
            console.log('this.$refs :', this.$refs.multipleTable.toggleRowSelection, this.curDevices[i]);
            this.$refs.multipleTable.toggleRowSelection(this.curDevices[i], true);
          }
        })
        this.ctrlLoading(false);
      }).catch(() => { this.btnLoading = false; })
    },
    //确定
    submitForm () {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择设备！',
          type: 'warning',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      this.$emit("submitForm", this.multipleSelection);
    },
    //关闭
    isHide () {
      this.$emit("onHide");
    },
    //复选框状态改变
    changeFun (val) {
      this.multipleSelection = val;
      console.log('val :', val);
    },
    handleCurrentChange (row, event, column) {
      this.$refs.multipleTable.toggleRowSelection(row, true);//点击选中
    }
  }
}
</script>

<style lang="scss" scoped>
.u-layout-search {
  padding: 0px 0px 10px 30px;
}
</style>