const program = require('commander')
const addBranches = require('./lib/add-branches')
const hooks = require('./lib/ci-hooks')
const close = require('./lib/close-out')
const config = require( './lib/config' )

program
  .command('config [githubOrg] [githubToken] [travisToken]')
  .action((githubOrg, githubToken, travisToken) => {

  })

program
  .command('setup [repoName]')
  .action((repoName, options) => {
    addBranches( repoName )
    	.then( () => console.log( 'branches created' ) )
    	.then( () => hooks( repoName ) )
    	.then( () => console.log( 'hooks complete' ) )
    	.catch( err => console.log( 'FAIL', err.message ) );
  })

program
  .command('close [repoName]')
  .action((repoName, options) => {
    close(repoName);
  })

program.parse(process.argv)
