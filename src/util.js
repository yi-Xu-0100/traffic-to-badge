const core = require('@actions/core');
const cp = require('child_process');
const github = require('@actions/github');
const fs = require('fs');

const { owner, repo } = github.context.repo;
const clone_url = github.context.payload.repository.clone_url;

let getFormatDate = function () {
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

let getTraffic = async function (my_token, views_per = 'day', clones_per = 'day') {
    const octokit = new github.getOctokit(my_token);
    try {
        var views = await octokit.repos.getViews({ owner: owner, repo: repo, per: views_per });
        console.log(JSON.stringify(views.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    try {
        var clones = await octokit.repos.getClones({ owner: owner, repo: repo, per: clones_per });
        console.log(JSON.stringify(clones.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    try {
        var paths = await octokit.repos.getTopPaths({ owner: owner, repo: repo });
        console.log(JSON.stringify(paths.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    try {
        var referrers = await octokit.repos.getTopReferrers({ owner: owner, repo: repo });
        console.log(JSON.stringify(referrers.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    return { views: views.data, clones: clones.data, paths: paths.data, referrers: referrers.data }
}

let initTafficDate = async function (my_token, traffic_data_path) {
    const octokit = new github.getOctokit(my_token);
    try {
        await octokit.repos.getBranch({
            owner: owner,
            repo: repo,
            branch: 'traffic',
        });
        return true;
    } catch (error) {
        if (error.message === 'Branch not found') {
            if (!(fs.statSync(traffic_data_path).isDirectory())) {
                fs.unlinkSync(traffic_data_path);
                fs.mkdirSync(traffic_data_path);
            } else {
                console.log('error: ' + error);
                core.setFailed(error.message)
            }
        }

        cp.execSync(`git clone ${clone_url} ${traffic_data_path} -b traffic`, function (error, stdout, stderr) {
            if (error) {
                console.error('error: ' + error);
                console.error('traffic_data_path' + traffic_data_path);
                return false;
            }
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + typeof stderr);
        });
        console.log(`Init traffic data into ${traffic_data_path}.`);
        return false;
    }
}

let getClonesDate = async function (traffic_data, traffic_clones) {
    try {
        var ClonesDate = JSON.parse(fs.readFileSync(traffic_clones, 'utf8').data);
        var count = ClonesDate.count;
        var uniques = ClonesDate.uniques;
        var clones = ClonesDate.clones;
    } catch (error) {
        if(error.code === 'ENOENT'){
            console.log(error);
            clones=[];
            count = '0';
            uniques = '0';
        } else {
            throw error;
        }
    } finally {
        console.log("clones: " + clones);
        console.log("uniques: " + uniques);
        console.log("count: " + count);
    }
    if(clones === undefined) clones=[];
    var traffic_data_latest = traffic_data.clones.clones.filter((item) => {
        return !(clones.findIndex(a => { return a.timestamp === item.timestamp; }) != -1 )
    })
    if (count == undefined) count = '0';
    count = count + traffic_data_latest.reduce((a,b)=>{a.count + b.count}, '0');
    if (uniques == undefined) uniques = '0';
    uniques = uniques + traffic_data_latest.reduce((a,b)=>{a.uniques + b.uniques}, '0');
    clones = Object.assign(clones, traffic_data_latest);
    traffic_data = Object.assign({'count': count}, {'uniques': uniques}, {'clones':clones});
    return traffic_data;
}


module.exports = { getFormatDate, getTraffic, initTafficDate, getClonesDate };