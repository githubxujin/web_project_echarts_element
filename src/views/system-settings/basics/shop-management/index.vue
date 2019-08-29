<template>
  <div class="shop-managenemt p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="门店管理" name="default">
          <section>
            <ShopInfoForm></ShopInfoForm>
          </section>
          <section class="section">
            <ShopPictureList></ShopPictureList>
          </section>
          <section class="section">
            <el-row>
              <el-col :span="8">
                <ElectricityPrice></ElectricityPrice>
              </el-col>
              <el-col :span="16">
                <DutyChart></DutyChart>
              </el-col>
            </el-row>
          </section>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import ShopInfoForm from './ShopInfoForm'
import ShopPictureList from './ShopPictureList'
import ElectricityPrice from './ElectricityPrice'
import DutyChart from './DutyChart'
export default {
  components: { ShopInfoForm, ShopPictureList, ElectricityPrice, DutyChart },
  data () {
    return {
      activeName: 'default',
      form: {
        shopName: '',
        shopNumber: '',
        shopType: '',
        area: '',
        regiona: '',
        regionp: '',
        regionn: '',
        addressDetail: '',
        leadingPerson: '',
        leadingPhone: '',
        propertyCompany: '',
        propertyPersonNum: '',
        propertyLeadingPerson: '',
        propertyLeadingPhone: ''
      }
    }
  },
  computed: {},
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList);
    }
  }
}
</script>
<style lang="scss" scoped>
.shop-managenemt {
  color: #333333;
  .search-bar {
    padding-top: 15px;
    .area-selector {
      /deep/ .el-select {
        width: 90px;
      }
    }
  }
}
</style>
