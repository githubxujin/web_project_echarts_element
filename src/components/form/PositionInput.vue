<template>
  <div>
    <div id="l-map"></div>
    <!-- @focus="mapInit" -->
    <el-input id="suggestId" v-model.trim="address" :placeholder="placeholder"></el-input>
  </div>
</template>

<script>
/**
 * 定位文本框组件
 */
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    areaName: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      address: '',
      point: {
        lng: '',
        lat: ''
      },
      map: null
    }
  },
  mounted () {
    let that = this;
    this.$nextTick(() => {
      that.mapInit();
    })
  },
  watch: {
    address (val) {
      if (val === this.value) return
      this.$emit('input', val);
    },
    value: {
      immediate: true,
      handler: function (val) {
        if (val === this.address) return
        this.address = val
      }
    }
  },
  methods: {
    mapInit () {
      var map = new BMap.Map("l-map");
      map.centerAndZoom(this.areaName, 12); // 初始化地图,设置城市和地图级别。
      var ac = new BMap.Autocomplete( //建立一个自动完成的对象
        {
          "input": "suggestId",
          "location": map
        });
      ac.setInputValue(this.address);
      let _self = this;
      ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        _self.address = _value.province + _value.city + _value.district + _value.street + _value.business;
        setPlace(_self.address)
      });
      function setPlace (address) {
        function myFun () {
          let current = local.getResults().getPoi(0);
          if (current && current.point) {
            _self.point.lng = current.point.lng;
            _self.point.lat = current.point.lat;
            _self.$emit('pointChange', _self.point)
          }
        }
        let local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(address);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>