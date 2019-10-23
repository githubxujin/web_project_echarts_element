<template>
  <div class="batch-editor" v-loading="dialogLoading">
    <el-form :model="form" :rules="rules" ref="rulesForm">
      <el-table :data="form.alarmConditionBatchList" :height="500" style="width: 100%" ref="table">
        <el-table-column
          header-align="center"
          align="center"
          type="index"
          :index="indexMethod"
          label="序号"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="名称"
          prop="alarmName"
        ></el-table-column>
        <el-table-column header-align="center" align="center" label="是否推送首页" prop="show">
          <template slot-scope="scope">
            <el-form-item
              class="alarmCondition"
              :porp="`alarmConditionBatchList[${scope.$index}].show`"
            >
              <el-radio-group v-model="form.alarmConditionBatchList[scope.$index].show">
                <el-radio
                  :key="index"
                  v-for="(item, index) in pushEnum"
                  :label="item.value"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="是否直接生成工单" prop="workOrder">
          <template slot-scope="scope">
            <el-form-item :porp="`alarmConditionBatchList[${scope.$index}].workOrder`">
              <el-radio-group v-model="form.alarmConditionBatchList[scope.$index].workOrder">
                <el-radio
                  :key="index"
                  v-for="(item, index) in yesOrNoEnum"
                  :label="item.value"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column header-align="center" label="指派给" prop="executer">
          <template slot-scope="scope">
            <el-form-item :porp="`alarmConditionBatchList[${scope.$index}].executer`">
              <TreeSelect
                v-model="form.alarmConditionBatchList[scope.$index].executer"
                placeholder="请选择"
                :data="executerList"
                :clearable="true"
                :isSparePart="true"
                :index="scope.$index"
                :defaultProps="defaultProps"
              ></TreeSelect>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="状态" prop="status">
          <template slot-scope="scope">
            <el-form-item :porp="`alarmConditionBatchList[${scope.$index}].status`">
              <el-radio-group v-model="form.alarmConditionBatchList[scope.$index].status">
                <el-radio
                  :key="index"
                  v-for="(item, index) in statusEnum"
                  :label="item.value"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="submit">确 定</el-button>
        <el-button size="mini" @click="cancle">取 消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
const defaultProps = {
  children: 'children',
  label: 'name',
  key: 'id',
  disabled: 'disabled'
}
import TreeSelect from '@/components/treeSelect'
import { yesOrNoEnum, pushEnum, statusEnum } from '@/enum/dicts.js'
import { alarmAdminListQuery, alarmEditBatch } from '@/services/system-settings.js'
export default {
  name: 'batch-editor',
  components: { TreeSelect },
  props: {
    batchDialogVisible: Boolean,
    selection: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      defaultProps,
      yesOrNoEnum,
      pushEnum,
      statusEnum,
      executerList: [],
      form: {
        alarmConditionBatchList: []
      },
      selectRule: { type: 'string', required: true, message: '必填项', trigger: 'change' },
      rules: { executer: { type: 'string', required: true, message: '必填项', trigger: 'change' } },
      shopNumber: this.$store.getters.shopNumber,
      dialogLoading: false
    }
  },
  computed: {},
  created () {
    this.initDict();
    console.log('设置', '设置')
  },
  methods: {
    alarmAdminListQuery, // 推送人员列表
    alarmEditBatch, // 批量设置
    initDict () {
      this.dialogLoading = true
      // 获取推送人员列表
      this.alarmAdminListQuery({ shopNumber: this.shopNumber }).then(res => {
        this.executerList = this.handleExecuterList(res.data.array)
        this.dialogLoading = false
      }).catch(_ => {
        this.dialogLoading = false
        console.error('获取推送人员下拉列表失败(errorMessage):', _);
      })
    },
    handleExecuterList (data = []) { // 处理推送人员列表不规范数据
      data = JSON.parse(JSON.stringify(data))
      data.forEach(item => {
        item.name = item.configName || item.realName
        item.disabled = item.hasOwnProperty('children') ? true : false
        if (item.children) {
          item.children = this.handleExecuterList(item.children)
        } else if (item.hasOwnProperty('children')) {
          item.children = []
        }
      })
      return data
    },
    indexMethod (index) { // 序号
      return index + 1
    },
    submit () {
      let result = false
      this.$refs.rulesForm.validate(vali => {
        result = vali
      })
      if (!result) return
      this.dialogLoading = true
      this.alarmEditBatch(this.form).then(res => {
        this.dialogLoading = false
        this.$message.success('批量设置成功！')
        this.$emit('success')
        this.cancle()
      }).catch(_ => {
        this.dialogLoading = false
      })
    },
    validateSelectValue (rule, value, callback, index) {
      let item = this.form.alarmConditionBatchList[index];
      console.log('item', item)
      if (this.form.alarmConditionBatchList[index].workOrder === 0 && !value) {
        return callback(new Error('必选'))
      }
      return callback()
    },
    cancle () {
      this.$emit('update:batchDialogVisible', false)
    }
  },
  watch: {
    'batchDialogVisible': {
      immediate: true,
      handler: function (val) {
        if (!val) return
        this.form.alarmConditionBatchList = this.selection.map(item => {
          let {
            id,
            alarmName,
            show,
            workOrder,
            executer,
            status
          } = item
          return {
            id,
            alarmName,
            show: ~~show,
            workOrder: ~~workOrder,
            executer,
            status: ~~status
          }
        })
        console.log('this.form.alarmConditionBatchList', this.form.alarmConditionBatchList)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.batch-editor {
  .btn-group {
    text-align: center;
    margin-top: 20px;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
    line-height: normal;
    min-height: unset;
  }
  /deep/ .alarmCondition {
    .el-radio:last-of-type {
      margin-right: 16px;
    }
  }
}
</style>
