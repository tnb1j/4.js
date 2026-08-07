const FOUR_PACKAGE = '@fourjs/core';

const BUILD_FILES = new Map( [
	[ 'three.cjs', '4.cjs' ],
	[ 'three.core.js', '4.core.js' ],
	[ 'three.core.min.js', '4.core.min.js' ],
	[ 'three.module.js', '4.module.js' ],
	[ 'three.module.min.js', '4.module.min.js' ],
	[ 'three.tsl.js', '4.tsl.js' ],
	[ 'three.tsl.min.js', '4.tsl.min.js' ],
	[ 'three.webgpu.js', '4.webgpu.js' ],
	[ 'three.webgpu.min.js', '4.webgpu.min.js' ],
	[ 'three.webgpu.nodes.js', '4.webgpu.nodes.js' ],
	[ 'three.webgpu.nodes.min.js', '4.webgpu.nodes.min.js' ]
] );

function replacePackageSpecifiers( source ) {

	const patterns = [
		/(\bfrom\s+)(['"])three(?=\/|\2)/g,
		/(\bimport\s+)(['"])three(?=\/|\2)/g,
		/(\bimport\s*\(\s*)(['"])three(?=\/|\2)/g,
		/(\brequire\s*\(\s*)(['"])three(?=\/|\2)/g
	];

	for ( const pattern of patterns ) {

		source = source.replace( pattern, `$1$2${FOUR_PACKAGE}` );

	}

	source = source.replace(
		/(["'])three((?:\/[^"']*)?)(\1\s*:)/g,
		`$1${FOUR_PACKAGE}$2$3`
	);

	return source;

}

function replaceBuildFiles( source ) {

	for ( const [ legacyName, nativeName ] of BUILD_FILES ) {

		source = source.replaceAll( legacyName, nativeName );

	}

	return source;

}

function transformSource( source, options = {} ) {

	const {
		renameBuildFiles = true,
		renameNamespace = true,
		renamePackage = true
	} = options;

	const preservedSpecifiers = Array.from( source.matchAll( /four-migrate-preserve:\s*([^\s<]+)/g ), match => match[ 1 ] );
	const preservedValues = new Map();
	let output = source;

	for ( const [ index, value ] of preservedSpecifiers.entries() ) {

		const placeholder = `__FOUR_MIGRATE_PRESERVE_${index}__`;
		preservedValues.set( placeholder, value );
		output = output.replaceAll( value, placeholder );

	}

	if ( renamePackage ) output = replacePackageSpecifiers( output );
	if ( renameBuildFiles ) output = replaceBuildFiles( output );

	output = output.replaceAll( '@three_import', '@four_import' );

	if ( renameNamespace ) output = output.replace( /\bTHREE\b/g, 'FOUR' );

	for ( const [ placeholder, value ] of preservedValues ) {

		output = output.replaceAll( placeholder, value );

	}

	return {
		changed: output !== source,
		output
	};

}

export { BUILD_FILES, FOUR_PACKAGE, transformSource };
