import Zdog from 'zdog'

/**
 * new Zdogger(classType: int) 
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

class Node{

  constructor(classType, data, name){

    if(typeof classType == 'string'){
      this.type = ZDOG_CLASS_STRING[classType];
      if (!this.type) throw new Error('failed construction of Zdogger');
    } else if (typeof classType == 'number'){
      this.type = classType;
    }
    this.data = data;
    this.name = name
  }

  get class(){
    return ZDOG_CLASS_TYPE[this.type];
  }

  get className(){
    return ZDOG_CLASS_NAME[this.type];
  }

  //test x instanceof Zdog.Shape 
}

export default {Node}