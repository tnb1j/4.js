const projectIdentity = Object.freeze( {
	brand: '4.js',
	packageName: 'fourjs',
	sourcePrefix: 'Four',
	outputPrefix: '4',
	namespace: 'FOUR'
} );

const legacyIdentity = Object.freeze( {
	brand: 'three.js',
	packageName: 'three',
	sourcePrefix: 'Three',
	outputPrefix: 'three',
	namespace: 'THREE'
} );

const buildIdentities = Object.freeze( [ projectIdentity, legacyIdentity ] );

export { buildIdentities, legacyIdentity, projectIdentity };
