import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { transformSource } from '../../utils/migrate/transforms.js';
import { parseArguments, run } from '../../utils/migrate/cli.js';

const input = `
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const webgpu = import( 'three/webgpu' );
const requireCore = require( 'three' );
const importMap = {
	"imports": {
		"three": "../build/three.module.js",
		"three/addons/": "./jsm/"
	}
};
/** @three_import import { Scene } from 'three'; */
const scene = new THREE.Scene();
const untouchedPackage = await import( 'three-gpu-pathtracer' );
const ThreeMFLoader = 'format name';
// four-migrate-preserve: three/examples/
const compatibilityAlias = 'three/examples/';
`;

const expected = `
import * as FOUR from '@fourjs/core';
import { OrbitControls } from '@fourjs/core/addons/controls/OrbitControls.js';
const webgpu = import( '@fourjs/core/webgpu' );
const requireCore = require( '@fourjs/core' );
const importMap = {
	"imports": {
		"@fourjs/core": "../build/4.module.js",
		"@fourjs/core/addons/": "./jsm/"
	}
};
/** @four_import import { Scene } from '@fourjs/core'; */
const scene = new FOUR.Scene();
const untouchedPackage = await import( 'three-gpu-pathtracer' );
const ThreeMFLoader = 'format name';
// four-migrate-preserve: three/examples/
const compatibilityAlias = 'three/examples/';
`;

const result = transformSource( input );

assert.equal( result.changed, true );
assert.equal( result.output, expected );
assert.equal( transformSource( expected ).changed, false, 'migration must be idempotent' );
assert.deepEqual(
	parseArguments( [ '--check', '--json', '--quiet', '--no-namespace', 'src' ] ),
	{
		check: true,
		json: true,
		paths: [ 'src' ],
		quiet: true,
		renameBuildFiles: true,
		renameNamespace: false,
		renamePackage: true,
		write: false
	},
	'CLI flags should parse deterministically'
);

const temporaryDirectory = await mkdtemp( path.join( os.tmpdir(), 'four-migrate-' ) );
const temporaryFile = path.join( temporaryDirectory, 'entry.js' );

try {

	await writeFile( temporaryFile, 'import * as THREE from \'three\';\n', 'utf8' );

	const result = await run( {
		check: false,
		json: false,
		paths: [ temporaryDirectory, temporaryFile ],
		quiet: true,
		renameBuildFiles: true,
		renameNamespace: true,
		renamePackage: true,
		write: true
	} );

	assert.equal( result.filesScanned, 1, 'duplicate target paths should be deduplicated' );
	assert.equal( result.filesChanged, 1, 'the fixture should be migrated' );
	assert.equal( await readFile( temporaryFile, 'utf8' ), 'import * as FOUR from \'@fourjs/core\';\n' );

} finally {

	await rm( temporaryDirectory, { recursive: true, force: true } );

}

console.log( '4.js migration transform tests passed.' );
