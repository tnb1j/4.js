*Inheritance: EventDispatcher → Object3D → Line →*

# PlaneHelper

A helper object to visualize an instance of [Plane](Plane.html).

## Code Example

```js
const plane = new FOUR.Plane( new FOUR.Vector3( 1, 1, 0.2 ), 3 );
const helper = new FOUR.PlaneHelper( plane, 1, 0xffff00 );
scene.add( helper );
```

## Constructor

### new PlaneHelper( plane : Plane, size : number, hex : number | Color | string )

Constructs a new plane helper.

**plane**

The plane to be visualized.

**size**

The side length of plane helper.

Default is `1`.

**hex**

The helper's color.

Default is `0xffff00`.

## Properties

### .plane : Plane

The plane being visualized.

### .size : number

The side length of plane helper.

Default is `1`.

## Methods

### .dispose()

Updates the helper to match the position and direction of the light being visualized.

## Source

[src/helpers/PlaneHelper.js](../../src/helpers/PlaneHelper.js)