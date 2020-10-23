## ⚡️ Traffic to Badge GitHub Action

[![sync2gitee(list)](<https://github.com/yi-Xu-0100/hub-mirror/workflows/sync2gitee(list)/badge.svg>)](https://github.com/yi-Xu-0100/hub-mirror)
[![traffic2badge](https://github.com/yi-Xu-0100/traffic-to-badge/workflows/traffic2badge/badge.svg)](https://github.com/yi-Xu-0100/traffic-to-badge/actions?query=workflow%3Atraffic2badge)
[![Github last commit](https://img.shields.io/github/last-commit/yi-Xu-0100/traffic-to-badge)](https://github.com/yi-Xu-0100/traffic-to-badge)
[![Github latest release](https://img.shields.io/github/v/release/yi-Xu-0100/traffic-to-badge)](https://github.com/yi-Xu-0100/traffic-to-badge/releases)
[![Github license](https://img.shields.io/github/license/yi-Xu-0100/traffic-to-badge)](./LICENSE)

[![GitHub views](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/views.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README_CN)
[![GitHub clones](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/clones.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README_CN)

[**简体中文**](./README_CN.md) | [English](.README.md)

使用存储库 `Insights/traffic` 数据来生成包含访问数和克隆数的徽章。

## 🎨 目录

- [⚡️ Traffic to Badge GitHub Action](#️-traffic-to-badge-github-action)
- [🎨 目录](#-目录)
- [🚀 配置](#-配置)
- [📝 示例](#-示例)
- [📝 使用 `dependabot` 使 `action` 保持更新](#-使用-dependabot-使-action-保持更新)
- [🙈 生成 `my_token`](#-生成-my_token)
- [🔊 更新日志](#-更新日志)
- [📄 协议](#-协议)
- [🎉 鸣谢](#-鸣谢)

## 🚀 配置

```yaml
input:
  my_token:
    description: '设置用以获取私密存储库流量数据的个人访问令牌。'
    required: true
  static_list:
    description: '设置一个想要获取的存储库列表。'
    required: true
  traffic_branch:
    description: '如果为空，则流量数据将备份到名为 traffic 的分支中。'
    required: false
    default: 'traffic'
  views_color:
    description: '为 views 徽章背景设置一个十六进制或命名的颜色值。'
    required: false
    default: 'brightgreen'
  clones_color:
    description: '为 clones 徽章背景设置一个十六进制或命名的颜色值。'
    required: false
    default: 'brightgreen'
  logo:
    description: '在标签左侧插入命名的徽标或简单图标。'
    required: false
    default: 'github'

outputs:
  traffic_branch:
    description: '原 traffic 分支名'
  traffic_path:
    description: '生成 traffic 数据的路径'
```

## 📝 示例

**[`repo-list-generator`](https://github.com/marketplace/actions/repo-list-generator) ：输出值 `repo` 仅包含当前仓库名称。**

```yaml
name: traffic2badge
on:
  push:
    branches:
      - main
  schedule:
    - cron: '1 0 * * *' #UTC

jobs:
  run:
    name: Make GitHub Traffic to Badge
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2.3.3

      - name: Get Repo List
        id: repo
        uses: yi-Xu-0100/repo-list-generator@v0.3.0

      - name: Get Traffic
        id: traffic
        uses: yi-Xu-0100/traffic-to-badge@v1.1.3
        with:
          my_token: ${{ secrets.TRAFFIC_TOKEN }}
          static_list: ${{ steps.repo.outputs.repo }}
          #(default) traffic_branch: traffic
          #(default) views_color: brightgreen
          #(default) clones_color: brightgreen
          #(default) logo: github

      - name: Show Traffic Data
        run: |
          echo ${{ steps.traffic.outputs.traffic_branch }}
          echo ${{ steps.traffic.outputs.traffic_path }}
          cd ${{ steps.traffic.outputs.traffic_path }}
          ls -a
```

**更多使用示例：**

- [yi-Xu-0100/traffic2badge](https://github.com/yi-Xu-0100/traffic2badge) - 模板仓库.

## 📝 使用 `dependabot` 使 `action` 保持更新

该文件可以在 [`./github/dependabot.yml`](./.github/dependabot.yml) 创建以使 action 保持更新。

```yaml
version: 2
updates:
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'daily'
```

## 🙈 生成 `my_token`

> 这部分是从 [sangonzal/repository-traffic-action](https://github.com/sangonzal/repository-traffic-action) 获得的。

首先，您需要创建一个个人访问令牌（`PAT`），使该操作可以访问 `GitHub API`。

您可以通过转到 `Settings(GitHub) -> Developer Settings -> Personal Access Tokens -> Generate new token` 来生成 `PAT`，并且需要授予 `repo` 权限。 有关更多信息，请参见 [GitHub 文档](https://docs.github.com/cn/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) 。

生成 `PAT` 后，转到`Settings(repository) -> Secrets -> New secret`，将 `secret` 命名为 `TRAFFIC_TOKEN`，然后将 `PAT` 复制到框中。

## 🔊 更新日志

- [更新日志](./CHANGELOG_CN.md)

## 📄 协议

- [MIT](./LICENSE)

## 🎉 鸣谢

- [sangonzal/repository-traffic-action](https://github.com/sangonzal/repository-traffic-action)
- [actions/checkout](https://github.com/actions/checkout)
- [yi-Xu-0100/repo-list-generator](https://github.com/yi-Xu-0100/repo-list-generator)
- [yi-Xu-0100/traffic2badge](https://github.com/yi-Xu-0100/traffic2badge)
