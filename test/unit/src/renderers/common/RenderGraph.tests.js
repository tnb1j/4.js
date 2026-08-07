import RenderGraph from '../../../../../src/renderers/common/RenderGraph.js';

export default QUnit.module( 'Renderers', () => {

	QUnit.module( 'RenderGraph', () => {

		QUnit.test( 'Compilation and execution', async assert => {

			const graph = new RenderGraph();
			const order = [];

			graph.addPass( 'present', {
				reads: [ 'lit' ],
				execute: ( { read } ) => {

					order.push( `present:${read( 'lit' )}` );

				}
			} );

			graph.addPass( 'geometry', {
				writes: [ 'gbuffer' ],
				execute: () => {

					order.push( 'geometry' );

					return { gbuffer: 2 };

				}
			} );

			graph.addPass( 'lighting', {
				reads: [ 'gbuffer' ],
				writes: [ 'lit' ],
				execute: ( { read, write } ) => {

					order.push( 'lighting' );
					write( 'lit', read( 'gbuffer' ) * 3 );

				}
			} );

			assert.deepEqual( graph.getExecutionOrder(), [ 'geometry', 'lighting', 'present' ], 'Orders resource producers before consumers.' );

			const resources = await graph.execute();

			assert.deepEqual( order, [ 'geometry', 'lighting', 'present:6' ], 'Executes the compiled pass order.' );
			assert.equal( resources.get( 'lit' ), 6, 'Stores pass outputs as named resources.' );

		} );

		QUnit.test( 'Explicit dependencies and disabled validation', assert => {

			const graph = new RenderGraph();

			graph.addPass( 'first', () => {} );
			graph.addPass( 'second', { dependsOn: [ 'first' ], execute: () => {} } );

			assert.deepEqual( graph.getExecutionOrder(), [ 'first', 'second' ], 'Honors explicit dependencies.' );

			graph.setPassEnabled( 'first', false );
			assert.throws( () => graph.compile(), /disabled pass/, 'Rejects dependencies on disabled passes.' );

		} );

		QUnit.test( 'Graph validation', assert => {

			const duplicate = new RenderGraph();
			duplicate.addPass( 'a', { writes: [ 'color' ], execute: () => {} } );
			duplicate.addPass( 'b', { writes: [ 'color' ], execute: () => {} } );
			assert.throws( () => duplicate.compile(), /written by both/, 'Rejects ambiguous resource writers.' );

			const cycle = new RenderGraph();
			cycle.addPass( 'a', { dependsOn: [ 'b' ], execute: () => {} } );
			cycle.addPass( 'b', { dependsOn: [ 'a' ], execute: () => {} } );
			assert.throws( () => cycle.compile(), /Cycle detected/, 'Rejects dependency cycles.' );

		} );

	} );

} );
