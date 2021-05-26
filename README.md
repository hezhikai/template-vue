# vue-template

基于 vue 2 的模板项目

## 注意

- ui 框架默认使用 element-ui@2.15.0 ，若需要使用其他（版本） ui 框架如 vant，请自行安装

## 依赖安装

```text
npm install
```

## 脚本指令（scripts）

```text
# 开发环境启动
npm run start
# 生产环境打包
npm run build

# 校验代码总体规范
npm run lint
# 自动修复 js 和 style 代码规范
npm run fix
    # 校验 js 代码规范
    npm run lint:js
    # 校验 style 代码规范
    npm run lint:style
    # 校验 html 代码规范
    npm run lint:html
    # 自动修复 js 代码规范问题
    npm run fix:js
    # 自动修复 style 代码规范问题
    npm run fix:style
# 校验代码格式化问题
npm run prettier
# 自动修复代码格式化问题
npm run prettier:fix

# 执行单元测试脚本
npm run test
# 执行测试脚本并输出测试覆盖率
npm run test:coverage

# 按特定模板进行代码提交
npm run commit
# 发布项目
npm run release [-- --release-as major（主版本）| minor（次版本）| patch（修订号）| 1.1.0（自定义版本号）]
```

## gitHooks

```text
# 建议使用 commitizen 封装的代码提交工具
npm run commit
# 不建议使用 git 默认命令行
git commit -m 'xxx'
```

- 通过 `yorkie` 工具在代码提交时触发

### pre-commit

使用 `lint-staged` 对项目文件进行 `npm run lint:js`、`npm run lint:style`、`npm run lint:html`、`npm run prettier` 的检查

### commit-msg

使用 `commitlint` 对 git-commit 提交日志进行格式校验

#### 日志格式

```text
<类型>[可选的作用域]: <简短描述>
[可选的正文（详细描述）]
[可选的破坏性改动（如参数减少、接口删除、代码迁移等不可逆或无法向下兼容的改动）]
[可选的问题影响（附上修复的 bug 编号、issue 编号等）]
```

##### 提交类型

- feat: 功能实现
- fix: 修复 bug
- docs: 修改文档
- style: 样式、以及不影响功能的改动，例如代码风格、规范改动
- build: 构造工具的或者外部依赖的改动，例如 webpack，npm
- refactor: 代码重构、优化
- revert: 进行代码还原
- test: 修改测试脚本
- perf: 提高性能的改动
- ci: 与 CI（持续集成服务）、脚本有关的改动
- chore: 其他改动，例如辅助工具的变动

##### 例子

```text
feat(地图编辑页): 增加测量工具功能
使用 svg polyline 功能实现
BREAKING CHANGE: 删除了画线的事件
fix #123
```

## 发布和部署

### 发布版本

```text
# 更新版本号、生成更新日志，并提交代码到本地
npm run release
# 推送到远程，并生成对应的 tag
git push --follow-tags origin branch
```

- 通过 `standard-version` 工具执行
- 不带参数时按照 `standard-version` 自身规则更新版本号（不建议）
- 强烈建议根据实际情况带 `-- --release-as` 参数执行该脚本
  - major：通过执行 `npm run release:major` 脚本
    - 主版本号（递增第一位）
    - 表示做了不兼容的 API 修改
  - minor：通过执行 `npm run release:minor` 脚本
    - 次版本（递增第二位)
    - 表示做了向下兼容的功能性新增
  - patch：执行 `npm run release:patch` 脚本
    - 修订号（递增第三位）
    - 表示做了向下兼容的问题修正
  - 自定义版本号：如 0.1.0（不建议）
