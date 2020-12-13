/* eslint-disable no-unused-vars */
import {Ztree} from '../index'


import {
  axesHelper,
  //makeAxis,
} from '../../canvasHelpers'

var selectedAxes, canvasAxes

const getDefaultState = () => ({
  settings:{
    backgroundColor: "#808080",
    scene:{
      panInverse:false,
      zoomSpeed:3,
      panSpeed:30,
      ghostQuery:'#ghost'
    }
  },
})

const state = getDefaultState()

// Getter functions
const getters = {
}
// Actions 
const actions = {

  changeSetting({commit}, payload){
    commit('setSetting', payload)
  },

  async showCanvasAxes({dispatch, state}){
    await dispatch('clearCanvasAxes')
    let illo = Ztree.illustration;
    let size = illo.canvasHeight / 2;
   // canvasAxes = axesHelper({addTo: illo, size:size, stroke:1, head:10})
    illo.updateRenderGraph()
  },

  showSelectedAxes({rootState, rootGetters}){
    if (selectedAxes) {
      selectedAxes.remove();
    }

    let n = rootGetters.selectedNode;
    if (rootState.selected.id == rootState.illustration) return;

    let si
    if (n.stroke){
      si = (n.stroke && n.stroke > 5)? n.stroke * 2 : 10; // minimum size length 10
    } else {
      si = 10
    }
    let he = (si < 11)? 2 : si / 10; // minimum head 2
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
      // document.querySelector('#zoom-control').removeChild(scene.label)
      // scene.destroy();
    }
    canvasAxes = null;
  },

  reset({commit,dispatch}){
    dispatch('clearSelectedAxes')
    dispatch('clearCanvasAxes')
    commit('resetState')
  }
}

// Mutations  
const mutations = {
  setSetting(state, {name, value}){
    state.setting[name] = value;
  },

  resetState(){
    Object.assign(state, getDefaultState())
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}