const { debug, info, setFailed, getInput } = require('@actions/core');
const { execSync } = require('child_process');
const { context, getOctokit } = require('@actions/github');
const { existsSync, mkdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { pluck, filter, contains, union, extend } = require('underscore');
const { owner, repo } = context.repo;
const clone_url = `https://github.com/${owner}/${repo}.git`;
const my_token = getInput('my_token', { require: true });
const octokit = new getOctokit(my_token);

let getData = async function (repo, views_per = 'day', clones_per = 'day') {
  try {
    var views = await octokit.repos.getViews({
      owner: owner,
      repo: repo,
      per: views_per
    });
    debug('latest views: ' + JSON.stringify(views.data));
  } catch (error) {
    debug(error);
    setFailed(error.message);
  }
  try {
    var clones = await octokit.repos.getClones({
      owner: owner,
      repo: repo,
      per: clones_per
    });
    debug('latest clones: ' + JSON.stringify(clones.data));
  } catch (error) {
    debug(error);
    setFailed(error.message);
  }
  try {
    var paths = await octokit.repos.getTopPaths({
      owner: owner,
      repo: repo
    });
    debug('latest paths: ' + JSON.stringify(paths.data));
  } catch (error) {
    debug(error);
    setFailed(error.message);
  }
  try {
    var referrers = await octokit.repos.getTopReferrers({
      owner: owner,
      repo: repo
    });
    debug('latest referrers: ' + JSON.stringify(referrers.data));
  } catch (error) {
    debug(error);
    setFailed(error.message);
  }
  return {
    views: views.data,
    clones: clones.data,
    paths: paths.data,
    referrers: referrers.data
  };
};

let initData = async function (branch, path) {
  if (!existsSync(path)) {
    mkdirSync(path);
  } else {
    setFailed(`${path} already exists!`);
  }
  try {
    await octokit.repos.getBranch({
      owner: owner,
      repo: repo,
      branch: branch
    });
    execSync(`git clone ${clone_url} ${path} -b ${branch} --depth=1`);
    execSync(`rm -rf ${join(branch, '.git')}`);
    return true;
  } catch (error) {
    if (error.message != 'Branch not found') {
      debug(error);
      setFailed(`error: ${error.message}`);
    } else {
      debug('traffic_branch_path:');
      debug(path);
      debug('traffic_branch:');
      debug(branch);
      info(`${branch} not found`);
      return false;
    }
  }
};

let combineData = async function (data, path) {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
  var type_list = ['views', 'clones'];
  for (let i = 0; i < type_list.length; i++) {
    let _path = join(path, `traffic_${type_list[i]}`.json);
    try {
      let origin_data = JSON.parse(readFileSync(_path, 'utf8'))[type_list[i]];
      debug('origin_data: ' + JSON.stringify(origin_data));
      debug('data: ' + JSON.stringify(data[type_list[i]][type_list[i]]));
      debug('pluck: ' + pluck(origin_data, 'timestamp'));
      origin_data = filter(
        origin_data,
        a => !contains(pluck(data[type_list[i]][type_list[i]], 'timestamp'), a.timestamp)
      );
      debug('origin_data_filter: ' + JSON.stringify(origin_data));
      let today_data = union(origin_data, data[type_list[i]][type_list[i]]);
      console.log('today_data_union: ' + JSON.stringify(today_data));
      let count = today_data.map(el => parseInt(el.count)).reduce((a, b) => a + b, 0);
      let uniques = today_data.map(el => parseInt(el.uniques)).reduce((a, b) => a + b, 0);
      let _data = extend({ count: count }, { uniques: uniques }, { [type_list[i]]: today_data });
      debug(`${type_list[i]}: ${JSON.stringify(_data)}`);
      data[type_list[i]] = _data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        info(`Not Found ${error.path}`);
        debug(`${type_list[i]}: ${JSON.stringify(data[type_list[i]])}`);
      } else {
        setFailed(error);
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
