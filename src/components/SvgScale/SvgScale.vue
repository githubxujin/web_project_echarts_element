<template>
  <div class="wrapper">
    <svg
      id="svg1"
      :width="svgData.width"
      :height="svgData.height"
      :viewBox="`0 0 ${svgData.width} ${svgData.height}`"
      class="doughnut-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-for="(cur, index) in renderList"
        :key="index"
        :d="cur | getPath(arcData)"
        :stroke="colorMap[index]"
        :stroke-width="arcData.stockWidth"
        fill="none"
      />
      <text
        :transform="`rotate(180, 100, 100)`"
        fill="#fff"
        x="90"
        y="23"
        font-size="12"
        style="fill:#fff;font-weight:bold;"
      >8.8</text>
      <text
        :transform="`rotate(135, 100, 100)`"
        fill="#fff"
        x="90"
        y="23"
        font-size="12"
        style="fill:#fff;font-weight:bold;"
      >5.5</text>
      <text
        :transform="`rotate(90, 100, 100)`"
        fill="#fff"
        x="90"
        y="23"
        font-size="12"
        style="fill:#fff;font-weight:bold;"
      >4.1</text>
      <text
        :transform="`rotate(45, 100, 100)`"
        fill="#fff"
        x="90"
        y="23"
        font-size="12"
        style="fill:#fff;font-weight:bold;"
      >3.5</text>
      <text
        :transform="`rotate(0, 100, 100)`"
        fill="#fff"
        x="90"
        y="23"
        font-size="12"
        style="fill:#fff;font-weight:bold;"
      >2.7</text>
      <image
        v-if="integral >= 2.1 && integral <= 8.8"
        :transform="`rotate(${deg}, 100, 100)`"
        :xlink:href="pointer"
        x="65"
        y="40"
        height="70"
        width="70"
      />
    </svg>
    <!--<div class="msg">-->
      <!--<p>{{score}}</p>-->
      <!--<span>系统COP</span>-->
    <!--</div>-->
  </div>
</template>

<script>
import pointer from '../../../static/img/coldTools/pointerWhite.png'
import { setTimeout } from 'timers';
const RIGHT_DEG = 198;
const LEFT_DEG = -18;
export default {
  props: {
    score: {
      type: Number,
      default: 2.1
    }
  },
  data() {
    return {
      pointer,
      list: [ // 占比列表
        '12.5%',
        '12.5%',
        '50%',
        '12.5%',
        '12.5%'
      ],
      renderList: [], // 处理后用于渲染环形图的数据
      svgData: { // svg 数据 即画布参数
        width: 200,
        height: 200
      },
      arcData: { // 环形图参数
        r: 60, // 环形图的半径
        x0: 100, // 圆心x，一般把环形图放在画布中心位置就好
        y0: 100, // 同上
        stockWidth: 20 // 环形图的粗度...
      },
      deg: 0,
      colorMap: [ // 环形图颜色映射表
        '#00B050',
        '#0a69cb',
        '#17294A',
        '#C00000',
        '#FFFF00'
      ],
      integral: 3.9

    }
  },
  created() {
    this.integral = this.score > 8.8 ? 8.8 : this.score < 2.7 ? 2.7 : this.score;
    this.renderList = this.handleChartData(this.list);
  },
  mounted() {
    this.calcDeg();
  },
  filters: {
    getPath(cur, arcData) {
      // 这里在通过 圆心(x0, y0) r ,拼接好路径数据
      const { x0, y0, r } = arcData;
      let str = 'M';
      const isLargeArc = cur.relayPer > 50 ? 1 : 0;
      const startX = cur.start.x * r + x0;
      const startY = cur.start.y * r + y0;
      const endX = cur.end.x * r + x0;
      const endY = cur.end.y * r + y0;
      str += ' ' + startX +
        ' ' + startY +
        ' ' + 'A' +
        ' ' + r +
        ' ' + r +
        ' ' + '0' +
        ' ' + isLargeArc +
        ' ' + '1' +
        ' ' + endX +
        ' ' + endY;
      return str;
    }
  },
  watch: {
    score(newVal) {
      this.integral = newVal > 8.8 ? 8.8 : newVal < 2.7 ? 2.7 : newVal;
      this.calcDeg()
    }
    // integral(newVal) {
    //     this.integral = this.score > 8.8 ? 8.8 : this.score < 2.1 ? 2.1 : this.score;
    //   this.calcDeg()
    // }
  },
  methods: {
    calcDeg() {
      if (Number(this.integral) >= 2.7 && Number(this.integral) <= 3.5) {
        this.deg = (Number(this.integral) - 2.7) / (3.5 - 2.7) * 45;
      } else if (Number(this.integral) > 3.5 && Number(this.integral) <= 4.1) {
        this.deg = 45 + (Number(this.integral) - 3.5) / (4.1 - 3.5) * 45;
      } else if (Number(this.integral) > 4.1 && Number(this.integral) <= 5.5) {
        this.deg = 90 + (Number(this.integral) - 4.1) / (5.5 - 4.1) * 45;
      } else if (Number(this.integral) > 5.5 && Number(this.integral) <= 8.8) {
        this.deg = 135 + (Number(this.integral) - 5.5) / (8.8 - 5.5) * 45;
      }
    },
    handleChartData(list) {
      // 这里按照 圆心点为(0,0), r 为 1 来处理
      const newList = [];
      list.forEach((item, index) => {
        const obj = {};
        let per = +item.split('%')[0];
        // 保留真实占比,后面需要判断是否是大小弧
        obj.relayPer = per;
        const PI = Math.PI;
        if (index !== 0) {
          per += newList[index - 1].per;
        }
        // 因为是拼接，所以本次的终点要在之前的基础上，所要要累加占比
        obj.per = per;
        const deg = (per / 100) * PI * 2;
        obj.start = {};
        obj.end = {};
        if (index === 0) {
          obj.start.x = Math.cos(0);
          obj.start.y = Math.sin(0);
        } else {
          obj.start = newList[index - 1].end;
        }
        obj.end.x = Math.cos(deg);
        obj.end.y = Math.sin(deg);
        newList.push(obj);
      });
      return newList;
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:#17294A;
  height: 100px;
  padding-top: 40px;
  .doughnut-svg {
    display: block;
    transform: rotate(-90deg);
  }
  .msg {
    text-align: center;
    p {
      margin: 0 0 10px 0;
      font-size: 30px;
      color: #FFFFFF;
      font-weight: 600;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
