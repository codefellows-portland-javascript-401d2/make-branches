// const config = require( './config' );
const _request = require( 'request' );
const travisUrl = 'https://api.travis-ci.org';
const options = {};

var ciToken;

/*
var request = require("request");

var options = { method: 'POST',
  url: 'https://api.github.com/repos/codefellows-portland-javascript-401d2/test-repository/hooks',
  headers:
     'content-type': 'application/json',
     authorization: 'token 663b685800f34a2c12bc9a94c60f4ed9684e8d7e' }, //github token
  body:
   { name: 'travis',
     active: true,
     events: [ 'issue_comment', 'member', 'public', 'pull_request', 'push' ],
     config:
      { domain: 'notify.travis-ci.org',
        token: 'HqmixZywXVmxDHzPk6sw', //travis token
        user: 'martypdx' } },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
*/


function request( options ) {
	options.url = travisUrl + options.url;
	options.json = true;
	if ( ciToken ) {
		options.headers = options.headers || {};
		options.headers.Authorization = `token ${ciToken}`;
	}

	return new Promise( ( resolve, reject ) => {
		_request( options, ( error, response, body ) => {
			if (error) return reject( error );
			resolve( body );
		});
	});
}

module.exports = function setupHooks( repoName, configs ) {
	console.log('set up hooks');
	console.log(configs);
	console.log( `/repos/${configs.github_org}/${repoName}` );
	return request({
		method: 'POST',
		url: '/auth/github',
		headers: {
			'content-type': 'application/json',
			'user-agent': 'Travis/1.6.8',
			'accept': 'application/vnd.travis-ci.2+json'
		},
		body: { github_token: configs.github_token }
	})
	.then( body => ciToken = body.access_token )
	.then( () => request({
		method: 'POST',
		url: `/users/sync`
	}))
	.then( () => request({
		method: 'GET',
		url: `/repos/${configs.github_org}/${repoName}`
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
	}));
}
