<template>
  <div>
    <div class="u-layout-search two u-layout-dobule pb0">
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <div class="title-input-group u-title-input-group">
            <p class="text">编辑排班月份：</p>
            <el-date-picker
              v-model="month"
              type="month"
              placeholder="选择月"
              :picker-options="pickerBeginMonthAfter"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <div class="u-layout-right-item">
        <el-button @click="onHide">返回</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="submitForm">保存</el-button>
      </div>
    </div>
    <div class="pl20">
      <span class="iconfont icon-jilu1 fl modify" @click="showEditClassWin=true" title="编辑班次"></span>
      <el-radio-group v-model="curClassId">
        <el-radio
          v-for="(item,index) in divisions"
          :key="index"
          :label="item.id"
        >{{item.classesType+item.startTime+'~'+item.endTime}}</el-radio>
      </el-radio-group>
      <table class="el-table__header tb-date" border="1" :class="{'ff':isFF}">
        <thead class="has-gutter">
          <tr>
            <th rowspan="2">姓名</th>
            <th v-for="(item,index) in weeks" :key="index">{{item}}</th>
          </tr>
          <tr>
            <th v-for="item in days" :key="item">{{item}}</th>
          </tr>
        </thead>
        <tbody :height="tableHeight" ref="table">
          <tr v-for="(user,rowIndex) in users" :key="rowIndex">
            <td>
              <span class="ellipsis username" :title="user.name">{{user.name}}</span>
            </td>
            <td
              v-for="day in days"
              :key="day"
              class="td-data"
              :class="{disabled:(day<=curDay&&month<=monthLastDate)}"
              @click.self="clickCell(user,day,rowIndex)"
              title="新增排班"
            >
              <span class="icon-items" @click.self="clickCell(user,day,rowIndex)">
                <i
                  class="fl icon"
                  title="删除排班"
                  @click.stop="clickIcon(d,day,rowIndex)"
                  v-for="(d,index) in tbData[rowIndex].data[day-1]"
                  :key="index"
                  :class="[getIconByClassId(d,day),tbData[rowIndex].data[day-1].length<2?'big':'small']"
                ></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--编辑班次 -->
    <el-dialog
      v-dialogDrag
      title="编辑班次"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="showEditClassWin"
      width="780px"
    >
      <class-select
        v-if="showEditClassWin"
        @onHide="showEditClassWin=false"
        @callBack="updateClass"
      ></class-select>
    </el-dialog>
  </div>
</template>

<script>
import dateUtils from '@/utils/datetime-utils.js';
import ClassSelect from './ClassSelect';
import { editClasses, getClassesTitle } from '../../../../services/operation';
import { getMemberClasses, getClassesMonth } from '../../../../services/operation';
import { GetIconByClassName } from '../../../../enum/operation-enum';
export default {
  components: {
    ClassSelect
  },
  props: {
    //当前班次月份
    curMonth: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      month: dateUtils.stringToDate(this.curMonth + '-01'),    //获取当前班次
      showEditClassWin: false,//是否显示编辑班次
      curClassId: '',//当前选中班次ID
      divisions: [],//已选中班次列表
      curMonthClass: [],//带过来的班次
      users: [], //人员
      pickerBeginMonthAfter: {
        disabledDate: time => {
          return time.getTime() < Date.now() //只能操作当前月份及以后的月份
        }
      },
      tbData: [],//当前表格数据
      curDay: new Date().getDate(),//18,获取当天是一个月第多少天
      tableHeight: 400,
      monthLastDate: dateUtils.getDateMonthLastDay(new Date()),//当月最后一天
      isFF: false,//是否是火狐浏览器
    }
  },
  created () {
    console.log('this.curMonth :', this.curMonth, this.month);
    console.log('created', this.days, new Date().getDate());
    this.initData();
  },
  mounted: function () {
    this.$common.initTableHeight(this, 254);
    this.isFF = navigator.userAgent.indexOf("Firefox") > -1;//火狐
  },
  computed: {
    days: function () {
      return dateUtils.getMonthLength(this.month);
    },
    weeks: function () {
      return dateUtils.getMonthWeek(this.month, this.days);
    },
    //门店编码
    shopNumber () {
      return this.$store.getters.shopNumber;
    },
    //所有班次数据：包含编辑跳转带过来的和编辑选中的班次结合
    allClassData () {
      return this.divisions.concat(this.curMonthClass)
    }
  },
  watch: {
    month (val) {
      this.initData();
    }
  },
  methods: {
    GetIconByClassName,
    initData () {
      //获取已选班次列表
      this.getClassTitleData();
      this.getItemList();
    },
    //获取当前班次月份的排班记录
    getItemList () {
      getMemberClasses({ date: dateUtils.getSpecialDay(this.month), shopNumber: this.shopNumber }).then(res => {
        if (res.code == 200) {
          this.curMonthClass = res.data.title;
          this.users = [];
          res.data.list.forEach(n => {
            this.users.push(n.user);
          })
          this.initTbData();
          this.tbData = res.data.list;
          console.log('this.tbData', this.tbData)
        }
      })
    },
    //获取已选班次列表
    getClassTitleData () {
      getClassesTitle(this.shopNumber).then(res => {
        if (res.code == 200) {
          this.divisions = res.data.array;
        }
      })
    },
    initTbData () {
      for (var i = 0; i < this.users.length; i++) {
        let row = { user: this.users[i], data: [] };
        for (var j = 0; j < this.days; j++) {
          row.data[j] = [];
        }
        this.tbData.push(row);
      }
      // console.log('initTbData :', this.tbData);
    },
    //点击单元格
    clickCell (user, day, rowIndex) {
      // console.log('点击单元格', user, day, rowIndex, this.curClassId);
      console.log('object :', this.month, this.monthLastDate);
      if (day <= this.curDay && this.month <= this.monthLastDate) {
        return;
      }
      if (!this.curClassId) {
        this.$message({
          message: '请先选择班次！',
          type: 'warning',
          duration: this.$baseConfig.messageDuration
        });
        return;
      }
      let ids = this.tbData[rowIndex].data[day - 1];
      if (ids.length == 2) {
        this.$message({
          message: '建议一天最多配置两个班次！',
          type: 'warning',
          duration: this.$baseConfig.messageDuration
        });
      }
      if (!ids.includes(this.curClassId)) {
        ids.push(this.curClassId);
      }
      // console.log('this.tbData', this.tbData)
      this.$forceUpdate();//强制更新数据
    },
    //点击图标
    clickIcon (d, day, rowIndex) {
      // console.log('点击图标', d, day, rowIndex);
      if (day <= this.curDay && this.month <= this.monthLastDate) {
        return;
      }
      let ids = this.tbData[rowIndex].data[day - 1];
      if (ids.includes(d)) {
        ids.remove(d);
      }
      this.$forceUpdate();//强制更新数据
    },
    //更新选择班次
    updateClass (data) {
      editClasses(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '保存成功！',
            type: 'success',
            duration: this.$baseConfig.messageDuration
          });
          this.showEditClassWin = false;
          this.getClassTitleData();
        }
      })
    },
    //保存
    submitForm () {
      console.log('this.tbData', this.tbData.length, JSON.stringify(this.tbData));
      //如果当前班次月份等于当前月份，则只取当天以后的数据进行提交
      if (dateUtils.getCurYearMonth() == dateUtils.getYearMonthByDate(this.month)) {
        let newTbData = [];
        for (let i = 0; i < this.tbData.length; i++) {
          let row = { user: this.tbData[i].user, data: [] };
          for (let j = this.curDay; j < this.tbData[i].data.length; j++) {
            row.data[j - this.curDay] = this.tbData[i].data[j];
          }
          newTbData.push(row);
        }
        console.log('newTbData :', newTbData);
        this.$emit('submitForm', dateUtils.getSpecialDay(this.month), newTbData)
      } else { //当前月份之后的排班
        this.$emit('submitForm', dateUtils.getSpecialDay(this.month), this.tbData);
      }
    },
    //返回
    onHide () {
      this.$emit('onHide')
    },
    //根据班次id获取班次图标
    getIconByClassId (id, day) {
      let disabled = day <= this.curDay && this.month <= this.monthLastDate;
      let classData = disabled == true ? this.allClassData : this.divisions; //如果是历史日期就取所有班次，否则取当前班次
      let name = '';
      if (classData.length > 0 && id) {
        let item = classData.find(n => n.id == id);
        name = item ? item.classesType : '';
      }
      return name ? this.GetIconByClassName(name) : '';
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
.tb-date {
  .td-data {
    cursor: pointer;
  }
}
</style>