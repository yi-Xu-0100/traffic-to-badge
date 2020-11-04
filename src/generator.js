const { debug, info } = require('@actions/core');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const download = require('image-downloader');
const { rmRF, cp } = require('@actions/io');
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
    if (existsSync(LICENSE)) await rmRF(LICENSE);
    await cp(template, LICENSE, { recursive: true, force: false });
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
    info('[INFO]: LICENSE in ' + LICENSE);
    debug('Write completed and the data is:');
    debug(data);
  } catch (error) {
    debug('[LICENSEGenerator]: ' + error);
    throw Error(error.message);
  }
};

let READMEGenerator = async function (branch_path, repos) {
  const branch = branch_path.substr(1);
  var template = join(__dirname, '../template/README.template');
  var README = join(branch_path, 'README.md');
  try {
    if (existsSync(README)) await rmRF(README);
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
    info('[INFO]: README in ' + README);
    debug('Write completed and the data is:');
    debug(data);
  } catch (error) {
    debug('[READMEGenerator]: ' + error);
    throw Error(error.message);
  }
};

let SVGGenerator = async function (data, path, views_color, clones_color, logo) {
  const color = [views_color, clones_color];
  for (let i = 0; i < 2; i++) {
    if (views_color === 'brightgreen' && clones_color === 'brightgreen' && logo === 'github') {
      info(`[INFO]:Start generate ${type_list[i]} SVG`);
      const type_default = [58, 62]; //left-label-width
      debug(`type: ${type_list[i]}`);
      var type_left = type_default[i];
      debug(`type_left: ${type_left}`);
      var left_x = type_default[i] * 5 + 95;
      debug(`left_x: ${left_x}`);
      var text_length = type_default[i] * 10 - 270;
      debug(`text_length: ${text_length}`);
      var number = parseInt(data[type_list[i]].count, 10);
      debug(`data[type_list[i]].count: ${data[type_list[i]].count}`);
      debug(`number: ${number}`);
      var number_magnitude = number.toString().length;
      debug(`number_magnitude: ${number_magnitude}`);
      var right_width =
        (number_magnitude % 2 ? 31 : 23) + (parseInt(number_magnitude / 2, 10) - 1) * 14;
      debug(`right_width: ${right_width}`);
      var SVG_width = type_left + right_width;
      debug(`SVG_width: ${SVG_width}`);
      var right_x = right_width * 5 + type_left * 10 - 10;
      debug(`right_x: ${right_x}`);
      var number_length = right_width * 10 - 100;
      debug(`number_length: ${number_length}`);
      var template = join(__dirname, '../template/SVG.template');
      var SVG = join(path, `${type_list[i]}.svg`);
      var _data = readFileSync(template, 'utf-8');
      writeFileSync(
        SVG,
        _data
          .replace(/{type}/g, `${type_list[i]}`)
          .replace(/{number}/g, `${number}`)
          .replace(/{SVG_width}/g, `${SVG_width}`)
          .replace(/{type_left}/g, `${type_left}`)
          .replace(/{right_width}/g, `${right_width}`)
          .replace(/{left_x}/g, `${left_x}`)
          .replace(/{text_length}/g, `${text_length}`)
          .replace(/{right_x}/g, `${right_x}`)
          .replace(/{number_length}/g, `${number_length}`),
        'utf-8'
      );
      info(`[INFO]: Successfully generate ${type_list[i]} SVG`);
      info(`[INFO]: ${type_list[i]}.svg path: ${SVG}`);
    } else if (process.env['local_debug'] === 'true') {
      info(`[INFO]: Skip download ${type_list[i]} SVG`);
    } else {
      info(`[INFO]:Start download ${type_list[i]} SVG`);
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
          info(`[INFO]: Successfully download ${type_list[i]} SVG`);
          info(`[INFO]: ${type_list[i]}.svg path:`);
          info('[INFO]: ' + filename);
        })
        .catch(error => {
          debug('[SVGGenerator]: ' + error);
          throw Error(error.message);
        });
    }
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

let Week_SVGGenerator = async function (data, path, views_color, clones_color, logo) {
  const color = [views_color, clones_color];
  for (let i = 0; i < 2; i++) {
    info(`[INFO]:Start download ${type_list[i]} per week SVG`);
    let options = {
      url:
        `https://img.shields.io/badge/${type_list[i]}-` +
        data[type_list[i]].count +
        `/week-${color[i]}?logo=${logo}`,
      dest: `${path}/${type_list[i]}_per_week.svg`
    };
    await download
      .image(options)
      .then(({ filename }) => {
        info(`[INFO]: Successfully download ${type_list[i]} per week SVG`);
        info(`[INFO]: ${type_list[i]}_per_week.svg path:`);
        info('[INFO]: ' + filename);
      })
      .catch(error => {
        debug('[Week_SVGGenerator]: ' + error);
        throw Error(error.message);
      });
  }
};

module.exports = {
  LICENSEGenerator,
  READMEGenerator,
  SVGGenerator,
  dataGenerator,
  Week_SVGGenerator
};
