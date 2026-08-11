import { IESLoader } from '../../../../examples/jsm/loaders/IESLoader.js';
import { PLYLoader } from '../../../../examples/jsm/loaders/PLYLoader.js';
import { STLLoader } from '../../../../examples/jsm/loaders/STLLoader.js';
import { SVGLoader } from '../../../../examples/jsm/loaders/SVGLoader.js';

export default QUnit.module( 'Addons', () => {

	QUnit.module( 'Loaders', () => {

		QUnit.module( 'Security hardening', () => {

			QUnit.test( 'IESLoader normalizes mixed whitespace and commas', async ( assert ) => {

				const response = await fetch( '/examples/ies/007cfb11e343e2f42e3b476be4ab684e.ies' );
				assert.true( response.ok, 'IES fixture loads.' );

				const source = await response.text();
				const lines = source.split( '\n' );
				const numericStart = lines.findIndex( line => line.startsWith( 'TILT=' ) ) + 1;
				const normalized = lines.map( ( line, index ) => {

					if ( index < numericStart || line.trim() === '' ) return line;
					return `\t${line.trim().split( /\s+/ ).join( ',\t' )}\t`;

				} ).join( '\n' );

				const loader = new IESLoader();
				const expected = loader.parse( source ).image.data;
				const actual = loader.parse( normalized ).image.data;
				let matches = expected.length === actual.length;

				for ( let i = 0; matches && i < expected.length; i ++ ) {

					matches = expected[ i ] === actual[ i ];

				}

				assert.true( matches, 'Equivalent numeric input produces identical photometric data.' );

			} );

			QUnit.test( 'PLYLoader ignores marker-like header text', ( assert ) => {

				const markerNoise = 'end_headerX '.repeat( 4096 );
				const source = [
					'ply',
					'format ascii 1.0',
					`comment ${markerNoise}`,
					'element vertex 3',
					'property float x',
					'property float y',
					'property float z',
					'element face 1',
					'property list uchar int vertex_indices',
					'end_header',
					'0 0 0',
					'1 0 0',
					'0 1 0',
					'3 0 1 2',
					''
				].join( '\n' );

				const geometry = new PLYLoader().parse( source );

				assert.strictEqual( geometry.attributes.position.count, 3, 'All ASCII vertices are parsed.' );
				assert.strictEqual( geometry.index.count, 3, 'The face after the real header marker is parsed.' );

			} );

			QUnit.test( 'PLYLoader preserves binary parsing', async ( assert ) => {

				const response = await fetch( '/examples/models/ply/binary/dolphins_le.ply' );
				assert.true( response.ok, 'Binary PLY fixture loads.' );

				const geometry = new PLYLoader().parse( await response.arrayBuffer() );

				assert.strictEqual( geometry.attributes.position.count, 855, 'All binary vertices are parsed.' );
				assert.strictEqual( geometry.index.count, 5067, 'All binary face indices are parsed.' );

			} );

			QUnit.test( 'STLLoader recognizes only line-level structure tokens', ( assert ) => {

				const source = [
					'solid first facet endfacet',
					'facet normal 0 0 1',
					'outer loop',
					'vertex 0 0 0',
					'vertex 1 0 0',
					'vertex 0 1 0',
					'endloop',
					'endfacet',
					'endsolid first',
					'solid second solid endsolid facet endfacet',
					'facet normal 0 0 -1',
					'outer loop',
					'vertex 0 0 1',
					'vertex 0 1 1',
					'vertex 1 0 1',
					'endloop',
					'endfacet',
					'endsolid second',
					''
				].join( '\n' );

				const geometry = new STLLoader().parse( source );

				assert.strictEqual( geometry.attributes.position.count, 6, 'Both facets are parsed.' );
				assert.strictEqual( geometry.groups.length, 2, 'Each solid receives a group.' );
				assert.deepEqual(
					geometry.userData.groupNames,
					[ 'first facet endfacet', 'second solid endsolid facet endfacet' ],
					'Solid names can contain words that resemble structure tokens.'
				);
				assert.deepEqual(
					geometry.groups.map( group => group.count ),
					[ 3, 3 ],
					'Each group contains one triangle.'
				);

			} );

			QUnit.test( 'SVGLoader isolates attacker-controlled stylesheet keys', ( assert ) => {

				const originalFill = Object.prototype.fill;
				const hadOwnFill = Object.hasOwn( Object.prototype, 'fill' );
				const source = [
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">',
					'<style>__proto__ { fill: red; } .safe { fill: rgb(0, 255, 0); }</style>',
					'<path class="safe" d="M0 0 L1 0 L0 1 Z"/>',
					'</svg>'
				].join( '' );

				try {

					const data = new SVGLoader().parse( source );

					assert.strictEqual( data.paths.length, 1, 'The styled path is parsed.' );
					assert.strictEqual( data.paths[ 0 ].color.getHexString(), '00ff00', 'Normal stylesheet rules still apply.' );
					assert.strictEqual( Object.hasOwn( Object.prototype, 'fill' ), hadOwnFill, 'Object.prototype ownership is unchanged.' );
					assert.strictEqual( Object.prototype.fill, originalFill, 'Object.prototype values are unchanged.' );

				} finally {

					if ( hadOwnFill ) {

						Object.prototype.fill = originalFill;

					} else {

						delete Object.prototype.fill;

					}

				}

			} );

		} );

	} );

} );
