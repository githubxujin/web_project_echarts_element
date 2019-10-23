<template>
  <div>
    <el-form
      v-if="handleType==2"
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="转单原因" prop="msg">
        <el-input v-model="ruleForm.msg"></el-input>
      </el-form-item>
    </el-form>
    <!-- 如果是转单，必须有转单审核权限时才显示 -->
    <div class="datatable-box" v-if="showDatatable">
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
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系方式" width="120"></el-table-column>
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
 * 选择执行人员
 */
import { executeList } from '../../../services/operation';
export default {
  props: {
    //变化标志
    changeTag: {
      type: String,
      default: ''
    },
    //操作类型：1：派工；2：转单
    handleType: {
      type: Number,
      default: 1
    },
    haveAudit: {
      type: Boolean,
      default: false
    },
    billNumber: {
      type: String,
      default: ''
    }
  },
  computed: {
    btnLoading: function () {
      return this.$store.getters.getBtnLoading;
    }
  },
  watch: {
    changeTag (val) {
      this.initData();
    }
  },
  data () {
    return {
      loading: false,
      ruleForm: { msg: '' },
      rules: {
        msg: [
          { required: true, message: '请输入转单原因', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
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
    //显示表格
    showDatatable () {
      return (this.handleType == 2 && this.haveAudit) || this.handleType == 1;
    }
  },
  created () {
    this.initData();
  },
  methods: {
    //初始化数据
    initData () {
      this.loading = true;
      this.ruleForm.msg = '';
      executeList({ shopNumber: this.shopNumber, billNumber: this.billNumber }).then(res => {
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
      console.log('选中', this.multipleSelection);
      if (this.showDatatable && this.multipleSelection.length == 0) {
        this.$messageTip({
          message: '请选择人员！',
          type: 'warning',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      let user = this.multipleSelection.length > 0 ? this.multipleSelection[0] : null;
      let item = { user: user, ruleForm: this.ruleForm };
      if (this.handleType == 1) { //派工
        this.$store.commit('base/updateBtnLoading', true);
        this.$emit("submitForm", item);
      } else { //转单
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$store.commit('base/updateBtnLoading', true);
            this.$emit("submitForm", item);
            // 点击关闭 数据重置
            if (this.handleType == 2) {
              this.$refs.ruleForm.resetFields();
            }
          }
        });
      }
    },
    //关闭
    isHide () {
      if (this.handleType == 2) {
        this.$refs.ruleForm.resetFields();
      }
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