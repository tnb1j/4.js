import { init, state } from './shared-cubes.js';

function size( data ) {

	state.width = data.width;
	state.height = data.height;

}

self.onmessage = function ( e ) {

	switch ( e.data.type ) {

		case 'init':
			init( e.data );
			break;

		case 'size':
			size( e.data );
			break;

		default:
			throw new Error( 'no handler for type: ' + e.data.type );

	}

};
