# SSAOShader

## Import

SSAOShader is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { SSAOShader } from '@tnb1j/4js/addons/shaders/SSAOShader.js';
```

## Properties

### .SSAOBlurShader : Object (inner, constant)

SSAO blur shader.

### .SSAODepthShader : ShaderMaterial~Shader (inner, constant)

SSAO depth shader.

### .SSAOShader : ShaderMaterial~Shader (inner, constant)

SSAO shader.

References:

*   [http://john-chapman-graphics.blogspot.com/2013/01/ssao-tutorial.html](http://john-chapman-graphics.blogspot.com/2013/01/ssao-tutorial.html)
*   [https://learnopengl.com/Advanced-Lighting/SSAO](https://learnopengl.com/Advanced-Lighting/SSAO)
*   [https://github.com/McNopper/OpenGL/blob/master/Example28/shader/ssao.frag.glsl](https://github.com/McNopper/OpenGL/blob/master/Example28/shader/ssao.frag.glsl)

## Source

[examples/jsm/shaders/SSAOShader.js](../../examples/jsm/shaders/SSAOShader.js)