*Inheritance: EventDispatcher → BufferGeometry →*

# BoxLineGeometry

A special type of box geometry intended for [LineSegments](LineSegments.html).

## Code Example

```js
const geometry = new FOUR.BoxLineGeometry();
const material = new FOUR.LineBasicMaterial( { color: 0x00ff00 } );
const lines = new FOUR.LineSegments( geometry, material );
scene.add( lines );
```

## Import

BoxLineGeometry is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { BoxLineGeometry } from '@fourjs/core/addons/geometries/BoxLineGeometry.js';
```

## Constructor

### new BoxLineGeometry( width : number, height : number, depth : number, widthSegments : number, heightSegments : number, depthSegments : number )

Constructs a new box line geometry.

**width**

The width. That is, the length of the edges parallel to the X axis.

Default is `1`.

**height**

The height. That is, the length of the edges parallel to the Y axis.

Default is `1`.

**depth**

The depth. That is, the length of the edges parallel to the Z axis.

Default is `1`.

**widthSegments**

Number of segmented rectangular sections along the width of the sides.

Default is `1`.

**heightSegments**

Number of segmented rectangular sections along the height of the sides.

Default is `1`.

**depthSegments**

Number of segmented rectangular sections along the depth of the sides.

Default is `1`.

## Source

[examples/jsm/geometries/BoxLineGeometry.js](../../examples/jsm/geometries/BoxLineGeometry.js)