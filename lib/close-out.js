const Git = require('nodegit')
const config = require('./config')
const teams = require('./students-or-teams')
const exec = (cmd) => require('child_process').execSync(cmd,{cwd: '../tmp'})
const sander = require('sander');
const exclude = ['LAB.md', '.git'];

module.exports = (repoName) => {
  Git.Clone(`https://github.com/${config.organization}/${repoName}`, '../tmp')
    .then(hanldleNextBranch)
}

function hanldleNextBranch(repo) {
  if (!teams.length) return;
  var team = teams.shift();

  console.log(exec('git status').toString());
  console.log(exec(`git checkout ${team}`).toString());
  console.log(exec(`mkdir ${team}`).toString());
  return sander.readdir('../tmp')
    .then(files => {return files.filter(file => exclude.concat([team]).indexOf(file) < 0); })
    .then(files => files.map(file => sander.rename('../tmp', file).to('../tmp', team, file)))
    .then(promises => Promise.all(promises))
    .then( () => {
      console.log('welcome to resolve');
      console.log(exec('git add -A').toString());
      console.log(exec(`git commit -m 'moved student work to folder'`).toString());
      console.log(exec(`git checkout master`).toString());
      try {
        console.log(exec(`git merge ${team}`).toString());
      } catch (err) {
        console.log(exec('git add -A').toString());
        console.log(exec(`git commit -m 'merge conflicts'`).toString());
      }
      console.log('closed out');
      hanldleNextBranch(repo);
    })
    .catch(err => {
      console.log('FAIL', err.stdout.toString());
      console.log(err.stderr.toString());
    })
}

/*
shopt -s extglob dotglob
mkdir DonChatelain
 mv ./!(DonChatelain|.git|LAB.md) ./DonChatelain/
 git add .
 git commit -m 'move student work to DonChatelain'
 git checkout master
 git merge DonChatelain
*/
