
/* eslint-disable no-unused-vars */
//import Zdog from 'zdog' // ../../zdog
import Zdog from 'zdog'
import {Z} from './ztree';

//import versor from 'versor'

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

/**
 * Returns an array with [ r g b ] values
 * @param {*} context CanvasRendering2DContext
 * @param {*} x 
 * @param {*} y 
 */
function getPixel(context, x, y) {
  let imageData = context.getImageData( x, y, 1, 1 );
  let data = imageData.data;
  return [data[0],data[1],data[2]];
}

function colorKey(data){
  return  `${data[0]}${data[1]}${data[2]}`
}

function rgbString(data){
  return `rgb(${data[0]},${data[1]},${data[2]})`
}

class GhostCanvas{
  constructor(ztree, ghostIllo){
    this.ztree = ztree;
    this.illustration = ghostIllo
    this.illustration.name = 'ghost'
    this.init()

    let syncWithCanvas = (ctx) => {
      ctx.setTransform(...this.transformMatrix)
      this.illustration.rotate = this.ztree.illustration.rotate;
      this.illustration.translate = this.ztree.illustration.translate;
      this.illustration.updateGraph();
    }
    this.illustration.onPrerender = syncWithCanvas
  }


  init(){
    let clone = this.ztree.clone()
    this.ghostNodes = clone.nodeMap;
    this.illustration.children = clone.illustration.children

    this.colorMap = new Map(); //<rgba:[3], id: string>
    this.nodeColors = new Map(); //<id: string, rgba:[3]>
    let nodes = this.ghostNodes.values();
    for(let node of nodes){
      if (node.isCanvas) {
        continue
      }
        let color = getRandomRgb();
        GhostCanvas.setUniformColor(node, color)
        this._setMaps(node, color)
    }

  }

  get nodeMap(){
    return this.ztree.nodeMap;
  }
  get transformMatrix(){
    return this.ztree.illustration.transformMatrix
  }
  /**
   * Updates nodes and deletes those that are not present in the live canvas.
   */
  pruneGhost(){
    let toDelete = {};
    this.ghostNodes.forEach(node=>{
      if (node.id && node.type && !node.isCanvas){
        toDelete[node.id] = true;
      }
    })
    this.nodeMap.forEach((node,id)=>{
      //id still exists, update and do not delete
      if (this.nodeColors.has(id)){
        toDelete[id] = false;
        this.updateNode(id)
      } else if (!node.isCanvas){
        // id not registered, add it
        this.addNode(node)
      }
    })
    for (let id in toDelete){
      if(toDelete[id]){
        this.removeNode(id)
      }
    }
  }
/**
 * Takes the live Zdog and creates a ghost copy
 * @param {*} zdog Zdog from live canvas
 */
  addNode(zdog){
    if (!zdog.id) throw new Error('Invalid zdog object (must have "id" property ')
    let color = getRandomRgb()
    let clone = zdog.copy();
    Object.assign(clone, Z.justProps(zdog))
    //
    let parentid = zdog.addTo.id
    if (this.ghostNodes.has(parentid)){
      let parentGhost = this.ghostNodes.get(parentid)
      parentGhost.addChild(clone)
    }
    
    GhostCanvas.setUniformColor(clone, color)
    this._setMaps(clone, color)


    return clone
  }
/**
 * Removes the specified node from the ghost canvas
 * @param {String} id of Zdog object
 */
  removeNode(id){
    let toRem = this.ghostNodes.get(id)
    toRem.remove()
    let k = this.nodeColors.get(id)
    this.colorMap.delete(k)
    this.nodeColors.delete(id)
    this.ghostNodes.delete(id)
  }

  _setMaps(node, color){
    if (node.id && node.type !== undefined){
      let str = colorKey(color)
      this.colorMap.set(str, node.id)
      this.nodeColors.set(node.id, str)
      this.ghostNodes.set(node.id, node)
    }
  }

/**
 * Sync the ghost node's noncolor properties with the live node
 * @param {String} id of Zdog node
 */
  updateNode(id){
     let original = this.nodeMap.get(id);
    // if (!original) {
    //   this.pruneGhost()
    //   return
    // }
    let o = {}
    let nodeProps = Z.propsFor(original).filter(prop=>{
      return !COLOR_PROPS.includes(prop)
    })
    nodeProps.forEach(prop=>{
      o[prop] = original[prop]
    })
    let gn = this.ghostNodes.get(id)
    Object.assign(gn, o)
  }

  //id of the node to be adopted
  changeParent(id, newParentId){
    let childnode = this.ghostNodes.get(id)
    childnode.remove();
    this.ghostNodes.get(newParentId).addChild(childnode);
  }

/**
 * Returns the node id that is under the coordinates
 * @param {Number} screenX 
 * @param {Number} screenY
 * @returns {String}
 */
  pickSelectShape(screenX, screenY){
    this.illustration.renderGraph()
    let pr = this.illustration.pixelRatio;
    let color = getPixel(
      this.illustration.ctx,
      screenX * pr,
      screenY * pr
      )
    return this.colorMap.get(colorKey(color))
  }

    /**
   * Sets a Zdog node to a single color and returns the original Zdog object
   * @param {*} node the Zdog object
   * @param {*} colorData the array of [ r g b]
   */
  static setUniformColor(zdog, colorData){
    //Set all color props to same
    let string = rgbString(colorData);
    let previous = Z.justProps(zdog)

    let f = (zdog) => {
      COLOR_PROPS.forEach(prop=>
      {if (zdog[prop]) zdog[prop] = string})}

      f(zdog)

    //same with cildren
    zdog.children.forEach(child=>{
      //make sure it is not a separate entity (has an id)
      if (!child.id){
        GhostCanvas.setUniformColor(child, colorData)
        let dependents = child._flatGraph; //some composite shapes have flatgraph
        if (dependents){
          dependents.forEach(d=>{
            GhostCanvas.setUniformColor(d, colorData)
          })
        }
      }

    })
   return previous
  }
}

const eventDeselect = new Event('deselect')
/**
 * Zdog Scene
 */
class Scene{
  animReq = null
  dragging = false
  canPan = false;
  isMouseDown = 0;
  totaldelta = 0;
/**
 * Creates a Scene object that allows panning/zooming.
 * @param {Ztree} ztree
 * @param {*} options 
 */
  constructor(ztree, options={ghostQuery:'.zdog-ghost', zoomSpeed:1, panInverse:false, panSpeed:30}){
    for(let o in options){
      this[o] = options[o]
    }
    //theta is azimuthal angle (along zx plane)
    //phi is polar angle (along xy plane)
    /**
            | -y
            |
            | __________ +x
           /|
          / |
      +z /  | +y
        /
     */

    this.ztree = ztree
    this.illustration = ztree.illustration;

    this.ghostIllo = new Zdog.Illustration({
      element: this.ghostQuery,
      dragRotate:false,
    })

    this.ghostCanvas = new GhostCanvas(ztree, this.ghostIllo)

    this.setSize(window.innerWidth, window.innerHeight);
    this.unitAxes = new UnitAxes({addTo:ztree.illustration})

    this.eye = {}
    this.worldPosition = new Zdog.Vector();

    this.phi = this.illustration.rotate.x
    this.theta = this.illustration.rotate.y
    this.rho = this.defaultRho

    /**EVENTS***************/
    this.events = {
      wheel:[],
      down:[],
      up:[],
      move:[],
    }

    let ctx = this;
    this.dragger = new Zdog.Dragger({
      startElement: ctx.illustration.element,
      onDragStart: function(event, pointer) {
        ctx.cursordown(event, pointer)
      },
      onDragMove: function( event, pointer, dX, dY ) {
        ctx.cursormove( event, pointer, dX, dY)
      },
      onDragEnd: function(event) {
        ctx.cursorup(event)
      },
    });

    this.onwheel = (e) => this._dispatch('wheel', e)
    ctx.illustration.element.addEventListener('wheel', this.onwheel)
    this.on('wheel', this.zooming.bind(this))

    this.label = document.createElement('span')
    // this.label.innerText = `${Math.round(this.zoom * 100)}%`
    this.animate();
  }

  static ORIGIN = {x:0,y:0,z:0}

  get x(){
    return this.rho * Math.cos(this.phi) * Math.sin(this.theta)
  }
  get y(){
    return this.rho * Math.sin(this.phi)
  }
  get z(){
    return this.rho * Math.cos(this.phi) * Math.cos(this.theta)
  }
  // starting ρ value (distance from origin)
  get defaultRho(){
    return (this.illustration.canvasHeight / 2)
  }

  /** Sync ghost and canvas */
  setSize(width, height){
    this.illustration.setSize(width, height);
    this.ghostIllo.setSize(width, height);
  }



  /**
   * Cursor events handle touch/mouse/pointer
   */
  cursordown(event, pointer) {
    this.x0 = pointer.pageX;
    this.y0 = pointer.pageY;
    this.totaldelta = 0;

    this.isMouseDown = event.buttons;
    if (event.button == 1){    //MMB pressed
      this.canPan = true;
      }
      this._dispatch('down', event)
    }

  cursormove(event, pointer, dX, dY ){
    if (this.canPan){
      this.dragPan(pointer)
    } else {
      this.dragRotate(pointer, dX,dY)
    }
    this._dispatch('move', event)
  }

  dragPan(pointer){
    let [dx, dy] = this._screendelta(pointer)

    if (!this.panInverse){
      dx = dx * -1
      dy = dy * -1
    }

    let speed = (this.panSpeed / 100)
    let y2 = this.illustration.translate.y + (dy*speed)
    let x2 = this.illustration.translate.x + (dx*speed)
    let o = {x:x2, y:y2, z:this.z}
    this.illustration.translate = o;
  }

  dragRotate(pointer) {
    let [dx, dy] = this._screendelta(pointer)
    this.theta = (this.theta + this.radRatio( dx));
    this.phi = (this.phi + this.radRatio( dy ));
    let o = {x:this.phi, y:this.theta, z:this.illustration.rotate.z}
    this.illustration.rotate = o;
  }

  cursorup(event){
    this.isMouseDown = event.buttons
    if (event.button == 1){     //MMB released
      this.canPan = false;
    }
    //detect if drag or click
    if (Math.abs(this.totaldelta) < 5 ) {    //might need a threshold depending on mobile/web... maybe later
      // it is a click
      this.selection(event)
    }
    this._dispatch('up', event)
      //console.log(`(ρ,θ,φ):(${ctx.rho},${ctx.theta},${ctx.phi})`)
  }

  _screendelta(pointer){
    let deltaX = this.x0 - pointer.pageX;
    let deltaY = this.y0 - pointer.pageY;
    this.x0 = pointer.pageX;
    this.y0 = pointer.pageY;
    this.totaldelta += (deltaX + deltaY)
    return [deltaX, deltaY]
  }

  zooming(event){
    event.preventDefault();
    let z0 = this.illustration.zoom, z = z0 + event.deltaY * this.zoomSpeed;

    console.log(`(ρ,θ,φ):(${this.rho},${this.theta},${this.phi})`)

    this.illustration.zoom -= z / this.defaultRho
    if (this.illustration.zoom < 0) { this.illustration.zoom = 0.1 }
    // z = vertical screen pixels scrolled (on a normal webpage)
    this.rho -= this.rho + z
    this.label.innerText = `${Math.round(this.illustration.zoom * 100)}%`
  }

  selection(event){
    let id = this.ghostCanvas.pickSelectShape(event.offsetX, event.offsetY)

    if (id && id != this.selectActive){
      const selectShape = new CustomEvent('selectshape',{
        detail:
        {id: id}
      });
      this.illustration.element.dispatchEvent(selectShape)
      this.selectActive = id;
    } else if (this.selectActive && !id) {
      this.illustration.element.dispatchEvent(eventDeselect)
      this.selectActive = false;
    }
  }

  keydown(e){
    //Shift -> pan
    if (e.keyCode == 16){
      this.canPan = true;
    }
    // Tilde graves `
    else if (e.keyCode == 192) {
      let ghost = this.ghostCanvas.illustration.element;
      let isHidden = ghost.classList.contains('hidden');
      isHidden? ghost.classList.remove('hidden') : ghost.classList.add('hidden') ;
    }
  }

  keyup(e){
    //Shift -> pan
    if (e.keyCode == 16 && this.isMouseDown < 4){
      this.canPan = false;
    }
  }

 /**
  * Attach events to the canvas element.
  * 
  * 'selectshape' is a custom event. event.detail.id returns the shape's id if the user clicks on the screen and a shape is underneath the point.
  * 
  *  new Scene().on('selectshape', (e)=>{console.log(e.detail.id)})
  * 
  * Other event names include 'down','up','move', which trigger on mouse/touch/pointer, and 'wheel'
  * 
  * @param {*} eventName 
  * @param {*} callback function(event){...}
  */
  on(eventName, callback){
    let dispatch = this.events[eventName]
    if (dispatch === null || dispatch === undefined){
      this.events[eventName] = callback
      this.illustration.element.addEventListener(eventName, callback)
    } else if (dispatch.length !== undefined) {
      this.events[eventName].push(callback)
    }
  }

  _dispatch(eventName, event){
    this.events[eventName].forEach(fn=>{
      fn(event)
    })
  }

  /**
   * Returns a radian value to correlate rotation with screen pixel projection
   * @param {Number} delta in screen pixels
   */
  radRatio(delta){
    return delta * (Math.PI * 2) / this.illustration.canvasWidth;
  }

  animate = () => {
    this.illustration.updateRenderGraph()
    this.animReq = requestAnimationFrame(this.animate)
  }

  unanimate(){
    cancelAnimationFrame(this.animReq)
  }

  addNode(node){
    this.ztree.addNode(node)
    this.ghostCanvas.addNode(node)
  }

  removeNode(id){
    this.ztree.removeNode(id)
    this.ghostCanvas.removeNode(id)
  }

  updateNode({node, options}){
    //let node = this.ztree.find(id)
    for (let o in options){
      node[o] = options[o]
    }
    this.ghostCanvas.updateNode(node.id)
  }

  changeParent(id, newParentId){
    this.ztree.changeParent(id, newParentId)
    this.ghostCanvas.changeParent(id, newParentId)
  }

  destroy(){
    cancelAnimationFrame(this.animReq)

    let listeners = this.events;
    for (let name in listeners){
      if (name == 'wheel'){
        this.illustration.element.removeEventListener(name, this.onwheel)
      } else if (listeners[name].length == undefined || listeners[name].length == null ){
        this.illustration.element.removeEventListener(name, listeners[name])
        delete this.events[name]
      } else {
        this.events[name] = [];
      }
    }
    this.dragger.destroy();
    delete this.dragger
  }

}

/**
 * A class to generate the 6 coordinate axes (XYZ and -XYZ)
 * Options:
 *  - addTo: Zdog object
 *  - scaleZoom: Set true to use stroke
 *  - t: Specify Length of axis, otherwise set to inner Window
 * 
 * And you can pass standard Zdog shape options.
 */
class UnitAxes{
  flag = 0b111111;
  axes = [];
  constructor(options={addTo:null,scaleZoom:false }){
    this.root = new Zdog.Anchor();
    let opts = options;
    if (!options) {
      opts = {addTo:null,scaleZoom:false}
    }
    opts.t = opts.t || window.innerWidth || 100;

    let form = (front, color) => {
      let o = {
        front:front,
        color:color,
        visible:true,
      }
      Object.assign(o, opts)
      let a = makeAxis(o);
      this.root.addChild(a)
      return a
    }

    let opacity = 0.6
    this.axes = [
      form({x:1}, 'x'),
      form({y:1}, 'y'),
      form({z:1}, 'z'),
      form({x:-1}, `hsla(0,100%,30%,${opacity})`),
      form({y:-1}, `hsla(120,100%,30%,${opacity})`),
      form({z:-1}, `hsla(240,100%,30%,${opacity})`)
    ]

    if (options.addTo){
      this.addTo(options.addTo)
    }
  }

  addTo(zdog){
    zdog.addChild(this.root)
  }

  remove(){
    this.root.remove();
  }

  update(){
    for (let i = 0; i < this.axes.length; i++) {
      this.axes[i].visible = ((this.flag & (1 << i)) > 0)
    }
    this.root.updateGraph();
  }

  hideAll(){
    this.flag = 0;
    this.update();
  }

  showAll(){
    this.flag = 63;
    this.update();
  }

  //sets visible flag for the positive axes, pass true to show and false to hide
  showPos(bool){
    if (bool === false){
      this.flag = (this.flag & (7 << 3))
    } else {
      this.flag = (this.flag | 7)
    }
    this.update();
  }

  //same for negative axes
  showNeg(bool){
    if (bool === false){
      this.flag = (this.flag & 7)
    } else {
      this.flag = (this.flag | (7<<3))
    }
    this.update();
   }
}

//Checks if a bit is set at the position
function getBit(num, p){
  return ((num & (1 << p)) > 0)
}
// Toggle bit at position and return new number
function toggleBit(num, p){
  return (num ^ (1<<p))
}

/** ZDOG HELPERS SAUCE by Mootari:
 * https://observablehq.com/@mootari/zdog-helpers
 */


/**
 * Creates axes and returns an Anchor
 *
 * ---
 *
 * Options:
 *
 * {
 * size: Number, length of the axes; default 100
 *
 * head: Number, length of the arrow; default 10
 *
 * stroke: Number
 *
 * x: String, color of the x axis, null for insivible; default 'red'
 *
 * y: String, color of the y axis, null for insivible; default 'green'
 *
 * z: String, color of the z axis; default 'blue'
 *
 * }
 * @param {*} options
 */
function axesHelper({size = 100, head = 10, stroke = 1, x = 'hsl(0, 100%, 50%)', y = 'hsl(120, 100%, 50%)', z = 'hsl(240, 100%, 50%)', ...options} = {}) {
  const PIH = Math.PI / 2;
  const line = (color, rotate) => {
    const l = new Zdog.Shape({color, path: [{}, {x: size}], fill: false, stroke, rotate});
    if(head) {
      let colorHSL = parseHSL(color);
      new Zdog.Cone({
        addTo: l,
        color, stroke: false, fill: true, length: head,
        backface: `hsl(${colorHSL[0]},${colorHSL[1]}%,${colorHSL[2] - 15}%)`,
        diameter: head * .66,
        rotate: {y: -PIH},
        translate: {x: size},
      });
    }
    return l;
  }

  const a = new Zdog.Anchor(options);
  if(x) a.addChild(line(x, {}));
  if(y) a.addChild(line(y, {z: PIH}));
  if(z) a.addChild(line(z, {y: PIH}));
  return a;
}



/**
 * Creates a grid with even lines and returns an Anchor
 *
 * ---
 *
 * Options:{
 *
 * size: Number, default 100
 *
 * divisions: Number, default 10
 *
 * color: String, default '#888'
 *
 * stroke: Number, default 1
 *
 * front: Object, define the front plane, same as Zdog; default {z:1}
 * }
 * @param {Object} options
 */
function gridHelper({size = 100, divisions = 10, color = '#888', stroke = 1, front = {z:1}, ...options} = {}) {
  const sh = size/2;
  const path = [];
  for(let i = 0; i < divisions+1; i++) {
    const o = size/divisions*i-sh;
    path.push(
      {move: {z: -sh, x: o}},
      {line: {z: sh, x: o}},
      {move: {x: -sh, z: o}},
      {line: {x: sh, z: o}}
    );
  }
  const a = new Zdog.Anchor(options);
  new Zdog.Shape({path, front, stroke: stroke, fill: false, color, addTo: a});
  return a;
}

/**
 * Returns a grid Anchor object
 *
 * ---
 *
 * Options:{
 *
 * size: Number, default 100
 *
 * divisions: default 10
 *
 * color: String, default '#888'
 *
 * stroke: Number, default 1
 *
 * ...native Zdog options as needed (front is default z)
 * }
 * @param {*} options
 */
function gridRectHelper({size = 100, divisions = 10, color = '#888', stroke = 1, front = {z:1}, ...options} = {}) {
  const sh = size/2, s = size/divisions;
  const addTo = new Zdog.Anchor(options);

  for(let z = 0; z < divisions; z++) {
    const oz = s*z - sh;
    for(let x = 0; x < divisions; x++) {
       const ox = size/divisions * x - sh;
        new Zdog.Shape({stroke, fill: false, color, closed: true, addTo, front, path: [
          {move: {z: oz, x: ox}},
          {line: {z: oz, x: ox + s}},
          {line: {z: oz + s, x: ox + s}},
          {line: {z: oz + s, x: ox}},
        ]});
    }
  }

  return addTo;
}

/**
 * Adds rotation guidemarks to an object's axes
 *
 * ---
 *
 * Options:
 *
 * {
 * size: Number, radius of the marker
 *
 * hole: Number from 0-1, radius of the inner hole as decimal percent, default: 0.5
 *
 * range: Number, ratio of trail tapering; 0 for no tapering. A number larger than 1 will go outside the original perimeter
 *
 * x: String, color of the x axis, null for insivible
 *
 * y: String, color of the y axis, null for insivible
 *
 * z: String, color of the z axis
 * }
 * @param {Object} options
 */
function rotationHelper({size: r = 1, hole = .5, range = 1, x = 'red', y = 'green', z = 'blue', ...options} = {}) {
  const mix = (a, b, t) => a + t * (b - a);
  const root = new Zdog.Anchor(options), Q = Zdog.TAU*.25;
  const r1 = r * hole, r2 = mix(r1, r, range);
  const path = (r, r1, r2) => [
    {move: {x: r, y: 0}},
    {arc: [ {x: r, y: r}, {x: 0, y: r} ]},
    {line: {x: 0, y: r1}},
    {arc: [ {x: mix(r1,r2,.5), y: mix(r1,r2,.5)}, {x: r2, y: 0} ]},
  ];

 // for(let {color, colorTop = color, rotate} of [
  for(let {color, rotate} of [
    x && {color: x, rotate: {y:Q}},
    y && {color: y, rotate: {x:Q}},
    z && {color: z, rotate: {z:Q}},
  ].filter(v => v)) {
    const ring = new Zdog.Anchor({addTo: root, rotate});
    for(let i = 0; i < 4; i++) {
      new Zdog.Shape({
        addTo: ring,
        path: path(r, mix(r1, r2, i/4), mix(r1, r2, (i+1)/4)),
        rotate: {z: -Q*i},
        closed: true,
        fill: true,
        stroke: false,
        color,
      });
    }
  }

  return root;
}

// Fills the canvas with the specified color. Call in onPrerender.
function clearColor(illo, color) {
  const ctx = illo.ctx;
  ctx.save();
  ctx.resetTransform();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

/**
 * Attaches zoom event to the illustration, returns the illustration
 * @param {Zdog.Illustration} illo
 * @param {Object} options
 */
function zoomable(illo, options = {}) {
  Object.assign(illo, {
    setZoomable(zoomable) {
      zoomable
        ? this.element.addEventListener('wheel', this)
        : this.element.removeEventListener('wheel', this);
    },
    zoomSpeed: .001,
    minZoom: .1,
    onwheel(event) {
      event.preventDefault();
      const z0 = this.zoom, z = z0 - event.deltaY * this.zoomSpeed;
      // Max boundary handled by Zdog.
      this.zoom = z < this.minZoom ? this.minZoom : z;
      if(this.onZoom) this.onZoom(this.zoom, this.zoom - z0);
    }
  }, options);
  illo.setZoomable(illo.zoomSpeed != 0);
  return illo;
}

/**
 * Creates an object that can add functionality to new Illustration instance
 *
 * e.g.
 *
 *  const perspective = perspectiveHelper({fov: 300});
 *
 *  const illo = new Zdog.Illustration({
    element...
*
    onPrerender() {
      perspective.onPrerender(this);
    },
  });
 *
 * ---
 * Options: {
 *
 * fov: Number, field of view, default 100
 *
 * zOffset: Number, height of camera, default 0,
 *
 * scaleStroke: Boolean; default true}
 *
 * @param {Object} options
 */
function perspectiveHelper({fov = 100, zOffset = 0, scaleStroke = true} = {}) {

  function walk(illo, callback) {
    const top = new Set(illo.flatGraph);
    for(const g of top) _walk(g);

    function _walk(item) {
      callback(item);
      for(const c of item.children)
        if(!top.has(c)) _walk(c);
    }
  }

  return {
    fov,
    zOffset,
    scaleStroke,

    getScale(p) {
      return this.fov / (this.fov - p.z + this.zOffset);
    },

    scalePoint(p) {
      const s = this.getScale(p);
      p.x *= s;
      p.y *= s;
    },

    onPrerender(illo) {
      walk(illo, e => {
        this.scalePoint(e.renderOrigin);

        if(e.pathCommands && e.pathCommands.length) {
          if(this.scaleStroke && e.stroke) {
            if(e._stroke == null) e._stroke = e.stroke;
            e.stroke = e._stroke * this.getScale(e.pathCommands[0].endRenderPoint);
          }

          for(const c of e.pathCommands)
            for(const p of c.renderPoints)
              this.scalePoint(p);
        }

      });
    },

    resetStroke(illo) {
      walk(illo, e => {
        if(e._stroke !== undefined) {
          e.stroke = e._stroke;
          e._stroke = undefined;
        }
      });
    }
  };

}

function makeAxis(options){
  return new Zdog.Axis(options)
}

const COLOR_PROPS = [
  'color', 'rearFace', 'frontFace', 'leftFace', 'rightFace', 'topFace', 'bottomFace', 'backface'
]


//https://stackoverflow.com/questions/23095637/how-do-you-get-random-rgb-in-javascript
function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = num >> 8 & 255;
  var b = num & 255;
  return [r,g,b]
}

/**
 * Takes an HSL string and returns an array of the HSL values.
 * https://stackoverflow.com/questions/19289537/javascript-match-and-parse-hsl-color-string-with-regex
 * @param {*} color hsl string in the format hsl(x, x%, x%)';
 */
function parseHSL(color){
  let regexp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
  return regexp.exec(color).slice(1).map(val=>{
    return Number(val);
  });
  //array of [0]: Hue, [1]: Saturation, [2]:Lightness
}

function drawRaw(illo, draw) {
  const ctx = illo.ctx;
  ctx.save();
  ctx.resetTransform();
  draw(ctx);
  ctx.restore();
}


const Color = {
  PROPS: COLOR_PROPS,
  randomRgb: getRandomRgb,
  parseHSL: parseHSL
}

export {
  Scene,
  UnitAxes,
  makeAxis,
  Color,
};

export default Scene;