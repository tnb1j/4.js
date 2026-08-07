# StereoEffect

A class that creates an stereo effect.

Note that this class can only be used with [WebGLRenderer](WebGLRenderer.html). When using [WebGPURenderer](WebGPURenderer.html), use [StereoPassNode](StereoPassNode.html).

## Import

StereoEffect is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { StereoEffect } from '@tnb1j/4js/addons/effects/StereoEffect.js';
```

## Constructor

### new StereoEffect( renderer : WebGLRenderer )

Constructs a new stereo effect.

**renderer**

The renderer.

## Methods

### .render( scene : Object3D, camera : Camera )

When using this effect, this method should be called instead of the default [WebGLRenderer#render](WebGLRenderer.html#render).

**scene**

The scene to render.

**camera**

The camera.

### .setEyeSeparation( eyeSep : number )

Sets the given eye separation.

**eyeSep**

The eye separation to set.

### .setSize( width : number, height : number )

Resizes the effect.

**width**

The width of the effect in logical pixels.

**height**

The height of the effect in logical pixels.

## Source

[examples/jsm/effects/StereoEffect.js](../../examples/jsm/effects/StereoEffect.js)