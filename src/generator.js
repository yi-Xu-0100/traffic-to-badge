const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const download = require('image-downloader');

let LicenseGenerator = async function (root, branch, work, year, author) {
  var template_path = path.join(root, 'template');
  var template = path.join(template_path, 'CC-BY-NC-ND-4.0.template');
  var license = path.join(branch, 'LICENSE');
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
  var template_path = path.join(root, 'template');
  var template = path.join(template_path, 'README.template');
  var README = path.join(branch, 'README.md');
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

let SVGGenerator = async function (
  traffic_data,
  traffic_data_path,
  views_color,
  clones_color,
  logo
) {
  async function downloadBadge(name, count, color, logo) {
    var options = {
      url: `https://img.shields.io/badge/${name}-${count}-${color}?logo=${logo}`,
      dest: `${traffic_data_path}/${name}.svg`
    };
    download
      .image(options)
      .then(({ filename }) => {
        console.log('Saved to', filename);
      })
      .catch(err => console.error(err));
  }
  await downloadBadge('views', traffic_data.views.count, views_color, logo);
  await downloadBadge('clones', traffic_data.clones.count, clones_color, logo);
};

module.exports = {
  LicenseGenerator,
  ReadmeGenerator,
  SVGGenerator
};
