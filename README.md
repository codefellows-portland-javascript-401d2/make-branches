![CF](http://i.imgur.com/7v5ASc8.png) Make Branches
===

Quickly add a list of students as branches to a repo. 

Modify `students-or-teams.js` to the list of student or team
branches you want to create.

Use like:

```sh
> node . ../assignment-repo
```

blacklist master on travis

shopt -s extglob dotglob
mkdir DonChatelain
mv ./!(DonChatelain|.git|LAB.md) ./DonChatelain/
git add .
git commit -m 'move student work to DonChatelain'
git checkout master
git merge DonChatelain
