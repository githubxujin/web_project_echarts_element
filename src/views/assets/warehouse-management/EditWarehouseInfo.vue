<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      v-loading="dialogLoading"
      label-width="90px"
      size="mini"
      inline
      :label-position="'left'"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="relateBill" label="关联工单号">
            <!-- <el-input v-model.trim="form.relateBill" placeholder="请输入关联工单号"></el-input> -->
            <el-autocomplete
              class="inline-input"
              v-model="form.relateBill"
              value-key="billNumber"
              :fetch-suggestions="querySearch"
              placeholder="请输入搜索内容"
              :trigger-on-focus="false"
              @select="handleSelect"
              @input="getRelateBill"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="receiveId" label="领用人">
            <el-select v-model="form.receiveId" placeholder="请选择" clearable>
              <el-option
                v-for="item in receiverList"
                :key="item.userId"
                :label="item.realName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="outAmount" label="出库金额">
            <el-input v-model.trim="outAmount" placeholder="合计金额" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="outTime" label="出库时间">
            <el-date-picker
              v-model="form.outTime"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="desc" label="备注">
            <el-input
              v-model.trim="form.desc"
              placeholder="请输入"
              style="width:540px;"
              type="textarea"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="storage-table">
        <el-table
          :data="form.outStorageSparePartList"
          height="200"
          border
          style="width: 100%;margin-bottom: 10px"
        >
          <el-table-column prop="sparePartId" label="出库配件" header-align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="`outStorageSparePartList[${scope.$index}].sparePartId`"
                :rules="selectRule"
              >
                <TreeSelect
                  v-model="form.outStorageSparePartList[scope.$index].sparePartId"
                  placeholder="请选择"
                  :clearable="true"
                  :data="partsType"
                  :defaultProps="defaultProps"
                  :isSparePart="true"
                  :index="scope.$index"
                  @change="getSparePart"
                ></TreeSelect>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="specification" label="规格型号" header-align="center">
            <template slot-scope="scope">
              <el-form-item :prop="`outStorageSparePartList[${scope.$index}].specification`">
                <span>{{form.outStorageSparePartList[scope.$index].specification}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" label="单价" header-align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="`outStorageSparePartList[${scope.$index}].unitPrice`"
                :rules="numberRule"
              >
                <el-input
                  v-model.trim="form.outStorageSparePartList[scope.$index].unitPrice"
                  @change="getUnitPrice(scope.row,scope.$index)"
                  maxlength="6"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" header-align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="`outStorageSparePartList[${scope.$index}].num`"
                :rules="inputRule"
              >
                <el-input
                  v-model.trim="form.outStorageSparePartList[scope.$index].num"
                  @change="calAmount(scope.row,scope.$index)"
                  maxlength="6"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" header-align="center">
            <template slot-scope="scope">
              <el-form-item :prop="`outStorageSparePartList[${scope.$index}].amount`">
                <span>{{form.outStorageSparePartList[scope.$index].amount}}</span>
                <span class="fr">元</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            width="50"
            header-align="center"
            align="center"
            :render-header="renderAddTag"
          >
            <template style="cursor: pointer" slot-scope="scope">
              <i
                style="cursor: pointer"
                class="el-icon-remove-outline"
                @click="delTableData(scope.$index)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row class="text-center">
        <el-button type="primary" round size="mini" @click="submit">确 定</el-button>
        <el-button round size="mini" @click="close">取 消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import TreeSelect from '@/components/treeSelect'
import { getDetail, addOutStoraData, editOutStoraData, getUserListByShopNumber } from '@/services/assets.js'
import { getLikeBill } from '@/services/operation.js'
import Regexps from '@/utils/regexp.js'
import moment from 'moment';
//设定moment区域为中国
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  components: { TreeSelect },
  props: {
    editdialogVisible: { type: Boolean },
    detailData: {
      type: Object
    },
    shopNumber: {
      type: String
    },
    partsType: {
      type: Array
    }
  },
  data () {
    return {
      billNumber: '',
      form: {
        outAmount: '',
        outStorageSparePartList: [{
          billId: '',
          amount: '',
          specification: '',
          num: '',
          unitPrice: '',
          sparePartId: '',
          id: ''
        }],
        receiveId: '',
        relateBill: '',
        outTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        desc: '',
        shopNumber: this.shopNumber
      },

      formRules: {
        relateBill: [
          { required: true, message: '请输入关联的维修巡检保养单号', trigger: 'blur' }
        ],
        receiveId: [
          { required: true, message: '请选择领用人姓名', trigger: 'change' }
        ],
      },
      dialogLoading: false,
      isEdit: false,
      deviceList: [],
      defaultProps: {
        children: 'children',
        label: 'configName',
        key: 'id',
        disabled: 'disabled'
      },
      selectRule: {
        required: true,
        message: '必选',
        trigger: 'change'
      },
      inputRule: [{
        required: true,
        message: '必填',
        trigger: 'blur'
      },
      {
        pattern: Regexps.positiveInteger, message: '仅支持正整数', trigger: 'blur'
      }
      ],
      numberRule: [
        {
          required: true, message: '必填', trigger: 'blur'
        },
        {
          pattern: Regexps.positiveNumber, message: '仅支持正数', trigger: 'blur'
        }
      ],
      receiverList: []
    }
  },
  created () {
    this.getUserListByShopNumber()
  },
  computed: {
    outAmount () {
      let total = 0;
      this.form.outStorageSparePartList.forEach(item => {
        total += Number(item.amount);
      })
      return total
    }
  },
  methods: {
    getRelateBill (val) {
      this.form.relateBill = this.form.relateBill.slice(0, 16)
    },
    querySearch (queryString, cb) {
      let list = [{}]
      getLikeBill({ keyword: this.form.relateBill, shopNumber: this.shopNumber }).then(res => {
        console.log(res);
        if (res.code == 200) {
          list = res.data.array;
          cb(list)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelect (val) {
      console.log(val, this.form.relateBill)
      this.billNumber = val;
    },
    getUnitPrice (item, index) {
      var length = 0;
      if (item.unitPrice.indexOf('.') != -1) {
        if (item.unitPrice.split('.')[1].length >= 4) {
          item.unitPrice = item.unitPrice.split('.')[0] + '.' + item.unitPrice.split('.')[1].slice(0, 4)
        }
        length = item.unitPrice.split('.')[1].length
      } else if ((item.unitPrice.indexOf('.') == -1)) {
        item.unitPrice = item.unitPrice ? parseInt(item.unitPrice) : ''
      }
      this.calAmount(item, index)
    },
    // 计算金额
    calAmount (item, index) {
      if (item.num && item.unitPrice) {
        var total = parseInt(item.num) * parseFloat(item.unitPrice);
        console.log('zongshu', total)
        // this.form.inStorageSparePartList[index].amount = length ? total.toFixed(length) : total.toFixed(0)
        this.form.outStorageSparePartList[index].amount = total.toFixed(2);
        console.log('zongshu', this.form.outStorageSparePartList[index].amount)
      }
    },
    addTableData () {  // 新增一条数据
      this.form.outStorageSparePartList.push({
        billId: '',
        amount: '',
        specification: '',
        num: '',
        unitPrice: '',
        sparePartId: '',
        id: ''
      });
      console.log(this.form.outStorageSparePartList)
    },
    delTableData (index) { // 删除一条数据
      this.form.outStorageSparePartList.splice(index, 1)
    },
    // 根据门店编号获取领用人
    getUserListByShopNumber () {
      getUserListByShopNumber({ shopNumber: this.shopNumber }).then(res => {
        this.receiverList = res.data.array || []
      })
    },
    // 根据配件获取规格型号
    getSparePart (node, data, ind) {
      console.log(node)
      if (node) {
        getDetail({ id: node.key }).then(res => {
          this.form.outStorageSparePartList[ind].specification = res.data.specification;
        }).catch(err => {
          console.log(err)
        })
      }
    },
    submit () {

      let result = false;
      this.$refs.form.validate(res => {
        result = res
      })
      if (!result) return;
      this.dialogLoading = true;
      this.form.outAmount = this.outAmount;
      if (this.isEdit) {
        editOutStoraData(this.form).then(res => {
          if (res.code == 200) {
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = '';
              this.form.outStorageSparePartList = [];
            }, this);
            this.$emit('success');
            this.$message.success("编辑成功");
            this.dialogLoading = false;
            this.$emit('update:editdialogVisible', false);
          } else {
            this.dialogLoading = false;
          }
        }).catch(err => {
          console.log(err)
          this.dialogLoading = false;
        })
      } else {
        addOutStoraData(this.form).then(res => {
          if (res.code == 200) {
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = '';
              this.form.outStorageSparePartList = [];
            }, this);
            this.$emit('success');
            this.$message.success("新增成功");
            this.dialogLoading = false;
            this.$emit('update:editdialogVisible', false);
          } else {
            this.dialogLoading = false;
          }
        }).catch(err => {
          console.log(err)
          this.dialogLoading = false;
        })
      }
    },
    close () {
      this.$emit('update:editdialogVisible', false)
    },
    renderAddTag (h) { // 新增支路数据表头渲染函数
      return h(
        'i',
        {
          'class': {
            'el-icon-plus': true
          },
          style: {
            cursor: 'pointer'
          },
          attrs: {
            title: '新增一条数据'
          },
          on: {
            click: this.addTableData
          }
        }
      )
    }
  },
  watch: {
    detailData: {
      handler: function () {
        this.form = JSON.parse(JSON.stringify(this.detailData))
        // this.form.receiveId = parseInt(this.form.receiveId)
        // this.form.outTime = moment().format('YYYY-MM-DD HH:mm:ss')
        if (this.form && this.form.hasOwnProperty("id")) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-input--prefix .el-input__inner,
/deep/ .el-select .el-input__inner {
  width: 178px;
}
/deep/ .el-form-item--mini .el-form-item__content {
  line-height: 31px !important;
}
/deep/ .el-input.is-disabled .el-input__inner {
  height: 30px !important;
  line-height: 30px !important;
}
/deep/ .el-autocomplete .el-input--mini .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.storage-table {
  margin-bottom: 10px;
  /deep/ .el-form-item {
    margin-bottom: auto;
    margin-right: auto;
    width: 100%;
    &.is-error {
      margin-bottom: 20px;
    }
  }
  /deep/ .el-form-item--mini .el-form-item__content {
    width: 100%;
  }
  /deep/ .el-form-item--small {
    min-height: auto;
    line-height: normal;
  }
}
</style>
<style >
.el-autocomplete-suggestion li {
  padding: 0px 8px !important;
}
</style>


