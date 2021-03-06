# zdog-scope
Visual display and editor for [Zdog](https://zzz.dog/), a pseudo 3D library


---
## Done Features
- Import/Export JSON
- Tree view of objects w/ draggable sort
- Assign name and edit properties
- Zoom and pan controls
- Undo/redo
- Canvas object selection


[Check out the demo (last build: Dec 15, 2020)](https://www.the-gale.com/prototypes/zdogscope/)

Demo model by Zdog creator, Alex Desandro.

## Controls
- Zoom: Mousewheel
- Panning: Shift + drag or MMB + drag
- Rotate: Click + drag
- Undo: Ctrl + Z
- Redo: Ctrl + Y or Ctrl + Shift + Z

### Generate code embed by clicking on "Embed Dream"

Copy/paste output into an HTML document.

Make sure you have `<script src="https://unpkg.com/zdog@1/dist/zdog.dist.min.js"></script>`
in head tag.

---

## Current Todos
- Delete objects hotkey
- Resize canvas with panel/viewport
- Adjust settings (zooming is too fast on Chrome)

## Future Goals

### System

Rust port of some functions

### UI
- Toggle View
- - Axes
- - Visibility
- - 'Wireframe'
- Transform widgets/gyros
- - Rotation
- - Slider for stroke? (like Photoshop)
- Better creation prompt
- - Advanced Path maker
- - SVG path import
- Sort and Search
- - By groups/anchors
- - By name/id

### Animations
- Keyframe snapshotting and playback
- Animation Behavior data structure (maybe this can be a separate module for any modeling library)
- requestAnimFrame optimizations

### 3D World Rendering
- Full-fledged camera and coordinate systems (currently 'ZYX')


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```