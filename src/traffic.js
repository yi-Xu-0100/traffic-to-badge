const { debug, info, getInput } = require('@actions/core');
const { execSync } = require('child_process');
const { context, getOctokit } = require('@actions/github');
const { existsSync, mkdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { pluck, filter, contains, union } = require('underscore');
const { rmRF } = require('@actions/io');
const { owner, repo } = context.repo;
const clone_url = `https://github.com/${owner}/${repo}.git`;
const my_token = getInput('my_token', { require: true });
const octokit = new getOctokit(my_token);

let initData = async function (branch, path) {
  if (!existsSync(path)) mkdirSync(path);
  else throw Error(`${path} directory already exists, can not init traffic data!`);

  try {
    await octokit.repos.getBranch({
      owner: owner,
      repo: repo,
      branch: branch
    });
    execSync(`git clone ${clone_url} ${path} -b ${branch} --depth=1`);
    rmRF(join(path, '.git'));
    return true;
  } catch (error) {
    if (error.message != 'Branch not found') {
      debug('[initData]: ' + error);
      throw Error(error.message);
    } else {
      debug('owner:' + owner);
      debug('repo:' + repo);
      debug('traffic_branch:' + branch);
      debug('clone_url:' + clone_url);
      debug('traffic_branch_path:' + path);
      info(`[INFO]: The branch ${branch} not found`);
      rmRF(path);
      info(`[INFO]: Successfully clean ${path}`);
      return false;
    }
  }
};

let getData = async function (repo) {
  try {
    var views = await octokit.repos.getViews({
      owner: owner,
      repo: repo,
      per: 'day'
    });
    debug('latest views: ' + JSON.stringify(views.data));
  } catch (error) {
    debug('[getData.views]: ' + error);
    throw Error(error.message);
  }
  try {
    var clones = await octokit.repos.getClones({
      owner: owner,
      repo: repo,
      per: 'day'
    });
    debug('latest clones: ' + JSON.stringify(clones.data));
  } catch (error) {
    debug('[getData.clones]: ' + error);
    throw Error(error.message);
  }
  try {
    var paths = await octokit.repos.getTopPaths({
      owner: owner,
      repo: repo
    });
    debug('latest paths: ' + JSON.stringify(paths.data));
  } catch (error) {
    debug('[getData.paths]: ' + error);
    throw Error(error.message);
  }
  try {
    var referrers = await octokit.repos.getTopReferrers({
      owner: owner,
      repo: repo
    });
    debug('latest referrers: ' + JSON.stringify(referrers.data));
  } catch (error) {
    debug('[getData.referrers]: ' + error);
    throw Error(error.message);
  }
  return {
    views: views.data,
    clones: clones.data,
    paths: paths.data,
    referrers: referrers.data
  };
};

let combineData = async function combineData(data, path) {
  if (!existsSync(path)) mkdirSync(path);

  var type_list = ['views', 'clones'];
  for (let i = 0; i < type_list.length; i++) {
    let _path = join(path, `traffic_${type_list[i]}.json`);
    try {
      let origin_data = JSON.parse(readFileSync(_path, 'utf8'))[type_list[i]];
      debug('origin_data: ' + JSON.stringify(origin_data));
      let type_data_array = data[type_list[i]][type_list[i]];
      debug('data: ' + JSON.stringify(type_data_array));
      let type_data_timestamp = pluck(type_data_array, 'timestamp');
      debug('pluck: ' + type_data_timestamp);
      origin_data = filter(origin_data, a => !contains(type_data_timestamp, a.timestamp));
      debug('origin_data_filter: ' + JSON.stringify(origin_data));
      let today_data = union(origin_data, type_data_array);
      debug('today_data_union: ' + JSON.stringify(today_data));
      let count = today_data.map(el => parseInt(el.count, 10)).reduce((a, b) => a + b, 0);
      debug('count: ' + count);
      let uniques = today_data.map(el => parseInt(el.uniques, 10)).reduce((a, b) => a + b, 0);
      debug('uniques: ' + uniques);
      let _data = { count: count, uniques: uniques, [type_list[i]]: today_data };
      debug(type_list[i] + ':' + JSON.stringify(_data));
      data[type_list[i]] = _data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        info(`[INFO]: Not Found ${error.path}`);
        debug(type_list[i] + ':' + JSON.stringify(data[type_list[i]]));
      } else {
        debug('[combineData]: ' + error);
        throw Error(error.message);
      }
    }
  }
  return data;
};

module.exports = {
  getData,
  initData,
  combineData
};
