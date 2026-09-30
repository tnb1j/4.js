/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * Copyright 2026 4.js Contributors
 * SPDX-License-Identifier: MIT
 */

export * from './index';

// Controls
export class OrbitControls {
	constructor( object: any, domElement?: HTMLElement );
	enabled: boolean;
	target: any;
	minDistance: number;
	maxDistance: number;
	minPolarAngle: number;
	maxPolarAngle: number;
	minAzimuthAngle: number;
	maxAzimuthAngle: number;
	enableDamping: boolean;
	dampingFactor: number;
	enableZoom: boolean;
	zoomSpeed: number;
	enableRotate: boolean;
	rotateSpeed: number;
	enablePan: boolean;
	panSpeed: number;
	autoRotate: boolean;
	autoRotateSpeed: number;
	update(): boolean;
	listenToKeyEvents( domElement: HTMLElement ): void;
	saveState(): void;
	reset(): void;
	dispose(): void;
}

// Loaders
export class GLTFLoader {
	constructor( manager?: any );
	load(
		url: string,
		onLoad: ( gltf: any ) => void,
		onProgress?: ( event: ProgressEvent ) => void,
		onError?: ( event: ErrorEvent ) => void
	): void;
	loadAsync( url: string, onProgress?: ( event: ProgressEvent ) => void ): Promise<any>;
	setDRACOLoader( dracoLoader: any ): this;
	setKTX2Loader( ktx2Loader: any ): this;
	setMeshoptDecoder( meshoptDecoder: any ): this;
	parse(
		data: ArrayBuffer | string,
		path: string,
		onLoad: ( gltf: any ) => void,
		onError?: ( event: ErrorEvent ) => void
	): void;
	parseAsync( data: ArrayBuffer | string, path: string ): Promise<any>;
}

export class DRACOLoader {
	constructor( manager?: any );
	setDecoderPath( path: string ): this;
	setDecoderConfig( config: any ): this;
	setWorkerLimit( limit: number ): this;
	dispose(): this;
}

export class KTX2Loader {
	constructor( manager?: any );
	setTranscoderPath( path: string ): this;
	setWorkerLimit( limit: number ): this;
	detectSupport( renderer: any ): this;
	dispose(): this;
}

export class OBJLoader {
	constructor( manager?: any );
	load( url: string, onLoad: ( group: any ) => void, onProgress?: ( event: ProgressEvent ) => void, onError?: ( event: ErrorEvent ) => void ): void;
	loadAsync( url: string, onProgress?: ( event: ProgressEvent ) => void ): Promise<any>;
	parse( data: string ): any;
}

export class MTLLoader {
	constructor( manager?: any );
	load( url: string, onLoad: ( materialCreator: any ) => void, onProgress?: ( event: ProgressEvent ) => void, onError?: ( event: ErrorEvent ) => void ): void;
	parse( text: string, path: string ): any;
}

export class RGBELoader {
	constructor( manager?: any );
	load( url: string, onLoad: ( texture: any ) => void, onProgress?: ( event: ProgressEvent ) => void, onError?: ( event: ErrorEvent ) => void ): any;
	loadAsync( url: string, onProgress?: ( event: ProgressEvent ) => void ): Promise<any>;
}
