*Inheritance: EventDispatcher →*

# RenderGraph

Experimental dependency-aware execution graph for render and compute tasks.

A pass declares explicit dependencies and optional resource reads/writes. Compilation validates the graph and creates a deterministic topological execution order.

## Constructor

### new RenderGraph()

Constructs an empty render graph.

## Properties

### .isRenderGraph : boolean (readonly)

This flag can be used for type testing.

Default is `true`.

### .passes : Map.<string, Object>

Named graph passes.

### .resources : Map.<string, *>

Named graph resources.

## Methods

### .addPass( name : string, descriptor : Object | function ) : RenderGraph

Adds a graph pass.

**name**

Unique pass name.

**descriptor**

Pass descriptor or execute callback.

**execute**

Pass callback.

**dependsOn**

Explicit pass dependencies.

**reads**

Resource names read by the pass.

**writes**

Resource names written by the pass.

**enabled**

Whether the pass is active.

Default is `true`.

**Returns:** A reference to this graph.

### .clear() : RenderGraph

Removes all passes and resources.

**Returns:** A reference to this graph.

### .compile() : Array.<Object>

Validates and compiles the graph.

**Returns:** Ordered enabled passes.

### .deleteResource( name : string ) : boolean

Deletes a named graph resource.

**name**

Resource name.

**Returns:** Whether the resource was removed.

### .execute( context : Object ) : Promise.<Map.<string, *>> (async)

Executes enabled passes in compiled order.

**context**

Application-defined execution context.

**Returns:** The graph resource map.

### .getExecutionOrder() : Array.<string>

Returns the current pass order by name.

**Returns:** Ordered pass names.

### .getPass( name : string ) : Object

Returns a graph pass.

**name**

Pass name.

**Returns:** The pass, or `null`.

### .getResource( name : string ) : *

Returns a named graph resource.

**name**

Resource name.

**Returns:** Resource value.

### .removePass( name : string ) : boolean

Removes a graph pass.

**name**

Pass name.

**Returns:** Whether a pass was removed.

### .setPassEnabled( name : string, enabled : boolean ) : RenderGraph

Enables or disables a graph pass.

**name**

Pass name.

**enabled**

Enabled state.

**Returns:** A reference to this graph.

### .setResource( name : string, value : * ) : RenderGraph

Sets a named graph resource.

**name**

Resource name.

**value**

Resource value.

**Returns:** A reference to this graph.

### .toJSON() : Object

Returns serializable graph metadata.

**Returns:** Graph metadata.

## Source

[src/renderers/common/RenderGraph.js](../../src/renderers/common/RenderGraph.js)