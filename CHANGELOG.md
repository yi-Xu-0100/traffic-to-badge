## CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The emoji used in the `GitHub` commit message is based on [gitmoji](https://gitmoji.carloscuesta.me/).

## [Unreleased]

### ✨ Added

- ✨ add `views/week` and `clones/week` badge.

## [1.1.6] - 2020-10-31

### ✨ Added

- ✨ add support for `aaa/bbb` to get the `bbb` value in `static_list`. (`github.repository` can be in anywhere)
- ✨ add LICENSE and README for traffic.
- ✨ use SVG template for default options.

### ♻️ Changed

- 📝 update README for deployment

### 🔒 Security

- ➕ add `@actions/exec` dependency.
- ➖ delete `child_process` dependency.

## [1.1.5] - 2020-10-25

### 🐛 Fixed

- 🐛 Fix init new repo error. #21

## [1.1.4] - 2020-10-24

### ✨ Added

- ✨ use `github.repository` to be the `static_list` default value.

### ♻️ Changed

- 📝 update readme for template usage.

## [1.1.3] - 2020-10-21

### 🐛 fix

- 🚑 fix `repo-list-generator` version error

## [1.1.2] - 2020-10-21

### 🐛 fix

- 🚑 fix workflow bug

## [1.1.1] - 2020-10-21

### ♻️ Changed

- 📝 update readme
- 🔥 delete branch traffic
- ♻️ update workflow
- ✨ add output for `traffic_branch`

## [1.1.0] - 2020-10-20

### ✨ Added

- ✅ test static_list support
- ✨ add output for `traffic_path`

### ♻️ Changed

- ♻️ enhance log output
- ♻️ enhance debug mode
- ♻️ enhance resource name
- 🔥 delete sync2gitee
- 💚 update workflow

### 🐛 Fixed

- 🐛 fix count reset bug

## [1.0.1] - 2020-10-08

### ✨ Added

- 💬 Add description that using [dependabot](./.github/dependabot.yml) to make action auto updating
- 📄 Use `--license license.txt`
- ➕ Use [rimraf](https://github.com/isaacs/rimraf) delete `dist/*`
- ➕ Use [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-stage) to make pre-commit hook

## [1.0.0] - 2020-10-01

### ✨ Added

- 🎉 [traffic to badge](https://github.com/marketplace/actions/traffic-to-badge) function was completed
- 🌐 [README.md](./README.md)
- 📝 [README_CN.md](./README_CN.md)
- 🌐 [CHANGELOG.md](./CHANGELOG.md)
- 📝 [CHANGELOG_CN.md](./CHANGELOG_CN.md)
- 👷 [workflows](./.github/workflows/autoRelease.yml) to auto release
- 👷 [prettier](./.prettierrc.json) to format files

[unreleased]: https://github.com/yi-Xu-0100/traffic-to-badge/compare/v1.1.6...HEAD
[1.1.6]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.6
[1.1.5]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.5
[1.1.4]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.4
[1.1.3]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.3
[1.1.2]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.2
[1.1.1]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.1
[1.1.0]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.0
[1.0.1]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.0.1
[1.0.0]: https://github.com/yi-Xu-0100/traffic-to-badge/tree/v1.1.0
