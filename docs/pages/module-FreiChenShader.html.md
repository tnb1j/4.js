# FreiChenShader

## Import

FreiChenShader is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { FreiChenShader } from '@tnb1j/4js/addons/shaders/FreiChenShader.js';
```

## Properties

### .FreiChenShader : ShaderMaterial~Shader (inner, constant)

Edge Detection Shader using Frei-Chen filter. Based on [http://rastergrid.com/blog/2011/01/frei-chen-edge-detector](http://rastergrid.com/blog/2011/01/frei-chen-edge-detector).

aspect: vec2 of (1/width, 1/height)

## Source

[examples/jsm/shaders/FreiChenShader.js](../../examples/jsm/shaders/FreiChenShader.js)