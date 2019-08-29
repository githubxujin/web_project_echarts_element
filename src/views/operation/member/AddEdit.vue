<template>
  <div>
    <el-form ref="ruleForm" :model="userInfo" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名">{{userInfo.name}}</el-form-item>
          <el-form-item label="工号">{{userInfo.jobNumber}}</el-form-item>
          <el-form-item label="手机号">{{userInfo.phone}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="照片">
            <img v-if="userInfo.imgUrl" class="img" :src="userInfo.imgUrl" alt />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门">{{userInfo.departName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职位">{{userInfo.positionName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工单状态">{{userInfo.status}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前工单数">{{userInfo.billCount}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <full-calendar
      class="test-fc"
      :events="fcEvents"
      first-day="1"
      @changeMonth="changeMonth"
      :divisions="divisions"
      :tbData="tbData"
    >
      <template slot="fc-event-card" slot-scope="p">
        <p>
          <i class="fa"></i>
          {{ p.event.title }}
        </p>
      </template>
    </full-calendar>
    <div slot="footer" class="dialog-footer">
      <div style="display: inline-block">
        <el-button @click="isHide">关 闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getInfo, getInfoClasses } from '../../../services/operation';
import dateUtils from '@/utils/datetime-utils.js';
import FullCalendar from '@/components/calendar/index.vue';
export default {
  components: {
    FullCalendar
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    let demoEvents = [
      {
        title: '上班',
        start: '2019-07-01',
        cssClass: 'family'
      },
      {
        title: 'Lunfel 726-727',
        start: '2019-07-26',
        // end: '2019-07-27',
        // cssClass: ['home', 'work']
      },
    ];
    return {
      curMonth: dateUtils.getCurYearMonth(),//'2019-07',//月份，默认获取当前月份
      tbData: [],//排班信息
      divisions: [],//班次信息
      userInfo: {},
      dialogImageUrl: '',
      dialogVisible: false,
      rules: {
      },
      name: 'Sunny!',
      fcEvents: demoEvents
    }
  },
  watch: {
    id (val) {
      if (val > 0) {
        this.initData();
      }
    }
  },
  created () {
    this.initData();
  },
  methods: {
    //初始化数据
    initData () {
      getInfo(this.id).then(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.userInfo = res.data.info;
        }
      });
      this.getClassInfo();
    },
    //获取人员排班信息
    getClassInfo () {
      getInfoClasses({ classesTime: this.curMonth + '-01', userId: this.id }).then(res => {
        if (res.code == 200) {
          this.divisions = res.data.title;
          this.tbData = res.data.data;
        }
      })
    },
    //关闭
    isHide () {
      this.$emit("onHide")
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    'changeMonth' (start, end, current) {
      console.log('changeMonth', start.format(), end.format(), current.format())
      this.curMonth = current.format('YYYY-MM');
      console.log('this.curMonth :', this.curMonth);
      this.getClassInfo();
    },
    // 'eventClick' (event, jsEvent, pos) {
    //   console.log('eventClick', event, jsEvent, pos)
    // },
    // 'dayClick' (day, jsEvent) {
    //   console.log('dayClick', day, jsEvent)
    // },
    // 'moreClick' (day, events, jsEvent) {
    //   console.log('moreCLick', day, events, jsEvent)
    // }
  }
}
</script>

<style lang="scss" scoped>
.img {
  width: 100px;
  height: 100px;
  line-height: 100px;
  float: left;
}
</style>