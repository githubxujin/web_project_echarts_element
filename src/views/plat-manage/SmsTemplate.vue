<template>
  <div class="inspection">
    <div class="u-layout-search u-layout-dobule">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">短信标题：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-input v-model.trim="title" :clearable="true" placeholder="请输入短信标题"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">短信内容：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <!--el-ui 根据需求增加配置-->
                <el-input v-model="content" :clearable="true" placeholder="请输入短信内容"></el-input>
              </div>
            </div>
          </div>
        </div>

        <div class="u-layout-left-item">
          <div class="title-input-group">
            <p class="text">状态：</p>
            <div class="input-container">
              <div style="border-radius: 2px;" class="item select-input">
                <el-select v-model="status" :clearable="true" placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="u-layout-left-item">
          <el-button
            @click="query"
            icon="el-icon-search"
            class="el-button el-button--primary el-button--small is-round"
          >查询</el-button>
        </div>
      </div>
      <div class="u-layout-right-item">
        <el-button
          type="primary"
          size="mini"
          v-if="pageBtns.some(val=>val=='add')"
          @click="set"
        >推送配置</el-button>
      </div>
      <div class="u-layout-right-item">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          v-if="pageBtns.some(val=>val=='add')"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <div style="padding-left:40px;height:630px;	overflow: auto;	overflow-x: hidden;">
      <div
        class="sms"
        v-bind:style="{backgroundImage:'url('+returnPath+')'}"
        v-for="(item,index) in list"
        :class="{'bg_gray':item.status === 1}"
        :key="index"
      >
        <div class="smstitle">{{item.title.length>20?item.title.substring(1,20)+'...':item.title}}</div>
        <div
          class="smscontent"
        >{{item.content.length>99?item.content.substring(1,99)+'......':item.content}}</div>
        <div
          class="smsbottom"
          icon="el-icon-search"
          v-if="pageBtns.some(val=>val=='edit')"
          @click="edit(item)"
        >
          <i class="el-icon-edit-outline"></i>
          编辑
        </div>
      </div>
    </div>
    <pager :pager="pager" @query="query" @setPager="setPager" :pageSize="[6,12,24]"></pager>

    <el-dialog :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <span slot="title">{{eTitle}}</span>

      <EditSms :dialogVisible.sync="dialogVisible" :smsInfo="smsInfo" v-if="dialogVisible"></EditSms>
    </el-dialog>

    <el-dialog :visible.sync="configdialogVisible" width="40%" :close-on-click-modal="false">
      <span slot="title">{{eTitle}}</span>

      <EditConfigure :configdialogVisible.sync="configdialogVisible" v-if="configdialogVisible"></EditConfigure>
    </el-dialog>
  </div>
</template>

<script>
import datePick from "@/components/timerange/index";
import { getSmsList } from '@/services/plat-manage';
import EditConfigure from './EditConfigure'
import EditSms from './EditSms'
import pager from "@/components/table/Pager";
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: { datePick, EditSms, EditConfigure, pager },
  data () {
    return {
      eTitle: '编辑模版',
      smsInfo: {},
      title: '',
      dialogVisible: false,
      configdialogVisible: false,
      list: [],
      echartwidth: '100%',
      tablewidth: '100%',
      isdata: false,
      value: '', content: '',
      pager: {
        total: 0,
        pageSize: 6,
        pageNum: 0
      }, status: '', statusOptions: [{
        label: '全部',
        value: ''
      }, {
        label: '启用',
        value: '0'
      }, {
        label: '禁用',
        value: '1'
      }]
    }
  },
  computed: {
    returnPath () {
      return require('../../assets/images/common/sms.png');
    }
  },
  created () {

  }, mounted () {
    this.query();
  },
  methods: {
    query () {
      let topShopNumers = '', that = this;
      this.checkedShopNumbers.forEach(function (v, i) {
        topShopNumers += v;
        if (that.checkedShopNumbers.length - 1 != i) {
          topShopNumers += ','
        }
      });
      getSmsList({        shopNumber: topShopNumers, status: this.status, title: this.title, content: this.content, pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize      }).then((res) => {
        this.list = res.data.list;
        this.pager.total = res.data.total;
      }).catch((error) => {
        console.log(error)
      })

    }, setPager (val) {
      this.pager.pageSize = val.pageSize;
      this.pager.pageNum = val.pageNum;

    },
    checkedTime (res) {
      console.log('getTime:' + JSON.stringify(res));
    },
    get_Data () {
      this.isdata = true;
    },
    add () {
      this.dialogVisible = true;
      this.configdialogVisible = false;
      this.eTitle = '新增短信模版';
      this.smsInfo = {};
    },
    set () {
      this.eTitle = '短信推送配置';
      this.configdialogVisible = true;
      this.dialogVisible = false;
    },
    getCharts () {
      this.isdata = false;
    }, edit (item) {
      this.eTitle = "编辑短信模版";
      this.smsInfo.templateId = item.templateId;
      this.smsInfo.title = item.title;
      this.smsInfo.content = item.content;
      this.smsInfo.id = item.id;
      this.smsInfo.status = item.status;
      this.dialogVisible = true;
    }
  }, watch: {
    dialogVisible: {
      handler: function (newval, oldval) {
        if (newval == 1 && oldval == true) {
          this.dialogVisible = false;
          this.query();
        }
      }
    },   //门店编码
    checkedShopNumbers: {
      handler (val) {
        this.query();
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
$defaultFontColor: #3a3a3a;
$defaultGrayBorder: #c3c9d5;
$defaultGrayBg: #f7f7f7;

.sms {
  /*background-color: #19b5f2;*/
  width: 500px;
  height: 272px;
  border: 1px solid #c3c9d5;
  border-radius: 32px;
  float: left;
  margin-left: 20px;
  margin-top: 20px;
  color: #ffffff;
  background-size: 500px 272px;
  background-repeat: no-repeat;
  &.bg_gray {
    -moz-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
  /*opacity:0.1;*/
}

.smstitle {
  /*  padding-left: 200px;*/
  text-align: center;
  padding-top: 20px;
  font-size: 20px;
}
.smscontent {
  padding: 10px 20px 10px 20px;
  font-size: 18px;
  height: 156px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
.smsbottom {
  font-size: 17px;
  display: none;
  text-align: center;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
  height: 35px;
  background: #000;
  filter: alpha(Opacity=60);
  -moz-opacity: 0.6;
  opacity: 0.4;
}
.sms:hover .smsbottom {
  display: block;
}

.text-ipt {
  padding: 0 10px;
  border: 0;
  outline: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
}

.title-input-group {
  position: relative; //遮罩层用
  display: inline-block;
  width: auto;
  height: 30px;
  color: $defaultFontColor;

  .radio-input {
    line-height: 30px;
    border: none !important;
  }
  .checkbox-input {
    border: none !important;
  }

  /*搜索*/
  .search-input {
    position: relative;
    font-size: 14px;

    .text-ipt {
      padding: 0 20px 0 30px;
    }

    .clear-icon,
    .search-icon {
      position: absolute;
      width: 14px;
      height: 14px;
      top: 50%;
      margin-top: -8px;
      cursor: pointer;
      opacity: 0.8;
    }

    .clear-icon {
      right: 10px;
      display: none;
    }

    .search-icon {
      left: 5px;
    }
  }

  .input-container:hover .search-input .clear-icon {
    display: block;
  }

  .disable-mark {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    cursor: not-allowed;
    display: none;
  }
}

//禁用
.title-input-group.disabled {
  opacity: 0.5;

  .disable-mark {
    display: block;
  }
}

.title-input-group .item.dobule-text {
  .ipt {
    height: 100%;
    width: 49%;
    background: #f7f7f7;
    padding: 5px;
    box-sizing: border-box;
  }

  .ipt.left {
    float: left;
  }
  .ipt.right {
    float: right;
  }
}

//灰色主题
.title-input-group.gray {
  .input-container {
    .item.text-input,
    .item.select-input,
    .item.search-input,
    .item.tree-box {
      background: $defaultGrayBg;
    }

    .text-ipt {
      background: $defaultGrayBg;
    }

    .item.dobule-text {
      .ipt {
        background: #f7f7f7;
      }
    }

    .item .el-select {
      width: 100%;
    }
    .item.textarea {
      background: $defaultGrayBg;
    }
  }
}

//无边框
.title-input-group.no-border {
  .input-container {
    .item {
      border: 0;
    }
  }
}

//error
.title-input-group .rule.error,
.title-input-group.no-border .rule.error {
  border: 1px solid #ff2222;
}
.inspection .el-range-editor--small.el-input__inner {
  border-radius: 16px;
  width: 215px;
}
.el-Alter .el-input__inner {
  border: 0;
  background: rgba(0, 0, 0, 0);
}
.el-Alter .el-input--small .el-input__inner {
  border: 1px solid #ccc;
}

.el-input__inner {
  border-radius: 3px !important;
  background: #ffffff;
  border-color: #ffffff;
}

.dialog-header {
  color: white;
}
</style>
