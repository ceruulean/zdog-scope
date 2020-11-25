# zdog-scope
Visual display and editor for [Zdog](https://zzz.dog/), a pseudo 3D library

Inspired by [nifskope](http://www.niftools.org/), an open source graphics editor.


[Split Grid](https://github.com/nathancahill/split/tree/master/packages/split-grid) for panel resizing

Built with [Vue 3](https://v3.vuejs.org/)

---
## Done
- Import/Export JSON
- Tree view of objects w/ draggable sort
- Assign name (double click on treeview)
- Edit properties window

## Todo
- Color picker
- Sliders for adjusting coordinates/stroke
- Better creation of objects
- Selecting a node outlines it on canvas
- Toggle visbility (eye icon?)
- Advanced Path maker
- Sort by groups/anchors...
- Search by name
- Wireframe view
- Resize canvas on viewport change
- Zoom and pan controls
- Quaternions...


![Screenshot of the editor with an item selected](https://raw.githubusercontent.com/ceruulean/zdog-scope/master/public/Capture.PNG)

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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
