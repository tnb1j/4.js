import * as FOUR from '../../src/Four.WebGPU.js';

let camera, scene, renderer;

init();

function init() {

	camera = new FOUR.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );

	scene = new FOUR.Scene();

	renderer = new FOUR.WebGPURenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animation );
	document.body.appendChild( renderer.domElement );

}

function animation( ) {

	renderer.render( scene, camera );

}
