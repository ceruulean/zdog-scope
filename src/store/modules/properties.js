import {ZdogFilterProps, ZDOG_CLASS_NAME, SET_PROPS} from '../../zdogrigger'

const READ_ONLY = [
  'assignedType', 'id', 'renderFront', 'renderNormal', 'renderOrigin'
]

// const ILLUSTRATION_RENDER = [
//   'canvasHeight', 'canvasWidth', 'height', 'width', 'renderOrigin'
// ]
/* Module1.store.js */
// State object
const state = {
  itemType:null
}
// Getter functions
const getters = {
  getVariable1( state ) {
     return state.varaible1;
  },
  selectedProps(state, getters, rootState){
    let n = rootState.Ztree.find(rootState.selected.id)
    return ZdogFilterProps(n);
  },
  editableProps(state){
    let iN = state.itemtype;
    let basic = SET_PROPS[iN]
    if (iN != 'vector' && iN != 'anchor' && iN != 'dragger'){
      basic = [...SET_PROPS['anchor'], ...basic]
    }
    return basic
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
}
// Actions 
const actions = {

  setList({commit}, payload){
    commit('changeList', payload)
  },

  sortItem({commit}, payload){
    commit('nodeChangeParent', payload, {root:true})
  },
  
}

const mutations = {

  changeList(state, payload){
    state.list = payload;
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}