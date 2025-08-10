import { combineReducers } from 'redux';
import ShopReducer from "@/redux/slices/shopSlice"
import SettingReducer from "@/redux/slices/settingSlice"
import UserReducer from "@/redux/slices/userSlice"
import ProductFilterReducer from "@/redux/slices/productFilterSlice"
import CityReducer from "@/redux/slices/citySlice"
import ThemeReducer from "@/redux/slices/themeSlice"
import CartReducer from "@/redux/slices/cartSlice"
import AddressReducer from "@/redux/slices/addressSlice"
import FavoriteReducer from "@/redux/slices/FavoriteSlice"
import CheckoutReducer from "@/redux/slices/checkoutSlice"
import LanguageReducer from "@/redux/slices/languageSlice"

export const rootReducer = combineReducers({
    Cart: CartReducer,
    City: CityReducer,
    Shop: ShopReducer,
    Setting: SettingReducer,
    User: UserReducer,
    ProductFilter: ProductFilterReducer,
    Theme: ThemeReducer,
    Addresses: AddressReducer,
    Favorite: FavoriteReducer,
    Checkout: CheckoutReducer,
    Language: LanguageReducer
})

