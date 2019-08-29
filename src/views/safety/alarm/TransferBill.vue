<template>
  <div>
    <el-table :data="tableData" style="width: 100%" height="400px">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="alarmName" label="报警名称"></el-table-column>
      <el-table-column prop="users" label="指派给">
        <template slot-scope="scope">
          <mult-group-select
            :options="options"
            v-model="tableData[scope.$index].users"
            :multiple="false"
          ></mult-group-select>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import MultGroupSelect from '../../../components/form/MultGroupSelect';
import { getExecuteDepartList } from '../../../services/safety'
export default {
  components: {
    MultGroupSelect
  },
  props: {
    tbData: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    shopNumber () {
      return this.$store.getters.shopNumber;
    }
  },
  data () {
    return {
      tableData: [],
      options: []
    }
  },
  watch: {
    tbData (newVal, oldVal) {
      console.log('newVal', newVal)
      this.tableData = newVal.map(n => {
        return { id: n.id, alarmName: n.alarmName, users: [] }
      });
    },
    // deep: true
  },
  created () {
    // console.log('tbData', this.tbData)
    this.tableData = this.tbData.map(n => {
      return { id: n.id, alarmName: n.alarmName, users: [] }
    });
    this.initData();
  },
  methods: {
    initData () {
      getExecuteDepartList(this.shopNumber).then(res => {
        console.log('res', res)
        if (res.code == 200) {
          this.options = res.data.array;
          console.log('options', this.options)
        }
      })
    },
    //确定
    submitForm () {
      console.log('提交', this.tableData)
      this.$emit("submitForm", this.tableData)
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
    watchSelect (val, index) {
      // 绑定watchselect事件的时候将index放进参数，scope.$index

      // 根据option的pkid获取到它的ContentScore属性
      // this.tableData.forEach(item => {
      //   if (item.id == val) {
      //     this.tableData[index].users = item.users;
      //     }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>