*Inheritance: EventDispatcher → BufferGeometry →*

# EdgesGeometry

Can be used as a helper object to view the edges of a geometry.

Note: It is not yet possible to serialize/deserialize instances of this class.

## Code Example

```js
const geometry = new FOUR.BoxGeometry();
const edges = new FOUR.EdgesGeometry( geometry );
const line = new FOUR.LineSegments( edges );
scene.add( line );
```

## Constructor

### new EdgesGeometry( geometry : BufferGeometry, thresholdAngle : number )

Constructs a new edges geometry.

**geometry**

The geometry.

Default is `null`.

**thresholdAngle**

An edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value.

Default is `1`.

## Properties

### .parameters : Object

Holds the constructor parameters that have been used to generate the geometry. Any modification after instantiation does not change the geometry.

## Source

[src/geometries/EdgesGeometry.js](../../src/geometries/EdgesGeometry.js)