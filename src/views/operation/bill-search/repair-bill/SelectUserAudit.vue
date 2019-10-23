<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="转单原因">{{msg}}</el-form-item>
      <el-form-item label="审核">
        <el-radio-group v-model="ruleForm.checkResult">
          <el-radio :label="0">通过</el-radio>
          <el-radio :label="1">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="ruleForm.checkResult==1" label="驳回原因" prop="rejectInfo">
        <el-input v-model="ruleForm.rejectInfo"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="ruleForm.checkResult==0" class="datatable-box">
      <el-table
        v-loading="loading"
        ref="Table"
        border
        :data="userTableData"
        style="width: 100%"
        height="400px"
        @selection-change="changeFun"
        @current-change="currentChange"
      >
        <el-table-column type="selection" width="55" prop="id"></el-table-column>
        <el-table-column prop="orgName" label="部门" width="120"></el-table-column>
        <el-table-column prop="realName" label="姓名" width="120"></el-table-column>
        <el-table-column prop="billCount" label="当前工单数" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="120"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="$common.throttle(submitForm)()" :loading="btnLoading">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 转单审核
 */
import { executeList } from '@/services/operation';
export default {
  props: {
    msg: {
      type: String,
      default: ''
    },
    //变化标志
    changeTag: {
      type: String,
      default: ''
    },
    //操作类型：1：派工；2：转单
    handleType: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      loading: false,
      ruleForm: { msg: '', checkResult: 0, rejectInfo: '' },
      rules: {
        rejectInfo: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      multipleSelection: [], //所有选中行
      userTableData: []
    }
  },
  computed: {
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
    btnLoading: function () {
      return this.$store.getters.getBtnLoading;
    }
  },
  created () {
    this.initData();
  },
  methods: {
    //初始化数据
    initData () {
      this.loading = true;
      this.ruleForm.msg = this.msg;
      executeList({ shopNumber: this.shopNumber, billNumber: '' }).then(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.userTableData = res.data.array;
        }
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      })
    },
    //确定
    submitForm () {
      console.log('选中', this.multipleSelection, this.ruleForm);
      if (this.ruleForm.checkResult == 0 && this.multipleSelection.length == 0) { //如果是通过
        this.$message({
          message: '请选择人员！',
          type: 'warning',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      let item = { user: this.multipleSelection.length > 0 ? this.multipleSelection[0] : null, ruleForm: this.ruleForm };
      console.log('转单', item, this.handleType);
      if (this.handleType == 1) { //派工
        this.$store.commit('base/updateBtnLoading', true);
        this.$emit("submitForm", item);
      } else { //转单
        this.$refs['ruleForm'].validate((valid) => {
          console.log('valid :', valid);
          if (valid) {
            this.$store.commit('base/updateBtnLoading', true);
            this.$emit("submitForm", item);
            // 点击关闭 数据重置
            this.$refs['ruleForm'].resetFields();
          }
        });
      }
    },
    //关闭
    isHide () {
      // 点击关闭 数据重置
      this.$refs['ruleForm'].resetFields();
      this.$emit("onHide");
    },
    //复选框状态改变
    changeFun (val) {
      if (val.length > 1) {
        this.$refs.Table.clearSelection();
        let curItme = val.pop();
        this.multipleSelection = [curItme];
        this.$refs.Table.toggleRowSelection(curItme)
      } else {
        this.multipleSelection = val;
      }
    },
    //点击table一列的任意位置就勾选上
    currentChange (val) {
      this.$refs.Table.toggleRowSelection(val);
      this.multipleSelection = [val];
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ thead {
  .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
</style>