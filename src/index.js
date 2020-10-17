const {
  startGroup,
  endGroup,
  info,
  setFailed,
  getInput,
  group,
  setOutput
} = require('@actions/core');
const { join } = require('path');
const { initData, getData, combineData } = require('./traffic');
const { SVGGenerator, dataGenerator } = require('./generator');

async function run() {
  try {
    startGroup('Get input value');
    const static_list = getInput('static_list', { require: true }).split(',');
    info(`[Info]: static_list: ${static_list}`);
    const traffic_branch = getInput('traffic_branch', { require: false });
    info(`[Info]: traffic_branch: ${traffic_branch}`);
    const views_color = getInput('views_color', { require: false });
    info(`[Info]: views_color: ${views_color}`);
    const clones_color = getInput('clones_color', { require: false });
    info(`[Info]: clones_color: ${clones_color}`);
    const logo = getInput('logo', { require: false });
    info(`[Info]: logo: ${logo}`);
    const traffic_branch_path = `.${traffic_branch}`;
    info(`[Info]: set output traffic_path: ${traffic_branch_path}`);
    setOutput('traffic_path', traffic_branch_path);
    info(`[Info]: traffic_branch_path: ${traffic_branch_path}`);
    endGroup();
    await group('Init traffic data', async () => {
      if (!(await initData(traffic_branch, traffic_branch_path))) {
        throw Error(`Init traffic data into ${traffic_branch_path} fail!`);
      }
    });
    for (let i = 0; i < static_list.length; i++) {
      startGroup(`Set traffic data of ${static_list[i]}`);
      let traffic_data_path = join(traffic_branch_path, `traffic-${static_list[i]}`);
      let latest_traffic_data = await getData(static_list[i]);
      let traffic_data = await combineData(latest_traffic_data, traffic_data_path);
      await dataGenerator(traffic_data, traffic_data_path);
      await SVGGenerator(traffic_data, traffic_data_path, views_color, clones_color, logo);
      endGroup();
    }
  } catch (error) {
    setFailed(error.message);
  }
}

run();
