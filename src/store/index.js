import { createStore, createLogger } from 'vuex'

//import MODULES from './modules/MODUELS' if ever gets more modules NEED TO AUTOMATE THIS
import treeview from './modules/treeview'
import properties from './modules/properties'
import canvas from './modules/canvas'

const debug = process.env.NODE_ENV !== 'production'

import {Zdogger} from '../zdogrigger'


var Ztree = null;

function newZtree(arg){
  if (arg instanceof Zdogger.Tree) {
    Ztree = arg
  } else if (arg.options) {
    Ztree = new Zdogger.Tree(arg.options)
    if (arg.assignedName) {
      Ztree.illustration.assignedName = arg.assignedName;
    }
  } else {
    Ztree = new Zdogger.Tree({});
  }
}
/**
 *  GLOBALS
 */
const state = () => ({
  selected:{
    id:null,
    element:null,
    node:null
  },
  illustration:null,
  treeLoaded:false,
  selectedNode:null
})

// getters
const getters = {
  Zrelations(){
    if (!Ztree) return null;
    return Ztree.relationSet;
  },
  selectedNode(state){
    if (!state.selected.id) return null;
    return state.selected.node
  },
  Ztree(){
    return Ztree;
  },
}

// actions
const actions = {

  newIllustration({commit, dispatch}, payload){
    if (!payload) { payload = {}}
    commit('setZtree', payload)
    dispatch('canvas/showCanvasAxes')
  },

  demoJSON({commit, dispatch}, payload){
    let reader = new Zdogger.Reader(payload);
    commit('setZtree', reader.Ztree)
    dispatch('canvas/showCanvasAxes')
  },

  newZdogObject({commit}, {type, options, assignedName}){
    if(options.addTo){
      options.addTo = Ztree.find(options.addTo);
    } else {
      options.addTo = Ztree.illustration
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

  exportTree(){
    //save current ztree TODO
    Ztree.download();
  },

  async importTree({commit, dispatch}){
    //save current ztree TODO
    let newTree = await new Zdogger.Reader().load();
    commit('setZtree', newTree);
    dispatch('canvas/showCanvasAxes')
  },
}

// mutations
const mutations = {

  setZtree(state, arg){
    if (!arg) state.illustration = null
    newZtree(arg)
    state.illustration = Ztree.illustration.id
    state.updateTree = !state.updateTree;
  },

  addZtreeNode(state, node){
    if (!Ztree) throw new Error('Cannot add node to nonexistent tree');
    Ztree.addNode(node);
    Ztree.illustration.renderGraph(node)
    state.updateTree = !state.updateTree;
  },
  
  setSelected(state, {id, element}){
    state.selected.id = id;
    state.selected.element = element;
    state.selected.node = (id? Ztree.find(id) : null);
  },

  setAssignedName(state, newName){
    if (!state.selected) throw new Error('Cannot assign name to null selected node');
    Ztree.find(state.selected.id)
      .assignedName = newName;
      state.updateTree = !state.updateTree;
  },

  setNodeProps(state, {node, options}){
    for (let o in options){
      node[o] = options[o]
    }
    node.updateGraph();
    state.updateTree = !state.updateTree;
  },

  setNodeParent(state, {id, newParentId}){
    let nodeUpdate = Ztree.changeParent(id, newParentId);
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