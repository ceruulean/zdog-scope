/* Module1.store.js */
// State object
const state = {
  // variable1: value,
  // variable2: value,
  // variable3: value
}
// Getter functions
const getters = {
  getVariable1( state ) {
     return state.varaible1;
  },
  getVariable2( state ) {
     return state.varaible2;
  },
}
// Actions 
const actions = {
  // fetchVariable1({ commit }) {
  //     return new Promise( (resolve, reject) => {
  //            // Make network request and fetch data
  //            // and commit the data

  //            commit('SET_VARIABLE_1', data); 
  //            resolve();
  //     })
  // },
  
}

// Mutations  
const mutations = {
  SET_VARIABLE_1(state, data) {
     state.varaible1 = data;
  },
  SET_VARIABLE_2(state, data) {
     state.variable2 = data;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}