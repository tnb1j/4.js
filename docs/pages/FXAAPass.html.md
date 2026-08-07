*Inheritance: Pass → ShaderPass →*

# FXAAPass

A pass for applying FXAA.

## Code Example

```js
const fxaaPass = new FXAAPass();
composer.addPass( fxaaPass );
```

## Import

FXAAPass is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { FXAAPass } from '@tnb1j/4js/addons/postprocessing/FXAAPass.js';
```

## Constructor

### new FXAAPass()

Constructs a new FXAA pass.

## Methods

### .setSize( width : number, height : number )

Sets the size of the pass.

**width**

The width to set.

**height**

The height to set.

**Overrides:** [ShaderPass#setSize](ShaderPass.html#setSize)

## Source

[examples/jsm/postprocessing/FXAAPass.js](../../examples/jsm/postprocessing/FXAAPass.js)