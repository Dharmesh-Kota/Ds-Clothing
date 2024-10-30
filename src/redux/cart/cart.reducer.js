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
        }
    }
});

const { actions, reducer } = cartSlice;

export const { toggleCartHidden, addItem } = actions;

export default reducer;