*Inheritance: RenderPipeline →*

# TemporalPipeline

High-level temporal antialiasing and upscaling pipeline.

The pipeline owns a lower-resolution scene pass with color, depth, and velocity outputs, a TAAU history resolve, and optional contrast-adaptive sharpening.

Note: The scene pass is created with multisampling disabled because temporal accumulation and MSAA must not be combined.

## Constructor

### new TemporalPipeline( renderer : Renderer, scene : Scene, camera : Camera, options : Object )

Constructs a temporal pipeline.

**renderer**

Initialized WebGPU renderer.

**scene**

Scene to render.

**camera**

Camera to render.

**options**

Pipeline options.

**resolutionScale**

Internal scene resolution scale.

Default is `0.67`.

**sharpen**

Whether sharpening is enabled.

Default is `true`.

**enabled**

Whether temporal resolve is enabled.

Default is `true`.

**sharpness**

RCAS sharpness, where zero is strongest.

Default is `0.2`.

**denoise**

Whether RCAS noise attenuation is enabled.

Default is `false`.

**passOptions**

Additional scene pass render target options.

## Properties

### .camera : Camera

Camera rendered by this pipeline.

### .enabled : boolean

Whether temporal resolve is enabled.

### .isTemporalPipeline : boolean (readonly)

This flag can be used for type testing.

Default is `true`.

### .scene : Scene

Scene rendered by this pipeline.

### .scenePass : PassNode (readonly)

Lower-resolution scene pass.

### .sharpenNode : SharpenNode (readonly)

Contrast-adaptive sharpening node.

### .sharpening : boolean

Whether sharpening is enabled.

### .temporalNode : TAAUNode (readonly)

Temporal resolve node.

## Methods

### .dispose()

Frees pipeline resources.

**Overrides:** [RenderPipeline#dispose](RenderPipeline.html#dispose)

### .getResolutionScale() : number

Returns the internal scene resolution scale.

**Returns:** Resolution scale.

### .reset() : TemporalPipeline

Invalidates temporal history.

Call this after camera cuts, teleports, or discontinuous scene changes.

**Returns:** A reference to this pipeline.

### .setCamera( camera : Camera ) : TemporalPipeline

Replaces the rendered camera.

**camera**

New camera.

**Returns:** A reference to this pipeline.

### .setEnabled( enabled : boolean ) : TemporalPipeline

Enables temporal resolve or bypasses it with the scene pass.

**enabled**

Whether temporal resolve is enabled.

**Returns:** A reference to this pipeline.

### .setResolutionScale( resolutionScale : number ) : TemporalPipeline

Sets the internal scene resolution scale.

**resolutionScale**

Value greater than zero and at most one.

**Returns:** A reference to this pipeline.

### .setScene( scene : Scene ) : TemporalPipeline

Replaces the rendered scene.

**scene**

New scene.

**Returns:** A reference to this pipeline.

### .setSharpening( enabled : boolean ) : TemporalPipeline

Enables or disables the sharpening stage.

**enabled**

Whether sharpening is enabled.

**Returns:** A reference to this pipeline.

### .setSharpness( sharpness : number ) : TemporalPipeline

Sets RCAS sharpening strength.

**sharpness**

Value from zero (strongest) to two (disabled).

**Returns:** A reference to this pipeline.

## Source

[src/renderers/common/TemporalPipeline.js](../../src/renderers/common/TemporalPipeline.js)