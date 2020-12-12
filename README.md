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

## Current Todos
- Delete objects
- Resize canvas with viewport change
- Render coordinate axes separately

## Future Goals

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

### Generate code/embeds
- Copy/paste HTML into a webpage

### Animations
- Keyframe snapshotting and playback
- Animation Behavior data structure (maybe this can be a separate module for any modeling library)
- requestAnimFrame optimizations

### 3D World Rendering
- Full-fledged camera and coordinate systems (currently 'ZYX' and stuff...)


![Screenshot of the editor with an item selected](https://raw.githubusercontent.com/ceruulean/zdog-scope/master/public/capture.jpg)

## Controls
- Zoom: Mousewheel
- Panning: Shift + drag or MMB + drag
- Rotate: Click + drag
- Undo: Ctrl + Z
- Redo: Ctrl + Y or Ctrl + Shift + Z

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

Click on 'Demo' button to load an illustration

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
