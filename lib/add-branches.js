const GitHub = require('github-api');
// const token = process.env.GITHUB_TOKEN;
// const organization = process.env.GITHUB_ORGANIZATION;
const students = require( './students-or-teams' );

module.exports = function addBranches( repoName, configs ) {
	console.log('add branches');
	const gh = new GitHub({token: configs.github_token});
	const repo = gh.getRepo( configs.github_org, repoName );
	return Promise.all(
		students.map( s => {
			return repo.createBranch( 'master', s );
		})
	);
}
