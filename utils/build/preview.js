import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const rootDir = path.resolve( __dirname, '../..' );
const require = createRequire( import.meta.url );
const rollupPath = require.resolve( 'rollup/dist/bin/rollup' );

// Start rollup in watch mode
const rollup = spawn( process.execPath, [
	rollupPath,
	'-c', 'utils/build/rollup.config.js',
	'-w',
	'-m', 'inline'
], {
	cwd: rootDir,
	stdio: [ 'ignore', 'pipe', 'pipe' ],
	shell: false
} );

// Start server
const server = spawn( process.execPath, [ 'utils/server.js', '-p', '8080' ], {
	cwd: rootDir,
	stdio: [ 'ignore', 'pipe', 'pipe' ],
	shell: false
} );

// Prefix output
const prefix = ( name, color ) => {

	return ( data ) => {

		const lines = data.toString().split( '\n' ).filter( l => l.trim() );
		for ( const line of lines ) {

			console.log( `${color}[${name}]\x1b[0m ${line}` );

		}

	};

};

rollup.stdout.on( 'data', prefix( 'ROLLUP', '\x1b[44m\x1b[1m' ) );
rollup.stderr.on( 'data', prefix( 'ROLLUP', '\x1b[44m\x1b[1m' ) );
server.stdout.on( 'data', prefix( 'HTTP', '\x1b[42m\x1b[1m' ) );
server.stderr.on( 'data', prefix( 'HTTP', '\x1b[42m\x1b[1m' ) );

// Handle cleanup
let closing = false;

const stopChild = child => new Promise( resolve => {

	if ( child.exitCode !== null || child.signalCode !== null ) {

		resolve();
		return;

	}

	child.once( 'close', resolve );

	if ( child.kill() === false ) resolve();

} );

const cleanup = async ( exitCode = 0 ) => {

	if ( closing ) return;
	closing = true;

	await Promise.all( [
		stopChild( rollup ),
		stopChild( server )
	] );

	process.exitCode = exitCode;

};

const fail = ( name, error ) => {

	console.error( `[${name}] ${error.stack || error.message || String( error )}` );
	void cleanup( 1 );

};

process.on( 'SIGINT', () => void cleanup() );
process.on( 'SIGTERM', () => void cleanup() );

rollup.on( 'error', error => fail( 'ROLLUP', error ) );
server.on( 'error', error => fail( 'HTTP', error ) );

rollup.on( 'close', code => {

	if ( closing === false ) void cleanup( code ?? 1 );

} );

server.on( 'close', code => {

	if ( closing === false ) void cleanup( code ?? 1 );

} );
