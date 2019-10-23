<template>
  <div class="transformer-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="变压器管理" name="default">
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="变压器名称：">
              <el-input v-model="form.name" placeholder="请输入变压器名称" :clearable="true">
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  style="cursor: pointer;"
                  @click="$common.debounce(search)()"
                ></i>
              </el-input>
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
          <div class="section">
            <empty-data v-if="!dataList.length && !$store.getters.getLoading" msg="暂无变压器数据" />
            <div
              class="personal-card"
              :key="index"
              v-for="(item, index) in dataListCopy"
              :class="{'hidden': !item.name}"
            >
              <ul class="left-card">
                <li class="line" v-for="(item2, index2) in itemPropList" :key="index2">
                  <span class="label">{{item2.label}}：</span>
                  <span
                    class="value"
                    v-if=" !['meterInfo','status'].includes(item2.prop)"
                    :title="item[item2.prop]"
                  >{{item[item2.prop]}}</span>
                  <span
                    class="value"
                    v-else-if="item2.prop === 'status'"
                    :title="item[item2.prop]"
                  >{{item[item2.prop] === 0 ?'启用':'禁用'}}</span>
                  <span
                    v-else
                    class="value branchInfo"
                    :title="item.meterInfo"
                    v-html="meterInfoFilter(item.meterInfo)"
                  />
                </li>
              </ul>
              <div class="img-card">
                <img
                  width="100%"
                  height="100%"
                  style="display:none;"
                  @load="showSelf($event)"
                  :src="transformerImage"
                  alt="加载中..."
                />
              </div>
              <div class="handle-bar" v-if="pageBtns.some(val => val === 'edit')">
                <span class="editor" @click="editItem(item)">
                  <i class="el-icon-edit-outline" />
                  <span>编辑</span>
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="resetDialogForm"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-header">{{transformerItem?'编辑变压器信息': '新增变压器'}}</span>
      <TransformerEditor
        ref="transformerEditor"
        :dialogVisible.sync="dialogVisible"
        :transformerItem.sync="transformerItem"
        @success="search"
      ></TransformerEditor>
    </el-dialog>
  </div>
</template>
<script>
import EmptyData from '@/components/form/EmptyData';
import TransformerEditor from './TransformerEditor'
import utils from '@/utils/utils.js'
import { transformerQuery } from '@/services/system-settings.js'
import { workStateEnum } from '@/enum/dicts.js'
import transformerImage from '@/assets/images/transformer/transformer.png'
export default {
  name: 'transformer-management',
  components: { EmptyData, TransformerEditor },
  data () {
    return {
      transformerImage,
      activeName: 'default',
      workStateEnum: JSON.parse(JSON.stringify(workStateEnum)), // 工作状态字典
      itemPropList: [
        {
          label: '变压器编号',
          prop: 'number'
        },
        {
          label: '变压器名称',
          prop: 'name'
        },
        {
          label: '设备安装位置',
          prop: 'position'
        },
        {
          label: '包含支路',
          prop: 'meterInfo'
        },
        {
          label: '状态',
          prop: 'status'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      dataList: [], // 用户数组列表
      form: { // 表单查询数据
        name: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      transformerItem: null, // 选中编辑或查看的用户id
      dialogVisible: false
    }
  },
  computed: {
    pageBtns () {
      return this.$store.getters.getPageBtns || [];
    },
    dataListCopy () {
      let dataList = JSON.parse(JSON.stringify(this.dataList))
      if (!dataList.length) return []
      dataList.push({}, {}, {}, {}, {}, {}, {}, {}, {}, {})
      return dataList
    },
    params () { // 格式化查询条件
      let form = JSON.parse(JSON.stringify(this.form))
      Object.keys(form).forEach(prop => {
        if (!form[prop] && form[prop] !== 0) delete form[prop]
      })
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
    transformerQuery,
    search () { // 查询
      this.$common.updateLoadingStatus(true)
      this.transformerQuery(this.params).then(res => {
        this.$common.updateLoadingStatus(false)
        this.dataList = (res.data || {}).list || []
      }).catch(_ => {
        console.error('查询变压器列表失败(errorMessage):', _);
        this.$common.updateLoadingStatus(false)
      })
    },
    addNew () { // 新增
      this.transformerItem = null;
      this.dialogVisible = true
      console.log('新增变压器')
    },
    editItem (item) { // 编辑
      this.transformerItem = item;
      this.dialogVisible = true
      console.log('编辑:', item);
    },
    resetDialogForm () {
      this.$refs.transformerEditor && this.$refs.transformerEditor.cancle()
    },
    showSelf (event, displayType = 'block') {
      let ele = event.srcElement ? event.srcElement : event.target
      ele.style.display = displayType;
    },
    meterInfoFilter (value) {
      console.log('value', value)
      let arr = value ? value.split(',') : []
      if (arr.length < 2) return value
      // if (arr.length < 6) return arr.join(',<br/>')
      arr = arr.slice(0, 4)
      arr.push('......')
      // return arr.join('，<br/>')
      console.log('arr', arr)
      return arr.map(item => (`<section>${item}</section>`)).join('')
    }
  },
  filters: {
    meterInfoFilter: this.meterInfoFilter
  }
}
</script>
<style lang="scss" scoped>
.transformer-management {
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
    height: calc(100% -68px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-bottom: 20px;
    .personal-card {
      position: relative;
      display: inline-block;
      width: 530px;
      height: 290px;
      padding-right: 150px;
      margin: 0 0 20px 0;
      overflow: hidden;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.02);
      text-align: left;
      border: 1px solid rgba(219, 219, 219, 1);
      border-radius: 20px;
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
      .left-card {
        font-size: 14px;
        padding: 29px 10px 10px;
        color: #333333;
        .line {
          position: relative;
          padding-left: 100px;
          min-height: 40px;
          line-height: 40px;
          color: #333333;
          .label {
            position: absolute;
            left: 8px;
          }
          .value {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            word-wrap: break-word;
            &.branchInfo {
              padding-top: 10px;
              line-height: 16px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }
          /deep/ section {
            max-width: 255px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .img-card {
        position: absolute;
        right: 28px;
        top: 22px;
        width: 128px;
        height: 185px;
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
        .editor {
          display: inline-block;
          padding: 0 10px;
          vertical-align: middle;
          font-size: 16px;
          color: white;
          &:hover {
            color: rgba(25, 130, 191, 0.8);
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
}
</style>
