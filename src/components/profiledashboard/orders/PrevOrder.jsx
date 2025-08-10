import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import PrevOrderCard from './PrevOrderCard'
import * as api from "@/api/apiRoutes"
import Loader from '@/components/loader/Loader'
import CardSkeleton from '@/components/skeleton/CardSkeleton'
import OrderNotFoundImage from "@/assets/not_found_images/No_Orders.svg"
import Image from 'next/image'

const PrevOrder = () => {

    const [loading, setLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const [prevOrders, setPrevOrders] = useState([])
    const [totalOrders, setTotalOrders] = useState(null)
    const [loadingMore, setLoadingMore] = useState(false)
    useEffect(() => {
        handleFetchPrevOrders(false, 0)
    }, [])

    const ordersPerPage = 10;

    const handleFetchPrevOrders = async (isLoadMore = false, newOffset) => {
        if (isLoadMore) {
            setLoadingMore(true)
        } else {
            setLoading(true)
        }
        try {
            const response = await api.getOrders({ limit: ordersPerPage, offset: newOffset, type: 0 })
            if (response?.status == 1) {
                setPrevOrders((ord) => [...ord, ...response?.data])
                setTotalOrders(response.total)
                setLoading(false)
                setLoadingMore(false)
            } else {
                setLoading(false)
                setPrevOrders([])
                setLoadingMore(false)
                console.log("Error", response)
            }
        } catch (error) {
            setLoading(false)
            setLoadingMore(false)
            console.log("Error", error)
        }
    }

    const handleFetchMore = async () => {
        const newOffset = offset + ordersPerPage
        setOffset(newOffset)
        handleFetchPrevOrders(true, newOffset)
    }


    return (
        <div className='w-full cardBorder rounded-sm '>
            <div className='backgroundColor flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("order_history")}</h2>
            </div>
            <div>
                {loading ? Array.from({ length: 6 })?.map((_, index) => {
                    return (
                        <CardSkeleton height={200} padding="p-4" key={index} />
                    )
                }) : prevOrders?.length == 0 ? <div className='h-full w-full flex items-center justify-center flex-col gap-2 p-3'>
                    <Image src={OrderNotFoundImage} alt='Order Not found' height={0} width={0} className='h-1/2 w-1/2' />
                    <h2 className='text-2xl font-bold'>{t("no_order")}</h2>
                </div> : prevOrders?.map((order) => {
                    return (
                        <PrevOrderCard order={order} key={order?.id} />
                    )
                })}
                {
                    loadingMore ?
                        Array?.from({ length: 6 })?.map((_, index) => {
                            return (
                                <CardSkeleton height={200} padding="p-4" key={index} />
                            )
                        })
                        : <></>
                }
            </div>
            {totalOrders > prevOrders?.length && <div className='flex justify-center p-4'>
                <button className='bg-[#29363f] py-2 px-4 text-white rounded-sm text-lg font-normal' onClick={handleFetchMore}>{t("load_more")}</button>
            </div>}
        </div>
    )
}

export default PrevOrder