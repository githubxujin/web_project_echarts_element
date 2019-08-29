<template>
  <div class="u-layout-right-content">
    <!--u-layout-title-->
    <p class="u-layout-title">部门员工</p>
    <!--u-layout-tabs-->

    <!--u-layout-search-->
    <div class="u-layout-search">
      <!--左侧条件列表-->
      <div class="u-layout-left-proviso">
        <div class="u-layout-left-item">
          <v-title-input-group
            type="search"
            placeholder="用户姓名"
            title-text="搜索："
            input-width="200px"
            radius="30px"
          ></v-title-input-group>
        </div>

        <div class="u-layout-left-item">
          <v-title-input-group type="select" title-text="所属对象：" input-width="200px" radius="30px"></v-title-input-group>
        </div>

        <div class="u-layout-left-item">
          <v-title-input-group type="select" title-text="所属部门：" input-width="200px" radius="30px"></v-title-input-group>
        </div>

        <div class="u-layout-left-item">
          <v-button @click text="搜索" type="blue" padding="0 20px">
            <i class="el-icon-search" slot="icon"></i>
          </v-button>
        </div>
      </div>

      <!--右侧悬浮按钮-->
      <div class="u-layout-right-btn">
        <div class="u-layout-right-item">
          <v-button text="新增按钮" type="blue" padding="0 20px" @click>
            <i class="el-icon-circle-plus-outline" slot="icon"></i>
          </v-button>
        </div>
      </div>
    </div>
    <!--u-layout-table-->
    <div class="u-layout-table">
      <v-table-data-list
        :show-sequence="tableData.showSequence"
        :show-checkbox="tableData.showCheckbox"
        @pageSizesChange="pageSizesChange"
        @pageCurrentChange="pageCurrentChange"
        @goToPage="goToPage"
        :v-table-data="tableData"
      ></v-table-data-list>
      <!-- @selectionChange="selectionChange"
                @sortCustomChange="sortCustomChange"
      @customBtnClick="customBtnClick"-->
    </div>
  </div>
</template>

<script>
//todo 此文件为大部分页面（标题-（tabs栏）-搜索条件-表格）3-4行布局 基础模板，可以直接复制使用
import vTitleInputGroup from "@/components/formComponents/input/titleInputGroup.vue";
import vButton from "@/components/formComponents/input/button.vue";
import vTableDataList from "@/components/formComponents/tableDataList.vue";
export default {
  name: 'tpl',
  components: {
    vTitleInputGroup,
    vButton,
    vTableDataList
  },
  data () {
    return {
      tableData: {
        showCheckbox: false,
        showSequence: true,
        operateBtn: [
          {
            text: "编辑",
            btnKey: "edit"
          },
          {
            text: "删除",
            btnKey: "delete"
          }
        ],
        tHead: [
          {
            text: '项目名称',
            prop: "name"
          }, {
            text: '负责人',
            prop: "principal"
          }, {
            text: '项目类型',
            prop: "typename"
          }, {
            text: '所属区域',
            prop: "regionp"
          }, {
            text: '项目地址',
            prop: "addr"
          }, {
            text: '状态',
            prop: "statusText"
          }
        ],
        data: [],
        total: 0,
        pageSize: this.$baseConfig.PAGE_SIZE,
        pageSizeList: this.$baseConfig.PAGE_SIZE_LIST,
        currentPage: 1,
      },
    }
  },
  methods: {
    //页条数改变
    pageSizesChange (pageSize) {

    },
    //页码改变
    pageCurrentChange (pageNum) {

    },
    //跳转
    goToPage (pageNum) {
      this.pageCurrentChange(pageNum);
    },
  }
}
</script>

<style scoped>
</style>
