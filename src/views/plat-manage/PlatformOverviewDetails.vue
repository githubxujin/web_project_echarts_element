<template>
  <div class="user-editor">
    <el-form label-width="90px"
             size="mini"
             inline
             :label-position="'right'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店名称">
            {{details.shopName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店编号">
            {{details.shopNumber}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="主帐号">
            {{details.userName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码">******
            <!--{{details.password?'******':'******'}}-->
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="面积">
            {{details.area}}
              <a v-if="details.area">㎡</a>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店类型">
            {{details.shopTypeName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="所属区域">
            {{details.regionAName}} {{details.regionPName}} {{details.regionNName}}
          </el-form-item>
        </el-col>
      </el-row>

        <el-row>
            <el-col :span="24">
                <el-form-item label="详细地址">
                    {{details.addressDetail}}
                </el-form-item>
            </el-col>
        </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人">
            {{details.leadingPerson}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">
            {{details.leadingPhone}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="物业单位">
            {{details.propertyCompany}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物业人数">
            {{details.propertyPersonNum}}
              <a v-if="details.propertyPersonNum">人</a>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="物业负责人">
            {{details.propertyLeadingPerson}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人电话">
            {{details.propertyLeadingPhone}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="录入时间">
            {{details.createTime}}
          </el-form-item>
        </el-col>

      </el-row>

      <el-row class="text-center">
        <el-button round
                   size="mini"
                   @click="close">关闭</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { addSms, editSms } from '@/services/plat-manage';
import Regexps from '@/utils/regexp.js'

export default {
  props: {
    details: {}
  }, methods: {
    close () {
      this.$emit('update:dialogVisible', false);
    }
  }
}
</script>
<style lang="scss" scoped>
.user-editor {
  .text-center {
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
/deep/ .el-textarea {
  width: 550px;
}
</style>

