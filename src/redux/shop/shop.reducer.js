import { createSlice } from "@reduxjs/toolkit";

import SHOP_DATA from "../../pages/shop/shop.data";

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        collections: SHOP_DATA
    }
});

const { reducer } = shopSlice;

export default reducer;