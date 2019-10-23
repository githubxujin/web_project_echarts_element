<template>
  <div class="add-range">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划名称" prop="planName">
            <el-input v-model.trim="ruleForm.planName" placeholder="计划名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl10">
          <el-form-item label="巡检周期" prop="cycleTime">
            <el-select v-model="ruleForm.cycleTime" @change="cycleTimeChange" :disabled="isEdit">
              <el-option
                v-for="(item,index) in CheckCycleOptions"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="巡检设备" class="form-item-textarea" prop="checkEqus">
        <el-input
          @focus="showSelectEquWin=true"
          type="textarea"
          v-model="ruleForm.checkEqus"
          placeholder="巡检设备"
          readonly
        ></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="初次生成时间" prop="firstCreateTime">
            <el-date-picker
              v-model="ruleForm.firstCreateTime"
              type="datetime"
              popper-class="first-time"
              placeholder="选择日期时间"
              :picker-options="pickerBeginAfter"
              :disabled="isEdit"
              :default-time="defaultTime"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl10">
          <el-form-item label="任务时长" prop="taskTimeLength">
            <el-select :disabled="taskTimeLengthIsDisabled" v-model="ruleForm.taskTimeLength">
              <el-option
                v-for="(item,index) in taskTimeOptions"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务生成规则" prop="taskCreateRule">
            <el-radio-group v-model="ruleForm.taskCreateRule">
              <el-radio :label="0">按设备生成</el-radio>
              <el-radio :label="1">按计划打包</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl10">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="datatable-box">
      <el-table
        ref="Table"
        border
        :data="tableData"
        style="width: 100%"
        height="200px"
        @selection-change="changeFun"
      >
        <el-table-column type="selection" width="55" prop="deviceId"></el-table-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="deviceName" label="设备"></el-table-column>
        <el-table-column label="模板" align="center" width="200px">
          <template slot-scope="scope">
            <div class="template">
              <el-select
                v-if="tableData[scope.$index].templateList.length>1"
                v-model="tableData[scope.$index].checked"
              >
                <el-option
                  v-for="(item,index) in tableData[scope.$index].templateList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
              <span v-else-if="tableData[scope.$index].templateList.length==0"></span>
              <span v-else>{{tableData[scope.$index].templateList[0].label}}</span>
              <span
                v-if="tableData[scope.$index].checked"
                title="查看模板详情"
                class="info iconfont icon-guanyu1"
                @click="detailClick(scope.row)"
              ></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="校核" align="center">
          <template slot-scope="scope">
            <span class="u-link" type="primary" @click="lookCheckPlan(scope.row)">查看巡检计划</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope" slot="header">
            <span class="u-link" @click="createCheckedNow(scope)">立即生成</span>
          </template>
          <template slot-scope="scope">
            <span class="u-link" type="primary" @click="createNow(scope.row)">立即生成</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
    <!-- 选择设备 -->
    <el-dialog
      v-dialogDrag
      title="选择设备"
      append-to-body
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showSelectEquWin"
      width="720px"
    >
      <select-equ
        v-if="showSelectEquWin"
        @onHide="showSelectEquWin=false"
        @submitForm="submitSelectEqu"
        :cycleTimeStr="ruleForm.cycleTime"
        :curDeviceIds="curDeviceIds"
      ></select-equ>
    </el-dialog>
    <!-- 查看巡检计划 -->
    <el-dialog
      v-dialogDrag
      :title="checkPlanTitle"
      append-to-body
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showCheckPlanWin"
      width="720px"
    >
      <span
        slot="title"
        class="text-ellipse dialog-header-text"
        v-text="checkPlanTitle"
        :title="checkPlanTitle"
      ></span>
      <check-plan-list
        v-if="showCheckPlanWin"
        @onHide="showCheckPlanWin=false"
        :deviceIdAndType="deviceIdAndType"
      ></check-plan-list>
    </el-dialog>
    <!-- 模板详情 -->
    <el-dialog
      v-dialogDrag
      :title="detailTitle"
      :modal-append-to-body="false"
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
      <template-detail v-if="showDetailWin" @onHide="showDetailWin=false" :id="templateNumber"></template-detail>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckCycleSelected, getTemplateByDevice, getCheckPlanInfo, generateCheckBill, beforeGenerateCheckBill } from '@/services/operation.js';
import SelectEqu from './SelectEqu';
import CheckPlanList from './CheckPlanList';
import TemplateDetail from '../template/TemplateDetail';
// import fakeClickOutSide from '@/utils/mixins/fackClickOutSide.js';
import datetimeUtils from '@/utils/datetime-utils.js';
export default {
  components: {
    SelectEqu,
    CheckPlanList,
    TemplateDetail
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  // mixins: [fakeClickOutSide],
  data () {
    return {
      defaultTime: datetimeUtils.getTimeNextTime(new Date(), 5), //任务生成规则-默认时间
      CheckCycleOptions: [],
      cycleTimeOptions: [],
      ruleForm: { cycleTime: '', planName: '', checkEqus: '', firstCreateTime: '', taskCreateRule: 0, status: 0, taskTimeLength: '' },
      rules: {
        planName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' },
          { max: 10, message: '长度不能超过 10 个字符', trigger: 'blur' }
        ],
        cycleTime: [
          { required: true, message: '请选择巡检周期', trigger: 'blur' },
        ],
        checkEqus: [
          { required: true, message: '请选择巡检设备', trigger: 'change' },
        ],
        firstCreateTime: [
          { required: true, message: '请选择初次生成时间', trigger: 'blur' },
        ],
        // taskTimeLength: [
        //   { validator: this.checktaskTimeLength(), trigger: 'blur' }
        // ]
      },
      multipleSelection: [],
      tableData: [],
      showSelectEquWin: false,
      showCheckPlanWin: false,
      cycleTimeLength: '',//周期时长
      cycleTimeType: '',//周期类型
      selectEquIds: [],//当前选中的设备ID集合：目标列表中的
      deviceIdAndType: '',//当前选中的设备ID
      deviceName: '',//当前选中的设备名称
      curDeviceIds: [],//当前选中的设备对象ID：和选择设备列表中的ID一致

      detailTitle: '',//详情弹窗标题
      showDetailWin: false,//是否显示详情弹窗
      templateNumber: '',//当前选中模板编号
      pickerBeginAfter: {
        //只能操作当前时间及以后的时间
        disabledDate: time => {
          return time.getTime() + 3600 * 24 * 1000 < Date.now()
        }
      },
      taskTimeOptions: [
        { label: '全部周期', value: '' },
        { label: '1天', value: 1 },
        { label: '2天', value: 2 },
      ]
    }
  },
  created () {
    console.log('defaultTime :', this.defaultTime);
    this.initData();
  },
  computed: {
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
    //查看巡检计划标题
    checkPlanTitle () {
      return this.deviceName + '巡检计划';
    },
    //是否禁用任务时长
    taskTimeLengthIsDisabled () {
      let val = this.ruleForm.cycleTime;
      if (val) {
        this.cycleTimeType = val.charAt(val.length - 1);
        this.cycleTimeLength = parseInt(val.substring(0, val.length - 1));
        // console.log('this.cycleTimeLength:', this.cycleTimeLength);
      }
      let result = this.cycleTimeType == 'B' || val == '1C';
      if (result) {
        this.ruleForm.taskTimeLength = '';
      }
      return result; //时，1天 禁用
    },
    taskTimeLengthMaxVal () {
      return this.cycleTimeLength >= 2 ? 2 : 1;
    }
  },
  methods: {
    checktaskTimeLength () {
      return (rule, value, callback) => {
        console.log('value :', value, this.taskTimeLengthMaxVal);
        if (this.taskTimeLengthIsDisabled) { //禁用时不验证
          callback();
        }
        else if (value === 0) {
          callback(new Error('任务时长不能为0'));
        }
        else if (value === '' || value === 1 || (value > 0 && value <= this.taskTimeLengthMaxVal)) {
          callback();
        }
        else if (value > this.taskTimeLengthMaxVal) {
          let msg = '任务时长不能大于' + this.taskTimeLengthMaxVal;
          callback(new Error(msg));
        }
        else {
          callback(new Error('任务时长是不能大于2且不能小于1的整数'));
        }
      }
    },
    initData () {
      //获取巡检周期下拉框数据
      getCheckCycleSelected(this.shopNumber).then(res => {
        if (res.code == 200) {
          this.CheckCycleOptions = res.data.array;
          if (res.data.array.length > 0) {
            this.ruleForm.cycleTime = res.data.array[0].value;
          }
        }
      });
      //如果是编辑，先获取巡检计划信息
      if (this.isEdit) {
        getCheckPlanInfo(this.id).then(res => {
          if (res.code == 200 && res.data) {
            this.ruleForm.planName = res.data.planName;
            this.ruleForm.cycleTime = res.data.cycleTimeStr;
            this.ruleForm.checkEqus = res.data.deviceNames;
            this.ruleForm.firstCreateTime = res.data.firstTime;
            if (res.data.taskTimeLength) {
              this.ruleForm.taskTimeLength = res.data.taskTimeLength;
            }
            if (res.data.cycleTimeStr) {
              this.cycleTimeLength = parseInt(res.data.cycleTimeStr.substring(0, res.data.cycleTimeStr.length - 1));
            }
            this.ruleForm.taskCreateRule = res.data.rule;
            this.ruleForm.status = res.data.status;
            this.curDeviceIds = res.data.devices;
            this.tableData = res.data.templateList;
          }
        })
      }
    },
    //巡检周期改变时
    cycleTimeChange (val) {
      //数据清空
      this.ruleForm.checkEqus = '';
      this.curDeviceIds = [];
      this.tableData = [];
      if (val) {
        this.cycleTimeLength = parseInt(val.substring(0, val.length - 1));
      }
    },
    //确定
    submitForm (formName) {
      var that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          console.log('验证成功');
          that.tableData.forEach(n => {
            that.selectEquIds.push(n.checked ? n.deviceId + ',' + n.checked : n.deviceId);
          })
          console.log('that.selectEquIds :', that.selectEquIds);
          if (this.isEdit) {
            that.submitFormFuc(that.ruleForm.firstCreateTime)
          }
          else {
            let firstCreateTime = that.ruleForm.firstCreateTime;
            if (firstCreateTime.getTime() < new Date().getTime()) {
              console.log('初次 :', firstCreateTime, firstCreateTime.getTime(), new Date().getTime());
              this.$message.error('初次生成时间已逾期，请重新设置!');
            } else {
              that.submitFormFuc(firstCreateTime);
            }
          }
        }
      }
      );
    },
    submitFormFuc (dt) {
      let that = this;
      let saveObj = {
        shopNumber: that.shopNumber, planName: that.ruleForm.planName, cycleTimeLength: that.cycleTimeLength,
        cycleTimeType: that.cycleTimeType, firstTime: dt, rule: that.ruleForm.taskCreateRule,
        status: that.ruleForm.status, devices: that.selectEquIds
      };
      if (that.cycleTimeType != 'B' && that.ruleForm.cycleTime != '1C' && that.ruleForm.taskTimeLength > 0) {//周期不为时，且不为1天，并且任务时长有值
        saveObj.taskTimeLength = that.ruleForm.taskTimeLength;
      }
      that.$emit('submitForm', saveObj);
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
    //查看巡检计划
    lookCheckPlan (row) {
      console.log('row :', row);
      this.showCheckPlanWin = true;
      this.deviceIdAndType = row.deviceId;
      this.deviceName = row.deviceName;
    },
    //查看模板详情
    detailClick (row) {
      console.log(row)
      this.templateNumber = row.checked;
      let templateObj = row.templateList.find(n => n.value == row.checked);
      let label = templateObj ? templateObj.label : '';
      if (label) {
        this.detailTitle = label.substr(label.indexOf(']') + 1);
      }
      // let templateName = label.substr(label.indexOf(']') + 1);
      // console.log('templateName :', templateName);
      this.showDetailWin = true;
    },
    //立即生成
    createNow (row) {
      let generateObj = { shopNumber: this.shopNumber, planName: this.ruleForm.planName, items: [{ deviceName: row.deviceName, templateNumber: row.checked, deviceId: row.deviceId.split(',')[0] }] };
      this.generateBill(generateObj);
    },
    //立即生成所有选中
    createCheckedNow (data) {
      console.log('data :', data);
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择需要生成的设备！',
          type: 'warning',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      let items = this.multipleSelection.map(row => {
        return { deviceName: row.deviceName, templateNumber: row.checked, deviceId: row.deviceId.split(',')[0] }
      })
      let generateObj = { shopNumber: this.shopNumber, planName: this.ruleForm.planName, items: items };
      this.generateBill(generateObj);
    },
    //生成工单
    generateBill (generateObj) {
      if (this.ruleForm.planName == '' || this.ruleForm.planName.trim() == '') {
        this.$message({
          message: '计划名称不能为空',
          type: 'error',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      if (this.isEdit) {
        generateObj.planId = this.id;
      }
      if (this.ruleForm.taskTimeLength > 0) {
        generateObj.taskTimeLength = this.ruleForm.taskTimeLength;
      }
      // let that = this;
      beforeGenerateCheckBill(generateObj).then(res => {
        return res;
      }).then(result => {
        if (result.code == 200 && result.msg != '') {
          this.$confirm(result.msg, '是否继续生成新工单', {
            cancelButtonText: '取 消',
            confirmButtonText: '确 定',
            dangerouslyUseHTMLString: true,
            customClass: 'generate',
            type: 'warning'
          }).then(() => {
            this.generateCheckBillFun(generateObj);
          });
        } else {
          this.generateCheckBillFun(generateObj);
        }
      })
    },
    //生成工单接口操作
    generateCheckBillFun (generateObj) {
      generateCheckBill(generateObj).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '生成成功！',
            type: 'success',
            duration: this.$baseConfig.messageDuration
          });
        }
      })
    },
    //复选框状态改变
    changeFun (val) {
      this.multipleSelection = val;
    },
    //提交选择的设备-选择设备后的回调
    submitSelectEqu (data) {
      // console.log('data :', data);
      this.showSelectEquWin = false;
      let devices = [];
      let deviceNames = [];
      this.selectEquIds = [];
      data.forEach(n => {
        devices.push(n.id);
        deviceNames.push(n.name);
      })
      this.ruleForm.checkEqus = deviceNames.join(',');
      this.curDeviceIds = devices;
      getTemplateByDevice({ shopNumber: this.shopNumber, cycleTimeStr: this.ruleForm.cycleTime, devices: devices }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.array.map(m => {
            if (m.templateList.length >= 1) {
              m.checked = m.templateList[0].value; //默然选择第一项
            }
            return m;
          });
          console.log('this.tableData2:', this.tableData, this.curDeviceIds);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.create-time {
  width: 260px;
}
/deep/ .el-textarea__inner {
  cursor: pointer;
}
.template {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .info {
    font-size: 20px;
    cursor: pointer;
    margin-left: 4px;
  }
}
</style>
<style lang="scss">
.generate {
  .el-message-box__message {
    max-height: 320px;
    overflow-y: auto;
  }
}
.first-time {
  .el-button--text {
    display: none;
  }
}
</style>
