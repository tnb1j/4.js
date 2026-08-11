import { init } from './shared-orbitcontrols.js';
import { EventDispatcher } from './resources/four-module.js';

function noop() {
}

class ElementProxyReceiver extends EventDispatcher {

	constructor() {

		super();
		// because OrbitControls try to set style.touchAction;
		this.style = {};
		this.ownerDocument = this;

	}
	getRootNode() {

		return this;

	}
	get clientWidth() {

		return this.width;

	}
	get clientHeight() {

		return this.height;

	}
	// OrbitControls call these as of r132. Maybe we should implement them
	setPointerCapture() { }
	releasePointerCapture() { }
	getBoundingClientRect() {

		return {
			left: this.left,
			top: this.top,
			width: this.width,
			height: this.height,
			right: this.left + this.width,
			bottom: this.top + this.height,
		};

	}
	handleEvent( data ) {

		if ( data.type === 'size' ) {

			this.left = data.left;
			this.top = data.top;
			this.width = data.width;
			this.height = data.height;
			return;

		}

		data.preventDefault = noop;
		data.stopPropagation = noop;
		this.dispatchEvent( data );

	}
	focus() {
		// no-op
	}

}

class ProxyManager {

	constructor() {

		this.targets = new Map();
		this.handleEvent = this.handleEvent.bind( this );

	}
	makeProxy( data ) {

		const { id } = data;
		if ( Number.isInteger( id ) === false || id < 0 ) {

			throw new Error( 'invalid proxy id: ' + id );

		}

		if ( this.targets.has( id ) ) {

			throw new Error( 'proxy already exists: ' + id );

		}

		const proxy = new ElementProxyReceiver();
		this.targets.set( id, proxy );

	}
	getProxy( id ) {

		const proxy = this.targets.get( id );
		if ( proxy === undefined ) {

			throw new Error( 'unknown proxy id: ' + id );

		}

		return proxy;

	}
	handleEvent( data ) {

		this.getProxy( data.id ).handleEvent( data.data );

	}

}

const proxyManager = new ProxyManager();

function start( data ) {

	const proxy = proxyManager.getProxy( data.canvasId );
	proxy.ownerDocument = proxy; // HACK!
	self.document = {}; // HACK!
	init( {
		canvas: data.canvas,
		inputElement: proxy,
	} );

}

function makeProxy( data ) {

	proxyManager.makeProxy( data );

}

self.onmessage = function ( e ) {

	switch ( e.data.type ) {

		case 'start':
			start( e.data );
			break;

		case 'makeProxy':
			makeProxy( e.data );
			break;

		case 'event':
			proxyManager.handleEvent( e.data );
			break;

		default:
			throw new Error( 'no handler for type: ' + e.data.type );

	}

};
