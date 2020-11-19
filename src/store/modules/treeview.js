//import {Zdogger} from '../zdogrigger'

// initial state
const state = () => ({
  treeView:null
})

function treeviewEssentials(node){
  let {id,assignedName,type,index,visible} = node;
  if (!id || !type) return null;
  return ({id,assignedName,type,index,visible})
}

// getters
const getters = {

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

  getChildrenView({commit, state}, node){
    let clds = node.children.map(child=>{
      return treeviewEssentials(child);
    })
    commit('renderChildren', node)
    return clds;
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
  renderChildren(state, node){
    state.treeView = [];
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

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}