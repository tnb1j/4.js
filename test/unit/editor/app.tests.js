import * as FOUR from '@tnb1j/4js';
import { getShadowMapType } from '../../../editor/js/libs/app.js';

// app.js expects the FOUR namespace to be available on the global scope.
window.FOUR = FOUR;

export default QUnit.module( 'Editor', () => {

	QUnit.module( 'APP.Player', () => {

		QUnit.test( 'getShadowMapType migrates deprecated PCFSoftShadowMap', ( assert ) => {

			const project = { shadowType: FOUR.PCFSoftShadowMap };

			assert.equal( getShadowMapType( project.shadowType ), FOUR.PCFShadowMap, 'shadowType 2 is applied to the renderer as PCFShadowMap ( 1 )' );

		} );

		QUnit.test( 'getShadowMapType passes through supported types', ( assert ) => {

			assert.equal( getShadowMapType( FOUR.BasicShadowMap ), FOUR.BasicShadowMap, 'BasicShadowMap is unchanged' );
			assert.equal( getShadowMapType( FOUR.PCFShadowMap ), FOUR.PCFShadowMap, 'PCFShadowMap is unchanged' );
			assert.equal( getShadowMapType( FOUR.VSMShadowMap ), FOUR.VSMShadowMap, 'VSMShadowMap is unchanged' );

		} );

	} );

} );
