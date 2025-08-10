import { t } from '@/utils/translation'
import React from 'react'
import { useSelector } from 'react-redux'

const FinalCheckoutSummary = ({ orderDetail }) => {

    const setting = useSelector(state => state.Setting.setting)

    return (
        <div className="max-w-md p-6 rounded-md border cartBorder ">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg  font-medium">{t("payment_method")}</h2>
                <span className="font-semibold">{orderDetail?.payment_method}</span>
            </div>

            <div className="space-y-4">
                <div className="space-y-4">
                    {orderDetail?.transaction_id != 0 && <div className="flex justify-between items-center">
                        <span className="">{t("transaction_id")}</span>
                        <span className='font-semibold'>{orderDetail?.transaction_id}</span>
                    </div>}

                    <div className="flex justify-between items-center">
                        <span className="">{t("sub_total")}</span>
                        <span className='font-semibold'>{setting?.currency}{orderDetail?.total}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="">{t("delivery_charge")}</span>
                        <span className='font-semibold'>{setting?.currency}{orderDetail?.delivery_charge}</span>
                    </div>
                    {orderDetail?.promo_discount != 0 && <div className="flex justify-between items-center">
                        <span className="">{t("promoDiscount")}</span>
                        <span className='font-semibold'>- {setting?.currency}{orderDetail?.promo_discount?.toFixed(2)}</span>
                    </div>}

                    <div className="pt-4 border-t ">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-base">{t("total")} {t("amount")}</span>
                            <span className="text-green-600 font-bold">{setting?.currency}{orderDetail?.final_total}</span>
                        </div>
                    </div>
                </div >
            </div >
        </div>
    )
}

export default FinalCheckoutSummary