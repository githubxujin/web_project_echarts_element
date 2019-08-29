<template>
  <div v-loading="dialogLoading">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="ruleForm.templateName" placeholder="模板名称" style="width:215px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl10">
          <el-form-item label="设备类型" prop="deviceIdAndTypeId">
            <tree-select
              v-model="ruleForm.deviceIdAndTypeId"
              placeholder="请选择"
              :clearable="true"
              :data="treeData"
              :defaultProps="defaultProps"
              :onlyLeafSelect="true"
              @change="changeDeviceType"
            ></tree-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="巡检周期" prop="cycleTimeLength">
        <el-input v-model="ruleForm.cycleTimeLength" style="width:123px;"></el-input>
        <el-select v-model="ruleForm.cycleTime" style="width:88px">
          <el-option
            v-for="(item,index) in CheckCycleOptions"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="row-head">请选择需要配置的参数</div>
    <div class="datatable-box">
      <el-table
        v-loading="loading"
        ref="Table"
        border
        :data="tableData"
        style="width: 100%"
        height="400px"
        @selection-change="changeFun"
      >
        <el-table-column type="selection" width="55" prop="id"></el-table-column>
        <el-table-column prop="paraName" label="巡检参数"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <span class="u-link" @click="lookCheckParam(scope.row)">查看巡检参数</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
    <!-- 巡检参数 -->
    <el-dialog
      v-dialogDrag
      :title="paramTitle"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="showParamWin"
      width="580px"
      custom-class="add-standard"
    >
      <span
        slot="title"
        class="text-ellipse dialog-header-text"
        v-text="paramTitle"
        :title="paramTitle"
      ></span>
      <param-detail v-if="showParamWin" :id="curId"></param-detail>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceTypeTree, getCheckStandardParamList } from '@/services/operation.js';
import TreeSelect from '@/components/treeSelect';
import ParamDetail from './ParamDetail';
import { CheckCycleOptions } from '@/enum/operation-enum';
import { validateMaxInt } from '@/utils/validate-utils.js'
export default {
  components: {
    TreeSelect,
    ParamDetail
  },
  data () {
    return {
      loading: false,
      dialogLoading: false, //模板弹窗加载中
      CheckCycleOptions,//巡检周期
      paramTitle: '',//参数弹窗标题
      showParamWin: false, //是否显示参数弹窗
      ruleForm: { templateName: '', cycleTime: '', cycleTimeLength: '', deviceType: '', deviceIdAndTypeId: '', standardList: [] },
      cycleTimeOptions: [],
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      },
      rules: {
        deviceIdAndTypeId: [
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        templateName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        cycleTimeLength: [
          { required: true, message: '请输入巡检周期', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateMaxInt(rule, value, callback, 30) }, trigger: 'blur' },
        ],
      },
      multipleSelection: [],
      tableData: [],
      curId: '',//当前选中ID
    }
  },
  computed: {
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    }
  },
  created () {
    this.initData();
  },
  methods: {
    //初始化界面数据
    initData () {
      //获取设备类型
      getDeviceTypeTree().then(res => {
        if (res.code == 200) {
          this.treeData = res.data.array;
        }
      });
    },
    //设备类型变更
    changeDeviceType (data) {
      let id = this.getDeviceId(data.key);
      //获取参数列表
      getCheckStandardParamList({ deviceType: id, shopNumber: this.shopNumber }).then(res => {
        this.tableData = res.data.array;
      })
    },
    //获取真实的设备ID
    getDeviceId (val) {
      if (val) {
        return val.includes(',') ? parseInt(val.split(',')[0]) : '';
      }
      else {
        return '';
      }
    },
    //提交
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.deviceType = this.getDeviceId(this.ruleForm.deviceIdAndTypeId);
          if (this.multipleSelection.length > 0) {
            this.ruleForm.standardList = this.multipleSelection.map(n => {
              return n.id;
            })
          }
          this.$emit("submitForm", this.ruleForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
    //复选框状态改变
    changeFun (val) {
      this.multipleSelection = val;
    },
    //查看巡检参数
    lookCheckParam (row) {
      console.log(row);
      this.paramTitle = row.paraName + '-巡检参数详情';
      this.curId = row.id;
      this.showParamWin = true;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
@import '../../scss/window.scss';
</style>