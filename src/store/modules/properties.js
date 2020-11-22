import {ZdogFilterProps, ZDOG_CLASS_NAME, SET_PROPS} from '../../zdogrigger'
import ZdogJSONSchema from '../../zdogobjects.json'

const READ_ONLY = [
  'assignedType', 'id', 'renderFront', 'renderNormal', 'renderOrigin'
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

// const ILLUSTRATION_RENDER = [
//   'canvasHeight', 'canvasWidth', 'height', 'width', 'renderOrigin'
// ]
/* Module1.store.js */
// State object
const state = {
  wipOptions:null
}
// Getter functions
const getters = {
  isShape(state){
    return (state.itemtype != 'vector') && (state.itemtype != 'anchor') && (state.itemtype != 'group')
    && (state.itemtype != 'illustration');
  },
  selectedProps(state, getters, rootState){
    let n = rootState.Ztree.find(rootState.selected.id)
    return ZdogFilterProps(n);
  },
  TYPE(state, getters){
    return ZDOG_CLASS_NAME[getters.selectedProps['assignedType']];
  },
  writableProps(state, getters){
    let some = {...getters.selectedProps};
    for(let P of READ_ONLY){
      delete some[P];
    }
    return some;
  },
  editableProps(state){
    let iN = state.itemtype;
    let basic = SET_PROPS[iN]
    if (iN != 'vector' && iN != 'anchor' && iN != 'dragger'){
      basic = [...SET_PROPS['anchor'], ...basic]
    }
    return basic
  },
  advEditableProps(state, getters){
    if (getters.isShape && state.itemtype != 'shape'){
      return SET_PROPS['shape'].filter(prop=>{
        return (prop != 'color' && prop != 'path')
      });
    }
    return null;
  },
}
// Actions 
const actions = {

  setItemType({commit}, itemType){
    commit('changeItemType', itemType);
  },

  setList({commit}, payload){
    let invalids = invalidFields(payload);
    if (invalids.length > 0) {
      //throw error
      commit('INVALID_ERROR', invalids);
    } else {
      commit('log', payload)
    }
  },
  
}

const mutations = {

  log(state, payload){
    console.log(payload);
  },

  INVALID_ERROR(state, invalids){
    state.invalidFields = invalids;
  },

  changeItemType(state, itemType){
    state.itemType = itemType;
  }

  // changeList(state, payload){
  //   state.item = payload;
  // }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}