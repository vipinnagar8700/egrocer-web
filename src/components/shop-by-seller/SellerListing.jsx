import React, { useEffect, useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import SellerListingCard from './SellerListingCard'
import * as api from '@/api/apiRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterBySeller } from '@/redux/slices/productFilterSlice'
import { useRouter } from 'next/router'
import CardSkeleton from '../skeleton/CardSkeleton'
const SellerListing = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const city = useSelector(state => state.City.city);

    const [sellers, setSellers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleFetchSellers = async () => {
        setIsLoading(true)
        try {
            const response = await api.getSellers({
                latitude: city?.latitude,
                longitude: city?.longitude
            })
            setSellers(response?.data);
        } catch (error) {
            console.log("Error:", error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        handleFetchSellers()
    }, [])

    const handleSellerClick = (seller) => {
        dispatch(setFilterBySeller({ data: seller?.id }));
        router.push(`/products`)
    }

    return (
        <section>
            <BreadCrumb />
            <div className='container'>
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto my-5 px-2`}>
                    {
                        sellers && sellers?.map((seller) => {
                            return (
                                <div key={seller?.id} className={"col-span-1"} onClick={() => handleSellerClick(seller)}>
                                    <SellerListingCard seller={seller} />
                                </div>

                            )
                        })
                    }
                    {isLoading && Array.from({length:6 }).map((_,idx)=> (
                        <div key={idx}>
                            <CardSkeleton height={150} /> 
                        </div>
                    ))
                    }
                </div>

            </div>
        </section>
    )
}

export default SellerListing
