<template>
  <div class="p-container">
    <div class="sub-nav single">
      <el-tabs v-model="activeName">
        <el-tab-pane label="示意图" name="default">
          <div class="u-layout-container metermon_content">
            <div
              v-if="meterMonitor!=null"
              class="metermon_info"
              ref="meter"
              :style="{height:containHeight}"
            >
              <div class="metermon_list_img">
                <div class="info_list_warp">
                  <ul class="left">
                    <li>正常</li>
                    <li>中断</li>
                  </ul>
                  <ul class="right">
                    <li>在线率10%以下</li>
                    <li>在线率10%~20%</li>
                    <li>在线率20%~80%</li>
                    <li>在线率80%~90%</li>
                    <li>在线率90%以上</li>
                  </ul>
                </div>
                <div class="top_img" :style="{'left':containerStyle.topImgLeft}">
                  <img src="../../../assets/images/meter/meter2.png" alt />
                  <div
                    class="line"
                    :class="'line'+(index+1)"
                    :style="{left:((2*index+1)/(2*meterMonitor.length))*248+'px'}"
                    v-for="(item , index) in meterMonitor"
                    :key="index"
                  ></div>
                </div>
                <div class="metermon_warp">
                  <div style="position: absolute;">
                    <div class="top_line" v-bind:style="{left:style.left,width:style.width}"></div>
                    <div
                      class="metermon_left"
                      :class="'metermon_left'+index"
                      :style="{left:item.left+'px'}"
                      v-for="(item,index) in meterMonitor"
                      :key="item.collectorId"
                    >
                      <div class="left_top">
                        <img src="../../../assets/images/meter/meter1.png" alt class="fl" />
                        <div
                          class="line"
                          :class="'line_'+(index1+1)"
                          :style="{left:((2*index1+1)/(2*item.coms.length))*100+'%'}"
                          v-for="(ele,index1) in item.coms"
                          :key="ele.comId"
                        ></div>
                      </div>
                      <div class="collection_msg fl">
                        <span
                          class="cicle fl"
                          v-bind:class="getClassByStatus(item.collectorStatus)"
                        ></span>
                        <span class="home_percent home c90 fl">{{item.collectorOnlineRate}}%</span>
                        <span
                          class="collection_name fl"
                          :title="item.collectorName"
                        >{{item.collectorName}}</span>
                      </div>
                      <div class="left_list_warp" :style="{width:item.coms.length*274+'px'}">
                        <dl
                          :class="'list'+(index1+1)"
                          class="left_list"
                          v-for="(ele,index1) in item.coms"
                          :key="ele.comId"
                        >
                          <dt>
                            {{ele.comName}}
                            <br />电表
                          </dt>
                          <dd v-for="(item2) in ele.meters" :key="item2.meterId">
                            <div
                              class="home_num home"
                              v-bind:class="getClassByStatus(item2.status)"
                              @click="getMeterDetails(timelist[0],1,item2)"
                            >{{item2.meterValue}}</div>
                            <div
                              class="home_percent home"
                              v-bind:class="getClassByRate(item2.onlineRate)"
                            >{{item2.onlineRate}}%</div>
                            <div class="home_info" :title="item2.meterName">{{item2.meterName}}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <empty-data v-else msg="暂无监测数据" height="480px"></empty-data>
            <el-dialog
              v-dialogDrag
              :visible.sync="dialogTableVisible"
              :title="curTitle"
              class="metermon_dialog"
            >
              <div class="dialog_info_list">
                <ul class="left">
                  <li
                    :class="{acdate:item.active}"
                    @click="getMeterDetails(item,index+1)"
                    v-for="(item,index) in timelist"
                    :key="index"
                  >{{item.time}}</li>
                </ul>
                <div class="dateClass" v-if="showTime">
                  日期：
                  <el-date-picker
                    v-model="queryHistoryDate"
                    value-format="yyyy-MM-dd"
                    @change="timeChange"
                    type="date"
                    placeholder="请选择时间"
                    size="mini"
                  ></el-date-picker>
                  <div class="fontClass">
                    <span style="color: red;">*</span>
                    <span>只显示3天内的数据</span>
                  </div>
                </div>
                <div class="right">
                  <span>优化建议：</span>
                  {{meterstatu}}
                </div>
              </div>
              <el-table
                :data="meterDetail"
                stripe
                border
                header-row-class-name="metermon_table_header"
                height="360"
              >
                <el-table-column prop="branchValue" label="表计读数(kWh)">
                  <template slot-scope="scope">{{scope.row.meterValue|emptyDefault}}</template>
                </el-table-column>
                <el-table-column prop="status" label="表计状态" align="center">
                  <template slot-scope="scope">{{StatusArrays[scope.row.status]}}</template>
                </el-table-column>
                <el-table-column prop="reportTime" label="报告生成时间" align="center"></el-table-column>
              </el-table>
              <div class="dialog_info_close">
                <el-button size="mini" round @click="dialogTableVisible=false">关闭</el-button>
              </div>
            </el-dialog>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import datetimeUtils from "../../../utils/datetime-utils";
import { StatusArrays, getClassByRateFun } from './index.js';
import { getMeterMonitorData, getMeterMonitorHistoryData } from '../../../services/safety.js';
import EmptyData from '../../../components/form/EmptyData';
import { initWebSocket, sendWsData } from "@/utils/websocket";

export default {
  name: 'meterMonitoring',
  components: {
    EmptyData
  },
  data () {
    return {
      StatusArrays,
      activeName: 'default',
      containHeight: '780px',
      timelist: [{ time: '今天', active: true, date: datetimeUtils.getPreDate(0) }, { time: '两天内', active: false, date: datetimeUtils.getPreDate(1) }, { time: '三天内', active: false, date: datetimeUtils.getPreDate(2) }, { time: '自定义', active: false, date: datetimeUtils.getPreDate(3) }],
      meterDetail: [],
      meterMonitor: [],
      meterstatu: '',
      gridData: [],
      dialogTableVisible: false,
      curMeterNumber: '', //当前选中分支编号
      // 顶部项目回调对象
      topProjectSelectSlotCbFun: {
        nodeFunction: this.topFunction
      },
      curSelectItem: {},//当前选择支路对象
      style: { width: '0px', left: '', marginLeft: 0 },
      containerStyle: {
        topImgLeft: '380px'
      },
      meterLeft: 0,//临时累加存值
      curTitle: '', //弹窗标题
      queryHistoryDate: datetimeUtils.getPreDate(0),//查询历史时间
      showTime: false,//显示查询历史数据时间
      websocketInstance: null, //websocket对象
    }
  },
  created () {
    this.queryType = this.$route.query.pmid;//接收参数-项目ID
    this.getMeterMonitor();
    this.websocketInstance = this.createdSocket();
  },
  mounted () {
    var that = this;
    that.$nextTick(() => {
      let tableHeight = window.innerHeight - 200;
      that.containHeight = tableHeight + 'px';
      console.log('tableHeight:' + window.innerHeight + ':' + tableHeight)
    })
  },
  computed: {
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
    //根据在线率返回建议信息
    metersTag: function () {
      var _metersTag = '';
      if (this.curSelectItem.onlineRate < 20) {
        _metersTag = '建议更换';
      } else if (this.curSelectItem.onlineRate >= 20 && this.curSelectItem.onlineRate <= 80) {
        _metersTag = '建议及时关注';
      } else if (this.curSelectItem.onlineRate > 80) {
        _metersTag = '处于正常状态'
      }
      return _metersTag;
    }
  },
  watch: {
    shopNumber (val) {
      console.log('shopNumber', val, this.websocketInstance)
      this.getMeterMonitor();
      if (this.websocketInstance) {
        this.websocketInstance.close()
      }
      this.websocketInstance = this.createdSocket();
    }
  },
  methods: {
    //创建socket对象
    createdSocket () {
      let that = this;
      return initWebSocket({ shopNumber: that.shopNumber },
        function (result) {
          console.log('收到监测的消息', result);
          that.refreshData(result);
        },
        '/ws/safeManage/commuMonitor/websocket'
      );
    },
    //时间改变
    timeChange (time) {
      if (!time) {
        this.$message.error("时间不能为空！")
        return;
      }
      // this.meterstatu = '设备三天内在线率' + this.curSelectItem.onlineRate + '%，' + this.metersTag;
      let tag = '三天内';
      this.getMeterDetailsFun(4, tag);
    },
    //采集器left
    metermonLeft (index, meterMonitor) {
      if (index == 0) {
        this.meterLeft = 0;
      } else {
        this.meterLeft += (meterMonitor[index - 1].coms.length == 0 ? 1 : meterMonitor[index - 1].coms.length) * 276 + 26;
      }
      console.log(meterMonitor.length)
      // 85是采集器图片的左侧宽度 ，248是交换机图片的宽度
      let pre = ((2 * index + 1) / (2 * meterMonitor.length)) * 248;
      return 85 + this.meterLeft + pre;
    },
    //刷新界面数据
    refreshData (res) {
      console.log('刷新')
      if (res.code == 200) {
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].left = this.metermonLeft(i, res.data);
          }
          this.meterMonitor = res.data;
        } else {
          this.meterMonitor = [];
        }
      } else {
        this.$message.error(res.msg);
      }
      this.calculateWidth();
    },
    /*获取表计数据*/
    getMeterMonitor () {
      this.$common.updateLoadingStatus(true);
      console.log('this.shopNumber :', this.shopNumber);
      getMeterMonitorData(this.shopNumber).
        then(res => {
          console.log('res', res)
          this.refreshData(res);
          this.$common.updateLoadingStatus(false);

        }).catch(() => {
          this.$common.updateLoadingStatus(false);
        });
    },
    //宽度计算
    calculateWidth () {
      var collectors = this.meterMonitor.length; //采集器数量

      if (collectors > 0) {
        let pre = collectors == 0 ? 0 : 1 / (2 * collectors) * 248;
        let leftMartgin = 85 + pre;
        let _lwidth = 174 + leftMartgin;     //线左边宽度
        let _lwidthStr = _lwidth - 1 + 'px'; //!important;
        var startLeft = this.meterMonitor[0].left;
        var endLeft = this.meterMonitor[this.meterMonitor.length - 1].left;
        var _lineWidth = endLeft - startLeft + 'px'; //线的宽度：最后一个的left-最前面一个的left
        //顶部线的布局
        this.style.width = collectors <= 1 ? 0 : _lineWidth;
        this.style.left = _lwidthStr;
        //交换机位置布局
        let _topImgLeft = 380;
        this.containerStyle.topImgLeft = _topImgLeft + 'px';
      } else {
        this.style.width = '0px';
      }
    },
    //根据在线率获取样式-颜色
    getClassByRate (val) {
      return getClassByRateFun(val);
    },
    //根据支路状态获取样式-颜色
    getClassByStatus (status) {
      return status == 1 ? "normal" : "abnormal";
    },
    getMeterDetailsFun (index, tag) {
      getMeterMonitorHistoryData({ dayType: index, shopNumber: this.shopNumber, meterNumber: this.curMeterNumber, queryTime: this.queryHistoryDate }).
        then(res => {
          if (res.code == 200) {
            this.meterDetail = res.data.dataList;
            this.curSelectItem.onlineRate = res.data.onlineRate;
            this.meterstatu = '设备' + tag + '在线率' + this.curSelectItem.onlineRate + '%，' + this.metersTag;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    /*打开历史详情页面获取历史数据*/
    getMeterDetails (item, index, selectItem) {
      console.log("item:", item, "index:", index, "selectItem:", selectItem)
      // this.queryHistoryDate = datetimeUtils.getPreDate(3);
      this.showTime = index == 4 ? true : false; //显示/隐藏 查询历史时间
      if (selectItem) {
        this.curTitle = selectItem.meterName + '历史数据';
        this.curSelectItem = selectItem;
        this.curMeterNumber = selectItem.meterNumber;
      }
      this.dialogTableVisible = true;
      this.timelist.forEach((ele, index) => {
        ele.active = false;
      })
      item.active = true;
      let tag = (index != 4 ? item.time : '三天内') || '';
      this.getMeterDetailsFun(index, tag);
    }
  },
  destroyed () {
    if (this.websocketInstance) {
      this.websocketInstance.close()
    }
  },
}
</script>
<style lang="scss" scoped>
/deep/ .el-input--mini .el-input__inner {
  height: 32px;
}
.dateClass {
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  margin-left: 30px;
  .fontClass {
    display: inline-block;
    font-size: 10px;
    color: gray;
  }
  .el-date-editor.el-input {
    width: 150px;
    // border-radius: 14px;
    font-size: 14px;
  }
}
.collection_msg {
  left: 50%;
  position: absolute;
  margin-left: 50px;
  width: 210px;
}
/*弹框*/
.dialog_info_close {
  text-align: center;
  margin-top: 10px;
}
.dialog_info_list {
  width: 100%;
  display: box;
  display: -webkit-box;
  display: flex;
  margin-bottom: 22px;
  .left li:nth-of-type(1),
  .left li:nth-of-type(2),
  .left li:nth-of-type(3) {
    border-right: 1px solid #c3c9d5;
  }
  .left {
    width: 185px;
    height: 32px;
    line-height: 32px;
    background: #fff;
    border: 1px solid #c3c9d5;
    border-radius: 2px;
    display: box;
    display: -webkit-box;
    display: flex;
    overflow: hidden;
    .acdate {
      color: #fff;
      background: $oneLevelBtnColor;
    }
    li {
      -webkit-box-flex: 1;
      flex: 1;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
    }
  }
  .right {
    -webkit-box-flex: 1;
    flex: 1;
    text-align: right;
    color: #3a3a3a;
    height: 32px;
    line-height: 32px;
  }
}

.metermon_content {
  background: #fff;
  height: 100%;
}
.metermon_info {
  margin: 0px 0px 0px 0px;
  min-height: 500px;
  position: relative;
  overflow-y: auto;
  .info_list_warp {
    font-size: 14px;
    color: rgba(58, 58, 58, 1);
    display: box;
    display: -webkit-box;
    display: flex;
  }
  .left {
    margin-right: 20px;
    margin-left: 25px;
    margin-top: 15px;
  }
  .right {
    margin-top: 15px;
    li {
      padding-left: 34px;
      &:after {
        content: '';
        display: block;
        width: 23px;
        height: 9px;
        border: 2px solid #f71c1c;
        border-radius: 7px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -7px;
      }
    }
  }
}
.metermon_info .left li,
.metermon_info .right li,
.collection_msg .cicle {
  position: relative;
  padding-left: 30px;
  height: 28px;
  line-height: 28px;
}

.metermon_info .left li:after,
.collection_msg .cicle:after {
  content: '';
  display: block;
  width: 14px;
  height: 14px;
  background: rgba(75, 196, 132, 1);
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -7px;
}
.collection_msg .cicle.abnormal:after {
  background: #f57272;
}
.collection_msg .cicle.normal:after {
  background: rgba(75, 196, 132, 1);
}
.left li:last-child:after {
  background: #f57272;
}
.right li:nth-of-type(2):after {
  border-color: #de7e0d;
}
.right li:nth-of-type(3):after {
  border-color: #5e47e4;
}
.right li:nth-of-type(4):after {
  border-color: #1780d9;
}
.right li:nth-of-type(5):after {
  border-color: #3fbc7a;
}
.metermon_list_img {
  width: 100%;
  position: relative;
  // margin-top: 27px;
  height: 100%;
}
/*关系列表图*/
.metermon_list_img {
  .top_img {
    width: 248px;
    /* margin: 0 auto; */
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 15px;
    .line {
      /* content:'';
    display: block; */
      width: 2px;
      height: 80px;
      background: #2274a4;
      position: absolute;
      /* left: 97px; */
      top: 24px;
    }
  }
  .metermon_warp {
    width: 100%;
    position: absolute;
    top: 118px;
    /*border-top:2px solid #2274A4;*/
  }
}

.top_line {
  display: block;
  width: 100%;
  height: 2px;
  background: #2274a4;
  position: absolute;
  top: 0px;
}
/*左侧模块*/
.metermon_left {
  position: absolute;
  /* left: 50%;
    transform: translateX(-50%); */
  top: 60px;
  width: 274px;
  .left_top {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    span {
      position: absolute;
      left: 50%;
      top: -16px;
      transform: translateX(-50%);
      color: #de5959;
      font-size: 14px;
      width: 100%;
    }
    &:after {
      content: '';
      display: block;
      width: 2px;
      height: 62px;
      background: #2274a4;
      position: absolute;
      right: 12px;
      top: -60px;
    }
  }
}
.metermon_left .left_top .line {
  width: 2px;
  background: #3fbc7a;
  position: absolute;
  top: 29px;
  height: 30px;
}
/*列表样式*/
.metermon_left .left_list_warp {
  display: -webkit-box;
  display: -webkit-flex;
  margin-top: 58px;
}
.metermon_left .left_list {
  width: 274px;
  font-size: 12px;
  border-left: 2px solid #3fbc7a;
  padding-top: 30px;
  border-top: 2px solid #3fbc7a;
  /* position: absolute; */
}
.metermon_left .left_list dt {
  color: #2274a4;
  font-size: 14px;
  padding-left: 12px;
  margin-bottom: 6px;
}
.metermon_left .left_list dd {
  display: box;
  display: -webkit-box;
  display: flex;
  margin-bottom: 12px;
}
.metermon_left .left_list .home,
.collection_msg .home {
  width: 90px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 12px;
}
.metermon_left .left_list .home_num {
  background: #3fbc7a;
  border: 1px solid #3fbc7a;
  color: #fff;
  cursor: pointer;
}
.metermon_left .left_list .home_percent,
.collection_msg .home_percent {
  border: 1px solid #3fbc7a;
  color: #3fbc7a;
  background: #fff;
}
.metermon_left .left_list .home_info {
  height: 24px;
  line-height: 24px;
  color: #3a3a3a;
  font-size: 14px;
  margin-left: 10px;
  width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.metermon_right .left_top {
  &:after {
    left: 30px;
  }
  &:before {
    width: 567px;
    left: -535px;
  }
}
</style>
<style lang="scss">
/*边框颜色*/
.metermon_left .left_list {
  .home_percent.c1 {
    border: 1px solid #f71c1c;
    color: #f71c1c;
  }
  .home_percent.c10 {
    border: 1px solid #de7e0d;
    color: #de7e0d;
  }
  .home_percent.c20 {
    border: 1px solid #5e47e4;
    color: #5e47e4;
  }
  .home_percent.c80 {
    border: 1px solid #1780d9;
    color: #1780d9;
  }
  .home_percent.c90,
  .collection_msg .home_percent.c90 {
    border: 1px solid #3fbc7a;
    color: #3fbc7a;
  }
  .home_num.abnormal {
    background: #f57272;
    border: 1px solid #f57272;
  }
  .home_num.normal {
    background: rgba(75, 196, 132, 1);
    border: 1px solid rgba(75, 196, 132, 1);
  }
}
.collection_msg .collection_name {
  height: 26px;
  line-height: 26px;
  margin-left: 4px;
  width: 85px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
