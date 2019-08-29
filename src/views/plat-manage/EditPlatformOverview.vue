<template>
  <div class="user-editor">
    <el-form
      v-loading="dialogLoading"
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="90px"
      size="mini"
      inline
      :label-position="'right'"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="shopName" label="门店名称">
            <el-input v-model="form.shopName" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="shopNumber" label="门店编号">
            <el-input
              v-model="form.shopNumber"
              :disabled="isEdit"
              placeholder="请输入"
              clearable
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="userName" label="帐号">
            <el-input
              v-model="form.userName"
              :disabled="isEdit"
              placeholder="请输入"
              clearable
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="password" v-if="!isEdit" label="密码">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入"
              clearable
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="shopTypeName" label="门店类型">
            <!--<el-input v-model="form.shopTypeName"-->
            <!--placeholder="请输入"-->
            <!--clearable-->
            <!--:maxlength="16"></el-input>-->

            <el-select v-model="form.shopTypeName" placeholder="请选择">
              <el-option
                v-for="item in shopoptions"
                :key="item.id"
                :label="item.configName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="area" label="面积">
            <el-input
              v-model="form.area"
              style=" width: 180px"
              placeholder="请输入"
              clearable
              :maxlength="16"
            ></el-input>㎡
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item prop="regionn" label="所属区域">
            <el-select
              v-model="form.regiona"
              style="width:80px"
              :clearable="true"
              placeholder="大区"
              @change="getAreaList(form.regiona, 'regionp')"
            >
              <el-option
                v-for="(item,index) in regionaList"
                :key="index"
                :label="item.cityName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-model="form.regionp"
              style="width:80px"
              placeholder="省"
              :clearable="true"
              @change="getAreaList(form.regionp, 'regionn')"
            >
              <el-option
                v-for="(item,index) in regionpList"
                :key="index"
                :label="item.cityName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select
              v-model="regionn"
              @change="getRegionn"
              style="width:80px"
              :clearable="true"
              placeholder="市"
            >
              <el-option
                v-for="(item,index) in regionnList"
                :key="index"
                :label="item.cityName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="门店地址" prop="addressDetail">
            <PositionInput
              v-model="form.addressDetail"
              @pointChange="pointChange"
              :areaName="areaName"
              placeholder="门店地址"
            ></PositionInput>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经纬度" prop="lonlat">
            <el-input v-model="form.lonlat" placeholder="经纬度(可通过右侧图标跳转百度坐标拾取系统获取)" maxlength="32">
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

      <!-- <el-row>
        <el-col :span="12">
          <el-form-item prop="longitude" label="经度">
            <el-input v-model="form.longitude" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="latitude" label="纬度">
            <el-input v-model="form.latitude" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>-->

      <el-row>
        <el-col :span="12">
          <el-form-item prop="leadingPerson" label="负责人">
            <el-input v-model="form.leadingPerson" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="leadingPhone" label="联系电话">
            <el-input v-model="form.leadingPhone" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="propertyCompany" label="物业单位">
            <el-input v-model="form.propertyCompany" placeholder="请输入" clearable :maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="propertyPersonNum" label="物业人数">
            <el-input
              v-model="form.propertyPersonNum"
              placeholder="请输入"
              style=" width: 180px"
              clearable
              :maxlength="9"
            ></el-input>人
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="propertyLeadingPerson" label="物业负责人">
            <el-input
              v-model="form.propertyLeadingPerson"
              placeholder="请输入"
              clearable
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="propertyLeadingPhone" label="负责人电话">
            <el-input
              v-model="form.propertyLeadingPhone"
              placeholder="请输入"
              clearable
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="status" label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="item in statusEnum"
                :label="item.value"
                :key="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="text-center">
        <el-button
          type="primary"
          round
          size="mini"
          @click="submit"
          :loading="submitLoading"
        >{{isEdit ? '确 定' : '新 增'}}</el-button>
        <el-button round size="mini" @click="close">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { addShop, editShop, getcityListQuery } from '@/services/plat-manage';
import PositionInput from '@/components/form/PositionInput.vue'
import Regexps from '@/utils/regexp.js'
import { configTypeQuery } from '@/services/system-settings.js'
import { statusEnum } from '@/enum/dicts.js'
import { validatelonlat } from '@/utils/validate-utils.js'
export default {
  components: { PositionInput },
  props: {
    editdialogVisible: Boolean,
    details: {}
  },
  data () {
    return {
      statusEnum,
      areaInitFlag: false, // 地区列表是否初始化标志位
      regionn: '',
      regionaList: [],
      regionpList: [],
      regionnList: [], shopoptions: [],
      isEdit: false,
      Regexps, // 正则集合
      dialogLoading: false, // 弹框loading
      submitLoading: false, // 提交按钮loading
      form: {
        shopName: '', regiona: null, regionp: null, regionn: null, status: null, lonlat: '', longitude: '',
        latitude: '',
      },
      formRules: { // 表单规则
        shopName: [
          // { required: true, message: '请输入门店名称', trigger: 'blur' },
          // { validator: this.testShopName, message: '禁止输入特殊符号', trigger: 'blur' }
          { required: true, message: '必填', trigger: 'blur' },
          { max: 16, message: '16个字符以内', trriger: 'blur' }
        ],
        shopNumber: [
          { required: true, message: '请输入门店编号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入帐号', trigger: 'blur' },
          { validator: this.accounts, message: '禁止输入特殊符号', trigger: 'blur' }
        ],
        addressDetail: [
          { required: false, message: '128字符以内', trigger: 'blur' },
          { max: 128, message: '128字符以内', trigger: 'blur' }
        ],
        lonlat: [
          { required: false, message: '必填', trigger: 'blur' },
          { validator: this.validatelonlat, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ], leadingPhone: [
          { required: false, message: '联系电话', trigger: 'blur' },
          { pattern: Regexps.mobilephone, message: '请输入正确的手机或座机号码', trigger: 'blur' }
        ],
        propertyLeadingPhone: [
          { required: false, message: '请输入负责人电话', trigger: 'blur' },
          { pattern: Regexps.mobilephone, message: '请输入正确的手机或座机号码', trigger: 'blur' }
        ], propertyPersonNum: [
          { required: false, message: '请输入物业人数', trigger: 'blur' },
          { pattern: Regexps.positiveInteger0, message: '人数必须为正整数', trigger: 'blur' }
        ],
        area: [
          { required: false, message: '请输入面积', trigger: 'blur' },
          { pattern: Regexps.positiveInteger0, message: '面积必须为正整数', trigger: 'blur' }
        ]
        ,
        longitude: [
          { required: false, message: '请输入经度', trigger: 'blur' },
          { pattern: Regexps.longitude, message: '经度必须为正整数或小数', trigger: 'blur' }
        ]
        ,
        latitude: [
          { required: false, message: '纬度', trigger: 'blur' },
          { pattern: Regexps.latitude, message: '纬度必须为正整数或小数', trigger: 'blur' }
        ], regionn: [
          { required: true, message: '请选择完整区域信息', trigger: 'blur' },
          { validator: this.testRegionn, message: '区域信息必选项', trigger: 'blur' }
        ]
      }
    }
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
  mounted () {
    this.form = this.details;
    console.log(this.details)
    this.isEdit = false;
    if (this.form && this.form.hasOwnProperty("id")) {
      this.regionn = this.form.regionn;
      if (this.form.longitude) {
        this.$set(this.form, 'lonlat', this.form.longitude + ',' + this.form.latitude)
      } else {
        this.$set(this.form, 'lonlat', '')
      }
      this.isEdit = true;
    }
    // this.form.lonlat = this.form['longitude'] ? `${this.form['longitude']},${this.form['latitude']}` : ''
    // this.areaInitFlag = true
    this.getArea();
  },
  methods: {
    testShopName (rule, value, callback) {
      if (!rule) return callback()
      if (Regexps.specialSymbols.test(value)) {
        return callback(new Error('禁止输入特殊符号)'))
      }
      return callback()
    },
    testRegionn (rule, value, callback) {
      if (!rule) return callback();
      if (!value || value == null) {
        return callback(new Error('禁止输入特殊符号)'))
      }
      return callback();
    },
    getArea () {
      configTypeQuery({ configType: 56 }).then((res) => {
        this.shopoptions = res.data[56];
        //this.form = this.details;
      }).catch((error) => {
        console.log(error)
      });
      getcityListQuery({ areaId: 100000 }).then((res) => {
        this.regionaList = res.data.array;
        this.form.regiona = this.details.regiona;
      }).catch((error) => {
        console.log(error)
      });
      if (this.isEdit) {
        getcityListQuery({ areaId: this.form.regiona }).then((res) => {
          this.regionpList = res.data.array;
          this.form.regionp = this.details.regionp;
          console.log('regionp:' + this.form.regionp)
        }).catch((error) => {
          console.log(error)
        });
        getcityListQuery({ areaId: this.form.regionp }).then((res) => {
          // debugger
          this.regionnList = res.data.array;
          this.form.regionn = this.details.regionn;
        }).catch((error) => {
          console.log(error)
        });
      }
      console.log(JSON.stringify(this.regionnList));
    },
    submit () {
      let result = false
      this.$refs.form.validate(res => {
        result = res
      });
      if (!result) return;
      this.shopoptions.forEach((item, i) => {
        if (item.id == this.form.shopTypeName) {
          this.form.shopType = this.form.shopTypeName;
          this.form.shopTypeName = item.configName;
        }
      });
      let params = JSON.parse(JSON.stringify(this.form));

      this.dialogLoading = true;
      if (this.isEdit) {
        editShop(params).then((res) => {
          // alert(JSON.stringify(res));
          if (res.data === 1) {
            this.dialogLoading = false;
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = ''
            }, this);
            this.$refs.form && this.$refs.form.resetFields();
            this.$emit('update:editdialogVisible', false)
            this.$message.success("编辑成功");
            this.$store.commit('base/updateFefreshShopTreeFlag', true);
          }
          else {
            this.dialogLoading = false;
            this.$message.error("编辑失败");
          }
        }).catch((error) => {
          this.dialogLoading = false;
        });
        return;
      }
      addShop(params).then((res) => {
        if (res.data === 1) {
          this.dialogLoading = false;
          this.$emit('update:editdialogVisible', this.form.shopNumber);
          Object.keys(this.form).forEach(prop => {
            this.form[prop] = ''
          }, this);
          this.$refs.form && this.$refs.form.resetFields();
          // this.$emit('update:editdialogVisible', false)
          this.$message.success("添加成功");
        }
        else {
          this.dialogLoading = false;
          this.$message.error("添加失败");
        }
      }).catch((error) => {
        this.dialogLoading = false;
      });
    },
    close () {
      this.form = {};
      this.$emit('update:editdialogVisible', false);
    },
    getAreaList (obj, type) {
      // debugger
      if (type == 'regionp') {
        this.regionpList = [];
        this.form.regionp = null;
        this.regionnList = [];
        this.form.regionn = null;
        this.regionn = null; if (obj) {
          getcityListQuery({ areaId: obj }).then((res) => {
            this.regionpList = res.data.array;
          }).catch((error) => {
            console.log(error)
          });
        }      }
      else if (type == 'regionn') {
        this.regionnList = [];
        this.form.regionn = null;
        this.regionn = null;
        if (obj) {
          getcityListQuery({ areaId: obj }).then((res) => {
            this.regionnList = res.data.array;
          }).catch((error) => {
            console.log(error)
          });
        }      }
    },
    getRegionn () {
      this.form.regionn = this.regionn;
      // let a=this.form.regionn;
    },
    pointChange (point) {
      this.$set(this.form, 'lonlat', point.lng + ',' + point.lat)
      console.log(this.form.lonlat)
      this.form.longitude = point.lng
      this.form.latitude = point.lat
    },
    toBMap () {
      window.open('http://api.map.baidu.com/lbsapi/getpoint/index.html')
    },
  }
  //   ,watch:{
  // //         regionn (val) {
  // // alert(val+':'+this.form.regionn);
  // //         }
  //     }
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

