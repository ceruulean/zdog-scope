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
function assignName(ZdogItem, name){
  if (!name) name = "untitled";
  Object.defineProperty(ZdogItem, "assignedName", {
    enumerable: true,
    writable: true,
    configurable:false,
    value: name
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
  if (type == 4) return //we're not serializing dragger type
  let classN = ZDOG_CLASS_NAME[type];
  let recordProps = SET_PROPS[classN]
  if (!recordProps) return

  let result = {
    assignedType: type,
    assignedName: ZdogObject.assignedName,
    id: ZdogObject.id
  }
  //console.log('asfasdfa')
  //TODO: handle Anchors

  let strin = (prop) =>{
    if (prop == 'dragRotate') {
      if (typeof ZdogObject[prop] != 'boolean'){
        return true;
      }
    }
    return ZdogObject[prop]
  }

  //Assing props
  recordProps.forEach(prop=>{
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
    } else if (type == 8 ) {
      //illustration element prop set to a selector
      result.element = '.zdog-canvas';
    }
    
  }

  return result;
}

/**
 * Revives an Object or a stringified object into a Zdog object
 * @param {Object} plainObject 
 */
function reviveZdog(plainObject){
  if (typeof plainObject === "string"){
    plainObject = JSON.parse(plainObject);
  }
  let {id, assignedName, assignedType, ...options} = plainObject;
  let ZdogO = new ZDOG_CLASS_TYPE[assignedType](options);
  
  assignName(ZdogO, assignedName);
  assignType(ZdogO, assignedType)
  ZdogO.id = id;
  Object.defineProperty(ZdogO, "id", {enumerable:true, configurable: false, writable: false });
  return ZdogO
}

/**
 * Accepts a Ztree instance or a JSON file in the constructor
 */
class ZtreeReader{
  constructor(arg){
    if (!arg) {
      this.Ztree = null
    } else if (arg instanceof Ztree) {
      this.Ztree = Ztree
    } else {
      this.reviveTree(arg);
    }
  }

  static revivePlain(key, value){
    if (key == 'nodes'){
      let temp = value.map(plain=>{
        return reviveZdog(plain);
      })
      return temp;
    } else {
      return value;
    }
  }

  /**
   * Revives a JSON file to a Ztree
   * @param {String} JSONstring 
   */
  reviveTree(JSONstring){
    //parse arg into a Ztree
    let objecT = JSON.parse(JSONstring, ZtreeReader.revivePlain);
    let maP = new Map()
    objecT.nodes.forEach(node=>{
      maP.set(node.id, node);
      if(node.id == objecT.illustration){
        this.Ztree = new Ztree(node);
      }
    })
    this.Ztree.nodeMap = maP;
    //set relations, each relation is {from:'id', to:'id'}
    for(var r of objecT.relations){
      this.Ztree.relationSet.add(r)
      let f = maP.get(r.from)
      let t = maP.get(r.to)
      f.addChild(t)
    }

    return this.Ztree;
  }

  static Download(content, fileName, contentType){
    const a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    //window.URL.revokeObjectURL(file);
  }

  download(){
    if (!this.Ztree) throw new Error('Cannot download if there is no tree')
    let content = this.Ztree._JSON();
    ZtreeReader.Download(content, this.Ztree.illustration.assignedName, 'text/json');
  }

  static async Import(){
    const input = document.createElement('input')
    input.setAttribute('type','file');
    input.setAttribute('accept','.json');
    return new Promise((resolve, reject)=>{
      input.addEventListener('change', (event) => {
        let file = event.target.files;
        if (file !== null && file !== undefined) {
          resolve(event.target.files);
        } else {
          reject('No file chosen');
        }
      });
      input.click()
    })
  }

  async load(){
    return new Promise((resolve, reject) => {
      ZtreeReader.Import().then(fileList=>{
        var fileReader = new FileReader();
        fileReader.onloadend = (ev) => {
          this.reviveTree(ev.target.result);
          resolve(this.Ztree);
        }
        for (let f of fileList){
          fileReader.readAsText(f);
        }
      }).catch(e=>{
        reject(e);
      })
    })
  }
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
    let mainID = Ztree._nodeID(ZdogObject)
    nodeMap.set(mainID, ZdogObject);
    if (ZdogObject.addTo){
      let r = {from: ZdogObject.addTo.id, to: mainID}
      relationSet.add(r);
    }
    for (let c in ZdogObject.children){
      if (
        (ZdogObject.children.assignedType !== undefined)
        && (ZdogObject.children.assignedType !== null)
        && ZdogObject.children[c].id
        ){ 
        //it is a Zdog object (Some objects like boxes/cylinders store their faces as children but they aren't complete objects)
        let relation = {from: mainID, to: ZdogObject.children[c].id}
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

  download(){
    let content = this._JSON();
    ZtreeReader.Download(content,
      `${this.illustration.assignedName}.json`, 'text/json');
  }

  trimmedView(node){
    let {id,assignedName,assignedType,visible} = node;
    if (!id || !assignedType) return null;
    let index = this.indexOf(node);
    assignedType = ZDOG_CLASS_NAME[assignedType];
    if (visible === undefined) visible = true
    // children = (children.length > 0? true : false);
    return ({id,assignedName,assignedType,index,visible})
  }

  _JSON(){
    let {illustration, nodeMap, relationSet} = this;

    let result = {
      illustration: illustration.id,
      nodes: [...nodeMap.values()].map(node=>{
        return ZdogFilterProps(node)
      }),
      relations: [...relationSet.values()]
    }

    return JSON.stringify(result);
  }

  addNode(ZdogObject){
    Ztree.Flatten(ZdogObject, this.nodeMap, this.relationSet);
  }
  //can be id string or the object itself
  removeNode(node){
    let id = Ztree._nodeID(node);
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
    let id = Ztree._nodeID(node);
    return [...this.nodeMap.keys()].indexOf(id);
  }

  hasChildren(node){
    let id = Ztree._nodeID(node);
    let n = this.nodeMap.get(id);
    return (n.children.some(child=>{
      return child.id
    }));
  }

  hasParent(node){
    let id = Ztree._nodeID(node);
    let n = this.nodeMap.get(id);
    return (n.addTo != null && n.addTo != undefined && n.addTo != {});
  }

  find(id){
    return this.nodeMap.get(id);
  }

  static _nodeID(arg){
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
    let ID = Ztree._nodeID(node);
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

Zdogger.Tree = Ztree
Zdogger.isClass = isClass
Zdogger.Reader = ZtreeReader

export {
  Zdogger, Ztree, ZtreeReader,
  isClass, ZdogFilterProps,
  ZDOG_CLASS_TYPE, ZDOG_CLASS_STRING, ZDOG_CLASS_NAME,
  }

export default Zdogger;