import {Ztree} from '../index'

import {CYCLIC_PROPS} from '../../zdogrigger'
import ZdogJSONSchema from '../../zdogobjects.json'


const VECTOR_PROPS = [
  'rotate','translate','scale','front'
]
const BOOL_PROPS = [
  'fill','visible','closed','updateSort','dragRotate', 'centered', 'resize', 'backface'
]

const COLOR_PROPS = [
  'color', 'rearFace', 'frontFace', 'leftFace', 'rightFace', 'topFace', 'bottomFace'
]

const NUM_PROPS = Object.keys(ZdogJSONSchema.optionValidator)
  .filter(prop=>{
    return ZdogJSONSchema.optionValidator[prop].type == 'number'
  })

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
 * Checks the proposed options and returns an array of invalid fields (empty if fields are valid)
 * @param {Object} incomingOptions 
 */
function invalidFields(incomingOptions){
  let incorrectFields = [];
  let k = Object.keys(incomingOptions);
  let v = Object.values(incomingOptions);
  for (let index = 0; index < k.length; index++){
    let field = k[index];
    let value = v[index];
    let validType = ZdogJSONSchema.optionValidator[field].type;

    //backface can be a string
    if (field == 'backface' && typeof value == 'string'){
      continue;
    }
    if (typeof value != validType){
      if (validType == 'Array') { // needs to be array
        if (Array.isArray(value)){
          continue;
        }
      } else if (validType == 'integer') {
        let toNum = Number(value);
        if (Number.isInteger(toNum)){
          continue;
        }
      } else if (validType == 'number'){
        let toNum = Number(value);
        if (!isNaN(toNum)){
          continue;
        }
      }
    incorrectFields.push(field);
    }
  }
  return incorrectFields;
}


/* Module1.store.js */
// State object
const state = {
  invalidFields:null,
  validationSuccess:false,
  tooltip:null
}
// Getter functions
const getters = {
  show(state, getters, rootState){
    return (rootState.selected.id != null)
  },
  selectedAllProps(state, getters, rootState, rootGetters){
    return rootGetters.selectedNode.constructor.optionKeys
  },
  selectedOptions(state, getters, rootState, rootGetters){
    if (rootState.selected.id) {
      let o = Ztree.constructor.getProps(rootGetters.selectedNode);
      return o
    }
    return
  },
  validationFailed(state){
    return (state.validationSuccess == false && state.invalidFields);
  },
  bBlank(state, getters, rootState){
    return (!rootState.illustration)
  },
  colorProps(state, getters){
    return getters.selectedAllProps.filter((prop)=>{
      return COLOR_PROPS.includes(prop);
    })
  },
  vectorProps(state, getters, rootState, rootGetters){
    return rootGetters.selectedNode.constructor.optionKeys.filter((prop)=>{
      return VECTOR_PROPS.includes(prop);
    })
  },
  boolProps(state, getters){
    return getters.selectedAllProps.filter(prop=>{
      return BOOL_PROPS.includes(prop) && prop != 'backface'
    })
  },
  numProps(state, getters){
    return getters.selectedAllProps.filter(prop=>{
      return NUM_PROPS.includes(prop);
    })
  },
  BOOL_PROPS(){
    return BOOL_PROPS
  },
  VECTOR_PROPS(){
    return VECTOR_PROPS
  },
  CYCLIC_PROPS(){
    return CYCLIC_PROPS
  },
  COLOR_PROPS(){
    return COLOR_PROPS
  },
  CREATE_PROPS(){
    return CREATE_PROPS
  },
  NUM_PROPS(){
    return NUM_PROPS
  }
}
// Actions 
const actions = {

  updateProps({rootGetters}, incomingOptions){
    let node = rootGetters.selectedNode, options = Object.assign({}, incomingOptions)

    let props = Object.keys(incomingOptions)
    for(let prop of props) {
      
      if (NUM_PROPS.includes(prop)){
        options[prop] = Number(options[prop]);
      }
    }

      for (let o in options){
        node[o] = options[o]
      }
      node.updateGraph();
  
     // dispatch('setNodeProps', payload, {root:true})
  },

  changeList({commit}, payload){
    let invalids = invalidFields(payload);
    if (invalids.length > 0) {
      //throw error
      commit('INVALID_ERROR', invalids);
    } else {
      commit('log', payload)
    }
  },

  validateFields({commit}, incomingOptions){
    let invalids = invalidFields(incomingOptions);
    if (invalids.length > 0) {
      commit('VALIDATION_FAIL', invalids);
    } else {
      commit('VALIDATION_SUCCESS');
     // TODO? warning system?
    }
  },

  validationReset({commit}){
    commit('VALIDATION_RESET');
  },
  
}

const mutations = {

  log(state, payload){
    console.log(payload);
  },

  VALIDATION_FAIL(state, invalids){
    state.validationSuccess = false;
    state.invalidFields = invalids;
  },

  VALIDATION_SUCCESS(state){
    state.validationSuccess = true;
    state.invalidFields = null;
  },

  VALIDATION_RESET(state){
    state.validationSuccess = false;
    state.invalidFields = null;
  },

  setTooltip(state, payload){
    state.tooltip = payload;
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}