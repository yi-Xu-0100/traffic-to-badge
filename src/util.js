const core = require('@actions/core');

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

let getTraffic = async function (octokit, owner, repo, views_per = 'day', clones_per = 'day') {
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

module.exports = { getFormatDate, getTraffic };