<template>
  <div class="param-detail">
    <div class="row-head">基本信息</div>
    <el-row>
      <el-col :span="4">设备类型：</el-col>
      <el-col :span="20">{{ruleForm.deviceTypeStr}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">保养参数：</el-col>
      <el-col :span="20">{{ruleForm.paraName}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">保养方法：</el-col>
      <el-col :span="20">{{ruleForm.maintainMethod}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">风险评估：</el-col>
      <el-col :span="8">{{ruleForm.riskAssessStr}}</el-col>
      <el-col :span="4">输入类型：</el-col>
      <el-col :span="8">{{ruleForm.inputTypeStr}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">标准值：</el-col>
      <el-col :span="20">{{ruleForm.standardValue}}</el-col>
    </el-row>
    <el-row v-if="ruleForm.inputType==0||ruleForm.inputType==2">
      <el-col :span="4">单位：</el-col>
      <el-col :span="8">{{ruleForm.unitStr}}</el-col>
      <el-col :span="4">风险判断：</el-col>
      <el-col :span="8">{{ruleForm.riskJudgeStr}}</el-col>
    </el-row>
    <div v-if="ruleForm.riskAssess!=2">
      <div class="row-head">现场信息</div>
      <table class="table">
        <tbody v-if="ruleForm.inputType==0||ruleForm.inputType==2">
          <tr>
            <td class="key">正常</td>
            <td>最大值</td>
            <td>{{ruleForm.normalMax}}</td>
            <td>最小值</td>
            <td>{{ruleForm.normalMin}}</td>
          </tr>
          <tr>
            <td class="key">低风险</td>
            <td>最大值</td>
            <td>{{ruleForm.lowMax}}</td>
            <td>最小值</td>
            <td>{{ruleForm.lowMin}}</td>
          </tr>
          <tr>
            <td class="key">中风险</td>
            <td>最大值</td>
            <td>{{ruleForm.middleMax}}</td>
            <td>最小值</td>
            <td>{{ruleForm.middleMin}}</td>
          </tr>
          <tr>
            <td class="key">高风险</td>
            <td>最大值</td>
            <td>{{ruleForm.highMax}}</td>
            <td>最小值</td>
            <td>{{ruleForm.highMin}}</td>
          </tr>
        </tbody>
        <tr v-if="ruleForm.inputType==1||ruleForm.inputType==3">
          <td class="key">正常</td>
          <td>{{ruleForm.normalText}}</td>
        </tr>
        <tr v-if="ruleForm.inputType==1">
          <td class="key">非正常</td>
          <td>{{ruleForm.abnormalText}}</td>
        </tr>
        <template v-if="ruleForm.inputType==3">
          <tr>
            <td class="key">低风险</td>
            <td>{{ruleForm.lowText}}</td>
          </tr>
          <tr>
            <td class="key">中风险</td>
            <td>{{ruleForm.middleText}}</td>
          </tr>
          <tr>
            <td class="key">高风险</td>
            <td>{{ruleForm.highText}}</td>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
import { getMaintainStandardInfo } from '@/services/operation.js';
export default {
  props: ['id'],
  data () {
    return {
      ruleForm: {
        deviceSysTypeStr: '', //设备类型
        paraName: '',//保养参数
        maintainMethod: '',//保养方法
        riskJudge: 0,//风险判断
        inputType: 0,//输入类型
        unit: '',//单位ID
        riskAssess: 0,//风险评估
        standardValue: '',//标准值
        normalMax: '',//正常最大值
        normalMin: '', //正常最小值
        lowMax: '', //低风险最大值
        lowMin: '',//低风险最小值
        middleMax: '', //中风险最大值
        middleMin: '', //中风险最小值
        highMax: '', //高风险最大值
        highMin: '',//高风险最小值
        //文本量
        normalText: '', //正常描述文本
        abnormalText: '',//非正常描述文本
        lowText: '',//低风险描述文本
        middleText: '', //中风险描述文本
        highText: '', //高风险描述文本
      },
    }
  },
  created () {
    getMaintainStandardInfo(this.id).then(res => {
      if (res.code == '200') {
        this.ruleForm = res.data;
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/param-detail.scss';
</style>