const { debug, info } = require('@actions/core');
const { copyFileSync, readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const download = require('image-downloader');
const { rmRF } = require('@actions/io');
const type_list = ['views', 'clones', 'paths', 'referrers'];
const repository = process.env['GITHUB_REPOSITORY'].split(`/`);
const author = repository[0];
const work = repository[1];

let LICENSEGenerator = async function (branch, year) {
  debug(`work: ${work}`);
  debug(`author: ${author}`);
  debug(`branch: ${branch}`);
  var template = join(__dirname, '../template/CC-BY-NC-ND-4.0.template');
  var LICENSE = join(branch, 'LICENSE');
  try {
    copyFileSync(template, LICENSE);
    info('[INFO]: Copy completed, and the LICENSE template from:');
    info('[INFO]: ' + template);
    var data = readFileSync(LICENSE, 'utf-8');
    info('[INFO]: Read completed, and the LICENSE from');
    info('[INFO]: ' + LICENSE);
    var _year = new Date().getFullYear();
    info(`[INFO]: Now year: ${_year}`);
    if (year === '') year = _year;
    if (parseInt(year) != _year) _year = `${year}-${_year}`;
    info(`[INFO]: LICENSE year: ${_year}`);
    data = data
      .replace(/{author}/g, author)
      .replace(/{year}/g, _year)
      .replace(/{work}/g, work);
    writeFileSync(LICENSE, data, 'utf-8');
    info('[INFO]: Successfully generate LICENSE');
    debug('Write completed and the data is:');
    debug(data);
  } catch (error) {
    debug('[LICENSEGenerator]: ' + error);
    throw Error(error.message);
  }
};

let READMEGenerator = function (branch_path, repos) {
  const branch = branch_path.substr(1);
  var template = join(__dirname, '../template/README.template');
  var README = join(branch_path, 'README.md');
  try {
    if (existsSync(README)) rmRF(README);
    info('[INFO]: Clear completed, and the README from');
    info('[INFO]: ' + README);
    var _data = readFileSync(template, 'utf-8');
    info('[INFO]: Read completed, and the README template from:');
    info('[INFO]: ' + template);
    var data =
      '## ⚡️ Generate by [Traffic to Badge - GitHub Action]\
(https://github.com/marketplace/actions/traffic-to-badge)\n';
    for (let i = 0; i < repos.length; i++) {
      data =
        data +
        '\n' +
        _data
          .replace(/{author}/g, author)
          .replace(/{work}/g, work)
          .replace(/{branch}/g, branch)
          .replace(/{repo}/g, repos[i]);
    }
    writeFileSync(README, data, 'utf-8');
    info('[INFO]: Successfully generate README');
    debug('Write completed and the data is:');
    debug(data);
  } catch (error) {
    debug('[READMEGenerator]: ' + error);
    throw Error(error.message);
  }
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
        info(`[INFO]: ${type_list[i]}.svg path:`);
        info('[INFO]: ' + filename);
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
      info(`[INFO]: ${type_list[i]} Traffic data path:`);
      info('[INFO]: ' + file_path);
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
  LICENSEGenerator,
  READMEGenerator,
  SVGGenerator,
  dataGenerator
};
