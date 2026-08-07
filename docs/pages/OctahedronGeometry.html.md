*Inheritance: EventDispatcher → BufferGeometry → PolyhedronGeometry →*

# OctahedronGeometry

A geometry class for representing an octahedron.

## Code Example

```js
const geometry = new FOUR.OctahedronGeometry();
const material = new FOUR.MeshBasicMaterial( { color: 0xffff00 } );
const octahedron = new FOUR.Mesh( geometry, material );
scene.add( octahedron );
```

## Constructor

### new OctahedronGeometry( radius : number, detail : number )

Constructs a new octahedron geometry.

**radius**

Radius of the octahedron.

Default is `1`.

**detail**

Setting this to a value greater than `0` adds vertices making it no longer a octahedron.

Default is `0`.

## Properties

### .parameters : Object

Holds the constructor parameters that have been used to generate the geometry. Any modification after instantiation does not change the geometry.

**Overrides:** [PolyhedronGeometry#parameters](PolyhedronGeometry.html#parameters)

## Static Methods

### .fromJSON( data : Object ) : OctahedronGeometry

Factory method for creating an instance of this class from the given JSON object.

**data**

A JSON object representing the serialized geometry.

**Returns:** A new instance.

## Source

[src/geometries/OctahedronGeometry.js](../../src/geometries/OctahedronGeometry.js)