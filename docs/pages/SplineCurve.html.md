*Inheritance: Curve →*

# SplineCurve

A curve representing a 2D spline curve.

## Code Example

```js
// Create a sine-like wave
const curve = new FOUR.SplineCurve( [
	new FOUR.Vector2( -10, 0 ),
	new FOUR.Vector2( -5, 5 ),
	new FOUR.Vector2( 0, 0 ),
	new FOUR.Vector2( 5, -5 ),
	new FOUR.Vector2( 10, 0 )
] );
const points = curve.getPoints( 50 );
const geometry = new FOUR.BufferGeometry().setFromPoints( points );
const material = new FOUR.LineBasicMaterial( { color: 0xff0000 } );
// Create the final object to add to the scene
const splineObject = new FOUR.Line( geometry, material );
```

## Constructor

### new SplineCurve( points : Array.<Vector2> )

Constructs a new 2D spline curve.

**points**

An array of 2D points defining the curve.

## Properties

### .isSplineCurve : boolean (readonly)

This flag can be used for type testing.

Default is `true`.

### .points : Array.<Vector2>

An array of 2D points defining the curve.

## Methods

### .getPoint( t : number, optionalTarget : Vector2 ) : Vector2

Returns a point on the curve.

**t**

A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.

**optionalTarget**

The optional target vector the result is written to.

**Overrides:** [Curve#getPoint](Curve.html#getPoint)

**Returns:** The position on the curve.

## Source

[src/extras/curves/SplineCurve.js](../../src/extras/curves/SplineCurve.js)