import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedEditAddress: [],
    allAddresses: [],
    selectedAddress: []
}

export const addressReducer = createSlice({
    name: "address",
    initialState,
    reducers: {
        setSelectedAddresForEdit: (state, action) => {
            state.selectedEditAddress = action.payload.data
        },
        setAllAddresses: (state, action) => {
            state.allAddresses = action.payload.data
        },
        setSelectedAddress: (state, action) => {

            state.selectedAddress = action.payload.data
        }
    }
})

export const { setAllAddresses, setSelectedAddresForEdit, setSelectedAddress } = addressReducer.actions

export default addressReducer.reducer