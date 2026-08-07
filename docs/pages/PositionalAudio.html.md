*Inheritance: EventDispatcher → Object3D → Audio →*

# PositionalAudio

Represents a positional audio object.

## Code Example

```js
// create an AudioListener and add it to the camera
const listener = new FOUR.AudioListener();
camera.add( listener );
// create the PositionalAudio object (passing in the listener)
const sound = new FOUR.PositionalAudio( listener );
// load a sound and set it as the PositionalAudio object's buffer
const audioLoader = new FOUR.AudioLoader();
audioLoader.load( 'sounds/song.ogg', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setRefDistance( 20 );
	sound.play();
});
// create an object for the sound to play from
const sphere = new FOUR.SphereGeometry( 20, 32, 16 );
const material = new FOUR.MeshPhongMaterial( { color: 0xff2200 } );
const mesh = new FOUR.Mesh( sphere, material );
scene.add( mesh );
// finally add the sound to the mesh
mesh.add( sound );
```

## Constructor

### new PositionalAudio( listener : AudioListener )

Constructs a positional audio.

**listener**

The global audio listener.

## Properties

### .panner : PannerNode (readonly)

The panner node represents the location, direction, and behavior of an audio source in 3D space.

## Methods

### .getDistanceModel() : 'linear' | 'inverse' | 'exponential'

Returns the current distance model.

**Returns:** The distance model.

### .getMaxDistance() : number

Returns the current max distance.

**Returns:** The max distance.

### .getRefDistance() : number

Returns the current reference distance.

**Returns:** The reference distance.

### .getRolloffFactor() : number

Returns the current rolloff factor.

**Returns:** The rolloff factor.

### .setDirectionalCone( coneInnerAngle : number, coneOuterAngle : number, coneOuterGain : number ) : PositionalAudio

Sets the directional cone in which the audio can be listened.

**coneInnerAngle**

An angle, in degrees, of a cone inside of which there will be no volume reduction.

**coneOuterAngle**

An angle, in degrees, of a cone outside of which the volume will be reduced by a constant value, defined by the `coneOuterGain` parameter.

**coneOuterGain**

The amount of volume reduction outside the cone defined by the `coneOuterAngle`. When set to `0`, no sound can be heard.

**Returns:** A reference to this instance.

### .setDistanceModel( value : 'linear' | 'inverse' | 'exponential' ) : PositionalAudio

Defines which algorithm to use to reduce the volume of the audio source as it moves away from the listener.

Read [the spec](https://www.w3.org/TR/webaudio-1.1/#enumdef-distancemodeltype) for more details.

**value**

The distance model to set.

**Returns:** A reference to this instance.

### .setMaxDistance( value : number ) : PositionalAudio

Defines the maximum distance between the audio source and the listener, after which the volume is not reduced any further.

This value is used only by the `linear` distance model.

**value**

The max distance.

**Returns:** A reference to this instance.

### .setRefDistance( value : number ) : PositionalAudio

Defines the reference distance for reducing volume as the audio source moves further from the listener – i.e. the distance at which the volume reduction starts taking effect.

**value**

The reference distance to set.

**Returns:** A reference to this instance.

### .setRolloffFactor( value : number ) : PositionalAudio

Defines how quickly the volume is reduced as the source moves away from the listener.

**value**

The rolloff factor.

**Returns:** A reference to this instance.

## Source

[src/audio/PositionalAudio.js](../../src/audio/PositionalAudio.js)