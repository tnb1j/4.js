/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * Copyright 2026 4.js Contributors
 * SPDX-License-Identifier: MIT
 */

export * from './index';

// ==========================================
// 4.js WEBGPU ADDITIONS
// ==========================================

export class RenderGraph {
	constructor( options?: any );
	readonly isRenderGraph: true;
	addPass( pass: any ): this;
	render( renderer: any ): void;
}

export interface TemporalPipelineOptions {
	resolutionScale?: number;
	sharpen?: boolean;
	enabled?: boolean;
	sharpness?: number;
	denoise?: boolean;
	passOptions?: Record<string, any>;
}

export class TemporalPipeline {
	constructor( renderer: any, scene: any, camera: any, options?: TemporalPipelineOptions );
	readonly isTemporalPipeline: true;
	resolutionScale: number;
	sharpen: boolean;
	sharpness: number;
	denoise: boolean;
	render(): void;
	setSize( width: number, height: number ): void;
	dispose(): void;
}

export class DirectRenderPipeline {
	constructor( renderer: any, node: any );
	readonly isDirectRenderPipeline: true;
	render(): void;
}

export class SharpenNode {
	constructor( textureNode: any, sharpness?: any, denoise?: any );
	readonly isSharpenNode: true;
}

export class TAAUNode {
	constructor( colorNode: any, depthNode: any, velocityNode: any, camera: any );
	readonly isTAAUNode: true;
}

export function sharpen( textureNode: any, sharpness?: any, denoise?: any ): any;
export function taau( colorNode: any, depthNode: any, velocityNode: any, camera: any ): any;
export function taaU( colorNode: any, depthNode: any, velocityNode: any, camera: any ): any;

// ==========================================
// WEBGPU RENDERER & NODES
// ==========================================

export interface WebGPURendererParameters {
	canvas?: HTMLCanvasElement | OffscreenCanvas;
	antialias?: boolean;
	sampleCount?: number;
	alpha?: boolean;
	depth?: boolean;
	stencil?: boolean;
	powerPreference?: 'default' | 'high-performance' | 'low-power';
	forceWebGL?: boolean;
}

export class WebGPURenderer {
	constructor( parameters?: WebGPURendererParameters );
	domElement: HTMLCanvasElement;
	autoClear: boolean;
	readonly isWebGPURenderer: true;
	init(): Promise<void>;
	render( scene: any, camera: any ): Promise<void> | void;
	renderAsync( scene: any, camera: any ): Promise<void>;
	setSize( width: number, height: number, updateStyle?: boolean ): void;
	setPixelRatio( value: number ): void;
	getPixelRatio(): number;
	setClearColor( color: any, alpha?: number ): void;
	clear(): void;
	dispose(): void;
}

export class Node {
	constructor( nodeType?: string );
	readonly isNode: true;
	nodeType: string;
	build( builder: any, output?: any ): any;
}

export class TempNode extends Node {
	constructor( type?: string );
	readonly isTempNode: true;
}

export class NodeMaterial {
	constructor();
	readonly isNodeMaterial: true;
	colorNode: Node | null;
	normalNode: Node | null;
	roughnessNode: Node | null;
	metalnessNode: Node | null;
	envNode: Node | null;
	lightsNode: Node | null;
	positionNode: Node | null;
}

export class MeshBasicNodeMaterial extends NodeMaterial {
	constructor( parameters?: any );
	readonly isMeshBasicNodeMaterial: true;
}

export class MeshStandardNodeMaterial extends NodeMaterial {
	constructor( parameters?: any );
	readonly isMeshStandardNodeMaterial: true;
}

export class MeshPhysicalNodeMaterial extends MeshStandardNodeMaterial {
	constructor( parameters?: any );
	readonly isMeshPhysicalNodeMaterial: true;
}

export class PostProcessing {
	constructor( renderer: any, outputNode?: any );
	outputNode: any;
	render(): void;
	renderAsync(): Promise<void>;
}

export function pass( scene: any, camera: any, options?: any ): any;
export function mrt( textures: Record<string, any> ): any;
export function output(): any;
