import React, { useEffect, useState, useRef, useCallback } from 'react'
import * as api from "@/api/apiRoutes"
import { useSelector } from 'react-redux'
import VerticleProductCard from '../productcards/VerticleProductCard'
import { t } from '@/utils/translation'
import CardSkeleton from '../skeleton/CardSkeleton'

const HomeAllProducts = () => {
    const city = useSelector((state) => state.City.city)
    const setting = useSelector(state => state.Setting.setting)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalProducts, setTotalProducts] = useState(null)
    const [offset, setOffset] = useState(0)
    const [loadmoreLoading, setLoadmoreLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    // Reference to our observer
    const observer = useRef()
    // Reference to the last product element
    const lastProductElementRef = useRef()

    const totalProductsPerPage = 12;

    useEffect(() => {
        handleFetchProduct()
    }, [city])

    useEffect(() => {
        setAllProducts([])
        setOffset(0)
        setHasMore(true)
    }, [city])

   
    const lastProductRef = useCallback(node => {
        if (loadmoreLoading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                handleFetchProduct(true);
            }
        });

        if (node) observer.current.observe(node);
    }, [loadmoreLoading, hasMore]);

    const handleFetchProduct = async (isFetchMore) => {
        let localOffset;
        if (isFetchMore) {
            setLoadmoreLoading(true)
            localOffset = offset + totalProductsPerPage
            setOffset(localOffset)
        } else {
            setOffset(0)
            localOffset = 0
            setLoading(true)
        }

        const latitude = city?.latitude || setting?.default_city?.latitude
        const longitude = city?.longitude || setting?.default_city?.longitude

        try {
            if (latitude && longitude) {
                const response = await api.getProductByFilter({
                    latitude: latitude,
                    longitude: longitude,
                    filters: { limit: totalProductsPerPage, offset: localOffset }
                });

                if (response.status == 1) {
                    setTotalProducts(response.total)

                    if (isFetchMore) {
                        setAllProducts((products) => [...products, ...response.data])
                    } else {
                        setAllProducts(response.data)
                    }

                    // Check if we've loaded all available products
                    setHasMore(localOffset + response.data.length < response.total)
                    setLoading(false)
                    setLoadmoreLoading(false)
                } else {
                    setHasMore(false)
                    setLoading(false)
                    setLoadmoreLoading(false)
                    return
                }
            }
        } catch (error) {
            setLoading(false)
            setLoadmoreLoading(false)
            setHasMore(false)
            console.log("Error", error)
        }
    }

    const placeholderItems = Array.from({ length: 12 }).map((_, index) => index);

    return (
        allProducts?.length > 0 ?
            <section>
                <div className='py-3 md:py-6 container px-2'>
                    <div className='flex flex-col gap-3'>
                        <h2 className='textColor text-xl sm:text-3xl font-extrabold leading-[29px] m-0'>{t("allProducts")}</h2>
                        <div className='grid grid-cols-12 gap-2'>
                            {loading ?
                                placeholderItems.map(index => {
                                    return (
                                        <div className='col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2' key={index}>
                                            <CardSkeleton height={300} />
                                        </div>
                                    )
                                })
                                :
                                allProducts?.map((product, index) => {
                                    if (allProducts.length === index + 1) {
                                        // Apply ref to the last element
                                        return (
                                            <div
                                                ref={lastProductRef}
                                                key={product?.id}
                                                className='col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-2'
                                            >
                                                <VerticleProductCard product={product} />
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div
                                                key={product?.id}
                                                className='col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-2'
                                            >
                                                <VerticleProductCard product={product} />
                                            </div>
                                        )
                                    }
                                })
                            }

                            {/* Loading indicator at the bottom */}
                            {loadmoreLoading ? placeholderItems.map(index => {
                                return (
                                    <div className='col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2' key={index}>
                                        <CardSkeleton height={300} />
                                    </div>

                                )
                            }) : <></>}
                        </div>
                    </div>
                </div>
            </section> : <></>
    )
}

export default HomeAllProducts