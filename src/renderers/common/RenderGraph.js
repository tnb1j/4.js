import { EventDispatcher } from '../../core/EventDispatcher.js';

let _passOrder = 0;

/**
 * Experimental dependency-aware execution graph for render and compute tasks.
 *
 * A pass declares explicit dependencies and optional resource reads/writes.
 * Compilation validates the graph and creates a deterministic topological
 * execution order.
 *
 * @augments EventDispatcher
 */
class RenderGraph extends EventDispatcher {

	/**
	 * Constructs an empty render graph.
	 */
	constructor() {

		super();

		/**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */
		this.isRenderGraph = true;

		/**
		 * Named graph passes.
		 *
		 * @type {Map<string,Object>}
		 */
		this.passes = new Map();

		/**
		 * Named graph resources.
		 *
		 * @type {Map<string,*>}
		 */
		this.resources = new Map();

		this._compiled = null;
		this._dirty = true;

	}

	/**
	 * Adds a graph pass.
	 *
	 * @param {string} name - Unique pass name.
	 * @param {Object|Function} descriptor - Pass descriptor or execute callback.
	 * @param {Function} [descriptor.execute] - Pass callback.
	 * @param {Array<string>} [descriptor.dependsOn] - Explicit pass dependencies.
	 * @param {Array<string>} [descriptor.reads] - Resource names read by the pass.
	 * @param {Array<string>} [descriptor.writes] - Resource names written by the pass.
	 * @param {boolean} [descriptor.enabled=true] - Whether the pass is active.
	 * @return {RenderGraph} A reference to this graph.
	 */
	addPass( name, descriptor ) {

		if ( typeof name !== 'string' || name.length === 0 ) throw new TypeError( 'RenderGraph: Pass name must be a non-empty string.' );
		if ( this.passes.has( name ) ) throw new Error( `RenderGraph: Pass "${name}" already exists.` );

		if ( typeof descriptor === 'function' ) descriptor = { execute: descriptor };
		if ( descriptor === null || typeof descriptor !== 'object' || typeof descriptor.execute !== 'function' ) {

			throw new TypeError( `RenderGraph: Pass "${name}" requires an execute function.` );

		}

		this.passes.set( name, {
			name,
			execute: descriptor.execute,
			dependsOn: _uniqueNames( descriptor.dependsOn ),
			reads: _uniqueNames( descriptor.reads ),
			writes: _uniqueNames( descriptor.writes ),
			enabled: descriptor.enabled !== false,
			order: ++ _passOrder
		} );

		this._dirty = true;

		return this;

	}

	/**
	 * Removes a graph pass.
	 *
	 * @param {string} name - Pass name.
	 * @return {boolean} Whether a pass was removed.
	 */
	removePass( name ) {

		const removed = this.passes.delete( name );

		if ( removed ) this._dirty = true;

		return removed;

	}

	/**
	 * Returns a graph pass.
	 *
	 * @param {string} name - Pass name.
	 * @return {?Object} The pass, or `null`.
	 */
	getPass( name ) {

		return this.passes.get( name ) || null;

	}

	/**
	 * Enables or disables a graph pass.
	 *
	 * @param {string} name - Pass name.
	 * @param {boolean} enabled - Enabled state.
	 * @return {RenderGraph} A reference to this graph.
	 */
	setPassEnabled( name, enabled ) {

		const pass = this.passes.get( name );

		if ( pass === undefined ) throw new Error( `RenderGraph: Unknown pass "${name}".` );

		pass.enabled = Boolean( enabled );
		this._dirty = true;

		return this;

	}

	/**
	 * Sets a named graph resource.
	 *
	 * @param {string} name - Resource name.
	 * @param {*} value - Resource value.
	 * @return {RenderGraph} A reference to this graph.
	 */
	setResource( name, value ) {

		this.resources.set( name, value );

		return this;

	}

	/**
	 * Returns a named graph resource.
	 *
	 * @param {string} name - Resource name.
	 * @return {*} Resource value.
	 */
	getResource( name ) {

		return this.resources.get( name );

	}

	/**
	 * Deletes a named graph resource.
	 *
	 * @param {string} name - Resource name.
	 * @return {boolean} Whether the resource was removed.
	 */
	deleteResource( name ) {

		return this.resources.delete( name );

	}

	/**
	 * Validates and compiles the graph.
	 *
	 * @return {Array<Object>} Ordered enabled passes.
	 */
	compile() {

		const activePasses = Array.from( this.passes.values() ).filter( pass => pass.enabled );
		const activeNames = new Set( activePasses.map( pass => pass.name ) );
		const producers = new Map();
		const edges = new Map();
		const indegree = new Map();

		for ( const pass of activePasses ) {

			edges.set( pass.name, new Set() );
			indegree.set( pass.name, 0 );

			for ( const resource of pass.writes ) {

				const producer = producers.get( resource );

				if ( producer !== undefined ) {

					throw new Error( `RenderGraph: Resource "${resource}" is written by both "${producer}" and "${pass.name}".` );

				}

				producers.set( resource, pass.name );

			}

		}

		const addEdge = ( from, to ) => {

			if ( from === to || edges.get( from ).has( to ) ) return;

			edges.get( from ).add( to );
			indegree.set( to, indegree.get( to ) + 1 );

		};

		for ( const pass of activePasses ) {

			for ( const dependency of pass.dependsOn ) {

				if ( this.passes.has( dependency ) === false ) {

					throw new Error( `RenderGraph: Pass "${pass.name}" depends on missing pass "${dependency}".` );

				}

				if ( activeNames.has( dependency ) === false ) {

					throw new Error( `RenderGraph: Pass "${pass.name}" depends on disabled pass "${dependency}".` );

				}

				addEdge( dependency, pass.name );

			}

			for ( const resource of pass.reads ) {

				const producer = producers.get( resource );

				if ( producer !== undefined ) addEdge( producer, pass.name );

			}

		}

		const ready = activePasses
			.filter( pass => indegree.get( pass.name ) === 0 )
			.sort( ( a, b ) => a.order - b.order );
		const compiled = [];

		while ( ready.length > 0 ) {

			const pass = ready.shift();
			compiled.push( pass );

			for ( const dependent of edges.get( pass.name ) ) {

				indegree.set( dependent, indegree.get( dependent ) - 1 );

				if ( indegree.get( dependent ) === 0 ) {

					ready.push( this.passes.get( dependent ) );
					ready.sort( ( a, b ) => a.order - b.order );

				}

			}

		}

		if ( compiled.length !== activePasses.length ) {

			const unresolved = activePasses.filter( pass => compiled.includes( pass ) === false ).map( pass => pass.name );
			throw new Error( `RenderGraph: Cycle detected involving ${unresolved.join( ', ' )}.` );

		}

		this._compiled = compiled;
		this._dirty = false;
		this.dispatchEvent( { type: 'compile', passes: compiled.slice() } );

		return compiled.slice();

	}

	/**
	 * Executes enabled passes in compiled order.
	 *
	 * @async
	 * @param {Object} [context] - Application-defined execution context.
	 * @return {Promise<Map<string,*>>} The graph resource map.
	 */
	async execute( context = {} ) {

		const passes = this._dirty || this._compiled === null ? this.compile() : this._compiled;

		this.dispatchEvent( { type: 'start', context } );

		for ( const pass of passes ) {

			this.dispatchEvent( { type: 'passstart', pass, context } );

			const write = ( name, value ) => {

				if ( pass.writes.includes( name ) === false ) {

					throw new Error( `RenderGraph: Pass "${pass.name}" did not declare write access to "${name}".` );

				}

				this.resources.set( name, value );

				return value;

			};

			try {

				const result = await pass.execute( {
					graph: this,
					pass,
					context,
					resources: this.resources,
					read: name => this.resources.get( name ),
					write
				} );

				if ( result !== undefined ) {

					if ( pass.writes.length === 1 && ( result === null || typeof result !== 'object' || Array.isArray( result ) ) ) {

						this.resources.set( pass.writes[ 0 ], result );

					} else if ( result !== null && typeof result === 'object' ) {

						for ( const name of pass.writes ) {

							if ( Object.prototype.hasOwnProperty.call( result, name ) ) this.resources.set( name, result[ name ] );

						}

					}

				}

				this.dispatchEvent( { type: 'passend', pass, context } );

			} catch ( error ) {

				this.dispatchEvent( { type: 'error', pass, context, error } );
				throw error;

			}

		}

		this.dispatchEvent( { type: 'complete', context, resources: this.resources } );

		return this.resources;

	}

	/**
	 * Returns the current pass order by name.
	 *
	 * @return {Array<string>} Ordered pass names.
	 */
	getExecutionOrder() {

		const passes = this._dirty || this._compiled === null ? this.compile() : this._compiled;

		return passes.map( pass => pass.name );

	}

	/**
	 * Removes all passes and resources.
	 *
	 * @return {RenderGraph} A reference to this graph.
	 */
	clear() {

		this.passes.clear();
		this.resources.clear();
		this._compiled = null;
		this._dirty = true;

		return this;

	}

	/**
	 * Returns serializable graph metadata.
	 *
	 * @return {Object} Graph metadata.
	 */
	toJSON() {

		return {
			passes: Array.from( this.passes.values() ).map( pass => ( {
				name: pass.name,
				dependsOn: pass.dependsOn.slice(),
				reads: pass.reads.slice(),
				writes: pass.writes.slice(),
				enabled: pass.enabled
			} ) ),
			resources: Array.from( this.resources.keys() )
		};

	}

}

function _uniqueNames( value ) {

	if ( value === undefined ) return [];
	if ( Array.isArray( value ) === false ) throw new TypeError( 'RenderGraph: Pass dependencies and resource declarations must be arrays.' );

	return Array.from( new Set( value.map( name => String( name ) ) ) );

}

export default RenderGraph;
