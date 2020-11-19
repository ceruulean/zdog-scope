import { createStore, createLogger } from 'vuex'

//import MODULES from './modules/MODUELS' NEED TO AUTOMATE THIS
//import productsModule from "./modules/products/index";

const debug = process.env.NODE_ENV !== 'production'

import {Zdogger} from '../zdogrigger'

/**
 *  GLOBALS
 */
// initial state
// shape: [{ id, quantity }]
const state = () => ({
  Ztree:undefined,
  selected:{
    id:undefined,
    element:undefined
  },
  updateTree:false,
})

// getters
const getters = {
  illustration:(state) => {
    if (!state.Ztree) return undefined;
    return state.Ztree.illustration;
  },
  Zrelations:(state) => {
    if (!state.Ztree) return undefined;
    return state.Ztree.relationSet;
  }
    // treeOrphans:(state) => {
    //   return state.Ztree.orphans
    // },

  // cartProducts: (state, getters, rootState) => {
  //   return state.items.map(({ id, quantity }) => {
  //     const product = rootState.products.all.find(product => product.id === id)
  //     return {
  //       title: product.title,
  //       price: product.price,
  //       quantity
  //     }
  //   })
  // },

  // cartTotalPrice: (state, getters) => {
  //   return getters.cartProducts.reduce((total, product) => {
  //     return total + product.price * product.quantity
  //   }, 0)
  // }
}

// actions
const actions = {

  newIllustration({commit}, options){
    let optionsDefault = options;
    if (!options) {
      optionsDefault = {
        element: '.zdog-canvas',
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 100,
        dragRotate:true
        }
    }

    let illuObj = Zdogger('illustration')(optionsDefault);
    commit('setZtree', illuObj)


    let animate = () => {
      illuObj.updateRenderGraph()
      requestAnimationFrame(animate);
    }

    animate()
  },

  newZdogObject({commit, state}, {type, options}){
    if(options.addTo){
      options.addTo = state.Ztree.find(options.addTo);
    } else {
      options.addTo = state.Ztree.illustration
    }
    console.log(options);
    let newO = Zdogger(type)(options);
    commit('addZtreeNode', newO);
  },

  changeSelectedName({commit}, newName){
    commit('setAssignedName', newName);
  },

  changeSelected({commit}, {id, element}){
    //click handler here?
    commit('setSelected', {id, element});
  }
  // checkout ({ commit, state }, products) {
  //   const savedCartItems = [...state.items]
  //   commit('setCheckoutStatus', null)
  //   commit('setCartItems', { items: [] })
  // },

  // addProductToCart ({ state, commit }, product) {
  //   commit('setCheckoutStatus', null)
  //   if (product.inventory > 0) {
  //     const cartItem = state.items.find(item => item.id === product.id)
  //     if (!cartItem) {
  //       commit('pushProductToCart', { id: product.id })
  //     } else {
  //       commit('incrementItemQuantity', cartItem)
  //     }
  //     // remove 1 item from stock
  //     commit('products/decrementProductInventory', { id: product.id }, { root: true })
  //   }
  // }
}

// mutations
const mutations = {

  setZtree(state, illustration){
    state.Ztree = null;
    state.Ztree = new Zdogger.tree(illustration)
  },

  addZtreeNode(state, node){
    if (!state.Ztree) throw new Error('Cannot add node to nonexistent tree');
    state.Ztree.addNode(node);
    state.updateTree = !state.updateTree;
  },

  setAssignedName(state, newName){
    if (!state.selected) throw new Error('Cannot assign name to null selected node');
    state.Ztree.find(state.selected.id)
      .assignedName = newName;
    state.updateTree = !state.updateTree;
  },

  setSelected(state, {id, element}){
    state.selected.id = id;
    state.selected.element = element;
  },
  // pushProductToCart (state, { id }) {
  //   state.items.push({
  //     id,
  //     quantity: 1
  //   })
  // },

  // incrementItemQuantity (state, { id }) {
  //   const cartItem = state.items.find(item => item.id === id)
  //   cartItem.quantity++
  // },

  // setCartItems (state, { items }) {
  //   state.items = items
  // },

  // setCheckoutStatus (state, status) {
  //   state.checkoutStatus = status
  // }
}

export default createStore({
  // modules: {
  //   global
  // },
  state,
  getters,
  mutations,
  actions,
  //strict: debug,
  plugins: debug ? [createLogger()] : []
})