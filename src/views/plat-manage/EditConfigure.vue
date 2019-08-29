<template>
  <div class="user-editor">
    <el-form ref="form"
             :model="form"
             label-width="90px"
             size="mini"
             inline>
      <el-row>

        <el-form-item prop="title"
                      label="报警等级">

          <el-checkbox v-for="item in form.levelList"
                       v-model="item.checked"
                       :key="item.name">{{item.name}}</el-checkbox>

        </el-form-item>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="title"
                        label="报警推送给">
            <el-checkbox v-model="form.billList[0].checked">{{form.billList[0].shopManager }}</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="title"
                        label="">

            <el-checkbox v-model="form.billList[1].checked">{{form.billList[1].shopExecutor }}</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="title"
                        label="工单推送给">

            <el-checkbox v-model="form.alarmList[0].checked">{{form.alarmList[0].shopManager }}</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="title"
                        label="">

            <el-checkbox v-model="form.alarmList[1].checked">{{form.alarmList[1].shopExecutor }}</el-checkbox>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row class="text-center">
        <el-button type="primary"
                   round
                   size="mini"
                   @click="submit">确认
        </el-button>
        <el-button round
                   size="mini"
                   @click="close">取 消
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getSmsPushConfig, setSmsPushConfig } from '@/services/plat-manage';

export default {
  props: {
      configdialogVisible: Boolean
  },
  data () {
    return {
      checkedGrade: [],
      form: {

        "levelList": [
          {
            "name": "一级",
            "checked": false,
            "id": 191
          },
          {
            "name": "二级",
            "checked": false,
            "id": 192
          }
        ],
        "billList": [
          {
            "shopManager": "门店管理者",
            "checked": false,
            "id": 3
          },
          {
            "shopExecutor": "门店执行者",
            "checked": false,
            "id": 4
          }
        ],
        "alarmList": [
          {
            "shopManager": "门店管理者",
            "checked": false,
            "id": 3
          },
          {
            "shopExecutor": "门店执行者",
            "checked": false,
            "id": 4
          }
        ]
      }
    }
  },
  created () {
  },
  mounted () {


    getSmsPushConfig("").then((res) => {

      this.form = res.data;

    }).catch((error) => {

    });

  }
  , methods: {
    submit () {
      let levelListcheckCount = 0;
      for (let i = 0; i < this.form.levelList.length; i++) {
        if (this.form.levelList[i].checked) {
          levelListcheckCount += 1;
        }
      }
      if (levelListcheckCount == 0) {
        this.$message.error("报警等级至少选择一个"); return;
      }

      let billListcheckCount = 0;
      for (let i = 0; i < this.form.billList.length; i++) {
        if (this.form.billList[i].checked) {
          billListcheckCount += 1;
        }
      }
      if (billListcheckCount == 0) {
        this.$message.error("报警推送给至少选择一个"); return;
      }
      let alarmListcheckCount = 0;
      for (let i = 0; i < this.form.alarmList.length; i++) {
        if (this.form.alarmList[i].checked) {
          alarmListcheckCount += 1;
        }
      }
      if (alarmListcheckCount == 0) {
        this.$message.error("工单推送给至少选择一个");
        return;
      }

      setSmsPushConfig({ "data": this.form }).then((res) => {
        if (res.code == 200) {
          this.form = res.data;
          this.$message.success("操作成功");
          this.close();
        }
      }).catch((error) => {

      });
    },
    close () {
      this.$emit('update:configdialogVisible', false);
    }
  }
}
</script>
<style lang="scss" scoped>
.user-editor {
  .text-center {
    text-align: center;
  }
}

/deep/ .el-textarea {
  width: 550px;
}
</style>

