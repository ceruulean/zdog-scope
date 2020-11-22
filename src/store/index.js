import { createStore, createLogger } from 'vuex'

//import MODULES from './modules/MODUELS' if ever gets more modules NEED TO AUTOMATE THIS
import treeview from './modules/treeview'

const debug = process.env.NODE_ENV !== 'production'

import {Zdogger, isClass} from '../zdogrigger'



/**
 *  GLOBALS
 */
const state = () => ({
  Ztree:undefined,
  selected:{
    id:undefined,
    element:undefined
  },
  updateTree:false,
})

// getters
const getters = {
  illustration:(state) => {
    if (!state.Ztree) return undefined;
    return state.Ztree.illustration;
  },
  Zrelations:(state) => {
    if (!state.Ztree) return undefined;
    return state.Ztree.relationSet;
  },
}

// actions
const actions = {

  newIllustration({commit}, options){
    let optionsDefault = options;
    if (!options) {
      optionsDefault = {
        element: '.zdog-canvas',
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 100,
        dragRotate:true
        }
    }

    let illuObj = Zdogger('illustration')(optionsDefault);
    commit('setZtree', illuObj)

  },

  replaceIllustration({commit}, illustration){
    commit('setZtree', illustration);
  },

  newZdogObject({commit, state}, {type, options, assignedName}){
    if(options.addTo){
      options.addTo = state.Ztree.find(options.addTo);
    } else {
      options.addTo = state.Ztree.illustration
    }
    let newO = Zdogger(type)(options);
    if (assignedName) {newO.assignedName = assignedName}
    commit('addZtreeNode', newO);
  },

  changeSelectedName({commit}, newName){
    commit('setAssignedName', newName);
  },

  changeSelected({commit, state}, {id, element}){
    //click handler here?
    if (state.selected.id == id) return;
    commit('setSelected', {id, element});
  },

  exportTree({state}){
    //save current ztree TODO
    state.Ztree.download();
  },

  async importTree({commit}){
    //save current ztree TODO
    let newTree = await new Zdogger.Reader().load();
    commit('setZtree', newTree);
  },
}

// mutations
const mutations = {

  setZtree(state, arg){
    if (isClass(arg, 8)) {
      state.Ztree = new Zdogger.Tree(arg)
    } else if (arg instanceof Zdogger.Tree) {
      state.Ztree = arg
    } else {
      state.Ztree = null;
      return;
    }
    state.updateTree = !state.updateTree;

    // let animate = () => {
    //   state.Ztree.illustration.updateRenderGraph()
    //   requestAnimationFrame(animate);
    // }

    // animate()

  },

  addZtreeNode(state, node){
    if (!state.Ztree) throw new Error('Cannot add node to nonexistent tree');
    state.Ztree.addNode(node);
    state.updateTree = !state.updateTree;
  },

  setAssignedName(state, newName){
    if (!state.selected) throw new Error('Cannot assign name to null selected node');
    state.Ztree.find(state.selected.id)
      .assignedName = newName;
      state.updateTree = !state.updateTree;
  },

  setSelected(state, {id, element}){
    state.selected.id = id;
    state.selected.element = element;
  },

  nodeChangeParent(state, {id, newParentId}){
    state.Ztree.changeParent(id, newParentId);
    state.updateTree = !state.updateTree;
  },
}

export default createStore({
  modules: {
    treeview
  },
  state,
  getters,
  mutations,
  actions,
  //strict: debug,
  plugins: debug ? [createLogger()] : []
})