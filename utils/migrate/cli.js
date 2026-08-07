#!/usr/bin/env node

import { lstat, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { transformSource } from './transforms.js';

const TEXT_EXTENSIONS = new Set( [
	'.cjs',
	'.css',
	'.html',
	'.js',
	'.json',
	'.jsx',
	'.md',
	'.mjs',
	'.ts',
	'.tsx',
	'.txt',
	'.yaml',
	'.yml'
] );

const IGNORED_DIRECTORIES = new Set( [
	'.git',
	'build',
	'dist',
	'node_modules'
] );

function printUsage() {

	console.log( `Usage: four-migrate [options] [path ...]

Options:
  --write             Apply changes. Without this flag, runs as a dry-run.
  --check             Exit with code 1 when migrations are needed.
  --no-build-files    Keep legacy three.* build filenames.
  --no-namespace      Keep the THREE namespace binding.
  --no-package        Keep three package specifiers.
  --json              Print a machine-readable result.
  --quiet             Omit per-file output.
  --version           Print the installed 4.js version.
  --help              Show this help.

Examples:
  four-migrate .
  four-migrate --write src examples
  four-migrate --check package.json src` );

}

function parseArguments( argv ) {

	const options = {
		check: false,
		json: false,
		paths: [],
		quiet: false,
		renameBuildFiles: true,
		renameNamespace: true,
		renamePackage: true,
		write: false
	};

	for ( const argument of argv ) {

		switch ( argument ) {

			case '--check':
				options.check = true;
				break;

			case '--help':
				options.help = true;
				break;

			case '--json':
				options.json = true;
				break;

			case '--no-build-files':
				options.renameBuildFiles = false;
				break;

			case '--no-namespace':
				options.renameNamespace = false;
				break;

			case '--no-package':
				options.renamePackage = false;
				break;

			case '--quiet':
				options.quiet = true;
				break;

			case '--version':
				options.version = true;
				break;

			case '--write':
				options.write = true;
				break;

			default:
				if ( argument.startsWith( '--' ) ) throw new Error( `Unknown option: ${argument}` );
				options.paths.push( argument );

		}

	}

	if ( options.paths.length === 0 ) options.paths.push( '.' );

	return options;

}

async function collectFiles( targetPath, files ) {

	const metadata = await lstat( targetPath );

	if ( metadata.isSymbolicLink() ) return;

	if ( metadata.isDirectory() ) {

		const entries = await readdir( targetPath, { withFileTypes: true } );
		entries.sort( ( a, b ) => a.name.localeCompare( b.name ) );

		for ( const entry of entries ) {

			if ( entry.isDirectory() && IGNORED_DIRECTORIES.has( entry.name ) ) continue;

			await collectFiles( path.join( targetPath, entry.name ), files );

		}

		return;

	}

	if ( TEXT_EXTENSIONS.has( path.extname( targetPath ).toLowerCase() ) ) files.push( targetPath );

}

async function run( options ) {

	const files = [];

	for ( const target of options.paths ) {

		await collectFiles( path.resolve( target ), files );

	}

	const uniqueFiles = Array.from( new Set( files ) ).sort();
	const changedFiles = [];

	for ( const file of uniqueFiles ) {

		const source = await readFile( file, 'utf8' );
		const result = transformSource( source, options );

		if ( result.changed === false ) continue;

		changedFiles.push( path.relative( process.cwd(), file ).split( path.sep ).join( '/' ) );

		if ( options.write ) await writeFile( file, result.output, 'utf8' );

	}

	const result = {
		mode: options.write ? 'write' : 'check',
		filesScanned: uniqueFiles.length,
		filesChanged: changedFiles.length,
		changedFiles
	};

	if ( options.json ) {

		console.log( JSON.stringify( result, null, 2 ) );

	} else {

		if ( options.quiet === false ) {

			for ( const file of changedFiles ) console.log( `${options.write ? 'updated' : 'would update'} ${file}` );

		}

		console.log( `${changedFiles.length} file(s) ${options.write ? 'updated' : 'need migration'}.` );

	}

	if ( options.check && changedFiles.length > 0 ) process.exitCode = 1;

	return result;

}

async function printVersion() {

	const packagePath = new URL( '../../package.json', import.meta.url );
	const packageJSON = JSON.parse( await readFile( packagePath, 'utf8' ) );

	console.log( packageJSON.version );

}

const isMain = process.argv[ 1 ] && path.resolve( process.argv[ 1 ] ) === fileURLToPath( import.meta.url );

if ( isMain ) {

	try {

		const options = parseArguments( process.argv.slice( 2 ) );

		if ( options.help ) {

			printUsage();

		} else if ( options.version ) {

			await printVersion();

		} else {

			await run( options );

		}

	} catch ( error ) {

		console.error( error.message );
		process.exitCode = 1;

	}

}

export { collectFiles, parseArguments, printVersion, run };
