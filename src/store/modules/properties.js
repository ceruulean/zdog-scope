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


function getSelectedNode(rootState){
  let n = Ztree.find(rootState.selected.id);
  if (!n) return;
  let arr = n.constructor.optionKeys
  let node = Ztree.constructor.getProps(n)
  let p = ['colors', 'vectors', 'bools', 'nums']
  let props = {};
  p.forEach(type=>{
    props[type] = list[type](arr)
  })

  return {node, props}
}

let list = {
  colors(propList){
    return propList.filter((prop)=>{
      return COLOR_PROPS.includes(prop);
    })
  },
  vectors(propList){
    return propList.filter((prop)=>{
      return VECTOR_PROPS.includes(prop);
    })
  },
  bools(propList){
    return propList.filter(prop=>{
      return BOOL_PROPS.includes(prop) && prop != 'backface'
    })
  },
  nums(propList){
    return propList.filter(prop=>{
      return NUM_PROPS.includes(prop);
    })
  },
}

/* Module1.store.js */
// State object
const defaultState = () => ({
  invalidFields:null,
  validationSuccess:false,
  tooltip:null,
  displayProps:{
    node:null,
    props:null
  }
})

const state = defaultState();
// Getter functions
const getters = {
  validationFailed(state){
    return (state.validationSuccess == false && state.invalidFields);
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

  changeDisplay({commit, rootState}){
    let tewst = getSelectedNode(rootState)
    commit('setDisplayProps', tewst)
    //commit('setWipOPTIONS', Ztree.constructor.getProps())
  },

  editDisplay({commit}, options){
    commit('editDisplayProps', options)
  },

  reset({commit}){
    commit('resetState')
  },


  updateProps({dispatch, rootState}, incomingOptions){
    
    let node = Ztree.find(rootState.selected.id), options = Object.assign({}, incomingOptions)
    
    delete options['assignedType']
    delete options['id']

    let props = Object.keys(options)
    for(let prop of props) {
      if (NUM_PROPS.includes(prop)){
        options[prop] = Number(options[prop]);
      }
    }
    dispatch('history/updateProps', {node:node,options:options}, {root: true})
  },

  editOption({commit}, payload){
    commit('setWipOption', payload)
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
  },

  setDisplayProps(state, payload){
    if (!payload){
      state.displayProps = {node:null, props:null}
      return
    }
    state.displayProps = payload
  },

  editDisplayProps(state, options){
    Object.assign(state.displayProps.node, options)
  },

  resetState(state){
    Object.assign(state, defaultState())
  }


}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}