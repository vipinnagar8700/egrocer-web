import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    status: "loading",
    city: null,
};
export const locationReducer = createSlice({
    name: "city",
    initialState,
    reducers: {
        setCity: (state, action) => {
            state.status = "fulfill";
            state.city = action.payload.data;
        }
    }
});

export const { setCity } = locationReducer.actions;
export default locationReducer.reducer;