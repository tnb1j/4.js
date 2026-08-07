import { Diagnostics } from '../../../../src/core/Diagnostics.js';

export default QUnit.module( 'Core', () => {

	QUnit.module( 'Diagnostics', () => {

		QUnit.test( 'Instancing', assert => {

			const diagnostics = new Diagnostics();

			assert.ok( diagnostics.isDiagnostics, 'Provides type flag.' );
			assert.equal( diagnostics.level, 'info', 'Uses the documented default level.' );

		} );

		QUnit.test( 'Filtering and bounded retention', assert => {

			const diagnostics = new Diagnostics( { level: 'info', maxEntries: 2 } );

			assert.equal( diagnostics.debug( 'filtered' ), null, 'Filters entries below the threshold.' );

			diagnostics.info( 'one' );
			diagnostics.warn( 'two' );
			diagnostics.error( 'three' );

			assert.deepEqual( diagnostics.entries.map( entry => entry.message ), [ 'two', 'three' ], 'Drops the oldest overflow entry.' );
			assert.equal( diagnostics.getEntries( { level: 'error' } ).length, 1, 'Filters retained entries.' );

		} );

		QUnit.test( 'Events, sink, and renderer snapshots', assert => {

			const sink = [];
			const diagnostics = new Diagnostics( { sink: entry => sink.push( entry ) } );
			let eventEntry = null;

			diagnostics.addEventListener( 'entry', event => {

				eventEntry = event.entry;

			} );

			const entry = diagnostics.captureRenderer( {
				constructor: { name: 'TestRenderer' },
				info: {
					render: { frame: 2, calls: 3, triangles: 4 },
					memory: { geometries: 5, textures: 6 },
					programs: [ {}, {} ]
				}
			} );

			assert.strictEqual( sink[ 0 ], entry, 'Sends accepted entries to the sink.' );
			assert.strictEqual( eventEntry, entry, 'Dispatches the accepted entry.' );
			assert.equal( entry.data.memory.programs, 2, 'Captures renderer program counts.' );

			diagnostics.clear();
			assert.equal( diagnostics.entries.length, 0, 'Clears retained entries.' );

		} );

		QUnit.test( 'Validation', assert => {

			assert.throws( () => new Diagnostics( { level: 'verbose' } ), RangeError, 'Rejects unknown levels.' );
			assert.throws( () => new Diagnostics( { maxEntries: 0 } ), RangeError, 'Rejects invalid capacities.' );

		} );

	} );

} );
