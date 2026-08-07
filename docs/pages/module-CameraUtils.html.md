# CameraUtils

## Import

CameraUtils is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import * as CameraUtils from '@fourjs/core/addons/utils/CameraUtils.js';
```

## Methods

### .frameCorners( camera : PerspectiveCamera, bottomLeftCorner : Vector3, bottomRightCorner : Vector3, topLeftCorner : Vector3, estimateViewFrustum : boolean ) (inner)

Set projection matrix and the orientation of a perspective camera to exactly frame the corners of an arbitrary rectangle. NOTE: This function ignores the standard parameters; do not call `updateProjectionMatrix()` after this.

**camera**

The camera.

**bottomLeftCorner**

The bottom-left corner point.

**bottomRightCorner**

The bottom-right corner point.

**topLeftCorner**

The top-left corner point.

**estimateViewFrustum**

If set to `true`, the function tries to estimate the camera's FOV.

Default is `false`.

## Source

[examples/jsm/utils/CameraUtils.js](../../examples/jsm/utils/CameraUtils.js)