const core = require('@actions/core');
const github = require('@actions/github')
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const src = path.join(__dirname,'..');

async function run() {
    const views_per = core.getInput('views_per', {require: false});
    const clones_per = core.getInput('clones_per', {require: false});
    const my_token = core.getInput('my_token', {require: false});
    const octokit = new github.getOctokit(my_token);
    const { owner, repo } = github.context.repo;
    console.log(github.context.payload.repository.clone_url);
    var traffic_action_path = path.join(src, `src`);
    
    fs.mkdir('traffic_action_path',function(error){
        if(error){
            console.log(error);
            return false;
        }
        console.log('创建目录成功');
    })
    try {
        var views = await octokit.repos.getViews({owner:owner,repo:repo,per:views_per});
        console.log(JSON.stringify(views.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    try {
        var clones = await octokit.repos.getClones({owner:owner,repo:repo,per:clones_per});
        console.log(JSON.stringify(clones.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    try {
        var paths = await octokit.repos.getTopPaths({owner:owner,repo:repo});
        console.log(JSON.stringify(paths.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    try {
        var referrers = await octokit.repos.getTopReferrers({owner:owner,repo:repo});
        console.log(JSON.stringify(referrers.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    
    exec(`git clone ${github.context.payload.repository.clone_url} ${traffic_action_path}`, function(error, stdout, stderr){
        if(error) {
            console.error('error: ' + error);
            return;
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + typeof stderr);
    });

    var traffic_action = path.join(traffic_action_path, `traffic_clones_${getFormatDate()}.json`);
    fs.writeFile(traffic_action, JSON.stringify(clones.data), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('文件创建成功，地址：' + traffic_action);
    });
}

function getFormatDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (strDate < 10) {
        strDate = "0" + strDate;
    }
    var currentDate = date.getFullYear() + "-" + month + "-" + strDate;
    return currentDate;
}

run();
