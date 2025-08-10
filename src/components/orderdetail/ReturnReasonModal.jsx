import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IoIosCloseCircle } from 'react-icons/io';
import { t } from '@/utils/translation';
import { toast } from 'react-toastify';
import * as api from "@/api/apiRoutes"

const ReturnReasonModal = ({ showReturnModal, setShowReturnModal, selectedProduct, handleFetchOrderDetail }) => {


    const [returnReason, setReturnReason] = useState("")
    const [loading, setLoading] = useState("")

    const handleHideReturnModal = () => {
        setShowReturnModal(false)
        setReturnReason("")
    }

    const handleProductReturn = async () => {
        if (!returnReason) {
            toast.error(t("reason_is_required"))
            return
        }
        setLoading(true)
        try {
            const response = await api.changeOrderStatus({ orderId: selectedProduct?.order_id, orderItemId: selectedProduct?.id, status: 8, reason: returnReason })
            if (response?.status == 1) {
                setReturnReason("");
                setLoading(false);
                toast.success(response.message);
                await handleFetchOrderDetail()
                setShowReturnModal(false)
            } else {
                toast.error(response.message)
                setLoading(false);
            }
        } catch (error) {
            console.log("Error", error)
        }

    }



    return (
        <Dialog open={showReturnModal}>
            <DialogContent>
                <DialogHeader className="font-bold text-2xl text-start flex flex-row justify-between">
                    {t("return_reason")}
                    <div>
                        <IoIosCloseCircle size={32} onClick={handleHideReturnModal} />
                    </div>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                        <label className='font-medium text-base'>{t("reason")}<span className='text-red-500'>*</span></label>
                        <textarea name="" id="" className='w-full outline-none cardBorder p-2 rounded-sm' placeholder={t("write_return_reason")} onChange={(e) => setReturnReason(e.target.value)} value={returnReason}></textarea>
                    </div>
                    <div className='flex justify-end'>
                        <button onClick={handleProductReturn} className='py-1 px-3 primaryBackColor text-white rounded-sm font-normal text-xl'>{t("submit")}</button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ReturnReasonModal