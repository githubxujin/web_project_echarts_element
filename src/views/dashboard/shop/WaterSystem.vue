<template>
  <div class="powerSystem">
    <span class="border left-top" />
    <span class="border right-top" />
    <span class="border left-bottom" />
    <span class="border right-bottom" />
    <card-head :title="title" :num="waterData.excepCount" @goToPage="goToPage"></card-head>
    <table class="power-table">
      <tr @click="goToPage('supply')">
        <td class="item">给水系统</td>
        <td>
          <ul class="detail-info">
            <li>
              <span>生活水箱</span>
              <span>({{waterData.supplySystem.livingBoxTotal}})</span>
            </li>
            <li>
              <span>运行水泵</span>
              <span
                v-show="waterData.supplySystem.livingPumpTotal"
              >({{waterData.supplySystem.livingPumpRunning}}/{{waterData.supplySystem.livingPumpTotal}})</span>
            </li>
          </ul>
          <ul class="detail-info">
            <li
              @mouseenter="showBox('supplyError',waterData.supplySystem.livingBoxAbnormal)"
              @mouseleave="hideBox('supplyError',waterData.supplySystem.livingBoxAbnormal)"
            >
              <span>异常报警</span>
              <span
                :class="{'error':waterData.supplySystem.livingBoxAbnormal}"
                v-show="waterData.supplySystem.livingBoxAbnormal"
              >({{waterData.supplySystem.livingBoxAbnormal}})</span>
              <div class="float-box" ref="supplyError">
                <p>给水系统</p>
                <p>共{{waterData.supplySystem.livingBoxTotal}}个生活水箱，{{waterData.supplySystem.livingBoxAbnormal}}个液位异常</p>
                <p
                  v-for="(item,index) in waterData.supplySystem.livingBoxExcep "
                  :key="index"
                >{{item}}</p>
              </div>
            </li>
            <li
              @mouseenter="showBox('supplyWaterPump',waterData.supplySystem.livingPumpFault)"
              @mouseleave="hideBox('supplyWaterPump',waterData.supplySystem.livingPumpFault)"
            >
              <span>故障水泵</span>
              <span
                :class="{'error':waterData.supplySystem.livingPumpFault}"
                v-if="waterData.supplySystem.livingPumpFault"
              >({{waterData.supplySystem.livingPumpFault}}/{{waterData.supplySystem.livingPumpTotal}})</span>
              <span v-else>(0)</span>
              <div class="float-box" ref="supplyWaterPump">
                <p>给水系统</p>
                <p>共{{waterData.supplySystem.livingPumpTotal}}个水泵，{{waterData.supplySystem.livingPumpFault}}个故障</p>
                <p
                  v-for="(item,index) in waterData.supplySystem.livingPumpExcep "
                  :key="index"
                >{{item}}</p>
              </div>
            </li>
          </ul>
        </td>
      </tr>
      <tr @click="goToPage('out')">
        <td class="item">排水系统</td>
        <td>
          <ul class="detail-info">
            <li>
              <span>集水井</span>
              <span>({{waterData.drainSystem.sumpBoxTotal}})</span>
            </li>
            <li>
              <span>运行水泵</span>
              <span
                v-show="waterData.drainSystem.sumpPumpTotal"
              >({{waterData.drainSystem.sumpPumpRunning}}/{{waterData.drainSystem.sumpPumpTotal}})</span>
            </li>
          </ul>
          <ul class="detail-info">
            <li
              @mouseenter="showBox('drainSystemError',waterData.drainSystem.sumpBoxAbnormal)"
              @mouseleave="hideBox('drainSystemError',waterData.drainSystem.sumpBoxAbnormal)"
            >
              <span>异常报警</span>
              <span
                :class="[waterData.drainSystem.sumpBoxAbnormal?'error':'']"
                v-show="waterData.drainSystem.sumpBoxAbnormal"
              >({{waterData.drainSystem.sumpBoxAbnormal}})</span>
              <div class="float-box" ref="drainSystemError">
                <p>排水系统</p>
                <p>共{{waterData.drainSystem.sumpBoxTotal}}个集水井，{{waterData.drainSystem.sumpBoxAbnormal}}个液位异常</p>
                <p v-for="(item,index) in waterData.drainSystem.sumpBoxExcep " :key="index">{{item}}</p>
              </div>
            </li>
            <li
              @mouseenter="showBox('drainWaterPump',waterData.drainSystem.sumpPumpFault)"
              @mouseleave="hideBox('drainWaterPump',waterData.drainSystem.sumpPumpFault)"
            >
              <span>故障水泵</span>
              <span
                :class="[waterData.drainSystem.sumpPumpFault?'error':'']"
                v-if="waterData.drainSystem.sumpPumpFault"
              >({{waterData.drainSystem.sumpPumpFault}}/{{waterData.drainSystem.sumpPumpTotal}})</span>
              <span v-else>(0)</span>
              <div class="float-box" ref="drainWaterPump">
                <p>排水系统</p>
                <p>共{{waterData.drainSystem.sumpPumpTotal}}个水泵，{{waterData.drainSystem.sumpPumpFault}}个故障</p>
                <p
                  v-for="(item,index) in waterData.drainSystem.sumpPumpExcep "
                  :key="index"
                >{{item}}</p>
              </div>
            </li>
          </ul>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import cardHead from './ShopCartHead';
import { getWaterAlarmList } from '@/services/dashboard'
export default {
  components: { cardHead },
  props: {
    shopNumber: {
      type: String
    },
    itemData: {
      type: Object
    }
  },
  data () {
    return {
      title: '给排水系统',
      waterData: {
        excepCount: 0,
        drainSystem: {
          livingBoxAbnormal: '',
          livingPumpRunning: ''
        },
        supplySystem: {
        }
      },
      showWarnningBox: {},
    }
  },
  created () {
    this.getWaterAlarmList()
    // this.handleList()
  },
  watch: {
    shopNumber (val) {
      this.getWaterAlarmList()
    },
    itemData: {
      handler: function (val, old) {
        if (val) {
          this.waterData = val.data;
        }
      }
    }
  },
  methods: {
    // 获取给排水系统信息
    getWaterAlarmList () {
      getWaterAlarmList(this.shopNumber).then(res => {
        if (res.code == 200) {
          this.waterData = res.data;
        } else {
          this.waterData = {}
        }
      })
    },
    showBox (type, num) {
      switch (type) {
        case 'supplyError':
          if (num) {
            this.show(num, type)
          }
          break;
        case 'supplyWaterPump':
          if (num) {
            this.show(num, type)
          }
          break;
        case 'drainSystemError':
          this.show(num, type)
          break;
        default:
          this.show(num, type)
          break;
      }
    },
    show (num, type) {
      if (num) {
        this.$refs[type].style.display = 'block'
      }
    },
    hideBox (type, num) {
      switch (type) {
        case 'supplyError':
          this.$refs.supplyError.style.display = 'none'
          break;
        case 'supplyWaterPump':
          this.$refs.supplyWaterPump.style.display = 'none'
          break;
        case 'drainSystemError':
          this.$refs.drainSystemError.style.display = 'none'
          break;
        default:
          this.$refs.drainWaterPump.style.display = 'none'
          break;
      }
    },
    goToPage (type) {
      if (type == 'supply') {
        this.$router.push({ path: '/safety/drainage/suppley-water' })
      } else {
        this.$router.push({ path: '/safety/drainage/out-water' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../index.scss";
.powerSystem {
  width: 100%;
  height: 100%;
  // overflow: hidden;
  // overflow-y: auto;
  color: #e6efff;
  .power-table {
    width: 100%;
    height: calc(100% - 44px);
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
    tr {
      height: 50%;
      &:first-child {
        td {
          border-bottom: 1px solid #3c6581;
        }
      }
      cursor: pointer;
    }
    td {
      text-align: center;
      font-size: 14px;
      position: relative;
      white-space: nowrap; /* 自适应宽度*/
      word-break: keep-all; /* 避免长单词截断，保持全部 */
      &.item {
        width: 100px;
      }
      &:first-child {
        border-right: 1px solid #3c6581;
      }
      &.warning {
        color: red;
      }
      .detail-info {
        width: 100%;
        // display: flex;
        // justify-content: center;
        // align-content: space-around;
        height: 36px;
        li {
          // flex: 1;
          width: 50%;
          float: left;
          height: 28px;
          line-height: 36px;
          position: relative;
          .active {
            color: red;
          }
          .error {
            color: #961940;
          }
          .float-box {
            position: absolute;
            right: 10%;
            top: 26px;
            width: 220px;
            // height: 100%;
            padding: 20px;
            box-sizing: border-box;
            line-height: 20px;
            text-align: left;
            display: none;
            background-color: #135786;
            border: 1px solid #67cbff;
            // background: url(../../../assets/images/shopIndex/rectangle.png)
            //   no-repeat 0 0;
            // background-size: 100% 100%;
            color: #e8efff;
            z-index: 1000;
          }
        }
      }
    }
  }
}
</style>


