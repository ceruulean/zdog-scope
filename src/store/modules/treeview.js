/* Module1.store.js */
// State object
const state = {
  list: [],
}
// Getter functions
const getters = {
  getVariable1( state ) {
     return state.varaible1;
  },
  view:(state, getters, rootState) => {
    if (!rootState.Ztree) return undefined;
    return rootState.Ztree.trimmedView();
  }
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
  setList({commit}, payload){
    commit('changeList', payload)
  },

  sortItem({commit}, payload){
    commit('nodeChangeParent', payload, {root:true})
  },
  
}

// let findById = (arr, Id) => {
//   for (let node of arr) {
//     if (node.id == Id){
//       return node;
//     }
//   }
//   return null
// }

// function deepSearch(list, newParentId, childId){
//   let resultNode = findParent(list, newParentId);
//   if (!resultNode && list.children && list.children.length > 0) { //search each node's children
//     for (let node of list) {
//       resultNode = deepSearch(node.children, newParentId)
//       if (resultNode) {break}
//     }
//   }
//   return resultNode;
// }


// Mutations  
const mutations = {
  // updateSort(state, {id, newParentId}) {
    
  //   // let searchList = state.list;
  //   // for (let i = 0; i < parentDepth; i++){
  //   //   searchList = searchList.children
  //   // }


  //   // let parentNode = findById(searchList, newParentId)
  //   // //need to splice child out
  //   // searchList = state.list;
  //   // console.log(searchList);
  //   // for (let c = 0; c < childDepth; c++){

  //   //   console.log(searchList);
  //   // }
  //   // let childAt = searchList.findIndex((node)=>{
  //   //   node.id == id
  //   // })
  //   // let childNode = searchList.splice(childAt, 1);
  //   //  //state.list = payload;
  //   //  parentNode.children.push(childNode);
  // },
  changeList(state, payload){
    state.list = payload;
  }
  // SET_VARIABLE_2(state, data) {
  //    state.variable2 = data;
  // },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}