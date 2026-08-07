import * as FOUR from '../../../build/4.module.js';

let camera, scene, renderer, group;

function init( canvas, width, height, pixelRatio, path ) {

	camera = new FOUR.PerspectiveCamera( 40, width / height, 1, 1000 );
	camera.position.z = 200;

	scene = new FOUR.Scene();
	scene.fog = new FOUR.Fog( 0x444466, 100, 400 );
	scene.background = new FOUR.Color( 0x444466 );

	group = new FOUR.Group();
	scene.add( group );

	// we don't use ImageLoader since it has a DOM dependency (HTML5 image element)

	const loader = new FOUR.ImageBitmapLoader().setPath( path );
	loader.setOptions( { imageOrientation: 'flipY' } );
	loader.load( 'textures/matcaps/matcap-porcelain-white.jpg', function ( imageBitmap ) {

		const texture = new FOUR.CanvasTexture( imageBitmap );

		const geometry = new FOUR.IcosahedronGeometry( 5, 8 );
		const materials = [
			new FOUR.MeshMatcapMaterial( { color: 0xaa24df, matcap: texture } ),
			new FOUR.MeshMatcapMaterial( { color: 0x605d90, matcap: texture } ),
			new FOUR.MeshMatcapMaterial( { color: 0xe04a3f, matcap: texture } ),
			new FOUR.MeshMatcapMaterial( { color: 0xe30456, matcap: texture } )
		];

		for ( let i = 0; i < 100; i ++ ) {

			const material = materials[ i % materials.length ];
			const mesh = new FOUR.Mesh( geometry, material );
			mesh.position.x = random() * 200 - 100;
			mesh.position.y = random() * 200 - 100;
			mesh.position.z = random() * 200 - 100;
			mesh.scale.setScalar( random() + 1 );
			group.add( mesh );

		}

		renderer = new FOUR.WebGLRenderer( { antialias: true, canvas: canvas } );
		renderer.setPixelRatio( pixelRatio );
		renderer.setSize( width, height, false );

		animate();

	} );

}

function animate() {

	// group.rotation.x = Date.now() / 4000;
	group.rotation.y = - Date.now() / 4000;

	renderer.render( scene, camera );

	if ( self.requestAnimationFrame ) {

		self.requestAnimationFrame( animate );

	} else {

		// Firefox

	}

}

// PRNG

let seed = 1;

function random() {

	const x = Math.sin( seed ++ ) * 10000;

	return x - Math.floor( x );

}

export default init;
