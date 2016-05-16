const students = require( './students-or-teams' );

const Git = require( 'nodegit' );
const pathToRepo = require( 'path' ).resolve( process.argv[2] || '.' );
process.chdir( pathToRepo );
const execSync = require('child_process').execSync;

var repo, remote;

Git.Repository.open(pathToRepo)
	.then( _repo => repo = _repo )
	.then( repo => repo.getRemote( 'origin' ) )
	.then( _remote => remote = _remote )
	.then( () => repo.getHeadCommit() )
	.then( commit => {
		return Promise.all( students.map( student => repo.createBranch(
			student,
			commit,
			false,
			repo.defaultSignature(),
			`Created ${student} on HEAD`)	
		))
	})
	
	/* not currently woking with nodegit :( */
	// .then( branch => {
	// 	console.log( branch.toString(), repo.defaultSignature() )
	// 	return remote.push( [ branch.toString() ], new Git.PushOptions() ) 
	// })
	// .then( number => console.log( 'push completed with', number ) )
	
	/* so let's just shell out */
	.then( branches => {
		return students.map( student => {
			return execSync( `git push -u origin ${student}`, { encoding: 'utf-8' } ); 
		})
	})
	.then( results => results.forEach( r => console.log( r ) ) )
	.catch( err => console.log( err ) );