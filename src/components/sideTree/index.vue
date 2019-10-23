<template>
  <div class="side-tree" v-if="collapse">
    <div class="top-tab">
      <span
        class="tab-item"
        v-for="item in tab"
        :key="item.name"
        :class="{active:activeTab===item.key}"
        @click="tabNav(item)"
      >{{item.name}}</span>
    </div>
    <!-- 分项，支路 -->
    <div class="oparete-btn clear">
      <button class="btn fl" :class="{active:btnKey===1}" @click="tabBtn(1,'Sub')">分 项</button>
      <button class="btn fr" :class="{active:btnKey===2}" @click="tabBtn(2,'Meter')">支 路</button>
    </div>
    <!-- 电水下面相对应的分项与支路 -->
    <div class="tree-item">
      <el-tree
        ref="tree"
        node-key="number"
        show-checkbox
        :default-expanded-keys="['01000']"
        :default-checked-keys="defalutChecked"
        :data="treeData"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :check-strictly="true"
        :props="defaultProps"
        @check="treeChange"
        @node-contextmenu="rightClick"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span :title="node.label.length>9?node.label:''">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import datetimeUtils from '@/utils/datetime-utils.js';
import utils from '@/utils/utils.js';
import { getLeftTree } from '@/services/energy'
export default {
  props: {
    collapse: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tab: [
        { name: '电', key: 'elec', type: '01' },
        { name: '水', key: 'water', type: '02' },
      ],
      activeTab: 'elec',//控制电水激活项
      type: '01',
      btnKey: 1,//控制支路分项激活项
      btnType: 'Sub',
      defaultKey: 'elecSub',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defalutChecked: ['01000'],
      treeData: [],
      // shopNumber: 'Ab12345',//门店编号
      shopNumber: '',//门店编号
      data: {}
    }
  },
  created () {
    this.shopNumber = this.$store.getters.getUserInfo.roleType == 2 ? this.$store.getters.getUserInfo.shopNumber : this.$store.getters.getCurShop.shopNumber;
    this.getLeftTree()
    this.treeData = this.data[this.defaultKey];
    this.outData()
  },
  mounted () {

  },
  methods: {
    //   切换电水
    tabNav (obj) {
      this.activeTab = obj.key;
      this.type = obj.type;
      this.getData()
    },
    // 切换按钮
    tabBtn (num, type) {
      this.btnKey = num;
      this.btnType = type;
      this.getData()
    },
    // 获取左侧树结构数据
    async getLeftTree () {
      let result = await getLeftTree({ shopNumber: this.shopNumber })
      if (result.code === 200) {
        this.data = result.data;
        this.getData();
      } else {
        console.log(result.msg)
      }
    },
    // 获取分项/支路展示数据
    getData () {
      this.defaultKey = this.activeTab + this.btnType;
      this.treeData = this.data[this.defaultKey];
      console.log(this.defaultKey, this.treeData)
      // 处理电分项默认为四大分项以外，其他均选中第一个
      if (this.defaultKey === 'elecSub') {
        this.defalutChecked = [this.treeData[0].number];
      } else {
        let initChecked = this.treeData[0].number;
        this.defalutChecked = [initChecked];
      }
      this.outData()
    },
    treeChange (node, checked) {
      let arr = utils.deepCopy(this.$refs.tree.getCheckedKeys());
      if (arr.length > 10) {
        this.$message.closeAll();
        this.$message.error('最多选中10条数据');
      } else {
        if (!this.defalutChecked.includes(node.number)) {
          if (this.defalutChecked.length < 10) {
            this.defalutChecked.push(node.number);
          }
        } else {
          this.defalutChecked.remove(node.number);
        }
      }
      this.$refs.tree.setCheckedKeys(this.defalutChecked);
      this.outData()
    },
    // 右键点击选中下面的子节点
    rightClick (event, data, node, cur) {
      console.log(node)
      let length = 0;
      node.childNodes.forEach((item) => {
        if (item.checked) {
          length++
        }
      });
      if (node.checked && length == node.childNodes.length) {
        //取消选中
        if (this.defalutChecked.includes(node.key)) {
          this.defalutChecked.remove(node.key);
        }
        if (node.childNodes && node.childNodes.length > 0) {
          for (let i = 0; i < node.childNodes.length; i++) {
            if (this.defalutChecked.includes(node.childNodes[i].key)) {
              this.defalutChecked.remove(node.childNodes[i].key);
            }
          }
        }
      } else {
        if (node.childNodes.length + this.defalutChecked.length > 10) {
          this.$message.closeAll();
          this.$message.error('最多选中10条数据');
        } else {
          if (!this.defalutChecked.includes(node.key)) {
            if (this.defalutChecked.length < 10) {
              this.defalutChecked.push(node.key);
            } else {
              this.$message.closeAll();
              this.$message.error('最多选中10条数据');
            }
          }
          if (node.childNodes && node.childNodes.length > 0) {
            for (let i = 0; i < node.childNodes.length; i++) {
              if (!this.defalutChecked.includes(node.childNodes[i].key)) {
                if (this.defalutChecked.length < 10) {
                  this.defalutChecked.push(node.childNodes[i].key);
                } else {
                  this.$message.closeAll();
                  this.$message.error('最多选中10条数据');
                }
              }
            }
          }
        }
      }
      if (this.defalutChecked.length > 0) {
        this.$refs.tree.setCheckedKeys(this.defalutChecked);
        this.outData()
      }
    },
    outData () {
      console.log(454545)
      let data = {//电水，支路/分项，选中的id
        type: this.type,
        subType: this.btnKey,
        number: this.defalutChecked.join(',')
      }
      this.$emit('leftTreeData', data);
    }
  }
}
</script>
<style lang="scss" scoped>
.side-tree {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  .top-tab {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background-color: #f5f9f9;
    .tab-item {
      display: inline-block;
      width: 50%;
      &.active {
        background-color: #fff;
      }
    }
  }
  .oparete-btn {
    width: 100%;
    box-sizing: border-box;
    padding: 5px 15px;
    margin: 15px 0px;
    .btn {
      background-color: #fff;
      padding: 5px 20px;
      border: 1px solid #ccc;
      border-radius: 29px;
      &.active {
        background-color: #1881bf;
        color: #fff;
      }
    }
  }
  .tree-item {
    width: 100%;
    height: calc(100% - 110px);
    overflow: hidden;
    overflow-y: auto;
    /deep/ .custom-tree-node {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  // /deep/ .el-tree {
  //   overflow: hidden;
  //   overflow-y: auto;
  // }
}
</style>


