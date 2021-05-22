const { debug, info, getInput } = require('@actions/core');
const { exec } = require('@actions/exec');
const { context, getOctokit } = require('@actions/github');
const { existsSync, readFileSync } = require('fs');
const { join } = require('path');
const { pluck, filter, contains, union } = require('underscore');
const { rmRF, mkdirP } = require('@actions/io');
const { owner, repo } = context.repo;
const clone_url = `https://github.com/${owner}/${repo}.git`;
const my_token = getInput('my_token', { require: true });
const octokit = getOctokit(my_token);
const type_list = ['views', 'clones'];

let calculateData = function (data) {
  for (let i = 0; i < type_list.length; i++) {
    debug('calculateData: ' + type_list[i]);
    let type_data = data[type_list[i]][type_list[i]];
    let count = type_data.map(el => parseInt(el.count, 10)).reduce((a, b) => a + b, 0);
    debug('count: ' + count);
    let uniques = type_data.map(el => parseInt(el.uniques, 10)).reduce((a, b) => a + b, 0);
    debug('uniques: ' + uniques);
    let _data = { count: count, uniques: uniques, [type_list[i]]: type_data };
    data[type_list[i]] = _data;
    debug(type_list[i] + ':' + JSON.stringify(data[type_list[i]]));
  }
  return data;
};

let initData = async function (branch, path) {
  if (!existsSync(path)) await mkdirP(path);
  else throw Error(`${path} directory already exists, can not init traffic data!`);

  try {
    await octokit.rest.repos.getBranch({
      owner: owner,
      repo: repo,
      branch: branch
    });
    await exec(`git clone ${clone_url} ${path} -b ${branch} --depth=1`);
    await rmRF(join(path, '.git'));
  } catch (error) {
    if (error.message != 'Branch not found') {
      await rmRF(path);
      debug('[initData]: ' + error);
      throw Error(error.message);
    } else {
      debug('owner:' + owner);
      debug('repo:' + repo);
      debug('traffic_branch:' + branch);
      debug('clone_url:' + clone_url);
      debug('traffic_branch_path:' + path);
      info(`[INFO]: The branch ${branch} not found`);
    }
  }
};

let getData = async function (repo) {
  try {
    let views = await octokit.rest.repos.getViews({
      owner: owner,
      repo: repo,
      per: 'day'
    });
    let latest_views = views.data;
    debug('latest_views: ' + JSON.stringify(latest_views));
    let day = new Date();
    let _day = new Date(day.getTime() - 14 * 24 * 60 * 60 * 1000);
    let week = new Date(day.getTime() - 7 * 24 * 60 * 60 * 1000);
    let timestamp = `${day.toISOString().slice(0, 11)}00:00:00Z`;
    let _timestamp = `${_day.toISOString().slice(0, 11)}00:00:00Z`;
    let week_timestamp = `${week.toISOString().slice(0, 11)}00:00:00Z`;
    debug('timestamp: ' + timestamp);
    debug('_timestamp: ' + _timestamp);
    debug('week_timestamp: ' + week_timestamp);
    latest_views.views = filter(
      latest_views.views,
      a => a.timestamp != _timestamp && a.timestamp != timestamp
    );
    var latest_views_filter = JSON.parse(JSON.stringify(latest_views));
    debug('latest_views_filter: ' + JSON.stringify(latest_views_filter));
    latest_views.views = filter(
      latest_views.views,
      a => new Date(a.timestamp) >= new Date(week_timestamp)
    );
    var latest_views_week = latest_views;
    debug('latest_views_week: ' + JSON.stringify(latest_views_week));
  } catch (error) {
    debug('[getData.views]: ' + error);
    throw Error(error.message);
  }
  try {
    let clones = await octokit.rest.repos.getClones({
      owner: owner,
      repo: repo,
      per: 'day'
    });
    let latest_clones = clones.data;
    debug('latest_clones: ' + JSON.stringify(latest_clones));
    let day = new Date();
    let _day = new Date(day.getTime() - 14 * 24 * 60 * 60 * 1000);
    let week = new Date(day.getTime() - 7 * 24 * 60 * 60 * 1000);
    let timestamp = `${day.toISOString().slice(0, 11)}00:00:00Z`;
    let _timestamp = `${_day.toISOString().slice(0, 11)}00:00:00Z`;
    let week_timestamp = `${week.toISOString().slice(0, 11)}00:00:00Z`;
    debug('timestamp: ' + timestamp);
    debug('_timestamp: ' + _timestamp);
    debug('week_timestamp: ' + week_timestamp);
    latest_clones.clones = filter(
      latest_clones.clones,
      a => _timestamp != a.timestamp && timestamp != a.timestamp
    );
    var latest_clones_filter = JSON.parse(JSON.stringify(latest_clones));
    debug('latest_clones_filter: ' + JSON.stringify(latest_clones_filter));
    latest_clones.clones = filter(
      latest_clones.clones,
      a => new Date(a.timestamp) >= new Date(week_timestamp)
    );
    var latest_clones_week = latest_clones;
    debug('latest_clones_week: ' + JSON.stringify(latest_clones_week));
  } catch (error) {
    debug('[getData.clones]: ' + error);
    throw Error(error.message);
  }
  try {
    var paths = await octokit.rest.repos.getTopPaths({
      owner: owner,
      repo: repo
    });
    debug('latest paths: ' + JSON.stringify(paths.data));
  } catch (error) {
    debug('[getData.paths]: ' + error);
    throw Error(error.message);
  }
  try {
    var referrers = await octokit.rest.repos.getTopReferrers({
      owner: owner,
      repo: repo
    });
    debug('latest referrers: ' + JSON.stringify(referrers.data));
  } catch (error) {
    debug('[getData.referrers]: ' + error);
    throw Error(error.message);
  }
  var data = {
    views: latest_views_filter,
    clones: latest_clones_filter,
    paths: paths.data,
    referrers: referrers.data
  };
  var week_data = {
    views: latest_views_week,
    clones: latest_clones_week
  };
  return [calculateData(data), calculateData(week_data)];
};

let combineData = async function (data, path) {
  if (!existsSync(path)) await mkdirP(path);

  for (let i = 0; i < type_list.length; i++) {
    let _path = join(path, `traffic_${type_list[i]}.json`);
    try {
      let origin_data = JSON.parse(readFileSync(_path, 'utf8'))[type_list[i]];
      debug('origin_data: ' + JSON.stringify(origin_data));
      let new_data = data[type_list[i]][type_list[i]];
      debug('new_data: ' + JSON.stringify(new_data));
      let new_data_timestamp = pluck(new_data, 'timestamp');
      debug('new_data_timestamp: ' + new_data_timestamp);
      let origin_data_filter = filter(origin_data, a => !contains(new_data_timestamp, a.timestamp));
      debug('origin_data_filter: ' + JSON.stringify(origin_data_filter));
      let union_data = union(origin_data_filter, new_data);
      debug('union_data: ' + JSON.stringify(union_data));
      data[type_list[i]][type_list[i]] = union_data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        info(`[INFO]: Not Found ${error.path}`);
      } else {
        debug('[combineData]: ' + error);
        throw Error(error.message);
      }
    }
  }
  return calculateData(data);
};

module.exports = {
  getData,
  initData,
  combineData
};
