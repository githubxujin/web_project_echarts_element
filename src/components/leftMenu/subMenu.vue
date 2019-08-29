<template>
  <div class="sub-tree">
    <ul v-for="(item,index) in items" :key="index">
      <li v-if="item.children" class="mainTitle">
        <el-checkbox v-model="item.checked" class="check-box" @change="onCheckAll" />
        {{ item.label }}
        <span v-if="item.length">({{ item.length }})</span>
        <ul class="item">
          <li v-for="(subitem,ind) in item.children" :key="ind">
            <el-checkbox v-model="subitem.checked" @change="onCheck(subitem,item)" />
            {{ subitem.label }}
            <span v-if="subitem.length">({{ subitem.length }})</span>
            <leftTree v-if="subitem.children" :items="subitem.children" />
          </li>
        </ul>
      </li>
      <li v-else class="mainTitle">
        <el-checkbox v-model="item.checked" class="check-box" @change="checkself(item)" />
        {{ item.label }}
        <span v-if="item.length">({{ item.length }})</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
    name: 'LeftTree',
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        onCheckAll(val) {
            console.log(this.items)
            this.check(this.items, val)
        },
        checkself(item) {
            console.log(item)
        },
        onCheck(obj, item) {
            console.log(item, item.length)
            obj.length = obj.children ? obj.children.length : ''
            if (obj.children) {
                this.check(obj.children, obj.checked)
            }
            var data = []
            item.children.forEach(subItem => {
                if (subItem.checked) {
                    data.push(1)
                }
            })
            item.checked = data.length === item.children.length;
        },
        check(arr, type) {
            arr.forEach(item => {
                item.checked = type
                if (item.children) {
                    item.length = type ? item.children.length : ''
                    this.check(item.children, type)
                }
            })
        }
    }

}
</script>
<style lang="scss" scoped>
.sub-tree{
    width:calc(100% - 10px );
    height:100%;
    margin-left: 10px;
    position: relative;
     .mainTitle{
        display: inline-block;
        width:calc(100% - 15px );
        margin-left:15px;
        .item{
            height:100%;
        }
    }
    .check-box{
        position: absolute;
        left:0px;
    }
}
</style>

