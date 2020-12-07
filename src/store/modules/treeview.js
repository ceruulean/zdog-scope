import {Ztree} from '../index'

/* Module1.store.js */
// State object
const getDefaultState = () => ({
  list: [],
  blockIds:[],
  selectedListNode:null
})

const state = getDefaultState();
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

  saveSelected({commit}, treeNode){
    commit('setSelectedList', treeNode)
  },

  clearSelected({commit}){
    commit('setSelectedList', null)
  },

  updateSelectedName({state}, newName){
    state.selectedListNode.assignedName = newName
  },

  resetView({commit}){
    commit('resetState')
  }
  
}

// Mutations  
const mutations = {
  setList(state, payload){
    state.list = payload;
  },

  setDragging(state, blockIds){
    state.blockIds = blockIds;
  },

  setSelectedList(state, payload){
    state.selectedListNode = payload
  },

  resetState(state) {
    Object.assign(state, getDefaultState())
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}