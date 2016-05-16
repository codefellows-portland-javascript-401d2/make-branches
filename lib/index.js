// const GitHub = require('github-api');
const token = process.env.TOKEN;
const organization = process.env.ORGANIZATION;
// const students = require( 'students-or-teams' );

// const gh = new GitHub({ token });

const repoName = process.argv[2] || 'test-repository';
// const repo = gh.getRepo( organization, repoName );

var _request = require( 'request' );

function request( options ) {
	return new Promise( ( resolve, reject ) => {
		_request(options, function (error, response, body) {
			if (error) return reject( error );
			resolve( body );
		});
	});
}
const travis = 'https://api.travis-ci.org';

var ciToken;
request({ 
		method: 'POST',
		url: `${travis}/auth/github`,
		headers: { 
			'content-type': 'application/json',
			'user-agent': 'Travis/1.6.8',
			accept: 'application/vnd.travis-ci.2+json' 
		},
		body: { github_token: token },
		json: true 
	})
	.then( body => ciToken = body.access_token )
	.then( () => {
		return request({ 
			method: 'GET',
			url: `${travis}/repos/${organization}/${repoName}`,
			headers: { 
				'Authorization': `token ${ciToken}`
			},
			json: true 
		})
	})
	.then( ciRepo => ciRepo.id )
	.then( repoId => {
		return request({ 
			method: 'PUT',
			url: `${travis}/hooks`,
			headers: { 
				'Authorization': `token ${ciToken}`
			},
			body: { 
				hook: {
					id: repoId,
					active: true 
				}
			},
			json: true 
		})
	})
	.then( result => console.log( 'done', result ) )
	.catch( err => console.log( err) );


// Promise.all(
// 	students.map( s => repo.createBranch( 'master', s ) )
// )
// .then( () => console.log( 'branches created' ) )
// .catch( err => console.log( err ) );

// const payload = {
//     "name": "travis",
//     "active": true,
//     "events": [
//       "issue_comment",
//       "member",
//       "public",
//       "pull_request",
//       "push"
//     ],
//     "config": {
//       "domain": "notify.travis-ci.org",
//       "token": "HqmixZywXVmxDHzPk6sw",
//       "user": "martypdx"
//     }
// };