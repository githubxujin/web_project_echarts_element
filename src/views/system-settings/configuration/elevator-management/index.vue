<template>
  <div class="elevator-management p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="电梯管理" name="default">
          <el-form :inline="true" :model="form" class="search-bar" label-position="right">
            <el-form-item label="电梯名称：">
              <el-input v-model="form.name" placeholder="请输入电梯名称">
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
            <el-form-item class="float-right" v-if="pageBtns.some(val => val == 'add')">
              <el-button
                @click="$common.debounce(addNew)()"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              >新增</el-button>
            </el-form-item>
          </el-form>
          <div class="flex-box" v-if="dataListCopy.length">
            <div
              class="elevator-card"
              :key="index"
              v-for="(item, index) in dataListCopy"
              :class="{'hidden': !item.name}"
            >
              <header class="card-header" :class="{'disabled': ~~item.status === 1}">
                <span>{{item.name}}</span>
                <span class="float-right">{{item.status | translate(statusEnum)}}</span>
              </header>
              <section class="card-section">
                <empty-data v-if="!dataList.length && !$store.getters.getLoading" msg="暂无变压器数据" />
                <ul class="left-card">
                  <li class="line">
                    <span class="label">位置：</span>
                    <span class="value">{{item.location}}</span>
                  </li>
                  <li class="line">
                    <span class="label">楼层：</span>
                    <span class="value">{{item.lowerFloor}}-{{item.upperFloor}}层</span>
                  </li>
                  <li
                    class="line"
                    v-for="(item2, index2) in itemPropList"
                    :key="index2"
                    :class="{'volume': item2.prop === 'volume'}"
                  >
                    <span class="label">{{item2.label}}：</span>
                    <span
                      class="value"
                      :title="item2.dict ? translateBranch(item[item2.prop], item2.dict, item2.options) : item[item2.prop]"
                    >
                      <span
                        v-if="!item2.dict"
                      >{{!item[item2.prop] && item[item2.prop]!==0? '' : item[item2.prop]}}</span>
                      <span v-else>{{item[item2.prop] | branchFilter(item2.dict, item2.options)}}</span>
                      <span v-if="item2.unit" v-html="item2.unit">{{item2.unit}}</span>
                    </span>
                  </li>
                </ul>
                <div class="img-card">
                  <img
                    width="100%"
                    height="100%"
                    style="display:none;"
                    @load="showSelf($event)"
                    :src="elevatorImage"
                    alt="加载中..."
                  />
                </div>
              </section>
              <div class="handle-bar" v-if="pageBtns.some(val => val == 'edit')">
                <span class="editor" @click="editItem(item)">
                  <i class="el-icon-edit-outline" />
                  <span>编辑</span>
                </span>
              </div>
            </div>
          </div>
          <div class="flex-box" v-if="!dataListCopy.length">
            <p style="lineHeight: 200px;">暂无数据</p>
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
      <span slot="title" class="dialog-header">{{elevatorItem?'编辑电梯信息': '新增电梯设备'}}</span>
      <ElevatorEditor
        ref="elevatorEditor"
        :dialogVisible.sync="dialogVisible"
        :elevatorItem.sync="elevatorItem"
        :meterList="meterList"
        @success="search"
      ></ElevatorEditor>
    </el-dialog>
  </div>
</template>
<script>
import EmptyData from '@/components/form/EmptyData';
import { getBtnsByIndex } from '@/utils/permission.js';
import ElevatorEditor from './ElevatorEditor'
import utils from '@/utils/utils.js'
import { elevatorQuery, meterGetArray } from '@/services/system-settings.js'
import { statusEnum } from '@/enum/dicts.js'
import elevatorImage from '@/assets/images/elevator/elevator.png'
const translateBranch = function (
  value = '',
  dict = [],
  options = { value: 'id', label: 'name' }
) {
  if (!value && value !== 0) return ''
  let label = ''
  value = value.toString()
  for (let index = 0, len = dict.length; index < len; index++) {
    let dictValue = dict[index][options.value].toString()
    if (value === dictValue) {
      label = '[' + dict[index]['number'] + ']' + dict[index][options.label]
      break
    }
  }
  return label
}
export default {
  name: 'elevator-management',
  components: { EmptyData, ElevatorEditor },
  data () {
    return {
      elevatorImage,
      activeName: 'default',
      statusEnum: JSON.parse(JSON.stringify(statusEnum)), // 启用状态字典
      meterList: [], // 支路下拉列表
      dataList: [], // 电梯数组列表
      form: { // 表单查询数据
        name: '',
        shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber
      },
      elevatorItem: null, // 选中编辑或查看的电梯id
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
    itemPropList () {
      return [
        {
          label: '容积',
          prop: 'volume',
          unit: 'm<sup>3</sup>'
        },
        {
          label: '支路',
          prop: 'meterId',
          dict: this.meterList,
          options: {
            label: 'name',
            value: 'id'
          }
        },
        {
          label: '载重',
          prop: 'payLoad',
          unit: 'KG'
        },
        {
          label: '监控地址',
          prop: 'cameraIP'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
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
    this.initData()
    this.search()
  },
  methods: {
    translateBranch, // 翻译支路
    elevatorQuery,
    meterGetArray,
    initData () {
      const shopNumber = this.params.shopNumber
      this.meterGetArray({ shopNumber }).then(res => {
        this.meterList = (res.data || {}).array
      }).catch(_ => {
        console.error('支路下拉树获取失败(errorMessage):', _);
      })
    },
    search () { // 查询
      this.$common.updateLoadingStatus(true)
      this.elevatorQuery(this.params).then(res => {
        this.$common.updateLoadingStatus(false)
        this.dataList = (res.data || {}).list || []
      }).catch(_ => {
        console.error('查询变压器列表失败(errorMessage):', _);
        this.$common.updateLoadingStatus(false)
      })
    },
    addNew () { // 新增
      this.elevatorItem = null;
      this.dialogVisible = true
      console.log('新增变压器')
    },
    editItem (item) { // 编辑
      this.elevatorItem = item;
      this.dialogVisible = true
      console.log('编辑:', item);
    },
    resetDialogForm () {
      this.$refs.elevatorEditor && this.$refs.elevatorEditor.cancle()
    },
    showSelf (event, displayType = 'block') {
      let ele = event.srcElement ? event.srcElement : event.target
      ele.style.display = displayType;
    },

  },
  filters: {
    textFilter (str, len = 70) {
      if ((str || '').length < len + 1) return str
      let strCopy = str.toString().substr(0, len) + '...'
    },
    branchFilter: function (value = '',
      dict = [],
      options = { value: 'id', label: 'name' }) {
      return translateBranch(value, dict, options)
    }
  }
}
</script>
<style lang="scss" scoped>
.elevator-management {
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
  .flex-box {
    height: calc(100% - 68px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-bottom: 20px;
    .elevator-card {
      position: relative;
      display: inline-block;
      width: 392px;
      height: auto;
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
        height: 60px;
        line-height: 60px;
        background: #2eb34a;
        color: #fff;
        &.disabled {
          background: #b7b7b7;
        }
        .float-right {
          float: right;
        }
      }
      .card-section {
        padding-top: 60px;
        .left-card {
          display: inline-block;
          font-size: 14px;
          color: #333333;
          width: calc(100% - 160px);
          height: 100%;
          box-sizing: border-box;
          padding: 10px;
          .line {
            position: relative;
            padding-left: 80px;
            height: 40px;
            line-height: 40px;
            color: #333333;
            &.volume {
              .value {
                position: relative;
                top: -5px;
              }
            }
            .label {
              position: absolute;
              left: 10px;
            }
            .value {
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              word-wrap: break-word;
              height: 40px;
            }
          }
        }
        .img-card {
          position: absolute;
          right: 20px;
          top: 80px;
          width: 136px;
          height: 139px;
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
