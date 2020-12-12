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
    dispatch('history/updateParent', payload, {root: true})
    dispatch('changeList')
  },

  startDrag({commit}, {blockIds}){
    commit('setDragging', blockIds);
  },

  stopDrag({commit}){
    commit('setDragging', [])
  },

  saveSelected({commit}, treeNode){
    commit('setSelectedList', treeNode)
  },

  clearSelected({commit}){
    commit('setSelectedList', null)
  },

  changeDisplayName({state}, newName){
    state.selectedListNode.name = newName
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