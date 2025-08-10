import { setFilterSearch, setProductBySearch } from '@/redux/slices/productFilterSlice'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder'

const SearchProductCard = ({ product }) => {
    const dispatch = useDispatch()
    const setting = useSelector(state => state.Setting?.setting)

    const handleSearchProductClick = () => {
        dispatch(setProductBySearch({ data: [] }))
        dispatch(setFilterSearch({ data: "" }))
    }
    return (
        <Link href={`/product/${product?.slug}`} onClick={() => handleSearchProductClick()} className="w-full">
            <div className="flex items-center gap-3 px-3 py-1 border-b-2">
                <div className="w-8 h-8">
                    <ImageWithPlaceholder src={product?.image_url} className="w-full h-full object-cover rounded-sm" alt="product image" />
                </div>
                <div className="flex flex-col">
                    <div className="text-xl font-semibold max-w-[150px] truncate">{product?.name}</div>
                    <div className="text-base font-normal text-start">
                        {
                            product?.discounted_price ?
                                <div>
                                    {setting?.currency}{product?.discounted_price} <span className='line-through'>{setting?.currency}{product?.price} </span>
                                </div> :
                                <div>{setting?.currency}{product?.price}</div>
                        }
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SearchProductCard
