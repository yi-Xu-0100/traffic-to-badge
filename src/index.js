const core = require('@actions/core');
const github = require('@actions/github')
const fs = require('fs');
const path = require('path');
const util = require('./util');

const src = path.join(__dirname,'..');

async function run() {
    const views_per = core.getInput('views_per', {require: false});
    const clones_per = core.getInput('clones_per', {require: false});
    const my_token = core.getInput('my_token', {require: false});
    const octokit = new github.getOctokit(my_token);
    const { owner, repo } = github.context.repo;
    console.log(github.context.payload.repository.clone_url);
    var traffic_action_path = path.join(src, `src`);
    var traffic_data = await util.getTraffic(octokit, owner, repo, views_per, clones_per);

    var traffic_action = path.join(traffic_action_path, `traffic_clones_${util.getFormatDate()}.json`);
    fs.writeFile(traffic_action, traffic_data.clones, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('文件创建成功，地址：' + traffic_action);
    });
}

run();
