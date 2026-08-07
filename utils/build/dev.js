import { rm, mkdir, writeFile } from 'node:fs/promises';
import { buildIdentities } from './identity.js';

await rm( './build', { recursive: true, force: true } );

await mkdir( './build' );

const variants = [
	[ 'core', '.Core' ],
	[ 'module', '' ],
	[ 'tsl', '.TSL' ],
	[ 'webgpu', '.WebGPU' ],
	[ 'webgpu.nodes', '.WebGPU.Nodes' ]
];

const contents = buildIdentities.flatMap( ( identity ) => variants.map( ( [ outputSuffix, sourceSuffix ] ) => {

	const filename = `${identity.outputPrefix}.${outputSuffix}.js`;
	const content = `export * from '../src/${identity.sourcePrefix}${sourceSuffix}.js';`;

	return [ filename, content ];

} ) );

await Promise.all( contents.map( ( [ filename, content ] ) =>
	writeFile( `./build/${ filename }`, '// dev build\n' + content + '\n' )
) );
