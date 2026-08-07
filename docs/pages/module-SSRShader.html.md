# SSRShader

## Import

SSRShader is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import * as SSRShader from '@tnb1j/4js/addons/shaders/SSRShader.js';
```

A collection of shaders used for SSR.

References:

*   [3D Game Shaders For Beginners, Screen Space Reflection (SSR)](https://lettier.github.io/3d-game-shaders-for-beginners/screen-space-reflection.html).

## Properties

### .SSRBlurShader : ShaderMaterial~Shader (inner, constant)

SSR Blur shader.

### .SSRDepthShader : ShaderMaterial~Shader (inner, constant)

SSR Depth shader.

### .SSRShader : ShaderMaterial~Shader (inner, constant)

SSR shader.

## Source

[examples/jsm/shaders/SSRShader.js](../../examples/jsm/shaders/SSRShader.js)