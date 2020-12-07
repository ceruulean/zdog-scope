import {Ztree} from '../index'

/* Module1.store.js */
// State object
const state = {
  list: [],
  blockIds:[]
}
// Getter functions
const getters = {

}
// Actions 
const actions = {

  changeList({commit}){
    commit('setList', Ztree.trimmedView())
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