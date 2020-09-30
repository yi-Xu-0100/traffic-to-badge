const core = require('@actions/core');
const path = require('path');
const util = require('./util');

const src = path.join(__dirname,'..');

async function run() {
    const views_per = core.getInput('views_per', {require: false});
    const clones_per = core.getInput('clones_per', {require: false});
    const my_token = core.getInput('my_token', {require: true});
    const static_list = core.getInput('static_list', {require: true}).split(',');
    const traffic_branch = core.getInput('traffic_branch', {require: false});
    const traffic_branch_path = path.join(src, traffic_branch);
    for (let i=1; i<static_list.length; i++) {
        let traffic_data_path = path.join(traffic_branch_path, `traffic-${static_list[i]}`);
        if (!(await util.initTafficData(my_token, traffic_branch, traffic_branch_path))){
            core.setFailed(`Init traffic data into ${traffic_branch_path} fail!`);
        }
        let latest_traffic_data = await util.getTraffic(my_token, static_list[i], views_per, clones_per);
        let traffic_data = await util.combineTrafficData(latest_traffic_data, traffic_data_path);
        await util.saveTrafficData(traffic_data, traffic_data_path);
        await util.downloadSVG(traffic_data,traffic_data_path);
    }
}

try{
    run();
} catch(error){
    console.error();
    core.setFailed(error);
}
