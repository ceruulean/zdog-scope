import Zdog from 'zdog'

/**
 * classType only accepts 0-13 (corresponding to ZDog types)
 */
const ZDOG_CLASS_TYPE = [
  Zdog.Anchor,
  Zdog.Shape,
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
  Zdog.Box,
  Zdog.Vector
]

/**
 * Treated like an enum
 */
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

/**
 * Treated like an enum, convert an integer to the Zdog class/type/object name
 */
const ZDOG_CLASS_NAME = Object.keys(ZDOG_CLASS);

/**
 * Creates Zdog objects with assignedName, uid and assignedType (see ZDOG_CLASS, an 'enum')
 * @param {Number} int 
 */
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

/**
 * Instead of new Zdog.Anchor(options), can call
 * create('anchor') and defer object creation until you receive all options
 * 
 * e.g.
 * let makeAnchor = (options) => create('anchor')(options)
 * 
 * makeAnchor({translate:{x:0,y:0}}) returns new Zdog.Anchor
 * @param {String} itemName 
 */
const create = (itemName) => {
  return make(ZDOG_CLASS[itemName])
}

/**
 * Generates a random ID in the format "x_xxxxxxxx_xxxxx"
 * (Code from https://stackoverflow.com/questions/3231459/create-unique-id-with-javascript)
 */
function generateUid() {
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
 * Adds an "assignedName" property to the Zdog item for human covenience (and open up for search/filter options in the future?)
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
 * Adds a unique identifier "id" immutable property to the Zdog item.
 * @param {*} ZdogItem 
 */
function assignUID(ZdogItem){
  ZdogItem.id = generateUid();
  // freeze the id
  Object.defineProperty(ZdogItem, "id", {enumerable:true, configurable: false, writable: false });
}
/**
 * Adds the property "assignedType" as an integer for class checking
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
 * Checks if the Zdog item is a certain type of instance ('Shape,' 'Vector,' etc.) Will return true for super classes (like Illustration is an Anchor)
 * @param {*} ZdogItem the Zdog item
 * @param {*} zdogType can be String or Number (e.g. 'anchor' or 0 or '0')
 */
function isClass(ZdogItem, zdogType){
  //string argument
  let int = 0;
  if (typeof zdogType == 'string') {
    zdogType = zdogType.toLowerCase();
    int = ZDOG_CLASS[zdogType];
  } else if (Number.isInteger(zdogType)) {
    int = zdogType
  } else {
    return false
  }
  return (ZdogItem instanceof ZDOG_CLASS_TYPE[int]);
}

/**
 * Add properties to native Zdog objects that don't have ids or type assigned to them yet
 * @param {*} ZdogItem 
 */
function assignExisting(ZdogItem){
  //start backwards because anchor is 0 and is the parent of almost all objects
  let type = -1;
  for(let n = ZDOG_CLASS_NAME.length - 1; n >= 0; n--){
    if (isClass(ZdogItem, n)){
      type = n;
      break;
    }
  }
  if (type < 0) return ZdogItem; // return the original because can only do certain objects...? UGH this is annoying
  assignName(ZdogItem, 'untitled');
  assignUID(ZdogItem);
  assignType(ZdogItem, type);
  
  for (let c of ZdogItem.children){
    assignExisting(c);
  }
  return ZdogItem
}

/**
 * Add 'id', 'assignedType' and 'assignedName' properties to an illustration and returns a copy
 * @param {Zdog.Illustration} illustration
 */
function importExisting(illustration){
  let copy = illustration.copyGraph();
  assignExisting(copy);
  return copy;
}

/**
 * User settable props for when calling 'new Zdog.Item', taken from documentation @ https://zzz.dog/api
 */
const CREATE_PROPS = {
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
   * Zdog properties that are derived, or do esoteric things
   */
  const ADVANCED_PROPERTIES  = ['origin','sortValue','pixelRatio',
  'renderOrigin','renderFront','renderNormal','pathCommands',
  'canvasHeight','canvasWidth']

/**
 * Zerialises Zdog object and returns JSON string with bare minimum properties
 * @param {*} ZdogItem 
 */
function ZdogFilterProps(ZdogItem){
  if(!ZdogItem || (isNaN(ZdogItem.assignedType)) ) return;
  let type = ZdogItem.assignedType;
  if (type == 4) return //we're not serializing dragger type
  let classN = ZDOG_CLASS_NAME[type];
  let recordProps = CREATE_PROPS[classN]
  if (!recordProps) return

  let result = {
    assignedType: type,
    assignedName: ZdogItem.assignedName,
    id: ZdogItem.id
  }

  let strin = (prop) =>{
    if (prop == 'dragRotate') {
      if (typeof ZdogItem[prop] != 'boolean'){
        return true;
      }
    }
    return ZdogItem[prop]
  }

  //Assing props
  recordProps.forEach(prop=>{
    result[prop] = strin(prop);
  })

  //Assign anchor props
  if (type != 0 && type != 13 && type != 4) {
    recordProps = CREATE_PROPS['anchor']
    recordProps.forEach(prop=>{
      result[prop] = strin(prop);
    })

    //Assign Shape props
    if (type != 6 && type != 8 ) {
      recordProps = CREATE_PROPS['shape']
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
 * Revives the plain Object or a stringified JSON into a Zdog object
 * @param {*} plainObject 
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
 * JSON converter for Ztree
 */
class ZtreeReader{
  /**
   * Accepts a Ztree instance a JSON string. Can be null.
   * @param {Ztree} arg 
   */
  constructor(arg){
    this.Ztree = null
    if (!arg) {
      return
    } else if (arg instanceof Ztree) {
      this.Ztree = Ztree
    } else {
      this.reviveTree(arg);
    }
  }

  /**
   * Zdog reviver function for JSON.parse second argument
   */
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
   * Revives a JSON file to a Ztree and returns a new Ztree
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
    //set relations, each relation is {parent:'parentid', children:[array of childids]}
    for(var r of objecT.relations){
      let parent = maP.get(r.parent);
      let set = new Set(r.children.map(id=>{
        let child = maP.get(id)
        parent.addChild(child)
        return id;
      }));
      this.Ztree.relationMap.set(r.parent, set);
      
    }

    return this.Ztree;
  }

  /**
   * Sends a download prompt
   */
  static Download(content, fileName, contentType){
    const a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    //window.URL.revokeObjectURL(file);
  }

  /**
   * Method to download the Ztree as JSON
   */
  download(){
    if (!this.Ztree) throw new Error('Cannot download if there is no tree')
    let content = this.Ztree._JSON();
    ZtreeReader.Download(content, `${this.Ztree.illustration.assignedName}.json`, 'text/json');
  }

  /**
   * Opens the client's File Explorer to only accept .JSON, and returns a Promise that resolves to FileList, otherwise rejects
   */
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

  /**
   * Parses selected JSON file, returns Promise with the Ztree on success
   */
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
  /**
   * Illustration can be null
   * @param {Zdog.Illustration} illustration 
   */
  constructor(illustration){
    this.nodeMap = new Map();
    this.relationMap = new Map(); //{key: id, value: Set() of child ids}
    if (!illustration){
      this.illustration = null;
      return;
    }else if (!illustration.element || typeof illustration.element == 'string'){
      let optionsDefault = {
        element: '.zdog-canvas',
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 1,
       // rotate: {x:-.5+Math.PI, z: 0, y:.5+Math.PI}, //default Zdog rotation is weird
        dragRotate:true
        }

      let options = Object.assign({}, optionsDefault)
      Object.assign(options, illustration);
      this.illustration = create('illustration')(options);
    } else if (illustration.id) {
      this.illustration = illustration
    } else {
      this.illustration = importExisting(illustration)
      this.flatten(this.illustration)
    }
    this.addNode(this.illustration);
    this.illustration.assignedName = 'root'
  }

  //flatten existing zdog object into Map and Set to record relations
  flatten(ZdogItem){
    let mainID = Ztree._nodeID(ZdogItem)
    this.nodeMap.set(mainID, ZdogItem);
    if (ZdogItem.addTo){
      let pID = ZdogItem.addTo.id;
      let set = this.relationMap.get(pID);
      if (!set) {
        this.relationMap.set(pID, new Set([mainID]))
        return
      }
      set.add(mainID);
    }
    if (ZdogItem.children.length > 0) {
      let set = this.relationMap.get(mainID);
      if (!set) {
        set = new Set();
        this.relationMap.set(mainID, set);
      }
      for (let child of ZdogItem.children){
        if (
          !isNaN(child.assignedType)
          // (child.assignedType !== undefined)
          // && (child.assignedType !== null)
          // && child.id
          ){ 

          set.add(child.id);
          this.flatten(child);
        }
      }
    }
  }

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

  /**
   * Returns an object with the bare minimum display properties of the Zdog item
   * @param {*} node a Zdog object within the tree
   */
  trimNode(node){
    let {id,assignedName,assignedType,visible,children} = node;
    if (!id || isNaN(assignedType)) return null;
    let index = this.indexOf(node);
    assignedType = ZDOG_CLASS_NAME[assignedType];
    if (visible === undefined) visible = true

    if (children && children.length > 0) {
      children = children.map(child=>{
        return this.trimNode(child);
      }).filter(x=>x);
    } else {
      children = null
    }
    return ({id,assignedName,assignedType,index,visible,children})
  }

  download(){
    let content = this._JSON();
    ZtreeReader.Download(content,
      `${this.illustration.assignedName}.json`, 'text/json');
  }

  /**
   * Returns a stripped down tree with nesting, for UI tree display
   */
  trimmedView(){
    return [this.trimNode(this.illustration)]
  }

  /**
   * Returns a JSON string of the tree
   */
  _JSON(){
    let {illustration, nodeMap, relationMap} = this;

    let result = {
      illustration: illustration.id,
      nodes: [...nodeMap.values()].map(node=>{
        return ZdogFilterProps(node)
      }),
      relations: [...relationMap.entries()].map(entry=>{
        let key = entry[0]
        let valset = entry[1]
        return {parent: key, children: Array.from(valset)}
      })
    }

    return JSON.stringify(result);
  }

  addNode(ZdogItem){
    this.flatten(ZdogItem);
  }
  //can be id string or the object itself
  removeNode(node){
    let id = Ztree._nodeID(node);
    this.nodeMap.delete(id);

    //remove record of relations
    this.relationMap.delete(id);
    this.relationMap.forEach(childSet=>{
      childSet.delete(id);
    })
  }
//id of the node to be adopted
  changeParent(id, newParentId){
    let childnode = this.nodeMap.get(id)
    let oldParentNode = childnode.addTo
    let pnode = this.nodeMap.get(newParentId);

    //remove child from set record
    this.relationMap.get(oldParentNode.id).delete(id)
    let newSet = this.relationMap.get(newParentId)
    if (!newSet) {
      newSet = new Set([id])
      this.relationMap.set(newParentId, newSet);
    } else {
      newSet.add(id);
    }

    if (oldParentNode){
      oldParentNode.removeChild(childnode);
      //swap parent and id if changing places
      oldParentNode.addChild(pnode);
    }

    pnode.addChild(childnode);
    return pnode;
  }

  /**
   * Returns an array of all Zdog items in the tree
   */
  get nodes(){
    return [...this.nodeMap.values()];
  }

  /**
   * Returns insertion order index of the Zdog object (insertion order accoridng to Map API is not reliable)
   * @param {*} node String id or Zdog object
   */
  indexOf(node){
    let id = Ztree._nodeID(node);
    return [...this.nodeMap.keys()].indexOf(id);
  }

  hasChildren(node){
    let id = Ztree._nodeID(node);
    let set = [...this.relationMap.get(id).values()];
    return (set.children.some(child=>{
      return !isNaN(child.assignedType)
    }));
  }

  hasParent(node){
    let id = Ztree._nodeID(node);
    let set = this.relationMap.get(id);
    return (set && set.size() > 0);
  }

  find(id){
    return this.nodeMap.get(id);
  }

  /**
   * Internal helper function meant for retrieving the ID incase someone passes the Zdog object instead. Returns String
   * @param {*} arg String id or Zdog object
   */
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
    this.relationMap.forEach((relation)=>{
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

/**
 * Converts degrees to radians
 * @param {Number} degrees 
 */
function toRad(degrees) {
  return (Math.PI * degrees) / 180;
}

 /**
 * To create a Zdog object with id: Zdogger('anchor')
 * 
 * To create a Ztree: new Zdogger.Tree(illustration)
 * 
 * To create a file reader: new Zdogger.Reader(Ztree)
 * 
 * To convert degrees to radians: Zdogger.toRad(degree)
  * @param {String} type 
  */
let Zdogger = (type) => {
  if (typeof type == 'string') return create(type);
  if (typeof type == 'number') return make(type);
  return null;
}

Zdogger.Tree = Ztree
Zdogger.isClass = isClass
Zdogger.Reader = ZtreeReader
Zdogger.toRad = toRad

export {
  Zdogger, Ztree, ZtreeReader,
  isClass, ZdogFilterProps,
  ZDOG_CLASS_TYPE, ZDOG_CLASS, ZDOG_CLASS_NAME,
  CREATE_PROPS, ADVANCED_PROPERTIES
  }


export default Zdogger;