<template>
  <div class="params-list">
    <!-- <el-form ref="form" label-width="80px"> -->
    <div class="item" v-for="(item,index) in items" :key="index">
      <div class="header-row">
        <el-row>
          <el-col :span="24">
            <div class="left-info">
              <el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
              <div class="fr">
                <span class="text fl">报警级别：</span>
                <div class="input-container fl select">
                  <div class="item select-input">
                    <el-select
                      v-model="item.level"
                      placeholder="请选择"
                      clearable
                      @change="levelChange(item,index)"
                    >
                      <el-option
                        v-for="item in levelOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <template v-if="item.showUser">
                  <span class="fl ml10">立即生成工单并指派给</span>
                  <div
                    class="input-container multiple fl"
                    :style="{width:getUserSelectWidth(item)}"
                  >
                    <div class="item select-input">
                      <el-select v-model="item.users" multiple placeholder="请选择" clearable>
                        <el-option
                          v-for="item in users"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="body-row">
        <el-form-item :label="item.firstOperator" v-if="item.firstOperateValue">
          <el-input v-model="item.msg"></el-input>
        </el-form-item>
        <el-form-item :label="item.secondOperator" v-if="item.secondOperateValue">
          <el-input v-model="item.msg"></el-input>
        </el-form-item>
        <el-form-item label="建议信息">
          <el-input v-model="item.msg"></el-input>
        </el-form-item>
      </div>
    </div>
    <!-- </el-form> -->
  </div>
</template>

<script>
import { alarmLevelOptions } from '../../../enum/alarm-enum.js';
export default {
  props: {
    billAlarmLevel: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    billAlarmLevel (newVal, oldVal) {
      console.log('强制刷新', newVal, this.billAlarmLevel)
      this.initPage();
    }
  },
  data () {
    return {
      showPage: true,
      levelOptions: alarmLevelOptions(),
      items: [
        { checked: true, name: '变压器绕组温度过高', level: 1, msg: '', users: [], firstOperator: '', firstOperateValue: '', secondOperator: '', secondOperateValue: '' },
        { checked: false, name: '变压器绕组温度过高1', level: 1, msg: '', users: [], firstOperator: '小于', firstOperateValue: 2, secondOperator: '大于', secondOperateValue: 4 }
      ],
      users:
        [{
          value: 1,
          label: '张三'
        }, {
          value: 2,
          label: '李四'
        }
          , {
          value: 3,
          label: '大刀王五'
        }
          , {
          value: 4,
          label: '小李飞刀李寻欢'
        },
        ]
    }
  },
  created () {
    this.initPage();
  },
  methods: {
    initPage () {
      let items = this.items.map(n => {
        if (this.billAlarmLevel.includes(n.level)) {
          n.showUser = true;
        } else {
          n.showUser = false;
        }
        return n;
      });
      this.items = items;
      console.log('this.items', this.items)
    },
    //选择级别
    levelChange (item, index) {
      //   console.log('选择的级别', item, index)
      item.showUser = this.billAlarmLevel.includes(item.level);
      this.items[index] = item;
    },
    //获取用户下拉框的高度
    getUserSelectWidth (item) {
      let initWidth = 95;
      var that = this;
      let users = item.users;
      if (users.length > 1) {
        for (var i = 1; i < users.length; i++) {
          console.log('n', that.users.find(s => s.value == users[i]))
          let user = that.users.find(s => s.value == users[i]);
          initWidth += (user && user.label.length == 2) ? 55 : user.label.length * 18;
        }
      }
      console.log('initWidth', initWidth)
      return initWidth + 'px';
    },
  }
}
</script>

<style lang="scss" scoped>
.left-info {
  display: flex;
  justify-content: space-between;
}
.el-select {
  width: 100%;
}
</style>
<style lang="scss">
.params-list {
  .el-input__inner {
    border-radius: 3px !important;
    background: #ffffff;
    // border-color: #ffffff;
  }
  .el-date-editor .el-input__inner,
  .el-select .el-input__inner {
    // border-radius: 30px !important;
    height: 32px !important;
    line-height: 32px;
    text-align: center;
    border: 1px solid #c3c9d5;
  }
  .el-select__tags-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 60px;
  }
  .input-container.select {
    width: 85px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
}
</style>
