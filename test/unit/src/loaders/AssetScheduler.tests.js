import { AssetScheduler } from '../../../../src/loaders/AssetScheduler.js';

export default QUnit.module( 'Loaders', () => {

	QUnit.module( 'AssetScheduler', () => {

		QUnit.test( 'Priority, concurrency, and deduplication', async assert => {

			const scheduler = new AssetScheduler( { maxConcurrent: 1 } );
			const order = [];

			scheduler.pause();

			const low = scheduler.schedule( 'low', async () => order.push( 'low' ), { priority: 1 } );
			const high = scheduler.schedule( 'high', async () => order.push( 'high' ), { priority: 10 } );
			const duplicate = scheduler.schedule( 'low', async () => order.push( 'duplicate' ) );

			assert.strictEqual( duplicate, low, 'Deduplicates pending work by key.' );

			scheduler.resume();
			await Promise.all( [ low.promise, high.promise ] );

			assert.deepEqual( order, [ 'high', 'low' ], 'Runs higher priority work first.' );
			assert.equal( scheduler.getStats().running, 0, 'Releases the concurrency slot.' );

		} );

		QUnit.test( 'Dependencies and progress', async assert => {

			const scheduler = new AssetScheduler( { maxConcurrent: 1, retain: true } );
			const order = [];

			const dependency = scheduler.schedule( 'dependency', async () => {

				order.push( 'dependency' );

				return 4;

			} );

			const dependent = scheduler.schedule( 'dependent', async ( { reportProgress } ) => {

				reportProgress( 0.5 );
				order.push( 'dependent' );

				return 8;

			}, { dependencies: [ dependency ] } );

			const result = await dependent.promise;

			assert.equal( result, 8, 'Resolves with the executor result.' );
			assert.deepEqual( order, [ 'dependency', 'dependent' ], 'Waits for declared dependencies.' );
			assert.equal( dependent.progress, 1, 'Completes progress at one.' );
			assert.equal( scheduler.get( 'dependent' ).status, 'completed', 'Can retain completed tasks.' );

		} );

		QUnit.test( 'Cancellation', async assert => {

			const scheduler = new AssetScheduler();
			scheduler.pause();

			const task = scheduler.schedule( 'cancelled', async () => 1 );
			task.cancel( 'No longer needed.' );

			try {

				await task.promise;
				assert.ok( false, 'Cancellation should reject.' );

			} catch ( error ) {

				assert.equal( error.name, 'AbortError', 'Rejects with an abort error.' );
				assert.equal( error.message, 'No longer needed.', 'Preserves the cancellation reason.' );

			}

			await scheduler.whenIdle();
			assert.equal( task.status, 'cancelled', 'Marks the task as cancelled.' );

		} );

		QUnit.test( 'Validation', assert => {

			assert.throws( () => new AssetScheduler( { maxConcurrent: 0 } ), RangeError, 'Rejects invalid concurrency.' );

			const scheduler = new AssetScheduler();
			assert.throws( () => scheduler.schedule( 'invalid', null ), TypeError, 'Requires an executor.' );

		} );

	} );

} );
