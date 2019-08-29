<template>
  <div class="sketch-map">
    <el-form :inline="true" :model="form" class="search-bar" label-position="right">
      <el-form-item label="设备名称：">
        <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="位置：">
        <el-select v-model="form.location" placeholder="请选择">
          <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="50px" label=" ">
        <el-button
          @click="$common.debounce(search)()"
          type="primary"
          size="mini"
          icon="el-icon-search"
          round
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div class="flex-box">
      <div
        class="catchment-item"
        v-for="(item,index) in dataListCopy"
        :key="index"
        :class="{'hidden': !item.name}"
      >
        <div class="picture" :class="{'error': item.status === 0}">
          <span class="alarm alarm1"></span>
          <span class="alarm alarm2"></span>
          <span class="normal"></span>
        </div>
        <p class="title">{{item.name}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        name: '',
        location: ''
      },
      dataList: [
        {
          name: '10#02集水井',
          status: 0
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        },
        {
          name: '10#02集水井',
          status: 1
        }
      ]
    }
  },
  computed: {
    dataListCopy () {
      let dataList = JSON.parse(JSON.stringify(this.dataList))
      if (!dataList.length) return []
      dataList.push({}, {}, {}, {}, {}, {}, {}, {}, {}, {})
      return dataList
    }
  },
  methods: {
    search () { }
  }
}
</script>
<style lang="scss" scoped>
.sketch-map {
  .search-bar {
    padding-top: 15px;
    .float-right {
      float: right;
    }
  }
  .flex-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .catchment-item {
      width: 219px;
      padding: 0 20px;
      height: auto;
      &.hidden {
        > * {
          display: none;
        }
      }
      .picture {
        height: 189px;
        background: url("../../../../assets/images/drainage/catchment1.png")
          100% 100% no-repeat;
        position: relative;
        .alarm {
          width: 29px;
          height: 24px;
          position: absolute;
          right: -2px;
          top: 43px;
          &.alarm1 {
            background: url("../../../../assets/images/drainage/alarm1.png")
              100% 100% no-repeat;
          }
          &.alarm2 {
            opacity: 0;
            background: url("../../../../assets/images/drainage/alarm2.png")
              100% 100% no-repeat;
            right: -9px;
            top: 45px;
          }
        }
        .normal {
          width: 29px;
          height: 24px;
          position: absolute;
          right: 3px;
          top: 90px;
          background: url("../../../../assets/images/drainage/normal.png") 100%
            100% no-repeat;
        }
        &.error {
          background: url("../../../../assets/images/drainage/catchment2.png")
            100% 100% no-repeat;
          .alarm2 {
            animation: blink 1s infinite;
            @keyframes blink {
              0% {
                opacity: 0;
              }
              50% {
                opacity: 100;
              }
              100% {
                opacity: 0;
              }
            }
          }
        }
      }
      .title {
        text-align: center;
        padding: 20px 0;
      }
    }
  }
}
</style>
