'use strict';
const program = require('commander')
const addBranches = require('./lib/add-branches')
const hooks = require('./lib/ci-hooks')
const close = require('./lib/close-out')
const config = require( './lib/config' )
const sander = require('sander');
const chalk = require('chalk');

program
  .command('config [github_org] [github_token] [travis_token]')
  .description('configure github_org github_token travis_token')
  .action((github_org, github_token, travis_token) => {
    if (!(github_org && github_token && travis_token)) return alertErr('plz specify github_org github_token travis_token')
    let configJson = JSON.stringify({github_org, github_token, travis_token})
    sander.exists(__dirname, 'config.json')
      .then(exists => {
        if (exists) return sander.unlink(__dirname, 'config.json');
      })
      .then(() => {
        sander.writeFile(__dirname, 'config.json', configJson).then(alert('config complete'))
      })
  })

program
  .command('setup [repoName]')
  .description('create branches for each team')
  .action((repoName, options) => {
    if (!repoName) return alertErr('plz specify repo name');
    addBranches( repoName )
    	.then( () => alert( 'branches created' ) )
    	.then( () => hooks( repoName ) )
    	.then( () => alert( 'hooks complete' ) )
    	.catch( err => alertErr( 'FAIL', err.message ) );
  })

program
  .command('close [repoName]')
  .description('merge student branches into master folders')
  .action((repoName, options) => {
    if (!repoName) return alertErr('plz specify repo name');
    close(repoName);
  })

program.parse(process.argv)

function alert(msg) {console.log(chalk.green('[*]', msg))}
function alertErr(msg) {console.log(chalk.red('[x]', msg))}
