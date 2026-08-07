import { CapabilitiesReport } from '../../../../src/core/CapabilitiesReport.js';

export default QUnit.module( 'Core', () => {

	QUnit.module( 'CapabilitiesReport', () => {

		QUnit.test( 'Synchronous collection', assert => {

			const report = new CapabilitiesReport( {
				globalObject: {
					isSecureContext: true,
					crossOriginIsolated: false,
					devicePixelRatio: 2
				},
				navigator: {
					userAgent: '4.js test',
					platform: 'test',
					language: 'en',
					hardwareConcurrency: 8
				},
				probeWebGL: false
			} );

			assert.ok( report.isCapabilitiesReport, 'Provides type flag.' );
			assert.equal( report.data.library.name, '4.js', 'Reports the native library identity.' );
			assert.equal( report.data.environment.hardwareConcurrency, 8, 'Captures environment information.' );
			assert.notOk( report.data.webgl.supported, 'Can skip active WebGL probing.' );

			const json = report.toJSON();
			json.library.name = 'changed';
			assert.equal( report.data.library.name, '4.js', 'Returns detached JSON data.' );

		} );

		QUnit.test( 'WebGPU adapter collection', async assert => {

			const adapter = {
				info: {
					vendor: 'Test Vendor',
					architecture: 'Test Architecture',
					device: 'Test Device',
					description: 'Test Adapter'
				},
				features: new Set( [ 'feature-b', 'feature-a' ] ),
				limits: {
					maxTextureDimension2D: 8192,
					maxBindGroups: 4
				},
				isFallbackAdapter: false
			};

			const report = await CapabilitiesReport.generate( {
				globalObject: {},
				navigator: {
					gpu: {
						requestAdapter: async () => adapter
					}
				},
				probeWebGL: false,
				requestAdapter: true
			} );

			assert.ok( report.data.webgpu.supported, 'Reports WebGPU availability.' );
			assert.deepEqual( report.data.webgpu.adapter.features, [ 'feature-a', 'feature-b' ], 'Sorts adapter features.' );
			assert.equal( report.data.webgpu.adapter.limits.maxTextureDimension2D, 8192, 'Captures adapter limits.' );

		} );

	} );

} );
