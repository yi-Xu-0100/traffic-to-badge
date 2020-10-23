## ⚡️ Traffic to Badge GitHub Action

[![sync2gitee(list)](<https://github.com/yi-Xu-0100/hub-mirror/workflows/sync2gitee(list)/badge.svg>)](https://github.com/yi-Xu-0100/hub-mirror)
[![traffic2badge](https://github.com/yi-Xu-0100/traffic-to-badge/workflows/traffic2badge/badge.svg)](https://github.com/yi-Xu-0100/traffic-to-badge/actions?query=workflow%3Atraffic2badge)
[![Github last commit](https://img.shields.io/github/last-commit/yi-Xu-0100/traffic-to-badge)](https://github.com/yi-Xu-0100/traffic-to-badge)
[![Github latest release](https://img.shields.io/github/v/release/yi-Xu-0100/traffic-to-badge)](https://github.com/yi-Xu-0100/traffic-to-badge/releases)
[![Github license](https://img.shields.io/github/license/yi-Xu-0100/traffic-to-badge)](./LICENSE)

[![GitHub views](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/views.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)
[![GitHub clones](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/clones.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)

[**English**](.README.md) | [简体中文](./README_CN.md)

The GitHub action that using repositories `Insights/traffic` data to generate badges that include views and clones.

## 🎨 Table of contents

- [⚡️ Traffic to Badge GitHub Action](#️-traffic-to-badge-github-action)
- [🎨 Table of contents](#-table-of-contents)
- [🚀 Action configuration](#-action-configuration)
- [📝 Example usage](#-example-usage)
- [📝 Use dependabot to keep action up-to-date](#-use-dependabot-to-keep-action-up-to-date)
- [🙈 Generate `my_token`](#-generate-my_token)
- [🔊 CHANGELOG](#-changelog)
- [📄 LICENSE](#-license)
- [🎉 Thanks](#-thanks)

## 🚀 Action configuration

```yaml
inputs:
  my_token:
    description: >
    Set up a personal access token to obtain the secret repository traffic data.
    required: true
  static_list:
    description: >
      Set up a list of repositories to get.
      Only when github.repository with setting into first item,
      it can be correct to be current repository name.
    required: false
    default: ${{ github.repository }}
  traffic_branch:
    description: >
      If empty traffic data will be backed up to the branch named traffic.
    required: false
    default: traffic
  views_color:
    description: >
      Set a hex or named color value for the views badge background.
    required: false
    default: brightgreen
  clones_color:
    description: >
      Set a hex or named color value for the clones badge background.
    required: false
    default: brightgreen
  logo:
    description: >
      Insert a named logo or simple-icon to the left of the label.
    required: false
    default: github

outputs:
  traffic_branch:
    description: >
      Origin traffic data branch name
  traffic_path:
    description: >
      Path to generate traffic data
```

## 📝 Example usage

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

      - name: Get Traffic
        id: traffic
        uses: yi-Xu-0100/traffic-to-badge@v1.1.3
        with:
          my_token: ${{ secrets.TRAFFIC_TOKEN }}
          #(default) static_list: ${{ github.repository }}
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

**More usage example:**

- [`yi-Xu-0100/traffic2badge`](https://github.com/yi-Xu-0100/traffic2badge) - Template repository for usage with [`yi-Xu-0100/repo-list-generator`](https://github.com/marketplace/actions/repo-list-generator) which generate `repoList` for `static_list`.

## 📝 Use dependabot to keep action up-to-date

This file is build in [`./github/dependabot.yml`](./.github/dependabot.yml) to keep action up-to-date.

```yaml
version: 2
updates:
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'daily'
```

## 🙈 Generate `my_token`

> This part is obtained from [`sangonzal/repository-traffic-action`](https://github.com/sangonzal/repository-traffic-action).

You'll first need to create a personal access token (PAT) which make the action having the access to the GitHub API.

You can generate a PAT by going to `Settings(GitHub) -> Developer Settings -> Personal Access Tokens -> Generate new token`, and will need to grant `repo` permission. For more information, see the [GitHub documentation](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token).

After you generated the PAT, go to `Settings(repository) -> Secrets -> New secret`, name the secret `TRAFFIC_TOKEN` and copy the PAT into the box.

## 🔊 CHANGELOG

- [CHANGELOG](./CHANGELOG.md)

## 📄 LICENSE

- [MIT](./LICENSE)

## 🎉 Thanks

- [sangonzal/repository-traffic-action](https://github.com/sangonzal/repository-traffic-action)
- [actions/checkout](https://github.com/actions/checkout)
- [yi-Xu-0100/repo-list-generator](https://github.com/yi-Xu-0100/repo-list-generator)
- [yi-Xu-0100/traffic2badge](https://github.com/yi-Xu-0100/traffic2badge)
