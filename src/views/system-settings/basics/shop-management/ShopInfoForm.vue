<template>
  <div class="shop-info-form" v-loading="loading">
    <header class="title">
      <span>门店信息</span>
    </header>
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      class="form-bar"
      label-position="right"
      label-width="90px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店名称" prop="shopName">
            <el-input v-model.trim="form.shopName" placeholder="门店名称" :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店编号" prop="shopNumber">
            <el-input v-model.trim="form.shopNumber" placeholder="门店编号" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店类型" prop="shopType" :required="true">
            <el-select v-model="form.shopType" placeholder="门店类型">
              <el-option
                v-for="(item,index) in shopTypeList"
                :key="index"
                :label="item.configName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店面积" prop="area">
            <el-input v-model.trim="form.area" placeholder="门店面积" maxlength="8">
              <span slot="suffix">
                m
                <sup>2</sup>
              </span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-margin">
        <el-col :span="12">
          <el-form-item label="所属区域" prop="regionn" class="area-selector" :required="true">
            <el-row>
              <el-col :span="8">
                <el-select
                  v-model="form.regiona"
                  placeholder="大区"
                  @clear="clearCity('regionp')"
                  @change="getCityList(form.regiona, 'regionp')"
                  clearable
                >
                  <el-option
                    v-for="(item,index) in regionaList"
                    :key="index"
                    :label="item.cityName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="form.regionp"
                  placeholder="省"
                  @clear="clearCity('regionn')"
                  @change="getCityList(form.regionp, 'regionn')"
                  clearable
                >
                  <el-option
                    v-for="(item,index) in regionpList"
                    :key="index"
                    :label="item.cityName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="form.regionn" placeholder="市" @change="getCityList()" clearable>
                  <el-option
                    v-for="(item,index) in regionnList"
                    :key="index"
                    :label="item.cityName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店地址" prop="addressDetail">
            <PositionInput
              v-if="areaInitFlag"
              v-model="form.addressDetail"
              @pointChange="pointChange"
              :areaName="areaName"
              placeholder="门店地址"
            ></PositionInput>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经纬度" prop="lonlat">
            <el-input
              v-model.trim="form.lonlat"
              placeholder="经纬度(可通过右侧图标跳转百度坐标拾取系统获取)"
              maxlength="32"
            >
              <i
                slot="suffix"
                title="坐标拾取系统"
                @click.stop="toBMap"
                class="el-icon-location"
                style="cursor:pointer;color: sky-blue;"
              ></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leadingPerson">
            <el-input v-model.trim="form.leadingPerson" placeholder="负责人" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人电话" prop="leadingPhone">
            <el-input v-model.trim="form.leadingPhone" placeholder="负责人电话" maxlength="13"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物业单位" prop="propertyCompany">
            <el-input v-model.trim="form.propertyCompany" placeholder="物业单位" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物业人数" prop="propertyPersonNum">
            <el-input v-model.trim="form.propertyPersonNum" placeholder="物业人数" maxlength="8">
              <span slot="suffix">人</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物业负责人" prop="propertyLeadingPerson">
            <el-input v-model.trim="form.propertyLeadingPerson" placeholder="物业负责人" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="propertyLeadingPhone">
            <el-input v-model.trim="form.propertyLeadingPhone" placeholder="联系电话" maxlength="13"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-button @click="$common.throttle(submit)()" type="primary">保 存</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import PositionInput from '@/components/form/PositionInput.vue'
import { shopGetInfo, shopEdit, configTypeQuery, cityListQuery } from '@/services/system-settings.js'
import axios from '@/axios/axios.js'
import Axios from 'axios'
import Regexps from '@/utils/regexp.js'
import { validateTel, validatelonlat } from '@/utils/validate-utils.js'
export default {
  name: 'shop-info-form',
  components: { PositionInput },
  data () {
    return {
      loading: true,
      shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber,
      shopTypeList: [],
      areaInitFlag: false, // 地区列表是否初始化标志位
      form: {
        id: '',
        shopName: '',
        shopNumber: '',
        shopType: '',
        area: '',
        regiona: '',
        regionp: '',
        regionn: '',
        addressDetail: '',
        longitude: '',
        latitude: '',
        lonlat: '',
        leadingPerson: '',
        leadingPhone: '',
        propertyCompany: '',
        propertyPersonNum: '',
        propertyLeadingPerson: '',
        propertyLeadingPhone: ''
      },
      formRules: {
        shopName: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 16, message: '16个字符以内', trriger: 'blur' }
        ],
        shopNumber: [{ required: true, message: '必填', trigger: 'blur' }],
        shopType: [{ requierd: true, type: 'number', message: '必选', trigger: 'change' }],
        area: [{ required: true, pattern: Regexps.positiveInteger0, message: '必填（自然数）', trigger: 'blur' }],
        regionn: [{ requierd: true, type: 'number', message: '必选', trigger: 'change' }],
        addressDetail: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 128, message: '128字符以内', trigger: 'blur' }
        ],
        lonlat: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: this.validatelonlat, trigger: 'blur' }
        ],
        leadingPhone: [{ required: false, validator: this.validateTel, trigger: 'blur' }],
        propertyCompany: [{ max: 20, message: '物业单位请限制在20字符以内', trigger: 'blur' }],
        propertyPersonNum: [{ pattern: Regexps.positiveInteger0, message: '只能是自然数', trigger: 'blur' }],
        propertyLeadingPhone: [{ required: false, validator: this.validateTel, trigger: 'blur' }]
      },
      regionaList: [],
      regionpList: [],
      regionnList: [],
    }
  },

  created () {
    this.initData()
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.form && this.$refs.form.clearValidate('regionn')
    })
  },
  computed: {
    areaName () {
      let areaName = '中国'
      if (this.form.regionn) {
        for (let index = 0, len = this.regionnList.length; index < len; index++) {
          if (this.form.regionn === this.regionnList[index].id) {
            areaName = this.regionnList[index].cityName
            break;
          }
        }
      } else if (this.form.regionp) {
        for (let index = 0, len = this.regionpList.length; index < len; index++) {
          if (this.form.regionp === this.regionpList[index].id) {
            areaName = this.regionpList[index].cityName
            break;
          }
        }
      }
      return areaName
    }
  },
  methods: {
    validatelonlat,
    validateTel,
    shopGetInfo,
    shopEdit,
    configTypeQuery,
    cityListQuery,
    initData () { // 初始化
      const configType = 56
      const shopNumber = this.shopNumber
      const chinaAreaId = 100000
      this.areaInitFlag = false
      this.loading = true
      axios.all([
        this.configTypeQuery({ // 查询全局系统-门店类型
          configType
        }),
        this.shopGetInfo({
          shopNumber
        }),
        this.cityListQuery({
          areaId: chinaAreaId
        })
      ]).then(axios.spread((shopTypeRes, shopInfoRes, cityListRes) => {
        // shopType 初始化门店类型说几句
        this.shopTypeList = shopTypeRes.data[configType]
        // shopInfo 初始化门店数据
        Object.keys(this.form).forEach(key => {
          this.form[key] = shopInfoRes.data[key]
        }, this)
        this.form.lonlat = this.form['longitude'] ? `${this.form['longitude']},${this.form['latitude']}` : ''
        this.areaInitFlag = true
        // 初始化二三级地区列表
        this.form.regiona && this.getCityList(this.form.regiona, 'regionp', true)
        this.form.regionp && this.getCityList(this.form.regionp, 'regionn', true)
        // cityList 初始化一级地区列表
        this.regionaList = (cityListRes.data || {}).array
        this.loading = false
      })).catch(_ => {
        this.loading = false
        console.error('门店详情信息初始化失败(errorMessage):', _);
      })
    },
    clearCity (type) { // 清空城市列表
      if (!type) return
      if (type === 'regionp') {
        this.form.regionp = this.form.regionn = ''
        this.regionpList = []
        this.regionnList = []
      } else if (type === 'regionn') {
        this.form.regionn = ''
        this.regionnList = []
      }
    },
    getCityList (id, clearCityProp, isInit = false) { // 获取城市列表 并在非初始化情况下清空下级城市数据及城市列表
      if (!id || !this.areaInitFlag) return
      this.cityListQuery({
        areaId: id
      }).then(res => {
        this[`${clearCityProp}List`] = (res.data || {}).array || []
        if (!isInit) {
          this.form[clearCityProp] = ''
          if (clearCityProp === 'regionp') {
            this.form['regionn'] = ''
            this['regionnList'] = []
          }
        }
      })
    },
    pointChange (point) {
      this.form.lonlat = Object.values(point).join(',')
    },
    toBMap () {
      window.open('http://api.map.baidu.com/lbsapi/getpoint/index.html')
    },
    submit () {
      let result = true
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return
      let lonlatArr = this.form.lonlat.split(',')
      this.form.longitude = lonlatArr[0]
      this.form.latitude = lonlatArr[1]
      this.loading = true;
      this.shopEdit(this.form).then(res => {
        this.loading = false
        this.$message.success('保存成功！')
        console.log('this.form.shopName :', this.form.shopName);
        this.$store.commit('base/updateCurShopName', this.form.shopName);
      }).catch(_ => {
        this.loading = false
        console.error('保存门店信息失败(errorMessage)：', _);
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.shop-info-form {
  header.title {
    font-size: 16px;
  }
  .row-margin {
    margin-bottom: 3px;
  }
  .form-bar {
    max-width: 1500px;
    padding-top: 15px;
    padding-left: 10px;
    /deep/ .el-form-item__content {
      width: 390px;
      .el-select {
        width: 100%;
      }
    }
    .area-selector {
      /deep/ .el-form-item__content {
        width: auto;
      }
    }
    .text-right {
      text-align: right;
      padding-right: 20px;
    }
  }
  // /deep/ .el-form-item.is-required > .el-form-item__label:before {
  //   content: "";
  // }
}
</style>
