/* eslint-disable no-unused-vars */
import { createStore, createLogger } from 'vuex'
import Zdogger from '../zdogger'

const debug = process.env.NODE_ENV !== 'production'

var ztree = new Zdogger.Tree();
var Reader = new Zdogger.Reader();
var CanvasScene = null;

function newZtree(arg){
  if (arg instanceof Zdogger.Tree) {
    ztree = arg
  } else if (arg.options) {
    ztree = new Zdogger.Tree(arg.options)
    if (arg.name) {
      ztree.illustration.name = arg.name;
    }
  } else {
    ztree = new Zdogger.Tree({});
  }
}

function initCanvasScene(state){
  if (CanvasScene || state == null) {
    CanvasScene.destroy();
    CanvasScene = null
  }
  CanvasScene = new Zdogger.Scene(ztree, state.canvas.settings.scene);
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
    if (CanvasScene) CanvasScene.keydown(e);
    
  },
  keyup:function(e){
    if (CanvasScene) CanvasScene.keyup(e);
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
  selected:null,
  illustration:null,
  treeLoaded:false,
  paused:false
})

const state = getDefaultState()

// getters
const getters = {
  selectedNode(state){
    if (!ztree) return
    return ztree.find(state.selected)
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
    CanvasScene.unanimate()
    ztree.illustration.children = newTree.illustration.children
    ztree.nodeMap = newTree.nodeMap
    ztree.relationMap = newTree.relationMap
    ztree.illustration.updateRenderGraph();

    CanvasScene.ghostCanvas.pruneGhost();
    CanvasScene.unitAxes.addTo(CanvasScene.illustration);
    CanvasScene.animate()

    commit('setZtree', true);
    //dispatch('canvas/showCanvasAxes')
    dispatch('treeview/changeList')
    dispatch('properties/changeDisplay')
  },

  newIllustration({dispatch, commit, state}, payload){
    if (!payload) { payload = {}}
    unregisterEvents()
    dispatch('createZtree', payload)
    commit('setIllustration', true)
    initCanvasScene(state)
    
    CanvasScene.on('selectshape', (e)=>{
      dispatch('changeSelected', e.detail.id)
    })
    CanvasScene.on('deselect', ()=>{
      dispatch('changeSelected', null)
    })
    registerEvents()
  },

  demoJSON({dispatch}, payload){
    let Reader = new Zdogger.Reader(payload);
    dispatch('changeSelected', null)
    dispatch('treeview/resetView')
    dispatch('newIllustration', Reader.tree)
  },

  changeSelected({commit, dispatch, state}, id){
    if (state.selected == id) return;
    //click handler here?
    commit('setSelected', id);
    if (!id) {
      dispatch('treeview/clearSelected')
      dispatch('properties/reset')
      return;
    }

    dispatch('properties/changeDisplay')
  },

  pause({commit}, bool){

    if (CanvasScene) {
      if (bool) {
        CanvasScene.unanimate()
      } else {
        CanvasScene.animate()
      }
    }

    commit('setPause', bool)
  },

  exportTree(){
    //save current ztree TODO
    new Zdogger.Reader(ztree).download();
  },

  async importTree({dispatch}){
    //save current ztree TODO
    let newTree = await new Zdogger.Reader().load();
    dispatch('changeSelected', null)
    dispatch('treeview/resetView')
    //commit('resetState');

    dispatch('newIllustration', newTree)
  },
}

// mutations
const mutations = {

  setZtree(state, arg){
    if (!arg) {
      state.treeLoaded = false;
      initCanvasScene(null)
      return}
    state.updateTree = !state.updateTree;
    state.treeLoaded = true;
  },

  setIllustration(state, arg){
    if (!arg) state.illustration = null;
    state.illustration = ztree.illustration.id
  },

  setPause(state, bool){
    state.paused = bool;
  },

  setSelected(state, id){
    state.selected = id;
  },

  resetState(state) {
    // Merge rather than replace so we don't lose observers
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, getDefaultState())
  }
}

//Export the ztree and import in other modules that will need to access its properties
export{ztree, CanvasScene}

import treeview from './modules/treeview'
import properties from './modules/properties'
import canvas from './modules/canvas'
import history, {undoRedoPlugin, undoRedoHistory} from './modules/history'
import { ifStatement } from '@babel/types';

let plugins = [undoRedoPlugin]

debug ? plugins.push(createLogger()) : null;

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
  plugins: plugins
})