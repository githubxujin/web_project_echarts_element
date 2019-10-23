<template>
  <div class="user-editor">
    <el-form label-width="90px" size="mini" inline :label-position="'right'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备编号：">{{details.deviceNumber}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产编号：">{{details.accountNumber}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称：">{{details.deviceName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备类型：">{{details.deviceTypeStr}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="规格型号：">{{details.deviceModel}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用部门：">{{details.useOrgIdStr}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="品牌：">{{details.brand}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产权归属：">{{orgId}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="生产厂家：">{{details.factoryName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拆旧方法：">{{depreciationMethod}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="单位：">{{details.unitIdStr}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装位置：">
            <span>{{details.installAddress}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="安装时间：">{{details.installTimeStr}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投入日期：">{{details.useTimeStr}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="出厂日期：">{{details.makTimeStr}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保修期：">{{details.safeTime}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="对应支路：">{{meterCN}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否重点设备：">
            <span v-html="details.special?'否':'是'"></span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设备状态：">{{usedState[details.deviceStatus]}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用：">
            <span v-html="details.status?'禁用':'启用'"></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备图片：">
            <img v-if="details.imgUrlStr" :src="details.imgUrlStr" alt />
          </el-form-item>
        </el-col>
      </el-row>
      <div v-show="paramData!=null">
        <el-row style="color:#000;">技术参数</el-row>
        <el-row>
          <el-col :span="12" v-for="(item,key) in paramData" :key="key">
            <el-form-item :label="item.paramName+':'">{{item.paramValue}}</el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import { addDevice, getFactory, getParamsField, editDevice, getDeviceTypeTree, getSafeTime } from '@/services/assets';
import { getUnit } from '@/services/operation';
import { meterGetArray, meterArray, configTypeTreeQuery } from '@/services/system-settings';
export default {
  props: {
    details: Object,
    tabInfoDetail: Object
  },
  data () {
    return {
      paramData: null,
      imgList: [],
      propertyList: [
        { name: '自有', id: 1 },
        { name: '租赁', id: 2 },
        { name: '自有+租赁', id: 3 },
        { name: '其他', id: 4 },
      ],
      depreciationList: [
        { name: '平均年限法', id: '1' },
        { name: '工作量法', id: '2' },
        { name: '双倍余数递减法', id: '3' },
        { name: '年数总和法', id: '4' }
      ],
      usedState: {
        0: '使用中',
        1: '维修中',
        2: '已报废'
      },
      unitList: [],
      branchList: []
    }
  },
  computed: {
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
    shopName () {
      // console.log('门店信息', this.$store.getters.getUserInfo)
      return this.$store.getters.getUserInfo.shopName
    },
    orgId () {
      let method = this.propertyList.find(item => item.id == this.details.orgId);
      return method && method.name
    },
    depreciationMethod () {
      let method = this.depreciationList.find(item => item.id == this.details.depreciationMethod);
      return method && method.name
    },
    unitCN () {
      let item = this.unitList.find(item => item.id === this.details.unitId)
      return item ? item.name : ''
    },
    meterCN () {
      let item = this.branchList.find(item => item.id === this.details.meterId);
      return item ? item.name : '';
    }
  },
  created () {
    this.getDeviceTypeTree();
    this.getUnit();
    this.meterGetArray();
  },
  methods: {
    close () {
      this.$emit('update:dialogVisible', false);
    },
    // 获取单位
    getUnit () {
      getUnit().then(res => {
        this.unitList = res.data && res.data.array.length > 0 ? res.data.array : []
      }).catch(err => {
        console.log('获取单位列表失败' + err)
      })
    },
    // 设备类型
    getDeviceTypeTree () {
      getDeviceTypeTree().then(res => {
        this.deviceList = res.code == 200 ? res.data.array : []
      })
    },
    // 获取支路
    meterGetArray () {
      // meterArray({ shopNumber: this.shopNumber, deviceType: this.form.deviceType }).then(res => {
      //   this.branchList = res.code == 200 ? res.data.array : []
      // })
      meterGetArray({ shopNumber: this.shopNumber }).then(res => {
        this.branchList = res.code == 200 ? res.data.array : []
      })
    },
  },
  watch: {
    tabInfoDetail: {
      handler: function (newData, oldData) {
        let techParam = JSON.parse(this.tabInfoDetail.techParam)
        this.paramData = techParam ? techParam : []
        this.imgList = this.tabInfoDetail.devicePicture ? this.tabInfoDetail.devicePicture.split(',') : []
      },
      deep: true
    },
    details: {
      handler: function (newData, oldData) {
      },
      deep: true
    },
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
    width: auto !important;
    min-width: 100px;
  }
}
</style>
<style lang="scss" scoped>
/deep/ .el-textarea {
  width: 550px;
}
</style>

