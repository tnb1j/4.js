/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * Copyright 2026 4.js Contributors
 * SPDX-License-Identifier: MIT
 */

export * from './webgpu';

// ==========================================
// TSL (THREE SHADING LANGUAGE) TYPES & FUNCTIONS
// ==========================================

export function float( val?: any ): any;
export function int( val?: any ): any;
export function uint( val?: any ): any;
export function bool( val?: any ): any;
export function vec2( ...args: any[] ): any;
export function vec3( ...args: any[] ): any;
export function vec4( ...args: any[] ): any;
export function mat2( ...args: any[] ): any;
export function mat3( ...args: any[] ): any;
export function mat4( ...args: any[] ): any;
export function color( ...args: any[] ): any;

export function uniform( val: any, type?: string ): any;
export function attribute( name: string, type?: string ): any;
export function varying( node: any, name?: string ): any;
export function buffer( array: any, type: string, count?: number ): any;
export function storage( buffer: any, type: string, count?: number ): any;

export const positionLocal: any;
export const positionWorld: any;
export const positionView: any;
export const normalLocal: any;
export const normalWorld: any;
export const normalView: any;
export const uv: ( index?: number ) => any;
export const time: any;
export const deltaTime: any;

export function add( a: any, b: any ): any;
export function sub( a: any, b: any ): any;
export function mul( a: any, b: any ): any;
export function div( a: any, b: any ): any;
export function dot( a: any, b: any ): any;
export function cross( a: any, b: any ): any;
export function normalize( a: any ): any;
export function length( a: any ): any;
export function distance( a: any, b: any ): any;
export function mix( a: any, b: any, t: any ): any;
export function clamp( a: any, min?: any, max?: any ): any;
export function saturate( a: any ): any;
export function sin( a: any ): any;
export function cos( a: any ): any;
export function tan( a: any ): any;
export function pow( a: any, b: any ): any;
export function exp( a: any ): any;
export function log( a: any ): any;
export function sqrt( a: any ): any;
export function abs( a: any ): any;
export function min( a: any, b: any ): any;
export function max( a: any, b: any ): any;
export function fract( a: any ): any;
export function floor( a: any ): any;
export function ceil( a: any ): any;
export function round( a: any ): any;

export function tslFn( fn: Function ): any;
export function Fn( fn: Function ): any;
export function If( condition: any, thenFn: Function ): any;
export function Loop( countOrParams: any, loopFn?: Function ): any;

export function texture( tex: any, uv?: any ): any;
export function cubeTexture( tex: any, uv?: any ): any;
