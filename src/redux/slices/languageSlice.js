import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedLanguage: null,
    availableLanguages: null
}

export const languageReducer = createSlice({
    name: "language",
    initialState,
    reducers: {
        setSelectedLanguage: (state, action) => {
            state.selectedLanguage = action.payload.data
        },
        setAvailableLanguages: (state, action) => {
            state.availableLanguages = action.payload.data
        }
    }
})

export const { setAvailableLanguages, setSelectedLanguage } = languageReducer.actions
export default languageReducer.reducer