
import {Zdogger} from '../../zdogrigger'
import {Ztree} from '../index'

//All history actions and mutations go here
//https://stackoverflow.com/questions/42878329/going-back-to-states-like-undo-redo-on-vue-js-vuex/44865208#44865208

/* eslint-disable no-unused-vars */
var initialTree
var undoRedoHistory

class UndoRedo {
  store
  history = [];
  currentIndex = -1;
  limit = -1;

  init(store){
    this.store = store;
  }

  firstState(){
    this.addState();
    initialTree = this.history[0];
  }

  addState() {
    let state = Ztree._clone();
    // may be we have to remove redo steps
    if (this.currentIndex + 1 < this.history.length) {
      this.history.splice(this.currentIndex + 1);
    }
    this.history.push(state);

    if (this.limit > 0 && this.history.length >= this.limit){
      this.history.shift();
    }
    this.currentIndex++;
  }

  undo() {
    //const prevState = this.history[this.currentIndex - 1];
    // take a copy of the history state
    // because it would be changed during store mutations
    // what would corrupt the undo-redo-history
    // (same on redo)
    this.currentIndex--;
    this.rebuild();
  }

  redo() {
    //const nextState = this.history[this.currentIndex + 1];
    this.currentIndex++;
    this.rebuild();
  }

  rebuild(){
    let state = this.history[this.currentIndex]
    Ztree.reviveTree(state)
  }

  reset(){
    initialTree = null
    this.history = null
    this.history = []
    this.currentIndex = -1;
    this.firstState()
  }
}

const undoRedoPlugin = (store) => {
  // initialize and save the starting stage
  undoRedoHistory = new UndoRedo(store)
  undoRedoHistory.init(store);

  store.subscribe((mutation, /*state*/) => {
    if (mutation.type == 'setZtree'){
      undoRedoHistory.reset()
      return;
    }
    let history = mutation.type.substring(0,7)
    if (history == 'history') {
      // is called AFTER every mutation
      undoRedoHistory.addState();
    }
  });
}

// const getDefaultState = () => ({
//   initialTree:null
// })

// const state = getDefaultState();
// // Getter functions
// const getters = {

// }
// Actions 
const actions = {

  newZdog({commit, dispatch}, {type, options, assignedName}){
    if(options.addTo){
      options.addTo = Ztree.find(options.addTo);
    } else {
      options.addTo = Ztree.illustration
    }
    let newO = Zdogger(type)(options);
    if (assignedName) {newO.assignedName = assignedName}
    commit('addNode', newO);
    dispatch('treeview/changeList');
  },

  deleteZdog({commit}, node){
    commit('removeNode', node)
  },

  updateProps({commit}, payload){
    commit('setNodeProps', payload)
  },

  updateParents({commit}, payload){
    commit('changeParent', payload)
  },

  updateSelectedName({ commit, rootState, rootGetters }, newName){
    if (!rootState.selected.id) throw new Error('Cannot assign name to null selected node');
    commit('setNodeProps', {
        node: rootGetters.selectedNode,
        options: {
          assignedName: newName
        }
      })
    },
}

// Mutations  
const mutations = {

  addNode(state, node){
    if (!Ztree) throw new Error('Cannot add node to nonexistent tree');
    Ztree.addNode(node);
    Ztree.illustration.renderGraph(node)
  },

  setNodeProps(state, {node, options}){
    for (let o in options){
      node[o] = options[o]
    }
    node.updateGraph();
  },

  removeNode(state, node){
    Ztree.removeNode(node)
  },

  changeParent(state, {id, newParentId}){
    let nodeUpdate = Ztree.changeParent(id, newParentId);
    nodeUpdate.updateGraph();
  }
}

export {undoRedoPlugin, undoRedoHistory}

export default {
  namespaced: true,
  // state,
  // getters,
  actions,
  mutations
}