import { EventDispatcher } from './EventDispatcher.js';

const DiagnosticLevel = Object.freeze( {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40,
	silent: Infinity
} );

let _entryId = 0;

/**
 * Collects structured diagnostic entries in a bounded in-memory buffer.
 *
 * Diagnostics is intentionally independent of the browser console. Applications
 * can provide a sink callback to route accepted entries to a logger, telemetry
 * service, or development overlay.
 *
 * @augments EventDispatcher
 */
class Diagnostics extends EventDispatcher {

	/**
	 * Constructs a diagnostics collector.
	 *
	 * @param {Object} [options] - Configuration options.
	 * @param {string} [options.level='info'] - Minimum accepted diagnostic level.
	 * @param {number} [options.maxEntries=200] - Maximum retained entry count.
	 * @param {string} [options.scope='4.js'] - Default entry scope.
	 * @param {?Function} [options.sink=null] - Optional callback invoked for each accepted entry.
	 */
	constructor( options = {} ) {

		super();

		const {
			level = 'info',
			maxEntries = 200,
			scope = '4.js',
			sink = null
		} = options;

		/**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */
		this.isDiagnostics = true;

		/**
		 * Minimum accepted diagnostic level.
		 *
		 * @type {string}
		 */
		this.level = _validateLevel( level );

		/**
		 * Maximum retained entry count.
		 *
		 * @type {number}
		 */
		this.maxEntries = _validateMaxEntries( maxEntries );

		/**
		 * Default entry scope.
		 *
		 * @type {string}
		 */
		this.scope = scope;

		/**
		 * Optional callback invoked for each accepted entry.
		 *
		 * @type {?Function}
		 */
		this.sink = sink;

		/**
		 * Retained diagnostic entries.
		 *
		 * @type {Array<Object>}
		 * @readonly
		 */
		this.entries = [];

	}

	/**
	 * Sets the minimum accepted level.
	 *
	 * @param {string} level - The new diagnostic level.
	 * @return {Diagnostics} A reference to this instance.
	 */
	setLevel( level ) {

		this.level = _validateLevel( level );

		return this;

	}

	/**
	 * Adds a structured entry when its level meets the configured threshold.
	 *
	 * @param {string} level - Entry level.
	 * @param {string} message - Human-readable message.
	 * @param {*} [data=null] - Optional structured data.
	 * @param {Object} [options] - Entry options.
	 * @param {string} [options.scope] - Scope override.
	 * @return {?Object} The accepted entry, or `null` when filtered.
	 */
	record( level, message, data = null, options = {} ) {

		level = _validateLevel( level );

		if ( DiagnosticLevel[ level ] < DiagnosticLevel[ this.level ] ) return null;

		const entry = Object.freeze( {
			id: ++ _entryId,
			timestamp: new Date().toISOString(),
			level,
			scope: options.scope || this.scope,
			message: String( message ),
			data
		} );

		this.entries.push( entry );
		this._trim();

		if ( this.sink !== null ) this.sink( entry );

		this.dispatchEvent( { type: 'entry', entry } );

		return entry;

	}

	/**
	 * Records a debug entry.
	 *
	 * @param {string} message - Human-readable message.
	 * @param {*} [data=null] - Optional structured data.
	 * @param {Object} [options] - Entry options.
	 * @return {?Object} The accepted entry, or `null` when filtered.
	 */
	debug( message, data = null, options = {} ) {

		return this.record( 'debug', message, data, options );

	}

	/**
	 * Records an informational entry.
	 *
	 * @param {string} message - Human-readable message.
	 * @param {*} [data=null] - Optional structured data.
	 * @param {Object} [options] - Entry options.
	 * @return {?Object} The accepted entry, or `null` when filtered.
	 */
	info( message, data = null, options = {} ) {

		return this.record( 'info', message, data, options );

	}

	/**
	 * Records a warning entry.
	 *
	 * @param {string} message - Human-readable message.
	 * @param {*} [data=null] - Optional structured data.
	 * @param {Object} [options] - Entry options.
	 * @return {?Object} The accepted entry, or `null` when filtered.
	 */
	warn( message, data = null, options = {} ) {

		return this.record( 'warn', message, data, options );

	}

	/**
	 * Records an error entry.
	 *
	 * @param {string} message - Human-readable message.
	 * @param {*} [data=null] - Optional structured data.
	 * @param {Object} [options] - Entry options.
	 * @return {?Object} The accepted entry, or `null` when filtered.
	 */
	error( message, data = null, options = {} ) {

		return this.record( 'error', message, data, options );

	}

	/**
	 * Captures a portable snapshot of a renderer's public information.
	 *
	 * @param {Object} renderer - A WebGL or WebGPU renderer.
	 * @param {string} [label='Renderer snapshot'] - Entry message.
	 * @return {?Object} The accepted diagnostic entry.
	 */
	captureRenderer( renderer, label = 'Renderer snapshot' ) {

		const info = renderer && renderer.info ? renderer.info : {};
		const render = info.render || {};
		const memory = info.memory || {};

		return this.info( label, {
			renderer: renderer && renderer.constructor ? renderer.constructor.name : 'UnknownRenderer',
			frame: render.frame,
			calls: render.calls === undefined ? render.drawCalls : render.calls,
			triangles: render.triangles,
			lines: render.lines,
			points: render.points,
			memory: {
				geometries: memory.geometries,
				textures: memory.textures,
				programs: Array.isArray( info.programs ) ? info.programs.length : undefined
			}
		}, { scope: 'renderer' } );

	}

	/**
	 * Returns entries matching optional level, scope, and timestamp filters.
	 *
	 * @param {Object} [options] - Filter options.
	 * @param {string} [options.level] - Exact entry level.
	 * @param {string} [options.scope] - Exact entry scope.
	 * @param {string} [options.since] - Inclusive ISO timestamp.
	 * @return {Array<Object>} Matching entries.
	 */
	getEntries( options = {} ) {

		const { level, scope, since } = options;

		return this.entries.filter( entry => {

			if ( level !== undefined && entry.level !== level ) return false;
			if ( scope !== undefined && entry.scope !== scope ) return false;
			if ( since !== undefined && entry.timestamp < since ) return false;

			return true;

		} );

	}

	/**
	 * Removes all retained entries.
	 *
	 * @return {Diagnostics} A reference to this instance.
	 */
	clear() {

		const count = this.entries.length;
		this.entries.length = 0;
		this.dispatchEvent( { type: 'clear', count } );

		return this;

	}

	/**
	 * Returns a serializable diagnostics snapshot.
	 *
	 * @return {Object} Diagnostics data.
	 */
	toJSON() {

		return {
			level: this.level,
			maxEntries: this.maxEntries,
			scope: this.scope,
			entries: this.entries.slice()
		};

	}

	/**
	 * Returns a formatted JSON representation.
	 *
	 * @return {string} Formatted diagnostics data.
	 */
	toString() {

		return JSON.stringify( this.toJSON(), null, 2 );

	}

	/**
	 * Trims old entries to the configured capacity.
	 *
	 * @private
	 */
	_trim() {

		const overflow = this.entries.length - this.maxEntries;

		if ( overflow > 0 ) this.entries.splice( 0, overflow );

	}

}

function _validateLevel( level ) {

	if ( DiagnosticLevel[ level ] === undefined ) {

		throw new RangeError( `Diagnostics: Unknown level "${level}".` );

	}

	return level;

}

function _validateMaxEntries( value ) {

	if ( Number.isInteger( value ) === false || value < 1 ) {

		throw new RangeError( 'Diagnostics: maxEntries must be a positive integer.' );

	}

	return value;

}

export { DiagnosticLevel, Diagnostics };
