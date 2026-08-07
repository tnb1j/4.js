import * as FOUR from '@fourjs/core';
import { OrbitControls } from '../../examples/jsm/controls/OrbitControls.js';
import { threejsLessonUtils } from './fourjs-lesson-utils.js';

{

	function makeCheckerTexture( repeats ) {

		const data = new Uint8Array( [
			0x88, 0x88, 0x88, 0xFF, 0xCC, 0xCC, 0xCC, 0xFF,
			0xCC, 0xCC, 0xCC, 0xFF, 0x88, 0x88, 0x88, 0xFF
		] );
		const width = 2;
		const height = 2;
		const texture = new FOUR.DataTexture( data, width, height );
		texture.needsUpdate = true;
		texture.wrapS = FOUR.RepeatWrapping;
		texture.wrapT = FOUR.RepeatWrapping;
		texture.repeat.set( repeats / 2, repeats / 2 );
		return texture;

	}

	const makeScene = function () {

		const cubeSize = 4;
		const cubeGeo = new FOUR.BoxGeometry( cubeSize, cubeSize, cubeSize );
		const cubeMat = new FOUR.MeshPhongMaterial( { color: '#8AC' } );

		const sphereRadius = 3;
		const sphereWidthDivisions = 32;
		const sphereHeightDivisions = 16;
		const sphereGeo = new FOUR.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
		const sphereMat = new FOUR.MeshPhongMaterial( { color: '#CA8' } );

		const planeSize = 40;
		const planeGeo = new FOUR.PlaneGeometry( planeSize, planeSize );
		const planeMat = new FOUR.MeshPhongMaterial( {
			map: makeCheckerTexture( planeSize ),
			side: FOUR.DoubleSide,
		} );

		return function ( renderInfo ) {

			const { scene, camera, elem } = renderInfo;
			const controls = new OrbitControls( camera, elem );
			controls.enableDamping = true;
			controls.enablePanning = false;
			scene.background = new FOUR.Color( 'black' );
			{

				const mesh = new FOUR.Mesh( cubeGeo, cubeMat );
				mesh.position.set( cubeSize + 1, cubeSize / 2, - cubeSize - 1 );
				scene.add( mesh );

			}

			{

				const mesh = new FOUR.Mesh( sphereGeo, sphereMat );
				mesh.position.set( - sphereRadius - 1, sphereRadius + 2, - sphereRadius + 1 );
				scene.add( mesh );

			}

			{

				const mesh = new FOUR.Mesh( planeGeo, planeMat );
				mesh.rotation.x = Math.PI * - .5;
				scene.add( mesh );

			}

			return {
				trackball: false,
				lights: false,
				update() {

					controls.update();

				},
			};

		};

	}();

	threejsLessonUtils.addDiagrams( {
		directionalOnly: {
			create( props ) {

				const { scene, renderInfo } = props;
				const result = makeScene( renderInfo );
				{

					const light = new FOUR.DirectionalLight( 0xFFFFFF, 1 );
					light.position.set( 5, 10, 0 );
					scene.add( light );

				}

				{

					const light = new FOUR.AmbientLight( 0xFFFFFF, .6 );
					scene.add( light );

				}

				return result;

			},
		},
		directionalPlusHemisphere: {
			create( props ) {

				const { scene, renderInfo } = props;
				const result = makeScene( renderInfo );
				{

					const light = new FOUR.DirectionalLight( 0xFFFFFF, 1 );
					light.position.set( 5, 10, 0 );
					scene.add( light );

				}

				{

					const skyColor = 0xB1E1FF; // light blue
					const groundColor = 0xB97A20; // brownish orange
					const intensity = .6;
					const light = new FOUR.HemisphereLight( skyColor, groundColor, intensity );
					scene.add( light );

				}

				return result;

			},
		},
	} );

}
