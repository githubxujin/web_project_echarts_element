<template>
  <div style="height:700px">

    <el-tabs type="border-card"
             v-model="activeName"
             @tab-click="handleClick"
             style="height:650px">
      <el-tab-pane :label="item.name"
                   :name="item.name"
                   v-for="item in equipment"
                   :key="item.name">
        <div style=" height:  650px; padding-left:20px">
          <div style=" height: 150px">
            <el-form v-loading="dialogLoading"
                     style="width: 440px"
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
                    变频运行

                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="title"
                                label="出水温度">
                    反馈值 {{item.CHL_ELWT_FB}}Hz
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="templateId"
                                label="远程/就地">
                    远程

                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="title"
                                label=" ">
                    设定值 {{item.CHL_ELWT_SET}}Hz
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="templateId"
                                label="是否启用">
                    <el-checkbox v-model="checked">启用</el-checkbox>

                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="title"
                                label=" ">
                    <el-checkbox v-model="checked">人工</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="templateId"
                                label="报警与否">
                    否

                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="title"
                                label=" ">
                    <el-checkbox v-model="checked">智能</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div style="float: right;width:200px; padding-right:70px"><img src="../../../../static/img/coldTools/zlj.png" /></div>
          </div>
          <div class="middle">
            <div style="width: 310px; clear: both;float: left">
              <table class="table"
                     border="0"
                     cellpadding="0"
                     cellspacing="0">
                <tr style="background-color: #FFFFFF; background-color:#EFEFEF; font-size: 16px">
                  <td colspan="2">&nbsp;&nbsp;蒸发器</td>
                </tr>
                <tr style="background-color: #FFFFFF;">
                  <td width="210">&nbsp;&nbsp;出水溫度</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_ELWT}}℃</td>
                </tr>
                <tr style="background-color: #f7fbfc;">
                  <td width="210">&nbsp;&nbsp;进水温度</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_EEWT}}℃</td>
                </tr>
                <tr style="background-color: #FFFFFF;">
                  <td width="210">&nbsp;&nbsp;液煤压力</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_EVAPP_SAT}}kPa</td>
                </tr>
                <tr style="background-color: #f7fbfc;">
                  <td width="210">&nbsp;&nbsp;冷煤饱和度</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_EVAPT_SAT}}℃</td>
                </tr>
              </table>

            </div>
            <div style="width: 200px; float: right; padding: 30px 120px 0 0"></div>
          </div>

          <div class="middle">
            <div style="width: 310px; clear: both;float: left">
              <table class="table"
                     border="0"
                     cellpadding="0"
                     cellspacing="0">
                <tr style="background-color: #FFFFFF; background-color:#EFEFEF; font-size: 16px">
                  <td colspan="2">&nbsp;&nbsp;冷凝器</td>
                </tr>
                <tr style="background-color: #FFFFFF;">
                  <td width="210">&nbsp;&nbsp;出水溫度</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_CLWT}}℃</td>
                </tr>
                <tr style="background-color: #f7fbfc;">
                  <td width="210">&nbsp;&nbsp;进水温度</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_CEWT}}℃</td>
                </tr>
                <tr style="background-color: #FFFFFF;">
                  <td width="210">&nbsp;&nbsp;液煤压力</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_CEWT}}kPa</td>
                </tr>
                <tr style="background-color: #f7fbfc;">
                  <td width="210">&nbsp;&nbsp;冷煤饱和度</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_CEWT}}℃</td>
                </tr>
              </table>
            </div>
            <div style="width: 200px; float: right; padding: 30px 120px 0 0"></div>
          </div>
          <div class="middle">
            <div style="width: 310px; clear: both;float: left">
              <table class="table"
                     border="0"
                     cellpadding="0"
                     cellspacing="0">
                <tr style="background-color: #FFFFFF; background-color:#EFEFEF; font-size: 16px">
                  <td colspan="2">&nbsp;&nbsp;电机</td>
                </tr>
                <tr style="background-color: #FFFFFF;">
                  <td width="210">&nbsp;&nbsp;功率</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_PWR}}kW</td>
                </tr>
                <tr style="background-color: #f7fbfc;">
                  <td width="210">&nbsp;&nbsp;电流</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_AMPS}}Hz</td>
                </tr>
                <tr style="background-color: #FFFFFF;">
                  <td width="210">&nbsp;&nbsp;负荷限定值</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_LOAD_LIMIT}}kPa</td>
                </tr>
                <tr style="background-color: #f7fbfc;">
                  <td width="210">&nbsp;&nbsp;运行时间</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_RUN_HRS}}H</td>
                </tr>
              </table>

            </div>
            <div style="width: 200px; float: right; padding: 30px 120px 0 0"></div>
          </div>
          <div class="middle">
            <div style="width: 310px; clear: both;float: left">
              <table class="table"
                     border="0"
                     cellpadding="0"
                     cellspacing="0">
                <tr style="background-color: #FFFFFF; background-color:#EFEFEF; font-size: 16px">
                  <td colspan="2">&nbsp;&nbsp;压缩机</td>
                </tr>
                <tr style="background-color: #FFFFFF;">
                  <td width="210">&nbsp;&nbsp;油压差</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_FRQ_SET}}kPa</td>
                </tr>
                <tr style="background-color: #f7fbfc;">
                  <td width="210">&nbsp;&nbsp;油温</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_OIL_T}}℃</td>
                </tr>
                <tr style="background-color: #FFFFFF;">
                  <td width="210">&nbsp;&nbsp;启动次数</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_START_COUNT}}次</td>
                </tr>
                <tr style="background-color: #f7fbfc;">
                  <td width="210">&nbsp;&nbsp;排气温度</td>
                  <td width="100">&nbsp;&nbsp;{{item.CHL_DIST}}℃</td>
                </tr>
              </table>

            </div>
            <div style="width: 200px; float: right; padding: 30px 120px 0 0"></div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="所有">
        <el-table :data="tableData"
                  :span-method="objectSpanMethod"
                  style="width: 100%"
                  height="600">
          <el-table-column fixed
                           prop="equipment"
                           label="分类"
                           width="120">
          </el-table-column>
          <el-table-column prop="name"
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
export default {
  props: {
    coolingPumpDialog: {
      type: Boolean,
      default: false
    },
    dialogObj: { baseInfo: { "name": '' }, objval: [], runers: '' },
  },
  data () {
    return {
      dialogLoading: false, equipment: [{ CHL_ELWT_FB: 0, CHL_ELWT_SET: 0, CHL_ELWT: 0, CHL_EEWT: 0, CHL_EVAPP_SAT: 0, CHL_EVAPT_SAT: 0, CHL_CEWT: 0, CHL_CLWT: 0, CHL_CEWT: 0, CHL_CEWT: 0, CHL_PWR: 0, CHL_AMPS: 0, CHL_LOAD_LIMIT: 0, CHL_RUN_HRS: 0, CHL_FRQ_SET: 0, CHL_OIL_T: 0, CHL_START_COUNT: 0, CHL_DIST: 0 }],
      runNOs: [],
      form: {},
      activeName: '',
      checked: false,
      tableData: [{
        equipment: '设备状态',
        name: '运行状态'
      },
      {
        equipment: '设备状态',
        name: '远程/就地'
      },
      {
        equipment: '设备状态',
        name: '是否启用',
        NO1: '启用',
        NO2: '启用'
      }, {
        equipment: '设备状态',
        name: '报警与否',
        NO1: '否',
        NO2: '否'
      },
      {
        equipment: '蒸发器',
        name: '出水温度(℃)',
        NO1: '10.2',
        NO2: '12.8'
      },
      {
        equipment: '蒸发器',
        name: '进水温度(℃)',
        NO1: '16.2',
        NO2: '15.1'
      },
      {
        equipment: '蒸发器',
        name: '冷媒压力(kPa)',
        NO1: '320',
        NO2: '371'
      }, {
        equipment: '蒸发器',
        name: '冷媒饱和温度(℃)',
        NO1: '39.3',
        NO2: '35.1'
      },
      {
        equipment: '冷凝器',
        name: '出水温度(℃)',
        NO1: '10.2',
        NO2: '12.8'
      },
      {
        equipment: '冷凝器',
        name: '进水温度(℃)',
        NO1: '16.2',
        NO2: '15.1'
      },
      {
        equipment: '冷凝器',
        name: '冷媒压力(kPa)',
        NO1: '320',
        NO2: '371'
      }, {
        equipment: '冷凝器',
        name: '冷媒饱和温度(℃)',
        NO1: '39.3',
        NO2: '35.1'
      },

      {
        equipment: '电机',
        name: '功率(kW)',
        NO1: '693',
        NO2: '123'
      },
      {
        equipment: '电机',
        name: '电流(A)',
        NO1: '102',
        NO2: '15.1'
      },
      {
        equipment: '电机',
        name: '冷媒压力(kPa)',
        NO1: '320',
        NO2: '371'
      }, {
        equipment: '电机',
        name: '运行时间(H)',
        NO1: '125',
        NO2: '12'
      },
      {
        equipment: '压缩机',
        name: '油压差(kPa)',
        NO1: '167',
        NO2: '122'
      },
      {
        equipment: '压缩机',
        name: '油温(℃)',
        NO1: '15.9',
        NO2: '15.1'
      },
      {
        equipment: '压缩机',
        name: '启动次数',
        NO1: '320',
        NO2: '371'
      }, {
        equipment: '压缩机',
        name: '排气温度(℃)',
        NO1: '47.9',
        NO2: '43.1'
      },
      ]
    };
  },
  mounted () {
    this.runNOs = [];
    let NO = parseInt(this.dialogObj.baseInfo.name.substring(0, 1));
    let name = this.dialogObj.baseInfo.name.substring(2, 5);
    this.dialogObj.objval = JSON.parse(JSON.stringify(this.dialogObj.objval));
    this.activeName = this.dialogObj.baseInfo.name;
    this.equipment = [];
    for (let i = 0; i < 4; i++) {
      let o = { name: '', CHL_ELWT_FB: 0, CHL_ELWT_SET: 0, CHL_ELWT: 0, CHL_EEWT: 0, CHL_EVAPP_SAT: 0, CHL_EVAPT_SAT: 0, CHL_CEWT: 0, CHL_CLWT: 0, CHL_CEWT: 0, CHL_CEWT: 0, CHL_PWR: 0, CHL_AMPS: 0, CHL_LOAD_LIMIT: 0, CHL_RUN_HRS: 0, CHL_FRQ_SET: 0, CHL_OIL_T: 0, CHL_START_COUNT: 0, CHL_DIST: 0 };
      let n = i + 1;
      o.name = n + "#" + name;
      // console.log(JSON.stringify(o))
      this.equipment.push(o);
      //  console.log(JSON.stringify(this.equipment))
    }
    this.dialogObj.baseInfo.runers.split(';').forEach((item, i) => {
      if (!this.runNOs.includes(item.substring(0, 1)) && item.indexOf("制冷机") > -1) {
        this.runNOs.push(parseInt(item.substring(0, 1)));
      }
    });
    this.getSketchMap(NO);
  },
  methods: {
    getSketchMap (NO) {
      let address, val = 0;
      for (let i = 0; i < this.dialogObj.objval.length; i++) {
        let obji = this.dialogObj.objval[i];
        address = obji.Address; val = obji.val;
          if(!address){continue;}
        this.queryTable(address, val);
        if (address.indexOf('CHL' + NO + '_') > -1) {
          if (address.indexOf('CHL' + NO + '_EEWT') > -1) {
            this.equipment[NO - 1].CHL_EEWT = val;
          }
          else if (address.indexOf('CHL' + NO + '_ELWT') > -1) {
            this.equipment[NO - 1].CHL_ELWT = val;
          }
          else if (address.indexOf('CHL' + NO + '_EVAPP_SAT') > -1) {
            this.equipment[NO - 1].CHL_EVAPP_SAT = val;
          }

          else if (address.indexOf('CHL' + NO + '_EVAPT_SAT') > -1) {
            this.equipment[NO - 1].CHL_EVAPT_SAT = val;
          }
          else if (address.indexOf('CHL' + NO + '_CEWT') > -1) {
            this.equipment[NO - 1].CHL_CEWT = val;
          }
          else if (address.indexOf('CHL' + NO + '_CLWT') > -1) {
            this.equipment[NO - 1].CHL_CLWT = val;
          }
          else if (address.indexOf('CHL' + NO + '_CONDT_SAT') > -1) {
            this.equipment[NO - 1].CHL_CONDT_SAT = val;
          }
          else if (address.indexOf('CHL' + NO + '_CONDP_SAT') > -1) {
            this.equipment[NO - 1].CHL_CONDP_SAT = val;
          }
          else if (address.indexOf('CHL' + NO + '_ELWT_FB') > -1) {
            this.equipment[NO - 1].CHL_ELWT_FB = val;
          }
          else if (address.indexOf('CHL' + NO + '_ELWT_SET') > -1) {
            this.equipment[NO - 1].CHL_ELWT_SET = val;
          }

          else if (address.indexOf('CHL' + NO + '_OIL_PD') > -1) {
            this.equipment[NO - 1].CHL_OIL_PD = val;
          }
          else if (address.indexOf('CHL' + NO + '_OIL_T') > -1) {
            this.equipment[NO - 1].CHL_OIL_T = val;
          }

          else if (address.indexOf('CHL' + NO + '_START_COUNT') > -1) {
            this.equipment[NO - 1].CHL_START_COUNT = val;
          }
          else if (address.indexOf('CHL' + NO + '_DIST') > -1) {
            this.equipment[NO - 1].CHL_DIST = val;
          }
          else if (address.indexOf('CHL' + NO + '_PWR') > -1) {
            this.equipment[NO - 1].CHL_PWR = val;
          }

          else if (address.indexOf('CHL' + NO + '_AMPS') > -1) {
            this.equipment[NO - 1].CHL_AMPS = val;
          }

          else if (address.indexOf('CHL' + NO + '_LOAD_LIMIT') > -1) {
            this.equipment[NO - 1].CHL_LOAD_LIMIT = val;
          }
          else if (address.indexOf('CHL' + NO + '_RUN_HRS') > -1) {
            this.equipment[NO - 1].CHL_RUN_HRS = val;
          }
        }
      }

    },
    queryTable (address, val) {
      let NO = address.substring(3, 4);
      let NOdata = 'NO' + NO;
      //运行状态
      if (address.indexOf('CHL' + NO + '_START') > -1) {
        this.tableData[0][NOdata] = val != 0 ? '运行' : '停止';
      }
      //远程/就地
      else if (address.indexOf('CHL' + NO + 'CHL_REM_LOC') > -1) {
        this.tableData[1][NOdata] = val != 0 ? '远程' : '就地';
      }
      //是否启用
      else if (address.indexOf('CHL' + NO + '_START') > -1) {
        this.tableData[2][NOdata] = val != 0 ? '运行' : '停止';
      }
      //报警与否
      else if (address.indexOf('CHL' + NO + '_ALM') > -1) {
        this.tableData[3][NOdata] = val != 0 ? '' : '停止';
      }
      //出水温度(℃)
      else if (address.indexOf('CHL' + NO + '_ELWT') > -1) {
        this.tableData[4][NOdata] = val;
      }
      //进水温度(℃)
      else if (address.indexOf('CHL' + NO + '_EEWT') > -1) {
        this.tableData[5][NOdata] = val;
      }
      //液煤压力
      else if (address.indexOf('CHL' + NO + '_EVAPP_SAT') > -1) {
        this.tableData[6][NOdata] = val;
      }
      //冷煤饱和度
      else if (address.indexOf('CHL' + NO + '_EVAPT_SAT') > -1) {
        this.tableData[7][NOdata] = val;
      }
      //出水温度(℃)
      else if (address.indexOf('CHL' + NO + '_CEWT') > -1) {
        this.tableData[8][NOdata] = val;
      }
      //进水温度(℃)
      else if (address.indexOf('CHL' + NO + '_CLWT') > -1) {
        this.tableData[9][NOdata] = val;
      }

      //液煤压力
      else if (address.indexOf('CHL' + NO + '_CHL_EVAPP_SAT') > -1) {
        this.tableData[10][NOdata] = val;
      }
      //冷煤饱和度
      else if (address.indexOf('CHL' + NO + '_CHL_EVAPT_SAT') > -1) {
        this.tableData[11][NOdata] = val;
      }




      //出水温度(℃)
      else if (address.indexOf('CHL' + NO + '_PWR') > -1) {
        this.tableData[12][NOdata] = val;
      }
      //进水温度(℃)
      else if (address.indexOf('CHL' + NO + '_AMPS') > -1) {
        this.tableData[13][NOdata] = val;
      }

      //液煤压力
      else if (address.indexOf('CHL' + NO + '_LOAD_LIMIT') > -1) {
        this.tableData[14][NOdata] = val;
      }
      //冷煤饱和度
      else if (address.indexOf('CHL' + NO + '_RUN_HRS') > -1) {
        this.tableData[15][NOdata] = val;
      }


      //出水温度(℃)
      else if (address.indexOf('CHL' + NO + '_FRQ_SET') > -1) {
        this.tableData[16][NOdata] = val;
      }
      //进水温度(℃)
      else if (address.indexOf('CHL' + NO + '_OIL_T') > -1) {
        this.tableData[17][NOdata] = val;
      }

      //液煤压力
      else if (address.indexOf('CHL' + NO + '_START_COUNT') > -1) {
        this.tableData[18][NOdata] = val;
      }
      //冷煤饱和度
      else if (address.indexOf('CHL' + NO + '_DIST') > -1) {
        this.tableData[19][NOdata] = val;
      }
      // console.log(JSON.stringify(this.tableData))

    },
    handleClick (tab, event) {
      let tindex = parseInt(tab.index) + 1;
      this.getSketchMap(tindex);
    }, objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
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
      this.$emit('update:coolingPumpDialog', false);
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
  width: 310px;
  height: 200px;
  background-color: #ffffff;
  float: left;
  padding-left: 10px;
}
.el-form {
  width: 500px;
  float: left;
}
.el-tabs__nav-wrap {
  background-color: red !important;
  margin-left: 20px;
}
.is-top {
  background-color: red !important;
  margin-left: 20px;
}

/deep/ .el-tabs__nav-wrap {
  background-color: #efefef;
  margin-left: 0px;
}
.table {
  line-height: 35px;
  border: 1px solid #eee;
  border-radius: 5px;
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
