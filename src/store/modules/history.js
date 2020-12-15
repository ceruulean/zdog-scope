
import Zdogger from '../../zdogger'
import {ztree, CanvasScene} from '../index'

//All history actions and mutations go here
//https://stackoverflow.com/questions/42878329/going-back-to-states-like-undo-redo-on-vue-js-vuex/44865208#44865208

/* eslint-disable no-unused-vars */
var undoRedoHistory

function deepCopy(obj){
  return JSON.parse(JSON.stringify(obj));
}

//https://stackoverflow.com/questions/14962018/detecting-and-fixing-circular-references-in-javascript
function isCyclic(obj) {
  var seenObjects = [];

  function detect (obj) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true;
      }
      seenObjects.push(obj);
      for (var key in obj) {
        /* eslint-disable no-prototype-builtins */
        if (obj.hasOwnProperty(key) && detect(obj[key])) { 
          console.log(obj, 'cycle at ' + key);
          return true;
        }
      }
    }
    return false;
  }

  return detect(obj);
}

class UndoRedo {
  store
  history = [];
  currentIndex = -1;
  limit = -1;

  init(store){
    this.store = store;
  }

  addState(mstate) {
    let tree = ztree.toJSON();
    let latestIndex = this.history.length - 1;
    for (let i = this.currentIndex; i < latestIndex; i++) {
      this.history.pop();
    }
    try{
      this.history.push(tree);
    } catch (e) {
      console.log(e)
      console.log(isCyclic(tree))
    }

    // if (this.limit > 0 && this.history.length >= this.limit){
    //   this.history.shift();
    // }
    this.currentIndex = this.history.length - 1
  }

  undo() {
    if (this.currentIndex <= 0) return;
    this.currentIndex--;
    this.rebuild();
  }

  redo() {
    if (this.currentIndex >= this.history.length - 1) return;
    //const nextState = this.history[this.currentIndex + 1];
    this.currentIndex++;
    this.rebuild();
  }

  rebuild(){
    let tree = this.history[this.currentIndex]
   // this.store.replaceState(state);
    this.store.dispatch('rebuildZtree', new Zdogger.Reader(tree).tree)
  }

  reset(){
    this.history = null
    this.history = []
    this.currentIndex = -1;
  }
}

const undoRedoPlugin = (store) => {
  // initialize and save the starting stage
  undoRedoHistory = new UndoRedo(store)
  undoRedoHistory.init(store);

  store.subscribe((mutation, mstate) => {
    if (mutation.type == 'setIllustration'){
      undoRedoHistory.reset()
      undoRedoHistory.addState(mstate)
      return;
    }
    let history = mutation.type.substring(0,7)
    if (history == 'history') {
      // is called AFTER every mutation
      undoRedoHistory.addState(mstate);
    }
  });
}

// Actions 
const actions = {

  newZdog({commit, dispatch}, {type, options, name}){
    if(options.addTo){
      options.addTo = ztree.find(options.addTo);
    } else {
      options.addTo = ztree.illustration
    }
    let newO = Zdogger(type)(options);
    if (name) {newO.name = name}
    commit('addNode', newO);
    dispatch('treeview/changeList', null, {root:true});
  },

  deleteZdog({commit, dispatch}, id){
    commit('removeNode', id)
    dispatch('changeSelected', null, {root:true})
  },

  updateProps({commit, dispatch}, payload){
    commit('setNodeProps', payload)
    dispatch('properties/changeDisplay', null, {root:true})
  },

  updateParent({commit}, payload){
    commit('changeParent', payload)
  },

  updateSelectedName({ commit, rootState, rootGetters, dispatch}, newName){
    if (!rootState.selected) throw new Error('Cannot assign name to null selected node');
    commit('setNodeProps', {
        node: rootGetters.selectedNode,
        options: {
          name: newName
        }
      })

    dispatch('treeview/changeList', null, {root:true})
    },
}

function render(node){
  node.updateGraph();
  ztree.illustration.renderGraph(node)
}

// Mutations  
const mutations = {

  addNode(state, node){
    if (!ztree) throw new Error('Cannot add node to nonexistent tree');
    CanvasScene.addNode(node)
  },

  setNodeProps(state, {node, options}){
    CanvasScene.updateNode({node, options})
  },

  removeNode(state, id){
    CanvasScene.removeNode(id)
  },

  changeParent(state, {id, newParentId}){
    CanvasScene.changeParent(id, newParentId)
  }
}

export {undoRedoPlugin, undoRedoHistory}

export default {
  namespaced: true,
  actions,
  mutations
}