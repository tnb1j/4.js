# HorizontalBlurShader

## Import

HorizontalBlurShader is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { HorizontalBlurShader } from 'fourjs/addons/shaders/HorizontalBlurShader.js';
```

## Properties

### .HorizontalBlurShader : ShaderMaterial~Shader (inner, constant)

Two pass Gaussian blur filter (horizontal and vertical blur shaders).

References:

*   [http://www.cake23.de/traveling-wavefronts-lit-up.html](http://www.cake23.de/traveling-wavefronts-lit-up.html).
    
*   9 samples per pass
    
*   standard deviation 2.7
    
*   "h" and "v" parameters should be set to "1 / width" and "1 / height"
    

## Source

[examples/jsm/shaders/HorizontalBlurShader.js](../../examples/jsm/shaders/HorizontalBlurShader.js)