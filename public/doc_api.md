# Zdogger API

Short for "Zdog Rigger."

## Usage:

```
import Zdogger from './zdogrigger.js'

const makeAnchor =  Zdogger('anchor'); // returns a maker function
var myAnchor = makeAnchor(options); // returns new Zdog.Anchor()
myAnchor.type // returns 0
```

`Zdogger(itemName: String)(options: Object)`

Creates a Zdog Item with custom properties for identification.

| Property       | Type                                          |
|----------------|------------------------------------------------|
|`type`| Integer |
| `id`| String (10-chars of base36) |
|`name`|String|

### Methods
---

`Zdogger.copy(zdog: Zdog.Item, deep: Boolean)`

Returns a copy of the Zdog item with unique id. Defaults to shallow copy, but can specify `deep` as true.

---
`Zdogger.isClass(zdog: Zdog.Item, type: any)`

Returns a boolean whether the Zdog is a certain type.

```
Zdogger.isClass(new Zdog.Box(), 'Box'); //returns true
Zdogger.isClass(new Zdog.Box(), 'box'); //returns true
Zdogger.isClass(new Zdog.Box(), 12); //returns true
Zdogger.isClass(new Zdog.Box(), '12'); //returns false
```
The integers are mapped to names like so:

```
const ZDOG_CLASS = {
  'anchor':0,
  'shape':1,
  'cone':2,
  'cylinder':3,
  'dragger':4,
  'ellipse':5,
  'group':6,
  'hemisphere':7,
  'illustration':8,
  'polygon':9,
  'rect':10,
  'roundedrect':11,
  'box':12,
  'vector':13
}
```
---
## Zdogger.Tree

`Zdogger.Tree(illo: Zdog.Illustration)`

For keeping track of Zdog objects (referred to as nodes) in a tree structure (referred to as Ztree)

```
let illo =
  new Zdog.Illustration({...}) || Zdogger('illustration')({...})

let ztree =  new Zdogger.Tree(illo);
```

| Property       | Notes                                          |
|----------------|------------------------------------------------|
| `nodeMap`     | Returns all nodes in the tree as [Map][999]`<id:string, node:Zdog.Item>`|
| `relationMap` | Returns the node relations as [Map][999]`<parentId: string, Set:<childId: string>>` . Calling `.relationMap.get(id)` will return a [Set][998] of all children ids. |
| `nodes`       | Returns an array of the nodes in insertion order.|



### Methods
---

`.generateEmbed(options)`

Returns a string that is HTML-ready (with the Zdog distributable `<script src="https://unpkg.com/zdog@1/dist/zdog.dist.min.js"></script>`)

Selector parsing is naive. Recommend to stick with id and class selectors such as `'#myId'` or `'.myClass'`. Basic implementation for `'[attr="myVal"]'`, but it will strip any `^*$` characters.

<table style="line-height:1rem"><tr><th>Usage</th><th>Output</th></tr><tr><td>
<pre style="font-family:inherit">
// Default options
let default = {
  selector:'.zdog-canvas',
  width:300,
  height:300,
  bgColor:transparent,
  mini:true
  }

let output = ztree.generateEmbed(default)
</pre></td>
<td><pre>
&lt;canvas class=&quot;.zdog-canvas&quot; width=&quot;300&quot; height=&quot;300&quot; style=&quot;background-color:transparent&quot;&gt;&lt;/canvas&gt;
&lt;script&gt;
var nj4adf = new Zdog.Illustration ...
&lt;/script&gt;
</pre></td></tr></table>

---

`.JSON()` 

Returns a stringified JSON of the tree.

`._plain()` 

Returns a JavaScript object of the tree.

```
//Structure
{
  illustration: e_df435_4534,
  nodes: [{
    id: e_df435_4534,
    assignedName: "MyIllustration",
    type: 8,
    rotation: {x:0,y:0,z:0},
      ...
    },
    {
    id: c_sfrr4_4jn3,
    assignedName: "Base",
    type: 0,
    rotation: {x:0,y:0,z:0},
      ...
    },
    ...
  ],
  relations:[{
    parent: e_df435_4534,
    children: [
      c_sfrr4_4jn3,
        ...
      ]
  }]
}
```
---
`.download()`

Requests download prompt of the tree as a .JSON file. It uses the illustration's name as the file name.

---

`.find(id: String)`

Returns the Zdog object.

```
ztree.find('d320valrw') // returns Zdog object
```
---

`.clone()`

Returns a new copy of the Ztree.

---

`.addNode(node: Zdog.Item)`

Adds the Zdog item to the tree as a node.

---

`.removeNode(id: String)`

Removes the Zdog item from the tree and returns the Zdog item.

---

`.indexOf(node: Zdog.Item)`

Returns the insertion index of the node.

---

## Zdogger.Reader

`Zdogger.Reader(arg: Ztree || String)`

Creates a reader for exporting and parsing a Ztree to and from JSON.

```
let ztree = new Zdogger.Tree(...)
letplain = ztree._plain() // returns a JavaScript Object

let reader = new Zdogger.Reader(ztree)
let readJSON = new Zdogger.Reader('{"illustration:'br35bskl', ..."}')
let readPlain = new Zdogger.Reader(plain)

reader.Ztree // essentailly a clone of the Ztree, keeping the ids
```

| Property       | Notes                                          |
|----------------|------------------------------------------------|
| `Ztree`     | The currently loaded and parsed Ztree |

### Methods

---

`.import()`

Opens the client's File Explorer and only accepts .json. Returns a Promise that resolves to a FileList.

`.load()`

A wrapper that calls .import(), and returns a Promise that resolves to the newly parsed Ztree.

---

# CanvasHelpers API (name change eventually)

## Scene
Wrapper used for the modeling UI. Binds events and handles click/hit detection of shapes 

`Scene(ztree: ZTree, options: {})`

```
import Scene from './canvasHelpers.js'

let ztree = new Zdogger.Tree({});
let scene = new Scene(ztree);
```
Attaches render events to the canvas. Requires a Zdogger tree to be instantiated.

```
let defaults = {
  ghostQuery:'.zdog-ghost',
  zoomSpeed:3,
  panInverse:false,
  panSpeed:30
  }

let scene = new Scene(ztree, defaults);
```
`ghostQuery` is the query selector for the ghost \<canvas\>. You will have to style the canvas yourself. It can be completely hidden with css like `display:none` and `z-index:-1`. However, if it does not have the same position & size as the live canvas, hit-detection will not work.

(Under Construction)

| Property       | Type                                          |
|----------------|------------------------------------------------|
|`canPan`| Boolean: whether the Scene is panning. See `.keydown()` and `.keyup()`. |
| `isMouseDown`| Integer: the sum of mouse buttons pressed ([MouseEvent.buttons][997]) |
|`zoom`|Number: the current zoom multiplier of the Zdog Illustration.|
|`x`|(NOT FULLY IMPLEMENTED) Camera world coordinate.|
|`y`|(NOT FULLY IMPLEMENTED) Camera world coordinate.|
|`z`|(NOT FULLY IMPLEMENTED) Camera world coordinate.|
|`rho`|(NOT FULLY IMPLEMENTED) Eye polar coordinate.|
|`theta`|(NOT FULLY IMPLEMENTED) Eye polar coordinate.|
|`phi`|(NOT FULLY IMPLEMENTED) Eye polar coordinate.|

### Methods
---
`.on(eventName: String, callback: (event)=>{})`

Adds an event handler to the canvas.
```
scene.on('selectshape', (event)=>{
  //handle event...
  console.log(event.detail.id)
})
```

`eventName` can be a native JavaScript event (like `'click'`), or one of the custom event helpers:
- `'selectshape'` returns the clicked/touched Zdog's id in the `detail` property
- `'deselect'` fires when the user clicks on the blank part
- `'down'`, `'move'`, `'up'` uses Zdog.Dragger's API; they fire on 'mousedown/pointerdown/touchdown', etc.
- `'wheel'` when the mousewheel is scrolled

---
`.keydown(event)` and `.keyup(event)`

Handlers to set `canPan` and `isMouseDown` properties while pressing Shift or holding MMB. They are not called by default, so they can be registered in the global scope if needed.
```
window.addEventListener('keydown', (e)=>{
  //do stuff
  scene.keydown(e)
})
```

---
`.addNode(node: Zdog.Item)`

Adds the Zdog item to the tree and the GhostCanvas.

---

`.updateNode({id: String, options: Object})`

Updates the Zdog item along with the GhostCanvas.

```
let updates = {
    color: '#333',
    name: 'Renamed',
    translate: {x:1,y:7,z:-9}
  }

scene.updateNode({
  id: '4m1lzk2o1q',
  options: updates
})
```

---

`.removeNode(id: String)`

Removes the node at the specified id.

---

`.destroy()`

Unregisters events and animation requests.

---

## GhostCanvas

Wrapper for the click/hit detector: a hidden canvas with each shape's id mapped to a unique color value. On click/tap, the color data under the cursor is received, and the ghost is updated to mirror the live canvas.

This class is meant to be handled by Scene. Feel free to read the comments in the file to interact with it directly.

---

## AxesHelper

Creates unit coordinate axes for the illustration.

`new AxesHelper(illo: Zdog.Illustration)`

| Property       | Type                                          |
|----------------|------------------------------------------------|
|`pos`| Array of Zdog.Axis in the positive X,Y,Z direction |
| `neg`| Array of Zdog.Axis in the negative X,Y,Z direction |

### No Methods Currently

---
---

## References

- [Zdog 3D Helpers](https://observablehq.com/@mootari/zdog-helpers)

[997]: <https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons> (MDN MouseEvent.buttons reference)

[998]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set> (MDN Set reference)

[999]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map> (MDN Map reference)
