const core = require('@actions/core');
const cp = require('child_process');
const github = require('@actions/github');

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

let initTafficDate = async function (traffic_data_path) {
    const octokit = new github.getOctokit();
    try {
        await octokit.repos.getBranch({
            owner: owner,
            repo: repo,
            branch: 'traffic',
        });
    } catch (error) {
        if (error.message === 'Branch not found') {
            cp.execFileSync(`mkdir ${traffic_data_path}`, function (error, stdout, stderr) {
                if (error) {
                    console.error('error: ' + error);
                    return false;
                }
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + typeof stderr);
            });
        } else {
            core.setFailed(error.message)
        }
    }
    cp.execFileSync(`git clone ${clone_url} ${traffic_data_path} -b traffic`, function (error, stdout, stderr) {
        if (error) {
            console.error('error: ' + error);
            return false;
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + typeof stderr);
    });
    console.log(`Init traffic data into ${traffic_data_path}.`);
    return true;
}

module.exports = { getFormatDate, getTraffic, initTafficDate };