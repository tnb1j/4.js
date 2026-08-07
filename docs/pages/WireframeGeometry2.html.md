*Inheritance: InstancedBufferGeometry → LineSegmentsGeometry →*

# WireframeGeometry2

A special type of line segments geometry intended for wireframe rendering.

This is used in [Wireframe](Wireframe.html) to describe the shape.

## Code Example

```js
const geometry = new FOUR.IcosahedronGeometry();
const wireframeGeometry = new WireframeGeometry2( geo );
```

## Import

WireframeGeometry2 is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { WireframeGeometry2 } from 'fourjs/addons/lines/WireframeGeometry2.js';
```

## Constructor

### new WireframeGeometry2( geometry : BufferGeometry )

Constructs a new wireframe geometry.

**geometry**

The geometry to render the wireframe for.

## Properties

### .isWireframeGeometry2 : boolean (readonly)

This flag can be used for type testing.

Default is `true`.

## Source

[examples/jsm/lines/WireframeGeometry2.js](../../examples/jsm/lines/WireframeGeometry2.js)