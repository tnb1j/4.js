import RenderPipeline from './RenderPipeline.js';
import { velocity } from '../../nodes/accessors/VelocityNode.js';
import { mrt } from '../../nodes/core/MRTNode.js';
import { output } from '../../nodes/core/PropertyNode.js';
import { pass } from '../../nodes/display/PassNode.js';
import { sharpen } from '../../nodes/display/SharpenNode.js';
import { taau } from '../../nodes/display/TAAUNode.js';

/**
 * High-level temporal antialiasing and upscaling pipeline.
 *
 * The pipeline owns a lower-resolution scene pass with color, depth, and
 * velocity outputs, a TAAU history resolve, and optional contrast-adaptive
 * sharpening.
 *
 * Note: The scene pass is created with multisampling disabled because temporal
 * accumulation and MSAA must not be combined.
 *
 * @augments RenderPipeline
 */
class TemporalPipeline extends RenderPipeline {

	/**
	 * Constructs a temporal pipeline.
	 *
	 * @param {Renderer} renderer - Initialized WebGPU renderer.
	 * @param {Scene} scene - Scene to render.
	 * @param {Camera} camera - Camera to render.
	 * @param {Object} [options] - Pipeline options.
	 * @param {number} [options.resolutionScale=0.67] - Internal scene resolution scale.
	 * @param {boolean} [options.sharpen=true] - Whether sharpening is enabled.
	 * @param {boolean} [options.enabled=true] - Whether temporal resolve is enabled.
	 * @param {number} [options.sharpness=0.2] - RCAS sharpness, where zero is strongest.
	 * @param {boolean} [options.denoise=false] - Whether RCAS noise attenuation is enabled.
	 * @param {Object} [options.passOptions] - Additional scene pass render target options.
	 */
	constructor( renderer, scene, camera, options = {} ) {

		const {
			resolutionScale = 0.67,
			sharpen: sharpening = true,
			enabled = true,
			sharpness = 0.2,
			denoise = false,
			passOptions = {}
		} = options;

		const scenePass = pass( scene, camera, { ...passOptions, samples: 0 } );
		scenePass.setMRT( mrt( { output, velocity } ) );

		const colorNode = scenePass.getTextureNode( 'output' );
		const depthNode = scenePass.getTextureNode( 'depth' );
		const velocityNode = scenePass.getTextureNode( 'velocity' );
		const temporalNode = taau( colorNode, depthNode, velocityNode, camera );
		const sharpenNode = sharpen( temporalNode.getTextureNode(), sharpness, denoise );

		super( renderer, enabled ? ( sharpening ? sharpenNode : temporalNode ) : scenePass );

		/**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */
		this.isTemporalPipeline = true;

		/**
		 * Scene rendered by this pipeline.
		 *
		 * @type {Scene}
		 */
		this.scene = scene;

		/**
		 * Camera rendered by this pipeline.
		 *
		 * @type {Camera}
		 */
		this.camera = camera;

		/**
		 * Lower-resolution scene pass.
		 *
		 * @type {PassNode}
		 * @readonly
		 */
		this.scenePass = scenePass;

		/**
		 * Temporal resolve node.
		 *
		 * @type {TAAUNode}
		 * @readonly
		 */
		this.temporalNode = temporalNode;

		/**
		 * Contrast-adaptive sharpening node.
		 *
		 * @type {SharpenNode}
		 * @readonly
		 */
		this.sharpenNode = sharpenNode;

		/**
		 * Whether sharpening is enabled.
		 *
		 * @type {boolean}
		 */
		this.sharpening = Boolean( sharpening );

		/**
		 * Whether temporal resolve is enabled.
		 *
		 * @type {boolean}
		 */
		this.enabled = Boolean( enabled );

		this.setResolutionScale( resolutionScale );
		this.setSharpness( sharpness );

	}

	/**
	 * Sets the internal scene resolution scale.
	 *
	 * @param {number} resolutionScale - Value greater than zero and at most one.
	 * @return {TemporalPipeline} A reference to this pipeline.
	 */
	setResolutionScale( resolutionScale ) {

		if ( Number.isFinite( resolutionScale ) === false || resolutionScale <= 0 || resolutionScale > 1 ) {

			throw new RangeError( 'TemporalPipeline: resolutionScale must be greater than zero and at most one.' );

		}

		this.scenePass.setResolutionScale( resolutionScale );
		this.temporalNode.reset();

		return this;

	}

	/**
	 * Returns the internal scene resolution scale.
	 *
	 * @return {number} Resolution scale.
	 */
	getResolutionScale() {

		return this.scenePass.getResolutionScale();

	}

	/**
	 * Enables or disables the sharpening stage.
	 *
	 * @param {boolean} enabled - Whether sharpening is enabled.
	 * @return {TemporalPipeline} A reference to this pipeline.
	 */
	setSharpening( enabled ) {

		enabled = Boolean( enabled );

		if ( enabled !== this.sharpening ) {

			this.sharpening = enabled;
			if ( this.enabled ) this.outputNode = enabled ? this.sharpenNode : this.temporalNode;
			this.needsUpdate = true;

		}

		return this;

	}

	/**
	 * Enables temporal resolve or bypasses it with the scene pass.
	 *
	 * @param {boolean} enabled - Whether temporal resolve is enabled.
	 * @return {TemporalPipeline} A reference to this pipeline.
	 */
	setEnabled( enabled ) {

		enabled = Boolean( enabled );

		if ( enabled !== this.enabled ) {

			this.enabled = enabled;
			this.outputNode = enabled ? ( this.sharpening ? this.sharpenNode : this.temporalNode ) : this.scenePass;
			this.needsUpdate = true;

			if ( enabled ) this.temporalNode.reset();

		}

		return this;

	}

	/**
	 * Sets RCAS sharpening strength.
	 *
	 * @param {number} sharpness - Value from zero (strongest) to two (disabled).
	 * @return {TemporalPipeline} A reference to this pipeline.
	 */
	setSharpness( sharpness ) {

		if ( Number.isFinite( sharpness ) === false || sharpness < 0 || sharpness > 2 ) {

			throw new RangeError( 'TemporalPipeline: sharpness must be between zero and two.' );

		}

		this.sharpenNode.sharpness.value = sharpness;

		return this;

	}

	/**
	 * Replaces the rendered scene.
	 *
	 * @param {Scene} scene - New scene.
	 * @return {TemporalPipeline} A reference to this pipeline.
	 */
	setScene( scene ) {

		this.scene = scene;
		this.scenePass.scene = scene;
		this.temporalNode.reset();

		return this;

	}

	/**
	 * Replaces the rendered camera.
	 *
	 * @param {Camera} camera - New camera.
	 * @return {TemporalPipeline} A reference to this pipeline.
	 */
	setCamera( camera ) {

		this.camera = camera;
		this.scenePass.camera = camera;
		this.temporalNode.camera = camera;
		this.temporalNode.reset();

		return this;

	}

	/**
	 * Invalidates temporal history.
	 *
	 * Call this after camera cuts, teleports, or discontinuous scene changes.
	 *
	 * @return {TemporalPipeline} A reference to this pipeline.
	 */
	reset() {

		this.temporalNode.reset();

		return this;

	}

	/**
	 * Frees pipeline resources.
	 */
	dispose() {

		super.dispose();
		this.scenePass.dispose();
		this.temporalNode.dispose();
		this.sharpenNode.dispose();

	}

}

export default TemporalPipeline;
