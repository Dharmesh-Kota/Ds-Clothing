import { createSlice } from "@reduxjs/toolkit";

import SHOP_DATA from "../../pages/shop/shop.data";

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        collections: SHOP_DATA
    },
    reducers: {
        updateCollections : (state, action) => {
            state.collections = action.payload;
        }
    }
});

const { reducer, actions } = shopSlice;

export const { updateCollections } = actions;

export default reducer;