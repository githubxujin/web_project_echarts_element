<template>
  <div class="user-management">
    <el-form :inline="true" :model="form" class="search-bar" label-position="right">
      <el-form-item label="关键字：">
        <el-input v-model.trim="form.userName" placeholder="帐号/手机号/姓名" :clearable="true"></el-input>
      </el-form-item>
      <!--<el-form-item label="所属门店：">-->
        <!--<projectTree-->
          <!--v-model="form.shopNumbers"-->
          <!--:showTabs="false"-->
          <!--:requestParams="{treeType: 1}"-->
          <!--:anotherStyle="false"-->
          <!--:showTitle="false"-->
          <!--:clearable="true"-->
        <!--&gt;</projectTree>-->
      <!--</el-form-item>-->
      <el-form-item label="角色：">
        <div style="width:120px;">
          <el-select v-model="form.roleId" placeholder="请选择" size="mini" clearable>
            <el-option
              v-for="(item,index) in roleList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label-width="50px" label=" ">
        <el-button
          @click="$common.debounce(search)()"
          type="primary"
          size="mini"
          icon="el-icon-search"
          :loading="btnLoading"
        >查询</el-button>
      </el-form-item>
      <el-form-item class="float-right" v-if="pageBtns.some(val => val === 'add')">
        <el-button
          @click="$common.debounce(addNew)()"
          type="primary"
          size="mini"
          icon="el-icon-plus"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <el-row class="section" :gutter="10">
      <el-table :data="dataList" :height="tableHeight" style="width: 100%" ref="table" border>
        <el-table-column
          type="index"
          width="50"
          label="序号"
          :index="indexMethod"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in itemPropList"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :key="index"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="item.dict">{{scope.row[item.prop] | translate(item.dict)}}</span>
            <span v-else-if="item.isArray">{{(scope.row[item.prop] || []).join(',')}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewItem(scope.row)">详情</el-button>
            <el-button
              type="text"
              @click="editItem(scope.row)"
              v-show="scope.row['roleType']==1"
              v-if="pageBtns.some(val => val === 'edit')"
            >编辑</el-button>
            <el-button
              type="text"
              v-show="scope.row['payRollStatus']==2&&scope.row.roleType!=2"
              @click="delItem(scope.row)"
              v-if="pageBtns.some(val => val === 'delete')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pager :pager="pager" @setPager="search"></Pager>
    </el-row>
    <el-dialog


      :visible.sync="dialogVisible"
      width="720px"

      :close-on-click-modal="false"

    >
      <span slot="title" class="dialog-header">{{userItem?'编辑用户': '新增用户'}}</span>
      <user-editor
        ref="userEditor"
        :dialogVisible.sync="dialogVisible"
        :userItem.sync="userItem"
        @success="search"
        :roleList="roleListCopy"
      ></user-editor>
    </el-dialog>

    <el-dialog :visible.sync="viewDialogVisible" width="580px" @close="closeDetail">
      <span slot="title" class="dialog-header">详情</span>
      <userDetail
        ref="userEditor"
        :viewDialogVisible.sync="viewDialogVisible"
        :userItem.sync="userItem"
        :roleList="roleList"
      ></userDetail>
    </el-dialog>
  </div>
</template>
<script>
import projectTree from '@/components/projecttree'
import Pager from '@/components/table/Pager'
import userDetail from './userDetail'
import userEditor from './UserEditor'
import utils from '@/utils/utils.js'
import { adminQueryList, adminDelete, roleListQuery } from '@/services/system-settings.js'
import { workStateEnum } from '@/enum/dicts.js'
import baseOptions from '@/utils/baseOptions';
export default {
    extends: baseOptions,
  components: { projectTree, Pager, userDetail, userEditor },
  data () {
    return {
      tableHeight: 400,
      workStateEnum, // 工作状态字典
      btnLoading: false, // 查询按钮loading状态
      // 'userName', 'payRollStatus', 'roleName', 'jobNumber', 'realName', 'phone', 'orgName', 'positionName'
      roleList: [], // 角色下拉列表
      itemPropList: [
        {
          prop: 'userName',
          label: '帐号',
          width: '120'
        },
        {
          prop: 'shopNames',
          label: '所属门店',
          width: '180',
          isArray: true
        },
        {
          prop: 'jobNumber',
          label: '工号',
          width: '120'
        },
        {
          prop: 'roleName',
          label: '角色',
          width: '180'
        },
        {
          prop: 'positionName',
          label: '职位'
        },
        {
          prop: 'realName',
          label: '姓名',
        },
        {
          prop: 'phone',
          label: '手机号',
        },
        {
          prop: 'payRollStatus',
          label: '状态',
          width: '80',
          dict: workStateEnum
        }
      ], // 展示的字段，从左往右按顺序排
      dataList: [], // 用户数组列表
      form: { // 表单查询数据
        userName: '',
        shopNumbers: [],
        roleId: '',
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
      },
      userItem: null, // 编辑或查看对象
      dialogVisible: false,
      viewDialogVisible: false
    }
  },
  computed: {
    pageBtns () {
      return this.$store.getters.getPageBtns || [];
    },
    params () { // 格式化查询条件
      let form = JSON.parse(JSON.stringify(this.form))
      Object.keys(form).forEach(prop => { // 去除空字符串查询条件
        if (!form[prop] && form[prop] !== 0) delete form[prop]
      })
      return form
    },
    roleListCopy () {
      let roleList = this.roleList.filter(item => item.roleType === 1)
      return roleList
    }
  },
  created () {
    this.initData()
  },
  mounted () {
    // 重置table高度
    this.resetTableHeight()
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.resetTableHeight)
  },
  beforeDestroy () {
    // 移除监听窗口大小变化事件
    window.removeEventListener('resize', this.resetTableHeight)
  },
  methods: {
    adminQueryList,
    adminDelete,
    roleListQuery,
    initData () {
      this.roleListQuery().then(res => {
        if (res.code !== 200) return Promise.reject('获取角色列表失败')
        this.roleList = (res.data || {}).array
      }).catch(_ => {
        console.error('获取角色列表失败(errorMessage)：', _);
      })
      this.search()
    },
    search (pager = this.pager) { // 查询
      this.btnLoading = true
      this.adminQueryList(Object.assign({}, this.params, pager)).then(res => {
        this.btnLoading = false
        let data = res.data || {}
        this.dataList = data.list || []
        this.pager.total = data.total
        this.dataList.forEach((item, index) => {
          if (this.userItem != null && this.userItem.id == this.$store.getters.getUserInfo.id) {
            if (item.id == this.userItem.id) {
              console.log(item)
              this.$store.commit('user/setUserInfo', item)
            }
          }
        })
      }).catch(_ => {
        this.btnLoading = false
      })
    },
    addNew () { // 新增
      this.userItem = null;
      this.dialogVisible = true
    },
    viewItem (item) {
      this.userItem = item
      this.viewDialogVisible = true
    },
    editItem (item) { // 编辑
      this.userItem = item;
      this.dialogVisible = true
    },
    delItem (item) {
      console.log(item)
      this.$confirm(`确认删除用户:${item.userName}?`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        this.adminDelete(item).then(res => {
          if (res.code !== 200) return Promise.reject('失败')
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.search()
        }).catch(_ => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        });
      });
    },
    resetDialogForm () {
      this.$refs.userEditor && this.$refs.userEditor.cancle()
    },
    resetTableHeight () { // 重置table高度
      this.$common.initTableHeight(this);
    },
    indexMethod (index) { // 序号
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    },
    closeEditor () {
      console.log('关闭')
      this.dialogVisible = false
    },
    closeDetail () {
      console.log('关闭详情')
      this.viewDialogVisible = false
    }
  }, watch: {
        checkedShopNumbers: {
            handler (val) {
                this.form.shopNumbers=this.checkedShopNumbers;
                this.search();
            },
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
.user-management {
  padding: 0 20px;
  .search-bar {
    padding-top: 15px;
    .float-right {
      float: right;
    }
  }
  .section {
    padding-bottom: 20px;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
