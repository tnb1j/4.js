# FXAAShader

## Import

FXAAShader is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { FXAAShader } from '@tnb1j/4js/addons/shaders/FXAAShader.js';
```

## Properties

### .FXAAShader : ShaderMaterial~Shader (inner, constant)

FXAA algorithm from NVIDIA, C# implementation by Jasper Flick, GLSL port by Dave Hoskins.

References:

*   [http://developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA\_WhitePaper.pdf](http://developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA_WhitePaper.pdf).
*   [https://catlikecoding.com/unity/tutorials/advanced-rendering/fxaa/](https://catlikecoding.com/unity/tutorials/advanced-rendering/fxaa/).

## Source

[examples/jsm/shaders/FXAAShader.js](../../examples/jsm/shaders/FXAAShader.js)