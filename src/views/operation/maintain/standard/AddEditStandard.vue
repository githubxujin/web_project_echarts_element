<template>
  <div v-loading="dialogLoading">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <div class="row-head">基本信息</div>
      <el-form-item label="设备类型" prop="deviceTypeIdAndTopId">
        <tree-select
          v-model="ruleForm.deviceTypeIdAndTopId"
          placeholder="请选择"
          :clearable="true"
          :data="treeData"
          :defaultProps="defaultProps"
          :onlyLeafSelect="true"
        ></tree-select>
      </el-form-item>
      <el-form-item label="保养参数" prop="paraName">
        <el-input v-model="ruleForm.paraName" placeholder="保养参数"></el-input>
      </el-form-item>
      <el-form-item label="保养方法" prop="maintainMethod">
        <el-input type="textarea" v-model="ruleForm.maintainMethod" placeholder="保养方法"></el-input>
      </el-form-item>
      <el-form-item label="风险评估">
        <el-radio-group v-model="ruleForm.riskAssess">
          <el-radio
            :label="RiskJudge.Auto"
            :disabled="ruleForm.inputType==1||ruleForm.inputType==3"
          >自动</el-radio>
          <el-radio :label="RiskJudge.Man">人工</el-radio>
          <el-radio :label="RiskJudge.None" :disabled="ruleForm.inputType==1">不评估</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="输入类型" prop="inputType">
        <el-select v-model="ruleForm.inputType" placeholder="请选输入类型">
          <el-option
            v-for="(item,index) in inputTypeOptions"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.inputType!=0" label="标准值" prop="standardValue">
        <el-input v-model="ruleForm.standardValue"></el-input>
      </el-form-item>
      <el-row v-if="ruleForm.inputType==0||ruleForm.inputType==2">
        <el-col :span="12">
          <el-form-item label="单位">
            <el-select v-model="ruleForm.unit">
              <el-option
                v-for="(item,index) in unitTypeOptions"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl15">
          <el-form-item label="风险判断">
            <el-select v-model="ruleForm.riskJudge">
              <el-option
                v-for="(item,index) in judgeTypeOptions"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="ruleForm.riskAssess!=2">
        <div class="row-head">现场信息</div>
        <div v-if="ruleForm.inputType==0||ruleForm.inputType==2">
          <el-row>
            <el-col :span="4">正常</el-col>
            <el-col :span="10">
              <el-form-item label="最大值" prop="normalMax">
                <el-input v-model="ruleForm.normalMax"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="pl15">
              <el-form-item label="最小值" prop="normalMin">
                <el-input v-model="ruleForm.normalMin"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">低风险</el-col>
            <el-col :span="10">
              <el-form-item label="最大值" prop="lowMax">
                <el-input v-model="ruleForm.lowMax "></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="pl15">
              <el-form-item label="最小值" prop="lowMin">
                <el-input v-model="ruleForm.lowMin"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">中风险</el-col>
            <el-col :span="10">
              <el-form-item label="最大值" prop="middleMax">
                <el-input v-model="ruleForm.middleMax "></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="pl15">
              <el-form-item label="最小值" prop="middleMin">
                <el-input v-model="ruleForm.middleMin"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">高风险</el-col>
            <el-col :span="10">
              <el-form-item label="最大值" prop="highMax">
                <el-input v-model="ruleForm.highMax "></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="pl15">
              <el-form-item label="最小值" prop="highMin">
                <el-input v-model="ruleForm.highMin"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item
          v-if="ruleForm.inputType==1||ruleForm.inputType==3"
          label="正常"
          prop="normalText"
        >
          <el-input v-model="ruleForm.normalText"></el-input>
        </el-form-item>
        <el-form-item v-if="ruleForm.inputType==1" label="非正常" prop="abnormalText">
          <el-input v-model="ruleForm.abnormalText"></el-input>
        </el-form-item>
        <div v-if="ruleForm.inputType==3">
          <el-form-item label="低风险" prop="lowText">
            <el-input v-model="ruleForm.lowText "></el-input>
          </el-form-item>
          <el-form-item label="中风险" prop="middleText">
            <el-input v-model="ruleForm.middleText "></el-input>
          </el-form-item>
          <el-form-item label="高风险" prop="highText">
            <el-input v-model="ruleForm.highText"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import TreeSelect from '@/components/treeSelect';
import { getDeviceTypeTree, getUnit, getMaintainStandardInfo } from '@/services/operation';
import { validateIntOrNumber, validateNumberLess, validateNumberGreater, validateCompare, checkChartLength } from '@/utils/validate-utils.js';
import { standardOptions } from '@/utils/mixins/standardOptions.js';
export default {
  props: ['id'],
  components: {
    TreeSelect,
  },
  mixins: [standardOptions],
  data () {
    return {
      rules: {
        deviceTypeIdAndTopId: [
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        paraName: [
          { required: true, message: '请输入保养参数', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        maintainMethod: [
          { required: true, message: '请输入保养方法', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ],
        inputType: [
          { required: true, message: '请选择输入类型', trigger: 'blur' },
        ],
        standardValue: [
          { required: true, validator: this.validateStandard, trigger: 'blur' },
          { min: 1, max: 9, message: '长度在 1 到 9个字符', trigger: 'blur' }
        ],
        normalMax: [
          { required: true, message: '请输入最大值', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateNumberGreater(rule, value, callback, this.ruleForm.normalMin) }, trigger: 'blur' }
        ],
        normalMin: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateNumberLess(rule, value, callback, this.ruleForm.normalMax) }, trigger: 'blur' }
        ],
        lowMax: [
          { required: true, message: '请输入最大值', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateNumberGreater(rule, value, callback, this.ruleForm.lowMin) }, trigger: 'blur' }
        ],
        lowMin: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateNumberLess(rule, value, callback, this.ruleForm.lowMax) }, trigger: 'blur' }
        ],
        middleMax: [
          { required: true, message: '请输入最大值', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateNumberGreater(rule, value, callback, this.ruleForm.middleMin) }, trigger: 'blur' }
        ],
        middleMin: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateNumberLess(rule, value, callback, this.ruleForm.middleMax) }, trigger: 'blur' }
        ],
        highMax: [
          { required: true, message: '请输入最大值', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateNumberGreater(rule, value, callback, this.ruleForm.highMin) }, trigger: 'blur' }
        ],
        highMin: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateNumberLess(rule, value, callback, this.ruleForm.highMax) }, trigger: 'blur' }
        ],
        normalText: [
          { required: true, message: '请输入正常文本', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
          { validator: (rule, value, callback) => { return checkChartLength(rule, value, callback, 8, '正常文本') }, trigger: 'blur' }
        ],
        abnormalText: [
          { required: true, message: '请输入非正常文本', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
          { validator: (rule, value, callback) => { return validateCompare(rule, value, callback, this.ruleForm.normalText) }, trigger: 'blur' }
        ],
        lowText: [
          { required: true, message: '请输入低风险文本', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        middleText: [
          { required: true, message: '请输入中风险文本', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        highText: [
          { required: true, message: '请输入高风险文本', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
      },
    }
  },
  async created () {
    await this.initUnit();
    if (this.id) {
      await this.getDetail(this.id); // 后台获取数据
    }
    this.initDeviceTree();
    console.log('this.id', this.id)
  },
  watch: {
    'ruleForm.inputType': function (val) {
      if (val == 1) {//开关量
        this.ruleForm.riskJudge = 1;
        this.ruleForm.riskAssess = this.RiskJudge.Man;
      } else if (val == 3) { //文本量
        //如果当前选择的是自动，则自动选为人工
        if (this.ruleForm.riskAssess == this.RiskJudge.Auto) {
          this.ruleForm.riskAssess = this.RiskJudge.Man;
        }
        this.ruleForm.riskJudge = this.ruleForm.riskJudge == 0 ? 1 : this.ruleForm.riskJudge;
      }
    }
  },
  methods: {
    //根据id获取详情
    async getDetail (id) {
      this.dialogLoading = true;
      await getMaintainStandardInfo(id).then(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.ruleForm = res.data;
        }
        this.dialogLoading = false;
      }).catch(() => {
        this.dialogLoading = false;
      })
    },
    //初始化单位
    async initUnit () {
      await getUnit().then(res => {
        // console.log('res', res);
        if (res.code == 200) {
          this.unitTypeOptions = res.data.array;
          if (this.unitTypeOptions.length > 0) {
            this.ruleForm.unit = this.unitTypeOptions[0].id;
          }
        }
      })
    },
    //初始化设备树
    initDeviceTree () {
      getDeviceTypeTree().then(res => {
        console.log('res', res)
        if (res.data.array) {
          this.treeData = res.data.array;
        }
      })
    },
    //提交
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.validateOther()) {
            this.$emit("submitForm", this.ruleForm);
          } else {
            this.$message({
              message: '四个区间值不能交叉',
              type: 'error',
              duration: this.$baseConfig.messageDuration
            });
          }
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
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/private.scss';
</style>

