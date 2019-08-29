<template>
  <div class="class-select">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="60px">
      <el-checkbox v-model="ruleForm.oneClassChecked">一班倒</el-checkbox>
      <el-form-item label="整班">
        <vue-timepicker v-if="showCom" v-model="ruleForm.oneClassData.on" :minute-interval="10"></vue-timepicker>
        <vue-timepicker v-if="showCom" v-model="ruleForm.oneClassData.off" :minute-interval="10"></vue-timepicker>
      </el-form-item>
      <el-checkbox v-model="ruleForm.twoClassChecked">两班倒</el-checkbox>
      <el-row>
        <el-col :span="12">
          <el-form-item label="白班">
            <vue-timepicker v-if="showCom" v-model="ruleForm.dayClassData.on" :minute-interval="10"></vue-timepicker>
            <vue-timepicker
              v-if="showCom"
              v-model="ruleForm.dayClassData.off"
              :minute-interval="10"
            ></vue-timepicker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="夜班">
            <vue-timepicker
              v-if="showCom"
              v-model="ruleForm.nightClassData.on"
              :minute-interval="10"
            ></vue-timepicker>
            <vue-timepicker
              v-if="showCom"
              v-model="ruleForm.nightClassData.off"
              :minute-interval="10"
            ></vue-timepicker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-checkbox v-model="ruleForm.threeClassChecked">三班倒</el-checkbox>
      <el-row>
        <el-col :span="12">
          <el-form-item label="早班">
            <vue-timepicker
              v-if="showCom"
              v-model="ruleForm.mornClassData.on"
              :minute-interval="10"
            ></vue-timepicker>
            <vue-timepicker
              v-if="showCom"
              v-model="ruleForm.mornClassData.off"
              :minute-interval="10"
            ></vue-timepicker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="中班">
            <vue-timepicker
              v-if="showCom"
              v-model="ruleForm.noonClassData.on"
              :minute-interval="10"
            ></vue-timepicker>
            <vue-timepicker
              v-if="showCom"
              v-model="ruleForm.noonClassData.off"
              :minute-interval="10"
            ></vue-timepicker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="晚班">
            <vue-timepicker
              v-if="showCom"
              v-model="ruleForm.eveningClassData.on"
              :minute-interval="10"
            ></vue-timepicker>
            <vue-timepicker
              v-if="showCom"
              v-model="ruleForm.eveningClassData.off"
              :minute-interval="10"
            ></vue-timepicker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
        <el-button @click="isHide">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import VueTimepicker from '@/components/timepicker/VueTimepicker.vue'
import { getShopClasses, editClasses } from '../../../../services/operation';
export default {
  components: {
    VueTimepicker
  },
  data () {
    return {
      showCom: false,//显示组件
      ruleForm: {
        oneClassChecked: '',
        oneClassId: -1,
        //整班
        oneClassData: {
          on: {
            HH: '08',
            mm: '30'
          },
          off: {
            HH: '18',
            mm: '00'
          }
        },
        twoClassChecked: '',
        //白班
        dayClassId: -1,
        dayClassData: {
          on: {
            HH: '08',
            mm: '00'
          }, off: {
            HH: '00',
            mm: '00'
          }
        },
        //夜班
        nightClassId: -1,
        nightClassData: {
          on: {
            HH: '08',
            mm: '00'
          }, off: {
            HH: '00',
            mm: '00'
          }
        },
        threeClassChecked: '',
        //早班
        mornClassId: -1,
        mornClassData: {
          on: {
            HH: '00',
            mm: '00'
          }, off: {
            HH: '00',
            mm: '00'
          }
        },
        //中班
        noonClassId: -1,
        noonClassData: {
          on: {
            HH: '00',
            mm: '00'
          }, off: {
            HH: '00',
            mm: '00'
          }
        },
        //晚班
        eveningClassId: -1,
        eveningClassData: {
          on: {
            HH: '00',
            mm: '00'
          }, off: {
            HH: '00',
            mm: '00'
          }
        }
      },
      rules: {
        oneClassChecked: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
      },
      classData: [],
      formData: []
    }
  },
  created () {
    this.initData()
  },
  computed: {
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
  },
  methods: {
    initData () {
      //获取班次信息
      getShopClasses(this.shopNumber).then(res => {
        console.log('res', res);
        if (res.code == '200') {
          this.classData = res.data.array;
          this.createFormData(this.classData);
        }
      })
    },
    //构造表单数据
    createFormData (data) {
      console.log('object :', data);
      let that = this;
      data.forEach(g => {
        if (g.groupName == '一班倒') {
          that.ruleForm.oneClassChecked = g.show == 1 ? true : false;
          g.list.forEach(n => {
            if (n.startTime.indexOf(':') > -1) {
              let start = n.startTime.split(':');
              that.ruleForm.oneClassData.on.HH = start[0];
              that.ruleForm.oneClassData.on.mm = start[1];
            }
            if (n.endTime.indexOf(':') > -1) {
              let end = n.endTime.split(':');
              that.ruleForm.oneClassData.off.HH = end[0];
              that.ruleForm.oneClassData.off.mm = end[1];
            }
            that.ruleForm.oneClassId = n.id;
          })
        }
        else if (g.groupName == '二班倒') {
          that.ruleForm.twoClassChecked = g.show == 1 ? true : false;
          g.list.forEach(n => {
            if (n.startTime.indexOf(':') > -1) {
              let start = n.startTime.split(':');
              if (n.classesType == '白班') { //白班
                that.ruleForm.dayClassData.on.HH = start[0];
                that.ruleForm.dayClassData.on.mm = start[1];
              } else { //夜班
                that.ruleForm.nightClassData.on.HH = start[0];
                that.ruleForm.nightClassData.on.mm = start[1];
              }
            }
            if (n.endTime.indexOf(':') > -1) {
              let end = n.endTime.split(':');
              if (n.classesType == '白班') { //白班
                that.ruleForm.dayClassData.off.HH = end[0];
                that.ruleForm.dayClassData.off.mm = end[1];
              } else { //夜班
                that.ruleForm.nightClassData.off.HH = end[0];
                that.ruleForm.nightClassData.off.mm = end[1];
              }
            }
            if (n.classesType == '白班') {
              that.ruleForm.dayClassId = n.id;
            } else {
              that.ruleForm.nightClassId = n.id;
            }
          })
        }
        else if (g.groupName == '三班倒') {
          that.ruleForm.threeClassChecked = g.show == 1 ? true : false;
          g.list.forEach(n => {
            if (n.startTime.indexOf(':') > -1) {
              let start = n.startTime.split(':');
              if (n.classesType == '早班') {
                that.ruleForm.mornClassData.on.HH = start[0];
                that.ruleForm.mornClassData.on.mm = start[1];
              }
              else if (n.classesType == '中班') {
                that.ruleForm.noonClassData.on.HH = start[0];
                that.ruleForm.noonClassData.on.mm = start[1];
              }
              else { //晚班
                that.ruleForm.eveningClassData.on.HH = start[0];
                that.ruleForm.eveningClassData.on.mm = start[1];
              }
            }
            if (n.endTime.indexOf(':') > -1) {
              let end = n.endTime.split(':');
              if (n.classesType == '早班') {
                that.ruleForm.mornClassData.off.HH = end[0];
                that.ruleForm.mornClassData.off.mm = end[1];
              }
              else if (n.classesType == '中班') {
                that.ruleForm.noonClassData.off.HH = end[0];
                that.ruleForm.noonClassData.off.mm = end[1];
              }
              else { //晚班
                that.ruleForm.eveningClassData.off.HH = end[0];
                that.ruleForm.eveningClassData.off.mm = end[1];
              }
            }
            if (n.classesType == '早班') {
              that.ruleForm.mornClassId = n.id;
            } else if (n.classesType == '中班') {
              that.ruleForm.noonClassId = n.id;
            }
            else {
              that.ruleForm.eveningClassId = n.id;
            }
          })
        }
      });
      this.showCom = true;
      console.log('this.ruleForm', that.ruleForm)
      // this.$forceUpdate();
    },
    //关闭
    isHide () {
      this.$emit("onHide");
    },
    //保存数据
    submitForm (formName) {
      var that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          this.formData = [];
          //整班
          let oneItem = {
            "classesType": "整班",
            "endTime": that.ruleForm.oneClassData.off.HH + ':' + that.ruleForm.oneClassData.off.mm,
            "id": that.ruleForm.oneClassId,
            "name": "一班倒",
            "shopNumber": that.shopNumber,
            "show": that.ruleForm.oneClassChecked == true ? 1 : 0,
            "startTime": that.ruleForm.oneClassData.on.HH + ':' + that.ruleForm.oneClassData.on.mm,
          };
          this.formData.push(oneItem);
          //白班
          let dayItem = {
            "classesType": "白班",
            "endTime": that.ruleForm.dayClassData.off.HH + ':' + that.ruleForm.dayClassData.off.mm,
            "id": that.ruleForm.dayClassId,
            "name": "二班倒",
            "shopNumber": that.shopNumber,
            "show": that.ruleForm.twoClassChecked == true ? 1 : 0,
            "startTime": that.ruleForm.dayClassData.on.HH + ':' + that.ruleForm.dayClassData.on.mm,
          };
          this.formData.push(dayItem);

          //夜班
          let nightItem = {
            "classesType": "夜班",
            "endTime": that.ruleForm.nightClassData.off.HH + ':' + that.ruleForm.nightClassData.off.mm,
            "id": that.ruleForm.nightClassId,
            "name": "二班倒",
            "shopNumber": that.shopNumber,
            "show": that.ruleForm.twoClassChecked == true ? 1 : 0,
            "startTime": that.ruleForm.nightClassData.on.HH + ':' + that.ruleForm.nightClassData.on.mm,
          };
          this.formData.push(nightItem);

          //早班
          let mornItem = {
            "classesType": "早班",
            "endTime": that.ruleForm.mornClassData.off.HH + ':' + that.ruleForm.mornClassData.off.mm,
            "id": that.ruleForm.mornClassId,
            "name": "三班倒",
            "shopNumber": that.shopNumber,
            "show": that.ruleForm.threeClassChecked == true ? 1 : 0,
            "startTime": that.ruleForm.mornClassData.on.HH + ':' + that.ruleForm.mornClassData.on.mm,
          };
          this.formData.push(mornItem);

          //中班
          let noonItem = {
            "classesType": "中班",
            "endTime": that.ruleForm.noonClassData.off.HH + ':' + that.ruleForm.noonClassData.off.mm,
            "id": that.ruleForm.noonClassId,
            "name": "三班倒",
            "shopNumber": that.shopNumber,
            "show": that.ruleForm.threeClassChecked == true ? 1 : 0,
            "startTime": that.ruleForm.noonClassData.on.HH + ':' + that.ruleForm.noonClassData.on.mm,
          };
          this.formData.push(noonItem);

          //晚班
          let eveningItem = {
            "classesType": "晚班",
            "endTime": that.ruleForm.eveningClassData.off.HH + ':' + that.ruleForm.eveningClassData.off.mm,
            "id": that.ruleForm.eveningClassId,
            "name": "三班倒",
            "shopNumber": that.shopNumber,
            "show": that.ruleForm.threeClassChecked == true ? 1 : 0,
            "startTime": that.ruleForm.eveningClassData.on.HH + ':' + that.ruleForm.eveningClassData.on.mm,
          };
          this.formData.push(eveningItem);

          this.$emit("callBack", this.formData);
        }
      }
      );
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input--small .el-input__inner,
.el-input {
  width: 80px;
  float: left;
  margin-left: 15px;
}
</style>
<style lang="scss">
.class-select {
  .el-form-item--small .el-form-item__content {
    margin-right: 0px;
  }
}
</style>
