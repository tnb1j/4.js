import { REVISION } from '../constants.js';

const WEBGPU_LIMITS = [
	'maxTextureDimension1D',
	'maxTextureDimension2D',
	'maxTextureDimension3D',
	'maxTextureArrayLayers',
	'maxBindGroups',
	'maxBindingsPerBindGroup',
	'maxDynamicUniformBuffersPerPipelineLayout',
	'maxDynamicStorageBuffersPerPipelineLayout',
	'maxSampledTexturesPerShaderStage',
	'maxSamplersPerShaderStage',
	'maxStorageBuffersPerShaderStage',
	'maxStorageTexturesPerShaderStage',
	'maxUniformBuffersPerShaderStage',
	'maxUniformBufferBindingSize',
	'maxStorageBufferBindingSize',
	'maxBufferSize',
	'maxVertexBuffers',
	'maxVertexAttributes',
	'maxVertexBufferArrayStride',
	'maxInterStageShaderVariables',
	'maxColorAttachments',
	'maxColorAttachmentBytesPerSample',
	'maxComputeWorkgroupStorageSize',
	'maxComputeInvocationsPerWorkgroup',
	'maxComputeWorkgroupSizeX',
	'maxComputeWorkgroupSizeY',
	'maxComputeWorkgroupSizeZ',
	'maxComputeWorkgroupsPerDimension'
];

/**
 * Produces portable, serializable graphics capability reports.
 *
 * The synchronous constructor captures environment, renderer, and WebGL data.
 * Call {@link CapabilitiesReport#refresh `refresh()`} with
 * `requestAdapter: true` to request optional WebGPU adapter details.
 */
class CapabilitiesReport {

	/**
	 * Constructs a capability report.
	 *
	 * @param {Object} [options] - Collection options.
	 * @param {?Object} [options.renderer=null] - Optional renderer.
	 * @param {?HTMLCanvasElement} [options.canvas=null] - Optional canvas used for WebGL probing.
	 * @param {?WebGL2RenderingContext} [options.context=null] - Optional WebGL context.
	 * @param {boolean} [options.probeWebGL=true] - Whether to create a WebGL2 context when needed.
	 * @param {?Object} [options.globalObject=null] - Optional global object for testing or isolation.
	 */
	constructor( options = {} ) {

		/**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */
		this.isCapabilitiesReport = true;

		/**
		 * The latest serializable report data.
		 *
		 * @type {Object}
		 */
		this.data = {};

		/**
		 * Collection options retained for refreshes.
		 *
		 * @private
		 * @type {Object}
		 */
		this._options = { ...options };

		this._collectSync( this._options );

	}

	/**
	 * Refreshes the report and optionally requests WebGPU adapter information.
	 *
	 * @async
	 * @param {Object} [options] - Options merged with constructor options.
	 * @param {boolean} [options.requestAdapter=false] - Whether to request a WebGPU adapter.
	 * @param {string} [options.powerPreference] - Optional WebGPU power preference.
	 * @param {?GPUAdapter} [options.adapter=null] - Existing adapter to inspect.
	 * @return {Promise<CapabilitiesReport>} A promise resolving to this report.
	 */
	async refresh( options = {} ) {

		this._options = { ...this._options, ...options };
		this._collectSync( this._options );

		const globalObject = this._options.globalObject || globalThis;
		const navigatorObject = this._options.navigator || globalObject.navigator;
		let adapter = this._options.adapter || null;

		if (
			adapter === null &&
			this._options.requestAdapter === true &&
			navigatorObject &&
			navigatorObject.gpu &&
			typeof navigatorObject.gpu.requestAdapter === 'function'
		) {

			try {

				adapter = await navigatorObject.gpu.requestAdapter( {
					powerPreference: this._options.powerPreference
				} );

			} catch ( error ) {

				this.data.webgpu.adapterError = error.message;

			}

		}

		if ( adapter !== null ) this.data.webgpu.adapter = _collectAdapter( adapter );

		return this;

	}

	/**
	 * Returns a detached serializable report object.
	 *
	 * @return {Object} Capability report data.
	 */
	toJSON() {

		return JSON.parse( JSON.stringify( this.data ) );

	}

	/**
	 * Returns formatted JSON suitable for bug reports.
	 *
	 * @return {string} Formatted report data.
	 */
	toString() {

		return JSON.stringify( this.data, null, 2 );

	}

	/**
	 * Creates and refreshes a report.
	 *
	 * @async
	 * @param {Object} [options] - Collection options.
	 * @return {Promise<CapabilitiesReport>} The populated report.
	 */
	static async generate( options = {} ) {

		const report = new CapabilitiesReport( options );

		return report.refresh( options );

	}

	/**
	 * Performs synchronous collection.
	 *
	 * @private
	 * @param {Object} options - Collection options.
	 */
	_collectSync( options ) {

		const globalObject = options.globalObject || globalThis;
		const navigatorObject = options.navigator || globalObject.navigator;
		const renderer = options.renderer || null;

		this.data = {
			library: {
				name: '4.js',
				revision: REVISION
			},
			generatedAt: new Date().toISOString(),
			environment: _collectEnvironment( globalObject, navigatorObject ),
			renderer: _collectRenderer( renderer ),
			webgl: _collectWebGL( options, globalObject, renderer ),
			webgpu: {
				supported: Boolean( navigatorObject && navigatorObject.gpu )
			}
		};

	}

}

function _collectEnvironment( globalObject, navigatorObject ) {

	return {
		userAgent: navigatorObject ? navigatorObject.userAgent : undefined,
		platform: navigatorObject ? navigatorObject.platform : undefined,
		language: navigatorObject ? navigatorObject.language : undefined,
		hardwareConcurrency: navigatorObject ? navigatorObject.hardwareConcurrency : undefined,
		deviceMemory: navigatorObject ? navigatorObject.deviceMemory : undefined,
		secureContext: globalObject.isSecureContext,
		crossOriginIsolated: globalObject.crossOriginIsolated,
		devicePixelRatio: globalObject.devicePixelRatio
	};

}

function _collectRenderer( renderer ) {

	if ( renderer === null ) return null;

	const capabilities = renderer.capabilities || {};

	return {
		type: renderer.constructor ? renderer.constructor.name : 'UnknownRenderer',
		webgl: renderer.isWebGLRenderer === true,
		webgpu: renderer.isWebGPURenderer === true,
		outputColorSpace: renderer.outputColorSpace,
		toneMapping: renderer.toneMapping,
		maxAnisotropy: typeof capabilities.getMaxAnisotropy === 'function' ? capabilities.getMaxAnisotropy() : undefined,
		precision: capabilities.precision,
		logarithmicDepthBuffer: capabilities.logarithmicDepthBuffer,
		reverseDepthBuffer: capabilities.reverseDepthBuffer
	};

}

function _collectWebGL( options, globalObject, renderer ) {

	let context = options.context || null;

	if ( context === null && renderer && renderer.isWebGLRenderer === true && typeof renderer.getContext === 'function' ) {

		context = renderer.getContext();

	}

	if ( context === null && options.probeWebGL !== false ) {

		const documentObject = options.document || globalObject.document;
		const canvas = options.canvas || ( documentObject && typeof documentObject.createElement === 'function' ? documentObject.createElement( 'canvas' ) : null );

		if ( canvas && typeof canvas.getContext === 'function' ) {

			try {

				context = canvas.getContext( 'webgl2' );

			} catch ( error ) {

				return {
					supported: false,
					error: error.message
				};

			}

		}

	}

	if ( context === null ) return { supported: false };

	const debugInfo = context.getExtension( 'WEBGL_debug_renderer_info' );
	const parameter = name => context.getParameter( context[ name ] );

	return {
		supported: true,
		version: parameter( 'VERSION' ),
		shadingLanguageVersion: parameter( 'SHADING_LANGUAGE_VERSION' ),
		vendor: debugInfo ? context.getParameter( debugInfo.UNMASKED_VENDOR_WEBGL ) : parameter( 'VENDOR' ),
		renderer: debugInfo ? context.getParameter( debugInfo.UNMASKED_RENDERER_WEBGL ) : parameter( 'RENDERER' ),
		limits: {
			maxTextureSize: parameter( 'MAX_TEXTURE_SIZE' ),
			maxCubeMapTextureSize: parameter( 'MAX_CUBE_MAP_TEXTURE_SIZE' ),
			maxRenderbufferSize: parameter( 'MAX_RENDERBUFFER_SIZE' ),
			maxVertexAttribs: parameter( 'MAX_VERTEX_ATTRIBS' ),
			maxVertexTextureImageUnits: parameter( 'MAX_VERTEX_TEXTURE_IMAGE_UNITS' ),
			maxTextureImageUnits: parameter( 'MAX_TEXTURE_IMAGE_UNITS' ),
			maxCombinedTextureImageUnits: parameter( 'MAX_COMBINED_TEXTURE_IMAGE_UNITS' ),
			maxSamples: parameter( 'MAX_SAMPLES' ),
			maxUniformBufferBindings: parameter( 'MAX_UNIFORM_BUFFER_BINDINGS' )
		}
	};

}

function _collectAdapter( adapter ) {

	const limits = {};

	for ( const name of WEBGPU_LIMITS ) {

		if ( adapter.limits && adapter.limits[ name ] !== undefined ) limits[ name ] = adapter.limits[ name ];

	}

	const info = adapter.info || {};

	return {
		info: {
			vendor: info.vendor,
			architecture: info.architecture,
			device: info.device,
			description: info.description
		},
		features: adapter.features ? Array.from( adapter.features ).sort() : [],
		limits,
		isFallbackAdapter: adapter.isFallbackAdapter
	};

}

export { CapabilitiesReport };
