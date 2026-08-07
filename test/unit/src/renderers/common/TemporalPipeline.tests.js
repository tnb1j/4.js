import { NoToneMapping, SRGBColorSpace } from '../../../../../src/constants.js';
import { PerspectiveCamera } from '../../../../../src/cameras/PerspectiveCamera.js';
import { Scene } from '../../../../../src/scenes/Scene.js';
import TemporalPipeline from '../../../../../src/renderers/common/TemporalPipeline.js';

export default QUnit.module( 'Renderers', () => {

	QUnit.module( 'TemporalPipeline', () => {

		function createPipeline() {

			const renderer = {
				toneMapping: NoToneMapping,
				outputColorSpace: SRGBColorSpace
			};

			return new TemporalPipeline( renderer, new Scene(), new PerspectiveCamera(), {
				resolutionScale: 0.5,
				sharpen: true,
				sharpness: 0.25
			} );

		}

		QUnit.test( 'Instancing and configuration', assert => {

			const pipeline = createPipeline();

			assert.ok( pipeline.isTemporalPipeline, 'Provides type flag.' );
			assert.equal( pipeline.getResolutionScale(), 0.5, 'Applies the internal resolution scale.' );
			assert.strictEqual( pipeline.outputNode, pipeline.sharpenNode, 'Uses sharpening as the output when enabled.' );

			pipeline.setSharpening( false );
			assert.strictEqual( pipeline.outputNode, pipeline.temporalNode, 'Can bypass sharpening.' );

			pipeline.setEnabled( false );
			assert.strictEqual( pipeline.outputNode, pipeline.scenePass, 'Can bypass temporal resolve.' );

			pipeline.setEnabled( true );
			assert.strictEqual( pipeline.outputNode, pipeline.temporalNode, 'Restores temporal resolve with the current sharpening mode.' );

			pipeline.setSharpness( 1 );
			assert.equal( pipeline.sharpenNode.sharpness.value, 1, 'Updates sharpening strength.' );

			pipeline.dispose();

		} );

		QUnit.test( 'Scene, camera, and history reset', assert => {

			const pipeline = createPipeline();
			const scene = new Scene();
			const camera = new PerspectiveCamera();

			pipeline.temporalNode._needsHistoryReset = false;
			pipeline.setScene( scene );
			assert.strictEqual( pipeline.scenePass.scene, scene, 'Updates the scene pass.' );
			assert.ok( pipeline.temporalNode._needsHistoryReset, 'Invalidates history after a scene replacement.' );

			pipeline.temporalNode._needsHistoryReset = false;
			pipeline.setCamera( camera );
			assert.strictEqual( pipeline.temporalNode.camera, camera, 'Updates the temporal camera.' );
			assert.ok( pipeline.temporalNode._needsHistoryReset, 'Invalidates history after a camera replacement.' );

			pipeline.dispose();

		} );

		QUnit.test( 'Validation', assert => {

			const pipeline = createPipeline();

			assert.throws( () => pipeline.setResolutionScale( 0 ), RangeError, 'Rejects a zero resolution scale.' );
			assert.throws( () => pipeline.setResolutionScale( 1.1 ), RangeError, 'Rejects supersampling.' );
			assert.throws( () => pipeline.setSharpness( - 1 ), RangeError, 'Rejects invalid sharpening values.' );

			pipeline.dispose();

		} );

	} );

} );
