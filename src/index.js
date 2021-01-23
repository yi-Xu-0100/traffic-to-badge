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
const { LICENSEGenerator, READMEGenerator, SVGGenerator, dataGenerator } = require('./generator');

async function run() {
  try {
    info('[INFO]: Usage https://github.com/yi-Xu-0100/traffic-to-badge#readme');
    startGroup('Get input value');
    const static_list = getInput('static_list')
      .split(`,`)
      .map(item => item.split(`/`).pop());
    info(`[INFO]: static_list: ${static_list}`);
    const traffic_branch = getInput('traffic_branch');
    info(`[INFO]: traffic_branch: ${traffic_branch}`);
    const views_color = getInput('views_color');
    info(`[INFO]: views_color: ${views_color}`);
    const clones_color = getInput('clones_color');
    info(`[INFO]: clones_color: ${clones_color}`);
    const views_week_color = getInput('views_week_color');
    info(`[INFO]: views_week_color: ${views_week_color}`);
    const clones_week_color = getInput('clones_week_color');
    info(`[INFO]: clones_week_color: ${clones_week_color}`);
    const total_views_color = getInput('total_views_color');
    info(`[INFO]: total_views_color: ${total_views_color}`);
    const total_clones_color = getInput('total_clones_color');
    info(`[INFO]: total_clones_color: ${total_clones_color}`);
    const total_views_week_color = getInput('total_views_week_color');
    info(`[INFO]: total_views_week_color: ${total_views_week_color}`);
    const total_clones_week_color = getInput('total_clones_week_color');
    info(`[INFO]: total_clones_week_color: ${total_clones_week_color}`);
    const logo = getInput('logo');
    info(`[INFO]: logo: ${logo}`);
    const year = getInput('year');
    info(`[INFO]: year: ${year}`);
    const traffic_branch_path = `.${traffic_branch}`;
    info(`[INFO]: set output traffic_branch: ${traffic_branch}`);
    setOutput('traffic_branch', traffic_branch);
    info(`[INFO]: set output traffic_path: ${traffic_branch_path}`);
    setOutput('traffic_path', traffic_branch_path);
    endGroup();
    await group('Init traffic data', async () => {
      await initData(traffic_branch, traffic_branch_path);
    });
    var total_traffic_data = { views: { count: 0 }, clones: { count: 0 } };
    var total_latest_week_data = { views: { count: 0 }, clones: { count: 0 } };
    for (let i = 0; i < static_list.length; i++) {
      startGroup(`Set traffic data of ${static_list[i]}`);
      let traffic_data_path = join(traffic_branch_path, `traffic-${static_list[i]}`);
      debug('Start get data');
      let [latest_traffic_data, latest_week_data] = await getData(static_list[i]);
      debug('Start generate data');
      let traffic_data = await combineData(latest_traffic_data, traffic_data_path);
      total_traffic_data.views.count += traffic_data.views.count;
      total_traffic_data.clones.count += traffic_data.clones.count;
      total_latest_week_data.views.count += latest_week_data.views.count;
      total_latest_week_data.clones.count += latest_week_data.clones.count;
      await dataGenerator(traffic_data, traffic_data_path);
      await dataGenerator(latest_week_data, traffic_data_path, true);
      debug('Start generate SVG');
      await SVGGenerator(
        traffic_data,
        traffic_data_path,
        views_color,
        clones_color,
        logo,
        false,
        false
      );
      await SVGGenerator(
        latest_week_data,
        traffic_data_path,
        views_week_color,
        clones_week_color,
        logo,
        true,
        false
      );
      endGroup();
    }
    startGroup(`Generate total traffic data badge SVG`);
    await SVGGenerator(
      total_traffic_data,
      traffic_branch_path,
      total_views_color,
      total_clones_color,
      logo,
      false,
      true
    );
    await SVGGenerator(
      total_latest_week_data,
      traffic_branch_path,
      total_views_week_color,
      total_clones_week_color,
      logo,
      true,
      true
    );
    endGroup();
    startGroup(`Generate LICENSE and README.md`);
    await LICENSEGenerator(traffic_branch_path, year);
    await READMEGenerator(traffic_branch_path, static_list);
    endGroup();
    info('[INFO]: Action successfully completed');
  } catch (error) {
    setFailed(error.message);
  }
}

run();
