<template>
  <div class="tabBar">
    <span class="border left-top" />
    <span class="border right-top" />
    <span class="border left-bottom" />
    <span class="border right-bottom" />
    <ul class="leftbar" :style="{backgroundColor:backColor}">
      <li
        v-for="(item,index) in data"
        :key="index"
        class="item"
        :class="{active:item.checked}"
        @click="goToUrl(item.index)"
        @mouseenter="lightTab(item,index)"
        @mouseleave="outTab(item,index)"
      >
        <i class="iconfont icon" :class="item.icon" />
        <span class="title">{{ item.title }}</span>
        <ul v-if="item.subs&&item.menuType=='sub'" class="subitem" :class="{showSub:item.checked}">
          <li
            v-for="(subitem,ind) in item.subs"
            :key="ind"
            @click="goToUrl(subitem.index)"
          >{{ subitem.title }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
// 主要用于门店侧边栏跳转页面用
import Storages from '@/utils/storages';
import { getRootMenu, getSubMenuById, getShopAuthoritiesArr, getSubmMenusByPreIndex } from '@/utils/permission.js';
export default {
  name: 'LeftTabBar',
  props: {
    tabData: {
      type: Array,
      default: () => [
        { title: '供配电系统', icon: 'nhjc-dianli', checked: false, url: '/power-distribution-system' },
        { title: '给排水系统', icon: 'nhjc-shui', sub: [{ name: '排水系统', url: '/drainage-system' }, { name: '给水系统', url: '/water-supply-system' }], checked: false },
        { title: '空调系统', icon: 'el-icon-share', checked: false, url: '/air-conditioning-system' },
        { title: '电梯系统', icon: 'el-icon-share', checked: false, url: '/elevator-system' },
        { title: '通讯监测', icon: 'el-icon-share', checked: false, url: '/communication-monitoring' },
        { title: '报警', icon: 'el-icon-share', checked: false, url: '/alarm' },
        { title: '运行记录', icon: 'el-icon-share', checked: false, url: '/operation-record' }
      ]
    },
    backColor: {
      type: String,
      default: '#162644'
    }
  },
  data () {
    return {
      data: this.tabData,
      category: 'shop'
    }
  },
  created () {
    this.getLeftTabMenus()
  },
  methods: {
    // 获取侧边栏菜单
    getLeftTabMenus () {
      let authoritiesMenu = getShopAuthoritiesArr();
      // this.data = getSubMenuById(authoritiesMenu, '/safety');
      console.log('getSubMenuById00000000000000', this.authoritiesMenu)
      // this.handleTabMenu(this.data);
      // console.log(this.data)
    },
    handleTabMenu (arr) {
      arr.forEach(item => {
        this.$set(item, 'checked', false);
        if (item.subs && item.subs.length > 0) {
          this.handleTabMenu(item.subs)
        }
      })
    },
    goToUrl (url) {
      if (url === '/safety/drainage') {
        return;
      } else if (url == '/safety/run-record' || url == '/safety/alarm') {
        let subitem = getSubmMenusByPreIndex(url, this.category)
        this.$router.push({ path: subitem[0].index })
      } else {
        this.$router.push({ path: url })
      }
    },
    // 菜单高亮
    lightTab (obj, ind) {
      obj.checked = true;
      this.data.forEach((item, i) => {
        if (ind !== i) {
          item.checked = false;
        }
      });
    },
    // 菜单高亮消失
    outTab (obj, ind) {
      obj.checked = false;
    }
  }
}
</script>
<style scoped lang="scss">
@import "@/views/dashboard/shop/scss/shop-index.scss";
.tabBar {
  width: 100%;
  height: 100%;
  min-height: 778px;
  position: relative;
}
.leftbar {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  // padding:10px 10px;
  box-sizing: border-box;

  .item {
    cursor: pointer;
    flex: 1;
    align-items: space-around;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    position: relative;
    color: #5fbaec;
    background: rgb(23, 38, 69);
    border-bottom: 1px solid #14223d;
    &.active {
      color: #ffffff;
    }
    &:last-child {
      border: 0 none;
    }
    .icon {
      font-size: 38px;
    }
    .title {
      display: block;
      margin-top: 3px;
    }
  }
  .subitem {
    position: absolute;
    left: calc(100%);
    width: 100%;
    height: 100%;
    padding: 0px 50px;
    background: #15233f;
    color: #fff;
    display: none;
    z-index: 10000;
    &.showSub {
      display: block;
    }
    li {
      height: 50%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        color: #5fbaec;
      }
    }
  }
}
</style>
