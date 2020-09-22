const core = require('@actions/core');
const github = require('@actions/github')



// most @actions toolkit packages have async methods
async function run() {
    const views_per = core.getInput('views_per', {require: false});
    const clones_per = core.getInput('clones_per', {require: false});
    const octokit = new github.getOctokit(process.env.GITHUB_TOKEN);
    const { owner, repo } = github.context.repo;
    try {
        var views = await octokit.repo.getViews({owner:owner,repo:repo,per:views_per});
        console.log(views);
    } catch (error) {
        console.log(error);
    }
    try {
        var clones = await octokit.repo.getViews({owner:owner,repo:repo,per:clones_per});
        console.log(clones);
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
}

run();
