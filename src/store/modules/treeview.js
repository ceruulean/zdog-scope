/* Module1.store.js */
// State object
const state = {
  list: [],
  blockIds:[]
}
// Getter functions
const getters = {
  getVariable1( state ) {
     return state.varaible1;
  },
  view:(state, getters, rootState) => {
    if (!rootState.Ztree) return undefined;
    return rootState.Ztree.trimmedView();
  }
}
// Actions 
const actions = {

  changeList({commit}, payload){
    commit('setList', payload)
  },

  sortItem({commit}, payload){
    commit('setNodeParent', payload, {root:true})
  },

  startDrag({commit}, {blockIds}){
    commit('setDragging', blockIds);
  },

  stopDrag({commit}){
    commit('setDragging', [])
  }
  
}

// let findById = (arr, Id) => {
//   for (let node of arr) {
//     if (node.id == Id){
//       return node;
//     }
//   }
//   return null
// }

// function deepSearch(list, newParentId, childId){
//   let resultNode = findParent(list, newParentId);
//   if (!resultNode && list.children && list.children.length > 0) { //search each node's children
//     for (let node of list) {
//       resultNode = deepSearch(node.children, newParentId)
//       if (resultNode) {break}
//     }
//   }
//   return resultNode;
// }


// Mutations  
const mutations = {
  setList(state, payload){
    state.list = payload;
  },

  setDragging(state, blockIds){
    state.blockIds = blockIds;
  }
  // SET_VARIABLE_2(state, data) {
  //    state.variable2 = data;
  // },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}