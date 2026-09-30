/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * Copyright 2026 4.js Contributors
 * SPDX-License-Identifier: MIT
 */

export const REVISION: string;

// ==========================================
// 4.js ENHANCED CAPABILITIES
// ==========================================

export interface CapabilitiesReportOptions {
	renderer?: any;
	canvas?: HTMLCanvasElement | OffscreenCanvas | null;
	context?: WebGL2RenderingContext | null;
	probeWebGL?: boolean;
	globalObject?: any;
	navigator?: any;
	requestAdapter?: boolean;
	powerPreference?: 'low-power' | 'high-performance';
	adapter?: any;
}

export class CapabilitiesReport {
	constructor( options?: CapabilitiesReportOptions );
	readonly isCapabilitiesReport: true;
	data: Record<string, any>;
	refresh( options?: CapabilitiesReportOptions ): Promise<CapabilitiesReport>;
	toJSON(): Record<string, any>;
	toString(): string;
}

export interface DiagnosticsOptions {
	level?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
	maxEntries?: number;
	scope?: string;
	sink?: ( ( entry: any ) => void ) | null;
}

export class Diagnostics extends EventDispatcher {
	constructor( options?: DiagnosticsOptions );
	readonly isDiagnostics: true;
	level: string;
	maxEntries: number;
	scope: string;
	debug( message: string, context?: any ): this;
	info( message: string, context?: any ): this;
	warn( message: string, context?: any ): this;
	error( message: string, context?: any ): this;
	clear(): this;
	getEntries(): any[];
	filter( criteria?: any ): any[];
}

export interface AssetTaskOptions {
	priority?: number;
	dependencies?: AssetTask[];
	retain?: boolean;
}

export class AssetTask extends EventDispatcher {
	constructor( scheduler: AssetScheduler, key: any, executor: Function, options?: AssetTaskOptions );
	readonly isAssetTask: true;
	scheduler: AssetScheduler;
	key: any;
	priority: number;
	status: 'blocked' | 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
	progress: number;
	result: any;
	error: Error | null;
	sequence: number;
	dependencies: AssetTask[];
	retain: boolean;
	signal: AbortSignal;
	promise: Promise<any>;
	cancel( reason?: string ): this;
}

export interface AssetSchedulerOptions {
	maxConcurrency?: number;
	diagnostics?: Diagnostics | null;
}

export class AssetScheduler extends EventDispatcher {
	constructor( options?: AssetSchedulerOptions );
	readonly isAssetScheduler: true;
	maxConcurrency: number;
	schedule<T = any>( key: any, executor: ( signal: AbortSignal, task: AssetTask ) => Promise<T> | T, options?: AssetTaskOptions ): Promise<T>;
	cancel( key: any, reason?: string ): boolean;
	clear(): void;
	getTask( key: any ): AssetTask | undefined;
	getQueue(): AssetTask[];
}

// ==========================================
// CORE / EVENT DISPATCHER
// ==========================================

export interface BaseEvent<TType extends string = string> {
	type: TType;
	[attachment: string]: any;
}

export interface EventListener<TEvent = any, TTarget = any> {
	( event: TEvent & { target: TTarget } ): void;
}

export class EventDispatcher<TEventMap extends {} = any> {
	constructor();
	addEventListener<T extends string>( type: T, listener: EventListener<any, this> ): void;
	hasEventListener<T extends string>( type: T, listener: EventListener<any, this> ): boolean;
	removeEventListener<T extends string>( type: T, listener: EventListener<any, this> ): void;
	dispatchEvent( event: BaseEvent ): void;
}

// ==========================================
// MATH
// ==========================================

export class Vector2 {
	constructor( x?: number, y?: number );
	x: number;
	y: number;
	readonly isVector2: true;
	set( x: number, y: number ): this;
	setScalar( scalar: number ): this;
	clone(): this;
	copy( v: Vector2 ): this;
	add( v: Vector2 ): this;
	sub( v: Vector2 ): this;
	multiplyScalar( s: number ): this;
	divideScalar( s: number ): this;
	dot( v: Vector2 ): number;
	length(): number;
	lengthSq(): number;
	normalize(): this;
	distanceTo( v: Vector2 ): number;
	equals( v: Vector2 ): boolean;
	toArray( array?: number[], offset?: number ): number[];
	fromArray( array: ArrayLike<number>, offset?: number ): this;
}

export class Vector3 {
	constructor( x?: number, y?: number, z?: number );
	x: number;
	y: number;
	z: number;
	readonly isVector3: true;
	set( x: number, y: number, z: number ): this;
	setScalar( scalar: number ): this;
	clone(): this;
	copy( v: Vector3 ): this;
	add( v: Vector3 ): this;
	addVectors( a: Vector3, b: Vector3 ): this;
	sub( v: Vector3 ): this;
	subVectors( a: Vector3, b: Vector3 ): this;
	multiplyScalar( s: number ): this;
	divideScalar( s: number ): this;
	applyMatrix4( m: Matrix4 ): this;
	applyQuaternion( q: Quaternion ): this;
	dot( v: Vector3 ): number;
	cross( v: Vector3 ): this;
	crossVectors( a: Vector3, b: Vector3 ): this;
	length(): number;
	lengthSq(): number;
	normalize(): this;
	distanceTo( v: Vector3 ): number;
	setFromMatrixPosition( m: Matrix4 ): this;
	equals( v: Vector3 ): boolean;
	toArray( array?: number[], offset?: number ): number[];
	fromArray( array: ArrayLike<number>, offset?: number ): this;
}

export class Vector4 {
	constructor( x?: number, y?: number, z?: number, w?: number );
	x: number;
	y: number;
	z: number;
	w: number;
	readonly isVector4: true;
	set( x: number, y: number, z: number, w: number ): this;
	clone(): this;
	copy( v: Vector4 ): this;
	normalize(): this;
	equals( v: Vector4 ): boolean;
	toArray( array?: number[], offset?: number ): number[];
	fromArray( array: ArrayLike<number>, offset?: number ): this;
}

export class Matrix3 {
	constructor();
	elements: number[];
	readonly isMatrix3: true;
	set( n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number ): this;
	identity(): this;
	clone(): this;
	copy( m: Matrix3 ): this;
	invert(): this;
	transpose(): this;
	toArray( array?: number[], offset?: number ): number[];
	fromArray( array: ArrayLike<number>, offset?: number ): this;
}

export class Matrix4 {
	constructor();
	elements: number[];
	readonly isMatrix4: true;
	set(
		n11: number, n12: number, n13: number, n14: number,
		n21: number, n22: number, n23: number, n24: number,
		n31: number, n32: number, n33: number, n34: number,
		n41: number, n42: number, n43: number, n44: number
	): this;
	identity(): this;
	clone(): this;
	copy( m: Matrix4 ): this;
	copyPosition( m: Matrix4 ): this;
	makeTranslation( x: number, y: number, z: number ): this;
	makeRotationX( theta: number ): this;
	makeRotationY( theta: number ): this;
	makeRotationZ( theta: number ): this;
	makeScale( x: number, y: number, z: number ): this;
	compose( position: Vector3, quaternion: Quaternion, scale: Vector3 ): this;
	decompose( position: Vector3, quaternion: Quaternion, scale: Vector3 ): this;
	multiply( m: Matrix4 ): this;
	multiplyMatrices( a: Matrix4, b: Matrix4 ): this;
	invert(): this;
	transpose(): this;
	setPosition( v: Vector3 | number, y?: number, z?: number ): this;
	equals( m: Matrix4 ): boolean;
	toArray( array?: number[], offset?: number ): number[];
	fromArray( array: ArrayLike<number>, offset?: number ): this;
}

export class Quaternion {
	constructor( x?: number, y?: number, z?: number, w?: number );
	x: number;
	y: number;
	z: number;
	w: number;
	readonly isQuaternion: true;
	set( x: number, y: number, z: number, w: number ): this;
	identity(): this;
	clone(): this;
	copy( q: Quaternion ): this;
	setFromEuler( euler: Euler, update?: boolean ): this;
	setFromAxisAngle( axis: Vector3, angle: number ): this;
	setFromRotationMatrix( m: Matrix4 ): this;
	normalize(): this;
	invert(): this;
	multiply( q: Quaternion ): this;
	multiplyQuaternions( a: Quaternion, b: Quaternion ): this;
	equals( q: Quaternion ): boolean;
	toArray( array?: number[], offset?: number ): number[];
	fromArray( array: ArrayLike<number>, offset?: number ): this;
}

export class Euler {
	constructor( x?: number, y?: number, z?: number, order?: string );
	x: number;
	y: number;
	z: number;
	order: string;
	readonly isEuler: true;
	set( x: number, y: number, z: number, order?: string ): this;
	clone(): this;
	copy( euler: Euler ): this;
	setFromRotationMatrix( m: Matrix4, order?: string ): this;
	setFromQuaternion( q: Quaternion, order?: string ): this;
	reorder( newOrder: string ): this;
	equals( euler: Euler ): boolean;
	toArray( array?: number[], offset?: number ): number[];
	fromArray( array: ArrayLike<number> ): this;
}

export class Color {
	constructor( r?: number | string | Color, g?: number, b?: number );
	r: number;
	g: number;
	b: number;
	readonly isColor: true;
	set( value: Color | string | number ): this;
	setScalar( scalar: number ): this;
	setHex( hex: number ): this;
	setRGB( r: number, g: number, b: number ): this;
	getHex(): number;
	getHexString(): string;
	getStyle(): string;
	clone(): this;
	copy( color: Color ): this;
	equals( c: Color ): boolean;
}

export class Box3 {
	constructor( min?: Vector3, max?: Vector3 );
	min: Vector3;
	max: Vector3;
	readonly isBox3: true;
	set( min: Vector3, max: Vector3 ): this;
	setFromPoints( points: Vector3[] ): this;
	setFromObject( object: Object3D, precise?: boolean ): this;
	clone(): this;
	copy( box: Box3 ): this;
	isEmpty(): boolean;
	getCenter( target: Vector3 ): Vector3;
	getSize( target: Vector3 ): Vector3;
	expandByPoint( point: Vector3 ): this;
	expandByScalar( scalar: number ): this;
	intersectsBox( box: Box3 ): boolean;
	containsPoint( point: Vector3 ): boolean;
}

export class Sphere {
	constructor( center?: Vector3, radius?: number );
	center: Vector3;
	radius: number;
	readonly isSphere: true;
	set( center: Vector3, radius: number ): this;
	clone(): this;
	copy( sphere: Sphere ): this;
	applyMatrix4( matrix: Matrix4 ): this;
}

export class Ray {
	constructor( origin?: Vector3, direction?: Vector3 );
	origin: Vector3;
	direction: Vector3;
	at( t: number, target: Vector3 ): Vector3;
	intersectBox( box: Box3, target: Vector3 ): Vector3 | null;
	intersectsBox( box: Box3 ): boolean;
	intersectSphere( sphere: Sphere, target: Vector3 ): Vector3 | null;
}

export class Plane {
	constructor( normal?: Vector3, constant?: number );
	normal: Vector3;
	constant: number;
	readonly isPlane: true;
	set( normal: Vector3, constant: number ): this;
	distanceToPoint( point: Vector3 ): number;
}

export class Frustum {
	constructor( p0?: Plane, p1?: Plane, p2?: Plane, p3?: Plane, p4?: Plane, p5?: Plane );
	planes: Plane[];
	setFromProjectionMatrix( m: Matrix4 ): this;
	intersectsObject( object: Object3D ): boolean;
	intersectsSphere( sphere: Sphere ): boolean;
	intersectsBox( box: Box3 ): boolean;
	containsPoint( point: Vector3 ): boolean;
}

export namespace MathUtils {
	export const DEG2RAD: number;
	export const RAD2DEG: number;
	export function generateUUID(): string;
	export function clamp( value: number, min: number, max: number ): number;
	export function euclideanModulo( n: number, m: number ): number;
	export function mapLinear( x: number, a1: number, a2: number, b1: number, b2: number ): number;
	export function lerp( x: number, y: number, t: number ): number;
	export function degToRad( degrees: number ): number;
	export function radToDeg( radians: number ): number;
	export function randInt( low: number, high: number ): number;
	export function randFloat( low: number, high: number ): number;
	export function randFloatSpread( range: number ): number;
}

// ==========================================
// SCENE GRAPH & CORE OBJECTS
// ==========================================

export class Object3D extends EventDispatcher {
	constructor();
	id: number;
	uuid: string;
	name: string;
	type: string;
	parent: Object3D | null;
	children: Object3D[];
	position: Vector3;
	rotation: Euler;
	quaternion: Quaternion;
	scale: Vector3;
	up: Vector3;
	matrix: Matrix4;
	matrixWorld: Matrix4;
	matrixAutoUpdate: boolean;
	matrixWorldNeedsUpdate: boolean;
	visible: boolean;
	castShadow: boolean;
	receiveShadow: boolean;
	frustumCulled: boolean;
	renderOrder: number;
	userData: Record<string, any>;
	readonly isObject3D: true;

	add( ...object: Object3D[] ): this;
	remove( ...object: Object3D[] ): this;
	removeFromParent(): this;
	clear(): this;
	getObjectById( id: number ): Object3D | undefined;
	getObjectByName( name: string ): Object3D | undefined;
	getWorldPosition( target: Vector3 ): Vector3;
	getWorldQuaternion( target: Quaternion ): Quaternion;
	getWorldScale( target: Vector3 ): Vector3;
	getWorldDirection( target: Vector3 ): Vector3;
	lookAt( vector: Vector3 | number, y?: number, z?: number ): void;
	traverse( callback: ( object: Object3D ) => any ): void;
	traverseVisible( callback: ( object: Object3D ) => any ): void;
	traverseAncestors( callback: ( object: Object3D ) => any ): void;
	updateMatrix(): void;
	updateMatrixWorld( force?: boolean ): void;
	updateWorldMatrix( updateParents: boolean, updateChildren: boolean ): void;
	clone( recursive?: boolean ): this;
	copy( source: this, recursive?: boolean ): this;
}

export class Scene extends Object3D {
	constructor();
	readonly isScene: true;
	type: 'Scene';
	background: Color | Texture | null;
	environment: Texture | null;
	fog: any;
}

export class Group extends Object3D {
	constructor();
	readonly isGroup: true;
	type: 'Group';
}

// ==========================================
// CAMERAS
// ==========================================

export class Camera extends Object3D {
	constructor();
	readonly isCamera: true;
	matrixWorldInverse: Matrix4;
	projectionMatrix: Matrix4;
	projectionMatrixInverse: Matrix4;
	getWorldDirection( target: Vector3 ): Vector3;
	updateMatrixWorld( force?: boolean ): void;
}

export class PerspectiveCamera extends Camera {
	constructor( fov?: number, aspect?: number, near?: number, far?: number );
	readonly isPerspectiveCamera: true;
	fov: number;
	aspect: number;
	near: number;
	far: number;
	zoom: number;
	updateProjectionMatrix(): void;
	setViewOffset( fullWidth: number, fullHeight: number, x: number, y: number, width: number, height: number ): void;
	clearViewOffset(): void;
}

export class OrthographicCamera extends Camera {
	constructor( left?: number, right?: number, top?: number, bottom?: number, near?: number, far?: number );
	readonly isOrthographicCamera: true;
	left: number;
	right: number;
	top: number;
	bottom: number;
	near: number;
	far: number;
	zoom: number;
	updateProjectionMatrix(): void;
}

// ==========================================
// BUFFER ATTRIBUTES & GEOMETRIES
// ==========================================

export class BufferAttribute {
	constructor( array: ArrayLike<number>, itemSize: number, normalized?: boolean );
	readonly isBufferAttribute: true;
	name: string;
	array: ArrayLike<number>;
	itemSize: number;
	count: number;
	normalized: boolean;
	usage: number;
	version: number;
	needsUpdate: boolean;
	set( value: ArrayLike<number>, offset?: number ): this;
	getX( index: number ): number;
	setX( index: number, x: number ): this;
	getY( index: number ): number;
	setY( index: number, y: number ): this;
	getZ( index: number ): number;
	setZ( index: number, z: number ): this;
	getW( index: number ): number;
	setW( index: number, w: number ): this;
	setXY( index: number, x: number, y: number ): this;
	setXYZ( index: number, x: number, y: number, z: number ): this;
	setXYZW( index: number, x: number, y: number, z: number, w: number ): this;
	clone(): this;
	copy( source: BufferAttribute ): this;
}

export class Float32BufferAttribute extends BufferAttribute {
	constructor( array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number, itemSize: number, normalized?: boolean );
}

export class Uint16BufferAttribute extends BufferAttribute {
	constructor( array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number, itemSize: number, normalized?: boolean );
}

export class Uint32BufferAttribute extends BufferAttribute {
	constructor( array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number, itemSize: number, normalized?: boolean );
}

export class BufferGeometry extends EventDispatcher {
	constructor();
	id: number;
	uuid: string;
	name: string;
	type: string;
	index: BufferAttribute | null;
	attributes: Record<string, BufferAttribute>;
	boundingBox: Box3 | null;
	boundingSphere: Sphere | null;
	readonly isBufferGeometry: true;

	getIndex(): BufferAttribute | null;
	setIndex( index: BufferAttribute | number[] | null ): this;
	getAttribute( name: string ): BufferAttribute;
	setAttribute( name: string, attribute: BufferAttribute ): this;
	deleteAttribute( name: string ): this;
	hasAttribute( name: string ): boolean;
	computeVertexNormals(): void;
	computeBoundingBox(): void;
	computeBoundingSphere(): void;
	applyMatrix4( matrix: Matrix4 ): this;
	center(): this;
	clone(): this;
	copy( source: BufferGeometry ): this;
	dispose(): void;
}

export class BoxGeometry extends BufferGeometry {
	constructor( width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number );
	readonly isBoxGeometry: true;
}

export class SphereGeometry extends BufferGeometry {
	constructor( radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number );
	readonly isSphereGeometry: true;
}

export class PlaneGeometry extends BufferGeometry {
	constructor( width?: number, height?: number, widthSegments?: number, heightSegments?: number );
	readonly isPlaneGeometry: true;
}

export class CylinderGeometry extends BufferGeometry {
	constructor( radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number );
	readonly isCylinderGeometry: true;
}

// ==========================================
// MATERIALS
// ==========================================

export class Material extends EventDispatcher {
	constructor();
	id: number;
	uuid: string;
	name: string;
	type: string;
	side: number;
	opacity: number;
	transparent: boolean;
	blending: number;
	wireframe: boolean;
	vertexColors: boolean;
	visible: boolean;
	userData: Record<string, any>;
	needsUpdate: boolean;
	readonly isMaterial: true;
	clone(): this;
	copy( source: Material ): this;
	dispose(): void;
}

export class MeshBasicMaterial extends Material {
	constructor( parameters?: any );
	readonly isMeshBasicMaterial: true;
	color: Color;
	map: Texture | null;
	wireframe: boolean;
}

export class MeshStandardMaterial extends Material {
	constructor( parameters?: any );
	readonly isMeshStandardMaterial: true;
	color: Color;
	roughness: number;
	metalness: number;
	map: Texture | null;
	normalMap: Texture | null;
	roughnessMap: Texture | null;
	metalnessMap: Texture | null;
	envMap: Texture | null;
}

export class MeshPhysicalMaterial extends MeshStandardMaterial {
	constructor( parameters?: any );
	readonly isMeshPhysicalMaterial: true;
	clearcoat: number;
	clearcoatRoughness: number;
	ior: number;
	transmission: number;
	thickness: number;
	specularIntensity: number;
	specularColor: Color;
}

export class ShaderMaterial extends Material {
	constructor( parameters?: any );
	readonly isShaderMaterial: true;
	uniforms: Record<string, { value: any }>;
	vertexShader: string;
	fragmentShader: string;
}

// ==========================================
// MESH / LIGHTS / TEXTURES / RENDERER
// ==========================================

export class Mesh<TGeometry extends BufferGeometry = BufferGeometry, TMaterial extends Material | Material[] = Material | Material[]> extends Object3D {
	constructor( geometry?: TGeometry, material?: TMaterial );
	readonly isMesh: true;
	geometry: TGeometry;
	material: TMaterial;
}

export class Points<TGeometry extends BufferGeometry = BufferGeometry, TMaterial extends Material | Material[] = Material | Material[]> extends Object3D {
	constructor( geometry?: TGeometry, material?: TMaterial );
	readonly isPoints: true;
	geometry: TGeometry;
	material: TMaterial;
}

export class Line<TGeometry extends BufferGeometry = BufferGeometry, TMaterial extends Material | Material[] = Material | Material[]> extends Object3D {
	constructor( geometry?: TGeometry, material?: TMaterial );
	readonly isLine: true;
	geometry: TGeometry;
	material: TMaterial;
}

export class Light extends Object3D {
	constructor( color?: Color | string | number, intensity?: number );
	readonly isLight: true;
	color: Color;
	intensity: number;
}

export class AmbientLight extends Light {
	constructor( color?: Color | string | number, intensity?: number );
	readonly isAmbientLight: true;
}

export class DirectionalLight extends Light {
	constructor( color?: Color | string | number, intensity?: number );
	readonly isDirectionalLight: true;
	target: Object3D;
	castShadow: boolean;
}

export class PointLight extends Light {
	constructor( color?: Color | string | number, intensity?: number, distance?: number, decay?: number );
	readonly isPointLight: true;
	distance: number;
	decay: number;
}

export class TextureSource {
	constructor( data?: any );
	readonly isTextureSource: true;
	data: any;
	version: number;
	needsUpdate: boolean;
}

export { TextureSource as Source };

export class Texture extends EventDispatcher {
	constructor( image?: any, mapping?: number, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number, format?: number, type?: number, anisotropy?: number, colorSpace?: string );
	readonly isTexture: true;
	id: number;
	uuid: string;
	name: string;
	source: TextureSource;
	image: any;
	mapping: number;
	wrapS: number;
	wrapT: number;
	magFilter: number;
	minFilter: number;
	format: number;
	type: number;
	anisotropy: number;
	colorSpace: string;
	needsUpdate: boolean;
	dispose(): void;
}

export class DataTexture extends Texture {
	constructor( data?: ArrayBufferView | null, width?: number, height?: number, format?: number, type?: number, mapping?: number, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number, anisotropy?: number, colorSpace?: string );
	readonly isDataTexture: true;
}

export interface WebGLRendererParameters {
	canvas?: HTMLCanvasElement | OffscreenCanvas;
	context?: WebGL2RenderingContext;
	precision?: 'highp' | 'mediump' | 'lowp';
	alpha?: boolean;
	premultipliedAlpha?: boolean;
	antialias?: boolean;
	stencil?: boolean;
	preserveDrawingBuffer?: boolean;
	powerPreference?: 'default' | 'high-performance' | 'low-power';
	depth?: boolean;
	failIfMajorPerformanceCaveat?: boolean;
}

export class WebGLRenderer {
	constructor( parameters?: WebGLRendererParameters );
	domElement: HTMLCanvasElement;
	autoClear: boolean;
	autoClearColor: boolean;
	autoClearDepth: boolean;
	autoClearStencil: boolean;
	shadowMap: any;
	outputColorSpace: string;
	render( scene: Object3D, camera: Camera ): void;
	setSize( width: number, height: number, updateStyle?: boolean ): void;
	setPixelRatio( value: number ): void;
	getPixelRatio(): number;
	getSize( target: Vector2 ): Vector2;
	setClearColor( color: Color | string | number, alpha?: number ): void;
	getClearColor( target: Color ): Color;
	getClearAlpha(): number;
	clear( color?: boolean, depth?: boolean, stencil?: boolean ): void;
	dispose(): void;
}

export class Loader {
	constructor( manager?: any );
	crossOrigin: string;
	path: string;
	resourcePath: string;
	setPath( path: string ): this;
	setResourcePath( resourcePath: string ): this;
	setCrossOrigin( crossOrigin: string ): this;
}

export class TextureLoader extends Loader {
	load( url: string, onLoad?: ( texture: Texture ) => void, onProgress?: ( event: ProgressEvent ) => void, onError?: ( event: ErrorEvent ) => void ): Texture;
	loadAsync( url: string, onProgress?: ( event: ProgressEvent ) => void ): Promise<Texture>;
}

// Global ambient namespace support
export * as FOUR from './index';
export * as THREE from './index';
