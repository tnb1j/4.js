import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { createServer } from '../../utils/server.js';

function listen( server, port = 0 ) {

	return new Promise( ( resolve, reject ) => {

		server.once( 'error', reject );
		server.listen( port, () => {

			server.off( 'error', reject );
			resolve( server.address().port );

		} );

	} );

}

function closeServer( server ) {

	return new Promise( resolve => {

		if ( server.listening ) {

			server.close( resolve );

		} else {

			resolve();

		}

	} );

}

async function reserveConsecutivePorts() {

	for ( let attempt = 0; attempt < 50; attempt ++ ) {

		const basePort = 20000 + Math.floor( Math.random() * 20000 );
		const blockers = [ net.createServer(), net.createServer() ];
		const probe = net.createServer();

		try {

			await listen( blockers[ 0 ], basePort );
			await listen( blockers[ 1 ], basePort + 1 );
			await listen( probe, basePort + 2 );
			await closeServer( probe );

			return { basePort, blockers };

		} catch ( error ) {

			await Promise.all( [ ...blockers, probe ].map( closeServer ) );

		}

	}

	throw new Error( 'Unable to reserve consecutive ports for the server fallback test.' );

}

async function testRequestValidation() {

	const server = createServer();
	const port = await listen( server );

	try {

		const traversal = await fetch( `http://127.0.0.1:${port}/..%2Foutside.txt` );
		const malformed = await fetch( `http://127.0.0.1:${port}/%E0%A4%A` );

		assert.equal( traversal.status, 403 );
		assert.equal( malformed.status, 400 );

	} finally {

		await closeServer( server );

	}

}

async function testPortFallback() {

	const { basePort, blockers } = await reserveConsecutivePorts();
	const expectedPort = basePort + 2;
	const child = spawn( process.execPath, [ 'utils/server.js', '-p', String( basePort ) ], {
		cwd: process.cwd(),
		stdio: [ 'ignore', 'pipe', 'pipe' ]
	} );

	let output = '';
	const capture = chunk => {

		output += chunk.toString();

	};

	child.stdout.on( 'data', capture );
	child.stderr.on( 'data', capture );

	try {

		await new Promise( ( resolve, reject ) => {

			const timeout = setTimeout( () => reject( new Error( `Server fallback timed out.\n${output}` ) ), 10000 );

			const checkOutput = () => {

				if ( output.includes( `localhost:${expectedPort}` ) ) {

					clearTimeout( timeout );
					resolve();

				}

			};

			child.stdout.on( 'data', checkOutput );
			child.stderr.on( 'data', checkOutput );
			child.once( 'exit', code => {

				clearTimeout( timeout );
				reject( new Error( `Server exited with code ${code}.\n${output}` ) );

			} );

		} );

		const response = await fetch( `http://127.0.0.1:${expectedPort}/package.json` );
		assert.equal( response.status, 200 );

	} finally {

		if ( child.exitCode === null ) child.kill( 'SIGINT' );

		if ( child.exitCode === null ) {

			const exited = await Promise.race( [
				new Promise( resolve => child.once( 'exit', () => resolve( true ) ) ),
				new Promise( resolve => setTimeout( () => resolve( false ), 5000 ) )
			] );

			if ( exited === false && child.exitCode === null ) child.kill( 'SIGKILL' );

		}

		await Promise.all( blockers.map( closeServer ) );

	}

}

await testRequestValidation();
await testPortFallback();

console.log( 'Server integration tests passed.' );
