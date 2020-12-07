import {
  axesHelper,
  // rotationHelper,
  // perspectiveHelper,
  // gridHelper,gridRectHelper,
  Camera
  
  // clearColor,drawRaw,zoomable
} from '../../canvasHelpers'

const state = {
  settings:{
    backgroundColor: "#808080"
  },
  selectedAxes:null,
  canvasAxes:null,
  camera:null
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

  showCanvasAxes({commit, rootGetters}){
    let illo = rootGetters.Ztree.illustration;

    let c = new Camera(illo);

    commit('setCanvasAxes', {axes: axesHelper({addTo: illo, size:999, stroke:1, head:null}), camera: c});
    illo.updateRenderGraph()
  },

  showSelectedAxes({commit, rootState}){
    if (state.selectedAxes) {
      state.selectedAxes.remove();
    }

    let n = rootState.selected.node;
    if (rootState.selected.id == rootState.illustration) return;

    let si = (n.stroke && n.stroke > 5)? n.stroke * 2 : 10; // minimum size length 10
    let he = (si < 10)? 2 : si / 10; // minimum head 2
    let a = axesHelper({
      size: si,
      head: he
    })
    n.addChild(a);
    commit('setSelectedAxes', a)
  },

  clearSelectedAxes({commit, state}){
    if (state.selectedAxes) {
      state.selectedAxes.remove();
    }
    commit('setSelectedAxes', null)
  },

  clearCanvasAxes({commit, state}){
    state.canvasAxes.remove();
    commit('setCanvasAxes', null)
  }
}

// Mutations  
const mutations = {
  setSetting(state, {name, value}){
    state.setting[name] = value;
  },

  setSelectedAxes(state, payload){
    state.selectedAxes = payload;
  },

  setCanvasAxes(state, {axes, camera}){
    if (!axes) {
      state.canvasAxes = null
      return
    }
    state.camera = camera;
    state.canvasAxes = axes;
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}