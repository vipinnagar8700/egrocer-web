import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import { useSelector, useDispatch } from 'react-redux';
import { t } from "@/utils/translation";
import Image from "next/image";
import Logo from "/public/logo.png";
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';
import { IoIosCloseCircle } from 'react-icons/io';
import { setAuthType, setCurrentUser } from '@/redux/slices/userSlice';
import { addtoGuestCart, setCart, setCartProducts, setCartSubTotal, setGuestCartTotal, setIsGuest } from '@/redux/slices/cartSlice';
import { setSetting } from '@/redux/slices/settingSlice';
import { setTokenThunk } from '@/redux/thunk/loginthunk';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';

const NewUserModal = ({ showNewUser, setShowNewUser, setUserName, setPhoneNumberWithoutCountryCode, setEmail, userName, email, phoneNumberWithoutCountryCode, countryCode, setIsOTP }) => {
  const dispatch = useDispatch()
  const authType = useSelector((state) => state.User.authType)
  const cart = useSelector((state) => state.Cart)
  const setting = useSelector((state) => state.Setting.setting)
  const city = useSelector((state) => state.City.city)

  const [loading, setLoading] = useState(false)

  const handleChangeUserName = (e) => {
    setUserName(e.target.value)
  }
  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleChangePhoneNumber = (e) => {
    setPhoneNumberWithoutCountryCode(e.target.value)
  }

  const handleUserRegister = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      if (authType == "phone" && userName == null) {
        toast.error(t("username_required"))
        return
      }
      const result = await api.registerUser({ name: userName, email: email, mobile: phoneNumberWithoutCountryCode, country_code: countryCode, type: authType })
      if (result?.status == 1) {
        const tokenSet = await dispatch(setTokenThunk(result?.data?.access_token))
        await getCurrentUser()
        dispatch(setAuthType({ data: authType }))
        // if (result?.data?.user?.status == 1) {
        dispatch(setIsGuest({ data: false }));
        // }
        await handleFetchSetting();
        if (cart?.isGuest === true && cart?.guestCart?.length !== 0 && result?.data?.user?.status == 1) {
          await addToBulkCart(result?.data.access_token);
        }
        await fetchCart();
        setLoading(false)
        setShowNewUser(false)
        setIsOTP(false)
      } else {
        toast.error(t(result?.message))
        setLoading(false)
      }
    } catch (error) {
      console.log("error", error)
      setLoading(false)
    }
  }

  const handleFetchSetting = async () => {
    try {
      const res = await api.getSetting();
      const parsedSetting = JSON.parse(atob(res.data))
      dispatch(setSetting({ data: parsedSetting }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await api.getUser()
      dispatch(setCurrentUser({ data: response.user }));
      toast.success(t("login_success"));
    } catch (error) {
      console.log("error", error)
    }
  };

  const addToBulkCart = async () => {
    try {
      const variantIds = cart?.guestCart?.map((p) => p.product_variant_id)
      const quantities = cart?.guestCart?.map((p) => p.qty)
      const response = await api.addToBulkCart({ variant_ids: variantIds.join(","), quantities: quantities.join(",") })
      if (response.status == 1) {
        dispatch(setGuestCartTotal({ data: 0 }))
        dispatch(addtoGuestCart({ data: [] }))
        dispatch(setCartSubTotal({ data: response.sub_total }))
      } else {
        console.log("Error while adding bulk products")
      }
    } catch (error) {
      console.log("Error", error)
    }
  }

  const fetchCart = async () => {
    const latitude = city?.latitude || setting?.default_city?.latitude
    const longitude = city?.longitude || setting?.default_city?.longitude
    try {
      const response = await api.getCart({ latitude: latitude, longitude: longitude })
      if (response.status === 1) {
        dispatch(setCart({ data: response.data }))
        const productsData = getProductData(response.data)
        dispatch(setCartProducts({ data: productsData }));
        dispatch(setCartSubTotal({ data: response?.data?.sub_total }))
      } else {
        dispatch(setCart({ data: null }));
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const getProductData = (cartData) => {
    const cartProducts = cartData?.cart?.map((product) => {
      return {
        product_id: product?.product_id,
        product_variant_id: product?.product_variant_id,
        qty: product?.qty
      }
    })
    return cartProducts;
  }

  return (
    <Dialog open={showNewUser}  >
      <DialogContent className="">
        <DialogHeader className="flex flex-row justify-between items-center">
          <div className="">
            <h1 className='text-3xl font-bold'>{t("register")}</h1>
          </div>
          <div>
            <IoIosCloseCircle size={32} onClick={() => setShowNewUser(false)} />
          </div>
        </DialogHeader>
        <div>
          <p className='text-xs text-center mb-2'>{t("update_your_profile_note")}</p>
          <div className='flex flex-col gap-2' >
            <div className='flex flex-col gap-1'>
              <span className='font-bold text-base'>{t("name")}</span>
              <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm disabled:text-gray-500' placeholder={t("name")} value={userName} disabled={(authType == "email" || authType == "google") ? true : false} onChange={handleChangeUserName} required />
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-bold text-base'>{t("email")}</span>
              <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm disabled:text-gray-500' placeholder={t("email")} value={email} disabled={(authType == "email" || authType == "google") ? true : false}
                onChange={handleChangeEmail} />
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-bold text-base'>{t("mobileNumber")}</span>
              <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm disabled:text-gray-400' placeholder={t("mobileNumber")} value={phoneNumberWithoutCountryCode} disabled={(authType == "phone") ? true : false} onChange={handleChangePhoneNumber} />
            </div>
            <button className="bg-[#29363F] py-2 my-2 px-4 cursor-pointer text-white text-center rounded-sm text-xl font-normal" onClick={handleUserRegister}>{loading ? t("loading") : t("register")}</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewUserModal;