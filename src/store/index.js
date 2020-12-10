import { createStore, createLogger } from 'vuex'

//import MODULES from './modules/MODUELS' if ever gets more modules NEED TO AUTOMATE THIS
import treeview from './modules/treeview'
import properties from './modules/properties'
import canvas from './modules/canvas'
/* eslint-disable no-unused-vars */
import history, {undoRedoPlugin, undoRedoHistory} from './modules/history'

const debug = process.env.NODE_ENV !== 'production'

import {Zdogger} from '../zdogrigger'
import {Camera} from '../canvasHelpers'


var Ztree = new Zdogger.Tree();
var camera = null;

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

function initCamera(state){
  if (camera || state == null) {camera.destroy(); camera = null}
  camera = new Camera(Ztree.illustration, state.canvas.settings.camera);
  //Append zoom % label to dom element
  //document.querySelector('#zoom-control').appendChild(camera.label)
}


const handlers = {
  keydown: function(e){
    if (e.ctrlKey){
      if (e.keyCode == 90){ // ctrl+Z
        e.shiftKey? undoRedoHistory.redo():undoRedoHistory.undo();
      } else if (e.keyCode == 89){// ctrl+y
        undoRedoHistory.redo();
      }
    }
    if (camera) camera.keydown(e);
    
  },
  keyup:function(e){
    if (camera) camera.keyup(e);
  }
}

function registerEvents(){
  for (let h in handlers) {
    window.addEventListener(h,  handlers[h])
  }
}

function unregisterEvents(){
  for (let h in handlers) {
    window.removeEventListener(h,  handlers[h])
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
    if (!Ztree)return
    return Ztree.find(state.selected.id)
  }
}

// actions
const actions = {

  
  createZtree({commit, dispatch}, newTree){
    newZtree(newTree)
    commit('setZtree', newTree);
    dispatch('canvas/showCanvasAxes')
  },

  rebuildZtree({commit, dispatch}, newTree){
    //commit('resetState');
    //newZtree(newTree)
   // let newTree = new Zdogger.Reader(schemaTree).Ztree

    Ztree.illustration.children = newTree.illustration.children
    Ztree.nodeMap = newTree.nodeMap
    Ztree.relationMap = newTree.relationMap

    commit('setZtree', true);
    dispatch('canvas/showCanvasAxes')
    dispatch('treeview/changeList')
  },

  newIllustration({dispatch, commit, state}, payload){
    if (!payload) { payload = {}}
    unregisterEvents()
    dispatch('createZtree', payload)
    commit('setIllustration', true)
    initCamera(state)
    registerEvents()
  },

  demoJSON({dispatch}, payload){
    let reader = new Zdogger.Reader(payload);
    dispatch('newIllustration', reader.Ztree)
  },

  changeSelected({commit, dispatch, state}, {id, element}){
    //click handler here?
    if (state.selected.id == id) return;
    dispatch('properties/reset')
    let existing = state.selected.element;
    if (existing) existing.classList.remove('highlight')
    if (id) {
      element.classList.add('highlight')
    } else {
      dispatch('treeview/clearSelected')
    }
    commit('setSelected', {id, element});
    dispatch('properties/changeDisplay')
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

    dispatch('updateZtree', newTree)
  },
}

// mutations
const mutations = {

  setZtree(state, arg){
    if (!arg) {
      state.treeLoaded = false;
      initCamera(null)
      return}
    state.updateTree = !state.updateTree;
    state.treeLoaded = true;
  },

  setIllustration(state, arg){
    if (!arg) state.illustration = null;
    state.illustration = Ztree.illustration.id
  },


  setSelected(state, {id, element}){
    state.selected.id = id;
    state.selected.element = element;
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
    history,
  },
  state,
  getters,
  mutations,
  actions,
  //strict: debug,
  plugins: [
    undoRedoPlugin,
    debug ? createLogger() : null
  ]
})