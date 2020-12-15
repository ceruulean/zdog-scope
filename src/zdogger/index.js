/* eslint-disable no-unused-vars */

import Scene from './scene'
import {Z, StringUtils} from './ztree'


const ZCLASS = Z.CLASS

let Zdogger = (type) =>{
  return Z.make(type)
} 

Object.assign(Zdogger, {
  Tree: Z.Tree,
  Reader: Z.Reader,
  Scene: Scene,
  CLASS: ZCLASS,
  is: Z.is,
})

const StringMixin = {
  methods: StringUtils
}

const propsFor = Z.propsFor

export {StringMixin, propsFor}

export default Zdogger