module.exports = {
  // 首行文字
  header: 'Changelog',
  // 不同类型提交的展示
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'chore', hidden: true },
    { type: 'docs', hidden: true },
    { type: 'style', hidden: true },
    { type: 'refactor', hidden: true },
    { type: 'perf', hidden: true },
    { type: 'test', hidden: true }
  ],
  // 提交记录的链接格式
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  // 比较 tag 的链接格式
  compareUrlFormat:
    '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  // 修复 issues 的链接格式
  issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
  // 代表发布项目提交记录的文本
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}'
};
