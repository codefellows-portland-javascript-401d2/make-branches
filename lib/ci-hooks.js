const config = require( '.config' );
const _request = require( 'request' );
const travisUrl = 'https://api.travis-ci.org';

var ciToken;

function request( options ) {
	options.url = travisUrl + options.url;
	options.json = true;
	if ( ciToken ) {
		options.headers.Authorization = `token ${ciToken}`;
	}
	
	return new Promise( ( resolve, reject ) => {
		_request(options, ( error, response, body ) => {
			if (error) return reject( error );
			resolve( body );
		});
	});
}

function setup( repoName ) {
	return request({ 
		method: 'POST',
		url: '/auth/github',
		headers: { 
			'content-type': 'application/json',
			'user-agent': 'Travis/1.6.8',
			'accept': 'application/vnd.travis-ci.2+json' 
		},
		body: { github_token: config.github_token }
	})
	.then( body => ciToken = body.access_token )
	.then( () => request({ 
		method: 'GET',
		url: `/repos/${organization}/${repoName}`
	}))
	.then( ciRepo => ciRepo.id )
	.then( repoId => request({ 
		method: 'PUT',
		url: '/hooks',
		body: { 
			hook: {
				id: repoId,
				active: true 
			}
		} 
	}))
	.then( result => console.log( 'done', result ) );
}




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