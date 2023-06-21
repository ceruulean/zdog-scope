# zdog-scope
Visual display and editor for [Zdog](https://zzz.dog/), a pseudo 3D library

---

## Done Features
- Import/Export JSON
- Tree view of objects w/ draggable sort
- Assign name and edit properties by double-clicking
- Zoom and pan controls
- Undo/redo
- Canvas object selection
- Delete objects from Properties panel

[Check out the demo](https://ceruulean.github.io/zdog-scope/)

Demo model by Zdog creator, Alex Desandro.

## Controls
- Zoom: `Mousewheel`
- Panning: `Shift + drag` or `MMB + drag`
- Rotate: `Click + drag`
- Undo: `Ctrl + Z`
- Redo: `Ctrl + Y` or `Ctrl + Shift + Z`
- Debug Ghost Canvas: `~` (Graves/Tilde)

### Generate code embed

Click on **Code Embed** and you can copy/paste into an HTML document.

---

## Not Implemented

- Delete objects hotkey
- Resize canvas with panel/viewport
- Custom settings

## Bugs

- Zooming might be too fast on Chrome

## Future Goals

- Simplify UI
- - SVG path import
- Toggle Direct View planes XY YZ XZ
- - Hide/isolate object for easier editing
- - Wireframe mode
- Transform widgets/gyros
- - Rotation
- - Slider for stroke

- Sort and Search
- - By groups/anchors
- - By name/id

### Animations
- Keyframe snapshotting and playback
- Animation Behavior data structure (maybe this can be a separate module for any modeling library)
- requestAnimFrame optimizations

### 3D World Rendering

- Full-fledged camera and coordinate systems

## Compile

```
npm run build
```

If using Node v17+ on Linux you need to set `--openssl-legacy-provider` flag:

```
export NODE_OPTIONS=--openssl-legacy-provider&&npx vue-cli-service build --dest docs
```
