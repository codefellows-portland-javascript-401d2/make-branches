const Git = require('nodegit')
const config = require('./config')
const teams = require('./students-or-teams')
const exec = cmd => require('child_process').execSync(cmd, {cwd: './tmp'})
const sander = require('sander');
const exclude = ['LAB.md', '.git'];

module.exports = (repoName) => {
  Git.Clone(`https://github.com/${config.organization}/${repoName}`, './tmp')
    .then(repo => {
      teams.forEach(team => {
        exec(`git checkout ${team}`)
        exec(`mkdir ${team}`)
        // exec('shopt -s extglob dotglob');
        sander.readDir('./tmp')
          .then(files => files.filter(file => exclude.concat([team]).indexOf(file) < 0))
          .then(files => sander.rename(...files).to(...files.map(f => `./${team}/${f}`)))
          .then( () => {
            exec(`git add .`)
            exec(`git commit -m 'move student work to ${team}'`)
            exec(`git checkout master`)
            exec(`git merge ${team}`)
            console.log('closed out');
          })
      })
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
