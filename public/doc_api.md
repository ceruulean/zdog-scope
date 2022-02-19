# Zdogger API

Short for "Zdog Rigger."

## Usage:

```
import Zdogger from './zdogrigger'

let illo = new Zdog.Illustration({...});
let ztree = new Zdogger.Tree(illo);
```

All Zdog Items added to the Ztree gains custom properties for identification.

| Property       | Type                                          |
|----------------|------------------------------------------------|
|`type`| Integer |
| `id`| String (length 7 chars) |
|`name`|String|

`Zdogger(type: String or Int)(options: {});`

This will add properties to Zdog Items.

```
let makeCone = Zdogger('cone') //returns a function
let myCone = makeCone({
  diameter:40,
  length:100,
})
```

## Zdogger.CLASS

Static constant enums for type checking.

| Property  | Type                                          |
|----------------|------------------------------------------------|
|`TYPES`| Array of Zdog Item constructors |
|`ENUMS`| Object with key value pairs stored as {typeName: enum} |
|`NAMES`| Array of String|

### Method

`Zdogger.is(zdog: Zdog.Item, arg: any)` checks for type. Returns `true` if it matches super classes, like Anchor is the parent of most Zdog Items.

```
Zdogger.is(new Zdog.Box(), 'Box'); //returns true
Zdogger.is(new Zdog.Box(), 'box'); //returns true
Zdogger.is(new Zdog.Box(), 'anchor'); //returns true
Zdogger.is(new Zdog.Box(), 12); //returns true

Zdogger.is(new Zdog.Box(), '12'); //returns false
```
The enums are mapped to names like so:

```
Zdogger.CLASS.ENUMS = {
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

## Zdogger.Tree

`Zdogger.Tree(illo: Zdog.Illustration [, canvasQuery: String])`

For keeping track of Zdog objects (referred to as nodes) in a tree structure (referred to as Ztree).

If no `canvasQuery` is supplied, it defaults to `.zdog-canvas`. You can also pass in an object with options and automatically create the Zdog Illustration:

```
let illoOptions = {
  element: 'my-custom-class',
  zoom:5,
}

let ztree =  new Zdogger.Tree(illoOptions);
```

| Properties       | Notes                                          |
|----------------|------------------------------------------------|
| `nodeMap`     | Returns all nodes in the tree as [Map][999]`<id:string, node:Zdog.Item>`|
| `relationMap` | Returns the node relations as [Map][999]`<parentId: string, Set:<childId: string>>` . Getting `relationMap.get(id)` will return a [Set][998] of all children ids. |
| `nodes`       | Returns an array of the nodes in insertion order.|


### Methods
---

`.generateEmbed(options)`

Returns a string that is HTML-ready with the Zdog distributable in the page:

`<script src="https://unpkg.com/zdog@1/dist/zdog.dist.min.js"></script>`

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

`.plain()`

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

`.find(id: String)`

Returns the Zdog object.

```
ztree.find('d320valrw') // returns Zdog object
```
---

`.clone()`

Returns a clone of the Ztree that preserves ids.

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
letplain = ztree.plain() // returns a JavaScript Object

let reader = new Zdogger.Reader(ztree)
let readJSON = new Zdogger.Reader('{"illustration:'br35bskl', ..."}')
let readPlain = new Zdogger.Reader(plain)

reader.tree // essentailly a clone of the Ztree, keeping the ids
```

| Property       | Notes                                          |
|----------------|------------------------------------------------|
| `tree`     | The currently loaded and parsed Ztree |

### Methods

---

`.import()`

Opens the client's File Explorer and only accepts .json. Returns a Promise that resolves to a FileList.

```
let FileList = await reader.import() // wait for client to select a file
```

`.load()`

A wrapper that calls .import(), and returns a Promise that resolves to the imported Ztree.

```
let importedTree = await reader.load() // wait for client to select and upload .json
```

---

`.download()`

Requests download prompt of the tree as a .JSON file. It uses the illustration's name as the file name.

---

`.reviveTree(JSONstring)`

If the constructor was called with an empty argument, use this to revive JSON into a Ztree.

```
let reader = new Zdogger.Reader()

let myJSON = {....} // let's say an async operation fetches this 

reader.reviveTree(myJSON);
let myZtree = reader.Ztree // property points to Ztree object
```

---

## Zdogger.Scene

`Zdogger.Scene(ztree: ZTree, options: {})`

Wrapper used for the modeling UI. Binds events and handles click/hit detection of shapes. Requires a Zdogger tree to be instantiated.

```
import Zdogger from './zdogger/index.js'

let ztree = new Zdogger.Tree({});
let scene = new Zdogger.Scene(ztree);
```

```
let defaults = {
  ghostQuery:'.zdog-ghost',
  zoomSpeed:3,
  panInverse:false,
  panSpeed:30
  }

let scene = new Scene(ztree, defaults);
```
`ghostQuery` is the query selector for the ghost \<canvas\>. You will have to style the canvas yourself. It can be completely hidden with css like `display:none` and `z-index:-1`. However, if it does not have the same position & size as the live canvas, click-detection will not work.

### List of Scene Properties

| Property       | Type                                          |
|----------------|------------------------------------------------|
|`canPan`| Boolean: whether the Scene is panning. See `.keydown()` and `.keyup()`. |
| `isMouseDown`| Integer: the sum of mouse buttons pressed ([MouseEvent.buttons][997]) |
|`zoom`|Number: the current zoom multiplier of the Zdog Illustration.|
|`zoomSpeed`|Number: how fast to zoom. Default: 3|
|`panSpeed`|Number: how fast to pan. Default: 30|
|`panInverse`|Boolean: inverts panning direction. Default: false|

### Methods

`.animate()` and `.unanimate()`

Renders the Zdog Illustration, calling `requestAnimFrame` and `cancelAnimFrame` respectively.

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

Handlers to set `canPan` and `isMouseDown` properties while pressing Shift or holding MMB. They are not bound by default, so they can be registered in the global scope if needed.
```
window.addEventListener('keydown', (e)=>{
    //do stuff
    scene.keydown(e)
})
```

---
`.addNode(node: Zdog.Item)`

Adds the Zdog to the tree.

---

`.updateNode({id: String, options: Object})`

Updates the Zdog properties.

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

`.changeParent(id: String, newParentId: String)`

Updates the relation between the Zdog nodes.

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

## Zdog.Axis

A new Zdog Item added to render straight lines that won't scale with zoom (unless desired!)

`new Zdog.Axis({options})`

|option|value|
|--|--|
|`stroke`|Thickness of the axis.|
|`color`|Color of the axis. Takes any color string that browsers can render (rgba, hsla, hex, etc.) If you input a string of 'x', 'y', or 'z', it will set to red, green or blue respectively, in HSL|
|`visible`|Boolean|
|`t`|Parametrization constant. Effectively serves as the magnitude for unit vectors.|
|`front`|Direction of the axis. Default: `{x:1}` // implies y:0 and z:0|
|`scaleZoom`|Whether the axis should scale thickness on zoom.|

```
let defaults = {
  stroke: 1,
  color: 'hsl(0, 100%, 50%)',
  visible: true,
  t:1,
  front:{x:1},
  scaleZoom:false
}

let x_axis = new Zdog.Axis(defaults)

let y_axis = new Zdog.Axis({
  color: 'hsl(120, 100%, 50%)',
  front:{y:-1}
})
```

---

## UnitAxes

Helper to create unit coordinate axes for the scene.

`new UnitAxes(illo: Zdog.Illustration)`

| Property       | Type                                          |
|----------------|------------------------------------------------|
|`axes`| Array of Zdog.Axis in the positive X,Y,Z and negative X,Y,Z in that order |
|`root`| The root Anchor for all axes. |

### Methods

`.addTo(zdog: Zdog.Item)`

Adds the unit axes to the item.

`.remove()`

Removes the axes from their parent.

`.showAll()` and `.hideAll()`

Sets the visibility of all the axes.

`.showPos(show: Boolean)` and `.showNeg(show: Boolean)`

Toggles the positive/negative axes depending on the passed in value. Pass `false` to turn off. Not passing in a value will default to `true` and show the axes.

---
---

## References

- [Zdog 3D Helpers](https://observablehq.com/@mootari/zdog-helpers)

[997]: <https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons> (MDN MouseEvent.buttons reference)

[998]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set> (MDN Set reference)

[999]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map> (MDN Map reference)
