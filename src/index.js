const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const util = require('./util');

const src = path.join(__dirname,'..');

async function run() {
    const views_per = core.getInput('views_per', {require: false});
    const clones_per = core.getInput('clones_per', {require: false});
    const my_token = core.getInput('my_token', {require: false});
    var traffic_data_path = path.join(src, `traffic`);

    if (!(await util.initTafficDate(my_token, traffic_data_path))) core.setFailed("Init traffic data fail!");

    var traffic_data = await util.getTraffic(my_token, views_per, clones_per);

    var traffic_clones = path.join(traffic_data_path, `traffic_clones_${util.getFormatDate()}.json`);
    fs.writeFile(traffic_clones, traffic_data.clones, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('文件创建成功，地址：' + traffic_clones);
    });
}

run();
