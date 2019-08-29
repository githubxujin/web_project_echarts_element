<template>
  <div>
    <!-- 查看排班 -->
    <div v-show="showPage" class="look-class">
      <div class="u-layout-search u-layout-dobule pb0">
        <div class="u-layout-left-proviso">
          <div class="u-layout-left-item fl">
            <div class="title-input-group u-title-input-group">
              <p class="text">月份：</p>
              <el-select v-model="month" placeholder="请选择" @change="monthChange">
                <el-option
                  v-for="item in classOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <span
            v-if="showEditBtn&& pageBtns.some(val=>val=='edit')"
            class="iconfont icon-jilu1 fl modify"
            @click="onEdit"
            title="编辑排班"
          ></span>
        </div>
        <div class="u-layout-right-item">
          <el-button
            v-if="pageBtns.some(val=>val=='add')"
            type="primary"
            icon="el-icon-plus"
            @click="onAdd"
          >新增</el-button>
        </div>
      </div>
      <empty-data v-if="isEmpty" msg="暂无排班数据" height="480px"></empty-data>
      <div v-else class="pl20">
        <div class="fl">{{month}} 排班表</div>
        <div class="fr divisions">
          <dd v-for="(item,index) in divisions" :key="index">
            <i class="head-icon" :class="GetIconByClassName(item.classesType)"></i>
            {{item.classesType+item.startTime+'~'+item.endTime}}
          </dd>
        </div>
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
            <tr v-for="(item,index) in tbData" :key="index">
              <td>
                <span class="ellipsis username" :title="item.user.name">{{item.user.name}}</span>
              </td>
              <td v-for="(subItem,colIndex) in item.data" :key="colIndex" class="td-data">
                <span class="icon-items">
                  <i
                    class="icon"
                    v-for="(cItem,cIndex) in subItem"
                    :key="cIndex"
                    :class="[getIconByClassId(cItem),subItem.length<2?'big':'small']"
                  ></i>
                </span>
                <!-- {{subItem}} -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--新增排班-->
    <add-item
      v-if="showAddWin"
      @onHide="hideAddWin"
      @submitForm="submitAddForm"
      :curMonth="curMonth"
      :classOptions="classOptions"
    ></add-item>
    <!--编辑排班-->
    <edit-item
      v-if="showEditWin"
      @onHide="hideEditWin"
      @submitForm="submitEditForm"
      :curMonth="curMonth"
    ></edit-item>
  </div>
</template>

<script>
import dateUtils from '@/utils/datetime-utils.js';
import AddItem from './AddItem';
import EditItem from './EditItem';
import { getMemberClasses, getClassesMonth, editMemberClasses } from '../../../../services/operation';
import { GetIconByClassName } from '../../../../enum/operation-enum';
import EmptyData from '@/components/form/EmptyData';
import baseOptions from '@/utils/baseOptions';
export default {
  extends: baseOptions,
  components: {
    AddItem,
    EditItem,
    EmptyData
  },
  data () {
    return {
      //排班月份列表
      classOptions: [],
      month: dateUtils.getCurYearMonth(),//'2019-07',//月份，默认获取当前月份
      showAddWin: false, //是否显示新增弹窗
      divisions: [],//班次
      pickerBeginMonthAfter: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      GetIconByClassName,
      tbData: [],
      isEmpty: false,//是否没有排班数据
      showEditBtn: false,//是否显示编辑按钮
      showEditWin: false,//是否显示编辑弹窗
      showPage: true,//显示当前页面
      tableHeight: 400,
      curMonth: new Date(),
      isFF: false,//是否是火狐浏览器
    }
  },
  computed: {
    days: function () {
      return dateUtils.getMonthLength(this.curMonth);
    },
    weeks: function () {
      return dateUtils.getMonthWeek(this.curMonth, this.days);
    },
  },
  created () {
    // console.log(this.days);
    this.initData();
  },
  mounted: function () {
    this.$common.initTableHeight(this, 254);
    this.isFF = navigator.userAgent.indexOf("Firefox") > -1;//火狐
  },
  watch: {
    //门店编码
    shopNumber (val) {
      this.getItemList();
    },
    month (val) {
      this.showEditBtn = this.month >= dateUtils.getCurYearMonth();//如果大于等于当前月份则显示编辑按钮
    }
  },
  methods: {
    //控制loading隐藏和显示
    ctrlLoading (flag) {
      this.$common.updateLoadingStatus(flag);
    },
    initData () {
      //获取排班记录
      this.getItemList();
      //获取排班月份
      getClassesMonth(this.shopNumber).then(res => {
        this.classOptions = res.data.array.map(n => {
          return { value: n, label: n }
        })
        //如果排班列表中包含当前月份则显示编辑按钮
        if (res.data.array.includes(this.month)) {
          this.showEditBtn = true;
        }
      })
    },
    //新增
    onAdd () {
      this.curMonth = this.getCurMaxMonthDate();
      this.showAddWin = true;
      this.showPage = false;
    },
    //编辑
    onEdit () {
      this.curMonth = this.getCurMonth();
      // console.log('curMonth :', this.curMonth);
      this.showEditWin = true;
      this.showPage = false;
    },
    getCurMonth: function () {
      return dateUtils.stringToDate(this.month + '-01');
    },
    //当前班次列表中最大的一项
    getCurMaxMonthDate () {
      return this.classOptions.length > 0 ? dateUtils.stringToDate(this.classOptions[0].value) : new Date();
    },
    //获取排班记录
    getItemList () {
      getMemberClasses({ date: this.month + '-01', shopNumber: this.shopNumber }).then(res => {
        // console.log('res', res);
        if (res.code == 200) {
          this.tbData = res.data.list;
          this.divisions = res.data.title;
          this.isEmpty = res.data.title.length == 0;
        }
        this.ctrlLoading(false);
      })
    },
    //切换月份
    monthChange (val) {
      this.getItemList();
    },
    //新增-提交表单-回调
    submitAddForm (classesTime, data) {
      // console.log('submitAddForm :', classesTime, data);
      this.submitClassForm(classesTime, data, '新增');
      this.showAddWin = false;
      this.showPage = true;
    },
    //编辑-提交表单-回调
    submitEditForm (classesTime, data) {
      this.submitClassForm(classesTime, data, '编辑');
      this.showEditWin = false;
      this.showPage = true;
    },
    //设置排班信息
    submitClassForm (classesTime, data, title) {
      this.ctrlLoading(true);
      let newData = data.map(n => {
        return { data: n.data, userId: n.user.id };
      });
      editMemberClasses({ shopNumber: this.shopNumber, dataList: newData, classesTime: classesTime }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: title + '排班成功！',
            type: 'success',
            duration: this.$baseConfig.messageDuration
          });
          if (title == '编辑') {
            this.getItemList();
          } else {
            this.initData();
          }
        }
      })
    },
    //根据班次id获取班次图标
    getIconByClassId (id) {
      let name = '';
      if (this.divisions.length > 0 && id) {
        let item = this.divisions.find(n => n.id == id);
        name = item ? item.classesType : '';
      }
      return name ? this.GetIconByClassName(name) : '';
    },
    //隐藏编辑弹窗
    hideEditWin () {
      this.showPage = true;
      this.showEditWin = false;
      this.month = dateUtils.getCurYearMonth();
      this.initData();
    },
    //隐藏新增弹窗
    hideAddWin () {
      this.showPage = true;
      this.showAddWin = false;
      this.month = dateUtils.getCurYearMonth();
      this.initData();
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

