# 更新日志

此项目的所有显著更改将记录在此文件中。

格式基于 [维护日志](https://keepachangelog.com/zh-CN/1.0.0/) ，
并且该项目遵循 [语义版本控制](https://semver.org/spec/v2.0.0.html) 。

在 `GitHub` 提交消息上使用的表情符号基于 [gitmoji](https://gitmoji.carloscuesta.me/) 。

## [未发布的]

## [1.4.0] - 2021-01-24

### ✨ 增加

- ✨ 增加 total badge 的支持 (#64)
- 🍱 增加最新一周数据

### ♻️ 变化

- 📝 更新 readme 模板。
- 📝 更新 SVG 模板。
- 🔥 删除未用到的方法 calculateData 。

## [1.3.0] - 2021-01-19

### ♻️ 变化

- 📝 更新 README，注意流量数据的可信度。
- 📝 更新 svg 和 readme 的模板。
- ⚡️ 更新了 svg 和 readme 的生成方法。

## [1.2.1] - 2020-11-06

### ✨ 增加

- ✨ 支持设置 `views/week` 和 `clones/week` 徽章。

### ♻️ 变化

- 📝 更新 readme。

## [1.2.0] - 2020-11-04

### ✨ 增加

- ✨ 增加 `views/week` 和 `clones/week` 徽章。

### ♻️ 变化

- 📝 为 徽章更新 `traffic_branch` 的 readme 模板。

## [1.1.6] - 2020-10-31

### ✨ 增加

- ✨ 增加支持获取 `static_list` 中的 `aaa/bbb` 形式的字符串获取 `bbb` 的值。(`github.repository` 可以放置在任何位置了！)
- ✨ 增加 LICENSE 和 README 。
- ✨ 默认使用 SVG 模板。

### ♻️ 变化

- 📝 更新部署的说明文档

### 🔒 安全

- ➕ 增加 `@actions/exec` 依赖。
- ➖ 删除 child_process 依赖。

## [1.1.5] - 2020-10-25

### 🐛 修复

- 🐛 修复初始化新仓库失败问题。#21

## [1.1.4] - 2020-10-24

### ✨ 增加

- ✨ 使用 `github.repository` 作为 `static_list` 的默认值。

### ♻️ 变化

- 📝 更新模板使用说明。

## [1.1.3] - 2020-10-21

### 🐛 修复

- 🚑 修复 `repo-list-generator` 版本错误

## [1.1.2] - 2020-10-21

### 🐛 修复

- 🚑 修复 workflow 错误

## [1.1.1] - 2020-10-21

### ♻️ 变化

- 📝 更新 `readme`
- 🔥 删除分支 `traffic`
- 💚 更新 `workflow`
- ✨ 增加 `traffic path` 作为输出值

## [1.1.0] - 2020-10-20

### ✨ 增加

- ✅ 测试 `static_list` 支持
- ✨ 增加 `traffic_path` 作为输出值

### ♻️ 变化

- ♻️ 加强日志输出
- ♻️ 加强 `debug` 模式
- ♻️ 加强文件命名
- 🔥 删除 `sync2gitee`
- 💚 更新 `workflow`

### 🐛 修复

- 🐛 修复数据重置错误

## [1.0.1] - 2020-10-08

### ✨ 增加

- 💬 添加使用 [dependabot](./.github/dependabot.yml) 完成 action 的自动更新的说明
- 📄 使用 `--license license.txt`
- ➕ 使用 [rimraf](https://github.com/isaacs/rimraf) 删除 `dist/*`
- ➕ 使用 [husky](https://github.com/typicode/husky) 和 [lint-staged](https://github.com/okonet/lint-stage) 来制作 pre-commit hook

## [1.0.0] - 2020-10-01

### ✨ 增加

- 🎉 [traffic to badge](https://github.com/marketplace/actions/traffic-to-badge) 功能完成
- 🌐 [README.md](./README.md)
- 📝 [README_CN.md](./README_CN.md)
- 🌐 [CHANGELOG.md](./CHANGELOG.md)
- 📝 [CHANGELOG_CN.md](./CHANGELOG_CN.md)
- 👷 自动发布 release 的 [工作流](./.github/workflows/autoRelease.yml)
- 👷 [prettier](./.prettierrc.json) 格式化文件

[未发布的]: https://github.com/yi-Xu-0100/traffic-to-badge/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.4.0
[1.3.0]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.3.0
[1.2.1]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.2.1
[1.2.0]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.2.0
[1.1.6]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.6
[1.1.5]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.5
[1.1.4]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.4
[1.1.3]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.3
[1.1.2]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.2
[1.1.1]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.1
[1.1.0]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.0
[1.0.1]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.0.1
[1.0.0]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.0
