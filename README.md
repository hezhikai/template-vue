# vue-template

基于 vue 2 的模板项目

## 注意

- ui 框架默认使用 element-ui@2.15.0 ，若需要使用其他（版本） ui 框架如 vant，请自行安装

## 依赖安装

```text
npm install
```

## 运行指令

### 开发环境启动

```text
npm run start
```

### 生产环境打包

```text
npm run build
```

### 代码规范校验

#### 校验代码总体规范

```text
npm run lint
```

#### 校验 js 代码规范

```text
npm run lint:js
```

#### 校验 style 代码规范

```text
npm run lint:style
```

#### 校验 html 代码规范

```text
npm run lint:html
```

#### 自动修复 js 代码规范问题

```text
npm run fix:js
```

#### 自动修复 style 代码规范问题

```text
npm run fix:style
```

### 代码格式化校验

#### 校验代码格式化问题

```text
npm run prettier
```

#### 自动修复代码格式化问题

```text
npm run prettier:fix
```

### 测试脚本

#### 执行代码测试脚本

```text
npm run test
```

#### 执行代码测试脚本并输出测试覆盖率报告

```text
npm run test:coverage
```

## gitHooks

### pre-commit

使用 `lint-staged` 对项目文件进行 `npm run fix:js`、`npm run fix:style`、`npm run prettier:fix` 的自动修复

### commit-msg

使用 `verify-commit-msg.js` 文件对 git-commit 提交日志进行规范化管理

#### 日志格式

```text
[revert: | 仅回退代码的场景] 提交类型[(影响范围)]: 改动内容
```

##### 提交类型

- feat：新功能
- fix：修复 bug
- docs：书写文档
- style：修改样式
- refactor：重构
- perf：性能优化
- test：测试代码
- workflow：工作流
- ci：脚本
- chore：其他杂事

##### 例子

```text
feat(路由): 新增路由权限
fix(xx页面): 修复xx问题
```
