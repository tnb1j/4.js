/* global chrome */

try {

	chrome.devtools.panels.create(
		'4.js',
		null,
		'panel/panel.html'
	);

} catch ( error ) {

	console.error( 'Failed to create 4.js panel:', error );

}
