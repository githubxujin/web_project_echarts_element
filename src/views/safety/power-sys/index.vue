<template>
  <div class="power-sys p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane name="default">
          <template slot="label">
            <span class="fl">供配电系统</span>
            <el-tooltip v-if="!isEmptyData" class="item" effect="dark" placement="right-start">
              <div class="u-tooltip" slot="content">
                <p v-for="(item,index) in distributionBranch.alarmList" :key="'alarmList'+item.id">
                  {{++index}} {{item.name}}
                  <a class="u-look" :href="'#isExe_'+item.id">查看</a>
                </p>
              </div>
              <span
                class="u-tag"
                v-if="distributionBranch.alarmList&&distributionBranch.alarmList.length>0"
              >
                故障
                <i class="u-num">{{distributionBranch.alarmList.length}}</i>
              </span>
            </el-tooltip>
          </template>
          <div class="power_content">
            <span
              class="video iconfont icon-shipin"
              @click="videoModelVisible = true"
              title="查看视频监控"
            ></span>
            <!-- <div class="u-left-top"></div> -->
            <template v-if="!isEmptyData">
              <div class="t-explain">{{distributionBranch.powerDescription}}</div>
              <div class="u-capacitor">
                <div>
                  <span>状态：</span>
                  <span>{{distributionBranch.capacitorInfo.status}}</span>
                </div>
                <div>
                  <span>电容：</span>
                  <span>{{distributionBranch.capacitorInfo.val}}</span>
                </div>
              </div>
            </template>
            <div
              id="power_info_warp"
              class="power_info_warp"
              v-bind:style="{'overflow-x':isEmptyData?'hidden':'auto'}"
            >
              <div class="header_info clearfix">
                <div class="middle">
                  <ul class="clearfix">
                    <li
                      :class="{power_active:active ==item.id}"
                      @click="getPowerBranch(item, index)"
                      v-for="(item, index) in powerNameList"
                      :key="'powerNameList'+item.id"
                    >
                      <i v-if="index%2==0" class="dot"></i>
                      <span class="power-name">{{item.name}}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <template v-if="!isEmptyData">
                <p class="header-title">{{distribution}}低压配电系统图</p>
                <ul class="temperature">
                  <li>室内环境温度：{{distributionBranch.temperature}}</li>
                  <li>相对湿度：{{distributionBranch.humidity}}</li>
                  <li>
                    水浸状态：
                    <span v-if="distributionBranch.waterStatus=='-'">-</span>
                    <i
                      v-else
                      class="water-out-status iconfont icon-jinggao"
                      :class="distributionBranch.waterStatus==1?'alarm':'normal'"
                    ></i>
                  </li>
                </ul>
                <div class="power_info_list">
                  <div class="line"></div>
                  <div id="left_img" class="left_img" ref="left_img">
                    <div
                      v-for="(subItem,baseIndex) in distributionBranch.baseBranchList"
                      class="img_list"
                      :key="'baseBranchList'+baseIndex"
                    >
                      <span v-if="subItem.branchOrder" v-text="subItem.branchOrder">1111</span>
                      <img v-bind:src="getImg(subItem.branchType,subItem.branchOpenStatus)" alt />
                    </div>
                    <template v-for="(item,branchIndex) in distributionBranch.branchList">
                      <div class="div_pd_container" :key="'branchList'+branchIndex">
                        <div class="title_pd">
                          <span
                            class="top_pd"
                            :title="item.parentOrder"
                            v-if="item.parentOrder"
                            v-text="item.parentOrder"
                          ></span>
                          <span class="line_vertical"></span>
                        </div>
                        <div class="div_pd">
                          <div
                            class="img_pd_container"
                            :style="{width:item.branchInfos.length*72+'px'}"
                          >
                            <div
                              v-for="(subItem,branchInfoIndex) in item.branchInfos"
                              :key="'branchInfos'+branchInfoIndex"
                              class="img_list_pd"
                            >
                              <span
                                v-if="subItem.branchOrder"
                                :title="subItem.branchOrder"
                                v-text="subItem.branchOrder"
                              >4444</span>
                              <img
                                v-bind:src="getImg(subItem.branchType,subItem.branchOpenStatus)"
                                alt
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="left-table">
                  <div class="block">
                    <p class="block-title">电压（V）</p>
                    <div class="block-content">
                      <dd
                        class="dd3"
                        v-for="(item,index) in distributionBranch.voltage"
                        :key="'voltage'+index"
                        :class="getTempColor(index)"
                      >{{item.name}}{{item.data}}</dd>
                    </div>
                  </div>
                  <div class="block">
                    <p class="block-title">三相温度(℃)</p>
                    <div class="block-content">
                      <dd
                        class="dd3 data"
                        v-for="item in distributionBranch.temperatures"
                        :key="'temperatures'+item.name"
                      >{{item.name}}</dd>
                      <dd
                        class="dd3"
                        v-for="(item,index) in distributionBranch.temperatures"
                        :key="'temperatures'+index"
                        :class="getTempColor(index)"
                      >{{item.data}}</dd>
                    </div>
                  </div>
                  <div class="block">
                    <el-row>
                      <el-col :span="8">功率因数</el-col>
                      <el-col :span="8">{{distributionBranch.factors[0].name}}</el-col>
                      <el-col :span="8" class="data">{{distributionBranch.factors[0].data}}</el-col>
                    </el-row>
                    <template v-for="(item,index) in distributionBranch.factors">
                      <dd :key="'factors'+item.name" class="dd3 data" v-if="index>0">{{item.name}}因数</dd>
                    </template>
                    <template v-for="(item,index) in distributionBranch.factors">
                      <dd
                        v-if="index>0"
                        :key="'factors'+index"
                        :class="getTempColor(index)"
                        class="dd3"
                      >{{item.data}}</dd>
                    </template>
                  </div>
                  <div class="block two">
                    <el-row>
                      <el-col :span="8">负载率</el-col>
                      <el-col :span="8" class="data">风机</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8" class="data">{{distributionBranch.loadRate}}</el-col>
                      <el-col :span="8">
                        <img
                          class="img-fan"
                          v-if="distributionBranch.fan.status==1"
                          src="../../../assets/images/circuit/fengshan.gif"
                        />
                        <span v-else>-</span>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <dl class="left_power_name" v-show="!this.isEmptyData">
                  <dt id="dt_head">参数</dt>
                  <dd
                    v-for="(item,index) in left_power_name"
                    :key="'power_name'+index"
                    class="dd"
                  >{{item}}</dd>
                </dl>
                <div class="power_info_table clearfix">
                  <el-table
                    :data="tableData"
                    header-row-class-name="table_header"
                    stripe
                    row-class-name="table_row"
                  >
                    <el-table-column
                      v-for="(item,index) in tableHeader"
                      :prop="'powername'+(index+1)"
                      :title="item.name"
                      :label="item.name"
                      :key="'tableHeader'+index"
                      :class-name="curAnchor=='isExe'+'_'+index?'highlight':''"
                      v-bind:width="getColWidth(index,item.isMiddle)"
                    >
                      <template slot-scope="scope">
                        <el-popover
                          v-if="scope.$index==6"
                          placement="top"
                          width="460"
                          trigger="click"
                        >
                          <el-row v-if="curAlarmList&&curAlarmList.length==0">
                            <el-col :span="24" class="empty-info">暂无数据</el-col>
                          </el-row>
                          <el-row
                            v-else
                            v-for="(alarm,rIndex) in curAlarmList"
                            :key="'curAlarmList'+rIndex"
                          >
                            <el-col :span="14">
                              <span class="i-info" @click="goToPage(alarm.id)">{{alarm.alarmName}}</span>
                            </el-col>
                            <el-col
                              :span="10"
                              class="pl20"
                            >{{alarm.alarmTime|timeFormat('YYYY-MM-DD HH:mm:ss')}}</el-col>
                          </el-row>
                          <span
                            slot="reference"
                            class="info iconfont icon-guanyu1"
                            @click="lookAlarmInfo(item)"
                          ></span>
                        </el-popover>
                        <span
                          v-else-if="scope.$index==0"
                          v-text="scope.row['powername'+(index+1)]"
                          :id="'isExe'+'_'+index+'A'"
                          v-bind:class="[{exe:scope.row['isExe'+(index+1)]==true}]"
                        ></span>
                        <span
                          v-else
                          v-text="scope.row['powername'+(index+1)]"
                          v-bind:class="[{exe:scope.row['isExe'+(index+1)]==true}]"
                        ></span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
              <template v-else>
                <empty-data msg="暂无数据" height="500px"></empty-data>
              </template>
            </div>
          </div>
          <!-- 监控视频弹窗 -->
          <el-dialog :visible.sync="videoModelVisible" width="800px" :close-on-click-modal="false">
            <span slot="title" class="dialog-header">查看视频监控</span>
            <power-video
              :videoMonitorList="videoMonitorList"
              :videoModelVisible.sync="videoModelVisible"
            ></power-video>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import utils from "../../../utils/utils";
import { initWebSocket } from "@/utils/websocket";
import { describeBranch, branchParamsList } from "../../../mock/mock.js";
import { transformerGetArray, videoMonitorArray } from '../../../services/system-settings.js'
import { getEleSafeList, getRecentAlarmListByMeter } from '../../../services/safety';
import EmptyData from '@/components/form/EmptyData';
import $ from 'jquery';
import PowerVideo from './PowerVideo';
export default {
  components: {
    EmptyData,
    PowerVideo
  },
  data () {
    return {
      activeName: 'default',
      /*支路信息列表*/
      distributionBranch: {},// describeBranch.data,
      distribution: '',
      left_power_name: ['Ia(A)', 'Ib(A)', 'Ic(A)', 'P(kw)', '状态', '通讯', '记录'],
      //--------------------------------------------
      curBrunchCode: '',//当前选中的支路Code
      //变压器列表
      powerNameList: [],
      startLeft: 0,
      lineWidth: '100%',
      tableHeader: [],// branchParamsList.data.tableHeader,
      tableData: [],// branchParamsList.data.tableData,
      curTransformerId: '',//当前选中的变压器ID
      websocketInstance: null, //websocket对象
      curAnchor: '',//当前锚点
      curAlarmList: [],//当前选中支路的报警数据
      pageWidth: '100%',//页面宽度
      videoMonitorList: [],
      videoModelVisible: false,
      active: '' //当前选中的变压器Id
    }
  },
  created () {
    // console.log('this.$route', this.$route)
    this.curAnchor = this.$route.hash ? this.$route.hash.substring(1) : ''; //锚点移除前面的#字符
    this.initData();
  },
  mounted () {
    this.initViewWidth();
  },
  computed: {
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
    isEmptyData: function () {
      return this.tableHeader.length == 0;
    }
  },
  watch: {
    shopNumber (val) {
      this.initData();
    },
    tableData: {
      immediate: true,
      handler: function () {
        this.$nextTick(_ => { // 每次数据更新 并更新完dom后刷新下宽度
          let ele = document.getElementsByClassName('el-table')[0]
          if (!ele) return
          // let tableWidth = window.getComputedStyle(ele, null).getPropertyValue("width")
          // let eleToSet = document.getElementsByClassName('power_info_list')[0]
          // if (eleToSet) eleToSet.style.width = tableWidth
        })
      }
    },
    '$route': function (to, from) { // 路由改变时执行         
      console.log('this.$route', this.$route, to)
      this.curAnchor = this.$route.hash ? this.$route.hash.substring(1) : '';
      if (this.$route.hash) {
        let index = this.$route.hash.indexOf('_');
        let val = index != -1 ? this.$route.hash.substring(index + 1) : '';
        console.log('val :', val);
        var total = 0;
        if (val) {
          total = parseInt(val) * 72;
        }
        var target = $(this.$route.hash + 'A');
        console.log('target :', target, total);
        if (target && target.length == 1) {
          var left = total;
          if (left >= 0) {
            $('#power_info_warp').animate({ scrollLeft: left }, 1000);
          }
        }
      }
      // console.log('this.curAnchor :', this.curAnchor);
    }
  },
  methods: {
    //创建socket对象
    createdSocket () {
      let that = this;
      if (that.isEmptyData) return;
      return initWebSocket({
        transformerId: this.curTransformerId,
        shopNumber: this.shopNumber
      },
        function (result) {
          console.log('收到供配电的消息', result);
          that.refreshData(result);
        },
        '/ws/safeManage/eleSafe/websocket'
      );
    },
    //刷新界面数据
    refreshData (res) {
      if (res.data && res.data != {}) {
        this.distributionBranch = res.data;
        this.tableHeader = res.data.tableHeader;
        if (res.data.tableHeader.length == 0) {
          this.tableData = [];
        } else {
          this.tableData = res.data.tableData;
        }
        this.initViewWidth();
      }
    },
    //初始化数据
    initData () {
      transformerGetArray({ shopNumber: this.shopNumber }).then(res => {
        if (res.code == 200 && res.data.array.length > 0) {
          this.powerNameList = res.data.array;
          this.powerNameList[0].active = true;
          //根据变压器ID获取支路列表
          this.curTransformerId = this.powerNameList[0].id;
          this.active = this.curTransformerId;
          this.distribution = this.powerNameList[0].name;
          this.getDistributionBranch();
        }
      });
      videoMonitorArray({ shopNumber: this.shopNumber, type: 1 }).then((res) => {
        if (res.code === 200 && res.data.array.length > 0) {
          this.videoMonitorList = res.data.array;
        }
      })
    },
    //查看报警信息，取当前支路最近三条
    lookAlarmInfo (item) {
      // console.log('item :', item);
      // item.id = 57226;
      getRecentAlarmListByMeter({ meterId: item.id }).then(res => {
        if (res.code == 200 && res.data.length > 0) {
          this.curAlarmList = res.data;
        }
      })
    },
    //跳转到新页面
    goToPage (id) {
      this.$router.push({ path: '/safety/alarm/view', name: 'AlarmView', params: { referer: '/safety/power-sys', id: id } });
    },
    //获取温度颜色
    getTempColor (index = 0) {
      let colors = ['warning', 'normal', 'danger'];
      return index <= 2 ? colors[index] : 'data';
    },
    //初始化界面宽度
    initViewWidth () {
      let totalWidthVal = 540 + this.tableHeader.length * 72;
      var domWidth = totalWidthVal + "px";//130 + 200
      this.pageWidth = totalWidthVal < 1024 ? '100%' : domWidth;
      var domWidth2 = 240 + this.tableHeader.length * 73 + "px";
      domWidth2 = this.isEmptyData ? '100%' : domWidth2;

      console.log('domWidth:', domWidth, domWidth2);
      let power_info_list = document.getElementsByClassName("power_info_list");
      if (power_info_list && power_info_list.length > 0) {
        power_info_list[0].style.width = domWidth;
        var height = this.isEmptyData ? '90px' : 'auto';
        power_info_list[0].style.height = height;
      }
      let table_body_wrapper = document.getElementsByClassName("el-table__body-wrapper");
      if (table_body_wrapper && table_body_wrapper.length > 0) {
        table_body_wrapper[0].style.width = domWidth2;
        table_body_wrapper[0].style.width = domWidth2;
      }

      setTimeout(function () {
        let hasGutter = document.getElementsByClassName("has-gutter");
        if (hasGutter && hasGutter.length > 0) {
          let leftThHeight = hasGutter[0].clientHeight - 1;
          console.log('leftThHeight:' + leftThHeight)
          document.getElementById("dt_head").style.height = leftThHeight + 'px';
          document.getElementById("dt_head").style.lineHeight = leftThHeight + 'px';
        }
      }, 100);
    },
    //设置支路参数列宽
    getColWidth (index, isMiddle) {
      var res = 0;
      var increments = isMiddle == true ? 0 : 6;
      switch (index) {
        case 0:
          res = 78;
          increments = 0;
          break;
        default:
          res = 73;
          break;
      }
      return res + increments;
    },
    //获取图片
    getImg (ELECTRICTYPE, state) {
      var _img = '';
      switch (ELECTRICTYPE) {
        case 0:
          _img = state == 1 ? 'byqon.png' : 'byqoff.png';
          break;
        case 1:
          _img = state == 1 ? 'dianrongon.png' : 'dianrongoff.png';
          break;
        case 2:
          _img = state == 1 ? 'lianluoon.png' : 'lianluooff.png';
          break;
        default:
          _img = state == 1 ? 'dianbiaoon.png' : 'dianbiaooff.png';
          break;
      }
      return require('../../../assets/images/circuit/' + _img);
    },
    /*切换变压器*/
    getPowerBranch (item, index) {
      console.log('getPowerBranch', item);
      this.active = item.id;
      this.distributionBranch.powerDescription = item.remark;
      this.distribution = item.name;
      this.curTransformerId = item.id;
      //根据变压器ID获取支路列表
      this.getDistributionBranch();
    },
    /*根据变压器ID获取支路信息列表*/
    getDistributionBranch () {
      getEleSafeList({ transformerId: this.curTransformerId }).
        then(res => {
          if (res.code === 200 && JSON.stringify(res.data) != "{}") {
            console.log('支路信息', res.data)
            this.distributionBranch = res.data;
            console.log('distributionBranch:', this.distributionBranch);
            this.tableHeader = res.data.tableHeader;
            if (res.data.tableHeader.length == 0) {
              this.tableData = [];
            } else {
              this.tableData = res.data.tableData;
              this.initViewWidth();
            }
            if (this.websocketInstance) {
              this.websocketInstance.close();
            }
            this.websocketInstance = this.createdSocket();
          }
        });
    },
  },
  //页面销毁时关闭长连接
  destroyed () {
    if (this.websocketInstance) {
      this.websocketInstance.close()
    }
  },
}
</script>

<style lang="scss" scoped>
@import './part.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>
<style lang="scss" scoped>
.video {
  font-size: 40px;
  position: absolute;
  right: 30px;
  top: 10px;
  z-index: 999;
  cursor: pointer;
}
.empty-info {
  text-align: center;
}
.power-sys {
  .alarm {
    color: #dd1b00;
  }
  .power-name {
    float: left;
  }
  .normal {
    color: green;
  }
  .power_info_warp {
    overflow: auto;
    box-sizing: border-box;
    > div {
      box-sizing: content-box;
    }
    .power_info_list {
      overflow: hidden;
    }
    .power_info_table {
      display: block;
      position: relative;
      margin-left: 0px;
      padding-left: 361px;
      .left_power_name {
        position: absolute;
        left: 0;
        margin-top: -10px;
      }
      /deep/ .el-table {
        overflow: visible;
        max-width: none;
        width: auto;
      }
    }
  }
}
</style>

<style lang="sass">
.el-tooltip__popper {
.u-tooltip {
  max-height: 200px;
  overflow-y: auto ;
}
}
</style>
