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
    if (!rootState.Ztree) return null;
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



// Mutations  
const mutations = {
  setList(state, payload){
    state.list = payload;
  },

  setDragging(state, blockIds){
    state.blockIds = blockIds;
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}