import {ztree} from '../index'

/* Module1.store.js */
// State object
const getDefaultState = () => ({
  list: [],
  blockIds:[],
  selectedListNode:null,
  embed:null
})

const state = getDefaultState();
// Getter functions
const getters = {
}
// Actions 
const actions = {

  changeList({commit}){
    commit('setList', ztree.trimmedView())
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

  createEmbed({commit}){
    let e = ztree.generateEmbed({selector:'.zdog-canvas', mini:true});
    commit('setEmbed', e)
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

  setEmbed(state, payload){
    state.embed = payload
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