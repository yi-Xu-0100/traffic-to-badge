const { startGroup, endGroup, info, setFailed, getInput } = require('@actions/core');
const { join } = require('path');
const { initData, getData, combineData } = require('./traffic');
const { SVGGenerator, dataGenerator } = require('./generator');

const src = join(__dirname, '..');

async function run() {
  startGroup('Get input value');
  const views_per = getInput('views_per', { require: false });
  info(`views_per: ${views_per}`);
  const clones_per = getInput('clones_per', { require: false });
  info(`clones_per: ${clones_per}`);
  const static_list = getInput('static_list', { require: true }).split(',');
  info(`static_list: ${static_list}`);
  const traffic_branch = getInput('traffic_branch', { require: false });
  info(`traffic_branch: ${traffic_branch}`);
  const views_color = getInput('views_color', { require: false });
  info(`views_color: ${views_color}`);
  const clones_color = getInput('clones_color', { require: false });
  info(`clones_color: ${clones_color}`);
  const logo = getInput('logo', { require: false });
  info(`logo: ${logo}`);
  const traffic_branch_path = join(src, traffic_branch);
  info(`traffic_branch_path: ${traffic_branch_path}`);
  endGroup();
  startGroup('Init traffic data');
  if (!(await initData(traffic_branch, traffic_branch_path))) {
    setFailed(`Init traffic data into ${traffic_branch_path} fail!`);
  }
  endGroup();
  for (let i = 0; i < static_list.length; i++) {
    startGroup(`Set traffic data of ${static_list[i]}`);
    let traffic_data_path = join(traffic_branch_path, `traffic-${static_list[i]}`);
    let latest_traffic_data = await getData(static_list[i], views_per, clones_per);
    let traffic_data = await combineData(latest_traffic_data, traffic_data_path);
    await dataGenerator(traffic_data, traffic_data_path);
    await SVGGenerator(traffic_data, traffic_data_path, views_color, clones_color, logo);
    endGroup();
  }
}

run().catch(error => setFailed(error.message));
