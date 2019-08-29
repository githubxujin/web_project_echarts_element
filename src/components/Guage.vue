<template>
  <canvas id="canvas-dashbord" width="150" height="100" ref="canvas">您的浏览器不兼容</canvas>
</template>
<script>
export default {
  props: {
    loadValue: {
      type: Number,
      default: 2.7
    }
  },
  data () {
    return {
      // loadValue: 5.1
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.show()
    })
  },
  methods: {
    show () {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');
      //绘制外半圆
      ctx.lineWidth = 20;
      this.drawCircle(ctx, 0, Math.PI * 45 / -180, '#eb6100');
      this.drawCircle(ctx, Math.PI * 45 / -180, Math.PI / -2, '#ffff00');
      this.drawCircle(ctx, Math.PI / -2, Math.PI * 135 / -180, '#67cbff');
      this.drawCircle(ctx, Math.PI * 135 / -180, -Math.PI, '#2eb34a');
      // 绘制刻度
      ctx.save();
      ctx.fillStyle = '#e8eeff';
      ctx.font = 12 + 'px';
      let arr = [2.7, 3.5, 4.1, 5.1, 8.8];
      let angle = Math.PI / 4;
      arr.forEach((item, index) => {
        let obj = {
          x: 75 + 40 * Math.cos(Math.PI * 45 / -180 * index).toFixed(1) - 7,
          y: 75 + 40 * Math.sin(Math.PI * 45 / -180 * index).toFixed(1),
        }
        ctx.fillText(item, obj.x, obj.y)
      })
      ctx.restore();
      // 绘制指针
      // let value = 5.1
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'red';
      ctx.moveTo(75, 75);
      // let imgObj = new Image();
      // imgObj.src = "src/assets/images/shopIndex/pointer.png";
      // //待图片加载完后，将其显示在canvas上
      // imgObj.onload = function () { //onload必须使用
      //   ctx.drawImage(this, 100, 150);
      // }
      let obj = {}
      if (this.loadValue >= 2.7 && this.loadValue <= 3.5) {
        let gap = this.loadValue - 2.7;
        let total = 3.5 - 2.7;
        if (gap > 0) {
          obj = {
            x: 75 + 40 * Math.cos((Math.PI * 45) * (gap / total) / -180).toFixed(1),
            y: 75 + 40 * Math.sin((Math.PI * 45) * (gap / total) / -180).toFixed(1)
          }
        } else {
          obj = {
            x: 115,
            y: 75
          }
        }
      } else if (this.loadValue > 3.5 && this.loadValue <= 4.1) {
        let gap = this.loadValue - 3.5;
        let total = 4.1 - 3.5;
        obj = {
          x: 75 + 40 * Math.cos((Math.PI * 45) * (1 + (gap / total)) / -180).toFixed(1),
          y: 75 + 40 * Math.sin((Math.PI * 45) * (1 + (gap / total)) / -180).toFixed(1)
        }
      } else if (this.loadValue > 4.1 && this.loadValue <= 5.1) {
        let gap = this.loadValue - 4.1;
        let total = 5.1 - 4.1;
        obj = {
          x: 75 + 40 * Math.cos(((Math.PI * 90) + (Math.PI * 45) * (gap / total)) / -180).toFixed(1),
          y: 75 + 40 * Math.sin(((Math.PI * 90) + (Math.PI * 45) * (gap / total)) / -180).toFixed(1)
        }
      } else if (this.loadValue > 5.1 && this.loadValue <= 8.8) {
        let gap = this.loadValue - 5.1;
        let total = 8.8 - 5.1;
        obj = {
          x: 75 + 40 * Math.cos(((Math.PI * 135) + (Math.PI * 45) * (gap / total)) / -180).toFixed(1),
          y: 75 + 40 * Math.sin(((Math.PI * 135) + (Math.PI * 45) * (gap / total)) / -180).toFixed(1)
        }
      }
      ctx.lineTo(obj.x, obj.y);
      ctx.closePath();
      ctx.stroke();
    },
    // 绘制圆弧
    drawCircle (ctx, start, end, color) {
      ctx.beginPath();
      ctx.arc(75, 75, 60, start, end, true);
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }
}
</script>