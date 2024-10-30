import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        hidden: true
    },
    reducers: {
        toggleCartHidden: (state, action) => {
            state.hidden = !state.hidden
        }
    }
});

const { actions, reducer } = cartSlice;

export const { toggleCartHidden } = actions;

export default reducer;