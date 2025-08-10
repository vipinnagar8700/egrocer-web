import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import * as api from "@/api/apiRoutes"
import { t } from '@/utils/translation';
import { formatCustomDate } from '@/lib/utils';
import OrderAdressCard from './OrderAdressCard';
import { useSelector } from 'react-redux';
import OrderItems from './OrderItems';
import OrderStepper from './OrderStatusStepper';
import FinalCheckoutSummary from './FinalCheckoutSummary';
import BreadCrumb from '../breadcrumb/BreadCrumb';
import { MdOutlineFileDownload } from 'react-icons/md';
import ProductDetail from '../productdetail/ProductDetail';
import Loader from '../loader/Loader';


const OrderDetail = () => {
    const router = useRouter();
    const { orderid } = router.query;
    const address = useSelector((state) => state.Addresses)
    const [orderDetail, setOrderDetail] = useState([])
    const [deliveryAddress, setDeliveryAddress] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (orderid) {
            handleFetchOrderDetail()
        }
    }, [orderid])


    const handleFetchOrderDetail = async () => {
        setLoading(true)
        try {
            const response = await api.getOrders({ orderId: orderid })
            if (response?.status == 1) {
                setOrderDetail(response.data[0])
                setLoading(false)
            } else {
                console.log("Error", response)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error", error)
            setLoading(false)
        }
    }

    const handleDownloadInvoice = async () => {
        try {
            const response = await api.downloadInvoice({ orderId: orderid })
            var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            var fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'Invoice-No:' + orderid + '.pdf');
            document.body.appendChild(fileLink);
            fileLink.click();
        } catch (error) {
            if (error.request.statusText) {
                toast.error(error.request.statusText);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    }


    return (
        <section>
            <BreadCrumb />
            <div className='container my-12 px-2'>
                {loading ? <><Loader /></> : <div className='flex flex-col gap-12'>
                    <div className='flex flex-col md:flex-row justify-between backgroundColor p-4 rounded-md'>
                        <div>
                            <span className='font-normal text-base'>{t("orderNumber")}:</span>
                            <h1 className='text-2xl font-bold'>#{orderDetail?.id}</h1>
                        </div>
                        <div className='flex flex-col gap-2 items-start md:flex-row md:items-center'>
                            <div className='flex flex-col items-start md:items-end'>
                                <span className='font-normal text-sm '>{t("orderDate")}</span>
                                <p className='text-base font-medium'>{formatCustomDate(orderDetail?.date)}</p>
                            </div>
                            {
                              Number((orderDetail?.active_status) < 6 && (parseInt(orderDetail?.otp) !== 0 &&orderDetail?.otp !== null) )  ?  <div className='flex flex-col items-start md:items-end'>
                                <span className='font-normal text-sm '>{t("otp")}</span>
                                <p className='text-base font-medium'>{orderDetail?.otp}</p>
                            </div> :<></>  
                            }
                          
                            {Number(orderDetail?.active_status) === 6 ? <div className='md:border-l-2'>
                                <button className='flex items-center gap-2 bg-[#29363F] p-2 md:ml-2 rounded-md text-white' onClick={handleDownloadInvoice}><MdOutlineFileDownload size={22} /> {t("GetInvoice")}</button>
                            </div> : null}

                        </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 px-2 md:px-0 md:gap-8">

                        <div className="col-span-12 md:col-span-8 flex flex-col gap-8">
                            <div className="flex flex-col gap-3">
                                <h1 className="font-bold text-2xl">{t("shippingAdress")}</h1>
                                <div className="cardBorder rounded-sm">
                                    <OrderAdressCard orderDetail={orderDetail} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h1 className="font-bold text-2xl">{t("items")}</h1>
                                <OrderItems
                                    products={orderDetail?.items}
                                    handleFetchOrderDetail={handleFetchOrderDetail}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-span-12 md:col-span-4 flex flex-col gap-6 mt-4 md:mt-0">
                            {orderDetail?.status?.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    <h1 className="font-bold text-2xl">{t("track_order")}</h1>
                                    <OrderStepper orderDetail={orderDetail} />
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <h1 className="font-bold text-2xl">{t("billing_details")}</h1>
                                <FinalCheckoutSummary orderDetail={orderDetail} />
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </section>
    )
}

export default OrderDetail