import { createStore, createLogger } from 'vuex'

//import MODULES from './modules/MODUELS' if ever gets more modules NEED TO AUTOMATE THIS
import treeview from './modules/treeview'
import properties from './modules/properties'
import canvas from './modules/canvas'

const debug = process.env.NODE_ENV !== 'production'

import {Zdogger} from '../zdogrigger'


/**
 *  GLOBALS
 */
const state = () => ({
  Ztree:null,
  selected:{
    id:null,
    element:null
  },
  updateTree:false,
  animate:null,
})

// getters
const getters = {
  illustration(state){
    if (!state.Ztree) return null;
    return state.Ztree.illustration;
  },
  Zrelations(state){
    if (!state.Ztree) return null;
    return state.Ztree.relationSet;
  },
  selectedNode(state){
    if (!state.Ztree) return null;
    return state.Ztree.find(state.selected.id)
  },
}

// actions
const actions = {

  newIllustration({commit}, payload){
    if (!payload) { payload = {}}
    commit('setZtree', payload)
  },

  demoJSON({commit}, payload){
    let reader = new Zdogger.Reader(payload);
    commit('setZtree', reader.Ztree)
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
    if (arg instanceof Zdogger.Tree) {
      state.Ztree = arg
    } else if (arg.options) {
      state.Ztree = new Zdogger.Tree(arg.options)
      if (arg.assignedName) {
        state.Ztree.illustration.assignedName = arg.assignedName;
      }
    } else {
      state.Ztree = new Zdogger.Tree({});
    }
    state.updateTree = !state.updateTree;

    state.animate = () => {
      state.Ztree.illustration.updateRenderGraph();
      requestAnimationFrame(state.animate);
    }

    state.animate();
  },

  addZtreeNode(state, node){
    if (!state.Ztree) throw new Error('Cannot add node to nonexistent tree');
    state.Ztree.addNode(node);
    state.Ztree.illustration.renderGraph(node)
    state.updateTree = !state.updateTree;
  },
  
  setSelected(state, {id, element}){
    state.selected.id = id;
    state.selected.element = element;
  },

  setAssignedName(state, newName){
    if (!state.selected) throw new Error('Cannot assign name to null selected node');
    state.Ztree.find(state.selected.id)
      .assignedName = newName;
      state.updateTree = !state.updateTree;
  },

  setNodeProps(state, {node, options}){
    for (let o in options){
      console.log(o)
      node[o] = options[o]
    }
    state.updateTree = !state.updateTree;
  },

  setNodeParent(state, {id, newParentId}){
    let nodeUpdate = state.Ztree.changeParent(id, newParentId);
    nodeUpdate.updateGraph();
    state.updateTree = !state.updateTree;
  },
}

export default createStore({
  modules: {
    treeview,
    properties,
    canvas,
  },
  state,
  getters,
  mutations,
  actions,
  //strict: debug,
  plugins: debug ? [createLogger()] : []
})