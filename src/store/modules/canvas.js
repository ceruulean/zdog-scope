const state = {
  settings:{
    backgroundColor: "#808080"
  }
}
// Getter functions
const getters = {
  getVariable1( state ) {
     return state.varaible1;
  },
  view:(state, getters, rootState) => {
    if (!rootState.Ztree) return null;
    return rootState.Ztree.trimmedView();
  }
}
// Actions 
const actions = {

  changeSetting({commit}, payload){
    commit('setSetting', payload)
  },
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