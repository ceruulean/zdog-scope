
import Zdog from '../../zdog'

//import versor from 'versor'

//Reference reading: https://www.sitepoint.com/building-3d-engine-javascript/

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


/**
 * Zdog camera
 */
class Camera{
/**
 * Creates a camera object that allows panning/zooming
 * @param {Zdog.Illustration} illustration 
 * @param {*} options 
 * @param {} zoomLabelEle HTML query selector to display zoom
 */
  constructor(illustration, options={zoomSpeed:3, panInverse:false, panSpeed:30}){
    this.illustration = illustration;
    let illoe = illustration.element;
    this.eye = {}
    this.worldPosition = new Zdog.Vector();

    // this.axes.renderGraph();
    
    this.phi = this.illustration.rotate.x
    this.theta = this.illustration.rotate.y
    this.zoom = this.illustration.zoom


    //phi is polar (xy plane)
    //theta is azimuthal (zx plane)
    /**
            | -y
            |
            | __________ +x
           /|
          / |
      +z /  | +y
        /
     */


    this.zoomSpeed = options.zoomSpeed
    this.panInverse = options.panInverse
    this.panSpeed = options.panSpeed

    /**
     * EVENTS
     */
    this.isPanning = false;
    this.isMouseDown = 0;

    let ctx = this;

    let listeners = {
      wheel:this.onwheel.bind(this),
    }
    this.listeners = listeners;
    illoe.addEventListener('wheel', listeners['wheel'] )

    this.animReq = null
    this.dragger = new Zdog.Dragger({
      startElement: illoe,
      onDragStart: function(pointer, event) {
        ctx.onmousedown(event);
        ctx.dragstarted(pointer.pageX, pointer.pageY)
      },
      onDragMove: function( pointer, dX, dY ) {
        if (ctx.isPanning){
          ctx.pan(pointer)
        } else {
          ctx.dragRotate(pointer, dX,dY)
        }
      },
      onDragEnd: function(event) {
        ctx.dragend(event);
        ctx.onmouseup(event);
  //      console.log(`(ρ,θ,φ):(${ctx.rho},${ctx.theta},${ctx.phi})`)
      },
    });

    this.label = document.createElement('span')
    this.label.innerText = `${Math.round(this.zoom * 100)}%`

    // console.log(illustration)
    // illustration.onPrerender = function(canvastx){
    //   let text = `${Math.round(this.zoom * 100)}%`
    //   //ctx.strokeText(text, x, y [, maxWidth])
    //  if (illustration.centered){
    //   let y = ctx.illustration.canvasHeight / -2

    //   canvastx.strokeText(text, 0, y)
    //  }

    // }

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

  get defaultRho(){
    return (this.illustration.canvasHeight / 2)
  }

  get zoom(){
    return 1 / (this.rho  / this.defaultRho)
  }

  set zoom(newZoom){
    this.rho = this.defaultRho / newZoom;
    this.illustration.zoom = newZoom
  }

  renderAxes(){
    let ctx = this.illustration.ctx;
      // clear canvas
  //ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  //ctx.save();
  // find origin
    ctx.translate( this.illustration.canvasWidth/2, this.illustration.canvasHeight/2 );
  // set lineJoin and lineCap to round
  // ctx.lineJoin = 'round';
  // ctx.lineCap = 'round';
  // render scene graph

    this.axes.renderGraphCanvas(ctx);
      //ctx.restore();
  }

  // pan(pointer){
  //   let [dx, dy] = this.screendelta(pointer)

  //   if (!this.panInverse){
  //     dx = dx * -1
  //     dy = dy * -1
  //   }

  //   let r = this.rho * Math.cos(this.phi)

  //   let speed = (this.panSpeed / 100)
  //   let y2 = this.illustration.translate.y + (dy*speed)
  //   let x2 = this.illustration.translate.x + (dx*speed)

  //   let phi2 = Math.atan2(y2, r);
  //   let theta2 = Math.atan2(x2 , r);
  //   let r2 = Math.sqrt(Math.pow(r,2) + Math.pow(dx, 2))
  //   let rho2 = r2 / Math.cos(phi2);

  //   this.theta = theta2
  //   this.phi = phi2
  //   this.rho = rho2

  //   let o = {x:this.x, y:this.y, z:this.z}
  //   this.illustration.translate = o;
  //   this.illustration.rotate =  {x:this.phi, y:this.theta, z:this.illustration.rotate.z}
  // }

  pan(pointer){
    let [dx, dy] = this.screendelta(pointer)

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

  dragstarted(x0,y0) {
    this.x0 = x0;
    this.y0 = y0;
    }

  dragRotate(pointer) {
    let [dx, dy] = this.screendelta(pointer)
    this.theta = (this.theta + this.radRatio( dx));
    this.phi = (this.phi + this.radRatio( dy ));
    let o = {x:this.phi, y:this.theta, z:this.illustration.rotate.z}
    this.illustration.rotate = o;
  }

  dragend(event){
    this.selection(event)

  }

  screendelta(pointer){
    let deltaX = this.x0 - pointer.pageX;
    let deltaY = this.y0 - pointer.pageY;

    this.x0 = pointer.pageX;
    this.y0 = pointer.pageY;

    return [deltaX, deltaY]
  }

  onwheel(event){
    event.preventDefault();
    const z0 = this.rho, z = z0 + event.deltaY * this.zoomSpeed;
    this.rho = Math.max(0.1, z);
    this.illustration.zoom = this.zoom;
    this.label.innerText = `${Math.round(this.zoom * 100)}%`
  }

  selection(){
    let ctx = this.illustration.ctx;
    let transformer = new TransformationMatrix();

    let X = event.offsetX //- (this.illustration.canvasWidth / 2)
    let Y = event.offsetY //- (this.illustration.canvasHeight / 2)

    transformer.m = this.illustration.transformMatrix
    let canvasPoint = transformer.screenPoint(X, Y);

    let nodes = this.illustration._flatGraph;
    for (let node of nodes){
      node
      let path = node.path2d;
      if (path){
        let intersect = (ctx.isPointInStroke(path,  canvasPoint.x ,  canvasPoint.y)
        || ctx.isPointInPath(path,  canvasPoint.x ,  canvasPoint.y));
        if (intersect){
          //send an event with the object?
          node.color = 'white'
          break;
        } else {
          node.color ='black'
        }
      }
    }

  }

  keydown(e){
    //Shift -> pan
    if (e.keyCode == 16){
      this.isPanning = true;
    }
  }

  keyup(e){
    //Shift -> pan
    if (e.keyCode == 16 && this.isMouseDown < 4){
      this.isPanning = false;
    }
  }

  onmousedown(event){
    this.isMouseDown = event.buttons;
    //MMB pressed
    if (event.button == 1){
      this.isPanning = true;
    }
  }

  onmouseup(event){
    this.isMouseDown = event.buttons
    //MMB pressed
    if (event.button == 1){
      this.isPanning = false;
    }
  }

  /**
   * Returns a radian value to correlate rotation with screen pixel projection
   * @param {Number} delta in screen pixels
   */
  radRatio(delta){
    return delta * (Math.PI * 2) / this.illustration.canvasWidth;
  }

  animate = () => {
    this.illustration.updateRenderGraph();
    this.animReq = requestAnimationFrame(this.animate);
  }

  destroy(){
    let listener = this.listeners;
    this.illustration.element.removeEventListener('wheel',  listener['wheel'])
  }

  projection(point){
    let vector = new Zdog.Vector(point);
    [vector.z * Math.sin(this.theta)];
  }
  

}

//https://riptutorial.com/html5-canvas/example/19666/a-transformation-matrix-to-track-translated--rotated---scaled-shape-s-

class TransformationMatrix{
  m=[1,0,0,1,0,0]
  reset(){ this.m=[1,0,0,1,0,0]; }
  multiply(mat){
    let m = this.m
    var m0=m[0]*mat[0]+m[2]*mat[1];
    var m1=m[1]*mat[0]+m[3]*mat[1];
    var m2=m[0]*mat[2]+m[2]*mat[3];
    var m3=m[1]*mat[2]+m[3]*mat[3];
    var m4=m[0]*mat[4]+m[2]*mat[5]+m[4];
    var m5=m[1]*mat[4]+m[3]*mat[5]+m[5];
    m=[m0,m1,m2,m3,m4,m5];
  }
  screenPoint(transformedX,transformedY){
    // invert
    let m = this.m
    var d =1/(m[0]*m[3]-m[1]*m[2]);
    let im=[ m[3]*d, -m[1]*d, -m[2]*d, m[0]*d, d*(m[2]*m[5]-m[3]*m[4]), d*(m[1]*m[4]-m[0]*m[5]) ];
    // point
    return({
        x:transformedX*im[0]+transformedY*im[2]+im[4],
        y:transformedX*im[1]+transformedY*im[3]+im[5]
    });
  }
  transformedPoint(screenX,screenY){
    let m = this.m
    return({
        x:screenX*m[0] + screenY*m[2] + m[4],
        y:screenX*m[1] + screenY*m[3] + m[5]
    });    
  }
  // shared methods
  translate(x,y){
      var mat=[ 1, 0, 0, 1, x, y ];
      this.multiply(mat);
  }
  rotate(rAngle){
      var c = Math.cos(rAngle);
      var s = Math.sin(rAngle);
      var mat=[ c, s, -s, c, 0, 0 ];    
      this.multiply(mat);
  }
  scale(x,y){
      var mat=[ x, 0, 0, y, 0, 0 ];        
      this.multiply(mat);
  }
  skew(radianX,radianY){
      var mat=[ 1, Math.tan(radianY), Math.tan(radianX), 1, 0, 0 ];
      this.multiply(mat);
  }
  setContextTransform(ctx){
      ctx.setTransform(this.m[0],this.m[1],this.m[2],this.m[3],this.m[4],this.m[5]);
  }
  resetContextTransform(ctx){
      ctx.setTransform(1,0,0,1,0,0);
  }
  getMatrix(){
      return[...this.m]
  }
}

//From phoria.js
//https://github.com/kevinroast/phoria.js/blob/master/scripts/phoria-view.js

// function calculateClickPointAndVector(scene, mousex, mousey)
//    {
//       var camLookAt = vec3.fromValues(
//          scene.camera.lookat.x,
//          scene.camera.lookat.y,
//          scene.camera.lookat.z);
//       var camOff = vec3.subtract(vec3.create(), scene._cameraPosition, camLookAt);
      
//       // get pixels per unit at click plane (plane normal to camera direction going through the camera focus point)
//       var pixelsPerUnit = (scene.viewport.height / 2) / (vec3.length(camOff) * Math.tan((scene.perspective.fov / 180 * Math.PI) / 2));
      
//       // calculate world units (from the centre of canvas) corresponding to the mouse click position
//       var dif = vec2.fromValues(mousex - (scene.viewport.width / 2), mousey - (scene.viewport.height / 2));
//       vec2.subtract(dif, dif, new vec2.fromValues(8, 8)); // calibrate
//       var units = vec2.create();
//       vec2.scale(units, dif, 1 / pixelsPerUnit);
      
//       // move click point horizontally on click plane by the number of units calculated from the x offset of the mouse click
//       var upVector = vec3.fromValues(scene.camera.up.x, scene.camera.up.y, scene.camera.up.z);
//       var normalVectorSide = vec3.create();
//       vec3.cross(normalVectorSide, camOff, upVector);
//       vec3.normalize(normalVectorSide, normalVectorSide);
//       var clickPoint = vec3.scaleAndAdd(vec3.create(), camLookAt, normalVectorSide, units[0]);
      
//       // move click point vertically on click plane by the number of units calculated from the y offset of the mouse click
//       var normalVectorUp = vec3.create();
//       vec3.cross(normalVectorUp, normalVectorSide, camOff);
//       vec3.normalize(normalVectorUp, normalVectorUp);
//       vec3.scale(normalVectorUp, normalVectorUp, units[1]);
//       vec3.subtract(clickPoint, clickPoint, normalVectorUp);
      
//       // calculate click vector (vector from click point to the camera's position)
//       var camVector = vec3.add(vec3.create(), camLookAt, camOff);
//       return {
//          clickPoint: clickPoint,
//          clickVector: vec3.subtract(vec3.create(), clickPoint, camVector)
//       };
//    }

// function getIntersectedObjects(scene, clickPoint, clickVector)
// {
//    var intersections = [], obj, polygonNormal, polygonPoint, polygonCoords, polygonPlaneIntersection, pointVector;
   
//    // Go through all the appropriate objects
//    var objects = scene.renderlist;
//    for (var n = 0; n < objects.length; n++)
//    {
//       obj = objects[n];
      
//       // only consider solid objects
//       if (obj.style.drawmode !== "solid") continue;
      
//       // Go through all the polygons of an object
//       for (var m = 0; m < obj.polygons.length; m++)
//       {
//          polygonNormal = vec3.clone(obj.polygons[m]._worldnormal);
//          polygonPoint = vec3.clone(obj._worldcoords[obj.polygons[m].vertices[0]]);
         
//          // Get the point where the line intersectects the polygon's plane
//          polygonPlaneIntersection = Phoria.Util.planeLineIntersection(polygonNormal, polygonPoint, clickVector, clickPoint);
         
//          // if the intersection is null, it means the line does not intersect the plane
//          if (polygonPlaneIntersection !== null)
//          {
//             // Check if the intersection is inside the polygon
//             if (Phoria.Util.intersectionInsidePolygon(obj.polygons[m], obj._worldcoords, polygonPlaneIntersection))
//             {
//                // add intersection to the array being returned
//                var returnObject = {
//                   entity: obj,
//                   polygonIndex: m,
//                   intersectionPoint: polygonPlaneIntersection
//                };
//                intersections.push(returnObject);
//             }
//          }
//       }
//    }
   
//    // calculate distance to each intersection from camera's position
//    for (var i = 0; i < intersections.length; i++)
//    {
//       intersections[i].distance = vec3.distance(scene._cameraPosition, intersections[i].intersectionPoint);
//    }
   
//    // sort intersection points from closest to farthest
//    for (var i = 0; i < intersections.length - 1; i++)
//    {
//       for (var j = i + 1, keepVal; j < intersections.length; j++)
//       {
//          if (intersections[i].distance >= intersections[j].distance)
//          {
//             keepVal = intersections[j];
//             intersections[j] = intersections[i];
//             intersections[i] = keepVal;
//          }
//       }
//    }
   
//    // return list of all intersections
//    return intersections;
// }

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

function drawRaw(illo, draw) {
  const ctx = illo.ctx;
  ctx.save();
  ctx.resetTransform();
  draw(ctx);
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

export {
  axesHelper,
  rotationHelper,
  perspectiveHelper,
  gridHelper,gridRectHelper,
  Camera,
  requestAnimationFrame, cancelAnimationFrame,

  clearColor,drawRaw,zoomable}