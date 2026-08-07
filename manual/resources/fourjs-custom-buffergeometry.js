import * as FOUR from '@tnb1j/4js';
import { threejsLessonUtils } from './fourjs-lesson-utils.js';

{

	const loader = new FOUR.TextureLoader();
	const texture = loader.load( '/manual/examples/resources/images/star-light.png' );
	texture.wrapS = FOUR.RepeatWrapping;
	texture.wrapT = FOUR.RepeatWrapping;
	texture.repeat.set( 3, 1 );

	function makeMesh( geometry ) {

		const material = new FOUR.MeshPhongMaterial( {
			color: 'hsl(300,50%,50%)',
			side: FOUR.DoubleSide,
			map: texture,
		} );
		return new FOUR.Mesh( geometry, material );

	}

	threejsLessonUtils.addDiagrams( {
		geometryCylinder: {
			create() {

				return new FOUR.Object3D();

			},
		},
		bufferGeometryCylinder: {
			create() {

				const numSegments = 24;
				const positions = [];
				const uvs = [];
				for ( let s = 0; s <= numSegments; ++ s ) {

					const u = s / numSegments;
					const a = u * Math.PI * 2;
					const x = Math.sin( a );
					const z = Math.cos( a );
					positions.push( x, - 1, z );
					positions.push( x, 1, z );
					uvs.push( u, 0 );
					uvs.push( u, 1 );

				}

				const indices = [];
				for ( let s = 0; s < numSegments; ++ s ) {

					const ndx = s * 2;
					indices.push(
						ndx, ndx + 2, ndx + 1,
						ndx + 1, ndx + 2, ndx + 3,
					);

				}

				const positionNumComponents = 3;
				const uvNumComponents = 2;
				const geometry = new FOUR.BufferGeometry();
				geometry.setAttribute(
					'position',
					new FOUR.BufferAttribute( new Float32Array( positions ), positionNumComponents ) );
				geometry.setAttribute(
					'uv',
					new FOUR.BufferAttribute( new Float32Array( uvs ), uvNumComponents ) );

				geometry.setIndex( indices );
				geometry.computeVertexNormals();
				geometry.scale( 5, 5, 5 );
				return makeMesh( geometry );

			},
		},
	} );

}
