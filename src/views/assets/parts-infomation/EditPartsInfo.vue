<template>
  <div class="parts-info">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      size="mini"
      inline
      v-loading="dialogLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="配件编码" prop="number">
            <el-input v-model="form.number" maxlength="20" clearable :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配件名称" prop="name">
            <el-input v-model="form.name" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="配件类型" prop="type">
            <TreeSelect
              v-model="form.type"
              placeholder="请选择"
              :clearable="true"
              :data="partsType"
              :defaultProps="defaultProps"
              :isOnlyLeafSelect="true"
            ></TreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格型号" prop="specification">
            <el-input v-model="form.specification" clearable maxlength="25"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="库存警戒值" prop="stockAlertValue">
            <el-input v-model="form.stockAlertValue" clearable maxlength="6"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联设备类型" prop="devideviceType">
            <TreeSelect
              v-model="form.deviceType"
              placeholder="请选择"
              :clearable="true"
              :data="deviceList"
              :defaultProps="defaultProp"
              :isOnlyLeafSelect="true"
            ></TreeSelect>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位" prop="unit">
            <el-select v-model="form.unit" placeholder="请选择" clearable>
              <el-option
                v-for="item in unitList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
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
        <el-button type="primary" round size="mini" @click="submit">确 定</el-button>
        <el-button round size="mini" @click="close">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import TreeSelect from '@/components/treeSelect'
import { statusEnum } from '@/enum/dicts.js'
import Regexps from '@/utils/regexp.js'
import { getDeviceTypeTree, addParts, editParts } from '@/services/assets';
import { getUnit } from '@/services/operation';
export default {
  components: { TreeSelect },
  props: {
    editdialogVisible: {
      type: Boolean
    },
    shopNumber: {
      type: String
    },
    detailData: {
      type: Object
    },
    partsType: {
      type: Array
    }
  },
  data () {
    return {
      statusEnum,
      isEdit: false,
      dialogLoading: false,
      form: {
        number: '',
        name: '',
        type: '',
        shopNumber: this.shopNumber,
        specification: '',
        stockAlertValue: '',
        deviceType: '',
        unit: null,
        status: 0
      },
      rules: {
        number: [
          { required: true, message: '请输入配件编码', trigger: 'blur' },
          { validator: this.chinese, message: '编码中不能含有汉字', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入配件名称', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择配件类型', trigger: 'change' }
        ],
        specification: [
          { required: true, message: '请输入规格型号', trigger: 'blur' },
        ],
        stockAlertValue: [
          { required: true, message: '请输入库存警戒值', trigger: 'blur' },
          { validator: this.positiveInteger, message: '库存警戒值必须是正整数', trigger: 'blur' }
        ],
      },
      defaultProps: {
        children: 'children',
        label: 'configName',
        key: 'id',
        disabled: 'disabled'
      },
      defaultProp: {
        children: 'childList',
        label: 'configName',
        key: 'id',
        disabled: 'disabled'
      },
      deviceType: [],
      deviceList: [],
      unitList: [],
    }
  },
  created () {
    this.getDeviceTypeTree();
    this.getUnit();
    this.init();
  },
  methods: {
    chinese (rule, value, callback) {
      if (value) {
        if (Regexps.chinese.test(value)) {
          return callback(new Error('编码中不能含有汉字'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    init () {
      console.log(this.detailData)
      if (this.detailData.id) {
        this.form = JSON.parse(JSON.stringify(this.detailData))
        this.form.deviceType = Number(this.form.deviceType)
        if (this.form && this.form.hasOwnProperty("id")) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
    },
    positiveInteger (rule, value, callback) {
      if (value) {
        if (!Regexps.positiveInteger.test(value)) {
          return callback(new Error('库存警戒值必须是正整数'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    // 设备类型
    getDeviceTypeTree () {
      getDeviceTypeTree().then(res => {
        this.deviceList = res.code == 200 ? res.data.array : []
      })
    },
    // 获取单位
    getUnit () {
      getUnit().then(res => {
        this.unitList = res.data && res.data.array.length > 0 ? res.data.array : []
      }).catch(err => {
        console.log('获取单位列表失败' + err)
      })
    },
    // getAlertValue (val) {
    //   this.form.stockAlertValue = this.form.stockAlertValue.slice(0, 6)
    // },
    submit () {
      let result = false
      this.$refs.form.validate(res => {
        result = res
      });
      if (!result) return;
      // this.form.shopNumber = this.shopNumber;
      let params = JSON.parse(JSON.stringify(this.form));
      this.dialogLoading = true;
      if (this.isEdit) {
        editParts(params).then(res => {
          this.dialogLoading = false;
          if (res.code == 200) {
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = ''
            }, this);
            this.$refs.form && this.$refs.form.resetFields();
            this.$emit('success');
            this.$message.success("编辑成功");
            this.$emit('update:editdialogVisible', false);
          }
        }).catch(err => {
          console.log(err);
          this.dialogLoading = false;
        })
      } else {
        addParts(params).then(res => {
          this.dialogLoading = false;
          if (res.code == 200) {
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = ''
            }, this);
            this.$refs.form && this.$refs.form.resetFields();
            this.$emit('success');
            this.$message.success("添加成功");
            this.$emit('update:editdialogVisible', false);
          }
        }).catch(err => {
          console.log(err);
          this.dialogLoading = false;
        })
      }
    },
    close () {
      this.$emit('update:editdialogVisible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.parts-info {
  /deep/ .el-input--mini .el-input__inner {
    width: 173px;
  }
}
</style>


