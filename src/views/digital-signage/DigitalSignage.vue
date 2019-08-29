<template>
  <div class="digital-signage">
    <header class="header">
      <span class="line left" />
      <span class="line right" />
      <div class="title">红星美凯龙-{{ ($store.getters.getUserInfo || {}).shopName }}</div>
    </header>
    <div class="section">
      <section>
        <div class="section-block">
          <div class="problems-list">
            <div
              v-for="(item, index) in problemList"
              :key="index"
              class="problem-item"
              :class="{'error': item.number}"
            >
              <span class="label">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.label}}</span>
              </span>
              <span class="number">{{item.number || 0}}</span>
            </div>
          </div>
          <div class="table-block">
            <div class="table-header">
              <table>
                <tr>
                  <td v-for="(item, index) in tableHeaderList" :key="index">{{ item }}</td>
                </tr>
              </table>
            </div>
            <div class="table-body">
              <el-scrollbar
                ref="scrollbar"
                class="table-scrollbar"
                tag="div"
                wrap-class="select-dropdown__wrap"
                view-class="el-select-dropdown__list"
              >
                <table>
                  <tbody>
                    <tr
                      v-for="(item, index) in tableDataList"
                      :key="index"
                      :class="{'warning': [1,2].includes(item.status)}"
                    >
                      <td>{{item.deviceName}}</td>
                      <td>{{item.alarmName}}</td>
                      <td>{{item.alarmLocation}}</td>
                      <td>{{item.handler || '--'}}</td>
                      <td>{{item.status | translate(statusList)}}</td>
                      <td>{{item | translateTime}}</td>
                    </tr>
                  </tbody>
                </table>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import WebsocketMixin from './WebsocketMixin'
export default {
  name: 'DigitalSignage',
  mixins: [WebsocketMixin],
  data () {
    return {
      statusList: [ // 事件状态字典
        {
          label: '未确认',
          value: 0
        },
        {
          label: '已忽略',
          value: 1
        },
        {
          label: '处理中',
          value: 2
        },
        {
          label: '已解决',
          value: 3
        }
      ],
      tableHeaderList: ['报警设备', '报警指标', '报警位置', '负责人员', '处理阶段', '处理时间'], // 表头列表
    }
  },
  computed: {
    tableDataList () {
      if (!this.webSocketData || !this.webSocketData.info) return []
      return this.webSocketData.info
    },
    problemList () {
      let problemList = [
        {
          key: 'power',
          label: '供配电',
          number: 0,
          icon: 'icon-electricity_icon'
        },
        {
          key: 'drainage',
          label: '给排水',
          number: 0,
          icon: 'icon-jienengguanli'
        },
        {
          key: 'elevator',
          label: '电梯',
          number: 0,
          icon: 'icon-dianti'
        },
        {
          key: 'air',
          label: '空调',
          number: 0,
          icon: 'icon-kongtiao'
        }
      ]
      if (!this.webSocketData || !this.webSocketData.count) return problemList
      problemList.forEach(item => {
        item.number = this.webSocketData.count[item.key] || 0
      })
      return problemList
    }
  },
  created () {
    this.websocketParams = this.$store.getters.shopNumber
    this.initWebSocket()
  },
  watch: {},
  filters: {
    translateTime (item) {
      let times = item.status < 3 ? item.responseTimeLength : item.finishTimeLength
      times = times || 0
      let hours = parseInt(times / 3600)
      hours = hours < 10 ? '0' + hours : hours
      let minutes = times % 3600 ? parseInt(times % 3600 / 60) : 0
      minutes = minutes < 10 ? '0' + minutes : minutes
      let seconds = times - hours * 3600 - minutes * 60
      seconds = seconds < 10 ? '0' + seconds : seconds
      return `${hours}:${minutes}:${seconds}`
    }
  }
}
</script>
<style lang="scss">
.digital-signage {
  .select-dropdown__wrap {
    max-height: 100%;
    overflow-x: hidden;
  }
}
</style>
<style lang="scss" scoped>
$borderLine: 1px solid #44e7ff;
$borderRadius: 10px;
$firstPadding: 10px;
$headerHeight: 100px;
/deep/ .iconfont {
  font-size: 64px;
  margin-left: 10px;
}
@mixin normalBg {
  background: -webkit-linear-gradient(
    left,
    #399185,
    #61ea75
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #399185,
    #61ea75
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #399185,
    #61ea75
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #399185, #61ea75); /* 标准的语法 */
}
@mixin errorBg {
  background: -webkit-linear-gradient(
    left,
    #c12a23,
    #ec4b46
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #c12a23,
    #ec4b46
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #c12a23,
    #ec4b46
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #c12a23, #ec4b46); /* 标准的语法 */
}
.digital-signage {
  background: #182237;
  width: 100%;
  height: 100%;
  min-height: 500px;
  box-sizing: border-box;
  position: relative;
  > .header {
    width: 100%;
    height: $headerHeight;
    line-height: $headerHeight;
    box-sizing: border-box;
    padding-bottom: 0;
    position: relative;
    text-align: center;
    .line {
      position: absolute;
      width: 50%;
      height: 100%;
      box-sizing: border-box;
      &.left {
        left: $firstPadding;
        top: 53px;
        border-top: $borderLine;
        border-left: $borderLine;
        border-top-left-radius: $borderRadius;
      }
      &.right {
        right: $firstPadding;
        top: 40px;
        border-top: $borderLine;
        border-right: $borderLine;
        border-top-right-radius: $borderRadius;
      }
    }
    .title {
      height: 90px;
      line-height: 90px;
      font-size: 50px;
      color: #fff;
      display: inline-block;
      position: relative;
      z-index: 2000;
      padding: 0 20px;
      background: url("../../assets/images/digital-signage/header.png")
        no-repeat;
      background-size: 100% 100%;
    }
  }
  > .section {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: $firstPadding;
    padding-top: $headerHeight;
    > section {
      border: $borderLine;
      border-bottom-left-radius: $borderRadius;
      border-bottom-right-radius: $borderRadius;
      border-top: none;
      padding: 20px;
      box-sizing: border-box;
      height: 100%;
      .section-block {
        position: relative;
        height: 100%;
        .problems-list {
          position: absolute;
          width: 100%;
          color: #fff;
          display: flex;
          justify-content: space-between;
          .problem-item {
            $height: 160px;
            min-width: 300px;
            max-width: 400px;
            width: 23%;
            height: $height;
            line-height: $height;
            vertical-align: middle;
            > span {
              display: inline-block;
              line-height: $height;
              vertical-align: top;
            }
            .label {
              float: left;
              padding-left: 0px;
              font-size: 56px;
              position: relative;
              i {
                position: absolute;
                opacity: 0.3;
              }
              span {
                margin-left: 50px;
              }
            }
            .number {
              float: right;
              padding-right: 40px;
              font-size: 112px;
            }
            @include normalBg;
            &.error {
              @include errorBg;
            }
          }
        }
        .table-block {
          position: relative;
          height: 100%;
          padding-top: 180px;
          box-sizing: border-box;
          font-size: 32px;
          color: #fff;
          $header: 70px;
          table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            td {
              width: 15%;
              height: $header;
              line-height: $header;
              text-align: center;
            }
          }
          .table-header {
            position: absolute;
            box-shadow: 0px 0px 20px 0px rgba(255, 255, 255, 0.4) inset;
          }
          .table-body {
            height: 100%;
            padding-top: $header;
            box-sizing: border-box;
            .table-scrollbar {
              height: 100%;
            }
            tr {
              cursor: pointer;
              &:nth-child(even),
              &:hover {
                background: rgba(255, 255, 255, 0.02);
              }
              &.warning {
                font-size: 38px;
                color: yellow;
              }
            }
          }
        }
      }
    }
  }
}
</style>

