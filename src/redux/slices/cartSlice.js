// import { ActionTypes } from "../action-type";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    status: 'loading', //fulfill
    cart: null,
    checkout: null,
    promo_code: null,
    is_wallet_checked: 0,
    same_seller_flag: 0,
    cartProducts: [],
    cartSubTotal: 0,
    guestCart: [],
    isGuest: true,
    guestCartTotal: 0
};

export const cartReducer = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.status = "fulfill";
            state.cart = action.payload.data;
        },
        setCartCheckout: (state, action) => {
            state.status = "fulfill";
            state.checkout = action.payload.data;
        },
        setCartPromo: (state, action) => {
            state.status = "fulfill";
            state.promo_code = action.payload.data;
        },
        clearCartPromo: (state) => {
            // state.cart.promo_code = [];
            state.promo_code = null;
        },
        setWallet: (state, action) => {
            state.status = "fulfill";
            state.is_wallet_checked = action.payload.data;
        },
        setSellerFlag: (state, action) => {
            state.status = "fulfill";
            state.same_seller_flag = action.payload.data;
        },
        setCartProducts: (state, action) => {
            state.cartProducts = action.payload.data;
        },
        setCartSubTotal: (state, action) => {
            state.cartSubTotal = action.payload.data;
        },
        setIsGuest: (state, action) => {
            state.isGuest = action.payload.data;
        },
        addtoGuestCart: (state, action) => {
            state.guestCart = action.payload.data;
        },
        setGuestCartTotal: (state, action) => {
            state.guestCartTotal = action.payload.data
        },
        addGuestCartTotal: (state, action) => {
            state.guestCartTotal += action.payload.data
        },
        subGuestCartTotal: (state, action) => {
            state.guestCartTotal -= action.payload.data
        },

    }
});

export const {
    setCart,
    setCartCheckout,
    setCartPromo,
    clearCartPromo,
    setWallet,
    setSellerFlag,
    setCartProducts,
    setCartSubTotal,
    setIsGuest,
    addtoGuestCart,
    setTotalCartValue,
    setGuestCartTotal,
    addGuestCartTotal,
    subGuestCartTotal
} = cartReducer.actions;
export default cartReducer.reducer;