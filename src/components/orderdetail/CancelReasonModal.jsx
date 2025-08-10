import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IoIosCloseCircle } from 'react-icons/io';
import { t } from '@/utils/translation';
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';

const CancelReasonModal = ({ showCancelMoodal, setShowCancelModal, selectedProduct, handleFetchOrderDetail }) => {

    const [loading, setLoading] = useState(false);
    const [cancelReason, setCancelReason] = useState("")

    const handleHideCancelModal = () => {
        setCancelReason("");
        setShowCancelModal(false)
    }

    const handleCancelOrder = async () => {
        if (!cancelReason) {
            toast.error(t("reason_is_required"))
            return
        }
        setLoading(true)
        try {
            const response = await api.changeOrderStatus({ orderId: selectedProduct?.order_id, orderItemId: selectedProduct?.id, status: 7, reason: cancelReason })
            if (response?.status == 1) {
                setCancelReason("");
                setLoading(false);
                toast.success(response.message);
                await handleFetchOrderDetail()
                setShowCancelModal(false)
            } else {
                toast.error(response.message)
                setLoading(false);
            }
        } catch (error) {
            console.log("Error", error)
            setLoading(false)
        }
    }

    return (
        <Dialog open={showCancelMoodal}>
            <DialogContent>
                <DialogHeader className="font-bold text-2xl text-start flex flex-row justify-between">
                    {t("cancel")}
                    <div>
                        <IoIosCloseCircle size={32} onClick={handleHideCancelModal} />
                    </div>
                </DialogHeader>
                <div className='flex flex-col gap-1'>
                    <label className='font-medium text-base'>{t("reason")}<span className='text-red-500'>*</span></label>
                    <textarea name="" id="" className='w-full outline-none cardBorder p-2 rounded-sm' placeholder={t("write_cancel_reason")} onChange={(e) => setCancelReason(e.target.value)} value={cancelReason}></textarea>
                </div>
                <div className='flex justify-end'>
                    <button onClick={handleCancelOrder} className='py-1 px-3 primaryBackColor text-white rounded-sm font-normal text-xl' >{loading ? t("loading") : t("submit")}</button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CancelReasonModal