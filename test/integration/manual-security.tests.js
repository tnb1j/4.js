import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import { createServer } from '../../utils/server.js';

function listen( server ) {

	return new Promise( ( resolve, reject ) => {

		server.once( 'error', reject );
		server.listen( 0, '127.0.0.1', () => {

			server.off( 'error', reject );
			resolve( server.address().port );

		} );

	} );

}

function closeServer( server ) {

	return new Promise( resolve => {

		if ( server.listening ) {

			server.close( resolve );

		} else {

			resolve();

		}

	} );

}

async function readManualFrame( browser, baseURL, fragment ) {

	const page = await browser.newPage();

	try {

		await page.goto( `${baseURL}/manual/index.html${fragment}`, { waitUntil: 'domcontentloaded' } );
		await page.waitForFunction( () => {

			const iframe = document.querySelector( 'iframe' );
			return iframe && ( iframe.style.display === 'none' || iframe.style.display === 'unset' );

		} );

		return await page.evaluate( () => {

			const iframe = document.querySelector( 'iframe' );
			const rawSource = iframe.getAttribute( 'src' );
			const source = rawSource ? new URL( iframe.src ) : null;

			return {
				display: iframe.style.display,
				hash: source ? source.hash : '',
				pathname: source ? source.pathname : '',
				rawSource
			};

		} );

	} finally {

		await page.close();

	}

}

async function testManualNavigation( browser, baseURL ) {

	const basePage = await readManualFrame( browser, baseURL, '#en/fundamentals' );
	assert.equal( basePage.display, 'unset' );
	assert.equal( basePage.pathname, '/manual/en/fundamentals.html' );
	assert.equal( basePage.hash, '' );

	const dotMember = await readManualFrame( browser, baseURL, '#en/fundamentals.example-anchor' );
	assert.equal( dotMember.pathname, '/manual/en/fundamentals.html' );
	assert.equal( dotMember.hash, '#example-anchor' );

	const secondaryHash = await readManualFrame( browser, baseURL, '#en/fundamentals#example-anchor' );
	assert.equal( secondaryHash.pathname, '/manual/en/fundamentals.html' );
	assert.equal( secondaryHash.hash, '#example-anchor' );

	const anchoredListEntry = await readManualFrame( browser, baseURL, '#en/tips#screenshot' );
	assert.equal( anchoredListEntry.pathname, '/manual/en/tips.html' );
	assert.equal( anchoredListEntry.hash, '#screenshot' );

	for ( const fragment of [
		'',
		'#javascript:alert(1)',
		'#https://example.invalid/manual.html',
		'#en/fundamentals#bad%20anchor'
	] ) {

		const rejected = await readManualFrame( browser, baseURL, fragment );
		assert.equal( rejected.display, 'none', `Rejected manual fragment: ${fragment || '(empty)'}` );
		assert.equal( rejected.rawSource, '', `No iframe source for rejected fragment: ${fragment || '(empty)'}` );

	}

}

async function testValidEditorBlobRun( browser, baseURL ) {

	const page = await browser.newPage();
	const pageErrors = [];
	page.on( 'pageerror', error => pageErrors.push( error.message ) );

	try {

		const example = encodeURIComponent( '/manual/examples/fundamentals.html?mode=secure&__proto__=polluted' );
		await page.goto(
			`${baseURL}/manual/examples/resources/editor.html?editor=false&url=${example}`,
			{ waitUntil: 'domcontentloaded' }
		);
		await page.waitForFunction( () => window.location.protocol === 'blob:' );
		await page.waitForFunction( () => {

			const canvas = document.querySelector( 'canvas' );
			return canvas && canvas.dataset.engine;

		} );

		const result = await page.evaluate( () => ( {
			canvasCount: document.querySelectorAll( 'canvas' ).length,
			engine: document.querySelector( 'canvas' ).dataset.engine,
			mode: window.hackedParams.mode,
			prototypePolluted: Object.prototype.polluted,
			protocol: window.location.protocol,
			title: document.title
		} ) );

		assert.equal( result.protocol, 'blob:' );
		assert.equal( result.title, '4.js - Fundamentals' );
		assert.equal( result.canvasCount, 1 );
		assert.match( result.engine, /^4\.js r185/ );
		assert.equal( result.mode, 'secure' );
		assert.equal( result.prototypePolluted, undefined );
		assert.deepEqual( pageErrors, [] );

	} finally {

		await page.close();

	}

}

async function testEditorExternalScripts( browser, baseURL ) {

	const page = await browser.newPage();
	const pageErrors = [];
	page.on( 'pageerror', error => pageErrors.push( error.message ) );

	try {

		const example = encodeURIComponent( '/manual/examples/responsive-editor.html' );
		await page.goto(
			`${baseURL}/manual/examples/resources/editor.html?editor=false&url=${example}`,
			{ waitUntil: 'domcontentloaded' }
		);
		await page.waitForFunction( () => window.location.protocol === 'blob:' );
		await page.waitForFunction( () => {

			const canvas = document.querySelector( 'canvas' );
			return canvas && canvas.dataset.engine && document.querySelector( '.gutter' );

		} );

		const result = await page.evaluate( () => ( {
			gutterCount: document.querySelectorAll( '.gutter' ).length,
			title: document.title
		} ) );

		assert.equal( result.title, '4.js - Responsive Editor' );
		assert.equal( result.gutterCount, 1 );
		assert.deepEqual( pageErrors, [] );

	} finally {

		await page.close();

	}

}

async function testRejectedEditorURL( browser, baseURL, exampleURL ) {

	const page = await browser.newPage();
	const pageErrors = [];
	const requestedURLs = [];

	page.on( 'pageerror', error => pageErrors.push( error.message ) );
	page.on( 'request', request => requestedURLs.push( request.url() ) );

	try {

		const example = encodeURIComponent( exampleURL );
		const editorURL = `${baseURL}/manual/examples/resources/editor.html?editor=false&url=${example}`;
		await page.goto( editorURL, { waitUntil: 'domcontentloaded' } );
		await page.waitForFunction( () => window.location.protocol === 'http:' );
		await new Promise( resolve => setTimeout( resolve, 100 ) );

		assert.match(
			pageErrors.join( '\n' ),
			/Only same-origin manual examples can be opened/,
			`Rejected editor URL: ${exampleURL}`
		);
		assert.equal(
			requestedURLs.some( requestURL => requestURL === exampleURL ),
			false,
			`Rejected URL was not fetched: ${exampleURL}`
		);

	} finally {

		await page.close();

	}

}

async function testCodeSiteModuleRewriting( browser, baseURL ) {

	const page = await browser.newPage();
	await page.setRequestInterception( true );
	page.on( 'request', request => {

		const url = request.url();

		if ( url.includes( 'monaco-editor' ) || url.endsWith( '/manual/examples/resources/editor.js' ) ) {

			void request.respond( { contentType: 'application/javascript', status: 200, body: '' } );

		} else {

			void request.continue();

		}

	} );

	try {

		await page.goto( `${baseURL}/manual/examples/resources/editor.html`, { waitUntil: 'domcontentloaded' } );
		await page.waitForFunction( () => window.lessonEditorSettings !== undefined );

		const rewritten = await page.evaluate( async base => {

			const source = [
				`import * as FOUR from '${base}/build/4.module.js';`,
				`import { OrbitControls } from '${base}/examples/jsm/controls/OrbitControls.js';`
			].join( '\n' );

			return await window.lessonEditorSettings.fixJSForCodeSite( source );

		}, baseURL );

		assert.match( rewritten, /@tnb1j\/4js@0\.185\.1-four\.1\/\+esm/ );
		assert.match( rewritten, /@tnb1j\/4js@0\.185\.1-four\.1\/examples\/jsm\/controls\/OrbitControls\.js\/\+esm/ );
		assert.doesNotMatch( rewritten, /npm\/three@/ );

	} finally {

		await page.close();

	}

}

async function testOffscreenExample( browser, baseURL, filename, interact = false ) {

	const page = await browser.newPage();
	const errors = [];
	let workerResolve;
	const workerCreated = new Promise( resolve => {

		workerResolve = resolve;

	} );

	page.on( 'workercreated', workerResolve );
	page.on( 'pageerror', error => errors.push( error.message ) );
	page.on( 'console', message => {

		if ( message.type() === 'error' && message.text().includes( '404 (Not Found)' ) === false ) {

			errors.push( message.text() );

		}

	} );
	page.on( 'requestfailed', request => {

		if ( request.url().endsWith( '/favicon.ico' ) === false ) {

			errors.push( `${request.url()}: ${request.failure()?.errorText || 'request failed'}` );

		}

	} );

	try {

		await page.setViewport( { width: 320, height: 240 } );
		await page.goto(
			`${baseURL}/manual/examples/${filename}`,
			{ waitUntil: 'networkidle0', timeout: 90000 }
		);
		await Promise.race( [
			workerCreated,
			new Promise( ( resolve, reject ) => setTimeout( () => reject( new Error( `Worker did not start for ${filename}.` ) ), 10000 ) )
		] );

		if ( interact ) {

			await page.mouse.move( 160, 120 );
			await page.mouse.down();
			await page.mouse.move( 210, 150, { steps: 5 } );
			await page.mouse.up();
			await page.mouse.wheel( { deltaY: 100 } );

		}

		await new Promise( resolve => setTimeout( resolve, 1000 ) );

		const screenshot = Buffer.from( await page.screenshot( { encoding: 'binary' } ) );
		const image = PNG.sync.read( screenshot );
		const background = Array.from( image.data.subarray( 0, 4 ) );
		let changedPixels = 0;

		for ( let i = 0; i < image.data.length; i += 4 ) {

			let difference = 0;

			for ( let channel = 0; channel < 4; channel ++ ) {

				difference += Math.abs( image.data[ i + channel ] - background[ channel ] );

			}

			if ( difference > 24 ) changedPixels ++;

		}

		assert.ok( changedPixels > 500, `${filename} renders non-background pixels.` );
		assert.deepEqual( errors, [], `${filename} runs without browser or worker errors.` );

	} finally {

		await page.close();

	}

}

const server = createServer();
let browser;

try {

	const port = await listen( server );
	const baseURL = `http://127.0.0.1:${port}`;

	browser = await puppeteer.launch( {
		headless: 'new',
		args: [ '--no-sandbox', '--enable-unsafe-swiftshader' ],
		handleSIGINT: false
	} );

	await testManualNavigation( browser, baseURL );
	await testValidEditorBlobRun( browser, baseURL );
	await testEditorExternalScripts( browser, baseURL );
	await testRejectedEditorURL( browser, baseURL, 'https://example.invalid/evil.html' );
	await testRejectedEditorURL( browser, baseURL, `${baseURL}/examples/webgl_animation_skinning_blending.html` );
	await testCodeSiteModuleRewriting( browser, baseURL );
	await testOffscreenExample( browser, baseURL, 'offscreencanvas.html' );
	await testOffscreenExample( browser, baseURL, 'offscreencanvas-w-fallback.html' );
	await testOffscreenExample( browser, baseURL, 'offscreencanvas-w-orbitcontrols.html', true );
	await testOffscreenExample( browser, baseURL, 'offscreencanvas-w-picking.html' );

	console.log( 'Manual security integration tests passed.' );

} finally {

	if ( browser ) await browser.close();
	await closeServer( server );

}
