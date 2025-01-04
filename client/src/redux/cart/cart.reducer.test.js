import cartReducer from "./cart.reducer";

import {
  toggleCartHidden,
  addItem,
  clearItem,
  removeItem,
  updateCart,
  emptyCart,
} from "./cart.reducer";

describe('cart reducer', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      hidden: true,
      cartItems: {},
    };
  });

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({
      hidden: true,
      cartItems: {},
    });
  });

  describe('toggleCartHidden', () => {
    it('should toggle hidden state', () => {
      const newState = cartReducer(initialState, toggleCartHidden());
      expect(newState.hidden).toBe(false);
      
      const finalState = cartReducer(newState, toggleCartHidden());
      expect(finalState.hidden).toBe(true);
    });
  });

  describe('addItem', () => {
    it('should add new item to empty cart', () => {
      const mockItem = { id: 1, name: 'Test Item', price: 10 };
      const newState = cartReducer(initialState, addItem(mockItem));
      
      expect(newState.cartItems['item1']).toEqual({
        ...mockItem,
        quantity: 1,
      });
    });

    it('should increase quantity for existing item', () => {
      const mockItem = { id: 1, name: 'Test Item', price: 10 };
      let state = cartReducer(initialState, addItem(mockItem));
      state = cartReducer(state, addItem(mockItem));
      
      expect(state.cartItems['item1'].quantity).toBe(2);
    });
  });

  describe('clearItem', () => {
    it('should remove item from cart', () => {
      const mockItem = { id: 1, name: 'Test Item', price: 10 };
      let state = cartReducer(initialState, addItem(mockItem));
      state = cartReducer(state, clearItem(mockItem));
      
      expect(state.cartItems['item1']).toBeUndefined();
    });

    it('should handle clearing non-existent item', () => {
      const mockItem = { id: 1 };
      const newState = cartReducer(initialState, clearItem(mockItem));
      
      expect(newState).toEqual(initialState);
    });
  });

  describe('removeItem', () => {
    it('should decrease quantity of existing item', () => {
      const mockItem = { id: 1, name: 'Test Item', price: 10 };
      let state = cartReducer(initialState, addItem(mockItem));
      state = cartReducer(state, addItem(mockItem));
      state = cartReducer(state, removeItem(mockItem));
      
      expect(state.cartItems['item1'].quantity).toBe(1);
    });

    it('should remove item when quantity becomes 0', () => {
      const mockItem = { id: 1, name: 'Test Item', price: 10 };
      let state = cartReducer(initialState, addItem(mockItem));
      state = cartReducer(state, removeItem(mockItem));
      
      expect(state.cartItems['item1']).toBeUndefined();
    });

    it('should handle removing non-existent item', () => {
      const mockItem = { id: 1 };
      const newState = cartReducer(initialState, removeItem(mockItem));
      
      expect(newState).toEqual(initialState);
    });
  });

  describe('updateCart', () => {
    it('should merge Firebase cart with local cart', () => {
      const localItem = { id: 1, name: 'Local Item', price: 10, quantity: 1 };
      const firebaseCart = {
        item2: { id: 2, name: 'Firebase Item', price: 20, quantity: 1 }
      };
      
      let state = cartReducer(initialState, addItem(localItem));
      state = cartReducer(state, updateCart(firebaseCart));
      
      expect(state.cartItems).toEqual({
        item1: { id: 1, name: 'Local Item', price: 10, quantity: 1 },
        item2: { id: 2, name: 'Firebase Item', price: 20, quantity: 1 }
      });
    });

    it('should handle empty Firebase cart', () => {
      const localItem = { id: 1, name: 'Local Item', price: 10, quantity: 1 };
      let state = cartReducer(initialState, addItem(localItem));
      state = cartReducer(state, updateCart(null));
      
      expect(state.cartItems).toEqual({
        item1: { id: 1, name: 'Local Item', price: 10, quantity: 1 },
      });
    });
  });

  describe('emptyCart', () => {
    it('should clear all items from cart', () => {
      const mockItem = { id: 1, name: 'Test Item', price: 10 };
      let state = cartReducer(initialState, addItem(mockItem));
      state = cartReducer(state, emptyCart());
      
      expect(state.cartItems).toEqual({});
    });
  });
});