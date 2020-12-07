import { createStore, createLogger } from 'vuex'

//import MODULES from './modules/MODUELS' if ever gets more modules NEED TO AUTOMATE THIS
import treeview from './modules/treeview'
import properties from './modules/properties'
import canvas from './modules/canvas'

const debug = process.env.NODE_ENV !== 'production'

import {Zdogger} from '../zdogrigger'


var Ztree = new Zdogger.Tree();

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
const getDefaultState = () => ({
  selected:{
    id:null,
    element:null,
  },
  illustration:null,
  treeLoaded:false,
})

const state = getDefaultState()


// getters
const getters = {
  Zrelations(){
    if (!Ztree) return null;
    return Ztree.relationSet;
  },
  selectedNode(state){
    if (!state.selected.id) return null;
    return Ztree.find(state.selected.id)
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

  changeSelected({commit, state}, {id, element}){
    //click handler here?
    if (state.selected.id == id) return;
    let existing = state.selected.element;
    if (existing) existing.classList.remove('highlight')
    if (id) element.classList.add('highlight')
    commit('setSelected', {id, element});
  },

  exportTree(){
    //save current ztree TODO
    Ztree.download();
  },

  async importTree({commit, dispatch}){
    //save current ztree TODO
    let newTree = await new Zdogger.Reader().load();
    dispatch('changeSelected', {id:null, element: null})
    dispatch('treeview/resetView')
    commit('resetState');
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
    state.treeLoaded = true;
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
  },

  setNodeProps(state, {node, options}){
    for (let o in options){
      node[o] = options[o]
    }
    node.updateGraph();
    state.updateTree = !state.updateTree;
  },

  resetState(state) {
    // Merge rather than replace so we don't lose observers
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, getDefaultState())
  }
}

export{Ztree}

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