module.exports = {
  // 改成 node 将获取不到 dom 元素，引用的依赖会报错
  // testEnvironment: 'jsdom',
  // n 次失败后停止
  bail: 0,
  // 报告每个单独的测试
  verbose: true,
  // 自动添加文件后缀
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  // 文件解析
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  // 不需要解析的文件夹
  transformIgnorePatterns: ['/node_modules/'],
  // 模块名代理配置
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // 快照序列化
  snapshotSerializers: ['jest-serializer-vue'],
  // 匹配的测试文件
  testMatch: ['**/__tests__/**/**.test.(js|jsx|ts|tsx)'],
  // jsdom 环境的 url，脚本中的 location 等信息从此处获取
  testURL: 'http://localhost/',
  // 监听工具
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  // 关于 jest 的全局统一配置
  setupFilesAfterEnv: [],
  // 测试覆盖率
  collectCoverage: false,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageDirectory: 'testReporters/coverage',
  collectCoverageFrom: ['**/__tests__/**/**.test.(js|jsx|ts|tsx)'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10
    }
  }
  // 全局变量
  // globals: {}
};
