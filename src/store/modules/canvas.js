import {Ztree} from '../index'

import {
  axesHelper,
  // rotationHelper,
  // perspectiveHelper,
  // gridHelper,gridRectHelper,
  Camera
  
  // clearColor,drawRaw,zoomable
} from '../../canvasHelpers'

/* eslint-disable no-unused-vars */

var selectedAxes, canvasAxes, camera

const state = {
  settings:{
    backgroundColor: "#808080"
  },
}
// Getter functions
const getters = {
  zoom(state){
    if (!state.camera) return
    return state.camera.zoom
  }
}
// Actions 
const actions = {

  changeSetting({commit}, payload){
    commit('setSetting', payload)
  },

  showCanvasAxes(){
    let illo = Ztree.illustration;
    camera = new Camera(illo);
    canvasAxes = axesHelper({addTo: illo, size:999, stroke:1, head:null})
    illo.updateRenderGraph()
  },

  showSelectedAxes({rootState}){
    if (state.selectedAxes) {
      selectedAxes.remove();
    }

    let n = rootState.selected.node;
    if (rootState.selected.id == rootState.illustration) return;

    let si = (n.stroke && n.stroke > 5)? n.stroke * 2 : 10; // minimum size length 10
    let he = (si < 10)? 2 : si / 10; // minimum head 2
    let a = axesHelper({
      size: si,
      head: he
    })
    n.addChild(a)
    selectedAxes = a
  },

  clearSelectedAxes(){
    if (selectedAxes) {
      selectedAxes.remove();
    }
    selectedAxes = null;
  },

  clearCanvasAxes(){
    canvasAxes.remove();
    canvasAxes = null;
  }
}

// Mutations  
const mutations = {
  setSetting(state, {name, value}){
    state.setting[name] = value;
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}