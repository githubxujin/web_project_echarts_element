<template>
  <div class="user-editor">
    <el-form label-width="90px" size="mini" inline :label-position="'right'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备编号：">{{details.deviceNumber}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店名称：">{{shopName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称：">{{details.deviceName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产编号：">{{details.accountNumber}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设备类型：">{{details.deviceTypeStr}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备品牌：">{{details.brand}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="安装位置：">{{details.installAddress}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装时间：">{{details.installTimeStr}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="产权归属：">{{details.orgIdStr}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格型号：">{{details.deviceModel}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="生产厂家：">{{details.factoryName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备状态：">
            <span v-html="details.deviceStatus==0?'使用中':(details.deviceStatus==1?'维修中':'已报废')"></span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="单位：">{{details.unitIdStr}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂时间：">{{details.makTimeStr}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="投入时间：">{{details.useTimeStr}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拆旧时间：">{{details.depreciationYear}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="保修期：">{{details.safeTime}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对应支路：">{{details.meterIdStr}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="使用部门：">{{details.useOrgIdStr}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否特种设备：">
            <span v-html="details.special?'否':'是'"></span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设备图片：">
            <img :src="details.imgUrlStr" alt />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用：">
            <span v-html="details.status?'否':'是'"></span>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-show="paramData!=null">
        <el-row style="color:#000;">技术参数</el-row>
        <el-row>
          <el-col :span="12" v-for="(item,key) in paramData" :key="key">
            <el-form-item :label="item+':'">{{details[key]}}</el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getParamsField } from '@/services/assets';
export default {
  props: {
    details: Object
  },
  data () {
    return {
      paramData: null
    }
  },
  computed: {
    shopName () {
      // console.log('门店信息', this.$store.getters.getUserInfo)
      return this.$store.getters.getUserInfo.shopName
    }
  },
  methods: {
    close () {
      this.$emit('update:dialogVisible', false);
    },
    getParamsField (deviceType) {
      getParamsField(deviceType).then(res => {
        if (res.code == 200) {
          this.paramData = JSON.stringify(res.data) == "{}" ? null : res.data
        } else {
          this.paramData = null
        }
      });
    },
  },
  watch: {
    details: {
      handler: function (val, oldval) {
        if (val.deviceType) {
          this.getParamsField(val.deviceType);
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.user-editor {
  .text-center {
    text-align: center;
  }
  img {
    width: 50px;
    height: 50px;
  }
  /deep/ .el-form-item__label {
    width: 98px !important;
  }
}
</style>
<style lang="scss" scoped>
/deep/ .el-textarea {
  width: 550px;
}
</style>

