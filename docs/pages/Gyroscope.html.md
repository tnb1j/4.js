*Inheritance: EventDispatcher → Object3D →*

# Gyroscope

A special type of 3D object that takes a position from the scene graph hierarchy but uses its local rotation as world rotation. It works like real-world gyroscope - you can move it around using hierarchy while its orientation stays fixed with respect to the world.

## Import

Gyroscope is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { Gyroscope } from '@tnb1j/4js/addons/misc/Gyroscope.js';
```

## Constructor

### new Gyroscope()

Constructs a new gyroscope.

## Source

[examples/jsm/misc/Gyroscope.js](../../examples/jsm/misc/Gyroscope.js)