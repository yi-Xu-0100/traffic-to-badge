const core = require('@actions/core');
const github = require('@actions/github')



// most @actions toolkit packages have async methods
async function run() {
    const views_per = core.getInput('views_per', {require: false});
    const clones_per = core.getInput('clones_per', {require: false});
    const my_token = core.getInput('my_token', {require: false});
    const octokit = new github.getOctokit(my_token);
    const { owner, repo } = github.context.repo;
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
}

run();
