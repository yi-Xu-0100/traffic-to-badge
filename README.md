# ⚡️ Traffic to Badge GitHub Action

[![sync2gitee(list)](<https://github.com/yi-Xu-0100/hub-mirror/workflows/sync2gitee(list)/badge.svg>)](https://github.com/yi-Xu-0100/hub-mirror)
[![traffic2badge](https://github.com/yi-Xu-0100/traffic-to-badge/workflows/traffic2badge/badge.svg)](https://github.com/yi-Xu-0100/traffic-to-badge/actions?query=workflow%3Atraffic2badge)
[![Github last commit](https://img.shields.io/github/last-commit/yi-Xu-0100/traffic-to-badge)](https://github.com/yi-Xu-0100/traffic-to-badge)
[![Github latest release](https://img.shields.io/github/v/release/yi-Xu-0100/traffic-to-badge)](https://github.com/yi-Xu-0100/traffic-to-badge/releases)
[![Github license](https://img.shields.io/github/license/yi-Xu-0100/traffic-to-badge)](./LICENSE)

[![GitHub views](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/views.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)
[![GitHub views per week](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/views_per_week.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)
[![GitHub clones](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/clones.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)
[![GitHub clones per week](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/traffic-traffic-to-badge/clones_per_week.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)

[![GitHub views](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/total_views.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)
[![GitHub views per week](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/total_views_per_week.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)
[![GitHub clones](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/total_clones.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)
[![GitHub clones per week](https://raw.githubusercontent.com/yi-Xu-0100/traffic-to-badge/traffic/total_clones_per_week.svg)](https://github.com/yi-Xu-0100/traffic-to-badge#README)

[**English**](.README.md) | [简体中文](./README_CN.md)

The GitHub action that using repositories `Insights/traffic` data to generate badges that include views and clones.

**Note: The badge counts the all traffic data which backed up in `traffic_branch`, and only the latest 2 weeks data is official traffic data among them. In which the other data generated with older schedule action or the personal given. The `count/week` badge generates by the official traffic data of a week before action done.**

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
  views_week_color:
    description: >
      Set a hex or named color value for the views per week badge background.
    required: false
    default: brightgreen
  clones_week_color:
    description: >
      Set a hex or named color value for the clones per week badge background.
    required: false
    default: brightgreen
  total_views_color:
    description: >
      Set a hex or named color value for the total views badge background.
    required: false
    default: brightgreen
  total_clones_color:
    description: >
      Set a hex or named color value for the total clones badge background.
    required: false
    default: brightgreen
  total_views_week_color:
    description: >
      Set a hex or named color value for the total views per week badge background.
    required: false
    default: brightgreen
  total_clones_week_color:
    description: >
      Set a hex or named color value for the total clones per week badge background.
    required: false
    default: brightgreen
  logo:
    description: >
      Insert a named logo or simple-icon to the left of the label.
    required: false
    default: github
  year:
    description: >
      Set a year number for license year beginning.
      If empty, it will no beginning year.
    required: false

outputs:
  traffic_branch:
    description: >
      Origin traffic data branch name
  traffic_path:
    description: >
      Path to generate traffic data
```

## 📝 Example usage

If you want to deploy for your repository, the deployment step used [peaceiris/actions-gh-pages](https://github.com/marketplace/actions/github-pages-action) need to be added. Add the follow code for your workflow.

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
        uses: actions/checkout@v2.3.4

      - name: Get Commit Message
        id: message
        uses: actions/github-script@v3.1.0
        env:
          FULL_COMMIT_MESSAGE: '${{ github.event.head_commit.message }}'
        with:
          result-encoding: string
          script: |
            var message = `${process.env.FULL_COMMIT_MESSAGE}`;
            core.info(message);
            if (message != '') return message;
            var time = new Date(Date.now()).toISOString();
            core.info(time);
            return `Get traffic data at ${time}`;

      - name: Set Traffic
        id: traffic
        uses: yi-Xu-0100/traffic-to-badge@v1.4.0
        with:
          my_token: ${{ secrets.TRAFFIC_TOKEN }}
          #(default) static_list: ${{ github.repository }}
          #(default) traffic_branch: traffic
          #(default) views_color: brightgreen
          #(default) clones_color: brightgreen
          #(default) views_week_color: brightgreen
          #(default) clones_week_color: brightgreen
          #(default) total_views_color: brightgreen
          #(default) total_clones_color: brightgreen
          #(default) total_views_week_color: brightgreen
          #(default) total_clones_week_color: brightgreen
          #(default) logo: github
          year: 2021

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3.7.3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: ${{ steps.traffic.outputs.traffic_branch }}
          publish_dir: ${{ steps.traffic.outputs.traffic_path }}
          user_name: 'github-actions[bot]'
          user_email: 'github-actions[bot]@users.noreply.github.com'
          full_commit_message: ${{ steps.message.outputs.result }}

      - name: Show Traffic Data
        run: |
          echo ${{ steps.traffic.outputs.traffic_branch }}
          echo ${{ steps.traffic.outputs.traffic_path }}
          cd ${{ steps.traffic.outputs.traffic_path }}
          ls -a
```

**Explanation:**

1. The [`actions/github-script`](https://github.com/marketplace/actions/github-script) generates message for commit.
2. The [`peaceiris/actions-gh-pages`](https://github.com/marketplace/actions/github-pages-action) publish traffic data to `traffic_branch`. The options follow this [`guide`](https://github.com/marketplace/actions/github-pages-action#table-of-contents).
3. The `TRAFFIC_TOKEN` needs to be generated, the guild in [Generate `my_token`](#-generate-my_token).
4. The `GITHUB_TOKEN` does not need to be generated，only reference it in your workflow file，and the document in [Using the `GITHUB_TOKEN` in a workflow](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow#using-the-github_token-in-a-workflow).

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
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
