const Git = require('nodegit')
const config = require('./config')
const teams = require('./students-or-teams')
const exec = require('sync-exec')

module.exports = (repoName) => {
  Git.Clone(`https://github.com/${config.organization}/${repoName}`, './tmp')
    .then(repo => {
      teams.forEach(team => {
        exec(`git checkout ${team}`)
        exec(`shopt -s extglob dotglob`)
        exec(`mkdir ${team}`)
        exec(`mv ./!(${team}|.git|LAB.md) ./${team}/`)
        exec(`git add .`)
        exec(`git commit -m 'move student work to ${team}'`)
        exec(`git checkout master`)
        exec(`git merge ${team}`)
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
