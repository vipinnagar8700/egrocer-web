'use client'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { t } from "@/utils/translation"
import { setFilterCategory, setFilterSearch } from '@/redux/slices/productFilterSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import SearchProductCard from '../cards/SearchProductCard'
import { FaSearch } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { isRtl } from '@/lib/utils'
import * as api from "@/api/apiRoutes"

const SearchComponent = ({ isMobile, mobileSearch, setMobileSearch, handleSearchCategory, handleSearch, isSuggLoading }) => {
    const rtl = isRtl();
    const dispatch = useDispatch()
    const router = useRouter()
    const [categories, setCategories] = useState([])
    const filter = useSelector(state => state.ProductFilter)

    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchCategories = async () => {

        try {
            const categories = await api.getCategories()
            setCategories(categories.data)
        } catch (error) {
            console.log("erorr", error)
        }
    }

    const handleSearchItemClick = async () => {
        dispatch(setFilterCategory({ data: filter?.searchedCategory }))
        router.push("/products");
    }

    return (
        <>
            <div className={`flex w-full  h-full flex-col px-4 py-2 items-center md:flex-row md:headerSearch  md:rounded-[5px] md:ml-[10px]  md:p-0`}>
                <Select dir={rtl ? "rtl" : "ltr"} value={filter?.searchedCategory} onValueChange={(value) => handleSearchCategory(value)}>
                    <SelectTrigger className={`w-full h-full buttonBackground cardBorder  focus:ring-0 rounded-t-sm rounded-b-none md:rounded-l-sm md:rounded-r-none md:w-[152px] md:border-none md:min-w-[152px]`}>
                        <SelectValue placeholder={t("all_categories")} />
                    </SelectTrigger>
                    <SelectContent className="w-full h-full z-50 md:w-[152px]">
                        <SelectItem value="all categories">{t("all_categories")}</SelectItem>
                        {categories?.map((category) => (
                            <SelectItem key={category?.id} value={`${category?.id}`}>{category?.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className='w-full flex flex-col flex-grow md:relative md:flex-row md:h-full'>
                    <input
                        type="text"
                        placeholder={t("iAmLookingFor")}
                        className="w-full flex-grow px-4 py-2 text-sm focus:outline-none h-full shadow cardBorder order-1"
                        value={filter?.search ? filter?.search : ""}
                        onChange={(e) => handleSearch(e)}
                    />
                    <button
                        className="justify-center gap-1 px-4 py-2   h-full flex items-center rounded-r-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#29363f] text-white text-xl shadow
                        md:p-[20px]  text-whiterounded order-2"
                        onClick={() => {
                            handleSearchItemClick()

                        }}
                    >
                        <FaSearch />
                        {t("search")}
                    </button>
                    <div className="md:w-[calc(100%-126px)] mt-1 flex flex-wrap flex-col col-span-4  bodyBackgroundColor gap-1 order-2 md:order-2 md:absolute 
                      md:z-10 md:bodyBackgroundColor md:top-12 md:left-0 shadow-[0_0_16px_gray]
                    ">
                        {router?.pathname !== "/products" && filter?.search_product?.map((product, idx) => (
                            <SearchProductCard key={idx} product={product} />
                        ))}
                        {router?.pathname !== "/products" && !isSuggLoading && filter?.search && filter?.search_product?.length === 0 &&
                            <div className='ps-2 py-2 text-bold text-xl font-medium text-center md:text-start'>
                                {t("no_product_found")}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchComponent
