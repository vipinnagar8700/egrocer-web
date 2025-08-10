import React, { useState, useEffect } from 'react'
import * as api from '@/api/apiRoutes'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { IoIosCloseCircle } from 'react-icons/io';
import { t } from '@/utils/translation';
import CouponCodeCard from './CouponCodeCard';
import { useSelector } from 'react-redux';
import NoCouponFound from '@/assets/not_found_images/No_Coupon_Code_Found.svg'
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';


const CouponCodeDrawer = ({ showCouponCode, setShowCouponCode }) => {

    const cart = useSelector(state => state.Cart)
    const language = useSelector(state => state.Language.selectedLanguage)
    const [couponCodes, setCouponCodes] = useState([])


    useEffect(() => {
        if (showCouponCode) {
            handleFetchCouponCodes()
        }
    }, [showCouponCode])

    const handleFetchCouponCodes = async () => {
        try {
            const response = await api.getPromo({ amount: cart?.cartSubTotal })
            setCouponCodes(response.data)
        } catch (error) {
            console.log("Error", error)
        }
    }

    const handleHideCouponCode = () => {
        setShowCouponCode(false)
    }
    return (
        <Sheet open={showCouponCode} >
            <SheetContent className="p-0 w-full sm:w-[900px] overflow-y-auto" side={language?.type == "RTL" ? "left" : "right"}>
                <SheetHeader className="px-0 py-3 border-[1px] flex justify-between text-left">
                    <SheetTitle className="text-2xl p-2 font-bold flex flex-row items-center  justify-between">
                        <p className='text-2xl font-bold'>{t("coupons")}</p>
                        <div>
                            <IoIosCloseCircle size={32} onClick={() => handleHideCouponCode(false)} />
                        </div>
                    </SheetTitle>
                </SheetHeader>
               <div className='mt-4'>
                    {couponCodes?couponCodes?.map((coupon) => {
                        return <div className='m-4' key={coupon?.id}> <CouponCodeCard coupon={coupon} setShowCouponCode={setShowCouponCode} /></div>
                    }):
                    <div className='flex justify-center items-center h-[80vh] flex-col'>
                    <ImageWithPlaceholder src={NoCouponFound} alt={'Image not found'}/>
                    <p className=' text-2xl  font-bold'>{t("no_coupon_code_available")}</p> 
                    </div>}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CouponCodeDrawer