import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const esmPairs = [
	[ 'core', '../../build/4.core.js', '../../build/three.core.js' ],
	[ 'module', '../../build/4.module.js', '../../build/three.module.js' ],
	[ 'webgpu', '../../build/4.webgpu.js', '../../build/three.webgpu.js' ],
	[ 'webgpu nodes', '../../build/4.webgpu.nodes.js', '../../build/three.webgpu.nodes.js' ]
];

for ( const [ label, fourPath, threePath ] of esmPairs ) {

	const [ fourModule, threeModule ] = await Promise.all( [
		import( fourPath ),
		import( threePath )
	] );

	assert.deepEqual(
		Object.keys( fourModule ).sort(),
		Object.keys( threeModule ).sort(),
		`${label} ESM exports must stay compatible`
	);

	assert.equal( fourModule.REVISION, threeModule.REVISION, `${label} revisions must match` );

	if ( label === 'core' ) {

		for ( const name of [ 'AssetScheduler', 'CapabilitiesReport', 'Diagnostics', 'RenderGraph' ] ) {

			assert.equal( typeof fourModule[ name ], 'function', `native core must export ${name}` );

		}

	}

	if ( label === 'webgpu' ) {

		for ( const name of [ 'SharpenNode', 'TAAUNode', 'TemporalPipeline' ] ) {

			assert.equal( typeof fourModule[ name ], 'function', `native WebGPU entry must export ${name}` );

		}

	}

}

const [ fourSource, threeSource ] = await Promise.all( [
	import( '../../src/Four.js' ),
	import( '../../src/Three.js' )
] );

for ( const name of Object.keys( threeSource ) ) {

	assert.equal( fourSource[ name ], threeSource[ name ], `source export ${name} must use the same binding` );

}

const require = createRequire( import.meta.url );
const fourCommonJS = require( '../../build/4.cjs' );
const threeCommonJS = require( '../../build/three.cjs' );

assert.deepEqual(
	Object.keys( fourCommonJS ).sort(),
	Object.keys( threeCommonJS ).sort(),
	'CommonJS exports must stay compatible'
);

const fourTSL = await readFile( new URL( '../../build/4.tsl.js', import.meta.url ), 'utf8' );
const threeTSL = await readFile( new URL( '../../build/three.tsl.js', import.meta.url ), 'utf8' );
const threePackageTSL = await readFile( new URL( '../../build/three.tsl.package.js', import.meta.url ), 'utf8' );
const fourCore = await readFile( new URL( '../../build/4.core.js', import.meta.url ), 'utf8' );
const threeCore = await readFile( new URL( '../../build/three.core.js', import.meta.url ), 'utf8' );

assert.match( fourTSL, /from '@fourjs\/core\/webgpu'/, '4.js TSL must use the native package path' );
assert.match( threeTSL, /from 'three\/webgpu'/, 'legacy TSL must retain the legacy package path' );
assert.match( threePackageTSL, /from '@fourjs\/core\/legacy\/webgpu'/, 'package legacy TSL must use the package legacy path' );
assert.match( fourCore, /__FOUR_DEVTOOLS__/, 'native builds must use the 4.js devtools marker' );
assert.match( fourCore, /window\.__FOUR__/, 'native builds must use the 4.js instance marker' );
assert.match( threeCore, /__THREE_DEVTOOLS__/, 'legacy builds must use the Three.js devtools marker' );
assert.match( threeCore, /window\.__THREE__/, 'legacy builds must use the Three.js instance marker' );

for ( const file of [ fourTSL, threeTSL, threePackageTSL ] ) {

	assert.match( file, /Copyright 2010-2026 three\.js authors/ );
	assert.match( file, /Copyright 2026 4\.js contributors/ );
	assert.match( file, /SPDX-License-Identifier: MIT/ );

}

const [ packageLegacyWebGPU, packageLegacyTSL ] = await Promise.all( [
	import( '@fourjs/core/legacy/webgpu' ),
	import( '@fourjs/core/legacy/tsl' )
] );

assert.equal( packageLegacyTSL.Fn, packageLegacyWebGPU.TSL.Fn, 'package legacy TSL must share the legacy WebGPU TSL bindings' );

console.log( 'Dual 4.js/Three.js entry-point parity checks passed.' );
