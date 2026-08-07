import * as FOUR from '@fourjs/core';
import { threejsLessonUtils } from './fourjs-lesson-utils.js';

{

	function makeSphere( widthDivisions, heightDivisions ) {

		const radius = 7;
		return new FOUR.SphereGeometry( radius, widthDivisions, heightDivisions );

	}

	const highPolySphereGeometry = function () {

		const widthDivisions = 100;
		const heightDivisions = 50;
		return makeSphere( widthDivisions, heightDivisions );

	}();

	const lowPolySphereGeometry = function () {

		const widthDivisions = 12;
		const heightDivisions = 9;
		return makeSphere( widthDivisions, heightDivisions );

	}();

	function smoothOrFlat( flatShading, radius = 7 ) {

		const widthDivisions = 12;
		const heightDivisions = 9;
		const geometry = new FOUR.SphereGeometry( radius, widthDivisions, heightDivisions );
		const material = new FOUR.MeshPhongMaterial( {
			flatShading,
			color: 'hsl(300,50%,50%)',
		} );
		return new FOUR.Mesh( geometry, material );

	}

	function basicLambertPhongExample( MaterialCtor, lowPoly, params = {} ) {

		const geometry = lowPoly ? lowPolySphereGeometry : highPolySphereGeometry;
		const material = new MaterialCtor( {
			color: 'hsl(210,50%,50%)',
			...params,
		} );
		return {
			obj3D: new FOUR.Mesh( geometry, material ),
			trackball: lowPoly,
		};

	}

	function sideExample( side ) {

		const base = new FOUR.Object3D();
		const size = 6;
		const geometry = new FOUR.PlaneGeometry( size, size );
		[
			{ position: [ - 1, 0, 0 ], up: [ 0, 1, 0 ], },
			{ position: [ 1, 0, 0 ], up: [ 0, - 1, 0 ], },
			{ position: [ 0, - 1, 0 ], up: [ 0, 0, - 1 ], },
			{ position: [ 0, 1, 0 ], up: [ 0, 0, 1 ], },
			{ position: [ 0, 0, - 1 ], up: [ 1, 0, 0 ], },
			{ position: [ 0, 0, 1 ], up: [ - 1, 0, 0 ], },
		].forEach( ( settings, ndx ) => {

			const material = new FOUR.MeshBasicMaterial( { side } );
			material.color.setHSL( ndx / 6, .5, .5 );
			const mesh = new FOUR.Mesh( geometry, material );
			mesh.up.set( ...settings.up );
			mesh.lookAt( ...settings.position );
			mesh.position.set( ...settings.position ).multiplyScalar( size * .75 );
			base.add( mesh );

		} );
		return base;

	}

	function makeStandardPhysicalMaterialGrid( elem, physical, update ) {

		const numMetal = 5;
		const numRough = 7;
		const meshes = [];
		const MatCtor = physical ? FOUR.MeshPhysicalMaterial : FOUR.MeshStandardMaterial;
		const color = physical ? 'hsl(160,50%,50%)' : 'hsl(140,50%,50%)';
		for ( let m = 0; m < numMetal; ++ m ) {

			const row = [];
			for ( let r = 0; r < numRough; ++ r ) {

				const material = new MatCtor( {
					color,
					roughness: r / ( numRough - 1 ),
					metalness: 1 - m / ( numMetal - 1 ),
				} );
				const mesh = new FOUR.Mesh( highPolySphereGeometry, material );
				row.push( mesh );

			}

			meshes.push( row );

		}

		return {
			obj3D: null,
			trackball: false,
			render( renderInfo ) {

				const { camera, scene, renderer } = renderInfo;
				const rect = elem.getBoundingClientRect();

				const width = ( rect.right - rect.left ) * renderInfo.pixelRatio;
				const height = ( rect.bottom - rect.top ) * renderInfo.pixelRatio;
				const left = rect.left * renderInfo.pixelRatio;
				const bottom = ( renderer.domElement.clientHeight - rect.bottom ) * renderInfo.pixelRatio;

				const cellSize = Math.min( width / numRough, height / numMetal ) | 0;
				const xOff = ( width - cellSize * numRough ) / 2;
				const yOff = ( height - cellSize * numMetal ) / 2;

				camera.aspect = 1;
				camera.updateProjectionMatrix();

				if ( update ) {

					update( meshes );

				}

				for ( let m = 0; m < numMetal; ++ m ) {

					for ( let r = 0; r < numRough; ++ r ) {

						const x = left + xOff + r * cellSize;
						const y = bottom + yOff + m * cellSize;
						renderer.setViewport( x, y, cellSize, cellSize );
						renderer.setScissor( x, y, cellSize, cellSize );
						const mesh = meshes[ m ][ r ];
						scene.add( mesh );
						renderer.render( scene, camera );
						scene.remove( mesh );

					}

				}

			},
		};

	}

	threejsLessonUtils.addDiagrams( {
		smoothShading: {
			create() {

				return smoothOrFlat( false );

			},
		},
		flatShading: {
			create() {

				return smoothOrFlat( true );

			},
		},
		MeshBasicMaterial: {
			create() {

				return basicLambertPhongExample( FOUR.MeshBasicMaterial );

			},
		},
		MeshLambertMaterial: {
			create() {

				return basicLambertPhongExample( FOUR.MeshLambertMaterial );

			},
		},
		MeshPhongMaterial: {
			create() {

				return basicLambertPhongExample( FOUR.MeshPhongMaterial );

			},
		},
		MeshBasicMaterialLowPoly: {
			create() {

				return basicLambertPhongExample( FOUR.MeshBasicMaterial, true );

			},
		},
		MeshLambertMaterialLowPoly: {
			create() {

				return basicLambertPhongExample( FOUR.MeshLambertMaterial, true );

			},
		},
		MeshPhongMaterialLowPoly: {
			create() {

				return basicLambertPhongExample( FOUR.MeshPhongMaterial, true );

			},
		},
		MeshPhongMaterialShininess0: {
			create() {

				return basicLambertPhongExample( FOUR.MeshPhongMaterial, false, {
					color: 'red',
					shininess: 0,
				} );

			},
		},
		MeshPhongMaterialShininess30: {
			create() {

				return basicLambertPhongExample( FOUR.MeshPhongMaterial, false, {
					color: 'red',
					shininess: 30,
				} );

			},
		},
		MeshPhongMaterialShininess150: {
			create() {

				return basicLambertPhongExample( FOUR.MeshPhongMaterial, false, {
					color: 'red',
					shininess: 150,
				} );

			},
		},
		MeshBasicMaterialCompare: {
			create() {

				return basicLambertPhongExample( FOUR.MeshBasicMaterial, false, {
					color: 'purple',
				} );

			},
		},
		MeshLambertMaterialCompare: {
			create() {

				return basicLambertPhongExample( FOUR.MeshLambertMaterial, false, {
					color: 'black',
					emissive: 'purple',
				} );

			},
		},
		MeshPhongMaterialCompare: {
			create() {

				return basicLambertPhongExample( FOUR.MeshPhongMaterial, false, {
					color: 'black',
					emissive: 'purple',
					shininess: 0,
				} );

			},
		},
		MeshToonMaterial: {
			create() {

				return basicLambertPhongExample( FOUR.MeshToonMaterial );

			},
		},
		MeshStandardMaterial: {
			create( props ) {

				return makeStandardPhysicalMaterialGrid( props.renderInfo.elem, false );

			},
		},
		MeshPhysicalMaterial: {
			create( props ) {

				const settings = {
					clearcoat: .5,
					clearcoatRoughness: 0,
				};

				function addElem( parent, type, style = {} ) {

					const elem = document.createElement( type );
					Object.assign( elem.style, style );
					parent.appendChild( elem );
					return elem;

				}

				function addRange( elem, obj, prop, min, max ) {

					const outer = addElem( elem, 'div', {
						width: '100%',
						textAlign: 'center',
						'font-family': 'monospace',
					} );

					const div = addElem( outer, 'div', {
						textAlign: 'left',
						display: 'inline-block',
					} );

					const label = addElem( div, 'label', {
						display: 'inline-block',
						width: '12em',
					} );
					label.textContent = prop;

					const num = addElem( div, 'div', {
						display: 'inline-block',
						width: '3em',
					} );

					function updateNum() {

						num.textContent = obj[ prop ].toFixed( 2 );

					}

					updateNum();

					const input = addElem( div, 'input', {
					} );
					Object.assign( input, {
						type: 'range',
						min: 0,
						max: 100,
						value: ( obj[ prop ] - min ) / ( max - min ) * 100,
					} );
					input.addEventListener( 'input', () => {

						obj[ prop ] = min + ( max - min ) * input.value / 100;
						updateNum();

					} );

				}

				const { elem } = props.renderInfo;
				addRange( elem, settings, 'clearcoat', 0, 1 );
				addRange( elem, settings, 'clearcoatRoughness', 0, 1 );
				const area = addElem( elem, 'div', {
					width: '100%',
					height: '400px',
				} );

				return makeStandardPhysicalMaterialGrid( area, true, ( meshes ) => {

					meshes.forEach( row => row.forEach( mesh => {

						mesh.material.clearcoat = settings.clearcoat;
						mesh.material.clearcoatRoughness = settings.clearcoatRoughness;

					} ) );

				} );

			},
		},
		MeshDepthMaterial: {
			create( props ) {

				const { camera } = props;
				const radius = 4;
				const tube = 1.5;
				const radialSegments = 8;
				const tubularSegments = 64;
				const p = 2;
				const q = 3;
				const geometry = new FOUR.TorusKnotGeometry( radius, tube, tubularSegments, radialSegments, p, q );
				const material = new FOUR.MeshDepthMaterial();
				camera.near = 7;
				camera.far = 20;
				return new FOUR.Mesh( geometry, material );

			},
		},
		MeshNormalMaterial: {
			create() {

				const radius = 4;
				const tube = 1.5;
				const radialSegments = 8;
				const tubularSegments = 64;
				const p = 2;
				const q = 3;
				const geometry = new FOUR.TorusKnotGeometry( radius, tube, tubularSegments, radialSegments, p, q );
				const material = new FOUR.MeshNormalMaterial();
				return new FOUR.Mesh( geometry, material );

			},
		},
		sideDefault: {
			create() {

				return sideExample( FOUR.FrontSide );

			},
		},
		sideDouble: {
			create() {

				return sideExample( FOUR.DoubleSide );

			},
		},
	} );

}

