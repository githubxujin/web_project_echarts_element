###1. 项目代码结构<br/>
├── build // 构建相关 <br />
├── config // 配置相关 <br />
│ ├── proxy-config.js // 代理配置 <br />
├── src // 源代码 <br />
│ ├── assets // 主题、字体、json 等静态资源 <br />
│ │ ├── scss // 所有公共的的 scss 预编译 css 样式文件 <br />
│ ├── axios // axios 请求 <br />
│ ├── components // 全局公用组件 <br />
│ │ ├── layout // 布局组件 <br />
│ ├── directive // 全局指令 <br />
│ ├── filter // 全局 filter <br />
│ ├── libs // 第三组件库 <br />
│ ├── enum // 所有公共枚举 <br />
│ ├── mock // 项目 mock 模拟数据 <br />
│ ├── router // 路由 <br />
│ ├── store // 全局 store 管理 <br />
│ ├── services // 所有请求 <br />
│ ├── styles // 全局样式 <br />
│ ├── utils // 全局公用方法 <br />
│ ├── views // view <br />
│ │ ├── assets // 资产管理 <br />
│ │ ├── dashboard // 首页 <br />
│ │ ├── data-compare // 数据比较 <br />
│ │ ├── data-rank // 数据排名 <br />
│ │ ├── energy // 用能管理 <br />
│ │ ├── operation // 运维管理 <br />
│ │ ├── plat-manage // 平台管理 <br />
│ │ ├── report-manage // 报表管理 <br />
│ │ ├── safety // 安全管理 <br />
│ │ ├── system-settings // 系统设置 <br />
│ ├── App.vue // 入口页面 <br />
│ ├── main.js // 入口 加载组件 初始化等 <br />
│ └── base-config.js // 全局配置 <br />
├── static // 第三方不打包资源 <br />
│ └── <br />
├── .babelrc // babel-loader 配置 <br />
├── eslintrc.js // eslint 配置项 <br />
├── .gitignore // git 忽略项 <br />
├── favicon.ico // favicon 图标 <br />
├── index.html // html 模板 <br />
└── package.json // package.json <br />
###2. VS Code Eslint 配置
VS Code 配置文件路径：/doc/settings.json</br>
VS Code 需要安装插件 ESLint<br/>
安装 eslint<br/>
`npm i` 或者</br>
`npm install eslint --save-dev`
<br/>安装 eslint-plugin-html<br/>
`npm install --save-dev eslint-plugin-html`
<br/>安装 eslint-plugin-vue<br/>
`npm install eslint-plugin-vue --save-dev` ###组件使用说明<br/>
####charts 组件<br/>
代码结构如下：
`<div class="index">
<MyEcharts
      :id="'exampleId'"
      :style="{width: '100%', height: '380px'}"
      :option="chartOption"
    />

  </div>`
`import MyEcharts from '@/components/echarts/index' // echarts`
```
export default {
    components: {
        MyEcharts
    },
    data() {
        return {
            chartOption: {},
        }
    },
    mounted() {
        this.initCharts()
    },
    methods: {
        initCharts() {
            this.chartOption = {}
			}
    }
}
```
