import { t } from '@/utils/translation'
import React from 'react'

const OrderAdressCard = ({ orderDetail }) => {
    return (
        <div>
            <div className="  p-4 ">
                <div className='flex justify-between items-center pb-2'>
                    <h2 className="text-base  font-bold mb-2 flex">{t("deliver_to")}: {orderDetail?.user_name}</h2>
                    <div className="flex items-center justify-end ">
                        {/* <div className="flex  gap-1 px-3 py-1 cardBorder rounded-sm ">
                            <span className="text-sm">Home</span>
                        </div> */}
                    </div>
                </div>
                <p className="pb-2 text-base font-normal">
                    {orderDetail?.order_address}
                </p>
                <p className="pb-2 text-base font-medium">{t("phone")} : {orderDetail?.order_mobile}</p>

            </div>
        </div>
    )
}

export default OrderAdressCard