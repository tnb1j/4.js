import { state, init, pickPosition } from './shared-picking.js';

function size( data ) {

	state.width = data.width;
	state.height = data.height;

}

function mouse( data ) {

	pickPosition.x = data.x;
	pickPosition.y = data.y;

}

self.onmessage = function ( e ) {

	switch ( e.data.type ) {

		case 'init':
			init( e.data );
			break;

		case 'mouse':
			mouse( e.data );
			break;

		case 'size':
			size( e.data );
			break;

		default:
			throw new Error( 'no handler for type: ' + e.data.type );

	}

};
