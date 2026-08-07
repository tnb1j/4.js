*Inheritance: EventDispatcher → Object3D → Light →*

# AmbientLight

This light globally illuminates all objects in the scene equally.

It cannot be used to cast shadows as it does not have a direction.

## Code Example

```js
const light = new FOUR.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
```

## Constructor

### new AmbientLight( color : number | Color | string, intensity : number )

Constructs a new ambient light.

**color**

The light's color.

Default is `0xffffff`.

**intensity**

The light's strength/intensity.

Default is `1`.

## Properties

### .isAmbientLight : boolean (readonly)

This flag can be used for type testing.

Default is `true`.

## Source

[src/lights/AmbientLight.js](../../src/lights/AmbientLight.js)