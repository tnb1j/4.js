#!/usr/bin/env node

import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const TEXT_EXTENSIONS = new Set( [
	'.css',
	'.html',
	'.js',
	'.json',
	'.md',
	'.txt',
	'.yaml',
	'.yml'
] );

const IGNORED_DIRECTORIES = new Set( [
	'.git',
	'build',
	'node_modules',
	'output-screenshots'
] );

const EXCLUDED_FILES = new Set( [
	'.github/CODE_OF_CONDUCT.md',
	'LICENSE',
	'NOTICE',
	'README.md',
	'UPSTREAM.md',
	'MIGRATION.md',
	'CHANGELOG.4JS.md',
	'GITHUB_DEPLOYMENT.md',
	'INTEGRATION_AUDIT.md',
	'package-lock.json',
	'package.json',
	'test/rebranding/dual-entrypoints.js',
	'test/rebranding/migrate.tests.js',
	'utils/build/identity.js',
	'utils/build/rollup.config.js',
	'utils/rebrand/sync-project.js'
] );

const FILE_REFERENCE_RENAMES = new Map( [
	[ 'highlight-three.css', 'highlight-four.css' ],
	[ 'prettify-three.css', 'prettify-four.css' ],
	[ 'tern-threejs', 'tern-fourjs' ],
	[ 'three.addons.unit.js', 'four.addons.unit.js' ],
	[ 'three.source.unit.js', 'four.source.unit.js' ],
	[ 'threejs-responsive.js', 'fourjs-responsive.js' ],
	[ 'threejs-tutorials.css', 'fourjs-tutorials.css' ],
	[ 'threejs-utils.js', 'fourjs-utils.js' ],
	[ 'threejs-align-html-elements-to-3d.css', 'fourjs-align-html-elements-to-3d.css' ],
	[ 'threejs-align-html-elements-to-3d.js', 'fourjs-align-html-elements-to-3d.js' ],
	[ 'threejs-attributes.svg', 'fourjs-attributes.svg' ],
	[ 'threejs-cameras.js', 'fourjs-cameras.js' ],
	[ 'threejs-custom-buffergeometry.js', 'fourjs-custom-buffergeometry.js' ],
	[ 'threejs-fog.js', 'fourjs-fog.js' ],
	[ 'threejs-geometry.svg', 'fourjs-geometry.svg' ],
	[ 'threejs-lesson-utils.js', 'fourjs-lesson-utils.js' ],
	[ 'threejs-lessons.css', 'fourjs-lessons.css' ],
	[ 'threejs-lights.js', 'fourjs-lights.js' ],
	[ 'threejs-lots-of-objects.js', 'fourjs-lots-of-objects.js' ],
	[ 'threejs-material-table.css', 'fourjs-material-table.css' ],
	[ 'threejs-material-table.js', 'fourjs-material-table.js' ],
	[ 'threejs-materials.js', 'fourjs-materials.js' ],
	[ 'threejs-post-processing-3dlut.js', 'fourjs-post-processing-3dlut.js' ],
	[ 'threejs-primitives.css', 'fourjs-primitives.css' ],
	[ 'threejs-primitives.js', 'fourjs-primitives.js' ],
	[ 'threejs-textures.css', 'fourjs-textures.css' ],
	[ 'threejs-textures.js', 'fourjs-textures.js' ],
	[ 'threejs-voxel-geometry.js', 'fourjs-voxel-geometry.js' ],
	[ 'threejsfundamentals-background.jpg', 'fourjsfundamentals-background.jpg' ],
	[ 'threejsfundamentals-icon-256.png', 'fourjsfundamentals-icon-256.png' ],
	[ 'threejsfundamentals-icon.png', 'fourjsfundamentals-icon.png' ],
	[ 'threejsfundamentals-v01.jpg', 'fourjsfundamentals-v01.jpg' ],
	[ 'threejsfundamentals.jpg', 'fourjsfundamentals.jpg' ],
	[ 'threejs-1cube-no-light-scene.svg', 'fourjs-1cube-no-light-scene.svg' ],
	[ 'threejs-1cube-with-directionallight.svg', 'fourjs-1cube-with-directionallight.svg' ],
	[ 'threejs-3cubes-scene.svg', 'fourjs-3cubes-scene.svg' ],
	[ 'threejs-postprocessing.svg', 'fourjs-postprocessing.svg' ],
	[ 'threejs-structure.svg', 'fourjs-structure.svg' ],
	[ 'ui.three.js', 'ui.four.js' ]
] );

const PROTECTED_TEXT = new Map( [
	[ 'three.js authors', '__FOUR_PROTECTED_AUTHORS__' ],
	[ 'mrdoob/three.js', '__FOUR_PROTECTED_UPSTREAM_REPO__' ],
	[ 'stackoverflow.com/questions/tagged/three.js', '__FOUR_PROTECTED_STACKOVERFLOW_TAG__' ]
] );

function normalizeRelativePath( file ) {

	return file.split( path.sep ).join( '/' );

}

function transformBrandText( source, relativePath ) {

	let output = source;

	for ( const [ legacyName, nativeName ] of FILE_REFERENCE_RENAMES ) {

		output = output.replaceAll( legacyName, nativeName );

	}

	for ( const [ protectedText, token ] of PROTECTED_TEXT ) {

		output = output.replaceAll( protectedText, token );

	}

	output = output
		.replaceAll( 'ThreeJS', '4.js' )
		.replaceAll( 'Three.js', '4.js' )
		.replaceAll( 'three.js', '4.js' );

	for ( const [ protectedText, token ] of PROTECTED_TEXT ) {

		output = output.replaceAll( token, protectedText );

	}

	if ( relativePath.startsWith( 'examples/' ) && relativePath.endsWith( '.html' ) ) {

		output = output
			.replace( /^\s*<meta property="og:(url|image)"[^\n]*\r?\n/gm, '' )
			.replaceAll( 'href="https://threejs.org/"', 'href="../"' )
			.replaceAll( 'href="https://threejs.org"', 'href="../"' );

	}

	if ( relativePath === 'manual/index.html' ) {

		output = output
			.replaceAll( 'href="https://threejs.org/"', 'href="../"' )
			.replaceAll( 'href="https://threejs.org"', 'href="../"' );

	}

	if ( /^manual\/[^/]+\/[^/]+\.html$/.test( relativePath ) ) {

		output = output
			.replace( /^\s*<meta name="twitter:site"[^\n]*\r?\n/gm, '' )
			.replace( /^\s*<meta property="og:image"[^\n]*\r?\n/gm, '' )
			.replaceAll( 'href="https://threejs.org/docs/', 'href="../../docs/' )
			.replaceAll( 'href="https://threejs.org/examples/', 'href="../../examples/' )
			.replaceAll( 'href="https://threejs.org/"', 'href="../../"' )
			.replaceAll( 'href="https://threejs.org"', 'href="../../"' );

	}

	if ( relativePath === 'utils/docs/template/static/index.html' ) {

		output = output
			.replaceAll( 'href="https://threejs.org/"', 'href="../"' )
			.replaceAll( 'href="https://threejs.org"', 'href="../"' );

	}

	return output;

}

async function collectFiles( root, current, files ) {

	const metadata = await stat( current );
	const relativePath = normalizeRelativePath( path.relative( root, current ) );

	if ( metadata.isDirectory() ) {

		if ( relativePath === 'docs' ) return;
		if ( relativePath && IGNORED_DIRECTORIES.has( path.basename( current ) ) ) return;

		const entries = await readdir( current, { withFileTypes: true } );

		for ( const entry of entries ) {

			await collectFiles( root, path.join( current, entry.name ), files );

		}

		return;

	}

	if ( EXCLUDED_FILES.has( relativePath ) ) return;
	if ( TEXT_EXTENSIONS.has( path.extname( current ).toLowerCase() ) ) files.push( { current, relativePath } );

}

async function run() {

	const root = process.cwd();
	const files = [];

	await collectFiles( root, root, files );

	const write = process.argv.includes( '--write' );
	const changedFiles = [];

	for ( const file of files ) {

		const source = await readFile( file.current, 'utf8' );
		const output = transformBrandText( source, file.relativePath );

		if ( output === source ) continue;

		changedFiles.push( file.relativePath );

		if ( write ) await writeFile( file.current, output, 'utf8' );

	}

	for ( const file of changedFiles ) console.log( `${write ? 'updated' : 'would update'} ${file}` );
	console.log( `${changedFiles.length} file(s) ${write ? 'updated' : 'need brand synchronization'}.` );

	if ( write === false && changedFiles.length > 0 ) process.exitCode = 1;

}

await run();
