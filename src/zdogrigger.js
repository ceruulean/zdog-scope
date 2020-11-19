import Zdog from 'zdog'

/**
 * new create(classType: int) 
 * classType only accepts 0-13 (corresponding to ZDog types)
 */
const ZDOG_CLASS_TYPE = [
  Zdog.Anchor,
  Zdog.Box,
  Zdog.Cone,
  Zdog.Cylinder,
  Zdog.Dragger,
  Zdog.Ellipse,
  Zdog.Group,
  Zdog.Hemisphere,
  Zdog.Illustration,
  Zdog.Polygon,
  Zdog.Rect,
  Zdog.RoundedRect,
  Zdog.Shape,
  Zdog.Vector
]

const ZDOG_CLASS_STRING = {
  'anchor':0,
  'box':1,
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
  'shape':12,
  'vector':13
}

const ZDOG_CLASS_NAME = Object.keys(ZDOG_CLASS_STRING);

// Creates Zdog objects with assignedName and uid.
function make(int){
  let construct = ZDOG_CLASS_TYPE[int];
  return function(options){
    let newZdog = new construct(options);
    assignUID(newZdog);
    assignName(newZdog);
    assignType(newZdog, int);
    return newZdog;
  }
}

// Instead of new Zdog.Anchor(options), can call
// create['anchor'] and defer instance creation until you receive all options
//    let makeAnchor = (options) => create['anchor'](options)
//    makeAnchor({translate:{x:0,y:0}})
const create = {
  anchor:make(0),
  illustration:make(8),
  shape:make(12),
  rect:make(10),
  roundedrect:make(11),
  ellipse:make(5),
  hemisphere:make(7),
  polygon:make(9),
  cone:make(2),
  cylinder:make(3),
  box:make(1),
  group:make(6),
  dragger:make(4),
  vector:make(13),
}

//**Utility Function from https://stackoverflow.com/questions/3231459/create-unique-id-with-javascript */
function generateUID() {
// desired length of Id
var idStrLen = 16;
// always start with a letter -- base 36 makes for a nice shortcut
var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
// add a timestamp in milliseconds (base 36 again) as the base
idStr += (new Date()).getTime().toString(36) + "_";
// similar to above, complete the Id using random, alphanumeric characters
do {
    idStr += (Math.floor((Math.random() * 35))).toString(36);
} while (idStr.length < idStrLen);

return (idStr);
}
/**
 * Adds an "assignedName" property to the Zdog item for human viewing in the tree (and maybe search/filter options?)
 * @param {*} ZdogItem 
 */
function assignName(ZdogItem){
  Object.defineProperty(ZdogItem, "assignedName", {
    enumerable: true,
    writable: true,
    configurable:false,
    value: "untitled"
  })
}
/**
 * Adds a unique identifier "id" property to the Zdog item, that is immutable.
 * @param {*} ZdogItem 
 */
function assignUID(ZdogItem){
  ZdogItem.id = generateUID();
  // freeze the id
  Object.defineProperty(ZdogItem, "id", {enumerable:true, configurable: false, writable: false });
}
/**
 * Adds a the type as property "assignedType" as an integer.
 * @param {*} ZdogItem 
 */
function assignType(ZdogItem, int){
  Object.defineProperty(ZdogItem, "assignedType", {
    enumerable: true,
    writable: false,
    configurable:false,
    value: int
  })
}

/**
 * Checks if the Zdog item is a certain type of instance, 'Shape,' 'Vector,' etc. Will return true for super classes (like Illustration is an Anchor)
 * @param {*} ZdogItem 
 * @param {String, Integer} zdogType can be 'anchor' or corresponding flag '0' for example
 */
function isClass(ZdogItem, zdogType){
  //string argument
  let int = 0;
  if (typeof zdogType == 'string') {
    zdogType = zdogType.toLowerCase();
    int = ZDOG_CLASS_NAME[zdogType];
  } else if (Number.isInteger(zdogType)) {
    int = zdogType
  }
  return ZdogItem instanceof new ZDOG_CLASS_TYPE[int]
}


const SET_PROPS = {
  anchor:[
    'rotate',
    'translate',
    'scale',
  ],
  ellipse: [
    "diameter",
    "width","height","quarters"
  ],
  box:[
    'depth',
    'frontFace',
    'rearFace',
    'leftFace',
    'rightFace',
    'topFace',
    'bottomFace',
  ],
  polygon:[
    "sides",
    "radius"
  ],
  illustration:[
    //element
  "centered","zoom","dragRotate","resize"
    // onPrerender: noop,
    // onDragStart: noop,
    // onDragMove: noop,
    // onDragEnd: noop,
    // onResize: noop,
  ],
  vector:[
    "x","y","z"
  ],
  rect:[
    "width","height"
  ],
  roundedrect:[
    "width","height","cornerRadius"
  ],
  shape:[
    "path","stroke","fill","color","closed","visible","path","front","backface"
  ],
  hemisphere:["diameter","backface"],
  group:["updateSort","visible"],
  cylinder:["diameter","length","backface","frontFace"],
  cone:["diameter","length","backface"]
}

/**
 * Zerialises Zdog object and returns JSON string
 * @param {*} ZdogObject 
 */
function ZdogFilterProps(ZdogObject){
  if(!ZdogObject || !ZdogObject.assignedType) return;
  let type = ZdogObject.assignedType;
  let classN = ZDOG_CLASS_NAME[type];
  console.log(classN);
  let recordProps = SET_PROPS[classN]

  let result = {
    assignedType: type,
    assignedName: ZdogObject.assignedName,
    id: ZdogObject.id
  }

  let strin = (prop) =>{
    if (prop == 'dragRotate') {
      if (typeof ZdogObject[prop] != 'boolean'){
        return true;
      }
    }
    return JSON.stringify(ZdogObject[prop])
  }

  recordProps.forEach(prop=>{
    console.log(prop);
    result[prop] = strin(prop);
  })

  //Assign anchor props
  if (type != 0 && type != 13 && type != 4) {
    recordProps = SET_PROPS['anchor']
    recordProps.forEach(prop=>{
      result[prop] = strin(prop);
    })

    //Assign Shape props
    if (type != 6 && type != 8 ) {
      recordProps = SET_PROPS['shape']
      recordProps.forEach(prop=>{
        result[prop] = strin(prop);
      })
    }
  }

  return result;
}

/**
 * Make easy tree viewing of Zdog objects
 * https://chrissmith.xyz/super-fast-tree-view-in-javascript/
 */
class Ztree{
  constructor(illustration){
    this.illustration = illustration;
    this.nodeMap = new Map();
    this.relationSet = new Set(); //{from: sourceId, to: childId}
    this.addNode(illustration);
    illustration.assignedName = 'root'
  }

  //Flatten existing zdog object into Map and Set to record relations
  static Flatten(ZdogObject, nodeMap, relationSet){
    nodeMap.set(ZdogObject.id, ZdogObject);
    if (ZdogObject.addTo){
      let r = {from: ZdogObject.addTo.id, to: ZdogObject.id}
      relationSet.add(r);
    }
    for (let c in ZdogObject.children){
      if (
        (ZdogObject.children.assignedType !== undefined)
        && (ZdogObject.children.assignedType !== null)
        && ZdogObject.children[c].id
        ){ 
        //it is a Zdog object (Some objects like boxes/cylinders store their faces as children but they aren't complete objects)
        let relation = {from: ZdogObject.id, to: ZdogObject.children[c].id}
        relationSet.add(relation);
        Ztree.Flatten(ZdogObject.children[c], nodeMap);
      }
    }
  }

  static COMMON_PROPERTIES = [
    'rotate','color','stroke','width','height','depth','origin','closed','length',
    'translate','scale','fill','visible',
  ]

  static ADVANCED_PROPERTIES  = ['path','updateSort','front',
  'backface','leftFace','rightFace','bottomFace','frontFace','rearFace','topFace',
  'quarters']

  static getCommonProps(node){
    let filtered = Object.keys(node).filter((prop) => {
      Ztree.COMMON_PROPERTIES.contains(prop)
    });

    let obj = {}
    filtered.forEach(prop => {
      obj[prop] = node[prop];
    })
    return obj
  }

  addNode(ZdogObject){
    Ztree.Flatten(ZdogObject, this.nodeMap, this.relationSet);
  }
  //can be id string or the object itself
  removeNode(node){
    let id = this._nodeID(node);
    this.nodeMap.delete(this.nodeMap.get(id));

    //remove record of relations
    this.relationSet.forEach(relation=>{
      if (relation.from == id || relation.to == id) {
        this.relationSet.delete(relation);
      }
    })
  }

  get nodes(){
    return [...this.nodeMap.values()];
  }
//Can be id string or object itself, returns insertion order index
  indexOf(node){
    let id = this._nodeID(node);
    return [...this.nodeMap.keys()].indexOf(id);
  }

  hasChildren(node){
    let id = this._nodeID(node);
    let n = this.nodeMap.get(id);
    return (n.children > 0);
  }

  hasParent(node){
    let id = this._nodeID(node);
    let n = this.nodeMap.get(id);
    return (n.addTo != null && n.addTo != undefined && n.addTo != {});
  }

  find(id){
    return this.nodeMap.get(id);
  }

  _nodeID(arg){
    let ID = arg
    if (typeof node === "string") {
      ID = arg;
    } else {
      ID = arg.id;
    }
    // else {
    //   throw new Error('Invalid argument, must be string or zdog Object')
    // }
    return ID
  }

//Parentless nodes
  get orphans(){
    return this.nodes.filter((node)=>{
      return !node.addTo
    })
  }

  get orphanNodes(){
    return this.nodes.filter((node)=>{
      return !node.addTo
    })
  }

  getChildNodes(node){
    let ID = this._nodeID(node);
    let childIds = [];
    this.relationSet.forEach((relation)=>{
      if (relation.from == ID){
        childIds.push(relation.to);
      }
    })
    return childIds.map((cid)=>{
      this.nodeMap.get(cid);
    })
  }

  // get leaves(){
  //   return this.nodes.filter((node)=>{
  //     return node.children.length == 0
  //   })
  // }

  get groups(){
    return this.anchors.filter(node=>{
      return isClass(node, 6)
    })
  }

  get anchors(){
    return this.nodes.filter(node=>{
      return isClass(node, 0)
    })
  }

}

let Zdogger = (type) => {
  if (typeof type == 'string') return create[type];
  if (typeof type == 'number') return make(type);
  return null;
}

Zdogger.tree = Ztree
Zdogger.isClass = isClass

export {Zdogger, Ztree, isClass, ZdogFilterProps,
  ZDOG_CLASS_TYPE, ZDOG_CLASS_STRING, ZDOG_CLASS_NAME}

export default Zdogger;