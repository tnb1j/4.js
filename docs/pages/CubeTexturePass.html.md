*Inheritance: Pass →*

# CubeTexturePass

This pass can be used to render a cube texture over the entire screen.

## Code Example

```js
const cubeMap = new FOUR.CubeTextureLoader().load( urls );
const cubeTexturePass = new CubeTexturePass( camera, cubemap );
composer.addPass( cubeTexturePass );
```

## Import

CubeTexturePass is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { CubeTexturePass } from '@tnb1j/4js/addons/postprocessing/CubeTexturePass.js';
```

## Constructor

### new CubeTexturePass( camera : PerspectiveCamera, tCube : CubeTexture, opacity : number )

Constructs a new cube texture pass.

**camera**

The camera.

**tCube**

The cube texture to render.

**opacity**

The opacity.

Default is `1`.

## Properties

### .camera : PerspectiveCamera

The camera.

### .needsSwap : boolean

Overwritten to disable the swap.

Default is `false`.

**Overrides:** [Pass#needsSwap](Pass.html#needsSwap)

### .opacity : number

The opacity.

Default is `1`.

### .tCube : CubeTexture

The cube texture to render.

## Methods

### .dispose()

Frees the GPU-related resources allocated by this instance. Call this method whenever the pass is no longer used in your app.

**Overrides:** [Pass#dispose](Pass.html#dispose)

### .render( renderer : WebGLRenderer, writeBuffer : WebGLRenderTarget, readBuffer : WebGLRenderTarget, deltaTime : number, maskActive : boolean )

Performs the cube texture pass.

**renderer**

The renderer.

**writeBuffer**

The write buffer. This buffer is intended as the rendering destination for the pass.

**readBuffer**

The read buffer. The pass can access the result from the previous pass from this buffer.

**deltaTime**

The delta time in seconds.

**maskActive**

Whether masking is active or not.

**Overrides:** [Pass#render](Pass.html#render)

## Source

[examples/jsm/postprocessing/CubeTexturePass.js](../../examples/jsm/postprocessing/CubeTexturePass.js)