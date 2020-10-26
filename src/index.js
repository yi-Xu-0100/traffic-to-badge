const {
  startGroup,
  endGroup,
  info,
  setFailed,
  getInput,
  group,
  setOutput,
  debug
} = require('@actions/core');
const { join } = require('path');
const { initData, getData, combineData } = require('./traffic');
const { SVGGenerator, dataGenerator } = require('./generator');

async function run() {
  try {
    info('[INFO]: Usage https://github.com/yi-Xu-0100/traffic-to-badge#readme');
    startGroup('Get input value');
    var static_list = getInput('static_list', { require: false }).split(`,`);
    static_list = static_list.map(item => item.split(`/`).pop());
    info(`[INFO]: static_list: ${static_list}`);
    const traffic_branch = getInput('traffic_branch', { require: false });
    info(`[INFO]: traffic_branch: ${traffic_branch}`);
    const views_color = getInput('views_color', { require: false });
    info(`[INFO]: views_color: ${views_color}`);
    const clones_color = getInput('clones_color', { require: false });
    info(`[INFO]: clones_color: ${clones_color}`);
    const logo = getInput('logo', { require: false });
    info(`[INFO]: logo: ${logo}`);
    const traffic_branch_path = `.${traffic_branch}`;
    info(`[INFO]: set output traffic_branch: ${traffic_branch}`);
    setOutput('traffic_branch', traffic_branch);
    info(`[INFO]: set output traffic_path: ${traffic_branch_path}`);
    setOutput('traffic_path', traffic_branch_path);
    endGroup();
    await group('Init traffic data', async () => {
      await initData(traffic_branch, traffic_branch_path);
    });
    for (let i = 0; i < static_list.length; i++) {
      startGroup(`Set traffic data of ${static_list[i]}`);
      let traffic_data_path = join(traffic_branch_path, `traffic-${static_list[i]}`);
      debug('Start get data');
      let latest_traffic_data = await getData(static_list[i]);
      debug('Start generate data');
      let traffic_data = await combineData(latest_traffic_data, traffic_data_path);
      await dataGenerator(traffic_data, traffic_data_path);
      if (process.env['local_debug'] != 'true') {
        debug('Start generate SVG');
        await SVGGenerator(traffic_data, traffic_data_path, views_color, clones_color, logo);
      }
      endGroup();
    }
    info('[INFO]: Action successfully completed');
  } catch (error) {
    setFailed(error.message);
  }
}

run();
