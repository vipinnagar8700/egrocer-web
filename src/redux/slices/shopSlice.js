import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "loading",
    shop: null,
};

export const shopReducer = createSlice({
    name: "shop",
    initialState,
    reducers: {
        setShop: (state, action) => {
            state.status = "fulfill";
            state.shop = action.payload.data;
        }
    }

});
export const { setShop } = shopReducer.actions;
export default shopReducer.reducer;