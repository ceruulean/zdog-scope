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
    backgroundColor: "#808080",
    camera:{
      panInverse:false,
      zoomSpeed:3,
      panSpeed:30
    }
  },
}
// Getter functions
const getters = {
  label(){
    if (!camera) return null
    return camera.label
  }
}
// Actions 
const actions = {

  changeSetting({commit}, payload){
    commit('setSetting', payload)
  },

  async showCanvasAxes({dispatch, state}){
    await dispatch('clearCanvasAxes')
    let illo = Ztree.illustration;
    camera = new Camera(illo, state.settings.camera);

    //Append zoom % label to dom element
    document.querySelector('#zoom-control').appendChild(camera.label)
    canvasAxes = axesHelper({addTo: illo, size:999, stroke:1, head:null})
    illo.updateRenderGraph()
  },

  showSelectedAxes({rootState, rootGetters}){
    if (selectedAxes) {
      selectedAxes.remove();
    }

    let n = rootGetters.selectedNode;
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
    if (canvasAxes){
      canvasAxes.remove();
      document.querySelector('#zoom-control').removeChild(camera.label)
      camera.destroy();
    }
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