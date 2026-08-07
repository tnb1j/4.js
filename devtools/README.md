# 4.js DevTools Extension

This Chrome DevTools extension provides debugging capabilities for 4.js applications. It allows you to inspect scenes, objects, materials, and renderers.

## Installation

1. **Development Mode**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked" and select the `devtools` directory
   - The extension will now be available in Chrome DevTools when inspecting pages that use 4.js

2. **Usage**:
   - Open Chrome DevTools on a page using 4.js (F12 or Right-click > Inspect)
   - Click on the "4.js" tab in DevTools
   - The panel will automatically detect and display 4.js scenes and renderers found on the page.

## Code Flow Overview

### Extension Architecture

The extension follows a standard Chrome DevTools extension architecture:

1. **Background Script** (`background.js`): Manages the extension lifecycle and communication ports between the panel and content script.
2. **DevTools Script** (`devtools.js`): Creates the panel when the DevTools window opens.
3. **Panel UI** (`panel/panel.html`, `panel/panel.js`, `panel/panel.css`): The DevTools panel interface that displays the data.
4. **Content Script** (`content-script.js`): Injected into the web page. Relays messages between the background script and the bridge script.
5. **Bridge Script** (`bridge.js`): Injected into the page's main world via the manifest. Directly interacts with the 4.js instance, detects objects, gathers data, and communicates back via the content script.

### Initialization Flow

1. When a page loads, Chrome injects `bridge.js` into the page's main world (including iframes).
2. `bridge.js` creates `window.__FOUR_DEVTOOLS__` and a compatibility
   `window.__THREE_DEVTOOLS__` alias backed by the same event target.
3. When the DevTools panel is opened, `panel.js` connects to `background.js` (`init`) and immediately requests the current state (`request-state`).
4. `background.js` relays the state request to `content-script.js`, which posts it to `bridge.js`.
5. `bridge.js` responds by sending back observed renderer data (`renderer` message) and batched scene data (`scene` message).
6. Native 4.js builds detect `window.__FOUR_DEVTOOLS__`; compatibility builds
   detect `window.__THREE_DEVTOOLS__`. Both send registration and observation
   events to the same bridge.

### Bridge Operation (`bridge.js`)

The bridge acts as the communication layer between the 4.js instance on the page and the DevTools panel:

1. **Event Management**: Creates a custom event target (`DevToolsEventTarget`) to manage communication readiness and backlog events before the panel connects.
2. **Object Tracking**:
   - `getObjectData()`: Extracts essential data (UUID, type, name, parent, children, etc.) from 4.js objects.
   - Maintains a local map (`devTools.objects`) of all observed objects.

3. **Initial Observation & Batching**:
   - When 4.js sends an `observe` event through the devtools event target:
     - If it's a renderer, its data is collected and sent immediately via a `'renderer'` message.
     - If it's a scene, the bridge traverses the entire scene graph, collects data for the scene and all descendants, stores them locally, and sends them to the panel in a single `'scene'` batch message.

4. **State Request Handling**:
   - When the panel sends `request-state` (on load/reload), the bridge iterates its known objects and sends back the current renderer data (`'renderer'`) and scene data (`'scene'` batch).

5. **Message Handling**:
   - Listens for messages from the panel (relayed via content script) like `request-state`.

### Panel Interface (`panel/`)

The panel UI provides the visual representation of the 4.js objects:

1. **Tree View**: Displays hierarchical representation of scenes and objects.
2. **Renderer Details**: Shows properties and statistics for renderers in a collapsible section.

## Key Features

- **Scene Hierarchy Visualization**: Browse the complete scene graph.
- **Object Inspection**: View basic object properties (type, name).
- **Renderer Details**: View properties, render stats, and memory usage for `WebGLRenderer` instances.

## Communication Flow

1. **Panel ↔ Background ↔ Content Script**: Standard extension messaging for panel initialization and state requests (`init`, `request-state`).
2. **4.js → Bridge**: 4.js detects its identity-specific devtools global and
   uses `dispatchEvent` to send `'register'` and `'observe'`.
3. **Bridge → Content Script**: Bridge uses `window.postMessage` to send data (`'register'`, `'renderer'`, `'scene'`, `'update'`) to the content script.
4. **Content Script → Background**: Content script uses `chrome.runtime.sendMessage` to relay messages from the bridge to the background.
5. **Background → Panel**: Background script uses the established port connection (`port.postMessage`) to send data to the panel.

## Key Components

- **DevToolsEventTarget**: Custom event system with backlogging for async loading.
- **Object Observation & Batching**: Efficiently tracks and sends scene graph data.
- **Renderer Property Display**: Shows detailed statistics for renderers.

## Integration with 4.js

The extension relies on 4.js having built-in DevTools support. Native builds
use `window.__FOUR_DEVTOOLS__`; legacy compatibility builds use
`window.__THREE_DEVTOOLS__`.

The bridge script listens for these events, organizes the data, and provides it to the DevTools panel.

## Development

To modify the extension:

1. Edit the relevant files in the `devtools` directory.
2. Go to `chrome://extensions/`, find the unpacked extension, and click the reload icon.
3. Close and reopen DevTools on the inspected page to see your changes.
