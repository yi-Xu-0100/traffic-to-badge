const { debug, info } = require('@actions/core');
const { copyFileSync, readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const download = require('image-downloader');
const type_list = ['views', 'clones', 'paths', 'referrers'];

let LicenseGenerator = async function (root, branch, work, year, author) {
  var template_path = join(root, 'template');
  var template = join(template_path, 'CC-BY-NC-ND-4.0.template');
  var license = join(branch, 'LICENSE');
  copyFileSync(template, license);
  info('Copy complete, and the license template from:');
  info(template);
  var data = readFileSync(license, 'utf-8');
  info('Read complete, and the license from');
  info(license);
  var _year = new Date().getFullYear();
  info(`Now year: ${_year}`);
  if (year === 'none') year = _year;
  if (parseInt(year) != _year) _year = `${year}-${_year}`;
  info(`License year: ${_year}`);
  data = data
    .replace(/{author}/g, author)
    .replace(/{year}/g, _year)
    .replace(/{work}/g, work);
  writeFileSync(license, data, 'utf-8');
  info('Write complete and the data is:');
  info(data);
};

let ReadmeGenerator = function (root, author, repo, branch, number) {
  var template_path = join(root, 'template');
  var template = join(template_path, 'README.template');
  var README = join(branch, 'README.md');
  if (!existsSync(README)) mkdirSync(README);
  if (number === 0) writeFileSync(README, '## ⚡️ Traffic to Badge GitHub Action\n', 'utf-8');
  var data = readFileSync(template, 'utf-8');
  info('Read complete, and the template from');
  info(template);
  data = data
    .replace(/{author}/g, author)
    .replace(/{repo}/g, repo)
    .replace(/{branch}/g, branch);
  writeFileSync(README, data, { encoding: 'utf-8', flag: 'a' });
  info('Write complete!');
  debug('The data is:');
  debug(data);
};

let SVGGenerator = async function (data, path, views_color, clones_color, logo) {
  var color = [views_color, clones_color];
  for (let i = 0; i < 2; i++) {
    debug(`Start generate ${type_list[i]} SVG`);
    let options = {
      url:
        `https://img.shields.io/badge/${type_list[i]}-` +
        data[type_list[i]].count +
        `-${color[i]}?logo=${logo}`,
      dest: `${path}/${type_list[i]}.svg`
    };
    await download
      .image(options)
      .then(({ filename }) => {
        info(`${type_list[i]}.svg path:`);
        info(filename);
      })
      .catch(error => {
        debug('[SVGGenerator]: ' + error);
        throw Error(error.message);
      });
    debug(`Successfully generate ${type_list[i]} SVG`);
  }
};

let dataGenerator = async function (data, path) {
  for (let i = 0; i < type_list.length; i++) {
    debug(`Start generate traffic_${type_list[i]}.json`);
    let file_path = join(path, `traffic_${type_list[i]}.json`);
    let file_data = data[type_list[i]];
    try {
      writeFileSync(file_path, JSON.stringify(file_data, null, 2), 'utf-8');
      info(`${type_list[i]} Traffic data path:`);
      info(file_path);
    } catch (error) {
      debug(`${type_list[i]} file_data:`);
      debug(file_data);
      debug('[dataGenerator]: ' + error);
      throw Error(error.message);
    }
    debug(`Successfully generate traffic_${type_list[i]}.json`);
  }
};

module.exports = {
  LicenseGenerator,
  ReadmeGenerator,
  SVGGenerator,
  dataGenerator
};
