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

  sortItem({dispatch}, payload){
    dispatch('history/changeParent', payload, {root: true})
    dispatch('changeList')
  },

  startDrag({commit}, {blockIds}){
    commit('setDragging', blockIds);
  },

  stopDrag({commit}){
    commit('setDragging', [])
  },

  changeSelectedName({ /*dispatch,*/ state }, newName){
    if (!state.selectedListNode) throw new Error('Cannot change name if nothing is selected')
    state.selectedListNode.assignedName = newName
  //  dispatch('history/updateSelectedName', newName, {root: true})
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