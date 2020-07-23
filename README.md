<!--
 * @Author: your name
 * @Date: 2020-06-10 11:09:58
 * @LastEditTime: 2020-07-23 14:05:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tx_antd\README.md
--> 
# 仿Antd组件库
TypeScript + React + React Hook + Sass + Jest + Storybook

## 组件开发流程
- 主体代码
- 样式文件
- storys文件
- test文件

## 学习要点
1. 组件开发流程
2. React、React Hook的用法
3. TS语法
4. Sass的变量、mixin编写、each等语法的使用
5. React测试相关
6. storybook配置及使用
7. npm发布、CI/CD相关概念 

## 安装相关依赖
### 添加Normalize.css
改为scss样式 styles/_reboots.scss

将原有的变量替换为新定义的变量

### 添加classnames工具
安装:

      yarn add classnames react-transition-group -S

      // and 类型声明文件

      yarn add @types/classnames @types/react-transition-group -D

### 图标解决方案
SVG： 完全可控 即取既用 Bug少

#### 安装font-awesome图标库相关依赖
安装：

      yarn add @fortawesome/fontawesome-svg-core

      yarn add @fortawesome/free-solid-svg-icons

      yarn add @fortawesome/react-fontawesome

使用：

      // 引入图标库

      import { library } from '@fortawesome/fontawesome-svg-core'

      // 引入全部图标

      import { fas } from '@fortawesome/free-solid-svg-icons'
      
      // 在库里添所有图标 就可以引用了

      library.add(fas)

### 安装axios请求依赖
安装:

      yarn add axios -S

### 测试相关
create-react-app脚手架自带

### 组件开发展示工具
需求：

- 分开展示各个组件不同属性下的状态
- 能追踪组件的行为并且具有属性调试功能
- 可以为组件自动生成文档和属性列表

安装storybook：

      cd my-project-directory

      npx -p @storybook/cli sb init

添加addon-info装饰器 用来自动生成源码展示等

      yarn add @storybook/addon-info

      yarn add @type ...

#### 自动生成文档
安装:

      yarn add react-docgen-typescript-loader

### 打包前需要的库
安装:

      yarn add rimraf cross-env husky -S

#### rimraf
是兼容window、mac、linux系统，用来删除文件夹、文件的命令

#### cross-env
是兼容window、mac、linux系统的配置env的命令

#### husky
哈士奇钩子package.json的配置工具，可以在运行git提交前进行一系列的命令

## 继承部署
### CI 持续集成
- 频繁的将代码集成到主干(master)
- 快速发现错误
- 防止分支大幅度偏离主干

### CD 持续交付、持续部署
- 频繁的将软件的新版本，交付给质量团队或者用户
- 代码通过部署之后，自动部署到生产环境中

### netlify在线部署

## 组件库styles变量分类
- 基础颜色系统 
- 字体系统 
- 表单 
- 按钮 
- 边框和阴影 
- 可配置开关