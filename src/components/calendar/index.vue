<template>
  <div class="comp-full-calendar">
    <!-- header pick month -->
    <fc-header
      :current-month="currentMonth"
      :first-day="firstDay"
      :locale="locale"
      @change="emitChangeMonth"
    >
      <div slot="header-left">
        <slot name="fc-header-left"></slot>
      </div>

      <div slot="header-right">
        <slot name="fc-header-right"></slot>
      </div>
    </fc-header>
    <div class="class-info">
      <div class="fl">排班信息</div>
      <div class="fr divisions" v-if="divisions.length>0">
        <dd v-for="(item,index) in divisions" :key="index">
          <i class="head-icon" :class="GetIconByClassName(item.classesType)"></i>
          {{item.classesType+item.startTime+'~'+item.endTime}}
        </dd>
      </div>
    </div>
    <!-- body display date day and events -->
    <div class="full-calendar-body">
      <div class="weeks">
        <strong
          class="week"
          v-for="dayIndex in 7"
          :key="dayIndex"
        >{{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}</strong>
      </div>
      <div class="dates" ref="dates">
        <div class="dates-bg">
          <div class="week-row" v-for="(week,index) in currentDates" :key="index">
            <div
              class="day-cell"
              v-for="(day,dIndex) in week"
              :key="dIndex"
              :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth}"
            >
              <p class="day-number">{{ day.monthDay }}</p>
              <!-- {{tbData.length+','+index+','+day.monthDay+','+currentDates.length}} -->
              <template v-if="tbData.length>0">
                <!-- 第一行不会大于7，最后两行不会小于14 -->
                <span
                  v-if="(index==0&&day.monthDay>7)||(index>=currentDates.length-2&&day.monthDay<14)"
                ></span>
                <span v-else class="icon-items">
                  <i
                    class="icon"
                    v-for="(cItem,cIndex) in tbData[day.monthDay-1]"
                    :key="cIndex"
                    :class="[getIconByClassId(cItem),tbData[day.monthDay-1].length<2?'big':'small']"
                  ></i>
                </span>
              </template>
            </div>
          </div>
        </div>

        <!-- absolute so we can make dynamic td -->
        <div v-if="!readOnly" class="dates-events">
          <div class="events-week" v-for="(week,index) in currentDates" :key="index">
            <div
              class="events-day"
              v-for="(day,wIndex) in week"
              :key="wIndex"
              track-by="$index"
              :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth}"
              @click.stop="dayClick(day.date, $event)"
            >
              <p class="day-number">{{day.monthDay}}</p>
              <div class="event-box">
                <event-card
                  :event="event"
                  :date="day.date"
                  :firstDay="firstDay"
                  v-for="(event,dIndex) in day.events"
                  :key="dIndex"
                  v-show="event.cellIndex <= eventLimit"
                  @click="eventClick"
                >
                  <template slot-scope="p">
                    <slot name="fc-event-card" :event="p.event"></slot>
                  </template>
                </event-card>
                <p
                  v-if="day.events.length > eventLimit"
                  class="more-link"
                  @click.stop="selectThisDay(day, $event)"
                >+ {{day.events[day.events.length -1].cellIndex - eventLimit}} more</p>
              </div>
            </div>
          </div>
        </div>

        <!-- full events when click show more -->
        <div
          class="more-events"
          v-show="showMore"
          :style="{left: morePos.left + 'px', top: morePos.top + 'px'}"
        >
          <div class="more-header">
            <span class="title">{{ moreTitle(selectDay.date) }}</span>
            <span class="close" @click.stop="showMore = false">x</span>
          </div>
          <div class="more-body">
            <ul class="body-list">
              <li
                v-for="(event,eIndex) in selectDay.events"
                v-show="event.isShow"
                class="body-item"
                :key="eIndex"
                @click="eventClick(event, $event)"
              >{{event.title}}</li>
            </ul>
          </div>
        </div>

        <slot name="body-card"></slot>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
// import langSets from './lang-sets'
import dateFunc from './date-func.js'
import moment from 'moment';
import EventCard from './EventCard.vue';
import Header from './Header';
//设定moment区域为中国
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { GetIconByClassName } from '@/enum/operation-enum';

export default {
  components: {
    'event-card': EventCard,
    'fc-header': Header
  },
  props: {
    //如果是只读
    readOnly: {
      type: Boolean,
      default: true
    },
    events: { // events will be displayed on calendar
      type: Array,
      default: () => []
    },
    //班次信息
    divisions: {
      type: Array,
      default: () => []
    },
    //排班数据
    tbData: {
      type: Array,
      default: () => []
    },
    locale: {
      type: String,
      default: 'zh'
    },
    firstDay: {
      type: Number | String,
      validator (val) {
        let res = parseInt(val);
        return res >= 0 && res <= 6
      },
      default: 0
    }
  },
  mounted () {
    this.emitChangeMonth(this.currentMonth);
  },
  data () {
    return {
      currentMonth: moment().startOf('month'),
      isLismit: true,
      eventLimit: 3,
      showMore: false,
      morePos: {
        top: 0,
        left: 0
      },
      selectDay: {}
    }
  },
  computed: {
    currentDates () {
      console.log('this.getCalendar() :', this.currentMonth, this.getCalendar());
      return this.getCalendar()
    }
  },
  methods: {
    GetIconByClassName,
    //根据班次id获取班次图标
    getIconByClassId (id) {
      let name = '';
      if (this.divisions.length > 0 && id) {
        let item = this.divisions.find(n => n.id == id);
        name = item ? item.classesType : '';
      }
      return name ? this.GetIconByClassName(name) : '';
    },
    emitChangeMonth (firstDayOfMonth) {
      this.currentMonth = firstDayOfMonth;

      let start = dateFunc.getMonthViewStartDate(firstDayOfMonth, this.firstDay);
      let end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay);

      this.$emit('changeMonth', start, end, firstDayOfMonth)
    },
    moreTitle (date) {
      if (!date) return '';
      return moment(date).format('ll');
    },
    getCalendar () {
      // calculate 2d-array of each month
      let monthViewStartDate = dateFunc.getMonthViewStartDate(this.currentMonth, this.firstDay);
      let calendar = [];

      for (let perWeek = 0; perWeek < 6; perWeek++) {
        let week = [];

        for (let perDay = 0; perDay < 7; perDay++) {
          week.push({
            monthDay: monthViewStartDate.date(),
            isToday: monthViewStartDate.isSame(moment(), 'day'),
            isCurMonth: monthViewStartDate.isSame(this.currentMonth, 'month'),
            weekDay: perDay,
            date: moment(monthViewStartDate),
            events: this.slotEvents(monthViewStartDate)
          });

          monthViewStartDate.add(1, 'day');
        }

        calendar.push(week);
      }

      return calendar
    },
    slotEvents (date) {

      // find all events start from this date
      let cellIndexArr = [];
      let thisDayEvents = this.events.filter(day => {
        let st = moment(day.start);
        let ed = moment(day.end ? day.end : st);

        return date.isBetween(st, ed, null, '[]');
      });

      // sort by duration
      thisDayEvents.sort((a, b) => {
        if (!a.cellIndex) return 1;
        if (!b.cellIndex) return -1;
        return a.cellIndex - b.cellIndex
      });

      // mark cellIndex and place holder
      for (let i = 0; i < thisDayEvents.length; i++) {
        thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1);
        thisDayEvents[i].isShow = true;
        if (thisDayEvents[i].cellIndex == i + 1 || i > 2) continue;
        thisDayEvents.splice(i, 0, {
          title: 'holder',
          cellIndex: i + 1,
          start: date.format(),
          end: date.format(),
          isShow: false
        })
      }

      return thisDayEvents
    },
    selectThisDay (day, jsEvent) {
      this.selectDay = day;
      this.showMore = true;
      this.morePos = this.computePos(event.target);
      this.morePos.top -= 100;
      let events = day.events.filter(item => {
        return item.isShow == true
      });
      this.$emit('moreClick', day.date, events, jsEvent)
    },
    computePos (target) {
      let eventRect = target.getBoundingClientRect();
      let pageRect = this.$refs.dates.getBoundingClientRect();
      return {
        left: eventRect.left - pageRect.left,
        top: eventRect.top + eventRect.height - pageRect.top
      }
    },
    dayClick (day, jsEvent) {
      this.$emit('dayClick', day, jsEvent)
    },
    eventClick (event, jsEvent) {
      if (!event.isShow) return;

      jsEvent.stopPropagation();
      let pos = this.computePos(jsEvent.target);
      this.$emit('eventClick', event, jsEvent, pos);
    }
  },
  filters: {
    localeWeekDay (weekday, firstDay, locale) {
      firstDay = parseInt(firstDay);
      const localMoment = moment().locale(locale);
      return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7];
    }
  }
}

</script>
<style lang="scss">
.comp-full-calendar {
  // font-family: "elvetica neue", tahoma, "hiragino sans gb";
  // padding: 20px;
  background: #fff;
  max-width: 960px;
  margin: 0 auto;
  ul,
  p {
    margin: 0;
    padding: 0;
  }
}

.full-calendar-body {
  margin-top: 0px;
  .weeks {
    display: flex;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    .week {
      flex: 1;
      text-align: center;
      border-right: 1px solid #e0e0e0;
    }
  }
  .dates {
    position: relative;
    .week-row {
      // width: 100%;
      // position:absolute;
      border-left: 1px solid #e0e0e0;
      display: flex;
      .day-cell {
        position: relative;
        flex: 1;
        min-height: 40px;
        padding: 4px;
        border-right: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        .day-number {
          text-align: right;
          line-height: 20px;
          position: absolute;
          right: 5px;
        }
        &.today {
          background-color: #fcf8e3;
        }
        &.not-cur-month {
          .day-number {
            color: rgba(0, 0, 0, 0.24);
          }
        }
      }
    }
    .dates-events {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      .events-week {
        display: flex;
        .events-day {
          cursor: pointer;
          flex: 1;
          min-height: 112px;
          overflow: hidden;
          text-overflow: ellipsis;
          .day-number {
            text-align: right;
            padding: 4px 5px 4px 4px;
            opacity: 0;
          }
          &.not-cur-month {
            .day-number {
              color: rgba(0, 0, 0, 0.24);
            }
          }
          .event-box {
            .event-item {
              cursor: pointer;
              font-size: 12px;
              background-color: #c7e6fd;
              margin-bottom: 2px;
              color: rgba(0, 0, 0, 0.87);
              padding: 0 0 0 4px;
              height: 18px;
              line-height: 18px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              &.is-start {
                margin-left: 4px;
                // border-top-left-radius:4px;
                // border-bottom-left-radius:4px;
              }
              &.is-end {
                margin-right: 4px;
                // border-top-right-radius:4px;
                // border-bottom-right-radius:4px;
              }
              &.is-opacity {
                opacity: 0;
              }
            }
            .more-link {
              cursor: pointer;
              // text-align: right;
              padding-left: 8px;
              padding-right: 2px;
              color: rgba(0, 0, 0, 0.38);
              font-size: 14px;
            }
          }
        }
      }
    }
    .more-events {
      position: absolute;
      width: 150px;
      z-index: 2;
      border: 1px solid #eee;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      .more-header {
        background-color: #eee;
        padding: 5px;
        display: flex;
        align-items: center;
        font-size: 14px;
        .title {
          flex: 1;
        }
        .close {
          margin-right: 2px;
          cursor: pointer;
          font-size: 16px;
        }
      }
      .more-body {
        height: 146px;
        overflow: hidden;
        .body-list {
          height: 144px;
          padding: 5px;
          overflow: auto;
          background-color: #fff;
          .body-item {
            cursor: pointer;
            font-size: 12px;
            background-color: #c7e6fd;
            margin-bottom: 2px;
            color: rgba(0, 0, 0, 0.87);
            padding: 0 0 0 4px;
            height: 18px;
            line-height: 18px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import '@/views/operation/member/scheduling/index.scss';
</style>
<style lang="sass" scoped>
.class-info{
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
}
.icon-items{
  height:100%;
}
</style>

