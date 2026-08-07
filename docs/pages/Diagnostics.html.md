*Inheritance: EventDispatcher →*

# Diagnostics

Collects structured diagnostic entries in a bounded in-memory buffer.

Diagnostics is intentionally independent of the browser console. Applications can provide a sink callback to route accepted entries to a logger, telemetry service, or development overlay.

## Constructor

### new Diagnostics( options : Object )

Constructs a diagnostics collector.

**options**

Configuration options.

**level**

Minimum accepted diagnostic level.

Default is `'info'`.

**maxEntries**

Maximum retained entry count.

Default is `200`.

**scope**

Default entry scope.

Default is `'4.js'`.

**sink**

Optional callback invoked for each accepted entry.

Default is `null`.

## Properties

### .entries : Array.<Object> (readonly)

Retained diagnostic entries.

### .isDiagnostics : boolean (readonly)

This flag can be used for type testing.

Default is `true`.

### .level : string

Minimum accepted diagnostic level.

### .maxEntries : number

Maximum retained entry count.

### .scope : string

Default entry scope.

### .sink : function

Optional callback invoked for each accepted entry.

## Methods

### .captureRenderer( renderer : Object, label : string ) : Object

Captures a portable snapshot of a renderer's public information.

**renderer**

A WebGL or WebGPU renderer.

**label**

Entry message.

Default is `'Renderer snapshot'`.

**Returns:** The accepted diagnostic entry.

### .clear() : Diagnostics

Removes all retained entries.

**Returns:** A reference to this instance.

### .debug( message : string, data : *, options : Object ) : Object

Records a debug entry.

**message**

Human-readable message.

**data**

Optional structured data.

Default is `null`.

**options**

Entry options.

**Returns:** The accepted entry, or `null` when filtered.

### .error( message : string, data : *, options : Object ) : Object

Records an error entry.

**message**

Human-readable message.

**data**

Optional structured data.

Default is `null`.

**options**

Entry options.

**Returns:** The accepted entry, or `null` when filtered.

### .getEntries( options : Object ) : Array.<Object>

Returns entries matching optional level, scope, and timestamp filters.

**options**

Filter options.

**level**

Exact entry level.

**scope**

Exact entry scope.

**since**

Inclusive ISO timestamp.

**Returns:** Matching entries.

### .info( message : string, data : *, options : Object ) : Object

Records an informational entry.

**message**

Human-readable message.

**data**

Optional structured data.

Default is `null`.

**options**

Entry options.

**Returns:** The accepted entry, or `null` when filtered.

### .record( level : string, message : string, data : *, options : Object ) : Object

Adds a structured entry when its level meets the configured threshold.

**level**

Entry level.

**message**

Human-readable message.

**data**

Optional structured data.

Default is `null`.

**options**

Entry options.

**scope**

Scope override.

**Returns:** The accepted entry, or `null` when filtered.

### .setLevel( level : string ) : Diagnostics

Sets the minimum accepted level.

**level**

The new diagnostic level.

**Returns:** A reference to this instance.

### .toJSON() : Object

Returns a serializable diagnostics snapshot.

**Returns:** Diagnostics data.

### .toString() : string

Returns a formatted JSON representation.

**Returns:** Formatted diagnostics data.

### .warn( message : string, data : *, options : Object ) : Object

Records a warning entry.

**message**

Human-readable message.

**data**

Optional structured data.

Default is `null`.

**options**

Entry options.

**Returns:** The accepted entry, or `null` when filtered.

## Source

[src/core/Diagnostics.js](../../src/core/Diagnostics.js)