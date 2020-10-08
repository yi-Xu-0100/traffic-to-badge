## ⚡️ Traffic to Badge GitHub Action

[![sync2gitee](https://github.com/yi-Xu-0100/traffic-to-badge/workflows/sync2gitee/badge.svg)](https://github.com/yi-Xu-0100/traffic-to-badge/actions?query=workflow%3Async2gitee)
[![traffic2badge](https://github.com/yi-Xu-0100/traffic-to-badge/workflows/traffic2badge/badge.svg)](https://github.com/yi-Xu-0100/traffic-to-badge/actions?query=workflow%3Atraffic2badge)
[![Github last commit](https://img.shields.io/github/last-commit/yi-Xu-0100/traffic-to-badge)](https://github.com/yi-Xu-0100/traffic-to-badge)
[![Github latest release](https://img.shields.io/github/v/release/yi-Xu-0100/traffic-to-badge)](https://github.com/yi-Xu-0100/traffic-to-badge/releases)
[![Github license](https://img.shields.io/github/license/yi-Xu-0100/traffic-to-badge)](./LICENSE)

[![GitHub views](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/views.svg)](https://github.com/yi-Xu-0100/traffic-to-badge/tree/traffic/traffic-traffic-to-badge)
[![GitHub clones](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/clones.svg)](https://github.com/yi-Xu-0100/traffic-to-badge/tree/traffic/traffic-traffic-to-badge)

[**English**](.README.md) | [简体中文](./README_CN.md)

The GitHub action that using repositories `Insights/traffic` data to generate badges that include views and clones.

**Notion: It will also backup your secret traffic data into `traffic branch` .**

## 🎨 Table of Contents

- [⚡️ Traffic to Badge GitHub Action](#️-traffic-to-badge-github-action)
- [🎨 Table of Contents](#-table-of-contents)
- [🚀 Configuration](#-configuration)
- [📝 Example that using actions-gh-pages to push traffic branch](#-example-that-using-actions-gh-pages-to-push-traffic-branch)
- [📝 Use dependabot to keep action up-to-date](#-use-dependabot-to-keep-action-up-to-date)
- [🙈 Generate `my_token`](#-generate-my_token)
- [🔊 CHANGELOG](#-changelog)
- [📄 LICENSE](#-license)
- [🎉 Thanks](#-thanks)

## 🚀 Configuration

```yaml
input:
  my_token:
    description: 'Set up a personal access token to obtain the secret repository traffic data.'
    required: true
  static_list:
    description: 'Set up a list of repositories to get.'
    required: true
  traffic_branch:
    description: 'If empty traffic data will be backed up to the branch named traffic.'
    required: false
    default: 'traffic'
  views_color:
    description: 'Set a hex or named color value for the views badge background.'
    required: false
    default: 'brightgreen'
  clones_color:
    description: 'Set a hex or named color value for the clones badge background.'
    required: false
    default: 'brightgreen'
  logo:
    description: 'Insert a named logo or simple-icon to the left of the label.'
    required: false
    default: 'github'
```

## 📝 Example that using actions-gh-pages to push traffic branch

This example use [`peaceiris/actions-gh-pages@v3.6.4`](https://github.com/peaceiris/actions-gh-pages) to publish traffic data to `traffic branch`.

```yaml
name: traffic2badge
on:
  schedule:
    - cron: '1 18 * * *' # UTC 18:01

jobs:
  run:
    name: Make GitHub Traffic data to Badge
    runs-on: ubuntu-latest
    steps:
      - name: Get current repository name
        id: info
        uses: actions/github-script@v3.0.0
        with:
          github-token: ${{secrets.GITHUB_TOKEN}}
          result-encoding: string
          script: |
            return context.repo.repo;

      - name: Set traffic
        uses: yi-Xu-0100/traffic-to-badge@v1.0.0
        with:
          my_token: ${{ secrets.TRAFFIC_TOKEN }}
          static_list: '${{ steps.info.outputs.result }}'
          traffic_branch: traffic
          views_color: brightgreen
          clones_color: brightgreen
          logo: github

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3.6.4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: traffic
          publish_dir: ./traffic
          user_name: 'github-actions[bot]'
          user_email: 'github-actions[bot]@users.noreply.github.com'
          full_commit_message: ${{ github.event.head_commit.message }}

      - name: Show traffic data
        run: |
          cd ./traffic/
          ls -a
          cd ./traffic-${{ steps.info.outputs.result }}/
          ls -a
```

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

> This part is obtained from [sangonzal/repository-traffic-action](https://github.com/sangonzal/repository-traffic-action).

You'll first need to create a personal access token (PAT) which make the action having the access to the GitHub API.

You can generate a PAT by going to `Settings(GitHub) -> Developer Settings -> Personal Access Tokens -> Generate new token`, and will need to grant `repo` permission. For more information, see the [GitHub documentation](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

After you generated the PAT, go to `Settings(repository) -> Secrets -> New secret`, name the secret `TRAFFIC_TOKEN` and copy the PAT into the box.

## 🔊 CHANGELOG

- [CHANGELOG](./CHANGELOG.md)

## 📄 LICENSE

- [MIT](./LICENSE)

## 🎉 Thanks

- [sangonzal/repository-traffic-action](https://github.com/sangonzal/repository-traffic-action)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
