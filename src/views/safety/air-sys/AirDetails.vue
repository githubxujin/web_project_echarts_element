<template>
  <div style="height:500px">
    <el-tabs type="border-card"
             v-model="activeName"
             @tab-click="handleClick"
             style="height:450px">
      <el-tab-pane :label="item.name"
                   :name="item.name"
                   v-for="item in equipment"
                   :key="item.name">
        <div style=" height:  450px; padding-left:30px">

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
                  变频运行

                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="title"
                              label="启动频率">
                  反馈值 {{item.WP_FRQ}}Hz
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="templateId"
                              label="远程/就地">
                  {{item.WP_REM_LOC==0?'远程':'就地'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="title"
                              label=" ">
                  设定值 {{item.WP_FRQ_SET}}Hz
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
                  <el-checkbox v-model="checked"> 启用频率自动跟踪</el-checkbox>
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
                  <el-checkbox v-model="checked"> 工频运行</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="middle">
              <div style="width: 310px; clear: both;float: left">

                <table style="line-height:35px;
    border: 1px solid #eee;border-radius: 5px;"
                       border="0"
                       cellpadding="0"
                       cellspacing="0">
                  <tr style="background-color: #FFFFFF; background-color:#EFEFEF; font-size: 16px">
                    <td colspan="2">&nbsp;&nbsp;参数名称</td>
                  </tr>
                  <tr style="background-color: #FFFFFF;">
                    <td width="210">&nbsp;&nbsp;功率</td>
                    <td width="100">&nbsp;&nbsp;{{item.WP_PWR}}kW</td>
                  </tr>
                  <tr style="background-color:#F7FAFC;">
                    <td width="210">&nbsp;&nbsp;频率</td>
                    <td width="100">&nbsp;&nbsp;{{item.WP_FRQ}}Hz</td>
                  </tr>
                  <tr style="background-color: #FFFFFF;">
                    <td width="210">&nbsp;&nbsp;运行时间</td>
                    <td width="100">&nbsp;&nbsp;{{item.WP_HRS}}H</td>
                  </tr>
                  <tr style="background-color: #F7FAFC;">
                    <td width="210">&nbsp;&nbsp;出口压力</td>
                    <td width="100">&nbsp;&nbsp;{{item.WP_DISP}}kPa</td>
                  </tr>
                </table>

              </div>
              <div style="width: 200px; float: right; padding: 30px 120px 0 0"><img src="../../../../static/img/coldTools/lqb.png" /></div>
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
import cold from './cold.js';
export default {
  props: {
    airDetailsDialog: Boolean, dialogObj: { "baseInfo": { "name": '' }, "objval": [] }
  },
  data () {
    return {
      dialogLoading: false, equipment: [{ WP_PWR: 0, WP_FRQ: 0, WP_HRS: 0, WP_DISP: 0, WP_REM_LOC: 0, WP_FRQ_SET: 0 }],
      form: {}, runNOs: [],
      activeName: '',
      checked: false,
      tableData: [{
        equipment: '设置状态',
        name: '运行状态'
      }, {
        equipment: '设置状态',
        name: '远程/就地'
      }, {
        equipment: '设置状态',
        name: '是否启用'
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
  },
  created () {

  },
  mounted () {
    this.runNOs = [];
    let NO = parseInt(this.dialogObj.baseInfo.name.substring(0, 1));
    let name = this.dialogObj.baseInfo.name.substring(2, 5);
    this.activeName = this.dialogObj.baseInfo.name;
    this.dialogObj.objval = JSON.parse(JSON.stringify(this.dialogObj.objval));
    this.equipment = [];
    for (let i = 0; i < 5; i++) {
      let o = { name: "", WP_PWR: 0, WP_FRQ: 0, WP_HRS: 0, WP_DISP: 0, WP_REM_LOC: 0, WP_FRQ_SET: 0 };
      let n = i + 1;
      o.name = n + "#" + name;
      //  console.log(JSON.stringify(o))
      this.equipment.push(o);
      // console.log(JSON.stringify(this.equipment))
    }
    // console.log(JSON.stringify(this.equipment))
    this.dialogObj.baseInfo.runers.split(';').forEach((item, i) => {
      if (!this.runNOs.includes(item.substring(0, 1)) && item.indexOf(name) > -1) {
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
        if (this.dialogObj.baseInfo.name.indexOf('冷却泵') > -1) {
          if (address.indexOf('CWP' + NO + '_PWR') > -1) {
            this.equipment[NO - 1].WP_PWR = val;
          }
          else if (address.indexOf('CWP' + NO + '_FRQ_SET') > -1) {
            this.equipment[NO - 1].WP_FRQ_SET = val;
          }
          else if (address.indexOf('CWP' + NO + '_FRQ_SET') > -1) {
            this.equipment[NO - 1].WP_FRQ_SET = val;
          }
          else if (address.indexOf('CWP' + NO + '_FRQ_HAND_AUTO') > -1) {
            this.equipment[NO - 1].WP_FRQ_HAND_AUTO = val;
          }
          else if (address.indexOf('CWP' + NO + '_FRQ') > -1) {
            this.equipment[NO - 1].WP_FRQ = val;
          }
          else if (address.indexOf('CWP' + NO + '_HRS') > -1) {
            this.equipment[NO - 1].WP_HRS = val;
          }
          else if (address.indexOf('CWP' + NO + '_DISP') > -1) {
            this.equipment[NO - 1].WP_DISP = val;
          }
          else if (address.indexOf('CWP' + NO + '_FRQ_SET') > -1) {
            this.equipment[NO - 1].WP_FRQ_SET = val;
          }
          else if (address.indexOf('CWP' + NO + '_REM_LOC') > -1) {
            if (obji.val > 0) {
              this.equipment[NO - 1].WP_REM_LOC = '就地';
            }
          }
        }
        else if (this.dialogObj.baseInfo.name.indexOf('冷冻泵') > -1) {

          if (address.indexOf('CHWP' + NO + '_PWR') > -1) {
            this.equipment[NO - 1].WP_PWR = val;
          }
          else if (address.indexOf('CHWP' + NO + '_FRQ_SET') > -1) {
            this.equipment[NO - 1].WP_FRQ_SET = val;
          }
          else if (address.indexOf('CHWP' + NO + '_FRQ_HAND_AUTO') > -1) {
            this.equipment[NO - 1].WP_FRQ_HAND_AUTO = val;
          }
          else if (address.indexOf('CHWP' + NO + '_FRQ') > -1) {
            this.equipment[NO - 1].WP_FRQ = val;
          }
          else if (address.indexOf('CHWP' + NO + '_HRS') > -1) {
            this.equipment[NO - 1].WP_HRS = val;
          }
          else if (address.indexOf('CHWP' + NO + '_DISP') > -1) {
            this.equipment[NO - 1].WP_DISP = val;
          }
          else if (address.indexOf('CHWP' + NO + '_REM_LOC') > -1) {
            if (obji.val > 0) {
              this.equipment[NO - 1].WP_REM_LOC = '就地';
            }
          }
        }
      }
    },
    queryTable (address, val) {
      let NO, NOdata;
      if (address.substring(0, 3) == "CWP") {
        NO = address.substring(3, 4);
        NOdata = 'NO' + NO;
        //  console.log(address + ";" + NO + ";" + NOdata);
        if (address.indexOf('CWP' + NO + '_ON_OFF') > -1) {
          this.tableData[0][NOdata] = val != 0 ? '运行' : '停止';
        }
        else if (address.indexOf('CWP' + NO + 'REM_LOC') > -1) {
          this.tableData[1][NOdata] = val != 0 ? '远程' : '就地';
        }
        else if (address.indexOf('CWP' + NO + '_START') > -1) {
          this.tableData[2][NOdata] = val != 0 ? '是' : '否';
        }
        else if (address.indexOf('CWP' + NO + '_ALM') > -1) {
          this.tableData[3][NOdata] = val != 0 ? '是' : '否';
        }
        else if (address.indexOf('CWP' + NO + '_PWR') > -1) {
          this.tableData[4][NOdata] = val;
        }
        else if (address.indexOf('CWP' + NO + '_FRQ') > -1) {
          this.tableData[5][NOdata] = val;
        }
        else if (address.indexOf('CWP' + NO + '_HRS') > -1) {
          this.tableData[6][NOdata] = val;
        }
        else if (address.indexOf('CWP' + NO + '_DISP') > -1) {
          this.tableData[7][NOdata] = val;
        }
      }
      else if (address.substring(0, 5) == "CHWP") {
        NO = address.substring(5, 6);
        NOdata = 'NO' + NO;
        // console.log(address + ";" + NO + ";" + NOdata);
        if (address.indexOf('CHWP' + NO + '_ON_OFF') > -1) {
          this.tableData[0][NOdata] = val != 0 ? '运行' : '停止';
        }
        else if (address.indexOf('CHWP' + NO + 'REM_LOC') > -1) {
          this.tableData[1][NOdata] = val != 0 ? '远程' : '就地';
        }
        else if (address.indexOf('CHWP' + NO + '_START') > -1) {
          this.tableData[2][NOdata] = val != 0 ? '是' : '否';
        }
        else if (address.indexOf('CHWP' + NO + '_ALM') > -1) {
          this.tableData[3][NOdata] = val != 0 ? '是' : '否';
        }
        else if (address.indexOf('CHWP' + NO + '_PWR') > -1) {
          this.tableData[4][NOdata] = val;
        }
        else if (address.indexOf('CHWP' + NO + '_FRQ') > -1) {
          this.tableData[5][NOdata] = val;
        }
        else if (address.indexOf('CHWP' + NO + '_HRS') > -1) {
          this.tableData[6][NOdata] = val;
        }
        else if (address.indexOf('CHWP' + NO + '_DISP') > -1) {
          this.tableData[7][NOdata] = val;
        }
      }

    },
    handleClick (tab, event) {
      let tindex = parseInt(tab.index) + 1;
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

      this.$emit('update:airDetailsDialog', false);
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
  background-color: red !important;
  margin-left: 0px;
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
  width: 720px;
  height: 200px;
  background-color: #ffffff;
  margin-top: 20px;
  float: left;
}
.text-center {
  padding-top: 8px;
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
