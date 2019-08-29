<template>
  <div class="basic-tabs">
    <span
      v-for="item in dataArr"
      :key="item[valueLabel]"
      :class="{'actived': activedKey===item[valueLabel]}"
      @click.stop="tabClick(item)"
    >
      <i v-if="item.icon" :class="item.icon" class="iconColor" />
      {{ item[nameLabel] }}
    </span>
  </div>
</template>
<script>
/**
 * @params dataArr
 * [{
 *  label: 展示的label
 *  value: label对应的键值
 *  icon：图标i标签样式
 * }]
 */
/**
 * @methods change
 * 描述: 变更事件
 * @return: value
 */
/**
 * @attribute v-model
 * 描述: 绑定值用的
 * @return value
 */
export default {
  name: 'BasicTabs',
  props: {
    dataArr: { // 数据列表数组
      type: Array,
      default: function () {
        return [
          // { label: '时', value: 1, icon: 'iconfont nhjc-dianli' },
          // { label: '日', value: 2 },
          // { label: '月', value: 3 },
          // { label: '年', value: 4 }
        ];
      }
    },
    option: { // 数据数组中对象的键值属性
      type: Object,
      default: function () {
        return { label: 'label', key: 'value' };
      }
    },
    value: { // v-model绑定值
      type: [String, Number, Boolean],
      default: null
    },
    keyProp: {
      type: String
    }
  },
  data () {
    return {
      activedKey: this.value
    };
  },
  computed: {
    nameLabel () {
      return (this.option || {}).label || 'label';
    },
    valueLabel () {
      return (this.option || {}).key || 'value';
    }
  },
  watch: {
    value (val) {
      console.log(123)
      this.activedKey = val
    }
  },
  created () { },
  mounted () { },
  methods: {
    tabClick (item = {}) {
      if (this.activedKey === item[this.valueLabel]) return
      this.activedKey = item[this.valueLabel];
      if (this.keyProp) {
        this.$emit('change', this.keyProp, item[this.valueLabel]);
      } else {
        this.$emit('change', item[this.valueLabel]);
      }
      // this.$emit('input', item[this.valueLabel])
    }
  }
};
</script>
<style lang="scss" scoped>
$bgBlueColor: #1881bf;
$border: 1px solid #d2d2d2;
$borderColor: #d2d2d2;
.basic-tabs {
  display: inline-block;
  span {
    height: 30px;
    line-height: 30px;
    display: inline-block;
    text-align: center;
    background: #fff;
    border: $border;
    border-right: none;
    cursor: pointer;
    box-sizing: border-box;
    min-width: 33px;
    // border-right: 1px solid #c3c9d5;
    padding: 0 10px;
    .iconColor {
      color: $bgBlueColor;
    }
    &:first-child {
      border-radius: 2px 0 0 2px;
    }
    &:last-child {
      border-right: $border;
      border-radius: 0 2px 2px 0;
    }
    &.actived {
      background: $bgBlueColor;
      color: #fff;
      .iconColor {
        color: #fff;
      }
    }
  }
}
</style>
