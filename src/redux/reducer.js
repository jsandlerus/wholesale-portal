import { combineReducers } from 'redux'

const initialUser = {
  name: ''
}

const user = (state = initialUser, action) => {
  switch (action.type) {
    case 'GET_USER':
      return action.payload
    case 'ADD_FAVORITE_PRODUCT':
      return { ...state, favorites: action.payload }
    case 'DELETE_FAVORITE_PRODUCT':
      return { ...state, favorites: action.payload }
    default:
      return state
  }
}

const loaded = (state = false, action) => {
  switch (action.type) {
    case 'APP_LOADED':
      return true
    default:
      return state
  }
}

const cart = (state = [], action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload
    case 'ADD_TO_CART':
      return [...state, action.payload]
    case 'UPDATE_CART_ITEM':
      let updateItemIndex = state.findIndex(c => c.product === action.payload.id)
      state[updateItemIndex].quantity = action.payload.quantity
      return [...state]
    case 'DELETE_CART_ITEM':
      let deleteItemIndex = state.findIndex(c => c.product === action.payload.id)
      state.splice(deleteItemIndex, 1)
      return [...state]
    default:
      return state
  }
}

const initialCategories = {
  categories: [],
  category: 'All'
}

const categories = (state = initialCategories, action) => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        category: action.payload
      }
    default:
      return state
  }
}

const initialProducts = {
  products: [],
  searchTerm: '',
  category: 'All'
}

const products = (state = initialProducts, action) => {
  switch (action.type) {
    case 'ADD_ALL_PRODUCTS':
      return {
        ...state,
        products: action.payload
      }
    case 'UPDATE_SEARCH':
      return {
        ...state,
        searchTerm: action.payload
      }
    default:
      return state
  }
}

// const order = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_ORDER':
//       return action.payload
//     default:
//       return state
//   }
// }

const reviews = (state = [], action) => {
  switch (action.type) {
    case 'ADD_REVIEWS':
      console.log('Adding REVIEWS' + action.payload)
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  user,
  categories,
  cart,
  products,
  // order,
  reviews,
  loaded
})
