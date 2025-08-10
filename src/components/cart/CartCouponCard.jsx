import { t } from '@/utils/translation'
import React, { useState } from 'react'
import { MdOutlineCelebration } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux'
import { clearCartPromo } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const CartCouponCard = ({ setShowCouponCode }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const cart = useSelector(state => state.Cart);
    const user = useSelector(state => state.User)
    const setting = useSelector(state => state.Setting?.setting)




    const handleClearPromo = () => {
        dispatch(clearCartPromo())
    }

    const handleToCheckOut = () => {
        if (user?.jwtToken) {
            router.push('/checkout')
        } else {
            toast.error(t("login_to_access_checkout_page"))
        }
    }

    const handleToProducts = () => {
        router.push('/products')
    }

    const cartTotlaWithDiscount = (cart?.cartSubTotal?.toFixed(2) - cart?.promo_code?.discount?.toFixed(2))

    return (
        <div className="max-w-sm p-4  border  rounded-md cardBorder">
            {user?.jwtToken && <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium ">{t("have_coupon")}</h3>
                <button className="px-3 py-1 text-sm font-medium border rounded hover:primaryBackColor hover:text-white" onClick={() => setShowCouponCode(true)}>
                    {t("view_coupon")}
                </button>
            </div>}


            {cart?.promo_code && (
                <div className="mb-4">
                    <div className='flex justify-between items-center mb-4'>
                        <p className="text-sm ">{t("promoCodeSuccess")}</p>
                        <button onClick={handleClearPromo} className=" text-xs font-medium text-red-500 hover:primaryBackColor hover:text-white p-2 rounded-sm">
                            {t("delete")}
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-2 mt-2 bg-[#55AE7B0A] primaryBorder  rounded-md">
                        <div className="flex items-center space-x-2">
                            <span className="primaryColor"><MdOutlineCelebration className="primaryColor" size={20} /></span>
                            <p className="text-base font-bold primaryColor">{cart?.promo_code?.promo_code}</p>
                        </div>
                        <p className="text-base font-bold primaryColor">{setting?.currency}{cart?.promo_code?.discount?.toFixed(2)}</p>
                    </div>
                </div>
            )}


            {/* Pricing Details */}
            <hr className="mb-4 border-gray-300" />
            <div className="mb-4  ">
                <div className="flex justify-between  mt-3 font-bold text-base">
                    <p className=''>{t("sub_total")}</p>
                    <p>{setting?.currency}{cart?.cartSubTotal?.toFixed(2)}</p>
                </div>
                {
                    cart?.promo_code && (
                        <div className="flex justify-between  mt-3 font-bold text-base">
                            <p className=''>{t("promoDiscount")}</p>
                            <p className=''>{setting?.currency}{cart?.promo_code?.discount?.toFixed(2)}</p>
                        </div>
                    )
                }


            </div>

            <hr className="mb-4 border-gray-300" />

            <div className="flex flex-wrap justify-between gap-2 items-center mb-4 backgroundColor p-3 rounded">
                <p className="text-lg font-bold ">{t("total")}</p>
                <p className="text-lg font-bold">{setting?.currency} {cart?.promo_code ? cartTotlaWithDiscount?.toFixed(2) : cart?.cartSubTotal?.toFixed(2)}</p>
            </div>

            <button className="w-full py-2 mb-2 text-sm font-medium text-white primaryBackColor rounded " onClick={handleToCheckOut}>
                {t("proceed_to_checkout")}
            </button>
            <button className="w-full py-2 rounded-sm text-sm font-medium  hover:primaryBackColor hover:text-white" onClick={handleToProducts}>
                {t("continue_shopping")}
            </button>
        </div>
    )
}

export default CartCouponCard