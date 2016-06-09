const Git = require('nodegit')
// const config = require('./config')
const teams = require(__dirname+'/students-or-teams')
const exec = (cmd, cwd) => require('child_process').execSync(cmd,{cwd: cwd || '../tmp'})
const execP = (cmd, cwd) => console.log(require('child_process').execSync(cmd,{cwd: cwd || '../tmp'}).toString());
const sander = require('sander');
const exclude = ['LAB.md', '.git'];

module.exports = (repoName, configs) => {
  Git.Clone(`https://github.com/${configs.github_org}/${repoName}`, '../tmp')
    .then(hanldleNextBranch)
}

function hanldleNextBranch(repo) {
  if (!teams.length) return travisAndPush();
  var team = teams.shift();

  execP('git status')
  execP(`git checkout ${team}`)
  execP('git status')
  return sander.readdir('../tmp')
    .then(files => {console.log(files); return files.filter(file => exclude.concat([team]).indexOf(file) < 0); })
    .then(files => files.length ? files: Promise.reject('no files'))
    .then(files => files.map(file => sander.rename('../tmp', file).to('../tmp', team, file)))
    .then(promises => Promise.all(promises))
    .then( () => {
      console.log('welcome to resolve');
      execP(`mkdir -p ${team}`)
      execP('git add -A')
      execP(`git commit -m 'moved student work to folder'`)
      execP(`git checkout master`)
      try {
        execP(`git merge ${team}`)
      } catch (err) {
        execP('git add -A')
        execP(`git commit -m 'merge conflicts'`)
      }
      console.log('closed out');
      hanldleNextBranch(repo);
    })
    .catch(err => {
      if (err === 'no files') {
        console.log(`WARNING: no files for ${team}`)
        execP(`git checkout master`)
        hanldleNextBranch(repo);
      } else console.log('FAIL', err);
    })
}

function travisAndPush() {
  execP('cp ./.travis.yml ../tmp', '.')
  execP('git add -A')
  execP(`git commit -m 'moved student work from branches to team folders'`)
  execP('git push origin master')
}
