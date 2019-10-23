<template>
  <div class="powerSystem">
    <span class="border left-top" />
    <span class="border right-top" />
    <span class="border left-bottom" />
    <span class="border right-bottom" />
    <card-head :num="powerData.warnNum" @goToPage="goToPage"></card-head>
    <div class="table-outer">
      <table class="power-table">
        <tr class="table-header">
          <th></th>
          <th>负载率</th>
          <th>实时功率</th>
          <th>功率因数</th>
          <th>绕组温度</th>
        </tr>
        <tr v-for="(item, index) in powerData.list" :key="index" @click="goToPage(item)">
          <td>{{item.name}}</td>
          <!-- item.loadRateMark&&item.loadRate>item.loadRateMark -->
          <td
            :class="{warning:parseInt(item.loadRate)>80}"
            @mouseenter="showBox(index,0)"
            @mouseleave="hideBox(index,0)"
            ref="hoverTd"
          >
            {{item.loadRate}}
            <div class="float-box" ref="loadRate">
              <p>{{item.name.length>9?item.name.substring(0,9)+'...':item.name}}</p>
              <p>负载率超标</p>
              <p>当前值：{{item.loadRate}}</p>
              <p>参数标准：{{item.loadRateMark}}</p>
            </div>
          </td>
          <td
            :class="{warning:item.realTimePowerMark&&item.realTimePower>item.cs}"
            @mouseenter="showBox(index,1)"
            @mouseleave="hideBox(index,1)"
            ref="hoverTd"
          >
            {{item.realTimePower}}
            <div class="float-box" ref="loadRate">
              <p>{{item.name.length>9?item.name.substring(0,9)+'...':item.name}}</p>
              <p>实时功率超标</p>
              <p>当前值：{{item.realTimePower}}</p>
              <p>参数标准：{{item.cs}}</p>
            </div>
          </td>
          <td
            :class="{warning:item.powerFactor<0.9}"
            @mouseenter="showBox(index,2)"
            @mouseleave="hideBox(index,2)"
            ref="hoverTd"
          >
            {{item.powerFactor}}
            <div class="float-box" ref="loadRate">
              <p>{{item.name.length>9?item.name.substring(0,9)+'...':item.name}}</p>
              <p>功率因数超标</p>
              <p>当前值：{{item.powerFactor}}</p>
              <p>参数标准：0.90</p>
            </div>
          </td>
          <td
            :class="{warning:parseInt(item.windingTemp)>70}"
            @mouseenter="showBox(index,3)"
            @mouseleave="hideBox(index,3)"
            ref="hoverTd"
          >
            {{item.windingTemp}}
            <div class="float-box" ref="loadRate">
              <p>{{item.name.length>9?item.name.substring(0,9)+'...':item.name}}</p>
              <p>绕组温度超标</p>
              <p>当前值：{{item.windingTemp}}</p>
              <p>参数标准：{{item.windingTempMark}}</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import cardHead from './ShopCartHead';
import { getElectricAlarmList } from '@/services/dashboard';
export default {
  components: { cardHead },
  props: {
    shopNumber: {
      type: String,
    },
    itemData: {
      type: Object
    }
  },
  data () {
    return {
      shopCode: this.shopNumber,
      powerData: {
        warnNum: 3,
        list: []
      },
      showWarnningBox: {},
    }
  },
  created () {
    this.getElectricAlarmList()
  },
  watch: {
    shopNumber (val) {
      this.shopCode = val;
      this.getElectricAlarmList();
    },
    itemData: {
      handler: function (val, old) {
        if (val) {
          this.powerData = val.data;
          //  console.log('powerData:'+JSON.stringify(this.powerData.list))
          if (this.powerData.list.length > 0) {
            this.handleList()
          }
        }
      }
    }
  },
  methods: {
    getElectricAlarmList () {
      getElectricAlarmList({ shopNumber: this.shopCode }).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.powerData = res.data;
            if (this.powerData.list.length > 0) {
              this.handleList()
            }
          }
        } else {
          this.powerData = {}
        }
      })
    },
    handleList () {
      this.powerData.list.forEach((item, ind) => {
        this.showWarnningBox[ind] = new Array()
        for (const key in item) {
          if (key == 'loadRate') {
            if (parseInt(item.loadRate) > 80) {
              this.showWarnningBox[ind][0] = true
            } else {
              this.showWarnningBox[ind][0] = false
            }
          } else if (key == 'realTimePower') {
            if (parseInt(item.realTimePower) > parseInt(item.realTimePowerMark)) {
              this.showWarnningBox[ind][1] = true
            } else {
              this.showWarnningBox[ind][1] = false
            }
          } else if (key == 'powerFactor') {
            // item.powerFactorMark && item.powerFactor > item.powerFactorMark
            if (item.powerFactor < 0.9) {
              this.showWarnningBox[ind][2] = true
            } else {
              this.showWarnningBox[ind][2] = false
            }
          } else if (key == 'windingTemp') {
            if (parseInt(item.windingTemp) > 70) {
              this.showWarnningBox[ind][3] = true
            } else {
              this.showWarnningBox[ind][3] = false
            }
          }
        }
      })
    },
    showBox (ind, num) {
      let n = ind * 4 + num
      console.log(this.$refs.hoverTd[n].getBoundingClientRect().left, this.$refs.hoverTd[n].clientWidth)
      let top = this.$refs.hoverTd[n].getBoundingClientRect().top + this.$refs.hoverTd[n].clientHeight;
      let left = this.$refs.hoverTd[n].getBoundingClientRect().left - this.$refs.hoverTd[n].clientWidth / 2;
      console.log('left', left)
      this.$refs.loadRate[n].style.display = this.showWarnningBox[ind][num] ? 'block' : 'none';
      this.$refs.loadRate[n].style.left = left + 'px';
      this.$refs.loadRate[n].style.top = top + 'px';
    },
    hideBox (ind, num) {
      let n = ind * 4 + num
      this.$refs.loadRate[n].style.display = 'none';
    },
    goToPage (item) {
      this.$router.push({ path: '/safety/power-sys', query: { id: item.transformerId } })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../index.scss";
.powerSystem {
  width: 100%;
  height: 100%;
  color: #e6efff;
  // &::-webkit-scrollbar {
  //   width: 6px;
  //   height: 6px;
  //   background-color: #ccc;
  // }
  .table-outer {
    width: 100%;
    height: calc(100% - 44px);
    overflow: hidden;
    overflow-y: auto;
  }
  .power-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
    cursor: pointer;
    td {
      text-align: center;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      position: relative;
      &:first-child {
        border-right: 1px solid #3c6581;
      }
      &.warning {
        color: red;
      }
      .float-box {
        position: fixed;
        width: 160px;
        height: 100px;
        box-sizing: border-box;
        border-radius: 4px;
        border: 1px solid #67cbff;
        padding: 10px;
        line-height: 20px;
        text-align: left;
        display: none;
        background-color: #135786;
        // background: url(../../../assets/images/shopIndex/rectangle.png)
        //   no-repeat 0 0;
        // background-size: 100% 100%;
        color: #f8ffff;
        z-index: 10000;
      }
    }
    .table-header {
      th {
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        border-bottom: 1px solid #3c6581;
        &:first-child {
          border-right: 1px solid #3c6581;
        }
      }
    }
  }
}
</style>


