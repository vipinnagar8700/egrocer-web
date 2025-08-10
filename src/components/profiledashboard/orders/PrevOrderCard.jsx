import { t } from "@/utils/translation"
import { formatCustomDate } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'
import ImageWithPlaceholder from '@/components/image-with-placeholder/ImageWithPlaceholder'
import * as api from "@/api/apiRoutes"
import ReoderConfirmModal from "./ReoderConfirmModal"
import { useState } from "react"

const PrevOrderCard = ({ order }) => {

    const setting = useSelector((state) => state.Setting)
    const deliveryDate = order?.status?.find((ord) => ord[0] == "6")
    const orderFirstItem = order?.items[0]

    const [showReoderModal, setShowReorderModal] = useState(false)

    const handleReoder = () => {
        setShowReorderModal(true)
    }

    return (
        <div className='w-full   '>
            <div className='py-3 px-4'>
                <div className='w-full  cardBorder rounded-md'>
                    <div className='md:grid md:grid-cols-12 p-4 border-b-2 flex  flex-col gap-4 md:gap-0'>
                        <div className='col-span-3  '>
                            <p className='font-normal text-sm'>{t("order")}</p>
                            <p className='font-bold text-sm'>{order?.id}</p>
                        </div>
                        <div className='col-span-3'>
                            <p className='font-normal text-sm'>{t("orderDate")}</p>
                            <p className='font-bold text-sm'>{formatCustomDate(order?.date)}</p>
                        </div>
                        <div className='col-span-6 flex flex-col items-start md:items-end'>
                            <p className='font-normal text-sm'>{t("orderStatus")}</p>
                            <span className='font-bold text-base'>{formatCustomDate(deliveryDate?.[1])}</span>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div className='flex justify-between gap-2 md:gap-0 mb-4 w-full'>
                            <div className='flex items-start gap-2 w-full'>
                                <div className='h-[64px] w-[64px] relative aspect-square shrink-0'>
                                    {orderFirstItem?.image_url && <ImageWithPlaceholder src={orderFirstItem?.image_url} alt='demo image' fill className='h-full w-full rounded-sm' />}
                                </div>
                                <div className='flex flex-col md:flex-row justify-between w-full'>
                                    <div className='flex-grow'>
                                        <p className='font-bold text-base text-ellipsis overflow-hidden w-32'>{orderFirstItem?.name}</p>
                                        <p className='text-sm font-normal'>{orderFirstItem?.variant_name}</p>
                                    </div>

                                    <div className='md:ml-auto md:mt-0'>
                                        {orderFirstItem?.discounted_price != 0 ?
                                            <div className="flex gap-1">
                                                <p className='text-base font-bold'>{setting?.setting?.currency}{orderFirstItem?.discounted_price}</p>
                                                <p className='text-base font-normal line-through'>{setting?.setting?.currency}{orderFirstItem?.price}</p>
                                            </div>
                                            :
                                            <p className='text-base font-bold'>{setting?.setting?.currency}{orderFirstItem?.price}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {order?.items?.length > 1 && <button className='rounded-full py-2 px-3 bg-[#12141814] font-medium text-base'>{order?.items?.length - 1} {t("moteItems")}</button>}
                    </div>
                    <div className='backgroundColor'>
                        <div className='flex justify-between p-4 flex-col md:flex-row'>
                            <div className='flex flex-col'>
                                <span>{`${t("total")} ${t("Credit")}`} </span>
                                <span className='font-bold text-lg'>{setting?.setting?.currency}{order?.final_total}</span>
                            </div>
                            <div className="flex gap-2 items-center justify-start md:justify-center">
                                <div className="">
                                    <button className="cardBorder py-2 px-3 rounded-sm font-medium text-base hover:primaryBackColor hover:text-white" onClick={handleReoder}>{t("reorder")}</button>
                                </div>
                                <div className='flex items-center'>
                                    <Link href={`/order-detail/${order?.id}`} className=' flex items-center gap-2 py-2 px-3  cardBorder rounded-sm font-medium text-base hover:primaryBackColor hover:text-white'>{t("view_details")} <FaArrowRight /></Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <ReoderConfirmModal showReoderModal={showReoderModal} setShowReorderModal={setShowReorderModal} order={order} />
        </div>
    )
}

export default PrevOrderCard