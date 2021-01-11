# 开发环境调试：npm run dev (需要安装node环境并且运行项目前先需要npm install)
# 正式环境调试：npm run build:prod(或者npm run b)
# 测试环境调试：npm run build:stage(或者num run s)
# 配置项
  .env.development: 开发环境配置项
  .env.production: 正式环境配置项
  .env.staging: 测试环境配置项
  配置项内容:
  VUE_APP_BASE_API:接口地址
  VUE_APP_BASE_IMG_API:图片地址前缀
  VUE_APP_BASE_AUDIO_API:音频地址前缀
  VUE_APP_BAIDU_KEY:百度地图ak
#打包上线：npm run build:prod后 dist目录下的文件为上线项目

##工程目录
  build 运行配置
  dist 编译后的静态文件
  node_modules 依赖包(npm install 安装的内容)
  mock 本地测试接口
  public 静态资源
  src 项目核心代码
    --api 接口配置
    --assets 本地静态文件
    --components 自定义组件
    --directive 自定义指令
    --filter 自定义全局过滤器
    --icons svg图片
    --layout 框架自带布局
    --router 项目路由配置
    --store vuex数据保存
    --styles 全局样式
    --utils 工具类
    --views 项目页面
    App.vue 项目入口vue文件
    baseRoles.js 页面权限配置
    broadcast.js 智能设备配置
    main.js 项目入口js
    permission.js 路由权限配置
    settting.js 控制设置
  