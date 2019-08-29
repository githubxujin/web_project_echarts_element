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
          <el-form-item prop="inAmount" label="金额">
            <el-input v-model.trim="inAmount" placeholder="合计金额" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="inTime" label="入库时间">
            <el-date-picker
              v-model="form.inTime"
              type="date"
              placeholder="选择日期"
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
          :data="form.inStorageSparePartList"
          height="200"
          border
          style="width: 100%;margin-bottom: 10px"
          empty-text=" "
        >
          <el-table-column prop="sparePartId" label="配件" header-align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="`inStorageSparePartList[${scope.$index}].sparePartId`"
                :rules="[selectRule]"
              >
                <TreeSelect
                  v-model="form.inStorageSparePartList[scope.$index].sparePartId"
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
              <el-form-item :prop="`inStorageSparePartList[${scope.$index}].specification`">
                <span>{{form.inStorageSparePartList[scope.$index].specification}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" label="单价" header-align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="`inStorageSparePartList[${scope.$index}].unitPrice`"
                :rules="numberRule"
              >
                <el-input
                  v-model.trim="form.inStorageSparePartList[scope.$index].unitPrice"
                  @change="calAmount(scope.row,scope.$index)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" header-align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="`inStorageSparePartList[${scope.$index}].num`"
                :rules="inputRule"
              >
                <el-input
                  v-model.trim="form.inStorageSparePartList[scope.$index].num"
                  maxlength="10"
                  @change="calAmount(scope.row,scope.$index)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" header-align="center">
            <template slot-scope="scope">
              <el-form-item :prop="`inStorageSparePartList[${scope.$index}].amount`">
                <span>{{form.inStorageSparePartList[scope.$index].amount}}</span>
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
import { getDetail, addStorageData, editStorageData } from '@/services/assets.js'
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
      form: {
        inAmount: '',
        inTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        desc: '',
        shopNumber: this.shopNumber,
        inStorageSparePartList: []
      },
      operatorId: '',
      formRules: {},
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
          required: true,
          message: '必填',
          trigger: 'blur'
        },
        {
          pattern: Regexps.positiveNumber, message: '仅支持正数', trigger: 'blur'
        }

      ]
    }
  },
  computed: {
    inAmount () {
      let total = 0;
      this.form.inStorageSparePartList.forEach(item => {
        total += item.amount;
      })
      return total
    }
  },
  methods: {
    // 计算金额
    calAmount (item, index) {
      if (item.num && item.unitPrice) {
        this.form.inStorageSparePartList[index].amount = item.num * item.unitPrice;
      }
    },
    addTableData () {  // 新增一条数据
      this.form.inStorageSparePartList.push({
        billId: '',
        amount: '',
        specification: '',
        num: '',
        unitPrice: '',
        sparePartId: '',
        id: '',
      });
    },
    delTableData (index) { // 删除一条数据
      this.form.inStorageSparePartList.splice(index, 1)
    },
    // 根据配件获取规格型号
    getSparePart (node, data, ind) {
      if (node) {
        getDetail({ id: node.key }).then(res => {
          this.form.inStorageSparePartList[ind].specification = res.data.specification;
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
      this.form.inAmount = this.inAmount;
      if (this.isEdit) {
        editStorageData(this.form).then(res => {

          if (res.code == 200) {
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = '';
              this.form.inStorageSparePartList = [];
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
        addStorageData(this.form).then(res => {
          if (res.code == 200) {
            Object.keys(this.form).forEach(prop => {
              this.form[prop] = '';
              this.form.inStorageSparePartList = [];
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
        this.form = JSON.parse(JSON.stringify(this.detailData));
        this.form.inTime = moment().format('YYYY-MM-DD HH:mm:ss')
        console.log(this.form)
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
.storage-table {
  margin-bottom: 10px;
  /deep/ .el-form-item {
    margin-bottom: auto;
    margin-right: auto;
    &.is-error {
      margin-bottom: 20px;
    }
  }
  /deep/ .el-form-item--small {
    min-height: auto;
    line-height: normal;
  }
}
</style>


