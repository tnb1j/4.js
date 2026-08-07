import * as FOUR from '@tnb1j/4js';
import { threejsLessonUtils } from './fourjs-lesson-utils.js';

{

	const loader = new FOUR.TextureLoader();

	function loadTextureAndPromise( url ) {

		let textureResolve;
		const promise = new Promise( ( resolve ) => {

			textureResolve = resolve;

		} );
		const texture = loader.load( url, ( texture ) => {

			textureResolve( texture );

		} );
		return {
			texture,
			promise,
		};

	}

	const filterTextureInfo = loadTextureAndPromise( '/manual/resources/images/mip-example.png' );
	const filterTexture = filterTextureInfo.texture;
	const filterTexturePromise = filterTextureInfo.promise;

	function filterCube( scale, texture ) {

		const size = 8;
		const geometry = new FOUR.BoxGeometry( size, size, size );
		const material = new FOUR.MeshBasicMaterial( {
			map: texture || filterTexture,
		} );
		const mesh = new FOUR.Mesh( geometry, material );
		mesh.scale.set( scale, scale, scale );
		return mesh;

	}

	function lowResCube( scale, pixelSize = 16 ) {

		const mesh = filterCube( scale );
		const renderTarget = new FOUR.WebGLRenderTarget( 1, 1, {
			magFilter: FOUR.NearestFilter,
			minFilter: FOUR.NearestFilter,
		} );

		const planeScene = new FOUR.Scene();

		const plane = new FOUR.PlaneGeometry( 1, 1 );
		const planeMaterial = new FOUR.MeshBasicMaterial( {
			map: renderTarget.texture,
		} );
		const planeMesh = new FOUR.Mesh( plane, planeMaterial );
		planeScene.add( planeMesh );

		const planeCamera = new FOUR.OrthographicCamera( 0, 1, 0, 1, - 1, 1 );
		planeCamera.position.z = 1;

		return {
			obj3D: mesh,
			update( time, renderInfo ) {

				const { width, height, scene, camera, renderer, pixelRatio } = renderInfo;
				const rtWidth = Math.ceil( width / pixelRatio / pixelSize );
				const rtHeight = Math.ceil( height / pixelRatio / pixelSize );
				renderTarget.setSize( rtWidth, rtHeight );

				camera.aspect = rtWidth / rtHeight;
				camera.updateProjectionMatrix();

				renderer.setRenderTarget( renderTarget );

				renderer.render( scene, camera );
				renderer.setRenderTarget( null );

			},
			render( renderInfo ) {

				const { width, height, renderer, pixelRatio } = renderInfo;
				const viewWidth = width / pixelRatio / pixelSize;
				const viewHeight = height / pixelRatio / pixelSize;
				planeCamera.left = - viewWidth / 2;
				planeCamera.right = viewWidth / 2;
				planeCamera.top = viewHeight / 2;
				planeCamera.bottom = - viewHeight / 2;
				planeCamera.updateProjectionMatrix();

				// compute the difference between our renderTarget size
				// and the view size. The renderTarget is a multiple pixels magnified pixels
				// so for example if the view is 15 pixels wide and the magnified pixel size is 10
				// the renderTarget will be 20 pixels wide. We only want to display 15 of those 20
				// pixels so

				planeMesh.scale.set( renderTarget.width, renderTarget.height, 1 );

				renderer.render( planeScene, planeCamera );

			},
		};

	}

	function createMip( level, numLevels, scale ) {

		const u = level / numLevels;
		const size = 2 ** ( numLevels - level - 1 );
		const halfSize = Math.ceil( size / 2 );
		const ctx = document.createElement( 'canvas' ).getContext( '2d' );
		ctx.canvas.width = size * scale;
		ctx.canvas.height = size * scale;
		ctx.scale( scale, scale );
		ctx.fillStyle = `hsl(${180 + u * 360 | 0},100%,20%)`;
		ctx.fillRect( 0, 0, size, size );
		ctx.fillStyle = `hsl(${u * 360 | 0},100%,50%)`;
		ctx.fillRect( 0, 0, halfSize, halfSize );
		ctx.fillRect( halfSize, halfSize, halfSize, halfSize );
		return ctx.canvas;

	}

	threejsLessonUtils.init( {
		threejsOptions: { antialias: false },
	} );
	threejsLessonUtils.addDiagrams( {
		filterCube: {
			create() {

				return filterCube( 1 );

			},
		},
		filterCubeSmall: {
			create( info ) {

				return lowResCube( .1, info.renderInfo.pixelRatio );

			},
		},
		filterCubeSmallLowRes: {
			create() {

				return lowResCube( 1 );

			},
		},
		filterCubeMagNearest: {
			async create() {

				const texture = await filterTexturePromise;
				const newTexture = texture.clone();
				newTexture.magFilter = FOUR.NearestFilter;
				newTexture.needsUpdate = true;
				return filterCube( 1, newTexture );

			},
		},
		filterCubeMagLinear: {
			async create() {

				const texture = await filterTexturePromise;
				const newTexture = texture.clone();
				newTexture.magFilter = FOUR.LinearFilter;
				newTexture.needsUpdate = true;
				return filterCube( 1, newTexture );

			},
		},
		filterModes: {
			async create( props ) {

				const { scene, camera, renderInfo } = props;
				scene.background = new FOUR.Color( 'black' );
				camera.far = 150;
				const texture = await filterTexturePromise;
				const root = new FOUR.Object3D();
				const depth = 50;
				const plane = new FOUR.PlaneGeometry( 1, depth );
				const mipmap = [];
				const numMips = 7;
				for ( let i = 0; i < numMips; ++ i ) {

					mipmap.push( createMip( i, numMips, 1 ) );

				}

				// Is this a design flaw in 4.js?
				// AFAIK there's no way to clone a texture really
				// Textures can share an image and I guess deep down
				// if the image is the same they might share a WebGLTexture
				// but no checks for mipmaps I'm guessing. It seems like
				// they shouldn't be checking for same image, the should be
				// checking for same WebGLTexture. Given there is more than
				// WebGL to support maybe they need to abstract WebGLTexture to
				// PlatformTexture or something?

				const meshInfos = [
					{ x: - 1, y: 1, minFilter: FOUR.NearestFilter, magFilter: FOUR.NearestFilter },
					{ x: 0, y: 1, minFilter: FOUR.LinearFilter, magFilter: FOUR.LinearFilter },
					{ x: 1, y: 1, minFilter: FOUR.NearestMipmapNearestFilter, magFilter: FOUR.LinearFilter },
					{ x: - 1, y: - 1, minFilter: FOUR.NearestMipmapLinearFilter, magFilter: FOUR.LinearFilter },
					{ x: 0, y: - 1, minFilter: FOUR.LinearMipmapNearestFilter, magFilter: FOUR.LinearFilter },
					{ x: 1, y: - 1, minFilter: FOUR.LinearMipmapLinearFilter, magFilter: FOUR.LinearFilter },
				].map( ( info ) => {

					const copyTexture = texture.clone();
					copyTexture.minFilter = info.minFilter;
					copyTexture.magFilter = info.magFilter;
					copyTexture.wrapT = FOUR.RepeatWrapping;
					copyTexture.repeat.y = depth;
					copyTexture.needsUpdate = true;

					const mipTexture = new FOUR.CanvasTexture( mipmap[ 0 ] );
					mipTexture.mipmaps = mipmap;
					mipTexture.minFilter = info.minFilter;
					mipTexture.magFilter = info.magFilter;
					mipTexture.wrapT = FOUR.RepeatWrapping;
					mipTexture.repeat.y = depth;

					const material = new FOUR.MeshBasicMaterial( {
						map: copyTexture,
					} );

					const mesh = new FOUR.Mesh( plane, material );
					mesh.rotation.x = Math.PI * .5 * info.y;
					mesh.position.x = info.x * 1.5;
					mesh.position.y = info.y;
					root.add( mesh );
					return {
						material,
						copyTexture,
						mipTexture,
					};

				} );
				scene.add( root );

				renderInfo.elem.addEventListener( 'click', () => {

					for ( const meshInfo of meshInfos ) {

						const { material, copyTexture, mipTexture } = meshInfo;
						material.map = material.map === copyTexture ? mipTexture : copyTexture;

					}

				} );

				return {
					update( time, renderInfo ) {

						const { camera } = renderInfo;
						camera.position.y = Math.sin( time * .2 ) * .5;

					},
					trackball: false,
				};

			},
		},
	} );

	const textureDiagrams = {
		differentColoredMips( parent ) {

			const numMips = 7;
			for ( let i = 0; i < numMips; ++ i ) {

				const elem = createMip( i, numMips, 4 );
				elem.className = 'border';
				elem.style.margin = '1px';
				parent.appendChild( elem );

			}

		},
	};

	function createTextureDiagram( elem ) {

		const name = elem.dataset.textureDiagram;
		const info = textureDiagrams[ name ];
		info( elem );

	}

	[ ...document.querySelectorAll( '[data-texture-diagram]' ) ].forEach( createTextureDiagram );

}

