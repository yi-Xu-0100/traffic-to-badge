const core = require('@actions/core');
const { join } = require('path');
const traffic = require('./traffic');
const generator = require('./generator');

const src = join(__dirname, '..');

async function run() {
  core.startGroup('Get input value');
  const views_per = core.getInput('views_per', { require: false });
  core.info(`views_per: ${views_per}`);
  const clones_per = core.getInput('clones_per', { require: false });
  core.info(`clones_per: ${clones_per}`);
  const my_token = core.getInput('my_token', { require: true });
  const static_list = core.getInput('static_list', { require: true }).split(',');
  core.info(`static_list: ${static_list}`);
  const traffic_branch = core.getInput('traffic_branch', { require: false });
  core.info(`traffic_branch: ${traffic_branch}`);
  const views_color = core.getInput('views_color', { require: false });
  core.info(`views_color: ${views_color}`);
  const clones_color = core.getInput('clones_color', { require: false });
  core.info(`clones_color: ${clones_color}`);
  const logo = core.getInput('logo', { require: false });
  core.info(`logo: ${logo}`);
  const traffic_branch_path = join(src, traffic_branch);
  core.info(`traffic_branch_path: ${traffic_branch_path}`);
  core.endGroup();
  core.startGroup('Init traffic data');
  if (!(await traffic.initData(my_token, traffic_branch, traffic_branch_path))) {
    core.setFailed(`Init traffic data into ${traffic_branch_path} fail!`);
  }
  core.endGroup();
  for (let i = 0; i < static_list.length; i++) {
    core.startGroup(`Set traffic data of ${static_list[i]}`);
    let traffic_data_path = join(traffic_branch_path, `traffic-${static_list[i]}`);
    let latest_traffic_data = await traffic.getData(
      my_token,
      static_list[i],
      views_per,
      clones_per
    );
    let traffic_data = await traffic.combineData(latest_traffic_data, traffic_data_path);
    await traffic.saveData(traffic_data, traffic_data_path);
    await generator.SVGGenerator(traffic_data, traffic_data_path, views_color, clones_color, logo);
    core.endGroup();
  }
}

try {
  run();
} catch (error) {
  core.setFailed(error);
}
