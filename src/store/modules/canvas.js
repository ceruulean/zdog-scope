/* eslint-disable no-unused-vars */
import {ztree} from '../index'
import {UnitAxes} from '../../zdogger/scene'

var selectedAxes = new UnitAxes({t:100,scaleZoom: true, stroke:0.1}), canvasAxes
selectedAxes.showNeg(false)

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
    let illo = ztree.illustration;
   // let size = illo.canvasHeight / 2;
   // canvasAxes = axesHelper({addTo: illo, size:size, stroke:1, head:10})
    illo.updateRenderGraph()
  },

  showSelectedAxes({rootState, rootGetters}){
    let n = rootGetters.selectedNode;
    if (rootState.selected == rootState.illustration) return;

    let size = [n.stroke, n.length, n.depth, n.width, n.height, n.radius, n.diameter].filter(e=>e)
    let sfactor = n.scale.x * n.scale.y * n.scale.z;
    let longest = Math.max(...size)

    longest = Math.max(15, (longest * sfactor) * + 3);
    
    selectedAxes.axes.forEach(a=>{
      a.t = longest;
    })
    selectedAxes.addTo(n);
  },

  clearSelectedAxes(){
    selectedAxes.remove();
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
  },

  restoreDefaultSettings({commit}) {
    commit('setDefaultSettings')
  }
}

// Mutations  
const mutations = {
  setSetting(state, payload){
    for (let [name, value] of Object.entries(payload)) {
      state.settings[name] = value;
    }
  },

  setDefaultSettings(state){
    Object.assign(state.settings, getDefaultState().settings)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}