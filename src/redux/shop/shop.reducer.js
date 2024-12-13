import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";

import { firestore, convertCollectionsSnapshotToMap } from "../../firebase/firebase.utils";

// Async thunk for fetching collections
export const fetchCollections = createAsyncThunk(
    'shop/fetchCollections',
    async (_, thunkAPI) => {
        try {
            const collectionRef = collection(firestore, 'collections');
            const snapshot = await getDocs(collectionRef);
            const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
            return collectionsMap;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || "Failed to fetch collections");
        }
    }
);

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        collections: null,
        isFetching: false,
        errorMessage: null
    },
    reducers: {
        updateCollections : (state, action) => {
            state.collections = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollections.pending, (state) => {
                state.isFetching = true;
                state.errorMessage = null;
            })
            .addCase(fetchCollections.fulfilled, (state, action) => {
                state.isFetching = false;
                state.collections = action.payload;
            })
            .addCase(fetchCollections.rejected, (state, action) => {
                state.isFetching = false;
                state.error = action.payload || "Something went wrong";
            });
    }
});

const { reducer, actions } = shopSlice;

export const { updateCollections } = actions;

export default reducer;