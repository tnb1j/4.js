*Inheritance: EventDispatcher → Controls → OrbitControls →*

# MapControls

This class is intended for transforming a camera over a map from bird's eye perspective. The class shares its implementation with [OrbitControls](OrbitControls.html) but uses a specific preset for mouse/touch interaction and disables screen space panning by default.

*   Orbit: Right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate.
*   Zoom: Middle mouse, or mousewheel / touch: two-finger spread or squish.
*   Pan: Left mouse, or arrow keys / touch: one-finger move.

## Import

MapControls is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { MapControls } from 'fourjs/addons/controls/MapControls.js';
```

## Constructor

### new MapControls()

## Properties

### .mouseButtons : Object

This object contains references to the mouse actions used by the controls.

```js
controls.mouseButtons = {
	LEFT: FOUR.MOUSE.PAN,
	MIDDLE: FOUR.MOUSE.DOLLY,
	RIGHT: FOUR.MOUSE.ROTATE
}
```

**Overrides:** [OrbitControls#mouseButtons](OrbitControls.html#mouseButtons)

### .screenSpacePanning : boolean

Overwritten and set to `false` to pan orthogonal to world-space direction `camera.up`.

Default is `false`.

**Overrides:** [OrbitControls#screenSpacePanning](OrbitControls.html#screenSpacePanning)

### .touches : Object

This object contains references to the touch actions used by the controls.

```js
controls.mouseButtons = {
	ONE: FOUR.TOUCH.PAN,
	TWO: FOUR.TOUCH.DOLLY_ROTATE
}
```

**Overrides:** [OrbitControls#touches](OrbitControls.html#touches)

## Source

[examples/jsm/controls/MapControls.js](../../examples/jsm/controls/MapControls.js)