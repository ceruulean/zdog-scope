import { createStore, createLogger } from 'vuex'

//import MODULES from './modules/MODUELS' if ever gets more modules NEED TO AUTOMATE THIS

const debug = process.env.NODE_ENV !== 'production'

import {Zdogger, ZDOG_CLASS_TYPE} from '../zdogrigger'

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
  }
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

  newZdogObject({commit, state}, {type, options}){
    if(options.addTo){
      options.addTo = state.Ztree.find(options.addTo);
    } else {
      options.addTo = state.Ztree.illustration
    }
    console.log(options);
    let newO = Zdogger(type)(options);
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
  }
}

// mutations
const mutations = {

  setZtree(state, arg){
    state.Ztree = null;
    if (arg instanceof ZDOG_CLASS_TYPE[8]) {
      state.Ztree = new Zdogger.Tree(arg)
    } else if (arg instanceof Zdogger.Tree) {
      console.log(arg);
      state.Ztree = arg
    }
    state.updateTree = !state.updateTree;

    let animate = () => {
      state.Ztree.illustration.updateRenderGraph()
      requestAnimationFrame(animate);
    }

    animate()
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
  },

  setSelected(state, {id, element}){
    state.selected.id = id;
    state.selected.element = element;
  },
}

export default createStore({
  // modules: {
  //   global
  // },
  state,
  getters,
  mutations,
  actions,
  //strict: debug,
  plugins: debug ? [createLogger()] : []
})