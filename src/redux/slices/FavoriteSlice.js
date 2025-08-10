import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: 'loading', //fulfill
    favorite: null,
    favouritelength: 0,
    favouriteProductIds: []
};

export const favoriteReducer = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setFavorites: (state, action) => {
            state.status = "fulfill"
            state.favorite = action.payload.data
        },
        setFavoriteLength: (state, action) => {
            state.status = "fulfill"
            state.favouritelength = action.payload.data
        },
        setFavoriteProductIds: (state, action) => {
            state.status = "fulfill"
            state.favouriteProductIds = action.payload.data
        }
    }
})

export const { setFavoriteLength, setFavoriteProductIds, setFavorites } = favoriteReducer.actions
export default favoriteReducer.reducer