import terser from '@rollup/plugin-terser';
import MagicString from 'magic-string';
import { buildIdentities } from './identity.js';

function glsl() {

	return {

		transform( code, id ) {

			if ( /\.glsl.js$/.test( id ) === false ) return;

			code = new MagicString( code );

			code.replace( /\/\* glsl \*\/\`(.*?)\`/sg, function ( match, p1 ) {

				return JSON.stringify(
					p1
						.trim()
						.replace( /\r/g, '' )
						.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
						.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
						.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
				);

			} );

			return {
				code: code.toString(),
				map: code.generateMap()
			};

		}

	};

}

function packageImports( webgpuSpecifier ) {

	return {

		name: 'four-package-imports',

		transform( code, id ) {

			if ( /[/\\](Four|Three)\.TSL\.js$/.test( id ) === false ) return;

			const replacement = `from '${webgpuSpecifier}'`;
			const sources = [
				'from \'@fourjs/core/webgpu\'',
				'from \'three/webgpu\''
			];
			const source = sources.find( ( candidate ) => code.includes( candidate ) );

			if ( source === undefined || source === replacement ) return;

			code = new MagicString( code );
			code.replace( source, replacement );

			return {
				code: code.toString(),
				map: code.generateMap()
			};

		}

	};

}

function header() {

	return {

		renderChunk( code ) {

			code = new MagicString( code );

			code.prepend( `/**
 * @license
 * Copyright 2010-2026 three.js authors
 * Copyright 2026 4.js contributors
 * SPDX-License-Identifier: MIT
 */\n` );

			return {
				code: code.toString(),
				map: code.generateMap()
			};

		}

	};

}

function identityGlobals( identity ) {

	return {

		name: 'four-identity-globals',

		transform( code ) {

			if ( identity.namespace === 'FOUR' ) return;

			if ( code.includes( '__FOUR' ) === false ) return;

			code = new MagicString( code );
			code.replaceAll( '__FOUR_DEVTOOLS__', '__THREE_DEVTOOLS__' );
			code.replaceAll( '__FOUR__', '__THREE__' );

			return {
				code: code.toString(),
				map: code.generateMap()
			};

		}

	};

}

function createPlugins( identity, minify = false, webgpuSpecifier = `${identity.packageName}/webgpu` ) {

	const plugins = [
		packageImports( webgpuSpecifier ),
		identityGlobals( identity ),
		glsl(),
		header()
	];

	if ( minify ) plugins.push( terser() );

	return plugins;

}

function createBuilds( identity ) {

	const { namespace, outputPrefix, packageName, sourcePrefix } = identity;
	const source = ( suffix = '' ) => `src/${sourcePrefix}${suffix}.js`;

	return [
		{
			input: {
				[ `${outputPrefix}.core.js` ]: source( '.Core' ),
				[ `${outputPrefix}.webgpu.nodes.js` ]: source( '.WebGPU.Nodes' ),
			},
			plugins: createPlugins( identity ),
			preserveEntrySignatures: 'allow-extension',
			output: [
				{
					format: 'esm',
					dir: 'build',
					minifyInternalExports: false,
					entryFileNames: '[name]',
				}
			]
		},
		{
			input: {
				[ `${outputPrefix}.core.js` ]: source( '.Core' ),
				[ `${outputPrefix}.module.js` ]: source(),
				[ `${outputPrefix}.webgpu.js` ]: source( '.WebGPU' ),
			},
			plugins: createPlugins( identity ),
			preserveEntrySignatures: 'allow-extension',
			output: [
				{
					format: 'esm',
					dir: 'build',
					minifyInternalExports: false,
					entryFileNames: '[name]',
				}
			]
		},
		{
			input: {
				[ `${outputPrefix}.tsl.js` ]: source( '.TSL' ),
			},
			plugins: createPlugins( identity ),
			preserveEntrySignatures: 'allow-extension',
			output: [
				{
					format: 'esm',
					dir: 'build',
					minifyInternalExports: false,
					entryFileNames: '[name]',
				}
			],
			external: [ `${packageName}/webgpu` ]
		},
		{
			input: {
				[ `${outputPrefix}.core.min.js` ]: source( '.Core' ),
				[ `${outputPrefix}.webgpu.nodes.min.js` ]: source( '.WebGPU.Nodes' ),
			},
			plugins: createPlugins( identity, true ),
			preserveEntrySignatures: 'allow-extension',
			output: [
				{
					format: 'esm',
					dir: 'build',
					minifyInternalExports: false,
					entryFileNames: '[name]',
				}
			]
		},
		{
			input: {
				[ `${outputPrefix}.core.min.js` ]: source( '.Core' ),
				[ `${outputPrefix}.module.min.js` ]: source(),
				[ `${outputPrefix}.webgpu.min.js` ]: source( '.WebGPU' ),
			},
			plugins: createPlugins( identity, true ),
			preserveEntrySignatures: 'allow-extension',
			output: [
				{
					format: 'esm',
					dir: 'build',
					minifyInternalExports: false,
					entryFileNames: '[name]',
				}
			]
		},
		{
			input: {
				[ `${outputPrefix}.tsl.min.js` ]: source( '.TSL' )
			},
			plugins: createPlugins( identity, true ),
			preserveEntrySignatures: 'allow-extension',
			output: [
				{
					format: 'esm',
					dir: 'build',
					minifyInternalExports: false,
					entryFileNames: '[name]',
				}
			],
			external: [ `${packageName}/webgpu` ]
		},
		{
			input: source(),
			plugins: createPlugins( identity ),
			output: [
				{
					format: 'cjs',
					name: namespace,
					file: `build/${outputPrefix}.cjs`,
					indent: '\t'
				}
			]
		}
	];

}

function createLegacyPackageTSLBuild() {

	const webgpuSpecifier = '@fourjs/core/legacy/webgpu';

	return {
		input: {
			'three.tsl.package.js': 'src/Three.TSL.js'
		},
		plugins: createPlugins( buildIdentities[ 1 ], false, webgpuSpecifier ),
		preserveEntrySignatures: 'allow-extension',
		output: [
			{
				format: 'esm',
				dir: 'build',
				minifyInternalExports: false,
				entryFileNames: '[name]'
			}
		],
		external: [ webgpuSpecifier ]
	};

}

/**
 * @type {Array<import('rollup').RollupOptions>}
 */
const buildsByIdentity = buildIdentities.map( createBuilds );
const builds = [ ...buildsByIdentity.flat(), createLegacyPackageTSLBuild() ];
const moduleBuilds = buildsByIdentity.flatMap( ( identityBuilds ) => identityBuilds.slice( 0, 3 ) );

export default ( args ) => args.configOnlyModule ? moduleBuilds : builds;
