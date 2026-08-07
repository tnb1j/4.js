*Inheritance: EventDispatcher → BufferGeometry →*

# ShapeGeometry

Creates an one-sided polygonal geometry from one or more path shapes.

## Code Example

```js
const arcShape = new FOUR.Shape()
	.moveTo( 5, 1 )
	.absarc( 1, 1, 4, 0, Math.PI * 2, false );
const geometry = new FOUR.ShapeGeometry( arcShape );
const material = new FOUR.MeshBasicMaterial( { color: 0x00ff00, side: FOUR.DoubleSide } );
const mesh = new FOUR.Mesh( geometry, material ) ;
scene.add( mesh );
```

## Constructor

### new ShapeGeometry( shapes : Shape | Array.<Shape>, curveSegments : number )

Constructs a new shape geometry.

**shapes**

A shape or an array of shapes.

**curveSegments**

Number of segments per shape.

Default is `12`.

## Properties

### .parameters : Object

Holds the constructor parameters that have been used to generate the geometry. Any modification after instantiation does not change the geometry.

## Static Methods

### .fromJSON( data : Object, shapes : Array.<Shape> ) : ShapeGeometry

Factory method for creating an instance of this class from the given JSON object.

**data**

A JSON object representing the serialized geometry.

**shapes**

An array of shapes.

**Returns:** A new instance.

## Source

[src/geometries/ShapeGeometry.js](../../src/geometries/ShapeGeometry.js)