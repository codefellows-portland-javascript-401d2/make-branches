const GitHub = require('github-api');
const token = process.env.GITHUB_TOKEN;
const organization = process.env.GITHUB_ORGANIZATION;
const students = require( './students-or-teams' );

module.exports = function addBranches( repoName ) {
	const gh = new GitHub({ token });
	const repo = gh.getRepo( organization, repoName );

	return Promise.all(
		students.map( s => {
			return repo.createBranch( 'master', s ); 
		})
	);
}