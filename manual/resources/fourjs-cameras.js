import * as FOUR from 'fourjs';
import { threejsLessonUtils } from './fourjs-lesson-utils.js';

{

	function addShape( color, geometry ) {

		const material = new FOUR.MeshPhongMaterial( { color } );
		return new FOUR.Mesh( geometry, material );

	}

	threejsLessonUtils.addDiagrams( {
		shapeCube: {
			create() {

				const width = 8;
				const height = 8;
				const depth = 8;
				return addShape( 'hsl(150,100%,40%)', new FOUR.BoxGeometry( width, height, depth ) );

			},
		},
		shapeCone: {
			create() {

				const radius = 6;
				const height = 8;
				const segments = 24;
				return addShape( 'hsl(160,100%,40%)', new FOUR.ConeGeometry( radius, height, segments ) );

			},
		},
		shapeCylinder: {
			create() {

				const radiusTop = 4;
				const radiusBottom = 4;
				const height = 8;
				const radialSegments = 24;
				return addShape( 'hsl(170,100%,40%)', new FOUR.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments ) );

			},
		},
		shapeSphere: {
			create() {

				const radius = 5;
				const widthSegments = 24;
				const heightSegments = 16;
				return addShape( 'hsl(180,100%,40%)', new FOUR.SphereGeometry( radius, widthSegments, heightSegments ) );

			},
		},
		shapeFrustum: {
			create() {

				const width = 8;
				const height = 8;
				const depth = 8;
				const geometry = new FOUR.BoxGeometry( width, height, depth );
				const perspMat = new FOUR.Matrix4();
				perspMat.makePerspective( - 3, 3, - 3, 3, 4, 12 );
				const inMat = new FOUR.Matrix4();
				inMat.makeTranslation( 0, 0, 8 );

				const mat = new FOUR.Matrix4();
				mat.multiply( perspMat );
				mat.multiply( inMat );

				geometry.applyMatrix4( mat );
				geometry.computeBoundingBox();
				geometry.center();
				geometry.scale( 3, 3, 3 );
				geometry.rotateY( Math.PI );
				geometry.computeVertexNormals();

				return addShape( 'hsl(190,100%,40%)', geometry );

			},
		},
	} );

}
