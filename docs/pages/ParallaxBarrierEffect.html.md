# ParallaxBarrierEffect

A class that creates an parallax barrier effect.

Note that this class can only be used with [WebGLRenderer](WebGLRenderer.html). When using [WebGPURenderer](WebGPURenderer.html), use [ParallaxBarrierPassNode](ParallaxBarrierPassNode.html).

## Import

ParallaxBarrierEffect is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { ParallaxBarrierEffect } from '@tnb1j/4js/addons/effects/ParallaxBarrierEffect.js';
```

## Constructor

### new ParallaxBarrierEffect( renderer : WebGLRenderer )

Constructs a new parallax barrier effect.

**renderer**

The renderer.

## Methods

### .dispose()

Frees internal resources. This method should be called when the effect is no longer required.

### .render( scene : Object3D, camera : Camera )

When using this effect, this method should be called instead of the default [WebGLRenderer#render](WebGLRenderer.html#render).

**scene**

The scene to render.

**camera**

The camera.

### .setSize( width : number, height : number )

Resizes the effect.

**width**

The width of the effect in logical pixels.

**height**

The height of the effect in logical pixels.

## Source

[examples/jsm/effects/ParallaxBarrierEffect.js](../../examples/jsm/effects/ParallaxBarrierEffect.js)