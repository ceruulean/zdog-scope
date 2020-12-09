import { createStore, createLogger } from 'vuex'

//import MODULES from './modules/MODUELS' if ever gets more modules NEED TO AUTOMATE THIS
import treeview from './modules/treeview'
import properties from './modules/properties'
import canvas from './modules/canvas'
import history, {undoRedoPlugin} from './modules/history'

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
  if (camera) camera.destroy();
  camera = new Camera(Ztree.illustration, state.canvas.settings.camera);
  //Append zoom % label to dom element
  //document.querySelector('#zoom-control').appendChild(camera.label)
}


const handlers = {
  keydown: function(e){
    console.log(e.keyCode)
    if (camera) camera.keydown(e);
  },
  keyup:function(e){
    console.log(e.keyCode)
    if (camera) camera.keyup(e);
  }
}

function registerEvents(){
  for (let h in handlers) {
    console.log(h)
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
    if (!state.selected.id) return null;
    return Ztree.find(state.selected.id)
  },
}

// actions
const actions = {

  updateZtree({commit, dispatch, state}, newTree){
    newZtree(newTree)
    unregisterEvents()
    initCamera(state)
    registerEvents();
    commit('setZtree', newTree);
    dispatch('canvas/showCanvasAxes')
  },

  newIllustration({dispatch}, payload){
    if (!payload) { payload = {}}
    dispatch('updateZtree', payload)
  },

  demoJSON({dispatch}, payload){
    let reader = new Zdogger.Reader(payload);
    dispatch('updateZtree', reader.Ztree)
  },

  changeSelected({commit, dispatch, state}, {id, element}){
    //click handler here?
    if (state.selected.id == id) return;
    let existing = state.selected.element;
    if (existing) existing.classList.remove('highlight')
    if (id) {
      element.classList.add('highlight')
    } else {
      dispatch('treeview/clearSelected')
    }
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

    dispatch('updateZtree', newTree)
  },
}

// mutations
const mutations = {

  setZtree(state, arg){
    if (!arg) {
      state.treeLoaded = false;
      state.illustration = null
      return}
    state.illustration = Ztree.illustration.id
    state.updateTree = !state.updateTree;
    state.treeLoaded = true;
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