import { t } from '@/utils/translation'
import Image from 'next/image'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as api from '@/api/apiRoutes'
import { setCartPromo } from '@/redux/slices/cartSlice'

const CouponCodeCard = ({ coupon, setShowCouponCode }) => {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.Cart)

    const handleApplyCoupon = async () => {
        try {
            const response = await api.setPromoCode({ promoCodeName: coupon?.promo_code, amount: cart?.cartSubTotal })
            if (response.status == 1) {
                dispatch(setCartPromo({ data: response.data }))
                setShowCouponCode(false)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <div className=''>
            <div className='w-full p-2 cardBorder  my-2 rounded-sm'>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16  flex-shrink-0" >
                        <Image src={coupon?.image_url} alt='Promo image' height={0} width={0} className='h-full w-full object-cover' />
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center justify-between ">
                            <div className='w-1/2'>
                                <h3 className="font-semibold text-base">{coupon?.promo_code}</h3>
                                <p className="text-sm overflow-hidden">{coupon?.promo_code_message}</p>
                            </div>
                            <button disabled={coupon?.is_applicable == 0} className="px-4 py-1 border cardBorder rounded-md text-sm hover:primaryBackColor transition-colors hover:text-white disabled:text-gray-400 disabled:bg-transparent" onClick={handleApplyCoupon}>
                                {t("apply")}
                            </button>
                        </div>
                    </div>
                </div>
                <p className="text-sm mt-3 p-1 border-t-2">{`${t("you_will_save")} ${cart?.cartSubTotal - coupon?.discounted_amount?.toFixed(2)}  ${t("on_this_coupon")}`}</p>
            </div>

        </div>
    )
}

export default CouponCodeCard