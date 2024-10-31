import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        hidden: true,
        cartItems: []
    },
    reducers: {
        toggleCartHidden: (state, action) => {
            state.hidden = !state.hidden;
        },
        addItem: (state, action) => {
            const incomingItem = action.payload;
            const itemExists = state.cartItems.find(item => item.id === incomingItem.id);

            if (itemExists) {
                itemExists.quantity += 1;
            } else {
                state.cartItems.push({...incomingItem, quantity: 1});
            }
        },
        clearItem: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (cartItem) => cartItem.id !== action.payload.id
            );
        },
        removeItem: (state, action) => {
            const itemToRemove = state.cartItems.find(
                (cartItem) => cartItem.id === action.payload.id
            );
        
            if (itemToRemove) {
                if (itemToRemove.quantity === 1) {
                    state.cartItems = state.cartItems.filter(
                        (cartItem) => cartItem.id !== action.payload.id
                    );
                } else {
                    itemToRemove.quantity -= 1;
                }
            }
        }
    }
});

const { actions, reducer } = cartSlice;

export const { toggleCartHidden, addItem, clearItem, removeItem } = actions;

export default reducer;