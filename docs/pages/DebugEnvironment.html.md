*Inheritance: EventDispatcher → Object3D → Scene →*

# DebugEnvironment

This class represents a scene with a very basic room setup that can be used as input for [PMREMGenerator#fromScene](PMREMGenerator.html#fromScene). The resulting PMREM represents the room's lighting and can be used for Image Based Lighting by assigning it to [Scene#environment](Scene.html#environment) or directly as an environment map to PBR materials.

This class uses a simple room setup and should only be used for development purposes. A more appropriate setup for production is [RoomEnvironment](RoomEnvironment.html).

## Code Example

```js
const environment = new DebugEnvironment();
const pmremGenerator = new FOUR.PMREMGenerator( renderer );
const envMap = pmremGenerator.fromScene( environment ).texture;
scene.environment = envMap;
```

## Import

DebugEnvironment is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { DebugEnvironment } from '@tnb1j/4js/addons/environments/DebugEnvironment.js';
```

## Constructor

### new DebugEnvironment()

Constructs a new debug environment.

## Methods

### .dispose()

Frees internal resources. This method should be called when the environment is no longer required.

## Source

[examples/jsm/environments/DebugEnvironment.js](../../examples/jsm/environments/DebugEnvironment.js)