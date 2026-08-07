# ACESFilmicToneMappingShader

## Import

ACESFilmicToneMappingShader is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { ACESFilmicToneMappingShader } from '@tnb1j/4js/addons/shaders/ACESFilmicToneMappingShader.js';
```

## Properties

### .ACESFilmicToneMappingShader : ShaderMaterial~Shader (inner, constant)

ACES Filmic Tone Mapping Shader by Stephen Hill. Reference: [ltc\_blit.fs](https://github.com/selfshadow/ltc_code/blob/master/webgl/shaders/ltc/ltc_blit.fs)

This implementation of ACES is modified to accommodate a brighter viewing environment. The scale factor of 1/0.6 is subjective. See discussion in #19621.

## Source

[examples/jsm/shaders/ACESFilmicToneMappingShader.js](../../examples/jsm/shaders/ACESFilmicToneMappingShader.js)