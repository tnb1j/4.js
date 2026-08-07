# FlakesTexture

Utility class for generating a flakes texture image. This image might be used as a normal map to produce a car paint like effect.

## Import

FlakesTexture is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { FlakesTexture } from 'fourjs/addons/textures/FlakesTexture.js';
```

## Constructor

### new FlakesTexture( width : number, height : number ) : HTMLCanvasElement

Generates a new flakes texture image. The result is a canvas that can be used as an input for [CanvasTexture](CanvasTexture.html).

**width**

The width of the image.

Default is `512`.

**height**

The height of the image.

Default is `512`.

**Returns:** The generated image.

## Source

[examples/jsm/textures/FlakesTexture.js](../../examples/jsm/textures/FlakesTexture.js)