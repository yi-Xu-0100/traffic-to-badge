const core = require('@actions/core');
const cp = require('child_process');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');
const download = require('image-downloader');
const _ = require('underscore');
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

let getTraffic = async function (my_token, traffic_repo, views_per = 'day', clones_per = 'day') {
    const octokit = new github.getOctokit(my_token);
    try {
        var views = await octokit.repos.getViews({ owner: owner, repo: traffic_repo, per: views_per });
        console.log(JSON.stringify(views.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    try {
        var clones = await octokit.repos.getClones({ owner: owner, repo: traffic_repo, per: clones_per });
        console.log(JSON.stringify(clones.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    try {
        var paths = await octokit.repos.getTopPaths({ owner: owner, repo: traffic_repo });
        console.log(JSON.stringify(paths.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    try {
        var referrers = await octokit.repos.getTopReferrers({ owner: owner, repo: traffic_repo });
        console.log(JSON.stringify(referrers.data));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
    return { views: views.data, clones: clones.data, paths: paths.data, referrers: referrers.data }
}

let initTafficData = async function (my_token, traffic_branch, traffic_branch_path) {
    const octokit = new github.getOctokit(my_token);
    try {
        await octokit.repos.getBranch({
            owner: owner,
            repo: repo,
            branch: traffic_branch,
        });
    } catch (error) {
        if (error.message === 'Branch not found') {
            if (!(fs.existsSync(traffic_branch_path))) {
                fs.mkdirSync(traffic_branch_path);
            } else {
                core.setFailed(`${traffic_branch_path} already exists!`);
                return false;
            }
        }

    }
    cp.execSync(`git clone ${clone_url} ${traffic_branch_path} -b ${traffic_branch}`,
        function (error, stdout, stderr) {
            if (error) {
                console.log('traffic_branch_path' + traffic_branch_path);
                console.error('error: ' + error);
                return false;
            }
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + typeof stderr);
        });
    cp.execSync(`rm -rf ${path.join(traffic_branch, '.git')}`,
        function (error, stdout, stderr) {
            if (error) {
                console.error('error: ' + error);
                return false;
            }
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + typeof stderr);
        });
    return true;
}

let combineTrafficData = async function (traffic_data, traffic_data_path) {
    if (!(fs.existsSync(traffic_data_path))) {
        fs.mkdirSync(traffic_data_path);
    }
    var traffic_views_path = path.join(traffic_data_path, 'traffic_views.json');
    var traffic_clones_path = path.join(traffic_data_path, 'traffic_clones.json');
    function combineTypesData(data, data_path, data_type) {
        try {
            var origin_data = JSON.parse(fs.readFileSync(data_path, 'utf8'));
            var days_data = _.union(origin_data[data_type], data[data_type])
                .reduce((a, b) => _.extend(a, b), {});
            var count = days_data.map(el => parseInt(el.count)).reduce((a, b) => a + b, 0);
            var uniques = days_data.map(el => parseInt(el.uniques)).reduce((a, b) => a + b, 0);
            data = _.extend({ 'count': count }, { 'uniques': uniques }, { [`${data_type}`]: days_data });
            console.log(`${data_type}: ${JSON.stringify(data)}`);
            return data;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`Not Found ${error.path}`)
                console.log(`${data_type}: ${JSON.stringify(data)}`);
                return data;
            } else {
                console.error(error);
            }
        }
    }
    traffic_data.views = combineTypesData(traffic_data.views, traffic_views_path, 'views');
    traffic_data.clones = combineTypesData(traffic_data.clones, traffic_clones_path, 'clones');
    return traffic_data;
}

let saveTrafficData = async function (traffic_data, traffic_data_path) {
    var traffic_views_path = path.join(traffic_data_path, `traffic_views.json`);
    var traffic_clones_path = path.join(traffic_data_path, `traffic_clones.json`);
    var traffic_paths_path = path.join(traffic_data_path, `traffic_paths.json`);
    var traffic_referrers_path = path.join(traffic_data_path, `traffic_referrers.json`);
    function saveData(data, data_path) {
        fs.writeFile(data_path, JSON.stringify(data), function (error) {
            if (error) {
                console.error(JSON.stringify(data));
                console.error(error);
            }
            console.log(`文件保存成功，地址： ${data_path}`);
        });
    }

    try {
        saveData(traffic_data.views, traffic_views_path);
        saveData(traffic_data.clones, traffic_clones_path);
        saveData(traffic_data.paths, traffic_paths_path);
        saveData(traffic_data.referrers, traffic_referrers_path);
        return true;
    } catch (error) {
        console.error("Save data fail!");
    }
}

let downloadSVG = async function (traffic_data, traffic_data_path) {
    function downbadge(name, count) {
        var options = {
            url: `https://img.shields.io/badge/${name}-${count}-brightgreen`,
            dest: `${traffic_data_path}/${name}.svg`
        }
        download.image(options)
            .then(({ filename }) => {
                console.log('Saved to', filename)
            })
            .catch((err) => console.error(err))
    }
    downbadge("views", traffic_data.views.count);
    downbadge("clones", traffic_data.clones.count);
}
module.exports = { getFormatDate, getTraffic, initTafficData, combineTrafficData, saveTrafficData, downloadSVG };