import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    status: 'loading',
    setting: null,
    payment_setting: null,
    settingsFetchedTime: new Date(),
    paymentSettingsFetchTime: new Date(),
    isPopupSeen: false
};
export const settingReducer = createSlice({
    name: "setting",
    initialState,
    reducers: {
        setSetting: (state, action) => {
            state.status = "fulfill";
            state.setting = action.payload.data;
            state.settingsFetchedTime = new Date();
        },
        setPaymentSetting: (state, action) => {
            state.status = "fulfill";
            state.payment_setting = action.payload.data;
            state.paymentSettingsFetchTime = new Date();
        },
        setIsPopupSeen: (state, action) => {
            state.isPopupSeen = action.payload.data;
        }
    }
});
export const { setSetting, setPaymentSetting, setIsPopupSeen } = settingReducer.actions;
export default settingReducer.reducer;