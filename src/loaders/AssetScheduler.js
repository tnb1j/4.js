import { EventDispatcher } from '../core/EventDispatcher.js';

let _taskSequence = 0;

/**
 * Represents one scheduled asset operation.
 *
 * @augments EventDispatcher
 */
class AssetTask extends EventDispatcher {

	/**
	 * Constructs an asset task.
	 *
	 * @param {AssetScheduler} scheduler - Owning scheduler.
	 * @param {*} key - Deduplication key.
	 * @param {Function} executor - Task executor.
	 * @param {Object} options - Task options.
	 */
	constructor( scheduler, key, executor, options ) {

		super();

		this.isAssetTask = true;
		this.scheduler = scheduler;
		this.key = key;
		this.executor = executor;
		this.priority = _validatePriority( options.priority === undefined ? 0 : options.priority );
		this.status = 'blocked';
		this.progress = 0;
		this.result = undefined;
		this.error = null;
		this.sequence = ++ _taskSequence;
		this.dependencies = options.dependencies || [];
		this.retain = options.retain === true;
		this.controller = new AbortController();
		this.signal = this.controller.signal;
		this._cancelRequested = false;

		this.promise = new Promise( ( resolve, reject ) => {

			this._resolve = resolve;
			this._reject = reject;

		} );

		// Keep cancellation safe when a caller schedules work before attaching a
		// rejection handler. Awaiting the original promise still rejects.
		this.promise.catch( () => {} );

	}

	/**
	 * Cancels this task.
	 *
	 * @param {string} [reason='Asset task cancelled.'] - Cancellation reason.
	 * @return {AssetTask} A reference to this task.
	 */
	cancel( reason = 'Asset task cancelled.' ) {

		this.scheduler.cancel( this.key, reason );

		return this;

	}

	/**
	 * Updates the priority of a queued task.
	 *
	 * @param {number} priority - New priority.
	 * @return {AssetTask} A reference to this task.
	 */
	setPriority( priority ) {

		this.scheduler.setPriority( this.key, priority );

		return this;

	}

}

/**
 * Schedules asynchronous asset work with priorities, concurrency limits,
 * cancellation, dependency blocking, and in-flight deduplication.
 *
 * @augments EventDispatcher
 */
class AssetScheduler extends EventDispatcher {

	/**
	 * Constructs an asset scheduler.
	 *
	 * @param {Object} [options] - Scheduler options.
	 * @param {number} [options.maxConcurrent=4] - Maximum concurrent tasks.
	 * @param {boolean} [options.retain=false] - Retain completed tasks for result reuse.
	 */
	constructor( options = {} ) {

		super();

		/**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */
		this.isAssetScheduler = true;

		this.maxConcurrent = _validateConcurrency( options.maxConcurrent === undefined ? 4 : options.maxConcurrent );
		this.retain = options.retain === true;
		this.paused = false;
		this._queue = [];
		this._active = new Set();
		this._tasks = new Map();
		this._idleResolvers = [];

	}

	/**
	 * Schedules asset work.
	 *
	 * Scheduling the same key while a task is pending returns the existing task.
	 *
	 * @param {*} key - Stable deduplication key.
	 * @param {Function} executor - Async or synchronous task executor.
	 * @param {Object} [options] - Task options.
	 * @param {number} [options.priority=0] - Higher values run first.
	 * @param {Array<Promise|AssetTask>} [options.dependencies] - Tasks or promises that must resolve first.
	 * @param {?AbortSignal} [options.signal=null] - External cancellation signal.
	 * @param {boolean} [options.retain=false] - Retain this task after completion.
	 * @return {AssetTask} The scheduled or deduplicated task.
	 */
	schedule( key, executor, options = {} ) {

		if ( typeof executor !== 'function' ) throw new TypeError( 'AssetScheduler: executor must be a function.' );

		const existing = this._tasks.get( key );

		if ( existing !== undefined ) return existing;

		const task = new AssetTask( this, key, executor, options );
		this._tasks.set( key, task );

		const dependencies = task.dependencies.map( dependency => dependency && dependency.isAssetTask ? dependency.promise : Promise.resolve( dependency ) );

		if ( dependencies.length === 0 ) {

			this._enqueue( task );

		} else {

			Promise.all( dependencies ).then( () => {

				if ( task._cancelRequested === false ) this._enqueue( task );

			}, error => {

				this._settleError( task, error );

			} );

		}

		if ( options.signal ) {

			if ( options.signal.aborted ) {

				task.cancel( options.signal.reason );

			} else {

				options.signal.addEventListener( 'abort', () => {

					task.cancel( options.signal.reason );

				}, { once: true } );

			}

		}

		return task;

	}

	/**
	 * Alias for {@link AssetScheduler#schedule `schedule()`}.
	 *
	 * @param {*} key - Stable deduplication key.
	 * @param {Function} executor - Task executor.
	 * @param {Object} [options] - Task options.
	 * @return {AssetTask} The scheduled task.
	 */
	enqueue( key, executor, options = {} ) {

		return this.schedule( key, executor, options );

	}

	/**
	 * Returns a task by key.
	 *
	 * @param {*} key - Task key.
	 * @return {?AssetTask} The task, or `null`.
	 */
	get( key ) {

		return this._tasks.get( key ) || null;

	}

	/**
	 * Returns whether a task key is registered.
	 *
	 * @param {*} key - Task key.
	 * @return {boolean} Whether the key exists.
	 */
	has( key ) {

		return this._tasks.has( key );

	}

	/**
	 * Updates a queued task's priority.
	 *
	 * @param {*} key - Task key.
	 * @param {number} priority - New priority.
	 * @return {AssetScheduler} A reference to this scheduler.
	 */
	setPriority( key, priority ) {

		const task = this._tasks.get( key );

		if ( task === undefined ) throw new Error( `AssetScheduler: Unknown task "${String( key )}".` );
		if ( task.status !== 'queued' && task.status !== 'blocked' ) return this;

		task.priority = _validatePriority( priority );
		this._sortQueue();

		return this;

	}

	/**
	 * Updates the concurrency limit.
	 *
	 * @param {number} maxConcurrent - Maximum concurrent tasks.
	 * @return {AssetScheduler} A reference to this scheduler.
	 */
	setConcurrency( maxConcurrent ) {

		this.maxConcurrent = _validateConcurrency( maxConcurrent );
		this._drain();

		return this;

	}

	/**
	 * Pauses starting new tasks.
	 *
	 * @return {AssetScheduler} A reference to this scheduler.
	 */
	pause() {

		this.paused = true;

		return this;

	}

	/**
	 * Resumes starting queued tasks.
	 *
	 * @return {AssetScheduler} A reference to this scheduler.
	 */
	resume() {

		this.paused = false;
		this._drain();

		return this;

	}

	/**
	 * Cancels one task.
	 *
	 * @param {*} key - Task key.
	 * @param {*} [reason='Asset task cancelled.'] - Cancellation reason.
	 * @return {boolean} Whether a task was found.
	 */
	cancel( key, reason = 'Asset task cancelled.' ) {

		const task = this._tasks.get( key );

		if ( task === undefined ) return false;
		if ( _isTerminal( task.status ) ) return false;

		task._cancelRequested = true;
		task.controller.abort( reason );

		if ( task.status !== 'running' ) this._settleCancelled( task, reason );

		return true;

	}

	/**
	 * Cancels all pending and active tasks.
	 *
	 * @param {*} [reason='All asset tasks cancelled.'] - Cancellation reason.
	 * @return {AssetScheduler} A reference to this scheduler.
	 */
	cancelAll( reason = 'All asset tasks cancelled.' ) {

		for ( const task of Array.from( this._tasks.values() ) ) {

			this.cancel( task.key, reason );

		}

		return this;

	}

	/**
	 * Returns a promise that resolves when no tasks remain pending or active.
	 *
	 * @return {Promise<void>} Idle promise.
	 */
	whenIdle() {

		if ( this._hasPendingTasks() === false ) return Promise.resolve();

		return new Promise( resolve => {

			this._idleResolvers.push( resolve );

		} );

	}

	/**
	 * Returns scheduler counters.
	 *
	 * @return {Object} Scheduler status.
	 */
	getStats() {

		const stats = {
			blocked: 0,
			queued: 0,
			running: 0,
			completed: 0,
			failed: 0,
			cancelled: 0,
			maxConcurrent: this.maxConcurrent,
			paused: this.paused
		};

		for ( const task of this._tasks.values() ) stats[ task.status ] ++;

		return stats;

	}

	/**
	 * Removes retained terminal tasks.
	 *
	 * @return {AssetScheduler} A reference to this scheduler.
	 */
	clear() {

		for ( const [ key, task ] of this._tasks ) {

			if ( _isTerminal( task.status ) ) this._tasks.delete( key );

		}

		return this;

	}

	_enqueue( task ) {

		if ( task._cancelRequested ) return;

		task.status = 'queued';
		task.dispatchEvent( { type: 'queued' } );
		this._queue.push( task );
		this._sortQueue();
		this.dispatchEvent( { type: 'queued', task } );
		this._drain();

	}

	_sortQueue() {

		this._queue.sort( ( a, b ) => b.priority - a.priority || a.sequence - b.sequence );

	}

	_drain() {

		if ( this.paused ) return;

		while ( this._active.size < this.maxConcurrent && this._queue.length > 0 ) {

			const task = this._queue.shift();

			if ( task.status !== 'queued' ) continue;

			this._run( task );

		}

	}

	_run( task ) {

		task.status = 'running';
		this._active.add( task );
		task.dispatchEvent( { type: 'start' } );
		this.dispatchEvent( { type: 'start', task } );

		const reportProgress = value => {

			if ( task.status !== 'running' ) return;

			task.progress = Math.min( 1, Math.max( 0, Number( value ) || 0 ) );
			task.dispatchEvent( { type: 'progress', progress: task.progress } );
			this.dispatchEvent( { type: 'progress', task, progress: task.progress } );

		};

		Promise.resolve().then( () => task.executor( {
			scheduler: this,
			task,
			signal: task.signal,
			reportProgress
		} ) ).then( result => {

			if ( task._cancelRequested ) {

				this._settleCancelled( task, task.signal.reason );

			} else {

				this._settleComplete( task, result );

			}

		}, error => {

			if ( task._cancelRequested || ( error && error.name === 'AbortError' ) ) {

				this._settleCancelled( task, task.signal.reason || error.message );

			} else {

				this._settleError( task, error );

			}

		} );

	}

	_settleComplete( task, result ) {

		if ( _isTerminal( task.status ) ) return;

		task.status = 'completed';
		task.progress = 1;
		task.result = result;
		task._resolve( result );
		task.dispatchEvent( { type: 'complete', result } );
		this.dispatchEvent( { type: 'complete', task, result } );
		this._finalize( task );

	}

	_settleError( task, error ) {

		if ( _isTerminal( task.status ) ) return;

		task.status = 'failed';
		task.error = error instanceof Error ? error : new Error( String( error ) );
		task._reject( task.error );
		task.dispatchEvent( { type: 'error', error: task.error } );
		this.dispatchEvent( { type: 'error', task, error: task.error } );
		this._finalize( task );

	}

	_settleCancelled( task, reason ) {

		if ( _isTerminal( task.status ) ) return;

		const error = new Error( reason === undefined ? 'Asset task cancelled.' : String( reason ) );
		error.name = 'AbortError';

		task.status = 'cancelled';
		task.error = error;
		task._reject( error );
		task.dispatchEvent( { type: 'cancel', error } );
		this.dispatchEvent( { type: 'cancel', task, error } );
		this._finalize( task );

	}

	_finalize( task ) {

		const queueIndex = this._queue.indexOf( task );

		if ( queueIndex !== - 1 ) this._queue.splice( queueIndex, 1 );

		this._active.delete( task );

		if ( this.retain === false && task.retain === false ) this._tasks.delete( task.key );

		this._drain();
		this._checkIdle();

	}

	_hasPendingTasks() {

		for ( const task of this._tasks.values() ) {

			if ( _isTerminal( task.status ) === false ) return true;

		}

		return this._active.size > 0 || this._queue.length > 0;

	}

	_checkIdle() {

		if ( this._hasPendingTasks() ) return;

		const resolvers = this._idleResolvers.splice( 0 );

		for ( const resolve of resolvers ) resolve();

		this.dispatchEvent( { type: 'idle' } );

	}

}

function _validateConcurrency( value ) {

	if ( Number.isInteger( value ) === false || value < 1 ) {

		throw new RangeError( 'AssetScheduler: maxConcurrent must be a positive integer.' );

	}

	return value;

}

function _validatePriority( value ) {

	if ( Number.isFinite( value ) === false ) throw new RangeError( 'AssetScheduler: priority must be finite.' );

	return value;

}

function _isTerminal( status ) {

	return status === 'completed' || status === 'failed' || status === 'cancelled';

}

export { AssetScheduler, AssetTask };
