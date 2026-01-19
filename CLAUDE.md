# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the GameMaker HTML5 runtime - a JavaScript-based game engine runtime that executes GameMaker Studio games in web browsers. The runtime translates GameMaker Language (GML) into JavaScript execution and provides a WebGL-based rendering pipeline.

## Development Setup

### Using a Modified Runtime

To use this runtime in GameMaker:

1. Clone this repository to a local directory (e.g., `C:\source\GameMaker-HTML5`)
2. In GameMaker, navigate to **Preferences > Platform Settings > HTML5**
3. Change **Path to HTML5 runner** to your repository path
4. To revert: change the path back to `${html5_runner_path}`

### Testing Changes

After making changes:
1. Run your game in GameMaker using the HTML5 target
2. Use the browser's Developer Tools (F12) to debug
3. Use GameMaker's built-in Debugger for GML-level debugging

## Commands

### Linting

```bash
npx eslint scripts/**/*.js
```

The project uses ESLint with browser environment targeting ES6. Key rules:
- Semicolons are required
- Many legacy warnings are downgraded to warnings (e.g., `no-unused-vars`, `no-redeclare`)
- Mixed spaces/tabs and function reassignment allowed (legacy codebase)

**Note:** There is no automated test suite in this repository. Testing is done by running actual GameMaker projects.

## Architecture

### Core Entry Point

- **`scripts/runner.js`**: Main entry point that loads all runtime scripts via `document.write()` in dependency order
- **`scripts/_GameMaker.js`**: Primary runtime initialization and game loop

### Object/Instance System

The runtime uses a class-based system mirroring GameMaker's object model:

- **`yyObject`** (scripts/yyObject.js): Object definitions containing events, properties, and parent relationships
- **`yyInstance`** (scripts/yyInstance.js): Runtime instances of objects with position, sprite, physics, and behavior properties
- **`yyRoom`** (scripts/yyRoom.js): Room management including layers, instances, views, backgrounds, and physics worlds

Instance lifecycle:
1. Created via `yyInstance()` constructor
2. Initialized with object properties and events
3. Updated each frame through event system (Create → Step → Draw → etc.)
4. Managed in room's active/deactive instance lists

### Event System

Events are defined in **scripts/Events.js** and **scripts/Globals.js**:

- Events use a bitmask system (e.g., `EVENT_CREATE = 0x000`, `EVENT_STEP = 0x300`)
- Event types: Create, Destroy, Alarm, Step, Collision, Keyboard, Mouse, Draw, etc.
- Instances execute events through their parent object's event functions
- Inheritance: child objects can call parent events

### Rendering Pipeline

The rendering system is built on WebGL:

- **`scripts/yyWebGL.js`**: Main WebGL interface and state management
- **`scripts/libWebGL/`**: Low-level WebGL abstraction layer
  - `libWebGL.js`: Core WebGL wrapper and batch rendering
  - `yyCommandBuilder.js`: Batched rendering command builder
  - `yyRenderStateManager.js`: WebGL state caching
  - `yyVBuffer.js` / `yyVBufferManager.js`: Vertex buffer management
  - `yyVertexFormat.js`: Vertex format definitions
  - `shaders/`: GLSL shader definitions
- **`scripts/yyGraphics.js`**: High-level 2D drawing primitives
- **`scripts/CameraManager.js`**: Camera and view management
- **`scripts/yyEffects.js`**: Shader effects system

Drawing flow:
1. Game renders to application surface (or direct to backbuffer)
2. Commands batched via command builder
3. State changes minimized via render state manager
4. Vertex data submitted to VBuffers
5. Draw calls executed with appropriate shaders

### Asset Systems

Each GameMaker asset type has a corresponding `yy*.js` file:

- **`yySprite.js`**: Sprite frames, collision masks, animations, nine-slice
- **`yyBackground.js`**: Background/tile assets
- **`yyFont.js`**: Font rendering (bitmap and SDF fonts)
- **`yySound.js`**: Audio playback (Web Audio API)
- **`yyBuffer.js`**: Binary buffer operations
- **`yyParticle.js`**: Particle system management
- **`yySequence.js`**: Animation sequences (largest file at ~8700 lines)
- **`yyAnimCurve.js`**: Animation curve data
- **`yyPath.js`**: Path definitions
- **`yyTimeline.js`**: Timeline management
- **`yy3DModel.js`**: 3D model storage

### GML Function Implementations

All built-in GML functions are in **`scripts/functions/`**:

- Organized by category: `Function_Graphics.js`, `Function_Collision.js`, `Function_String.js`, etc.
- **Data structures**: `collections/ds_grid.js`, `collections/ds_list.js`, `collections/ds_map.js`, etc.
- **Drawing**: `Function_Graphics.js`, `Function_Sprite.js`, `Function_Surface.js`, `Function_D3D.js`
- **Game control**: `Function_Instance.js`, `Function_Room.js`, `Function_Game.js`, `Function_Object.js`
- **Physics**: `Function_Physics.js` (Box2D wrapper in `scripts/jsBox2D/`)
- **I/O**: `Function_File.js`, `Function_HTTP.js`, `Function_Networking.js`
- **Audio**: `Function_Sound.js`, `Function_Sound_Legacy.js`

### Variable System

**`scripts/yyVariable.js`** implements GML's dynamic type system:

- Type coercion between numbers, strings, booleans, arrays, structs
- Built-in variables (e.g., `x`, `y`, `sprite_index`, `image_index`)
- Array and struct access patterns
- Reference tracking for objects and instances

### Physics Integration

Physics powered by Box2D (Liquid Fun):

- **`scripts/physics/`**: Physics world, fixtures, joints, debug rendering
- **`scripts/jsBox2D/jsliquidfun.js`**: Box2D JavaScript port
- Physics objects managed per-room via `yyPhysicsWorld`

### Third-Party Libraries

- **Spine** (scripts/spine/): Skeletal animation runtime
- **SWF** (scripts/SWF/): Flash animation support
- **Yoga** (scripts/yoga/): Flexbox layout engine for UI layers
- **zlib** (scripts/zlib/): Compression/decompression
- **Font.js** (scripts/fontjs/): Font parsing
- **Fingerprint.js** (scripts/fingerprintjs/): Device fingerprinting
- **Long.js** (scripts/long/): 64-bit integer support

## Code Patterns and Conventions

### Naming Conventions

- Classes/constructors: PascalCase with `yy` prefix (e.g., `yyInstance`, `yySprite`)
- Global variables: lowercase with `g_` prefix (e.g., `g_pBuiltIn`, `g_CurrentTime`)
- Member variables: camelCase with `m_` prefix (e.g., `this.m_pStorage`)
- Constants: UPPER_SNAKE_CASE (e.g., `EVENT_CREATE`, `BROWSER_CHROME`)
- Private properties: double underscore prefix (e.g., `this.__x`, `this.__y`)

### Constructor Pattern

```javascript
/**@constructor*/
function yyClassName() {
    this.__type = "[ClassName]";
    // Initialization
}

yyClassName.prototype.MethodName = function() {
    // Method implementation
};
```

### Error Handling

Use `yyError()` and related functions from **scripts/yyErrorMessages.js** for user-facing errors. The system provides descriptive error messages that reference GML function names and expected parameters.

### Common Gotchas

1. **Coordinate Systems**: HTML5 uses web coordinates (origin top-left), but GameMaker uses bottom-left for some operations (e.g., y-axis inverted for 3D)
2. **Reference vs Value**: Instances are reference types; primitive values are copied
3. **Collision Masks**: Collision can use sprite bounding boxes, precise masks, or custom shapes
4. **Layer System**: Newer layer-based approach coexists with legacy depth-based rendering
5. **Application Surface**: Most rendering goes through an application surface that can be disabled or resized

## Git Workflow

- Main development branch: **`develop`**
- Feature branches: Named with pattern `gmb-<issue-number>-<description>-dev`
- Commit messages: Start with `[H5]` or `[HTML5]` prefix, reference issue numbers
- Pull requests: Include exported GameMaker project (`.yyz`) demonstrating changes when possible
- The team performs code review before merging

## File Organization

```
scripts/
├── runner.js                 # Entry point / script loader
├── _GameMaker.js            # Main runtime loop
├── Globals.js               # Global constants
├── GameGlobals.js           # Game-specific globals
├── Events.js                # Event system
├── yy*.js                   # Core asset/system classes
├── functions/               # GML function implementations
│   ├── collections/         # Data structure functions
│   └── Function_*.js        # Categorized GML functions
├── libWebGL/                # WebGL rendering layer
├── physics/                 # Physics system
├── animation/               # Skeletal animation
├── sound/                   # Audio system
├── Builders/                # Geometry builders
├── device/                  # Platform detection
├── utils/                   # Utility functions
└── [third-party]/           # External libraries
```

## Common Tasks

### Adding a New GML Function

1. Identify the appropriate `Function_*.js` file in `scripts/functions/`
2. Add function implementation following GML API specification
3. Use `yyGetInt32()`, `yyGetReal()`, `yyGetString()` for parameter extraction
4. Return appropriate types (numbers, strings, or objects)
5. Test with a GameMaker project that calls the function

### Fixing Rendering Issues

1. Check `scripts/yyWebGL.js` for low-level WebGL calls
2. Check `scripts/libWebGL/libWebGL.js` for batch rendering logic
3. Verify shader compilation in `scripts/libWebGL/shaders/`
4. Use browser WebGL inspector tools (e.g., Spector.js)
5. Check application surface handling in `_GameMaker.js`

### Debugging Instance/Event Issues

1. Check `scripts/yyInstance.js` for instance property handling
2. Check `scripts/Events.js` for event dispatching
3. Verify object inheritance in `scripts/yyObject.js`
4. Use GameMaker's debugger to inspect instance state
5. Check room instance lists in `scripts/yyRoom.js`

## Resources

- Main repository: https://github.com/YoYoGames/GameMaker-HTML5
- Issue tracker: https://github.com/YoYoGames/GameMaker-HTML5/issues
- GameMaker bugs: https://github.com/YoYoGames/GameMaker-Bugs
- Feature requests: https://contact.gamemaker.io/
