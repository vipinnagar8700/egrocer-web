import React, { useEffect, useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import * as api from "@/api/apiRoutes"
import BrandCard from './BrandCard';
import { setFilterBrands } from '@/redux/slices/productFilterSlice';
import CardSkeleton from '../skeleton/CardSkeleton';
const Brands = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const brandsPerPage = 12;
    const city = useSelector(state => state.City)

    const [brands, setBrands] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchBrands()
    }, [])


    console.log("city", city)
    const fetchBrands = async () => {
        setIsLoading(true)
        try {
            const response = await api.getBrands({ limit: brandsPerPage, offset: 0, latitude: city?.city?.latitude, longitude: city?.city?.longitude });
            // console.log(response.data);
            setBrands(response.data);
        } catch (error) {
            console.log("Error", error);
        }
        setIsLoading(false)
    }

    const handleBrandClick = (brand) => {
        dispatch(setFilterBrands({ data: [brand?.id] }))
        router.push('/products')
    }



    return (
        <section>
            <BreadCrumb />
            <div className='container px-3 '>
                <div className='grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2  h-auto my-5 px-2'>
                    {
                        brands && brands?.map((brand) => {
                            return (
                                <div key={brand?.id} className='col-span-1' onClick={() => handleBrandClick(brand)}>
                                    <BrandCard brand={brand} />
                                </div>

                            )
                        })
                    }
                    {isLoading && Array.from({ length: brandsPerPage }).map((_, index) => (
                        <div key={index} className='col-span-1'>
                            <CardSkeleton height={150} />
                        </div>
                    ))
                    }
                </div>

            </div>
        </section>
    )
}

export default Brands
