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
  illustration(state, getters, rootState){
    if (!rootState.Ztree) return null;
    return rootState.Ztree.illustration;
  }
}
// Actions 
const actions = {

  changeSetting({commit}, payload){
    commit('setSetting', payload)
  },

  showCanvasAxes({commit, rootGetters}){
    let illo = rootGetters.illustration;
    commit('setCanvasAxes', rootGetters.illustration);
    axesHelper({addTo: illo, size:999, stroke:1, head:null})
    illo.updateGraph();
  },

  showSelectedAxes({commit, rootGetters}){
    if (state.selectedAxes) {
      state.selectedAxes.remove();
    }

    let n = rootGetters.selectedNode;
    if (n == rootGetters.illustration) return;

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

  setCanvasAxes(state, payload){
    if (!payload) {
      state.canvasAxes = null
      return
    }
    state.camera = new Camera(payload);
    state.canvasAxes = payload;
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}