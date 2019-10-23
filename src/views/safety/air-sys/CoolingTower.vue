<template>
  <div style="height:420px">
    <el-tabs type="border-card"
             style=""
             @tab-click="handleClick"
             v-model="activeName">
      <el-tab-pane :label="item.name"
                   :name="item.name"
                   v-for="item in equipment"
                   :key="item.name">
        <div style="padding-left:30px">

          <el-form v-loading="dialogLoading"
                   ref="item"
                   :model="item"
                   label-width="90px"
                   size="mini"
                   inline
                   :label-position="'right'">
            <el-row>
              <el-col :span="12">
                <el-form-item prop="templateId"
                              label="运行状态">
                    {{item.CT_PWR!=0?'运行':'停止'}}

                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="title"
                              label="启动频率">
                  反馈值 {{item.CT_FRQ}}Hz
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="templateId"
                              label="远程/就地">
                    就地
                  <!--{{item.CT_REM_LOC==0?'远程':'就地'}}-->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="title"
                              label=" ">
                  设定值 {{item.CT_FRQ_SET}}Hz
                </el-form-item>
              </el-col>
            </el-row>
            <!--<el-row>-->
              <!--<el-col :span="12">-->
                <!--<el-form-item prop="templateId"-->
                              <!--label="是否启用">-->
                  <!--<el-checkbox v-model="checked">启用</el-checkbox>-->

                <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="12">-->
                <!--<el-form-item prop="title"-->
                              <!--label=" ">-->
                  <!--<el-checkbox v-model="checked"> 启用频率自动跟踪</el-checkbox>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
            <!--</el-row>-->
            <el-row>
              <el-col :span="12">
                <el-form-item prop=""
                              label="报警与否">
                    {{item.CT_ALM?item.CT_ALM:'否'}}

                </el-form-item>
              </el-col>
                <el-col :span="12">
                    <el-form-item prop=""
                                  label="是否启用">

                        {{item.CT_PWR!=0?'是':'否'}}
                    </el-form-item>
                </el-col>
              <!--<el-col :span="12">-->
                <!--<el-form-item prop="title"-->
                              <!--label=" ">-->
                  <!--<el-checkbox v-model="checked"> 工频运行</el-checkbox>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
            </el-row>
            <div class="middle">
              <div style="width: 310px; clear: both;float: left">
                <table style="line-height:35px;
    border: 1px solid #eee;  border-radius: 5px;"
                       border="0"
                       cellpadding="0"
                       cellspacing="0">
                  <tr style="background-color: #FFFFFF; background-color:#EFEFEF; font-size: 16px">
                    <td colspan="2">&nbsp;&nbsp;参数名称</td>
                  </tr>
                  <tr style="background-color: #FFFFFF;">
                    <td width="210">&nbsp;&nbsp;功率</td>
                    <td width="100">&nbsp;&nbsp;{{item.CT_PWR}}kW</td>
                  </tr>
                  <tr style="background-color: #f7fbfc;">
                    <td width="210">&nbsp;&nbsp;频率</td>
                    <td width="100">&nbsp;&nbsp;{{item.CT_FRQ}}Hz</td>
                  </tr>
                  <tr style="background-color: #FFFFFF;">
                    <td width="210">&nbsp;&nbsp;运行时间</td>
                    <td width="100">&nbsp;&nbsp;{{item.CT_HRS}}H</td>
                  </tr>
                </table>

              </div>
              <div style="width: 200px; float: right; padding: 15px 120px 0 0"><img src="../../../../static/img/coldTools/lqt.png" /></div>
            </div>

          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="所有">
        <el-table :data="tableData"
                  :span-method="objectSpanMethod"
                  style="width: 100%"
                  height="500">
          <el-table-column fixed
                           prop="equipment"
                           label="分类"
                           width="120">
          </el-table-column>
          <el-table-column fixed
                           prop="name"
                           label="参数名称"
                           width="150">
          </el-table-column>
          <el-table-column v-for="item in runNOs"
                           :key="item"
                           :prop="`NO`+item"
                           :label="item+`#`"
                           width="150">
          </el-table-column>

        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-row class="text-center">
      <el-button type="primary"
                 round
                 @click="close"
                 size="mini">确 定
      </el-button>
      <el-button round
                 size="mini"
                 @click="close">取 消</el-button>
    </el-row>
  </div>
</template>

<script>
    import { initWebSocket } from "@/utils/websocket";
    import baseOptions from '@/utils/baseOptions';
export default {
    extends: baseOptions,
  props: {
    coolingTowerDialog: Boolean, dialogObj: { "baseInfo": { "name": '' }, "objval": [] }
  },
  data () {
    return {
        websocketInstance: null, //websocket对象
      dialogLoading: false,
      form: {},NO:null, runNOs: [],
      equipment: [{CT_ALM:'否', CT_FRQ: 0, CT_REM_LOC: 0, CT_FRQ_SET: 0, CT_PWR: 0,CT_HRS: 0 }],
      activeName: '',
      checked: false,
      tableData: [{
        equipment: '设置状态',
        name: '运行状态'
      }, {
        equipment: '设置状态',
        name: '远程/就地',
          NO1:'就地',
          NO2:'就地'
      }, {
        equipment: '设置状态',
        name: '是否启用',
          NO1:'否',
          NO2:'否'
      }, {
        equipment: '设置状态',
        name: '报警与否'
      }, {
        equipment: '参数名称',
        name: '功率(kW)'
      }, {
        equipment: '参数名称',
        name: '频率(Hz)'
      }, {
        equipment: '参数名称',
        name: '运行时间(H)'
      }, {
        equipment: '参数名称',
        name: '出口压力(kPa)'
      }]
    };
  }, created () {
        this.websocketInstance = this.createdSocket();
    }, mounted () {
    this.runNOs = [];
    let NO = parseInt(this.dialogObj.baseInfo.name.substring(0, 1));
    this.NO=NO;
    this.dialogObj.objval = JSON.parse(JSON.stringify(this.dialogObj.objval));
    let name = this.dialogObj.baseInfo.name.substring(2, 5);
    this.activeName = this.dialogObj.baseInfo.name;
    this.equipment = [];
    for (let i = 0; i < 5; i++) {
      let o = { name: '', CT_FRQ: 0, CT_REM_LOC: 0, CT_FRQ_SET: 0, CT_PWR: 0, CT_FRQ: 0, CT_HRS: 0 };
      let n = i + 1;
      o.name = n + "#" + name;
      // console.log(JSON.stringify(o))
      this.equipment.push(o);
      // console.log(JSON.stringify(this.equipment))
    }

    this.dialogObj.baseInfo.runers.split(';').forEach((item, i) => {
      if (!this.runNOs.includes(item.substring(0, 1)) && item.indexOf("冷却塔") > -1) {
        this.runNOs.push(parseInt(item.substring(0, 1)));
      }
    });
    this.getSketchMap(NO);
    // console.log("equipment:" + JSON.stringify(this.equipment));
  },
  methods: {
      //创建socket对象
      createdSocket () {
          let that = this;
          return initWebSocket({ shopNumber: that.shopNumber },
              function (result) {
                  //  console.log('收到监测的消息', result);
                  that.dialogObj.objval=result.data.list;
                  that.getSketchMap(that.NO);
              },
              '/ws/safeManage/air/websocket'
          );
      },
    getSketchMap (NO) {
      let address, val = 0;
      for (let i = 0; i < this.dialogObj.objval.length; i++) {
        let obji = this.dialogObj.objval[i];
        address = obji.Address; val = obji.val;
          if(!address){continue;}
          this.queryTable(address, val);
        if (address.indexOf('CT' + NO + '_') > -1) {

          if (address.indexOf('CT' + NO + '_PWR') > -1) {
            this.equipment[NO - 1].CT_PWR = val;
          }
          else if (address.indexOf('CT' + NO + '_FRQ_SET') > -1&&address.length==11) {
            this.equipment[NO - 1].CT_FRQ_SET = val;
          }

          else if (address.indexOf('CT' + NO + '_FRQ_SET') > -1&&address.length==11) {
            this.equipment[NO - 1].CT_FRQ_SET = val;
          }

          else if (address.indexOf('CT' + NO + '_FRQ') > -1&&address.length==7) {
            this.equipment[NO - 1].CT_FRQ = val;
          }
          else if (address.indexOf('CT' + NO + '_HRS') > -1) {
            this.equipment[NO - 1].CT_HRS = val;
          }
          else if (address.indexOf('CT' + NO + '_REM_LOC') > -1) {
            if (val > 0) {
              this.equipment[NO - 1].CT_REM_LOC = '就地';
            }
          }
          else if (address.indexOf('CT' + NO + '_ALM') > -1&&address.length<10) {
              debugger
              if (val > 0) {
                  this.equipment[NO - 1].CT_ALM = '是';
              }
          }

        }
      }
    }, queryTable (address, val) {

      let NO = address.substring(2, 3);
      let NOdata = 'NO' + NO;
      //运行状态
      if (address.indexOf('CT' + NO + '_START') > -1) {
        this.tableData[0][NOdata] = val != 0 ? '运行' : '停止';
      }
      //远程/就地
      else if (address.indexOf('CT' + NO + 'CHL_REM_LOC') > -1) {
        this.tableData[1][NOdata] = val != 0 ? '远程' : '就地';
      }
      //是否启用
       if (address.indexOf('CT' + NO + '_PWR') > -1) {
        this.tableData[2][NOdata] = '是';
      }
      //报警与否
      if (address.indexOf('CT' + NO + '_ALM') > -1&&address.length<10) {
          debugger
        this.tableData[3][NOdata] = val != 0 ? '是' : '否';
      }
      else if (address.indexOf('CT' + NO + '_PWR') > -1&&address.length==7) {
        this.tableData[4][NOdata] = val;
      }
      else if (address.indexOf('CT' + NO + '_FRQ') > -1&&address.length==7) {
        this.tableData[5][NOdata] = val;
      }
      else if (address.indexOf('CT' + NO + '_HRS') > -1) {
        this.tableData[6][NOdata] = val;
      }
      this.tableData[7][NOdata] = '--';

    },
    handleClick (tab, event) {
      let tindex = parseInt(tab.index) + 1;
      this.NO=tindex;
      this.getSketchMap(tindex);
    }
    , objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 4 === 0) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }, close () {
      this.$emit('update:coolingTowerDialog', false);
    }
  }, watch: {
        shopNumber (val) {
            // console.log('shopNumber', val, this.websocketInstance);
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
    }
};
</script>

<style lang="css" scoped>
.el-tabs.el-tabs--top {
  background-color: white;
}
.el-tabs__nav-scroll {
  padding-left: 0px;
}

.el-tabs__nav-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: #e4e7ed;
  z-index: 1;
}
.el-row {
  height: 30px;
}
.el-col-12 {
  height: 30px;
}

.title {
  margin: 10px 12px 5px 12px;
  width: 295px;
  height: 35px;
  background-color: #efefef;
  color: #3b3b3b;
}
.middle {
  border-radius: 5px;

  height: 200px;
  background-color: #ffffff;
  margin-top: 20px;
  float: left;
}
.is-top {
  background-color: red !important;
  margin-left: 20px;
}

/deep/ .el-tabs__nav-wrap {
  background-color: #efefef;
  margin-left: 0px;
}
/deep/.el-tabs--border-card > .el-tabs__header {
    background-color: #FFFFFF;
    border-bottom: 1px solid #FFFFFF;
    margin: 0;
}
/deep/.el-tabs--border-card > .el-tabs__header .el-tabs__item {
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    border: 0px solid transparent;
    margin: -1px -1px 0;
    color: #909399;
}
</style>
