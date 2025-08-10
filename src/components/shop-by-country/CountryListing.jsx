import React, { useEffect, useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import * as api from '@/api/apiRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterByCountry } from '@/redux/slices/productFilterSlice'
import { useRouter } from 'next/router'
import Country from './Country'
import CardSkeleton from '../skeleton/CardSkeleton'
const CountryListing = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const city = useSelector(state => state.City.city);

    const countriesPerPage = 12;
    const [countries, setCountries] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleFetchCountries = async () => {
        setIsLoading(true)
        try {
            const response = await api.getCountries({
                limit: countriesPerPage,
                offset: 0,
                latitude: city?.latitude,
                longitude: city?.longitude
            })
            console.log(response?.data);
            setCountries(response?.data);
        } catch (error) {
            console.log("Error:", error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        handleFetchCountries()
    }, [])

    const handleCountryClick = (country) => {
        dispatch(setFilterByCountry({ data: country?.id }));
        router.push(`/products`)
    }

    return (
        <section>
            <BreadCrumb />
            <div className='container'>
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto my-5 p-2`}>
                    {
                        countries && countries?.map((country) => {
                            return (
                                <div key={country?.id} className={"col-span-1"} onClick={() => handleCountryClick(country)}>
                                    <Country country={country} />
                                </div>

                            )
                        })
                    }
                    {isLoading && Array.from({ length: countriesPerPage }).map((_, index) => (
                        <div key={index}>
                            <CardSkeleton height={150} />
                        </div>
                    ))
                    }
                </div>

            </div>
        </section>
    )
}

export default CountryListing
