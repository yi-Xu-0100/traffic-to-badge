const core = require('@actions/core');
const github = require('@actions/github')



// most @actions toolkit packages have async methods
async function run() {
  try {
    const views_per = core.getInput('views', {require: true});
    const octokit = new github.getOctokit(process.env.GITHUB_TOKEN);
    const { owner, repo } = github.context.repo
    const views = octokit.repo.getViews({owner:owner,repo:repo,per:views_per})
    console.log(views)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
