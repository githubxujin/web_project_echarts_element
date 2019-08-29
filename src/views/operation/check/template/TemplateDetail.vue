<template>
  <div>
    <div class="datatable-box">
      <el-table v-loading="loading" border :data="tableData" style="width: 100%" height="360px">
        <el-table-column prop="paraName" label="巡检参数"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-link type="primary" @click="lookParamDetail(scope.row)">查看参数详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="12">创建人：{{createIdStr}}</el-col>
        <el-col :span="12">创建时间：{{createTimeStr}}</el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button @click="isHide()">关 闭</el-button>
      </div>
    </div>
    <!-- 参数详情 -->
    <el-dialog
      v-dialogDrag
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="showDetailWin"
      width="480px"
    >
      <span
        slot="title"
        class="text-ellipse dialog-header-text"
        v-text="detailTitle"
        :title="detailTitle"
      ></span>
      <param-detail v-if="showDetailWin" @onHide="showDetailWin=false" :id="curId"></param-detail>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckParam } from '@/services/operation.js';
import ParamDetail from './ParamDetail'
export default {
  props: ['id'],
  components: {
    ParamDetail
  },
  data () {
    return {
      showDetailWin: false,
      detailTitle: '',
      loading: false,
      tableData: [],
      curId: '',//当前选中ID
      createIdStr: '', //创建人
      createTimeStr: ''//创建时间
    }
  },
  created () {
    this.initData();
  },
  methods: {
    initData () {
      this.loading = true;
      getCheckParam(this.id).then(res => {
        this.tableData = res.data.list;
        this.createIdStr = res.data.createIdStr;
        this.createTimeStr = res.data.createTimeStr;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
    //查看参数详情
    lookParamDetail (row) {
      // console.log('row.id 1:', row.id);
      this.detailTitle = row.paraName + '-巡检参数详情';
      this.curId = row.id;
      this.showDetailWin = true;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>