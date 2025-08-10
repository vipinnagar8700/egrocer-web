import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    status: 'loading',
    theme: "light"
}

export const themeSlice = createSlice({
    name: "Theme",
    initialState,
    reducers: {
        setLocalTheme: (state, action) => {
            state.status = "fulfill";
            state.theme = action.payload.data
        }
    }
})

export const { setLocalTheme } = themeSlice.actions
export default themeSlice.reducer;