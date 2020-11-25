//import {ZdogFilterProps, ZDOG_CLASS_NAME, SET_PROPS} from '../../zdogrigger'
import ZdogJSONSchema from '../../zdogobjects.json'

const CYCLIC_PROPS = [
  'addTo', 'dragRotate', 'onPrerender', 'onDragStart', 'onDragMove',
  'onDragEnd','onResize'
]
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
        if (isNaN(toNum)){
          incorrectFields.push(field);
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
  validationSuccess:false
}
// Getter functions
const getters = {
  selectedNode(state, getters, rootState){
    if (!rootState.Ztree) return null;
    return rootState.Ztree.find(rootState.selected.id)
  },
  selectedAllProps(state, getters){
    let noCyclic = getters.selectedNode.constructor.optionKeys.filter(option=>{
      return !CYCLIC_PROPS.includes(option)
    })
    return noCyclic;
  },
  validationFailed(state){
    return (state.validationSuccess == false && state.invalidFields);
  }
}
// Actions 
const actions = {

  changeSelectedProps({commit, getters}, incomingOptions){
    let payload = {
      node: getters.selectedNode,
      options: incomingOptions
    }
    commit('setNodeProps', payload, {root:true})
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
  }
  
}

const mutations = {

  log(state, payload){
    console.log(payload);
  },

  setWipOptions(state, payload){
    state.wipOptions = payload;
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

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}