<template>
  <div class="add-plan">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划名称" prop="planName">
            <el-input v-model.trim="ruleForm.planName" placeholder="计划名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl10">
          <el-form-item label="保养周期" prop="cycleTime">
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
      <el-form-item label="保养设备" class="form-item-textarea" prop="checkEqus">
        <el-input
          @focus="showSelectEquWin=true"
          type="textarea"
          v-model="ruleForm.checkEqus"
          placeholder="保养设备"
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
          <el-form-item label="位置" prop="address">
            <el-input v-model="ruleForm.address" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务时长" prop="taskTimeLength">
            <el-input v-model="ruleForm.taskTimeLength" clearable :placeholder="cycleTimeLabel">
              <template slot="append" v-if="ruleForm.taskTimeLength">天</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl10">
          <el-form-item label="任务生成规则" prop="taskCreateRule">
            <el-radio-group v-model="ruleForm.taskCreateRule">
              <el-radio :label="0">按设备生成</el-radio>
              <el-radio :label="1">按计划打包</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl10" style="line-height: 26px;">
          <el-button
            :disabled="ruleForm.status==1"
            type="primary"
            @click="previewTime('ruleForm')"
            size="mini"
          >预览保养时间</el-button>
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
            <span class="u-link" type="primary" @click="lookMaintainPlan(scope.row)">查看已设计划</span>
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
      <div style="display: inline-block;margin-left: 80px;">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
      <div class="fr del-btn">
        <el-button v-if="isEdit" type="danger" plain @click="delPlan()">删 除</el-button>
      </div>
    </div>
    <!-- 预览保养时间 -->
    <el-dialog
      v-dialogDrag
      title="预览保养时间"
      append-to-body
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showPreviewPlan"
      width="560px"
    >
      <div class="datatable-box">
        <el-table border :data="planPreviewList" style="width: 100%" height="300px">
          <el-table-column label="任务时长" align="center">
            <template slot-scope="scope">
              <div class="plan-item">
                <span>{{scope.row.startTime|timeFormat('YYYY-MM-DD')}}</span>
                <span>至</span>
                <span>{{scope.row.endTime|timeFormat('YYYY-MM-DD')}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope">
              <span :class="{forbidden:scope.row.status==1}">{{scope.row.status==0?'启用':'禁用'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="ctrlDisabled(scope.$index,scope.row)"
              >{{scope.row.status==0?'禁用':'启用'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer mt0">
        <div style="display: inline-block">
          <el-button @click="showPreviewPlan=false">关 闭</el-button>
        </div>
      </div>
    </el-dialog>
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
    <!-- 查看保养计划 -->
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
      <maintain-plan-list
        v-if="showCheckPlanWin"
        @onHide="showCheckPlanWin=false"
        :deviceIdAndType="deviceIdAndType"
      ></maintain-plan-list>
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
import {  getMaintainCycleSelected, getMaintainTemplateByDevice, getMaintainPlanInfo, generateMaintainBill,
  beforeGenerateMaintainBill, previewMaintainPlan, getMaintainEditPreView, delMaintainPlan} from '@/services/operation.js';
import SelectEqu from './SelectEqu';
import MaintainPlanList from './MaintainPlanList';
import TemplateDetail from '../template/TemplateDetail';
import { MaintainCycleEnum } from '@/enum/operation-enum.js';
import Regexps from '@/utils/regexp.js';
import datetimeUtils from '@/utils/datetime-utils.js';

export default {
  components: {
    SelectEqu,
    MaintainPlanList,
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
  data () {
    let checktaskTimeLength = (rule, value, callback) => {
      if (value == '') {
        callback();
      }
      else if (!Regexps.positiveInteger.test(value)) {
        return callback(new Error('任务时长必须是正整数'))
      }
      else if (value <= this.taskTimeLengthMaxVal) {
        callback();
      } else {
        callback(new Error('任务时长不能大于' + this.taskTimeLengthMaxVal));
      }
    };
    return {
      defaultTime: datetimeUtils.getTimeNextTime(new Date(), 5), //任务生成规则-默认时间
      taskTimeLengthMaxVal: 1,
      CheckCycleOptions: [],
      cycleTimeOptions: [],
      ruleForm: { cycleTime: '', planName: '', checkEqus: '', firstCreateTime: '', taskCreateRule: 0, status: 0, taskTimeLength: '', address: '' },
      rules: {
        planName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' },
          { max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }
        ],
        cycleTime: [
          { required: true, message: '请选择保养周期', trigger: 'blur' },
        ],
        checkEqus: [
          { required: true, message: '请选择保养设备', trigger: 'change' },
        ],
        firstCreateTime: [
          { required: true, message: '请选择初次生成时间', trigger: 'blur' },
        ],
        taskTimeLength: [
          { validator: checktaskTimeLength, trigger: 'blur' }
        ],
        address: [
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
        ],
        firstCreateTime: [
          { required: true, message: '请选择初次生成时间', trigger: 'blur' },
        ]
      },
      multipleSelection: [],
      tableData: [],
      showSelectEquWin: false,
      showCheckPlanWin: false,
      cycleTimeLength: '',//周期时长
      cycleTimeType: '',//周期类型
      cycleTimeLabel: '',//周期名称
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
      planPreviewList: [],//计划预览列表
      showPreviewPlan: false,//显示预览保养时间
    }
  },
  created () {
    this.initData();
  },
  computed: {
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
    //查看保养计划标题
    checkPlanTitle () {
      return this.deviceName + '保养计划';
    }
  },
  watch: {
    //初次生成时间
    'ruleForm.firstCreateTime': function (val) {
      this.planPreviewList = [];
    },
    //任务时长
    'ruleForm.taskTimeLength': function (val) {
      this.planPreviewList = [];
    },
  },
  methods: {
    //任务时长最大值
    getTaskTimeLengthMaxVal () {
      let type = this.cycleTimeType;
      let length = this.cycleTimeLength || 1;
      let baseVal = 1;

      switch (type) {
        case MaintainCycleEnum.day:
          baseVal = 1;
          break;
        case MaintainCycleEnum.week:
          baseVal = 7;
          break;
        case MaintainCycleEnum.halfMonth:
          baseVal = 15;
          break;
        case MaintainCycleEnum.month:
          baseVal = 30;
          break;
        case MaintainCycleEnum.quarter:
          baseVal = 90;
          break;
        case MaintainCycleEnum.halfYear:
          baseVal = 180;
          break;
        case MaintainCycleEnum.year:
          baseVal = 365;
          break;
        default:
          break;
      }
      return length * baseVal;
    },
    initData () {
      //获取保养周期下拉框数据
      getMaintainCycleSelected(this.shopNumber).then(res => {
        if (res.code == 200) {
          this.CheckCycleOptions = res.data.array;
          if (res.data.array.length > 0) {
            if (!this.isEdit) {
              this.ruleForm.cycleTime = res.data.array[0].value;
              this.cycleTimeLabel = res.data.array[0].label;
              let val = this.ruleForm.cycleTime;
              this.cycleTimeType = val.charAt(val.length - 1);
              this.cycleTimeLength = parseInt(val.substring(0, val.length - 1));
            }
            this.taskTimeLengthMaxVal = this.getTaskTimeLengthMaxVal();
          }
        }
      });
      //如果是编辑，先获取保养计划信息
      if (this.isEdit) {
        getMaintainPlanInfo(this.id).then(res => {
          if (res.code == 200 && res.data) {
            this.ruleForm.planName = res.data.planName;
            this.ruleForm.cycleTime = res.data.cycleTimeStr;
            this.cycleTimeLength = res.data.cycleTimeLength;
            this.cycleTimeType = res.data.cycleTimeType;
            this.cycleTimeLabel = this.CheckCycleOptions.find(n => { return n.value == this.ruleForm.cycleTime }).label;
            this.ruleForm.checkEqus = res.data.deviceNames;
            this.ruleForm.firstCreateTime = res.data.firstTime;
            if (res.data.taskTimeLength) {
              this.ruleForm.taskTimeLength = res.data.taskTimeLength;
            }
            this.ruleForm.taskCreateRule = res.data.rule;
            this.ruleForm.status = res.data.status;
            this.curDeviceIds = res.data.devices;
            this.tableData = res.data.templateList;
            this.ruleForm.address = res.data.address;
            this.taskTimeLengthMaxVal = this.getTaskTimeLengthMaxVal();
          }
        })
      }
    },
    //保养周期改变时
    cycleTimeChange (val) {
      //数据清空
      this.ruleForm.checkEqus = '';
      this.curDeviceIds = [];
      this.tableData = [];
      if (val) {
        this.cycleTimeType = val.charAt(val.length - 1);
        this.cycleTimeLength = parseInt(val.substring(0, val.length - 1));
        this.cycleTimeLabel = this.CheckCycleOptions.find(n => { return n.value == val }).label;
        console.log('object :', val, this.cycleTimeLabel);

        this.taskTimeLengthMaxVal = this.getTaskTimeLengthMaxVal();
      }
      this.planPreviewList = []; //有变化时，重新计算预览计划
    },
    //确定
    submitForm (formName) {
      var that = this;

      let val = this.ruleForm.cycleTime;
      this.cycleTimeType = val.charAt(val.length - 1);
      this.cycleTimeLength = parseInt(val.substring(0, val.length - 1));
      that.$refs[formName].validate(valid => {
        if (valid) {
          console.log('验证成功');
          this.tableData.forEach(n => {
            this.selectEquIds.push(n.checked ? n.deviceId + ',' + n.checked : n.deviceId);
          })
          console.log('this.selectEquIds :', this.selectEquIds);
          if (this.isEdit) {
            that.submitFormFuc(that.ruleForm.firstCreateTime)
          } else {
            let firstCreateTime = that.ruleForm.firstCreateTime;
            if (firstCreateTime.getTime() < new Date().getTime()) {
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
      let saveObj = {
        shopNumber: this.shopNumber, planName: this.ruleForm.planName, cycleTimeLength: this.cycleTimeLength,
        cycleTimeType: this.cycleTimeType, firstTime: dt, rule: this.ruleForm.taskCreateRule,
        status: this.ruleForm.status, devices: this.selectEquIds,
        address: this.ruleForm.address
      };
      if (this.ruleForm.taskTimeLength > 0) {//周期不为时，并且任务时长有值
        saveObj.taskTimeLength = this.ruleForm.taskTimeLength;
      }
      if (this.isEdit) {
        saveObj.preViews = this.planPreviewList || [];
      } else { //新增，只传禁用的数据列表
        saveObj.preViews = this.planPreviewList.filter(n => { return n.status == 1 }) || [];
      }
      console.log('saveObj :', saveObj);
      this.$emit('submitForm', saveObj);
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
    //查看保养计划
    lookMaintainPlan (row) {
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
      console.log('templateObj :', templateObj);
      let label = templateObj ? templateObj.label : '';
      if (!templateObj && row.templateList.length > 0) {
        label = row.templateList[0].label;
      }
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
      beforeGenerateMaintainBill(generateObj).then(res => {
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
      generateMaintainBill(generateObj).then(res => {
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
      getMaintainTemplateByDevice({ shopNumber: this.shopNumber, cycleTimeStr: this.ruleForm.cycleTime, devices: devices }).then(res => {
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
    },
    //预览保养时间
    previewTime (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.showPreviewPlan = true;
          if (this.planPreviewList.length > 0) {
            return;
          }
          let obj = { cycleTimeLength: this.cycleTimeLength, cycleTimeType: this.cycleTimeType, firstTime: this.ruleForm.firstCreateTime };
          if (this.ruleForm.taskTimeLength) {
            obj.taskTimeLength = this.ruleForm.taskTimeLength;
          }
          if (this.isEdit) {
            getMaintainEditPreView({ planId: this.id, taskCycleTimeLength: this.ruleForm.taskTimeLength }).then(res => {
              if (res.code == 200) {
                this.planPreviewList = res.data.array;
              }
            })
          } else {
            previewMaintainPlan(obj).then(res => {
              if (res.code == 200) {
                this.planPreviewList = res.data.array;
              }
            })
          }
        }
      });
    },
    //控制禁用启用
    ctrlDisabled (index, row) {
      if (row.status == 0) {
        row.status = 1;
      } else {
        row.status = 0;
      }
      this.$set(this.planPreviewList, index, row);
      // this.$forceUpdate();
    },
    //删除计划
    delPlan () {
      this.$confirm('确认删除计划吗?', '删除', {
        cancelButtonText: '取 消',
        confirmButtonText: '确 定',
        type: 'warning'
      }).then(() => {
        delMaintainPlan(this.id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除计划成功！',
              type: 'success',
              duration: this.$baseConfig.messageDuration
            });
            this.$emit("refreshList")
          }
        })
      });
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
.plan-item {
  span {
    padding: 0px 8px;
  }
  button {
    margin: 0px 8px;
  }
}
.del-btn {
  padding-right: 5px;
}
.forbidden {
  color: red;
}
.first-time {
  .el-button--text {
    display: none;
  }
}
</style>
