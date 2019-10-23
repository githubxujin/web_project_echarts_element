<template>
  <div class="user-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="default">
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="关键字：" label-width="80px">
              <el-input v-model.trim="form.userName" placeholder="帐号/手机号/姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态：" label-width="60px">
              <div style="width:120px;">
                <el-select v-model="form.payRollStatus" placeholder="请选择" :clearable="true">
                  <el-option
                    v-for="(item,index) in workStateEnum"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
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
          <div class="section flex-box">
            <div
              class="personal-card"
              :key="index"
              v-for="(item, index) in dataList"
              :class="{'hidden': !item.userName}"
            >
              <header
                class="card-header"
                :class="{'disabled': ~~item.payRollStatus === 3, 'vacation': ~~item.payRollStatus === 2}"
              >
                <span>{{item.userName}}</span>
                <span class="float-right">{{item.payRollStatus | translate(workStateEnum)}}</span>
              </header>
              <section class="card-section">
                <div class="right-card">
                  <el-row>
                    <el-col
                      :span="12"
                      class="line"
                      v-for="(item2, index2) in itemPropList"
                      :key="index2"
                    >
                      <span class="value" :title="item[item2]">{{item[item2]}}</span>
                    </el-col>
                  </el-row>
                </div>
                <div class="img-card" :class="{'no-protrait': !item.protraitShow}">
                  <img
                    width="100%"
                    height="100%"
                    v-show="item.protraitShow"
                    @load="showSelf($event, item)"
                    :src="item.picture"
                  />
                  <!-- alt="加载中..." -->
                </div>
              </section>
              <div
                class="handle-bar"
                v-if="pageBtns.some(val => val === 'edit') || pageBtns.some(val => val === 'delete')"
              >
                <span
                  class="handler-btn editor"
                  v-if="pageBtns.some(val => val === 'edit')"
                  @click="editItem(item)"
                >
                  <i class="el-icon-edit-outline" />
                  <span>编辑</span>
                </span>
                <span
                  v-if="item.payRollStatus === 2 && pageBtns.some(val => val === 'delete')"
                  class="handler-btn deletor"
                  @click="delItem(item)"
                >
                  <i class="el-icon-delete" />
                  <span>删除</span>
                </span>
              </div>
            </div>
          </div>
          <div class="empty" v-if="dataList.length === 10">暂无数据</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">{{userItem?'编辑用户': '新增用户'}}</span>
      <user-editor
        ref="userEditor"
        :dialogVisible.sync="dialogVisible"
        :userItem.sync="userItem"
        @success="search"
      ></user-editor>
    </el-dialog>
  </div>
</template>
<script>
import userEditor from './UserEditor'
import utils from '@/utils/utils.js'
import { adminQueryList, adminDelete } from '@/services/system-settings.js'
import { workStateEnum } from '@/enum/dicts.js'
export default {
  name: 'user-management',
  components: { userEditor },
  data () {
    return {
      activeName: 'default',
      workStateEnum: JSON.parse(JSON.stringify(workStateEnum)), // 工作状态字典
      itemPropList: ['roleName', 'jobNumber', 'realName', 'phone', 'orgName', 'positionName'], // 用户卡片展示的字段，从左往右按顺序排
      dataList: [], // 用户数组列表
      form: { // 表单查询数据
        userName: '',
        payRollStatus: ''
      },
      userItem: null, // 选中编辑或查看的用户id
      dialogVisible: false
    }
  },
  computed: {
    pageBtns () {
      return this.$store.getters.getPageBtns || [];
    },
    params () { // 格式化查询条件
      let form = JSON.parse(JSON.stringify(this.form))
      Object.keys(form).forEach(prop => {
        if (!form[prop] && form[prop] !== 0) delete form[prop]
      })
      const shopNumber = (this.$store.getters.getUserInfo || {}).shopNumber ? (this.$store.getters.getUserInfo || {}).shopNumber : (this.$store.getters.getUserInfo || {}).shopNumbers
      form.shopNumbers = (this.$store.getters.getUserInfo || {}).shopNumber ? [shopNumber] : shopNumber
      return form
    }
  },
  created () {
    this.workStateEnum.unshift({
      label: '全部',
      value: ''
    })
    this.search()
  },
  methods: {
    adminQueryList,
    adminDelete,
    search () { // 查询
      this.$common.updateLoadingStatus(true)
      this.adminQueryList(this.params).then(res => {
        this.$common.updateLoadingStatus(false)
        let dataList = (res.data || {}).list || []
        console.log('数据列表:', dataList)
        dataList.forEach((item, index) => {
          if (this.userItem != null && this.userItem.id == this.$store.getters.getUserInfo.id) {
            if (item.id == this.userItem.id) {
              console.log(item)
              item.shopNumber = item.shopNumber || this.$store.getters.getUserInfo.shopNumber;
              this.$store.commit('user/setUserInfo', item)
            }
          }
          item.protraitShow = (this.dataList[index] || {}).picture === item.picture && item.picture ? true : false
        })
        dataList.push({}, {}, {}, {}, {}, {}, {}, {}, {}, {})
        this.dataList = dataList
      }).catch(_ => {
        console.error('查询用户列表失败(errorMessage):', _);
        this.$common.updateLoadingStatus(false)
      })
    },
    addNew () { // 新增
      this.userItem = null;
      this.dialogVisible = true
      console.log('新增用户')
    },
    editItem (item) { // 编辑
      this.userItem = item;
      this.dialogVisible = true
      console.log('编辑:', item);
    },
    delItem (item) {
      this.$confirm(`确认删除用户${item.realName}?`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        this.adminDelete(item).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.search()
        }).catch(_ => {
          console.error('删除用户失败(errorMessage):', _);
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
    showSelf (event, item) {
      item.protraitShow = true
      let ele = event.srcElement ? event.srcElement : event.target
      ele.style.display = 'block';
    }
  }
}
</script>
<style lang="scss" scoped>
.user-management {
  .sub-nav {
    /deep/ .el-tabs {
      height: 100%;
    }
  }
  /deep/ .el-tab-pane {
    overflow-y: auto;
  }
  .search-bar {
    padding-top: 15px;
    .float-right {
      float: right;
    }
  }
  .section {
    // height: calc(100% - 68px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-bottom: 20px;
    box-sizing: border-box;
    .personal-card {
      position: relative;
      display: inline-block;
      width: 392px;
      height: 172px;
      border: 1px solid rgba(219, 219, 219, 1);
      border-radius: 20px;
      margin: 0 0 20px 0;
      background: rgba(0, 0, 0, 0.02);
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      &.hidden {
        border: none;
        height: 0;
        margin: 0;
        padding: 0;
        box-shadow: none;
        > * {
          display: none;
        }
      }
      .card-header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        height: 50px;
        line-height: 50px;
        background: #2eb34a;
        color: #fff;
        &.disabled {
          background: #b7b7b7;
        }
        &.vacation {
          background: #2d90d4;
        }
        .float-right {
          float: right;
        }
      }
      .card-section {
        position: relative;
        padding-top: 50px;
        .right-card {
          font-size: 14px;
          color: #333333;
          box-sizing: border-box;
          padding: 10px;
          padding-left: 130px;
          .line {
            height: 30px;
            line-height: 30px;
            color: #333333;
            .value {
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              word-wrap: break-word;
              height: 30px;
            }
          }
        }
        .img-card {
          position: absolute;
          left: 16px;
          top: 66px;
          width: 88px;
          height: 88px;
          &.no-protrait {
            background: url("../../../../assets/images/common/head-portrait.png")
              100% 100% no-repeat;
          }
        }
      }
      .handle-bar {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        line-height: 60px;
        height: 0;
        transition: height 0.2s ease-out;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        .handler-btn {
          display: inline-block;
          padding: 0 10px;
          vertical-align: middle;
          font-size: 16px;
          color: white;
          &.editor:hover {
            color: rgba(25, 130, 191, 0.8);
          }
          &.deletor {
            margin-left: 87px;
            &:hover {
              color: rgba(245, 108, 108, 0.8);
            }
          }
          i {
            font-size: 26px;
          }
          span {
            position: relative;
            top: -5px;
          }
        }
      }
      &:hover {
        .handle-bar {
          height: 60px;
        }
      }
    }
  }
  .dialog-footer {
    text-align: center;
  }
  .empty {
    text-align: center;
    line-height: 400px;
    color: #999;
  }
}
</style>
