<template>
  <div class="codecontent">
    <div class="leftcontent">
      <div class="top">
        <div class="title">
          <a style=" padding-left:20px">系统能效</a>
          <a style=" padding-left:60px">kW</a>
          <a style=" padding-left:80px">COP</a>
        </div>
        <div style="margin:0 0 5px 0; width:315px; height:125px; ">
          <div style="width:100px; height: 100px;clear: both; margin-top: 30px">
            <v-guage :loadValue="airValue"></v-guage>
          </div>
          <div style="width:150px; height: 100px; float: right; margin-top:-100px">
            <div style="font-size: 18px; width:150px; height: 30px;">系统COP</div>
            <div style="font-size: 15px; width:150px; height: 30px;">冷负荷：{{coolingLoad}}kW</div>
            <div style="font-size: 15px; width:150px; height: 30px;">总功率：{{totalPower}}kW</div>
          </div>
        </div>
        <table
          style="padding: 0 10px 0 14px;line-height:35px;"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
          <tr style="background-color:#F7F7FC;">
            <td width="170">冷水机组</td>
            <td width="110">{{equipment.CHL_PWR}}</td>
            <td width="100">{{equipment.CHL_COP}}</td>
          </tr>
          <tr style="background-color: #ffffff;">
            <td width="170">冷冻水泵</td>
            <td width="110">{{equipment.CHWP_PWR}}</td>
            <td width="100">{{equipment.CHWP_COP}}</td>
          </tr>
          <tr style="background-color:#F7F7FC;">
            <td width="170">冷却水泵</td>
            <td width="110">{{equipment.CWP_PWR}}</td>
            <td width="100">{{equipment.CWP_COP}}</td>
          </tr>
          <tr style="background-color: #ffffff;">
            <td width="170">冷却水塔</td>
            <td width="110">{{equipment.CT_PWR}}</td>
            <td width="100">{{equipment.CT_COP}}</td>
          </tr>
        </table>
      </div>
      <div class="middle">
        <div class="title">
          <a style=" padding-left:20px">控制参数</a>
          <a style=" padding-left:130px">反馈值</a>
        </div>
        <table
          style="padding: 0 10px 0 14px;line-height:35px;"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
          <tr style="background-color: #ffffff;">
            <td width="210">冷冻水供水温度(°C)</td>
            <td width="100">{{equipment.CHW_ST}}</td>
          </tr>
          <tr style="background-color:#F7F7FC;">
            <td width="210">冷冻水压差(kPa)</td>
            <td width="100">{{equipment.CHW_PD}}</td>
          </tr>
          <tr style="background-color: #ffffff;">
            <td width="210">冷却水回水温度(°C)</td>
            <td width="100">{{equipment.CW_RT}}</td>
          </tr>
          <tr style="background-color:#F7F7FC;">
            <td width="210">冷却水温度(°C)</td>
            <td width="100">{{equipment.CW_TD}}</td>
          </tr>
        </table>
      </div>
      <div class="bottom">
        <div class="title">
          <a style=" padding-left:20px">操作时间</a>
          <a style=" padding-left:130px">具体操作</a>
        </div>
        <table
          style="padding: 0 10px 0 14px;line-height:35px;"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
          <tr
            v-for="(log,index) in logList"
            :style="index%2==0?'background-color: #ffffff;':'background-color:#F7F7FC;'"
          >
            <td width="210">{{log.date}}</td>
            <td width="100">{{log.name}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="rightcontent">
      <div id="drawing"></div>
    </div>
    <el-dialog
      :visible.sync="airDetailsDialog"
      width="750px"
      height="700px"
      :close-on-click-modal="false"
    >
      <span slot="title"  class="dialog-header">{{etitle}}</span>
      <airDetails
        :airDetailsDialog.sync="airDetailsDialog"
        :dialogObj="dialogObj"
        v-if="airDetailsDialog"
      ></airDetails>
    </el-dialog>

    <el-dialog
      :visible.sync="coolingPumpDialog"
      width="760px"
      height="700px"
      :close-on-click-modal="false"
    >
      <span slot="title"  class="dialog-header">{{etitle}}</span>
      <coolingPump
        :coolingPumpDialog.sync="coolingPumpDialog"
        :dialogObj="dialogObj"
        v-if="coolingPumpDialog"
      ></coolingPump>
    </el-dialog>

    <el-dialog
      :visible.sync="coolingTowerDialog"
      width="750px"
      height="700px"
      :close-on-click-modal="false"
    >
      <span slot="title"  class="dialog-header">{{etitle}}</span>
      <coolingTower
        :coolingTowerDialog.sync="coolingTowerDialog"
        :dialogObj="dialogObj"
        v-if="coolingTowerDialog"
      ></coolingTower>
    </el-dialog>
  </div>
</template>

<script>
import { initWebSocket } from "@/utils/websocket";
// import { mapGetters, mapActions } from 'vuex'
import vGuage from '@/components/Guage.vue';
import airDetails from './AirDetails';
import coolingPump from './CoolingPump';
import coolingTower from './CoolingTower';
import cold from './cold.js';
import baseOptions from '@/utils/baseOptions';
import { getAirList } from '../../../services/safety.js';
import $ from "jquery";
export default {
  extends: baseOptions,
  components: { vGuage, airDetails, coolingPump, coolingTower },
  data () {
    return {
      websocketInstance: null, //websocket对象
      logList: [],
      etitle: '123', dialogObj: { baseInfo: { "name": '' }, objval: [], runers: '' },
      equipment: { CHW_ST: 0, CHW_PD: 0, CW_RT: 0, CW_TD: 0, CHL_PWR: 0, CHL_COP: 0, CHWP_PWR: 0, CHWP_COP: 0, CWP_PWR: 0, CWP_COP: 0, CT_PWR: 0, CT_COP: 0 },
      airDetailsDialog: false,
      coolingPumpDialog: false,
      coolingTowerDialog: false,
      ct: "{\"controls\":{\"size\":\"960,720\",\"pipe\":[{\"text\":\"总管供水\",\"X_Y\":\"864,107\",\"op\":\"蓝横进\",\"io\":\"开\",\"pt\":\"\"},{\"text\":\"制冷机进A\",\"X_Y\":\"354,636\",\"op\":\"紫竖进\",\"io\":\"1#制冷机进A,2#制冷机进A,3#制冷机进A,4#制冷机进A\",\"pt\":\"\"},{\"text\":\"制冷机进B\",\"X_Y\":\"576,636\",\"op\":\"青竖进\",\"io\":\"1#制冷机进B,2#制冷机进B,3#制冷机进B,4#制冷机进B\",\"pt\":\"\"},{\"text\":\"制冷机出A\",\"X_Y\":\"334,139\",\"op\":\"红竖出\",\"io\":\"1#制冷机出A,2#制冷机出A,3#制冷机出A,4#制冷机出A\",\"pt\":\"冷却塔进\"},{\"text\":\"制冷机出B\",\"X_Y\":\"596,139\",\"op\":\"蓝竖出\",\"io\":\"1#制冷机出B,2#制冷机出B,3#制冷机出B,4#制冷机出B\",\"pt\":\"总管供水\"},{\"text\":\"冷冻泵进\",\"X_Y\":\"692,635\",\"op\":\"青竖进\",\"io\":\"1#冷冻泵进,2#冷冻泵进,3#冷冻泵进,4#冷冻泵进,5#冷冻泵进\",\"pt\":\"\"},{\"text\":\"冷冻泵出\",\"X_Y\":\"622,615\",\"op\":\"青竖出\",\"io\":\"1#冷冻泵出,2#冷冻泵出,3#冷冻泵出,4#冷冻泵出,5#冷冻泵出\",\"pt\":\"制冷机进B\"},{\"text\":\"冷却泵进\",\"X_Y\":\"238,636\",\"op\":\"紫竖进\",\"io\":\"1#冷却泵进,2#冷却泵进,3#冷却泵进,4#冷却泵进,5#冷却泵进\",\"pt\":\"\"},{\"text\":\"冷却泵出\",\"X_Y\":\"308,615\",\"op\":\"紫竖出\",\"io\":\"1#冷却泵出,2#冷却泵出,3#冷却泵出,4#冷却泵出,5#冷却泵出\",\"pt\":\"制冷机进A\"},{\"text\":\"冷却塔进\",\"X_Y\":\"66,107\",\"op\":\"红竖进\",\"io\":\"1#冷却塔进A,2#冷却塔进A,3#冷却塔进A,4#冷却塔进A,5#冷却塔进A\",\"pt\":\"\"},{\"text\":\"冷却塔出\",\"X_Y\":\"182,630\",\"op\":\"紫竖出\",\"io\":\"1#冷却塔出A,1#冷却塔出B,2#冷却塔出A,2#冷却塔出B,3#冷却塔出A,3#冷却塔出B,4#冷却塔出A,4#冷却塔出B,5#冷却塔出A\",\"pt\":\"冷却泵进\"},{\"text\":\"总管回水\",\"X_Y\":\"864,636\",\"op\":\"青横出\",\"io\":\"开\",\"pt\":\"冷冻泵进\"}],\"device\":[{\"text\":\"1#制冷机\",\"X_Y\":\"379,139\",\"type\":\"C.Chiller\",\"id\":\"92\",\"mid\":\"000000000082,1090\"},{\"text\":\"2#制冷机\",\"X_Y\":\"379,283\",\"type\":\"C.Chiller\",\"id\":\"93\",\"mid\":\"000000000081,1090\"},{\"text\":\"3#制冷机\",\"X_Y\":\"379,427\",\"type\":\"C.Chiller\",\"id\":\"94\",\"mid\":\"000000000059,1090\"},{\"text\":\"4#制冷机\",\"X_Y\":\"379,571\",\"type\":\"C.Chiller\",\"id\":\"95\",\"mid\":\"000000000060,1090\"},{\"text\":\"1#冷冻泵\",\"X_Y\":\"642,163\",\"type\":\"C.Pumps\",\"dir\":\"R\",\"id\":\"96\",\"mid\":\"000000000026,1090\"},{\"text\":\"2#冷冻泵\",\"X_Y\":\"642,271\",\"type\":\"C.Pumps\",\"dir\":\"R\",\"id\":\"97\",\"mid\":\"000000000008,1090\"},{\"text\":\"3#冷冻泵\",\"X_Y\":\"642,379\",\"type\":\"C.Pumps\",\"dir\":\"R\",\"id\":\"98\",\"mid\":\"000000000100,1090\"},{\"text\":\"4#冷冻泵\",\"X_Y\":\"642,487\",\"type\":\"C.Pumps\",\"dir\":\"R\",\"id\":\"99\",\"mid\":\"000000000007,1090\"},{\"text\":\"5#冷冻泵\",\"X_Y\":\"642,595\",\"type\":\"C.Pumps\",\"dir\":\"R\",\"id\":\"100\",\"mid\":\"000000000098,1090\"},{\"text\":\"1#冷却泵\",\"X_Y\":\"258,163\",\"type\":\"C.Pumps\",\"id\":\"101\",\"mid\":\"000000000032,1090\"},{\"text\":\"2#冷却泵\",\"X_Y\":\"258,271\",\"type\":\"C.Pumps\",\"id\":\"102\",\"mid\":\"000000000028,1090\"},{\"text\":\"3#冷却泵\",\"X_Y\":\"258,379\",\"type\":\"C.Pumps\",\"id\":\"103\",\"mid\":\"000000000097,1090\"},{\"text\":\"4#冷却泵\",\"X_Y\":\"258,487\",\"type\":\"C.Pumps\",\"id\":\"104\",\"mid\":\"000000000006,1090\"},{\"text\":\"5#冷却泵\",\"X_Y\":\"258,595\",\"type\":\"C.Pumps\",\"id\":\"105\",\"mid\":\"000000000027,1090\"},{\"text\":\"1#冷却塔\",\"X_Y\":\"96,139\",\"type\":\"C.Tower\",\"id\":\"106\",\"mid\":\"000000000055,1090\",\"ct\":\"/5\"},{\"text\":\"2#冷却塔\",\"X_Y\":\"96,247\",\"type\":\"C.Tower\",\"id\":\"107\",\"mid\":\"000000000055,1090\",\"ct\":\"/5\"},{\"text\":\"3#冷却塔\",\"X_Y\":\"96,355\",\"type\":\"C.Tower\",\"id\":\"108\",\"mid\":\"000000000055,1090\",\"ct\":\"/5\"},{\"text\":\"4#冷却塔\",\"X_Y\":\"96,463\",\"type\":\"C.Tower\",\"id\":\"109\",\"mid\":\"000000000055,1090\",\"ct\":\"/5\"},{\"text\":\"5#冷却塔\",\"X_Y\":\"96,571\",\"type\":\"C.Tower\",\"id\":\"110\",\"mid\":\"000000000055,1090\",\"ct\":\"/5\"},{\"text\":\"1#冷却塔进水阀\",\"X_Y\":\"76,147\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"111\"},{\"text\":\"2#冷却塔进水阀\",\"X_Y\":\"76,255\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"112\"},{\"text\":\"3#冷却塔进水阀\",\"X_Y\":\"76,363\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"113\"},{\"text\":\"4#冷却塔进水阀\",\"X_Y\":\"76,471\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"114\"},{\"text\":\"5#冷却塔进水阀\",\"X_Y\":\"76,579\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"115\"},{\"text\":\"1#冷机冷却水阀\",\"X_Y\":\"364,172\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"116\"},{\"text\":\"1#冷机冷冻水阀\",\"X_Y\":\"549,193\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"120\"},{\"text\":\"2#冷机冷却水阀\",\"X_Y\":\"360,316\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"117\"},{\"text\":\"2#冷机冷冻水阀\",\"X_Y\":\"553,337\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"121\"},{\"text\":\"3#冷机冷却水阀\",\"X_Y\":\"360,460\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"118\"},{\"text\":\"3#冷机冷冻水阀\",\"X_Y\":\"553,481\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"122\"},{\"text\":\"4#冷机冷却水阀\",\"X_Y\":\"360,604\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"119\"},{\"text\":\"4#冷机冷冻水阀\",\"X_Y\":\"553,625\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"123\"},{\"text\":\"1#冷却塔出水阀A\",\"X_Y\":\"163,171\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"124\"},{\"text\":\"2#冷却塔出水阀A\",\"X_Y\":\"163,279\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"125\"},{\"text\":\"3#冷却塔出水阀A\",\"X_Y\":\"163,387\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"126\"},{\"text\":\"4#冷却塔出水阀A\",\"X_Y\":\"163,495\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"127\"},{\"text\":\"5#冷却塔出水阀\",\"X_Y\":\"163,616\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"128\"},{\"text\":\"1#冷却塔出水阀B\",\"X_Y\":\"163,184\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"129\"},{\"text\":\"2#冷却塔出水阀B\",\"X_Y\":\"163,292\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"130\"},{\"text\":\"3#冷却塔出水阀B\",\"X_Y\":\"164,400\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"131\"},{\"text\":\"4#冷却塔出水阀B\",\"X_Y\":\"163,508\",\"type\":\"C.Valve\",\"dir\":\"X\",\"id\":\"132\"}],\"label\":[{\"text\":\"冷冻水供水\",\"X_Y\":\"866,75\",\"size\":\"14\"},{\"text\":\"冷冻水回水\",\"X_Y\":\"866,604\",\"size\":\"14\"}],\"arrow\":[{\"direction\":\"E\",\"X_Y\":\"884,92\"},{\"direction\":\"W\",\"X_Y\":\"884,621\"}],\"grid\":[{\"X_Y\":\"96,9\",\"read\":[{\"text\":\"冷却水供水温度\",\"unit\":\"℃\",\"_text\":\"CW_ST\"},{\"text\":\"冷却水供水压力\",\"unit\":\"kPa\",\"_text\":\"CW_SP\"},{\"text\":\"冷却水流量\",\"unit\":\"m³/h\",\"_text\":\"CW_FLOW\"}]},{\"X_Y\":\"181,57\",\"read\":[{\"text\":\"冷却水回水温度\",\"unit\":\"℃\",\"_text\":\"CW_RT\"},{\"text\":\"冷却水回水压力\",\"unit\":\"kPa\",\"_text\":\"CW_RP\"}]},{\"X_Y\":\"320,9\",\"read\":[{\"text\":\"冷却水温差\",\"unit\":\"℃\",\"_text\":\"CW_TD\"},{\"text\":\"冷却水压差\",\"unit\":\"kPa\",\"_text\":\"CW_PD\"}]},{\"X_Y\":\"640,9\",\"read\":[{\"text\":\"冷冻水供水温度\",\"unit\":\"℃\",\"_text\":\"CHW_ST\"},{\"text\":\"冷冻水供水压力\",\"unit\":\"kPa\",\"_text\":\"CHW_SP\"},{\"text\":\"冷冻水流量\",\"unit\":\"m³/h\",\"_text\":\"CHW_FLOW\"}]},{\"X_Y\":\"768,566\",\"read\":[{\"text\":\"冷冻水回水温度\",\"unit\":\"℃\",\"_text\":\"CHW_RT\"},{\"text\":\"冷冻水回水压力\",\"unit\":\"kPa\",\"_text\":\"CHW_RP\"}]},{\"X_Y\":\"822,297\",\"read\":[{\"text\":\"冷冻水温差\",\"unit\":\"℃\",\"_text\":\"CHW_TD\"},{\"text\":\"冷冻水压差\",\"unit\":\"kPa\",\"_text\":\"CHW_PD\"}]}],\"line\":[{\"X_Y\":\"97,64\",\"len\":\"45\",\"op\":\"竖虚无黑\"},{\"X_Y\":\"176,28\",\"len\":\"144\",\"op\":\"横虚右黑\"},{\"X_Y\":\"182,94\",\"len\":\"88\",\"op\":\"竖虚无黑\"},{\"X_Y\":\"261,76\",\"len\":\"22\",\"op\":\"横虚无黑\"},{\"X_Y\":\"283,28\",\"len\":\"48\",\"op\":\"竖虚无黑\"},{\"X_Y\":\"641,64\",\"len\":\"45\",\"op\":\"竖虚无黑\"},{\"X_Y\":\"720,37\",\"len\":\"49\",\"op\":\"横虚无黑\"},{\"X_Y\":\"769,37\",\"len\":\"599\",\"op\":\"竖虚无黑\"},{\"X_Y\":\"769,316\",\"len\":\"53\",\"op\":\"横虚右黑\"}]}}",
      airValue: 0, coolingLoad: 0, totalPower: 0
    }
  }, computed: {
  },
  created () {
    this.websocketInstance = this.createdSocket();
  },
  mounted () {

    this.initCold(this.ct);
    //  this.query();
    let that = this;
    $(function () {
      $('image').click(function () {
        var name = $(this).attr("name"), vname = name.replace(name.substring(0, 1), '');
        that.dialogObj.baseInfo.name = name;
        that.dialogObj.baseInfo.runers = cold.getRuners();
        that.etitle=name.split('#')[1];
        if (name.indexOf("冷却塔") != -1) {
          that.coolingTowerDialog = true;
        }
        else if (name.indexOf("冷却泵") != -1 || name.indexOf("冷冻泵") != -1) {
          that.airDetailsDialog = true;
        }
        else if (name.indexOf("制冷机") != -1) {
          that.coolingPumpDialog = true;
        }
      });
    });
  },
  methods: {
    //创建socket对象
    createdSocket () {
      let that = this;
      return initWebSocket({ shopNumber: that.shopNumber },
        function (result) {
          //  console.log('收到监测的消息', result);
          that.refreshData(result);
        },
        '/ws/safeManage/air/websocket'
      );
    },
    // ...mapActions('drainage', ['initWebsocket']),
    refreshData (obj) {
      this.query(obj);
    },
    query (res) {
      let CHW_RT = 0, CHW_ST = 0, CHW_FLOW = 0, LFH = 0, CHWP_VFD_PWR = 0, CWP_VFD_PWR = 0, CT_VFD_PWR = 0, CHL_PWR = 0, ZGL = 0;
      // getAirList("?shopNumber="+this.shopNumber).then((res) => {
      let rbj = res.data.list, address = '', v = 0;
      this.logList = res.data.logList;
      this.dialogObj.objval = rbj;
      cold.setNameVal(rbj);
      for (var i = 0; i < rbj.length; i++) {
        address = rbj[i].Address; v = rbj[i].val;
        if (!address) { continue; }
        // console.log(address);
        if (address.indexOf('CHW_ST') > -1) {
          this.equipment.CHW_ST = v;
        }
        else if (address.indexOf('CHW_PD') > -1) {
          this.equipment.CHW_PD = v;
        }
        else if (address.indexOf('CW_RT') > -1) {
          this.equipment.CW_RT = v;
        }
        else if (address.indexOf('CW_TD') > -1) {
          this.equipment.CW_TD = v;
        }
        else if (address.indexOf('CHL_COP') > -1) {
          this.equipment.CHL_COP = v;
        }
        else if (address.indexOf('CHWP_COP') > -1) {
          this.equipment.CHWP_COP = v;
        }
        else if (address.indexOf('CWP_COP') > -1) {
          this.equipment.CWP_COP = v;
        }
        else if (address.indexOf('CT_COP') > -1) {
          this.equipment.CT_COP = v;
        }
        else if (address.indexOf('CHL_PWR') > -1) {
          this.equipment.CHL_PWR = v;
        }
        else if (address.indexOf('CHWP_PWR') > -1) {

          this.equipment.CHWP_PWR = v;
        }
        else if (address.indexOf('CWP_PWR') > -1) {
          this.equipment.CWP_PWR = v;
        }
        else if (address.indexOf('CT_PWR') > -1) {
          this.equipment.CT_PWR = v;
        }

        if (address == 'CHW_FLOW') { CHW_FLOW = v; }
        if (address == 'CHW_ST') { CHW_ST = v; }
        if (address == 'CHW_RT') { CHW_RT = v; }
        if (CHW_RT != 0 && CHW_ST != 0 && CHW_FLOW != 0 && LFH == 0) {
          LFH = (parseInt(CHW_RT) - parseInt(CHW_ST)) * parseInt(CHW_FLOW) * 1.167;
          // console.log("CHW_RT:" + CHW_RT + ";CHW_FLOW:" + CHW_FLOW + "CHW_ST:" + CHW_ST);
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
        }
      }
      // }).catch(error => {
      // })
    },
    initCold (d) {
      cold.createSvg(JSON.parse(d), this);
    }, close () {
      this.airDetailsDialog = false;
      this.coolingPumpDialog = false;
      this.coolingTowerDialog = false;
    }
  },
  watch: {
    shopNumber (val) {
      console.log('shopNumber', val, this.websocketInstance);
      if (this.websocketInstance) {
        this.websocketInstance.close()
      }
      this.websocketInstance = this.createdSocket();
    }
  },
  destroyed () {
    if (this.websocketInstance) {
      this.websocketInstance.close()
    }
  }, computed: {

  }
}
</script>
<style>
.runing {
  stroke-dasharray: 1000;
  stroke-dashoffset: 100;
  animation: run 10s linear infinite;
  /*background: url("../../../assets/images/drainage/right.png");*/
}
@keyframes run {
  /*from {*/
  /*stroke-dasharray: 100, 5;*/
  /*}*/
  /*to {*/
  /*stroke-dasharray: 40, 5;*/
  /*}*/
  from {
    stroke-dasharray: 10, 10;
  }
  to {
    stroke-dasharray: 10, 5;
  }
}
.runingdown {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: rundown 10s linear infinite;
}
@keyframes rundown {
  from {
    stroke-dasharray: 10, 10;
  }
  to {
    stroke-dasharray: 20, 5;
  }
}
</style>

<style lang="scss" scoped>
table tr td {
  border-top: #ffffff solid 2px;

  text-align: left;
  line-height: 24px;
  height: 34px;
}

.codecontent {
  /*background-color: #f0f5fb;*/
  background-color: #ffffff;
  width: 1672px;
  height: 100%;
  border-radius: 5px;
}
.leftcontent {
  height: 100%;
  width: 315px;
  float: left;
  padding: 10px 0 10px 10px;

  .top {
    border-radius: 8px;
    width: 315px;
    height: 355px;
    background-color: #ffffff;
    float: left;
    border: 1px solid #eee;
  }
}
.middle {
  border-radius: 5px;
  width: 315px;
  height: 200px;
  background-color: #ffffff;
  margin-top: 10px;
  float: left;
  border: 1px solid #eee;
}
.bottom {
  border-radius: 5px;
  width: 315px;
  height: 200px;
  background-color: #ffffff;
  margin-top: 10px;
  float: left;
  border: 1px solid #eee;
}
.title {
  margin: 0px 0px 5px 0px;
  width: 315px;
  height: 35px;
  background-color: #eceef6;
  color: #3b3b3b;
}
.rightcontent {
  margin-left: 10px;
  background-color: #ffffff;
  width: 1312px;
  height: 100%;
  float: left;
}
.textRow {
  margin: 3px 12px 5px 12px;
  width: 315px;
  max-height: 30px;
  background-color: #f7fbfc;
  color: #3b3b3b;
  .textleft {
    width: 105px;
    padding-left: 20px;
  }
  .textcontent {
    width: 105px;
    padding-left: 130px;
    padding-top: -10px;
  }
  .textmiddlecontent {
    padding-left: 130px;
  }
  .textright {
    margin-left: 100px;
  }
}

/deep/ .el-dialog__body {
  padding: 10px 5px 5px 5px;
}
.dialog-header {
 font-size: 15px;
}

.el-tabs.el-tabs--top {
  background-color: white;
}
/deep/ .el-tabs__nav-scroll {
  padding-left: 0px;
}

.el-tabs__nav-wrap::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: #e4e7ed;
  z-index: 1;
}
/deep/.el-tabs__content {
  margin-top: 0px;
}
/deep/.el-row {
  padding-left: 10px;
}
.el-tabs__nav-wrap {
  margin-left: 20px;
}
</style>
