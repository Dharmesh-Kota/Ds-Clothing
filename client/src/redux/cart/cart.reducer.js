import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    hidden: true,
    cartItems: [],
  },
  reducers: {
    toggleCartHidden: (state, action) => {
      state.hidden = !state.hidden;
    },
    addItem: (state, action) => {
      const incomingItem = action.payload;
      const existingItem = state.cartItems[`${"item" + incomingItem.id}`];
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems[`${"item" + incomingItem.id}`] = { ...incomingItem, quantity: 1 };
      }
    },
    clearItem: (state, action) => {
      const itemId = "item" + action.payload.id;
      if (state.cartItems[itemId]) {
        delete state.cartItems[itemId];
      }
    },
    removeItem: (state, action) => {
      const itemId = "item" + action.payload.id;
      const existingItem = state.cartItems[itemId];
  
      if (existingItem) {
        if (existingItem.quantity === 1) {
          delete state.cartItems[itemId];
        } else {
          existingItem.quantity -= 1;
        }
      }
    },
    updateCart: (state, action) => {
      const firebaseCart = action.payload || {};
      const mergedCart = { ...state.cartItems };
  
      Object.keys(firebaseCart).forEach((id) => {
        if (!mergedCart[id]) {
          mergedCart[id] = { ...firebaseCart[id] };
        }
      });
  
      state.cartItems = mergedCart;
    },
    emptyCart: (state, action) => {
      state.cartItems = {};
    },
  }  
});

const { actions, reducer } = cartSlice;

export const {
  toggleCartHidden,
  addItem,
  clearItem,
  removeItem,
  updateCart,
  emptyCart,
} = actions;

export default reducer;