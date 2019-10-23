<template>
  <div class="air-system">
    <span class="border left-top" />
    <span class="border right-top" />
    <span class="border left-bottom" />
    <span class="border right-bottom" />
    <card-head :title="title" :num="deviceData.warnNum" @goToPage="goToPage"></card-head>
    <div class="main-container">
      <div class="left-charts" @click="goToPage">
        <!--<v-guage :loadValue="airValue"></v-guage>-->
        <SvgScale :score="airValue"></SvgScale>
        <p class="Text">{{airValue}}</p>
        <span class="title">系统COP</span>
        <p class="info">冷负荷：{{coolingLoad}}kW</p>
        <p class="info">总功率：{{totalPower}}kW</p>
      </div>
      <div class="device-table" @click="goToPage">
        <table class="devices">
          <tr v-for="(item,index) in deviceData.tableData" :key="index">
            <td>{{item.name}}</td>
            <td>
              <ul class="detail-info">
                <li
                  class="item"
                  v-for="(sub,ind) in item.list"
                  :key="ind"
                  @mouseenter="showBox(index,ind)"
                  @mouseleave="hideBox(index,ind)"
                >
                  <span>{{sub.name}}</span>
                  <i class="run-status" v-show="sub.status===1"></i>
                  <i class="warn-status" v-show="sub.status===2"></i>
                  <i class="gray-status" v-show="sub.status===0"></i>
                  <div class="float-box" ref="floatBox">
                    <p>{{sub.name}}{{item.name}}</p>
                    <p>设备故障</p>
                  </div>
                </li>
              </ul>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import cardHead from './ShopCartHead';
import vChart from '@/components/echarts/index';
import vGuage from '@/components/Guage.vue';
import SvgScale from '@/components/SvgScale/SvgScale.vue';
import { getAirList } from '../../../services/safety.js';
export default {
  components: { cardHead, vChart, SvgScale },
  props: {
    shopNumber: {
      type: String
    },
    // itemData: {
    //   type: Object
    // }
  },
  data () {
    return {
      title: '空调系统',
      airValue: 0,
      coolingLoad: 0,
      totalPower: 0,
      deviceData: {
        warnNum: 0,
        tableData: [
          {
            name: '冷水机组',
            list: [
              { name: '1#', status: 0 },
              { name: '2#', status: 0, },
              { name: '3#', status: 0 },
              { name: '4#', status: 0 }
            ]
          },
          {
            name: '冷冻泵',
            list: [
              { name: '1#', status: 0 },
              { name: '2#', status: 0 },
              { name: '3#', status: 0 },
              { name: '4#', status: 0 },
              { name: '5#', status: 0 }
            ]
          },
          {
            name: '冷却泵',
            list: [
              { name: '1#', status: 0 },
              { name: '2#', status: 0 },
              { name: '3#', status: 0 },
              { name: '4#', status: 0 },
              { name: '5#', status: 0 }
            ]
          },
          {
            name: '冷却塔',
            list: [
              { name: '1#', status: 0 },
              { name: '2#', status: 0 },
              { name: '3#', status: 0 },
              { name: '4#', status: 0 },
              { name: '5#', status: 0 }
            ]
          }
        ]
      },
      showWarnningBox: [],
    }
  },
  created () {
    this.getState();
  },
  mounted () {
    this.initOption();
  },
  watch: {
    shopNumber (val) {
      this.getState();
    },
    itemData: {
      handler: function (val) {
        this.deviceData = val
      },
      deep: true
    }
  },
  methods: {
    initOption () {
      // this.getOptionData()
      this.handleList()
    },
    getState () {
      let CHW_RT = 0, CHW_ST = 0, CHW_FLOW = 0, LFH = 0, CHWP_VFD_PWR = 0, CWP_VFD_PWR = 0, CT_VFD_PWR = 0, CHL_PWR = 0, ZGL = 0;
      getAirList("?shopNumber=" + this.shopNumber).then((res) => {
        let rbj = res.data.list;
        let address, v, NO = 0;
        for (var i = 0; i < rbj.length; i++) {
          NO = 0;
          v = rbj[i].val;
          address = rbj[i].Address;
          if (!address) { continue; }
          if (address.substring(0, 3).indexOf('CHL') > -1 &&v > 0) {
            NO = parseInt(address.substring(3, 4));
            if (address.indexOf('_PWR') > -1&& address.length==8){
                this.deviceData.tableData[0].list[NO - 1].status = 1;
            }
              if (address.substring(address.length -8, address.length).indexOf('_VFD_ALM') > -1 && address.indexOf('SYS_') == -1) {
                debugger
                  this.deviceData.warnNum += v;
                  this.deviceData.tableData[0].list[NO - 1].status =2;
              }
          }
          else if (address.substring(0, 4).indexOf('CHWP') > -1  && v > 0) {
            NO = parseInt(address.substring(4, 5));
              if (address.indexOf('_PWR') > -1&& address.length==9){
                  this.deviceData.tableData[1].list[NO - 1].status = 1;
              }
              if (address.substring(address.length -8, address.length).indexOf('_VFD_ALM') > -1 && address.indexOf('SYS_') == -1) {
                  debugger
                  this.deviceData.warnNum += v;
                  this.deviceData.tableData[1].list[NO - 1].status =2;
              }
          }
          else if (address.substring(0, 3).indexOf('CWP') > -1  && v > 0) {
            NO = parseInt(address.substring(3, 4));
              if (address.indexOf('_PWR') > -1 && address.length==8){
                  this.deviceData.tableData[2].list[NO - 1].status = 1;
              }
              if (address.substring(address.length -8, address.length).indexOf('_VFD_ALM') > -1 && address.indexOf('SYS_') == -1) {
                  debugger
                  this.deviceData.warnNum += v;
                  this.deviceData.tableData[2].list[NO - 1].status =2;
              }
          }
          else if (address.substring(0, 2).indexOf('CT') > -1  && v > 0) {
            NO = parseInt(address.substring(2, 3));
              if (address.indexOf('_PWR') > -1 && address.length==7){
                  this.deviceData.tableData[3].list[NO - 1].status = 1;
              }
              if (address.substring(address.length -8, address.length).indexOf('_VFD_ALM') > -1 && address.indexOf('SYS_') == -1) {
                  debugger
                  this.deviceData.warnNum += v;
                  this.deviceData.tableData[3].list[NO - 1].status =2;
              }
          }
          if (address == 'CHW_FLOW') { CHW_FLOW = v; }
          if (address == 'CHW_ST') { CHW_ST = v; }
          if (address == 'CHW_RT') { CHW_RT = v; }
          if (CHW_RT != 0 && CHW_ST != 0 && CHW_FLOW != 0 && LFH == 0) {
            LFH = (parseInt(CHW_RT) - parseInt(CHW_ST)) * parseInt(CHW_FLOW) * 1.167;
            if (LFH < 0) {
              LFH = LFH * -1;
            }
            this.totalPower = LFH.toFixed(2);
          }
          if (address.indexOf('_PWR') > -1) {
            if (address.substring(0, 4).indexOf('CHWP') > -1 && address.length == 9) { CHWP_VFD_PWR += parseInt(v); }

            else if (address.substring(0, 3).indexOf('CWP') > -1 && address.length == 8) {
              CWP_VFD_PWR += parseInt(v);
            }
            else if (address.substring(0, 2).indexOf('CT') > -1 && address.length == 7) {
              CT_VFD_PWR += parseInt(v);
            }
            else if (address.substring(0, 3).indexOf('CHL') > -1 && address.length == 8) {
              CHL_PWR += parseInt(v);
            }
            if (CHL_PWR != 0 && CHWP_VFD_PWR != 0 && CWP_VFD_PWR != 0 && CT_VFD_PWR != 0) {
              ZGL = (CHL_PWR + CHWP_VFD_PWR + CWP_VFD_PWR + CT_VFD_PWR);

              this.coolingLoad = ZGL.toFixed(2);
              // if (LFH != 0) {
              //     $('a[name=CHL_PWR_COP]').html((LFH / CHL_PWR).toFixed(2) - 0);
              //     $('a[name=CHWP_VFD_PWR_COP]').html((LFH / CHWP_VFD_PWR).toFixed(2) - 0);
              //     $('a[name=CWP_VFD_PWR_COP]').html((LFH / CWP_VFD_PWR).toFixed(2) - 0);
              //     $('a[name=CT_VFD_PWR_COP]').html((LFH / CT_VFD_PWR).toFixed(2) - 0);
              // }
            }
            if (LFH != 0 && ZGL != 0 && this.airValue == 0) {
              // console.log("ZGL:" + ZGL + ",LFH:" + LFH);
              this.airValue = ((1 - (ZGL / LFH)) * 100).toFixed(2) - 0;
              // alert(((1 - (ZGL / LFH)) * 100).toFixed(2) - 0);
              //   this.airValue=((1 - (ZGL / LFH)) * 100).toFixed(2) - 0;

            }
          }  console.log('点：'+JSON.stringify(this.deviceData.tableData));
        }


      }).catch(error => {
      })

    },
    handleList () {
      this.deviceData.tableData.forEach((item, index) => {
        let arr = [];
        item.list.forEach(sub => {
          if (sub.status === 2 || sub.status === 1) {
            arr.push(true)
          } else {
            arr.push(false)
          }
        })
        this.showWarnningBox.push(arr)
      })
    },
    showBox (ind, num) {
      let leng = this.getSumLength(ind)
      if (this.showWarnningBox[ind][num]) {
        this.$refs.floatBox[leng + num].style.display = "block";
      }
    },
    hideBox (ind, num) {
      let leng = this.getSumLength(ind)
      if (this.showWarnningBox[ind][num]) {
        this.$refs.floatBox[leng + num].style.display = "none";
      }
    },
    getSumLength (ind) {
      let leng = 0
      this.showWarnningBox.forEach((item, index) => {
        if (index === ind || index > ind) {
          return false
        } else {
          leng += item.length;
        }
      })
      return leng
    },
    goToPage () {
      this.$router.push({ path: '/safety/air-sys/air-condition-monitoring' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../index.scss";
.air-system {
  width: 100%;
  height: 100%;
  min-width: 360px;
  position: relative;
  padding: 0px 10px;
  color: #e8efff;
  box-sizing: border-box;
  .main-container {
    height: calc(100% - 44px);
    padding: 0px 10px;
    .left-charts {
      width: 160px;
      float: left;
      margin-top: 24px;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
      .title {
        color: #74b3db;
        font-size: 16px;
        line-height: 24px;
      }
      .info {
        line-height: 24px;
      }
      .Text {
        font-size: 18px;
        color: #fff;
        line-height: 28px;
      }
    }
    .device-table {
      width: calc(100% - 160px);
      min-width: 220px;
      height: 100%;
      float: left;
      color: #d7e3f0;
      padding-bottom: 20px;
      overflow-x: auto;
      box-sizing: border-box;
      cursor: pointer;
      .item {
        display: inline-block;
      }
      .devices {
        width: 100%;
        height: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        border-spacing: 0;
        tr {
          width: 100%;
          height: 25%;
          &:last-child {
            td {
              border-bottom: none;
            }
          }
          td {
            width: 100%;
            // text-align: center;
            font-size: 14px;
            position: relative;
            white-space: nowrap; /* 自适应宽度*/
            word-break: keep-all; /* 避免长单词截断，保持全部 */
            border-bottom: 1px solid #3c6581;
            &:first-child {
              width: 70px;
              border-right: 1px solid #3c6581;
            }
            .detail-info {
              box-sizing: border-box;
              .item {
                width: 15%;
                text-align: center;
                position: relative;
                .float-box {
                  position: absolute;
                  left: 85%;
                  top: -30px;
                  width: 160px;
                  height: 100px;
                  box-sizing: border-box;
                  border-radius: 4px;
                  border: 1px solid #67cbff;
                  padding: 10px;
                  line-height: 20px;
                  text-align: left;
                  display: none;
                  background-color: #135786;
                  color: #f8ffff;
                  z-index: 1000;
                }
                i {
                  display: block;
                  width: 20px;
                  height: 20px;
                  margin-top: 5px;
                  position: relative;
                  left: 50%;
                  margin-left: -8px;
                  &.run-status {
                    background: url(../../../../static/img/shop-index/run.png)
                      no-repeat 0 0;
                    background-size: 100% 100% !important;
                  }
                  &.warn-status {
                    background: url(../../../../static/img/shop-index/problem.png)
                      no-repeat 0 0;
                    background-size: 100% 100% !important;
                  }
                  &.gray-status {
                    background: url(../../../../static/img/shop-index/stop.png)
                      no-repeat 0 0;
                    background-size: 100% 100% !important;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>


