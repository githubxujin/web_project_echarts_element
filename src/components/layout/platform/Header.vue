<template>
  <div class="header">
    <Logo link-url="/plat-index" />
    <div class="layout-tree">
      <Projecttree v-model="treeData" v-show="isShow" :isMultiple="isMultiple"></Projecttree>
    </div>
    <top-user />
  </div>
</template>

<script>
import Logo from '../../logo/index';
import TopUser from '../../nav/TopUser';
import Projecttree from '../../projecttree/index.js';
export default {
  components: {
    Logo,
    TopUser,
    Projecttree,
  },
  data () {
    return {
      isMultiple: true,
      isMultiplePath: ['/data-compare/project-compare', '/data-compare/time-compare'],//添加后，TOP单选
      isShow: true,//是否展示
      noShowPath: ["/plat-manage/platform-overview"],//不展示路径
      treeData: []
    }
  },
  created () {
    this.isMultiple = true; this.isShow = true;
    if (this.isMultiplePath.includes(this.$route.fullPath)) {
      this.isMultiple = false;
    }
    if (this.noShowPath.includes(this.$route.fullPath)) {
      this.isShow = false;
    }
    this.initTreeData(this.$route);
  },
  computed: {
    checkedShopNumbers () {
      return this.$store.getters.getCheckedShopNumbers;
    }
  },
  watch: {
    '$route': function (to, from) { // 路由改变时执行
      console.info('to:', to);
      this.initTreeData(to);
      this.isMultiple = true; this.isShow = true;
      if (this.isMultiplePath.includes(to.fullPath)) {
        this.isMultiple = false;
      }
      if (this.noShowPath.includes(this.$route.fullPath)) {
        this.isShow = false;
      }
    },
    treeData: {
      handler: function (val) {
        console.log('数据变化', val)
        if (val) {
          this.$store.commit("base/updateCheckedShopNumbers", val);
          console.log('取数据', this.checkedShopNumbers)
        }
      },
      deep: true//对象内部的属性监听，也叫深度监听
    }
  },
  methods: {
    initTreeData (item) {
      this.treeData = (item.meta.limits && item.meta.limits > 0) ?
        //   this.checkedShopNumbers.filter((n, index) => { return index < item.meta.limits }) : this.checkedShopNumbers;
        this.checkedShopNumbers.filter((n, index) => { return index < item.meta.limits }) : JSON.parse(localStorage.getItem('allTreeNode')).map(item => item.number);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/head.scss";
</style>
