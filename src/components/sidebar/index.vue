<template>
  <div class="sidebar-container">
    <div class="outer-container">
      <div class="sidebar">
        <!-- background-color="white"
          text-color="#858585"
        active-text-color="#67CBFF"-->
        <el-menu
          class="sidebar-el-menu"
          :default-active="defaultActive"
          :collapse="collapse"
          background-color="white"
          text-color="#858585"
          active-text-color="#67CBFF"
          unique-opened
          router
          @select="handleSelect"
        >
          <MenuTree :items="items" />
        </el-menu>
      </div>
    </div>
  </div>
</template>
<script>
import Storages from '../../utils/storages';
import MenuTree from './MenuTree'
import { getSubMenuById, getRootMenu, getSubmMenusByPreIndex, getShopAuthoritiesArr, getBtnsByIndex } from '../../utils/permission.js';
let sortList = ['给水系统', '排水系统'];
export default {
  components: { MenuTree },
  props: {
    // 用于区分是门店还是平台
    category: {
      type: String,
      default: 'shop'
    }
  },
  data () {
    return {
      collapse: true,
      items: []
    }
  },
  computed: {
    defaultActive: function () {
      return this.$store.getters.getLeftNavState; //this.$route.path|| 
    },
    TopNavState: function () {
      return this.$store.getters.getTopNavState;
    },
    AuthoritiesArr: function () {
      return getShopAuthoritiesArr();
    },
    leftNavRefresh: function () {
      return this.$store.getters.getLeftNavRefresh;
    }
  },
  watch: {
    '$route': function (to, from) { // 路由改变时执行
      console.info('to.path:' + to.path, this.$route.path);
      if (this.leftNavRefresh) {
        this.initSidebarData();
        this.$store.commit('base/updateLeftNavRefresh', false);
      }
      this.refreshInit(this.$route.path);
    }
  },
  created () {
    // console.log('this.$route.path', this.$route.path)
    this.initSidebarData();
    this.refreshInit(this.$route.path);
    // console.log('this.defaultActive', '"' + this.defaultActive + '"')
  },
  methods: {
    /**
     * 匹配斜杠出现的次数
     */
    patchNums (path) {
      return path.split('/').length - 1;
    },
    // 页面刷新初始化：解决直接复制地址在新页面打开没有默认选中的问题
    refreshInit (path) {
      //console.log('path', path, this.category, this.$route.query.Referer)
      var lastIndex = path.lastIndexOf('\/');
      //如果是从首页直接跳转过来的，要截取掉请求参数
      var endResult = this.$route.query.Referer ? path.substring(lastIndex + 1, path.length) : path;
      //console.log('result', result, lastIndex)
      // let endResult = result;// /^out-water|suppley-water$/.test(result) ? '/safety/drainage/' + result : result;
      var subItems = [];//叶子菜单
      var firstIndex = path.indexOf('\/');

      if (this.patchNums(path) > 2) { //如果是三级菜单地址，当三级菜单切换后刷新界面，依旧记录左侧菜单选中。
        endResult = path.substring(firstIndex, lastIndex); //三级菜单要移除最后一级url路径
        // console.log('endResult1:' + endResult)
        subItems = getSubmMenusByPreIndex(endResult, this.category);
        endResult = subItems && subItems.length > 0 ? subItems[0].index : endResult;
        //console.log('endResult2:' + endResult)
      } else if (this.patchNums(path) == 2) {//二级菜单，门店取全路径
        console.log('开始url', endResult)
        if (this.category == 'plat') { //平台菜单要移除最后一级url路径
          endResult = path.substring(firstIndex, lastIndex);
        }
        subItems = getSubmMenusByPreIndex(endResult, this.category);
        endResult = subItems && subItems.length > 0 ? subItems[0].index : endResult;
        // console.log('二级菜单：', endResult, subItems)
      }
      else {
        subItems = getSubmMenusByPreIndex(endResult, this.category);
      }
      // console.log('叶子菜单', subItems)
      //存储当前叶子菜单数组
      if (subItems.length > 0) {
        if (this.$route.path.includes('/safety/drainage')) {
          // 给水在排水左边(前端暂时处理)
          let sortRouter = [];
          sortList.map(t => {
            sortRouter.push(subItems.find(item => item.title === t))
          })
          subItems = sortRouter;
        }
        this.$store.commit('permission/setCurLeafMenus', subItems);
      } else {
        this.$store.commit('permission/setCurLeafMenus', []);
      }
      console.log('endResult-this.TopNavState', endResult, this.defaultActive, this.TopNavState)
      this.$store.commit('base/updateLeftNavStatus', endResult);
      this.getBtns(endResult);
    },
    //根据index获取page中button权限
    getBtns (key) {
      var btns = getBtnsByIndex(key);
      console.log('btns1:', btns)
      if (btns && btns.length > 0) {
        this.$store.commit('permission/setPageBtns', btns)
      }
    },
    // 初始化菜单及默认激活项
    initSidebarData () {
      var activeNav = this.TopNavState;
      //console.log('category', this.category, activeNav)
      if (this.category === 'shop') {
        var authoritiesMenu = this.AuthoritiesArr;
        if (activeNav.lastIndexOf('/') > 0) {
          activeNav = '/' + activeNav.split('/')[1];
        }
        //console.log('activeNav2:', activeNav)
        //console.log('authoritiesMenu', authoritiesMenu)
        this.items = getSubMenuById(authoritiesMenu, activeNav);
      } else { // 平台取一级菜单
        var authoritiesMenu = Storages.getLocalStorage('$platMenus');
        this.items = getRootMenu(authoritiesMenu);
      }
      //console.log('this.items:', this.items)
    },

    /**
     * 菜单激活回调
     * index: 选中菜单项的 index, 
     * indexPath: 选中菜单项的 index path
     */
    handleSelect (key, keyPath) {
      this.$store.commit('base/updateLeftNavStatus', this.$route.path);
      console.log('选中', key, this.$route.path, '"' + this.defaultActive + '"');
    }
  }
}

</script>
<style lang="scss" scoped>
.sidebar-container {
  z-index: 2;
  float: left;
  width: $leftWidth;
  background: white;
  height: 100%;
  border-radius: 5px;
  .outer-container {
    position: relative;
    width: 100%;
    // height: calc(100% - 60px);
    height: 100%;
    overflow: hidden;
    // margin: 5px 0px;
    // top:-60px;
  }
}

.sidebar {
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0;
  overflow-y: scroll;
  /*z-index: 2003;*/
  // border-radius: 5px;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 174px;
  background: #094076;
}

.sidebar > ul {
  height: 100%;
}
/deep/ .el-menu--collapse {
  width: $leftWidth;
}
/deep/ .sidebar-el-menu .el-menu-item {
  background-color: #f1f4fa !important;
}
/deep/ .sidebar-el-menu .el-menu-item.is-active {
  background-color: white !important;
}
</style>