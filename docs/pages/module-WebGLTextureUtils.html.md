# WebGLTextureUtils

## Import

WebGLTextureUtils is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import * as WebGLTextureUtils from '@tnb1j/4js/addons/utils/WebGLTextureUtils.js';
```

## Static Methods

### .decompress( texture : CompressedTexture, maxTextureSize : number, renderer : WebGLRenderer ) : CanvasTexture

Returns an uncompressed version of the given compressed texture.

This module can only be used with [WebGLRenderer](WebGLRenderer.html). When using [WebGPURenderer](WebGPURenderer.html), import the function from [WebGPUTextureUtils](WebGPUTextureUtils.html).

**texture**

The compressed texture.

**maxTextureSize**

The maximum size of the uncompressed texture.

Default is `Infinity`.

**renderer**

A reference to a renderer.

Default is `null`.

**Returns:** The uncompressed texture.

## Source

[examples/jsm/utils/WebGLTextureUtils.js](../../examples/jsm/utils/WebGLTextureUtils.js)