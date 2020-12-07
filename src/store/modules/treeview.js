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

  sortItem({dispatch}, {id, newParentId}){
      let nodeUpdate = Ztree.changeParent(id, newParentId);
      nodeUpdate.updateGraph();
      dispatch('changeList')
  },

  startDrag({commit}, {blockIds}){
    commit('setDragging', blockIds);
  },

  stopDrag({commit}){
    commit('setDragging', [])
  },

  changeSelectedName({ rootState, rootGetters }, {newName, treeNode}){
      if (!rootState.selected.id) throw new Error('Cannot assign name to null selected node');
      rootGetters.selectedNode
        .assignedName = newName;
      
        treeNode.assignedName = newName
  },
  
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