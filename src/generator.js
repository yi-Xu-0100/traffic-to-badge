const core = require('@actions/core');
const fs = require('fs');
const { join } = require('path');
const download = require('image-downloader');
const type_list = ['views', 'clones', 'paths', 'referrers'];

let LicenseGenerator = async function (root, branch, work, year, author) {
  var template_path = join(root, 'template');
  var template = join(template_path, 'CC-BY-NC-ND-4.0.template');
  var license = join(branch, 'LICENSE');
  fs.copyFileSync(template, license);
  core.info('Copy complete, and the license template from:');
  core.info(template);
  var data = fs.readFileSync(license, 'utf-8');
  core.info('Read complete, and the license from');
  core.info(license);
  var _year = new Date().getFullYear();
  core.info(`Now year: ${_year}`);
  if (year === 'none') year = _year;
  if (parseInt(year) != _year) _year = `${year}-${_year}`;
  core.info(`License year: ${_year}`);
  data = data
    .replace(/{author}/g, author)
    .replace(/{year}/g, _year)
    .replace(/{work}/g, work);
  fs.writeFileSync(license, data, 'utf-8');
  core.info('Write complete and the data is:');
  core.info(data);
};

let ReadmeGenerator = function (root, author, repo, branch, number) {
  var template_path = join(root, 'template');
  var template = join(template_path, 'README.template');
  var README = join(branch, 'README.md');
  if (!fs.existsSync(README)) fs.mkdirSync(README);
  if (number === 0) fs.writeFileSync(README, '## ⚡️ Traffic to Badge GitHub Action\n', 'utf-8');
  var data = fs.readFileSync(template, 'utf-8');
  core.info('Read complete, and the template from');
  core.info(template);
  data = data
    .replace(/{author}/g, author)
    .replace(/{repo}/g, repo)
    .replace(/{branch}/g, branch);
  fs.writeFileSync(README, data, { encoding: 'utf-8', flag: 'a' });
  core.info('Write complete and the data is:');
  core.info(data);
};

let SVGGenerator = async function (data, path, views_color, clones_color, logo) {
  var color = [views_color, clones_color];
  for (let i = 0; i < 2; i++) {
    var options = {
      url:
        `https://img.shields.io/badge/${type_list[i]}-` +
        data[`${type_list[i]}`].count +
        `-${color[i]}?logo=${logo}`,
      dest: `${path}/${type_list[i]}.svg`
    };
    await download
      .image(options)
      .then(({ fileName }) => {
        core.info(`${type_list[i]}.svg saved at:`);
        core.info(fileName);
      })
      .catch(err => core.setFailed(err));
  }
};

module.exports = {
  LicenseGenerator,
  ReadmeGenerator,
  SVGGenerator
};
