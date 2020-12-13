import Zdog from '../../../zdog'

import json_beautifier from 'csvjson-json_beautifier';

/**
 * Zdog properties that are derived, or do esoteric things
  const ADVANCED_PROPERTIES  = ['origin','sortValue','pixelRatio',
  'renderOrigin','renderFront','renderNormal','pathCommands',
  'canvasHeight','canvasWidth']   */

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
  
const CYCLIC_PROPS = [
  'addTo', 'dragRotate', 'onPrerender', 'onDragStart', 'onDragMove',
  'onDragEnd','onResize', 'element'
]

let nocyclic = (options) => {return options.filter(option=>{
  return !CYCLIC_PROPS.includes(option)
})}
  
/**
 * Generates a basic random ID
 */
function generateUid() {
// always start with a letter -- base 36 makes for a nice shortcut
  let result = ""
  var t = (Math.random() * 20).toString(36)
  for(let i = t.length-1; i > 1; i--){
    result += t[i]
  }
  return result
}

/**
 * Creates Zdog objects with name, uid and type (see ZDOG_CLASS, an 'enum')
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
 * Adds an "name" property to the Zdog item for human covenience (and open up for search/filter options in the future?)
 * @param {*} ZdogItem 
 */
function assignName(ZdogItem, name){
  if (!name) name = "untitled";
  Object.defineProperty(ZdogItem, "name", {
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
 * Adds the property "type" as an integer for class checking
 * @param {*} ZdogItem 
 */
function assignType(ZdogItem, int){
  Object.defineProperty(ZdogItem, "type", {
    enumerable: true,
    writable: false,
    configurable:false,
    value: int
  })
}
  
/**
 * Checks if the Zdog item is a certain type of instance ('Shape,' 'Vector,' etc.) Will return true for super classes (like Illustration is an Anchor)
 * @param {*} ZdogItem the Zdog item
 * @param {*} type can be String or Number (e.g. 'anchor' or 0 or '0')
 */
function isClass(zdog, type){
  //string argument
  let int = 0;
  if (typeof type == 'string') {
    type = type.toLowerCase();
    int = ZDOG_CLASS[type];
  } else if (Number.isInteger(type)) {
    int = type
  } else {
    return false
  }
  return (zdog instanceof ZDOG_CLASS_TYPE[int]);
}
  
/**
 * Add properties to native Zdog objects that don't have ids or type assigned to them yet
 * @param {*} ZdogItem 
 * @param {*} options {id,name, type}
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
  if (type < 0) return ZdogItem; // return the original because can only do certain objects

  if (!ZdogItem.name) assignName(ZdogItem, 'untitled');
  if (!ZdogItem.id) assignUID(ZdogItem);
  if (!ZdogItem.type) assignType(ZdogItem, type);

  for (let c of ZdogItem.children){
    assignExisting(c);
  }
  return ZdogItem
}
  
/**
 * Add 'id', 'type' and 'name' properties to an illustration and returns a copy
 * @param {Zdog.Illustration} illustration
 */
function importExisting(illustration){
  let copy = illustration.copyGraph();
  assignExisting(copy);
  return copy;
}

/**
 * Creates a copy of a Zdog object with different ids
 * @param {*} zdog A Zdog object
 * @param {Boolean} deep whether to copy the descendents
 */
function copy(zdog, deep=false){
  if (!deep){
    return assignExisting(zdog.copy())
  }
  return assignExisting(zdog.copyGraph())
}
  
/**
 * Revives the plain Object or a stringified JSON into a Zdog object
 * @param {*} plainObject 
 */
function reviveZdog(plainObject){
  if (typeof plainObject === "string"){
    plainObject = JSON.parse(plainObject);
  }
  let {id, name, type, ...options} = plainObject;
  let ZdogO = new ZDOG_CLASS_TYPE[type](options);
  
  assignName(ZdogO, name);
  assignType(ZdogO, type)
  ZdogO.id = id;
  Object.defineProperty(ZdogO, "id", {enumerable:true, configurable: false, writable: false });
  return ZdogO
}
  
/**
 * Zerialises Zdog object and returns a JS object with bare minimum properties
 * @param {*} ZdogItem 
 */
function toObject(ZdogItem){
  if(!ZdogItem || (isNaN(ZdogItem.type)) ) return;
  let type = ZdogItem.type;
  if (type == 4) return //we're not serializing dragger type
  let classType = ZDOG_CLASS_TYPE[type];
  let recordProps = classType.optionKeys.filter(option=>{
    return !CYCLIC_PROPS.includes(option)
  });
  if (!recordProps) return

  let result = {
    type: type,
    name: ZdogItem.name,
    id: ZdogItem.id
  }

  let strin = (prop) =>{
    if (prop == 'dragRotate') {
      if (typeof ZdogItem[prop] != 'boolean'){
        return true;
      }
    } else if(prop == 'element') {
      return '.zdog-canvas'
    }
    return ZdogItem[prop]
  }

  //Assing props
  recordProps.forEach(prop=>{
    result[prop] = strin(prop);
  })

  if (type == 8){
      //illustration element prop set to a selector
      result.element = '.zdog-canvas';
  }
  return result;
}

/**
 * Returns an {option:value} object of a Zdog pruned of cyclic values
 * @param {*} zdog Zdog object
 */
// function getProps(node){
function justProps(zdog){
  let options;
  options = zdog.constructor.optionKeys
  let o = {}
  for (let p of nocyclic(options)){
    o[p] = zdog[p]
  }
  Object.assign(o, {
    name: zdog.name,
    type: zdog.type,
    id: zdog.id
  })
  return o;
}
  
/**
 * Gets the valid instantiation options of the Zdog Class
 * 
 * validProps('Anchor') // returns ["rotate", "translate", "scale"]
 * @param {*} arg can be String or Integer
 */
function validProps(arg){
  let options;
  try{
    if (typeof arg == 'number'){
      options = ZDOG_CLASS_TYPE[arg].optionKeys
    } else if (typeof arg == 'string'){
      options = ZDOG_CLASS_TYPE[ZDOG_CLASS[arg.toLowerCase()]].optionKeys
    } else if (arg.optionKeys){
      options = arg.optionKeys
    } else {
      options = arg.constructor.optionKeys
    }
    return nocyclic(options)
  } catch(e){
    throw new Error(e)
  }
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
   * @param {*} JSONstring 
   */
  reviveTree(JSONstring){
    //parse arg into a Ztree
    let objecT = JSONstring
    if (typeof JSONstring == 'string'){
      objecT = JSON.parse(JSONstring, ZtreeReader.revivePlain);
    } else {
      objecT.nodes = objecT.nodes.map(plain=>{
        return reviveZdog(plain)
      })
    }
    let maP = new Map()
    objecT.nodes.forEach(node=>{
      maP.set(node.id, node);
      if(node.id == objecT.illustration){
        this.Ztree = new Ztree(node);
      }
    })
    this.Ztree.nodeMap = maP;
    //set relations, each relation is {parent:'parentid', children:[array of childids]}
    this.Ztree.relationMap = new Map();
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
    let content = this.Ztree.JSON();
    ZtreeReader.Download(content, `${this.Ztree.illustration.name}.json`, 'text/json');
  }

  /**
   * Opens the client's File Explorer to only accept .JSON, and returns a Promise that resolves to FileList, otherwise rejects
   */
  static async import(){
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
      ZtreeReader.import().then(fileList=>{
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
       // rotate: {x:-.5+Math.PI, z: 0, y:.5+Math.PI}, //default Zdog rotation is weird
        //dragRotate:true
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
    this.illustration.name = 'root'
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
          !isNaN(child.type)
          // (child.type !== undefined)
          // && (child.type !== null)
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
    let {id,name,type,visible,children} = node;
    if (!id || isNaN(type)) return null;
    let index = this.indexOf(node);
    type = ZDOG_CLASS_NAME[type];
    if (visible === undefined) visible = true

    if (children && children.length > 0) {
      children = children.map(child=>{
        return this.trimNode(child);
      }).filter(x=>x);
    } else {
      children = null
    }
    return ({id,name,type,index,visible,children})
  }

  download(){
    let content = this.JSON();
    ZtreeReader.Download(content,
      `${this.illustration.name}.json`, 'text/json');
  }

  /**
   * Returns a stripped down tree with nesting, for UI tree display
   */
  trimmedView(){
    return [this.trimNode(this.illustration)]
  }

  /**
   * Find root of composite objects
   * @param {*} node 
   */
  static findRoot(node){
    if ((node.id && node.type) || !node.addTo) {
      return node
    }
    return Ztree.findRoot(node.addTo);
  }

  /**
   * Returns a plain of the tree object
   */
  plain(){
    let {illustration, nodeMap, relationMap} = this;

    let result = {
      illustration: illustration.id,
      nodes: [...nodeMap.values()].map(node=>{
        return toObject(node)
      }),
      relations: [...relationMap.entries()].map(entry=>{
        let key = entry[0]
        let valset = entry[1]
        return {parent: key, children: Array.from(valset)}
      })
    }

    return result
  }
/**
 * Returns a clone of the Ztree
 */
  clone(){
    let p = this.plain();
    let c = new ZtreeReader(p).Ztree;
    console.log(c)
    return c
  }

  /**
   * Returns a JSON string of the tree
   */
  JSON(){
    return StringUtils.toString(this.plain())
  }

  addNode(ZdogItem){
    this.flatten(ZdogItem);
  }

  _addRelation(parentId, childIds){
    let newSet = this.relationMap.get(parentId)
    if (!newSet) {
      newSet = new Set()
    } 
    for (let id of childIds){
      newSet.add(id);
    }
    this.relationMap.set(parentId, newSet);
  }
/**
 * Removes node from Ztree, returns the removed node
 * @param {String} id of Zdog node to remove
 */
  removeNode(id){
    if (id == this.illustration.id) throw new Error('Cannot delete root')
    let node = this.nodeMap.get(id)

    if (node.children){
      //put children to parent node
      let parent = node.addTo
      node.children.map(child=>{
        child.remove();
        parent.addChild(child);
      })
      //update Map
      let childs = this.relationMap.get(id);
      if (childs){
        childs = [...childs]
        this._addRelation(this.relationMap.get(parent.id), childs)
      }
    }

    //remove record of relations
    this.relationMap.delete(id);
    this.relationMap.forEach(childSet=>{
      childSet.delete(id);
    })
    //update Map
    this.nodeMap.delete(id);
    node.remove()

    return node;
  }
//id of the node to be adopted
  changeParent(id, newParentId){
    let childnode = this.nodeMap.get(id)
    let oldParentNode = childnode.addTo
    let pnode = this.nodeMap.get(newParentId);
    //remove child from set record
    this.relationMap.get(oldParentNode.id).delete(id)
    this._addRelation(newParentId, [id])

    if (oldParentNode){
      oldParentNode.removeChild(childnode);
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
      return !isNaN(child.type)
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

  generateEmbed({selector, width, height, bgColor, mini}){
    let combined = ''
   combined += canvasTagGenerate(selector, width, height, bgColor) + '\n'
   combined += scriptTagGenerate(this, selector, mini)
   return combined
  }
}

/** EMBED GENERATORS
 */

 function canvasTagGenerate(selector='.zdog-canvas', width=300, height=300, bgColor='transparent'){
   let attribute = '';
   let omitSelector = (str) => {
    return str.substr(1, str.length - 1)
   }
   switch (selector[0]) {
    case '.':
      attribute = `class="${omitSelector(selector)}"`
      break;
    case '#':
      attribute = `id="${omitSelector(selector)}`
      break;
    case '[':
      attribute = selector.replace(/\[\]\^\*\$/g, '')
      break;
    default:
      attribute = `class="${selector}"`
   }
   return `<canvas ${attribute} width="${width}" height="${height}" style="background-color:${bgColor}"></canvas>`
 }

 //https://javascript.info/string
/**
 * Creates a JavaScript <script> string of the Ztree (for embed copy-paste)
 * @param {Ztree} ztree 
 * @param {Boolean} mini 
 */
 function scriptTagGenerate(ztree, selector=".zdog-canvas", mini=false){
   let result = '<script>'
   let nl = mini?'':'\n'
   let plain = ztree.trimmedView()
   //return an array with [base, children, nestedChilds]
   let getFlat = (node) => {
     let arr = [node];
     if (node.children && node.children.length > 0) {
      node.children.forEach(child=>{
        child.addTo = node.id
        arr = [...arr, ...getFlat(child)]
      })
     }
     return arr
   }
   let properNames = ZDOG_CLASS_NAME.map(name=>{
    return capitalize(name)
   })
   properNames[11] = "RoundedRect"
   let order = getFlat(plain[0])

   for (let i = 0; i < order.length; i++){
     let id = order[i].id
     let type = properNames[ZDOG_CLASS[order[i].type]]
     let node = ztree.find(id)
     let options = Ztree.getProps(node)

     let declaration = `${nl}var ${id} = new Zdog.${type}(`
     if (type == "Illustration"){
       options.dragRotate = true
       options.element = selector;
      }

     //prune options to save filesize
     delete options.id
     delete options.type
     delete options.name

     let defaults = node.constructor.defaults;
     for (let d in defaults){
      if (defaults[d] == options[d]){
        delete options[d]
      }
     }

     for (let d in options){
      if (d == 'translate' || d == 'rotate'){
        if (options[d].x == 0){
          delete options[d].x
        }
        if (options[d].y == 0){
          delete options[d].y
        }
        if (options[d].z == 0){
          delete options[d].z
        }
        if (options[d] == {}){
          delete options[d]
        }
      }
      if (d == 'scale'){
        if (options[d].x == 1){
          delete options[d].x
        }
        if (options[d].y == 1){
          delete options[d].y
        }
        if (options[d].z == 1){
          delete options[d].z
        }
        if (options[d] == {}){
          delete options[d]
        }
      }
     }

     //use plugin to avoid double quotes from JSON.stringify
     let jjj = json_beautifier(options, {
      dropQuotesOnKeys:true,
      minify:mini
     })

     if (order[i].addTo){
      declaration += jjj.slice(0, jjj.length-1)
      declaration += `,${nl}addTo: ${order[i].addTo}${nl}}`
     } else {
      declaration += jjj
     }
     declaration += ');'+nl;
     result += declaration
   }

   result += `${nl}function animate() {
    ${ztree.illustration.id}.updateRenderGraph();${nl}requestAnimationFrame(animate);}${nl}animate();${nl}</script>`
   return result
 }

function capitalize(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}


//** EXPORTS */

 /**
 * To create a Zdog object with id: Zdogger('anchor')
 * 
 * To create a Ztree: new Z.Tree(illustration)
 * 
 * To create a file reader: new Z.Reader(Ztree)
 * 
 * To create a copy: Z.copy(ZdogItem, deep?)
 * 
  * @param {String} type 
  */
 const Z = (type) => {
  if (typeof type == 'string') return create(type);
  if (typeof type == 'number') return make(type);
  if (type.id) return reviveZdog(type)
  return null;
}

const  ZCLASS = {
  TYPES: ZDOG_CLASS_TYPE,
  ENUMS: ZDOG_CLASS,
  NAMES: ZDOG_CLASS_NAME
}

const StringUtils = {
  capitalize: capitalize,
  toString: (o) => {return JSON.stringify(o)}
}

const zCopy = copy;

Z.copy = zCopy
Z.is = isClass
Z.import = importExisting
Z.revive = reviveZdog
Z.toObject = toObject
Z.justProps = justProps
Z.propsFor = validProps
Z.CLASS = ZCLASS
Z.Tree = Ztree
Z.Reader = ZtreeReader

export {Z, Ztree, ZtreeReader,
  ZCLASS, zCopy, justProps, StringUtils }


export default Z;