# VolumeShader

## Import

VolumeShader is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { VolumeRenderShader1 } from '@tnb1j/4js/addons/shaders/VolumeShader.js';
```

## Properties

### .VolumeRenderShader1 : ShaderMaterial~Shader (inner, constant)

Shaders to render 3D volumes using raycasting. The applied techniques are based on similar implementations in the Visvis and Vispy projects. This is not the only approach, therefore it's marked 1.

## Source

[examples/jsm/shaders/VolumeShader.js](../../examples/jsm/shaders/VolumeShader.js)