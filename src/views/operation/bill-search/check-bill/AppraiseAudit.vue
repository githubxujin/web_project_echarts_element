<template>
  <div class="audit">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="完工说明">{{result}}</el-form-item>
      <el-row v-if="overImgs&&overImgs.length>0">
        <el-col :span="4">
          <div>现场图片：</div>
        </el-col>
        <el-col :span="20">
          <viewer :images="overImgs" class="img-viewer">
            <!-- //一定要一个数组，否则报错 -->
            <img v-for="(img,index) in overImgs" :src="img.pictureUrl" :key="index" />
          </viewer>
        </el-col>
      </el-row>
      <el-form-item label="审核" prop="checkResult">
        <el-radio-group v-model="ruleForm.checkResult">
          <el-radio :label="0">通过</el-radio>
          <el-radio :label="1">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="ruleForm.checkResult==1" label="驳回原因" prop="rejectInfo">
        <el-input v-model="ruleForm.rejectInfo"></el-input>
      </el-form-item>
      <div v-else>
        <el-row>
          <el-col :span="4">
            <div>评分：</div>
          </el-col>
          <el-col :span="20">
            <div>
              <el-rate v-model="ruleForm.score" show-score text="['极差', '失望', '一般', '满意', '非常满意']"></el-rate>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="评价：" prop="appraiseInfo">
              <el-input v-model="ruleForm.appraiseInfo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="$common.throttle(submitForm)()" :loading="btnLoading">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCheckInfo } from '@/services/operation';
export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dialogLoading: false,
      overImgs: [],//完工图片
      result: '',//完工说明
      ruleForm: { rejectInfo: '', checkResult: 0, appraiseInfo: '', score: 0 },
      rules: {
        rejectInfo: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        checkResult: [
          { required: true, message: '请输入审核结果', trigger: 'blur' },
        ],
        appraiseInfo: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
    this.initData();
  },
  computed: {
    btnLoading: function () {
      return this.$store.getters.getBtnLoading;
    }
  },
  methods: {
    initData () {
      this.dialogLoading = true;
      getCheckInfo(this.id).then(res => {
        if (res.data) {
          this.result = res.data.result;
          this.overImgs = res.data.BillImages;
        }
        this.dialogLoading = false;
      }).catch(error => {
        this.dialogLoading = false;
      })
    },
    //提交
    submitForm () {
      if (this.ruleForm.checkResult == 0) { //通过
        this.$store.commit('base/updateBtnLoading', true);
        this.$emit("submitForm", this.ruleForm);
      } else { //驳回
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$store.commit('base/updateBtnLoading', true);
            this.$emit("submitForm", this.ruleForm);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
  }
}
</script>

<style lang="scss" scoped>
@import url('../../scss/private.scss');
/deep/ .el-rate {
  margin-left: 40px;
}
</style>